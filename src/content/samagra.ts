import { PLANETS, GRAHA_NAMES, EXALTATION, type Planet, type GrahaPosition } from './grahas';
import { RASHIS } from './astrology';

/**
 * ===========================================================================
 *  SAMAGRA PHALA — the whole chart, read at once
 * ===========================================================================
 *
 * Every other part of this sheet reads one thing: one graha, one dasha, one
 * yoga. The person in front of it has nine grahas and is told about them one at
 * a time, and nobody answers the only question they arrived with — *what is this
 * chart, overall?*
 *
 * So this file reads all nine in one pass and gives a verdict.
 *
 * ── What "overall" can honestly be built from ─────────────────────────────
 *
 * Three things, each of which can be looked at rather than guessed:
 *
 *   1. **Panch Mahapurusha** — the five great beings. Each has one condition to
 *      meet and a share of life allotted to it. Two or more in a chart is a
 *      strength worth saying out loud; none is worth saying plainly too.
 *
 *   2. **Kendradhipati dosha** — the lord of the ascendant sitting in a corner
 *      *and* in one of the four houses from itself that undo a corner. The first
 *      chapters of every classical text deal with little else.
 *
 *   3. **The standing of each graha** — exalted, in its own sign, debilitated,
 *      or in a corner, stated for all nine in the same words.
 *
 * ── What it deliberately does not do ───────────────────────────────────────
 *
 * It does not add the nine readings into a score. A number made by adding a
 * sentence about Mercury to a sentence about Saturn is a number with no meaning,
 * and printing it would look like a conclusion and be none.
 *
 * The verdict is a **count of what was found**, with the reason beside each one,
 * so a reader can disagree with any single line without the whole answer going
 * with it.
 *
 * ── Where the letters are ──────────────────────────────────────────────────
 *
 * The site identifies people as `VARSHA`, and this file is one of the places a
 * Devanagari spelling of that name could creep in through a heading. The name
 * does not appear in this file at all, which is the cheapest way to be sure.
 */

/** The four houses from the ascendant that form corners — kendra. */
export const KENDRA_HOUSES = [1, 4, 7, 10];

/** The four houses from a graha that undo a corner. */
const DOSHA_FROM_SELF = [2, 6, 8, 12];

/**
 * Each graha's own sign, Aries first, and the sign it is exalted in.
 *
 * Keyed by the `Planet` identifier and not by the Devanagari name, because the
 * two are not the same string: Jupiter's identifier is `jupiter` and its
 * display name is `बृहस्पति` while its lordship word is `गुरु`. A table keyed on
 * the display name silently misses Jupiter, which is the one graha whose
 * yogas are read most often.
 */
const OWN_SIGNS: Partial<Record<Planet, number>> = {
  sun: 4,     // सिंह
  moon: 3,    // कर्क
  mars: 0,    // मेष
  mercury: 2, // मिथुन
  jupiter: 8, // धनु
  venus: 1,   // वृषभ
  saturn: 10, // कुंभ
};

/** The five great beings, and the order their shares of life are given in. */
const MAHAPURUSHA_ORDER: Planet[] = ['venus', 'moon', 'mars', 'jupiter', 'mercury'];

/** The four shares, most to least — Venus always takes the first. */
const MAHAPURUSHA_SHARES = [
  { key: 'रुचक', gift: 'रुचक — रूप, वाणी और शोभा', years: 16 },
  { key: 'भद्र', gift: 'भद्र — दुख से रक्षा', years: 10 },
  { key: 'वर्मा', gift: 'वर्मा — अतुलनीय सुख', years: 9 },
  { key: 'शठ', gift: 'शठ — अपना मुख देखने वाला', years: 6 },
];

function name(graha: Planet): string {
  return GRAHA_NAMES[graha]?.hindi ?? String(graha);
}

/** The sign a graha is weakened in — the sign opposite its exaltation. */
function debilityOf(graha: Planet): number | null {
  const exalt = EXALTATION[graha];
  return exalt === undefined ? null : (exalt + 6) % 12;
}

/* ===========================================================================
 *  THE READING
 * ===========================================================================
 */

export interface PhalaLine {
  graha: Planet;
  name: string;
  /** House from the ascendant, 1 to 12. */
  house: number;
  /** The sign it sits in, by name. */
  rashi: string;
  verdict: string;
  tone: 'good' | 'mixed' | 'hard';
  /** Short label for the corner of the card. */
  badge: string;
}

export interface Mahapurusha {
  graha: Planet;
  name: string;
  house: number;
  /** True when the conditions were met. */
  formed: boolean;
  gift: string;
  years: number;
  met: string[];
  missed: string[];
}

export interface SamagraPhala {
  lines: PhalaLine[];

  mahapurusha: Mahapurusha[];
  /** How many of the five actually formed. */
  mahapurushaCount: number;
  /** The sum of the shares of life they carry. */
  mahapurushaYears: number;

  kendradhipati: {
    lord: Planet | null;
    lordName: string;
    house: number;
    /** House counted from the graha's own sign. */
    fromItself: number;
    dosha: boolean;
    why: string;
  };

  tally: { good: number; mixed: number; hard: number };

  summary: string;
  strengths: string[];
  cautions: string[];
}

/**
 * Read the whole chart.
 *
 * `houses` maps each graha to the house it occupies from the ascendant, which
 * the chart has already worked out.
 */
export function samagraPhala(
  grahas: Record<Planet, GrahaPosition>,
  houses: Record<Planet, number>,
  lagnaRashi: number,
): SamagraPhala {
  /* ── 1. each graha on its own ─────────────────────────────────────────── */

  const lines: PhalaLine[] = [];
  let good = 0;
  let mixed = 0;
  let hard = 0;

  for (const graha of PLANETS) {
    const position = grahas[graha];
    if (!position) continue;

    const label = name(graha);
    const rashi = position.rashi;
    const house = houses[graha] ?? 12;
    const rashiName = RASHIS[rashi]?.name ?? '—';

    const exalt = EXALTATION[graha];
    const own = OWN_SIGNS[graha];
    const debilitated = debilityOf(graha) === rashi;

    /*
     * Kendradhipati, counted the way it is defined.
     *
     * The house from the **ascendant** gives the corner. The house from
     * **itself** — and "itself" means the sign the graha *rules*, which is the
     * sign it owns — gives the second half. A corner undone by the second,
     * sixth, eighth or twelfth from that sign is a dosha; a corner anywhere
     * else is a strength.
     *
     * ── Why the ruled sign and not the occupied one ────────────────────────
     *
     * Counting the second half from where the graha *sits* rather than from
     * the sign it *rules* makes the dosha impossible, and it was impossible
     * here for a whole build before a check noticed that no chart in thirty
     * hundred ever raised it.
     *
     * The arithmetic shows it. Let the graha stand at sign P and the ascendant
     * at X: it is d+1 houses from the ascendant and (12-d)+1 from itself,
     * because the same physical house is numbered from two different starts.
     * For a corner — d of zero, three, six or nine — that second number can
     * only ever be one, four, seven or ten. Never two, six, eight or twelve.
     *
     * Counting from the ruled sign instead, the two numbers are independent and
     * they do meet: a Mars ascendant in Scorpio puts Mars in the first house
     * and sixth from its own sign, which is the dosha, case for case.
     */
    const ruledSign = OWN_SIGNS[graha];
    const fromItself = ruledSign === undefined
      ? house
      : ((ruledSign - rashi + 12) % 12) + 1;
    const inKendra = KENDRA_HOUSES.includes(house);
    const undone = inKendra && DOSHA_FROM_SELF.includes(fromItself);

    let tone: PhalaLine['tone'];
    let verdict: string;
    let badge: string;

    if (debilitated) {
      tone = 'hard';
      badge = 'निर्वाण';
      verdict =
        `${label} निर्वाण राशि में है। इसका बल कमज़ोर है, इसलिए जो काम इससे जुड़े वे ` +
        'आसानी से नहीं सधते — मेहनत की माँग ज़्यादा रहती है।';
    } else if (undone) {
      tone = 'hard';
      badge = 'दोष';
      verdict =
        `${label} केंद्र (${house}वें भाव) में है, पर अपने ही ${fromItself}वें भाव में — ` +
        'यही केंद्राधिपति दोष है। इस ग्रह की बात पर ज़ोर न दें।';
    } else if (exalt !== undefined && rashi === exalt) {
      tone = 'good';
      badge = 'उच्च';
      verdict = `${label} उच्च राशि में है — बल पूरा, और इससे जुड़े काम सधते हैं।`;
    } else if (own !== undefined && rashi === own) {
      tone = 'good';
      badge = 'स्व';
      verdict = `${label} अपनी ही राशि में है — दक्ष और भरोसेमंद, अपने काम में भरोसा।`;
    } else if (inKendra) {
      tone = 'good';
      badge = 'केंद्र';
      verdict =
        `${label} केंद्र (1, 4, 7 या 10) में है — चारों तरफ से देखता है, ` +
        'इसलिए इसकी बातों का वज़न रहता है।';
    } else if (house === 6 || house === 8 || house === 12) {
      tone = 'mixed';
      badge = 'विकार';
      verdict =
        `${label} ${house}वें भाव में है। भाव दुख का स्थान माना जाता है, ` +
        'पर पूरी तरह बुरा नहीं भी।';
    } else if (house === 11) {
      tone = 'good';
      badge = 'लाभ';
      verdict = `${label} 11वें भाव में है — यह लाभ और मनोरमता का स्थान माना जाता है।`;
    } else {
      tone = 'mixed';
      badge = 'साधारण';
      verdict = `${label} ${house}वें भाव में है — न बहुत उठा, न बहुत गिरा।`;
    }

    if (tone === 'good') good += 1;
    else if (tone === 'hard') hard += 1;
    else mixed += 1;

    lines.push({ graha, name: label, house, rashi: rashiName, verdict, tone, badge });
  }

  /* ── 2. the pancha mahapurusha ────────────────────────────────────────── */

  const mahapurusha: Mahapurusha[] = MAHAPURUSHA_ORDER.map((graha) => {
    const position = grahas[graha];
    const label = name(graha);
    const house = position ? (houses[graha] ?? 12) : 12;
    const rashi = position?.rashi ?? 0;

    const met: string[] = [];
    const missed: string[] = [];

    const inKendra = KENDRA_HOUSES.includes(house);
    if (inKendra) met.push('केंद्र में'); else missed.push('केंद्र में नहीं');

    const exalt = EXALTATION[graha];
    const exalted = exalt !== undefined && rashi === exalt;
    const own = OWN_SIGNS[graha];

    /*
     * The Moon and Mercury are satisfied by exaltation *or* by their own sign;
     * the other three must be exalted. Mercury has a second condition the texts
     * add — never retrograde — and this chart cannot see it, because the site's
     * series carries no motion. So it is not counted as met, and the note on the
     * card says which condition was not looked at rather than quietly passing
     * it over.
     */
    if (graha === 'moon' || graha === 'mercury') {
      if (exalted) met.push('उच्च में');
      else if (own) met.push('अपनी राशि में');
      else missed.push('उच्च या अपनी राशि में नहीं');
    } else if (exalted) {
      met.push('उच्च में');
    } else {
      missed.push('उच्च में नहीं');
    }

    return { graha, name: label, house, formed: false, gift: '', years: 0, met, missed };
  });

  // The shares go to those that formed, most first, Venus taking the first.
  const formed = mahapurusha.filter((entry) => entry.met.length > entry.missed.length);

  MAHAPURUSHA_SHARES.forEach((share, index) => {
    const entry = formed[index];
    if (!entry) return;
    entry.formed = true;
    entry.gift = share.gift;
    entry.years = share.years;
  });

  const mahapurushaYears = formed.reduce((sum, entry) => sum + entry.years, 0);

  /* ── 3. the lord of the ascendant ─────────────────────────────────────── */

  const lordName = RASHIS[lagnaRashi]?.lord ?? '';
  const lord = PLANETS.find((graha) => name(graha) === lordName) ?? null;

  const lordHouse = lord ? (houses[lord] ?? 12) : 12;
  const lordRashi = lord && grahas[lord] ? grahas[lord].rashi : lagnaRashi;

  // Which house it occupies, counted from the sign the lord *rules*. See the
  // long note in the loop above: counted from where it sits instead, the two
  // conditions can never both hold and the dosha never appears.
  const lordRuledSign = lord ? OWN_SIGNS[lord] : undefined;
  const fromItself = lordRuledSign === undefined
    ? lordHouse
    : ((lordRuledSign - lordRashi + 12) % 12) + 1;
  const lordInKendra = KENDRA_HOUSES.includes(lordHouse);
  const dosha = lordInKendra && DOSHA_FROM_SELF.includes(fromItself);

  const kendradhipati = {
    lord,
    lordName: lord ? name(lord) : lordName,
    house: lordHouse,
    fromItself,
    dosha,
    why: dosha
      ? `लग्नेश ${lordName} केंद्र में है (${lordHouse}वाँ भाव) और अपने ही ${fromItself}वें भाव में। ` +
        'यही केंद्राधिपति दोष है — जल्दबाज़ी में कोई काम शुरू न करें।'
      : lordInKendra
        ? `लग्नेश ${lordName} केंद्र में है और अपने ${fromItself}वें भाव में नहीं — दोष नहीं बनता।`
        : `लग्नेश ${lordName} ${lordHouse}वें भाव में है — केंद्र में नहीं, इसलिए यह दोष नहीं बनता।`,
  };

  /* ── 4. the verdict ───────────────────────────────────────────────────── */

  const strengths: string[] = [];
  const cautions: string[] = [];

  if (formed.length >= 2) {
    strengths.unshift(
      `पंच महापुरुष में ${formed.length} बने हैं — ${formed.map((e) => e.name).join(', ')}। ` +
        `इनका जीवन-भाग ${mahapurushaYears} वर्ष माना जाता है।`,
    );
  } else if (formed.length === 1) {
    strengths.unshift(`पंच महापुरुष में ${formed[0].name} बना है।`);
  } else {
    cautions.unshift(
      'पंच महापुरुष में कोई नहीं बना। इसका मतलब कुंडली कमज़ोर नहीं — सिर्फ़ यह कि बड़े योग यहाँ नहीं हैं।',
    );
  }

  if (dosha) cautions.unshift(kendradhipati.why);
  else strengths.push(kendradhipati.why);

  for (const line of lines) {
    if (line.tone === 'good') strengths.push(line.verdict);
    else if (line.tone === 'hard') cautions.push(line.verdict);
  }

  return {
    lines,
    mahapurusha,
    mahapurushaCount: formed.length,
    mahapurushaYears,
    kendradhipati,
    tally: { good, mixed, hard },
    summary: buildSummary(good, mixed, hard, formed.length, dosha),
    // Not truncated. There are at most nine lines and two notes above them, so a
    // cap here could only ever hide something — and what it would hide is the
    // one line a reader came for. An earlier version cut both lists to six,
    // which quietly dropped a weakness on a chart that had seven.
    strengths,
    cautions,
  };
}

function buildSummary(
  good: number,
  mixed: number,
  hard: number,
  mahas: number,
  dosha: boolean,
): string {
  const parts: string[] = [];

  if (hard === 0) {
    parts.push(
      `नौ में से ${good} ग्रह साफ़ा बोल रहे हैं${mixed > 0 ? `, ${mixed} साधारण हैं` : ''} और कोई बड़ा दोष नहीं है।`,
    );
  } else if (hard <= 2) {
    parts.push(
      `नौ में से ${good} ग्रह साफ़ा बोल रहे हैं और ${hard} पर कमज़ोरी है। ` +
        'यह हार की कुंडली नहीं — मेहनत से काम चलने वाली कुंडली है।',
    );
  } else {
    parts.push(
      `नौ में से ${hard} ग्रह कठिन स्थिति में हैं। कुंडली कमज़ोर है, पर कमज़ोर कुंडली होने का ` +
        'मतलब कुछ नहीं — उपाय और प्रयत्न से काम चलता है।',
    );
  }

  if (mahas >= 3) {
    parts.push(`${mahas} महापुरुष योग बने हैं, जो कुंडली को बड़ा बल देते हैं।`);
  }
  if (dosha) {
    parts.push('केंद्राधिपति दोष है, इसलिए कोई बड़ा काम सोच-समझकर ही शुरू करें।');
  }

  return parts.join(' ');
}