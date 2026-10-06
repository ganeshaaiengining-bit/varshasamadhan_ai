'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { useVoiceInput, speak, speechTag } from '@/components/voice/use-voice';
import { useLanguage } from '@/components/language/language';
import { restoreDraft } from '@/components/language/draft';

/**
 * ===========================================================================
 *  ASK BOX
 *
 *  The main way a visitor uses the site: type or speak a question, get an answer,
 *  hear it read aloud.
 *
 * ── Fixes against the prototype ───────────────────────────────────────────
 * • a real `<form>`, so pressing Enter submits. The prototype had none, and
 *   Enter is the reflex of anyone who has used a search box before
 * • the mic is a labelled `<button>` with a visible state, so a blind or
 *   screen-reader user knows when it is listening
 * • every failure is spoken and written: no mic, no permission, no network
 * • the answer is announced to a screen reader via a live region
 * —— There is no article fallback, on purpose ——————————————————
 * One was removed. It matched the question against the site's own articles and
 * returned the best one as "the answer", and the owner's objection to it was
 * right: a matched article is not an answer to the question that was asked. It
 * was also actively misleading — the matcher had once returned the
 * fire-safety article to "my child has a fever", which read as a confident
 * answer to a question about fever.
 *
 * When the model cannot answer, the box now says so plainly and offers the
 * site's subject list. That is honest. Dressing up a related page as a reply is
 * not. See the note in src/app/api/ask/route.ts.
 *
 * ── Language, end to end ──────────────────────────────────────────────────
 * Four separate places have to agree, and any one of them being left in Hindi
 * is enough for a Tamil visitor to conclude the site is broken:
 *
 *   1. the labels around the box      — `t()` here
 *   2. what the microphone listens in — `speechTag(language.code)`
 *   3. the language the model writes in — sent as `lang`
 *   4. the voice that reads the answer aloud — `speak({ language })`
 *
 * Failures come back from the server as `reasonKey`, not as a Hindi sentence,
 * precisely so step 1 can render them in the visitor's own language.
 */
export function AskBox({
  category = '',
  suggested = [],
  onAnswered,
}: {
  category?: string;
  suggested?: { question: string; label: string }[];
  onAnswered?: () => void;
}) {
  const [question, setQuestion] = React.useState('');
  const [asking, setAsking] = React.useState(false);
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [topics, setTopics] = React.useState<{ title: string; slug: string }[]>([]);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [speakError, setSpeakError] = React.useState<string | null>(null);

  const { language, t } = useLanguage();

  const voice = useVoiceInput({
    onResult: (text) => setQuestion(text),
    lang: speechTag(language.code),
  });

  /*
   * Put back whatever was typed before the page reloaded for a language change.
   *
   * `takeDraft` clears itself on read, so this runs once — a question typed now
   * is never resurrected by a later language change.
   */
  React.useEffect(() => {
    restoreDraft((draft) => {
      if (draft.question) setQuestion(draft.question);
    });
  }, []);

  /**
   * Turn a `key|hindi` pair from the voice hook into a translated string.
   * The Hindi half is only a fallback for the case where the key is missing
   * from a translation table, which should never happen but should not leave a
   * visitor staring at a raw key name either.
   */
  const voiceMessage = React.useCallback(
    (raw: string | null) => {
      if (!raw) return null;
      const [key, fallback] = raw.split('|');
      const translated = t(key);
      return translated === key && fallback ? fallback : translated;
    },
    [t],
  );

  const submit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = question.trim();
    if (!text || asking) return;

    setAsking(true);
    setNotice(null);
    setSpeakError(null);
    setTopics([]);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // Sent as well as living in the cookie: the cookie is what the server
        // trusts, but sending it makes the request self-describing when it is
        // replayed or logged.
        body: JSON.stringify({ question: text, category, lang: language.code }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        answer?: string;
        reasonKey?: string;
        reason?: string;
        fallback: boolean;
        topics?: { title: string; slug: string }[] | null;
      };

      if (data.ok && data.answer) {
        setAnswer(data.answer);
        onAnswered?.();
        return;
      }

      /*
       * No AI answer, but the site had something relevant of its own. Show it,
       * with the reason as a small line above it — the visitor needs to know
       * whether they are reading an answer or an article, because one was written
       * carefully and the other was matched by word overlap.
       */
      /*
       * Nothing matched, but the site has nine other subjects. Show them.
       *
       * A message with no way forward is what made this feel like a site that
       * does not work. "We do not have a direct answer to this question"
       * followed by nine links reads as "not this question, but here is what we
       * cover" — and it is true. Set before the notice, because the notice is
       * rendered above and the links are what the visitor does next.
       */
      if (data.topics && data.topics.length > 0) {
        setTopics(data.topics);
      }

      // Prefer the key: it is the only version that can be in the visitor's
      // language. The Hindi `reason` is a last resort.
      if (data.reasonKey) {
        const translated = t(data.reasonKey);
        setNotice(translated === data.reasonKey ? (data.reason ?? data.reasonKey) : translated);
      } else {
        setNotice(data.reason ?? t('ask.notAnswer'));
      }
    } catch {
      setNotice(t('ask.errorNetwork'));
    } finally {
      setAsking(false);
    }
  };

  return (
    <div>
      <form onSubmit={submit} noValidate>
        <label htmlFor="ask-input" className="label">
          {t('ask.label')}
        </label>

        {/*
          The microphone sits inside the field so it reads as one control, not
          two. On a 320px screen the row wraps rather than overflowing — the
          prototype's fixed 80% width plus a 50px button overran by 4px.
        */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <div className="relative min-w-0 flex-1">
            <input
              id="ask-input"
              name="question"
              type="text"
              inputMode="search"
              autoComplete="off"
              className="field !pr-14"
              placeholder={t('ask.placeholder')}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-describedby="ask-help"
              maxLength={800}
            />
            {question ? (
              <button
                type="button"
                onClick={() => setQuestion('')}
                aria-label={t('ask.clear')}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-subtle hover:bg-black/5"
              >
                <Icon name="close" size={18} />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={voice.start}
            disabled={voice.state === 'starting'}
            aria-pressed={voice.state === 'listening'}
            aria-label={
              voice.state === 'listening'
                ? t('ask.stopListening')
                : voice.supported
                  ? t('ask.speak')
                  : t('ask.micUnsupported')
            }
            className={[
              'btn !w-14 !px-0',
              voice.state === 'listening' ? 'bg-danger text-white' : 'btn-outline',
            ].join(' ')}
          >
            {voice.state === 'listening' ? (
              <span className="flex items-end gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-current"
                    style={{
                      height: '8px',
                      animation: `vs-wave 0.9s ${i * 0.15}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </span>
            ) : (
              <Icon name="mic" size={24} />
            )}
          </button>

          <button type="submit" disabled={!question.trim() || asking} className="btn-primary !px-6">
            {asking ? (
              t('ask.sending')
            ) : (
              <>
                <Icon name="send" size={20} />
                <span className="hidden sm:inline">{t('ask.send')}</span>
                <span className="sm:hidden">{t('ask.send')}</span>
              </>
            )}
          </button>
        </div>

        <p id="ask-help" className="mt-2 text-sm text-ink-subtle">
          {voice.interim
            ? `${t('ask.heardWith')} ${voice.interim}`
            : voice.state === 'listening'
              ? t('ask.listening')
              : t('ask.help')}
        </p>
      </form>

      {/* A refusal to listen, written where a blind user will encounter it too. */}
      {voiceMessage(voice.error) ? (
        <p role="alert" className="mt-3 rounded-md border border-danger/30 bg-danger-soft p-3 text-danger">
          {voiceMessage(voice.error)}
        </p>
      ) : null}

      {notice ? (
        <p role="status" className="mt-3 rounded-md border border-line bg-saffron-soft p-3">
          {notice}
        </p>
      ) : null}

      {/*
        The way out of a dead end.

        Shown only when there was no answer *and* no matching article. Without it
        the box reports failure and stops, which on a help site reads as "this
        website is useless" rather than "not this one question". With it, the
        visitor gets the nine subjects the site actually covers, and most of them
        are one tap from something that does answer.
      */}
      {topics.length > 0 ? (
        <div className="mt-4 rounded-md border border-line bg-surface p-4">
          <p className="text-sm font-bold">{t('ask.browseTitle')}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/p/${topic.slug}`}
                  className="inline-flex min-h-[2.75rem] items-center rounded-full border-2 border-line bg-surface px-4 py-2 font-semibold hover:border-saffron hover:text-saffron-deep"
                >
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {answer ? (
        <AnswerCard
          text={answer}
          language={language.code}
          onSpeakError={setSpeakError}
        />
      ) : null}

      {speakError ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {speakError}
        </p>
      ) : null}

      {suggested.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-bold text-ink-soft">{t('ask.suggested')}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suggested.map((item) => (
              <li key={item.question}>
                {/*
                  A button, not a div. The prototype's cards were divs with an
                  onclick: none of the nine could be reached with a keyboard,
                  which made the service unusable for the people it is for.
                */}
                <button
                  type="button"
                  onClick={() => {
                    setQuestion(item.question);
                    setAnswer(null);
                    setNotice(null);
                  }}
                  className="rounded-full border-2 border-line bg-surface px-4 py-2 text-left text-sm font-semibold transition-colors hover:border-saffron hover:text-saffron-deep"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <style>{`
        @keyframes vs-wave {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-rise, [style*="vs-wave"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function AnswerCard({
  text,
  language,
  onSpeakError,
}: {
  text: string;
  language: string;
  onSpeakError: (message: string) => void;
}) {
  const { t } = useLanguage();
  const [speaking, setSpeaking] = React.useState(false);

  const play = () => {
    setSpeaking(true);
    speak(text, {
      language,
      onEnd: () => setSpeaking(false),
      onError: (reasonKey) => {
        setSpeaking(false);
        // Spoken in the answer's own language: a Tamil answer that fails to play
        // should not report the failure in Hindi.
        onSpeakError(t(reasonKey));
      },
    });
  };

  /*
   * `aria-live="polite"` so the answer is announced by a screen reader the
   * moment it appears. The prototype set display:none → block with no live
   * region, so a blind visitor had no way of knowing an answer had arrived.
   */
  return (
    <section aria-live="polite" className="card mt-5 border-saffron bg-saffron-soft/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-saffron-deep">
          <Icon name="sparkle" size={22} />
          {t('ask.answerTitle')}
        </h2>



        <button
          type="button"
          onClick={play}
          disabled={speaking}
          className="btn-outline !min-h-[2.75rem] !px-4 text-sm"
        >
          <Icon name="speaker" size={20} />
          {speaking ? t('ask.stopSpeak') : t('ask.listen')}
        </button>
      </div>

      {/* Long answers are hard to read on a phone, so paragraphs stay generous. */}
      <div className="mt-4 space-y-3 text-[1.05em] leading-relaxed">
        {text.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>

      <p className="mt-5 border-t border-line pt-3 text-sm text-ink-subtle">
        {t('ask.aiNote')}
      </p>
    </section>
  );
}