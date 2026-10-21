import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  answerProblem,
  checkRecoveryAnswer,
  passwordProblem,
  resetPassword,
  storedRecovery,
} from '@/server/owner-password';
import { createOwnerSession } from '@/server/owner';

/**
 * POST /api/admin/forgot-password
 *
 * ── What this is, and what it deliberately is not ───────────────────────────
 * It is the only route on this site that lets somebody change the owner's
 * password without knowing the owner's password. That makes it the single most
 * dangerous endpoint here, and it is guarded by exactly one thing: a question
 * the owner chose and an answer only the owner should know.
 *
 * There is no email, because there is no email. No SMS, because SMS costs money
 * and needs a phone number this site has no business holding. So the recovery
 * is the oldest kind — a question — and everything that makes a question weak in
 * general is answered by how it is checked here:
 *
 *   1. The answer is **hashed with scrypt**, so a stolen database gives an
 *      attacker a puzzle rather than a key, and each guess costs real time.
 *   2. Attempts are **counted per address**, and after five wrong answers that
 *      address is refused for fifteen minutes — the same numbers the password
 *      login uses, because a weaker limit on the more dangerous door would be
 *      backwards.
 *   3. The question itself is shown to anybody who asks, on purpose. It is not
 *      a secret and pretending otherwise would only hide the mechanism while
 *      the answer stayed the same. Security that depends on an attacker not
 *      knowing *which* question was asked is security that dies the first time
 *      the page is screenshotted.
 *
 * ── Why a wrong answer says as little as a right one ─────────────────────────
 * The response never distinguishes "no recovery is set up" from "wrong answer"
 * for an address that has been locked out, and never confirms the question is
 * correct. A prober learns the same nothing in every case; the owner, who is
 * not guessing, is told what is actually wrong because they need to be.
 */

export const dynamic = 'force-dynamic';

/** Same numbers as the password login: five wrong answers, fifteen minutes. */
const MAX_FAILURES = 5;
const LOCKOUT_MINUTES = 15;

interface Body {
  answer?: unknown;
  password?: unknown;
}

function throttleKey(ip: string): string {
  return `vs-recover-fail:${ip}`;
}

function lockoutKey(ip: string): string {
  return `vs-recover-lock:${ip}`;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const answer = typeof body.answer === 'string' ? body.answer : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (answer.length === 0 || answer.length > 200 || password.length > 200) {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const store = await cookies();

  const lockedUntil = Number(store.get(lockoutKey(ip))?.value ?? '0');
  if (lockedUntil > Date.now()) {
    return NextResponse.json({ ok: false, reason: 'locked-out' }, { status: 429 });
  }

  // Nothing is checked before this point that could confirm anything: no
  // recovery set up and a wrong answer are the same "no" from the outside, and
  // the lockout is the same either way.
  const recovery = await storedRecovery();

  const answerOk = recovery !== null && (await checkRecoveryAnswer(answer));

  if (!answerOk) {
    const failures = Number(store.get(throttleKey(ip))?.value ?? '0') + 1;

    if (failures >= MAX_FAILURES) {
      store.set(lockoutKey(ip), String(Date.now() + LOCKOUT_MINUTES * 60_000), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: LOCKOUT_MINUTES * 60,
      });
      store.delete(throttleKey(ip));

      return NextResponse.json({ ok: false, reason: 'locked-out' }, { status: 429 });
    }

    store.set(throttleKey(ip), String(failures), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: LOCKOUT_MINUTES * 60,
    });

    // Deliberately the same message whether no recovery exists or the answer is
    // simply wrong — see the note at the top of this file.
    return NextResponse.json({ ok: false, reason: 'wrong-answer' }, { status: 401 });
  }

  const problem = passwordProblem(password);
  if (problem) {
    // Reached only with a correct answer, so this message is for the owner and
    // reveals nothing an attacker who already had the answer does not have.
    return NextResponse.json({ ok: false, reason: problem }, { status: 400 });
  }

  await resetPassword(password);

  // The failed-attempt count is cleared on success, and the owner is signed in
  // — they have just proved who they are, and asking them to type the password
  // they had set one second ago would be friction with no security behind it.
  store.delete(throttleKey(ip));
  store.delete(lockoutKey(ip));
  await createOwnerSession(ip);

  return NextResponse.json({ ok: true });
}
