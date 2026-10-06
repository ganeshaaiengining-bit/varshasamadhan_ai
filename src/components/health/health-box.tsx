'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { AskBox } from '@/components/ask/ask-box';
import { useLanguage } from '@/components/language/language';
import {
  AGE_BANDS,
  QUESTIONS_PER_BAND,
  bandForAge,
  chipKey,
  questionKey,
  type AgeBand,
} from '@/content/health-questions';

/**
 * ===========================================================================
 *  HEALTH QUESTIONS BY AGE
 * ===========================================================================
 *
 * An age selector above a question box, so someone who cannot put the problem
 * into words can still ask it.
 *
 * ── Why an age selector rather than more categories ────────────────────────
 *
 * The site already has nine subject categories. The problem reported was not
 * "there is no page for this" — it was "I asked and nothing came back", from
 * someone who could not name their condition and did not know which category it
 * belonged to. A fifty-four-year-old with back pain does not look for
 * "musculoskeletal" or "आंतरिक रोग"; they know how old they are.
 *
 * Age is the one thing a visitor in pain can answer without diagnosing
 * themselves, so it is asked first.
 *
 * ── Why the questions live in the i18n tables ───────────────────────────────
 *
 * This box is the one place on the site where a wrong-language string is worse
 * than no string at all. "मेरी पीठ में दर्द है" read to a Tamil speaker who cannot
 * read Devanagari is not a translation, it is noise — and it is noise on the
 * one page where being understood is the entire point. So the labels, the notes
 * and the questions are all resolved through `t()`, which falls back to English
 * rather than to Hindi.
 *
 * ── The medical framing ────────────────────────────────────────────────────
 *
 * The two sentences that matter most on a health page — this is not medical
 * advice, and these numbers are for emergencies — sit *above* the questions,
 * not below. Someone who has just tapped "back pain" is already on the path of
 * trusting whatever comes back, and this is the only place to say so before
 * they read it.
 */
export function HealthBox() {
  const { t } = useLanguage();

  /* The middle band is the default because the two ends are the ones that get
     tapped deliberately and the middle is where most visitors land. */
  const [band, setBand] = React.useState<AgeBand>(AGE_BANDS[4]);

  /*
   * Choosing a band by typing a number as well as by tapping it, because the
   * bands are ranges and the visitor knows a single number. Typing 54 is one
   * fewer act of guessing than working out which pill contains 54.
   */
  const [ageText, setAgeText] = React.useState('');

  const chooseByAge = (value: string) => {
    setAgeText(value);

    const found = bandForAge(Number(value));
    /*
     * Out of range means no band, so the previous band and its questions stay on
     * screen rather than being replaced by an empty box. Someone who typed 105
     * by mistake should be able to correct it without the questions vanishing.
     */
    if (found) setBand(found);
  };

  const suggested = React.useMemo(
    () =>
      Array.from({ length: QUESTIONS_PER_BAND }, (_, index) => ({
        label: t(chipKey(band, index)),
        question: t(questionKey(band, index)),
      })),
    [band, t],
  );

  return (
    <section aria-labelledby="health-box-heading" className="card mt-10 p-5 sm:p-7">
      <div className="text-center">
        <h2 id="health-box-heading" className="flex items-center justify-center gap-2 text-2xl">
          <Icon name="heart" size={22} className="text-saffron-deep" />
          {t('health.heading')}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">{t('health.intro')}</p>
      </div>

      {/*
        The age field first, because the bands below are ranges and people think
        in numbers. `inputMode="numeric"` opens the number pad on a phone instead
        of the full keyboard.
      */}
      <div className="mx-auto mt-6 max-w-xs">
        <label htmlFor="health-age" className="label">
          {t('health.ageLabel')}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="health-age"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            className="field text-center text-lg font-bold"
            value={ageText}
            onChange={(event) => chooseByAge(event.target.value)}
            placeholder="54"
          />
          <span aria-hidden="true" className="text-2xl font-bold text-ink-subtle">
            {t('health.years')}
          </span>
        </div>
      </div>

      {/*
        A horizontal scroll rather than a wrap: eight wrapped pills are three
        rows tall on a 320px screen and push the question box completely out of
        sight, which defeats the purpose of putting the age question first.
      */}
      <div
        role="group"
        aria-label={t('health.bandsLabel')}
        className="mt-6 -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2"
      >
        {AGE_BANDS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setBand(option);
              /* Clear the number, so the pill and the field cannot disagree:
                 tapping "0 – 2" while 54 is still typed would show the field
                 saying 54 and the questions saying otherwise. */
              setAgeText('');
            }}
            aria-pressed={band.id === option.id}
            className={[
              'min-h-[2.75rem] shrink-0 snap-start rounded-full border-2 px-4 font-semibold transition-colors',
              band.id === option.id
                ? 'border-saffron bg-saffron-soft text-saffron-deep'
                : 'border-line bg-surface hover:border-saffron',
            ].join(' ')}
          >
            {t(`health.band.${option.id}.label`)}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-ink-subtle">{t(band.noteKey)}</p>

      {/*
        The disclaimer goes here, between the band and the questions, rather than
        only at the foot of the section. It is the last thing read before the
        chips are tapped, which is where it can still change what the visitor
        expects to happen.

        The three numbers are keyed by the number they belong to, not by their
        position in this list. 112 is the emergency number, 108 is the ambulance
        and 181 is the women's helpline; a label that drifts off its number would
        send someone to the wrong service, and on the page it would look entirely
        normal.
      */}
      <div className="mt-5 space-y-3 rounded-md border border-amber/40 bg-amber-soft p-4 text-sm">
        <p>
          <strong>{t('health.notAdviceStrong')}</strong> {t('health.notAdvice')}
        </p>
        <p>
          <strong>{t('health.emergencyStrong')}</strong>{' '}
          <a href="tel:112" className="font-bold underline">
            112
          </a>{' '}
          {t('health.emergencyCall')} ·{' '}
          <a href="tel:108" className="font-bold underline">
            108
          </a>{' '}
          {t('health.emergencyAmbulance')} ·{' '}
          <a href="tel:181" className="font-bold underline">
            181
          </a>{' '}
          {t('health.emergencyWomen')}
        </p>
      </div>

      <div className="mt-6">
        <AskBox suggested={suggested} />
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-subtle">
        <Icon name="shield" size={16} />
        {t('health.privacy')}
      </p>
    </section>
  );
}