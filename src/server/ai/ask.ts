import 'server-only';

import {
  askGemini,
  askOllama,
  askPollinations,
  ollamaReady,
  answersInLanguage,
  type ProviderName,
  type ProviderResult,
} from './providers';

/**
 * ===========================================================================
 *  ASKING A QUESTION — whatever it takes to answer it
 * ===========================================================================
 *
 * Tries each provider in turn and returns the first real answer.
 *
 * ── Why this file exists at all ────────────────────────────────────────────
 *
 * The owner's instruction was blunt: any question must get an answer from the
 * AI, right now, not from a stored article.
 *
 * That could not be met with a single provider. The Google key needed a login
 * that would not complete — the SMS code never arrived. A keyless service
 * answered about half the time, took 24 seconds, and once explained Kundalini
 * awakening using astrology, which is the exact confusion the owner had already
 * had to correct once on this site. A local model needed a 1.5 GB install that a
 * connection dropping at 1.08 GB of 1.58 GB would not deliver.
 *
 * So the answer is not one provider. It is all three, in order, with the next
 * tried whenever the previous one does not produce a real answer.
 *
 * ── What counts as "did not produce a real answer" ──────────────────────────
 *
 * Not just an exception. An empty response, a 402, a 429, a timeout and a
 * missing key are all "no", because from the visitor's side they are identical:
 * nothing appeared. Treating an empty string as success would return a blank
 * answer box and look like a bug.
 *
 * ── What is never done here ────────────────────────────────────────────────
 *
 * A failed provider is never retried in place, and no provider's failure is ever
 * shown to the visitor as a technical error. They see one sentence in their own
 * language and a list of topics. The detail goes to the console, because the
 * owner needs to know which provider answered to reason about what to fix next,
 * and no visitor has ever been helped by being told which API rejected them.
 */

/** What the route needs to know about the outcome. */
export interface AskResult {
  ok: boolean;
  /** The model's answer. Only ever real text. */
  answer?: string;
  fallback: boolean;
  /**
   * A translation key, not prose. The visitor's language is chosen in the
   * browser; sending a Hindi sentence from the server would put Hindi on a Tamil
   * page. See the note at the top of src/content/i18n.ts.
   */
  reasonKey?: string;
  /** Last resort only, when the key itself has no translation. */
  reason?: string;
  /**
   * Which provider answered. Logged for the owner, never rendered.
   *
   * Worth keeping: when the site answers only half the time, the first question
   * is "which of the three is failing", and this answers it without guessing.
   */
  provider?: ProviderName;
  /** Milliseconds spent, across all providers tried. */
  ms?: number;
}

/** Order is quality order, not preference order. */
const ORDER: Array<{ name: ProviderName; run: typeof askGemini }> = [
  { name: 'gemini', run: askGemini },
  { name: 'ollama', run: askOllama },
  { name: 'pollinations', run: askPollinations },
];

export async function askQuestion(
  system: string,
  question: string,
  /**
   * The visitor's language code.
   *
   * Threaded through to the providers because the site knows exactly which
   * language was chosen and the providers were not being told. Two consequences
   * of that, both of them real:
   *
   *   - the fallback providers name the language at the end of their own prompt,
   *     because the vaguer wording they used before was overriding the good
   *     system instruction and a Bengali question came back in Hindi
   *   - an answer in the wrong script is refused, so a visitor is never shown
   *     text they cannot read
   *
   * Optional, so nothing that called this before has to change, but every call
   * site should pass it. Without it the language check is skipped rather than
   * guessed.
   */
  languageCode?: string,
  /*
   * How many calls the keyed provider has left today, or Infinity when the cap
   * is off. Zero means do not call it at all — not call it and discard the
   * answer, which is what the cap used to do.
   */
  geminiBudget = Infinity,
): Promise<AskResult> {
  const started = Date.now();

  /*
   * Ollama is asked whether it is even installed before spending a call on it.
   * A 4-second check against a closed port beats a 90-second timeout on every
   * single request, which is what happens if it is simply tried and allowed to
   * fail — and on this machine, where the model is not installed, that is the
   * common case and the difference between a fast answer and a frozen page.
   */
  const local = await ollamaReady();

  /*
   * One extra attempt at the provider that owns the key.
   *
   * Providers are tried in order and the first real answer wins, so a retry
   * costs nothing when the first attempt succeeds. It matters because the
   * measured failure rate of the free providers is high: a live run of all
   * eighteen languages lost four of them entirely, each because the primary
   * timed out and the fallback also failed.
   *
   * Those four failures were not evenly spread. They clustered, which is what a
   * poor connection looks like rather than a bad key — Gemini answered seven of
   * twelve in the first burst and then, once the daily allowance for one model
   * was spent, refused everything for ten hours. The retry covers the first kind
   * and cannot help the second, and the reason is logged either way so the two
   * are not confused again.
   *
   * Only the primary is retried. The fallbacks are free and unreliable, and
   * asking them twice doubles the waiting for a visitor who is already waiting.
   */
  const attempts = geminiBudget > 0 ? 2 : 1;

  for (let pass = 0; pass < attempts; pass++) {
    for (const provider of ORDER) {
      if (provider.name === 'ollama' && !local) continue;

      /*
       * The keyed provider is skipped, not failed, once today's allowance is
       * gone. Skipping is what makes the cap a cap: the call is never made, so
       * it cannot be paid for. The retry pass below is skipped at the same time,
       * because a second attempt would spend a second call.
       */
      if (provider.name === 'gemini' && geminiBudget <= 0) continue;

      // The primary is the one retried, and only when there is another pass left.
      const isLastPass = pass === attempts - 1;
      const retryable = provider.name === 'gemini' && !isLastPass;
      if (isLastPass && provider.name === 'gemini' && pass > 0) {
        // Already had its turn on the previous pass.
        continue;
      }

      const result: ProviderResult = await provider.run(system, question, languageCode);

      if (result.ok) {
        /*
         * An answer in the wrong script is not an answer.
         *
         * This is the one failure a visitor cannot do anything with, and the one
         * that looks the most like success: the page renders, the button
         * responds, text appears. The only clue is that none of it can be read.
         * So it is treated exactly like an empty response — the provider did not
         * produce a real answer, and the next one is tried.
         *
         * Found by scripts/check-ai.py asking a Bengali question and receiving
         * Hindi, which is the complaint that started this whole exercise. Nothing
         * else in the chain would have caught it: the response was well formed,
         * non-empty, on-topic, and plausible.
         */
        if (!answersInLanguage(result.text, languageCode)) {
          console.log(
            `[ask] ${result.provider} answered in the wrong script for ` +
              `${languageCode} — refusing it and trying the next provider`,
          );
          continue;
        }

        console.log(
          `[ask] answered by ${result.provider} in ${result.ms}ms ` +
            `(total ${Date.now() - started}ms, pass ${pass + 1})`,
        );
        return {
          ok: true,
          answer: result.text,
          fallback: false,
          provider: result.provider,
          ms: Date.now() - started,
        };
      }

      console.log(
        `[ask] ${result.provider} gave nothing: ${result.reason} in ${result.ms}ms` +
          (retryable ? ' — will try once more' : ''),
      );

      // A rate-limited key will not recover in the time a retry could wait for.
      // Retrying it only spends the visitor's time to reach the same answer.
      if (result.reason === 'rate-limit') break;
    }
  }

  console.log(`[ask] no provider answered after ${Date.now() - started}ms`);
  return {
    ok: false,
    fallback: true,
    reasonKey: 'ask.notAnswer',
    ms: Date.now() - started,
  };
}

/**
 * Whether anything can answer at all, for the admin panel.
 *
 * The owner's five days of not getting answers came from a missing setting that
 * left no trace anywhere a visitor or a passer-by would see. This is the check
 * that makes it visible to the one person who can fix it.
 */
export async function aiStatus(): Promise<{
  gemini: boolean;
  ollama: boolean;
  pollinations: boolean;
  ollamaModel: string;
}> {
  const ollama = await ollamaReady();

  return {
    gemini: (process.env.GEMINI_API_KEY ?? '').trim().length > 10,
    ollama,
    pollinations: true,
    ollamaModel: process.env.OLLAMA_MODEL?.trim() || 'qwen2.5:1.5b',
  };
}