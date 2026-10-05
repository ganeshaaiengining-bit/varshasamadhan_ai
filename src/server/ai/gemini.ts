import 'server-only';
import { z } from 'zod';

/**
 * ===========================================================================
 *  AI — Gemini access
 * ===========================================================================
 *
 * Everything in this file runs on the server and none of it may be imported by a
 * client component. That is the whole reason it exists.
 *
 * ── The rule ──────────────────────────────────────────────────────────────
 * `GEMINI_API_KEY` is never sent to the browser, never rendered into a page and
 * never stored in the database. The browser calls *this* module's wrapper, which
 * calls Google. A key in front-end code is readable by anyone with Ctrl+U, and
 * a stolen free-tier key is a bill waiting to happen in the owner's name.
 *
 * ── When there is no key ──────────────────────────────────────────────────
 * The site must still work. `isConfigured()` returns false, the route says so
 * plainly, and the visitor is shown a stored answer instead of an error. A free
 * service that shows an error page is worse than one that shows a lesser answer.
 */

export interface AskResult {
  ok: boolean;
  /** The answer text, when ok. */
  answer?: string;
  /** Why there is no answer. Always human-readable, never a stack trace. */
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
 * `asked_questions` doubles as the ledger: a request is written before the API
 * is called, so a crash between the call and the response still counts. That
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
 *   • answers in plain Hindi, short sentences
 *   • says when the honest answer is "go to a doctor" rather than guessing
 *   • never invents a government scheme, a helpline number or a price
 *   • gives one next step, not a list of ten
 */
const SYSTEM_INSTRUCTION = `आप "वर्षा समाधान" नामक निःशुल्क सेवा में उपयोगकर्ताओं की मदद करती हैं। आपके उपयोगकर्ता अक्सर वृद्ध हैं, पढ़ने-लिखने में कमज़ोर हो सकते हैं, या मोबाइल फ़ोन पर आवाज़ से सुन रहे होते हैं।

नियम, क्रम से:

1. उत्तर हिंदी में दें। आसान शब्द, छोटे वाक्य। अंग्रेज़ी शब्द की जगह हिंदी पर्यायवाची लिखें ("ऑनलाइन" के बजाय "इंटरनेट")।
2. अधिकतम 5 छोटे पैराग्राफ़ या 6 बिंदु। ज़्यादा लंबा उत्तर नहीं — वह सुनने में थकाने वाला है।
3. पहली पंक्ति में सीधा जवाब दें। "यह बात अच्छी है" जैसी प्रशंसा से शुरू न करें।
4. चिकित्सा, क़ानून या पैसे का मामला हो तो स्पष्ट कहें कि यह सलाह नहीं, कोई विशेषज्ञ देखना चाहिए। दवाई की ख़ुर्दाक़ कराएँ।
5. किसी सरकारी योजना, हेल्पलाइन नंबर, दाम या पते का इल्ज़ाम न करें और न बनाएँ। यदि ठीक जानकारी नहीं है तो साफ़ कहें कि आप नहीं जानते।
6. केवल एक अगला कदम बताएँ — कि उपयोगकर्ता अभी क्या करे। कई विकल्प न दें।
7. किसी भी बात में अपना परिचय न दें। आप "वर्षा समाधान" हैं।

उत्तर के अंत में अपने आप को रोकें। अनुवर्त प्रश्न पूछने की ज़रूरत नहीं।`;

const requestSchema = z.object({
  question: z.string().trim().min(3, 'कृपया थोड़ा और लिखें').max(800),
  category: z.string().trim().max(80).optional(),
});

export async function askGemini(raw: unknown): Promise<AskResult> {
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fallback: true, reason: 'प्रश्न ठीक से नहीं समझ आया।' };
  }

  if (!isConfigured()) {
    return {
      ok: false,
      fallback: true,
      reason: 'अभी AI जोड़ा नहीं गया है, इसलिए नीचे पहले से तैयार जानकारी दी गई है।',
    };
  }

  try {
    const used = await callsToday();
    if (used >= dailyLimit()) {
      return {
        ok: false,
        fallback: true,
        reason: 'आज AI की दैनिक सीमा पूरी हो गई है। कल फिर से प्रश्न पूछा जा सकेगा।',
      };
    }
  } catch {
    // If the ledger cannot be read, refuse rather than risk an unmetered bill.
    return { ok: false, fallback: true, reason: 'अभी सेवा व्यस्त है। कृपया कुछ देर बाद पूछें।' };
  }

  const { question, category } = parsed.data;
  const userText = category ? `श्रेणी: ${category}\n\nप्रश्न: ${question}` : `प्रश्न: ${question}`;

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
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
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
        return { ok: false, fallback: true, reason: 'AI की सीमा पूरी हो गई है। कुछ देर बाद पूछें।' };
      }
      if (status === 400 || status === 401 || status === 403) {
        // Usually a wrong key or a wrong model name. Do not pass the raw body to
        // the visitor: it can contain the project name and key prefix.
        console.error('[ai] configuration problem', status, await response.text().catch(() => ''));
        return {
          ok: false,
          fallback: true,
          reason: 'AI से जुड़ी हुई सेटिंग में समस्या है। नीचे पहले से तैयार जानकारी दी गई है।',
        };
      }
      return { ok: false, fallback: true, reason: 'अभी जुड़ नहीं पाए। इंटरनेट दोबारा जाँचें।' };
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const answer = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();

    if (!answer) {
      return { ok: false, fallback: true, reason: 'इस प्रश्न का उत्तर नहीं मिला। नीचे पहले से तैयार जानकारी देखें।' };
    }

    return { ok: true, answer, fallback: false };
  } catch (error) {
    console.error('[ai] request failed', error instanceof Error ? error.message : error);
    return { ok: false, fallback: true, reason: 'इंटरनेट नहीं मिल पाया। नीचे पहले से तैयार जानकारी दी गई है।' };
  }
}