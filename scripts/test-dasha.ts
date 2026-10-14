/**
 * Is the dasha sequence right?
 *
 *     npx tsx scripts/test-dasha.ts
 *
 * WHAT IS CHECKED, AND WHY EACH ONE
 *
 * The total is 120 years. Not an approximate tradition but an arithmetic
 * identity: 7+20+6+10+7+18+16+19+17. A sequence that runs to 118 or 122 is
 * wrong in a way that shifts every later period, and it would still look
 * entirely plausible on the page.
 *
 * The order is fixed and starts from Ketu going forward. A sequence that runs
 * backwards, or that starts from Venus by mistake, produces a full-length chart
 * with every label wrong — which is the failure a page cannot show to itself.
 *
 * The Moon decides the first graha, and two births in the same nakshatra must
 * agree while two in different ones must not. That is the one property that
 * ties the astronomy in grahas.ts to the dasha in dasha.ts; if the Moon's
 * position drifts, this is where it shows.
 *
 * The first period starts before the birth when the person is born partway
 * through it, and the amount before the birth is the antardasha they had.
 */

import { vimshottari, DASHA_ORDER } from '../src/content/dasha';
import { allGrahas } from '../src/content/grahas';
import { julianDayFromParts } from '../src/content/julian';

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

const BIRTHS = [
  { year: 1975, month: 3, day: 14, hour: 10, minute: 30, place: 'Mumbai' },
  { year: 1990, month: 11, day: 22, hour: 6, minute: 15, place: 'Delhi' },
  { year: 1962, month: 1, day: 31, hour: 23, minute: 45, place: 'Chennai' },
  { year: 2001, month: 12, day: 25, hour: 14, minute: 5, place: 'Kolkata' },
  { year: 1988, month: 7, day: 4, hour: 3, minute: 40, place: 'Pune' },
  { year: 1948, month: 9, day: 2, hour: 18, minute: 20, place: 'Jaipur' },
];

console.log();
console.log('Vimshottari dasha');
console.log('='.repeat(52));
console.log();

// ── the sequence is the fixed one ───────────────────────────────────────────
check(
  'the order is Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury',
  DASHA_ORDER.join(',') ===
    'ketu,venus,sun,moon,mars,rahu,jupiter,saturn,mercury',
  `got ${DASHA_ORDER.join(',')}`,
);

const LENGTHS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
const TOTAL = LENGTHS.reduce((a, b) => a + b, 0);

check(
  'the nine periods add up to 120 years',
  TOTAL === 120,
  `got ${TOTAL}`,
);

// ── and every chart reproduces it ───────────────────────────────────────────
let wrongSpan = '';
let wrongStart = '';

for (const birth of BIRTHS) {
  const jd = julianDayFromParts(
    birth.year, birth.month, birth.day, birth.hour, birth.minute,
  );
  const chart = vimshottari(jd, birth.year);

  if (chart.periods.length !== 9) {
    wrongSpan += `${birth.year}: ${chart.periods.length} periods. `;
    continue;
  }

  const span = chart.periods[8].endYear - chart.periods[0].startYear;
  if (Math.abs(span - 120) > 0.01) {
    wrongSpan += `${birth.year}: span ${span.toFixed(2)}. `;
  }

  // Nakshatra 1 is Ashwini, which is Ketu's, and the rest run in the fixed
  // order. Read from the Moon rather than from the period, or the check is a
  // restatement of the code rather than a check on it.
  const nakshatra = allGrahas(jd).moon.nakshatra;
  const expectedStep = (nakshatra - 1) % 9;
  const first = chart.periods[0];
  if (first.step !== expectedStep) {
    wrongStart += `${birth.year}: Moon in nakshatra ${nakshatra} should give step ${expectedStep}, got ${first.step} (${first.graha}). `;
  }
}

check(
  'every chart spans exactly 120 years',
  wrongSpan === '',
  wrongSpan || 'six births, all exactly 120',
);

check(
  'the first graha is the one the Moon is in',
  wrongStart === '',
  wrongStart || 'six births, all consistent',
);

// ── the order within each chart is consecutive ──────────────────────────────
let wrongOrder = '';
for (const birth of BIRTHS) {
  const jd = julianDayFromParts(
    birth.year, birth.month, birth.day, birth.hour, birth.minute,
  );
  const chart = vimshottari(jd, birth.year);

  chart.periods.forEach((period, i) => {
    const want = (chart.periods[0].step + i) % 9;
    if (period.step !== want) {
      wrongOrder += `${birth.year} period ${i}: step ${period.step}, want ${want}. `;
    }
  });
}
check(
  'each period is the next one in the fixed order',
  wrongOrder === '',
  wrongOrder || 'six charts, fifty-four periods',
);

/*
 * ── a birth partway through a dasha starts before it ────────────────────────
 *
 * The first version of this check asked for a mixture: some births beginning
 * before the birth year and some after. That is impossible. A chart never
 * begins at a boundary — the graha whose turn it is has been running since
 * before the person was born, and how far in depends on the Moon — so every
 * one of them starts before, by somewhere between nothing and that graha's full
 * term.
 *
 * The real property worth checking is that the balance stays inside the term.
 * A birth must not start before the start of its own dasha, and must not have
 * the whole of it already spent.
 */
const LENGTHS_BY_GRAHA: Record<string, number> = {
  ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7,
  rahu: 18, jupiter: 16, saturn: 19, mercury: 17,
};

let wrongBalance = '';
let balanceAtBirth = 0;

for (const birth of BIRTHS) {
  const jd = julianDayFromParts(
    birth.year, birth.month, birth.day, birth.hour, birth.minute,
  );
  const chart = vimshottari(jd, birth.year);
  const first = chart.periods[0];

  const spent = birth.year - first.startYear;
  const term = LENGTHS_BY_GRAHA[first.graha];
  balanceAtBirth += spent;

  if (spent < 0) {
    wrongBalance += `${birth.year}: starts ${Math.abs(spent).toFixed(1)}y after the birth. `;
  }
  if (spent > term) {
    wrongBalance += `${birth.year}: ${spent.toFixed(1)}y spent of a ${term}y term. `;
  }
}

check(
  'every birth lands inside the term it was born in',
  wrongBalance === '',
  wrongBalance || `six births, average ${(balanceAtBirth / BIRTHS.length).toFixed(1)} years already spent`,
);

check(
  'no birth lands on a boundary by accident',
  balanceAtBirth > 0,
  'every single birth began at the very start of its dasha, which does not happen',
);

// ── the current dasha is the one the years fall in ──────────────────────────
let wrongCurrent = '';
for (const birth of BIRTHS) {
  const jd = julianDayFromParts(
    birth.year, birth.month, birth.day, birth.hour, birth.minute,
  );
  const chart = vimshottari(jd, birth.year);
  const now = chart.current;

  if (!now) {
    wrongCurrent += `${birth.year}: no current dasha. `;
    continue;
  }

  // The periods are in absolute years, so the check is too. The age is
  // birth-relative and belongs on the page, not in a comparison.
  const year = birth.year + chart.age;
  if (year < now.startYear || year >= now.endYear) {
    wrongCurrent += `${birth.year}: year ${year} outside ${now.startYear.toFixed(1)}–${now.endYear.toFixed(1)}. `;
  }
}
check(
  'the running dasha is the one the birth year falls in',
  wrongCurrent === '',
  wrongCurrent || 'six births, all consistent',
);

// ── periods do not overlap ──────────────────────────────────────────────────
let overlap = '';
for (const birth of BIRTHS) {
  const jd = julianDayFromParts(
    birth.year, birth.month, birth.day, birth.hour, birth.minute,
  );
  const chart = vimshottari(jd, birth.year);

  for (let i = 1; i < chart.periods.length; i += 1) {
    if (Math.abs(chart.periods[i].startYear - chart.periods[i - 1].endYear) > 0.01) {
      overlap += `${birth.year}: gap or overlap between period ${i - 1} and ${i}. `;
    }
  }
}
check(
  'no gap and no overlap between periods',
  overlap === '',
  overlap || 'six charts, all contiguous',
);

console.log('-'.repeat(52));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) {
  console.log('A dasha of the wrong length still looks like a dasha.');
  console.log();
  process.exit(1);
}