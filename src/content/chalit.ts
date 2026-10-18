import { allGrahas, houseOf, lagna, type Planet, type GrahaPosition, PLANETS } from './grahas';
import { RASHIS } from './astrology';

/**
 * ============================================================================
 *  CHALIT · CHANDRA · KARAKAMSHA · SWANSH
 * ============================================================================
 *
 * Four readings of the same moment, each counting from a different sign.
 *
 * ── Why these four are on one page ───────────────────────────────────────────
 *
 * The main chart counts from the ascendant. A pandit who is asked "chalit kaisa
 * hai" is not asking a different question, they are counting from a different
 * starting point — and the four traditional starting points are these:
 *
 *   चालित (Chalit)     from the ascendant, shifted one sign — so a graha in the
 *                      lagna's own sign falls in the *twelfth* chalit house,
 *                      which is the whole point of it. It catches grahas just
 *                      leaving a sign, who are about to move house.
 *   चंद्र (Chandra)     from the Moon. The Moon moves a sign in two and a half
 *                      days, so for anyone born at night this chart and the
 *                      main one can disagree completely, and the night-born
 *                      chart is the traditional one for night questions.
 *   कार्कांश (Kark Ansh) the ascendant at the moment the Moon returns to the
 *                      degree it held at birth. A thirty-second-accurate Moon
 *                      computed by a machine, pointed at the real sky.
 *   स्वांश (Swansh)     the sign opposite the Chandra lagna. One addition, and
 *                      it is the only one of the four that is a pointer rather
 *                      than a chart.
 *
 * ── What is not faked ───────────────────────────────────────────────────────
 *
 * Karakamsha needs a second ascendant calculation, at a moment that is not the
 * birth moment, so it is computed rather than looked up. The Moon's speed is not
 * assumed either: it is taken from the engine's own positions at two instants,
 * because the Moon is the one graha whose speed genuinely varies across its
 * orbit and a mean 13.2° a day is visibly wrong near the apsides.
 *
 * Every other figure here is a whole number of degrees somewhere in the zodiac,
 * and all four are checked in scripts/test-chalit.ts.
 */

/** A graha's place, restated in one of these other frames. */
export interface Shifted {
  graha: Planet;
  name: string;
  /** Sign the graha is in — unchanged by any of this. Only the house moves. */
  rashi: number;
  rashiName: string;
  /** House counted from the ascendant. */
  house: number;
  /** House counted from the Moon. */
  chandraHouse: number;
  /**
   * Chalit house: counted from the ascendant but shifted back one sign.
   *
   * Written out rather than derived from `house` at the call site because the
   * whole meaning of the chart is that it is *not* `house` minus one, and one
   * careless `- 1` without the wraparound is exactly the bug that makes this
   * chart wrong at its most used boundary: a graha in the lagna's own sign.
   */
  chalitHouse: number;
}

/** The whole of it, for one birth. */
export interface ChalitResult {
  lagnaRashi: number;
  moonRashi: number;

  grahas: Shifted[];

  /** Karakamsha, 0 to 11. */
  karakamsha: number;
  karakamshaName: string;
  /**
   * How many days after the birth the Moon came back to its birth degree, and
   * the ascendant that stood then.
   *
   * Shown on the page because a karakamsha that cannot be checked is a claim
   * rather than a calculation, and a reader with a book open will want to see
   * that the Moon really did come round.
   */
  karakamshaAfterDays: number;
  /** The ascendant's degree at that moment, before it is reduced to a sign. */
  karakamshaAscendantDegrees: number;

  /** Swansh — the sign opposite the Chandra lagna. */
  swansh: number;
  swanshName: string;
  /** Chandra house the swansh falls in, which is always the seventh. */
  swanshChandraHouse: number;
}

/**
 * Chalit house for a sign, counted from the lagna.
 *
 * The definition in one line: the same count as the ordinary house, moved back
 * by one, wrapping so that zero becomes twelve rather than nothing.
 */
export function chalitHouseOf(rashi: number, lagnaRashi: number): number {
  const ordinary = ((rashi - lagnaRashi + 12) % 12) + 1;
  return ordinary === 1 ? 12 : ordinary - 1;
}

/** House counted from a given starting sign. */
function houseFrom(rashi: number, start: number): number {
  return ((rashi - start + 12) % 12) + 1;
}

/**
 * The Moon's speed in degrees a day, measured rather than assumed.
 *
 * The Moon covers a whole sign in two and a half days but not at a steady rate,
 * and near the apsides the difference is enough to move the karakamsha by a
 * whole sign. So it is taken from the engine's own positions a day apart.
 */
function moonSpeed(jd: number): number {
  const a = moonDegrees(jd);
  const b = moonDegrees(jd + 1);

  // Wrap: the Moon moves a little under 14° a day, so a raw subtraction across
  // the 360° boundary comes out negative and looks like a retrograde Moon.
  let delta = b - a;
  if (delta < -180) delta += 360;
  if (delta > 180) delta -= 360;

  return delta;
}

/** The Moon's sidereal longitude, 0 to 360. */
function moonDegrees(jd: number): number {
  return allGrahas(jd).moon.longitude;
}

/**
 * The Moon's rate of travel, as the charts express it: whole degrees in the
 * time it takes to cross one sign, as a fraction of a day.
 *
 * Kept separate from `moonSpeed` because this is what goes on the page, and the
 * page wants "13° 12′ in 2d 6h", not "13.19 degrees per day".
 */
export function moonTravelPerSign(jd: number): {
  degrees: number;
  days: number;
} {
  const speed = moonSpeed(jd);
  return { degrees: speed, days: 30 / Math.abs(speed || 13.2) };
}

/**
 * How far apart two longitudes are, on the short way round.
 *
 * Without this the Moon's own motion looks like a retrograde one every time it
 * crosses the 360° mark — about once a month — which would throw the search
 * below straight onto the wrong answer.
 */
function distance(from: number, to: number): number {
  let d = to - from;
  if (d < -180) d += 360;
  if (d > 180) d -= 360;
  return d;
}

/**
 * Find the moment the Moon comes back to the degree it held at birth, and the
 * ascendant standing at that moment.
 *
 * ── How the search is done, and why it is a search ───────────────────────────
 * A closed form would be nicer and does not exist: the ascendant depends on the
 * Earth's rotation and on where the Moon *is at the moment we ask*, so the two
 * sides of the equation move for different reasons and no formula solves both at
 * once.
 *
 * The search therefore counts the Moon's **total distance travelled** rather than
 * comparing its position to its birth position, and looks for the moment that
 * distance passes 360°. Comparing positions instead finds the *opposition*
 * halfway round first — a perfectly good answer to a different question, which
 * produces a karakamsha one sign off, confidently, and that is the worst way to
 * be wrong here.
 *
 * The first crossing is the one wanted. A search that ran on to the second would
 * report a correct and completely useless answer.
 */
function findMoonReturn(jd: number): { jd: number; days: number } | null {
  const birthLongitude = moonDegrees(jd);

  const step = 0.25; // six hours; a fifth of a day's travel
  const limit = 35; // a little over one lunar month, so a second crossing is out of reach

  let previousTime = jd;
  let previousMoon = birthLongitude;
  let travelled = 0;

  for (let i = 1; i * step <= limit; i += 1) {
    const time = jd + i * step;
    const moon = moonDegrees(time);

    travelled += distance(previousMoon, moon);

    if (travelled >= 360) {
      const refined = refine(previousTime, time, birthLongitude);
      if (refined !== null) return { jd: refined, days: refined - jd };
    }

    previousTime = time;
    previousMoon = moon;
  }

  return null;
}

/** Bisect down to a quarter of a second, far finer than one arc minute. */
function refine(lo: number, hi: number, target: number): number | null {
  let a = lo;
  let b = hi;

  for (let i = 0; i < 40 && b - a > 1 / 86400 / 4; i += 1) {
    const mid = (a + b) / 2;

    // How far the Moon still has to travel to get back to its birth degree.
    // Positive while it is still short of it, negative once it is past — and it
    // is the sign change at `mid` that decides which half to keep.
    //
    // Only the midpoint is asked about. The first version tested `a` — which is
    // the same question after the first halving and a stale one after that — and
    // so walked the interval towards its own start and returned the birth instant
    // itself, one and a half degrees from the truth, confidently.
    const atMid = distance(moonDegrees(mid), target);

    if (atMid >= 0) a = mid;
    else b = mid;
  }

  return (a + b) / 2;
}

/**
 * Work out all four readings.
 *
 * `latitude` and `longitudeEast` are needed, and they are the reason this cannot
 * be worked out from the birth date alone: the ascendant depends on where on the
 * earth the person was standing, so a chart with no place has no chalit and no
 * karakamsha. Rather than guess one, this returns null and the page says why —
 * which is the same rule the main chart follows.
 */
export function chalitOf(
  jd: number,
  latitude: number,
  longitudeEast: number,
): ChalitResult | null {
  /*
   * `lagna` returns **degrees**, not a sign index. The main chart divides it by
   * thirty at the call site, and this one did not, so every house in every one of
   * these four readings was a fraction — a chalit house of "-0.6" and a karakamsha
   * of "2.9", both printed, both meaningless, and neither one an error.
   *
   * So the division happens here, in one place, guarded, and every other value in
   * this file is a whole sign afterwards.
   */
  const ascendantDegrees = lagna(jd, latitude, longitudeEast);
  if (!Number.isFinite(ascendantDegrees)) return null;

  const asc = ((Math.floor(((ascendantDegrees % 360) + 360) % 360) / 30) | 0) % 12;
  if (asc < 0 || asc > 11) return null;

  const atBirth = allGrahas(jd);
  const moonRashi = atBirth.moon.rashi;

  const grahas: Shifted[] = PLANETS.map((key) => {
    const position: GrahaPosition = atBirth[key];
    return {
      graha: key,
      name: position.isShadow ? (key === 'rahu' ? 'राहु' : 'केतु') : nameOf(key),
      rashi: position.rashi,
      rashiName: RASHIS[position.rashi].name,
      house: houseOf(position.rashi, asc),
      chandraHouse: houseFrom(position.rashi, moonRashi),
      chalitHouse: chalitHouseOf(position.rashi, asc),
    };
  });

  /*
   * No search result means no karakamsha — and saying so is the whole point.
   *
   * This used to fall back to the Moon's own sign with zero days after birth,
   * which is a real sign and a completely fabricated answer, and it looked
   * exactly like a worked-out one on the page: a name, a sign, a number of
   * days. A reader with a book open has no way to tell that the search gave up.
   */
  const returned = findMoonReturn(jd);
  if (!returned) return null;

  const karakamshaDegrees = lagna(returned.jd, latitude, longitudeEast);
  if (!Number.isFinite(karakamshaDegrees)) return null;

  const karakamsha = (((Math.floor(((karakamshaDegrees % 360) + 360) % 360) / 30) | 0) % 12);
  if (karakamsha < 0 || karakamsha > 11) return null;

  const swansh = (moonRashi + 6) % 12;

  return {
    lagnaRashi: asc,
    moonRashi,
    grahas,
    karakamsha,
    karakamshaName: RASHIS[karakamsha].name,
    karakamshaAfterDays: returned.days,
    karakamshaAscendantDegrees: ((karakamshaDegrees % 360) + 360) % 360,
    swansh,
    swanshName: RASHIS[swansh].name,
    // The opposite of the first house is always the seventh, and printing the
    // arithmetic rather than the constant means the page cannot disagree with
    // itself if the Chandra lagna ever moves.
    swanshChandraHouse: houseFrom(swansh, moonRashi),
  };
}

/** Display name, from the one table rather than from a name here. */
function nameOf(key: Planet): string {
  // Imported lazily to keep this file's import list to what it actually uses.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return GRAHA_HINDI[key];
}

/**
 * Hindi names, kept local so this file does not import what it does not need at
 * module scope. The keys are the same English ids the rest of the project uses —
 * keying anything by a Devanagari string silently loses Jupiter, whose display
 * name is बृहस्पति while the word for its lordship is गुरु.
 */
const GRAHA_HINDI: Record<Planet, string> = {
  sun: 'सूर्य',
  moon: 'चंद्र',
  mars: 'मंगल',
  mercury: 'बुध',
  jupiter: 'बृहस्पति',
  venus: 'शुक्र',
  saturn: 'शनि',
  rahu: 'राहु',
  ketu: 'केतु',
};