import 'server-only';

import { hashPassword, verifyPassword, normalizeAnswer } from '@/content/password-hash';

/**
 * ============================================================================
 *  WHERE THE OWNER'S PASSWORD LIVES
 * ============================================================================
 *
 * The hashing is in `src/content/password-hash.ts`, because that is pure
 * arithmetic and pure arithmetic belongs next to the other pure arithmetic. This
 * file is the part that talks to something — the database — and so this is the
 * part that carries the `server-only` marker.
 *
 * ── Why the password is stored at all ───────────────────────────────────────
 * The password used to be an environment variable and nothing else, which meant
 * three things had to be true and none of them were:
 *
 *   1. changing it meant redeploying the site
 *   2. setting it meant handing the value to somebody else
 *   3. forgetting it meant there was no way back
 *
 * So the owner sets it themselves, once, through a one-time link, and from then
 * on it lives here — hashed, never in plain text, never shown to anybody
 * including the person who set it.
 *
 * The environment variable still works. A fresh install with no row falls back to
 * it exactly as before, which is what makes this safe to add: no deployment is
 * locked out by it, and no deployment's existing password changes underneath it.
 */

/** One row, one owner. The fixed id means a second write replaces the first. */
const ROW_ID = 'owner';

/**
 * The stored password, if the owner has set one.
 *
 * Returns null — meaning "fall back to the environment variable" — when there is
 * no row, and also when the database cannot be reached. A database blip must not
 * lock the owner out of their own site; falling back costs nothing and refusing
 * would cost everything.
 */
export async function storedPassword(): Promise<{ hash: string; salt: string } | null> {
  try {
    const { prisma } = await import('@/server/db');
    const row = await prisma.ownerCredential.findUnique({ where: { id: ROW_ID } });
    if (!row?.hash || !row.salt) return null;
    return { hash: row.hash, salt: row.salt };
  } catch {
    return null;
  }
}

/** Has the owner ever set a password of their own? */
export async function hasStoredPassword(): Promise<boolean> {
  return (await storedPassword()) !== null;
}

/* -------------------------------------------------------------------------- */
/* Recovery — the question that gets the owner back in                         */
/* -------------------------------------------------------------------------- */

/** What the forgot-password flow needs: the question to show, and its answer. */
export interface Recovery {
  question: string;
  answerHash: string;
  answerSalt: string;
}

/**
 * The stored recovery pair, if one was set.
 *
 * Null when there is no row and also when the row has no question — both mean
 * "there is nothing to recover *with*", which the caller reports in words
 * rather than pretending a reset happened.
 */
export async function storedRecovery(): Promise<Recovery | null> {
  try {
    const { prisma } = await import('@/server/db');
    const row = await prisma.ownerCredential.findUnique({ where: { id: ROW_ID } });
    if (!row?.question || !row.answerHash || !row.answerSalt) return null;
    return { question: row.question, answerHash: row.answerHash, answerSalt: row.answerSalt };
  } catch {
    return null;
  }
}

/**
 * Write the password and its recovery question together.
 *
 * Together, in one statement, because a password with no way back and a
 * question with no password to unlock are both half-features — and because
 * doing it in one upsert means a failure between the two writes cannot leave
 * the owner with one without the other.
 *
 * The answer is normalised and hashed here, so no caller can accidentally store
 * the plain answer by forgetting a step.
 */
export async function setPasswordWithRecovery(
  password: string,
  question: string,
  answer: string,
): Promise<void> {
  const passwordPair = hashPassword(password);
  const answerPair = hashPassword(normalizeAnswer(answer));
  const { prisma } = await import('@/server/db');

  await prisma.ownerCredential.upsert({
    where: { id: ROW_ID },
    create: {
      id: ROW_ID,
      hash: passwordPair.hash,
      salt: passwordPair.salt,
      question: question.trim(),
      answerHash: answerPair.hash,
      answerSalt: answerPair.salt,
      recoveryAt: new Date(),
    },
    update: {
      hash: passwordPair.hash,
      salt: passwordPair.salt,
      question: question.trim(),
      answerHash: answerPair.hash,
      answerSalt: answerPair.salt,
      recoveryAt: new Date(),
    },
  });
}

/**
 * Does this answer unlock the account?
 *
 * Normalised the same way it was on the way in, hashed with the stored salt, and
 * compared in constant time. False when there is no recovery pair at all — the
 * locked-out state must never be readable as "yes".
 */
export async function checkRecoveryAnswer(answer: string): Promise<boolean> {
  const recovery = await storedRecovery();
  if (!recovery) return false;
  return verifyPassword(normalizeAnswer(answer), recovery.answerHash, recovery.answerSalt);
}

/**
 * Replace the password with a new one, keeping the recovery question as it is.
 *
 * Only ever called after `checkRecoveryAnswer` returned true, and never with a
 * password that has not been through `passwordProblem`. The route enforces both
 * because the route is where the attempts are counted.
 */
export async function resetPassword(password: string): Promise<void> {
  const { hash, salt } = hashPassword(password);
  const { prisma } = await import('@/server/db');

  await prisma.ownerCredential.update({
    where: { id: ROW_ID },
    data: { hash, salt, updatedAt: new Date() },
  });
}

/**
 * Whether the one-time setup link has already been used.
 *
 * Checked here rather than in the route, so that no future route can forget it.
 * Once a password exists, the setup link authorises nothing — not with a delay,
 * not with a rate limit, simply no.
 */
export async function setupAlreadyUsed(): Promise<boolean> {
  return hasStoredPassword();
}

export { hashPassword, verifyPassword, passwordProblem } from '@/content/password-hash';
export {
  normalizeAnswer,
  answerProblem,
  questionProblem,
} from '@/content/password-hash';