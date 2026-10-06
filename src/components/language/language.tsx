'use client';

import * as React from 'react';
import { LANGUAGES, fill, stringsFor, type Language } from '@/content/i18n';
import { Icon } from '@/components/ui/icon';
import { stashForLanguageChange } from '@/components/language/draft';

/**
 * ===========================================================================
 *  LANGUAGE
 * ===========================================================================
 *
 * Picks the interface language and applies it to the document.
 *
 * ── Why a client-side context and not route segments ───────────────────────
 * Adding `/[locale]/…` to every route would make each page's canonical URL
 * change with the interface language, which is wrong for this site: the
 * articles are not translated, so a visitor reading in Tamil would reach the
 * same Hindi article under a Tamil URL and the two would compete in search
 * results for identical content. A cookie-backed context keeps one URL per
 * page and lets the visitor change language without navigating.
 *
 * ── Applied to `<html>` ────────────────────────────────────────────────────
 * `lang` and `dir` both change. `lang` alone is not enough: an Arabic or Urdu
 * visitor gets text laid out left-to-right unless `dir="rtl"` is set, which
 * moves every label to the wrong side of its own control.
 *
 * ── Read-aloud ────────────────────────────────────────────────────────────
 * The voice picks an `hi-IN` or `ar` utterance to match, because an English
 * voice reading Devanagari is unintelligible — a point this audience cannot
 * afford to have got wrong.
 */

const KEY = 'vs-language';

/**
 * Must match the name the server reads. The two live in different files because
 * one is bundled for the browser and one runs only on the server, so they cannot
 * share an import; the comment on each side is the link.
 */
const COOKIE = 'vs-lang';
const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * The offered language codes, exposed on `window` for the responsive verifier.
 *
 * A test needs to know which languages are legitimately available before it
 * can judge whether `lang="ta"` is right or wrong — otherwise it has to hardcode
 * the list, and the two drift apart the moment a language is added. Reading it
 * from the running app is the only version that stays true.
 */
if (typeof window !== 'undefined') {
  (window as unknown as { __VS_LANGUAGES__?: string[] }).__VS_LANGUAGES__ =
    LANGUAGES.map((l) => l.code);
}

interface LanguageValue {
  language: Language;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  /**
   * `t` with `{placeholder}` substitution.
   *
   * Part of the same context rather than a separate hook so a component cannot
   * translate a key and then forget to fill its placeholders — `t()` alone would
   * happily render the literal `{count}` on screen.
   */
  tf: (key: string, values: Record<string, string | number>) => string;
}

const LanguageContext = React.createContext<LanguageValue>({
  language: LANGUAGES[0],
  dir: 'ltr',
  t: (key: string) => stringsFor('hi')(key),
  tf: (key: string, values: Record<string, string | number>) =>
    fill(stringsFor('hi')(key), values),
});

export function useLanguage(): LanguageValue {
  return React.useContext(LanguageContext);
}

/**
 * The setter lives in its own context.
 *
 * Putting `setLanguage` on the value object would make the whole object a new
 * reference on every change, so every consumer of `t()` re-renders even when
 * only the picker changed. Splitting them keeps the translated-string consumer
 * stable.
 */
const SetLanguageContext = React.createContext<(language: Language) => void>(() => {});

function useSetLanguage() {
  return React.useContext(SetLanguageContext);
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  /**
   * The language the *server* already resolved from the cookie.
   *
   * This is what makes the whole site change language on the first paint rather
   * than after hydration. Client components are rendered on the server too, and
   * without this they all start from `LANGUAGES[0]` — Hindi — so the footer, the
   * app bar, the theme toggle and the sound pad came down in Hindi while the
   * server-rendered page around them came down in Tamil. The result looked like
   * a half-translated site: a Tamil heading above a Hindi footer, with no error
   * anywhere to explain it.
   *
   * The old version read `localStorage` in an effect and corrected itself a
   * moment later, which is fine for a page that is entirely client-rendered and
   * wrong for this one, because the mismatch is visible in the first frame.
   */
  initialLanguage?: string;
}) {
  const [language, setLanguageState] = React.useState<Language>(() => {
    const found = initialLanguage
      ? LANGUAGES.find((l) => l.code === initialLanguage)
      : undefined;
    return found ?? LANGUAGES[0];
  });

  /*
   * Read after mount, and only ever to *honour* a previous choice.
   *
   * The server already rendered the page in the right language from the cookie,
   * so this exists to keep the client in step — it is not what makes the
   * translation work. It deliberately does not guess from `navigator.language`:
   * the brief is that the site opens in Hindi and changes only when someone
   * chooses otherwise, so an automatic switch on first visit would be wrong
   * even though it is often what international sites do.
   */
  React.useEffect(() => {
    let stored = '';
    try {
      stored = localStorage.getItem(KEY) ?? '';
    } catch {
      stored = '';
    }
    if (!stored || !LANGUAGES.some((l) => l.code === stored)) return;
    if (stored === language.code) return; // already what the server sent us

    const remembered = LANGUAGES.find((l) => l.code === stored);
    if (remembered) setLanguageState(remembered);
    // Deliberately no `router.refresh()` here. This effect runs on the first
    // mount, and the server has already rendered from the same cookie, so the
    // two already agree in the normal case; refreshing here would fire a second
    // render request on every single page load. Where they genuinely disagree the
    // next change of language refreshes anyway.
  }, [language.code]);

  /*
   * Apply to the document, and remember the choice in this browser.
   *
   * The cookie is *not* written here. `setLanguage` writes it synchronously
   * before asking the server to re-render, because a refresh issued before the
   * cookie exists comes back in the previous language. This effect keeps the
   * `localStorage` copy in step so the choice survives, and so the read-back on
   * mount has something to compare against.
   */
  React.useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.direction;

    try {
      localStorage.setItem(KEY, language.code);
    } catch {
      /* private browsing; the cookie is the one that matters */
    }
  }, [language]);

  const value = React.useMemo<LanguageValue>(
    () => {
      const t = stringsFor(language.code);
      return {
        language,
        dir: language.direction,
        t,
        tf: (key, values) => fill(t(key), values),
      };
    },
    [language],
  );

  /*
   * ── Why changing the language refreshes the page ───────────────────────────
   *
   * Half the text on this site is rendered by the server. Every page reads the
   * language cookie before producing HTML, because the pages are server
   * components that query the database before they render. Updating the context
   * on the client re-renders the client components — the app bar, the footer,
   * the buttons — and leaves every server-rendered heading, paragraph and list
   * exactly where it was.
   *
   * That produced the worst possible symptom for this audience: the navigation
   * would switch to Tamil and the article it was sitting above would stay in
   * Hindi, and a person who cannot read the second language has no way to tell
   * that the missing half is a mechanism rather than a broken page.
   *
   * `router.refresh()` re-fetches the server components for the current URL. The
   * URL does not change, so there is no navigation, no scroll jump and nothing
   * for the visitor to notice beyond the page updating — which is what changing a
   * language is supposed to look like.
   *
   * It is deliberately not `router.push`, because that would add a history entry
   * and the back button would walk through eighteen languages.
   *
   * ── Why a reload and not `router.refresh()` ───────────────────────────────
   *
   * `router.refresh()` was the first attempt and it was measured and abandoned.
   * Chrome's console showed `Maximum update depth exceeded` and a hydration
   * mismatch on every language change, and the question box visibly flickered.
   * The RSC response that came back was *correct* — it carried the new language —
   * and the DOM still showed the old text, so the fetch was not the problem and
   * neither was the cookie: loading the same URL with the same cookie produced
   * the right page immediately. Something about re-rendering the tree underneath a
   * context provider that the tree itself depends on did not settle.
   *
   * A real navigation is one request and one render, has no loop to fall into, and
   * cannot leave the page half-updated. It costs a scroll position, which is what
   * `draft.ts` is for.
   *
   * ── Why the cookie is written here, first ─────────────────────────────────
   *
   * The server can only know the new language from the cookie, and the navigation
   * below is issued in this same tick. A cookie written in an effect would be
   * written *after* this render committed, so the page would come back in the
   * previous language — client half Tamil, server half Hindi, and no error to
   * explain it. Write it here, then navigate.
   */
  const setLanguage = React.useCallback(
    (next: Language) => {
      try {
        document.cookie =
          `${COOKIE}=${encodeURIComponent(next.code)}; path=/; max-age=${MAX_AGE}; samesite=lax`;
        localStorage.setItem(KEY, next.code);
      } catch {
        /* cookies disabled; the page still translates for this session */
      }

      /*
       * Set the state as well as reloading. It is not needed for the server half —
       * the navigation handles that — but it means `<html lang>` is correct
       * immediately, so a screen reader does not announce the page in the old
       * language for the length of the reload.
       */
      setLanguageState(next);

      // Put the visitor's half-typed question somewhere safe before the page goes.
      stashForLanguageChange();

      window.location.reload();
    },
    [],
  );

  return (
    <SetLanguageContext.Provider value={setLanguage}>
      <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
    </SetLanguageContext.Provider>
  );
}

/* ===========================================================================
 *  The picker
 * =========================================================================== */

/**
 * A native `<select>`, deliberately.
 *
 * This audience is not served well by a custom dropdown: a native control is
 * keyboard-scalable, shows the platform's own picker on a phone — including the
 * enlarged, easier-to-hit version iOS offers for a `<select>` — and is
 * announced correctly by every screen reader without any work. A styled
 * `<div>` list would lose all three for no benefit.
 */
export function LanguageSelect({
  variant = 'compact',
  className = '',
}: {
  variant?: 'compact' | 'full';
  className?: string;
}) {
  const { language, t } = useLanguage();
  const setLanguage = useSetLanguage();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      {/*
        The visible control is a real button that opens a list, because a
        `<select>` cannot show each language in its own script side by side in a
        grid — and "find your language by its own name" is the only reliable way
        to find it for someone who cannot read Latin script.
      */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('nav.language')}
        className={[
          'flex w-full items-center gap-2 rounded-full border-2 border-line bg-surface font-bold transition-colors hover:border-saffron',
          variant === 'compact' ? 'min-h-[2.75rem] px-3.5 text-sm' : 'min-h-[3.25rem] px-5 text-base',
        ].join(' ')}
      >
        <span aria-hidden="true" className="text-lg">
          🌐
        </span>
        <span className="truncate">{language.native}</span>
        <Icon name="chevron-down" size={15} className="ml-auto shrink-0 text-ink-subtle" />
      </button>

      {open ? (
        <>
          {/* Click-away layer. Without it the panel cannot be dismissed by
              tapping the page behind it, which on a phone means the list can
              cover everything. */}
          <button
            type="button"
            aria-label={t('nav.closeMenu')}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label={t('language.choose')}
            className="absolute right-0 z-50 mt-2 max-h-[26rem] w-[min(22rem,90vw)] overflow-y-auto rounded-[var(--radius)] border-2 border-line bg-surface p-2 shadow-lift"
          >
            {LANGUAGES.map((option) => (
              <li key={option.code} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={option.code === language.code}
                  onClick={() => {
                    setLanguage(option);
                    setOpen(false);
                  }}
                  className={[
                    'flex w-full min-h-[3rem] items-center gap-3 rounded-md px-3 py-2 text-start transition-colors',
                    option.code === language.code
                      ? 'bg-saffron-soft font-bold text-saffron-deep'
                      : 'hover:bg-card-hover',
                  ].join(' ')}
                >
                  <span className="text-xl">{option.native}</span>
                  <span className="text-sm text-ink-subtle">{option.english}</span>
                  {option.code === language.code ? (
                    <Icon name="check" size={16} className="ms-auto shrink-0" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

/* ===========================================================================
 *  Removed
 *  ===========================================================================
 *
 *  `useTranslate()` — a one-line wrapper around `useLanguage().t`. Nothing used
 *  it, and it was an easy way for a caller to take only `t` and miss `tf`, which
 *  is the one that fills `{placeholders}`.
 */