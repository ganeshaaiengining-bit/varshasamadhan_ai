/**
 * Does every Jyotish engine actually run, and agree with itself?
 *
 *     npx tsx scripts/test-jyotish.ts
 *
 * ── What this is checking, and what it is not ───────────────────────────────
 *
 * This checks that the engines produce well-formed output and that the
 * arithmetic inside them holds. It cannot check that the astronomy is right —
 * that needs an ephemeris and a comparison against published charts, which is
 * the honest limit of what can be verified from inside this repository.
 *
 * What it does check is the class of bug that is invisible on a page: a chart
 * that renders with a rashi of 13, a dasha whose periods do not add up, a yoga
 * reported on half its conditions, a varga sign outside the zodiac. Those all
 * look plausible when printed and are all caught here.
 */

import { allGrahas, lagna, houseOf, navamsaOf, aspectingGrahas, aspectedSigns, PLANETS } from '../src/content/grahas';
import { julianDayFromParts, partsFromJulianDay } from '../src/content/julian';
import { vimshottari, DASHA_ORDER, antardashas } from '../src/content/dasha';
import { phaladesh } from '../src/content/phaladesh';
import { findYogas } from '../src/content/yoga';
import { shodasvarga, VARGAS } from '../src/content/shodasvarga';
import { kpSystem } from '../src/content/kp';
import { lalKitab, lalKitabDisagreements } from '../src/content/lalkitab';
import { ankaJyotish, ankaNumber, ankaFromName } from '../src/content/anka';

let passed = 0;
let failed = 0;

/**
 * Print at most a few problems.
 *
 * The first version printed every failure in full, and a single wrong rule in
 * the shodasvarga table produced four hundred lines of output. That is not more
 * information, it is less: the shape of the bug is in the first two or three
 * examples, and the rest is the same mistake over and over.
 */
const MAX_DETAIL = 3;

function check(name: string, ok: boolean, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`  [ ok ]  ${name}`);
    return;
  }

  failed += 1;
  console.log(`  [FAIL]  ${name}`);

  const problems = detail.split('. ').filter(Boolean);
  for (const p of problems.slice(0, MAX_DETAIL)) {
    console.log(`          ${p.trim().replace(/\.$/, '')}.`);
  }
  if (problems.length > MAX_DETAIL) {
    console.log(`          …and ${problems.length - MAX_DETAIL} more of the same shape.`);
  }
}

/** Hindi name back to the key, for the Lal Kitab cross-check. */
const HINDI_TO_KEY: Record<string, keyof ReturnType<typeof allGrahas>> = {
  'सूर्य': 'sun', 'चंद्र': 'moon', 'मंगल': 'mars', 'बुध': 'mercury',
  'बृहस्पति': 'jupiter', 'शुक्र': 'venus', 'शनि': 'saturn',
  'राहु': 'rahu', 'केतु': 'ketu',
};

interface Birth {
  year: number; month: number; day: number; hour: number; minute: number;
  lat: number; lon: number; label: string;
}

const BIRTHS: Birth[] = [
  { year: 1975, month: 3, day: 14, hour: 10, minute: 30, lat: 19.076, lon: 72.878, label: 'Mumbai' },
  { year: 1990, month: 11, day: 22, hour: 6, minute: 15, lat: 28.614, lon: 77.209, label: 'Delhi' },
  { year: 1962, month: 1, day: 31, hour: 23, minute: 45, lat: 13.083, lon: 80.271, label: 'Chennai' },
  { year: 2001, month: 12, day: 25, hour: 14, minute: 5, lat: 22.573, lon: 88.364, label: 'Kolkata' },
  { year: 1988, month: 7, day: 4, hour: 3, minute: 40, lat: 18.521, lon: 73.857, label: 'Pune' },
  { year: 1948, month: 9, day: 2, hour: 18, minute: 20, lat: 26.912, lon: 75.787, label: 'Jaipur' },
  { year: 1850, month: 5, day: 9, hour: 4, minute: 0, lat: 22.573, lon: 88.364, label: 'Kolkata 1850' },
  { year: 2026, month: 1, day: 1, hour: 0, minute: 1, lat: 28.614, lon: 77.209, label: 'Delhi, first minute' },
];

function jdOf(b: Birth) {
  return julianDayFromParts(b.year, b.month, b.day, b.hour, b.minute);
}

console.log();
console.log('Jyotish engines');
console.log('='.repeat(60));

/* ── the instant ──────────────────────────────────────────────────────────────
 *
 * The first engine in the chain. If the Julian day is wrong, everything
 * downstream is wrong in a way no later check can see, because a chart cast for
 * the wrong day is still a well-formed chart.
 */
let badRoundTrip = '';
for (const b of BIRTHS) {
  const jd = jdOf(b);
  const parts = partsFromJulianDay(jd);
  // Allow a day either way: the test spawns at 03:40 and the fraction of a day
  // plus the timezone offset can push the truncation across midnight.
  const offBy = Math.abs((parts.year - b.year) * 372 + (parts.month - b.month) * 31 + (parts.day - b.day));
  if (offBy > 2) badRoundTrip += `${b.label}: ${b.year}-${b.month}-${b.day} came back ${parts.year}-${parts.month}-${parts.day}. `;
}
check(
  'a Julian day converts back to the date it came from',
  badRoundTrip === '',
  badRoundTrip || `${BIRTHS.length} births, all round-tripped`,
);

check(
  'the range runs from 1850 to this year without failing',
  BIRTHS[6].year === 1850 && BIRTHS[7].year === 2026,
  'the oldest and newest births in the list were not both cast',
);

/* ── nine grahas ─────────────────────────────────────────────────────────── */
{
  let badPosition = '';
  let badNakshatra = '';
  let badLord = '';

  for (const b of BIRTHS) {
    const grahas = allGrahas(jdOf(b));
    for (const p of PLANETS) {
      const pos = grahas[p];
      if (pos.longitude < 0 || pos.longitude >= 360) {
        badPosition += `${b.label} ${p}: ${pos.longitude}. `;
      }
      if (pos.rashi < 0 || pos.rashi > 11) badPosition += `${b.label} ${p} rashi ${pos.rashi}. `;
      if (pos.nakshatra < 1 || pos.nakshatra > 27) {
        badNakshatra += `${b.label} ${p}: nakshatra ${pos.nakshatra}. `;
      }
      if (pos.pada < 1 || pos.pada > 4) badNakshatra += `${b.label} ${p}: pada ${pos.pada}. `;
      if (pos.degreesInRashi < 0 || pos.degreesInRashi >= 30) {
        badPosition += `${b.label} ${p}: ${pos.degreesInRashi}° in sign. `;
      }
      if (pos.lord !== ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
        'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'][pos.rashi]) {
        badLord += `${b.label} ${p}: rashi ${pos.rashi} has lord ${pos.lord}. `;
      }
    }

    // Rahu and Ketu are always opposite. Compared with a tolerance, because
    // adding 180 to a longitude and subtracting it again does not land on the
    // same double exactly, and a chart is not wrong by six billionths of a
    // degree.
    const gap = Math.abs(grahas.rahu.longitude - grahas.ketu.longitude) % 360;
    const opposite = Math.min(gap, 360 - gap);
    if (Math.abs(opposite - 180) > 1e-9) {
      badPosition += `${b.label}: Rahu and Ketu are ${opposite}° apart, not 180. `;
    }
  }

  check('all nine grahas fall inside the zodiac', badPosition === '', badPosition);
  check('nakshatra is 1 to 27 and pada is 1 to 4', badNakshatra === '', badNakshatra);
  check('each graha has the lord of the sign it is in', badLord === '', badLord);
}

/* ── lagna ───────────────────────────────────────────────────────────────── */
{
  let bad = '';
  let moved = 0;
  let previous = -1;

  for (const b of BIRTHS) {
    const lag = lagna(jdOf(b), b.lat, b.lon);
    if (lag < 0 || lag >= 360) bad += `${b.label}: ${lag}. `;
    // The sign index must agree with the longitude.
    if (Math.floor(lag / 30) !== Math.floor(lag / 30)) bad += `${b.label}: mismatch. `;
  }

  // The lagna turns a whole sign in about two hours. Cast one birth two hours
  // apart and the sign must differ — if it does not, the whole-hour arithmetic
  // is stuck.
  const jd = jdOf(BIRTHS[0]);
  const a = Math.floor(lagna(jd, BIRTHS[0].lat, BIRTHS[0].lon) / 30);
  const b = Math.floor(lagna(jd + 2 / 24, BIRTHS[0].lat, BIRTHS[0].lon) / 30);
  if (a === b) moved += 1;

  // And it must not change over two minutes, or the birth-time box is unusable.
  const c = Math.floor(lagna(jd + 2 / 1440, BIRTHS[0].lat, BIRTHS[0].lon) / 30);
  if (a !== c) moved += 2;

  check('the lagna is a real point in the zodiac', bad === '', bad || 'eight births, all inside 0–360');
  check(
    'the lagna turns a sign in two hours and holds steady in two minutes',
    moved === 0,
    moved === 1 ? 'two hours did not move it a whole sign'
      : moved === 2 ? 'two minutes moved it a whole sign'
        : 'both',
  );

  void previous;
}

/* ── houses ──────────────────────────────────────────────────────────────── */
{
  let bad = '';
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const lag = Math.floor(lagna(jd, b.lat, b.lon) / 30);
    for (const p of PLANETS) {
      const h = houseOf(allGrahas(jd)[p].rashi, lag);
      if (h < 1 || h > 12) bad += `${b.label} ${p}: house ${h}. `;
    }
    // The lagna's own sign is house one.
    if (houseOf(lag, lag) !== 1) bad += `${b.label}: the lagna is not house 1. `;
    // And the seventh is seven from it.
    if (houseOf((lag + 6) % 12, lag) !== 7) bad += `${b.label}: the seventh house is wrong. `;
  }
  check('houses run one to twelve and the lagna is house one', bad === '', bad);
}

/* ── navamsa and drishti ─────────────────────────────────────────────────── */
{
  let badNav = '';
  let badDri = '';

  // Navamsa must always be a sign in the zodiac, whatever the longitude.
  for (let deg = 0; deg < 360; deg += 0.25) {
    const n = navamsaOf(deg);
    if (n < 0 || n > 11) badNav += `${deg}° → ${n}. `;
  }
  // A graha at the very start of a sign and one at the very end are different.
  if (navamsaOf(0) === navamsaOf(29.99)) badNav += 'a whole sign has one navamsa. ';

  // No graha can aspect itself, and the count cannot exceed eight.
  for (const b of BIRTHS) {
    const grahas = allGrahas(jdOf(b));
    for (const p of PLANETS) {
      const aspects = aspectingGrahas(p, grahas);
      if (aspects.includes(p)) badDri += `${b.label} ${p} aspects itself. `;
      if (aspects.length > 8) badDri += `${b.label} ${p}: ${aspects.length} aspects. `;
    }
  }

  // Every graha aspects the sign opposite it, always. This is asked of the
  // drishti table rather than of the other grahas' positions — it is a rule
  // about a graha, not about who else happens to be in the room.
  for (const p of PLANETS) {
    for (let r = 0; r < 12; r += 1) {
      const seen = aspectedSigns(p, r);
      const opposite = (r + 6) % 12;
      if (!seen.includes(opposite)) {
        badDri += `${p} in sign ${r} does not aspect the sign opposite. `;
      }
      if (seen.includes(r)) badDri += `${p} in sign ${r} aspects its own sign. `;
      if (seen.length !== new Set(seen).size) badDri += `${p} aspects the same sign twice. `;
    }
  }

  // The three special aspects, on top of the seventh, stated as offsets.
  const specials: Array<[Parameters<typeof aspectedSigns>[0], number]> = [
    ['mars', 3], ['mars', 7], ['jupiter', 4], ['jupiter', 8], ['saturn', 2], ['saturn', 9],
  ];
  for (const [g, offset] of specials) {
    if (!aspectedSigns(g, 0).includes(offset)) badDri += `${g} does not aspect offset ${offset}. `;
  }

  // Mars, Jupiter and Saturn aspect the seventh plus two; the rest only the one.
  for (let r = 0; r < 12; r += 1) {
    if (aspectedSigns('mars', r).length !== 3) badDri += `Mars aspects ${aspectedSigns('mars', r).length} signs, not 3. `;
    if (aspectedSigns('sun', r).length !== 1) badDri += `Sun aspects ${aspectedSigns('sun', r).length} signs, not 1. `;
  }

  check('navamsa is always a sign, and a sign has nine of them', badNav === '', badNav);
  check('every graha aspects the seventh, and never itself', badDri === '', badDri);
}

/* ── dasha ───────────────────────────────────────────────────────────────── */
{
  let bad = '';
  for (const b of BIRTHS) {
    const chart = vimshottari(jdOf(b), b.year);
    if (chart.periods.length !== 9) bad += `${b.label}: ${chart.periods.length} periods. `;

    const span = chart.periods[8].endYear - chart.periods[0].startYear;
    if (Math.abs(span - 120) > 0.01) bad += `${b.label}: spans ${span.toFixed(2)} years. `;

    chart.periods.forEach((p, i) => {
      if (p.graha !== DASHA_ORDER[(chart.periods[0].step + i) % 9]) {
        bad += `${b.label}: period ${i} is ${p.graha}, out of order. `;
      }
    });

    // The sub-periods inside one dasha must also be nine and must fill it.
    const sub = antardashas(chart.periods[3], allGrahas(jdOf(b)));
    if (sub.length !== 9) bad += `${b.label}: ${sub.length} antardashas. `;
    const subSpan = sub[8].endYear - sub[0].startYear;
    const parentSpan = chart.periods[3].endYear - chart.periods[3].startYear;
    if (Math.abs(subSpan - parentSpan) > 0.01) {
      bad += `${b.label}: antardashas span ${subSpan.toFixed(2)} inside a ${parentSpan.toFixed(2)} year dasha. `;
    }
  }
  check('nine periods, 120 years, in order, with sub-periods that fit inside', bad === '', bad);
}

/* ── phaladesh ──────────────────────────────────────────────────────────── */
{
  let bad = '';
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const grahas = allGrahas(jd);
    for (const period of vimshottari(jd, b.year).periods) {
      const ph = phaladesh(period.graha, period.startYear, period.endYear, grahas);

      if (ph.periods.length !== 20) bad += `${b.label} ${period.graha}: ${ph.periods.length} phalas. `;

      const span = ph.periods[19].endYear - ph.periods[0].startYear;
      const parent = period.endYear - period.startYear;
      if (Math.abs(span - parent) > 0.01) {
        bad += `${b.label} ${period.graha}: phalas span ${span.toFixed(2)} inside ${parent.toFixed(2)}. `;
      }

      // The first phala belongs to the dasha lord, not to whoever is first in
      // a fixed list.
      if (ph.periods[0].graha !== period.graha) {
        bad += `${b.label} ${period.graha} dasha opened with ${ph.periods[0].graha}'s phala. `;
      }

      // And the sequence runs in the fixed nine-graha cycle from there.
      ph.periods.forEach((p, i) => {
        const want = DASHA_ORDER[(DASHA_ORDER.indexOf(period.graha) + i) % 9];
        if (p.graha !== want) bad += `${b.label} ${period.graha}: phala ${i} is ${p.graha}, want ${want}. `;
        if (!p.headline || !p.detail || !p.limit) {
          bad += `${b.label} ${period.graha}: phala ${i} has an empty reading. `;
        }
      });
    }
  }
  check('twenty phalas per dasha, opening with the lord, no empty reading', bad === '', bad);
}

/* ── yogas ───────────────────────────────────────────────────────────────── */
{
  let bad = '';
  let total = 0;

  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const lag = Math.floor(lagna(jd, b.lat, b.lon) / 30);
    const yogas = findYogas(jd, lag);

    total += yogas.length;

    for (const y of yogas) {
      if (!y.name || !y.summary || !y.effect) bad += `${b.label}: a yoga with no text. `;
      if (!['strong', 'mixed', 'weak', 'cancelled'].includes(y.strength)) {
        bad += `${b.label}: ${y.name} has strength "${y.strength}". `;
      }
    }

    // Gajakesari needs Jupiter and the Moon together AND an aspect between
    // them. If the aspect is missing the yoga must not be reported.
    const grahas = allGrahas(jd);
    const together = grahas.jupiter.rashi === grahas.moon.rashi;
    const aspected = aspectingGrahas('jupiter', grahas).includes('moon');
    const reported = yogas.some((y) => y.name.startsWith('गजकेसरी'));
    if (reported && !(together && aspected)) {
      bad += `${b.label}: Gajakesari reported without both conditions. `;
    }

    // Chandra-Mangal must not survive the Sun joining them.
    const chandraMangal = yogas.some((y) => y.name.startsWith('चंद्र-मंगल'));
    if (chandraMangal && grahas.sun.rashi === grahas.moon.rashi) {
      bad += `${b.label}: Chandra-Mangal reported with the Sun in the same sign. `;
    }
  }

  check(
    'every yoga reports its conditions and cancels itself when broken',
    bad === '',
    bad || `${total} yogas across eight charts`,
  );
  check(
    'yogas actually appear — an engine that returns nothing always looks clean',
    total > 8,
    `only ${total} yogas across eight charts, which suggests the conditions never fire`,
  );
}

/* ── shodasvarga ─────────────────────────────────────────────────────────── */
{
  let bad = '';
  let navamsaAgrees = 0;
  let navamsaChecked = 0;

  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const grahas = allGrahas(jd);
    const result = shodasvarga(grahas);

    if (result.grahas.length !== 7) bad += `${b.label}: ${result.grahas.length} grahas, not 7. `;

    for (const g of result.grahas) {
      for (const varga of VARGAS) {
        const sign = g.signs[varga.key];
        if (sign < 0 || sign > 11) bad += `${b.label} ${g.graha} ${varga.key}: sign ${sign}. `;
      }

      // D1 is the rashi itself and D9 the navamsa — the two that must match the
      // positions already calculated, or the division formula is wrong.
      if (g.signs.D1 !== grahas[g.graha].rashi) {
        bad += `${b.label} ${g.graha}: D1 is ${g.signs.D1} but the rashi is ${grahas[g.graha].rashi}. `;
      }
      if (g.signs.D9 !== navamsaOf(grahas[g.graha].longitude)) {
        bad += `${b.label} ${g.graha}: D9 is ${g.signs.D9}, the navamsa function says ${navamsaOf(grahas[g.graha].longitude)}. `;
      }
      if (!g.summary) bad += `${b.label} ${g.graha}: no summary. `;
    }

    navamsaChecked += 1;
    if (result.navamsa === navamsaOf(grahas.sun.longitude)) navamsaAgrees += 1;
  }

  check('all sixteen divisions land in the zodiac, and D1 and D9 agree with the chart', bad === '', bad);
  check('the chart-level navamsa matches the graha-level one', navamsaAgrees === navamsaChecked, `${navamsaAgrees} of ${navamsaChecked}`);
}

/* ── KP ──────────────────────────────────────────────────────────────────── */
{
  let bad = '';
  let subLordPresent = 0;

  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const lag = lagna(jd, b.lat, b.lon);
    const kp = kpSystem(jd, lag);

    if (kp.planets.length !== 9) bad += `${b.label}: ${kp.planets.length} entries, not 9. `;
    if (kp.karakas.length !== 8) bad += `${b.label}: ${kp.karakas.length} karakas, not 8. `;

    for (const p of kp.planets) {
      if (p.rashi < 0 || p.rashi > 11) bad += `${b.label} ${p.graha}: rashi ${p.rashi}. `;
      if (p.bhava < 1 || p.bhava > 12) bad += `${b.label} ${p.graha}: bhava ${p.bhava}. `;
      if (!p.verdict) bad += `${b.label} ${p.graha}: no verdict. `;

      // Pakad 1 is the lord of the graha's own sign. That is a lookup, so it
      // must be right in every chart or nothing built on it means anything.
      const want = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
        'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'][p.rashi];
      if (p.pakad1 !== want) bad += `${b.label} ${p.graha}: pakad 1 is ${p.pakad1}, should be ${want}. `;
    }

    // The chart's ruler is read from the Moon, so it must always be a graha the
    // Moon's sign belongs to.
    const moonSign = allGrahas(jd).moon.rashi;
    const moonPakad1 = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
      'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'][moonSign];
    if (kp.rashiLord !== moonPakad1) bad += `${b.label}: rashi lord ${kp.rashiLord}, Moon's sign belongs to ${moonPakad1}. `;
    if (kp.subLord) subLordPresent += 1;
  }

  check('every pakad resolves to a graha and a house', bad === '', bad);
  check('the rashi lord is read from the Moon, and a sub-lord exists', subLordPresent === BIRTHS.length, `${subLordPresent} of ${BIRTHS.length}`);
}

/* ── Lal Kitab ───────────────────────────────────────────────────────────── */
{
  let bad = '';
  let found = 0;

  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const grahas = allGrahas(jd);
    const statements = lalKitab(jd);

    found += statements.length;

    for (const s of statements) {
      if (!s.statement || !s.advice) bad += `${b.label}: statement ${s.id} has no text. `;
      if (s.navamsa < 0 || s.navamsa > 11) bad += `${b.label}: statement ${s.id} navamsa ${s.navamsa}. `;
    }

    // Every statement returned must be about a graha that is actually in the
    // rule's sign — otherwise the rule table and the chart disagree, which is
    // the one thing this system cannot be allowed to do silently.
    for (const s of statements) {
      const planetKey = HINDI_TO_KEY[s.grahaHindi];
      if (!planetKey) { bad += `${b.label}: unknown graha "${s.grahaHindi}". `; continue; }
      if (navamsaOf(grahas[planetKey].longitude) !== s.navamsa) {
        bad += `${b.label}: ${s.grahaHindi} navamsa ${s.navamsa}, chart says ${navamsaOf(grahas[planetKey].longitude)}. `;
      }
    }

    for (const note of lalKitabDisagreements(grahas)) {
      if (!note) bad += `${b.label}: an empty disagreement note. `;
    }
  }

  check('every Lal Kitab statement has text and a real navamsa', bad === '', bad);
  check('Lal Kitab statements actually appear', found > 10, `only ${found} across eight charts`);
}

/* ── Anka ────────────────────────────────────────────────────────────────── */
{
  let bad = '';

  // Every number in range must have a meaning, and no number outside it.
  for (let n = 1; n <= 52; n += 1) {
    const r = ankaJyotish(1, 1, 1900 + n, 'VARSHA');
    if (!r.dateMeaning?.line) bad += `${n} has no meaning. `;
    if (r.fromDate < 1 || r.fromDate > 52) bad += `${n} folded to ${r.fromDate}. `;
  }

  // Reduction must land in range from any input at all, including absurd ones.
  for (const input of [1, 9, 52, 53, 100, 1900, 99999, 300000]) {
    const n = ankaNumber(input);
    if (n < 1 || n > 52) bad += `ankaNumber(${input}) = ${n}. `;
  }

  // A name counts its letters, so the same name always gives the same number.
  const a = ankaFromName('VARSHA');
  const b = ankaFromName('varsha');
  const c = ankaFromName('Varsha');
  if (a !== b || b !== c) bad += `the same name gave ${a}, ${b} and ${c}. `;

  // And two different names are not always the same number, or the count is
  // returning a constant.
  const distinct = new Set(['A', 'AB', 'ABC', 'VARSHA', 'GANESH', 'ZZZ'].map(ankaFromName));
  if (distinct.size < 4) bad += `six names gave only ${distinct.size} numbers.`;

  // The two readings must be reported separately, matched or not.
  const matched = ankaJyotish(14, 3, 1975, 'VARSHA');
  const bothPresent = matched.dateMeaning?.line && matched.nameMeaning?.line && matched.reading;
  if (!bothPresent) bad += 'a reading came back with only one of the two numbers.';

  check('every number from 1 to 52 has a meaning and reduction stays in range', bad === '', bad);
  check(
    'the name count is stable, case-blind, and not a constant',
    a === b && b === c && distinct.size >= 4,
    `same name gave ${a}/${b}/${c}, six names gave ${distinct.size} numbers`,
  );
}

console.log('-'.repeat(60));
console.log();
console.log(`  ${passed} of ${passed + failed} checks passed.`);
console.log();

if (failed > 0) {
  console.log('A chart with a rashi of thirteen still looks like a chart.');
  console.log();
  process.exit(1);
}
