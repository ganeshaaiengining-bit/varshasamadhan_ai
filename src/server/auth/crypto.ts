import 'server-only';

import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

/**
 * ===========================================================================
 *  PASSWORDS AND SESSION TOKENS
 * ===========================================================================
 *
 * Two jobs, kept in one file because they answer the same question: given
 * something a person typed, can it be stored safely and checked later?
 *
 * ── Why scrypt and not bcrypt ─────────────────────────────────────────────
 *
 * Neither is available without a dependency, and the built-in does the job.
 * `crypto.scryptSync` is memory-hard, which is the property that matters now
 * that GPUs are cheap: an attacker who has stolen the database wants to try
 * millions of guesses a second, and a memory-hard function makes each guess
 * expensive in RAM rather than in parallel lanes. A plain SHA-256 of a password
 * is not a password hash and is not used here.
 *
 * The cost parameters below are Node's defaults (N=16384, r=8, p=1), which is
 * around 16 MB per hash and roughly 50ms on a laptop. That is a deliberate
 * choice in both directions: slow enough that a stolen table is not cheap to
 * attack, fast enough that a person typing a password on a phone does not
 * notice the wait.
 *
 * ── Why the salt is stored in its own column ───────────────────────────────
 *
 * It would be conventional to prepend or append it to the hash and store one
 * string. Two columns were chosen instead so that a partial copy of one column
 * is not enough to attack, and so the salt can be compared against the hash in
 * a test without being trivially equal for the wrong reason.
 *
 * ── Why the comparison is not a string compare ────────────────────────────
 *
 * `===` on two hex strings exits at the first differing character, and how long
 * it takes tells an attacker how many leading characters were right. That is a
 * timing oracle. `timingSafeEqual` compares every byte regardless, so the time
 * taken says nothing about the contents.
 *
 * ── What is never done here ────────────────────────────────────────────────
 *
 * No password is ever logged, echoed, or returned from these functions. The
 * functions take it and give back a hash, or take a guess and give back a
 * boolean. Nothing here can print it even by accident, which is the property
 * that matters for the code that calls them.
 */

/** N = CPU/memory cost. Each hash holds about 16 MB for its duration. */
const SCRYPT_COST = 16_384;

/** Block size. Larger is more memory-hard; Node's default is 8. */
const SCRYPT_BLOCK = 8;

/** Parallelisation. */
const SCRYPT_PARALLEL = 1;

/** Hash output, hex-encoded. 64 bytes = 128 characters. */
const HASH_LENGTH = 64;

/** Salt, hex-encoded. 16 bytes = 32 characters. */
const SALT_LENGTH = 16;

/** A fresh salt, hex encoded. */
export function newSalt(): string {
  return randomBytes(SALT_LENGTH).toString('hex');
}

/**
 * Hash a password.
 *
 * Synchronous on purpose. These run once per login or signup, they take tens of
 * milliseconds, and the async version would only add a promise to every caller
 * to gain nothing.
 */
export function hashPassword(password: string, salt: string): string {
  return scryptSync(password.normalize('NFKC'), salt, HASH_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK,
    p: SCRYPT_PARALLEL,
    // A hard memory limit, so a malformed stored salt cannot ask the process to
    // allocate an unbounded amount and take the server down with it.
    maxmem: 64 * 1024 * 1024,
  }).toString('hex');
}

/**
 * Check a typed password against a stored hash.
 *
 * Returns false rather than throwing when the stored hash is malformed. A
 * corrupt row should log one person out, not 500 the page for everybody.
 */
export function verifyPassword(password: string, salt: string, expected: string): boolean {
  let actual: string;
  try {
    actual = hashPassword(password, salt);
  } catch {
    return false;
  }

  const a = Buffer.from(actual, 'hex');
  const b = Buffer.from(expected, 'hex');

  // Different lengths means different algorithms or a truncated column. There
  // is nothing to compare, so it is not a match.
  if (a.length !== b.length || a.length === 0) return false;

  return timingSafeEqual(a, b);
}

/**
 * A session token, and its stored form.
 *
 * The caller keeps the raw value in a cookie and puts only the hash in the
 * database. A stolen database then yields no live sessions, which is the same
 * reason the password is not stored as given.
 *
 * SHA-256 rather than scrypt, deliberately: this is 32 bytes of machine
 * randomness, not something a person chose and could choose weakly. There is
 * nothing to brute force, so the slow function would only add latency.
 */
export function newSessionToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * How long a session lasts.
 *
 * Thirty days, because the audience is elderly and often not returning daily,
 * and a short session means being logged out of one's own saved answers at the
 * worst moment. The trade is accepted knowingly: on a shared phone the next
 * person inherits the session, which is why "log out" appears on every account
 * page rather than only in a settings list.
 */
export const SESSION_DAYS = 30;

export function sessionExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

/** The cookie name. Prefixed so it is obviously this site's. */
export const SESSION_COOKIE = 'vs-session';