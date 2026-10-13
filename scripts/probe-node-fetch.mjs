/**
 * Is Node's own fetch able to reach the Gemini endpoint at all?
 *
 * WHY
 *
 * The live language test showed Gemini answering seven languages in about seven
 * seconds each and failing three with "network in ~4s", against a timeout in
 * providers.ts of ninety seconds. An abort at ninety cannot look like a
 * failure at four, so the timeout is not what is firing. Either Node's fetch
 * cannot open the connection, or the connection dies partway.
 *
 * Python on this machine already calls the same URL and succeeds, so the
 * endpoint and the key are fine. That narrows it to the HTTP client Node
 * uses, which is worth knowing before changing the provider chain: if the
 * problem is the client, then raising a timeout or adding a provider will not
 * help.
 *
 * WHAT IT PRINTS
 *
 * Six attempts against the real endpoint, reporting the exact failure reason
 * rather than a generic "network", plus what Node resolved the host to. An
 * IPv6 address here with no working route is the usual cause and would not be
 * visible from the log line alone.
 *
 *   node scripts/probe-node-fetch.mjs
 */

import { readFileSync } from 'node:fs';
import { lookup } from 'node:dns/promises';

const HOST = 'generativelanguage.googleapis.com';
const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash';

function key() {
  const env = readFileSync('.env', 'utf8');
  const line = env.split(/\r?\n/).find((l) => l.startsWith('GEMINI_API_KEY='));
  return (line?.split('=').slice(1).join('=') ?? '').trim();
}

console.log('');
console.log('Node fetch against the Gemini endpoint');
console.log('='.repeat(56));
console.log('');

try {
  const addresses = await lookup(HOST, { all: true });
  console.log('  resolves to:');
  for (const a of addresses) console.log(`    ${a.family === 6 ? 'IPv6' : 'IPv4'}  ${a.address}`);
} catch (error) {
  console.log(`  dns lookup failed: ${error.message}`);
}

console.log('');
console.log('  node        ', process.version);
console.log('  model       ', MODEL);
console.log(`  key         ${key().length} characters`);
console.log('');

const url = `https://${HOST}/v1beta/models/${MODEL}:generateContent`;
const body = JSON.stringify({
  contents: [{ parts: [{ text: 'Say OK' }] }],
});

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
      console.log(`  attempt ${attempt}  OK ${String(ms).padStart(6)}ms  "${text.slice(0, 30)}"`);
    } else {
      console.log(`  attempt ${attempt}  HTTP ${response.status} in ${ms}ms  ${JSON.stringify(data).slice(0, 120)}`);
    }
  } catch (error) {
    const ms = Date.now() - started;
    // The cause matters more than the message. Node reports a bare
    // "fetch failed" and hides the real reason in the cause chain.
    const chain = [];
    for (let e = error; e; e = e.cause) {
      chain.push(`${e.code ? e.code + ' ' : ''}${e.message}`.trim());
    }
    console.log(`  attempt ${attempt}  FAIL ${String(ms).padStart(5)}ms  ${chain.join('  <-  ')}`);
  }
}

console.log('');