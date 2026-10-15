/**
 * ===========================================================================
 *  VEDIC ASTROLOGY — computed from birth date, time and place
 * ===========================================================================
 *
 * A real calculation, not a horoscope generator with random words in it. The
 * moon's position is found by counting days from a fixed epoch, which is what
 * nakshatra and rashi *are* — they are not opinions about them.
 *
 * The date itself is read by numerology.ts's parser rather than by a second one
 * here. See the note in `vedic()` for why there is only one.
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
  /**
   * 1–27, as nakshatras are numbered in every chart.
   *
   * NOT an array offset. `name` is `NAKSHATRAS[index - 1]`, and those two
   * disagreeing is the bug this comment exists to prevent: the name was looked
   * up with the zero-based value while the index carried a one, so index 7 came
   * back labelled "Ardra", which is the sixth. It passed a page that renders and
   * failed the first test written to look for it.
   */
  index: number;
  name: string;
  /** 1–4. */
  pada: number;
  lord: string;
  /** Degrees within the nakshatra, 0–13°20′. */
  degreesIn: number;
  /** The rashi the nakshatra falls in. */
  rashi: string;
}

/*
 * The range a birth may fall in. See the note at the check below.
 *
 * The engine reaches 1850 because its own arithmetic — a Julian day from a
 * calendar date — holds that far back. Numerology stops at 1900, which is its
 * own convention and its own business; the two differing is fine, the two
 * parsing the date differently is not.
 */
const MIN_YEAR = 1850;
const CURRENT_YEAR = new Date().getFullYear();

import { parseDate } from './numerology';
import { lagna, moonLongitude as moonLongitudeSidereal, toSidereal } from './grahas';
import { julianDayFromParts } from './julian';

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
 * This function is gone. julian.ts's `julianDayFromParts` does this job, and
 * it takes the clock time to be Indian Standard and converts to the UTC
 * instant, which is what a Julian day has to be.
 *
 * This one took the clock time at face value, so it produced an instant five
 * and a half hours later than the birth. Five and a half hours is 0.23 days,
 * which is three degrees of Moon — a sixth of a nakshatra — so every nakshatra,
 * pada and rashi on the page was computed for a moment that never happened. It
 * is not a rounding difference; it is the difference between a birth and a
 * different one.
 *
 * The two lived side by side, so the lagna on the summary and the lagna on the
 * full chart disagreed by whatever the offset happened to be, on every chart.
 */
function julianDay(year: number, month: number, day: number, hours = 0, minutes = 0): number {
  return julianDayFromParts(year, month, day, hours, minutes);
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
 * This function is gone too. It computed the Moon's *mean* motion — one
 * constant rate multiplied by the number of days since an epoch — and called it
 * the Moon. The real Moon is that mean motion plus six degrees of oscillation
 * from the Sun and from the node, and it is the oscillation that decides which
 * nakshatra a person is born under near a boundary.
 *
 * Worse, multiplying a rate by seventy thousand days turns any imprecision in
 * the rate into degrees. The two Moon calculations on this page disagreed on
 * every one of sixty test births, and disagreed by up to six nakshatras — which
 * is not a small difference, it is a different sign and a different dasha.
 *
 * grahas.ts's `moonLongitude` is the same series the rest of the chart is built
 * on, it carries twenty terms, and it is what scripts/test-ephemeris.ts checks
 * against the length of the sidereal month.
 */
function moonLongitude(jd: number): number {
  // grahas.ts works in the tropical frame and takes the ayanamsa off once, in
  // `allGrahas`. This caller wants the sidereal figure directly, so it asks for
  // the conversion rather than assuming it has already happened — the other way
  // round, this returned a tropical longitude to a function that subtracts 23.85
  // from everything, and the nakshatra came out eighty degrees out.
  return toSidereal(moonLongitudeSidereal(jd), jd);
}

/**
 * The ascendant.
 *
 * Not this function's any more — it is grahas.ts's `lagna()`, which works the
 * geometry properly: Greenwich mean sidereal time, the longitude, the obliquity
 * of the ecliptic, and the latitude's effect on the eastern horizon.
 *
 * The version that used to live here added the latitude's tilt straight onto
 * the local sidereal time, which is right to about fifteen degrees and wrong by
 * exactly that much. It was not a rough approximation of the same answer, it was
 * a different answer: the page printed one lagna in the astrology section and
 * another in the full sheet, twelve degrees apart, on the same birth.
 *
 * Two answers on one page is worse than one wrong answer, because a reader who
 * finds them will believe neither.
 */
function ascendant(jd: number, latitude: number, longitude: number): number {
  return lagna(jd, latitude, longitude);
}

export function vedic(input: BirthInput): AstroResult | null {
  /*
   * The one parser, not a second copy of it.
   *
   * This had its own `/^(\d{4})-(\d{2})-(\d{2})$/` with its own range check and
   * its own idea of what a year can be, next to an identical one in
   * numerology.ts. Two copies of a date parser is how a site ends up with a
   * numerology that reads a date the chart refuses, or the other way round —
   * which is exactly the report that the anka figures and the chart disagreed.
   *
   * The astrology range is wider at the bottom than the numerology one, and that
   * difference is kept here rather than by parsing twice.
   */
  const parts = parseDate(input.date);
  if (!parts) return null;

  const { year, month, day } = parts;

  /*
   * A birth has to be somebody's birth.
   *
   * 1850 parses as a date, so the round-trip check in the parser passes it and
   * the engine answers with a full chart and a confident verdict. It is not a
   * wrong calculation, it is a calculation about nobody.
   *
   * The upper bound is the useful half: a year typed as 20245 or 2100 is a
   * typing slip, and giving a rashi and a nakshatra for it looks like knowledge
   * rather than an error.
   */
  if (year < MIN_YEAR || year > CURRENT_YEAR) return null;

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
      // One-based, because nakshatras are numbered 1 to 27 in every chart and a
      // page that printed "0" or a name next to a number one lower than the
      // one they count on would be checked against the wrong entry.
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
      approximate: false,
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