import { NextResponse } from 'next/server';

import {
  answerProblem,
  passwordProblem,
  questionProblem,
  resetPassword,
  setPasswordWithRecovery,
  storedRecovery,
} from '@/server/owner-password';
import { confirmOwnerPassword, createOwnerSession, isOwnerSession } from '@/server/owner';
import { clearLimit, countFailure, readLimit } from '@/server/rate-limit';

/**
 * POST /api/admin/change-password
 *
 * ── Why the current password is asked for again ─────────────────────────────
 * A session cookie proves that this *browser* was signed in at some point. It
 * does not prove that the person at the keyboard now is the person who signed
 * in — a laptop left open, a shared machine, a phone handed to somebody to look
 * at a photo. Password changes are the one action where that difference matters,
 * because the new password is what everything else later hangs on.
 *
 * The recovery question is optional here and not required, which is the
 * opposite of the setup page. At setup the pair must exist or "forgot password"
 * is a dead end from day one. Here it already exists, and demanding it again to
 * change a password would send the owner looking for a piece of paper to type
 * their own site's settings.
 *
 * ── The session is re-minted on success ─────────────────────────────────────
 * Not a formality: the cookie is signed with a key derived from the password
 * hash, so the moment the password changes, every existing session — including
 * the one making this request — stops verifying. That is deliberate (see
 * `session-signature.ts`), and re-minting here is what stops the owner being
 * signed out by their own successful action.
 */

export const dynamic = 'force-dynamic';

/** Same numbers as the login door; a separate counter so neither locks the other. */
const MAX_FAILURES = 5;
const LOCKOUT_MINUTES = 15;
const SCOPE = 'change';

interface Body {
  current?: unknown;
  password?: unknown;
  question?: unknown;
  answer?: unknown;
}

export async function POST(request: Request) {
  if (!(await isOwnerSession())) {
    return NextResponse.json({ ok: false, reason: 'not-signed-in' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const current = typeof body.current === 'string' ? body.current : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const answer = typeof body.answer === 'string' ? body.answer : '';

  if (current.length === 0 || current.length > 200) {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';

  const limit = await readLimit(SCOPE, ip);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'locked-out' }, { status: 429 });
  }

  if (!(await confirmOwnerPassword(current))) {
    const after = await countFailure(SCOPE, ip, MAX_FAILURES, LOCKOUT_MINUTES);

    return NextResponse.json(
      { ok: false, reason: after.allowed ? 'wrong-current' : 'locked-out' },
      { status: after.allowed ? 401 : 429 },
    );
  }

  const problem = passwordProblem(password);
  if (problem) {
    return NextResponse.json({ ok: false, reason: problem }, { status: 400 });
  }

  /*
   * The recovery pair is replaced only when the owner actually filled it in.
   * Checked as a pair: one field without the other would store a question whose
   * answer nobody knows, which is worse than leaving the old pair alone.
   */
  const wantsRecoveryChange = question.length > 0 || answer.length > 0;

  /*
   * An install whose only password came from the environment has no recovery
   * pair yet. Letting it change the password here would create a stored password
   * — which kills the one-time setup link — while still leaving no way back if
   * that password is later forgotten. That is precisely the state this feature
   * was built to end, so it is refused rather than created quietly.
   */
  if (!wantsRecoveryChange && (await storedRecovery()) === null) {
    return NextResponse.json({ ok: false, reason: 'recovery-required' }, { status: 400 });
  }

  if (wantsRecoveryChange) {
    const questionProblemCode = questionProblem(question);
    if (questionProblemCode) {
      return NextResponse.json({ ok: false, reason: questionProblemCode }, { status: 400 });
    }

    const answerProblemCode = answerProblem(answer);
    if (answerProblemCode) {
      return NextResponse.json({ ok: false, reason: answerProblemCode }, { status: 400 });
    }

    await setPasswordWithRecovery(password, question, answer);
  } else {
    await resetPassword(password);
  }

  // The old cookie was signed with the old password's key and no longer
  // verifies. Mint a new one so the person who just changed the password is not
  // thrown out by their own success.
  await createOwnerSession(ip);
  await clearLimit(SCOPE, ip);

  return NextResponse.json({ ok: true, recoveryChanged: wantsRecoveryChange });
}
