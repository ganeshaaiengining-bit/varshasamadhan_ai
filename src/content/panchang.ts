import { sunLongitude, moonLongitude } from './grahas';
import { NAKSHATRAS, RASHIS, nakshatraLordAt } from './astrology';

/**
 * ===========================================================================
 *  PANCHANG — the five limbs
 * ===========================================================================
 *
 * The five things a priest reads off an almanac before doing anything: the
 * tithi, the nakshatra, the yoga, the karana and the weekday. Every one of them
 * is a division of an angle between two bodies, so all five can be computed
 * exactly — and, unlike a reading, can be checked against a calendar.
 *
 *   तिथि   the Moon's phase — how far it is from the Sun
 *   नक्षत्र the Moon's mansion — where it sits in the zodiac
 *   योग    the sum of Sun and Moon — where their joined light falls
 *   करण   half a tithi — the unit a ritual is actually timed in
 *   वार    the weekday
 *
 * ── On sidereal, not tropical ─────────────────────────────────────────────
 *
 * Every longitude here is sidereal. The day is reckoned from the moment the Sun
 * enters the new moon, not from a fixed point on a Western calendar, so a
 * thirty-day lunar month is thirty days long — it does not get shorter when the
 * Gregorian year does.
 *
 * ── Why each of the five can be wrong while looking right ─────────────────
 *
 * Because a tithi is "a number between one and thirty" and so is a wrong one.
 * The checks in `scripts/test-panchang.ts` are therefore not on ranges but on
 * arithmetic — the exact new moon instant, the exact full moon, the fact that
 * the tithi index and the nakshatra index come from the *same* moment, and the
 * fact that the karana count is sixty and the yoga count is twenty-seven — all
 * of which can be worked out on paper.
 */

/** The Moon moves this far in a day, so a day is this much of a degree. */
const MOON_PER_DAY = 13.176;

/* ===========================================================================
 *  THE FIVE
 * =========================================================================== */

export interface PanchangPoint {
  index: number;
  name: string;
  /** What it is about, in a phrase a person can use. */
  about: string;
}

/** The thirty tithis. */
export const TITHIS: string[] = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
  'कृष्ण प्रतिपदा', 'कृष्ण द्वितीया', 'कृष्ण तृतीया', 'कृष्ण चतुर्थी', 'कृष्ण पंचमी',
  'कृष्ण षष्ठी', 'कृष्ण सप्तमी', 'कृष्ण अष्टमी', 'कृष्ण नवमी', 'कृष्ण दशमी',
  'कृष्ण एकादशी', 'कृष्ण द्वादशी', 'कृष्ण त्रयोदशी', 'कृष्ण चतुर्दशी', 'अमावस्या',
];

const TITHI_ABOUT: string[] = [
  'शुरुआत, नया निर्णय', 'स्थिरता, जोड़ी बनना', 'परिश्रम और उत्साह', 'विश्राम, स्थिर होना',
  'पाँचों इंद्रियों और पंच तत्वों का दिन', 'विद्या और छूट की बात', 'शाम, साथ और बहस',
  'अचानक बात, मोड़', 'पूर्व पुण्य, माँ के साथ', 'मौका, भाग्य का दिन',
  'फल और उपाय', 'क़र्ज़ और बिक्री', 'बहस और यात्रा', 'चतुर्दशी — विशेष पूजा',
  'पूर्णिमा — चाँद पूरा', 'कृष्ण प्रतिपदा', 'कृष्ण द्वितीया', 'कृष्ण तृतीया',
  'कृष्ण चतुर्थी', 'कृष्ण पंचमी', 'कृष्ण षष्ठी — सात दिन का पोरा (करक चतुर्थी)',
  'कृष्ण सप्तमी', 'कृष्ण अष्टमी', 'कृष्ण नवमी', 'कृष्ण दशमी',
  'कृष्ण एकादशी', 'कृष्ण द्वादशी', 'कृष्ण त्रयोदशी', 'कृष्ण चतुर्दशी',
  'अमावस्या — नया चाँद, सबसे शुभ पूजा',
];

/** The twenty-seven yogas. */
export const YOGAS: string[] = [
  'विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'सौधन', 'शोभन', 'वध',
  'वृद्धि', 'ध्रुव', 'व्यूह', 'वर्ज्य', 'परिघ', 'शिव', 'सिद्धि', 'व्यतीपात',
  'वरीयान', 'परिघ', 'शिव', 'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव',
  'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव',
];

/**
 * The seven karanas that recur through the month, and the three that do not.
 *
 * A lunar month has sixty half-tithis and each is a karana. They are not sixty
 * different things: the first is Kimstughna on its own, then seven karanas run
 * round eight times, and the last three are Shakuni, Chatushpada and Naga.
 *
 *     1        Kimstughna
 *     2 – 57   the seven, eight times over        (56)
 *     58 – 60  Shakuni, Chatushpada, Naga          (3)
 *                                     total      60
 *
 * ── Why the list was rebuilt rather than extended ──────────────────────────
 *
 * Because the first version had seventy-six entries, and the code read the
 * recurring karana out of the wrong part of it — which is how a Vanija came out
 * as a Shakuni. The count was the only thing that noticed: seventy-six is not
 * sixty, and sixty is the number a lunar month has. That check is in
 * `scripts/test-panchang.ts`.
 */
const REPEATING = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि'];
const SHAKUNI = ['शकुनी', 'चतुष्पद', 'नाग'];

/** The sixty karana names, in order. */
export const KARANAS: string[] = [
  'किम्स्तुग्ना',
  ...Array.from({ length: 56 }, (_, i) => REPEATING[i % 7]),
  ...SHAKUNI,
];

/** What each karana is for. */
const KARANA_ABOUT: Record<string, string> = {
  'किम्स्टुग्ना': 'शुभ कार्यों के लिए बुरा, दान के लिए अच्छा',
  'बव': 'बाण, काटना, मिट्टी का काम — नया शुरू करने के लिए',
  'बालव': 'राह दिखाता है, पर दर्द भी देता है',
  'कौलव': 'शुभ — शिक्षा, यात्रा, व्यापार',
  'तैतिल': 'शुभ — सभी काम शुभ, नया शुरू करने के लिए',
  'गर': 'धोखे और झगड़े का संकेत, बहस में बर्बादी',
  'वणिज': 'सब काम शुभ, भोजन और शुभ कार्य',
  'विष्टि': 'अच्छा काम बिगाड़ने का — दान और यज्ञ ही शुभ',
  'शकुनी': 'नींद आती है, आँखों को आराम',
  'चतुष्पद': 'चार दिशाएँ खुलती हैं, यात्रा का दिन',
  'नाग': 'नाग दिवस, शुभ कार्य का आरंभ',
};

const YOGA_ABOUT: Record<number, string> = {
  0: 'कड़ी मेहनत से फल', 1: 'प्रीति और सम्मान', 2: 'स्वास्थ्य और दीर्घायु',
  3: 'सौभाग्य और संपत्ति', 4: 'मन शुद्ध, उपाय शुभ', 5: 'अच्छा समय, यात्रा',
  6: 'कठिनाई, पर हारा नहीं', 7: 'वृद्धि, कुशल कार्य', 8: 'स्थिरता, निश्चित राह',
  9: 'जन-सम्मूहन, संकट', 10: 'राह बंद, काम टिका', 11: 'प्रतिकूल समय',
  12: 'कल्याण, शुभ कार्य', 13: 'सिद्धि, सफलता', 14: 'दोनों सफलता और असफलता',
  15: 'ऊँचा पहुंच', 16: 'कमज़ोरी के दिन भी', 17: 'शुभ कार्य सिद्ध',
  18: 'आकस्मिक बाधा', 19: 'दुख का अंत', 20: 'बुराई से बचाव', 21: 'अस्वाभाविक बात',
  22: 'जाति की कुंटा', 23: 'कर्म की कमज़ोरी', 24: 'दुख और शोक',
  25: 'स्वभाव से समझौता', 26: 'संतोष और शुभ',
};


const WEEKDAYS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

export interface Panchang {
  /** 1 to 30. */
  tithi: PanchangPoint;
  /** 1 to 27. */
  nakshatra: PanchangPoint;
  /** 1 to 27. */
  yoga: PanchangPoint;
  /** 1 to 60. */
  karana: PanchangPoint;
  /** 0 is Sunday. */
  vaara: { index: number; name: string; about: string };

  /** शुक्ल पक्ष or कृष्ण पक्ष. */
  paksha: 'शुक्ल' | 'कृष्ण';
  /** How much of the Moon's face is lit. */
  moonPercent: number;

  /** The raw angles, so a reader can check the division. */
  angles: {
    moon: number;
    sun: number;
    /** Moon minus the Sun: the tithi's distance from the new moon. */
    tithiAngle: number;
    yogaAngle: number;
  };
}

/**
 * The five limbs of the day of birth.
 *
 * `jd` is a Julian day, so the whole thing reads the chart's own instant rather
 * than re-deriving one — two answers on one page is a thing this project has
 * already shipped once and does not intend to ship twice.
 */
export function panchang(jd: number, weekdayIndex: number): Panchang {
  const moon = ((moonLongitude(jd) % 360) + 360) % 360;
  const sun = ((sunLongitude(jd) % 360) + 360) % 360;

  /* ── तिथि ──────────────────────────────────────────────────────────────
     The Moon's distance from the Sun, in twelfths of the zodiac. */
  const tithiAngle = ((moon - sun) % 360 + 360) % 360;
  const tithiIndex = Math.floor(tithiAngle / 12);
  const withinTithi = tithiAngle / 12 - tithiIndex;

  /* ── नक्षत्र ───────────────────────────────────────────────────────────
     The Moon's own mansion: the zodiac divided into twenty-seven. */
  const nkIndex = Math.floor(moon / (360 / 27));
  const withinNakshatra = moon / (360 / 27) - nkIndex;

  /* ── योग ───────────────────────────────────────────────────────────────
     Where the joined light of the two falls: their sum, in twenty-sevenths. */
  const yogaAngle = (moon + sun) % 360;
  const yogaIndex = Math.floor(yogaAngle / (360 / 27));

  /* ── करण ───────────────────────────────────────────────────────────────
     Half a tithi. There are sixty of them to a lunar month, which is the
     count the test checks, because a karana numbered one to thirty would be a
     karana half as often right as it is wrong. */
  const halfIndex = Math.floor(tithiAngle / 6);

  /*
   * The name comes straight out of the sixty-entry list, so it cannot drift
   * from it.
   *
   * It used to be worked out here instead, and the working was wrong twice
   * over: the recurring karana was read out of the shukla section of the list,
   * and Vishṭi — the seventh, which falls only in the second half of the
   * tithis 4, 8, 12, 16, 20, 24 and 28 — was tested as `halfIndex % 15 === 3`,
   * which is a different seven altogether. It put Vishṭi on days it never falls
   * and left it off days it does.
   */
  const karanaName = KARANAS[halfIndex];

  const lit = Math.round(((1 - Math.cos((tithiAngle * Math.PI) / 180)) / 2) * 100);

  const vaara = ((weekdayIndex % 7) + 7) % 7;

  return {
    tithi: {
      index: tithiIndex + 1,
      name: TITHIS[tithiIndex],
      about: TITHI_ABOUT[tithiIndex],
    },
    nakshatra: {
      index: nkIndex + 1,
      name: NAKSHATRAS[nkIndex],
      about: `चर ${rashiAt(moon).name} — भाग ${Math.floor(withinNakshatra * 4) + 1}`,
    },
    yoga: {
      index: yogaIndex + 1,
      name: YOGAS[yogaIndex],
      about: YOGA_ABOUT[yogaIndex] ?? '',
    },
    karana: {
      index: halfIndex + 1,
      name: karanaName,
      about: KARANA_ABOUT[karanaName] ?? '',
    },
    vaara: {
      index: vaara,
      name: WEEKDAYS[vaara],
      about: 'वार का लाभ-हानि उस दिन के ग्रह से देखा जाता है',
    },
    paksha: tithiIndex < 15 ? 'शुक्ल' : 'कृष्ण',
    moonPercent: lit,
    angles: { moon, sun, tithiAngle, yogaAngle },
  };
}

/**
 * The rashi a longitude falls in, by thirty degrees from Aries.
 *
 * Not from `NAKSHATRAS` — that is a list of names, and a nakshatra spans across
 * two rashis by design. The rashi comes from the degree, which is the only
 * place it actually lives.
 */
export function rashiAt(longitude: number): { index: number; name: string; lord: string } {
  const index = Math.floor((((longitude % 360) + 360) % 360) / 30);
  return { index, name: RASHIS[index].name, lord: RASHIS[index].lord };
}

/* ===========================================================================
 *  THE MOON'S PHASE
 * ===========================================================================
 *
 * Where the Moon is in its month, as a picture and a percentage, because
 * "which tithi" means nothing to most people and "how full is the moon tonight"
 * means something to everybody.
 */

export function moonPhase(jd: number): {
  name: string;
  percent: number;
  /** Days until the next new moon. */
  daysToNewMoon: number;
} {
  const moon = ((moonLongitude(jd) % 360) + 360) % 360;
  const sun = ((sunLongitude(jd) % 360) + 360) % 360;
  const angle = ((moon - sun) % 360 + 360) % 360;

  const lit = Math.round(((1 - Math.cos((angle * Math.PI) / 180)) / 2) * 100);

  // Twelve days from new to full and twelve back, so the day of the new moon
  // comes at fifteen per cent and not at zero.
  const day = angle / MOON_PER_DAY;
  let name: string;

  if (lit <= 6) name = 'अमावस्या';
  else if (day < 15 && lit <= 45) name = 'बाल चंद्र';
  else if (day < 15 && lit < 92) name = 'बढ़ता चंद्र';
  else if (lit >= 94) name = 'पूर्णिमा';
  else if (lit >= 45) name = 'घटता चंद्र';
  else name = 'प्याज बाल चंद्र';

  const daysToNewMoon = angle / MOON_PER_DAY;

  return { name, percent: lit, daysToNewMoon };
}

/* ===========================================================================
 *  THE NAKSHATRA AT AN INSTANT
 * ===========================================================================
 *
 * Separated out because the chart asks for it once and the page wants it in two
 * places, and two answers to one question is a thing this site has shipped
 * before.
 */
export function nakshatraAt(jd: number): {
  index: number;
  name: string;
  rashi: { index: number; name: string; lord: string };
  pada: number;
  lord: string;
} {
  const moon = ((moonLongitude(jd) % 360) + 360) % 360;
  const index = Math.floor(moon / (360 / 27));
  const within = moon / (360 / 27) - index;

  return {
    index,
    name: NAKSHATRAS[index],
    rashi: rashiAt(moon),
    pada: Math.floor(within * 4),
    lord: nakshatraLordAt(index + 1),
  };
}