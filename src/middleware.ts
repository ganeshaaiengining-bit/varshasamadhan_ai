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
 * The response sets the cookie too. That covers the browser which allows
 * response cookies but not writes from script, which is a smaller group but a
 * real one.
 *
 * ── What it deliberately does not do ───────────────────────────────────────
 * It does not translate on its own, and it does not decide which languages are
 * real. A parameter is a request, not an instruction: this file only moves it,
 * `content/i18n.ts` says what it means, and a code that is not one of the
 * thirteen never reaches `<html lang>` or the voice's speech tag.
 */

const COOKIE = 'vs-lang';
const PARAM = 'vs-lang';

export function middleware(request: NextRequest) {
  const wanted = request.nextUrl.searchParams.get(PARAM);

  /*
   * Shape here, meaning further down.
   *
   * The list of real languages lives in `content/i18n.ts`, and importing it here
   * would put every one of the thirteen translation tables into a piece of code
   * that runs on every request in a separate runtime. A two-letter shape check
   * is enough for what this file is actually deciding — whether to move a
   * parameter into a cookie — because `getLanguage()` still runs
   * `isKnownLanguage()` before any of it is rendered. An unknown code here can
   * therefore only be ignored later, never shown.
   */
  if (!wanted || !/^[a-z]{2}$/.test(wanted)) {
    return NextResponse.next();
  }
  if (request.cookies.get(COOKIE)?.value === wanted) {
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

  const response = NextResponse.next({ request: { headers } });
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
