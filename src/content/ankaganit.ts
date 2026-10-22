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
 * placed on the nine squares of the Lo Shu grid.
 *
 * A count of zero is shown as zero, not hidden. A zero in that grid means
 * "this digit is entirely absent from the date", which is a reading in itself,
 * and the rest of the panel — which numbers are missing, which are strong —
 * is read off these nine counts.
 *
 * ── Why all nine squares ───────────────────────────────────────────────────
 *
 * This grid was a cross of seven cells: 3, 4 and 9 on top, 1, 5 and 6 across
 * the middle, 8 below. Two of the nine digits — **2 and 7** — had no cell at
 * all, so a person born with sevens in the date could not see a single one of
 * them in the grid that exists to show them, and the line underneath ("these
 * numbers are missing from your date") was being printed next to a picture
 * that could not have held them anyway.
 *
 * The Lo Shu grid has nine squares. Every digit one to nine has one. That is
 * the whole of it.
 *
 * ── The arrangement ───────────────────────────────────────────────────────
 *
 * `LOSH_CELLS` is `[digit, row, col]` in reading order, and it is the magic
 * square itself — the same one at `loShuSquare()` — so the counts and the
 * square can never drift apart.
 */
export interface LoshCell {
  digit: number;
  row: number;
  col: number;
}

/**
 * The nine squares, in reading order — left to right, top to bottom:
 *
 *     4  9  2
 *     3  5  7
 *     8  1  6
 */
export const LOSH_CELLS: LoshCell[] = [
  { digit: 4, row: 0, col: 0 },
  { digit: 9, row: 0, col: 1 },
  { digit: 2, row: 0, col: 2 },
  { digit: 3, row: 1, col: 0 },
  { digit: 5, row: 1, col: 1 },
  { digit: 7, row: 1, col: 2 },
  { digit: 8, row: 2, col: 0 },
  { digit: 1, row: 2, col: 1 },
  { digit: 6, row: 2, col: 2 },
];

/** The three lines across and the three down, as plain arithmetic. */
export const LOSH_ROWS: { row: number; label: string }[] = [
  { row: 0, label: 'ऊपर की पंक्ति (4 · 9 · 2)' },
  { row: 1, label: 'बीच की पंक्ति (3 · 5 · 7)' },
  { row: 2, label: 'नीचे की पंक्ति (8 · 1 · 6)' },
];

export const LOSH_COLS: { col: number; label: string }[] = [
  { col: 0, label: 'बायाँ स्तंभ (4 · 3 · 8)' },
  { col: 1, label: 'बीच का स्तंभ (9 · 5 · 1)' },
  { col: 2, label: 'दायाँ स्तंभ (2 · 7 · 6)' },
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
  /** Totals of the three lines across, and of the three down. */
  rows: number[];
  cols: number[];
  total: number;
  /** Digits that never occur in the date. */
  missing: number[];
  /** Digits that occur more than once — the ones the reading gives weight to. */
  repeated: number[];
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
    losh: (() => {
      const counts = digitCounts(day, month, year);
      return {
        cells: LOSH_CELLS.map((cell) => ({ ...cell, count: counts[cell.digit] })),
        rows: [0, 1, 2].map((row) =>
          LOSH_CELLS.filter((cell) => cell.row === row).reduce(
            (sum, cell) => sum + counts[cell.digit],
            0,
          ),
        ),
        cols: [0, 1, 2].map((col) =>
          LOSH_CELLS.filter((cell) => cell.col === col).reduce(
            (sum, cell) => sum + counts[cell.digit],
            0,
          ),
        ),
        total: digits.filter((d) => d >= 1 && d <= 9).length,
        missing: absentDigits(day, month, year),
        repeated: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((digit) => counts[digit] > 1),
      };
    })(),
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
 *
 * ── Which planet each number is ────────────────────────────────────────────
 *
 * The navagraha, in their own order. This table used to run the other way —
 * the week's order, with a rishi in it:
 *
 *     old:  सूर्य चंद्र भृगु  बुध  गुरु शुक्र शनि  राहु  केतु
 *     now:  सूर्य चंद्र गुरु  राहु  बुध  शुक्र केतु  शनि  मंगल
 *
 * The owner caught it by looking at one number. Seven, which is केतु, was
 * coming out as शनि — and so was printed with शनि's obstruction and loneliness,
 * given शनि's blue sapphire and Saturday, and listed as an enemy of the ones,
 * twos, threes and fives. A Ketu number is not a bad number; it is the number
 * of the one who sees what others miss. Calling it harmful was not a matter of
 * opinion, it was the wrong planet.
 *
 * The old table also had **भृगु** standing where a graha belongs. भृगु is a
 * rishi, not a planet, and does not rule a number. Three is गुरु — बृहस्पति.
 */

export interface DevGraha {
  number: number;
  name: string;
  body: string;
  virtue: string;
  vice: string;
}

export const DEV_GRAHA: DevGraha[] = [
  { number: 1, name: 'सूर्य', body: 'सिर, आँखें, हृदय', virtue: 'नेतृत्व, आत्मबल', vice: 'अहंकार, अकेलापन' },
  { number: 2, name: 'चंद्र', body: 'मन, छाती, जल-संबंधी अंग', virtue: 'संवेदना, सहयोग', vice: 'भावुकता, देरी' },
  { number: 3, name: 'बृहस्पति', body: 'कान, यकृत, जांघ', virtue: 'ज्ञान, संतुलन, वाणी', vice: 'बिना पूछे सलाह' },
  { number: 4, name: 'राहु', body: 'त्वचा, फोड़े-फुंसी, अचानक तकलीफ़', virtue: 'अनोखी सोच, बड़ा सपना', vice: 'भ्रम, अचानक उतार-चढ़ाव' },
  { number: 5, name: 'बुध', body: 'तंत्रिका, मुख, जिह्वा', virtue: 'बुद्धि, व्यापार, लेखन', vice: 'बहुत सोचना, टालना' },
  { number: 6, name: 'शुक्र', body: 'वक्ष, वृषण, मूत्राशय', virtue: 'कला, प्रेम, संतुलन', vice: 'आराम में समय बीतना' },
  { number: 7, name: 'केतु', body: 'आँतें, सिर के रोग, त्वचा', virtue: 'साधना, गहरी दृष्टि, रोग-निवारण', vice: 'अलग होना, अधूरा छोड़ना' },
  { number: 8, name: 'शनि', body: 'हड्डियाँ, दाँत, घुटने, पैर', virtue: 'धैर्य, अनुशासन, मेहनत', vice: 'रुकावट, देर' },
  { number: 9, name: 'मंगल', body: 'रक्त, मांसपेशियाँ, मज्जा', virtue: 'साहस, ऊर्जा, नेतृत्व', vice: 'क्रोध, जल्दबाज़ी' },
];

/* ===========================================================================
 *  FRIEND AND ENEMY
 * ===========================================================================
 *
 * Which other numbers help, which hinder.
 *
 * The friendships are the graha's own — सूर्य's friends are the ones the texts
 * give सूर्य, and so on down. They are held here rather than computed, because
 * a number's friend is a question of the tradition and not of arithmetic.
 *
 * ── Friends and enemies are separate lists now ─────────────────────────────
 *
 * The enemy list used to be *derived*: everything that was not a friend was
 * called an enemy. That made every neutral number a hostile one, and it put
 * **7 in the enemy list of 1, 2, 3 and 5** — which is how the page came to
 * tell a visitor that a seven was something that stops them.
 *
 * The texts give three kinds of relationship, not two: friend, enemy, and
 * neutral. चंद्र has no enemy at all, and it now says so rather than being
 * handed four.
 */

export const ANUKOOL: Record<number, number[]> = {
  1: [2, 3, 5],
  2: [1, 4, 5],
  3: [1, 2, 9],
  4: [5, 6, 7, 8],
  5: [1, 4, 6],
  6: [4, 5, 7, 8],
  7: [4, 6, 8],
  8: [4, 5, 6, 7],
  9: [1, 2, 3],
};

export const SHATRU: Record<number, number[]> = {
  1: [6, 8],
  2: [],
  3: [5, 6],
  4: [1, 2, 9],
  5: [2],
  6: [1, 2],
  7: [1, 2],
  8: [1, 2, 9],
  9: [5],
};

export function shatruAnk(n: number): number[] {
  return SHATRU[reduce9(n)] ?? [];
}

/* ===========================================================================
 *  THE REMEDIES
 * ===========================================================================
 *
 * Stone, colour, day, date and month for each number. Tradition, gathered in one
 * place for the same reason as the rest.
 *
 * Every row is the row of the *planet* the number is, and it follows that
 * planet's own stone and day: 3 is गुरु so it is पुखराज on Thursday, 4 is
 * राहु so it is गोमेद on Saturday, 7 is केतु so it is लहसुनिया on Tuesday, 8
 * is शनि so it is नीलम on Saturday, 9 is मंगल so it is मूंगा on Tuesday.
 *
 * This table used to follow the old week-order numbers, and so gave seven —
 * केतु's number — शनि's blue sapphire and Saturday. A wrong planet in a
 * number's remedy row does not merely mislabel the row: it sends the visitor
 * after a stone that belongs to a different graha altogether.
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
  { number: 3, stone: 'पुखराज (येलो सैफ़ायर)', colour: 'पीला, सुनहरा', day: 'गुरुवार', month: 'मार्च, नवंबर', dates: [3, 12, 21, 30], mantra: 'बृहस्पति' },
  { number: 4, stone: 'गोमेद (हैसनेट)', colour: 'भूरा, गहरा नीला', day: 'शनिवार', month: 'अप्रैल, मई', dates: [4, 13, 22], mantra: 'राहु' },
  { number: 5, stone: 'पन्ना (एमरल्ड)', colour: 'हरा, सुनहरा', day: 'बुधवार', month: 'मई, दिसंबर', dates: [5, 14, 23], mantra: 'बुध' },
  { number: 6, stone: 'हीरा, ओपल (ऑपल)', colour: 'सफ़ेद, गुलाबी', day: 'शुक्रवार', month: 'जून, जनवरी', dates: [6, 15, 24], mantra: 'शुक्र' },
  { number: 7, stone: 'लहसुनिया (कैट्स आई)', colour: 'पीला, काला', day: 'मंगलवार', month: 'जुलाई', dates: [7, 16, 25], mantra: 'केतु' },
  { number: 8, stone: 'नीलम (ब्लू सैफ़ायर)', colour: 'काला, गहरा नीला', day: 'शनिवार', month: 'सितंबर, अप्रैल', dates: [8, 17, 26], mantra: 'शनि' },
  { number: 9, stone: 'मूंगा (कोरल)', colour: 'लाल, सुनहरा', day: 'मंगलवार', month: 'अगस्त, नवंबर', dates: [9, 18, 27], mantra: 'मंगल' },
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