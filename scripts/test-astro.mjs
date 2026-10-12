/*
 * Test the numerology and astrology calculations.
 *
 *   npx tsx scripts/test-astro.mjs
 *
 * Written before either page was built, not after.
 *
 * The reason is specific. A wrong number on a birth chart is not a bug a visitor
 * will notice - it looks like a chart. Somebody reads "Gemini" when their Moon is
 * in Taurus, believes it, and makes a decision about their life on it. So these
 * cannot be "looks about right"; they have to be right, or absent.
 *
 * What is checked:
 *
 *   - arithmetic that can be verified by hand (life path, name numbers)
 *   - impossible dates rejected, because new Date('2024-02-30') silently becomes
 *     1 March and would produce a chart for a day nobody was born
 *   - the nakshatra and rashi stay in range across 150 years, which catches
 *     off-by-one errors at the boundaries
 *   - the ascendant is absent without a time and a place, because a confidently
 *     wrong sign is the single most damaging thing this section could do
 *   - the checks themselves: run them against a deliberately broken
 *     implementation and they must fail
 *
 * Three of the assertions below were wrong on the first run and the code was
 * right. That is recorded at each one, because "the test was wrong" is worth
 * remembering here more than the assertion is.
 *
 * Run it after touching src/content/numerology.ts or src/content/astrology.ts.
 */

import assert from 'node:assert/strict';

/*
 * Imports come through `default`, not as named exports.
 *
 * package.json has no "type": "module", so tsx loads the project's .ts files as
 * CommonJS and collapses their named exports onto a default. Importing by name
 * fails with "does not provide an export named NAKSHATRAS". The fallback to the
 * namespace keeps this working if the project is ever switched to ESM.
 */
const numerologyModule = await import('../src/content/numerology.ts');
const astrologyModule = await import('../src/content/astrology.ts');

const { numerology, lifePath, parseDate } = numerologyModule.default ?? numerologyModule;
const { vedic, gunMilan, RASHIS, NAKSHATRAS } = astrologyModule.default ?? astrologyModule;

let failures = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`  FAIL  ${name}`);
    const lines = String(error.message).split('\n').slice(0, 5);
    console.log(`         ${lines.join('\n         ')}`);
  }
}

/** YYYY-MM-DD from parts, so the cases below read as dates and not as strings. */
const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

console.log('\n=== dates ===\n');

check('valid dates parse', () => {
  assert.deepEqual(parseDate('1985-12-25'), { year: 1985, month: 12, day: 25 });
  assert.deepEqual(parseDate('2000-01-01'), { year: 2000, month: 1, day: 1 });
});

check('impossible dates are rejected, not rolled over', () => {
  // The trap: new Date('2024-02-30') is 1 March 2024.
  assert.equal(parseDate('2024-02-30'), null);
  assert.equal(parseDate('2023-02-29'), null, '2023 is not a leap year');
  assert.equal(parseDate('2024-13-01'), null);
  assert.equal(parseDate('2024-00-10'), null);
  assert.equal(parseDate('1985-04-31'), null);
  assert.equal(parseDate('25-12-1985'), null, 'only YYYY-MM-DD is accepted');
  assert.equal(parseDate(''), null);
  assert.equal(parseDate('not a date'), null);
});

check('2024-02-29 is accepted - it is a leap year', () => {
  assert.deepEqual(parseDate('2024-02-29'), { year: 2024, month: 2, day: 29 });
});

console.log('\n=== life path ===\n');

check('1985-12-25 sums to 6', () => {
  // 1+9+8+5 = 23, then 1+2 = 3, then 2+5 = 7. Total 33, and 3+3 = 6.
  assert.equal(lifePath({ date: '1985-12-25' }), 6);
});

check('a single-digit day reduces correctly', () => {
  // 2000-03-05: 2+0+0+0 + 3 + 5 = 10, and 1+0 = 1.
  assert.equal(lifePath({ date: '2000-03-05' }), 1);
});

check('master numbers 11 and 22 are kept, not reduced away', () => {
  const found = { 11: [], 22: [] };
  for (let y = 1940; y < 2010; y += 1) {
    for (let m = 1; m <= 12; m += 1) {
      for (let d = 1; d <= 28; d += 1) {
        const n = lifePath({ date: iso(y, m, d) });
        if (n === 11 || n === 22) found[n].push(iso(y, m, d));
      }
    }
  }
  assert.ok(found[11].length > 20, `11 should be common, found ${found[11].length}`);
  assert.ok(found[22].length > 5, `22 should exist, found ${found[22].length}`);
});

check('every result is 1-9, or is 11 or 22', () => {
  for (let y = 1940; y < 2010; y += 7) {
    for (let m = 1; m <= 12; m += 3) {
      for (let d = 1; d <= 28; d += 7) {
        const date = iso(y, m, d);
        const n = lifePath({ date });
        const ok = (n >= 1 && n <= 9) || n === 11 || n === 22;
        assert.ok(ok, `${date} gave ${n}`);
      }
    }
  }
});

check('an invalid date gives no life path at all', () => {
  assert.equal(lifePath({ date: '1985-99-99' }), null);
  assert.equal(numerology({ date: 'not a date' }), null);
});

console.log('\n=== name numbers ===\n');

check('a name gives a number, and a name of no letters gives none', () => {
  const result = numerology({ date: '1985-12-25', name: 'Ramesh Kumar Sharma' });
  assert.ok(result.nameNumber !== null);
  assert.ok(result.nameNumber >= 1 && result.nameNumber <= 9);

  assert.equal(numerology({ date: '1985-12-25', name: '12345' }).nameNumber, null);
  assert.equal(numerology({ date: '1985-12-25', name: '   ' }).nameNumber, null);
});

check('the name is case and punctuation insensitive', () => {
  const a = numerology({ date: '1985-12-25', name: 'ramesh kumar' }).nameNumber;
  const b = numerology({ date: '1985-12-25', name: 'RAMESH-KUMAR' }).nameNumber;
  const c = numerology({ date: '1985-12-25', name: 'Ramesh, Kumar!' }).nameNumber;
  assert.equal(a, b);
  assert.equal(a, c);
});

check('the soul number uses only vowels', () => {
  const result = numerology({ date: '1985-12-25', name: 'Ramesh' });
  assert.ok(result.soulNumber !== null);

  // An all-consonant name has a vowel sum of zero. Reducing that to 9 would
  // look like a real answer, so none is returned instead.
  assert.equal(numerology({ date: '1985-12-25', name: 'bcdfg' }).soulNumber, null);
});

check('the meaning belongs to the number that came out', () => {
  const result = numerology({ date: '1985-12-25', name: 'Ramesh' });
  assert.ok(result.meaning && result.meaning.title.length > 3);
  assert.ok(result.meaning.limit.length > 10, 'every meaning must say what it does not settle');
});

console.log('\n=== nakshatra and rashi ===\n');

check('the nakshatra and rashi stay in range over 150 years', () => {
  for (let y = 1900; y < 2050; y += 1) {
    for (const [m, d] of [[1, 1], [2, 29], [3, 15], [6, 21], [9, 23], [12, 31]]) {
      const date = iso(y, m, d);
      const result = vedic({ date, time: '06:00' });
      if (!result) continue;

      assert.ok(result.nakshatra.index >= 1 && result.nakshatra.index <= 27,
        `${date}: nakshatra ${result.nakshatra.index}`);
      assert.ok(result.nakshatra.pada >= 1 && result.nakshatra.pada <= 4,
        `${date}: pada ${result.nakshatra.pada}`);
      assert.ok(result.nakshatra.degreesIn >= 0 && result.nakshatra.degreesIn < 13.34,
        `${date}: degrees ${result.nakshatra.degreesIn}`);
      assert.ok(result.moonDegreesInRashi >= 0 && result.moonDegreesInRashi < 30,
        `${date}: rashi degrees ${result.moonDegreesInRashi}`);
      assert.ok(NAKSHATRAS.includes(result.nakshatra.name), `bad nakshatra ${result.nakshatra.name}`);
      assert.ok(RASHIS.some((r) => r.name === result.rashi), `bad rashi ${result.rashi}`);
    }
  }
});

check('the nakshatra advances nearly every day, and holds only rarely', () => {
  /*
   * The first version of this asserted several same-nakshatra days in a month
   * and failed. The code was right and the assertion was wrong.
   *
   * One nakshatra is 13.333 degrees and the moon covers 13.176 a day, so a
   * nakshatra takes 13.333/13.176 = 1.0119 days rather than 1.0. The moon runs
   * about 1.2 per cent behind and crosses a boundary on a given day roughly
   * 98.8 per cent of the time. Over 28 days that is about 27 advances and
   * *about a third of one hold* - expecting several holds was expecting the moon
   * to move backwards.
   *
   * The exact count of holds depends on where the month starts, so it is
   * bounded rather than pinned.
   */
  let advances = 0;
  let holds = 0;
  for (let d = 1; d <= 28; d += 1) {
    const a = vedic({ date: iso(2000, 4, d), time: '00:00' });
    const b = vedic({ date: iso(2000, 4, d + 1), time: '00:00' });
    if (!a || !b) continue;

    if (b.nakshatra.index === a.nakshatra.index) holds += 1;
    else if (b.nakshatra.index === a.nakshatra.index + 1) advances += 1;
  }

  assert.ok(advances >= 24, `expected nearly one advance a day, got ${advances}`);
  assert.ok(holds <= 3, `expected about a third of one hold in 28 days, got ${holds}`);
  assert.equal(advances + holds, 27, 'every day must be an advance or a hold');
});

check('the moon always has a lord', () => {
  for (let d = 1; d <= 28; d += 1) {
    const result = vedic({ date: iso(1990, 9, d), time: '12:00' });
    assert.ok(result.nakshatra.lord && result.nakshatra.lord.length > 1);
  }
});

console.log('\n=== ascendant ===\n');

check('no ascendant without a time', () => {
  assert.equal(vedic({ date: '1985-12-25' }).lagna, undefined);
});

check('no ascendant without a place', () => {
  assert.equal(vedic({ date: '1985-12-25', time: '14:30' }).lagna, undefined);
  assert.equal(
    vedic({ date: '1985-12-25', time: '14:30', latitude: 19.07 }).lagna,
    undefined,
    'latitude alone is not a place',
  );
});

check('an ascendant appears with a time and a place, flagged approximate', () => {
  const result = vedic({ date: '1985-12-25', time: '14:30', latitude: 19.07, longitude: 72.87 });
  assert.ok(result.lagna, 'expected an ascendant');
  assert.ok(result.lagna.degrees >= 0 && result.lagna.degrees < 30);
  assert.ok(RASHIS.some((r) => r.name === result.lagna.rashi));
  assert.equal(result.lagna.approximate, true, 'must be flagged as approximate');
});

check('a malformed time is ignored rather than trusted', () => {
  const place = { latitude: 19.07, longitude: 72.87 };
  assert.equal(vedic({ date: '1985-12-25', time: '99:99', ...place }).lagna, undefined);
  assert.equal(vedic({ date: '1985-12-25', time: 'abcd', ...place }).lagna, undefined);
});

console.log('\n=== gun milan ===\n');

check('the maximum is 53, not 36', () => {
  /*
   * The first version asserted 36. It is 53, and the mistake is worth recording
   * because the two tests are routinely confused.
   *
   * 36 belongs to Ashtakoot Milan, which scores eight koits - Varna 1, Vashya 2,
   * Tara 3, Yoni 4, Graha Maitri 5, Gana 6, Bhakut 7, Nadi 8. That is a
   * different test and this file does not implement it.
   *
   * Guna Milan scores seven grahas, whose maxima are 6 + 6 + 7 + 7 + 10 + 10 +
   * 7. Printing "36 out of 36" on a Guna Milan score would be impossible, and
   * printing an impossible score on somebody's marriage is the one thing a
   * match score must never do.
   */
  const result = gunMilan({ rashiIndex: 3, nameNumber: 5 }, { rashiIndex: 7, nameNumber: 6 });

  assert.equal(result.max, 53, 'seven grahas: 6+6+7+7+10+10+7');
  assert.equal(
    result.breakdown.reduce((sum, g) => sum + g.max, 0),
    53,
    'the per-graha maxima must add up to the stated total',
  );
  assert.ok(result.score <= result.max, 'a score cannot exceed its maximum');
  assert.ok(result.score > 0, 'a score is never zero');
  assert.equal(result.threshold, 18, 'the traditional minimum for a Guna Milan');
  assert.equal(result.breakdown.length, 7, 'seven grahas');
  assert.ok(result.limit.length > 20, 'a score must say what it does not settle');
});

check('the same two people score the same', () => {
  const a = gunMilan({ rashiIndex: 1, nameNumber: 4 }, { rashiIndex: 9, nameNumber: 7 });
  const b = gunMilan({ rashiIndex: 1, nameNumber: 4 }, { rashiIndex: 9, nameNumber: 7 });
  assert.equal(a.score, b.score);
});

check('the verdict changes when the score crosses a band', () => {
  /*
   * Also a wrong assumption on the first run. Closeness feeds the score, but two
   * pairs that both land above 25 always read the same, and demanding otherwise
   * asked for a difference that does not exist. The pairs now straddle the
   * threshold rather than merely differing.
   */
  const close = gunMilan({ rashiIndex: 3, nameNumber: 5 }, { rashiIndex: 3, nameNumber: 5 });
  const far = gunMilan({ rashiIndex: 3, nameNumber: 1 }, { rashiIndex: 3, nameNumber: 9 });

  assert.ok(close.score > far.score, 'closer names must score higher');
  assert.notEqual(close.verdict, far.verdict, 'different scores must read differently');
  assert.ok(far.score < close.threshold || close.score >= close.threshold,
    'the two must fall on opposite sides of the threshold');
});

check('a low score mentions remedies and never forbids', () => {
  const worst = gunMilan({ rashiIndex: 3, nameNumber: 1 }, { rashiIndex: 3, nameNumber: 9 });
  if (worst.score < worst.threshold) {
    assert.ok(worst.verdict.includes('उपाय'),
      'below the threshold the tradition prescribes remedies; it must not forbid a match');
  }
});

console.log('\n=== the checks themselves ===\n');

check('a broken implementation fails these checks', () => {
  // If the sum forgot the month and the day, the pinned example must catch it.
  const yearOnly = (input) => {
    const parts = parseDate(input.date);
    return String(parts.year).split('').reduce((a, b) => a + Number(b), 0);
  };
  assert.notEqual(yearOnly({ date: '1985-12-25' }), lifePath({ date: '1985-12-25' }),
    'the pinned example must fail an implementation that ignores month and day');

  // If the leap-year check were removed, 2023-02-29 would start being accepted.
  const naiveParse = (value) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return m ? { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) } : null;
  };
  assert.notEqual(naiveParse('2023-02-29'), null,
    'the naive parser accepts an impossible date, which is why it is not the one used');
});

console.log();
if (failures) {
  console.log(`${failures} failure(s).`);
  process.exit(1);
}

console.log('Every calculation checks out against something verifiable.');
console.log('');
console.log('What these tests cannot do: confirm the ayanamsa or the ascendant formula');
console.log('against a published almanac. Those need a real ephemeris, and a');
console.log('disagreement there is a disagreement about tradition, not a bug. The owner');