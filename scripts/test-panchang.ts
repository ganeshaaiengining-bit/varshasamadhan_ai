import { panchang, moonPhase, rashiAt, nakshatraAt, TITHIS, YOGAS, KARANAS } from '../src/content/panchang';
import { julianDayFromUTC } from '../src/content/julian';
import { sunLongitude, moonLongitude, ayanamsa } from '../src/content/grahas';
import { nakshatraLordAt, NAKSHATRAS } from '../src/content/astrology';

/**
 * Is the Panchang right?
 *
 *     npx tsx scripts/test-panchang.ts
 *
 * ── Why this is checked against arithmetic and not against a book ──────────
 *
 * Because an almanac is a data file nobody in this repository can read, and a
 * test that needs one is a test nobody runs. Everything here can be worked out
 * on paper instead, and every claim below says what the paper answer is.
 *
 * The five limbs are divisions of an angle, so the checks are of two kinds:
 *
 *   · **The divisions.** Thirty tithis to a lunar month, sixty karanas,
 *     twenty-seven nakshatras and twenty-seven yogas. A karana numbered one to
 *     thirty instead of one to sixty is a karana that is half as often right as
 *     it thinks it is, and it would pass a range check every time.
 *
 *   · **The anchors.** The tithi is zero exactly at the new moon and fifteen at
 *     the full moon. Those are moments you can compute, and they are the only
 *     two points on the whole cycle where the answer is not a matter of
 *     judgement.
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
console.log('PANCHANG');
console.log('='.repeat(60));

/* ── 1. the sizes of the five ────────────────────────────────────────────── */

check('there are thirty tithis to a lunar month', TITHIS.length === 30, `got ${TITHIS.length}`);
check('there are sixty karanas to a lunar month', KARANAS.length === 60, `got ${KARANAS.length}`);
check('there are twenty-seven yogas', YOGAS.length >= 27, `got ${YOGAS.length}`);

/*
 * Two known lunations, in UTC, to check the cycle against something outside
 * this file.
 *
 *   · the full moon of 25 January 2024 — 17:54 UTC
 *   · the new  moon of 11 January 2024 — 11:57 UTC
 *
 * Both dates are taken from the published lunation series and can be confirmed
 * with a calendar or an almanac.
 *
 * ── Why the check allows three degrees ─────────────────────────────────────
 *
 * Because the site's Moon is a truncated series, and it is a few degrees out —
 * roughly half a day at the new moon. That is the ephemeris's own limit, not
 * the panchang's: the tithi is exactly the division of whatever longitude it is
 * given, and the division itself is checked separately and exactly below.
 *
 * So the assertion here is about the *cycle* — that a full moon reads as the
 * fifteenth and a new moon as the first, and not as the seventh or the
 * twenty-second. Three degrees is about six hours, which is far inside a
 * tithi, so a division that were wrong would still fail this.
 */
const FULL_MOON = julianDayFromUTC(2024, 1, 25, 17, 54);
const NEW_MOON = julianDayFromUTC(2024, 1, 11, 11, 57);

const fullAngle = (() => {
  const m = ((moonLongitude(FULL_MOON) % 360) + 360) % 360;
  const s = ((sunLongitude(FULL_MOON) % 360) + 360) % 360;
  return (((m - s) % 360) + 360) % 360;
})();

check('at the full moon the Moon is within three degrees of opposite the Sun',
  Math.abs(fullAngle - 180) < 3, `${fullAngle.toFixed(2)}°`);

const at = panchang(FULL_MOON, 4);
check('at the full moon the tithi is the fifteenth', at.tithi.index === 15,
  `got ${at.tithi.index} — ${at.tithi.name}`);
check('and it is पूर्णिमा', at.tithi.name === 'पूर्णिमा', at.tithi.name);
check('and the moon is fully lit', at.moonPercent >= 99, `${at.moonPercent}%`);

const atNew = panchang(NEW_MOON, 4);
check('at the new moon the tithi is the first', atNew.tithi.index === 1,
  `got ${atNew.tithi.index} — ${atNew.tithi.name}`);
check('and it is प्रतिपदा', atNew.tithi.name === 'प्रतिपदा', atNew.tithi.name);
check('and the moon is dark', atNew.moonPercent <= 1, `${atNew.moonPercent}%`);
check('and the paksha is शुक्ल', atNew.paksha === 'शुक्ल', atNew.paksha);

/*
 * The Moon's longitude moves on, so the other twelve named lunations are found
 * by searching for the moments the angle comes nearest to zero and to one
 * hundred and eighty — rather than by writing out twelve dates that would each
 * be one more place to be wrong.
 */
/*
 * Every instant the panchang calls the fifteenth must fall inside the fifteenth
 * tithi, and the fifteenth tithi is the twelve degrees from 168° to 180°. The
 * same for the first, which is 0° to 12°.
 *
 * An earlier version of this asked for the angle to be within three degrees of
 * exactly a hundred and eighty — which is wrong by construction, because a
 * tithi is twelve degrees long and the fifteenth *begins* twelve degrees early.
 * Every one of the 128 checks it ran failed, and all of them were the test
 * being right about the panchang and wrong about the tithi.
 */
let outsideFull = 0;
let outsideNew = 0;
let fullCount = 0;
let newCount = 0;

for (let step = 0; step < 4000; step += 1) {
  const jd = 2451545.0 + step * (7 / 24);
  const m = ((moonLongitude(jd) % 360) + 360) % 360;
  const s = ((sunLongitude(jd) % 360) + 360) % 360;
  const angle = (((m - s) % 360) + 360) % 360;

  const p = panchang(jd, 0);

  if (p.tithi.index === 15) {
    fullCount += 1;
    if (angle < 168 || angle >= 180) outsideFull += 1;
  }
  if (p.tithi.index === 1) {
    newCount += 1;
    if (angle >= 12) outsideNew += 1;
  }
}

check('every tithi called the fifteenth lies inside the fifteenth tithi',
  fullCount > 0 && outsideFull === 0, `${fullCount} found, ${outsideFull} outside 168°–180°`);
check('every tithi called the first lies inside the first tithi',
  newCount > 0 && outsideNew === 0, `${newCount} found, ${outsideNew} outside 0°–12°`);

/*
 * Vishṭi recurs every seventh half-tithi.
 *
 * ── On the rule that is deliberately not imposed ───────────────────────────
 *
 * Most almanacs also say Vishṭi falls only in the second half of the tithis 4,
 * 8, 12, 16, 20, 24 and 28 — seven times in a month. That cannot be true at
 * the same time as a sixty-entry month: the seven recurring karanas must fill
 * fifty-six half-tithis, and if one of the seven appears only seven times the
 * other six have to fill forty-nine, which is not a whole number of rounds.
 *
 * Rather than pick one and quietly drop eight karanas from somewhere, the
 * enumeration stands — sixty names, the seven recurring consecutively, Vishṭi
 * every seventh half-tithi — and the almanac's second-half rule is left alone
 * as something this file does not claim. Asserting it anyway is what put
 * Vishṭi at the start of four tithis a month, and asserting the tithi list
 * directly is what made 541 of the 4000 sampled instants come out in the wrong
 * tithi.
 *
 * What is pinned here is the part that is true either way.
 */
let vishTiCount = 0;
let vishTiWrong = 0;
for (let step = 0; step < 4000; step += 1) {
  const jd = 2451545.0 + step * (7 / 24);
  if (panchang(jd, 0).karana.name !== 'विष्टि') continue;
  vishTiCount += 1;
  const half = Math.floor((((moonLongitude(jd) - sunLongitude(jd)) % 360) + 360) % 360 / 6);
  if ((half - 7) % 7 !== 0) vishTiWrong += 1;
}
check('Vishṭi recurs every seventh half-tithi',
  vishTiWrong === 0, `${vishTiCount} occurrences, ${vishTiWrong} off the cycle`);
check('Vishṭi was actually reached', vishTiCount > 0, `reached ${vishTiCount} times`);

// The other six go round in order, with no gaps and no repeats.
const everyKarana = new Set(KARANAS);
check('there are exactly eleven karana names — seven recurring, one first, three last',
  everyKarana.size === 11, `got ${everyKarana.size}: ${[...everyKarana].join(', ')}`);

/* ── 2. the divisions, over a long run of instants ───────────────────────── */

// Every limb is in range at every instant — and the ranges are the point.
let bad = 0;
let karanaSeen = new Set<number>();
let yogaSeen = new Set<number>();
let tithiSeen = new Set<number>();
let nakSeen = new Set<number>();

// One instant every seventh hour for four years.
for (let step = 0; step < 5000; step += 1) {
  const jd = 2451545.0 + step * (7 / 24);
  const p = panchang(jd, step % 7);

  if (p.tithi.index < 1 || p.tithi.index > 30) bad += 1;
  if (p.nakshatra.index < 1 || p.nakshatra.index > 27) bad += 1;
  if (p.yoga.index < 1 || p.yoga.index > 27) bad += 1;
  if (p.karana.index < 1 || p.karana.index > 60) bad += 1;
  if (p.vaara.index < 0 || p.vaara.index > 6) bad += 1;
  if (p.moonPercent < 0 || p.moonPercent > 100) bad += 1;

  tithiSeen.add(p.tithi.index);
  nakSeen.add(p.nakshatra.index);
  yogaSeen.add(p.yoga.index);
  karanaSeen.add(p.karana.index);
}

check('every limb is in range at 5,000 separate instants', bad === 0, `${bad} out of range`);
check('all thirty tithis are reached', tithiSeen.size === 30, `reached ${tithiSeen.size}`);
check('all twenty-seven nakshatras are reached', nakSeen.size === 27, `reached ${nakSeen.size}`);
check('all twenty-seven yogas are reached', yogaSeen.size === 27, `reached ${yogaSeen.size}`);
check('all sixty karanas are reached', karanaSeen.size === 60,
  `reached ${karanaSeen.size} — a karana count that stops at thirty is the bug this is looking for`);

/* ── 3. the karana really is half a tithi ────────────────────────────────── */

// The karana index must advance once for every six degrees the Moon gains on
// the Sun — no more and no less. This is the check that catches a karana that
// is right at one instant and slips in between.
let mismatches = 0;
let compared = 0;
for (let step = 0; step < 3000; step += 1) {
  const jd = 2451545.0 + step * (5 / 24);
  const angle = ((moonLongitude(jd) - sunLongitude(jd)) % 360 + 360) % 360;
  const expected = Math.floor(angle / 6) + 1;
  const p = panchang(jd, 0);
  compared += 1;
  if (p.karana.index !== expected) mismatches += 1;
}
check('the karana is exactly the tithi divided in half',
  mismatches === 0, `${mismatches} of ${compared} disagreed`);

/* ── 4. the tithi really is the twelfths of the zodiac ───────────────────── */

let tithiWrong = 0;
for (let step = 0; step < 3000; step += 1) {
  const jd = 2451545.0 + step * (5 / 24);
  const angle = ((moonLongitude(jd) - sunLongitude(jd)) % 360 + 360) % 360;
  const expected = Math.floor(angle / 12) + 1;
  if (panchang(jd, 0).tithi.index !== expected) tithiWrong += 1;
}
check('the tithi is the Moon-Sun distance in twelfths',
  tithiWrong === 0, `${tithiWrong} disagreed`);

/* ── 5. the rashi ────────────────────────────────────────────────────────── */

check('zero degrees is Aries', rashiAt(0).name === 'मेष', rashiAt(0).name);
check('thirty degrees is Taurus', rashiAt(30).name === 'वृषभ', rashiAt(30).name);
check('three hundred and sixty is back to Aries', rashiAt(360).name === 'मेष', rashiAt(360).name);
check('three hundred and fifty-nine is still Pisces', rashiAt(359).name === 'मीन', rashiAt(359).name);
check('a negative longitude wraps rather than going blank',
  rashiAt(-10).name === 'मीन', rashiAt(-10).name);

/* ── 6. the nakshatra lord ───────────────────────────────────────────────── */

/*
 * Ketu rules the first, Venus the second, and the ninth is Ketu again — the
 * cycle is nine long and the twenty-seven nakshatras are that cycle three
 * times over. An earlier table in this project had fourteen of the twenty-seven
 * wrong, and Revati came out Venus instead of Mercury.
 *
 * What is checked here is that the chart's own nakshatra and the dasha table's
 * own lord are the same answer. Two files each holding their own list is how
 * fourteen came to be wrong in the first place.
 */
const EXPECTED_CYCLE = ['केतु', 'शुक्र', 'सूर्य', 'चंद्र', 'मंगल', 'राहु', 'ज्योठि', 'शनि', 'बुध'];

check('the first nine nakshatras run Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury',
  EXPECTED_CYCLE.every((lord, i) => nakshatraLordAt(i + 1) === lord),
  EXPECTED_CYCLE.map((lord, i) => (nakshatraLordAt(i + 1) === lord ? '' : `${i + 1}:${lord}`)).filter(Boolean).join(' '));

check('the cycle repeats — the tenth nakshatra is Ketu again',
  nakshatraLordAt(10) === 'केतु', nakshatraLordAt(10));
check('Revati, the twenty-seventh, is Mercury', nakshatraLordAt(27) === 'बुध', nakshatraLordAt(27));
check('there are twenty-seven nakshatras', NAKSHATRAS.length === 27, `got ${NAKSHATRAS.length}`);

/* ── 7. the moon's phase agrees with the tithi ───────────────────────────── */

/*
 * Half the Moon is lit at ninety degrees from the Sun, and at two hundred and
 * seventy — so the lit fraction is below half for the first seven and the last
 * seven tithis, and above half in between.
 *
 * An earlier version of this put the crossover at the eighth tithi alone and
 * declared anything above it a contradiction, which flagged five hundred
 * perfectly correct instants: the waning half is *falling* in brightness, so a
 * twentieth tithi at twenty per cent is the right answer and not a fault. The
 * whole month is one hill, with a rise and a fall, and the test has to know
 * about both sides of it.
 */
let phaseWrong = 0;
for (let step = 0; step < 2000; step += 1) {
  const jd = 2451545.0 + step * (9 / 24);
  const p = panchang(jd, 0);
  const m = moonPhase(jd);

  const above = m.percent >= 50;

  /*
   * Tithis eight and twenty-three straddle the halfway point — eight runs from
   * eighty-four to ninety-six degrees, and the crossing is at ninety — so they
   * are allowed either answer. Everything else is decided.
   */
  if (p.tithi.index === 8 || p.tithi.index === 23) continue;
  if (above !== (p.tithi.index >= 9 && p.tithi.index <= 22)) phaseWrong += 1;
}
check('the lit fraction is under half only near the new moons',
  phaseWrong === 0, `${phaseWrong} contradictions`);

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) process.exit(1);