import {
  allGrahas,
  type GrahaPosition,
  type Planet,
  GRAHA_NAMES,
  RASHI_LORDS,
  EXALTATION,
  DEBILITATION,
} from './grahas';

/**
 * ===========================================================================
 *  PHALADESH — what each dasha period is like
 * ===========================================================================
 *
 * Every graha's twenty-year term is divided into nine sub-periods, one per
 * nakshatra, and each carries a reading. This is the part of the system people
 * actually act on: not what graha is where, but what this decade of their life
 * is for.
 *
 * ── Why phala, not bhoga ───────────────────────────────────────────────────
 *
 * The twenty sub-periods are the bhogas and are a fixed sequence with fixed
 * lengths. The phalas are the same twenty read as tendencies. A chart is
 * useless if it stops at "Venus dasha, 1991 to 2011" — that is a fact about a
 * planet, and everybody already knew it. What somebody wants to know is what
 * those twenty years were for.
 *
 * ── Where the twenty come from ─────────────────────────────────────────────
 *
 * The graha's own sign first — Venus's phala starts with whatever the sign of
 * Venus was in the zodiac at the birth — and the sequence then walks the
 * zodiac backwards, one sign at a time. Every phala is attributed to a
 * graha, and the twenty cover each graha twice, twelve and eight times.
 */

const RASHI_HINDI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

/**
 * Who each phala belongs to.
 *
 * The sequence starts from the graha whose dasha it is, not from the Sun. A
 * Mercury dasha therefore runs Mercury, Ketu, Venus, Sun, Moon and so on, and a
 * Saturn dasha runs Saturn, Mercury, Ketu, Venus, Sun. Each of the nine appears
 * at least twice across the twenty, and the first is always the lord himself.
 *
 * It was a fixed array beginning with the Sun, which made every dasha open with
 * somebody else's phala — a Mercury period that started with a Sun reading
 * looked entirely reasonable on the page and was simply not that period.
 */
const CYCLE: Planet[] = [
  'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury',
];

function phalaOwnerAt(lord: Planet, index: number): Planet {
  return CYCLE[(CYCLE.indexOf(lord) + index) % 9];
}

export interface PhalaPeriod {
  graha: Planet;
  /** Which rashi this phala falls in, 0 to 11. */
  rashi: number;
  /** Start and end, in the same absolute years the dasha used. */
  startYear: number;
  endYear: number;
  /** The one line this period is about. */
  headline: string;
  /** The longer reading, in plain words. */
  detail: string;
  /** What this period does not settle. */
  limit: string;
}

/* -------------------------------------------------------------------------- */
/* The twenty phalas                                                          */
/* -------------------------------------------------------------------------- */

interface PhalaReading {
  headline: string;
  detail: string;
  limit: string;
}

const PHALA_READINGS: Record<string, PhalaReading> = {
  // Sun
  'sun|authority': {
    headline: 'अपनी बात साफ़ और मज़बूत रखिए',
    detail: 'इन वर्षों में आपकी अपनी राय पर खड़ा होना फ़ायदेमंद है। काम, व्यापार या परिवार में जहाँ आपकी सलाह मानी जाती है, वहाँ आपकी पहचान मज़बूत रहेगी। पिता, बड़े या अनुशासन से जुड़े मामले सामने आ सकते हैं।',
    limit: 'यह आपको बड़ा बनाता नहीं, बस आपकी मौल्यता को दिखाता है।',
  },
  'sun|poverty': {
    headline: 'पैसे की चिंता और आत्मविश्वास',
    detail: 'धन या पद की चर्चा चल सकती है, और कभी-कभी अहंकार भी आसानी से सामने आता है। इस समय विनम्रता दिखाना बड़ी कमज़ोरी नहीं, बल्कि सुरक्षा है। किसी बड़े से मदद लेना ठीक है।',
    limit: 'धन की कमी से इनसान की कीमत तय नहीं होती।',
  },
  'sun|anger': {
    headline: 'क्रोध पर नियंत्रण',
    detail: 'स्वभाव गरम हो सकता है और छोटी बात बड़ी लग सकती है। यह अनुशासन की सूची में आता है: जो बात दिल को छूती है उसे तुरंत कह दीजिए, बाद में नहीं।',
    limit: 'क्रोध स्वभाव है, पहचान नहीं।',
  },
  // Moon
  'moon|mind': {
    headline: 'मन की शांति और भावनाएँ',
    detail: 'इन वर्षों में मन की लहरें तेज़ रहेंगी — कभी उदासी, कभी अनंद, कभी बेचैनी। पानी, हरा-भरा स्थान और कम नींद यहाँ राहत देते हैं।',
    limit: 'मन का उतार-चढ़ाव आपकी कमज़ोरी नहीं, उसकी कीमत है।',
  },
  'moon|mother': {
    headline: 'माँ और माता का पक्ष',
    detail: 'माँ, बहन या माता पक्ष की कोई बात सामने आ सकती है। उनकी सेहत और सेवा-खिंच-रख का समय रहता है। दूसरी तरफ़ घर में शांति का महत्व रहता है।',
    limit: 'आपकी माँ के बारे में कुंडली आपकी माँ का चरित्र नहीं बताती।',
  },
  'moon|travel': {
    headline: 'यात्रा और बदलाव',
    detail: 'दूर जाने, अलग शहर बसने या काम के लिए स्थान बदलने की संभावना बनती है। समुद्र या पानी के किनारे का समय ठीक रहता है।',
    limit: 'यात्रा होगी ही — यह निश्चित नहीं, केवल संभावना है।',
  },
  // Mars
  'mars|conflict': {
    headline: 'साहस और टकराव',
    detail: 'आवेश्य मन और साहस दोनों तेज़ रहते हैं। कभी किसी बात पर ज़बरदस्ती टकराव हो सकता है। लड़ाई से बचना बहुत ज़रूरी है — न चाही गई बात के लिए न, और न किसी के साथ।',
    limit: 'आग लगना ज़रूरी नहीं, और साहस का मतलब लड़ना नहीं है।',
  },
  'mars|surgery': {
    headline: 'शारीरिक सतर्कता',
    detail: 'छोटी चोट, सिरदर्द या पेट की तकलीफ़ के लक्षण दिख सकते हैं। समय पर डॉक्टर से दिखाना सबसे अच्छा उपाय है।',
    limit: 'यह चेतावनी नहीं, केवल सामान्य ध्यान की बात है।',
  },
  'mars|property': {
    headline: 'ज़मीन और संपत्ति',
    detail: 'मकान, ज़मीन या बड़ी ख़रीद से जुड़ा विषय सामने आ सकता है। सोच-समझकर करिए, जल्दबाज़ी में नहीं।',
    limit: 'संपत्ति से आपकी पहचान नहीं बनती।',
  },
  // Mercury
  'mercury|education': {
    headline: 'पढ़ाई और सीखना',
    detail: 'नया ज्ञान, कोर्स, प्रतियोगिता की तैयारी या नई नौकरी — इनमें से कुछ सामने आ सकता है। कागज़ का काम और लिखना यहाँ लाभदायक रहता है।',
    limit: 'पढ़ाई का असर आपकी उम्र पर निर्भर करता है, ग्रह पर नहीं।',
  },
  'mercury|trade': {
    headline: 'व्यापार और लेन-देन',
    detail: 'व्यापार, दलाली, कागज़ी काम या छोटा व्यवस्थित करना लाभ दे सकता है। हर लिखत को दोबारा पढ़िए — इस समय छोटी ग़लती बड़ा नुक़सान करती है।',
    limit: 'व्यापार से अमीरी नहीं, आज़ादी मिलती है।',
  },
  'mercury|travel': {
    headline: 'यात्रा और नई जगह',
    detail: 'काम के लिए दूर जाना या अचानक यात्रा हो सकती है। हर जगह कागज़ साथ रखिए।',
    limit: 'यात्रा की संभावना है, निश्चितता नहीं।',
  },
  // Jupiter
  'jupiter|education': {
    headline: 'धर्म, पढ़ाई और गुरु',
    detail: 'पढ़ाई, किसी गुरु का साथ, या धार्मिक कार्य — इनमें से कुछ सफल हो सकता है। बड़ों का आशीर्वाद लेने से काम बनता है।',
    limit: 'पढ़ाई का असर आपकी उम्र पर निर्भर करता है, ग्रह पर नहीं।',
  },
  'jupiter|property': {
    headline: 'धन और संपत्ति',
    detail: 'आय बढ़ सकती है और बड़ा व्यापार या संपत्ति का सौदा हो सकता है। उधार लेने से बचिए — इस समय देना भूलने का जोखिम रहता है।',
    limit: 'धन से आपकी पहचान नहीं बदलती।',
  },
  'jupiter|children': {
    headline: 'संतान और शुभ कार्य',
    detail: 'संतान से जुड़ी खुशी या कोई शुभ कार्य पूरा हो सकता है। किसी ज़रूरतमंद की मदद से शुभ फल मिलता है।',
    limit: 'संतान की किस्मत कुंडली से तय नहीं होती।',
  },
  // Venus
  'venus|money': {
    headline: 'धन और सुख',
    detail: 'आर्थिक सुधार, नई आय या संपत्ति का लाभ संभव है। किसी के कर्ज़ में उतरना ठीक है, पर हिसाब साफ़ रखिए।',
    limit: 'पैसा आता-जाता है, उससे आप बनते नहीं।',
  },
  'venus|pleasure': {
    headline: 'सुख, प्रेम और वैभव',
    detail: 'रचना, कला, संगीत या प्रकृति से सुख मिल सकता है। शादी या रोमांसी बात भी इस समय आगे बढ़ सकती है।',
    limit: 'सुख की इच्छा से ज़िंदगी का असली मक़सद नहीं बदलता।',
  },
  'venus|controversy': {
    headline: 'वाद-विवाद से सावधानी',
    detail: 'किसी बात पर लोगों की राय अलग हो सकती है और बात बढ़ सकती है। चुप रहना, जवाब देना नहीं — यहाँ यही बेहतर है।',
    limit: 'दूसरों का व्यवहार आपके कर्म का प्रतिबिंब नहीं है।',
  },
  // Saturn
  'saturn|trouble': {
    headline: 'कठिनाई और संघर्ष',
    detail: 'व्यापार, नौकरी या रिश्तों में रुकावट आ सकती है। यह समय धीरे चलता है, पर टिका रहता है। जल्दबाज़ी में कोई फैसला न करें।',
    limit: 'मुश्किल आती है — यह आपकी किस्मत नहीं, यह समय है।',
  },
  'saturn|disease': {
    headline: 'स्वास्थ्य की जाँच',
    detail: 'हड्डी, जोड़, पीठ या पुरानी बीमारी से जुड़ी बात सामने आ सकती है। डॉक्टर से जाँच कराइए, अंदाज़े से नहीं।',
    limit: 'यह बीमारी नहीं, केवल जाँच का समय है।',
  },
  'saturn|restriction': {
    headline: 'रोक और अनुशासन',
    detail: 'कुछ काम रुक सकते हैं और लोग रुकावट डाल सकते हैं। धैर्य रखिए। जो आज नहीं हो पा रहा, वह आने वाले साल होगा।',
    limit: 'रोक अस्थायी है — यह आपकी क्षमता नहीं, परिस्थिति है।',
  },
  // Rahu
  'rahu|foreign': {
    headline: 'विदेश या दूर की ओर आकर्षण',
    detail: 'दूर के देश, बड़े शहर या नई जगह की ओर मन खिंच सकता है। यह आकर्षण पूरी तरह बुरा नहीं — कभी-कभी सही जगह यहीं मिलती है।',
    limit: 'दूर जाना आपको बड़ा नहीं बनाता, आपकी जड़ें वहीं रहती हैं।',
  },
  'rahu|unusual': {
    headline: 'असामान्य रास्ते',
    detail: 'काम असामान्य ढंग से चल सकता है और लोग कुछ अलग सोच सकते हैं। घबराइए नहीं, पर सोच-समझकर कदम उठाइए।',
    limit: 'लोग आपकी राय का अर्थ नहीं जानते — वह उनकी अपनी सीमा है।',
  },
  'rahu|loss': {
    headline: 'नुक़सान और अनिश्चितता',
    detail: 'पैसा, काम या रिश्ता कुछ नुक़सान हो सकता है। यह समय जोखिम भरा है — जो कुछ बचा है उसे सँभालकर रखिए।',
    limit: 'नुक़सान हुआ है, यह आपकी किस्मत नहीं है।',
  },
  // Ketu
  'ketu|detachment': {
    headline: 'वैराग्य और दूरी',
    detail: 'जो चीज़ें बाहर से बड़ी लगती हैं, अंदर से छोटी लगने लगेंगी। पुराने रिश्तों से दूरी बन सकती है।',
    limit: 'दूरी हमेशा उत्तर नहीं होती — कभी-कभी लड़ाई भी होती है।',
  },
  'ketu|mystic': {
    headline: 'ध्यान और आध्यात्मिकता',
    detail: 'ध्यान, तपस्या या आध्यात्मिक रुचि बढ़ सकती है। अकेले समय लाभदायक होता है।',
    limit: 'ध्यान आपकी सेहत नहीं बनाता — दवा का स्थान नहीं लेता।',
  },
  'ketu|health': {
    headline: 'शारीरिक सतर्कता',
    detail: 'पुरानी बीमारी, आँख या पेट की परेशानी रह सकती है। डॉक्टर से जाँच कराइए और तय रहने के लिए समय निकालिए।',
    limit: 'यह चेतावनी नहीं, केवल ध्यान रखने की बात है।',
  },
};

/** Key into the readings table, built from what the period is about. */
const TOPIC: Record<string, Record<string, string[]>> = {
  sun: {
    0: ['sun|authority', 'jupiter|education'],
    1: ['sun|poverty'],
    2: ['sun|anger'],
    3: ['venus|money', 'sun|poverty'],
    4: ['mars|conflict', 'sun|anger'],
    5: ['mercury|education', 'sun|authority'],
    6: ['saturn|trouble', 'sun|poverty'],
    7: ['rahu|unusual', 'sun|anger'],
    8: ['ketu|mystic', 'sun|poverty'],
    9: ['saturn|restriction', 'sun|poverty'],
    10: ['jupiter|property', 'sun|authority'],
    11: ['venus|pleasure', 'sun|poverty'],
  },
  moon: {
    0: ['moon|mother', 'jupiter|education'],
    1: ['moon|mind'],
    2: ['mars|surgery', 'sun|anger'],
    3: ['mercury|trade', 'venus|money'],
    4: ['jupiter|children', 'venus|pleasure'],
    5: ['venus|pleasure', 'moon|mind'],
    6: ['saturn|restriction', 'moon|mind'],
    7: ['rahu|unusual', 'moon|mind'],
    8: ['ketu|detachment', 'moon|mind'],
    9: ['mars|property', 'moon|mother'],
    10: ['venus|controversy', 'moon|mind'],
    11: ['saturn|disease', 'moon|mother'],
  },
  mars: {
    0: ['mars|conflict', 'sun|authority'],
    1: ['mars|surgery', 'moon|mind'],
    2: ['mars|property', 'sun|anger'],
    3: ['mars|conflict', 'venus|money'],
    4: ['jupiter|property', 'mars|property'],
    5: ['venus|pleasure', 'mars|conflict'],
    6: ['saturn|trouble', 'mars|conflict'],
    7: ['rahu|loss', 'mars|property'],
    8: ['ketu|health', 'mars|surgery'],
    9: ['sun|anger', 'mars|property'],
    10: ['venus|money', 'mars|property'],
    11: ['saturn|restriction', 'mars|conflict'],
  },
  mercury: {
    0: ['mercury|education', 'sun|authority'],
    1: ['mercury|trade', 'moon|mind'],
    2: ['mercury|travel', 'sun|anger'],
    3: ['mercury|education', 'venus|money'],
    4: ['jupiter|education', 'mercury|trade'],
    5: ['mercury|trade', 'venus|pleasure'],
    6: ['saturn|disease', 'mercury|education'],
    7: ['rahu|foreign', 'mercury|travel'],
    8: ['ketu|detachment', 'mercury|trade'],
    9: ['saturn|restriction', 'mercury|education'],
    10: ['venus|controversy', 'mercury|trade'],
    11: ['jupiter|children', 'mercury|travel'],
  },
  jupiter: {
    0: ['jupiter|education', 'sun|authority'],
    1: ['jupiter|property', 'moon|mind'],
    2: ['jupiter|property', 'mars|property'],
    3: ['jupiter|education', 'mercury|trade'],
    4: ['jupiter|education', 'venus|pleasure'],
    5: ['jupiter|children', 'venus|pleasure'],
    6: ['saturn|restriction', 'jupiter|property'],
    7: ['rahu|unusual', 'jupiter|property'],
    8: ['ketu|mystic', 'jupiter|education'],
    9: ['jupiter|education', 'venus|money'],
    10: ['venus|money', 'jupiter|property'],
    11: ['saturn|disease', 'jupiter|property'],
  },
  venus: {
    0: ['venus|money', 'sun|poverty'],
    1: ['venus|pleasure', 'moon|mind'],
    2: ['venus|money', 'mars|property'],
    3: ['venus|pleasure', 'mercury|trade'],
    4: ['venus|pleasure', 'jupiter|children'],
    5: ['venus|pleasure', 'venus|money'],
    6: ['saturn|disease', 'venus|money'],
    7: ['rahu|foreign', 'venus|pleasure'],
    8: ['ketu|detachment', 'venus|pleasure'],
    9: ['venus|controversy', 'venus|money'],
    10: ['venus|money', 'jupiter|property'],
    11: ['saturn|restriction', 'venus|money'],
  },
  saturn: {
    0: ['saturn|trouble', 'sun|authority'],
    1: ['saturn|disease', 'moon|mind'],
    2: ['saturn|restriction', 'mars|property'],
    3: ['saturn|trouble', 'mercury|trade'],
    4: ['saturn|restriction', 'jupiter|property'],
    5: ['saturn|disease', 'venus|pleasure'],
    6: ['saturn|trouble', 'saturn|disease'],
    7: ['rahu|loss', 'saturn|trouble'],
    8: ['ketu|health', 'saturn|disease'],
    9: ['saturn|restriction', 'venus|money'],
    10: ['saturn|trouble', 'jupiter|property'],
    11: ['saturn|disease', 'saturn|restriction'],
  },
  rahu: {
    0: ['rahu|foreign', 'sun|authority'],
    1: ['rahu|unusual', 'moon|mind'],
    2: ['rahu|loss', 'mars|property'],
    3: ['rahu|foreign', 'mercury|trade'],
    4: ['rahu|unusual', 'jupiter|property'],
    5: ['rahu|foreign', 'venus|pleasure'],
    6: ['rahu|loss', 'saturn|trouble'],
    7: ['rahu|unusual', 'rahu|foreign'],
    8: ['rahu|loss', 'ketu|detachment'],
    9: ['rahu|foreign', 'venus|money'],
    10: ['rahu|unusual', 'jupiter|property'],
    11: ['rahu|loss', 'saturn|disease'],
  },
  ketu: {
    0: ['ketu|detachment', 'sun|authority'],
    1: ['ketu|health', 'moon|mind'],
    2: ['ketu|detachment', 'mars|surgery'],
    3: ['ketu|mystic', 'mercury|trade'],
    4: ['ketu|detachment', 'jupiter|education'],
    5: ['ketu|health', 'venus|pleasure'],
    6: ['ketu|mystic', 'saturn|trouble'],
    7: ['ketu|detachment', 'rahu|unusual'],
    8: ['ketu|health', 'ketu|mystic'],
    9: ['ketu|detachment', 'venus|money'],
    10: ['ketu|mystic', 'jupiter|property'],
    11: ['ketu|health', 'saturn|disease'],
  },
};

function readingFor(graha: Planet, rashi: number): PhalaReading {
  const topics = TOPIC[graha]?.[rashi] ?? [];
  for (const key of topics) {
    if (PHALA_READINGS[key]) return PHALA_READINGS[key];
  }
  // Every combination is covered by the table above; this is only here so a
  // missing entry shows up as a blank heading rather than a crash.
  return {
    headline: 'यह काल आपकी ऊर्जा के अनुसार चलेगा',
    detail: 'इस समय के बारे में अधिक जानने के लिए पूरी कुंडली देखिए।',
    limit: 'हर काल हर व्यक्ति के लिए अलग होता है।',
  };
}

export interface PhalaResult {
  periods: PhalaPeriod[];
  /** Which one is running now, or the one that was running at the birth. */
  current: PhalaPeriod | null;
}

/**
 * The twenty phalas of one maha-dasha.
 *
 * Each is a twentieth of the dasha's own length, and the sequence runs
 * backwards through the zodiac from the sign the graha occupied at the birth —
 * which is what makes the first phala the graha's own.
 *
 * The *raashi* walks backwards; the *graha* walks forwards. They are two
 * different cycles and both are right. A Jupiter dasha therefore opens in
 * Jupiter's own sign with Jupiter's own phala, and the next phala is in the
 * sign before it but belongs to Saturn.
 */
export function phaladesh(
  graha: Planet,
  startYear: number,
  endYear: number,
  grahas: Record<Planet, GrahaPosition>,
): PhalaResult {
  const startRashi = grahas[graha].rashi;
  const total = endYear - startYear;
  const step = total / 20;

  const periods: PhalaPeriod[] = [];

  for (let i = 0; i < 20; i += 1) {
    /*
     * Backwards through the zodiac, so the graha's own sign comes first.
     *
     * ── Why the modulus is doubled ────────────────────────────────────────
     *
     * It used to be `(startRashi - i + 12) % 12`.
     *
     * That is not enough, because `i` runs to nineteen and the `+ 12` only
     * lifts a value that is *slightly* negative. With the graha in Aries —
     * `startRashi` zero — the nineteenth step gives `(0 - 19 + 12) % 12`, and
     * in JavaScript the sign of a remainder is the sign of the dividend, so
     * that is **minus seven**, not five.
     *
     * A rashi of minus seven is not a rashi. The reading for it was empty, and
     * the page that draws it did `RASHIS[rashi].name` on the way past, which is
     * reading a property of `undefined` — and the whole chart went blank, not
     * just this one box: React tore down the tree, so every tab after फलादेश
     * was empty as well and the failure looked like a broken tab rather than a
     * broken number.
     *
     * It happened for roughly half of all birth charts, depending only on
     * which sign the dasha lord was in. The check for it is in
     * `scripts/test-ankaganit.ts` and `scripts/test-panchang.ts`'s sibling,
     * `scripts/test-phaladesh.ts`: every rashi out of every period, for every
     * graha, over a long run of dates.
     */
    const rashi = ((startRashi - i) % 12 + 12) % 12;
    const reading = readingFor(graha, rashi);

    periods.push({
      graha: phalaOwnerAt(graha, i),
      rashi,
      startYear: startYear + i * step,
      endYear: startYear + (i + 1) * step,
      headline: reading.headline,
      detail: reading.detail,
      limit: reading.limit,
    });
  }

  const year = (startYear + endYear) / 2;
  const current = periods.find(
    (p) => year >= p.startYear && year < p.endYear,
  ) ?? null;

  return { periods, current };
}

/** The rashi names, for a page that renders a chart table. */
export { RASHI_HINDI, RASHI_LORDS, EXALTATION, DEBILITATION, GRAHA_NAMES };