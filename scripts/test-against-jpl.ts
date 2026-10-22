/**
 * The site's positions, against JPL's own ephemeris.
 *
 *     npx tsx scripts/test-against-jpl.ts
 *
 * ── Why this file exists ───────────────────────────────────────────────────
 *
 * test-ephemeris.ts checks the planets against the calendar: the Sun at 0° in
 * March, the Moon repeating every 27.32 days. Those are real checks, and they
 * caught a Sun fifty degrees out — but they are checks of *consistency*, not of
 * position. A series can be internally perfect and put Mars six degrees from
 * where Mars is, because nothing in it ever mentions Mars.
 *
 * This file mentions Mars. Every number below was read out of JPL's DE421
 * ephemeris — the same data NASA's Horizons serves, computed from planetary
 * positions measured by radar and spacecraft, not from any theory — at five
 * instants spread over the whole range of births this site accepts:
 *
 *   14 August 1947, the night of Independence
 *   15 May 1990, 19 November 1999, 21 February 2010, 15 June 2024
 *
 * ── Why the numbers are written down instead of fetched ────────────────────
 *
 * Because a test that needs the network is a test nobody runs. The sky does not
 * change, so a fixed answer is not a stale answer: DE421 covers 1900 to 2050
 * and these five instants will still be right in a hundred years. Anyone who
 * wants to re-derive them can, with the three lines of skyfield that produced
 * them, quoted in the footer.
 *
 * ── What the tolerances mean ───────────────────────────────────────────────
 *
 * Not "close enough to look right" — the tolerances are the accuracy of the
 * published elements the site computes from, which is the best any analytic
 * method can do:
 *
 *   · the Sun and the Moon are series with every term kept that matters, so
 *     0.02° and 0.10°
 *   · Mercury, Venus and Mars: 0.03°
 *   · Jupiter and Saturn: 0.15° and 0.20°, because the published tables they
 *     are computed from are stated to 0.09° and 0.15° and no better
 *
 * One systematic sits under all of it. The site works in the *mean* ecliptic of
 * the date; JPL's apparent position is the *true* ecliptic of the date, which
 * nutation tips by up to 0.005°. Inside every tolerance below, and worth knowing
 * so that a fifth of a thousandth is never chased as a bug.
 */

import { allGrahas, ayanamsa } from '../src/content/grahas';
import { julianDayFromUTC } from '../src/content/julian';

/** One birth, and where every body actually was. */
type Reading = {
  label: string;
  utc: [number, number, number, number, number];
  /** Geocentric longitude, tropical, mean ecliptic and equinox of date. */
  truth: Record<string, number>;
};

const JPL: Reading[] = [
  {
    label: '14 August 1947, 18:30 UTC',
    utc: [1947, 8, 14, 18, 30],
    truth: {
      sun: 141.11100,
      moon: 117.10785,
      mercury: 126.79639,
      venus: 135.68322,
      mars: 90.57817,
      jupiter: 228.99952,
      saturn: 133.59489,
    },
  },
  {
    label: '15 May 1990, 05:00 UTC',
    utc: [1990, 5, 15, 5, 0],
    truth: {
      sun: 54.11486,
      moon: 293.56824,
      mercury: 38.05074,
      venus: 12.48570,
      mars: 348.11721,
      jupiter: 99.48662,
      saturn: 295.25427,
    },
  },
  {
    label: '19 November 1999, 00:00 UTC',
    utc: [1999, 11, 19, 0, 0],
    truth: {
      sun: 236.19802,
      moon: 357.74351,
      mercury: 229.19973,
      venus: 190.73345,
      mars: 294.44507,
      jupiter: 26.68625,
      saturn: 42.71018,
    },
  },
  {
    label: '21 February 2010, 04:15 UTC',
    utc: [2010, 2, 21, 4, 15],
    truth: {
      sun: 332.42234,
      moon: 52.03845,
      mercury: 316.16720,
      venus: 342.10426,
      mars: 122.26592,
      jupiter: 337.97916,
      saturn: 183.38850,
    },
  },
  {
    label: '15 June 2024, 12:30 UTC',
    utc: [2024, 6, 15, 12, 30],
    truth: {
      sun: 84.89581,
      moon: 189.01156,
      mercury: 85.93003,
      venus: 87.85834,
      mars: 34.68445,
      jupiter: 64.77178,
      saturn: 349.25869,
    },
  },
];

/** How far each body may be from JPL, in degrees. See the header. */
const TOLERANCE: Record<string, number> = {
  sun: 0.02,
  moon: 0.10,
  mercury: 0.03,
  venus: 0.03,
  mars: 0.03,
  jupiter: 0.15,
  saturn: 0.20,
};

let passed = 0;
let failed = 0;
let worst = 0;

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

function norm360(x: number): number {
  return ((x % 360) + 360) % 360;
}

function signedGap(a: number, b: number): number {
  return (a - b + 540) % 360 - 180;
}

console.log();
console.log('The site, against JPL DE421');
console.log('='.repeat(60));

for (const reading of JPL) {
  const [y, m, d, h, min] = reading.utc;
  const jd = julianDayFromUTC(y, m, d, h, min);
  const grahas = allGrahas(jd);
  const ayan = ayanamsa(jd);

  console.log();
  console.log(reading.label);

  for (const [body, expected] of Object.entries(reading.truth)) {
    const graha = grahas[body as keyof typeof grahas];
    if (!graha || typeof graha.longitude !== 'number') continue;

    // The site gives sidereal; JPL gives tropical. The ayanamsa is the only
    // thing standing between them, so this checks the chain the page uses.
    const tropical = norm360(graha.longitude + ayan);
    const gap = Math.abs(signedGap(tropical, expected));
    worst = Math.max(worst, gap);
    const allowed = TOLERANCE[body];
    check(
      `${body.padEnd(8)} ${gap.toFixed(4)}° from JPL (allowed ${allowed}°)`,
      gap <= allowed,
      `site ${tropical.toFixed(5)}°, JPL ${expected.toFixed(5)}°`,
    );
  }
}

console.log();
console.log('='.repeat(60));
console.log(`  ${passed} passed, ${failed} failed, worst gap ${worst.toFixed(4)}°`);
console.log();
console.log('  Re-deriving the reference, for whoever wants to:');
console.log('    from skyfield.api import load');
console.log('    from skyfield.framelib import ecliptic_frame');
console.log("    ts = load.timescale(); eph = load('de421.bsp'); earth = eph['earth']");
console.log('    t = ts.utc(1947, 8, 14, 18, 30)');
console.log("    _, lon, _ = earth.at(t).observe(eph['mars']).apparent().frame_latlon(ecliptic_frame)");
console.log('    print(lon.degrees)');
console.log();

process.exit(failed > 0 ? 1 : 0);
