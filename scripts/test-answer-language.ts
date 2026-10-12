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

console.log('-'.repeat(60));
console.log();

if (failed > 0) {
  console.log(`${failed} of ${cases.length} cases failed.`);
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
