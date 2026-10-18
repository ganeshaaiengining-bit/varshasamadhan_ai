'use client';

import * as React from 'react';
import { RASHIS } from '@/content/astrology';
import { GRAHA_NAMES, type Planet, type GrahaPosition } from '@/content/grahas';
import {
  chartPlanets,
  chartCells,
  degreesText,
  nakshatraOf,
  SOUTH_INDIAN_ORDER,
  SIGN_CELL,
} from '@/content/kundali-chart';

/**
 * The kundali, drawn.
 *
 * A fixed four-by-four grid of the twelve signs, with the ascendant's house
 * numbers marked and the planets written into the box they actually sit in.
 *
 * ── Why the grid is fixed ─────────────────────────────────────────────────
 *
 * Because in this style the *signs* never move — Aries is always top left —
 * and only the house numbers travel with the ascendant. That is what makes the
 * style legible at a glance: a reader who knows their sign finds their own box
 * with their eyes before reading a word.
 *
 * ── What is written in each box, and why in that order ────────────────────
 *
 *   · the sign, top right, in small type — it is fixed, so it is furniture
 *   · the house number, top left, in the one colour used for the ascendant
 *   · the planets, with their degrees, largest
 *   · a retrograde mark beside a planet that is retrograde
 *   · the sign's lord at the bottom of the box, for the house's own reading
 *
 * ── What is deliberately not in the box ───────────────────────────────────
 *
 * The nakshatra and the pada. They are real, they are printed in the table
 * beside this chart, and in a box four millimetres tall they would be a smudge.
 * A chart a reader cannot read is worse than a chart that leaves something to
 * the table next to it.
 */

/** Retrograde, from the actual motion of each graha over one day. */
function retrogradeFlags(grahas: Record<Planet, GrahaPosition>, jd: number) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { allGrahas } = require('@/content/grahas') as typeof import('@/content/grahas');

  const later = allGrahas(jd + 1);
  const now = grahas;

  const flags: Partial<Record<Planet, boolean>> = {};
  for (const graha of Object.keys(now) as Planet[]) {
    const a = now[graha]?.longitude;
    const b = later[graha]?.longitude;
    if (a === undefined || b === undefined) continue;

    let move = ((b - a) % 360 + 360) % 360;
    if (move > 180) move -= 360;
    flags[graha] = move < 0;
  }

  return flags;
}

export function KundaliChart({
  grahas,
  houses,
  lagnaRashi,
  jd,
  running,
}: {
  grahas: Record<Planet, GrahaPosition>;
  houses: Record<Planet, number>;
  lagnaRashi: number;
  jd: number;
  running?: { graha: Planet; start: number; end: number } | null;
}) {
  const retrograde = React.useMemo(() => retrogradeFlags(grahas, jd), [grahas, jd]);
  const planets = React.useMemo(
    () => chartPlanets(grahas, houses, retrograde),
    [grahas, houses, retrograde],
  );
  const cells = React.useMemo(() => chartCells(planets), [planets]);

  const runningCell = running ? SIGN_CELL[grahas[running.graha]?.rashi ?? -1] : undefined;

  return (
    <div className="mx-auto w-full max-w-[38rem]">
      <div className="grid grid-cols-4 overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-paper text-sm">
        {SOUTH_INDIAN_ORDER.map((sign, cellIndex) => {
          const here = cells[cellIndex] ?? [];

          if (sign < 0) {
            // One of the four cells the two diagonals run through. Left blank on
            // purpose: they are the inside of the chart, not a missing box.
            return (
              <div
                key={cellIndex}
                className="relative aspect-square border border-line bg-sun/5"
                aria-hidden="true"
              />
            );
          }

          const house = ((sign - lagnaRashi + 12) % 12) + 1;
          const isLagna = sign === lagnaRashi;
          const isRunning = cellIndex === runningCell;

          return (
            <div
              key={cellIndex}
              className={
                'relative flex aspect-square flex-col justify-between border border-line p-1.5 ' +
                (isLagna ? 'bg-saffron/15 ring-2 ring-inset ring-saffron' : 'bg-paper') +
                (isRunning ? ' outline outline-2 outline-leaf' : '')
              }
            >
              {/* house number, and the sign, in the corners */}
              <div className="flex items-start justify-between">
                <span className="flex items-start gap-1">
                  <span
                    className={
                      'text-xs tabular-nums ' +
                      (isLagna ? 'font-bold text-saffron-deep' : 'text-ink-subtle')
                    }
                    title={`${house}वाँ भाव`}
                  >
                    {house}
                  </span>

                  {/*
                   * The lagna mark, inside the box.
                   *
                   * It used to hang off the left edge of the cell — half on the
                   * border, half off it — which on the one house that is already
                   * outlined in orange read as a rendering fault rather than as a
                   * label. It belongs next to the house number it belongs to,
                   * and there is nothing to gain from putting it on the line
                   * between two houses.
                   */}
                  {isLagna && (
                    <span
                      className="-mt-0.5 bg-saffron px-1 text-[0.6rem] font-bold leading-none text-paper"
                      title="लग्न — यहीं से गिना जाता है"
                    >
                      ल
                    </span>
                  )}
                </span>
                <span className="text-[0.6rem] text-ink-subtle">{RASHIS[sign].name}</span>
              </div>

              {/* the planets */}
              <div className="flex flex-col items-center gap-0.5 text-center">
                {here.length === 0 && (
                  <span className="text-ink-subtle/60">—</span>
                )}
                {here.map((planet) => (
                  <div key={planet.graha} className="leading-tight">
                    <div
                      className={
                        'font-display ' +
                        (planet.shadow ? 'text-[0.95rem] text-ink-muted' : 'text-lg text-ink')
                      }
                    >
                      {planet.name}
                      {planet.retrograde && <sup className="text-[0.6rem]">℞</sup>}
                    </div>
                    <div className="text-[0.6rem] tabular-nums text-ink-subtle">
                      {degreesText(planet.degreesInRashi)}
                    </div>
                  </div>
                ))}
              </div>

              {/* the lord of the sign this house falls in */}
              <div className="text-right text-[0.6rem] text-ink-subtle">
                {RASHIS[sign].lord}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-sm text-ink-subtle">
        दक्षिणी शैली — राशियाँ अपनी जगह स्थिर रहती हैं, केवल भाव लग्न के साथ बदलते हैं।
        <span className="ml-2">℞ = वक्री</span>
      </p>
    </div>
  );
}

/**
 * The chart's own check on the page, in words.
 *
 * So that a reader — or whoever comes after — can confirm the drawing against
 * the numbers without counting boxes: every planet, its sign and its house.
 */
export function ChartLegend({
  grahas,
  houses,
}: {
  grahas: Record<Planet, GrahaPosition>;
  houses: Record<Planet, number>;
}) {
  return (
    <details className="rounded-lg border border-line p-4">
      <summary className="cursor-pointer font-medium">
        चित्र में क्या लिखा है — शब्दों में
      </summary>
      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {(Object.keys(grahas) as Planet[]).map((graha) => (
          <li key={graha}>
            <strong>{GRAHA_NAMES[graha].hindi}</strong> — {RASHIS[grahas[graha].rashi].name},{' '}
            {degreesText(grahas[graha].degreesInRashi)}, {nakshatraOf(grahas[graha])},{' '}
            {(houses[graha] ?? 12)}वाँ भाव
          </li>
        ))}
      </ul>
    </details>
  );
}