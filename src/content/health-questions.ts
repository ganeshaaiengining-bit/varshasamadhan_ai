/**
 * ===========================================================================
 *  HEALTH QUESTIONS, BY AGE
 * ===========================================================================
 *
 * The question box on `/sahayata` asks an open question, and an open question is
 * hard to put to a help service when you are in pain and not sure what to call
 * it. "My back hurts" might be a muscle strain, a slipped disc or kidney stones,
 * and the words for those in the languages this site serves are not the same
 * words.
 *
 * So this is a set of *questions*, grouped by age, that a visitor can tap instead
 * of typing. Tapping one fills the box and asks it.
 *
 * ── Why these are questions and not answers ────────────────────────────────
 *
 * Every string on this page is a question the visitor would ask, never advice
 * about what to do. That distinction is the whole point: a question cannot be
 * wrong in the way medical guidance can, and it lets the answer come from the AI
 * in the visitor's own language rather than from a static list written once and
 * never reviewed. Health advice baked into a component is health advice that
 * nobody re-reads when the guidance changes.
 *
 * ── Why age is the first cut ───────────────────────────────────────────────
 *
 * Not because age decides what is wrong with you — it does not — but because the
 * *questions* differ sharply across a life. A question about a nine-month-old's
 * fever is a different question from one about a seventy-year-old's, and neither
 * can be usefully asked of the other. The bands are by age because that is the
 * one thing everyone knows about themselves without having to diagnose
 * anything.
 *
 * The bands are wide at the top on purpose. Beyond about eighty, the same
 * question often has a different answer because of the medicines already being
 * taken rather than because of the age itself, and pretending to separate
 * "seventy-five" from "eighty-five" would be a precision this data does not have.
 *
 * ── Why this file holds keys and not text ──────────────────────────────────
 *
 * The questions live in `i18n.ts` like every other string on the site, and this
 * file only decides the grouping. That is not tidiness for its own sake: a
 * question hard-coded here would be read aloud to a Tamil visitor in Hindi,
 * which on a health page is worse than showing nothing at all.
 *
 * The cost is that the number of questions per band is fixed at `QUESTIONS_PER_BAND`
 * so that the key names line up. Adding a fifth question means adding a fifth
 * question to every language table, which is the correct amount of friction.
 */

/** How many tap-to-ask questions each band carries. See the note above. */
export const QUESTIONS_PER_BAND = 4;

export interface AgeBand {
  /** Machine-readable key. Used in state, in the DOM id, and in the key names. */
  id: string;
  /** Inclusive bounds, so the number the visitor types maps to exactly one band. */
  from: number;
  to: number;
  /**
   * One line about what this band is for, shown under the heading.
   * Prefix for the i18n key; always paired with `health.band.<id>.note`.
   */
  noteKey: string;
}

export const AGE_BANDS: AgeBand[] = [
  { id: 'infant', from: 0, to: 2, noteKey: 'health.band.infant.note' },
  { id: 'child', from: 3, to: 12, noteKey: 'health.band.child.note' },
  { id: 'teen', from: 13, to: 17, noteKey: 'health.band.teen.note' },
  { id: 'young', from: 18, to: 30, noteKey: 'health.band.young.note' },
  { id: 'middle', from: 31, to: 45, noteKey: 'health.band.middle.note' },
  { id: 'later', from: 46, to: 60, noteKey: 'health.band.later.note' },
  { id: 'senior', from: 61, to: 75, noteKey: 'health.band.senior.note' },
  { id: 'elder', from: 76, to: 100, noteKey: 'health.band.elder.note' },
];

/**
 * The band a given age falls into.
 *
 * Returns undefined for anything outside 0–100 rather than clamping, so a
 * visitor who types 150 gets no band and no questions instead of quietly being
 * treated as the oldest bracket — which would hand a twenty-year-old the
 * questions meant for someone else's grandmother.
 */
export function bandForAge(age: number): AgeBand | undefined {
  if (!Number.isFinite(age)) return undefined;
  return AGE_BANDS.find((band) => age >= band.from && age <= band.to);
}

/**
 * The i18n key for one of a band's questions.
 *
 * Built here rather than written out at the call site so the shape of the key is
 * decided in one place and a typo becomes a missing string that `coverage.py`
 * reports, not a question chip that silently renders as the raw key.
 */
export function questionKey(band: AgeBand, index: number): string {
  return `health.q.${band.id}${index + 1}`;
}

/** The i18n key for a band's tap-to-ask button, which shows a shorter form. */
export function chipKey(band: AgeBand, index: number): string {
  return `health.c.${band.id}${index + 1}`;
}