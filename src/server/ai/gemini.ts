import 'server-only';

import { isKnownLanguage, languageMeta } from '@/content/i18n';
import { askQuestion as ask, aiStatus } from './ask';
import { FALLBACK_MODELS, geminiKey, geminiModel, ollamaModel } from './providers';

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
 * Counts today's Gemini answers, per model.
 *
 * ── Why the count is per model and not one total ─────────────────────────────
 * Google counts the free allowance **per model, per day**: twenty calls to each
 * model, counted separately. So the only honest way to know what is left is to
 * ask what has been spent on each model, and this returns one number per model.
 *
 * The single total that used to stand here was wrong in a way that only showed
 * up later in the day. It added up every Gemini answer and compared the sum to
 * one limit, so once the total passed it the whole provider was switched off —
 * including for models that had not been called even once. Two models were
 * sitting on an untouched forty calls each while visitors were sent to a
 * keyless service that answers one question every thirty seconds.
 *
 * Both numbers matter, so both are recorded: the rows say which provider
 * answered, and the new `model` column says which model inside it.
 *
 * Only answered questions are counted, not attempts. The row is written after
 * the provider answers, so this is a record of what happened rather than a
 * record of what was tried. A call that was made and then refused for the wrong
 * script is not counted, which is correct: it cost nothing that a retry would not
 * also cost, and counting it would make the cap stricter without making it safer.
 *
 * Rows written before the `model` column existed carry an empty model name, and
 * they are counted against the first model — the pinned one — which is where
 * they did in fact go. Otherwise today's allowance would appear untouched by
 * yesterday's spending, and the cap would be exactly as broken as before for as
 * long as those rows lived.
 */
async function callsTodayByModel(): Promise<Record<string, number>> {
  const { prisma } = await import('@/server/db');
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const rows = await prisma.askedQuestion.groupBy({
    by: ['model'],
    where: {
      createdAt: { gte: startOfDay },
      provider: 'gemini',
    },
    _count: { _all: true },
  });

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.model || geminiModel()] = row._count._all;
  }
  return counts;
}


/**
 * The system instruction.
 *
 * This matters more than the model choice. The audience is elderly, often
 * low-literacy, and asking about health, debt and family crises. The prompt
 * therefore:
 *   • answers in the language the visitor chose, in plain words and short sentences
 *   • says when the honest answer is "go to a doctor" rather than guessing
 *   • knows what this website can do, so it never sends a visitor off to search
 *   • writes the language in its own script, never in Roman letters
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

  return `You are "VARSHA SAMADHAN", a free help service. You answer questions from people who are often elderly, may not read or write easily, and may be listening to a phone speaker instead of reading a screen.

RULES, in this order:

1. Answer ONLY in ${language.english} (${language.native}). Use that language's own script. Do not translate the answer into another language, and do not add an English version afterwards.
2. Use everyday words for that language and short sentences. Avoid jargon. If a foreign word has no common local equivalent, use the local word instead.
3. At most 5 short paragraphs or 6 points. A long answer is exhausting to listen to.
4. Give the direct answer in the first line. Do not open with praise such as "this is a good question".
5. If the subject is medical, legal or money, say plainly that this is not professional advice and that they should see a specialist. Never give a dosage of any medicine.
6. Never invent or guess a government scheme name, a helpline number, a price or an address. If you do not know it accurately, say clearly that you do not know and suggest where to find out.
7. Give only ONE next step — what the person should do right now. Not a list of options.
8. Never introduce yourself. You are "VARSHA SAMADHAN". Do not mention that you are an AI or a language model.
9. Spell out numbers where the language writes them as words, so they are read correctly aloud.
10. Write the language in its own script, never in Roman letters. If the visitor typed in Roman, still answer in the script. A sentence half in Roman and half in the script is the same unreadable as an English answer.
11. You are answering on the VARSHA SAMADHAN website, and you know what it can do. The visitor can save any answer as a PDF, print it, copy it, send it to a family member, and read it aloud. Never tell them to search the internet, to find another website, to download an app, or to look for a Reddit page or a video. There is nothing they need to go and get, because it is all here.
12. If the question is about using this website — how to save a PDF, how to change the language, how to speak instead of typing, how to attach a document — answer about this website specifically, using what you were told above. Do not describe what some other site would do.
13. Do not tell the visitor to search, browse, visit a link or download anything. They have already come to the right place.
14. The name of the person this site is for is written VARSHA — in English capital letters, in every language, even when the rest of your answer is in another script. Never write it in a native script (वर्षा, বর্ষা, வர்ஷா, వర్షా, ਵਰਸ਼ਾ, વર્ષા, ವರ್ಷಾ, വർഷ, ورشا) and never as "Varsha" or "varsha". Rule 10 tells you to use the language's own script for ordinary words; this rule is the one exception, and it is absolute. Say "VARSHA जी" in Hindi, "VARSHA" in Bengali, "VARSHA ji" in English.

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

/**
 * How many questions the whole day may be answered by the keyed provider.
 *
 * ── Why 120, and not 40 ──────────────────────────────────────────────────────
 * Google's free allowance is counted **per model, per day** — twenty calls to
 * each model, and six models that answer today, so a hundred and twenty questions
 * before anything is refused.
 *
 * This cap was 40, a third of what the account actually has, and the unused
 * calls were being thrown away deliberately: once the fortieth answer of the day
 * had been given, every later visitor was sent straight to the keyless
 * providers — which are free, but which serve one question every thirty seconds
 * and which refused seven of thirteen questions in a row.
 *
 * It is a whole-day total that is then divided by the number of models, because
 * that is the shape Google's own limit has: twenty each, not twenty in total.
 * Dividing rather than handing the whole figure to one model is what stops the
 * first model to run out from starving the other five.
 *
 * The cap is kept, because it is the thing that stops a bad deployment loop or a
 * bored visitor from turning into an invoice, and because a cap of zero is the
 * emergency switch if the key ever leaks. Going above it costs nothing: Google
 * refuses the call itself, per model, and askGemini walks to the next one.
 */
export function dailyLimit(): number {
  const raw = Number(process.env.GEMINI_DAILY_REQUEST_LIMIT ?? '120');
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 120;
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

  /*
   * The language reaches the providers, and for a long time it did not.
   *
   * systemInstruction(languageCode) above names the target language twice — once
   * in English, once in its own script — and that was thought to be enough. But
   * the call into ask.ts passed only the instruction and the question, so the
   * chain never learned which language the visitor had chosen, and:
   *
   *   - askPollinations fell back to "answer in the language of the question",
   *     which is vaguer than what preceded it and appears last, so a Bengali
   *     question came back in Hindi
   *   - nothing downstream could check the answer, because the check needs the
   *     language and it was not there
   *
   * Both are fixed by passing languageCode, which is this line. The system
   * prompt was never the problem; it was being built correctly and then thrown
   * away one function later.
   */

  /*
   * The cap, enforced — per model, because that is how Google counts it.
   *
   * This used to test a single running total, log that the cap had been reached,
   * and then call the provider anyway — so the message "daily cap reached
   * (52/40), using a free provider" was printed immediately above a line reading
   * "answered by gemini", over and over. The cap was a log line, not a cap.
   *
   * Then it did skip the provider, which was better and still wrong: one total
   * against a per-model quota, so a busy hour on the first model locked out the
   * models that had not been touched. What is passed down is now what is left
   * **for each model by name**, so a model with nothing is skipped and a model
   * with its full twenty is asked as normal.
   *
   * A cap of zero switches the keyed provider off without deleting the key,
   * which is the emergency setting if the key ever leaks.
   */
  let budgets: Record<string, number> = {};

  if (geminiKey().length > 10) {
    const perModel = Math.floor(dailyLimit() / Math.max(1, FALLBACK_MODELS.length));

    if (perModel > 0) {
      const spent = await callsTodayByModel().catch(() => ({}) as Record<string, number>);

      budgets = Object.fromEntries(
        FALLBACK_MODELS.map((model) => [model, Math.max(0, perModel - (spent[model] ?? 0))]),
      );

      const empty = Object.values(budgets).every((left) => left <= 0);
      if (empty) {
        console.log(`[ask] every model's daily allowance is spent (${perModel} each), skipping gemini`);
      }
    }
  } else {
    // No key: an empty record means "nothing left on every model", which is the
    // same as sending zeros and does not need a special case.
    budgets = Object.fromEntries(FALLBACK_MODELS.map((model) => [model, 0]));
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

  return ask(system, withContext, languageCode, budgets);
}
