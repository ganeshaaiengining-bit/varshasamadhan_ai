/**
 * ============================================================================
 *  ASLI PROMPT KE SAATH — KITNI DER, KITNA LAMBA?
 * ============================================================================
 *
 *     npx tsx scripts/probe-real-prompt.ts
 *
 * ── Kyun ──────────────────────────────────────────────────────────────────
 * Live site par aam sawal ka jawab aa raha hai, lekin poora Hanuman Chalisa
 * "jawab nahi mila" par khatam ho raha hai. Do hi cheezein ho sakti hain: ya
 * model 40 second se zyada le raha hai, ya wo kuch aisa lauta raha hai jo site
 * mana kar deti hai.
 *
 * Ye script **site ka asli system prompt** leti hai — nakal nahi — aur seedha
 * Google se wahi sawal poochhti hai. Isse pata chalta hai ki waqt kahan ja raha
 * hai, bina DB aur bina live route ke.
 *
 * Output me sirf samay, lambai aur finishReason hai. Key kabhi nahi chhapti.
 */
import 'dotenv/config';
import Module from 'node:module';
import path from 'node:path';

/*
 * `server-only` ko stub par bheja jaata hai, wahi tareeka jo baaki tests me hai:
 * Next ke bahar wo import ek aur wajah se throw karta hai.
 */
const originalResolve = (Module as unknown as {
  _resolveFilename: (request: string, ...rest: unknown[]) => string;
})._resolveFilename;

(Module as unknown as { _resolveFilename: typeof originalResolve })._resolveFilename = function (
  request: string,
  ...rest: unknown[]
) {
  if (request === 'server-only') {
    return path.join(__dirname, 'stubs', 'server-only.ts');
  }
  return originalResolve.call(this, request, ...rest);
};

const KEY = (process.env.GEMINI_API_KEY ?? '').trim();
const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-flash-lite-latest';

const QUESTION =
  'हनुमान चालीसा पूरा लिखिए, दोहा से लेकर अंत के दोहे तक। बीच में कुछ न छोड़िए।';

async function main(): Promise<void> {
  if (KEY.length < 10) {
    console.error('GEMINI_API_KEY nahi mili.');
    process.exitCode = 1;
    return;
  }

  const { systemInstruction } = await import('../src/server/ai/gemini');
  const system = systemInstruction('hi');

  console.log(`\nmodel: ${MODEL}`);
  console.log(`system prompt: ${system.length} akshar`);
  console.log(`sawal: ${QUESTION}\n`);

  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: QUESTION }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
        }),
        signal: controller.signal,
      },
    );

    const ms = Date.now() - started;

    if (!response.ok) {
      const body = (await response.text()).slice(0, 400);
      console.log(`HTTP ${response.status} in ${ms}ms`);
      console.log(`body: ${body}`);
      return;
    }

    const data = (await response.json()) as {
      candidates?: {
        content?: { parts?: { text?: string; thought?: boolean }[] };
        finishReason?: string;
      }[];
      usageMetadata?: { thoughtsTokenCount?: number; candidatesTokenCount?: number };
    };

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const text = parts.filter((p) => p.thought !== true).map((p) => p.text ?? '').join('').trim();
    const thoughts = parts
      .filter((p) => p.thought === true)
      .reduce((n, p) => n + (p.text?.length ?? 0), 0);

    console.log(`samay: ${ms}ms  (site ki seema: ${process.env.GEMINI_TIMEOUT_MS ?? 40000}ms)`);
    console.log(`jawab: ${text.length} akshar`);
    console.log(`finishReason: ${data.candidates?.[0]?.finishReason ?? '?'}`);
    console.log(
      `tokens: out ${data.usageMetadata?.candidatesTokenCount ?? '?'}, ` +
        `thoughts ${data.usageMetadata?.thoughtsTokenCount ?? '?'} (thought text ${thoughts} akshar)`,
    );
    console.log(`shuruaat: ${text.slice(0, 100).replace(/\n/g, ' / ')}`);
    console.log(`ant: ${text.slice(-100).replace(/\n/g, ' / ')}`);
  } catch (error) {
    console.log(`FAILED in ${Date.now() - started}ms: ${(error as Error).name}`);
  } finally {
    clearTimeout(timer);
  }
}

main();
