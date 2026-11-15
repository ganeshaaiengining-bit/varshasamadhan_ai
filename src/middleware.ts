import { NextResponse, type NextRequest } from 'next/server';

/**
 * ===========================================================================
 *  LANGUAGE FROM THE URL, WHEN THE COOKIE DOES NOT ARRIVE
 * ===========================================================================
 *
 * The whole site renders from a cookie. That is right — one URL per page, and
 * the server can translate before the first paint — but it has one failure
 * nobody sees from the outside: a browser that refuses cookies.
 *
 * Private mode, the webview inside a messaging or social app, and a privacy
 * setting set to "block all cookies" all behave the same way. The picker writes
 * the cookie, the page reloads, and the request that comes back has no cookie
 * at all. The header changes on the client, the server-rendered body does not,
 * and the visitor reports what is true on their screen: switching to Marathi
 * showed Hindi.
 *
 * ── What this does ─────────────────────────────────────────────────────────
 * The picker puts the choice in the address as `?vs-lang=mr` as well as in the
 * cookie. This middleware turns that parameter into the request's own cookie,
 * so every existing `cookies()` read in the app sees a normal request and none
 * of the pages, components or server modules has to know the parameter exists.
 *
 * It does the same for `/<code>/…`, and that form is the one search engines
 * are given: `/ta/aarti` is the Tamil article page, rendered from the same
 * route as `/aarti`, with the prefix removed before the router sees it. See
 * `server/seo.ts` for why the prefix is used instead of the query — Next's
 * metadata resolver drops the query on a root URL, which would have left the
 * home page's twelve translations uncrawlable.
 *
 * The response sets the cookie too. That covers the browser which allows
 * response cookies but not writes from script, which is a smaller group but a
 * real one.
 *
 * ── What it deliberately does not do ───────────────────────────────────────
 * It does not translate on its own, and it does not decide which languages are
 * real. A parameter is a request, not an instruction: this file only moves it,
 * `content/i18n.ts` says what it means, and a code that is not one of the
 * thirteen never reaches `<html lang>` or the voice's speech tag. The prefix
 * list below is a copy of the codes for that reason — a shape check alone would
 * turn `/ab` into the home page instead of a 404.
 */

const COOKIE = 'vs-lang';
const PARAM = 'vs-lang';

/**
 * The thirteen codes a prefix may name.
 *
 * Kept as a literal rather than imported from `content/i18n.ts`: that module
 * carries every translation table, and this file runs on every request in a
 * separate runtime. A code missing here is a language with no prefix URL; it is
 * listed in the same order as the picker so the two are easy to compare.
 */
const CODES = new Set([
  'hi',
  'en',
  'bn',
  'ta',
  'te',
  'mr',
  'gu',
  'kn',
  'ml',
  'pa',
  'ur',
  'ar',
  'es',
]);

const PREFIX = /^\/([a-z]{2})(?=\/|$)/;

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const prefix = url.pathname.match(PREFIX)?.[1];
  const fromPath = prefix && CODES.has(prefix) ? prefix : null;

  const param = url.searchParams.get(PARAM);
  const fromParam = param && /^[a-z]{2}$/.test(param) ? param : null;

  /*
   * An explicit parameter wins over the prefix: it is what the picker writes,
   * and a visitor who has just chosen a language should get that language even
   * if they are standing on an old prefixed link.
   */
  const wanted = fromParam ?? fromPath;

  /*
   * Send the visitor to the address that matches their choice.
   *
   * The picker reloads with `?vs-lang=`, which is what a browser that refuses
   * cookies needs. Left as it is, a visitor who arrives on `/ta/aarti` from a
   * Tamil search result and then chooses English would get English text under a
   * Tamil URL — and the moment the client strips the parameter, a refresh would
   * silently put Tamil back. One redirect leaves the address bar saying what the
   * page actually is, and it is the same URL the canonical tag names.
   *
   * The parameter is dropped from the redirect target for the same reason the
   * client removes it: a language is not part of the address a visitor copies.
   */
  if (fromParam) {
    const rest = url.pathname.replace(PREFIX, '') || '/';
    const target = new URL(url);
    target.pathname = fromParam === 'hi' ? rest : `/${fromParam}${rest === '/' ? '' : rest}`;
    target.searchParams.delete(PARAM);

    const redirect = NextResponse.redirect(target, 307);
    redirect.cookies.set(COOKIE, fromParam, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return redirect;
  }

  let rewritten: URL | null = null;
  if (fromPath) {
    rewritten = new URL(url);
    rewritten.pathname = url.pathname.replace(PREFIX, '') || '/';
  }

  if (!wanted) {
    return NextResponse.next();
  }
  if (!rewritten && request.cookies.get(COOKIE)?.value === wanted) {
    return NextResponse.next(); // already there, nothing to add
  }

  /*
   * Merge rather than replace.
   *
   * The visitor's session cookie is in the same header. Setting the cookie
   * header to only `vs-lang` would log them out on the very page where they
   * changed language, which would look like a language bug of its own.
   */
  const headers = new Headers(request.headers);
  const others = (headers.get('cookie') ?? '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith(`${COOKIE}=`));
  others.push(`${COOKIE}=${wanted}`);
  headers.set('cookie', others.join('; '));

  const response = rewritten
    ? NextResponse.rewrite(rewritten, { request: { headers } })
    : NextResponse.next({ request: { headers } });
  response.cookies.set(COOKIE, wanted, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

/**
 * Everything a visitor can read.
 *
 * Static files and Next's own build output never carry a language, and running
 * this on them would cost a function invocation for nothing.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml|webmanifest)$).*)',
  ],
};
