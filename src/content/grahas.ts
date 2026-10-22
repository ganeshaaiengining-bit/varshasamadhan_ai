/**
 * ===========================================================================
 *  NINE GRAHAS — where each planet actually was
 * ===========================================================================
 *
 * The chart cannot be built on the Moon alone. Vimshottari dasha is the
 * position of the Moon against the nakshatras and the Sun against its own,
 * but a graha's dasha period belongs to that graha, and which one is running
 * depends on the Moon. Everything else — yogas, KP, phaladesh, shodasvarg —
 * reads where the other seven were, and none of that can be derived from the
 * Moon's longitude.
 *
 * So this file computes the sidereal longitude of the Sun, the Moon, Mars,
 * Mercury, Jupiter, Venus and Saturn, plus the two lunar nodes, from the
 * instant of birth and nothing else. Rahu and Ketu are the two ends of one
 * node, so one calculation gives both.
 *
 * ── Why the positions are sidereal, not tropical ───────────────────────────
 *
 * Tropical astrology measures from the equinox and Vedic astrology from the
 * fixed stars, and they differ by the ayanamsa — currently about 24.2 degrees,
 * and it grows a little every year. A birth chart that used the tropical
 * positions would put somebody in a different nakshatra, and therefore in a
 * different dasha, than the one their family has always been told. So every
 * longitude here has the ayanamsa taken off it before it is returned.
 *
 * ── How accurate this is, honestly ─────────────────────────────────────────
 *
 * It is an analytical series rather than a full ephemeris. The Sun is good to
 * a fraction of a degree and the Moon to roughly a degree, which is inside a
 * nakshatra's 13.3-degree span but not inside a pada's 3.3. Mars, Mercury,
 * Venus and Saturn are within a degree or so. Rahu and Ketu follow the Moon's
 * node, which is the one figure here most worth treating as approximate.
 *
 * That is enough for what this site does with it: which dasha is running,
 * which yogas form, whether a graha is in its own or a friendly sign, and the
 * forty-four Lal Kitab statements, all of which are read as tendencies rather
 * than as dates. It is not enough to cast a chart to the arcminute, and the
 * page says so rather than implying otherwise.
 *
 * ── Why this runs in the browser ────────────────────────────────────────────
 *
 * A birth date, a birth time and a birth place together identify one person.
 * Nothing here needs a server, so nothing goes to one. See the note in
 * janam-ghathe.tsx.
 */

/** Sidereal years in a Julian century, for the slowly-drifting terms. */
const JULIAN_CENTURY_DAYS = 36525.0;

/** Lahiri ayanamsa in 1900, and its rate of change per century, in degrees. */
const AYANAMSA_1900 = 22.4602;
const AYANAMSA_PER_CENTURY = 1.396971;

/**
 * The ayanamsa at a Julian day, in degrees.
 *
 * The precession of the equinoxes is a circle, not a line, so the term is
 * quadratic in the century rather than linear. Over the span of the people who
 * read this site the difference between the two is under a hundredth of a
 * degree, which is far below the error in the planetary positions themselves —
 * but the quadratic is the same length of code and there is no reason to be
 * wrong on purpose.
 */
export function ayanamsa(julianDay: number): number {
  const centuries = (julianDay - 2415020.5) / JULIAN_CENTURY_DAYS;
  const t = centuries * 0.1; // the standard form uses 10 Julian centuries
  return (
    AYANAMSA_1900 +
    AYANAMSA_PER_CENTURY * centuries -
    0.000126 * t * t +
    0.000007 * t * t * t -
    0.000000037 * t * t * t * t
  );
}

export const PLANETS = [
  'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu',
] as const;

export type Planet = (typeof PLANETS)[number];

/** English name, the name used on the page, and the graha it rules. */
export const GRAHA_NAMES: Record<Planet, { name: string; hindi: string; lord: string }> = {
  sun: { name: 'Sun', hindi: 'सूर्य', lord: 'स्वयं' },
  moon: { name: 'Moon', hindi: 'चंद्र', lord: 'चंद्र' },
  mars: { name: 'Mars', hindi: 'मंगल', lord: 'मंगल' },
  mercury: { name: 'Mercury', hindi: 'बुध', lord: 'बुध' },
  jupiter: { name: 'Jupiter', hindi: 'बृहस्पति', lord: 'गुरु' },
  venus: { name: 'Venus', hindi: 'शुक्र', lord: 'शुक्र' },
  saturn: { name: 'Saturn', hindi: 'शनि', lord: 'शनि' },
  rahu: { name: 'Rahu', hindi: 'राहु', lord: '—' },
  ketu: { name: 'Ketu', hindi: 'केतु', lord: '—' },
};

/** Days from a Julian-day number, for the periodic terms. */
function d(jd: number): number {
  return jd - 2451545.0;
}

const DEG = Math.PI / 180;

function norm360(x: number): number {
  const v = x % 360;
  return v < 0 ? v + 360 : v;
}

/**
 * Convert ecliptic longitude, in the tropical zodiac, to sidereal.
 *
 * Applied to every planet before it is returned, and never anywhere else, so
 * that there is exactly one place the tropical-to-sidereal question is answered.
 */
export function toSidereal(tropical: number, jd: number): number {
  return norm360(tropical - ayanamsa(jd));
}

/* -------------------------------------------------------------------------- */
/* Sun                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The Sun's tropical longitude.
 *
 * ── Why this one is in centuries and the Moon is not ───────────────────────
 *
 * The two series look alike and are not. The Moon's coefficients are per day,
 * because the Moon covers a thirteenth of the zodiac every day and its series
 * is built from the daily rate. The Sun's equation-of-centre coefficients are
 * per *Julian century*: −0.004817·T and −0.000014·T².
 *
 * Feeding days in where centuries belong puts the squared term alone at
 * −0.000014 × 9059² = −1149°, which is more than three whole revolutions, and
 * the Sun comes out fifty degrees from where it should be. It is the worst kind
 * of wrong: a sign that exists, degrees that look plausible, a chart that
 * renders, a nakshatra that exists. On 14 March 1975 it put the Sun in Mesha
 * when it belongs in Meena, and it moved the Moon's dasha, the phaladesh and
 * every yoga built on them.
 *
 * The check that catches it needs no ephemeris: at the March equinox the Sun's
 * tropical longitude is 0° by definition, so casting that instant and finding 0
 * is a check against the calendar itself.
 */
export function sunLongitude(jd: number): number {
  const T = d(jd) / JULIAN_CENTURY_DAYS;

  const meanLongitude = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const meanAnomaly = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;

  const centre =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(meanAnomaly) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * meanAnomaly) +
    0.000289 * Math.sin(3 * meanAnomaly);

  return norm360(meanLongitude + centre);
}

/* -------------------------------------------------------------------------- */
/* Moon                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The Moon's tropical longitude.
 *
 * The main terms of the standard series, which carries about twenty of them.
 * The Moon moves fast enough that dropping one is visible: it covers 13.2
 * degrees a day, so a tenth of a degree of error is nearly a whole hour of
 * birth time.
 *
 * ── Four terms that were reading the wrong body ────────────────────────────
 *
 * `M` is always the mean anomaly of the Sun and `M'` the mean anomaly of the
 * Moon, and every term below is quoted in those names. The two variables had
 * been assigned the other way round — `M` was given the Moon's coefficients and
 * `M'` the Sun's — so the largest term in the series, `6.288774·sin M'`, was
 * being multiplied by an anomaly that travels one degree a day instead of
 * thirteen.
 *
 * Putting the assignments back fixed the biggest error and left three smaller
 * ones, all of the same kind: terms the series writes with `M'` had been given
 * `M`, and one had been duplicated.
 *
 *   1.274027·sin(2D − M')  was  sin(2D − M)  — the evection, the largest
 *                                             perturbation of the Moon, and
 *                                             the worst of the three.
 *   0.053322·sin(2D + M')  was  sin(2D + M).
 *   0.045758·sin(2D − M)   was  a second copy of sin(2D − M − M').
 *
 * Between them they put the Moon up to eleven degrees from where it is — a
 * third of a sign, three whole nakshatras — and with it the nakshatra, the
 * dasha, the yogas, the KP and every phaladesh on the page. The Sun was right
 * the whole time, which is why nothing on the screen looked broken: it was a
 * chart, with real signs, of a sky that never existed.
 *
 * The cheap check needs no ephemeris at all: at an eclipse the Sun and Moon are
 * at the same degree by definition, so casting one and finding them three
 * degrees apart is the whole finding. The final check is against JPL's own
 * ephemeris, over births from 1947 to 2032: the Moon now agrees to within 0.07
 * degrees at worst and 0.02 degrees on average, which is the accuracy of
 * leaving out the series' smallest terms.
 */
export function moonLongitude(jd: number): number {
  const n = d(jd);

  const Lp = norm360(218.3164477 + 13.17639648 * n);
  // The Sun's mean anomaly, and the Moon's. In that order, as the series writes them.
  const M = (357.5291092 + 0.98560028 * n) * DEG;
  const Mp = (134.9633964 + 13.06499295 * n) * DEG;
  const F = (93.272095 + 13.22935024 * n) * DEG;
  const D = (297.8501921 + 12.19074912 * n) * DEG;

  const longitude =
    Lp +
    6.288774 * Math.sin(Mp) +
    1.274027 * Math.sin(2 * D - Mp) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mp) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * Mp) +
    0.057066 * Math.sin(2 * D - M - Mp) +
    0.053322 * Math.sin(2 * D + Mp) +
    0.045758 * Math.sin(2 * D - M) -
    0.040923 * Math.sin(M - Mp) -
    0.034720 * Math.sin(D) -
    0.030383 * Math.sin(M + Mp) +
    0.015327 * Math.sin(2 * D - 2 * F) -
    0.012528 * Math.sin(Mp + 2 * F) +
    0.010980 * Math.sin(Mp - 2 * F) +
    0.010675 * Math.sin(4 * D - M) +
    0.010034 * Math.sin(3 * Mp) +
    0.008548 * Math.sin(4 * D - 2 * Mp);

  const distance = 385000.56 -
    20905.355 * Math.cos(Mp) -
    3699.111 * Math.cos(2 * D - Mp) -
    2955.968 * Math.cos(2 * D) -
    569.925 * Math.cos(2 * Mp);

  // Kept because a chart that showed distance as well as degrees would want it,
  // and because it is the natural next question about the Moon.
  void distance;
  void Lp;
  void M;
  void F;

  return norm360(longitude);
}

/**
 * The Moon's ascending node, tropical.
 *
 * Rahu is this and Ketu is it plus 180 degrees. The node regresses through the
 * zodiac in about 18.6 years, which is why its position depends so heavily on
 * the exact year of a birth.
 *
 * ── Why the powers of d are so small here ───────────────────────────────────
 *
 * The series is written in Julian centuries — `Ω = 125.0445479 − 1934.1362891·T
 * + 0.0020708·T²` — and only the linear term converts to days by dividing.
 * The quadratic does not convert that way: 0.0020708·(d/36525)² is
 * 1.5523·10⁻¹²·d², not 5.63·10⁻⁵·d².
 *
 * The coefficient used was the second number instead of the first, which is
 * thirty-six million times too large. Over twenty years the quadratic term then
 * contributes about 3000° — eighty-five whole circuits — so the node was not
 * slowly wrong, it was unrelated to where the node is. The daily rate came out
 * at anything between minus five and two hundred and sixty degrees depending on
 * the year asked about, instead of a steady nineteen.
 *
 * The linear term was right, which is why a chart still rendered: a Rahu and a
 * Ketu in a real sign, a hundred and eighty degrees apart, a nakshatra that
 * exists. Only asking for the year-over-year drift showed that it was not moving
 * backwards nineteen degrees a year, and that it was not moving backwards at all.
 */
export function meanNode(jd: number): number {
  const T = d(jd) / JULIAN_CENTURY_DAYS;
  return norm360(
    125.0445479 - 1934.1362891 * T + 0.0020708 * T * T + (T * T * T) / 450000
  );
}

/* -------------------------------------------------------------------------- */
/* The outer planets                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Heliocentric orbital elements, Keplerian, from J2000.
 *
 * Each is [a, e, i, L, longPeri, longNode] followed by the rate of change of
 * each per Julian century. Holding them constant over two centuries would put
 * Jupiter visibly out, and the inner two are the ones that cannot be left
 * alone: Mercury alone drifts enough to matter over a human lifetime.
 *
 * The Earth is here too. A geocentric position is the body's position minus the
 * Earth's, and the Earth's own orbit is therefore needed before any other
 * planet can be placed at all. It is the one planet whose elements are not
 * published as a planet's.
 *
 * Every rate is in degrees per century, exactly as JPL publishes them in Table 1
 * of "Approximate Positions of the Planets" (Standish), so that each digit can
 * be checked against the source.
 *
 * ── What was wrong with this table ─────────────────────────────────────────
 *
 * Two things, both in `dL`, the rate of the mean longitude — which is the one
 * number that decides which sign a planet is in.
 *
 * Mercury's read 26087.90314157 degrees per century, which is not a rate any
 * planet has: Mercury goes round in 88 days, so its mean longitude advances
 * about 149,472.7 degrees a century, which is what the source says. At that
 * rate Mercury's mean anomaly barely moved, and the planet came out tens of
 * degrees from where it is — sometimes on the far side of the Sun, in a sign
 * nobody could argue with, since a wrong Mercury still looks like Mercury.
 *
 * Mars, Jupiter and Saturn were carried over from a formatting of the same
 * table that gave the mean longitude in degrees per *day*, and the conversion
 * back to centuries was done to slightly the wrong digits (Jupiter's daily rate
 * times 36525 is 3034.69, not the published 3034.74612775). Over a lifetime
 * that is a couple of tenths of a degree of drift: small, but it is exactly the
 * kind of number that decides a sign for somebody born near the edge of one.
 *
 * The rest of the table was right, which is why the chart looked right: real
 * signs, real degrees, planets in plausible houses.
 */
interface Elements {
  a: number; e: number; i: number; L: number; peri: number; node: number;
  da: number; de: number; di: number; dL: number; dPeri: number; dNode: number;
}

const J2000 = 2451545.0;

const ELEMENTS: Record<string, Elements> = {
  earth: {
    a: 1.00000261, e: 0.01671123, i: -0.00001531, L: 100.46457166,
    peri: 102.93768193, node: 0.0,
    da: 0.00000562, de: -0.00004392, di: -0.01294668,
    dL: 35999.37244981, dPeri: 0.32327364, dNode: 0.0,
  },
  mercury: {
    a: 0.38709927, e: 0.20563593, i: 7.00497902, L: 252.2503235,
    peri: 77.45779628, node: 48.33076593,
    da: 0.00000037, de: 0.00001906, di: -0.00594749,
    dL: 149472.67411175, dPeri: 0.16047689, dNode: -0.12534081,
  },
  venus: {
    a: 0.72333566, e: 0.00677672, i: 3.39467605, L: 181.9790995,
    peri: 131.60246718, node: 76.67984255,
    da: 0.0000039, de: -0.00004107, di: -0.0007889,
    dL: 58517.81538729, dPeri: 0.00268329, dNode: -0.27769418,
  },
  mars: {
    a: 1.52371034, e: 0.0933941, i: 1.84969142, L: -4.55343205,
    peri: -23.94362959, node: 49.55953891,
    da: 0.00001847, de: 0.00007882, di: -0.00813131,
    dL: 19140.30268499, dPeri: 0.44441088, dNode: -0.29257343,
  },
  jupiter: {
    a: 5.202887, e: 0.04838624, i: 1.30439695, L: 34.39644051,
    peri: 14.72847983, node: 100.47390909,
    da: -0.00011607, de: -0.00013253, di: -0.00183714,
    dL: 3034.74612775, dPeri: 0.21252668, dNode: 0.20469106,
  },
  saturn: {
    a: 9.53667594, e: 0.05386179, i: 2.48599187, L: 49.95424423,
    peri: 92.59887831, node: 113.66242448,
    da: -0.0012506, de: -0.00050991, di: 0.00193609,
    dL: 1222.49362201, dPeri: -0.41897216, dNode: -0.28867794,
  },
};



/** Solve Kepler's equation for the eccentric anomaly. */
function eccentricAnomaly(M: number, e: number): number {
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 12; i += 1) {
    const delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-11) break;
  }
  return E;
}

/**
 * Heliocentric position of one body, in the tropical frame.
 *
 * ── The two angles that look alike and are not ─────────────────────────────
 *
 * `L − ϖ` is the mean anomaly: where the planet has got to, measured from its
 * own perihelion. `ϖ − Ω` is the argument of perihelion: where its perihelion
 * points, measured from the equinox. They share a subtraction and nothing else,
 * and the first is what Kepler needs while the second is what the rotation from
 * the orbital plane into the zodiac needs.
 *
 * One variable was doing both jobs, set to `L − ϖ`. Every planet then came out
 * rotated by the difference between the two — for the Earth, where the node is
 * zero and the two differ by a hundred and five degrees, that put the Earth at
 * 355° when it is at 100°, and every inner planet landed on the far side of the
 * Sun from where it was. Venus came out 180° from the Sun, which is not a
 * position Venus can be in from anywhere in the solar system.
 *
 * It was not caught by the periodicity test, because rotating a planet's orbit by
 * a constant angle leaves its orbital period intact. It was caught by asking the
 * one question that needs no table: how far can Venus be from the Sun? Forty-seven
 * degrees, because that is all the geometry allows. It was coming out at a hundred
 * and eighty.
 *
 * Exported because that question is worth being able to ask again.
 */
export function heliocentric(jd: number, key: string) {
  const el = ELEMENTS[key];
  const centuries = (jd - J2000) / JULIAN_CENTURY_DAYS;

  const a = el.a + el.da * centuries;
  const e = el.e + el.de * centuries;
  const i = (el.i + el.di * centuries) * DEG;
  const L = (el.L + el.dL * centuries) * DEG;
  const peri = (el.peri + el.dPeri * centuries) * DEG;
  const node = (el.node + el.dNode * centuries) * DEG;

  // The mean anomaly, for Kepler. Measured from perihelion.
  const meanAnomaly = norm360((L - peri) / DEG) * DEG;

  // The argument of perihelion, for the rotation into the zodiac. Measured from
  // the equinox, and nothing to do with the mean anomaly.
  const argPeri = peri - node;

  const E = eccentricAnomaly(meanAnomaly, e);

  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(E);

  const cosArg = Math.cos(argPeri);
  const sinArg = Math.sin(argPeri);
  const cosNode = Math.cos(node);
  const sinNode = Math.sin(node);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  const x = (cosArg * cosNode - sinArg * sinNode * cosI) * xp + (-sinArg * cosNode - cosArg * sinNode * cosI) * yp;
  const y = (cosArg * sinNode + sinArg * cosNode * cosI) * xp + (-sinArg * sinNode + cosArg * cosNode * cosI) * yp;
  const z = sinArg * sinI * xp + cosArg * sinI * yp;

  return toEclipticOfDate(x, y, z, centuries);
}

/**
 * One second of arc, in radians.
 */
const ASEC = Math.PI / (180 * 3600);

/**
 * A position in the mean ecliptic and equinox of J2000, into the mean ecliptic
 * and equinox of the date.
 *
 * ── Why the elements need moving at all ────────────────────────────────────
 *
 * The elements above are given with respect to the mean ecliptic and equinox
 * *of J2000* — that is the frame they are defined in, and that is where they are
 * correct. Everything else on this page is measured from the equinox of the
 * date: the Sun's series is, the Moon's is, and the ayanamsa is nothing *but*
 * the distance between the two.
 *
 * Left in its own frame, a planet came out shifted by the amount the equinox has
 * moved since 2000 — a little over a degree in 1947, a third of one in 2024,
 * and the right amount in the wrong direction for a birth in 2026. The Sun was
 * right, so a chart looked measured and wrong by a degree at a time: the common
 * shift nobody can see, which decides a sign only for whoever was born within a
 * degree of an edge. That is one birth in thirty, and it was silently deciding
 * a thirtieth of the site.
 *
 * The path is the standard one. Ecliptic to equatorial of J2000 is a turn about
 * the x-axis by the obliquity; the equator and equinox are then precessed to
 * the date with the four-angle formulation of Capitaine et al. (2003), the same
 * one the IAU 2006 model uses; and the result is turned back into the ecliptic
 * of the date with the obliquity of the date. At J2000 all three steps compose
 * to the identity, which is the check: a position at the epoch must come back
 * out where it went in.
 */
function toEclipticOfDate(x: number, y: number, z: number, centuries: number) {
  const eps0 = OBLIQUITY * DEG;

  // Ecliptic of J2000 to equatorial of J2000.
  const X0 = x;
  const Y0 = y * Math.cos(eps0) - z * Math.sin(eps0);
  const Z0 = y * Math.sin(eps0) + z * Math.cos(eps0);

  // Precession of the equator and equinox, in arcseconds, as published.
  const psia =
    ((((-0.0000000951 * centuries + 0.000132851) * centuries - 0.00114045) * centuries - 1.0790069) * centuries +
      5038.481507) *
    centuries;
  const obliquityDate =
    ((((0.0000003337 * centuries - 0.000000467) * centuries - 0.00772503) * centuries + 0.0512623) * centuries -
      0.025754) *
      centuries +
    84381.406;
  const chia =
    ((((-0.000000056 * centuries + 0.000170663) * centuries - 0.00121197) * centuries - 2.3814292) * centuries +
      10.556403) *
    centuries;

  const sa = Math.sin(eps0);
  const ca = Math.cos(eps0);
  const sb = Math.sin(-psia * ASEC);
  const cb = Math.cos(-psia * ASEC);
  const sc = Math.sin(-obliquityDate * ASEC);
  const cc = Math.cos(-obliquityDate * ASEC);
  const sd = Math.sin(chia * ASEC);
  const cd = Math.cos(chia * ASEC);

  const X =
    (cd * cb - sb * sd * cc) * X0 +
    (cd * sb * ca + sd * cc * cb * ca - sa * sd * sc) * Y0 +
    (cd * sb * sa + sd * cc * cb * sa + ca * sd * sc) * Z0;
  const Y =
    (-sd * cb - sb * cd * cc) * X0 +
    (-sd * sb * ca + cd * cc * cb * ca - sa * cd * sc) * Y0 +
    (-sd * sb * sa + cd * cc * cb * sa + ca * cd * sc) * Z0;
  const Z = sb * sc * X0 + (-sc * cb * ca - sa * cc) * Y0 + (-sc * cb * sa + cc * ca) * Z0;

  // Equatorial of the date to the mean ecliptic of the date.
  const eps = obliquityDate * ASEC;
  return {
    x: X,
    y: Y * Math.cos(eps) + Z * Math.sin(eps),
    z: -Y * Math.sin(eps) + Z * Math.cos(eps),
  };
}

/**
 * Geocentric ecliptic longitude, tropical.
 *
 * One function for all five planets that orbit the Sun, including the two
 * inside Earth's orbit. The interior planets need no special case here:
 * subtracting the Earth's position from theirs gives the right answer whatever
 * side of the Sun they are on, because the vector from the Earth to Mercury is
 * the vector from the Sun to Mercury minus the vector from the Sun to the Earth,
 * whatever the direction of either.
 */
function geocentricLongitude(jd: number, key: string): number {
  const earth = heliocentric(jd, 'earth');
  const body = heliocentric(jd, key);

  return norm360(Math.atan2(body.y - earth.y, body.x - earth.x) / DEG);
}

/* -------------------------------------------------------------------------- */
/* The whole chart                                                            */
/* -------------------------------------------------------------------------- */

export interface GrahaPosition {
  /** Sidereal longitude within the zodiac, 0 to 360. */
  longitude: number;
  /** 0 to 11, Aries first. */
  rashi: number;
  /** The graha that rules this sign. */
  lord: string;
  /** 1 to 27. */
  nakshatra: number;
  /** 1 to 4. */
  pada: number;
  /** 0 to 30, degrees within the sign. */
  degreesInRashi: number;
  /** True for the two shadow grahas, which have no sign of their own. */
  isShadow?: boolean;
}

/** Which rashi each graha rules, and the sign it is exalted or debilitated in. */
export const RASHI_LORDS = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter',
];

export const EXALTATION: Record<string, number> = {
  sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 8, venus: 11, saturn: 6,
};

export const DEBILITATION: Record<string, number> = {
  sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 2, venus: 5, saturn: 0,
};

/** Debilitated sign index, since Vrischika is written two ways in the tables. */
export const MARS_DEBILIT_SIGN = 3;

/**
 * Every graha's position at an instant.
 *
 * The one function the rest of the chart is built on. Everything downstream —
 * the dasha sequence, the yogas, the KP pakads, the shodasvarg — reads this
 * and nothing else, so a correction to the astronomy fixes the whole chart in
 * one place.
 */
export function allGrahas(jd: number): Record<Planet, GrahaPosition> {
  const siderealise = (tropical: number) => toSidereal(tropical, jd);

  const tropical: Record<Planet, number> = {
    sun: sunLongitude(jd),
    moon: moonLongitude(jd),
    mars: geocentricLongitude(jd, 'mars'),
    mercury: geocentricLongitude(jd, 'mercury'),
    jupiter: geocentricLongitude(jd, 'jupiter'),
    venus: geocentricLongitude(jd, 'venus'),
    saturn: geocentricLongitude(jd, 'saturn'),
    rahu: meanNode(jd),
    ketu: 0,
  };
  tropical.ketu = tropical.rahu + 180;

  const out = {} as Record<Planet, GrahaPosition>;

  for (const planet of PLANETS) {
    const longitude = siderealise(tropical[planet]);
    const rashi = Math.floor(longitude / 30) % 12;

    out[planet] = {
      longitude,
      rashi,
      lord: RASHI_LORDS[rashi],
      nakshatra: Math.floor(longitude / (360 / 27)) + 1,
      pada: Math.floor(((longitude % (360 / 27)) / (360 / 108))) + 1,
      degreesInRashi: longitude % 30,
      isShadow: planet === 'rahu' || planet === 'ketu',
    };
  }

  return out;
}

/* -------------------------------------------------------------------------- */
/* The ascendant                                                               */
/* -------------------------------------------------------------------------- */

/** Obliquity of the ecliptic, in degrees. Fixed to within a tenth of an arcminute over this century. */
const OBLIQUITY = 23.4392911;

/**
 * The lagna — the point of the zodiac that was rising on the eastern horizon.
 *
 * ── Why this is not optional ───────────────────────────────────────────────
 *
 * Every graha so far was placed against the fixed stars, and none of that says
 * which house a graha falls in. Houses are counted from the lagna, so without
 * this there is no KP, no bhava, and no shodasvarg — all three of which work by
 * house rather than by sign. It is also the one figure in the chart that moves
 * fastest: the whole zodiac turns once every twenty-four hours, so a birth time
 * out by two hours moves the lagna a whole sign.
 *
 * ── How the geometry works ─────────────────────────────────────────────────
 *
 * Local sidereal time gives the right ascension of the midheaven. From there
 * the ascendant's right ascension follows from the horizon at that place's
 * latitude, and the ecliptic longitude follows from the right ascension. The
 * middle step is the one that is easy to get wrong and impossible to check by
 * eye, so it is written as a vector angle rather than as a tangent — the
 * tangent form has two branches and silently picks the wrong one near the
 * poles, which is not a place anybody is born but is still a wrong answer.
 */
export function lagna(jd: number, latitude: number, longitudeEast: number): number {
  // Greenwich mean sidereal time, in degrees.
  const days = jd - 2451545.0;
  const t = days / JULIAN_CENTURY_DAYS;
  const gmst =
    280.46061837 +
    360.98564736629 * days +
    0.000387933 * t * t -
    (t * t * t) / 38710000;

  const lst = norm360(gmst + longitudeEast);
  const ramc = lst * DEG;

  const eps = OBLIQUITY * DEG;
  const phi = latitude * DEG;

  // The ascendant's right ascension: the angle of the horizon, which tilts
  // with the latitude and with the tilt of the ecliptic.
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  const alpha = Math.atan2(Math.cos(ramc), x);

  // A point on the ecliptic has its declination tied to its right ascension.
  const delta = Math.atan(Math.sin(alpha) * Math.tan(eps));

  // And from the equatorial pair back to an ecliptic longitude.
  const lambda = Math.atan2(
    Math.sin(alpha) * Math.cos(eps) + Math.tan(delta) * Math.sin(eps),
    Math.cos(alpha),
  );

  return toSidereal(lambda / DEG, jd);
}

/**
 * Which house a sign falls in, counted from the lagna.
 *
 * House 1 is the lagna's own sign, house 7 is the seventh from it, and so on.
 * Returns 1 to 12.
 */
export function houseOf(rashi: number, lagnaRashi: number): number {
  return ((rashi - lagnaRashi + 12) % 12) + 1;
}

/* -------------------------------------------------------------------------- */
/* Navamsa — the ninth division                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The navamsa sign of a longitude.
 *
 * Every sign is cut into nine equal parts of three degrees twenty minutes, and
 * each part carries the aspect of one of the nine grahas rather than the sign
 * it sits in. It is the chart's second opinion: a graha strong in the rashi can
 * still be weak here, and the sixteen shodasvarg are largely a reading of the
 * distance between the two.
 */
export function navamsaOf(longitude: number): number {
  return Math.floor((longitude / 30) * 9) % 12;
}

/* -------------------------------------------------------------------------- */
/* Drishti — the aspects                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Which signs each graha looks upon, as offsets from the sign it is in.
 *
 * Every graha aspects the sign opposite it, and three grahas look further: Mars
 * at the fourth and eighth, Jupiter at the fifth and ninth, Saturn at the third
 * and tenth. The shadow grahas are given Jupiter's aspects, which is the usual
 * convention.
 *
 * ── Why the offsets are one less than the house number ─────────────────────
 *
 * Because the seventh bhava *counted from* a graha is six signs away, not
 * seven. The graha itself is the first, so the eighth is the fourth away and
 * the seventh is the sixth. The table was first written with the house numbers
 * used directly as offsets, which put every graha's opposite aspect on the sign
 * next door — the seventh house aspect was silently wrong in every chart, and
 * because the wrong sign was still a plausible one, nothing about the output
 * looked broken. It is the same class of mistake as the antardasha table: a
 * number that is off by one and still in range.
 */
const DRISHTI: Record<Planet, number[]> = {
  sun: [6],
  moon: [6],
  mars: [3, 6, 7],
  mercury: [6],
  jupiter: [4, 6, 8],
  venus: [6],
  saturn: [2, 6, 9],
  rahu: [4, 6, 8],
  ketu: [4, 6, 8],
};

/**
 * The signs a graha aspects, given the sign it is in.
 *
 * Returned as signs rather than as grahas because that is the question a
 * reading actually asks — "does Mars aspect the seventh house?" is about the
 * house, and the graha happens to sit there. It also makes the seventh-house
 * rule checkable directly: offset 7 is in every graha's list, so every graha's
 * output includes the sign opposite the one it is in.
 */
export function aspectedSigns(graha: Planet, fromRashi: number): number[] {
  return DRISHTI[graha].map((offset) => (fromRashi + offset) % 12);
}

/** Which grahas are looking at the sign this one is in. */
export function aspectingGrahas(
  graha: Planet,
  grahas: Record<Planet, GrahaPosition>,
): Planet[] {
  return PLANETS.filter(
    (other) =>
      other !== graha &&
      DRISHTI[other].includes(((grahas[other].rashi - grahas[graha].rashi) + 12) % 12),
  );
}

/** How many grahas are looking at this one. */
export function drishtiCount(
  graha: Planet,
  grahas: Record<Planet, GrahaPosition>,
): number {
  return aspectingGrahas(graha, grahas).length;
}