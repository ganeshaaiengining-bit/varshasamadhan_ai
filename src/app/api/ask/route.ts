import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { safeRead } from '@/server/db-guard';
import { askGemini, isConfigured } from '@/server/ai/gemini';
import { getLanguage } from '@/server/i18n';
import { findStoredAnswer } from '@/server/ai/stored-answer';

/**
 * POST /api/ask
 *
 * The browser talks to this, never to Google. That indirection is the entire
 * reason the API key stays secret: this route reads the key from the server
 * environment, calls Google, and returns only the answer text.
 *
 * Also writes the question to `asked_questions` before answering, so the owner
 * can see what people are actually asking — including the ones the AI could not
 * answer, which is a to-do list rather than a failure.
 */

// Voice input needs a secure context, and this route is rate-limited by the
// ledger rather than by IP because the whole point is that many visitors share
// one address in some areas.
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  question: z.string().trim().min(3).max(800),
  category: z.string().trim().max(80).optional().default(''),
  lang: z.string().trim().max(10).optional(),
});

/** Words that mean the question is incomplete or a test. */
const TRIVIAL = new Set([
  'हाय',
  'हैलो',
  'नमस्ते',
  'नमस्कार',
  'test',
  'ok',
  'okay',
  'जी',
  'हाँ',
  'ना',
  'thanks',
  'धन्यवाद',
]);

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, fallback: true, reason: 'अनुरोध समझ नहीं आया।' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, fallback: true, reason: 'कृपया अपना प्रश्न थोड़ा और साफ़ लिखें।' },
      { status: 400 },
    );
  }

  const { question, category } = parsed.data;

  // The cookie wins over the body. See the note at the top of this file.
  const language = await getLanguage();
  const languageCode = language.code;

  // A greeting is not a question. Answering one wastes a metered call and tells
  // the visitor something is broken.
  //
  // Matched in several scripts, not just Devanagari: a visitor who has chosen
  // Tamil will say "வணக்கம்", and checking only Hindi would spend a metered
  // call answering a greeting and return a blank-feeling result to someone who
  // never asked anything.
  const greeting = question.replace(/[।.!?।]/g, '').trim().toLowerCase();
  if (TRIVIAL.has(greeting) || isGreetingIn(languageCode, greeting)) {
    return NextResponse.json({
      ok: false,
      fallback: true,
      reasonKey: 'ask.welcome',
      reason: 'आपका स्वागत है! नीचे अपनी समस्या लिखिए या कोई श्रेणी चुनिए।',
    });
  }

  const result = await askGemini({ question, category, lang: languageCode });

  /*
   * If the AI could not answer, look for one of the site's own articles.
   *
   * The site already contains sixteen pieces of real guidance. Returning "no
   * answer, try later" while the answer sits in the database two pages away is
   * the failure that was reported: ask a question, get nothing. So the stored
   * article is attached to the response and the box renders it with a link.
   *
   * `question` is passed in rather than remembered in a module-level variable,
   * because two visitors asking at the same moment would otherwise read each
   * other's question — and one of them would be shown an article about the other
   * person's problem.
   */
  const match = result.ok ? null : await findStoredAnswer(question);
  const stored = match
    ? {
        title: match.title,
        summary: match.summary,
        href: `/p/${match.categorySlug}/${match.slug}`,
      }
    : null;

  /*
   * The ledger is best-effort and deliberately never blocks the answer.
   *
   * `asked_questions` is both the owner's "what are people asking" list and the
   * daily cap on AI spend. Losing a write means the cap under-counts, so it is
   * worth logging loudly — but a visitor who has just been told how to deal with a
   * fire should not be handed an error page because their question could not be
   * filed. The answer has already been generated and paid for.
   */
  try {
    await prisma.askedQuestion.create({
      data: {
        question,
        category,
        wasAnswered: result.ok,
        wasFailed: !result.ok,
      },
      select: { id: true },
    });
  } catch (error) {
    console.error('[ask] could not record the question:', error);
  }

  return NextResponse.json({
    ...result,
    ...(stored ? { stored } : {}),
  });
}

/**
 * Greetings in the scripts most of the offered languages use.
 *
 * Deliberately a short list and not a full language table. A greeting is cheap to
 * miss — the cost of not recognising one is one wasted answer — while a long
 * hardcoded list of foreign words is a second translation file to keep in step
 * with `i18n.ts`, for very little gain.
 */
function isGreetingIn(language: string, text: string): boolean {
  const sets: Record<string, string[]> = {
    ta: ['வணக்கம்', 'நமச்சிவ'],
    te: ['నమస్కారం'],
    bn: ['নমস্কার', 'আসসালামু'],
    ml: ['നമസ്കാരം'],
    kn: ['ನಮಸ್ಕಾರ'],
    gu: ['નમસ્તે'],
    mr: ['नमस्कार'],
    pa: ['ਸਤਿਸ੍ਰੀਅਕਾਲ'],
    ur: ['السلام علیکم'],
    ar: ['مرحبا', 'السلام عليكم'],
    es: ['hola', 'buenos días'],
    en: ['hello', 'hi there'],
  };

  const words = sets[language];
  if (!words) return false;
  return words.some((w) => text === w || text.startsWith(w));
}

/** GET tells the client whether AI is available, so the UI can say so honestly. */
export async function GET() {
  return NextResponse.json(
    { configured: isConfigured() },
    { headers: { 'cache-control': 'no-store' } },
  );
}