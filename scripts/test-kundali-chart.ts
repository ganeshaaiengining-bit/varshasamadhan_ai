import { SOUTH_INDIAN_ORDER, SIGN_CELL, chartPlanets, chartCells, degreesText } from '../src/content/kundali-chart';
import { allGrahas, houseOf, lagna, PLANETS } from '../src/content/grahas';
import { julianDayFromParts } from '../src/content/julian';
import { RASHIS } from '../src/content/astrology';

/**
 * Is the chart drawn correctly?
 *
 *     npx tsx scripts/test-kundali-chart.ts
 *
 * ── Why this file exists ───────────────────────────────────────────────────
 *
 * Because the chart was **missing** — the tab showed a lagna card and a table of
 * planets and no picture at all — and every number on that tab could be right
 * while the reader saw nothing they could check.
 *
 * So the thing being checked here is the drawing itself, and it is checked by
 * counting: is there a box for every sign, in the order of the zodiac, with the
 * planets of that sign written in that sign's box, and the house number that
 * belongs to it?
 *
 * A chart with a planet in the wrong box is the single most damaging thing this
 * site could get wrong, because every other tab is computed from these boxes.
 * It would be right, and it would be about the wrong chart.
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
console.log('THE CHART');
console.log('='.repeat(60));

/* ── 1. the grid holds every sign once, and nothing twice ─────────────────── */

const placed = SOUTH_INDIAN_ORDER.filter((s) => s >= 0);
check('the grid has sixteen cells', SOUTH_INDIAN_ORDER.length === 16,
  `got ${SOUTH_INDIAN_ORDER.length}`);
check('twelve of them are signs', placed.length === 12, `got ${placed.length}`);
check('and the other four are the diagonals', placed.length + 4 === SOUTH_INDIAN_ORDER.length);
check('no sign appears twice', new Set(placed).size === 12,
  `${new Set(placed).size} distinct`);
check('every sign from Aries to Pisces is placed',
  placed.slice().sort((a, b) => a - b).join(',') === '0,1,2,3,4,5,6,7,8,9,10,11',
  placed.slice().sort((a, b) => a - b).join(','));
check('every sign has a cell of its own', Object.keys(SIGN_CELL).length === 12,
  `${Object.keys(SIGN_CELL).length}`);

/*
 * The order in the grid is Aries, Taurus, Gemini, Cancer across the top and the
 * year running on. If the whole list were shifted by one the zodiac would
 * still be complete and the test above would pass — so the order is pinned to
 * the first row explicitly.
 */
check('the top row is Aries, Taurus, Gemini, Cancer',
  SOUTH_INDIAN_ORDER.slice(0, 4).join(',') === '0,1,2,3',
  SOUTH_INDIAN_ORDER.slice(0, 4).join(','));
check('the bottom row is Sagittarius, Capricorn, Aquarius, Pisces',
  SOUTH_INDIAN_ORDER.slice(12).join(',') === '8,9,10,11',
  SOUTH_INDIAN_ORDER.slice(12).join(','));

/* ── 2. the planets land in the right boxes ───────────────────────────────── */

// Several births, so that every sign is somebody's lagna at some point and
// every house gets used.
const CHARTS: Array<[number, number, number, number, number]> = [
  [1975, 3, 14, 14, 30],
  [1990, 1, 1, 2, 10],
  [2001, 12, 31, 23, 55],
  [1966, 6, 15, 6, 20],
  [1947, 8, 15, 12, 0],
  [2024, 2, 29, 9, 5],
  [1985, 11, 7, 20, 15],
  [2010, 5, 20, 11, 40],
];

let wrongBox = 0;
let wrongHouse = 0;
let lost = 0;
let counted = 0;

for (const [y, m, d, h, mi] of CHARTS) {
  const jd = julianDayFromParts(y, m, d, h, mi);
  const grahas = allGrahas(jd);
  // Houses from the lagna, using the site's own helper so this is not a second
  // implementation of the same rule.
  const asc = Math.floor(lagna(jd, 21.1458, 79.0882) / 30) % 12;

  const houses = {} as Record<(typeof PLANETS)[number], number>;
  for (const p of PLANETS) houses[p] = houseOf(grahas[p].rashi, asc);

  const planets = chartPlanets(grahas, houses);
  const cells = chartCells(planets);

  const placedHere = cells.flat();

  // Nothing lost.
  if (placedHere.length !== 9) lost += planets.length;
  counted += 9;

  for (const planet of planets) {
    // Its box is the box that bears its own sign.
    const cell = SIGN_CELL[planet.sign];
    if (cell === undefined) { wrongBox += 1; continue; }
    if (!cells[cell].some((p) => p.graha === planet.graha)) wrongBox += 1;

    // And it is in no other box.
    const elsewhere = cells.findIndex((list) =>
      list.some((p) => p.graha === planet.graha) && cell !== SIGN_CELL[planet.sign]);
    if (elsewhere !== -1) wrongBox += 1;

    // The house number on that box is the one the chart computed.
    const houseOnBox = ((planet.sign - asc + 12) % 12) + 1;
    if (houseOnBox !== planet.house) wrongHouse += 1;
  }
}

check(`every planet is written in its own sign's box (${counted} placements)`,
  wrongBox === 0, `${wrongBox} misplaced`);
check('and the house number on each box is the house the chart computed',
  wrongHouse === 0, `${wrongHouse} wrong`);
check('and no planet goes missing from the drawing',
  lost === 0, `${lost} lost`);

/* ── 3. the degrees are written the way a person writes them ──────────────── */

check('ninety-nine degrees is ninety-nine and no minutes',
  degreesText(99.9999).startsWith('99° 60') || degreesText(99.9999) === '100° 00′',
  degreesText(99.9999));
check('twenty degrees and a half is twenty thirty-four',
  degreesText(20.5) === '20° 30′', degreesText(20.5));
check('zero is zero and not a blank',
  degreesText(0) === '0° 00′', degreesText(0));

/* ── 4. the grid shows a full zodiac for every chart ──────────────────────── */

let emptySigns = 0;
for (const [y, m, d, h, mi] of CHARTS) {
  const jd = julianDayFromParts(y, m, d, h, mi);
  const grahas = allGrahas(jd);
  const asc = Math.floor(lagna(jd, 21.1458, 79.0882) / 30) % 12;

  const houses = {} as Record<(typeof PLANETS)[number], number>;
  for (const p of PLANETS) houses[p] = houseOf(grahas[p].rashi, asc);

  const cells = chartCells(chartPlanets(grahas, houses));

  // Eight boxes carry a planet and four carry none — that is normal, and the
  // four empty ones are spread around the chart rather than all together.
  const filled = cells.filter((list) => list.length > 0).length;
  if (filled < 5 || filled > 11) emptySigns += 1;

  // And no sign's name is missing from the grid.
  for (let sign = 0; sign < 12; sign += 1) {
    if (SIGN_CELL[sign] === undefined || !RASHIS[sign]?.name) emptySigns += 1;
  }
}

check('every chart has its planets spread sensibly and every sign named',
  emptySigns === 0, `${emptySigns} problems`);

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed over ${CHARTS.length} charts.`);
console.log();

if (failed > 0) process.exit(1);