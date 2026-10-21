import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * ============================================================================
 *  THE OWNER'S PASSWORD — hashing, and nothing else
 * ============================================================================
 *
 * ── Why this is here and not in the server file ──────────────────────────────
 * Because this is arithmetic. It touches no database, no cookie and no request,
 * so there is nothing for the `server-only` marker to protect — and putting it
 * there meant the one file that can prove this code is correct could not be
 * loaded by the thing that runs checks, which is how a security routine ends up
 * never actually tested.
 *
 * The rule that moved with it: **anything with pure maths in it belongs next to
 * the other pure maths, and the server-only files are for the things that talk
 * to something.**
 *
 * ── Why scrypt ──────────────────────────────────────────────────────────────
 * Because it is slow on purpose, and because it ships with Node, so there is no
 * second thing to install, keep updated, or get wrong. A stolen copy of the
 * password table is then expensive to attack rather than trivial: every guess
 * costs real time, and a fast hash would make a list of common passwords a
 * matter of seconds.
 *
 * The salt is 16 random bytes, stored beside the hash. Not hidden in a
 * configuration file and not derived from anything, because a salt that can be
 * worked out is not a salt.
 */

/** 16 bytes of salt. Bigger buys very little here; 16 is already generous. */
const SALT_BYTES = 16;

/** 64 bytes of hash. scrypt's default key length. */
const HASH_BYTES = 64;

/**
 * scrypt's cost parameters.
 *
 * N = 16384, r = 8, p = 1 are Node's defaults and take roughly 50-100 ms on a
 * small server. That is the whole point: a login a person does not notice, and a
 * million guesses that takes months.
 *
 * Stated here rather than left implicit so that raising them later is a visible
 * act. Raising N invalidates nothing: old hashes keep verifying, because the
 * check recomputes from the stored hash rather than comparing parameters.
 */
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

/** Hash a password with a fresh salt. */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  return { hash: hashWith(password, salt), salt };
}

/** Hash a password against a salt that is already known. */
function hashWith(password: string, saltHex: string): string {
  return scryptSync(password, Buffer.from(saltHex, 'hex'), HASH_BYTES, SCRYPT_OPTIONS)
    .toString('hex');
}

/**
 * Compare a submitted password against a stored hash.
 *
 * Constant-time, and false rather than throwing on a malformed row. A row that
 * cannot be read is a row that refuses everybody, and refusing everybody is the
 * only safe direction to fail in.
 */
export function verifyPassword(password: string, hashHex: string, saltHex: string): boolean {
  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = Buffer.from(hashWith(password, saltHex), 'hex');

    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/**
 * Is this password worth accepting?
 *
 * Length only. There is no rule about which characters are allowed, because a
 * rule like that always rejects somebody's real password at the worst possible
 * moment — and this is the owner's own account on their own site, where the only
 * threat is them forgetting their own rules.
 *
 * Eight is the floor and it is deliberately low. A minimum is a real number, not
 * a gesture.
 */
export function passwordProblem(password: string): string | null {
  if (password.length < 8) return 'too-short';
  if (password.length > 200) return 'too-long';
  return null;
}

/* -------------------------------------------------------------------------- */
/* Recovery answers — the "I forgot my password" half                          */
/* -------------------------------------------------------------------------- */

/**
 * Fold a recovery answer into the form it is stored and checked in.
 *
 * ── Why anything is normalised at all ───────────────────────────────────────
 * Because the person typing it is, at that exact moment, locked out of their
 * own site. Capitalisation and a double space are not security events; they are
 * what a hurried person under stress produces. Forgiven here so the recovery
 * path never refuses somebody for the one kind of typo that recovery exists to
 * absorb.
 *
 * Trimmed, lowercased, and internal runs of whitespace collapsed to one space.
 * Punctuation and script are left exactly as typed — "माँ" and "maa" are
 * different answers to a Hindi question and must stay different.
 */
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Is this answer worth storing?
 *
 * Two characters is a deliberately low floor: the answers here are things like
 * a first name or a city, and a rule that rejects "राम" would reject the
 * answer the owner actually chose. The protection against a short answer is
 * not a length rule — it is that the answer is checked slowly (scrypt) and
 * checked at most a handful of times per address before that address is
 * refused.
 */
export function answerProblem(answer: string): string | null {
  const value = normalizeAnswer(answer);
  if (value.length < 2) return 'answer-too-short';
  if (value.length > 200) return 'answer-too-long';
  return null;
}

/** Is this question worth storing? Shown in plain text, so only length matters. */
export function questionProblem(question: string): string | null {
  const value = question.trim();
  if (value.length < 4) return 'question-too-short';
  if (value.length > 200) return 'question-too-long';
  return null;
}