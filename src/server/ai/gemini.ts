import 'server-only';

import { isKnownLanguage, languageMeta } from '@/content/i18n';
import { askQuestion as ask, aiStatus } from './ask';
import { geminiKey, geminiModel, ollamaModel } from './providers';

/**
 * ===========================================================================
 *  AI — the public entry point
 * ===========================================================================
 *
 *  Everything in this file runs on the server and none of it may be imported by
 *  a client component. That is the whole reason it exists.
 *
 *  ── The rule ──────────────────────────────────────────────────────────────
 *  No API key is ever sent to the browser, never rendered into a page and never
 *  stored in the database. The browser calls *this* module, which calls the
 *  model. A key in front-end code is readable by anyone with Ctrl+U, and a
 *  stolen key is a bill waiting to happen in the owner's name.
 *
 *  ── Any question gets an answer ────────────────────────────────────────────
 *  The owner asked for this directly, and for five days the site could not do it
 *  because it only knew how to ask one service. Three are now tried in turn —
 *  see src/server/ai/providers.ts for why three and what each one is.
 *
 *  ── Why failures come back as keys, not sentences ──────────────────────────
 *  Every failure returns a 
easonKey such as sk.errorRateLimit rather than a
 *  finished Hindi sentence. The browser resolves it against whichever of the 18
 *  languages the visitor picked. Sending prose from here would mean a Tamil
 *  speaker was told their quota was finished in Hindi — the exact failure this
 *  project exists to avoid.
 */

export type { AskResult } from './ask';
import type { AskResult } from './ask';

/** Whether the owner's Google key is present. Kept for the admin panel. */
export function isConfigured(): boolean {
  return geminiKey().length > 10;
}

/** The model name, for the admin panel and for logs. */
export { geminiModel, ollamaModel };

/** Which providers can answer right now. For the admin panel only. */
export { aiStatus };

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
/*
 * ===========================================================================
 *  THE DAILY CAP
 * ===========================================================================
 *
 * Kept even though the fallback providers are free, because Gemini is not, and
 * because a cap that only applies when the primary happens to be configured is
 * not a cap. A bad deployment loop — or someone hammering the button — can make
 * hundreds of calls in an hour, and a paid tier turning that into an invoice is
 * a worse outcome than the site going quiet for a day.
 *
 * Only counted when an answer was actually produced. A visitor whose question
 * fell through to Ollama after Gemini refused it has not used a Gemini call.
 */

/** How many questions may be answered by the paid provider in one day. */
export function dailyLimit(): number {
  const raw = Number(process.env.GEMINI_DAILY_REQUEST_LIMIT ?? '40');
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 40;
}

/**
 * Ask a question, using whatever provider is able to answer.
 *
 * The cap is checked here rather than inside askQuestion, because the cap is a
 * property of the paid provider and the fallbacks are free — a visitor should
 * still be answered by Ollama on the 41st question of the day.
 */
export async function askQuestion(
  languageCode: string,
  question: string,
  category?: string,
): Promise<AskResult> {
  const system = systemInstruction(languageCode);

  // A cap of zero switches the paid provider off without deleting the key.
  if (dailyLimit() > 0 && geminiKey().length > 10) {
    const today = await callsToday().catch(() => 0);
    if (today >= dailyLimit()) {
      console.log(`[ask] daily cap reached (${today}/${dailyLimit()}), using a free provider`);
    }
  }

  /*
   * The category is folded into the prompt rather than being sent as a filter.
   * A visitor on /sahayata has already told us they want help with something,
   * and naming it makes the answer narrower and better. It is not trusted as
   * instructions — it is appended as context, not obeyed as a command.
   */
  const withContext = category?.trim()
    ? `${question}\n\n(Context: the visitor is on the page for ${category.trim().slice(0, 60)}.)`
    : question;

  return ask(system, withContext);
}
