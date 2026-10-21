import 'server-only';

/**
 * ============================================================================
 *  HOW MANY TIMES THIS ADDRESS HAS BEEN WRONG
 * ============================================================================
 *
 * See the note on the `RateLimit` model for why this lives in the database and
 * not in a cookie. In short: a cookie is held by the person being counted, and
 * a lockout the counted person can delete is not a lockout.
 *
 * ── The shape of the API ────────────────────────────────────────────────────
 * Three calls, because there are exactly three moments: before an attempt
 * (is this address locked?), after a wrong one (count it, maybe lock it), and
 * after a right one (forget it). Keeping them together means no route has to
 * remember the order, which is how a route ends up clearing the count before
 * reading it.
 *
 * ── Failure is always the safe direction ────────────────────────────────────
 * Every function here returns "not locked" or "no change" when the database
 * cannot be reached. That looks like the permissive choice until you notice
 * what is being permitted: a *correct* password or recovery answer still has to
 * arrive before anything opens. The counter is a brake, not the lock — and a
 * brake that fails should not become an accelerator. Refusing everyone because
 * one table is briefly unreachable would hand a database blip the ability to
 * lock the owner out of their own site.
 */

/** A generic counter, so login and recovery do not each invent their own. */
export interface LimitState {
  /** May this address attempt right now? */
  allowed: boolean;
  /** Failures counted so far, for a message that can say which attempt this is. */
  failures: number;
}

/**
 * Read the counter without touching it.
 *
 * `scope` is a short name — `login`, `recover` — so two routes counting the same
 * address do not share a tally. Sharing would mean five wrong passwords also
 * locked out password recovery, which turns one mistake into two problems on
 * the exact day the owner can least afford it.
 */
export async function readLimit(scope: string, ip: string): Promise<LimitState> {
  try {
    const { prisma } = await import('@/server/db');
    const row = await prisma.rateLimit.findUnique({ where: { key: `${scope}:${ip}` } });

    if (!row) return { allowed: true, failures: 0 };

    if (row.lockedUntil && row.lockedUntil.getTime() > Date.now()) {
      return { allowed: false, failures: row.failures };
    }

    // The lock has expired. The row is left alone rather than deleted, because
    // deleting it here would race with a concurrent attempt; instead the caller
    // is told it may proceed, and a success clears the row outright.
    return { allowed: true, failures: row.failures };
  } catch {
    return { allowed: true, failures: 0 };
  }
}

/**
 * Count a failure and lock the address once it passes the limit.
 *
 * Returns the state after the increment, so the caller can report "locked out"
 * on the attempt that actually caused it rather than one attempt late.
 */
export async function countFailure(
  scope: string,
  ip: string,
  maxFailures: number,
  lockMinutes: number,
): Promise<LimitState> {
  try {
    const { prisma } = await import('@/server/db');
    const key = `${scope}:${ip}`;

    const row = await prisma.rateLimit.findUnique({ where: { key } });
    const failures = (row?.failures ?? 0) + 1;
    const locked = failures >= maxFailures;

    await prisma.rateLimit.upsert({
      where: { key },
      create: {
        key,
        failures,
        lockedUntil: locked ? new Date(Date.now() + lockMinutes * 60_000) : null,
      },
      update: {
        failures,
        lockedUntil: locked ? new Date(Date.now() + lockMinutes * 60_000) : null,
        updatedAt: new Date(),
      },
    });

    return { allowed: !locked, failures };
  } catch {
    // If the count cannot be recorded the attempt has already been refused on
    // its merits; saying "not locked" here does not open anything.
    return { allowed: true, failures: 0 };
  }
}

/**
 * Clear the counter — called on a correct password or a correct answer.
 *
 * Done in one delete rather than a reset to zero so that a success from an
 * address that was mid-tally cannot leave `failures: 0` sitting next to an old
 * `lockedUntil`, which would be a row that reads as both fresh and locked.
 */
export async function clearLimit(scope: string, ip: string): Promise<void> {
  try {
    const { prisma } = await import('@/server/db');
    await prisma.rateLimit.deleteMany({ where: { key: `${scope}:${ip}` } });
  } catch {
    // A row that survives a success is a stale count, not an open door: the
    // next attempt still has to be correct.
  }
}
