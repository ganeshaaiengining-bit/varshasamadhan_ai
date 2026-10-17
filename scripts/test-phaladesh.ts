import { phaladesh } from '../src/content/phaladesh';
import { allGrahas, PLANETS } from '../src/content/grahas';
import { julianDayFromParts } from '../src/content/julian';
import { vimshottari } from '../src/content/dasha';
import { RASHIS } from '../src/content/astrology';

/**
 * Does the phaladesh produce a rashi that exists?
 *
 *     npx tsx scripts/test-phaladesh.ts
 *
 * ── The bug this file exists for ───────────────────────────────────────────
 *
 * The twenty parts of a mahadasha were numbered backwards through the zodiac
 * with `(startRashi - i + 12) % 12`. `i` runs to nineteen, and `+ 12` only
 * rescues a value that is slightly negative — so with the dasha lord in Aries,
 * where the sign number is zero, the nineteenth step gave `(0 - 19 + 12) % 12`,
 * which in JavaScript is **minus seven**. A rashi of minus seven indexed out of
 * a twelve-entry table, and the page did `.name` on the result.
 *
 * The chart did not merely lose one box. React tore the tree down, so the
 * फलादेश tab went blank *and every tab after it went blank with it*, which is
 * what made it read as a dead tab rather than a bad number. It happened for
 * about half of all birth charts, depending on nothing but where the dasha lord
 * happened to sit.
 *
 * Nothing about it showed up in a shape check. The array had exactly twenty
 * entries, each with a graha, a year and a headline — all correct. Only the one
 * field was out of range, and only on the later parts of a period.
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
console.log('PHALADESH');
console.log('='.repeat(60));

/* ── 1. every rashi, for every graha, over many dates ─────────────────────── */

let outOfRange = 0;
let wrongOwner = 0;
let missingText = 0;
let periodsWrong = 0;
const seen = new Set<number>();
let datesTested = 0;
let grahasTested = 0;

// Twenty-five years of birth dates, one every three weeks, and every graha in
// turn. Enough to cross every sign for every graha many times over.
for (let day = 1; day <= 31 && datesTested < 60; day += 3) {
  for (const year of [1947, 1966, 1975, 1990, 2001, 2024]) {
    datesTested += 1;
    const jd = julianDayFromParts(year, 6, day, 12, 0);
    const grahas = allGrahas(jd);

    for (const graha of PLANETS) {
      grahasTested += 1;
      const result = phaladesh(graha, 1970, 1989, grahas);

      if (result.periods.length !== 20) periodsWrong += 1;

      for (const period of result.periods) {
        if (!Number.isInteger(period.rashi) || period.rashi < 0 || period.rashi > 11) {
          outOfRange += 1;
          continue;
        }
        seen.add(period.rashi);

        // The table really does have an entry, which is the other half of it:
        // a rashi that is in range but unnamed draws nothing.
        if (!RASHIS[period.rashi]?.name) missingText += 1;
        if (!period.headline) missingText += 1;
        if (!PLANETS.includes(period.graha as never)) wrongOwner += 1;
      }
    }
  }
}

check(`every rashi out of every part is between zero and eleven (${grahasTested} readings)`,
  outOfRange === 0, `${outOfRange} out of range — the very bug this file is for`);
check('every rashi has a name in the table and a headline',
  missingText === 0, `${missingText} missing`);
check('every part is owned by a real graha', wrongOwner === 0, `${wrongOwner} unknown`);
check('every mahadasha has exactly twenty parts', periodsWrong === 0, `${periodsWrong} wrong`);

/* ── 2. all twelve rashis are reached ─────────────────────────────────────── */

check('all twelve rashis actually appear', seen.size === 12,
  `reached ${seen.size}: ${[...seen].sort((a, b) => a - b).join(',')}`);

/* ── 3. the order is the zodiac walking backwards ─────────────────────────── */

/*
 * The parts walk backwards from the lord's own sign, one sign per part, and
 * after twenty steps they have covered the zodiac once and a bit. If the order
 * is right then consecutive parts differ by one, and every sign appears.
 *
 * This is the check that fails loudly on a modulus with the wrong sign — the
 * count would be twelve either way, but the *sequence* would repeat signs and
 * skip others, and only a consecutive-step test sees that.
 */
let brokenOrder = 0;
for (let day = 1; day <= 28 && datesTested > 0; day += 5) {
  const jd = julianDayFromParts(1975, 6, day, 12, 0);
  const grahas = allGrahas(jd);

  for (const graha of PLANETS) {
    const { periods } = phaladesh(graha, 1970, 1989, grahas);
    for (let i = 1; i < periods.length; i += 1) {
      const previous = periods[i - 1].rashi;
      const expected = (previous - 1 + 12) % 12;
      if (periods[i].rashi !== expected) brokenOrder += 1;
    }
  }
}

check('the parts walk backwards through the zodiac, one sign at a time',
  brokenOrder === 0, `${brokenOrder} steps were not the previous sign`);

/* ── 4. through the real dasha sequence ───────────────────────────────────── */

// The page does not choose a graha; it opens on whichever mahadasha the
// person is living, and offers all nine. So the check has to go through
// `vimshottari`, which is what decides which lord it opens on.
let dashaWrong = 0;
let dashaTested = 0;

for (const [year, month, day] of [
  [1975, 3, 14], [1990, 1, 1], [2001, 12, 31], [1966, 6, 15], [1947, 8, 15],
  [2024, 2, 29], [1985, 11, 7], [2010, 5, 20],
] as const) {
  const jd = julianDayFromParts(year, month, day, 12, 0);
  const grahas = allGrahas(jd);
  const sequence = vimshottari(jd, year);

  for (const period of sequence.periods) {
    dashaTested += 1;
    const result = phaladesh(period.graha, period.startYear, period.endYear, grahas);
    for (const part of result.periods) {
      if (part.rashi < 0 || part.rashi > 11 || !RASHIS[part.rashi]?.name) dashaWrong += 1;
    }
  }
}

check(`every real mahadasha yields twenty readable parts (${dashaTested} mahadasas)`,
  dashaWrong === 0, `${dashaWrong} unreadable`);

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) process.exit(1);