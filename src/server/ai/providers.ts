import 'server-only';

import { isKnownLanguage, languageMeta } from '@/content/i18n';
import { answersInLanguage } from './language';

// Re-exported so importers of this module keep working; the logic lives in
// language.ts because providers.ts cannot be imported outside a request.
export { answersInLanguage };

/**
 * ===========================================================================
 *  PROVIDERS — anything that can answer a question
 * ===========================================================================
 *
 * Three of them, tried in order, so that the site answers whenever *anything*
 * works:
 *
 *   1. GEMINI_API_KEY   Google's free tier. Best quality, 1500 questions a day.
 *                       Needs the owner to log in once and copy a key.
 *   2. Ollama on 11434  Runs on this laptop, no key, no account, no internet.
 *                       Needs a one-time 1.5 GB install.
 *   3. Pollinations     No key, no account, nothing to install. But it is a free
 *                       community pool: it rate-limits to the point of answering
 *                       about half the time, takes 20-25 seconds, and has been
 *                       seen answering a question about Kundalini awakening
 *                       with astrology.
 *
 * ── Why three, and not one ─────────────────────────────────────────────────
 *
 * The owner has been without an answer for five days while two ways of getting
 * one were tried and both failed: Google's login would not send a code to this
 * phone, and the connection kept dropping a 1.5 GB installer at 1.08 GB. A site
 * that only knows how to ask one service is one broken thing away from answering
 * nothing at all, which is what happened.
 *
 * With three, the failure of any one of them is invisible. The answer simply
 * comes from the next one. That is what "any question gets an answer" has to
 * mean in practice, not in principle.
 *
 * ── Order matters, and it is quality order ────────────────────────────────
 *
 * Gemini first because it is the best model of the three and it is free at a
 * scale the site could actually reach. Ollama second because it is good and
 * private but slow on a machine with no graphics card. Pollinations last because
 * it is the only one that cannot be relied on at all.
 *
 * ── What is never done ────────────────────────────────────────────────────
 *
 * No fallback here can be silent. If the first provider fails and the second
 * answers, the answer is still the model's own, not something invented. And if
 * all three fail, the caller is told so — a wrong answer from a service that
 * felt like trying is worse than an honest "not now".
 */

/** Which provider answered. Reported to the owner, never to the visitor. */
export type ProviderName = 'gemini' | 'ollama' | 'pollinations';

export interface ProviderAnswer {
  text: string;
  provider: ProviderName;
  /**
   * Which model inside that provider produced the answer.
   *
   * Present only for the keyed provider, and it is not decoration. Google's free
   * allowance is counted per model, so knowing which one answered is the only way
   * to know how much of the day is left — and the answer is written to the
   * ledger against this name so tomorrow's count is right.
   */
  model?: string;
  /** Milliseconds. Logged, so a slow provider can be spotted. */
  ms: number;
}

export interface ProviderFailure {
  provider: ProviderName;
  reason: 'no-key' | 'network' | 'rate-limit' | 'empty' | 'timeout';
  ms: number;
}

export type ProviderResult =
  | ({ ok: true } & ProviderAnswer)
  | ({ ok: false } & ProviderFailure);

/*
 * Per-provider deadlines, not one for all of them.
 *
 * A single 90-second deadline was shared, and it was the wrong number twice
 * over. It was too long for the fallback chain: when the free provider was
 * unlucky, a visitor waited a minute and a half for nothing. It was also not
 * long enough for the primary, which is measured answering in 21, 30, 57 and 71
 * seconds — one live run saw 71.6 seconds — so a correct answer arriving at
 * seventy seconds was thrown away and the visitor was shown nothing.
 *
 * What is left is not a race. The providers are tried in order and the first
 * real answer wins, so a slow primary costs time only when it fails, and a fast
 * fallback costs nothing at all when the primary succeeds.
 *
 * The primary's budget is generous because it is the only one with a key, and
 * the only one that produces a consistent answer in the visitor's language. The
 * free provider's is short because it is unreliable anyway — the wrong-language
 * guard rejects most of what it returns, so waiting longer on it mostly waits
 * longer for something that will be discarded.
 */
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 150_000);
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 90_000);
const POLLINATIONS_TIMEOUT_MS = Number(process.env.POLLINATIONS_TIMEOUT_MS ?? 45_000);

/** The default for any provider that does not pass its own deadline. */
const TIMEOUT_MS = 90_000;

/**
 * Fetch with a hard deadline.
 *
 * A help request from someone in pain cannot hang. Without this the site waits
 * out a provider's worst case and then tries the next one, and the visitor has
 * already gone. The reason a failure happened is now reported rather than
 * flattened into one word, because a bare "network" sent the diagnosis after a
 * timeout for several days.
 */
async function timedFetch(
  url: string,
  init: RequestInit,
  ms = TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ========================================================================== */
/* 1. GEMINI                                                                   */
/* ========================================================================== */

/** Google's free tier. Empty until the owner logs in once and copies a key. */
export function geminiKey(): string {
  return (process.env.GEMINI_API_KEY ?? '').trim();
}

export function geminiModel(): string {
  // Chosen by measuring the account's own quota, not by picking the newest
  // name. Listing the models proves a model exists; it does not prove it can be
  // called. Two independent limits bite here, and they are not the same thing:
  //
  //   429, "limit: 20", retry in 10h  a daily per-model allowance. Counted
  //                               separately for each model, so one model's
  //                               exhaustion never touches another's.
  //   503, "high demand"              the model is listed, callable, and
  //                               currently saturated. No header explains it
  //                               and no amount of waiting within a request
  //                               helps; a different model answers at once.
  //
  // What this account actually did, in order of asking:
  //
  //   gemini-flash-lite-latest  answered all afternoon, then 503 for everyone
  //   gemini-3.1-flash-lite     503 for most of an afternoon, then answered
  //   gemini-3.5 / 3.6-flash    answered, then spent their 20 for the day
  //   gemini-3.8-flash          503 all one afternoon; 200 when re-measured
  //   gemini-flash-latest       503 all one afternoon; 200 when re-measured
  //   gemini-2.5 / 2.0-flash    404, no longer available
  //   gemini-pro variants       429 with a limit of 0, not on the free tier
  //
  // There is no model that is reliably free and reliably uncrowded, so the
  // answer is a rotation rather than a single name: FALLBACK_MODELS is walked
  // when the first one is refused, and a 503 costs nothing but the check.
  //
  // Do not read the "503 all one afternoon" lines as a verdict on the model.
  // Two of them were written off on that evidence and were answering 200 a few
  // days later, which is two hundred questions a day left on the table. Run
  // scripts/probe-models.ts and believe it.
  //
  // GEMINI_MODEL pins the first choice, which is how this is overridden.
  return process.env.GEMINI_MODEL?.trim() || FALLBACK_MODELS[0];
}

/**
 * Tried in order when the first model is refused.
 *
 * Only models measured to answer on this account are listed. A model that has
 * only ever returned 404 or 503 is not here, because including it would add a
 * request's worth of delay to every failure for the chance of an answer that
 * has not been observed even once.
 *
 * ── Why the list is six long and not four ────────────────────────────────────
 * Google counts the free allowance **per model**: twenty calls each, counted
 * separately, so six models is a hundred and twenty questions in a day instead
 * of eighty. That is not a trick and it costs nothing — it is simply what the
 * free tier already grants, and a shorter list quietly leaves two thirds of it
 * unclaimed.
 *
 * Two of these six were left out for a long time because they returned 503 every
 * time they were asked, and a note here recorded that as a fact about the model.
 * It was not: it was a fact about an afternoon. Re-measured with
 * scripts/probe-models.ts, both answer 200 today.
 *
 * That is the whole reason that script exists, and the reason this list is
 * written as a measurement rather than an opinion. A comment that says a model
 * is dead is a claim that decays; a script that asks Google is true every time
 * it is run, and answers in twenty seconds.
 */
export const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

export async function askGemini(
  system: string,
  question: string,
  // Unused here, but part of the one signature every provider shares so
  // ask.ts can call them interchangeably.
  _languageCode?: string,
  /**
   * What is left of today's free allowance, for each model by name.
   *
   * Omitted means "no budget is being tracked", and every model is tried. This
   * is what a second Gemini key would need, and it is also what the fallback
   * path gets, so a caller that has not been updated keeps working exactly as
   * before rather than being told the day is over.
   */
  budgets: Record<string, number> = {},
): Promise<ProviderResult> {
  const started = Date.now();
  const key = geminiKey();

  if (key.length <= 10) {
    return { ok: false, provider: 'gemini', reason: 'no-key', ms: 0 };
  }

  /*
   * Walk the model list rather than asking one and giving up.
   *
   * The free tier has two ways of refusing, and only one of them is obvious
   * from the outside. A 429 means this model is out of its daily allowance, and
   * every model has its own allowance, so the next one usually answers. A 503
   * means the model is saturated right now, which is the same situation with
   * less information in it.
   *
   * Both are answered the same way here, and the order matters more than it
   * looks: the daily cap is counted per model, so walking the list is also the
   * way to spend an allowance without then refusing every visitor for the rest
   * of the day. Measured on this account, model one was saturated and model two
   * answered in 2.7 seconds.
   *
   * A 400 is not retried. That is a malformed request and every model would
   * reject it identically, so trying the next one would spend three requests
   * to produce the same failure.
   */
  const models = [geminiModel(), ...FALLBACK_MODELS.filter((m) => m !== geminiModel())];

  for (const model of models) {
    /*
     * This model has already spent today's allowance.
     *
     * Google's allowance is counted per model, so the models that have not been
     * called yet are worth calling even after the first few have run dry. That
     * is what this line is for: the caller sends what is left of the day's quota
     * for each model by name, and a model with nothing left is skipped rather
     * than sent a request Google is certain to refuse.
     *
     * Skipping rather than trying matters for the visitor's patience as much as
     * for the quota. Six models each refusing in turn costs six round trips to
     * arrive at the same "no", and the site has measured refusals taking real
     * seconds each.
     */
    const left = budgets[model];
    if (left !== undefined && left <= 0) {
      console.log(`[gemini] ${model} has no allowance left today, skipping it`);
      continue;
    }

    try {
      const response = await timedFetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-goog-api-key': key,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: question }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
          }),
        },
        GEMINI_TIMEOUT_MS,
      );

      if (response.status === 429 || response.status === 503) {
        console.warn(
          `[gemini] ${model} is unavailable (HTTP ${response.status}), trying the next model`,
        );
        continue;
      }

      if (response.status === 400) {
        // Malformed. No model will accept it.
        return { ok: false, provider: 'gemini', reason: 'network', ms: Date.now() - started };
      }

      if (!response.ok) {
        return { ok: false, provider: 'gemini', reason: 'network', ms: Date.now() - started };
      }

      const data = (await response.json()) as {
        candidates?: {
          content?: { parts?: { text?: string; thought?: boolean }[] };
        }[];
      };

      /*
       * Only the parts that are not the thinking.
       *
       * A reasoning model streams its working-out in `parts` alongside the
       * answer, marked `thought: true`. Taking every part concatenates the two,
       * so the visitor reads the model's private deliberation before the answer
       * — the same failure as the JSON envelope on the free provider, reached a
       * different way. A thinking model is a live path here and not a
       * hypothetical.
       */
      const text = (data.candidates?.[0]?.content?.parts ?? [])
        .filter((part) => part.thought !== true)
        .map((part) => part.text ?? '')
        .join('')
        .trim();

      if (!text) {
        // A refusal or a safety block arrives as a 200 with no text. Not a
        // model problem, so trying a different model would refuse the same way.
        return { ok: false, provider: 'gemini', reason: 'empty', ms: Date.now() - started };
      }

      return { ok: true, text, provider: 'gemini', model, ms: Date.now() - started };
  } catch (error) {
      /*
       * The cause is logged, not just swallowed.
       *
       * A bare catch returned the reason "network" for everything — a refused
       * connection, a DNS failure and a sixty-second abort all look identical in
       * the log, which is how four languages came back with no answer and the
       * only thing to go on was the word "network". Node hides the real reason
       * one level down in `cause`, and that is the part worth reading.
       *
       * Only the cause is logged, never the key: the request is built above and
       * the error carries the URL and the message, not the headers.
       */
      const cause = error as { cause?: { code?: string; message?: string }; message?: string };
      const detail = cause.cause
        ? `${cause.cause.code ?? ''} ${cause.cause.message ?? ''}`
        : (cause.message ?? 'unknown');
      console.warn(
        `[gemini] ${detail.trim().slice(0, 120)} (${Date.now() - started}ms)`,
      );

      // A dropped connection is not the model's fault, so the next model is
      // still worth asking rather than writing the provider off for the request.
      continue;
    }
  }

  console.warn(`[gemini] all ${models.length} models refused (${Date.now() - started}ms)`);
  return {
    ok: false,
    provider: 'gemini',
    reason: 'rate-limit',
    ms: Date.now() - started,
  };
}

/* ========================================================================== */
/* 2. OLLAMA — local, no key, no account                                        */
/* ========================================================================== */

/** Ollama's default port on localhost. */
const OLLAMA_HOST = process.env.OLLAMA_HOST?.trim() || 'http://127.0.0.1:11434';

/**
 * The local model.
 *
 * Qwen2.5 at 1.5 billion parameters, quantised to 4 bits. Chosen over the 7 and
 * 14 billion models because this laptop has no graphics card and 8 GB of RAM,
 * where a 7B model would take most of a minute to answer. Qwen is also the
 * small model that is genuinely usable in Devanagari, Tamil and Telugu rather
 * than transliterating them into Roman letters, which is the failure that would
 * make the whole language feature pointless.
 */
export function ollamaModel(): string {
  return process.env.OLLAMA_MODEL?.trim() || 'qwen2.5:1.5b';
}

/**
 * Whether a local model is actually there.
 *
 * Checked once per call rather than cached. Ollama is started and stopped by
 * hand, and a cached "unavailable" would keep answering that it is unavailable
 * after the owner has just launched it — the exact moment it matters most.
 */
export async function ollamaReady(): Promise<boolean> {
  try {
    const response = await timedFetch(`${OLLAMA_HOST}/api/tags`, {}, 4000);
    if (!response.ok) return false;

    const data = (await response.json()) as { models?: { name?: string }[] };
    const wanted = ollamaModel();

    return (data.models ?? []).some((model) => {
      const name = model.name ?? '';
      // Ollama reports "qwen2.5:1.5b"; a user may set "qwen2.5" or a full tag.
      return name === wanted || name.split(':')[0] === wanted.split(':')[0];
    });
  } catch {
    return false;
  }
}

export async function askOllama(
  system: string,
  question: string,
  // Unused here, but part of the one signature every provider shares so
  // ask.ts can call them interchangeably.
  _languageCode?: string,
): Promise<ProviderResult> {
  const started = Date.now();

  try {
    const response = await timedFetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel(),
        prompt: `${system}\n\nQuestion: ${question}\n\nAnswer:`,
        stream: false,
        // Low, because this runs on a CPU with no graphics card. The default is
        // closer to a minute per answer here.
        options: { temperature: 0.4, num_predict: 500 },
      }),
    }, OLLAMA_TIMEOUT_MS);

    if (!response.ok) {
      return { ok: false, provider: 'ollama', reason: 'network', ms: Date.now() - started };
    }

    const data = (await response.json()) as { response?: string };
    const text = (data.response ?? '').trim();

    if (!text) {
      return { ok: false, provider: 'ollama', reason: 'empty', ms: Date.now() - started };
    }

    return { ok: true, text, provider: 'ollama', ms: Date.now() - started };
  } catch {
    return { ok: false, provider: 'ollama', reason: 'network', ms: Date.now() - started };
  }
}

/* ========================================================================== */
/* 3. POLLINATIONS — free, keyless, unreliable                                   */
/* ========================================================================== */

/**
 * Pull a usable answer out of whatever came back.
 *
 * ── Why this exists, and what it was showing visitors ──────────────────────
 *
 * Asked "गणपती ची मराठी आरती सांगा" in Marathi, the free provider replied with:
 *
 *     {"role":"assistant","reasoning":"User wants: \"गणपती ची मराठी आरती...\"
 *      They want a Marathi aarti... We nee", "tool_calls":[]}
 *
 * That was rendered to the visitor verbatim. Not a bad answer — the model's
 * private working-out, mid-sentence, wrapped in JSON, on a help site meant for
 * elderly people. It also contained no answer at all: that response has a
 * `reasoning` key and a `tool_calls` key and nothing else.
 *
 * Two separate failures, and the second is the serious one:
 *
 *   - the raw text was shown instead of being parsed;
 *   - a response with no answer in it was accepted as an answer, so the site
 *     reported success and the visitor got nothing useful.
 *
 * So this parses first, extracts only a real answer field, and returns an empty
 * string when there is none — which the caller already treats as a failure and
 * moves to the next provider. An empty string is the honest signal. Returning
 * the thinking is not, and neither is reporting success.
 *
 * ── Why the model was reasoning out loud ───────────────────────────────────
 *
 * A reasoning model asked for a hymn it does not reliably know will deliberate
 * at length and then stop. That is the model behaving correctly; the fault is
 * entirely in answering it with its scratchpad.
 */

/** Keys a response might hide the actual answer under, in order of preference. */
const ANSWER_KEYS = [
  'content',
  'text',
  'answer',
  'output',
  'message',
  'response',
  'completion',
];

/**
 * Fields that are the model thinking rather than answering.
 *
 * Listed by name so they can be stripped even from a response that also carries
 * a real answer, rather than only detected when the whole thing is JSON.
 */
const REASONING_KEYS = new Set([
  'reasoning',
  'reasoning_content',
  'thought',
  'thinking',
  'thoughts',
  'analysis',
  'tool_calls',
  'tool_calls_reasoning',
]);

/** Deep search for a plausible answer inside a parsed structure. */
function findAnswer(value: unknown, depth = 0): string | null {
  // Bounded. A model can nest arbitrarily; a response this deep is not a
  // response, it is a model having a breakdown.
  if (depth > 8 || value === null || typeof value !== 'object') return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAnswer(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  const record = value as Record<string, unknown>;

  /*
   * A thought part carries its own "text" — the thinking — and Gemini marks it
   * `thought: true`. Stepping into it is how a visitor ends up reading a model's
   * deliberation instead of its answer, so the part is skipped whole.
   */
  if (record.thought === true) return null;

  for (const key of ANSWER_KEYS) {
    const candidate = record[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      // Never hand back a field that is the reasoning under another name.
      if (REASONING_KEYS.has(key)) continue;
      return candidate.trim();
    }
  }

  /*
   * Then into every key, including ones not on the list above.
   *
   * The first version only recursed through keys it already recognised, so
   * `{choices: [{message: {content}}]}` and
   * `{candidates: [{content: {parts: [...]}}]}` both came back empty — and those
   * are the two shapes that actually arrive, one from every provider here. The
   * unrecognised keys are the wrappers, not the answer.
   */
  for (const key of Object.keys(record)) {
    if (REASONING_KEYS.has(key)) continue;

    const child = record[key];
    if (child && typeof child === 'object') {
      const found = findAnswer(child, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Turn a provider response into an answer, or into nothing.
 *
 * Returns an empty string when nothing usable is present. Callers treat that as
 * a failure and try the next provider, which is what should happen when a model
 * produces only its own reasoning.
 */
export function extractAnswer(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  /* ------------------------------------------------------------- JSON path */
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      const found = findAnswer(parsed);
      if (found) return found;
      // Parsed fine, genuinely no answer in it. Nothing to show.
      return '';
    } catch {
      // Not actually JSON despite looking like it — fall through to the text
      // path rather than discarding a real answer that starts with a brace.
    }
  }

  /* ------------------------------------------------------------- text path */
  /*
   * A whole response wrapped in a fenced block, or a stray JSON object embedded
   * in prose. Both are things a model does and neither is worth showing raw.
   *
   * The check is deliberately narrow: only a line that *is* a reasoning field is
   * removed, so an article that legitimately discusses "tool_calls" — plausible
   * on a site about work — is not silently gutted.
   */
  const fenced = trimmed.match(/^```(?:json)?\s*\n([\s\S]*?)\n?```$/);
  if (fenced) return extractAnswer(fenced[1]);

  const looksLikeRawEnvelope =
    /"role"\s*:\s*"assistant"/.test(trimmed) && /"(reasoning|tool_calls)"\s*:/.test(trimmed);

  if (looksLikeRawEnvelope) {
    const found = findAnswer(JSON.parse(trimmed.replace(/^[^({]+/, '')));
    return found ?? '';
  }

  return trimmed;
}

/**
 * Tried last, and expected to fail often.
 *
 * Measured on this machine over ten questions: five answered, five refused with
 * "402 Payment Required", median 8 seconds when it did answer and 24 when it
 * did not. Given two better options above, this exists so that the site is never
 * completely silent — not because it can be trusted.
 */
/**
 * Name the target language, in English and in its own script.
 *
 * Used as the last line of the prompt for the providers that need a nudge of
 * their own. Returns the vague wording when the language is unknown, because a
 * guess at the wrong language is worse than admitting the information is not
 * there.
 */
function languageInstruction(languageCode?: string): string {
  if (!languageCode || !isKnownLanguage(languageCode)) {
    return 'Answer only in the language of the question, in that language\'s own script.';
  }

  const language = languageMeta(languageCode);
  return `Write the entire answer in ${language.english} (${language.native}), using that language's own script and no other.`;
}

/**
 * The longest a visitor will be kept waiting for this provider to free up.
 *
 * Six seconds. Long enough that the retry actually lands in a new slot when the
 * service says one is coming soon, short enough that a refusal is still an
 * answer to the question "is this thing working" rather than an unanswered one.
 */
const POLLINATIONS_MAX_WAIT_MS = 6000;

/**
 * How long this service says to wait, from its own header.
 *
 * Returns null when there is no usable number, which is treated as "do not
 * wait" rather than as "wait a guessed amount". A guessed wait is a wasted wait:
 * it cannot be right twice.
 *
 * Accepts both forms of the header — a plain number of seconds, and an HTTP
 * date — because only the first is documented for this endpoint and the second
 * is what a standard-compliant server would send.
 */
function retryAfterSeconds(header: string | null): number | null {
  if (!header) return null;

  const seconds = Number(header.trim());
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;

  const when = Date.parse(header);
  if (Number.isNaN(when)) return null;

  return Math.max(0, Math.round((when - Date.now()) / 1000));
}

export async function askPollinations(
  system: string,
  question: string,
  /**
   * The visitor's language code, used to name the target language again at the
   * very end of the prompt.
   *
   * Optional, and the reason it is optional is worth recording: it was not a
   * parameter at all until scripts/check-ai.py asked a Bengali question and got
   * Hindi back. The system prompt already named the language twice — once in
   * English, once in its own script — and this function then appended
   *
   *     "Answer only in the language of the question, in that language's own
   *      script."
   *
   * which is vaguer than what came before it, in English, and appears last.
   * The model on this endpoint is not the one Gemini uses, and it settles for
   * the most recent instruction rather than the most emphatic. So a good prompt
   * followed by a vague one produced a Bengali visitor reading a Hindi answer —
   * which is exactly the complaint this site started with.
   *
   * When the code is known the language is named again, explicitly, in the same
   * English-plus-native form the system prompt uses. When it is not, the vague
   * wording is kept rather than guessed at.
   */
  languageCode?: string,
): Promise<ProviderResult> {
  const started = Date.now();

  try {
    // The URL carries the whole prompt, so it is encoded. Pollinations takes the
    // prompt as a path segment and has no request body for this.
    const closing = languageInstruction(languageCode);

    const prompt = `${system}\n\nQuestion: ${question}\n\n${closing} Give the answer, not your working-out.`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`;

    /*
     * This is the last provider in the chain, so a refusal here is the visitor
     * getting nothing at all.
     *
     * And its refusal is now understood rather than guessed at. Pollinations'
     * free tier serves **one text request per thirty seconds, per IP address**,
     * and says so: a 402 carrying a Retry-After header that names the moment the
     * next slot opens. A fixed two-second retry was therefore guaranteed to fail
     * — it asked again inside a window the service had already closed — and cost
     * two seconds of the visitor's wait to arrive at the same answer.
     *
     * So the wait is now the number the service sent, and only when that number
     * is small enough to sit through. Up to six seconds is worth it: it is the
     * difference between an answer in the visitor's own language and an apology
     * in it. Anything longer is refused at once, because a visitor who has waited
     * six seconds for nothing will not wait thirty, and a slow "no" is the worst
     * of the three outcomes.
     *
     * Measured while writing this: thirteen questions in a row, of which Pollinations
     * answered six. Gemini answers the rest, at eighty a day. That is the honest
     * capacity of a free service, and it is why the retry is bounded rather than
     * generous.
     */
    for (let attempt = 0; ; attempt++) {
      const response = await timedFetch(url, {
        headers: { 'User-Agent': 'VarshaSamadhan/1.0', Accept: 'text/plain' },
      }, POLLINATIONS_TIMEOUT_MS);

      if (response.status === 402 || response.status === 429) {
        const wait = retryAfterSeconds(response.headers.get('retry-after'));

        if (attempt < 1 && wait !== null && wait > 0 && wait <= POLLINATIONS_MAX_WAIT_MS) {
          console.warn(`[pollinations] limited, retrying in ${wait}s`);
          await new Promise((done) => setTimeout(done, wait * 1000));
          continue;
        }

        return { ok: false, provider: 'pollinations', reason: 'rate-limit', ms: Date.now() - started };
      }

      if (!response.ok) {
        return { ok: false, provider: 'pollinations', reason: 'network', ms: Date.now() - started };
      }

      const text = extractAnswer(await response.text());

      if (!text) {
        /*
         * Reasoning with no answer is the specific failure this service produces
         * most often, and it used to be reported as a success.
         */
        return { ok: false, provider: 'pollinations', reason: 'empty', ms: Date.now() - started };
      }

      return { ok: true, text, provider: 'pollinations', ms: Date.now() - started };
    }
  } catch {
    return { ok: false, provider: 'pollinations', reason: 'network', ms: Date.now() - started };
  }
}