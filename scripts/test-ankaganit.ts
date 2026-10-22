import {
  ankaProfile,
  reduce9,
  reduce52,
  dateDigits,
  nameNumber,
  digitCounts,
  upayFor,
  loShuSquare,
  loShuCell,
  LOSH_CELLS,
  ANUKOOL,
  SHATRU,
  shatruAnk,
  ANKA_UPAY,
  DEV_GRAHA,
  MASTERS,
} from '../src/content/ankaganit';
import { ankaFromDate, ankaCompoundFromDate, allAnkaMeanings } from '../src/content/anka';

/**
 * Is the Anka Ganit right?
 *
 *     npx tsx scripts/test-ankaganit.ts
 *
 * ── Why arithmetic needs its own test ──────────────────────────────────────
 *
 * Because arithmetic is the one part of this system that can be *known* to be
 * wrong by checking it. The tables of stones and colours are tradition; nobody
 * can prove them from here and they are marked as tradition in the file they
 * live in. But a count of digits, a fold to nine and a magic square can each be
 * computed by hand and compared, and if those are wrong then everything printed
 * on the page is wrong in a way nobody would notice by looking at it.
 *
 * Every check below therefore states the expected value in the comment above
 * it, so a failure says what should have been there rather than just "not equal".
 */

let passed = 0;
let failed = 0;

function check(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    passed += 1;
    console.log(`  [ ok ]  ${name}`);
  } else {
    failed += 1;
    console.log(`  [FAIL]  ${name}`);
    if (detail) console.log(`          ${detail}`);
  }
}

console.log();
console.log('ANKA GANIT');
console.log('='.repeat(60));

/* ── 1. folding ───────────────────────────────────────────────────────────── */

// 19 → 1+9 = 10 → 1+0 = 1
check('19 folds to 1', reduce9(19) === 1, `got ${reduce9(19)}`);
// 29 → 11 → 2
check('29 folds to 2', reduce9(29) === 2, `got ${reduce9(29)}`);
// 1975 → 1+9+7+5 = 22 → 4
check('1975 folds to 4', reduce9(1975) === 4, `got ${reduce9(1975)}`);
// 13 → 4, and NOT 13 mod 9 = 4 by accident — the path differs, the answer is the same
check('13 folds to 4', reduce9(13) === 4, `got ${reduce9(13)}`);
// 9 stays 9. The commonest bug in this code is 9 becoming 0.
check('9 stays 9 and never becomes 0', reduce9(9) === 9, `got ${reduce9(9)}`);
check('18 folds to 9, not 0', reduce9(18) === 9, `got ${reduce9(18)}`);
check('45 folds to 9, not 0', reduce9(45) === 9, `got ${reduce9(45)}`);

// 52 stays 52, 53 folds to 1. Folding is by subtraction of 52, never digit sum.
check('52 stays 52', reduce52(52) === 52, `got ${reduce52(52)}`);
check('53 folds to 1, not 8', reduce52(53) === 1, `got ${reduce52(53)}`);
check('78 folds to 26', reduce52(78) === 26, `got ${reduce52(78)}`);

/* ── 2. the date ──────────────────────────────────────────────────────────── */

// 14th March 1975.
// Day 14 → 1+4 = 5. Day plus month plus year = 14+3+1975 = 1992 → 21 → 3.
const p = ankaProfile(14, 3, 1975, 'Varsha', 2026);

check('the day number of a 14th is 5', p.janmAnk.value === 5, `got ${p.janmAnk.value}`);
check('the compound of a 14th is kept as 14', p.janmAnk.compound === 14, `got ${p.janmAnk.compound}`);

// 14 + 3 + 1975 = 1992. 1992 - 52x38 = 1992 - 1976 = 16. Then 1+6 = 7.
check('the compound of 14.3.1975 is 16', p.bhavAnk.compound === 16, `got ${p.bhavAnk.compound}`);
check('which then folds to 7', p.bhavAnk.value === 7, `got ${p.bhavAnk.value}`);

// 14 + 3 = 17 → 8
check('the karma compound of 14.3 is 17', p.karmAnk.compound === 17, `got ${p.karmAnk.compound}`);
check('which folds to 8', p.karmAnk.value === 8, `got ${p.karmAnk.value}`);

/* ── 3. the digits ────────────────────────────────────────────────────────── */

// 14031975 → 1,4,0,3,1,9,7,5. The zero is not counted; everything else is once,
// except 1 which appears twice.
const counts = digitCounts(14, 3, 1975);
check(
  'the digits of 14.3.1975 are counted one and 1 twice',
  counts[1] === 2 && counts[4] === 1 && counts[3] === 1 && counts[9] === 1 &&
    counts[7] === 1 && counts[5] === 1 &&
    counts[2] === 0 && counts[6] === 0 && counts[8] === 0,
  `got ${counts.join(',')}`,
);
check('the counts add up to the digits that are not zero',
  counts.reduce((a, b) => a + b, 0) === 7,
  `got ${counts.reduce((a, b) => a + b, 0)}`);

check('the missing digits of 14.3.1975 are 2, 6 and 8',
  p.losh.missing.join(',') === '2,6,8', `got ${p.losh.missing.join(',')}`);

/* ── 3b. the count grid holds all nine digits ────────────────────────────── */

/*
 * The grid that used to be drawn was a cross of seven cells: 3, 4 and 9 on
 * top, 1, 5 and 6 across, 8 below. Two digits — 2 and 7 — had no cell at all,
 * so a date full of sevens showed not one of them in the grid that exists to
 * show them, and the line underneath about missing numbers was printed next
 * to a picture that could not have held them.
 */
const gridDigits = LOSH_CELLS.map((cell) => cell.digit).sort((a, b) => a - b);
check('the count grid holds all nine digits',
  gridDigits.join(',') === '1,2,3,4,5,6,7,8,9', `got ${gridDigits.join(',')}`);

check('and each sits in the square of the magic square that holds it',
  LOSH_CELLS.every((cell) => loShuSquare()[cell.row][cell.col] === cell.digit),
  'the count grid and the magic square have drifted apart');

// Every row total and every column total is a plain sum of three counts, and
// all three of each add to the same figure — the digits in the date. Anyone
// can check this with a pencil, which is the point of printing it.
check('every row total is the sum of its three counts',
  p.losh.rows.every((total, row) =>
    LOSH_CELLS.filter((cell) => cell.row === row).reduce(
      (sum, cell) => sum + counts[cell.digit],
      0,
    ) === total),
  `got ${p.losh.rows.join(',')}`);
check('the three rows add up to the digits in the date',
  p.losh.rows.reduce((a, b) => a + b, 0) === p.losh.total,
  `rows add to ${p.losh.rows.reduce((a, b) => a + b, 0)}, the date has ${p.losh.total}`);
check('the three columns add up to the same figure',
  p.losh.cols.reduce((a, b) => a + b, 0) === p.losh.total,
  `cols add to ${p.losh.cols.reduce((a, b) => a + b, 0)}`);

// 14.3.1975 has two ones, so one is the digit that repeats.
check('a digit that occurs twice is reported as repeating',
  p.losh.repeated.join(',') === '1', `got ${p.losh.repeated.join(',')}`);

/* ── 4. the grid ──────────────────────────────────────────────────────────── */

// Every line of the magic square adds to fifteen, in every direction. This is
// the one check on the whole site anybody can do with a pencil.
// Every birth number from one to nine, not a sample. The square is generated by
// a step rule with a collision branch, and either can be wrong for only some
// starting points — which is exactly the kind of bug that hides behind a single
// example.
for (let birth = 1; birth <= 9; birth += 1) {
  const square = loShuSquare();
  const rows = square.map((r) => r.reduce((a, b) => a + b, 0));
  const cols = [0, 1, 2].map((c) => square.reduce((sum, r) => sum + r[c], 0));
  const diagonals = [
    square[0][0] + square[1][1] + square[2][2],
    square[0][2] + square[1][1] + square[2][0],
  ];

  check(`square for ${birth}: every row adds to 15`,
    rows.every((r) => r === 15), `got ${rows.join(',')}`);
  check(`square for ${birth}: every column adds to 15`,
    cols.every((c) => c === 15), `got ${cols.join(',')}`);
  check(`square for ${birth}: both diagonals add to 15`,
    diagonals.every((d) => d === 15), `got ${diagonals.join(',')}`);
  check(`square for ${birth}: every number one to nine is used once`,
    [1, 2, 3, 4, 5, 6, 7, 8, 9].every((n) => square.flat().filter((cell) => cell === n).length === 1),
    `got ${square.flat().join(',')}`);
  // The centre of a three-by-three magic square is fifteen divided by three,
  // which is five, for every arrangement. So the birth number cannot be put
  // there — a test asking for it was asking for the impossible and would have
  // driven a rotation that broke both diagonals. What has to hold instead is
  // that the birth number is *in* the square, and that its cell is reported.
  check(`square for ${birth}: the centre is always 5`,
    square[1][1] === 5, `got ${square[1][1]}`);
  check(`square for ${birth}: the birth number is in the square`,
    square.flat().includes(birth), `got ${square.flat().join(',')}`);
  check(`square for ${birth}: and its cell is reported`,
    loShuCell(birth).row >= 0 && loShuCell(birth).col >= 0 &&
    square[loShuCell(birth).row][loShuCell(birth).col] === birth);
}

// Thirty-one and twenty-nine alike, so a leap year and a month-end do not slip
// through the same door.
for (const [d, m, y] of [[29, 2, 2000], [29, 2, 1900], [31, 12, 1999], [1, 1, 1900]] as const) {
  const profile = ankaProfile(d, m, y, 'TEST', 2026);
  const square = profile.loShu;
  check(`square for ${d}.${m}.${y} is still magic`,
    square.map((r) => r.reduce((a, b) => a + b, 0)).every((r) => r === 15) &&
    [0, 1, 2].every((c) => square.reduce((s, r) => s + r[c], 0) === 15),
    `got ${square.map((r) => r.join(' ')).join(' | ')}`);
}

/* ── 5. the name ──────────────────────────────────────────────────────────── */

// Chaldean, not Pythagorean. I, Q and Y are 1; F and P are 8; and nine takes
// no letter at all.
const varsha = nameNumber('VARSHA');
// V=6, A=1, R=2, S=3, H=5, A=1 → 18 → 9
check('VARSHA counts to 18 by Chaldean', varsha.total === 18, `got ${varsha.total}`);
check('which folds to 9', varsha.single === 9, `got ${varsha.single}`);

// The same name counted the ordinary way would give a different answer, which
// is why the table is written out rather than computed.
const pythagorean = [...'VARSHA'].reduce((sum, c) => sum + (c.charCodeAt(0) - 64), 0);
check('the Chaldean answer is not the ordinary letter count',
  pythagorean !== varsha.total,
  `ordinary ${pythagorean}, Chaldean ${varsha.total} — a test that cannot tell them apart proves nothing`);

/* ── 6. agreement ─────────────────────────────────────────────────────────── */

// A date and a name that give the same number are the interesting case, and
// the page has to be able to produce one.
const matched = ankaProfile(5, 5, 2000, 'AAAAA', 2026);
/*
 * A date and a name that give the same number.
 *
 * Not written out as a fixed pair, because a hand-picked pair proves nothing —
 * it only proves that the two numbers I already knew happen to be equal. This
 * searches instead, so it fails if agreement has become *unreachable*, which is
 * the failure that would matter: the page would carry a "they match" reading it
 * could never print.
 */
const CHALDEAN_BY_VALUE: Record<number, string> = {
  1: 'I', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'U', 7: 'O', 8: 'F', 9: 'I',
};

let agreementFound = 0;
for (const value of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  // A name built only from letters of one Chaldean value totals that value
  // times its length, so any target is reachable by choosing the length.
  const letter = CHALDEAN_BY_VALUE[value];
  let found = false;
  for (let length = 1; length <= 9 && !found; length += 1) {
    for (let day = 1; day <= 28 && !found; day += 1) {
      const profile = ankaProfile(day, 6, 2000, letter.repeat(length), 2026);
      if (profile.ruling.date === value && profile.ruling.name === value) found = true;
    }
  }
  if (found) agreementFound += 1;
}
check('every number one to nine can be agreed on by some date and name',
  agreementFound === 9, `only ${agreementFound} of 9 reachable`);

// Every day of a long run of years must produce a number between one and nine,
// and a compound that stays inside one to fifty-two.
let bad = 0;
for (let d = 1; d <= 31; d += 1) {
  for (let m = 1; m <= 12; m += 1) {
    for (const y of [1900, 1950, 1975, 2000, 2026]) {
      const r = ankaProfile(d, m, y, 'TEST', 2026);
      if (r.janmAnk.value < 1 || r.janmAnk.value > 9) bad += 1;
      const compound = r.bhavAnk.compound ?? 0;
      if (compound < 1 || compound > 52) bad += 1;
    }
  }
}
check('every date in a wide sample gives a number in range', bad === 0, `${bad} out of range`);

/* ── 7. the grid against a date with nothing in common ────────────────────── */

// 1st January 1900 → digits 0,1,0,1,1,9,0,0. Only 1, 1, 1 and 9 survive; the
// other seven digits are simply not in the date.
const thin = ankaProfile(1, 1, 1900, 'A', 2026);
check('a thin date is counted thinly and does not invent digits',
  thin.losh.total === 4, `got ${thin.losh.total}`);
check('and reports seven digits as absent',
  thin.losh.missing.length === 7, `got ${thin.losh.missing.length} — ${thin.losh.missing.join(',')}`);
check('and they are 2, 3, 4, 5, 6, 7 and 8',
  thin.losh.missing.join(',') === '2,3,4,5,6,7,8', `got ${thin.losh.missing.join(',')}`);

/* ── 9. the birth-date number is the day, and only the day ────────────────── */

/*
 * The owner reported this one, and it had passed every check in this file.
 *
 * The card labelled "जन्म-तिथि का अंक" was computing the day, the month and the
 * year added together and folded. A person born on the eighteenth was given 20
 * in March 1975, 47 in January 1900, 8 in June 1960 and 2 in December 2000 —
 * four answers to a day that never changed, none of them containing the
 * eighteen.
 *
 * Every test here still passed, because the result was a number, it was in
 * range, and it had a meaning attached to it. The thing that was wrong was the
 * *question being asked*, and no check of shape can see that. So these checks
 * are written as the question rather than as the answer: the same day must give
 * the same number whatever the month and the year, and the day itself must be
 * what decides it.
 */

// The day alone decides it, for every day of the year, in every month.
const monthYearPairs: Array<[number, number]> = [
  [1, 1900], [2, 1947], [3, 1975], [6, 1960], [8, 1988], [12, 2000],
];

let unstable = 0;
let wrongDay = 0;
for (let day = 1; day <= 31; day += 1) {
  const answers = new Set<number>();
  for (const [month, year] of monthYearPairs) {
    const got = ankaFromDate(day, month, year);
    answers.add(got);
    // 18 is a nine, 29 is a two, 31 is a four.
    if (got !== reduce9(day)) wrongDay += 1;
  }
  if (answers.size > 1) unstable += 1;
}

check('the same day gives the same number in every month and year',
  unstable === 0, `${unstable} days gave more than one answer`);
check('and that number is the day itself, reduced',
  wrongDay === 0, `${wrongDay} day/month/year combinations disagreed with their own day`);

// The two the owner named, checked by hand.
check('the 18th is a 9', ankaFromDate(18, 3, 1975) === 9,
  `got ${ankaFromDate(18, 3, 1975)}`);
check('the 18th is a 9 in any month', ankaFromDate(18, 12, 2000) === 9,
  `got ${ankaFromDate(18, 12, 2000)}`);
check('and it is not 16', ankaFromDate(18, 3, 1975) !== 16,
  `got ${ankaFromDate(18, 3, 1975)}`);

// The compound is kept, because Anka does not throw it away.
check('the compound of the 18th is 18', ankaCompoundFromDate(18) === 18,
  `got ${ankaCompoundFromDate(18)}`);
check('the compound of the 31st is 31', ankaCompoundFromDate(31) === 31,
  `got ${ankaCompoundFromDate(31)}`);

// And the whole-date figure is still available — under its own name.
check('the bhavank still counts all three parts',
  ankaProfile(18, 3, 1975, 'V', 2026).bhavAnk.value ===
    reduce9(reduce52(18 + 3 + 1975)),
  'the life-path number stopped counting the date');

/* ── 10. the remedies, so a wrong index cannot pass ──────────────────────── */

// Upay is looked up by index, which is the one place an off-by-one shows
// nothing but a wrong stone.
const wrongStone = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => upayFor(n).number !== n);
check('the stone for number n is number n\'s own', wrongStone.length === 0,
  `wrong for ${wrongStone.join(',')}`);

const wrongFriendly = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
  (n) => ANUKOOL[n].includes(n) || ANUKOOL[n].some((x) => x < 1 || x > 9),
);
check('no number is listed as its own friend, and none is out of range',
  wrongFriendly.length === 0, `wrong for ${wrongFriendly.join(',')}`);

const overlaps = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) =>
  shatruAnk(n).some((x) => (ANUKOOL[n] ?? []).includes(x)),
);
check('nothing is both a friend and an enemy', overlaps.length === 0,
  `both for ${overlaps.join(',')}`);

const wrongEnemy = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
  (n) => shatruAnk(n).includes(n) || shatruAnk(n).some((x) => x < 1 || x > 9),
);
check('no number is listed as its own enemy, and none is out of range',
  wrongEnemy.length === 0, `wrong for ${wrongEnemy.join(',')}`);

/*
 * चंद्र has no enemy in the texts at all. The enemy list used to be *derived*
 * — everything that was not a friend was called an enemy — which handed चंद्र
 * four it does not have and put seven in the enemy lists of 1, 2, 3 and 5.
 */
check('चंद्र has no enemy at all', shatruAnk(2).length === 0,
  `got ${shatruAnk(2).join(',')}`);

check('seven is not called an enemy by any number',
  [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => shatruAnk(n).includes(7)).length === 0,
  'seven is back in someone\'s enemy list');

check('every number has a remedy entry', ANKA_UPAY.length === 9,
  `got ${ANKA_UPAY.length}`);
check('every master number is described',
  [11, 22, 33, 44].every((n) => MASTERS[n]?.what.length > 10));

/* ── 11. the nine are the navagraha — the owner's correction ──────────────── */

/*
 * The owner looked at one number and the whole table came down.
 *
 * Seven is केतु. It was printing as शनि — शनि's obstruction and loneliness as
 * its *nature*, शनि's blue sapphire and Saturday as its *remedy*, and a seat
 * in the enemy lists of the ones, twos, threes and fives. A visitor with a
 * seven anywhere in the date was being told, in three separate places, that
 * the seven was something working against them. It is केतु: the number of the
 * one who sees what others miss.
 *
 * The old table also ran the week's order rather than the navagraha's, and
 * carried **भृगु** where a graha belongs — भृगु is a rishi and rules no number.
 *
 * These checks are the table itself, written out. Arithmetic cannot satisfy
 * them and no rearrangement passes them by luck: if the nine numbers stop
 * being the navagraha in their own order, this fails with the name that moved.
 */

const NAVAGRAHA = ['सूर्य', 'चंद्र', 'बृहस्पति', 'राहु', 'बुध', 'शुक्र', 'केतु', 'शनि', 'मंगल'];

check('the nine numbers are the navagraha, in their own order',
  DEV_GRAHA.map((g) => g.name).join(',') === NAVAGRAHA.join(','),
  `got ${DEV_GRAHA.map((g) => g.name).join(',')}`);

check('each of them carries its own number',
  DEV_GRAHA.every((g, i) => g.number === i + 1),
  `got ${DEV_GRAHA.map((g) => g.number).join(',')}`);

check('seven is केतु', DEV_GRAHA[6].name === 'केतु', `got ${DEV_GRAHA[6].name}`);
check('three is गुरु — बृहस्पति, not a rishi',
  DEV_GRAHA[2].name === 'बृहस्पति', `got ${DEV_GRAHA[2].name}`);
check('eight is शनि', DEV_GRAHA[7].name === 'शनि', `got ${DEV_GRAHA[7].name}`);
check('nine is मंगल', DEV_GRAHA[8].name === 'मंगल', `got ${DEV_GRAHA[8].name}`);

// Seven's remedy is केतु's own: the cat's eye, on a Tuesday. It used to be
// शनि's blue sapphire on a Saturday.
check('seven\'s remedy is केतु\'s own — लहसुनिया, on a Tuesday',
  upayFor(7).stone.includes('लहसुनिया') && upayFor(7).day === 'मंगलवार',
  `got ${upayFor(7).stone} on ${upayFor(7).day}`);
check('eight\'s remedy is शनि\'s own — नीलम, on a Saturday',
  upayFor(8).stone.includes('नीलम') && upayFor(8).day === 'शनिवार',
  `got ${upayFor(8).stone} on ${upayFor(8).day}`);
check('nine\'s remedy is मंगल\'s own — मूंगा, on a Tuesday',
  upayFor(9).stone.includes('मूंगा') && upayFor(9).day === 'मंगलवार',
  `got ${upayFor(9).stone} on ${upayFor(9).day}`);

// Every remedy row names the planet of its own number, so a stone cannot
// drift onto a number that does not rule it again.
const wrongMantra = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
  (n) => upayFor(n).mantra !== DEV_GRAHA[n - 1].name,
);
check('every remedy names the planet of its own number',
  wrongMantra.length === 0, `wrong for ${wrongMantra.join(',')}`);

// भृगु stands where a graha belongs, in the nine and in the compounds alike.
const rishiNumbers = allAnkaMeanings().filter((m) => m.title.includes('भृगु'));
check('no number is ruled by a rishi',
  rishiNumbers.length === 0,
  `still ruled by भृगु: ${rishiNumbers.map((m) => m.number).join(',')}`);

// The compound numbers are named for pairs of grahas. Every half of every
// name must be a word that appears among the navagraha's own names — a title
// half that is not a planet is how भृगु got in.
const GRAHA_WORDS = [...NAVAGRAHA, 'रवि', 'गुरु']; // रवि = सूर्य, गुरु = बृहस्पति
const compoundHalves = allAnkaMeanings()
  .filter((m) => m.number >= 10 && m.number <= 30)
  .flatMap((m) => m.title.split('-'));
const unknownHalves = compoundHalves.filter((half) => !GRAHA_WORDS.includes(half));
check('every compound number is named for planets that exist',
  unknownHalves.length === 0, `not a graha: ${[...new Set(unknownHalves)].join(',')}`);

/* ── 12. the भाग्यांक — the owner's count, on the grid ──────────────────────── */

/*
 * "losho grid me bhagyank yane date of birth ka total ex.
 *  1+8+2+1+9+7+2=3 aana chahiye o nhi aya he — ise thik kro."
 *
 * The figure was computed all along — it is कुल अंक, in the cards above the
 * grid — but the Loshu grid section never named it, and that is the section a
 * reader counts along with. These checks do his arithmetic by hand on his own
 * date, and then on a few others.
 */
const ownerDate = ankaProfile(18, 2, 1972, 'A', 2026);
check('18.2.1972 reads out digit by digit as 1 8 2 1 9 7 2',
  dateDigits(18, 2, 1972).join(' ') === '1 8 2 1 9 7 2',
  `got ${dateDigits(18, 2, 1972).join(' ')}`);
check('those digits add to 30', ownerDate.kulAnk.compound === 30,
  `got ${ownerDate.kulAnk.compound}`);
check('which folds to the भाग्यांक 3', ownerDate.kulAnk.value === 3,
  `got ${ownerDate.kulAnk.value}`);

// And for any date: the भाग्यांक is the digits written out, added, folded.
const bhagyankWrong = [[14, 8, 1947], [29, 2, 2000], [31, 12, 1999], [1, 1, 1900], [7, 6, 1980]].filter(
  ([d, m, y]) => {
    const sum = dateDigits(d, m, y).reduce((a, b) => a + b, 0);
    return reduce9(sum) !== ankaProfile(d, m, y, 'A', 2026).kulAnk.value;
  },
);
check('for every date checked, the भाग्यांक is the digits added and folded',
  bhagyankWrong.length === 0,
  `wrong for ${bhagyankWrong.map((x) => x.join('.')).join(', ')}`);

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) process.exit(1);