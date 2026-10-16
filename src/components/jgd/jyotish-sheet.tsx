'use client';

import * as React from 'react';

import {
  allGrahas,
  lagna as lagnaOf,
  houseOf,
  aspectingGrahas,
  GRAHA_NAMES,
  PLANETS,
  type Planet,
  type GrahaPosition,
} from '@/content/grahas';
import type { Gender } from '@/content/kp';
import { formatDate } from '@/content/numerology';
import { RASHIS, NAKSHATRAS } from '@/content/astrology';
import { julianDayFromParts } from '@/content/julian';
import { vimshottari, antardashas, DASHA_ORDER } from '@/content/dasha';
import { phaladesh } from '@/content/phaladesh';
import { findYogas, type YogaStrength } from '@/content/yoga';
import { shodasvarga, VARGAS } from '@/content/shodasvarga';
import { kpSystem } from '@/content/kp';
import { lalKitab, lalKitabDisagreements } from '@/content/lalkitab';
import { ankaJyotish, allAnkaMeanings } from '@/content/anka';
import {
  ankaProfile,
  reduce9,
  reduce52,
  upayFor,
  shatruAnk,
  DEV_GRAHA,
  ANUKOOL,
  LOSH_ARMS,
  MASTERS,
  type LoshGrid,
} from '@/content/ankaganit';

/**
 * ===========================================================================
 *  THE FULL JYOTISH SHEET
 * ===========================================================================
 *
 * Nine systems on one birth, behind tabs, computed in the browser.
 *
 * ── Why it is one page and not nine ─────────────────────────────────────────
 *
 * Because they all read the same chart, and a reader who has just been told
 * that Venus rules their tenth house does not want to go and type the same date
 * into a different page to be told that Jupiter rules their ninth. The systems
 * disagree — that is the interesting part — and disagreement is only visible
 * when the answers sit side by side.
 *
 * ── Why it runs in the browser ──────────────────────────────────────────────
 *
 * A birth date, a birth time and a birth place together identify one person.
 * Nothing here needs a server, so nothing goes to one. See the note in
 * janam-ghathe.tsx. That also means the whole sheet renders in one frame with
 * no loading state and no failure mode where the server is down.
 *
 * ── What the page will not do ──────────────────────────────────────────────
 *
 * It will not present two systems that disagree as though one of them were
 * right. Where they differ, both are shown with their names attached.
 */

export interface JyotishInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  name: string;
  gender: Gender;
}

type TabKey =
  | 'kundali' | 'dasha' | 'phaladesh' | 'yoga'
  | 'shodasvarga' | 'kp' | 'lalkitab' | 'anka';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'kundali', label: 'कुंडली' },
  { key: 'dasha', label: 'विमशोत्तरी दशा' },
  { key: 'phaladesh', label: 'फलादेश' },
  { key: 'yoga', label: 'योग' },
  { key: 'shodasvarga', label: 'शोडशवर्ग' },
  { key: 'kp', label: 'केपी' },
  { key: 'lalkitab', label: 'लाल किताब' },
  { key: 'anka', label: 'अंक ज्योतिष' },
];

/*
 * How strong a yoga is, as words and as a colour.
 *
 * Only the tints that exist as utilities in globals.css are used here. Three
 * invented colour names were used first — jade, rust and stone — none of which
 * exist as tokens, so all three badges rendered as unstyled text on white and
 * the one thing on the page a reader scans for looked like it had not loaded.
 */
const STRENGTH: Record<YogaStrength, { label: string; className: string }> = {
  strong: { label: 'प्रबल', className: 'bg-leaf-soft text-leaf' },
  mixed: { label: 'मिश्रित', className: 'bg-amber-soft text-saffron-deep' },
  weak: { label: 'दुर्बल', className: 'bg-rose-soft text-rose' },
  cancelled: { label: 'निरस्त', className: 'bg-saffron-soft text-ink-subtle' },
};

export function JyotishSheet({ input }: { input: JyotishInput }) {
  const [tab, setTab] = React.useState<TabKey>('kundali');

  /*
   * Everything is derived, once, in one memo.
   *
   * Nine engines each call allGrahas, which is the expensive part — twenty
   * trigonometric series per planet. Running them independently meant nine times
   * the work on every keystroke that changed the tab, and the whole sheet was
   * recalculated whenever the reader opened a different section.
   */
  const chart = React.useMemo(() => buildChart(input), [input]);

  return (
    <section className="card mt-6 p-5 sm:p-8 print:p-0 print:border-0">
      <h2 className="font-display text-2xl">पूरी ज्योतिश कुंडली</h2>
      <p className="mt-2 text-sm text-ink-subtle">
        एक ही जन्म-कुंडली पर आठ पद्धतियाँ। जहाँ कोई दो अलग कहें, वहाँ दोनों दिखाई गई हैं — किसी
        एक को सही बताने का कोई कारण नहीं है।
      </p>

      {/*
        The date, written out.

        Not decoration. A chart that reads the wrong day is a chart that looks
        entirely correct — right shape, right signs, wrong answer — and the one
        way to tell at a glance is to show the day that was actually used. It
        was asked for after somebody reported that the numbers were coming out
        for a different date, and it is the check that would have shown it.
      */}
      <p className="mt-3 rounded-lg bg-sun/10 px-4 py-2 text-sm">
        <span className="text-ink-subtle">जन्म-कुंडली में लिया गया दिन:</span>{' '}
        <strong className="tabular-nums">
          {formatDate({ year: input.year, month: input.month, day: input.day })}
        </strong>{' '}
        <span className="text-ink-subtle">
          · {String(input.day).padStart(2, '0')}/{String(input.month).padStart(2, '0')}/{input.year}
        </span>
      </p>

      <div className="mt-5 flex flex-wrap gap-2 print:hidden" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={
              tab === t.key
                ? 'rounded-full bg-saffron px-4 py-2 text-sm font-medium text-ink'
                : 'rounded-full border border-line px-4 py-2 text-sm hover:bg-sun/10'
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'kundali' && <Kundali chart={chart} />}
        {tab === 'dasha' && <Dasha chart={chart} />}
        {tab === 'phaladesh' && <Phaladesh chart={chart} />}
        {tab === 'yoga' && <YogaPanel chart={chart} />}
        {tab === 'shodasvarga' && <ShodasvargaPanel chart={chart} />}
        {tab === 'kp' && <KpPanel chart={chart} />}
        {tab === 'lalkitab' && <LalKitabPanel chart={chart} />}
        {tab === 'anka' && <AnkaPanel chart={chart} />}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* One pass over the engines                                                   */
/* -------------------------------------------------------------------------- */

interface Chart {
  input: JyotishInput;
  jd: number;
  grahas: Record<Planet, GrahaPosition>;
  lagnaDeg: number;
  lagnaRashi: number;
  houses: Record<Planet, number>;
  yogas: ReturnType<typeof findYogas>;
  kp: ReturnType<typeof kpSystem>;
  varga: ReturnType<typeof shodasvarga>;
  lal: ReturnType<typeof lalKitab>;
  lalNotes: string[];
  anka: ReturnType<typeof ankaJyotish>;
}

function buildChart(input: JyotishInput): Chart {
  const jd = julianDayFromParts(
    input.year, input.month, input.day, input.hour, input.minute,
  );
  const grahas = allGrahas(jd);
  const lagnaDeg = lagnaOf(jd, input.latitude, input.longitude);
  const lagnaRashi = Math.floor(lagnaDeg / 30) % 12;

  const houses = {} as Record<Planet, number>;
  for (const p of PLANETS) {
    houses[p] = houseOf(grahas[p].rashi, lagnaRashi);
  }

  return {
    input,
    jd,
    grahas,
    lagnaDeg,
    lagnaRashi,
    houses,
    yogas: findYogas(jd, lagnaRashi),
    kp: kpSystem(jd, lagnaDeg, input.gender),
    varga: shodasvarga(grahas),
    lal: lalKitab(jd),
    lalNotes: lalKitabDisagreements(grahas),
    anka: ankaJyotish(input.day, input.month, input.year, input.name || 'A'),
  };
}

/* -------------------------------------------------------------------------- */
/* 1. The chart itself                                                         */
/* -------------------------------------------------------------------------- */

function Kundali({ chart }: { chart: Chart }) {
  return (
    <div className="grid gap-6">
      <div className="rounded-lg bg-saffron/10 p-5">
        <p className="text-sm text-ink-subtle">लग्न (जन्म समय पर पूर्व क्षितिज)</p>
        <p className="font-display text-3xl">
          {RASHIS[chart.lagnaRashi].name}{' '}
          <span className="text-lg text-ink-subtle">{formatDegrees(chart.lagnaDeg % 30)}</span>
        </p>
        <p className="mt-1 text-sm text-ink-subtle">
          इसी से सारे भाव गिने जाते हैं। जन्म समय जितना सही, लग्न उतना सही।
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-line text-left">
              <th className="py-2 pr-3 font-medium">ग्रह</th>
              <th className="py-2 pr-3 font-medium">राशि</th>
              <th className="py-2 pr-3 font-medium">अंश</th>
              <th className="py-2 pr-3 font-medium">नक्षत्र / पाद</th>
              <th className="py-2 pr-3 font-medium">भाव</th>
              <th className="py-2 pr-3 font-medium">स्वामी</th>
              <th className="py-2 font-medium">दृष्टि</th>
            </tr>
          </thead>
          <tbody>
            {PLANETS.map((p) => {
              const pos = chart.grahas[p];
              const aspects = aspectingGrahas(p, chart.grahas);
              return (
                <tr key={p} className="border-b border-line">
                  <td className="py-2 pr-3 font-medium">{GRAHA_NAMES[p].hindi}</td>
                  <td className="py-2 pr-3">{RASHIS[pos.rashi].name}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatDegrees(pos.degreesInRashi)}</td>
                  <td className="py-2 pr-3">
                    {NAKSHATRAS[pos.nakshatra - 1] ?? pos.nakshatra}
                    <span className="text-ink-subtle"> · {pos.pada}</span>
                  </td>
                  <td className="py-2 pr-3">{chart.houses[p]}</td>
                  <td className="py-2 pr-3 text-ink-subtle">{GRAHA_NAMES[pos.lord as Planet]?.hindi}</td>
                  <td className="py-2 text-ink-subtle">
                    {aspects.length === 0 ? '—' : aspects.map((a) => GRAHA_NAMES[a].hindi).join(', ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Note>
        ग्रहों की स्थिति श्रीकृष्णमूर्ति अयनांश से निकाली गई है — वह नाप बिल्कुल शुद्ध नहीं है, पर
        नक्षत्र और दशा के लिए पर्याप्त है। शोडशवर्ग, केपी और लाल किताब अपने-अपने नियम अलग हैं, इसलिए
        तीनों का फल एक-दूसरे से मेल नहीं खाता और मेल खाने की कोशिश भी नहीं की गई।
      </Note>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Vimshottari dasha                                                        */
/* -------------------------------------------------------------------------- */

function Dasha({ chart }: { chart: Chart }) {
  const result = vimshottari(chart.jd, chart.input.year);
  const now = new Date().getUTCFullYear();

  return (
    <div className="grid gap-5">
      <p className="text-sm text-ink-subtle">
        चंद्र की स्थिति से शुरू होकर नौ ग्रहों की क्रमबद्ध दशा, पूरे 120 वर्ष की। आप अभी{' '}
        <strong className="text-saffron-deep">{GRAHA_NAMES[result.current?.graha ?? 'sun'].hindi}</strong>{' '}
        की दशा में हैं।
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-line text-left">
              <th className="py-2 pr-3 font-medium">महादशा</th>
              <th className="py-2 pr-3 font-medium">कब से</th>
              <th className="py-2 pr-3 font-medium">कब तक</th>
              <th className="py-2 pr-3 font-medium">अंतरदशा</th>
              <th className="py-2 font-medium">अवस्था</th>
            </tr>
          </thead>
          <tbody>
            {result.periods.map((p) => {
              const running = now >= p.startYear && now < p.endYear;
              const sub = antardashas(p, chart.grahas);
              return (
                <tr key={p.graha} className={running ? 'bg-saffron/10' : ''}>
                  <td className="py-2 pr-3 font-medium">{GRAHA_NAMES[p.graha].hindi}</td>
                  <td className="py-2 pr-3 tabular-nums">{Math.floor(p.startYear)}</td>
                  <td className="py-2 pr-3 tabular-nums">{Math.floor(p.endYear)}</td>
                  <td className="py-2 pr-3">
                    <details>
                      <summary className="cursor-pointer text-ink-subtle">
                        9 उप-दशा देखें
                      </summary>
                      <ul className="mt-1 grid gap-0.5">
                        {sub.map((s) => (
                          <li key={s.graha} className="flex justify-between gap-3">
                            <span>{GRAHA_NAMES[s.graha].hindi}</span>
                            <span className="tabular-nums text-ink-subtle">
                              {s.startYear.toFixed(1)}–{s.endYear.toFixed(1)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td className="py-2">
                    {running ? (
                      <span className="rounded-full bg-saffron px-2 py-0.5 text-xs font-medium">
                        अभी
                      </span>
                    ) : (
                      <span className="text-ink-subtle">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Note>
        दशा का क्रम शाश्वत है — केतु, शुक्र, सूर्य, चंद्र, मंगल, राहु, बृहस्पति, शनि, बुध। हर
        उप-दशा उसी ग्रह का अपने 120 वर्ष के हिस्से के अनुपात से निकलती है, इसलिए नौ उप-दशाओं का
        जोड़ हमेशा महादशा के बराबर आता है।
      </Note>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Phaladesh                                                                */
/* -------------------------------------------------------------------------- */

function Phaladesh({ chart }: { chart: Chart }) {
  const result = vimshottari(chart.jd, chart.input.year);
  const [open, setOpen] = React.useState<Planet | null>(result.current?.graha ?? null);

  return (
    <div className="grid gap-5">
      <p className="text-sm text-ink-subtle">
        हर महादशा बीस भागों में बँटती है। राशि पीछे की ओर चलती है और ग्रह आगे की ओर, इसलिए पहला
        फला हमेशा दशा के स्वामी का अपना होता है।
      </p>

      <div className="flex flex-wrap gap-2">
        {result.periods.map((p) => (
          <button
            key={p.graha}
            type="button"
            onClick={() => setOpen(p.graha)}
            className={
              open === p.graha
                ? 'rounded-full bg-saffron px-3 py-1 text-sm font-medium'
                : 'rounded-full border border-line px-3 py-1 text-sm'
            }
          >
            {GRAHA_NAMES[p.graha].hindi}
          </button>
        ))}
      </div>

      {open &&
        (() => {
          const period = result.periods.find((p) => p.graha === open)!;
          const ph = phaladesh(period.graha, period.startYear, period.endYear, chart.grahas);
          return (
            <ul className="grid gap-2">
              {ph.periods.map((p, i) => (
                <li key={i} className="rounded-lg border border-line p-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-medium">{p.headline}</span>
                    <span className="text-sm text-ink-subtle">
                      {GRAHA_NAMES[p.graha].hindi} · {RASHIS[p.rashi].name} ·{' '}
                      <span className="tabular-nums">
                        {Math.floor(p.startYear)}–{Math.floor(p.endYear)}
                      </span>
                    </span>
                  </div>
                  <p className="mt-2">{p.detail}</p>
                  <p className="mt-2 border-t border-line pt-2 text-sm text-ink-subtle">
                    {p.limit}
                  </p>
                </li>
              ))}
            </ul>
          );
        })()}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Yogas                                                                    */
/* -------------------------------------------------------------------------- */

function YogaPanel({ chart }: { chart: Chart }) {
  if (chart.yogas.length === 0) {
    return (
      <p className="text-ink-subtle">
        इस कुंडली में कोई उल्लेखनीय योग नहीं बन रहा। यह कमी नहीं है — हर कुंडली में सब योग नहीं होते।
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {chart.yogas.map((y) => {
        const s = STRENGTH[y.strength];
        return (
          <li key={y.name} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg">{y.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}>
                {s.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-subtle">{y.summary}</p>
            <p className="mt-2">{y.effect}</p>
            {y.note && (
              <p className="mt-2 border-t border-line pt-2 text-sm text-saffron-deep">{y.note}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Shodasvarga                                                              */
/* -------------------------------------------------------------------------- */

function ShodasvargaPanel({ chart }: { chart: Chart }) {
  return (
    <div className="grid gap-5">
      <p className="text-sm text-ink-subtle">
        हर ग्रह का एक नहीं, सोलह स्थान होता है — राशि को बारह बार, नौ बार, तीस बार, साठ बार तक बाँटा
        गया है। जहाँ बड़ी राशि और बारीक विभाग एक-दूसरे से मिलते हैं, वहाँ ग्रह मज़बूत माना जाता है।
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-line">
              <th className="py-2 pr-2 text-left font-medium">ग्रह</th>
              {VARGAS.map((v) => (
                <th key={v.key} className="px-1 py-2 text-center font-medium" title={v.about}>
                  {v.key}
                </th>
              ))}
              <th className="px-2 py-2 text-left font-medium">निष्कर्ष</th>
            </tr>
          </thead>
          <tbody>
            {chart.varga.grahas.map((g) => (
              <tr key={g.graha} className="border-b border-line align-top">
                <td className="py-2 pr-2 font-medium">{GRAHA_NAMES[g.graha].hindi}</td>
                {VARGAS.map((v) => {
                  const same = g.signs[v.key] === chart.grahas[g.graha].rashi;
                  return (
                    <td
                      key={v.key}
                      className={
                        'px-1 py-2 text-center tabular-nums ' +
                        (same ? 'font-medium text-saffron-deep' : 'text-ink-subtle')
                      }
                    >
                      {RASHIS[g.signs[v.key]].name}
                    </td>
                  );
                })}
                <td className="px-2 py-2">{g.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="rounded-lg bg-sun/10 p-4 text-sm">
        <summary className="cursor-pointer font-medium">हर विभाग किस बात का है</summary>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {VARGAS.map((v) => (
            <li key={v.key}>
              <span className="font-medium">{v.key} · {v.title}</span> — {v.about}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. KP                                                                       */
/* -------------------------------------------------------------------------- */

function KpPanel({ chart }: { chart: Chart }) {
  const kp = chart.kp;

  return (
    <div className="grid gap-5">
      <div className="rounded-lg bg-saffron/10 p-5">
        <p className="text-sm text-ink-subtle">चंद्र की राशि का स्वामी — केपी में पूरी कुंडली का राजा</p>
        <p className="font-display text-3xl">{GRAHA_NAMES[kp.rashiLord].hindi}</p>
        <p className="mt-1 text-sm text-ink-subtle">
          सब लोर्ड: <strong>{GRAHA_NAMES[kp.subLord].hindi}</strong> — केपी में सब लोर्ड सबसे पहले
          देखा जाता है, राशि के स्वामी से भी पहले।
        </p>
      </div>

      {kp.marriage && (
        <div className="rounded-lg border border-line p-4">
          <h3 className="font-medium">सप्तम भाव — शादी का कराका</h3>
          <p className="mt-2">{kp.marriage.verdict}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-line text-left">
              <th className="py-2 pr-3 font-medium">ग्रह</th>
              <th className="py-2 pr-3 font-medium">राशि</th>
              <th className="py-2 pr-3 font-medium">प्रथम पकड़</th>
              <th className="py-2 pr-3 font-medium">सब लोर्ड</th>
              <th className="py-2 pr-3 font-medium">तृतीय पकड़</th>
              <th className="py-2 pr-3 font-medium">भाव</th>
              <th className="py-2 font-medium">निर्णय</th>
            </tr>
          </thead>
          <tbody>
            {kp.planets.map((p) => (
              <tr key={p.graha} className="border-b border-line align-top">
                <td className="py-2 pr-3 font-medium">
                  {GRAHA_NAMES[p.graha].hindi}
                  {!p.isKaraka && (
                    <span className="ml-1 text-xs text-ink-subtle">(निष्कर्षक नहीं)</span>
                  )}
                </td>
                <td className="py-2 pr-3">{RASHIS[p.rashi].name}</td>
                <td className="py-2 pr-3">{GRAHA_NAMES[p.pakad1].hindi}</td>
                <td
                  className={
                    'py-2 pr-3 ' + (p.subLord === p.graha ? 'font-medium text-saffron-deep' : '')
                  }
                >
                  {GRAHA_NAMES[p.subLord].hindi}
                </td>
                <td className="py-2 pr-3">{GRAHA_NAMES[p.pakad3Lord].hindi}</td>
                <td className="py-2 pr-3 tabular-nums">{p.bhava}</td>
                <td className="py-2">{p.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-line p-4">
        <h3 className="font-medium">क्रम से कराका</h3>
        <p className="mt-1 text-sm text-ink-subtle">
          कराका वह ग्रह है जिसका सब लोर्ड उससे सबसे गहरा जुड़ाव दिखाता है — यानी जो भाव का सच्चा
          परिणाम देता है।
        </p>
        <ol className="mt-3 grid gap-1">
          {kp.karakas.map((p, i) => (
            <li key={p.graha} className="flex gap-3 border-b border-line py-1">
              <span className="w-6 tabular-nums text-ink-subtle">{i + 1}</span>
              <span className="font-medium">{GRAHA_NAMES[p.graha].hindi}</span>
              <span className="text-ink-subtle">{p.result}</span>
            </li>
          ))}
        </ol>
      </div>

      <Note>
        केपी के भीतर भी मतभेद हैं — कराका के क्रम और भाव के परिणामों के बारे में। यहाँ वही चलाया गया
        है जो भारत में सबसे आम है, और यह बताया गया है ताकि पाठक जान सके कि कौन-सी व्याख्या चल रही है।
      </Note>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Lal Kitab                                                                */
/* -------------------------------------------------------------------------- */

function LalKitabPanel({ chart }: { chart: Chart }) {
  return (
    <div className="grid gap-5">
      <p className="text-sm text-ink-subtle">
        लाल किताब ग्रह-राशि नहीं, आदतें देखता है। यह भविष्यवाणी नहीं करता — यह बताता है कि आप
        सामान्यतः कैसा व्यवहार करते हैं।
      </p>

      {chart.lal.length === 0 ? (
        <p className="text-ink-subtle">इस कुंडली में कोई विशेष वाक्य नहीं बन रहा।</p>
      ) : (
        <ul className="grid gap-3">
          {chart.lal.map((s) => (
            <li key={s.id} className="rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="rounded bg-saffron-soft px-1.5 py-0.5 text-xs tabular-nums">
                  {s.id}
                </span>
                <span className="font-medium">{s.grahaHindi}</span>
                <span className="text-sm text-ink-subtle">
                  नवांश {RASHIS[s.navamsa].name}
                </span>
              </div>
              <p className="mt-2">{s.statement}</p>
              <p className="mt-2 text-sm text-saffron-deep">{s.advice}</p>
            </li>
          ))}
        </ul>
      )}

      {chart.lalNotes.length > 0 && (
        <div className="rounded-lg bg-sun/10 p-4 text-sm">
          <h3 className="font-medium">जहाँ लाल किताब पारंपरिक हिसाब से अलग कहता है</h3>
          <ul className="mt-2 grid gap-1">
            {chart.lalNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Anka Jyotish and the whole of Anka Ganit                               */
/* -------------------------------------------------------------------------- */

/**
 * The reading itself — what number each part of the date and the name gave, and
 * what the two together say. Kept exactly as it was, because it was not what
 * was wrong.
 */
function AnkaPanel({ chart }: { chart: Chart }) {
  const { anka } = chart;
  const meanings = allAnkaMeanings();

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { n: anka.fromDate, m: anka.dateMeaning, label: 'जन्म-तिथि का अंक' },
          { n: anka.fromName, m: anka.nameMeaning, label: 'नाम का अंक' },
        ].map((entry) => (
          <div key={entry.label} className="rounded-lg bg-saffron/10 p-5">
            <p className="text-sm text-ink-subtle">{entry.label}</p>
            <p className="font-display text-5xl text-saffron-deep">{entry.n}</p>
            <p className="mt-1 font-medium">{entry.m.title}</p>
            <p className="mt-1">{entry.m.line}</p>
            <p className="mt-2">{entry.m.body}</p>
            <p className="mt-3 border-t border-line pt-2 text-sm">
              <strong>कमज़ोरी:</strong> {entry.m.shadow}
            </p>
            <p className="mt-1 text-sm text-saffron-deep">{entry.m.remedy}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-ink-subtle">{anka.reading}</p>

      <details className="rounded-lg border border-line p-4">
        <summary className="cursor-pointer font-medium">
          पूरे 52 अंकों की सूची देखें
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-line text-left">
                <th className="py-2 pr-3 font-medium">अंक</th>
                <th className="py-2 pr-3 font-medium">नाम</th>
                <th className="py-2 font-medium">सार</th>
              </tr>
            </thead>
            <tbody>
              {meanings.map((m) => (
                <tr
                  key={m.number}
                  className={
                    'border-b border-line ' +
                    (m.number === anka.fromDate || m.number === anka.fromName
                      ? 'bg-saffron/10'
                      : '')
                  }
                >
                  <td className="py-2 pr-3 font-medium tabular-nums">{m.number}</td>
                  <td className="py-2 pr-3">{m.title}</td>
                  <td className="py-2">{m.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <AnkaGanit chart={chart} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Everything else that Anka Ganit is.
 *
 * A person asking for Anka Ganit is asking for the sum of it. The reading above
 * answers "what is my number" and stops. This answers the other questions that
 * are asked at the same sitting: what else came out of the date, what does the
 * grid of my date look like, which numbers help me and which hinder, and what
 * do I do about it.
 *
 * Every figure on this panel is computed in `content/ankaganit.ts` and checked
 * in `scripts/test-ankaganit.ts`. Nothing here is worked out by hand at the
 * point of display, because a hand-worked number on a page is a number that
 * will be wrong the next time the page is touched.
 */
function AnkaGanit({ chart }: { chart: Chart }) {
  const profile = ankaProfile(chart.input.day, chart.input.month, chart.input.year, chart.input.name || 'A');
  const meanings = allAnkaMeanings();
  const ruling = profile.bhavAnk.value;
  const birthNumber = profile.janmAnk.value;

  /** The cell of the Losh cross holding a given digit. */
  const byDigit = (digit: number) =>
    profile.losh.cells.find((cell) => cell.digit === digit) ?? {
      digit,
      arm: 'centre' as const,
      count: 0,
    };
  const upay = upayFor(ruling);
  const friends = ANUKOOL[ruling] ?? [];
  const enemies = shatruAnk(ruling);
  const devGraha = DEV_GRAHA[ruling - 1];
  const master = MASTERS[profile.bhavAnk.compound ?? 0];

  const numbers = [
    { label: 'जन्म अंक (दिन)', n: profile.janmAnk, hint: 'जन्म के दिन से निकला अंक' },
    { label: 'मासांक', n: { value: reduce9(chart.input.month), compound: reduce52(chart.input.month) }, hint: 'जन्म के महीने से' },
    { label: 'वर्षांक', n: { value: reduce9(chart.input.year), compound: reduce52(chart.input.year) }, hint: 'जन्म के साल से' },
    { label: 'भवांक / मूलांक', n: profile.bhavAnk, hint: 'दिन + महीना + साल — जीवन की मुख्य अंक' },
    { label: 'कर्मांक', n: profile.karmAnk, hint: 'दिन + महीना — पिछले से लाया हुआ' },
    { label: 'नाम अंक', n: profile.naamAnk, hint: 'नाम, ख़ल्दानी पद्धति से' },
    { label: 'लेख अंक', n: profile.lekhaAnk, hint: `नाम में ${profile.lekhaAnk.compound ?? 0} अक्षर` },
    { label: 'कुल अंक', n: profile.kulAnk, hint: 'तारीख़ के सारे अंक जोड़कर' },
  ];

  return (
    <div className="grid gap-6 border-t border-line pt-6">

      {/* ------------------------------------------------------- the numbers */}
      <section>
        <h3 className="font-display text-lg">तारीख़ से निकले सारे अंक</h3>
        <p className="mt-1 text-sm text-ink-subtle">
          एक तारीख़ से एक नहीं, आठ अंक निकलते हैं। हर एक कुछ अलग बताता है।
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((item) => {
            const isRuling = item.label === 'भवांक / मूलांक';
            return (
              <div
                key={item.label}
                className={
                  'rounded-lg border p-4 ' +
                  (isRuling ? 'border-saffron bg-saffron/10' : 'border-line')
                }
              >
                <p className="text-xs text-ink-subtle">{item.label}</p>
                <p className="mt-1 font-display text-3xl text-saffron-deep tabular-nums">
                  {item.n.value}
                </p>
                {item.n.compound !== undefined && item.n.compound !== item.n.value && (
                  <p className="text-xs text-ink-muted">
                    यौगिक अंक <span className="tabular-nums">{item.n.compound}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-ink-subtle">{item.hint}</p>
              </div>
            );
          })}
        </div>

        {master && (
          <p className="mt-4 rounded-lg bg-saffron/10 p-4 text-sm">
            <strong>मास्टर अंक {profile.bhavAnk.compound}:</strong> {master.what}
            <br />
            {master.how}
          </p>
        )}

        <div className="mt-4 rounded-lg border border-line p-4">
          <p className="font-medium">इस साल का अंक</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {profile.varshAnk.map((y) => (
              <span key={y.year} className="text-sm">
                {y.year} → <strong className="tabular-nums text-saffron-deep">{y.value}</strong>
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-subtle">
            जो अंक बीच वाले साल का हो, उस साल काम बड़ा करना चाहिए और जो बाद का हो, उस
            साल ज़्यादा सोचना चाहिए।
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- the losh grid */}
      <section>
        <h3 className="font-display text-lg">लोश ग्रिड</h3>
        <p className="mt-1 text-sm text-ink-subtle">
          तारीख़ के हर अंक को गिनकर यह चौरा बनता है — हड्डी, लोहा, मांस, मज्जा और बीच
          में आपकी अपनी जगह। जिस अंक के खाने खाली हैं, वह अंक आपकी तारीख़ में नहीं है।
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr]">
          {/*
            The cross, drawn on a five-column grid so the arms sit where they
            sit on paper.

            Every cell is placed by column and row rather than in reading order.
            In reading order the seven cells fell into the first rows of a
            five-column grid and the metal and centre cells were pushed off the
            right-hand edge — the grid drew, the counts were right, and the shape
            was not the shape it is supposed to be. A grid that is not the right
            shape is read as a different reading, so the shape is stated here.
          */}
          <div className="mx-auto grid w-[19rem] max-w-full grid-cols-5 grid-rows-3 gap-1.5 text-center">
            <LoshCell cell={byDigit(3)} className="col-start-2 row-start-1" />
            <LoshCell cell={byDigit(4)} className="col-start-3 row-start-1" />
            <LoshCell cell={byDigit(9)} className="col-start-4 row-start-1" />

            <LoshCell cell={byDigit(1)} className="col-start-1 row-start-2" />
            <LoshCell cell={byDigit(5)} className="col-start-3 row-start-2" centre />
            <LoshCell cell={byDigit(6)} className="col-start-5 row-start-2" />

            <LoshCell cell={byDigit(8)} className="col-start-2 row-start-3" />
          </div>

          <div className="grid content-start gap-2">
            {LOSH_ARMS.map((arm) => (
              <div key={arm.arm} className="flex items-baseline gap-3 rounded-lg bg-sun/10 px-4 py-2">
                <span className="min-w-[5rem] font-medium">{arm.label}</span>
                <span className="min-w-[1.5rem] text-right font-display text-lg tabular-nums">
                  {profile.losh.arms[arm.arm]}
                </span>
                <span className="text-sm text-ink-subtle">{arm.what}</span>
              </div>
            ))}

            {profile.losh.missing.length > 0 && (
              <p className="mt-1 text-sm">
                तारीख़ में ये अंक नहीं हैं:{' '}
                <strong className="text-saffron-deep">
                  {profile.losh.missing.join(', ')}
                </strong>
                . इन अंकों से जुड़ी चीज़ें या तो कम हैं या आपने रास्ता बदला है।
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- the lo-shu square */}
      <section>
        <h3 className="font-display text-lg">लो-शु वर्ग</h3>
        <p className="mt-1 text-sm text-ink-subtle">
          एक से नौ तक के अंक इस वर्ग में ऐसे बैठते हैं कि हर पंक्ति, हर स्तंभ और दोनों
          विकर्ण — हर जगह जोड़ने पर पंद्रह आते हैं। आपका अंक कहाँ बैठा है, वह रंग से
          दिखाया गया है।
        </p>

        <div className="mt-4 grid w-[15rem] max-w-full grid-cols-3 gap-1.5 text-center">
          {profile.loShu.map((row, r) =>
            row.map((cell, c) => {
              const mine = r === profile.loShuCell.row && c === profile.loShuCell.col;
              return (
                <div
                  key={`${r}-${c}`}
                  className={
                    'grid aspect-square place-items-center rounded-lg font-display text-2xl ' +
                    (mine ? 'bg-saffron text-white' : 'bg-sun/15 text-ink')
                  }
                >
                  {cell}
                </div>
              );
            }),
          )}
        </div>
        <p className="mt-2 text-sm text-ink-subtle">
          आपका जन्म अंक <strong className="text-saffron-deep">{birthNumber}</strong> इसी वर्ग में
          पहचाना हुआ खाने पर है।
        </p>
      </section>

      {/* ------------------------------------------------------- the dev graha */}
      <section className="rounded-lg bg-saffron/10 p-5">
        <h3 className="font-display text-lg">
          अंक {ruling} — {devGraha.name}
        </h3>
        <p className="mt-2">{meanings.find((m) => m.number === ruling)?.line}</p>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p><strong>शरीर:</strong> {devGraha.body}</p>
          <p><strong>गुण:</strong> {devGraha.virtue}</p>
          <p><strong>दोष:</strong> {devGraha.vice}</p>
        </div>
      </section>

      {/* ------------------------------------------------- friends and enemies */}
      <section>
        <h3 className="font-display text-lg">अनुकूल और शत्रु अंक</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-leaf/40 bg-leaf/10 p-4">
            <p className="font-medium">अनुकूल — जो मदद करते हैं</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {friends.map((n) => (
                <AnkaChip key={n} n={n} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-rose/40 bg-rose/10 p-4">
            <p className="font-medium">शत्रु — जो रोकते हैं</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {enemies.map((n) => (
                <AnkaChip key={n} n={n} />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-subtle">
          मकान, गाड़ी, फ़ोन नंबर, बिज़ली का बिल — इनमें जहाँ अनुकूल अंक हो, वहाँ रखें।
        </p>
      </section>

      {/* ------------------------------------------------------------- the upay */}
      <section className="rounded-lg border-2 border-saffron p-5">
        <h3 className="font-display text-lg">उपाय — अंक {ruling} के लिए</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <p><strong>रत्न:</strong> {upay.stone}</p>
          <p><strong>रंग:</strong> {upay.colour}</p>
          <p><strong>शुभ दिन:</strong> {upay.day}</p>
          <p><strong>शुभ महीना:</strong> {upay.month}</p>
          <p><strong>शुभ तारीख़:</strong> <span className="tabular-nums">{upay.dates.join(', ')}</span> के दिन</p>
          <p><strong>मंत्र:</strong> {upay.mantra} का नाम लेकर बारह या बीस बार दोहराइए।</p>
        </div>
      </section>
    </div>
  );
}

/** One cell of the Losh cross: the digit's place, and how many times it occurs. */
function LoshCell({
  cell,
  centre = false,
  className = '',
}: {
  cell: LoshGrid['cells'][number];
  centre?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        'grid aspect-square place-items-center rounded-lg border ' +
        (centre ? 'border-saffron bg-saffron/15' : 'border-line bg-surface') +
        ' ' +
        className
      }
    >
      <div className="text-center leading-none">
        <div className="font-display text-xl text-saffron-deep tabular-nums">{cell.digit}</div>
        <div className="mt-1 font-display text-lg tabular-nums">{cell.count}</div>
      </div>
    </div>
  );
}

/** A number in a button-sized square. */
function AnkaChip({ n }: { n: number }) {
  const graha = DEV_GRAHA[n - 1];
  return (
    <span className="grid h-12 w-12 place-items-center rounded-lg border border-line bg-surface text-center">
      <span className="font-display text-lg tabular-nums">{n}</span>
      <span className="text-[0.6rem] text-ink-subtle">{graha?.name}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                 */
/* -------------------------------------------------------------------------- */

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-sun/10 p-4 text-sm text-ink-subtle print:bg-transparent print:p-0">
      {children}
    </p>
  );
}

function formatDegrees(degrees: number): string {
  const d = Math.floor(degrees);
  const m = Math.round((degrees - d) * 60);
  return `${d}° ${m}′`;
}

void DASHA_ORDER;
