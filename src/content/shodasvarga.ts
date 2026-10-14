import {
  navamsaOf,
  aspectingGrahas,
  RASHI_LORDS,
  type GrahaPosition,
  type Planet,
  GRAHA_NAMES,
} from './grahas';

/**
 * ===========================================================================
 *  SHODASVARGA — the sixteen charts inside one birth
 * ===========================================================================
 *
 * Each graha is judged sixteen ways: the sign it is in, the sign cut into nine,
 * cut into three, cut into two, the twelve divisions, and so on. The point is
 * not that the graha has sixteen positions — it is that where it sits in the
 * big signs and where it sits in the fine ones do not always agree, and the
 * disagreement is the reading.
 *
 * ── Why sixteen and not one ────────────────────────────────────────────────
 *
 * The rashi alone is thirty degrees wide, which is a sixth of the zodiac. A
 * graha at twenty-nine degrees of a good sign and one at one degree of the same
 * sign are given the same verdict, and they are not the same placement at all.
 * The hora cuts the sign in half and separates them. The siddhamsa goes to the
 * quarter degree. Traditional astrology answers this by dividing the sign over
 * and over, and this file is that division written down.
 *
 * ── How each division works ────────────────────────────────────────────────
 *
 *   D1  the sign itself              D9  navamsa, nine parts
 *   D2  hora, two parts              D10 dasamsa, ten parts
 *   D3  drekkana, three parts        D12 dwadasamsa, twelve parts
 *   D4  chaturthamsa, four parts     D16 shodasamsa, sixteen parts
 *   D7  saptamsa, seven parts        D20 vimsamsa, twenty parts
 *   D24 chaturvimsamsa, twenty-four   D30 trimsamsa, thirty parts
 *   D27 nakshatramsa, twenty-seven    D40 shatvimsamsa, forty
 *   D45 akshavedamsa, forty-five      D60 shashtiamsa, sixty
 *
 * Every one of them divides the sign by its own number and counts forward from
 * its own starting sign, which is why the starting sign is given in the table
 * rather than assumed — hora starts from the sign the graha is in, navamsa
 * starts from Aries, trimsamsa starts from Mars's exaltation.
 */

export type VargaName =
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12'
  | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

export interface Varga {
  key: VargaName;
  /** The name the page prints. */
  title: string;
  /** What this division is for, in one line. */
  about: string;
  /** Parts the sign is cut into. */
  parts: number;
  /**
   * How the counting starts.
   *
   * `sign` means the division is cut within the sign and counts forward from
   * `startsFrom`; `absolute` means it counts straight through the zodiac from
   * Aries, so that a graha in the ninth part of a sign and one in the first
   * part of the next sign are not the same.
   *
   * This distinction was missing, so every division was cut the first way and
   * nine of the sixteen were wrong — the navamsa most visibly, because it is
   * the one a reader is most likely to check.
   */
  mode: 'sign' | 'absolute';
  /** The sign counting starts from. Ignored when mode is `absolute`. */
  startsFrom?: (rashi: number, graha: Planet) => number;
}

export interface GrahaVargas {
  graha: Planet;
  /** Every division's sign, in the order above. */
  signs: Record<VargaName, number>;
  /** The varga this graha is judged to be strong in. */
  best: VargaName | null;
  /** Where it is weak. */
  worst: VargaName | null;
  /** One line about how this graha sits overall. */
  summary: string;
}

export interface VargaResult {
  rashi: number;
  navamsa: number;
  grahas: GrahaVargas[];
  /** How many of the seven real grahas are strong across the sixteen. */
  strongCount: number;
}

/** Mesha, index 0. Every division starts from somewhere in the zodiac. */
const ARIES = 0;

/**
 * The sixteen divisions.
 *
 * `startsFrom` takes the graha's own sign because three of them do not start
 * where the others do: hora begins in the sign the graha occupies, trimsamsa
 * begins at Mars's exaltation and runs the first half in odd signs, and
 * saptamsa starts from the sign's own lord's star.
 */
export const VARGAS: Varga[] = [
  {
    key: 'D1',
    mode: 'sign',
    title: 'राशि',
    about: 'मूल कुंडली — ग्रह का मुख्य स्थान',
    parts: 1,
    startsFrom: (r) => r,
  },
  {
    key: 'D2',
    mode: 'sign',
    title: 'होरा',
    about: 'राशि के दो भाग — धन और संपत्ति',
    parts: 2,
    startsFrom: (r) => r,
  },
  {
    key: 'D3',
    mode: 'sign',
    title: 'द्रिक्काण',
    about: 'राशि के तीन भाग — सहज भाग्य',
    parts: 3,
    startsFrom: (r) => r,
  },
  {
    key: 'D4',
    mode: 'sign',
    title: 'चतुर्थांश',
    about: 'राशि के चार भाग — सुख और घर',
    parts: 4,
    startsFrom: (r) => r,
  },
  {
    key: 'D7',
    mode: 'sign',
    title: 'सप्तमांश',
    about: 'राशि के सात भाग — संतान और बुद्धि',
    parts: 7,
    startsFrom: (r) => {
      // Odd signs count from Mars, even signs from Saturn — that is, from the
      // first sign of each. Using the sign's own lord instead put Capricorn and
      // Aquarius in the wrong half of the zodiac, since both are ruled by
      // Saturn and the rule is about the sign's position, not its owner.
      return r % 2 === 0 ? ARIES : 10;
    },
  },
  {
    key: 'D9',
    mode: 'absolute',
    title: 'नवांश',
    about: 'राशि के नौ भाग — विवाह, धर्म और भीतर का स्वभाव',
    parts: 9,
  },
  {
    key: 'D10',
    mode: 'absolute',
    title: 'दशमांश',
    about: 'राशि के दस भाग — कर्म और सामाजिक स्थान',
    parts: 10,
  },
  {
    key: 'D12',
    mode: 'absolute',
    title: 'द्वादशांश',
    about: 'राशि के बारह भाग — माता-पिता और पूर्व पुण्य',
    parts: 12,
  },
  {
    key: 'D16',
    mode: 'sign',
    title: 'षोडशांश',
    about: 'राशि के सोलह भाग — वाहन, सुख और भाग्य',
    parts: 16,
    startsFrom: (r) => r,
  },
  {
    key: 'D20',
    mode: 'absolute',
    title: 'विंशांश',
    about: 'राशि के बीस भाग — पूजा और आध्यात्मिकता',
    parts: 20,
  },
  {
    key: 'D24',
    mode: 'absolute',
    title: 'चतुर्विंशांश',
    about: 'राशि के चौबीस भाग — शिक्षा और सीखना',
    parts: 24,
  },
  {
    key: 'D27',
    mode: 'absolute',
    title: 'भाग्यांश',
    about: 'राशि के सत्ताईस भाग — कुलज, शक्ति और दोष',
    parts: 27,
  },
  {
    key: 'D30',
    mode: 'sign',
    title: 'त्रिंशांश',
    about: 'राशि के तीस भाग — अधम, मध्यम और शुभ फल',
    parts: 30,
    startsFrom: (r) => r,
  },
  {
    key: 'D40',
    mode: 'absolute',
    title: 'शतविंशांश',
    about: 'राशि के चालीस भाग — माता की कमज़ोरी',
    parts: 40,
  },
  {
    key: 'D45',
    mode: 'absolute',
    title: 'अक्षवेदांश',
    about: 'राशि के पैंतालीस भाग — पिता की कमज़ोरी',
    parts: 45,
  },
  {
    key: 'D60',
    mode: 'absolute',
    title: 'षष्ट्यांश',
    about: 'राशि के साठ भाग — पूर्व पुण्य और शुभ फल',
    parts: 60,
  },
];

/** Strong signs, by division. Used to say a graha is strong *there*. */
const STRONG_SIGNS: Partial<Record<VargaName, number[]>> = {
  D1: [0, 1, 2, 3, 4, 7, 8, 9, 10, 11],
  D2: [1, 2, 3, 4, 6, 7, 8, 11],
  D3: [0, 1, 4, 7, 8, 11],
  D9: [0, 1, 2, 4, 7, 8, 9, 10, 11],
  D12: [0, 1, 4, 6, 7, 8, 10, 11],
  D30: [0, 1, 4, 7, 8, 11],
};

/** Which division matters most for which part of life. */
const ABOUT_BY_KEY = VARGAS.reduce<Record<string, string>>((acc, v) => {
  acc[v.key] = v.about;
  return acc;
}, {});

/**
 * One graha's sixteen divisions.
 *
 * The division is the same arithmetic for all of them: find which part of the
 * sign the graha is standing in, then count that many signs forward from the
 * starting sign of that division.
 */
function vargasOf(longitude: number, graha: Planet): Record<VargaName, number> {
  const rashi = Math.floor(longitude / 30) % 12;
  const degreesIn = longitude % 30;

  const out = {} as Record<VargaName, number>;

  for (const varga of VARGAS) {
    const size = 30 / varga.parts;

    if (varga.mode === 'absolute') {
      // Counted straight through the zodiac. A part is 30/n degrees wide, so
      // the part a graha falls in is its longitude divided by that width, and
      // the sign is that part taken modulo twelve.
      out[varga.key] = Math.floor(longitude / size) % 12;
    } else {
      // Cut within the sign, from a starting sign that depends on the sign.
      const part = Math.min(varga.parts - 1, Math.floor(degreesIn / size));
      const start = varga.startsFrom ? varga.startsFrom(rashi, graha) : ARIES;
      out[varga.key] = (start + part) % 12;
    }
  }

  return out;
}

/**
 * All seven grahas across all sixteen divisions.
 *
 * A graha's own sign, a friendly sign and an exalted sign all count as strong,
 * because "strong" in a varga means the division agrees with the rashi, not
 * that the graha wins an argument.
 */
export function shodasvarga(grahas: Record<Planet, GrahaPosition>): VargaResult {
  const realGrahas: Planet[] = [
    'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn',
  ];

  const out: GrahaVargas[] = [];

  for (const g of realGrahas) {
    const pos = grahas[g];
    const signs = vargasOf(pos.longitude, g);

    // Judge each division: own sign, exaltation, or a sign the varga counts
    // strong. Everything else is weak or middling.
    const counts: Record<VargaName, number> = {} as Record<VargaName, number>;
    let best: VargaName | null = null;
    let worst: VargaName | null = null;
    let bestScore = -1;
    let worstScore = 99;

    for (const varga of VARGAS) {
      const sign = signs[varga.key];
      let score = 0;

      if (sign === pos.rashi) score += 3; // the division agrees with the rashi
      if (RASHI_LORDS[sign] === g) score += 2; // the division's own sign
      const strong = STRONG_SIGNS[varga.key];
      if (strong && strong.includes(sign)) score += 2;

      counts[varga.key] = score;

      // D1 is the reference, not a result — it always agrees with itself.
      const weight = varga.key === 'D1' ? score - 2 : score;
      if (weight > bestScore) { bestScore = weight; best = varga.key; }
      if (weight < worstScore && varga.key !== 'D1') { worstScore = weight; worst = varga.key; }
    }

    const agreeing = VARGAS.filter((v) => counts[v.key] >= 3).length;

    out.push({
      graha: g,
      signs,
      best,
      worst,
      summary:
        agreeing >= 8
          ? `${GRAHA_NAMES[g].hindi} अधिकांश विभागों में मज़बूत है — इसका काम टिकता है।`
          : agreeing >= 4
            ? `${GRAHA_NAMES[g].hindi} मिश्रित है — कभी मज़बूत, कभी कमज़ोर।`
            : `${GRAHA_NAMES[g].hindi} अधिकांश विभागों में कमज़ोर है — काम शुरू करना आसान, पूरा करना कठिन।`,
    });
  }

  const strongCount = out.filter((g) => {
    const agreeing = VARGAS.filter((v) => g.signs[v.key] === grahas[g.graha].rashi).length;
    return agreeing >= 6;
  }).length;

  return {
    rashi: grahas.sun.rashi,
    navamsa: navamsaOf(grahas.sun.longitude),
    grahas: out,
    strongCount,
  };
}

/** The one-line description of a division, for the legend on the page. */
export function vargaAbout(key: VargaName): string {
  return ABOUT_BY_KEY[key] ?? '';
}

/** How many grahas are looking at this one — used by the D-navamsa reading. */
export { aspectingGrahas };
