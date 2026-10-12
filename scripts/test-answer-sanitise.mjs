/*
 * Can raw model reasoning reach a visitor?
 *
 *   node scripts/test-answer-sanitise.mjs
 *
 * Yes, it did. Asked "गणपती ची मराठी आरती सांगा" in Marathi, the site answered:
 *
 *     {"role":"assistant","reasoning":"User wants: \"गणपती ची मराठी आरती...\"
 *      They want a Marathi aarti... We nee", "tool_calls":[]}
 *
 * A visitor — elderly, on a help site — was shown a model's private working-out,
 * cut mid-sentence, wrapped in JSON. And it was worse than ugly: that response
 * contains a `reasoning` key and a `tool_calls` key and *no answer at all*, so
 * the site reported success while giving nobody anything.
 *
 * Two things had to be true after the fix, and both are checked here:
 *
 *   1. no reasoning envelope ever reaches the caller
 *   2. a response containing no answer returns empty, not the thinking
 *
 * The second is the one that matters. Stripping the JSON would still have produced
 * a confident-looking empty answer. An empty string is what lets the caller move
 * to the next provider.
 *
 * Run it after touching extractAnswer() or the reasoning keys.
 */

import assert from 'node:assert/strict';

/**
 * A copy of extractAnswer() from src/server/ai/providers.ts.
 *
 * Duplicated rather than imported because that module is `server-only` and
 * pulls in next/headers, which will not load outside a request. If this and the
 * real one drift apart, this test stops being evidence of anything — so the
 * function is kept small and the risky cases are all listed below.
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

const ANSWER_KEYS = ['content', 'text', 'answer', 'output', 'message', 'response', 'completion'];

function findAnswer(value, depth = 0) {
  if (depth > 8 || value === null || typeof value !== 'object') return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAnswer(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  /*
   * A thought part carries its own "text" — the thinking — and Gemini marks it
   * with thought: true. Falling into it is how a visitor ends up reading a
   * model's deliberation instead of its answer, so the part is skipped whole.
   */
  if (value.thought === true) return null;

  // Known answer keys first, at this level.
  for (const key of ANSWER_KEYS) {
    const candidate = value[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      if (REASONING_KEYS.has(key)) continue;
      return candidate.trim();
    }
  }

  /*
   * Then into every key, including ones not on the list.
   *
   * The first version only recursed through keys it already recognised, so
   * {choices:[{message:{content:...}}]} and {candidates:[{content:{parts:[...]}}]}
   * both came back empty — which are the two shapes that actually arrive, one
   * from every provider on this site. The unknown keys are the wrappers.
   */
  for (const key of Object.keys(value)) {
    if (REASONING_KEYS.has(key)) continue;

    const child = value[key];
    if (child && typeof child === 'object') {
      const found = findAnswer(child, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

function extractAnswer(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return findAnswer(parsed) ?? '';
    } catch {
      /* not JSON after all */
    }
  }

  const fenced = trimmed.match(/^```(?:json)?\s*\n([\s\S]*?)\n?```$/);
  if (fenced) return extractAnswer(fenced[1]);

  const envelope = /"role"\s*:\s*"assistant"/.test(trimmed) && /"(reasoning|tool_calls)"\s*:/.test(trimmed);
  if (envelope) {
    try {
      return findAnswer(JSON.parse(trimmed.replace(/^[^({]+/, ''))) ?? '';
    } catch {
      return '';
    }
  }

  return trimmed;
}

/* -------------------------------------------------------------------------- */

const cases = [
  {
    name: 'the reported bug: reasoning only, no answer at all',
    input: '{"role":"assistant","reasoning":"User wants: \\"गणपती ची मराठी आरती\\" meaning \\"says a Marathi aarti\\". They want a Marathi aarti. We nee","tool_calls":[]}',
    expect: '',
    why: 'No answer key exists. Must be empty so the next provider is tried, not the thinking shown.',
  },
  {
    name: 'reasoning plus a real answer — answer wins, reasoning dropped',
    input: JSON.stringify({ role: 'assistant', reasoning: 'I should recall the hymn...', content: 'वंदे तोते मात्रा नो स्वार्थी।' }),
    expect: 'वंदे तोते मात्रा नो स्वार्थी।',
    why: 'A reasoning model that did answer must not have its scratchpad prepended.',
  },
  {
    name: 'openai-shaped envelope',
    input: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'शुभ दीपावली.' } }] }),
    expect: 'शुभ दीपावली.',
    why: 'The nested shape every OpenAI-compatible endpoint returns.',
  },
  {
    name: 'reasoning nested under a part, answer under another part',
    input: JSON.stringify({ candidates: [{ content: { parts: [{ text: 'thought...', thought: true }, { text: 'जवाब यहाँ आहे.' }] } }] }),
    expect: 'जवाब यहाँ आहे.',
    why: 'Gemini marks thought parts with thought:true; they must be filtered.',
  },
  {
    name: 'fenced JSON',
    input: '```json\n{"content":"समाधान"}\n```',
    expect: 'समाधान',
    why: 'Models wrap JSON in fences often enough that it needs handling.',
  },
  {
    name: 'ordinary prose passes through untouched',
    input: 'पहले अपना नाम बताइए, फिर मैं आपकी मदद करूँगा।',
    expect: 'पहले अपना नाम बताइए, फिर मैं आपकी मदद करूँगा।',
    why: 'The common case must not be altered by any of this.',
  },
  {
    name: 'prose that merely mentions tool_calls is not stripped',
    input: 'अगर आपके सर्वर पर tool_calls सेट हैं, तो वे बंद कर दें।',
    expect: 'अगर आपके सर्वर पर tool_calls सेट हैं, तो वे बंद कर दें।',
    why: 'An article discussing developer tooling must survive. Removal is by key, not by word.',
  },
  {
    name: 'a JSON-looking sentence that is not JSON',
    input: '{इसे मंत्र कहते हैं} यह पंक्ति अच्छी है।',
    expect: '{इसे मंत्र कहते हैं} यह पंक्ति अच्छी है।',
    why: 'Braces in a religious text must not lose the answer by being mistaken for JSON.',
  },
  {
    name: 'deeply nested reasoning only',
    input: JSON.stringify({ a: { b: { c: { d: { e: { f: { g: { reasoning: 'still thinking' } } } } } } } }),
    expect: '',
    why: 'No answer at any depth means no answer.',
  },
  {
    name: 'empty input',
    input: '   ',
    expect: '',
    why: 'Whitespace is not an answer.',
  },
];

let failures = 0;

console.log(`${cases.length} cases\n`);

for (const test of cases) {
  let actual;
  try {
    actual = extractAnswer(test.input);
  } catch (error) {
    console.log(`  THREW  ${test.name}`);
    console.log(`         ${error.message}`);
    failures += 1;
    continue;
  }

  const pass = actual === test.expect;
  if (pass) {
    console.log(`  ok    ${test.name}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${test.name}`);
    console.log(`         expected: ${JSON.stringify(test.expect)}`);
    console.log(`         actual  : ${JSON.stringify(actual.slice(0, 160))}`);
  }

  // The one invariant that matters most, checked on every case regardless.
  if (/"reasoning"\s*:|"tool_calls"\s*:/.test(actual)) {
    failures += 1;
    console.log('         LEAKED a reasoning field to the caller');
  }
}

console.log();
if (failures) {
  console.log(`${failures} failure(s). Reasoning must never reach a visitor.`);
  process.exit(1);
}

console.log('Reasoning can no longer reach a visitor, and a reply with no answer in it');
console.log('comes back empty so the next provider is tried instead.');