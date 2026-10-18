import { NextResponse } from 'next/server';

import { passwordProblem, savePassword, setupAlreadyUsed } from '@/server/owner-password';
import { createOwnerSession } from '@/server/owner';

/**
 * POST /api/admin/setup-password
 *
 * The one unauthenticated write on this site, and it is why the link that reaches
 * it is single-use.
 *
 * ── The rule it enforces ─────────────────────────────────────────────────────
 * **Once a password exists, this route is dead.** Not "rate limited", not "ask
 * again later" — dead. A fresh install can set one; an install that already has
 * one cannot, whatever token is presented.
 *
 * That rule is the whole design. It means the moment the owner uses the link,
 * the link has nothing left to authorise, so the token can be left in a chat, a
 * bookmark, a screenshot, or a browser history without mattering afterwards. The
 * dangerous window is the moment before the first password, and closing that
 * window is what makes it acceptable to put the link anywhere at all.
 *
 * ── What it will not do ─────────────────────────────────────────────────────
 * It does not accept a password that is too short, does not log the value, and
 * does not return it. The owner types it, it is hashed on the way in, and it is
 * never readable again by anybody — including by the person who just set it.
 */

export const dynamic = 'force-dynamic';

interface Body {
  token?: unknown;
  password?: unknown;
}

/** Compared in constant time, so a token cannot be found one character at a time. */
function sameToken(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token : '';
  const password = typeof body.password === 'string' ? body.password : '';

  // Checked before the token, deliberately.
  //
  // Order matters only for what the response says, but what the response says is
  // how somebody learns they are done: "already set" is useful, and it is not
  // something an attacker who does not have a valid token learns, because the
  // check below refuses them either way.
  if (await setupAlreadyUsed()) {
    return NextResponse.json({ ok: false, reason: 'already-set' }, { status: 409 });
  }

  const expected = process.env.ADMIN_SETUP_TOKEN ?? '';
  if (expected.length < 16 || !sameToken(token, expected)) {
    return NextResponse.json({ ok: false, reason: 'bad-token' }, { status: 403 });
  }

  const problem = passwordProblem(password);
  if (problem) {
    return NextResponse.json({ ok: false, reason: problem }, { status: 400 });
  }

  await savePassword(password);

  /*
   * Signs them straight in.
   *
   * They have just proved they are the owner by knowing the one token that has
   * never left the owner's hands, so asking them to type the new password again
   * immediately afterwards would be pure friction. The session cookie is the
   * same one a normal login sets, so nothing downstream has to know this route
   * exists.
   */
  await createOwnerSession();

  return NextResponse.json({ ok: true });
}