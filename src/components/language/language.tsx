'use client';

import * as React from 'react';
import { LANGUAGES, fill, stringsFor, type Language } from '@/content/i18n';
import { Icon } from '@/components/ui/icon';

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
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      setLanguageState(LANGUAGES.find((l) => l.code === stored)!);
    }
  }, []);

  // Apply to the document, and persist for the server to read on the next load.
  React.useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.direction;

    try {
      localStorage.setItem(KEY, language.code);
    } catch {
      /* private browsing; the cookie below is the one that matters */
    }

    /*
     * The cookie is what actually makes the page translate — it is the only part
     * of the choice the server can see. `maxAge` and `sameSite` are set
     * deliberately: without `maxAge` this is a session cookie and a reload would
     * fall back to Hindi, which reads as the switch not having worked.
     */
    try {
      document.cookie =
        `${COOKIE}=${encodeURIComponent(language.code)}; path=/; max-age=${MAX_AGE}; samesite=lax`;
    } catch {
      /* cookies disabled; the page still translates for this session */
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

  const setLanguage = React.useCallback((next: Language) => setLanguageState(next), []);

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

/* ========================================================================= */

/** Small helper so callers do not need the whole context object. */
export function useTranslate() {
  return useLanguage().t;
}