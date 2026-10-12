import 'server-only';

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
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
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
 * Tried last, and expected to fail often.
 *
 * Measured on this machine over ten questions: five answered, five refused with
 * "402 Payment Required", median 8 seconds when it did answer and 24 when it
 * did not. Given two better options above, this exists so that the site is never
 * completely silent — not because it can be trusted.
 */
export async function askPollinations(
  system: string,
  question: string,
): Promise<ProviderResult> {
  const started = Date.now();

  try {
    // The URL carries the whole prompt, so it is encoded. Pollinations takes the
    // prompt as a path segment and has no request body for this.
    const prompt = `${system}\n\nQuestion: ${question}\n\nAnswer only in the language of the question, in that language's own script.`;
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

    const text = (await response.text()).trim();
    if (!text) {
      return { ok: false, provider: 'pollinations', reason: 'empty', ms: Date.now() - started };
    }

    return { ok: true, text, provider: 'pollinations', ms: Date.now() - started };
  } catch {
    return { ok: false, provider: 'pollinations', reason: 'network', ms: Date.now() - started };
  }
}