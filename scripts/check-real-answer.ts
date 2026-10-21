/**
 * ============================================================================
 *  JAWAB LIVE PAR KYUN MANA HO JAATA HAI?
 * ============================================================================
 *
 *     npx tsx scripts/check-real-answer.ts
 *
 * ── Kyun ──────────────────────────────────────────────────────────────────
 * Poora Hanuman Chalisa live site par "jawab nahi mila" deta hai, jabki seedha
 * Google 5 second me pura text de raha hai. Beech me ek hi check hai jo jawab
 * ko mana kar sakta hai: `answersInLanguage()`, jo galat lipi wale jawab ko
 * rokta hai.
 *
 * Ye script wahi jawab laati hai aur wahi check chalati hai — taaki pata chale
 * ki jawab theek hai aur check galat, ya jawab hi kuch aur hai.
 */
import 'dotenv/config';
import Module from 'node:module';
import path from 'node:path';

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
  const { systemInstruction } = await import('../src/server/ai/gemini');
  const { answersInLanguage } = await import('../src/server/ai/language');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction('hi') }] },
        contents: [{ role: 'user', parts: [{ text: QUESTION }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
      }),
    },
  );

  if (!response.ok) {
    console.log(`HTTP ${response.status}`);
    return;
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  };

  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => p.thought !== true)
    .map((p) => p.text ?? '')
    .join('')
    .trim();

  console.log(`jawab: ${text.length} akshar`);
  console.log(`answersInLanguage(hi): ${answersInLanguage(text, 'hi')}`);

  // The same count the check makes, printed so the reason is visible.
  let devanagari = 0;
  let latin = 0;
  let other = 0;
  for (const ch of text) {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 0x0900 && c <= 0x097f) devanagari += 1;
    else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) latin += 1;
    else if (c > 0x0900) other += 1;
  }
  console.log(`devanagari ${devanagari}, latin ${latin}, doosri lipi ${other}, kul ${text.length}`);
  console.log(`ant: ${text.slice(-120).replace(/\n/g, ' / ')}`);
}

main();
