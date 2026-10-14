import {
  allGrahas,
  aspectingGrahas,
  navamsaOf,
  type GrahaPosition,
  type Planet,
  GRAHA_NAMES,
  RASHI_LORDS,
  EXALTATION,
  DEBILITATION,
  PLANETS,
} from './grahas';

/**
 * ===========================================================================
 *  YOGA — what the grahas are doing to each other
 * ===========================================================================
 *
 * A yoga is not a thing that can be looked up in a table. It is a relationship
 * between positions, and there are more of them than any book has room for, so
 * the ones worth naming are the ones that mean something: a conjunction in a
 * good sign, a lord on its own sign, a benefic on a corner, a malefic thrown
 * from a corner onto a benefic.
 *
 * ── Why this is a list and not a formula ───────────────────────────────────
 *
 * Because a formula would produce hundreds of nameless results. A chart with the
 * Sun and Mercury together in the fifth is Gajakesari only if the Moon also
 * aspects it, and calling that a yoga when the Moon is elsewhere would make the
 * word mean nothing. So each one here states its own conditions and checks
 * every one of them.
 *
 * ── What a yoga is and is not ─────────────────────────────────────────────
 *
 * A yoga names a configuration. It does not promise an outcome. The strength
 * matters as much as the presence — a yoga formed by a debilitated graha, or
 * cancelled by another graha, is read differently, so the page says which.
 */

/** How a yoga is doing, which the page shows alongside the name. */
export type YogaStrength = 'strong' | 'mixed' | 'weak' | 'cancelled';

export interface Yoga {
  name: string;
  /** The line the page leads with. */
  summary: string;
  /** What this formation tends to bring. */
  effect: string;
  /** The condition that decides strength. */
  strength: YogaStrength;
  /** If something is spoiling it, what. */
  note?: string;
}

/* -------------------------------------------------------------------------- */
/* Friends, and who is who                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Which graha regards which as a friend.
 *
 * Natural friendship, not the chart's own — a graha in the ninth is not made a
 * friend by being there. Only the Sun, the Moon, Mars and Mercury have
 * friendships at all; Jupiter, Venus and Saturn are treated as temporary friends
 * of the Moon and Mercury only, which is why a Mars–Saturn conjunction is
 * called a war rather than a friendship.
 */
const FRIENDS: Record<Planet, Planet[]> = {
  sun: ['mars', 'jupiter', 'mercury', 'venus'],
  moon: ['sun', 'mercury'],
  mars: ['sun', 'moon', 'jupiter'],
  mercury: ['sun', 'venus'],
  jupiter: ['sun', 'moon', 'mars'],
  venus: ['mercury', 'saturn'],
  saturn: ['mercury', 'venus'],
  rahu: [],
  ketu: [],
};

/** A graha that regards the other as a friend. */
function isFriend(a: Planet, b: Planet): boolean {
  return FRIENDS[a].includes(b);
}

/** The two that give — Jupiter and Venus, and Mercury with the Moon. */
function isBenefic(g: Planet): boolean {
  return g === 'jupiter' || g === 'venus' || g === 'mercury' || g === 'moon';
}

/** The three that take, without counting Rahu and Ketu as always malefic. */
function isMalefic(g: Planet): boolean {
  return g === 'saturn' || g === 'rahu' || g === 'ketu';
}

/** Does this graha sit in a sign it rules? */
function inOwnSign(g: Planet, pos: GrahaPosition): boolean {
  return pos.lord === g;
}

/** Exaltation, debilitation and the sign opposite the exaltation. */
function dignity(g: Planet, pos: GrahaPosition): 'exalted' | 'debilitated' | 'own' | 'friend' | 'neutral' | 'enemy' {
  if (pos.isShadow) return 'neutral';
  if (EXALTATION[g] === pos.rashi) return 'exalted';
  if (DEBILITATION[g] === pos.rashi) return 'debilitated';
  const lord = pos.lord as Planet;
  if (lord === g) return 'own';
  if (isFriend(lord, g) || isFriend(g, lord)) return 'friend';
  if (isFriend(lord, g) === false && isFriend(g, lord) === false) {
    // Both directions false means neither regards the other as a friend.
    return 'enemy';
  }
  return 'neutral';
}

/**
 * Combustion — too close to the Sun to be seen properly.
 *
 * The classical limits are about fourteen degrees for the Moon, twelve for
 * Jupiter and Mars, ten for Venus and Mercury, and eight for Saturn. Beyond
 * them the graha is weakened, and beyond half of them it is said to be
 * combust entirely.
 */
const COMBUST: Record<Planet, number> = {
  sun: 0, moon: 14, mars: 12, mercury: 10, jupiter: 12, venus: 10,
  saturn: 8, rahu: 0, ketu: 0,
};

function separation(a: GrahaPosition, b: GrahaPosition): number {
  const d = Math.abs(a.longitude - b.longitude) % 360;
  return d > 180 ? 360 - d : d;
}

function isCombust(g: Planet, grahas: Record<Planet, GrahaPosition>): boolean {
  return separation(grahas[g], grahas.sun) < COMBUST[g];
}

/* -------------------------------------------------------------------------- */
/* The yogas                                                                   */
/* -------------------------------------------------------------------------- */

interface Context {
  grahas: Record<Planet, GrahaPosition>;
  lagnaRashi: number;
}

/** Corner houses — 1, 4, 7, 10, where a graha is strongest. */
function isKendra(ctx: Context, g: Planet): boolean {
  const h = house(ctx, g);
  return h === 1 || h === 4 || h === 7 || h === 10;
}

/** Triangular houses — 1, 5, 9, where a graha does well. */
function isTrikona(ctx: Context, g: Planet): boolean {
  const h = house(ctx, g);
  return h === 1 || h === 5 || h === 9;
}

function house(ctx: Context, g: Planet): number {
  return ((ctx.grahas[g].rashi - ctx.lagnaRashi + 12) % 12) + 1;
}

function together(ctx: Context, a: Planet, b: Planet): boolean {
  return ctx.grahas[a].rashi === ctx.grahas[b].rashi;
}

/**
 * The yogas this chart actually forms.
 *
 * Every check below is the whole condition, not a necessary part of it. A yoga
 * reported on half its conditions is worse than one not reported at all,
 * because the reader has no way to know which half was left out.
 */
export function findYogas(jd: number, lagnaRashi: number): Yoga[] {
  const grahas = allGrahas(jd);
  const ctx: Context = { grahas, lagnaRashi };
  const out: Yoga[] = [];

  // ── Gajakesari ────────────────────────────────────────────────────────────
  if (
    together(ctx, 'jupiter', 'moon') &&
    (aspectingGrahas('jupiter', grahas).includes('moon') ||
      aspectingGrahas('moon', grahas).includes('jupiter'))
  ) {
    const d = dignity('jupiter', grahas.jupiter);
    out.push({
      name: 'गजकेसरी योग',
      summary: 'चंद्र और बृहस्पति एक ही राशि में हैं और एक-दूसरे को देख रहे हैं।',
      effect:
        'ज्ञान की गहराई, शांत मन और कठिन समय में सही सलाह मिलने की प्रवृत्ति। लोग आपकी राय मानते हैं।',
      strength:
        isCombust('jupiter', grahas) ? 'weak' : d === 'exalted' || d === 'own' ? 'strong' : 'mixed',
      note: isCombust('jupiter', grahas) ? 'बृहस्पति सूर्य के पास हैं — योग कमज़ोर पड़ता है।' : undefined,
    });
  }

  // ── Chandra-Mangal ────────────────────────────────────────────────────────
  if (together(ctx, 'moon', 'mars')) {
    out.push({
      name: 'चंद्र-मंगल योग',
      summary: 'चंद्र और मंगल एक ही राशि में हैं।',
      effect:
        'तेज़ मन, काम के प्रति रुचि और कभी-कभी जल्दबाज़ी। भावनाएँ और कार्य दोनों तेज़ चलते हैं।',
      strength:
        together(ctx, 'sun', 'mars') || together(ctx, 'sun', 'moon')
          ? 'cancelled'
          : isBenefic(ctx.grahas.mars.lord as Planet)
            ? 'mixed'
            : 'weak',
      note:
        together(ctx, 'sun', 'mars') || together(ctx, 'sun', 'moon')
          ? 'सूर्य भी इसी राशि में है — सूर्य की संगति से यह योग टूट जाता है।'
          : undefined,
    });
  }

  // ── Budha-Aditya ──────────────────────────────────────────────────────────
  if (together(ctx, 'sun', 'mercury')) {
    out.push({
      name: 'बुध-सूर्य योग',
      summary: 'सूर्य और बुध एक ही राशि में हैं।',
      effect:
        'बुद्धि तेज़, बोलने में कुशलता और लिखने का ज़्यादा ज़ोर। शिक्षा और बातचीत से जुड़ा काम सफल।',
      strength: isCombust('mercury', grahas) ? 'weak' : 'strong',
      note: isCombust('mercury', grahas)
        ? 'दोनों एक ही सूर्य के पास हैं — बुध को अस्त-प्रस्त कहा जाता है।'
        : undefined,
    });
  }

  // ── Pancha Mahapurusha ────────────────────────────────────────────────────
  for (const g of ['mars', 'mercury', 'jupiter', 'venus', 'saturn'] as Planet[]) {
    const pos = grahas[g];
    if (pos.lord === g && isKendra(ctx, g)) {
      const labels: Record<string, string> = {
        mars: 'रुक्मंग योग',
        mercury: 'बुध योग',
        jupiter: 'जीव योग',
        venus: 'मालव्य योग',
        saturn: 'शशि योग',
      };
      const lines: Record<string, string> = {
        mars: 'साहस, कार्यशीलता और भौतिक मेहनत से सफलता।',
        mercury: 'बुद्धि, शिक्षा और लेखन से सफलता।',
        jupiter: 'ज्ञान, धर्म और मार्गदर्शन से सफलता।',
        venus: 'कला, सौंदर्य, आराम और संबंधों से सफलता।',
        saturn: 'परिश्रम, इमानदारी और देर से लेकिन पक्की सफलता।',
      };
      const combustion = isCombust(g, grahas);
      out.push({
        name: `${labels[g]} (${GRAHA_NAMES[g].hindi} महापुरुष)`,
        summary: `${GRAHA_NAMES[g].hindi} अपनी ही राशि में है और कोण स्थान पर है।`,
        effect: lines[g],
        strength: combustion ? 'weak' : 'strong',
        note: combustion
          ? `${GRAHA_NAMES[g].hindi} सूर्य के पास हैं — यह योग कमज़ोर पड़ जाता है।`
          : undefined,
      });
    }
  }

  // ── Gaja Kesari aside: Dharma-Karmadhipati ─────────────────────────────────
  for (const [a, b] of [
    ['jupiter', 'saturn'],
    ['venus', 'mercury'],
    ['jupiter', 'venus'],
  ] as Array<[Planet, Planet]>) {
    if (
      together(ctx, a, b) &&
      isKendra(ctx, a) &&
      isBenefic(a) &&
      isBenefic(b) &&
      !isCombust(a, grahas) &&
      !isCombust(b, grahas)
    ) {
      out.push({
        name: 'धर्म-कर्माधिपति योग',
        summary: `${GRAHA_NAMES[a].hindi} और ${GRAHA_NAMES[b].hindi} एक राशि में, कोण स्थान पर, दोनों शुभ।`,
        effect:
          'काम और अधिकार एक साथ मिलते हैं — पद, ज़िम्मेदारी और आय, एक ही समय में।',
        strength: 'strong',
      });
    }
  }

  // ── Neecha Bhanga ─────────────────────────────────────────────────────────
  for (const g of ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'] as Planet[]) {
    if (grahas[g].rashi !== DEBILITATION[g]) continue;
    const cancellers: string[] = [];

    if (grahas[g].lord === g) cancellers.push('वह ग्रह अपनी ही राशि में किसी और के साथ है');
    if (aspectingGrahas(g, grahas).includes(g === 'mars' ? 'jupiter' : 'mars')) {
      cancellers.push('मंगल या बृहस्पति देख रहा है');
    }
    if (isKendra(ctx, g)) cancellers.push('कोण स्थान पर है');

    if (cancellers.length > 0) {
      out.push({
        name: `नीचभंग (${GRAHA_NAMES[g].hindi})`,
        summary: `${GRAHA_NAMES[g].hindi} नीच राशि में है, पर ${cancellers[0]}`,
        effect:
          'कमज़ोरी दिखती है पर पूरी नहीं होती — बुरा समय कटता है और आगे बढ़ना संभव है।',
        strength: cancellers.length >= 2 ? 'strong' : 'mixed',
        note: `यह रद्द करने वाली बातें: ${cancellers.length}।`,
      });
    }
  }

  // ── Kemadruma ─────────────────────────────────────────────────────────────
  {
    const moonHouse = house(ctx, 'moon');
    const empty =
      !aspectingGrahas('moon', grahas).includes('jupiter') &&
      !aspectingGrahas('moon', grahas).includes('venus');
    const badNeighbours =
      [moonHouse - 1, moonHouse + 1]
        .map((h) => (((h + 11) % 12) + 1))
        .every((h) => {
          const signLord = RASHI_LORDS[(ctx.lagnaRashi + h - 1) % 12] as Planet;
          return ['saturn', 'rahu', 'ketu'].includes(signLord);
        });

    if (empty && badNeighbours) {
      out.push({
        name: 'केमद्रुम योग',
        summary: 'चंद्र के दोनों पड़ोसी स्थान शत्रु ग्रहों के हैं और कोई शुभ ग्रह उसे नहीं देख रहा।',
        effect:
          'अकेलापन, मन की बेचैनी और परिवार से दूरी की प्रवृत्ति। बाहर से बना हुआ रिश्ता यहाँ टिकता है।',
        strength: 'weak',
        note: 'इस योग का कोई दूसरा दाम नहीं है — कुंडली किसी और दाँव पर खड़ी है, यहीं।',
      });
    }
  }

  // ── Sunapha, Anapha, Durudhara, Kemadruma and the parivartana ────────────
  {
    const moonSign = grahas.moon.rashi;
    const count = PLANETS.filter(
      (g) => g !== 'moon' && !g.includes('ketu') && grahas[g].rashi === moonSign,
    ).length;

    if (count >= 1) {
      out.push({
        name: 'सूर्यफ योग',
        summary: 'चंद्र के ही राशि में एक या अधिक ग्रह हैं, चंद्र से पहले की दिशा में।',
        effect:
          'अपनी ही सोच से जीवन चलता है — स्वतंत्रता, महत्वाकांक्षा और जल्दी में निर्णय।',
        strength: count >= 2 ? 'strong' : 'mixed',
      });
    }
    if (count >= 1 && PLANETS.some((g) => g !== 'moon' && grahas[g].rashi === (moonSign + 11) % 12)) {
      out.push({
        name: 'अनुपफ योग',
        summary: 'चंद्र से पहले के भाव में कोई ग्रह नहीं, लेकिन दूसरे भाव में एक ग्रह है।',
        effect:
          'कम आत्मनिर्भर, परिस्थिति के अनुसार बदलने वाला स्वभाव — जो मिले उसी से चलते हैं।',
        strength: 'mixed',
      });
    }
    if (
      count >= 1 &&
      PLANETS.some((g) => g !== 'moon' && grahas[g].rashi === (moonSign + 1) % 12)
    ) {
      out.push({
        name: 'दुहर्धर योग',
        summary: 'चंद्र के दोनों ओर एक-एक ग्रह हैं।',
        effect:
          'सहज और सुलभ स्वभाव, जिससे मदद माँगने में कठिनाई नहीं होती।',
        strength: 'strong',
      });
    }
  }

  // ── Parivartana Yoga — two lords in each other's signs ────────────────────
  for (let a = 0; a < 12; a += 1) {
    for (let b = a + 1; b < 12; b += 1) {
      const lordA = RASHI_LORDS[a] as Planet;
      const lordB = RASHI_LORDS[b] as Planet;
      if (RASHI_LORDS[b] !== lordA) continue;
      const holderA = PLANETS.find((g) => grahas[g].rashi === a && !grahas[g].isShadow);
      const holderB = PLANETS.find((g) => grahas[g].rashi === b && !grahas[g].isShadow);
      if (holderA === lordB && holderB === lordA) {
        const yogaName = lordA === 'jupiter' || lordA === 'venus' ? 'धन योग' : 'राजयोग';
        out.push({
          name: yogaName,
          summary: `${GRAHA_NAMES[holderA].hindi} और ${GRAHA_NAMES[holderB].hindi} एक-दूसरे की राशि में हैं।`,
          effect:
            'दो शक्तियाँ आपस में मिलकर काम करती हैं — यह संयोजन साधारण से कहीं अधिक फलदायी होता है।',
          strength:
            isKendra(ctx, holderA) || isKendra(ctx, holderB) ? 'strong' : 'mixed',
        });
      }
    }
  }

  // ── Vipreet Raja Yoga — a malefic in a bad house doing good ───────────────
  {
    const dusthana = [6, 8, 12];
    const trikona = [1, 5, 9];
    for (const h of dusthana) {
      for (const g of PLANETS) {
        if (grahas[g].isShadow) continue;
        if (house(ctx, g) !== h) continue;
        const lord = RASHI_LORDS[(ctx.lagnaRashi + h - 1) % 12] as Planet;
        if (!isMalefic(lord)) continue;
        // A malefic in a bad house, ruled by a malefic, aspecting a corner.
        if (trikona.some((t) => aspectingFrom(ctx, g, t))) {
          out.push({
            name: 'विपरीत राजयोग',
            summary: `${GRAHA_NAMES[g].hindi} शत्रु भाव ${h} में, और शत्रु भाव के स्वामी के द्वारा त्रिकोण को देखा जा रहा है।`,
            effect:
              'कठिन परिस्थितियाँ ही अचानक मौका बन जाती हैं — बुरा समय उलटा हुआ दिखता है।',
            strength: 'mixed',
            note: 'यह योग तभी दिखता है जब पहले कुछ बुरा हुआ हो।',
          });
        }
      }
    }
  }

  // ── Lagnadhipati and Saha Yoga — good things start at home ────────────────
  {
    const lagnaLord = RASHI_LORDS[ctx.lagnaRashi] as Planet;
    if (isBenefic(lagnaLord) && [1, 4, 7, 10].includes(house(ctx, lagnaLord))) {
      out.push({
        name: 'लग्नधिपति योग',
        summary: `लग्न ${GRAHA_NAMES[lagnaLord].hindi} का है, और वह शुभ कोण स्थान पर है।`,
        effect:
          'परिवार, घर और अपनी जगह से काम चलता है। दूर जाने से बनने वाले काम घर से ही बनते हैं।',
        strength: isMalefic(lagnaLord) ? 'cancelled' : 'strong',
      });
    }
    const lagnaLordPos = grahas[lagnaLord];
    if (lagnaLordPos && (isMalefic(lagnaLord) || isMalefic(lagnaLordPos.lord as Planet))) {
      out.push({
        name: 'सह योग',
        summary: `लग्न का स्वामी ${GRAHA_NAMES[lagnaLord].hindi} कमज़ोर स्थान पर है।`,
        effect:
          'अकेले शुरुआत मुश्किल है, पर दूसरे का साथ मिलने से पूरा हो जाता है — यही योग कहता है।',
        strength: 'weak',
      });
    }
  }

  // ── Graha yoga — a benefic on a corner or a triangle ──────────────────────
  for (const g of ['jupiter', 'venus', 'mercury', 'moon'] as Planet[]) {
    if (isCombust(g, grahas)) continue;
    if (isKendra(ctx, g) || isTrikona(ctx, g)) {
      const d = dignity(g, grahas[g]);
      out.push({
        name: `${GRAHA_NAMES[g].hindi} योग`,
        summary: `${GRAHA_NAMES[g].hindi} कोण या त्रिकोण स्थान पर है।`,
        effect:
          'यह ग्रह जहाँ भी काम करे वहाँ अच्छा करता है — शिक्षा, संपत्ति, संबंध या विचार, जो भी उससे जुड़ा हो।',
        strength: d === 'exalted' || d === 'own' ? 'strong' : d === 'debilitated' ? 'weak' : 'mixed',
        note: d === 'debilitated' ? `${GRAHA_NAMES[g].hindi} दुर्बल राशि में हैं — प्रभाव कम रहेगा।` : undefined,
      });
    }
  }

  // ── Vargottama — the same sign in both charts ─────────────────────────────
  for (const g of PLANETS) {
    if (navamsaOf(grahas[g].longitude) === grahas[g].rashi) {
      out.push({
        name: `${GRAHA_NAMES[g].hindi} वर्गोत्तम`,
        summary: `${GRAHA_NAMES[g].hindi} की राशि और नवांश दोनों एक ही हैं।`,
        effect:
          'यह ग्रह कमज़ोर नहीं होता — जो काम इससे जुड़ा हो वह टिकता है, चाहे समय बदले।',
        strength: 'strong',
      });
    }
  }

  return out;
}

/** Does the graha aspect that house number? */
function aspectingFrom(ctx: Context, g: Planet, houseNumber: number): boolean {
  const targetSign = (ctx.lagnaRashi + houseNumber - 1) % 12;
  return aspectingGrahas(g, ctx.grahas).some((a) => ctx.grahas[a].rashi === targetSign);
}

/** Every yoga the page can show, for a chart, with the graha it names. */
export type { Planet };
