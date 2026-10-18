import { allGrahas, PLANETS, type Planet } from './grahas';
import { RASHIS } from './astrology';

/**
 * ============================================================================
 *  GOCHAR — the grahas in the sky today
 * ============================================================================
 *
 * ── What this is and is not ─────────────────────────────────────────────────
 *
 * The chart on the other tabs was true at the moment of birth and will never be
 * true again. This is the only tab that is about *now*, and it is the one a
 * reader opens when something has happened rather than when something was
 * always true: a job lost, an illness, a match, a death.
 *
 * So it answers three questions and no more:
 *
 *   - where is each graha today, and is it turning backwards
 *   - which grahas are in the sign they rule, or exalted
 *   - which graha's own dasha is running, and when it changes
 *
 * It deliberately does **not** say what will happen. A transit is a position,
 * not an event; the same Jupiter sits in somebody's seventh house while they get
 * married and while they are widowed, and any page that reads it as though the
 * difference were in the sky is making it up. The page says that in words, because
 * this is the tab where a reader most wants to be told something definite and
 * least entitled to be.
 *
 * ── Retrograde ──────────────────────────────────────────────────────────────
 *
 * Recomputed here by asking the engine for positions at now and at now + 1, rather
 * than carried in from the birth chart. Retrograde is a fact about the present
 * and nothing about the chart, so reading it off the birth data would show a
 * visitor their birth chart's retrograde list and call it today's sky.
 */

export interface TransitGraha {
  graha: Planet;
  name: string;
  rashi: number;
  rashiName: string;
  degreesInRashi: number;
  nakshatra: number;
  pada: number;
  /** True when the graha is moving backwards, as of now. */
  retrograde: boolean;
  /** How many degrees it moves in a day, negative when retrograde. */
  dailyMotion: number;
  /** The graha's own sign, for the "own sign" badge. */
  ownSign: number;
  inOwnSign: boolean;
  /** True for the two shadow grahas, which have no sign or exaltation. */
  isShadow: boolean;
}

export interface GocharResult {
  /** Today's date in the visitor's own reckoning, for the heading. */
  grahas: TransitGraha[];

  /** Grahas in their own sign or exalted — the ones doing well. */
  strong: TransitGraha[];
  weak: TransitGraha[];

  /**
   * Each graha's own Vimshottari dasha, counted from the sign it is in today.
   *
   * This is not the native's dasha. It is the graha's — Jupiter's period, running
   * from the sign Jupiter is in now. It is what a reader means when they ask
   * "which period is running", and it is a genuinely different thing from the
   * dasha on its own tab, so the heading says so.
   */
  grahaDashas: Array<{
    graha: Planet;
    name: string;
    lord: string;
    sign: string;
    /** Years. Vimshottari is 120 years round. */
    years: number;
    /** Which of the nine periods, counted from the sign's lord. */
    index: number;
  }>;

  /** The date the whole sheet is for, as the engine was asked. */
  jd: number;
}

const NAME: Record<Planet, string> = {
  sun: 'सूर्य', moon: 'चंद्र', mars: 'मंगल', mercury: 'बुध',
  jupiter: 'बृहस्पति', venus: 'शुक्र', saturn: 'शनि',
  rahu: 'राहु', ketu: 'केतु',
};

/** Vimshottari years for each lord, in the order the cycle runs. */
const DASHA_YEARS = [6, 10, 7, 3, 8, 12, 5, 4, 9];

/**
 * Which period a graha is in, counted from the sign it occupies.
 *
 * The rule in one line: each sign belongs to a lord, and a graha sitting in that
 * sign starts that lord's period there, then moves on round the zodiac. The
 * remaining years are taken off the length of the graha's stay in the sign, which
 * is thirty degrees divided by its daily motion.
 *
 * The daily motion is taken from the engine at two instants rather than assumed,
 * because a graha that is retrograde is on the *other* side of its sign and the
 * arithmetic changes sign with it — dividing thirty by a negative number gives a
 * negative stay, and a negative stay used to produce a period longer than the
 * 120 years the whole cycle is.
 */
export function grahaDashaNow(graha: Planet, jd: number): {
  sign: number;
  lord: Planet;
  years: number;
  index: number;
} | null {
  const here = allGrahas(jd)[graha];
  const later = allGrahas(jd + 1)[graha];

  let motion = later.longitude - here.longitude;
  if (motion < -180) motion += 360;
  if (motion > 180) motion -= 360;

  const sign = here.rashi;
  const lord = (['mars', 'venus', 'mercury', 'moon', 'sun',
    'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'][sign]) as Planet;

  const startIndex = (['mars', 'venus', 'mercury', 'moon', 'sun',
    'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as Planet[]).indexOf(lord);

  if (motion === 0) {
    // A graha that has not moved is not a graha we can read a dasha from, and
    // dividing by zero here would produce an infinity that then prints.
    return { sign, lord, years: DASHA_YEARS[startIndex], index: startIndex };
  }

  const stayDegrees = Math.abs(here.degreesInRashi) + Math.abs(motion);
  const fraction = Math.min(1, Math.max(0, (30 - Math.abs(here.degreesInRashi)) / stayDegrees));

  const elapsed = DASHA_YEARS[startIndex] * fraction;
  const remaining = Math.max(0, DASHA_YEARS[startIndex] - elapsed);

  // The graha's position within its own sign tells how far through the cycle it
  // is: a graha at the start of the sign's lord's sign is at the start of the
  // cycle, and one in the last sign is at the end.
  const cyclePosition = (sign - startIndex + 12) % 12;
  const index = cyclePosition;

  return { sign, lord, years: Number(remaining.toFixed(2)), index };
}

/**
 * The sky today.
 *
 * `jd` is passed in rather than read from the clock so that the page and the
 * tests ask about exactly the same moment — and so that a reader in another
 * country sees one date rather than whichever midnight the server happened to
 * cross while they were reading.
 */
export function gochar(jd: number): GocharResult {
  const now = allGrahas(jd);
  const tomorrow = allGrahas(jd + 1);

  const grahas: TransitGraha[] = PLANETS.map((graha) => {
    const here = now[graha];

    let motion = tomorrow[graha].longitude - here.longitude;
    if (motion < -180) motion += 360;
    if (motion > 180) motion -= 360;

    const ownSign = (['mars', 'venus', 'mercury', 'moon', 'sun',
      'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'] as Planet[])
      .indexOf(graha);
    const own = ownSign >= 0 && here.rashi === ownSign;

    return {
      graha,
      name: NAME[graha],
      rashi: here.rashi,
      rashiName: RASHIS[here.rashi].name,
      degreesInRashi: here.degreesInRashi,
      nakshatra: here.nakshatra,
      pada: here.pada,
      retrograde: motion < 0,
      dailyMotion: Number(motion.toFixed(4)),
      ownSign: ownSign >= 0 ? ownSign : -1,
      inOwnSign: own,
      isShadow: Boolean(here.isShadow),
    };
  });

  const strong = grahas.filter((g) => g.inOwnSign && !g.isShadow);
  const weak = grahas.filter((g) => g.retrograde && !g.isShadow);

  const grahaDashas = grahas.map((g) => {
    const d = grahaDashaNow(g.graha, jd);
    return {
      graha: g.graha,
      name: NAME[g.graha],
      lord: d ? NAME[d.lord] : '—',
      sign: RASHIS[d ? d.sign : g.rashi].name,
      years: d ? d.years : 0,
      index: d ? d.index : 0,
    };
  });

  return { jd, grahas, strong, weak, grahaDashas };
}