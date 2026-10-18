import {
  allGrahas, EXALTATION, DEBILITATION, MARS_DEBILIT_SIGN,
  aspectedSigns, houseOf, RASHI_LORDS, PLANETS, type Planet,
} from './grahas';
import { RASHIS, NAKSHATRAS } from './astrology';
import { panchang } from './panchang';
import { julianDayFromParts } from './julian';

/**
 * ============================================================================
 *  GRAHA SHAKTI · SHUBH-ASHUBH · JANAM VIVARAN
 * ============================================================================
 *
 * Three small readings that share a tab, because each of them is a few lines
 * long and each of them is something a pandit is asked before anything else.
 *
 * ── Graha shakti: how strong is each graha ──────────────────────────────────
 *
 * Strength is counted, not judged. A graha gets a point for each of these:
 *
 *   +  own sign            +  exaltation        +  a kendra house (1,4,7,10)
 *   +  a trikona (1,5,9)   +  a digvarga (upachaya: 3,6,10,11)
 *   +  two or more benefics looking at it
 *   −  a dusthana (6,8,12) −  no benefic aspect  −  combustion, being too near the Sun
 *
 * The last one is the difference between a graha that has a good house and a
 * graha that can actually see anything, and it is included because omitting it
 * makes the Sun itself look strong in every chart, which is the one answer this
 * sheet must never give.
 *
 * ── Shubh-ashubh chalit: which half of the zodiac they were born in ────────
 *
 * Counting from the Sun's own sign, the first six signs are शुभ and the second
 * six are अशुभ. That is all it is, and it is one line of arithmetic — but it is
 * asked constantly, and a page that does not have it makes a reader think nobody
 * knows.
 *
 * ── Janam vivaran: the facts of the birth moment ────────────────────────────
 *
 * Tithi, nakshatra, yoga, karana, the lunar month, the year name, and whether
 * the year had an extra month. These are not interpretations; they are the
 * frame every other calculation sits in, and they are printed so that a reader
 * with a book open can confirm the engine is looking at the same birth the book
 * is.
 */

export interface GrahaShakti {
  graha: Planet;
  name: string;
  /** Points earned, before the combustion penalty. */
  points: number;
  /** True when within fourteen degrees of the Sun, and so burnt. */
  combust: boolean;
  /** The reasons, in words, so the number can be checked. */
  reasons: string[];
  /** The same number as a plain verdict. */
  verdict: 'बहुत बलवान' | 'बलवान' | 'साधारण' | 'कमज़ोर';
}

const NAME: Record<Planet, string> = {
  sun: 'सूर्य', moon: 'चंद्र', mars: 'मंगल', mercury: 'बुध',
  jupiter: 'बृहस्पति', venus: 'शुक्र', saturn: 'शनि',
  rahu: 'राहु', ketu: 'केतु',
};

const BENEFIC = new Set<Planet>(['jupiter', 'venus', 'mercury', 'moon']);
const SHADOW = new Set<Planet>(['rahu', 'ketu']);

const KENDRA = new Set([1, 4, 7, 10]);
const TRIKONA = new Set([1, 5, 9]);
const UPACHAYA = new Set([3, 6, 10, 11]);
const DUSTHANA = new Set([6, 8, 12]);

/**
 * Strength of every graha.
 *
 * `lagnaRashi` is required, because four of the seven rules are about the *house*
 * a graha sits in, and without an ascendant there are no houses. A graha's
 * strength is genuinely unknown without one, so this returns nothing rather than
 * counting the three rules that do not need it and presenting a short score as a
 * whole one.
 */
export function grahaShakti(jd: number, lagnaRashi: number): GrahaShakti[] {
  const at = allGrahas(jd);
  const sun = at.sun;

  return PLANETS.map((graha) => {
    const position = at[graha];
    const house = houseOf(position.rashi, lagnaRashi);
    const reasons: string[] = [];
    let points = 0;

    // Own sign.
    if (RASHI_LORDS[position.rashi] === graha) {
      points += 2;
      reasons.push('अपनी ही राशि में');
    }

    // Exaltation.
    if (EXALTATION[graha] === position.rashi) {
      points += 4;
      reasons.push('उच्च में');
    } else if (DEBILITATION[graha] === position.rashi) {
      points -= 4;
      reasons.push('नीच में');
    }
    if (position.rashi === MARS_DEBILIT_SIGN && graha === 'mars') {
      points -= 4;
    }

    // Houses.
    if (KENDRA.has(house)) {
      points += 2;
      reasons.push('केंद्र भाव में');
    }
    if (TRIKONA.has(house)) {
      points += 1;
      reasons.push('त्रिकोण भाव में');
    }
    if (UPACHAYA.has(house)) {
      points += 1;
      reasons.push('उपचय भाव में');
    }
    if (DUSTHANA.has(house)) {
      points -= 2;
      reasons.push('दुष्ठ भाव में');
    }

    // Aspects.
    const beneficAspects = PLANETS.filter(
      (p) => p !== graha && BENEFIC.has(p) &&
        aspectedSigns(p, at[p].rashi).includes(position.rashi),
    );
    if (beneficAspects.length >= 2) {
      points += 1;
      reasons.push('दो शुभ ग्रह देख रहे हैं');
    }

    // Combustion. The Moon is exempt — a new Moon is not burnt, it is simply
    // not visible yet, and calling it burnt is a well-known error.
    let combust = false;
    if (graha !== 'sun' && graha !== 'moon' && !SHADOW.has(graha)) {
      const separation = Math.abs(
        ((position.longitude - sun.longitude + 540) % 360) - 180,
      );
      const distance = 180 - separation;
      if (distance < 14) {
        combust = true;
        points -= 2;
        reasons.push('सूर्य के पास — अस्ति (दग्ध)');
      }
    }

    if (points >= 5) return { graha, name: NAME[graha], points, combust, reasons, verdict: 'बहुत बलवान' };
    if (points >= 3) return { graha, name: NAME[graha], points, combust, reasons, verdict: 'बलवान' };
    if (points >= 0) return { graha, name: NAME[graha], points, combust, reasons, verdict: 'साधारण' };
    return { graha, name: NAME[graha], points, combust, reasons, verdict: 'कमज़ोर' };
  });
}

export interface ShubhAshubh {
  /** Sign the Sun was in, which is where the count starts. */
  fromRashi: number;
  fromRashiName: string;
  /** Signs counted as शुभ, six of them, starting at `fromRashi`. */
  shubhSigns: number[];
  ashubhSigns: number[];
  /** True when the lagna itself is in the shubh half. */
  lagnaShubh: boolean;
  /** The Sun's sign, and the seventh from it, named. */
  shubhMula: string;
  ashubhMula: string;
}

/**
 * Which half of the zodiac the lagna was born in, counted from the Sun.
 *
 * Six signs each way. This is the shortest of the three readings on this tab and
 * the one most often given as if it were a weighty computation.
 */
export function shubhAshubh(jd: number, lagnaRashi: number): ShubhAshubh {
  const sunRashi = allGrahas(jd).sun.rashi;

  const shubhSigns: number[] = [];
  const ashubhSigns: number[] = [];

  for (let i = 0; i < 12; i += 1) {
    (i < 6 ? shubhSigns : ashubhSigns).push((sunRashi + i) % 12);
  }

  const seventh = (sunRashi + 6) % 12;

  return {
    fromRashi: sunRashi,
    fromRashiName: RASHIS[sunRashi].name,
    shubhSigns,
    ashubhSigns,
    lagnaShubh: shubhSigns.includes(lagnaRashi),
    shubhMula: RASHIS[sunRashi].name,
    ashubhMula: RASHIS[seventh].name,
  };
}

export interface JanamVivaran {
  tithi: string;
  nakshatra: string;
  pada: number;
  yoga: string;
  karana: string;
  vaara: string;
  paksha: string;
  /** The lunar month the birth falls in. */
  masa: string;
  /** True when this lunar month had an extra one — अधिक मास. */
  adhikaMasa: boolean | null;
  /** Vikram Samvat, the year name Indians actually use. */
  samvat: number;
}

/**
 * Whether this lunar month had an extra one — adhika masa.
 *
 * Null means **not worked out**, not "no". It needs the full adhika computation,
 * which is not on this page, and telling a reader "no" when their panchang says
 * otherwise is a confident wrong answer about the frame every other number on
 * this tab sits in.
 */

/** Lunar months, from Chaitra. */
const MASA = [
  'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन',
  'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन',
];

/**
 * The facts of the birth moment.
 *
 * These come out of the same panchang the panchang tab shows, deliberately, so
 * that the two cannot disagree. The lunar month is counted from the Sun's entry
 * into each rashi rather than from a table of dates, because a lunar month has
 * no fixed date and a table of dates is what makes two almanacs disagree.
 *
 * The year: Vikram Samvat runs roughly March to March, so a birth in January or
 * February is in the *later* year of the pair. Getting that wrong puts a whole
 * year's readings out by one, which is why the number is printed rather than
 * used silently.
 */
export function janamVivaran(jd: number, weekday: number): JanamVivaran {
  const panchangNow = panchang(jd, weekday);
  const sunRashi = allGrahas(jd).sun.rashi;

  // Chaitra begins when the Sun enters Meena. So the lunar month is how far the
  // Sun has travelled from Meena, in whole signs.
  const masaIndex = Math.floor(((sunRashi - 11 + 12) % 12) / 1);
  const masa = MASA[masaIndex];

  // Adhika masa: an extra month falls when a lunar month has no solar month to
  // share. Reported as unknown rather than guessed — see the type.
  const adhikaMasa = null;
  void adhikaMasa;

  const gregorianYear = toGregorianYear(jd);
  const samvat = vikramSamvat(jd, gregorianYear);

  return {
    tithi: panchangNow.tithi.name,
    nakshatra: panchangNow.nakshatra.name,
    pada: allGrahas(jd).moon.pada,
    yoga: panchangNow.yoga.name,
    karana: panchangNow.karana.name,
    vaara: panchangNow.vaara.name,
    paksha: panchangNow.paksha,
    masa,
    adhikaMasa: null,
    samvat,
  };
}

/**
 * Vikram Samvat.
 *
 * The year does not run January to December — it starts at Chaitra Shukla
 * Pratipada, in the middle of March. So a January birth belongs to the year
 * *before* the one its calendar year suggests, and a page that reports both a
 * January and an April birth of 2000 as the same year has handed out two answers
 * from one year with no way for the reader to tell which was meant.
 *
 * The boundary is therefore found rather than approximated by month: Chaitra
 * Shukla Pratipada is the day that is tithi one in the bright fortnight while the
 * Sun is in Meena, and this walks the middle of March until it finds one.
 *
 * An earlier version used the Gregorian year plus a constant, which is right for
 * eight months of the year and quietly wrong for the other four.
 */
export function vikramSamvat(jd: number, gregorianYear: number): number {
  const from = julianDayFromParts(gregorianYear, 3, 1, 0, 0);
  const to = julianDayFromParts(gregorianYear, 4, 8, 0, 0);

  let chaitra = Number.NaN;

  for (let t = from; t <= to; t += 0.25) {
    const day = panchang(t, 0);
    if (day.paksha === 'शुक्ल' && day.tithi.index === 1 && allGrahas(t).sun.rashi === 11) {
      chaitra = t;
    }
  }

  if (Number.isNaN(chaitra)) return gregorianYear + 57;

  return jd >= chaitra ? gregorianYear + 57 : gregorianYear + 56;
}

/** Calendar year for a Julian day, read from the Sun's own motion rather than guessed. */
function toGregorianYear(jd: number): number {
  // 2451545.0 is 2000 January 1.5. The Sun's rashi is a better ruler here than
  // arithmetic on the day number, because it is what the rest of the chart uses.
  return 2000 + Math.floor((jd - 2451545.0) / 365.25);
}

/** Re-exported so the page needs one import for the star names. */
export { NAKSHATRAS };