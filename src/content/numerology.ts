/**
 * ===========================================================================
 *  NUMEROLOGY AND VEDIC ASTROLOGY — computed, not guessed
 * ===========================================================================
 *
 * Birth date, birth time, birth place and name in; numbers and a chart out.
 *
 * ── Why this needs no AI at all ────────────────────────────────────────────
 *
 * Everything on this page is arithmetic. A life path number is a sum of digits
 * reduced to one. A nakshatra is today's Julian day counted from a fixed epoch.
 * Gun milan is seven values added up and compared.
 *
 * That matters here. The rest of the site has been unable to answer anything
 * for five days because an API key never arrived, and this section is the answer
 * to "why should a help site be useless while a key is missing?" — it is not,
 * because the part people come back for most often is computable by definition.
 *
 * It also means the numbers here are the same every time and can be tested,
 * which is the property the rest of the site currently lacks.
 *
 * ── What this is, honestly ─────────────────────────────────────────────────
 *
 * A traditional system, computed faithfully. Jyotisha is a body of calculation
 * with rules about which planet governs which house, and those rules are
 * followed here rather than improvised.
 *
 * It is not evidence. Nothing about this predicts a marriage or a salary. It is
 * presented the way it is presented in the tradition — as a reading to think
 * with, not a forecast to rely on. The wording on the page is chosen so that
 * nobody acts on it: no "will marry in 2027", only "traditionally, this is
 * read as...", with a line at the top saying plainly that it is a belief and not
 * a fact.
 *
 * That is not hedging to be safe. It is the difference between offering a
 * tradition to someone who wants it and making a claim the site cannot support.
 */

export interface BirthInput {
  /** YYYY-MM-DD. Not any other format — the parser is deliberately strict. */
  date: string;
  /** HH:MM, 24-hour. Optional: without it, several things cannot be computed. */
  time?: string;
  /**
   * Latitude and longitude in degrees, north and east positive.
   *
   * Optional but worth asking for. The ascendant cannot be found without a
   * place, and the ascendant is the sign that most people actually mean when
   * they say "my star sign".
   */
  latitude?: number;
  longitude?: number;
  /** The name the person was given at birth. Used for the name number. */
  name?: string;
}

export interface NumerologyResult {
  /** The number derived from the birth date alone. */
  lifePath: number;
  /** Derived from the full birth name. */
  nameNumber: number | null;
  /** Derived from the consonants of the birth name. */
  soulNumber: number | null;
  /** The birth date reduced to a single digit. */
  birthdayNumber: number;
  /**
   * What each number means, keyed by the number itself.
   *
   * Returned rather than looked up at the call site so the page cannot show a
   * number whose meaning it does not have — the alternative is a heading with
   * nothing under it.
   */
  meaning: NumerologyMeaning;
}

export interface NumerologyMeaning {
  title: string;
  /** One line, the traditional keyword. */
  keyword: string;
  /** A short paragraph. Written for a reader, not for a numerologist. */
  text: string;
  /** What this number does *not* settle, so nobody over-reads it. */
  limit: string;
}

const MEANINGS: Record<number, NumerologyMeaning> = {
  1: {
    title: 'एक — शुरुआत और अगुवाई',
    keyword: 'नेतृत्व, स्वतंत्रता',
    text: 'यह संख्या उन लोगों की है जो पहले कदम उठाते हैं। काम शुरू करने की हिम्मत और अपने फैसले पर टिके रहने की आदत इनमें आम है। इनके लिए सबसे बड़ी दिक्कत दूसरों के साथ मिलकर चलना होता है।',
    limit: 'यह बताता नहीं कि कोई सफल होगा या नहीं — केवल यह कि उसे अकेले चलना कितना आसान लगता है।',
  },
  2: {
    title: 'दो — साथ और संतुलन',
    keyword: 'सहयोग, क्षमता',
    text: 'यह संख्या उन लोगों की है जो दूसरों के साथ मिलकर काम करते हैं। जोड़ी, समूह और रिश्तों में इनका ध्यान सबसे ज़्यादा रहता है। संवेदना और बातचीत की कला इनमें बढ़ती है।',
    limit: 'यह नहीं बताता कि कोई रिश्ता बनेगा या टूटेगा — केवल कि उसे साथी चाहिए या नहीं।',
  },
  3: {
    title: 'तीन — अभिव्यक्ति और उत्साह',
    keyword: 'रचनात्मकता, बोलना',
    text: 'यह संख्या उन लोगों की है जो बात करके, लिखकर, गाकर अपनी बात रखते हैं। कला, संवाद और हल्कापन इनमें आम है। मन का खराब होने पर इन्हें बोलने का रास्ता चाहिए।',
    limit: 'यह नहीं बताता कि कोई मशहूर होगा — केवल कि बात रखने का उसका तरीका क्या है।',
  },
  4: {
    title: 'चार — मेहनत और नींव',
    keyword: 'अनुशासन, स्थिरता',
    text: 'यह संख्या उन लोगों की है जो धीरे-धीरे और पक्के काम करते हैं। काम को पूरा करने की आदत और जिम्मेदारी इनमें आम है। जो काम दिखता नहीं, वह भी ये पूरा करते हैं।',
    limit: 'यह आपकी मेहनत का फल नहीं बताता — केवल कि आप मेहनत करते हैं या नहीं।',
  },
  5: {
    title: 'पाँच — बदलाव और साहस',
    keyword: 'स्वतंत्रता, रोमांच',
    text: 'यह संख्या उन लोगों की है जो बदलना पसंद करते हैं और आराम से ज़्यादा देर नहीं ठहरते। यात्रा, नई जगह और नए तरीके इनके लिए रोमांच देते हैं।',
    limit: 'यह नहीं बताता कि जोखिम लेना ठीक है या नहीं — केवल कि रुकना इन्हें मुश्किल लगता है।',
  },
  6: {
    title: 'छह — जिम्मेदारी और परिवार',
    keyword: 'देखभाल, सेवा',
    text: 'यह संख्या उन लोगों की है जो दूसरों की ज़िम्मेदारी लेते हैं — परिवार, टीम, पड़ोस, किसी का अस्पताल। इनकी सोच अक्सर "मैं क्या कर सकता हूँ" पर रहती है, "मुझे क्या मिलेगा" पर नहीं।',
    limit: 'यह नहीं बताता कि परिवार कैसा रहेगा — केवल कि उसे दूसरों का ख़याल रखना आता है।',
  },
  7: {
    title: 'सात — अंतर्दृष्टि और एकांत',
    keyword: 'गहराई, जिज्ञासा',
    text: 'यह संख्या उन लोगों की है जो ज़्यादातर सवाल पूछते हैं। उन्हें तुरंत जवाब नहीं चाहिए, सोचने का समय चाहिए। अकेले समय इनके लिए आराम है, नुक़सान नहीं।',
    limit: 'यह नहीं बताता कि भविष्य क्या है — केवल कि ये प्रश्न पूछते हैं और जल्दबाजी नहीं करते।',
  },
  8: {
    title: 'आठ — मूल्य और प्राप्ति',
    keyword: 'पैसा, व्यवस्था',
    text: 'यह संख्या उन लोगों की है जो व्यवस्था, पैसा और सामग्री से जुड़े होते हैं। बड़ा सोचना और लक्ष्य बनाना इनकी आदत है। हालांकि ये अक्सर दूसरों के पैसे और बाहरी ताकतों से भी जुड़े महसूस करते हैं।',
    limit: 'यह नहीं बताता कि धन आएगा या नहीं — केवल कि उनकी सोच संसाधनों के बारे में चलती है।',
  },
  9: {
    title: 'नौ — सेवा और समर्पण',
    keyword: 'दया, आत्मा',
    text: 'यह संख्या उन लोगों की है जो दूसरों के लिए खड़े होते हैं, अक्सर बिना पूछे। कला, इंसानियत और समस्याओं को सुलझाने की प्रवृत्ति इनमें बढ़ती है।',
    limit: 'यह नहीं बताता कि उनकी मदद सफल होगी या नहीं — केवल कि वे दूसरों के लिए सोचते हैं।',
  },
  11: {
    title: 'ग्यारह — अंतर्ज्ञान',
    keyword: 'सूक्ष्म, प्रेरणा',
    text: 'यह संख्या उन लोगों की है जिन्हें कभी-कभी कोई बात बिना किसी स्रोत के महसूस होती है। यह बहुत से लोगों के साथ होता है और अक्सर कला या समझदारी से जुड़ा होता है।',
    limit: 'यह कोई अलौकिक बात नहीं है — और भविष्यवाणी नहीं भी।',
  },
  22: {
    title: 'बाईस — महान संकल्प',
    keyword: 'बड़ा निर्माण, सपना',
    text: 'यह संख्या उन लोगों की है जो बहुत बड़ा सोचते हैं — और उसमें कभी-कभी बहुत बड़ा बनते हैं। लेकिन इनके सपने ज़रूरी तौर पर व्यावहारिक नहीं होते, और इनके लिए यह ज़रूरी है कि कोई उन्हें ज़मीन पर उतारे।',
    limit: 'यह बड़े या छोटे नतीजे की भविष्यवाणी नहीं करती — केवल यह कि सोच का दायरा बड़ा है।',
  },
};

/** Chaldean-style digit-to-letter values, the standard Western numerology table. */
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const MASTER_NUMBERS = new Set([11, 22]);

/** Reduce to 1–9, keeping 11 and 22 as they are. */
function reduce(value: number): number {
  let n = Math.abs(Math.trunc(value));
  if (n === 0) return 9; // 0 means "old, complete cycle", not "nothing"

  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

/**
 * Parse a birth date into its parts.
 *
 * ── Why three formats, not one ─────────────────────────────────────────────
 *
 * `<input type="date">` is specified to hand back `YYYY-MM-DD`, and on most
 * browsers it does. It is not universal: a form that is not a date input — or a
 * date typed in by hand, or a browser with the date entry overridden — can hand
 * back `DD/MM/YYYY` or `MM/DD/YYYY` instead, and a parser that accepts only one
 * of them either refuses outright or, worse, reads `03/04/1975` as the fourth of
 * March when it was written as the third of April.
 *
 * The difference is a month of somebody's chart, silently.
 *
 * So all three are accepted, and the two-orders form is resolved by which
 * reading is a real date. `03/04/1975` is genuinely ambiguous — it is the fourth
 * of March in Britain and the third of April in America — so it is refused
 * rather than guessed at. A date that cannot be read without a coin toss should
 * be typed again, not guessed.
 *
 * ── Why the round trip ─────────────────────────────────────────────────────
 *
 * `new Date('2024-02-30')` silently becomes March 1st, which would give
 * somebody a chart for a day they were not born. Rejected instead.
 */
export function parseDate(raw: string): { year: number; month: number; day: number } | null {
  const text = raw.trim();

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  const slashed = /^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/.exec(text);

  let year: number;
  let month: number;
  let day: number;

  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (slashed) {
    const first = Number(slashed[1]);
    const second = Number(slashed[2]);
    year = Number(slashed[3]);

    // One of the two must be a month. Exactly one being a month settles it.
    // Both, or neither, means the date is ambiguous or wrong.
    const firstIsMonth = first <= 12;
    const secondIsMonth = second <= 12;

    if (firstIsMonth === secondIsMonth) {
      // Both under 13 (03/04), or one of them impossible as a day (25/12).
      return null;
    }

    if (firstIsMonth) {
      month = first;
      day = second;
    } else {
      day = first;
      month = second;
    }
  } else {
    return null;
  }

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  // Same range as the astrology engine, for the same reason: a date that parses
  // is not the same as a date somebody was born on, and a chart for one looks
  // like knowledge rather than an error.
  if (year < 1900 || year > new Date().getFullYear()) return null;

  // Round-trip check: catches 30 February and 31 April.
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

/** The date back in the one format the page writes, for showing to the visitor. */
export function formatDate(parts: { year: number; month: number; day: number }): string {
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

/**
 * The life path number: every digit of the birth date, summed and reduced.
 *
 * The one thing this site can be certain of — it is arithmetic, and the test in
 * scripts/test-numerology.py pins a known example.
 */
export function lifePath(input: BirthInput): number | null {
  const parts = parseDate(input.date);
  if (!parts) return null;

  // Day and month read as two-digit numbers rather than as separate digits.
  // This is the traditional method: 1985-12-25 is
  // 1+9+8+5 + 1+2 + 2+5 = 33 → 6. Reading it as
  // 1+9+8+5+1+2+2+5 = 33 gives the same answer here but not always, and the
  // method has to be stated rather than implied because the two disagree.
  const digits = String(parts.year).split('').map(Number);
  const monthDigits = parts.month < 10 ? [parts.month] : String(parts.month).split('').map(Number);
  const dayDigits = parts.day < 10 ? [parts.day] : String(parts.day).split('').map(Number);

  const total = [...digits, ...monthDigits, ...dayDigits].reduce((a, b) => a + b, 0);
  return reduce(total);
}

/** The birthday number: the birth date reduced on its own. */
export function birthdayNumber(input: BirthInput): number | null {
  const parts = parseDate(input.date);
  if (!parts) return null;
  return reduce(parts.day);
}

/** Every letter of a name, lower-cased, with anything non-alphabetic dropped. */
function lettersOf(name: string): string[] {
  return name.toLowerCase().split('').filter((ch) => /[a-z]/.test(ch));
}

function sumName(name: string, vowelsOnly: boolean): number | null {
  const letters = lettersOf(name);
  if (letters.length === 0) return null;

  const total = letters.reduce((sum, ch) => {
    if (vowelsOnly && !VOWELS.has(ch)) return sum;
    return sum + LETTER_VALUES[ch];
  }, 0);

  // An all-consonant name has a vowel sum of 0, which would reduce to 9 and
  // look like a real answer. None is the honest result.
  if (total === 0) return null;

  return reduce(total);
}

export function numerology(input: BirthInput): NumerologyResult | null {
  const path = lifePath(input);
  if (path === null) return null;

  const meaning = MEANINGS[path];
  if (!meaning) return null; // unreachable, but a missing meaning must not render a blank card

  return {
    lifePath: path,
    nameNumber: input.name ? sumName(input.name, false) : null,
    soulNumber: input.name ? sumName(input.name, true) : null,
    birthdayNumber: birthdayNumber(input) ?? path,
    meaning,
  };
}

/** Every number's meaning, so the page can offer a lookup table. */
export function allMeanings(): NumerologyMeaning[] {
  return Object.keys(MEANINGS).map(Number).sort((a, b) => a - b).map((n) => MEANINGS[n]);
}