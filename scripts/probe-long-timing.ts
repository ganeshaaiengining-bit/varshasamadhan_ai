/**
 * ============================================================================
 *  KAUNSA MODEL PURA JAWAB DETA HAI, AUR KITNI DER ME?
 * ============================================================================
 *
 *     npx tsx scripts/probe-long-timing.ts
 *
 * ── Kyun ye script hai ─────────────────────────────────────────────────────
 *
 * Live logs ne dikhaya ki ek model 53 second "soch" kar khaali jawab lauta
 * raha tha, aur Vercel 60 second par function maar deta hai. Natija: visitor ko
 * kuch nahi milta. Doosra model 9 second me jawab de raha tha.
 *
 * Isliye sawal ye nahi ki "kaunsa model sabse naya hai" — sawal ye hai ki
 * poora Hanuman Chalisa kaun kitni der me likhta hai, aur kya wo pura likhta
 * hai. Wahi naapa jaata hai yahan.
 *
 * ── API key ka bharosa ─────────────────────────────────────────────────────
 *
 * Key sirf padhi jaati hai. Output me model ka naam, samay, lambai aur
 * finishReason hai — key ka ek akshar nahi.
 */
import 'dotenv/config';

const KEY = (process.env.GEMINI_API_KEY ?? '').trim();

const MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
];

const QUESTION =
  'हनुमान चालीसा पूरा लिखिए, दोहा से लेकर अंत के दोहे तक। बीच में कुछ न छोड़िए।';

/*
 * The instruction is short on purpose: this probe is about length and speed, not
 * about the site's whole personality. It carries the two lines that decide
 * whether a long text is produced at all.
 */
const SYSTEM =
  'Answer only in Hindi (Devanagari script). ' +
  'If the visitor asks for a complete text — an aarti, bhajan, chalisa, song, prayer, ' +
  'katha — write the WHOLE text, every verse, in order. Do not summarise.';

async function probe(model: string): Promise<void> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: QUESTION }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
        }),
        signal: controller.signal,
      },
    );

    const ms = Date.now() - started;
    const raw = await response.text();

    if (!response.ok) {
      console.log(`  ${model}: HTTP ${response.status} in ${ms}ms`);
      return;
    }

    const data = JSON.parse(raw) as {
      candidates?: {
        content?: { parts?: { text?: string; thought?: boolean }[] };
        finishReason?: string;
      }[];
      usageMetadata?: { thoughtsTokenCount?: number; candidatesTokenCount?: number };
    };

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const text = parts.filter((p) => p.thought !== true).map((p) => p.text ?? '').join('').trim();

    const finish = data.candidates?.[0]?.finishReason ?? '?';
    const thoughts = data.usageMetadata?.thoughtsTokenCount ?? 0;
    const out = data.usageMetadata?.candidatesTokenCount ?? 0;

    console.log(
      `  ${model}: ${ms}ms | ${text.length} akshar | finish ${finish} | ` +
        `thoughts ${thoughts} tok | out ${out} tok | ` +
        `shuru ${text.includes('बाल समय') ? 'haan' : 'NAHI'} | ` +
        `ant ${text.includes('पवनतनय') || text.includes('संकट हरण') ? 'haan' : 'NAHI'} | ` +
        `parts ${parts.length}`,
    );
  } catch (error) {
    const ms = Date.now() - started;
    console.log(`  ${model}: FAILED in ${ms}ms (${(error as Error).name})`);
  } finally {
    clearTimeout(timer);
  }
}

async function main(): Promise<void> {
  if (KEY.length < 10) {
    console.error('GEMINI_API_KEY nahi mili.');
    process.exitCode = 1;
    return;
  }

  console.log('\nHar model ko poora Hanuman Chalisa, 4096 token ki chhat:\n');
  for (const model of MODELS) {
    await probe(model);
  }
  console.log('\nYaad rakhiye: Vercel function 60 second par mar jaata hai.\n');
}

main();
