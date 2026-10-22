/**
 * ============================================================================
 *  DO THE THIRTEEN TABLES STILL AGREE?
 * ============================================================================
 *
 * Written after the owner found one word in the Marathi table that did not
 * mean what the rest of the table meant — "fog" where every other language
 * said "smoke". A wrong word cannot be checked by a machine; this checks the
 * things a machine can see, so that the wrong words a machine *can* see are
 * not also hiding:
 *
 *   1. every language has every key the Hindi table has;
 *   2. no language carries a key of its own;
 *   3. no string is written in a script the reader of that language cannot
 *      read — a Bengali string sitting in the Tamil table is worse than a
 *      missing one, because the page looks translated while saying nothing;
 *   4. no non-English string is character-for-character the Hindi one, when
 *      the two scripts differ — that is an untranslated copy wearing Hindi's
 *      clothes.
 *
 * What it cannot see: a word that is fluent, correctly spelled, in the right
 * script, and means the wrong thing. That is what the tables were read for.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FILE = join(process.cwd(), 'src', 'content', 'i18n.ts');
const source = readFileSync(FILE, 'utf8');

interface Table {
  name: string;
  line: number;
  values: Map<string, string>;
}

/** Pull one `const NAME: Record<string, string> = { ... }` table out of the file. */
function readTable(name: string, from: number, to: number): Table {
  const slice = source.split('\n').slice(from - 1, to).join('\n');
  // Some tables were written with several pairs on a line; and the block may
  // carry comments of its own. Strip the comments, then read every pair.
  const body = slice.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const values = new Map<string, string>();
  // `'key': 'value'` or `"key": "value"` — values may contain escaped quotes of
  // the other kind (an apostrophe inside an English string), never newlines.
  const pair = /'([a-z][a-zA-Z0-9.-]*)':\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
  for (const m of body.matchAll(pair)) {
    values.set(m[1], (m[2] ?? m[3]).replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return { name, line: from, values };
}

const BLOCKS: [string, number, number][] = [
  ['hi', 117, 794], ['en', 795, 1439], ['bn', 1440, 2226], ['ta', 2227, 3013],
  ['te', 3014, 3800], ['mr', 3801, 4587], ['gu', 4588, 5374], ['kn', 5375, 6174],
  ['ml', 6175, 6978], ['pa', 6979, 7785], ['ur', 7786, 8581], ['ar', 8582, 9383],
  ['es', 9384, 10181],
];

const tables = BLOCKS.map(([name, from, to]) => readTable(name, from, to));
const hindi = tables[0].values;

/** The script each reader of the language can be asked to read. Latin is in
 *  every set: brand names, units and "PDF" are not translated anywhere. */
const SCRIPTS: Record<string, RegExp> = {
  hi: /[\u0900-\u097F]/, mr: /[\u0900-\u097F]/, bn: /[\u0980-\u09FF]/,
  ta: /[\u0B80-\u0BFF]/, te: /[\u0C00-\u0C7F]/, gu: /[\u0A80-\u0AFF]/,
  kn: /[\u0C80-\u0CFF]/, ml: /[\u0D00-\u0D7F]/, pa: /[\u0A00-\u0A7F]/,
  ur: /[\u0600-\u06FF]/, ar: /[\u0600-\u06FF]/, en: /./, es: /./,
};
const ALL_SCRIPTS = [
  ['deva', /[\u0900-\u097F]/], ['beng', /[\u0980-\u09FF]/],
  ['tamil', /[\u0B80-\u0BFF]/], ['telu', /[\u0C00-\u0C7F]/],
  ['gujr', /[\u0A80-\u0AFF]/], ['knda', /[\u0C80-\u0CFF]/],
  ['mlym', /[\u0D00-\u0D7F]/], ['guru', /[\u0A00-\u0A7F]/],
  ['arab', /[\u0600-\u06FF]/],
] as const;

let failed = 0;
const fail = (message: string) => { failed += 1; console.log(`  [ x ] ${message}`); };
const ok = (message: string) => console.log(`  [ ok ]  ${message}`);

/* 1. Every language has every key, and no key of its own. */
const missingTotal = tables.slice(1).reduce((n, t) => {
  const missing = [...hindi.keys()].filter((k) => !t.values.has(k));
  if (missing.length > 0) {
    fail(`${t.name} is missing ${missing.length} keys: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ', …' : ''}`);
  }
  const extra = [...t.values.keys()].filter((k) => !hindi.has(k));
  if (extra.length > 0) {
    fail(`${t.name} has ${extra.length} keys Hindi has not: ${extra.slice(0, 5).join(', ')}`);
  }
  return n + missing.length + extra.length;
}, 0);
if (missingTotal === 0) ok(`all ${tables.length} tables carry the same ${hindi.size} keys`);

/* 2. No string in a script that table's reader cannot read. */
const wrongScript: string[] = [];
for (const t of tables) {
  const own = SCRIPTS[t.name];
  for (const [key, value] of t.values) {
    // Latin letters, digits and marks are nobody's foreign script.
    const letters = value.replace(/[A-Za-z0-9\s\u0964.,·—–\-()%+&'"!?]/g, '');
    if (letters === '') continue;
    if (own.test(letters)) continue;
    const foreign = ALL_SCRIPTS.find(([, re]) => re.test(letters))?.[0] ?? 'unknown';
    wrongScript.push(`${t.name} ${key} — ${foreign}: ${value}`);
  }
}
if (wrongScript.length === 0) ok('every string is in a script its own reader can read');
else wrongScript.slice(0, 15).forEach(fail);

/* 3. A non-English table showing Hindi's exact string, in a different script. */
const untranslated: string[] = [];
for (const t of tables.slice(1)) {
  if (SCRIPTS[t.name].source === SCRIPTS.hi.source) continue; // Marathi reads Devanagari too.
  for (const [key, value] of t.values) {
    const fromHindi = hindi.get(key);
    if (fromHindi && fromHindi === value && /[\u0900-\u097F]/.test(value)) {
      untranslated.push(`${t.name} ${key} — ${value}`);
    }
  }
}
if (untranslated.length === 0) ok('no non-Hindi table is showing a Hindi string untranslated');
else untranslated.slice(0, 15).forEach(fail);

console.log('\n' + '-'.repeat(60));
if (failed > 0) {
  console.log(`\n  ${failed} problem${failed === 1 ? '' : 's'} found.\n`);
  process.exit(1);
}
console.log('\n  every table agrees.\n');
