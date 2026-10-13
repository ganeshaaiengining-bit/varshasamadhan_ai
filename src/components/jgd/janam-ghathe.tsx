'use client';

import * as React from 'react';
import { numerology, type BirthInput, type NumerologyResult } from '@/content/numerology';
import { vedic, gunMilan, RASHIS, type AstroResult, type GunResult } from '@/content/astrology';
import { useLanguage } from '@/components/language/language';

/**
 * ===========================================================================
 *  JANAM GATHE — name, date, time, place
 * ===========================================================================
 *
 * Numerology and Vedic astrology from what a person knows about a birth:
 * name, date, and if they have it, the time and the place.
 *
 * ── Why this runs in the browser and not on the server ─────────────────────
 *
 * A birth date, a name and a birth time together identify one person. Sending
 * that to a server puts it in a place the owner has to protect, and this
 * service's whole argument is that it is free, private and collects nothing.
 * Both engines in src/content are pure functions with no imports beyond each
 * other, so they run exactly the same in the browser as on a server, and
 * nothing about the calculation needs a machine elsewhere.
 *
 * So no form is submitted anywhere. There is no fetch, no action, no body. A
 * visitor who types a birth date and closes the tab has not told anyone.
 *
 * ── Why the time and place are optional and what they change ───────────────
 *
 * Without a time and place the result is still substantial: the life path
 * number, the name number, the soul number, the birthday number, the Moon's
 * nakshatra, its rashi and its lord. With them there is one more, the lagna,
 * and the lagna is the sign most people mean when they say "my star sign".
 *
 * Rather than making both fields mandatory, the form asks for them and then
 * says plainly what it could and could not work out. A visitor who does not
 * know their birth time is common, and a form that refuses to give them
 * anything would be refusing the common case.
 *
 * ── Why the limits are shown ──────────────────────────────────────────────
 *
 * Every result carries a `limit` string, written to say what the number does
 * not settle. They are rendered here rather than hidden, because a page that
 * only shows the flattering half is how people end up making decisions on a
 * number. The engine already refuses to return a number whose meaning it does
 * not have, so there is never a heading with nothing under it.
 */

/*
 * The stored result.
 *
 * `num` is not nullable even though the engine's return type is, because
 * onSubmit returns early when the engine refuses the date — a result is only
 * ever stored after both the engine and the guard agreed the date was usable.
 * Typing it as nullable here meant every use needed a null check that could
 * never fire, which is how a type gets quietly disabled instead of obeyed.
 */
interface Result {
  input: BirthInput;
  num: NumerologyResult;
  astro: AstroResult | null;
  gun: GunResult | null;
}

/** Rough centre of a named place, for the visitor who knows the city but not the coordinates. */
const PLACES: Array<{ name: string; lat: number; lon: number }> = [
  { name: 'Mumbai / मुंबई', lat: 19.076, lon: 72.8777 },
  { name: 'Delhi / दिल्ली', lat: 28.6139, lon: 77.209 },
  { name: 'Kolkata / कोलकाता', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai / चेन्नई', lat: 13.0827, lon: 80.2707 },
  { name: 'Bengaluru / बेंगलुरु', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad / हैदराबाद', lat: 17.385, lon: 78.4867 },
  { name: 'Pune / पुणे', lat: 18.5204, lon: 73.8567 },
  { name: 'Nagpur / नागपुर', lat: 21.1458, lon: 79.0882 },
  { name: 'Ahmedabad / अहमदाबाद', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur / जयपुर', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow / लखनऊ', lat: 26.8467, lon: 80.9462 },
  { name: 'Patna / पटना', lat: 25.5941, lon: 85.1376 },
  { name: 'Guwahati / गुवाहाटी', lat: 26.1445, lon: 91.7362 },
  { name: 'Kochi / कोच्चि', lat: 9.9312, lon: 76.2673 },
];

export function JanamGhathe() {
  const { t } = useLanguage();

  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [partnerName, setPartnerName] = React.useState('');
  const [partnerDate, setPartnerDate] = React.useState('');
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState<Result | null>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError(t('jgd.errDate'));
      return;
    }

    const input: BirthInput = { date, name: name.trim() || undefined };
    if (/^\d{2}:\d{2}$/.test(time)) input.time = time;

    const coords = PLACES.find((p) => p.name === place);
    if (coords) {
      input.latitude = coords.lat;
      input.longitude = coords.lon;
    }

    const num = numerology(input);
    if (!num) {
      setError(t('jgd.errDate'));
      return;
    }

    let gun: GunResult | null = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(partnerDate)) {
      const partnerNum = numerology({ date: partnerDate, name: partnerName.trim() || undefined });
      const partnerAstro = vedic({ date: partnerDate });
      const selfAstro = vedic(input);

      if (partnerNum && partnerAstro && selfAstro) {
        gun = gunMilan(
          {
            rashiIndex: RASHI_INDEX(selfAstro.rashi),
            nameNumber: num.nameNumber,
          },
          {
            rashiIndex: RASHI_INDEX(partnerAstro.rashi),
            nameNumber: partnerNum.nameNumber,
          },
        );
      }
    }

    setResult({ input, num, astro: vedic(input), gun });
  };

  const reset = () => {
    setResult(null);
    setName('');
    setDate('');
    setTime('');
    setPlace('');
    setPartnerName('');
    setPartnerDate('');
    setError('');
  };

  return (
    <div className="wrap-narrow py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl">{t('jgd.title')}</h1>
      <p className="mt-3 text-ink-subtle">{t('jgd.intro')}</p>

      {!result && (
        <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-6 sm:p-8">
          <div className="grid gap-2">
            <label htmlFor="jgd-name" className="font-medium">{t('jgd.nameLabel')}</label>
            <input
              id="jgd-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
              placeholder={t('jgd.namePlaceholder')}
            />
            <p className="text-sm text-ink-subtle">{t('jgd.nameHint')}</p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="jgd-date" className="font-medium">{t('jgd.dateLabel')}</label>
            <input
              id="jgd-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="jgd-time" className="font-medium">{t('jgd.timeLabel')}</label>
              <input
                id="jgd-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
              />
              <p className="text-sm text-ink-subtle">{t('jgd.timeHint')}</p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="jgd-place" className="font-medium">{t('jgd.placeLabel')}</label>
              <select
                id="jgd-place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
              >
                <option value="">{t('jgd.placeNone')}</option>
                {PLACES.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              <p className="text-sm text-ink-subtle">{t('jgd.placeHint')}</p>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-danger">{error}</p>
          )}

          <button type="submit" className="btn-primary text-lg">{t('jgd.submit')}</button>

          <details className="rounded-lg bg-sun/10 p-4 text-sm">
            <summary className="cursor-pointer font-medium">{t('jgd.gunTitle')}</summary>
            <p className="mt-2 text-ink-subtle">{t('jgd.gunIntro')}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={t('jgd.gunName')}
                className="rounded-lg border border-line bg-paper px-4 py-3"
                aria-label={t('jgd.gunName')}
              />
              <input
                type="date"
                value={partnerDate}
                onChange={(e) => setPartnerDate(e.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3"
                aria-label={t('jgd.gunDate')}
              />
            </div>
            <p className="mt-2 text-sm text-ink-subtle">{t('jgd.gunHint')}</p>
          </details>
        </form>
      )}

      {result && (
        <div className="mt-8">
          <div className="flex flex-wrap gap-3 print:hidden">
            <button type="button" onClick={() => window.print()} className="btn-primary">
              {t('jgd.savePdf')}
            </button>
            <button type="button" onClick={reset} className="btn-ghost">{t('jgd.again')}</button>
          </div>

          <section className="card mt-6 p-6 sm:p-8">
            <h2 className="font-display text-2xl">{t('jgd.numTitle')}</h2>

            <div className="mt-4 rounded-lg bg-saffron/10 p-5">
              <p className="text-sm text-ink-subtle">{t('jgd.lifePath')}</p>
              <p className="font-display text-5xl text-saffron-deep">{result.num.lifePath}</p>
              <p className="mt-2 font-medium">{result.num.meaning.title}</p>
              <p className="mt-1 text-ink-subtle">{result.num.meaning.keyword}</p>
              <p className="mt-3">{result.num.meaning.text}</p>
              <p className="mt-3 border-t border-line pt-3 text-sm text-ink-subtle">
                {result.num.meaning.limit}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {result.num.nameNumber !== null && (
                <div className="rounded-lg border border-line p-4">
                  <p className="text-sm text-ink-subtle">{t('jgd.nameNumber')}</p>
                  <p className="font-display text-3xl">{result.num.nameNumber}</p>
                </div>
              )}
              {result.num.soulNumber !== null && (
                <div className="rounded-lg border border-line p-4">
                  <p className="text-sm text-ink-subtle">{t('jgd.soulNumber')}</p>
                  <p className="font-display text-3xl">{result.num.soulNumber}</p>
                </div>
              )}
              <div className="rounded-lg border border-line p-4">
                <p className="text-sm text-ink-subtle">{t('jgd.birthdayNumber')}</p>
                <p className="font-display text-3xl">{result.num.birthdayNumber}</p>
              </div>
            </div>
          </section>

          {result.astro && (
            <section className="card mt-6 p-6 sm:p-8">
              <h2 className="font-display text-2xl">{t('jgd.astroTitle')}</h2>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <Row label={t('jgd.nakshatra')} value={result.astro.nakshatra.name} />
                <Row label={t('jgd.pada')} value={String(result.astro.nakshatra.pada)} />
                <Row label={t('jgd.rashi')} value={result.astro.rashi} />
                <Row label={t('jgd.rashiLord')} value={result.astro.rashiLord} />
                <Row label={t('jgd.nakshatraLord')} value={result.astro.nakshatra.lord} />
                {result.astro.lagna && (
                  <Row
                    label={t('jgd.lagna')}
                    value={`${result.astro.lagna.rashi} (${formatDegrees(result.astro.lagna.degrees)})`}
                  />
                )}
              </dl>

              {!result.astro.lagna && (
                <p className="mt-4 rounded-lg bg-sun/10 p-4 text-sm">
                  {t('jgd.lagnaMissing')}
                </p>
              )}
            </section>
          )}

          {result.gun && (
            <section className="card mt-6 p-6 sm:p-8">
              <h2 className="font-display text-2xl">{t('jgd.gunTitle')}</h2>
              <p className="mt-3 font-display text-4xl text-saffron-deep">
                {result.gun.score} <span className="text-lg text-ink-subtle">/ {result.gun.max}</span>
              </p>
              <p className="mt-2">{result.gun.verdict}</p>

              <ul className="mt-4 grid gap-1 text-sm">
                {result.gun.breakdown.map((b) => (
                  <li key={b.graha} className="flex justify-between border-b border-line py-1">
                    <span>{b.graha}</span>
                    <span>{b.score} / {b.max}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 border-t border-line pt-3 text-sm text-ink-subtle">{result.gun.limit}</p>
            </section>
          )}

          <p className="mt-8 rounded-lg bg-sun/10 p-4 text-sm text-ink-subtle">{t('jgd.disclaimer')}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line p-4">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className="mt-1 text-lg">{value}</dd>
    </div>
  );
}

function formatDegrees(degrees: number): string {
  const d = Math.floor(degrees);
  const m = Math.round((degrees - d) * 60);
  return `${d}° ${m}′`;
}

/**
 * The engine returns a rashi by name; gunMilan wants its position in the zodiac.
 *
 * The names are matched against RASHIS rather than against a hand-written list,
 * because that list was written in Latin transliteration while the table holds
 * Devanagari names — every lookup missed and every match silently scored as
 * Aries, which is the sort of wrong answer that still looks like an answer.
 */
function RASHI_INDEX(rashi: string): number {
  const at = RASHIS.findIndex((r) => r.name === rashi);
  return at < 0 ? 0 : at;
}