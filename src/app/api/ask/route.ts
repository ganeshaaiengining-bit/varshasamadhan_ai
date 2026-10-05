import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { askGemini, isConfigured } from '@/server/ai/gemini';

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

  // A greeting is not a question. Answering one wastes a metered call and tells
  // the visitor something is broken.
  if (TRIVIAL.has(question.replace(/[।.!?।]/g, '').trim().toLowerCase())) {
    return NextResponse.json({
      ok: false,
      fallback: true,
      reason: 'आपका स्वागत है! नीचे अपनी समस्या लिखिए या कोई श्रेणी चुनिए।',
    });
  }

  const result = await askGemini({ question, category });

  await prisma.askedQuestion.create({
    data: {
      question,
      category,
      wasAnswered: result.ok,
      wasFailed: !result.ok,
    },
    select: { id: true },
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 200 });
}

/** GET tells the client whether AI is available, so the UI can say so honestly. */
export async function GET() {
  return NextResponse.json(
    { configured: isConfigured() },
    { headers: { 'cache-control': 'no-store' } },
  );
}