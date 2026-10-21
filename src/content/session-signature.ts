/**
 * ============================================================================
 *  THE OWNER'S SESSION COOKIE, SIGNED
 * ============================================================================
 *
 * ── What was wrong ──────────────────────────────────────────────────────────
 * `isOwnerSession()` used to accept any cookie that was sixty-four hex
 * characters long. The value was random when the server minted it — but the
 * server was not asked whether *it* had minted the one it was given. So a
 * visitor could open their browser console, type
 *
 *     document.cookie = 'vs-owner=' + 'ab'.repeat(32)
 *
 * and be the owner: reading visitor names, publishing reviews, and — once a
 * change-password form exists — replacing the password and locking the real
 * owner out of their own site. The comment on the function said "signed so it
 * cannot be forged". It was not signed. Nothing checked it.
 *
 * That is the worst kind of bug in this file, because the check *looked* like a
 * check: it counted characters, it tested a regular expression, and it passed a
 * code review. What it never did was involve a secret.
 *
 * ── What is done instead ────────────────────────────────────────────────────
 * The cookie is two parts — a random value, and an HMAC of that value under a
 * key the server holds. The random part makes each session unique; the
 * signature is what makes "sixty-four hex characters" mean "something this
 * server issued" rather than "something somebody typed".
 *
 * ── Where the key comes from ────────────────────────────────────────────────
 * From the password itself — specifically the stored hash and salt, which are
 * high-entropy and stable until the password changes. So there is no second
 * secret to configure, lose, or leak: an install with a password already has
 * everything needed.
 *
 * A consequence worth naming: **changing the password invalidates every existing
 * session.** That is not a side effect, it is the point. Somebody who changes
 * their password expects a device that was left signed in somewhere to stop
 * working, and here that happens for free, exactly at the moment the owner
 * needed it.
 *
 * ── Why this file has no `server-only` ──────────────────────────────────────
 * Because it is arithmetic over strings — no database, no cookie jar, no
 * request — which means it can be tested directly. The secret it is handed
 * comes from the caller; deciding what that secret is stays in `owner.ts`.
 */

const encoder = new TextEncoder();

/** A cookie value before signing: 32 random bytes, hex. */
export function randomSessionValue(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sign a session value.
 *
 * HMAC-SHA-256 under `secret`, hex encoded. Web Crypto rather than a Node import
 * because this also runs on the edge, and because it is the same primitive
 * either way. If the platform refuses to give us a key — almost always because
 * something is deeply wrong with the runtime — the caller gets null and nobody
 * is signed in, which is the safe direction to fail.
 */
export async function signSessionValue(value: string, secret: string): Promise<string | null> {
  if (!secret || value.length !== 64) return null;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
    return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

/**
 * Constant-time string compare.
 *
 * Length is allowed to leak — it is fixed by the algorithm and reveals nothing —
 * but the contents are not, so the loop always runs to the end. Comparing with
 * `===` would return early on the first differing byte and let an attacker with
 * a very good stopwatch learn the signature one character at a time.
 */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** The full cookie value: `<64 hex>.<64 hex signature>`. */
export async function mintSessionCookie(secret: string): Promise<string | null> {
  const value = randomSessionValue();
  const signature = await signSessionValue(value, secret);
  if (!signature) return null;
  return `${value}.${signature}`;
}

/**
 * Is this cookie one *this server* issued, under *this* secret?
 *
 * Both halves are checked: the shape (so a malformed string exits before any
 * crypto) and the signature (so a well-formed string that was not signed by us
 * does not). A cookie minted before a password change fails here, because the
 * secret it was signed with no longer exists.
 */
export async function verifySessionCookie(cookie: string, secret: string): Promise<boolean> {
  const parts = cookie.split('.');
  if (parts.length !== 2) return false;

  const [value, signature] = parts;
  if (value.length !== 64 || !/^[0-9a-f]+$/.test(value)) return false;
  if (signature.length !== 64 || !/^[0-9a-f]+$/.test(signature)) return false;

  const expected = await signSessionValue(value, secret);
  if (!expected) return false;

  return sameSecret(signature, expected);
}
