import 'server-only';

import { cookies } from 'next/headers';
import { fill, isKnownLanguage, stringsFor, type Language } from '@/content/i18n';

/**
 * ===========================================================================
 *  SERVER-SIDE LANGUAGE
 * ===========================================================================
 *
 * Reads the language the visitor chose, so that pages rendered on the server come
 * out in that language.
 *
 * ── Why a cookie and not a client context ─────────────────────────────────
 *
 * The pages are server components: each one reads categories and articles from
 * the database and returns finished HTML. A React context on the client cannot
 * reach them — the markup is already built by the time the language picker
 * mounts. That is not a subtle limitation, it is the whole bug: switching the
 * language changed `<html lang>` and left every word on the page in Hindi.
 *
 * Storing the choice in a cookie makes it available to both sides:
 *
 *   - the client context reads it on mount, so navigation does not flash the
 *     wrong language;
 *   - this module reads it during rendering, so the very first HTML is already
 *     correct.
 *
 * The alternative — translating after hydration — would show the wrong language
 * first, then correct itself. For a service aimed at elderly and low-literacy
 * visitors, a page that visibly changes language under their eyes is worse than
 * one that is briefly slower.
 *
 * ── Cost of reading a cookie ──────────────────────────────────────────────
 *
 * Reading cookies opts a route into dynamic rendering. Every page here already
 * sets `force-dynamic` because it reads live data, so nothing is lost.
 */

export const LANGUAGE_COOKIE = 'vs-lang';

/** One year, matching what the picker writes. */
export const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * The visitor's language, defaulting to Hindi.
 *
 * The default matters: the brief is that the site opens in Hindi and only
 * changes when someone chooses otherwise. An unknown or tampered cookie value
 * falls back to Hindi rather than to whatever was in the cookie.
 */
export async function getLanguage(): Promise<Language> {
  const store = await cookies();
  const raw = store.get(LANGUAGE_COOKIE)?.value;
  const { LANGUAGES } = await import('@/content/i18n');
  if (!raw || !isKnownLanguage(raw)) return LANGUAGES[0];
  return LANGUAGES.find((l) => l.code === raw) ?? LANGUAGES[0];
}

/** A translator bound to the visitor's language, for use in a server component. */
export async function getT(): Promise<{
  lang: string;
  /**
   * Included here because `<html dir>` needs it and reading the cookie a second
   * time in the layout just to get one string is wasteful — this is already the
   * resolved language object.
   */
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  tf: (key: string, values: Record<string, string | number>) => string;
}> {
  const language = await getLanguage();
  const t = stringsFor(language.code);
  return {
    lang: language.code,
    dir: language.direction,
    t,
    tf: (key, values) => fill(t(key), values),
  };
}