import 'server-only';

import { hashPassword } from '@/content/password-hash';

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

/** Write the password, replacing whatever was there. */
export async function savePassword(password: string): Promise<void> {
  const { hash, salt } = hashPassword(password);
  const { prisma } = await import('@/server/db');

  await prisma.ownerCredential.upsert({
    where: { id: ROW_ID },
    create: { id: ROW_ID, hash, salt },
    update: { hash, salt },
  });
}

/** Has the owner ever set a password of their own? */
export async function hasStoredPassword(): Promise<boolean> {
  return (await storedPassword()) !== null;
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