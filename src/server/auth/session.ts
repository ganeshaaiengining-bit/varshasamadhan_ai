import 'server-only';

import { cookies } from 'next/headers';
import { prisma } from '@/server/db';
import {
  SESSION_COOKIE,
  hashToken,
  sessionExpiry,
} from './crypto';

/**
 * ===========================================================================
 *  WHO IS SIGNED IN
 * ===========================================================================
 *
 * Reads the session cookie and returns the visitor, or null. No page calls
 * anything else about accounts; this is the one function that knows the cookie
 * exists.
 *
 * ── Why the session is a row and not a signed cookie ──────────────────────
 *
 * A stateless signed cookie cannot be revoked, so signing out would be a
 * request to please stop trusting it. That matters most on the phone this
 * audience actually uses: a borrowed or shared one, where the next person to
 * pick it up is not the one who signed in. A row in the database can be
 * deleted, and a deleted row is a logout that is really a logout.
 *
 * ── Why the row is checked, not just decoded ──────────────────────────────
 *
 * The cookie holds the token; the row holds its hash. Looking the hash up on
 * every request is what makes "log out everywhere" and "this password was
 * changed" both work, because both mean deleting rows.
 *
 * ── Why expiry is re-checked here and not trusted from the cookie ──────────
 *
 * An expiry stamp inside the cookie is a claim the client made. A row whose
 * expires_at has passed is checked on every use, so a clock problem or a
 * hand-edited cookie cannot extend a session. The cookie has no expiry field to
 * be wrong about at all.
 *
 * ── What this never does ──────────────────────────────────────────────────
 *
 * It never creates an account, never sends anything anywhere, and never records
 * what the person asked about. An account is not a precondition for using the
 * service; see the note on the User model.
 */

/** How long the browser should keep the cookie. Matches SESSION_DAYS. */
const COOKIE_DAYS = 30;

export interface SignedInUser {
  id: string;
  handle: string;
  language: string;
}

/**
 * The signed-in visitor, or null.
 *
 * Any failure at all — no cookie, unknown token, expired row, deleted user —
 * is a signed-out state. It is never an error, because none of those are
 * something a visitor can act on, and turning them into one would show a stack
 * trace to somebody who has done nothing wrong.
 */
export async function currentUser(): Promise<SignedInUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Short, fixed-length input, so the lookup below is not a way to test
  // whether a token is "roughly right".
  if (token.length < 20 || token.length > 100) return null;

  try {
    const row = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            handle: true,
            language: true,
            passwordChangedAt: true,
          },
        },
      },
    });

    if (!row) return null;

    if (row.expiresAt.getTime() <= Date.now()) {
      // Delete rather than ignore. An expired row that lingers is a row that
      // will be found again on every future request from that browser.
      await prisma.session
        .delete({ where: { tokenHash: hashToken(token) } })
        .catch(() => undefined);
      return null;
    }

    /*
     * A password changed after the session was opened ends that session.
     *
     * Comparing timestamps rather than storing a version number is deliberate:
     * it cannot fall out of step with the password itself, because the two are
     * set in the same statement. A session opened before the change is older,
     * and is refused.
     */
    if (row.user.passwordChangedAt.getTime() > row.expiresAt.getTime() - COOKIE_DAYS * 86_400_000) {
      const openedAt = await prisma.session
        .findUnique({ where: { tokenHash: hashToken(token) }, select: { createdAt: true } })
        .catch(() => null);

      if (openedAt && openedAt.createdAt.getTime() < row.user.passwordChangedAt.getTime()) {
        await prisma.session
          .delete({ where: { tokenHash: hashToken(token) } })
          .catch(() => undefined);
        return null;
      }
    }

    return {
      id: row.user.id,
      handle: row.user.handle,
      language: row.user.language,
    };
  } catch {
    // The database is down, or the table does not exist yet. Either way the
    // honest answer for the page is "not signed in", and the service still
    // works without an account.
    return null;
  }
}

/**
 * Set the cookie after a successful sign-in or sign-up.
 *
 * httpOnly: JavaScript cannot read it, so a cross-site script cannot steal it.
 * sameSite lax: it survives arriving from another site, which is how a visitor
 * gets here in the first place, and blocks cross-site POSTs, which is where a
 * stolen cookie would be spent.
 * secure in production only, so it works over plain http on a home network
 * during development and never leaves the machine unencrypted by accident.
 */
export async function startSession(token: string, expiresAt: Date): Promise<void> {
  const jar = await cookies();

  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

/** End this browser's session. */
export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => undefined);
  }

  jar.delete(SESSION_COOKIE);
}

/** End every session for this account. Used after a password change. */
export async function endAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } }).catch(() => undefined);
}

export { sessionExpiry };
export { SESSION_COOKIE };