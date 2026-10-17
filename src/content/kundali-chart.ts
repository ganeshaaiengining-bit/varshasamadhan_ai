import { RASHIS } from '@/content/astrology';
import { GRAHA_NAMES, PLANETS, type Planet, type GrahaPosition } from '@/content/grahas';
import { NAKSHATRAS } from '@/content/astrology';

/**
 * ===========================================================================
 *  THE CHART ITSELF
 * ===========================================================================
 *
 * Everything else on this sheet is a table of the chart. This is the chart.
 *
 * ── Why it is drawn as an SVG and not as a table of boxes ──────────────────
 *
 * Because a kundali is a *picture of the sky*, and a picture cannot be a list.
 * A reader who is told that Saturn is in the twelfth house has to believe it; a
 * reader who sees Saturn written inside the twelfth house does not.
 *
 * It is also why this file had been missing entirely. Everything else — the
 * dasha, the phaladesh, the shodasvarga, the yoga, the ashtakavarga — is
 * computed from the chart, and all of it could be correct while the chart
 * itself was never drawn. Which is exactly what happened: the numbers were
 * right, the tables were right, and there was nothing to look at.
 *
 * ── Which style, and why this one ──────────────────────────────────────────
 *
 * The **South Indian** grid, where the twelve signs sit in fixed boxes and only
 * the house numbers move.
 *
 * That is the easier of the two to get right, and "easier to get right" is the
 * whole argument. In the North Indian diamond the shape of each cell is a
 * triangle meeting a centre, and a cell drawn in the wrong place is still a
 * well-formed triangle; the layout is only right if twelve specific polygon
 * points are right. In the South Indian grid every sign is a rectangle and the
 * order is the order of the zodiac, so a cell in the wrong place is a sign in
 * the wrong place — which is visible, testable, and impossible to hide.
 *
 * The layout below is stated as a flat list of signs in reading order. That is
 * the whole chart, and it can be checked by eye against the zodiac in one pass.
 */

/** The twelve signs, in the order they sit in the grid, reading across and down. */
export const SOUTH_INDIAN_ORDER: number[] = [
  0, 1, 2, 3,          // row 1: Aries, Taurus, Gemini, Cancer
  4, -1, -2, 7,        // row 2: Leo, — —, Scorpio
  -3, 5, 6, -4,        // row 3: — Virgo, Libra, —
  8, 9, 10, 11,        // row 4: Sagittarius, Capricorn, Aquarius, Pisces
];

/** Where each sign falls: grid index 0 to 15. */
export const SIGN_CELL: Record<number, number> = (() => {
  const map: Record<number, number> = {};
  SOUTH_INDIAN_ORDER.forEach((sign, cell) => {
    if (sign >= 0) map[sign] = cell;
  });
  return map;
})();

export interface ChartPlanet {
  graha: Planet;
  name: string;
  sign: number;
  house: number;
  degreesInRashi: number;
  /** Retrograde, which the chart marks beside the name. */
  retrograde: boolean;
  /** True for the two shadow grahas, which get a slightly different mark. */
  shadow: boolean;
}

export interface KundaliChartProps {
  grahas: Record<Planet, GrahaPosition>;
  /** House number for each graha, already worked out by the chart. */
  houses: Record<Planet, number>;
  lagnaRashi: number;
  /** The mahadasha running now, so the chart can say which box it is in. */
  running?: { graha: Planet; start: number; end: number } | null;
  /** Retrograde marks, from the motion of each graha, when the site has them. */
  retrograde?: Partial<Record<Planet, boolean>>;
}

/**
 * The chart, as data.
 *
 * Kept apart from the drawing so that what the chart *says* can be checked
 * without looking at it — which is the whole point of this file existing.
 */
export function chartPlanets(
  grahas: Record<Planet, GrahaPosition>,
  houses: Record<Planet, number>,
  retrograde: Partial<Record<Planet, boolean>> = {},
): ChartPlanet[] {
  return PLANETS.filter((p) => grahas[p]).map((graha) => ({
    graha,
    name: GRAHA_NAMES[graha].hindi,
    sign: grahas[graha].rashi,
    house: houses[graha] ?? 12,
    degreesInRashi: grahas[graha].degreesInRashi,
    retrograde: retrograde[graha] ?? false,
    shadow: Boolean(grahas[graha].isShadow),
  }));
}

/** Every cell's contents, keyed by grid cell 0 to 15. */
export function chartCells(planets: ChartPlanet[]): ChartPlanet[][] {
  const cells: ChartPlanet[][] = Array.from({ length: 16 }, () => []);

  for (const planet of planets) {
    const cell = SIGN_CELL[planet.sign];
    if (cell !== undefined) cells[cell].push(planet);
  }

  return cells;
}

/** Degrees as the chart shows them — 20° 34′, not 20.5667. */
export function degreesText(degrees: number): string {
  const whole = Math.floor(degrees);
  const minutes = Math.round((degrees - whole) * 60);
  const carry = minutes === 60 ? { whole: whole + 1, minutes: 0 } : { whole, minutes };
  return `${carry.whole}° ${String(carry.minutes).padStart(2, '0')}′`;
}

/** The nakshatra a longitude falls in, for the chart's small print. */
export function nakshatraOf(position: GrahaPosition): string {
  return NAKSHATRAS[position.nakshatra - 1] ?? '';
}