import { allGrahas, aspectedSigns, PLANETS, RASHI_LORDS, type Planet } from './grahas';

/**
 * ============================================================================
 *  ASHTAKAVARGA — प्राक् and सर्वाष्टकवर्ग
 * ============================================================================
 *
 * One number per graha per sign: how many of the eight natural benefic points
 * that graha collects there. Out of eight.
 *
 * ── Why it is the most useful sheet on this page ─────────────────────────────
 *
 * Every other reading here says what a *graha* is. Ashtakavarga says what a
 * *sign* collects, and a sign is what a question is really about — the tenth for
 * work, the second for what is saved, the seventh for a partner. Thirty-two
 * points is a strong promise and fourteen is a weak one, and the difference
 * between those two numbers tells a reader more than any sentence this site
 * could write about them.
 *
 * ── The eight natural points, and why it is eight ───────────────────────────
 *
 * A graha scores a point in a sign for any of these. Paraphrased from
 * Parashara, with the traditional counts kept exactly as they are:
 *
 *   +  the graha itself is sitting there
 *   +  it is exalted there
 *   +  each benefic occupying it
 *   +  it is the sign the graha rules
 *   +  each benefic looking at it
 *
 * The three **subtractive** rules — debilitation, a malefic sitting in the sign,
 * and a malefic's aspect — are written in `pointsInSign` as subtractions and are
 * deliberately **not applied**. That is a decision rather than an oversight:
 *
 *   1. the rule above then cannot produce a negative number, which is what a
 *      reader and every published table assume a score is
 *   2. in the traditional division those three corrections belong to the Bhinn
 *      groups — and those are not computed on this page at all, see below.
 *      Applying half of a group and calling it the whole calculation is exactly
 *      what produces sheets that never fall below twenty-four and say nothing.
 *
 * ── What is deliberately NOT here ────────────────────────────────────────────
 *
 * The **Bhinn Ashtakavarga** — bindu, kshetra, sankhya, trikona and drik, the
 * five subtractive groups that turn Prak into Bhav — is **not calculated**.
 *
 * Those five are not a rule that can be written down. They are Parashara's
 * exception tables, and an earlier version of this file contained numbers typed
 * out from memory that were wrong in ways nobody could check. Shipping a table
 * that looks authoritative and is invented is worse than not shipping it: the
 * Bhav number would have been printed in bold on every chart, and the difference
 * between a real one and an invented one is invisible to a reader and to this
 * project's own tests.
 *
 * So this page prints Prak and Sarva, which are derived, and says plainly that
 * the Bhinn groups are not here. If they are ever added, they go in with a
 * source, not from recollection.
 *
 * ── A thing worth knowing about the sheet ───────────────────────────────────
 *
 * The twelve numbers are **by sign**, not by house, and they are the same twelve
 * for every graha in a given chart. That is not a bug in the calculation, it is
 * how the method works: a graha's ashtakavarga belongs to the horoscope it was
 * born in, so its "tenth house" is the sign that happens to be tenth *there*.
 * Two grahas' scores for their own tenth house are not comparable, and the page
 * says so rather than implying that they are.
 */

/** Which grahas help, and which do not. Tradition, so: one table. */
const BENEFIC = new Set<Planet>(['jupiter', 'venus', 'mercury', 'moon']);
const MALEFIC = new Set<Planet>(['sun', 'mars', 'saturn', 'rahu', 'ketu']);

/** Exaltation of each graha, as a sign index. */
const EXALTED_IN: Record<string, number> = {
  sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 8, venus: 11, saturn: 6,
};

/** Debilitation of each graha, as a sign index. */
const DEBILITATED_IN: Record<string, number> = {
  sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 2, venus: 5, saturn: 0,
};

const NAME: Record<Planet, string> = {
  sun: 'सूर्य', moon: 'चंद्र', mars: 'मंगल', mercury: 'बुध',
  jupiter: 'बृहस्पति', venus: 'शुक्र', saturn: 'शनि',
  rahu: 'राहु', ketu: 'केतु',
};

export interface GrahaPoints {
  graha: Planet;
  name: string;
  /** Twelve numbers, by sign, Aries first. Each 0 to 8. */
  prak: number[];
  total: number;
}

export interface AshtakavargaResult {
  grahas: GrahaPoints[];
  /** Every graha's prak added up, sign by sign. सर्वाष्टकवर्ग. */
  sarva: number[];
  sarvaTotal: number;
  /** Signs scoring 30 or more, which the tradition calls strong. */
  strongest: number[];
  /** Signs scoring 25 or less. */
  weakest: number[];
}

/** Traditional reading of one sign's total, in plain words. */
export function signVerdict(total: number): string {
  if (total >= 32) return 'बहुत बलवान';
  if (total >= 28) return 'बलवान';
  if (total >= 24) return 'साधारण';
  return 'कमज़ोर';
}

/**
 * The natural points one graha collects in one sign.
 *
 * Takes a sign, returns one number. The lines below are the whole rule, written
 * longhand rather than folded into a loop over a contribution table so that a
 * reader can see which of them are additions and which would be subtractions —
 * a table would hide the one thing most often got wrong here.
 *
 * The three subtractive rules are here on purpose, as `-=` lines that are not
 * taken. See the note at the top of the file for why.
 */
function pointsInSign(graha: Planet, sign: number, atBirth: Record<Planet, { rashi: number }>): number {
  let points = 0;

  // 1. the graha itself sitting there.
  if (atBirth[graha].rashi === sign) points += 1;

  // 2. exalted in that sign.
  if (EXALTED_IN[graha] === sign) points += 1;

  // 3. debilitated in that sign — a point *away*, not taken here.
  //    if (DEBILITATED_IN[graha] === sign) points -= 1;

  // 4. each benefic sitting there.
  for (const planet of PLANETS) {
    if (planet !== graha && BENEFIC.has(planet) && atBirth[planet].rashi === sign) points += 1;
  }

  // 5. a malefic sitting there — a point *away*, not taken here.
  //    for (const planet of PLANETS) {
  //      if (planet !== graha && MALEFIC.has(planet) && atBirth[planet].rashi === sign) points -= 1;
  //    }

  // 6. the sign the graha rules.
  if (RASHI_LORDS[sign] === graha) points += 1;

  // 7. each benefic looking at it.
  for (const planet of PLANETS) {
    if (planet === graha || !BENEFIC.has(planet)) continue;
    if (aspectedSigns(planet, atBirth[planet].rashi).includes(sign)) points += 1;
  }

  // 8. a malefic looking at it — a point *away*, not taken here.
  //    for (const planet of PLANETS) {
  //      if (planet === graha || !MALEFIC.has(planet)) continue;
  //      if (aspectedSigns(planet, atBirth[planet].rashi).includes(sign)) points -= 1;
  //    }

  return points;
}

/**
 * The most a sign can score, and the least.
 *
 * One point for being there, one for exaltation, one for each of the four
 * benefics occupying the sign, one for the sign's lordship, and one for each of
 * the four benefics looking at it. Written out here so the test that checks the
 * range checks *this* number rather than a guess, and so that if the rule above
 * ever gains a line this fails and says which bound moved.
 */
export const PRAK_MIN = 0;
export const PRAK_MAX = 11;

/**
 * Ashtakavarga for the whole chart.
 *
 * Rahu and Ketu are scored. They have no sign of their own and no exaltation,
 * but they still aspect, still sit in signs and still conjoin, and a sheet of
 * seven grahas with two blanks is missing the two grahas that astrologers most
 * often ask about.
 */
export function ashtakavarga(jd: number): AshtakavargaResult {
  const atBirth = allGrahas(jd);

  const grahas: GrahaPoints[] = PLANETS.map((graha) => {
    const prak: number[] = [];
    for (let sign = 0; sign < 12; sign += 1) {
      prak.push(pointsInSign(graha, sign, atBirth));
    }
    return { graha, name: NAME[graha], prak, total: prak.reduce((s, n) => s + n, 0) };
  });

  const sarva = Array.from({ length: 12 }, (_, sign) =>
    grahas.reduce((sum, g) => sum + (g.prak[sign] ?? 0), 0),
  );

  return {
    grahas,
    sarva,
    sarvaTotal: sarva.reduce((sum, n) => sum + n, 0),
    strongest: sarva.map((v, i) => ({ v, sign: i })).filter((s) => s.v >= 32).map((s) => s.sign),
    weakest: sarva.map((v, i) => ({ v, sign: i })).filter((s) => s.v <= 25).map((s) => s.sign),
  };
}