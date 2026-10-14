import {
  allGrahas,
  houseOf,
  RASHI_LORDS,
  type GrahaPosition,
  type Planet,
  GRAHA_NAMES,
} from './grahas';

/**
 * ===========================================================================
 *  KRISHNAMURTI PORPHYRY (KP) — the system that judges by house
 * ===========================================================================
 *
 * The classical chart judges a graha by the sign it sits in and calls that sign
 * good or bad. KP judges it by whether it owns the outcome it is standing in,
 * which is a different question and usually a more useful one. A graha in a
 * friendly sign can still fail; a graha in an enemy's sign can still deliver,
 * because what matters is the house.
 *
 * ── The five steps ─────────────────────────────────────────────────────────
 *
 *   1  Pakad 1  which graha owns the house the planet is in
 *   2  Pakad 2  which graha owns the sign that graha is in — the sub-lord
 *   3  Pakad 3  the star the sub-lord sits in, read as a lord rather than
 *               counted as one of twenty-seven
 *   4  Pakad 4  the sign on the Moon's nakshatra, the bhava of the planet
 *   5  Pakad 5  Mars, Saturn and Jupiter aspecting, added to the score
 *
 * ── Why the sub-lord matters most ──────────────────────────────────────────
 *
 * Because in step two the answer is usually the graha itself, and a graha that
 * owns its own sub-signlord is reported as giving in that house. That single
 * rule settles more of a KP chart than the other four combined, and it is why
 * KP readers ask for the sign the Moon is in first and everything else second.
 *
 * ── What this is honestly worth ────────────────────────────────────────────
 *
 * KP is a system with genuine disagreement inside it about the weights and
 * about which of the eight karakas carries which result. The sign results
 * returned here are the widely used ones. The page says which system it is
 * using rather than presenting the output as settled.
 */

/** The nakshatras and the graha each is ruled by, index 0 to 26. */
const NAKSHATRA_LORD: Planet[] = [
  'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter',
  'saturn', 'mercury', 'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter',
  'saturn', 'mercury', 'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter',
  'saturn', 'mercury',
];

/** The eight karakas — the grahas that carry results. */
const KARAKAS: Planet[] = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu'];

export interface KpPlanet {
  graha: Planet;
  rashi: number;
  nakshatra: number;

  /** Pakad 1 — the lord of the sign the graha is in. */
  pakad1: Planet;
  /** Pakad 2 — the lord of the sign the pakad-1 lord is in. */
  subLord: Planet;
  /** Pakad 3 — the nakshatra lord of the sub-lord, read as a lord. */
  pakad3Lord: Planet;
  /** Pakad 4 — the nakshatra the sub-lord occupies. */
  pakad4Nakshatra: number;
  /** Pakad 4 — the house that nakshatra occupies, from the lagna. */
  bhava: number;
  /** Pakad 5 — which karakas aspect this graha. */
  aspectsFrom: Planet[];

  /** Is this graha a karaka at all. */
  isKaraka: boolean;
  /** Does the graha give in its own house. */
  givesInOwnSign: boolean;
  /** Does the sub-lord sit in the graha's own sign. */
  subLordInOwnSign: boolean;
  /** The line the page prints. */
  verdict: string;
  /** What it carries, read from the karakas. */
  result: string;
}

export interface KpResult {
  lagnaRashi: number;
  /** The Moon's nakshatra lord — the ruler of the whole chart in KP. */
  rashiLord: Planet;
  /** The Moon's sub-signlord, which a KP reader asks for before the ruler. */
  subLord: Planet;
  planets: KpPlanet[];
  /** The eight karakas, strongest first. */
  karakas: KpPlanet[];
}

/** How strongly a karaka asserts, 0 to 10. */
function karakaStrength(p: KpPlanet): number {
  let score = 0;
  if (p.pakad1 === p.graha) score += 2;
  if (p.subLord === p.graha) score += 3;
  if (p.pakad3Lord === p.graha) score += 2;
  if (p.givesInOwnSign) score += 1;
  if (p.aspectsFrom.length > 0) score += 1;
  if (!p.isKaraka) score -= 4;
  return score;
}

/** What a karaka is the karaka of — the one line that matters to a reader. */
const KARAKA_OF: Record<string, string> = {
  sun: 'पिता, अधिकार और सरकारी मामले',
  moon: 'माता, यात्रा और भावनाएँ',
  mars: 'भाई, भूमि और साहस',
  mercury: 'बुद्धि, व्यापार और लेखन',
  jupiter: 'धर्म, पुत्र, ज्ञान और संपत्ति',
  venus: 'काम, शादी, आराम और कला',
  saturn: 'सेवा, उम्र, कर्म और पीड़ा',
  rahu: 'आग, रहस्य, विदेश और बड़ा बदलाव',
};

const RESULT_TEXT: Record<string, string> = {
  sun: 'अधिकार, पद और पिता से जुड़े मामलों का परिणाम',
  moon: 'माता, यात्रा और मन की शांति का परिणाम',
  mars: 'भूमि, साहस और प्रतिस्पर्धा का परिणाम',
  mercury: 'बुद्धि, व्यापार और संचार का परिणाम',
  jupiter: 'धर्म, संपत्ति और पुत्र का परिणाम',
  venus: 'शादी, कला और भोग का परिणाम',
  saturn: 'सेवा, कर्म और दीर्घ उम्र का परिणाम',
  rahu: 'अचानक बदलाव और कठिन परिश्रम का परिणाम',
};

/**
 * The KP reading of one chart.
 *
 * `lagnaDeg` is the lagna's longitude rather than its sign, because KP reads
 * the Moon's nakshatra and the planet's sub-signlord in degrees, and reducing
 * the lagna to a sign index would throw away the quarter degree it needs.
 */
export function kpSystem(jd: number, lagnaDeg: number): KpResult {
  const grahas = allGrahas(jd);
  const lagnaRashi = Math.floor(lagnaDeg / 30) % 12;

  // Pakad 1 through 4 for the Moon, which sets the chart's ruler.
  const moon = grahas.moon;
  const moonPakad1 = RASHI_LORDS[moon.rashi] as Planet;
  const moonSubSign = grahas[moonPakad1].rashi;
  const moonSubLord = RASHI_LORDS[moonSubSign] as Planet;
  const moonSubNak = grahas[moonSubLord].nakshatra;

  const rashiLord = moonPakad1;

  const planets: KpPlanet[] = [];

  for (const g of KARAKAS) {
    const pos = grahas[g];

    // Pakad 1.
    const pakad1 = RASHI_LORDS[pos.rashi] as Planet;

    // Pakad 2 — the sign the pakad-1 lord is in.
    const subSign = grahas[pakad1].rashi;
    const subLord = RASHI_LORDS[subSign] as Planet;

    // Pakad 3 — the nakshatra lord of the sub-lord.
    const subLordPos = grahas[subLord];
    const pakad3Lord = NAKSHATRA_LORD[subLordPos.nakshatra - 1];

    // Pakad 4 — the nakshatra the sub-lord sits in, and the house it is in.
    const pakad4Nakshatra = subLordPos.nakshatra;
    const bhava = houseOf(pakad4Nakshatra, lagnaRashi);

    // Pakad 5 — Mars, Saturn and Jupiter only, as the system uses them.
    const aspectsFrom = (['mars', 'saturn', 'jupiter'] as Planet[]).filter(
      (a) => a !== g && grahas[a].rashi === pos.rashi,
    );

    const givesInOwnSign = pos.lord === g;
    // Not "the sub-lord rules its own sign" — that is true by construction and
    // says nothing. This asks whether the sub-lord has come back to a sign the
    // graha rules, which in KP is what lets the graha claim the result.
    const subLordInOwnSign = RASHI_LORDS[grahas[subLord].rashi] === g;

    // Verdict — the part a KP reader looks at first.
    let verdict: string;
    if (subLord === g) {
      verdict = `${GRAHA_NAMES[g].hindi} अपना ही सूब लोर्ड देता है — यह भाव पूरा देता है।`;
    } else if (pakad3Lord === g) {
      verdict = `${GRAHA_NAMES[g].hindi} तृतीय पकड़ में आता है — आंशिक रूप से देता है।`;
    } else if (pakad1 === g) {
      verdict = `${GRAHA_NAMES[g].hindi} प्रथम पकड़ में आता है — भाव को सहारा देता है।`;
    } else {
      verdict = `${GRAHA_NAMES[g].hindi} इस भाव को पूरा नहीं देता।`;
    }

    planets.push({
      graha: g,
      rashi: pos.rashi,
      nakshatra: pos.nakshatra,
      pakad1,
      subLord,
      pakad3Lord,
      pakad4Nakshatra,
      bhava,
      aspectsFrom,
      isKaraka: KARAKAS.includes(g),
      givesInOwnSign,
      subLordInOwnSign,
      verdict,
      result: RESULT_TEXT[g] ?? '',
    });
  }

  // Ketu is read in KP but is not one of the karakas.
  {
    const pos = grahas.ketu;
    const pakad1 = RASHI_LORDS[pos.rashi] as Planet;
    const subLord = RASHI_LORDS[grahas[pakad1].rashi] as Planet;
    planets.push({
      graha: 'ketu',
      rashi: pos.rashi,
      nakshatra: pos.nakshatra,
      pakad1,
      subLord,
      pakad3Lord: NAKSHATRA_LORD[grahas[subLord].nakshatra - 1],
      pakad4Nakshatra: grahas[subLord].nakshatra,
      bhava: houseOf(grahas[subLord].nakshatra, lagnaRashi),
      aspectsFrom: [],
      isKaraka: false,
      givesInOwnSign: false,
      subLordInOwnSign: false,
      verdict: `${GRAHA_NAMES.ketu.hindi} निष्कर्षक नहीं है — पर उसका सूब लोर्ड उस भाव का परिणाम बदल सकता है।`,
      result: 'पुराने बंधन और अचानक छूटने वाली बातों का परिणाम',
    });
  }

  const karakas = planets
    .filter((p) => p.isKaraka)
    .sort((a, b) => karakaStrength(b) - karakaStrength(a));

  void moonSubNak;

  return { lagnaRashi, rashiLord, subLord: moonSubLord, planets, karakas };
}

/** What the chart's ruler carries, for the line at the top of the KP section. */
export function rashiLordCarries(result: KpResult): string {
  const lord = result.karakas.find((p) => p.graha === result.rashiLord);
  if (!lord) return '';
  return `${KARAKA_OF[result.rashiLord] ?? ''} — ${lord.verdict}`;
}

export { KARAKAS };
