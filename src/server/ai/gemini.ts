import 'server-only';
import { z } from 'zod';
import { isKnownLanguage, languageMeta } from '@/content/i18n';

/**
 * ===========================================================================
 *  AI — Gemini access
 *
 *  Everything in this file runs on the server and none of it may be imported by
 *  a client component. That is the whole reason it exists.
 *
 *  ── The rule ──────────────────────────────────────────────────────────────
 *  `GEMINI_API_KEY` is never sent to the browser, never rendered into a page and
 *  never stored in the database. The browser calls *this* module's wrapper, which
 *  calls Google. A key in front-end code is readable by anyone with Ctrl+U, and
 *  a stolen free-tier key is a bill waiting to happen in the owner's name.
 *
 *  ── When there is no key ──────────────────────────────────────────────────
 *  The site must still work. `isConfigured()` returns false, the route says so
 *  plainly, and the visitor is shown a stored answer instead of an error. A free
 *  service that shows an error page is worse than one that shows a lesser answer.
 *
 *  ── Why failures come back as keys, not sentences ──────────────────────────
 *  Every failure here returns a `reasonKey` such as `ask.errorRateLimit` rather
 *  than a finished Hindi sentence. The browser resolves it against whichever of
 *  the 18 languages the visitor picked. Sending prose from here would mean a
 *  Tamil speaker was told their quota was finished in Hindi — the exact failure
 *  this project exists to avoid. `reason` is kept alongside it for logs and for
 *  any caller with no translation table of its own.
 */

export interface AskResult {
  ok: boolean;
  /** The answer text, when ok. */
  answer?: string;
  /** Translation key for the failure, e.g. `ask.errorRateLimit`. */
  reasonKey?: string;
  /** Hindi fallback for the same failure, for logs and non-UI callers. */
  reason?: string;
  /** True when the caller should fall back to a stored article. */
  fallback: boolean;
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;

export function isConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10);
}

/**
 * Counts today's AI calls.
 *
 * `asked_questions` doubles as the ledger: a request is written before the API is
 * called, so a crash between the call and the response still counts. That
 * makes the cap slightly conservative rather than slightly leaky, which is the
 * right direction for a cost limit.
 */
async function callsToday(): Promise<number> {
  const { prisma } = await import('@/server/db');
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return prisma.askedQuestion.count({
    where: { createdAt: { gte: startOfDay }, wasAnswered: true },
  });
}

function dailyLimit(): number {
  const raw = Number(process.env.GEMINI_DAILY_REQUEST_LIMIT ?? '40');
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 40;
}

/**
 * The system instruction.
 *
 * This matters more than the model choice. The audience is elderly, often
 * low-literacy, and asking about health, debt and family crises. The prompt
 * therefore:
 *   • answers in the language the visitor chose, in plain words and short sentences
 *   • says when the honest answer is "go to a doctor" rather than guessing
 *   • never invents a government scheme, a helpline number or a price
 *   • gives one next step, not a list of ten
 *
 * ── Why the rules are written in English ───────────────────────────────────
 * The rules are instructions *to the model*, not to the visitor, and a model
 * follows them more reliably in one language than in eighteen. Naming the
 * target language in both its English and its native form is also what actually
 * works for languages with a large English-loanword vocabulary, where "Tamil"
 * alone can be read as an instruction to sprinkle the odd English word into the
 * answer. The earlier version of this prompt was written entirely in Hindi,
 * which made "answer in Hindi" a property of the prompt — and there was no way
 * to answer in anything else without rewriting it per language.
 */
function systemInstruction(languageCode: string): string {
  const language = isKnownLanguage(languageCode) ? languageMeta(languageCode) : languageMeta('hi');

  return `You are "Varsha Samadhan" (वर्षा समाधान), a free help service. You answer questions from people who are often elderly, may not read or write easily, and may be listening to a phone speaker instead of reading a screen.

RULES, in this order:

1. Answer ONLY in ${language.english} (${language.native}). Use that language's own script. Do not translate the answer into another language, and do not add an English version afterwards.
2. Use everyday words for that language and short sentences. Avoid jargon. If a foreign word has no common local equivalent, use the local word instead.
3. At most 5 short paragraphs or 6 points. A long answer is exhausting to listen to.
4. Give the direct answer in the first line. Do not open with praise such as "this is a good question".
5. If the subject is medical, legal or money, say plainly that this is not professional advice and that they should see a specialist. Never give a dosage of any medicine.
6. Never invent or guess a government scheme name, a helpline number, a price or an address. If you do not know it accurately, say clearly that you do not know and suggest where to find out.
7. Give only ONE next step — what the person should do right now. Not a list of options.
8. Never introduce yourself. You are "Varsha Samadhan". Do not mention that you are an AI or a language model.
9. Spell out numbers where the language writes them as words, so they are read correctly aloud.

Stop after the answer. Do not offer follow-up questions.`;
}

const requestSchema = z.object({
  question: z.string().trim().min(3, 'too short').max(800),
  category: z.string().trim().max(80).optional(),
  lang: z.string().trim().max(10).optional(),
});

export async function askGemini(raw: unknown): Promise<AskResult> {
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fallback: true,
      reasonKey: 'ask.emptyAnswer',
      reason: 'प्रश्न ठीक से नहीं समझ आया।',
    };
  }

  if (!isConfigured()) {
    /*
     * Its own key, not `ask.notAnswer`.
     *
     * That message told the visitor to press the ask button again, which is the
     * one action that cannot help here: there is no key, so every retry produced
     * the identical page. A visitor who has no way to fix it should not be told
     * to keep trying, and the owner should be told it plainly in the admin panel
     * rather than discovering it from a support request.
     *
     * The wording stays visitor-facing and does not name the missing setting —
     * the site is free and public, and "the developer forgot a key" is not help
     * to anyone. It says what is true: this is a saved library, and the answer
     * was not in it.
     */
    return {
      ok: false,
      fallback: true,
      reasonKey: 'ask.notConfigured',
      reason:
        'यह सेवा अभी अपने पुराने जवाबों के बंद दराज़ से जवाब दे रही है। आपका सवाल उसमें नहीं मिला।',
    };
  }

  try {
    const used = await callsToday();
    if (used >= dailyLimit()) {
      return {
        ok: false,
        fallback: true,
        reasonKey: 'ask.errorRateLimit',
        reason: 'आज AI की दैनिक सीमा पूरी हो गई है। कल फिर से प्रश्न पूछा जा सकेगा।',
      };
    }
  } catch {
    // If the ledger cannot be read, refuse rather than risk an unmetered bill.
    return {
      ok: false,
      fallback: true,
      reasonKey: 'ask.errorNetwork',
      reason: 'अभी सेवा व्यस्त है। कृपया कुछ देर बाद पूछें।',
    };
  }

  const { question, category, lang } = parsed.data;
  const languageCode = isKnownLanguage(lang ?? '') ? lang! : 'hi';

  const userText = category ? `Topic: ${category}\n\nQuestion: ${question}` : `Question: ${question}`;

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // The key goes in a header, never in a URL — a URL ends up in server
        // logs, proxy logs and browser history.
        'x-goog-api-key': process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction(languageCode) }] },
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig: {
          temperature: 0.4, // Low: a prayer or a dose should not vary run to run.
          maxOutputTokens: 800,
        },
      }),
      // A hung request must not hold the visitor's screen. The service is free,
      // so failing fast and showing a stored answer beats waiting 30 seconds.
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return {
          ok: false,
          fallback: true,
          reasonKey: 'ask.errorRateLimit',
          reason: 'AI की सीमा पूरी हो गई है। कुछ देर बाद पूछें।',
        };
      }
      if (status === 400 || status === 401 || status === 403) {
        // Usually a wrong key or a wrong model name. Do not pass the raw body to
        // the visitor: it can contain the project name and key prefix.
        console.error('[ai] configuration problem', status, await response.text().catch(() => ''));
        return {
          ok: false,
          fallback: true,
          reasonKey: 'ask.emptyAnswer',
          reason: 'AI से जुड़ी हुई सेटिंग में समस्या है। नीचे पहले से तैयार जानकारी दी गई है।',
        };
      }
      return {
        ok: false,
        fallback: true,
        reasonKey: 'ask.errorNetwork',
        reason: 'अभी जुड़ नहीं पाए। इंटरनेट दोबारा जाँचें।',
      };
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const answer = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();

    if (!answer) {
      return {
        ok: false,
        fallback: true,
        reasonKey: 'ask.notAnswer',
        reason: 'इस प्रश्न का उत्तर नहीं मिला। नीचे पहले से तैयार जानकारी देखें।',
      };
    }

    return { ok: true, answer, fallback: false };
  } catch (error) {
    console.error('[ai] request failed', error instanceof Error ? error.message : error);
    return {
      ok: false,
      fallback: true,
      reasonKey: 'ask.errorNetwork',
      reason: 'इंटरनेट नहीं मिल पाया। नीचे पहले से तैयार जानकारी दी गई है।',
    };
  }
}