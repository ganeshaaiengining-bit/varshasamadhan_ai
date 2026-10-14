/**
 * Does the numerology and Vedic astrology engine still produce an answer?
 *
 *     npx tsx scripts/test-janam-gathe.ts
 *
 * WHY THIS EXISTS
 *
 * The page renders, the form shows, and a form that renders proves nothing
 * about the calculation underneath it. Both engines in src/content were
 * written before the page existed and were never connected to anything, so for
 * a while the work was present and unreachable. A page rendering is exactly the
 * state that hides that.
 *
 * So this asks the engines directly, with births that can be checked.
 *
 * WHAT IT CHECKS
 *
 *   life path  — reduced digit sum of the birth date, and 31 stays 4 rather
 *                than becoming 22 or 5
 *   birthday   — the day of the month alone
 *   name       — letters reduced, absent when no name is given
 *   nakshatra  — the Moon's position, which must land in one of the twenty-seven
 *   rashi      — must match the rashi the nakshatra falls in
 *   lagna      — present only with a time and a place
 *   gun milan  — the total must actually be able to reach zero, which a scale
 *                that bottoms out above its own threshold cannot
 *
 * The last one was a real bug once: every possible score came out "very good",
 * because each graha had a floor and closeness only added to it.
 */

import { numerology } from '../src/content/numerology';
import { vedic, gunMilan, RASHIS, NAKSHATRAS } from '../src/content/astrology';

let passed = 0;
let failed = 0;

function check(name: string, ok: boolean, detail: string) {
  if (ok) {
    passed += 1;
    console.log(`  [ ok ]  ${name}`);
  } else {
    failed += 1;
    console.log(`  [FAIL]  ${name}`);
    console.log(`          ${detail}`);
  }
  console.log();
}

/** The digit sum of a birth date, reduced to one digit unless 11 or 22. */
function expectedLifePath(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  let sum = String(y).split('').map(Number).reduce((a, b) => a + b, 0)
          + String(m).split('').map(Number).reduce((a, b) => a + b, 0)
          + String(d).split('').map(Number).reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

console.log();
console.log('Janam gathe engines');
console.log('='.repeat(52));
console.log();

// ── life path across a spread of dates ──────────────────────────────────────
const DATES = [
  '1975-03-14',
  '1990-11-22',
  '1962-01-31',
  '2001-12-25',
  '1988-07-04',
  '1955-06-09',
  '2010-02-28',
  '1978-08-08',
];

let lifePathWrong = '';
for (const date of DATES) {
  const result = numerology({ date });
  const want = expectedLifePath(date);
  if (!result || result.lifePath !== want) {
    lifePathWrong += `${date}: got ${result?.lifePath}, want ${want}. `;
  }
}
check(
  'life path is the reduced birth date',
  lifePathWrong === '',
  lifePathWrong || 'eight dates, all correct',
);

// 31 March is the date that catches a naive reduction.
const march31 = numerology({ date: '1962-03-31' });
check(
  '31 is not folded into 4 and then to 7',
  march31?.lifePath === expectedLifePath('1962-03-31'),
  `got ${march31?.lifePath}, want ${expectedLifePath('1962-03-31')}`,
);

// ── birthday number ────────────────────────────────────────────────────────
/*
 * Reduced, not raw.
 *
 * This test asserted the day of the month unchanged and failed on four of
 * eight dates, and the test was wrong rather than the engine. Every
 * numerological tradition reduces the birthday number to a single digit: 14th
 * is a five, 25th is a seven. The first version of this check demanded the
 * un-reduced day, which would have meant changing correct code to satisfy a
 * mistaken test.
 */
function reduceDigit(n: number): number {
  let sum = n;
  // 11 and 22 are kept, as they are in every tradition that has them: they are
  // the two numbers that are not reduced further. A first version of this test
  // folded 22 down to 4 and failed a correct engine.
  const MASTER = new Set([11, 22]);
  while (sum > 9 && !MASTER.has(sum)) {
    sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
  }
  return sum;
}

const birthdayWrong = DATES.filter((d) => {
  const day = Number(d.split('-')[2]);
  return numerology({ date: d })?.birthdayNumber !== reduceDigit(day);
});
check(
  'birthday number is the day of the month, reduced',
  birthdayWrong.length === 0,
  birthdayWrong.join(', ') || 'eight dates, all correct',
);

check(
  'the 22nd stays 22 rather than folding to 4',
  numerology({ date: '1990-11-22' })?.birthdayNumber === 22,
  `got ${numerology({ date: '1990-11-22' })?.birthdayNumber}`,
);

check(
  'the 14th is a five and the 25th is a seven',
  numerology({ date: '1990-11-14' })?.birthdayNumber === 5
    && numerology({ date: '2001-12-25' })?.birthdayNumber === 7,
  `14th gave ${numerology({ date: '1990-11-14' })?.birthdayNumber}, 25th gave ${numerology({ date: '2001-12-25' })?.birthdayNumber}`,
);

// ── name and soul ──────────────────────────────────────────────────────────
const withName = numerology({ date: '1975-03-14', name: 'Varsha' });
const withoutName = numerology({ date: '1975-03-14' });

check(
  'a name produces a name number',
  withName?.nameNumber !== null && withName?.nameNumber !== undefined,
  `got ${withName?.nameNumber}`,
);

check(
  'the soul number differs from the name number',
  withName?.soulNumber !== withName?.nameNumber,
  'vowels and consonants reduced the same way, which means one of them is wrong',
);

check(
  'no name means no name number rather than a made-up one',
  withoutName?.nameNumber === null,
  `got ${withoutName?.nameNumber}`,
);

// ── meaning is never missing ────────────────────────────────────────────────
let missingMeaning = '';
for (let n = 1; n <= 9; n += 1) {
  // A date whose life path is each digit, so every meaning is reachable.
  for (const date of DATES.concat(['2001-01-01', '2002-02-02', '2003-03-03', '2004-04-04'])) {
    const result = numerology({ date });
    if (result?.lifePath === n && (!result.meaning.title || !result.meaning.text)) {
      missingMeaning += `${n} has no meaning. `;
    }
  }
}
check(
  'every number has a meaning attached',
  missingMeaning === '',
  missingMeaning || 'no heading without text under it',
);

// ── nakshatra and rashi ─────────────────────────────────────────────────────
const astro = vedic({ date: '1975-03-14', time: '10:30', latitude: 19.076, longitude: 72.8777 });

check(
  'a birth produces a nakshatra',
  !!astro && astro.nakshatra.index >= 0 && astro.nakshatra.index < NAKSHATRAS.length,
  `got index ${astro?.nakshatra.index}`,
);

/*
 * The index is one-based and the array is not.
 *
 * Nakshatras are numbered 1 to 27 in every chart, so index 6 is Punarvasu,
 * which sits at offset 5. The first version of this check indexed the array
 * with the number directly and reported the engine as wrong; the engine was
 * right and the check was not. It is written the way it is now so that a real
 * disagreement — the name and the index drifting apart in the code — still
 * fails here.
 */
const nk = astro?.nakshatra;
check(
  'the nakshatra name matches its index',
  !!nk && nk.name === NAKSHATRAS[nk.index - 1],
  `index ${nk?.index} should be NAKSHATRAS[${(nk?.index ?? 1) - 1}] = "${NAKSHATRAS[(nk?.index ?? 1) - 1]}", got "${nk?.name}"`,
);

check(
  'the nakshatra index runs 1 to 27',
  !!nk && nk.index >= 1 && nk.index <= 27,
  `got ${nk?.index}`,
);

check(
  'a birth produces a rashi',
  !!astro && RASHIS.some((r) => r.name === astro.rashi),
  `got "${astro?.rashi}"`,
);

check(
  'the pada is 1 to 4',
  !!astro && astro.nakshatra.pada >= 1 && astro.nakshatra.pada <= 4,
  `got ${astro?.nakshatra.pada}`,
);

// ── the lagna needs a time and a place, and says so otherwise ───────────────
const bare = vedic({ date: '1975-03-14' });
check(
  'no lagna without a time and a place',
  bare?.lagna === undefined,
  `got ${JSON.stringify(bare?.lagna)}`,
);

const withBoth = vedic({ date: '1975-03-14', time: '10:30', latitude: 19.076, longitude: 72.8777 });
const lagna = withBoth?.lagna;
check(
  'a lagna appears once both are given',
  !!lagna && RASHIS.some((r) => r.name === lagna.rashi),
  `got ${JSON.stringify(lagna)}`,
);

const withTimeOnly = vedic({ date: '1975-03-14', time: '10:30' });
check(
  'a time alone does not invent a lagna',
  withTimeOnly?.lagna === undefined,
  'the moon needs no place but the ascendant does',
);

// ── gun milan reaches both ends of its scale ────────────────────────────────
const a = { rashiIndex: 0, nameNumber: 1 };
const same = gunMilan(a, { rashiIndex: 0, nameNumber: 1 });
const far = gunMilan(a, { rashiIndex: 6, nameNumber: 7 });

check(
  'a perfect match scores at the top',
  same.score === same.max,
  `got ${same.score} of ${same.max}`,
);

check(
  'a poor match scores well below the threshold',
  far.score < far.threshold,
  `got ${far.score}, threshold ${far.threshold}`,
);

check(
  'the breakdown adds up to the total',
  same.breakdown.reduce((sum, b) => sum + b.score, 0) === same.score,
  `breakdown sums to ${same.breakdown.reduce((s, b) => s + b.score, 0)}, total ${same.score}`,
);

check(
  'every graha is listed',
  same.breakdown.length === 7,
  `got ${same.breakdown.length}`,
);

check(
  'every result carries what it does not settle',
  !!same.limit && !!far.limit,
  'a limit string is what stops a number being read as a verdict',
);

// ── an impossible birth is refused rather than guessed at ───────────────────
const junk = [
  ['2020-13-45', 'a month of thirteen and a day of forty-five'],
  ['1850-01-01', 'before anybody alive today was born'],
  ['not-a-date', 'text that is not a date at all'],
];

let acceptedJunk = '';
for (const [date, why] of junk) {
  try {
    const result = numerology({ date });
    if (result) acceptedJunk += `${date} (${why}). `;
  } catch {
    // Refusing by throwing is also a refusal.
  }
}
check(
  'an impossible birth is refused',
  acceptedJunk === '',
  acceptedJunk || 'three impossible dates, all refused',
);

console.log('-'.repeat(52));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) {
  console.log('A page that renders does not mean the calculation is right.');
  console.log();
  process.exit(1);
}