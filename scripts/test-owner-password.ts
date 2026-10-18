/*
 * server-only marks a module as one the browser must never import, and it
 * throws the moment something that is not Next tries to load it. That is the
 * right behaviour for the app and the wrong one for a test, so the guard is
 * stood down here and only here — the file under test is still the same file.
 */
import { hashPassword, verifyPassword, passwordProblem } from '../src/content/password-hash';

/**
 * Does the owner's stored password work, and does it stay unreadable?
 *
 *     npx tsx scripts/test-owner-password.ts
 *
 * ── What is worth checking here ──────────────────────────────────────────────
 * The hashing itself is the platform's, and trusting it is reasonable. What is
 * not reasonable is trusting that the *shape* is right — and there are three
 * shapes that go wrong quietly:
 *
 *   1. a hash that verifies against a hash made with a different salt. Two users,
 *      one password, and the second one silently fails to log in forever.
 *   2. a comparison that returns true on a malformed row, which is how a corrupt
 *      database turns into "everybody is logged in".
 *   3. a length rule so strict it rejects a real password, on the owner's own
 *      site, where there is nobody to recover it for them.
 */

let passed = 0;
let failed = 0;

function check(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    passed += 1;
    console.log(`  [ ok ]  ${name}`);
  } else {
    failed += 1;
    console.log(`  [FAIL]  ${name}`);
    if (detail) console.log(`          ${detail}`);
  }
}

console.log();
console.log('THE OWNER PASSWORD');
console.log('='.repeat(64));

{
  const { hash, salt } = hashPassword('varsha-owner-1');

  check('a password verifies against its own hash',
    verifyPassword('varsha-owner-1', hash, salt));
  check('and does not verify against a wrong one',
    !verifyPassword('varsha-owner-2', hash, salt));
}

{
  // The same password twice must give two different hashes and two salts, or the
  // table would leak which owners share a password.
  const a = hashPassword('same-password-here');
  const b = hashPassword('same-password-here');

  check('the same password hashed twice gives two different hashes',
    a.hash !== b.hash);
  check('and two different salts',
    a.salt !== b.salt);
  check('and each still verifies',
    verifyPassword('same-password-here', a.hash, a.salt) &&
    verifyPassword('same-password-here', b.hash, b.salt));
}

{
  // The one that goes wrong quietly: a hash paired with the wrong salt must fail,
  // not pass.
  const a = hashPassword('cross-salt-test');
  const b = hashPassword('cross-salt-test');

  check("a hash checked against another row's salt does not verify",
    !verifyPassword('cross-salt-test', a.hash, b.salt),
    'galat salt se verify ho gaya — iska matlab dono rows mil sakti hain');
}

{
  // A corrupt row must refuse, never open the door.
  const broken = [
    ['khaali', '', ''],
    ['galat length', 'abcd', 'aabb'],
    ['hex nahi hai', 'zzzz', 'aabb'],
    ['salt hi nahi', 'aabb', ''],
  ] as const;

  let bad = 0;
  let detail = '';
  for (const [name, hash, salt] of broken) {
    if (verifyPassword('anything', hash, salt)) {
      bad += 1;
      detail += name + ': verify ho gaya; ';
    }
  }
  check('a broken stored row refuses everyone rather than letting everyone in',
    bad === 0, detail);
}

{
  check('a short password is refused',
    passwordProblem('short') === 'too-short');
  check('an empty one is refused',
    passwordProblem('') === 'too-short');
  check('a sensible one is accepted',
    passwordProblem('varsha-owner-1') === null);
  check('an absurdly long one is refused rather than hashed',
    passwordProblem('x'.repeat(500)) === 'too-long');
}

{
  // The rule has to accept what people actually type. A password with a space,
  // a digit, a bracket and Devanagari is not exotic — it is what an Indian name
  // plus a number looks like, and this used to be the account's only rule.
  const real = [
    'Ganesha 1923',
    'varsha@2026!',
    'माँ का नाम',
    'a b  c   d',
    '12345678',
  ];

  let bad = 0;
  let detail = '';
  for (const password of real) {
    if (passwordProblem(password) !== null) {
      bad += 1;
      detail += JSON.stringify(password) + ': reject; ';
    }
  }
  check('real passwords are not rejected for being real', bad === 0, detail);
}

{
  // Round trip through the exact shape the database stores.
  const { hash, salt } = hashPassword('varsha-owner-1');
  const stored = { hash, salt };

  check('what goes in the table comes back out working',
    verifyPassword('varsha-owner-1', stored.hash, stored.salt));
  check('and the stored form is not the password itself',
    stored.hash !== 'varsha-owner-1' && !stored.hash.includes('varsha'));
}

console.log();
console.log('='.repeat(64));
console.log(`  ${failed === 0 ? 'ok' : 'FAIL'}  ${passed} me se ${passed + failed} check pass, ${failed} fail`);
console.log('='.repeat(64));
console.log();

if (failed > 0) process.exitCode = 1;