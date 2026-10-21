/**
 * Live test of the change-password flow, using the owner's real row.
 *
 * ── Why this is careful ─────────────────────────────────────────────────────
 * The owner has already set a password, so his row is the only way into the
 * panel. A test that needs a known password therefore has to borrow that row —
 * and must give it back exactly, whatever happens. So:
 *
 *   1. the whole row is read first, in memory, and never printed;
 *   2. a temporary password is installed;
 *   3. the flow is exercised over real HTTPS against the live site;
 *   4. the original hash, salt, question and answer are written back in a
 *      `finally`, so even a crash in the middle restores them;
 *   5. the restore is verified field by field, and the script fails loudly if
 *      any of them differ.
 *
 * ── What it costs if it goes wrong ──────────────────────────────────────────
 * The owner is locked out until the row is put back — which is why the restore
 * is in a `finally`, why the values stay in this process rather than a file, and
 * why the last thing the script does is check the row matches the copy it took.
 * The whole window is a few seconds.
 */
import { prisma } from '../src/server/db';
import { hashPassword } from '../src/content/password-hash';

const BASE = 'https://varsha-samadhan.vercel.app';
const TEST_PASSWORD = 'varsha-change-test-1';
const TEST_PASSWORD_2 = 'varsha-change-test-2';
const TEST_QUESTION = 'Test sawaal jo wapas badal jaayega?';
const TEST_ANSWER = 'test jawaab';

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

interface Json {
  ok?: boolean;
  reason?: string;
  recoveryChanged?: boolean;
}

async function call(
  path: string,
  body: unknown,
  cookie?: string,
): Promise<{ status: number; data: Json; setCookie: string | null }> {
  const response = await fetch(BASE + path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  });

  let data: Json = {};
  try {
    data = (await response.json()) as Json;
  } catch {
    /* a redirect or an HTML error page: leave data empty */
  }

  return { status: response.status, data, setCookie: response.headers.get('set-cookie') };
}

/** Pull the owner cookie out of a Set-Cookie header. */
function ownerCookieFrom(header: string | null): string | null {
  if (!header) return null;
  const match = /(?:^|,)\s*vs-owner=([^;]+)/.exec(header);
  return match ? `vs-owner=${match[1]}` : null;
}

async function page(path: string, cookie?: string): Promise<{ status: number; html: string }> {
  const response = await fetch(BASE + path, {
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  return { status: response.status, html: await response.text() };
}

async function main(): Promise<void> {
  const before = await prisma.ownerCredential.findUnique({ where: { id: 'owner' } });
  if (!before) {
    console.log('owner row nahi hai — ye test usi par chalta hai. Ruk raha hoon.');
    process.exitCode = 1;
    return;
  }

  const backup = {
    hash: before.hash,
    salt: before.salt,
    question: before.question,
    answerHash: before.answerHash,
    answerSalt: before.answerSalt,
    recoveryAt: before.recoveryAt,
  };

  try {
    // ── Install a password this script knows ────────────────────────────────
    const p = hashPassword(TEST_PASSWORD);
    const q = hashPassword(TEST_ANSWER);
    await prisma.ownerCredential.update({
      where: { id: 'owner' },
      data: {
        hash: p.hash,
        salt: p.salt,
        question: TEST_QUESTION,
        answerHash: q.hash,
        answerSalt: q.salt,
        recoveryAt: new Date(),
      },
    });

    console.log('\n=== 1. login se asli signed cookie ===');
    const login = await call('/api/admin/login', { password: TEST_PASSWORD });
    const cookie = ownerCookieFrom(login.setCookie);
    check('login 200', login.status === 200, String(login.status));
    check('cookie mili', cookie !== null);
    check('signed shape (64 + dot + 64)', cookie !== null && cookie.length === 9 + 129,
      String(cookie?.length));

    console.log('\n=== 2. nakli cookie ab kaam nahi karti ===');
    const forged = await page('/admin', 'vs-owner=' + 'ab'.repeat(32));
    check('/admin par panel nahi', !forged.html.includes('लेख देखें / बदलें'));
    check('login form dikhta hai', forged.html.includes('पासवर्ड'));
    const forgedPage = await page('/admin/pasvard-badal', 'vs-owner=' + 'ab'.repeat(32));
    check('password page bhi nahi khulta',
      !forgedPage.html.includes('अभी वाला पासवर्ड'));

    console.log('\n=== 3. asli cookie se page khulta hai ===');
    const pageHtml = await page('/admin/pasvard-badal', cookie!);
    check('page 200', pageHtml.status === 200, String(pageHtml.status));
    check('form dikhta hai', pageHtml.html.includes('अभी वाला पासवर्ड'));
    check('abhi ka sawaal dikhta hai', pageHtml.html.includes('wapas badal jaayega'));

    console.log('\n=== 4. galat current password ===');
    const wrong = await call('/api/admin/change-password',
      { current: 'galat-password', password: TEST_PASSWORD_2 }, cookie!);
    check('401 wrong-current', wrong.status === 401 && wrong.data.reason === 'wrong-current',
      `${wrong.status} ${JSON.stringify(wrong.data)}`);

    console.log('\n=== 5. sahi current se password badla ===');
    const changed = await call('/api/admin/change-password',
      { current: TEST_PASSWORD, password: TEST_PASSWORD_2 }, cookie!);
    check('200 ok', changed.status === 200 && changed.data.ok === true,
      `${changed.status} ${JSON.stringify(changed.data)}`);
    check('recovery nahi badla', changed.data.recoveryChanged === false);

    const freshCookie = ownerCookieFrom(changed.setCookie);
    check('nayi cookie mili (session re-mint)', freshCookie !== null);

    console.log('\n=== 6. naya password chalta hai, purana nahi ===');
    const newLogin = await call('/api/admin/login', { password: TEST_PASSWORD_2 });
    check('naya password 200', newLogin.status === 200, String(newLogin.status));
    const oldLogin = await call('/api/admin/login', { password: TEST_PASSWORD });
    check('purana password 401', oldLogin.status === 401, String(oldLogin.status));

    console.log('\n=== 7. password badalne se pehle ki cookie mar gayi ===');
    const replayed = await page('/admin', cookie!);
    check('purani cookie se panel nahi', !replayed.html.includes('लेख देखें / बदलें'));
    const stillWorks = await page('/admin', freshCookie!);
    check('nayi cookie se panel khulta hai (!)',
      stillWorks.html.includes('लेख देखें / बदलें') ||
        stillWorks.html.includes('प्रबंधक'));

    console.log('\n=== 8. recovery bhi badal sakte hain ===');
    const recovery = await call('/api/admin/change-password',
      {
        current: TEST_PASSWORD_2,
        password: TEST_PASSWORD_2,
        question: 'Naya test sawaal?',
        answer: 'naya jawaab',
      },
      freshCookie ?? cookie!);
    check('200 aur recoveryChanged', recovery.status === 200 && recovery.data.recoveryChanged === true,
      `${recovery.status} ${JSON.stringify(recovery.data)}`);

    // The change re-minted the session again. Using the previous cookie here
    // would test "does a dead cookie get refused" a second time instead of the
    // half-filled recovery form, which is what the next check is about.
    const afterRecovery = ownerCookieFrom(recovery.setCookie) ?? freshCookie ?? cookie!;

    const recoveryPage = await page('/admin/bhool-gaye');
    check('naya sawaal dikhta hai', recoveryPage.html.includes('Naya test sawaal'));
    check('purana sawaal hat gaya', !recoveryPage.html.includes('wapas badal jaayega'));

    console.log('\n=== 9. adhoora recovery update refuse ===');
    const half = await call('/api/admin/change-password',
      { current: TEST_PASSWORD_2, password: TEST_PASSWORD_2, question: 'sirf sawaal?' },
      afterRecovery);
    check('400 answer-too-short', half.status === 400 && half.data.reason === 'answer-too-short',
      `${half.status} ${JSON.stringify(half.data)}`);

    console.log('\n=== 10. bina session route band ===');
    const anon = await call('/api/admin/change-password',
      { current: TEST_PASSWORD_2, password: 'kuchbhii123' });
    check('401 not-signed-in', anon.status === 401 && anon.data.reason === 'not-signed-in',
      `${anon.status} ${JSON.stringify(anon.data)}`);
  } finally {
    // ── Put the owner's row back, whatever happened above ──────────────────
    await prisma.ownerCredential.update({ where: { id: 'owner' }, data: backup });

    const after = await prisma.ownerCredential.findUnique({ where: { id: 'owner' } });
    const restored =
      after !== null &&
      after.hash === backup.hash &&
      after.salt === backup.salt &&
      after.question === backup.question &&
      after.answerHash === backup.answerHash &&
      after.answerSalt === backup.answerSalt;

    console.log('\n=== owner ki row wapas ===');
    check('hash wapas', after?.hash === backup.hash);
    check('salt wapas', after?.salt === backup.salt);
    check('sawaal wapas', after?.question === backup.question);
    check('jawaab hash wapas', after?.answerHash === backup.answerHash);
    check('jawaab salt wapas', after?.answerSalt === backup.answerSalt);
    check('poori row wapas', restored);

    if (!restored) {
      console.log('\n*** ROW RESTORE NAHI HUI — owner abhi lockout me hai ***');
      process.exitCode = 1;
    }
  }

  console.log('\n===========================================');
  console.log(`  ${ok} me se ${ok + fail} check pass, ${fail} fail`);
  if (fail > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error('Error:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
