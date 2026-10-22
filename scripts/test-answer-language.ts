/**
 * Does the site refuse an answer that is in the wrong script?
 *
 *     npx tsx scripts/test-answer-language.ts
 *
 * Run it. Then run scripts/check-ai.py, which asks the live site a Bengali
 * question and reports whether the answer came back in Bengali.
 *
 * WHY A SEPARATE TEST, WHEN check-ai.py ALREADY CHECKS THE SCRIPT
 *
 * Because check-ai.py cannot be relied on to fail. It asks a live question, and
 * the provider answers roughly one time in six, so most runs end with "1 of 3
 * did not answer" whether or not the language check works. A test that usually
 * cannot tell success from failure is not a test of the thing it claims to test.
 *
 * This one is deterministic. It calls the same function the running site calls,
 * with answers written by hand — one correct, one in the wrong script, one
 * empty, one in the right script with English words in it — and asserts what
 * happens to each. It cannot fail for reasons of network or luck.
 *
 * WHAT IS DECIDED HERE, AND WHY IT IS NOT SIMPLER
 *
 *   answersInLanguage(text, code) returns false when:
 *
 *     - the answer is empty
 *     - the answer contains none of the language's own script
 *     - the answer contains any OTHER offered script
 *
 * The third rule is the one that catches the bug. A Bengali question answered
 * in Hindi fails the second rule already. But an answer that opens in Bengali
 * and then continues in Hindi — which is what a model does when it
 * half-follows an instruction — passes the second rule and would be shown to
 * the visitor. The third rule refuses it.
 *
 * Latin letters are counted separately and never count against an answer,
 * because models write "OK" and "SMS" inside Bengali sentences and that is
 * still a Bengali sentence.
 *
 * THE CASE THIS CANNOT CATCH
 *
 * Hindi and Marathi share the Devanagari block. A Marathi question answered in
 * Hindi passes every check here, because there is nothing in the text to tell
 * them apart. That needs a dictionary of each language, not a script range, and
 * it is written down in the function rather than left as a surprise.
 */

import { answersInLanguage } from '../src/server/ai/language';

const cases: Array<{
  name: string;
  text: string;
  language: string;
  expect: boolean;
  why: string;
}> = [
  {
    name: 'a Bengali answer to a Bengali question',
    text: 'প্রথমে মূল সুইচ বন্ধ করে দেখুন। তারপর ব্রেকার ঠিক করুন।',
    language: 'bn',
    expect: true,
    why: 'the ordinary case, which must keep working',
  },
  {
    name: 'a Hindi answer to a Bengali question',
    text: 'सबसे पहले जाँचें कि सर्किट ब्रेकर बंद तो नहीं हुआ।',
    language: 'bn',
    expect: false,
    why: 'the bug this check was written for',
  },
  {
    name: 'Bengali opening, Hindi body',
    text: 'প্রথমে মূল সুইচ দেখুন। फिर मुख्य स्विच ऑफ करें।',
    language: 'bn',
    expect: false,
    why:
      'the rule that makes this more than a script range: a model that half ' +
      'follows the instruction writes the opening in the right script and ' +
      'then drifts, and that used to be shown to the visitor as an answer',
  },
  {
    name: 'a Bengali sentence containing only Latin product words',
    text: 'WhatsApp par nazar nahi aayega. Agar SMS bhi na aaye to masla ho sakta hai.',
    language: 'bn',
    expect: false,
    why:
      'Latin alone is never the problem — a model writing "OK" inside a ' +
      'Bengali sentence has not stopped being Bengali. This answer contains ' +
      'no Bengali script at all, so it is refused for the first reason',
  },
  {
    name: 'a Tamil answer to a Tamil question',
    text: 'முதலில் மின்சார வரும் லீட் ஒடுங்கி இருப்பதைப் பாருங்கள்.',
    language: 'ta',
    expect: true,
    why: 'a different script, so the check is not accidentally Devanagari-only',
  },
  {
    name: 'a Devanagari answer to a Tamil question',
    text: 'सबसे पहले जाँचें कि मुख्य स्विच बंद है या नहीं।',
    language: 'ta',
    expect: false,
    why: 'cross-script refusal, the Tamil case of the Bengali case',
  },
  {
    name: 'a Bengali answer with one English word inside it',
    text: 'প্রথমে মূল সুইচ বন্ধ করুন। এরপর OK বোতামে চাপ দিন।',
    language: 'bn',
    expect: true,
    why:
      'Latin characters are counted separately and never count against an ' +
      'answer, because a model writing "OK" or "SMS" inside a Bengali ' +
      'sentence is still writing Bengali',
  },
  {
    name: 'an empty answer',
    text: '   ',
    language: 'bn',
    expect: false,
    why: 'whitespace is not an answer',
  },
  {
    name: 'an answer with no language code supplied',
    text: 'anything at all',
    language: '',
    expect: true,
    why:
      'no code means nothing to check, and refusing everything would break ' +
      'every caller that has not been updated yet',
  },
  {
    name: 'an answer to a language the site does not offer',
    text: 'कुछ भी',
    language: 'xx',
    expect: true,
    why: 'unknown codes are not judged rather than guessed at',
  },
  {
    name: 'a Marathi answer to a Marathi question',
    text: 'पहिल्यांदा मुख्य स्विच बंद आहे का ते तपासा.',
    language: 'mr',
    expect: true,
    why: 'Marathi must work on its own terms',
  },
];
/*
 * A language that exists in the switcher but has no script entry is the bug
 * this file exists to prevent. answersInLanguage returns true for an unknown
 * code, so a missing entry means no check at all, silently.
 *
 * Every case below proves the guard is live for that language: a Devanagari
 * answer must be refused, and an answer in the language's own script must be
 * allowed. Both halves matter. A missing entry passes the second and fails the
 * first, so a test that checked only the second would have missed it entirely.
 *
 * This list is the offered set from LANGUAGES in src/content/i18n.ts. An earlier
 * version listed Assamese and Odia, reported two failures, and was wrong — the
 * site does not offer them. A test that checks a language the site has no way
 * to receive is a test of the test.
 */
const WRONG_PLACEHOLDER = '';

/*
 * Each entry is checked twice: an answer in the language's own script must be
 * allowed, and an answer in a script it does not use must be refused.
 *
 * Both halves matter, and they fail in opposite directions. A language with no
 * entry in SCRIPTS returns true for everything, so it passes the first and
 * fails the second — the second is what catches it. A language whose range was
 * written too narrow fails the first.
 *
 * The wrong answer is per language because no single wrong script exists: the
 * Devanagari block is correct for Hindi and Marathi, and the Latin block is
 * correct for five European languages. What is left cannot be wrong for
 * everyone at once, and a check that skips two languages is a check that has
 * quietly stopped checking.
 */
type CoverageEntry = {
  code: string;
  script: string;
  /** A real answer in this language's own script. */
  own: string;
  /** A real answer in a script this language does not use. */
  wrong: string;
};

const coverage: CoverageEntry[] = [
  { code: 'hi', script: 'Devanagari', own: 'वर्षा समाधान एक मुफ्त सेवा है।' , wrong: 'ভার্ষা সমাধান একটি বিনামূল্যের সেবা।' },
  { code: 'mr', script: 'Devanagari', own: 'वर्षा समाधान ही एक मोफत सेवा आहे।' , wrong: 'ভার্ষা সমাধান একটি বিনামূল্যের সেবা।' },
  { code: 'bn', script: 'Bengali', own: 'বর্ষা সমাধান একটি বিনামূল্যের সেবা।' , wrong: 'वर्षा समाधान एक मुफ्त मदत सेवा है।' },
  { code: 'ta', script: 'Tamil', own: 'வர்ஷா சமாதானம் ஒரு இலவச சேவை.' , wrong: 'వర్షా సమాధాన్ ఒక ఉచిత సేవ.' },
  { code: 'te', script: 'Telugu', own: 'వర్షా సమాధాన్ ఒక ఉచిత సేవ.' , wrong: 'வர்ஷா சமாதானம் ஒரு இலவச சேவை.' },
  { code: 'kn', script: 'Kannada', own: 'ವರ್ಷ ಸಮಾಧಾನ ಉಚಿತ ಸೇವೆ.' , wrong: 'வர்ஷா சமாதானம் ஒரு இலவச சேவை.' },
  { code: 'ml', script: 'Malayalam', own: 'വർഷ സമാധാനം സൗജന്യ സേവനം.' , wrong: 'ವರ್ಷ ಸಮಾಧಾನ ಉಚಿತ ಸೇವೆ.' },
  { code: 'gu', script: 'Gujarati', own: 'વર્ષા સમાધાન એ મફત સેવા છે.' , wrong: 'ਵਰਸ਼ਾ ਸਮਾਧਾਨ ਇੱਕ ਮੁਫ਼ਤ ਸੇਵਾ ਹੈ।' },
  { code: 'pa', script: 'Gurmukhi', own: 'ਵਰਸ਼ਾ ਸਮਾਧਾਨ ਇੱਕ ਮੁਫ਼ਤ ਸੇਵਾ ਹੈ।' , wrong: 'વર્ષા સમાધાન એ મફત સેવા છે.' },
  { code: 'ur', script: 'Arabic', own: 'ورشا سمادھان ایک مفت خدمت ہے۔' , wrong: 'वर्षा समाधान एक मुफ्त मदत सेवा है।' },
  { code: 'ar', script: 'Arabic', own: 'ورشا سمادھان خدمة مجانية.' , wrong: 'वर्षा समाधान एक मुफ्त मदत सेवा है।' },
  { code: 'en', script: 'Latin', own: 'Varsha Samadhan is a free service.' , wrong: 'Варша Самадхан — это бесплатная служба.' },
  { code: 'es', script: 'Latin', own: 'Varsha Samadhan es un servicio gratuito.' , wrong: 'Варша Самадхан — это бесплатная служба.' },
];


let passed = 0;
let failed = 0;

console.log('Answer language check');
console.log();

for (const test of cases) {
  const got = answersInLanguage(test.text, test.language || undefined);
  const ok = got === test.expect;

  if (ok) {
    passed += 1;
    console.log(`  [ ok ]  ${test.name}`);
  } else {
    failed += 1;
    console.log(`  [FAIL]  ${test.name}`);
    console.log(`          expected ${test.expect}, got ${got}`);
  }
  console.log(`          ${test.why}`);
  console.log();
}

/*
 * For each offered language, two answers: one in that language's own script,
 * which must be allowed, and one in Devanagari, which must be refused.
 *
 * Devanagari is the wrong script everywhere except Hindi and Marathi, which is
 * the point. A missing entry returns true, so it would allow the Devanagari
 * answer, and this loop fails on that alone — no need to work out which script
 * each language ought to be using in order to catch the real bug.
 */
console.log('Every offered language is actually being checked');
console.log();

for (const { code, script, own, wrong } of coverage) {
  const allowsOwn = answersInLanguage(own, code);
  const refusesWrong = answersInLanguage(wrong, code) === false;

  if (allowsOwn && refusesWrong) {
    passed += 1;
    console.log(`  [ ok ]  ${code.padEnd(3)} ${script.padEnd(10)} own script allowed, wrong script refused`);
  } else {
    failed += 1;
    if (!allowsOwn) {
      console.log(`  [FAIL]  ${code.padEnd(3)} ${script.padEnd(10)} refused its own script`);
    }
    if (!refusesWrong) {
      console.log(`  [FAIL]  ${code.padEnd(3)} ${script.padEnd(10)} accepted a wrong-script answer`);
      console.log('          this language has no entry in SCRIPTS, so nothing is checked');
    }
  }
}

console.log();
console.log('-'.repeat(60));
console.log();

if (failed > 0) {
  console.log(`${failed} of ${passed + failed} checks failed.`);
  console.log();
  console.log('An answer in the wrong script must never reach a visitor. It is the');
  console.log('one failure they cannot do anything with, and the one that looks');
  console.log('most like success.');
  process.exit(1);
}

console.log(`All ${passed} cases passed.`);
console.log();
console.log('Still worth running: python scripts/check-ai.py');
console.log('It asks the live site, and this test cannot.');
