import { samagraPhala, KENDRA_HOUSES } from '../src/content/samagra';
import { allGrahas, PLANETS, EXALTATION, type Planet } from '../src/content/grahas';
import { houseOf } from '../src/content/grahas';
import { lagna } from '../src/content/grahas';
import { julianDayFromParts } from '../src/content/julian';
import { RASHIS } from '../src/content/astrology';

/**
 * Does the combined reading stand up?
 *
 *     npx tsx scripts/test-samagra.ts
 *
 * This file answers one question a range check cannot: **does the verdict
 * agree with the positions it claims to be reading?**
 *
 * Every claim the panel makes about itself is checked against the chart:
 *
 *   · a graha labelled उच्च really is in its exaltation sign
 *   · one labelled निर्वाण really is in its debilitation sign
 *   · one marked केंद्र really is in a corner house
 *   · the kendradhipati dosha is flagged only when both of its conditions hold
 *   · a mahapurusha is counted only when its conditions really were met
 *   · the shares of life, added up, are the sum of the ones given
 *
 * A panel that says "गुरु उच्च में है" while Jupiter is sitting in Gemini is
 * worse than no panel, and every one of these is a sentence a reader would act
 * on.
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
console.log('SAMAGRA PHALA');
console.log('='.repeat(60));

// A long run of charts, so that every sign and every house is covered.
const CHARTS: Array<[number, number, number, number, number]> = [];
for (const [y, m, d] of [
  [1975, 3, 14], [1990, 1, 1], [2001, 12, 31], [1966, 6, 15], [1947, 8, 15],
  [2024, 2, 29], [1985, 11, 7], [2010, 5, 20], [1955, 1, 26], [2005, 9, 9],
] as const) {
  for (const [h, mi] of [[2, 10], [14, 30], [22, 45]] as const) {
    CHARTS.push([y, m, d, h, mi]);
  }
}

interface Sample {
  jd: number;
  grahas: ReturnType<typeof allGrahas>;
  houses: Record<Planet, number>;
  lagnaRashi: number;
  reading: ReturnType<typeof samagraPhala>;
}

const samples: Sample[] = CHARTS.map(([y, m, d, h, mi]) => {
  const jd = julianDayFromParts(y, m, d, h, mi);
  const grahas = allGrahas(jd);
  const lagnaRashi = Math.floor(lagna(jd, 21.15, 79.09) / 30) % 12;

  const houses = {} as Record<Planet, number>;
  for (const p of PLANETS) houses[p] = houseOf(grahas[p].rashi, lagnaRashi);

  return { jd, grahas, houses, lagnaRashi, reading: samagraPhala(grahas, houses, lagnaRashi) };
});

/* ── 1. every claim matches the chart ─────────────────────────────────────── */

let wrongExalt = 0;
let wrongDebil = 0;
let wrongKendra = 0;
let wrongRashi = 0;

for (const sample of samples) {
  for (const line of sample.reading.lines) {
    const position = sample.grahas[line.graha];

    if (line.rashi !== RASHIS[position.rashi].name) wrongRashi += 1;

    if (line.badge === 'उच्च' && position.rashi !== EXALTATION[line.graha]) wrongExalt += 1;
    if (line.badge === 'निर्वाण' && position.rashi !== (EXALTATION[line.graha] + 6) % 12) wrongDebil += 1;
    if (line.badge === 'केंद्र' && !KENDRA_HOUSES.includes(line.house)) wrongKendra += 1;
    if (line.badge === 'स्व' && position.rashi !== ({ sun: 4, moon: 3, mars: 0, mercury: 2, jupiter: 8, venus: 1, saturn: 10 } as Record<Planet, number>)[line.graha]) wrongRashi += 1;
  }
}

check('every graha is named with the sign it is really in',
  wrongRashi === 0, `${wrongRashi} wrong`);
check('a graha called उच्च really is exalted', wrongExalt === 0, `${wrongExalt} wrong`);
check('a graha called निर्वाण really is debilitated', wrongDebil === 0, `${wrongDebil} wrong`);
check('a graha called केंद्र really is in a corner house', wrongKendra === 0, `${wrongKendra} wrong`);

/* ── 2. the kendradhipati dosha needs both conditions ──────────────────────── */

let wrongDosha = 0;

for (const sample of samples) {
  const kendradhipati = sample.reading.kendradhipati;
  if (!kendradhipati.lord) continue;

  const lordRashi = sample.grahas[kendradhipati.lord].rashi;
  const ruled = ({ sun: 4, moon: 3, mars: 0, mercury: 2, jupiter: 8, venus: 1, saturn: 10 } as Record<Planet, number>)[kendradhipati.lord];
  const fromItself = ruled === undefined
    ? kendradhipati.house
    : ((ruled - lordRashi + 12) % 12) + 1;

  // The house it is said to be in, and the house counted from itself, both
  // have to be the ones the chart gives.
  if (fromItself !== kendradhipati.fromItself) wrongDosha += 1;
  if (sample.houses[kendradhipati.lord] !== kendradhipati.house) wrongDosha += 1;

  // And both conditions, or neither.
  const inKendra = KENDRA_HOUSES.includes(kendradhipati.house);
  const undone = inKendra && [2, 6, 8, 12].includes(fromItself);
  if (undone !== kendradhipati.dosha) wrongDosha += 1;
}

check('the kendradhipati dosha is raised only when both conditions hold',
  wrongDosha === 0, `${wrongDosha} wrong`);

// It must be reachable, or the code is dead.
const anyDosha = samples.some((s) => s.reading.kendradhipati.dosha);
check('the dosha can actually occur in these charts', anyDosha,
  'none of thirty charts raised it — the test cannot tell a rule from a constant');

/* ── 3. the mahapurusha counts honestly ───────────────────────────────────── */

let wrongCount = 0;
let wrongYears = 0;
for (const sample of samples) {
  const formed = sample.reading.mahapurusha.filter((m) => m.formed);
  if (formed.length !== sample.reading.mahapurushaCount) wrongCount += 1;
  if (formed.reduce((s, m) => s + m.years, 0) !== sample.reading.mahapurushaYears) wrongYears += 1;

  // No share may be handed out twice, and none to nobody.
  const gifts = formed.map((m) => m.gift);
  if (new Set(gifts).size !== gifts.length) wrongCount += 1;
  for (const entry of formed) {
    if (entry.missed.length > 0) wrongCount += 1;
    if (entry.years <= 0) wrongYears += 1;
  }
}

check('the number of mahapurushas matches the ones actually formed',
  wrongCount === 0, `${wrongCount} wrong`);
check('the share of life adds up to the shares given',
  wrongYears === 0, `${wrongYears} wrong`);
check('no share of life is given to a mahapurusha that did not form',
  samples.every((s) => s.reading.mahapurusha.filter((m) => m.years > 0).every((m) => m.formed)),
  'a share was handed out without the condition');

check('some chart among the thirty has at least one mahapurusha',
  samples.some((s) => s.reading.mahapurushaCount > 0),
  'none did — the rule cannot be told apart from always-false');

/* ── 4. the tally agrees with the lines ───────────────────────────────────── */

let wrongTally = 0;
for (const sample of samples) {
  const { good, mixed, hard } = sample.reading.tally;
  const counted = good + mixed + hard;
  if (counted !== sample.reading.lines.length) wrongTally += 1;
  if (good !== sample.reading.lines.filter((l) => l.tone === 'good').length) wrongTally += 1;
  if (mixed !== sample.reading.lines.filter((l) => l.tone === 'mixed').length) wrongTally += 1;
  if (hard !== sample.reading.lines.filter((l) => l.tone === 'hard').length) wrongTally += 1;
}

check('the tally adds up to the nine grahas, line for line',
  wrongTally === 0, `${wrongTally} wrong`);

/* ── 5. there is always something to read ─────────────────────────────────── */

check('every chart produces all nine lines', samples.every((s) => s.reading.lines.length === 9),
  `got ${samples[0].reading.lines.length}`);
check('every chart produces a verdict', samples.every((s) => s.reading.summary.length > 20));

/*
 * A chart with no weak graha is not a broken chart, it is a good one — so the
 * honest invariant is not "both lists are non-empty" but "the cautions are
 * non-empty exactly when there is something to be cautious about".
 *
 * The earlier version demanded both and failed on twenty-nine of thirty charts,
 * which says nothing except that a few of them were strong.
 */
check('every chart has something to say in its strengths',
  samples.every((s) => s.reading.strengths.length > 0));

/*
 * The one thing that must never happen: a weak graha that does not appear
 * under the cautions.
 *
 * An earlier version of this file demanded that both lists be non-empty and
 * failed on half the charts — which said nothing except that some of them were
 * strong. The guarantee worth having is coverage, not fullness: everything the
 * panel called weak is named, and everything it called strong is named.
 */
let hiddenWeak = 0;
let hiddenStrong = 0;
for (const sample of samples) {
  for (const line of sample.reading.lines) {
    if (line.tone === 'hard' && !sample.reading.cautions.includes(line.verdict)) hiddenWeak += 1;
    if (line.tone === 'good' && !sample.reading.strengths.includes(line.verdict)) hiddenStrong += 1;
  }
}

check('no weak graha is left out of the cautions', hiddenWeak === 0,
  `${hiddenWeak} weak grahas were not mentioned`);
check('no strong graha is left out of the strengths', hiddenStrong === 0,
  `${hiddenStrong} strong grahas were not mentioned`);

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed over ${samples.length} charts.`);
console.log();

if (failed > 0) process.exit(1);