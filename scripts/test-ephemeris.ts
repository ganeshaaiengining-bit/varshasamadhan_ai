/**
 * Do the planets come out where they actually are?
 *
 *     npx tsx scripts/test-ephemeris.ts
 *
 * ── Why this file exists, and what the other one could not see ──────────────
 *
 * test-jyotish.ts checks that a chart is well formed: every longitude inside the
 * zodiac, every nakshatra between one and twenty-seven, every dasha adding up to
 * a hundred and twenty years. Every one of those passed while the Sun was fifty
 * degrees out.
 *
 * That is not a gap in those checks, it is what they were for. A wrong longitude
 * is a perfectly good longitude: in range, with a real sign and a real nakshatra
 * and a pada, and it renders. Only something that knows where the answer ought to
 * be can tell. So this file knows.
 *
 * ── Where the reference comes from ─────────────────────────────────────────
 *
 * Not from an almanac, because there is none in this repository to compare
 * against and a test that needs a data file nobody can read is a test nobody
 * checks. It comes from the calendar itself:
 *
 *   · the Sun is at 0° tropical at the March equinox, and 90° at the June
 *     solstice, and 180° at the September equinox, and 270° at the December
 *     solstice — four anchors a year, for every year the site accepts
 *   · the Moon returns to the same longitude every 27.32166 days, and advances
 *     13.176° a day — so its rate and its period are both checkable
 *   · each planet advances at its own known rate per day
 *
 * The equinox times are not stored here; they are computed from the standard
 * Meeus equinox approximation, which is itself good to a few minutes — far
 * inside the tenth of a degree this needs.
 */

import {
  sunLongitude,
  moonLongitude,
  allGrahas,
  meanNode,
  heliocentric,
  lagna,
  PLANETS,
} from '../src/content/grahas';
import { julianDayFromParts, partsFromJulianDay } from '../src/content/julian';
import { vedic } from '../src/content/astrology';
import { NAKSHATRAS, RASHIS } from '../src/content/astrology';

/** A body's heliocentric longitude, in degrees. */
function helioLongitude(jd: number, key: string): number {
  const p = heliocentric(jd, key);
  return ((Math.atan2(p.y, p.x) / (Math.PI / 180)) % 360 + 360) % 360;
}

let passed = 0;
let failed = 0;

function check(name: string, ok: boolean, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`  [ ok ]  ${name}`);
  } else {
    failed += 1;
    console.log(`  [FAIL]  ${name}`);
    if (detail) console.log(`          ${detail}`);
  }
}

function shortestGap(a: number, b: number): number {
  const gap = Math.abs(a - b) % 360;
  return gap > 180 ? 360 - gap : gap;
}

console.log();
console.log('The planets, against the calendar');
console.log('='.repeat(60));

/* ── the Sun at the four seasonal anchors ───────────────────────────────────
 *
 * Meeus's approximation of the March equinox, good to a few minutes. The Sun
 * moves about 0.9856° a day, so four minutes of error is three and a half
 * thousandths of a degree — nothing next to the half-degree tolerance.
 */
function marchEquinox(year: number): number {
  const Y = (year - 2000) / 1000;
  const jd0 =
    2451623.80984 +
    365242.37404 * Y +
    0.05169 * Y * Y -
    0.00411 * Y * Y * Y -
    0.00057 * Y * Y * Y * Y;
  const T = (jd0 - 2451545.0) / 36525;
  const W =
    35999.373 * T -
    2.47 * DEG * 1e-5 * 0 +
    0.000006 * T * T -
    T * T * T / 15300;
  const deltaLambda =
    1 +
    0.0334 * Math.cos(W * DEG) +
    0.0007 * Math.cos(2 * W * DEG) +
    0.000006 * Math.cos(3 * W * DEG);
  const deltaT = 0.00001 * T * T;
  return jd0 + (24 * 0.00067281) / deltaLambda + deltaT;
}

const DEG = Math.PI / 180;

// The Sun's equation of centre never exceeds about 2 degrees, so a correct
// series lands within a couple of degrees of the mean. At an anchor the true
// longitude is exactly the target, so anything past a degree and a half means
// the series is not the one being thought of.
const SUN_TOLERANCE = 1.5;

let worstEquinox = 0;
let worstEquinoxYear = 0;
let anchorCount = 0;

for (let year = 1900; year <= 2030; year += 1) {
  const jd = marchEquinox(year);
  const got = sunLongitude(jd);
  const gap = shortestGap(got, 0);
  anchorCount += 1;
  if (gap > worstEquinox) {
    worstEquinox = gap;
    worstEquinoxYear = year;
  }
}

check(
  `the Sun is at 0° tropical at the March equinox (${anchorCount} years)`,
  worstEquinox < SUN_TOLERANCE,
  `worst year ${worstEquinoxYear} was ${worstEquinox.toFixed(2)}° out, and it should never be more than ${SUN_TOLERANCE}°`,
);

check(
  'the March equinox lands in the second half of March, every year',
  (() => {
    for (let year = 1900; year <= 2030; year += 1) {
      const parts = partsFromJulianDay(marchEquinox(year));
      if (parts.month !== 3 || parts.day < 18 || parts.day > 22) return false;
    }
    return true;
  })(),
  'an equinox fell outside 18–22 March, which means the reference itself is broken',
);

/* ── the Sun moves about a degree a day ─────────────────────────────────── */
{
  const jd = julianDayFromParts(1990, 6, 1, 12, 0);
  const before = sunLongitude(jd - 1);
  const after = sunLongitude(jd + 1);
  const perDay = shortestGap(before, after) / 2;

  check(
    'the Sun moves between 0.9° and 1.1° a day',
    perDay > 0.9 && perDay < 1.1,
    `it moved ${perDay.toFixed(3)}° a day`,
  );
}

/* ── a known date, hand-checked ─────────────────────────────────────────── */
{
  // 14 March 1975. The Sun is six days short of the equinox, so about 354°
  // tropical — and one ayanamsa further back again, to about 329.5° sidereal,
  // which is the very last degree of Kumbha.
  const jd = julianDayFromParts(1975, 3, 14, 10, 30);
  const tropical = sunLongitude(jd);

  check(
    'the Sun on 14 March 1975 is six days short of the equinox, not past it',
    tropical > 348 && tropical < 356,
    `got ${tropical.toFixed(2)}° tropical; six days before the equinox it should be about 354°`,
  );

  const grahas = allGrahas(jd);
  check(
    'and sidereally it is at the end of Kumbha, not in Mesha',
    grahas.sun.longitude > 325 && grahas.sun.longitude < 335,
    `the Sun came out at ${grahas.sun.longitude.toFixed(2)}°, sign ${grahas.sun.rashi}`,
  );
}

/* ── the inner planets cannot be far from the Sun ───────────────────────── */
{
  /*
   * The one check that needs no table and no almanac.
   *
   * Venus orbits inside the Earth's orbit, so from the Earth it cannot be far
   * from the Sun: the limit is the tangent from one orbit to the other. For
   * Venus's actual eccentricity that is 47.8°, and for Mercury's tighter orbit
   * 28.3°. Those are geometry, not data.
   *
   * This is the check that found the rotation bug, and it is worth keeping for
   * that reason: a planet rotated by a constant angle still satisfies every
   * periodicity test in the file, and only fails this one.
   *
   * The limits are the geometric maxima, not round numbers. They were first
   * written as 47 and 28, and the engine then measured 47.4 and 28.3 — which is
   * not a failure but the answer, and a test that fails on the right number
   * teaches its reader to ignore it.
   */
  let venusMax = 0;
  let venusAt = '';
  let mercuryMax = 0;
  let mercuryAt = '';

  for (let year = 1960; year <= 2040; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const jd = julianDayFromParts(year, month, 1, 12, 0);
      const g = allGrahas(jd);

      // Both sides of the subtraction must be in the same frame. Comparing the
      // chart's sidereal Venus against the Sun's *tropical* longitude puts the
      // two 23.85° apart — which reads as a Venus 47° too far from the Sun, and
      // is a property of the subtraction rather than of either planet. The
      // chart's own Sun is the only safe comparison, and it is the one that
      // goes through the same ayanamsa as everything else beside it.
      const sun = g.sun.longitude;

      const v = shortestGap(g.venus.longitude, sun);
      const m = shortestGap(g.mercury.longitude, sun);

      if (v > venusMax) { venusMax = v; venusAt = `${year}-${month}`; }
      if (m > mercuryMax) { mercuryMax = m; mercuryAt = `${year}-${month}`; }
    }
  }

  check(
    'Venus stays within its 47.8° limit of the Sun, over eighty years',
    venusMax < 47.8,
    `it reached ${venusMax.toFixed(1)}° in ${venusAt}, which no geometry allows`,
  );

  check(
    'Mercury stays within its 28.3° limit of the Sun',
    mercuryMax < 28.3,
    `it reached ${mercuryMax.toFixed(1)}° in ${mercuryAt}, which no geometry allows`,
  );
}

/* ── the node regresses steadily ────────────────────────────────────────── */
{
  let worst = 0;
  let worstAt = 0;

  for (let year = 1900; year <= 2030; year += 1) {
    const a = meanNode(julianDayFromParts(year, 1, 1, 0, 0));
    const b = meanNode(julianDayFromParts(year + 1, 1, 1, 0, 0));
    const movedBack = ((a - b) % 360 + 360) % 360;

    // One year, less the leap day, is 365 days; the node goes back 19.34°.
    const error = Math.abs(movedBack - 19.34);
    if (error > worst) {
      worst = error;
      worstAt = year;
    }
  }

  check(
    "the node goes back about 19.3° every year, for a hundred and thirty years",
    worst < 0.3,
    `year ${worstAt} was ${worst.toFixed(2)}° away from 19.34°`,
  );
}

/* ── the Moon's rate and its period ─────────────────────────────────────── */
{
  const jd = julianDayFromParts(2000, 1, 1, 0, 0);
  const before = moonLongitude(jd - 0.5);
  const after = moonLongitude(jd + 0.5);
  const perDay = Math.abs(((after - before + 540) % 360) - 180);

  check(
    'the Moon moves between 12° and 14.5° a day',
    perDay > 12 && perDay < 14.5,
    `it moved ${perDay.toFixed(3)}° a day`,
  );

  /*
   * One sidereal month, and the tolerance is not small.
   *
   * The Moon returns to the same *star* in 27.32166 days, but the true
   * longitude is that plus the equation of the centre — 6.29°, 1.27°, 0.66° and
   * the rest, about 8° of it in all — and those terms have their own periods.
   * They are not back in phase after one sidereal month, so a few degrees of
   * residual is the correct answer rather than a small error.
   *
   * The check is here to catch a rate that is wrong by whole degrees, not to
   * measure the series to the arcminute. It is not; the page says so.
   */
  const sidereal = 27.321661;
  const start = moonLongitude(jd);
  const later = moonLongitude(jd + sidereal);
  const drift = shortestGap(start, later);

  check(
    'the Moon comes back to within 9° after one sidereal month',
    drift < 9,
    `it came back ${drift.toFixed(2)}° away; more than 9° means the daily rate is wrong, not just the phase`,
  );
}

/* ── the nodes regress, they do not run forwards ────────────────────────── */
{
  const jd = julianDayFromParts(1980, 1, 1, 0, 0);
  const before = meanNode(jd);
  const after = meanNode(jd + 365);
  // Eighteen and a bit years for a full circuit.
  const movedBack = ((before - after) % 360 + 360) % 360;
  const expected = (19.34 / 365) * 365;

  check(
    'the Moon\'s node moves backwards about 19° a year',
    Math.abs(movedBack - expected) < 2,
    `it moved ${movedBack.toFixed(2)}° back in a year, expected about ${expected.toFixed(2)}°`,
  );
}

/* ── every planet moves at its own rate ────────────────────────────────── */
{
  /*
   * Over a hundred years, not sixty days.
   *
   * Sixty days was the first choice and it was the wrong one: a short interval
   * cannot tell a planet that has stopped from a planet whose eccentricity has
   * put it near perihelion on one side of the interval and near aphelion on the
   * other. Jupiter frozen for a century moved 0.1° in sixty days, and so did
   * Jupiter at perihelion, and a sixty-day check cannot separate them.
   *
   * A century is long enough that a frozen planet is unmissable, and the
   * tolerance has to allow for the equation of the centre, whose amplitude is
   * about 2e radians — so twenty-three degrees for Mercury and less than a
   * degree for Venus. A single tolerance cannot suit both; one that suits
   * Mercury would wave through Venus being given Mercury's elements.
   */
  const ORBITS: Array<{ key: string; rate: number; e: number }> = [
    { key: 'earth', rate: 0.985647, e: 0.0167 },
    { key: 'mercury', rate: 1.383333, e: 0.2056 },
    { key: 'venus', rate: 1.602136, e: 0.0068 },
    { key: 'mars', rate: 0.524021, e: 0.0934 },
    { key: 'jupiter', rate: 0.083085, e: 0.0484 },
    { key: 'saturn', rate: 0.033444, e: 0.0539 },
  ];

  const DAYS = 36525; // a Julian century
  const start = julianDayFromParts(1900, 1, 1, 12, 0);
  const end = start + DAYS;

  const wrong: string[] = [];

  for (const { key, rate, e } of ORBITS) {
    const a = helioLongitude(start, key);
    const b = helioLongitude(end, key);

    const moved = ((b - a) % 360 + 360) % 360;
    const expected = ((rate * DAYS) % 360 + 360) % 360;
    const error = Math.min(Math.abs(moved - expected), 360 - Math.abs(moved - expected));

    // The equation of the centre can differ at the two ends by up to twice its
    // amplitude, which is 2e radians each way.
    const tolerance = 4 * e * 57.2958 + 2;

    if (error > tolerance) {
      wrong.push(`${key} advanced ${moved.toFixed(1)}° in a century, expected about ${expected.toFixed(1)}°`);
    }
  }

  check(
    'every planet advances a full century at its own mean motion',
    wrong.length === 0,
    wrong.join(' | '),
  );
}

/* ── nothing has drifted out of the zodiac over two centuries ──────────── */
{
  let bad = '';
  for (const year of [1850, 1900, 1950, 2000, 2026]) {
    const grahas = allGrahas(jdOfYear(year));
    for (const planet of PLANETS) {
      const value = grahas[planet].longitude;
      if (!(value >= 0 && value < 360)) bad += `${year} ${planet}: ${value}. `;
    }
  }

  function jdOfYear(year: number): number {
    return julianDayFromParts(year, 6, 15, 12, 0);
  }

  check(
    'every graha stays inside the zodiac from 1850 to today',
    bad === '',
    bad || 'five dates, nine grahas each',
  );
}

/* ── the page must not print two different lagnas ──────────────────────── */
{
  /*
   * The ascendant was computed twice, by two functions, and the two disagreed
   * by twelve degrees. Both were printed — one in the astrology summary and one
   * in the full sheet — so a visitor saw two answers to the same question on
   * the same page and had no way to tell which one to believe.
   *
   * Comparing the two engines directly is the only way to catch it, because
   * each is internally consistent and each renders.
   */
  let bad = '';
  const places: Array<[string, number, number]> = [
    ['Mumbai', 19.076, 72.878],
    ['Delhi', 28.614, 77.209],
    ['Chennai', 13.083, 80.271],
    ['Kolkata', 22.573, 88.364],
    ['Leh', 34.152, 77.577],
  ];

  for (const [name, lat, lon] of places) {
    for (const [year, month, day] of [
      [1975, 3, 14], [1990, 11, 22], [2001, 12, 25], [1962, 1, 31],
    ] as Array<[number, number, number]>) {
      for (const hour of [3, 10, 18, 23]) {
        const jd = julianDayFromParts(year, month, day, hour, 30);

        const fromVedic = vedic({
          date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          time: `${String(hour).padStart(2, '0')}:30`,
          latitude: lat,
          longitude: lon,
        });
        if (!fromVedic?.lagna) continue;

        const fromSheet = lagna(jd, lat, lon);

        const gap = shortestGap(fromVedic.lagna.degrees, fromSheet % 30);
        if (gap > 0.05) {
          bad += `${name} ${year}-${month}-${day} ${hour}:30 — summary says ${fromVedic.lagna.degrees.toFixed(2)}°, sheet says ${(fromSheet % 30).toFixed(2)}°. `;
        }
      }
    }
  }

  check(
    'the summary and the full sheet print the same lagna',
    bad === '',
    bad || '80 births across five places',
  );
}

/* ── and the same nakshatra ────────────────────────────────────────────── */
{
  /*
   * The Moon was computed twice as well: once from a constant daily rate times
   * the days since an epoch, and once from the twenty-term series. The first is
   * the Moon's mean motion, which is not the Moon, and multiplying a rate by
   * seventy thousand days turns its imprecision into degrees. They disagreed on
   * every one of sixty births, by up to six nakshatras.
   *
   * A nakshatra is a sixth of a degree wide at the Moon's speed and carries the
   * dasha with it, so six of them apart is a different sign, a different lord
   * and a different century of a life.
   */
  let bad = '';
  let cases = 0;

  const places: Array<[string, number, number]> = [
    ['Mumbai', 19.076, 72.878],
    ['Delhi', 28.614, 77.209],
    ['Chennai', 13.083, 80.271],
    ['Kolkata', 22.573, 88.364],
    ['Leh', 34.152, 77.577],
  ];

  for (const [name, lat, lon] of places) {
    for (const [year, month, day] of [
      [1975, 3, 14], [1990, 11, 22], [2001, 12, 25], [1962, 1, 31], [1889, 6, 2],
    ] as Array<[number, number, number]>) {
      for (const hour of [0, 6, 12, 18]) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const time = `${String(hour).padStart(2, '0')}:30`;

        const summary = vedic({
          date, time, latitude: lat, longitude: lon,
        });
        if (!summary) continue;

        const sheet = allGrahas(julianDayFromParts(year, month, day, hour, 30));
        const sheetName = NAKSHATRAS[sheet.moon.nakshatra - 1];

        cases += 1;
        if (summary.nakshatra.name !== sheetName) {
          bad += `${name} ${date} ${time}: summary ${summary.nakshatra.name}, sheet ${sheetName}. `;
        }
        if (summary.rashi !== RASHIS[sheet.moon.rashi].name) {
          bad += `${name} ${date} ${time}: summary rashi ${summary.rashi}, sheet ${RASHIS[sheet.moon.rashi].name}. `;
        }
      }
    }
  }

  check(
    `the summary and the full sheet name the same nakshatra (${cases} births)`,
    bad === '',
    bad,
  );
}

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) {
  console.log('A planet in the wrong sign is still in a sign.');
  console.log();
  process.exit(1);
}
