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

const TIMEOUT_MS = 90_000;

/**
 * Fetch with a hard deadline.
 *
 * A help request from someone in pain cannot hang. Without this the site waits
 * out Pollinations' worst case and then tries the next provider, and the visitor
 * has already gone.
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
  // Verified to exist and to be stable, not guessed. "gemini-3.8-flash" is the
  // current Flash model on the free tier.
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
}

export async function askGemini(
  system: string,
  question: string,
  // Unused here, but part of the one signature every provider shares so
  // ask.ts can call them interchangeably.
  _languageCode?: string,
): Promise<ProviderResult> {
  const started = Date.now();
  const key = geminiKey();

  if (key.length <= 10) {
    return { ok: false, provider: 'gemini', reason: 'no-key', ms: 0 };
  }

  try {
    const response = await timedFetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel()}:generateContent`,
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
    );

    if (response.status === 429) {
      return { ok: false, provider: 'gemini', reason: 'rate-limit', ms: Date.now() - started };
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
     * A reasoning model streams its working-out in `parts` alongside the answer,
     * marked `thought: true`. Taking every part concatenates the two, so the
     * visitor reads the model's private deliberation before the answer — the same
     * failure as the JSON envelope on the free provider, reached a different way.
     * Gemini 3.8 Flash is a thinking model, so this is a live path and not a
     * hypothetical.
     */
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .filter((part) => part.thought !== true)
      .map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      return { ok: false, provider: 'gemini', reason: 'empty', ms: Date.now() - started };
    }

    return { ok: true, text, provider: 'gemini', ms: Date.now() - started };
  } catch {
    return { ok: false, provider: 'gemini', reason: 'network', ms: Date.now() - started };
  }
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
    });

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

    const response = await timedFetch(url, {
      headers: { 'User-Agent': 'VarshaSamadhan/1.0', Accept: 'text/plain' },
    });

    if (response.status === 402 || response.status === 429) {
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
  } catch {
    return { ok: false, provider: 'pollinations', reason: 'network', ms: Date.now() - started };
  }
}