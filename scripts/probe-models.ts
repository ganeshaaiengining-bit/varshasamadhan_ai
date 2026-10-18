/**
 * Kaunsa Gemini model aaj bhi jawab deta hai?
 *
 *     vercel env pull .env.production.local
 *     npx tsx scripts/probe-models.ts
 *
 * Google ka free quota **har model ke liye alag** hai — aaj kal bar-bar sunai
 * deta hai ki bhookh khatam ho gayi, lekin woh ek model ki bhookh hai. Isiliye
 * FALLBACK_MODELS ki list lambi karne se bina paisa kharch kiye din ki capacity
 * barh jaati hai.
 *
 * Kaam sirf itna hai ki list se naam uthana hai, har ek ko ek hi chhota sawaal
 * bhej ke uska HTTP status dekhna hai, aur answer ka wada kuch mat karna.
 *
 * ── API key ka bharosa ────────────────────────────────────────────────────────
 * Key padhi jaati hai, kabhi **chhapi** nahi jaati. Is script ka output sirf
 * model ka naam aur status hai — key ka ek akshar bhi nahi. Yahi wajah hai ki ye
 * script git me daali ja sakti hai.
 */

import 'dotenv/config';

const KEY = (process.env.GEMINI_API_KEY ?? '').trim();

/*
 * Naam waqt ke saath badalte hain: koi model 404 ho jata hai, koi naya aata hai.
 * Isiliye hard-coded "humara model" ki jagah Google ki apni list se poochha jaata
 * hai, aur phir sirf wahi test kiye jaate hain jo free tier par mil sakte hain.
 */
const CANDIDATES = [
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-flash-lite',
  'gemini-pro-lite',
  'gemini-flash',
  'gemini-pro',
];

const QUESTION = 'Reply with the single word: ready';

function verdict(status: number): string {
  if (status === 200) return 'ABHI BHI CHALTA HAI';
  if (status === 429) return 'aaj ki bhookh khatam';
  if (status === 403) return 'free tier par nahi';
  if (status === 404) return 'ab model hi nahi';
  if (status === 503) return 'abhi bhar hua';
  return `kuch aur (${status})`;
}

async function main(): Promise<void> {
  console.log();

  if (KEY.length <= 10) {
    console.log('  key nahi mili. pehle chalao:  vercel env pull .env.production.local');
    return;
  }

  console.log(`  ${CANDIDATES.length} model poochhe ja rahe hain, ek-ek karke.\n`);
  console.log('  model                          status   matlab');
  console.log('  ' + '-'.repeat(60));

  const alive: string[] = [];

  for (const model of CANDIDATES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    let status = 0;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: QUESTION }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 20 },
          }),
          signal: controller.signal,
        },
      );

      status = response.status;
      // Body padhi jaati hai sirf connection ko aakhir tak kholne ke liye.
      // Ismein key nahi hoti, lekin chhodi jaati hai yaad rakhne ke liye.
      await response.text();
    } catch {
      status = 0;
    } finally {
      clearTimeout(timer);
    }

    const say = verdict(status);
    console.log(`  ${model.padEnd(30)} ${String(status).padEnd(8)} ${say}`);
    if (status === 200) alive.push(model);
  }

  console.log();

  if (alive.length === 0) {
    console.log('  Aaj koi model nahi. Iska matlab key ya account ka masla hai —');
    console.log('  website phir bhi chalti hai, sirf free backup par.');
    return;
  }

  console.log(`  ${alive.length} model abhi bhi jawab de rahe hain:`);
  for (const model of alive) console.log(`    · ${model}`);

  /*
   * Har model ki bhookh alag hai, to inhein ek list me rakhne se rozana capacity
   * unhein multiply ho jaati hai. Yehi FALLBACK_MODELS banata hai.
   */
  console.log();
  console.log(`  inhein FALLBACK_MODELS me rakhein — roz ${alive.length * 20} sawaal.`);
  console.log(`  (har model ka apna 20/day, alag-alag ginne wala)`);
  console.log();
}

main();