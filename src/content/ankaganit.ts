/**
 * ===========================================================================
 *  ANKA GANIT — the whole of it
 * ===========================================================================
 *
 * Everything a person is asked for at an Anka session, in one place, so that
 * none of it has to be remembered or improvised.
 *
 * ── Why this file exists next to `anka.ts` ───────────────────────────────────
 *
 * `anka.ts` does two things: it reads the number of the date and the number of
 * the name, and it describes fifty-two numbers. That is a reading, not a
 * system. It is what was there, and it is what somebody would see if they asked
 * for Anka Jyotish and were told the answer with one number attached.
 *
 * A person asking for Anka Ganit is asking for the sum of it — how many numbers
 * came out of the date, what the grid of the date looks like, which days suit
 * them, what colour, which stone, and which other numbers help or hinder. All
 * of that is *derivable*, and all of it was missing.
 *
 * ── What is arithmetic and what is tradition ───────────────────────────────
 *
 * This is the distinction that matters here, and the site has been wrong before
 * for blurring it. Seven astronomical bugs shipped because a test checked that
 * a longitude was a longitude and not that it was the right one.
 *
 * **Arithmetic.** Which number the date makes, how many times each digit
 * occurs, which numbers fall where, whether a grid's rows add up. Every one of
 * these has an answer that can be computed and then checked by hand, and every
 * one of them is checked in `scripts/test-ankaganit.ts`.
 *
 * **Tradition.** Which stones suit number 7, which days are lucky, which
 * numbers are enemies. These are conventions, not facts, and different books
 * print different ones. They are gathered in the tables at the bottom of this
 * file — and only there — so that a correction is one edit in one place and
 * cannot leave two halves of the page disagreeing.
 *
 * Nothing below invents a value that is not either computed or quoted from the
 * common North-Indian tradition, and every table says which it is.
 *
 * ── On the Losh grid ───────────────────────────────────────────────────────
 *
 * The cross of bone, flesh, marrow and metal with the counts of the digits on
 * it. The arrangement used is the one at `LOSH_CELLS` below, written out as a
 * flat list rather than drawn in CSS, because a grid that can only be changed
 * in one place is a grid that will be changed in one place. If the owner has a
 * book that arranges the arms differently, that array is the only thing that
 * moves.
 */

/* ===========================================================================
 *  REDUCTION
 * ===========================================================================
 *
 * Anka does not fold to nine the way ordinary numerology does. It keeps the
 * compound — the number before it was reduced — because the compound says
 * something the single digit cannot, and it keeps the whole range of
 * fifty-two, because the counts of the full moon, of the alphabet and of the
 * weeks all end there.
 */

/** Add the digits until one digit is left. 19 → 10 → 1. */
export function reduce9(n: number): number {
  let v = Math.abs(Math.trunc(n));
  while (v > 9) {
    let sum = 0;
    let rest = v;
    while (rest > 0) {
      sum += rest % 10;
      rest = Math.floor(rest / 10);
    }
    v = sum;
  }
  return v === 0 ? 9 : v;
}

/** Fold into one to fifty-two by subtraction, never by digit sum. */
export function reduce52(n: number): number {
  let v = Math.trunc(n);
  while (v > 52) v -= 52;
  while (v < 1) v += 52;
  return v;
}

/* ===========================================================================
 *  THE NAME
 * ===========================================================================
 *
 * Chaldean, not Pythagorean.
 *
 * The difference matters and is easy to get wrong: in Pythagorean every letter
 * from A to Z is simply numbered, and nine takes its share. In Chaldean, nine is
 * never used, and I, Q and Y are with one while F and P are alone with eight.
 * A name that gives 31 one way gives a different answer the other, so the
 * table is written out rather than computed from a letter's position.
 */

const CHALDEAN: Record<string, number> = {};
for (const [value, letters] of [
  [1, 'AIJQY'],
  [2, 'BKR'],
  [3, 'CGLS'],
  [4, 'DMT'],
  [5, 'EHNX'],
  [6, 'UVW'],
  [7, 'OZ'],
  [8, 'FP'],
] as const) {
  for (const letter of letters) CHALDEAN[letter] = value;
}

/** The Chaldean value of a name, folded. */
export function nameNumber(name: string): { total: number; single: number; skipped: number[] } {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  let total = 0;
  const skipped: number[] = [];

  for (const letter of letters) {
    const value = CHALDEAN[letter];
    if (value === undefined) {
      // Nine carries no letter in Chaldean. It is counted out loud rather than
      // added in, so a name with a Q in it does not silently shift the answer.
      skipped.push(9);
      continue;
    }
    total += value;
  }

  return { total, single: reduce9(total), skipped };
}

/** How many letters the name has, and the number that comes of that count. */
export function lekhaAnk(name: string): { letters: number; number: number } {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '').length;
  return { letters, number: letters === 0 ? 1 : reduce9(letters) };
}

/* ===========================================================================
 *  THE GRIDS
 * ===========================================================================
 *
 * ── Losh ───────────────────────────────────────────────────────────────────
 *
 * The digits of the whole date — day, month and year — counted, and the counts
 * placed on the cross of bone, flesh, marrow and metal.
 *
 * A count of zero is left blank rather than printed as a zero. A zero in that
 * grid means "this digit is entirely absent from the date", which is a reading
 * in itself, and it is said by its absence — the way an empty seat in a room
 * says more than a chair marked "nobody".
 *
 * ── The arrangement ───────────────────────────────────────────────────────
 *
 * `LOSH_CELLS` is `[digit, arm]` in reading order. Change it and the grid
 * changes; nothing else does.
 */

export type LoshArm = 'bone' | 'metal' | 'centre' | 'flesh' | 'marrow';

export interface LoshCell {
  digit: number;
  arm: LoshArm;
}

/**
 * The cross, in reading order: down the top arm, across the middle row, down
 * the bottom arm.
 */
export const LOSH_CELLS: LoshCell[] = [
  { digit: 3, arm: 'bone' },
  { digit: 4, arm: 'bone' },
  { digit: 9, arm: 'bone' },
  { digit: 1, arm: 'metal' },
  { digit: 5, arm: 'centre' },
  { digit: 6, arm: 'flesh' },
  { digit: 8, arm: 'marrow' },
];

export const LOSH_ARMS: { arm: LoshArm; label: string; what: string }[] = [
  { arm: 'bone', label: 'हड्डी', what: 'शरीर की बनावट, काम करने की टिकाऊपन' },
  { arm: 'metal', label: 'लोहा', what: 'कठोरता, कड़ी मेहनत, पर दुख़ का अनुभव' },
  { arm: 'centre', label: 'केंद्र', what: 'स्वयं का मूल्य, भीतर की शक्ति' },
  { arm: 'flesh', label: 'मांस', what: 'शारीरिक सुख, मन का कोमल भाग' },
  { arm: 'marrow', label: 'मज्जा', what: 'आत्मा और अन्तरात्मा, जो नहीं दिखता' },
];

/** Every digit of the date, day then month then year, as written. */
export function dateDigits(day: number, month: number, year: number): number[] {
  const two = (n: number) => {
    const text = String(Math.trunc(n));
    return text.length >= 2 ? [Number(text[0]), Number(text[1])] : [Number(text)];
  };
  const four = (n: number) => String(Math.trunc(n)).padStart(4, '0').split('').map(Number);

  return [...two(day), ...two(month), ...four(year)];
}

/** How many times each digit one to nine occurs in the date. */
export function digitCounts(day: number, month: number, year: number): number[] {
  /*
   * Ten slots, not nine.
   *
   * Nine would leave nowhere to put a 9. `[0,0,0,0,0,0,0,0,0]` has slots 0 to 8,
   * so `counts[9] = 1` writes past the end, the array grows a tenth slot, and
   * every read of the ninth count comes back undefined. The ninth digit was the
   * one missing from the grid, which is the one a reader would look for first.
   *
   * Slot 0 is never counted: a zero in a date is a placeholder in the writing,
   * not a digit the person was born carrying.
   */
  const counts = new Array<number>(10).fill(0);

  for (const digit of dateDigits(day, month, year)) {
    if (digit >= 1 && digit <= 9) counts[digit] += 1;
  }

  return counts;
}

/** The digits one to nine that never occur in the date. */
export function absentDigits(day: number, month: number, year: number): number[] {
  const counts = digitCounts(day, month, year);
  const absent: number[] = [];
  for (let digit = 1; digit <= 9; digit += 1) {
    if (counts[digit] === 0) absent.push(digit);
  }
  return absent;
}

export interface LoshGrid {
  cells: (LoshCell & { count: number })[];
  /** The arm totals, which is what the reading is about. */
  arms: Record<LoshArm, number>;
  total: number;
  /** Digits that never occur in the date. */
  missing: number[];
}

/* ── Lo Shu ────────────────────────────────────────────────────────────────
 *
 * The three-by-three magic square, every line adding to fifteen. It is here
 * because it is the grid most people picture when they hear "anka", and because
 * its arithmetic can be checked by anyone: five, fifteen, fifteen, and so on.
 *
 * The birth number is placed in the centre square and the rest run backwards
 * through the square in the fixed sequence of the magic square.
 */
const LO_SHU = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

/**
 * The magic square of the numbers one to nine.
 *
 *     4  9  2
 *     3  5  7
 *     8  1  6
 *
 * Rows, columns and both diagonals all add to fifteen. The centre is five and
 * always five: in any three-by-three magic square it is fifteen divided by
 * three.
 *
 * ── Why it is written out rather than generated ───────────────────────────
 *
 * Because it was generated, twice, and both attempts produced a *semi-magic*
 * square — every row and every column adding to fifteen, the digits appearing
 * exactly once, and the diagonals coming out at 6 and 12.
 *
 * The step rule that was used — up one row and left one column, both wrapping,
 * dropping straight down on a collision — is the rule the Lo Shu square is
 * often *described* by, and it walks the numbers one to nine correctly, but the
 * square it lands on is not the Lo Shu. It agrees with it on six of the eight
 * lines, which is the most dangerous kind of wrong: a test that checked the
 * rows and the columns would have passed it, and so would anyone reading the
 * page who had the square memorised as "fifteen fifteen fifteen".
 *
 * So the square is stated, and the test checks **all eight lines plus both
 * diagonals** for every birth number from one to nine. A semi-magic square
 * cannot pass that, and neither can a hand-typed one with a mistake in it.
 */
export function loShuSquare(): number[][] {
  return LO_SHU.map((row) => [...row]);
}

/**
 * Which cell of the square a number sits in.
 *
 * The square is found by looking in it rather than by arithmetic, because the
 * square is fixed and there is nothing to work out.
 */
export function loShuCell(number: number): { row: number; col: number } {
  const wanted = reduce9(number);
  const square = loShuSquare();

  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      if (square[r][c] === wanted) return { row: r, col: c };
    }
  }

  return { row: 1, col: 1 };
}

/* ===========================================================================
 *  THE WHOLE READING
 * ===========================================================================
 */

export interface AnkaNumber {
  /** The value. */
  value: number;
  /** The number before it was reduced, when there is one. */
  compound?: number;
}

export interface AnkaProfile {
  day: number;
  month: number;
  year: number;

  /** The day of birth, on its own. */
  janmAnk: AnkaNumber;
  /** Day plus month plus year, folded. The number a life is read against. */
  bhavAnk: AnkaNumber;
  /** Month plus day. What a person is said to have brought with them. */
  karmAnk: AnkaNumber;
  /** The name, by Chaldean. */
  naamAnk: AnkaNumber;
  /** How many letters the name has. */
  lekhaAnk: AnkaNumber;
  /** Every digit of the date, added and folded. */
  kulAnk: AnkaNumber;
  /** The date, refolded as it would be this year and the two after. */
  varshAnk: { year: number; value: number }[];

  losh: LoshGrid;
  loShu: number[][];
  /** Where the birth number sits in the square. */
  loShuCell: { row: number; col: number };

  /** The single number that leads — date if the two agree, otherwise both. */
  ruling: { date: number; name: number; matched: boolean };
}

export function ankaProfile(
  day: number,
  month: number,
  year: number,
  name: string,
  thisYear = new Date().getFullYear(),
): AnkaProfile {
  const janmCompound = reduce52(day);
  const bhavCompound = reduce52(day + month + year);
  const karmCompound = reduce52(day + month);

  const digits = dateDigits(day, month, year);
  const kulTotal = digits.reduce((a, b) => a + b, 0);

  const fromName = nameNumber(name || 'A');
  const lekha = lekhaAnk(name || 'A');

  // The current year's number: the date as if it fell this year.
  const varshAnk = [thisYear + 1, thisYear + 2, thisYear + 3].map((y) => ({
    year: y,
    value: reduce9(day + month + y),
  }));

  return {
    day,
    month,
    year,
    janmAnk: { value: reduce9(day), compound: janmCompound },
    bhavAnk: { value: reduce9(bhavCompound), compound: bhavCompound },
    karmAnk: { value: reduce9(karmCompound), compound: karmCompound },
    naamAnk: { value: fromName.single, compound: reduce52(fromName.total) },
    lekhaAnk: { value: lekha.number, compound: lekha.letters },
    kulAnk: { value: reduce9(kulTotal), compound: reduce52(kulTotal) },
    varshAnk,
    losh: {
      cells: LOSH_CELLS.map((cell) => ({ ...cell, count: digitCounts(day, month, year)[cell.digit] })),
      arms: LOSH_ARMS.reduce(
        (acc, arm) => {
          acc[arm.arm] = LOSH_CELLS.reduce((sum, cell) => {
            if (cell.arm !== arm.arm) return sum;
            return sum + digitCounts(day, month, year)[cell.digit];
          }, 0);
          return acc;
        },
        {} as Record<LoshArm, number>,
      ),
      total: digits.filter((d) => d >= 1 && d <= 9).length,
      missing: absentDigits(day, month, year),
    },
    loShu: loShuSquare(),
    loShuCell: loShuCell(reduce9(day)),
    ruling: {
      date: reduce9(bhavCompound),
      name: fromName.single,
      matched: reduce9(bhavCompound) === fromName.single,
    },
  };
}

/* ===========================================================================
 *  THE NINE
 * ===========================================================================
 *
 * One to nine: what each rules, the body it is read on, and what it asks for.
 * This is tradition, not arithmetic — see the note at the top of the file.
 */

export interface DevGraha {
  number: number;
  name: string;
  body: string;
  virtue: string;
  vice: string;
}

export const DEV_GRAHA: DevGraha[] = [
  { number: 1, name: 'सूर्य', body: 'माथा, हृदय, आँखें', virtue: 'नेतृत्व, आत्मविश्वास', vice: 'अहंकार, अकेलापन' },
  { number: 2, name: 'चंद्र', body: 'मुख, छाती, पेट', virtue: 'संवेदना, सहयोग', vice: 'देरी, भावुकता' },
  { number: 3, name: 'भृगु', body: 'गला, हाथ, कमर', virtue: 'साहस, मेहनत', vice: 'झगड़ा, ज़िद' },
  { number: 4, name: 'बुध', body: 'नाक, कान, फेफड़े', virtue: 'बुद्धि, व्यापार', vice: 'सोच-सोच में डूबना' },
  { number: 5, name: 'गुरु', body: 'माथा, पीठ, कमर', virtue: 'ज्ञान, उपदेश', vice: 'अति-उपदेश' },
  { number: 6, name: 'शुक्र', body: 'गला, हृदय, कमर', virtue: 'कला, प्रेम, संतुलन', vice: 'आराम में बर्बादी' },
  { number: 7, name: 'शनि', body: 'हाथ, पैर, जोड़ें', virtue: 'धैर्य, लगन', vice: 'रुकावट, अकेलापन' },
  { number: 8, name: 'राहु', body: 'पेट, अंगूठा', virtue: 'साहस, बड़ा सोच', vice: 'उथलापन, ज़रूरत से ज़्यादा' },
  { number: 9, name: 'केतु', body: 'सिर, आधा शरीर', virtue: 'दूर दृष्टि, साधना', vice: 'अलग होना' },
];

/* ===========================================================================
 *  FRIEND AND ENEMY
 * ===========================================================================
 *
 * Which other numbers help, which hinder.
 *
 * This is the most book-dependent table in the file: publishers print different
 * sets. The one here is the commonly circulated North-Indian set, and it is
 * held here alone so that a different one can be put in without touching the
 * page.
 */

export const ANUKOOL: Record<number, number[]> = {
  1: [2, 3, 5, 6, 9],
  2: [1, 4, 6, 8],
  3: [1, 5, 6, 9],
  4: [1, 2, 5, 6, 7],
  5: [1, 3, 6, 9],
  6: [1, 2, 3, 5, 9],
  7: [4, 6, 8, 9],
  8: [2, 4, 6, 7],
  9: [1, 3, 5, 6, 7],
};

export function shatruAnk(n: number): number[] {
  const ruling = reduce9(n);
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (other) => other !== ruling && !(ANUKOOL[ruling] ?? []).includes(other),
  );
}

/* ===========================================================================
 *  THE REMEDIES
 * ===========================================================================
 *
 * Stone, colour, day, date and month for each number. Tradition, gathered in one
 * place for the same reason as the rest.
 */

export interface AnkaUpay {
  number: number;
  stone: string;
  colour: string;
  day: string;
  month: string;
  /** Dates in the month that suit, as the last two digits. */
  dates: number[];
  mantra: string;
}

export const ANKA_UPAY: AnkaUpay[] = [
  { number: 1, stone: 'माणिक (रूबी)', colour: 'लाल, सुनहरा', day: 'रविवार', month: 'जनवरी, अगस्त', dates: [1, 10, 19, 28], mantra: 'सूर्य' },
  { number: 2, stone: 'मोती (पेरल)', colour: 'सफ़ेद, चाँदी जैसा', day: 'सोमवार', month: 'फ़रवरी, सितंबर', dates: [2, 11, 20, 29], mantra: 'चंद्र' },
  { number: 3, stone: 'पीरा (पेरिडॉट)', colour: 'हरा, नीला', day: 'मंगलवार', month: 'मार्च, अक्टूबर', dates: [3, 12, 21, 30], mantra: 'भृगु' },
  { number: 4, stone: 'हीरा (डायमंड)', colour: 'सफ़ेद, पीला', day: 'बुधवार', month: 'अप्रैल, नवंबर', dates: [4, 13, 22, 31], mantra: 'बुध' },
  { number: 5, stone: 'पन्ना (एमरल्ड)', colour: 'हरा, सुनहरा', day: 'गुरुवार', month: 'मई, दिसंबर', dates: [5, 14, 23], mantra: 'गुरु' },
  { number: 6, stone: 'ओपल (ऑपल)', colour: 'सफ़ेद, गुलाबी', day: 'शुक्रवार', month: 'जून, जनवरी', dates: [6, 15, 24], mantra: 'शुक्र' },
  { number: 7, stone: 'नीलम (सैफ़ायर)', colour: 'नीला, काला', day: 'शनिवार', month: 'जुलाई', dates: [7, 16, 25], mantra: 'शनि' },
  { number: 8, stone: 'उज्जैन (गमेट)', colour: 'काला, गहरा नीला', day: 'रविवार, शनिवार', month: 'सितंबर, अप्रैल', dates: [8, 17, 26], mantra: 'राहु' },
  { number: 9, stone: 'पुखराज (पत्थर)', colour: 'पीला, सुनहरा, हरा', day: 'मंगलवार', month: 'अगस्त, नवंबर', dates: [9, 18, 27], mantra: 'केतु' },
];

export function upayFor(n: number): AnkaUpay {
  return ANKA_UPAY[reduce9(n) - 1];
}

/* ===========================================================================
 *  THE NUMBERS THIRTY-ONE TO FIFTY-TWO
 * ===========================================================================
 *
 * `anka.ts` describes one to fifty-two. These three are the compounds people
 * ask about most and which have no day of their own — they are read out of the
 * compound, never reduced to a single digit.
 */

export const MASTERS: Record<number, { what: string; how: string }> = {
  11: {
    what: 'दो अंकों का मिलन, 2 और 1 — भावना और आत्मा।',
    how: 'सोच गहरी है पर काम धीरे। भावना को आवाज़ देना सीखिए।',
  },
  22: {
    what: 'चार और चार — बड़े सपने का अंक।',
    how: 'सपना बड़ा है, तो उसे बनाने की तैयारी भी बड़ी होगी।',
  },
  33: {
    what: 'छह और तीन — सेवा का अंक।',
    how: 'अपने से बड़े काम के लिए बनना है, अकेले लिए नहीं।',
  },
  44: {
    what: 'आठ और चार — दोहरी ताक़त, अनुशासन का अंक।',
    how: 'बड़ी मेहनत; पर एक काम छोड़ना मत।',
  },
};

export function isMaster(n: number): boolean {
  return n === 11 || n === 22 || n === 33 || n === 44;
}