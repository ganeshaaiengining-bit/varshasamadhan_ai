/**
 * ============================================================================
 *  DOES THE SITE ACTUALLY GIVE THE WHOLE ANSWER?
 * ============================================================================
 *
 *     npx tsx scripts/live-test-answer-length.ts
 *
 * ── Why this test exists at all ────────────────────────────────────────────
 *
 * The owner reported that answers arrive half-finished: an aarti or a song comes
 * back as one or two lines. The cause was found by reading the code — a prompt
 * rule asking for "at most 5 short paragraphs" and a 700-token ceiling — and both
 * were changed. But that is a claim about the code, not about the live site, and
 * this project has been bitten more than once by a check that passed for the
 * wrong reason.
 *
 * So this asks the real deployment, over the real route, the way a visitor
 * would: a full Hanuman Chalisa, and then an ordinary question to make sure
 * "give the whole text" did not turn every answer into an essay.
 *
 * ── How it signs in without anybody's password ────────────────────────────
 *
 * The ask route needs a signed-in visitor. Rather than borrow the owner's
 * account (a test that logs in as the owner can change the owner's data if it
 * goes wrong), this creates a throwaway visitor and a session row for it, uses
 * the token as a cookie, and deletes both in a `finally`. Nothing about the
 * owner's row is touched, and the temporary account cannot outlive the run.
 */
import { randomBytes, createHash } from 'node:crypto';
import { prisma } from '../src/server/db';

const SITE = 'https://varsha-samadhan.vercel.app';
const COOKIE = 'vs-session';

const token = randomBytes(24).toString('hex');
const tokenHash = createHash('sha256').update(token).digest('hex');
const handle = `probe-length-${Date.now()}`;

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

async function ask(question: string, lang: string): Promise<{ status: number; body: Record<string, unknown>; ms: number }> {
  const started = Date.now();
  const response = await fetch(`${SITE}/api/ask`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `${COOKIE}=${token}; vs-lang=${lang}`,
    },
    body: JSON.stringify({ question, lang }),
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: response.status, body, ms: Date.now() - started };
}

async function withRetry<T>(label: string, run: () => Promise<T>): Promise<T> {
  let last: unknown;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      last = error;
      console.log(`  ... ${label} attempt ${attempt} failed, retrying`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  throw last;
}

async function main(): Promise<void> {
  await withRetry('connect', () => prisma.$connect());

  const probe = await withRetry('create probe visitor', () =>
    prisma.user.create({
      data: {
        handle,
        name: 'Probe Length',
        passwordHash: 'not-a-real-hash',
        passwordSalt: 'not-a-real-salt',
        language: 'hi',
      },
      select: { id: true },
    }),
  );

  await withRetry('create session', () =>
    prisma.session.create({
      data: {
        tokenHash,
        userId: probe.id,
        expiresAt: new Date(Date.now() + 3600_000),
      },
    }),
  );

  try {
    console.log('\n=== 1. poora Hanuman Chalisa maanga ===');
    const chalisa = await ask('हनुमान चालीसा पूरा लिखिए, दोहा से लेकर अंत के दोहे तक। बीच में कुछ न छोड़िए।', 'hi');

    check('HTTP 200', chalisa.status === 200, `status ${chalisa.status}`);
    check('jawab mila', chalisa.body.ok === true, String(chalisa.body.reasonKey ?? chalisa.body.reason ?? ''));

    const answer = typeof chalisa.body.answer === 'string' ? chalisa.body.answer : '';
    console.log(`  ... provider: ${String(chalisa.body.provider ?? '?')} / ${String(chalisa.body.model ?? '?')}`);
    console.log(`  ... lambai: ${answer.length} akshar`);

    check('jawab 1500 akshar se lamba (aarti jaisa chhota nahi)', answer.length > 1500, `${answer.length}`);
    // A chalisa opens with either the guru doha or "जय हनुमान"; either proves
    // the text starts at the beginning rather than at verse ten.
    check('shuruaat maujood — guru doha / जय हनुमान', /श्री\s*गुरु चरन|जय हनुमान|बाल समय/.test(answer));
    check('beech ka hissa maujood — लंका / सुग्रीव', /लंका|सुग्रीव|जामवंत/.test(answer));
    check('kam se kam 20 panktiyan (chalisa ki tarah lamba)', answer.split('\n').filter((l) => l.trim()).length >= 20,
      `${answer.split('\n').filter((l) => l.trim()).length} panktiyan`);
    check(
      'ant maujood — aakhri doha',
      /संकट\s*हरण/.test(answer) || /हृदय\s*बसहु/.test(answer),
    );
    check('aadha shabd par khatam nahi', /[।॥.!?\)"'”’]\s*$/.test(answer.trim()), JSON.stringify(answer.slice(-40)));
    check('"etc." ya "इत्यादि" se kaam nahi chalaaya', !/\betc\.?|इत्यादि|वगैरह/i.test(answer));
    check('beech me "..." karke chhoda nahi', !/\.\.\.\s*$/m.test(answer) && !answer.includes('…'));

    console.log('\n  --- shuruaat ke 160 akshar ---');
    console.log('  ' + answer.slice(0, 160).replace(/\n/g, ' / '));
    console.log('\n  --- aakhri 120 akshar ---');
    console.log('  ' + answer.slice(-120).replace(/\n/g, ' / '));

    console.log('\n=== 2. aam sawal abhi bhi chhota hai? ===');
    const ordinary = await ask('मुझे दो दिन से हल्की सर्दी और खांसी है, क्या करूँ?', 'hi');
    const ordinaryAnswer = typeof ordinary.body.answer === 'string' ? ordinary.body.answer : '';
    console.log(`  ... lambai: ${ordinaryAnswer.length} akshar`);

    check('aam sawal ka jawab mila', ordinary.body.ok === true, String(ordinary.body.reasonKey ?? ''));
    check('aam jawab chhota hi raha (< 2000 akshar)', ordinaryAnswer.length < 2000, `${ordinaryAnswer.length}`);
    check('aam jawab bhi adhura nahi', ordinaryAnswer.trim().length > 40);

    console.log('\n=== 3. doosri bhasha me bhi pura (Tamil) ===');
    const tamil = await ask('திருக்குறளில் இருந்து ஐந்து குறள்களை எழுதுங்கள்.', 'ta');
    const tamilAnswer = typeof tamil.body.answer === 'string' ? tamil.body.answer : '';
    console.log(`  ... lambai: ${tamilAnswer.length} akshar`);
    check('Tamil jawab mila', tamil.body.ok === true, String(tamil.body.reasonKey ?? ''));
    check('Tamil lipi me hai (angrezi nahi)', /[\u0B80-\u0BFF]/.test(tamilAnswer));
    check('Tamil jawab bhi adhura nahi', tamilAnswer.trim().length > 60);
  } finally {
    /*
     * Clean up, loudly.
     *
     * A probe account left behind is a fake visitor in the owner's counts, and a
     * session left behind is a working key. If either delete fails the run must
     * say so rather than finish looking clean.
     */
    let cleaned = true;
    try {
      await prisma.user.delete({ where: { handle } });
    } catch (error) {
      cleaned = false;
      console.error('  [FAIL] probe visitor delete nahi hua:', error);
    }
    try {
      await prisma.askedQuestion.deleteMany({
        where: {
          question: { in: [
            'हनुमान चालीसा पूरा लिखिए, दोहा से लेकर अंत के दोहे तक। बीच में कुछ न छोड़िए।',
            'मुझे दो दिन से हल्की सर्दी और खांसी है, क्या करूँ?',
            'திருக்குறளில் இருந்து ஐந்து குறள்களை எழுதுங்கள்.',
          ] },
          createdAt: { gte: new Date(Date.now() - 10 * 60_000) },
        },
      });
    } catch (error) {
      cleaned = false;
      console.error('  [FAIL] probe questions delete nahi hue:', error);
    }
    check('probe data saaf ho gaya', cleaned);
  }

  console.log('\n===========================================');
  console.log(`  ${ok} me se ${ok + fail} check pass, ${fail} fail`);
  if (fail > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect().catch(() => undefined));
