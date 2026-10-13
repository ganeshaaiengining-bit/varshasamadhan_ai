/**
 * Does the free key work once the requests are spaced out?
 *
 * WHY
 *
 * The twelve-language burst came back with three "network" failures. Probing
 * Node's fetch directly showed HTTP 429 "You exceeded your current quota" on
 * every attempt, which is the free tier's per-minute request limit, not a
 * broken connection. The burst had spent the quota.
 *
 * So the question is not whether the key is good, it is how far apart the
 * requests have to be. That number is the thing worth knowing: it becomes the
 * spacing the retry logic needs to use.
 *
 * WHAT IT PRINTS
 *
 * Six requests, one every WAIT_SECONDS, each with its own status and the
 * server's own limit headers when present. Google's 429 carries
 * Retry-After, which is the authoritative answer to how long to wait.
 *
 *   node scripts/probe-quota.mjs
 */

import { readFileSync } from 'node:fs';

const HOST = 'https://generativelanguage.googleapis.com';
const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash';
const WAIT_SECONDS = 12;

function key() {
  const env = readFileSync('.env', 'utf8');
  const line = env.split(/\r?\n/).find((l) => l.startsWith('GEMINI_API_KEY='));
  return (line?.split('=').slice(1).join('=') ?? '').trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log('');
console.log('Free tier quota, requests spaced out');
console.log('='.repeat(56));
console.log('');
console.log(`  model   ${MODEL}`);
console.log(`  gap     ${WAIT_SECONDS} seconds between requests`);
console.log('');

const url = `${HOST}/v1beta/models/${MODEL}:generateContent`;
const body = JSON.stringify({
  contents: [{ parts: [{ text: 'Say OK' }] }],
});

let allowed = 0;

for (let attempt = 1; attempt <= 6; attempt++) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key() },
      body,
    });
    const ms = Date.now() - started;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      allowed++;
      console.log(`  attempt ${attempt}  OK      ${String(ms).padStart(5)}ms   "${text.slice(0, 20)}"`);
    } else {
      const message = data?.error?.message ?? '';
      console.log(`  attempt ${attempt}  HTTP ${response.status}  ${String(ms).padStart(5)}ms   ${message.slice(0, 70)}`);
      // Retry-After is the server stating how long to wait, which beats any
      // guess this script could make about the window.
      const retry = response.headers.get('retry-after');
      if (retry) console.log(`                          retry-after: ${retry}`);
      const limits = ['x-ratelimit-limit-requests', 'x-ratelimit-remaining-requests'];
      for (const name of limits) {
        const value = response.headers.get(name);
        if (value) console.log(`                          ${name}: ${value}`);
      }
    }
  } catch (error) {
    console.log(`  attempt ${attempt}  FAIL    ${String(Date.now() - started).padStart(5)}ms   ${error.message}`);
  }

  if (attempt < 6) await sleep(WAIT_SECONDS * 1000);
}

console.log('');
console.log(`  ${allowed} of 6 answered, spaced ${WAIT_SECONDS}s apart`);
console.log('');