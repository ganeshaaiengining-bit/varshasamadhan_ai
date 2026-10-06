import { NextResponse } from 'next/server';
import { checkOwnerPassword } from '@/server/owner';

/**
 * POST /api/admin/login
 *
 * Exchanges the owner password for a session cookie.
 *
 * The password is never read back, never stored, and never compared anywhere
 * else — this route is the only thing in the app that ever looks at it. A
 * successful attempt sets an `httpOnly` cookie, so the password itself does not
 * linger in browser memory the way it would if it were the credential on every
 * subsequent action.
 *
 * The response says nothing about *which* half of a wrong guess was wrong, and
 * the three refusals are distinct only in a way that helps the owner and tells
 * an attacker nothing: "not configured" is a fact about the deployment, "locked
 * out" says the attempts were counted, and "wrong" is the only answer a guess
 * can earn.
 */

export const dynamic = 'force-dynamic';

interface Body {
  password?: unknown;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length === 0 || password.length > 200) {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const result = await checkOwnerPassword(
    password,
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local',
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: result.reason },
      { status: result.reason === 'no-password-configured' ? 503 : 401 },
    );
  }

  return NextResponse.json({ ok: true });
}

/** DELETE ends the session — the "lock the door" button. */
export async function DELETE() {
  const { endOwnerSession } = await import('@/server/owner');
  await endOwnerSession();
  return NextResponse.json({ ok: true });
}