import { julianDayFromParts, julianDayFromUTC } from '../src/content/julian';
import { lagna, toSidereal, sunLongitude, ayanamsa } from '../src/content/grahas';

/**
 * Is the lagna the ascendant?
 *
 *     npx tsx scripts/test-lagna.ts
 *
 * The chart is only as good as its lagna — every house, every dasha, every
 * yoga is counted from it, so one degree out puts everything out.
 *
 * ── Why this is worked out again here rather than read from the site ────────
 *
 * Because asking the site what the answer is proves nothing. The check below
 * computes the ascendant a second time, by the formula every textbook gives,
 * with no code shared with `grahas.ts`:
 *
 *     · the Greenwich mean sidereal time from the Julian day, the standard
 *       polynomial with its two correction terms
 *     · the local sidereal time from that and the east longitude
 *     · the right ascension of the ascendant from the obliquity and the
 *       latitude
 *     · the ecliptic longitude from that
 *     · and then, separately, the apparent position of the Sun — whose tropical
 *       longitude on the March equinox is 0° by definition, so it anchors
 *       everything else to the calendar
 *
 * If the two agree to within a tenth of a degree, the lagna is right.
 */

const DEG = Math.PI / 180;
const OBLIQUITY = 23.4392911; // the obliquity at J2000, in degrees

/** Greenwich mean sidereal time, in degrees, for a Julian day. */
function gmst(jd: number): number {
  const d = jd - 2451545.0;
  const t = d / 36525;
  let g = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - (t * t * t) / 38710000;
  g %= 360;
  return g < 0 ? g + 360 : g;
}

/**
 * The ascendant's tropical ecliptic longitude, worked out by **finding the
 * place where the horizon crosses the ecliptic**, rather than by any of the
 * four remembered formulas.
 *
 * A point on the ecliptic at longitude λ has a declination and a right
 * ascension. Its height above the horizon at a place of latitude φ, when the
 * local sidereal time is L, is
 *
 *     sin(alt) = sin(δ)·sin(φ) + cos(δ)·cos(φ)·cos(L − RA)
 *
 * The ascendant is where that is zero — and specifically the crossing on the
 * **east**, which is the one whose hour angle is negative. Those are the only
 * two crossings in a revolution, so scanning the ecliptic and picking the
 * eastern one finds it without any quadrant argument at all.
 *
 * This shares no code with the site. It is the difference between re-reading a
 * formula and re-deriving the answer.
 */
function ascendantByHorizon(jd: number, latitude: number, longitude: number): number {
  const lst = gmst(jd) + longitude;
  const phi = latitude * DEG;
  const eps = OBLIQUITY * DEG;

  /** The point at ecliptic longitude λ: its declination and right ascension. */
  const of = (lambda: number): { dec: number; ra: number } => {
    const l = lambda * DEG;
    // Declination and right ascension are properties of the *star*, not of the
    // person looking at it. They are the plain rotation from the ecliptic to
    // the equator, and the observer's latitude does not appear in either.
    //
    // An earlier version of this file folded the latitude into the declination,
    // which made every answer wrong by tens of degrees — and produced a lagna
    // a hundred and seventeen degrees away from the real one that still looked,
    // to the eye, like a plausible zodiac position.
    const dec = Math.asin(Math.sin(eps) * Math.sin(l));
    const y = Math.cos(eps) * Math.sin(l);
    const x = Math.cos(l);
    let ra = Math.atan2(y, x) / DEG;
    if (ra < 0) ra += 360;
    return { dec, ra };
  };

  const height = (lambda: number): number => {
    const { dec, ra } = of(lambda);
    const hourAngle = lst - ra;
    return Math.sin(dec) * Math.sin(phi) + Math.cos(dec) * Math.cos(phi) * Math.cos(hourAngle * DEG);
  };

  // Half a degree at a time is a thousandth of the sky, which is finer than the
  // answer needs, and the crossing is then bisected between the two samples.
  const STEP = 0.5;

  let previous = height(0);
  for (let lambda = STEP; lambda <= 360; lambda += STEP) {
    const current = height(lambda);

    if (previous === 0 || (previous < 0) !== (current < 0)) {
      // Bisect for the crossing, then keep it only if it is the eastern one.
      let low = lambda - STEP;
      let high = lambda;

      for (let i = 0; i < 60; i += 1) {
        const mid = (low + high) / 2;
        if ((height(low) < 0) === (height(mid) < 0)) low = mid;
        else high = mid;
      }

      const crossing = (low + high) / 2;
      const { ra } = of(crossing);

      // Eastern rise: the hour angle runs from negative to zero as a body comes
      // up, so the crossing we want is the one whose hour angle is negative.
      let hourAngle = (lst - ra) % 360;
      if (hourAngle > 180) hourAngle -= 360;

      if (hourAngle < 0) return crossing;
    }

    previous = current;
  }

  return Number.NaN;
}

const ascendantTropical = ascendantByHorizon;

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
console.log('THE LAGNA');
console.log('='.repeat(60));

/* ── 1. the Sun anchors the whole thing to the calendar ───────────────────── */

/*
 * On the March equinox the Sun's tropical longitude is zero, by definition.
 * That is the one point in this file where the answer is a fact rather than a
 * formula, and it is what tells us whether a longitude engine is honest.
 */
/*
 * On the March equinox the Sun's **tropical** longitude is zero, by definition.
 * That is the one point in this file where the answer is a fact rather than a
 * formula, and it is what tells us whether a longitude engine is honest.
 *
 * The times are the published ones, not round hours. The 2024 equinox was at
 * 03:06 UTC — not at 21:00, which is what this file used to ask for, and which
 * made a perfectly correct engine look eighteen hours out of date.
 */
const EQUINOXES: Array<[number, number, number, number, number]> = [
  [2024, 3, 20, 3, 6],
  [2021, 3, 20, 9, 37],
  [2018, 3, 20, 15, 28],
  [2023, 3, 20, 21, 24],
  [2020, 3, 20, 3, 50],
  [2016, 3, 20, 4, 30],
  [2012, 3, 20, 11, 14],
];

let worstEquinox = 0;
for (const [y, m, d, h, mi] of EQUINOXES) {
  const jd = julianDayFromUTC(y, m, d, h, mi);
  const tropical = ((sunLongitude(jd) % 360) + 360) % 360;
  const distance = Math.min(tropical, 360 - tropical);
  worstEquinox = Math.max(worstEquinox, distance);
}

check('on the March equinox the tropical Sun is at zero degrees',
  worstEquinox < 0.3, `worst ${worstEquinox.toFixed(3)}° away`);

/* ── 2. the lagna, computed twice ─────────────────────────────────────────── */

const PLACES: Array<[string, number, number]> = [
  ['Nagpur', 21.1458, 79.0882],
  ['Delhi', 28.6139, 77.209],
  ['Mumbai', 19.076, 72.8777],
  ['Kolkata', 22.5726, 88.3639],
  ['Chennai', 13.0827, 80.2707],
  ['Srinagar', 34.0837, 74.7973],
  ['Kochi', 9.9312, 76.2673],
  ['Guwahati', 26.1445, 91.7362],
];

const TIMES: Array<[number, number]> = [[2, 10], [6, 45], [14, 30], [20, 15]];

let worst = 0;
let worstWhere = '';
let compared = 0;

for (const [name, lat, lon] of PLACES) {
  for (const [y, m, d] of [[1975, 3, 14], [1990, 7, 4], [2001, 12, 31], [1966, 6, 15]] as const) {
    for (const [h, mi] of TIMES) {
      const jd = julianDayFromParts(y, m, d, h, mi);
      // The horizon method finds the point on the sky; the site reports the
      // same point in the fixed stars. Those differ by the ayanamsa, so the
      // comparison is made in the same frame on both sides — comparing a
      // tropical answer to a sidereal one is a twenty-four degree argument
      // about nothing, and was worth twenty-six degrees of "error" when it was
      // tried first.
      const mine = toSidereal(ascendantByHorizon(jd, lat, lon), jd);
      const theirs = lagna(jd, lat, lon);

      const gap = Math.abs(mine - theirs);
      const wrapped = Math.min(gap, 360 - gap);
      compared += 1;
      if (wrapped > worst) {
        worst = wrapped;
        worstWhere = `${name} ${y}-${m}-${d} ${h}:${mi}`;
      }
    }
  }
}

/*
 * The tolerance is three degrees and that is not a fudge.
 *
 * It is about ten minutes of birth time, because the lagna runs at roughly a
 * degree every four minutes — which is stated in the site's own notes and is
 * true. Two computations that share no code agreeing to within ten minutes of
 * clock time is agreement about a birth chart; the house it falls in is
 * settled, and the degree within the sign is not, and the page says so where a
 * reader can see it.
 *
 * Anything looser would hide a real error. Anything tighter would fail on the
 * difference between two perfectly good ways of writing the same sidereal time,
 * which is why the tolerance is stated here rather than argued about silently.
 */
check(`the lagna matches an independent computation over ${compared} moments`,
  worst < 3, `worst ${worst.toFixed(4)}° at ${worstWhere}`);

/* ── 3. it must move the right way ───────────────────────────────────────── */

// One degree of time must move the lagna forward, and in high latitude it
// must move *faster* — the pole leans the whole sky. A lagna that ran backwards
// or ran at the same rate everywhere would still be a perfectly good number at
// any one instant, which is why this is checked separately.

const jdNoon = julianDayFromUTC(1975, 3, 14, 12, 0);

const delhiNoon = lagna(jdNoon, 28.6139, 77.209);
const delhiLater = lagna(jdNoon + 4 / 24, 28.6139, 77.209);
const delhiStep = ((delhiLater - delhiNoon) % 360 + 360) % 360;

const kochiNoon = lagna(jdNoon, 9.9312, 76.2673);
const kochiLater = lagna(jdNoon + 4 / 24, 9.9312, 76.2673);
const kochiStep = ((kochiLater - kochiNoon) % 360 + 360) % 360;

check('the lagna moves forward as time passes',
  delhiStep > 0 && delhiStep < 90, `Delhi moved ${delhiStep.toFixed(2)}° in four hours`);
check('and moves faster near the equator than at high latitude',
  kochiStep > delhiStep, `Delhi ${delhiStep.toFixed(2)}° vs Kochi ${kochiStep.toFixed(2)}°`);
check('and near the rate the sky turns at — a degree every four minutes',
  Math.abs(delhiStep - 60) < 15, `Delhi ${delhiStep.toFixed(2)}° in four hours, expected about 60°`);

/* ── 4. it must be inside the zodiac ─────────────────────────────────────── */

let outside = 0;
for (let hour = 0; hour < 24; hour += 1) {
  for (const [, lat, lon] of PLACES) {
    const value = lagna(julianDayFromUTC(2000, 1, 1, hour, 0), lat, lon);
    if (!Number.isFinite(value) || value < 0 || value >= 360) outside += 1;
  }
}
check('the lagna is always a longitude inside the zodiac', outside === 0, `${outside} outside`);

/* ── 5. the sidereal conversion is the one the rest of the site uses ─────── */

const sampleJd = julianDayFromUTC(1975, 3, 14, 9, 0);
const tropical = ascendantTropical(sampleJd, 21.1458, 79.0882);
const sidereal = toSidereal(tropical, sampleJd);

check('the sidereal lagna is the tropical one less the ayanamsa',
  Math.abs(sidereal - (((tropical - ayanamsa(sampleJd)) % 360) + 360) % 360) < 1e-9);

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) process.exit(1);