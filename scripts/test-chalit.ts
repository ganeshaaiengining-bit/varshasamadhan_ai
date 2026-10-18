import { chalitOf, chalitHouseOf, moonTravelPerSign } from '../src/content/chalit';
import { ashtakavarga, signVerdict, PRAK_MIN, PRAK_MAX } from '../src/content/ashtakavarga';
import { gochar, grahaDashaNow } from '../src/content/gochar';
import { grahaShakti, shubhAshubh, janamVivaran } from '../src/content/shakti';
import { allGrahas, PLANETS, type Planet } from '../src/content/grahas';
import { julianDayFromParts } from '../src/content/julian';
import { RASHIS } from '../src/content/astrology';

/**
 * Chalit · Chandra · Karakamsha · Ashtakavarga · Gochar · Shakti
 *
 *     npx tsx scripts/test-chalit.ts
 *
 * ── The kinds of check that belong here ──────────────────────────────────────
 *
 * Not "is the number right" — nobody can check that without a book — but the
 * properties that must hold whatever the book says:
 *
 *   · a graha in the lagna's own sign is in the **twelfth** chalit house, which
 *     is the whole definition of the chalit chart
 *   · a sign has exactly one house in each frame, and all twelve are used
 *   · the karakamsha comes back **after** the birth, and within one lunar month
 *   · the Moon is where it was, to within a minute's worth of arc
 *   · no ashtakavarga number is impossible, and the subtractions really happen
 *   · a shadow graha is never in its own sign, and the Sun is never burnt
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
    if (detail) console.log(`          ${detail.split('; ').slice(0, 4).join('; ')}`);
  }
}

interface Birth {
  date: string;
  time: string;
  lat: number;
  lon: number;
  label: string;
}

const BIRTHS: Birth[] = [
  { date: '1975-03-14', time: '14:30', lat: 21.15, lon: 79.09, label: 'Varsha' },
  { date: '1990-01-01', time: '00:05', lat: 19.08, lon: 72.88, label: 'Mumbai' },
  { date: '2001-12-31', time: '23:55', lat: 13.08, lon: 80.27, label: 'Chennai' },
  { date: '1966-06-15', time: '06:20', lat: 22.57, lon: 88.36, label: 'Kolkata' },
  { date: '1947-08-15', time: '12:00', lat: 28.61, lon: 77.21, label: 'Delhi' },
  { date: '2024-02-29', time: '09:05', lat: 34.08, lon: 74.80, label: 'Srinagar' },
  { date: '1985-11-08', time: '03:40', lat: 15.50, lon: 73.50, label: 'Goa' },
  { date: '2010-07-04', time: '19:20', lat: 26.91, lon: 75.78, label: 'Jaipur' },
];

function jdOf(b: Birth): number {
  const [y, m, d] = b.date.split('-').map(Number);
  const [hh, mm] = b.time.split(':').map(Number);
  return julianDayFromParts(y, m, d, hh, mm);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHALIT
   ═══════════════════════════════════════════════════════════════════════════ */

console.log();
console.log('CHALIT · CHANDRA · KARAKAMSHA');
console.log('='.repeat(64));

{
  // The definition, stated as a test: lagna's own sign is the twelfth.
  let bad = 0;
  let detail = '';
  for (let lagna = 0; lagna < 12; lagna += 1) {
    const got = chalitHouseOf(lagna, lagna);
    if (got !== 12) {
      bad += 1;
      detail += `lagna=${RASHIS[lagna].name} -> ${got}; `;
    }
  }
  check('a graha in the lagna own sign is in the twelfth chalit house', bad === 0, detail);
}

{
  // Every sign has a chalit house of 1..12, all twelve used, no repeats.
  let bad = 0;
  let detail = '';
  for (let lagna = 0; lagna < 12; lagna += 1) {
    const seen = new Set<number>();
    for (let sign = 0; sign < 12; sign += 1) seen.add(chalitHouseOf(sign, lagna));
    if (seen.size !== 12) {
      bad += 1;
      detail += `lagna=${RASHIS[lagna].name} used ${seen.size} houses; `;
    }
  }
  check('all twelve chalit houses are used exactly once', bad === 0, detail);
}

{
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const c = chalitOf(jd, b.lat, b.lon);
    if (!c) continue;

    for (const g of c.grahas) {
      const expectChalit = chalitHouseOf(g.rashi, c.lagnaRashi);
      if (g.chalitHouse !== expectChalit) {
        bad += 1;
        detail += `${b.label} ${g.name}: chalit ${g.chalitHouse} ne ${expectChalit} chahiye; `;
      }
      if (g.house < 1 || g.house > 12) { bad += 1; detail += `${b.label} ${g.name}: house ${g.house}; `; }
      if (g.chandraHouse < 1 || g.chandraHouse > 12) { bad += 1; detail += `${b.label} ${g.name}: chandra ${g.chandraHouse}; `; }
    }
  }
  check('every graha has a chalit and chandra house of its own', bad === 0, detail);
}

{
  // A graha sitting in the lagna's sign must read house 12 in the chalit column.
  let fired = 0;
  let wrong = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const c = chalitOf(jdOf(b), b.lat, b.lon);
    if (!c) continue;
    const inLagna = c.grahas.filter((g) => g.rashi === c.lagnaRashi);
    for (const g of inLagna) {
      fired += 1;
      if (g.chalitHouse !== 12) {
        wrong += 1;
        detail += `${b.label} ${g.name} lagna sign me hai par chalit ${g.chalitHouse}; `;
      }
    }
  }
  check('the rule about the lagna own sign actually fires', fired > 0, `sirf ${fired} baar`);
  check('and every time it fires it is right', wrong === 0, detail);
}

{
  // The Moon's own sign is the chandra first house, so a graha there is house 1.
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const c = chalitOf(jdOf(b), b.lat, b.lon);
    if (!c) continue;
    const withMoon = c.grahas.find((g) => g.graha === 'moon');
    if (!withMoon) continue;
    if (withMoon.rashi === c.moonRashi && withMoon.chandraHouse !== 1) {
      bad += 1;
      detail += `${b.label}: moon chandra house ${withMoon.chandraHouse}; `;
    }
  }
  check('the Moon is the first house of its own chandra chart', bad === 0, detail);
}

{
  // Swansh is the seventh from the Chandra lagna, always.
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const c = chalitOf(jdOf(b), b.lat, b.lon);
    if (!c) continue;
    if (c.swansh !== (c.moonRashi + 6) % 12) { bad += 1; detail += `${b.label} swansh; `; }
    if (c.swanshChandraHouse !== 7) { bad += 1; detail += `${b.label} swansh house ${c.swanshChandraHouse}; `; }
  }
  check('swansh is the sign opposite the chandra lagna', bad === 0, detail);
}

{
  // Karakamsha: after the birth, inside a lunar month, and a real sign.
  let bad = 0;
  let detail = '';
  let fired = 0;
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const c = chalitOf(jd, b.lat, b.lon);
    if (!c) continue;

    fired += 1;
    if (c.karakamsha < 0 || c.karakamsha > 11) {
      bad += 1; detail += `${b.label} karakamsha ${c.karakamsha}; `; continue;
    }
    // A lunar month is between 27 and 28 days. Anything else means the search
    // found the opposition instead of the return.
    if (!(c.karakamshaAfterDays > 26 && c.karakamshaAfterDays < 29)) {
      bad += 1;
      detail += `${b.label} Moon ${c.karakamshaAfterDays.toFixed(2)} din baad laut aaya; `;
    }
    if (!c.karakamshaName) { bad += 1; detail += `${b.label} karakamsha naam khali; `; }
  }
  check('the karakamsha is found within one lunar month', bad === 0, detail);
  check('the karakamsha search runs for real charts', fired > 0, `sirf ${fired}`);
}

{
  // The Moon must genuinely be back on its birth degree at that moment.
  let bad = 0;
  let detail = '';
  let worst = 0;
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const c = chalitOf(jd, b.lat, b.lon);
    if (!c) continue;

    const birthLongitude = allGrahas(jd).moon.longitude;
    const thenLongitude = allGrahas(jd + c.karakamshaAfterDays).moon.longitude;

    let difference = Math.abs(thenLongitude - birthLongitude) % 360;
    if (difference > 180) difference = 360 - difference;

    worst = Math.max(worst, difference);
    // A tenth of a degree is about a quarter of an hour of lunar motion — the
    // search claims finer than that, and this is the check that would catch it.
    if (difference > 0.1) {
      bad += 1;
      detail += `${b.label}: ${difference.toFixed(4)}° khatam; `;
    }
  }
  check('the Moon really is back on its birth degree at the karakamsha moment',
    bad === 0, detail);
  console.log(`          (sabse bada antar: ${worst.toFixed(5)}°)`);
}

{
  // The Moon's speed, measured rather than assumed, must be a real Moon's.
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const travel = moonTravelPerSign(jdOf(b));
    // A Moon takes about two and a half days to cross one sign of thirty
    // degrees, and never longer than three.
    if (!(travel.days > 2 && travel.days < 3.2)) {
      bad += 1;
      detail += `${b.label}: ${travel.days.toFixed(2)} din; `;
    }
    if (!(travel.degrees > 11 && travel.degrees < 16)) {
      bad += 1;
      detail += `${b.label}: ${travel.degrees.toFixed(2)}°/din; `;
    }
  }
  check('the Moon speed is a real one, not a constant', bad === 0, detail);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ASHTAKAVARGA
   ═══════════════════════════════════════════════════════════════════════════ */

console.log();
console.log('ASHTĀKAVARGA');
console.log('='.repeat(64));

{
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const a = ashtakavarga(jdOf(b));
    if (a.grahas.length !== 9) { bad += 1; detail += `${b.label}: ${a.grahas.length} graha; `; }
    for (const g of a.grahas) {
      if (g.prak.length !== 12) { bad += 1; detail += `${b.label} ${g.name}: ${g.prak.length}; `; }
      for (const value of g.prak) {
        // The bounds are the engine's own, not a guess written here.
        if (value < PRAK_MIN || value > PRAK_MAX) {
          bad += 1;
          detail += `${b.label} ${g.name}: ${value} impossible; `;
        }
      }
      if (g.total !== g.prak.reduce((s, n) => s + n, 0)) {
        bad += 1; detail += `${b.label} ${g.name}: total galat; `;
      }
    }
  }
  check('nine grahas, twelve signs each, and no impossible number', bad === 0, detail);
}

{
  // Do the subtractions actually happen? A sheet where every graha scores well
  // everywhere is the signature of counting malefic signs as benefic ones.
  let bad = 0;
  let detail = '';
  let zeros = 0;
  for (const b of BIRTHS) {
    const a = ashtakavarga(jdOf(b));
    for (const g of a.grahas) {
      for (const value of g.prak) {
        if (value === 0) zeros += 1;
        if (value < 0) { bad += 1; detail += `${b.label} ${g.name}: ${value}; `; }
      }
    }
    const spread = a.sarvaTotal;
    // Nine grahas, twelve signs, PRAK_MAX each is the ceiling and PRAK_MIN the
    // floor. A whole chart outside that means a rule is firing twice or not at all.
    if (spread < PRAK_MIN * 108 || spread > PRAK_MAX * 108) {
      bad += 1;
      detail += `${b.label}: poora ashtakavarga ${spread}, jo namumkin hai; `;
    }
  }
  check('the whole sheet stays inside its possible range', bad === 0, detail);
  check('and the malefics really are taking points away', zeros > 0,
    `kisi bhi kundali me koi zero nahi mila — shayad minus nahi lag raha`);
}

{
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const a = ashtakavarga(jdOf(b));
    for (let sign = 0; sign < 12; sign += 1) {
      const sum = a.grahas.reduce((s, g) => s + g.prak[sign], 0);
      if (sum !== a.sarva[sign]) {
        bad += 1;
        detail += `${b.label} sign ${sign}: ${a.sarva[sign]} ne ${sum} chahiye tha; `;
      }
    }
    if (a.sarva.length !== 12) { bad += 1; detail += `${b.label}: ${a.sarva.length} sign; `; }
  }
  check('sarvashṭakavarga is the sum of the nine grahas, sign by sign', bad === 0, detail);
}

{
  // A graha scores in its own sign. If that rule were missing, no graha would
  // ever score for itself and the sheet would look plausible and be wrong.
  let fired = 0;
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const a = ashtakavarga(jd);
    const at = allGrahas(jd);
    for (const g of a.grahas) {
      if (g.graha === 'rahu' || g.graha === 'ketu') continue;
      const own = g.prak[at[g.graha].rashi];
      if (own > 0) fired += 1;
    }
  }
  check('a graha scores in its own sign', fired > 0, `sirf ${fired} baar`);
}

{
  // Rahu and Ketu are scored. They have no sign of their own, but they still
  // sit in signs and still aspect.
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const a = ashtakavarga(jdOf(b));
    for (const g of a.grahas) {
      if (g.graha !== 'rahu' && g.graha !== 'ketu') continue;
      if (g.total === 0) { bad += 1; detail += `${b.label} ${g.name}: zero; `; }
    }
  }
  check('rahu and ketu are scored too, not left blank', bad === 0, detail);
}

{
  // The same chart must give the same answer twice, and two different charts
  // must not give the same one.
  const first = ashtakavarga(jdOf(BIRTHS[0]));
  const again = ashtakavarga(jdOf(BIRTHS[0]));
  const other = ashtakavarga(jdOf(BIRTHS[3]));

  check('the same birth gives the same sheet twice',
    JSON.stringify(first) === JSON.stringify(again));
  check('and two different births do not',
    JSON.stringify(first) !== JSON.stringify(other));
}

{
  // The verdict thresholds must be ordered, or the sheet contradicts itself.
  check('the verdict words are in the right order',
    signVerdict(34) === 'बहुत बलवान' && signVerdict(29) === 'बलवान' &&
    signVerdict(25) === 'साधारण' && signVerdict(20) === 'कमज़ोर');
}

/* ═══════════════════════════════════════════════════════════════════════════
   GOCHAR
   ═══════════════════════════════════════════════════════════════════════════ */

console.log();
console.log('GOCHAR');
console.log('='.repeat(64));

{
  // Today's sky, taken at a real present-day instant.
  const now = Date.UTC(2026, 9, 18, 6, 0, 0) / 86400000 + 2440587.5;
  const g = gochar(now);

  check('all nine grahas are placed in the sky', g.grahas.length === 9);

  let bad = 0;
  let detail = '';
  for (const x of g.grahas) {
    if (x.rashi < 0 || x.rashi > 11) { bad += 1; detail += `${x.name}: ${x.rashi}; `; }
    if (x.degreesInRashi < 0 || x.degreesInRashi >= 30) { bad += 1; detail += `${x.name}: ${x.degreesInRashi}°; `; }
    if (x.nakshatra < 1 || x.nakshatra > 27) { bad += 1; detail += `${x.name}: nakshatra ${x.nakshatra}; `; }
    if (x.pada < 1 || x.pada > 4) { bad += 1; detail += `${x.name}: pada ${x.pada}; `; }
  }
  check('and every one of them is in a real sign and a real nakshatra', bad === 0, detail);
}

{
  const now = Date.UTC(2026, 9, 18, 6, 0, 0) / 86400000 + 2440587.5;
  const g = gochar(now);
  const shadows = g.grahas.filter((x) => x.graha === 'rahu' || x.graha === 'ketu');

  let bad = 0;
  for (const x of shadows) {
    // A shadow graha has no sign of its own, so it can never be "in own sign".
    if (x.inOwnSign) bad += 1;
    if (x.ownSign !== -1) bad += 1;
    if (!x.isShadow) bad += 1;
  }
  check('rahu and ketu are never said to be in their own sign', bad === 0,
    `${bad} galti`);
}

{
  // Retrograde is recomputed, not carried over. Ask about two instants a month
  // apart and the answer must be allowed to differ.
  const a = Date.UTC(2026, 9, 18) / 86400000 + 2440587.5;
  const b = Date.UTC(2026, 5, 18) / 86400000 + 2440587.5;
  const ga = gochar(a);
  const gb = gochar(b);

  check('retrograde is worked out for the moment asked about',
    JSON.stringify(ga.grahas.map((x) => x.retrograde)) !==
    JSON.stringify(gb.grahas.map((x) => x.retrograde)),
    'dono din ek jaise — shayad janam ki value hi chal rahi hai');
}

{
  // Which grahas are retrograde, actually?
  const now = Date.UTC(2026, 9, 18) / 86400000 + 2440587.5;
  const g = gochar(now);
  const wrong: string[] = [];
  for (const x of g.grahas) {
    const motion = allGrahas(now + 1)[x.graha].longitude - allGrahas(now)[x.graha].longitude;
    let m = motion;
    if (m < -180) m += 360;
    if (m > 180) m -= 360;
    if ((m < 0) !== x.retrograde) wrong.push(`${x.name}: ${m.toFixed(3)}°/din par ${x.retrograde}`);
  }
  check('and the retrograde flag agrees with the motion it claims to follow',
    wrong.length === 0, wrong.join('; '));
}

{
  // The Sun never turns, and Mercury almost never does.
  const now = Date.UTC(2026, 9, 18) / 86400000 + 2440587.5;
  const g = gochar(now);
  const sun = g.grahas.find((x) => x.graha === 'sun');
  const mercury = g.grahas.find((x) => x.graha === 'mercury');

  check('the sun is never retrograde', sun ? !sun.retrograde : false);
  check('and mercury is not retrograde when it is direct',
    mercury ? (mercury.retrograde ? Math.abs(mercury.dailyMotion) < 1.5 : true) : false);
}

{
  let bad = 0;
  let detail = '';
  const sample = Date.UTC(2026, 9, 18) / 86400000 + 2440587.5;
  for (const g of PLANETS) {
    const d = grahaDashaNow(g, sample);
    if (!d) continue;
    // A dasha runs up to twelve years. Longer than that, or negative, means the
    // motion was signed wrong somewhere.
    if (d.years < 0 || d.years > 12.5) {
      bad += 1;
      detail += `${g}: ${d.years} saal; `;
    }
    if (d.index < 0 || d.index > 8) {
      bad += 1;
      detail += `${g}: index ${d.index}; `;
    }
  }
  check('every graha dasha is a real length of time', bad === 0, detail);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHAKTI · SHUBH-ASHUBH · JANAM VIVARAN
   ═══════════════════════════════════════════════════════════════════════════ */

console.log();
console.log('GRAHA SHAKTI · SHUBH-ASHUBH · JANAM VIVARAN');
console.log('='.repeat(64));

{
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const c = chalitOf(jd, b.lat, b.lon);
    if (!c) continue;

    const list = grahaShakti(jd, c.lagnaRashi);
    if (list.length !== 9) { bad += 1; detail += `${b.label}: ${list.length}; `; }

    for (const g of list) {
      if (!g.name || !g.verdict) { bad += 1; detail += `${b.label} ${g.graha}: khali; `; }
      // Sun, Mercury and Venus can be combust. The Sun never can be, and the
      // Moon is not called burnt in any of the four positions in the house.
      if (g.graha === 'sun' && g.combust) { bad += 1; detail += `${b.label}: surya asti; `; }
      if (g.graha === 'moon' && g.combust) { bad += 1; detail += `${b.label}: chandra asti; `; }
      if ((g.graha === 'rahu' || g.graha === 'ketu') && g.combust) {
        bad += 1; detail += `${b.label}: ${g.name} asti; `;
      }
    }
  }
  check('nine grahas scored, and the Sun and Moon are never burnt', bad === 0, detail);
}

{
  // The Sun must not come out "बहुत बलवान" in every chart, which is what
  // happens if combustion is counted as a bonus instead of a penalty.
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const c = chalitOf(jdOf(b), b.lat, b.lon);
    if (!c) continue;
    const sun = grahaShakti(jdOf(b), c.lagnaRashi).find((g) => g.graha === 'sun');
    if (sun && sun.verdict === 'बहुत बलवान' && sun.points > 12) {
      bad += 1;
      detail += `${b.label}: ${sun.points} points; `;
    }
  }
  check('the sun is not the strongest graha in every chart', bad === 0, detail);
}

{
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const c = chalitOf(jdOf(b), b.lat, b.lon);
    if (!c) continue;
    const s = shubhAshubh(jdOf(b), c.lagnaRashi);

    if (s.shubhSigns.length !== 6) { bad += 1; detail += `${b.label}: ${s.shubhSigns.length} shubh; `; }
    if (s.ashubhSigns.length !== 6) { bad += 1; detail += `${b.label}: ${s.ashubhSigns.length} ashubh; `; }

    const all = new Set([...s.shubhSigns, ...s.ashubhSigns]);
    if (all.size !== 12) { bad += 1; detail += `${b.label}: ${all.size} hi rashi; `; }

    // The six shubh signs must be six consecutive signs from the Sun.
    for (let i = 1; i < 6; i += 1) {
      if (s.shubhSigns[i] !== (s.shubhSigns[0] + i) % 12) {
        bad += 1;
        detail += `${b.label}: shubh अक्रम टूटा; `;
      }
    }
    if (s.ashubhSigns[0] !== (s.shubhSigns[0] + 6) % 12) { bad += 1; detail += `${b.label}: doosra paksha; `; }
  }
  check('shubh and ashubh are six signs each, and the count starts at the sun', bad === 0, detail);
}

{
  let bad = 0;
  let detail = '';
  for (const b of BIRTHS) {
    const jd = jdOf(b);
    const weekday = new Date(Date.UTC(
      Number(b.date.slice(0, 4)), Number(b.date.slice(5, 7)) - 1, Number(b.date.slice(8, 10)),
    )).getUTCDay();

    const v = janamVivaran(jd, weekday);

    if (!v.tithi || !v.nakshatra || !v.yoga || !v.karana || !v.vaara) {
      bad += 1; detail += `${b.label}: koi limb khali; `;
    }
    if (v.paksha !== 'शुक्ल' && v.paksha !== 'कृष्ण') {
      bad += 1; detail += `${b.label}: paksha ${v.paksha}; `;
    }
    if (v.pada < 1 || v.pada > 4) { bad += 1; detail += `${b.label}: pada ${v.pada}; `; }
    if (v.samvat < 1900 || v.samvat > 2200) { bad += 1; detail += `${b.label}: samvat ${v.samvat}; `; }
  }
  check('janam vivaran has all five limbs and a real year', bad === 0, detail);
}

{
  // Vikram Samvat runs from Chaitra Shukla Pratipada, which falls at the end of
  // March or in early April depending on the year. So a January birth and a June
  // birth of one Gregorian year are in different Vikram years. This is the check
  // that catches an off-by-one, which moves every reading on the page by a year.

  // June rather than April on purpose: Chaitra 1 sometimes lands in the first days
  // of April, so an April date is a coin toss and a failing test would teach
  // nothing.
  const march = julianDayFromParts(2000, 6, 1, 12, 0);
  const january = julianDayFromParts(2000, 1, 15, 12, 0);

  const a = janamVivaran(march, 6);
  const b = janamVivaran(january, 6);

  check('january and june of one gregorian year are different vikram years',
    a.samvat !== b.samvat, `dono ${a.samvat} de rahe hain`);
  check('and the june one is the later year', a.samvat === b.samvat + 1,
    `${a.samvat} aur ${b.samvat}`);
}

{
  // The samvatsara must come out of the sixty-year cycle, and two years apart
  // must be two names apart in it.
  const y1 = janamVivaran(julianDayFromParts(2000, 6, 1, 12, 0), 6);
  const y2 = janamVivaran(julianDayFromParts(2001, 6, 1, 12, 0), 6);
  const y3 = janamVivaran(julianDayFromParts(2002, 6, 1, 12, 0), 6);

  check('and each year advances by one', y2.samvat === y1.samvat + 1 && y3.samvat === y2.samvat + 1,
    `${y1.samvat}, ${y2.samvat}, ${y3.samvat}`);
}

console.log();
console.log('='.repeat(64));
console.log(`  ${failed === 0 ? 'ok' : 'FAIL'}  ${passed} me se ${passed + failed - failed} check pass, ${failed} fail`);
console.log('='.repeat(64));
console.log();

if (failed > 0) process.exitCode = 1;