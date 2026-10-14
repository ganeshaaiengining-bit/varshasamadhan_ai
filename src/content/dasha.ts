import { partsFromJulianDay } from './julian';
import {
  allGrahas,
  type GrahaPosition,
  type Planet,
  PLANETS,
  GRAHA_NAMES,
} from './grahas';

/**
 * ===========================================================================
 *  VIMSHOTTARI DASHA — the 120-year sequence
 * ===========================================================================
 *
 * The Moon at birth decides which of the nine grahas has the first turn, and
 * from there the years run in a fixed order with fixed lengths. Nothing after
 * the first step is calculated: it is a sequence.
 *
 *   Ketu 7 · Venus 20 · Sun 6 · Moon 10 · Mars 7
 *   Rahu 18 · Jupiter 16 · Saturn 19 · Mercury 17
 *
 * Total 120, which is why it is called the 120-year cycle and why a chart is
 * said to be worth a hundred and twenty years.
 *
 * ── Why the Moon decides, and not the Sun ──────────────────────────────────
 *
 * A graha's dasha begins when it comes to the Moon's position. So the Moon's
 * nakshatra is counted backwards from Ketu, and whatever graha that lands on
 * is the one running at birth. This is the one place in the whole system where
 * an error in the Moon's position moves everything else, which is why the Moon's
 * series in grahas.ts carries more terms than any other.
 *
 * ── Why the balance point is the antardasha, not the start ──────────────────
 *
 * A chart almost never begins at a dasha boundary. Somebody born mid-period is
 * partway through one, and the part before their birth is their balance —
 * antardasha, the period that runs to the end of the graha's own time.
 *
 * A chart that started the list at the first boundary either lied about the
 * years before the birth or quietly moved them. This one keeps the real
 * boundary and says how much of the first period is already gone.
 */

const ORDER: Planet[] = [
  'ketu', 'venus', 'sun', 'moon', 'mars',
  'rahu', 'jupiter', 'saturn', 'mercury',
];

/** Years each graha holds the whole maha-dasha. */
const YEARS: Record<Planet, number> = {
  ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7,
  rahu: 18, jupiter: 16, saturn: 19, mercury: 17,
};

/*
 * There is no separate table of antardasha lengths.
 *
 * It was there — nine small numbers — and it was the reason the sub-periods of
 * a six-year dasha came to 1.8 years instead of 6. A sub-period is not a share
 * of the parent's *count* of sub-periods; it is that graha's own slice of the
 * 120-year cycle, scaled to the parent. So:
 *
 *     antar(X) inside maha(M) = YEARS[X] / 120 × YEARS[M]
 *
 * which sums to exactly YEARS[M] over all nine, because the nine YEARS sum to
 * 120. That identity is the check the test makes, and it is why there is no
 * table to keep in step with anything.
 */
const CYCLE_TOTAL = 120;

export interface DashaPeriod {
  graha: Planet;
  /** Where this graha sits in the nine-step order, 0 to 8. */
  step: number;
  /** Start year, counted from the birth year. May be negative. */
  startYear: number;
  /** End year, inclusive. */
  endYear: number;
  /**
   * How much of this period is already spent at the moment of birth.
   *
   * Negative for the one the person is born into, because part of it is behind
   * them. Zero for the rest. The page shows it rather than hiding the period.
   */
  antardasha?: Antardasha;
}

export interface Antardasha {
  graha: Planet;
  /** The sign this sub-period falls in, counted backwards from the lord's own. */
  rashi: number;
  /** Years from the start of the maha-dasha, can be negative at a birth. */
  startYear: number;
  endYear: number;
}

/**
 * The dasha sequence from birth to 120.
 *
 * The first graha is the one the Moon is in, and the sequence walks forward in
 * the fixed order from there. The first period's start is negative when the
 * person is born partway through it.
 */
export function vimshottari(jd: number, birthYear: number): {
  periods: DashaPeriod[];
  current: DashaPeriod | null;
  age: number;
} {
  const grahas = allGrahas(jd);

  /*
   * Which graha the Moon is in.
   *
   * Ashwini, the first nakshatra, belongs to Ketu, and the grahas then follow
   * the fixed order. So the step is the nakshatra number less one, modulo nine.
   *
   * This was `(27 - nakshatra) % 9`, which counts the other way and puts
   * Ashwini on Mercury. Every chart came out full length with every first
   * dasha wrong, and a dasha of the right length with the wrong graha is the
   * hardest kind of wrong to notice: it looks complete.
   */
  const nakshatra = grahas.moon.nakshatra; // 1 to 27
  const startStep = (nakshatra - 1) % 9;

  /*
   * How much of this graha's time is already spent.
   *
   * From how far the Moon has come through its nakshatra. At the first degree
   * of Pushya the period has just begun and nothing is spent; at the last it is
   * nearly over and nearly all of it is. So the fraction of the *nakshatra*
   * travelled is the fraction of *this graha's years* that has gone.
   *
   * It was `moon.longitude / 360 * 120` before, which scales the balance by the
   * whole cycle rather than by the period. That put the balance past the end of
   * its own dasha in every case, so every chart began before the birth by more
   * than a dasha's length and no chart had a current dasha at all — the sequence
   * was still contiguous and still 120 years, which is why both of those checks
   * passed while the answer was wrong.
   */
  const nakshatraSpan = 360 / 27;
  const degreesIntoNakshatra = (nakshatra - 1) * nakshatraSpan;
  const fractionThrough = (grahas.moon.longitude - degreesIntoNakshatra) / nakshatraSpan;

  const firstGraha = ORDER[startStep];
  const elapsed = Math.max(0, Math.min(1, fractionThrough)) * YEARS[firstGraha];

  const periods: DashaPeriod[] = [];

  let cursor = birthYear - elapsed;

  // The first period runs from its true boundary, which is before the birth.
  periods.push({
    graha: firstGraha,
    step: startStep,
    startYear: cursor,
    endYear: cursor + YEARS[firstGraha],
    antardasha: antarAtBirth(cursor, firstGraha, grahas),
  });

  cursor += YEARS[firstGraha];

  for (let i = 1; i < 9; i += 1) {
    const step = (startStep + i) % 9;
    const graha = ORDER[step];
    periods.push({
      graha,
      step,
      startYear: cursor,
      endYear: cursor + YEARS[graha],
    });
    cursor += YEARS[graha];
  }

  /*
   * Which period is running, compared in the same units the periods are in.
   *
   * The periods carry absolute years — 1975 comes out as 1967 to 1984 — while
   * the returned age is counted from the birth. Comparing one against the other
   * finds nothing, which is what happened: every chart reported no running
   * dasha at all. Both are absolute here and the age is derived afterwards.
   */
  const year = jdToYear(jd);

  const current =
    periods.find((p) => year >= p.startYear && year < p.endYear) ?? null;

  const age = year - birthYear;

  return { periods, current, age };
}

/**
 * The antardasha running at the moment of birth.
 *
 * Within the first maha-dasha only: after its boundary the sequence is known
 * without reference to the birth, so only the first one is not. It is worked
 * out here rather than returned as a guess because a chart that names a
 * sub-period it invented is worse than one that names none.
 */
function antarAtBirth(
  startYear: number,
  firstGraha: Planet,
  grahas: Record<Planet, GrahaPosition>,
): Antardasha {
  const startRashi = grahas[firstGraha].rashi;
  const parent = YEARS[firstGraha];

  let cursor = startYear;
  let current: Planet = firstGraha;

  for (let i = 0; i < 9; i += 1) {
    current = ORDER[(ORDER.indexOf(firstGraha) + i) % 9];
    const length = (YEARS[current] / CYCLE_TOTAL) * parent;

    if (cursor + length > startYear) {
      return {
        graha: current,
        rashi: (startRashi - i + 12) % 12,
        startYear: cursor,
        endYear: cursor + length,
      };
    }

    cursor += length;
  }

  // Unreachable: the nine sub-periods sum to the parent exactly.
  return {
    graha: firstGraha,
    rashi: startRashi,
    startYear: cursor,
    endYear: cursor + (YEARS[firstGraha] / CYCLE_TOTAL) * parent,
  };
}

/**
 * The year containing a Julian day.
 *
 * ── Why this does not go through Date ───────────────────────────────────────
 *
 * It did, and it was thirty years out on every chart. `2451545.0` is the
 * Julian day of J2000 — 2000 January 1 — and it was being subtracted as though
 * it were the Unix epoch, which is 1970. Every birth therefore came out as
 * thirty years earlier than it was, the running dasha never matched the year
 * the person was born, and the tests that checked the sequence rather than the
 * years all passed.
 *
 * The fix is not a different constant so much as a different question. A Julian
 * day to a calendar date is arithmetic, and julian.ts already does it exactly,
 * so it is asked rather than approximated here.
 */
function jdToYear(jd: number): number {
  return partsFromJulianDay(jd).year;
}

/**
 * Every antardasha inside one maha-dasha.
 *
 * Two things start this list, and they used to be the same thing by accident.
 *
 * The *graha* order is the dasha order: it runs forward from the dasha lord.
 * The *raashi* order runs backwards from the sign the graha was born in, so the
 * second sub-period is in the sign before the lord's own. Only the graha order
 * decides which sub-period is which; the rashi is how the page describes it.
 *
 * Starting both from the dasha lord's own sign made the first and second
 * sub-periods belong to the same graha, which no chart anywhere does.
 */
export function antardashas(period: DashaPeriod, grahas: Record<Planet, GrahaPosition>): Antardasha[] {
  const length = YEARS[period.graha];
  const startRashi = grahas[period.graha].rashi;

  const out: Antardasha[] = [];
  let cursor = period.startYear;

  for (let i = 0; i < 9; i += 1) {
    const graha = ORDER[(period.step + i) % 9];
    const years = (YEARS[graha] / CYCLE_TOTAL) * length;

    out.push({
      graha,
      // The sign walks backwards, so sub-period two is in the sign before the
      // lord's own — which is why the graha order and the sign order start from
      // different places.
      rashi: (startRashi - i + 12) % 12,
      startYear: cursor,
      endYear: cursor + years,
    });

    cursor += years;
  }

  return out;
}

/** The graha name in the chart's language, so the page can render it. */
export function grahaLabel(graha: Planet, language: 'hindi' | 'english' = 'hindi'): string {
  const entry = GRAHA_NAMES[graha];
  return language === 'english' ? entry.name : entry.hindi;
}

/** Every graha in the fixed order, for building a chart table. */
export const DASHA_ORDER = ORDER;
export { PLANETS };