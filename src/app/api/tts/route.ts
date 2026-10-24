import { NextResponse } from 'next/server';

/**
 * GET /api/tts?lang=hi&text=नमस्ते दोस्तों
 *
 * Speaks one short sentence as clear audio (mp3), for visitors whose own
 * device offers no usable voice — or only the muffled legacy Windows one.
 *
 * ── Why a route, and why this source ──────────────────────────────────────────
 * The Web Speech API can only use the voices a machine happens to have. On a
 * Windows PC that is often one robotic SAPI voice; on a phone missing the
 * regional pack it is an English voice mangling Devanagari, or nothing at all.
 * The owner's requirement is that every visitor hears a clear voice without
 * installing anything, which means the site has to bring the voice with it.
 *
 * The constraints are hard: free, no API key the owner would have to create
 * (keys are never accepted from him), and all thirteen languages including the
 * Indic scripts. That rules out every keyed cloud TTS and every free service
 * whose voices stop at English. What is left that genuinely speaks हिन्दी,
 * தமிழ், اردو and the rest is Google Translate's speech endpoint — keyless,
 * free, and the same voice people already hear daily on translate.google.com.
 * Its browser-facing sibling is CORS-blocked, so the fetch happens here, where
 * a server-to-server call needs no permission at all.
 *
 * ── What keeps it honest ──────────────────────────────────────────────────────
 * It is an unofficial endpoint and can refuse or rate-limit at any moment, so
 * nothing here may assume success: the client (`use-voice.ts`) falls back to
 * the device's own voice on every non-200, on an empty body, and on a fetch
 * that outruns `NETWORK_TTS_TIMEOUT_MS`. Silence-with-an-error stays the last
 * resort only when the device has no voice either. If the day comes this
 * endpoint disappears, the site degrades to exactly what it was before.
 *
 * ── The three guards on this route ────────────────────────────────────────────
 * It is publicly reachable and can be asked for anything, so:
 *
 *   1. length — a chunk from `chunksForSpeech` is at most 120 characters, and
 *      the upstream itself stops around 200; 200 is the cap, no exceptions;
 *   2. language — only the thirteen the site offers, as a set membership test,
 *      so the route can never become a general-purpose proxy for any `tl`;
 *   3. rate — sixty requests a minute per address, counted in memory. On
 *      serverless the map is per-instance, which makes the limit approximate:
 *      best-effort throttling is still worth having, since the real fear is a
 *      scraper earning the upstream's own 429 and taking real readers down
 *      with it.
 *
 * ── Caching ────────────────────────────────────────────────────────────────────
 * The same sentence always sounds the same, so the response is immutable for a
 * year. A reread of an article, or the aarti someone plays every morning, is
 * then served from the browser and the edge with no upstream call at all — the
 * cheapest and most reliable request is the one that never happens.
 */
const OFFERED = new Set([
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

const MAX_TEXT = 200;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const MAX_TRACKED_ADDRESSES = 5_000;

/** Per-address request counts; see guard 3 above for why memory is enough. */
const seen = new Map<string, { count: number; at: number }>();

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const text = (url.searchParams.get('text') ?? '').trim();
  const lang = (url.searchParams.get('lang') ?? '').toLowerCase();

  if (!lang || !OFFERED.has(lang) || text.length === 0 || text.length > MAX_TEXT) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const address =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const bucket = seen.get(address);
  if (bucket && now - bucket.at < WINDOW_MS) {
    bucket.count += 1;
    if (bucket.count > MAX_PER_WINDOW) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }
  } else {
    if (seen.size >= MAX_TRACKED_ADDRESSES) {
      for (const [key, value] of seen) {
        if (now - value.at >= WINDOW_MS) seen.delete(key);
      }
    }
    seen.set(address, { count: 1, at: now });
  }

  const upstream =
    'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob' +
    `&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(upstream, {
      headers: {
        // Without a browser-looking agent the endpoint answers 400; this is
        // the identity it expects from the page it is normally asked by.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(bytes.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    // Upstream refused, timed out or was unreachable: the client falls back to
    // the device voice. A JSON body rather than a thrown error, so the browser
    // reads `ok: false` instead of a 500 page it would have to guess about.
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
