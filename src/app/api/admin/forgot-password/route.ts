import { NextResponse } from 'next/server';

import {
  answerProblem,
  checkRecoveryAnswer,
  passwordProblem,
  resetPassword,
  storedRecovery,
} from '@/server/owner-password';
import { createOwnerSession } from '@/server/owner';
import { clearLimit, countFailure, readLimit } from '@/server/rate-limit';

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
 *   2. Attempts are **counted in the database per address**, and after five
 *      wrong answers that address is refused for fifteen minutes — the same
 *      numbers the password login uses, because a weaker limit on the more
 *      dangerous door would be backwards. Counted in the database and not in a
 *      cookie, which is the only place a count survives a script that deletes
 *      its cookies between guesses; see `src/server/rate-limit.ts`.
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

/** Separate scope from `login`, so five wrong passwords do not also lock recovery. */
const SCOPE = 'recover';

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

  // Read before anything that could confirm anything: no recovery set up and a
  // wrong answer are the same "no" from the outside, and the lockout is the
  // same either way.
  const limit = await readLimit(SCOPE, ip);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'locked-out' }, { status: 429 });
  }

  const recovery = await storedRecovery();

  const answerOk = recovery !== null && (await checkRecoveryAnswer(answer));

  if (!answerOk) {
    const after = await countFailure(SCOPE, ip, MAX_FAILURES, LOCKOUT_MINUTES);

    if (!after.allowed) {
      return NextResponse.json({ ok: false, reason: 'locked-out' }, { status: 429 });
    }

    // Deliberately the same message whether no recovery exists or the answer is
    // simply wrong — see the note at the top of this file.
    return NextResponse.json({ ok: false, reason: 'wrong-answer' }, { status: 401 });
  }

  const problem = passwordProblem(password);
  if (problem) {
    // Reached only with a correct answer, so this message is for the owner and
    // reveals nothing an attacker who already had the answer does not have.
    // Not counted as a failure: the answer was right, and punishing a short
    // password after a correct answer would lock out the one person who is
    // demonstrably the owner.
    return NextResponse.json({ ok: false, reason: problem }, { status: 400 });
  }

  await resetPassword(password);

  // Cleared on success, and the owner is signed in — they have just proved who
  // they are, and asking them to type the password they had set one second ago
  // would be friction with no security behind it.
  await clearLimit(SCOPE, ip);
  await createOwnerSession(ip);

  return NextResponse.json({ ok: true });
}
