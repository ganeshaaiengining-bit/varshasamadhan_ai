/**
 * ============================================================================
 *  SESSION COOKIES — CAN SOMEBODY JUST MAKE ONE?
 * ============================================================================
 *
 *     npx tsx scripts/test-session-signature.ts
 *
 * ── The bug this file exists because of ─────────────────────────────────────
 * `isOwnerSession()` used to accept any sixty-four hex characters. Not "verify
 * a signature"; count characters and match a regular expression. So the answer
 * to "can somebody just make one?" was yes, in a browser console, in one line:
 *
 *     document.cookie = 'vs-owner=' + 'ab'.repeat(32)
 *
 * The comment above that function said the cookie was signed so it could not be
 * forged. It was not signed. Every check in it passed, and none of them involved
 * a secret — which is how a check that looks like a check can protect nothing.
 *
 * ── What is proven here ─────────────────────────────────────────────────────
 * That the exact string that used to work no longer does, that a real cookie
 * stops working when the secret changes (which is what a password change does),
 * and that neither half of a real cookie can be swapped for a different one.
 */
import {
  mintSessionCookie,
  randomSessionValue,
  signSessionValue,
  verifySessionCookie,
} from '../src/content/session-signature';

let ok = 0;
let fail = 0;

function check(name: string, condition: boolean, detail = ''): void {
  if (condition) {
    ok += 1;
    console.log('  [ ok ]', name);
  } else {
    fail += 1;
    console.log('  [FAIL]', name, detail ? '| ' + detail : '');
  }
}

async function main(): Promise<void> {
  const secret = 'a'.repeat(64) + ':' + 'b'.repeat(32);

  console.log('\n=== a real cookie ===');
  const cookie = await mintSessionCookie(secret);
  check('cookie banti hai', typeof cookie === 'string' && cookie.length === 129,
    String(cookie).length + ' akshar');

  const [value, signature] = String(cookie).split('.');
  check('do hisse hain', value.length === 64 && signature.length === 64);
  check('apne secret se verify hoti hai', await verifySessionCookie(String(cookie), secret));

  console.log('\n=== the forgery that used to work ===');
  // Exactly what a visitor could type before: 64 hex characters, no signature.
  const forged = 'ab'.repeat(32);
  check('purana jaadu ab nahi chalta', !(await verifySessionCookie(forged, secret)));
  check('signature ke bina koi bhi 64 hex nahi chalta',
    !(await verifySessionCookie('cd'.repeat(32), secret)));

  console.log('\n=== somebody else\'s secret ===');
  const otherSecret = 'c'.repeat(64) + ':' + 'd'.repeat(32);
  check('doosre secret se verify NAHI hoti',
    !(await verifySessionCookie(String(cookie), otherSecret)));

  console.log('\n=== a changed password ===');
  // The cookie is signed with a key derived from the password hash, so a new
  // password is a new key — and every old session stops verifying. That is the
  // behaviour that lets "change password" mean "sign out everywhere".
  const newPasswordSecret = 'e'.repeat(64) + ':' + 'f'.repeat(32);
  check('password badalne par purani cookie mar jaati hai',
    !(await verifySessionCookie(String(cookie), newPasswordSecret)));

  console.log('\n=== tampering ===');
  const tamperedValue =
    (value[0] === 'a' ? 'b' : 'a') + value.slice(1) + '.' + signature;
  check('value badalne par fail',
    !(await verifySessionCookie(tamperedValue, secret)));

  const tamperedSignature =
    value + '.' + (signature[0] === 'a' ? 'b' : 'a') + signature.slice(1);
  check('signature badalne par fail',
    !(await verifySessionCookie(tamperedSignature, secret)));

  check('signature hata dene par fail',
    !(await verifySessionCookie(value, secret)));
  check('value hata dene par fail',
    !(await verifySessionCookie('.' + signature, secret)));
  check('extra dot fail', !(await verifySessionCookie(String(cookie) + '.', secret)));
  check('khali string fail', !(await verifySessionCookie('', secret)));

  console.log('\n=== the same input signs the same way ===');
  const a = await signSessionValue(value, secret);
  const b = await signSessionValue(value, secret);
  check('signature deterministic hai (warna verify kaise hota)', a === b);

  console.log('\n=== no secret means nobody is signed in ===');
  check('khali secret se cookie nahi banti', (await mintSessionCookie('')) === null);
  check('khali secret se verify false', !(await verifySessionCookie(String(cookie), '')));

  console.log('\n=== two logins are two different cookies ===');
  const first = await mintSessionCookie(secret);
  const second = await mintSessionCookie(secret);
  check('do cookie alag hain', first !== second);
  check('dono valid hain',
    (await verifySessionCookie(String(first), secret)) &&
      (await verifySessionCookie(String(second), secret)));

  console.log('\n=== the random half is actually random ===');
  const seen = new Set<string>();
  for (let i = 0; i < 200; i += 1) seen.add(randomSessionValue());
  check('200 me se 200 alag', seen.size === 200, seen.size + ' alag mile');
  check('hamesha 64 hex', [...seen].every((v) => /^[0-9a-f]{64}$/.test(v)));

  console.log('===========================================');
  console.log(`  ${ok} me se ${ok + fail} check pass, ${fail} fail`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error('Error:', error);
  process.exitCode = 1;
});
