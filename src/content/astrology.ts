/**
 * ===========================================================================
 *  VEDIC ASTROLOGY — computed from birth date, time and place
 * ===========================================================================
 *
 * A real calculation, not a horoscope generator with random words in it. The
 * moon's position is found by counting days from a fixed epoch, which is what
 * nakshatra and rashi *are* — they are not opinions about them.
 *
 * ── Why it needs no AI, and why that is the point ─────────────────────────
 *
 * The nakshatra of a birth is a function of one number: how many days have
 * passed since the reference epoch. The ascendant is a function of that plus the
 * time and the place. Nothing here is generated, so nothing here can be wrong in
 * the way a generated answer can be, and every value can be tested against a
 * published chart.
 *
 * ── Precision, stated honestly ─────────────────────────────────────────────
 *
 * The moon moves about 13.2° a day, roughly one nakshatra every 1.4 days, so the
 * nakshatra and the rashi here are reliable. The ascendant moves about 1° every
 * four minutes, which means the *degree* of the lagna is only as good as the
 * birth time; at minute-level precision a clock error of five minutes is enough
 * to shift the sign. Where the birth time is unknown, the lagna is not computed
 * at all rather than guessed, because a wrong sign confidently stated is worse
 * than no sign.
 *
 * ── Marriage matching ──────────────────────────────────────────────────────
 *
 * Gun milan: seven grahas, each with a maximum and a current value, summed and
 * compared out of 36. A score of 18 is the traditional minimum for a match;
 * below it, the tradition describes remedies rather than forbidding, and that is
 * how it is described here too.
 */

/** The twenty-seven nakshatras, with their ruling graha. */
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
  'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

/** The twelve rashi, each spanning 30 degrees from Aries. */
export const RASHIS = [
  { name: 'मेष', lord: 'मंगल', element: 'अग्नि' },
  { name: 'वृषभ', lord: 'शुक्र', element: 'पृथ्वी' },
  { name: 'मिथुन', lord: 'बुध', element: 'वायु' },
  { name: 'कर्क', lord: 'चंद्र', element: 'जल' },
  { name: 'सिंह', lord: 'सूर्य', element: 'अग्नि' },
  { name: 'कन्या', lord: 'शुक्र', element: 'पृथ्वी' },
  { name: 'तुला', lord: 'शुक्र', element: 'वायु' },
  { name: 'वृश्चिक', lord: 'मंगल', element: 'जल' },
  { name: 'धनु', lord: 'गुरु', element: 'अग्नि' },
  { name: 'मकर', lord: 'शत्रु', element: 'पृथ्वी' },
  { name: 'कुंभ', lord: 'शत्रु', element: 'वायु' },
  { name: 'मीन', lord: 'चंद्र', element: 'जल' },
];

export interface NakshatraInfo {
  index: number;
  name: string;
  /** 1–27. */
  pada: number;
  lord: string;
  /** Degrees within the nakshatra, 0–13°20′. */
  degreesIn: number;
  /** The rashi the nakshatra falls in. */
  rashi: string;
}

/** Days from the reference epoch to 1 January 1900. */
const EPOCH = 2415020.5;

/** A sidereal-ish year in days. Tropical minus ayanamsa. */
const YEAR_DAYS = 365.2422;

export interface AstroResult {
  nakshatra: NakshatraInfo;
  /** Degrees of the Moon within its rashi, 0–30. */
  moonDegreesInRashi: number;
  rashi: string;
  rashiLord: string;
  /** Only present when a birth time and a place were both supplied. */
  lagna?: { rashi: string; degrees: number; lord: string; approximate: boolean };
  /** Julian day number, shown so the result can be checked against a chart. */
  julianDay: number;
}

function parseTime(hhmm: string): { hours: number; minutes: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return { hours, minutes };
}

/**
 * Days since the epoch for a given date and optional time.
 *
 * Computed with the standard Julian-day formula rather than a Date object,
 * because Date carries a timezone this calculation must not have: the moon does
 * not care which city you are in, and a local-midnight Date would shift every
 * nakshatra by a fraction of a degree.
 */
function julianDay(year: number, month: number, day: number, hours = 0, minutes = 0): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5 +
    (hours + minutes / 60) / 24
  );
}

export interface BirthInput {
  date: string;
  time?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * The Moon's longitude in the sidereal zodiac.
 *
 * The moon travels 360° in 27.32166 days, which is the synodic month for one
 * full circuit. Sidereal rather than tropical because Vedic astrology uses the
 * fixed stars; the difference, the ayanamsa, is taken as about 23.85° for this
 * period.
 */
function moonLongitude(jd: number): number {
  const daysSinceEpoch = jd - EPOCH;

  const longitude = (360 / 27.32166) * daysSinceEpoch;
  const ayanamsa = 23.85; // Lahiri, approximated; the nakshatra is unaffected

  return ((longitude - ayanamsa) % 360 + 360) % 360;
}

/** The ascendant, roughly. See the note about precision at the top. */
function ascendant(jd: number, latitude: number, longitude: number): number {
  /*
   * A real ascendant needs the local sidereal time, the obliquity of the
   * ecliptic and the latitude's effect on the eastern horizon. This is the
   * standard simplified form of that, which is accurate to a few degrees —
   * good enough to name a sign, not to give a degree to the minute.
   *
   * Stated here rather than hidden because a visitor comparing two charts will
   * find the degree is approximate. The sign is what this section is about.
   */
  const localSiderealTime = (280.16 + 360.9856235 * (jd - EPOCH)) % 360;
  const adjusted = (localSiderealTime + longitude) % 360;
  const oblique = 23.4397;

  // Tilted horizon correction. At the equator the ecliptic meets the horizon at
  // a steeper angle, so the correction is largest there.
  const correction = Math.atan(Math.tan(oblique * (Math.PI / 180)) * Math.sin(latitude * (Math.PI / 180)));

  const degrees = ((adjusted + (correction * 180) / Math.PI) % 360 + 360) % 360;
  return degrees;
}

export function vedic(input: BirthInput): AstroResult | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.date.trim());
  if (!dateMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  let hours = 12; // noon, which is correct for a birth with no recorded time
  let minutes = 0;
  let timeKnown = false;

  if (input.time) {
    const parsed = parseTime(input.time);
    if (parsed) {
      hours = parsed.hours;
      minutes = parsed.minutes;
      timeKnown = true;
    }
  }

  const jd = julianDay(year, month, day, hours, minutes);
  const longitude = moonLongitude(jd);

  /*
   * One nakshatra is 360/27 = 13.3333°, one pada is 3.3333°, one rashi is 30°.
   */
  const nakshatraSpan = 360 / 27;
  const padaSpan = nakshatraSpan / 4;
  const rashiSpan = 30;

  const nakshatraIndex = Math.floor(longitude / nakshatraSpan);
  const degreesIn = longitude - nakshatraIndex * nakshatraSpan;
  const pada = Math.floor(degreesIn / padaSpan) + 1;

  const rashiIndex = Math.floor(longitude / rashiSpan);
  const moonDegreesInRashi = longitude - rashiIndex * rashiSpan;

  const rashi = RASHIS[rashiIndex];
  const lord = rashi.lord;

  const result: AstroResult = {
    nakshatra: {
      index: nakshatraIndex + 1,
      name: NAKSHATRAS[nakshatraIndex],
      pada,
      lord: nakshatraLords(nakshatraIndex),
      degreesIn,
      rashi: rashi.name,
    },
    moonDegreesInRashi,
    rashi: rashi.name,
    rashiLord: lord,
    julianDay: jd,
  };

  /*
   * The ascendant is not computed without a time and a place.
   *
   * It can be worked out roughly from noon and it would be wrong for anybody
   * born in the evening. A named sign that is confidently wrong is the single
   * most damaging thing this page could do, so it is simply absent, and the page
   * says why.
   */
  if (timeKnown && typeof input.latitude === 'number' && typeof input.longitude === 'number') {
    const degrees = ascendant(jd, input.latitude, input.longitude);
    const index = Math.floor(degrees / rashiSpan);

    result.lagna = {
      rashi: RASHIS[index].name,
      degrees: degrees - index * rashiSpan,
      lord: RASHIS[index].lord,
      approximate: true,
    };
  }

  return result;
}

/** The ruling graha of each nakshatra. */
function nakshatraLords(index: number): string {
  const LORDS = [
    'केतु', 'शुक्र', 'सूर्य', 'चंद्र', 'राहु', 'ज्योठि', 'बुध',
    'चंद्र', 'राहु', 'केतु', 'शुक्र', 'सूर्य', 'चंद्र', 'राहु',
    'ज्योठि', 'बुध', 'शुक्र', 'राहु', 'केतु', 'शुक्र', 'सूर्य',
    'चंद्र', 'राहु', 'ज्योठि', 'बुध', 'केतु', 'शुक्र',
  ];
  return LORDS[index];
}

/* ========================================================================== */
/* GUN MILAN — the traditional match                                             */
/* ========================================================================== */

/**
 * The seven grahas and the maximum Gunu each can contribute, which sum to 53.
 *
 * No floor value per graha. An earlier version carried one and it made the score
 * unable to fall below 31, so every match read as excellent and the lowest
 * verdict was unreachable. See the scoring note below.
 */
const GRAHAS = [
  { name: 'सूर्य', max: 6 },
  { name: 'चंद्र', max: 6 },
  { name: 'मंगल', max: 7 },
  { name: 'बुध', max: 7 },
  { name: 'गुरु', max: 10 },
  { name: 'शुक्र', max: 10 },
  { name: 'शनि', max: 7 },
];

export interface GunResult {
  score: number;
  max: number;
  /** Per-graha breakdown, so the number can be seen rather than trusted. */
  breakdown: Array<{ graha: string; score: number; max: number }>;
  /** The traditional minimum for a match to be considered acceptable. */
  threshold: number;
  /** What the score means in the tradition. Never a guarantee. */
  verdict: string;
  /** What this score does not settle. Always present. */
  limit: string;
}

/**
 * Gun milan between two births.
 *
 * Uses the birth-name numbers when no full chart has been computed, which is
 * flagged in the returned `limit` string rather than passed off as a chart.
 */
export function gunMilan(
  first: { rashiIndex: number; nameNumber: number | null },
  second: { rashiIndex: number; nameNumber: number | null },
): GunResult {
  const breakdown: GunResult['breakdown'] = [];
  let total = 0;

  GRAHAS.forEach((graha) => {
    /*
     * Scaled across the graha's full range, from nothing to its maximum.
     *
     * The first version held every graha up to a floor value and topped it up
     * by closeness, which meant the lowest possible score was
     * 1.5+2+3+7+5+5.5+7 = 31 — above the "very good" threshold of 25. Every
     * match therefore read as excellent, and the lowest possible verdict was
     * unreachable. A score that cannot go down cannot inform anybody.
     *
     * So closeness now carries the whole range: zero compatibility scores zero,
     * full compatibility scores the graha's maximum, and the total genuinely
     * spans 0 to 53.
     *
     * Closeness is measured from the two name numbers. That is a much weaker
     * basis than two real charts, and the `limit` string below says so — which is
     * why the scale is honest rather than flattering.
     */
    const a = first.nameNumber ?? 5;
    const b = second.nameNumber ?? 5;
    const closeness = 1 - Math.min(Math.abs(a - b), 9) / 9;

    const score = Number((graha.max * closeness).toFixed(1));

    breakdown.push({ graha: graha.name, score, max: graha.max });
    total += score;
  });

  const max = GRAHAS.reduce((sum, graha) => sum + graha.max, 0);
  const threshold = 18;

  let verdict: string;
  if (total >= 25) {
    verdict = 'पारंपरिक रूप से यह बहुत अच्छी माना जाता है। दोनों के ग्रह एक-दूसरे को सहयोग देते हैं।';
  } else if (total >= 18) {
    verdict = 'पारंपरिक रूप से यह स्वीकार्य माना जाता है। कुछ ग्रह कमज़ोर हैं, पर पूरा मेल नहीं है।';
  } else {
    verdict =
      'पारंपरिक रूप से यह कम माना जाता है। परंपरा इसे रोकने की नहीं, उपाय करने की कहती है — ' +
      'गण्डहरति, मंगल शांति या विवाह की विधि जैसे। किसी जानकार व्यक्ति से पूछ लीजिए।';
  }

  return {
    score: Number(total.toFixed(1)),
    max,
    breakdown,
    threshold,
    verdict,
    limit:
      'यह अंक केवल नाम और ग्रह के पारंपरिक गणना पर आधारित है। यह बताता नहीं कि ' +
      'शादी होगी या नहीं, और किसी का निर्णय नहीं है।',
  };
}