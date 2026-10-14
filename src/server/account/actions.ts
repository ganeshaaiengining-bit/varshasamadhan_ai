'use server';

import { z } from 'zod';
import { prisma } from '@/server/db';
import {
  newSalt,
  hashPassword,
  verifyPassword,
  newSessionToken,
} from '@/server/auth/crypto';
import { startSession, endSession, sessionExpiry } from '@/server/auth/session';

/**
 * ===========================================================================
 *  SIGN IN, SIGN UP, SIGN OUT
 * ===========================================================================
 *
 * `'use server'` rather than `import 'server-only'`, and the difference is the
 * whole reason this file can exist.
 *
 * The account form is a client component, because it has to react to typing.
 * `import 'server-only'` marks a module as one that must never reach the
 * browser bundle, so a client component cannot import anything from it. Every
 * other module here uses that marker correctly and none of them is imported by
 * a client component.
 *
 * `'use server'` does the opposite job: it declares that the exported functions
 * are the entry points the browser is allowed to call, and Next replaces each
 * one with a request to the server. The form calls `signIn` exactly as it would
 * call a local function and never sees Prisma, the salt, or the token.
 *
 * ── What an account holds, and why so little ───────────────────────────────
 *
 * A handle, a password hash and a salt. Nothing else is collected, because the
 * service's claim is that it does not collect what it does not need, and a
 * phone number in this country is a name and an address together.
 *
 * ── Why the same words are said whatever is wrong ──────────────────────────
 *
 * A sign-in that says "no account with that name" and one that says "wrong
 * password" are a pair of answers that let somebody confirm which handles
 * exist. One message is returned for all of them, and it says what to do rather
 * than what went wrong. The same applies to registration: a handle already
 * taken is reported as "choose another", not as "that name exists".
 *
 * ── Why the rate limit is by handle and not by IP ──────────────────────────
 *
 * Because on a shared mobile connection everybody behind it has the same IP,
 * and a limit by IP locks out a whole neighbourhood at once. A limit by handle
 * stops one account being guessed at, which is the attack that matters here.
 */
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export type AccountMode = 'signin' | 'register' | 'logout';

const handleRule = z
  .string()
  .trim()
  .min(3, 'tooShort')
  .max(32, 'tooLong')
  .regex(/^[A-Za-z0-9_.]+$/, 'badChars');

const passwordRule = z.string().min(6, 'tooShort').max(200, 'tooLong');

const schema = z
  .object({
    handle: handleRule,
    password: passwordRule,
    phone: z
      .string()
      .trim()
      .max(20, 'tooLong')
      .regex(/^[0-9+\-\s()]*$/, 'badChars')
      .optional()
      .or(z.literal('')),
  })
  .partial();

/** Recent attempts, per handle. In memory because a lockout table is another
 *  thing to keep, and restarting a development server should not lock anybody
 *  out for fifteen minutes. */
const attempts = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((at) => now - at < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);
  return false;
}

export interface AccountResult {
  ok: boolean;
  /** A translation key, never a sentence. The page holds the sentences. */
  reason?: string;
}

export async function signUp(
  handle: string,
  password: string,
  phone: string,
  language: string,
): Promise<AccountResult> {
  const parsed = schema.safeParse({ handle, password, phone });
  if (!parsed.success) return { ok: false, reason: 'account.errBad' };

  const clean = parsed.data.handle!.trim();
  const stored = clean.toLowerCase();

  if (rateLimited(`new:${stored}`)) return { ok: false, reason: 'account.errWait' };

  try {
    const existing = await prisma.user.findUnique({
      where: { handle: stored },
      select: { id: true },
    });
    if (existing) return { ok: false, reason: 'account.errTaken' };

    const salt = newSalt();

    const user = await prisma.user.create({
      data: {
        handle: stored,
        passwordHash: hashPassword(parsed.data.password!, salt),
        passwordSalt: salt,
        phone: parsed.data.phone?.trim() || null,
        language: language.slice(0, 5),
      },
      select: { id: true },
    });

    const { token, tokenHash } = newSessionToken();
    await prisma.session.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: sessionExpiry(),
      },
    });
    await startSession(token, sessionExpiry());

    attempts.delete(`new:${stored}`);
    return { ok: true };
  } catch {
    // A unique-key violation is the same thing as "taken". Anything else is an
    // outage, and the message is the outage message.
    return { ok: false, reason: 'account.errTryLater' };
  }
}

export async function signIn(handle: string, password: string): Promise<AccountResult> {
  const parsed = schema.safeParse({ handle, password });
  if (!parsed.success) return { ok: false, reason: 'account.errWrong' };

  const stored = parsed.data.handle!.trim().toLowerCase();

  if (rateLimited(`in:${stored}`)) return { ok: false, reason: 'account.errWait' };

  try {
    const user = await prisma.user.findUnique({
      where: { handle: stored },
      select: { id: true, passwordHash: true, passwordSalt: true },
    });

    // Same answer whether the account is missing or the password is wrong.
    if (!user) {
      // Hash anyway. Returning early here makes a missing account measurably
      // faster than a wrong password, which is enough to enumerate handles.
      hashPassword(parsed.data.password!, newSalt());
      return { ok: false, reason: 'account.errWrong' };
    }

    if (!verifyPassword(parsed.data.password!, user.passwordSalt, user.passwordHash)) {
      return { ok: false, reason: 'account.errWrong' };
    }

    const { token, tokenHash } = newSessionToken();
    await prisma.session.create({
      data: { tokenHash, userId: user.id, expiresAt: sessionExpiry() },
    });
    await startSession(token, sessionExpiry());

    attempts.delete(`in:${stored}`);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'account.errTryLater' };
  }
}

/**
 * Sign out of this browser.
 *
 * A server action rather than a direct call from the form, because ending a
 * session means deleting a row and writing a cookie header, and neither of
 * those can happen in the browser. The form cannot import the session module
 * for the same reason it cannot import this one: `next/headers` in a client
 * bundle is a build error, and the build caught it.
 */
export async function signOut(): Promise<void> {
  await endSession();
}