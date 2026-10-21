/**
 * ============================================================================
 *  DOES A VISITOR'S HEADING ACTUALLY FOLLOW THEIR LANGUAGE?
 * ============================================================================
 *
 *     npx tsx scripts/test-labels.ts
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 *
 * The owner changed the language and saw Hindi, because the categories and
 * articles live in the database and were never translated — only the chrome
 * around them was. `content/labels.ts` now offers a translated heading, but
 * only while the database still holds the exact string it was translated from,
 * because she edits titles from the admin panel whenever she likes.
 *
 * Two things can therefore be wrong here, and both are silent:
 *
 *   - the wrong translation is shown (a visitor picks Tamil and reads the
 *     Bengali heading, which nobody notices until someone who speaks Bengali
 *     opens a Tamil page), and
 *   - her edited title is shown *over* with a translation of the title she has
 *     replaced, which is worse than showing nothing.
 *
 * So both are asserted for every language and every seeded heading, plus the
 * two cases that must fall back: a slug nothing was ever translated for, and a
 * stored value she has changed since.
 */

import { articleLabel, categoryLabel } from '../src/content/labels';
import { translate } from '../src/content/i18n';

const LANGUAGES = ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'ar', 'es'];

const CATEGORIES = [
  'dhyan-aur-yoog',
  'gharelu-marammat',
  'bachchon-ki-padhai',
  'budharge-seva',
  'shishu-dekhbhal',
  'dharmik-upay',
  'pavan-grah-aur-aarti',
  'aapatkalen-gayide',
  'mahamari-suraksha',
];

const ARTICLES = [
  'aag-aur-bijli-ke-bachav',
  'aag-lagne-par-kya-karein',
  'bimari-se-bachav',
  'dhuwan-ka-jhakora',
  'doodh-pani-band-ho',
  'haath-ki-saafai',
];

let pass = 0;
let fail = 0;

function check(name: string, actual: string, expected: string) {
  if (actual === expected) {
    pass += 1;
  } else {
    fail += 1;
    console.log(`FAIL ${name}\n  expected: ${expected}\n  actual:   ${actual}`);
  }
}

/* ── every seeded heading, in every language ─────────────────────────────── */

for (const language of LANGUAGES) {
  for (const slug of CATEGORIES) {
    // What the database holds for an untouched row: the original Hindi.
    const title = translate('hi', `cat.${slug}.title`);
    const subtitle = translate('hi', `cat.${slug}.subtitle`);

    check(
      `cat ${slug} title ${language}`,
      categoryLabel(language, slug, 'title', title),
      translate(language, `cat.${slug}.title`),
    );
    check(
      `cat ${slug} subtitle ${language}`,
      categoryLabel(language, slug, 'subtitle', subtitle),
      translate(language, `cat.${slug}.subtitle`),
    );

    // Hindi itself must return her words exactly, not a rewritten heading.
    check(`cat ${slug} is Hindi verbatim`, categoryLabel('hi', slug, 'title', title), title);
  }

  for (const slug of ARTICLES) {
    const title = translate('hi', `art.${slug}.title`);
    const summary = translate('hi', `art.${slug}.summary`);

    check(
      `art ${slug} title ${language}`,
      articleLabel(language, slug, 'title', title),
      translate(language, `art.${slug}.title`),
    );
    check(
      `art ${slug} summary ${language}`,
      articleLabel(language, slug, 'summary', summary),
      translate(language, `art.${slug}.summary`),
    );
    check(`art ${slug} is Hindi verbatim`, articleLabel('hi', slug, 'title', title), title);
  }
}

/* ── the two ways it must fall back to what she wrote ────────────────────── */

for (const language of LANGUAGES) {
  // She has edited this title in the admin panel since it was translated.
  check(
    `edited title wins ${language}`,
    categoryLabel(language, 'dharmik-upay', 'title', 'मेरा नया शीर्षक'),
    'मेरा नया शीर्षक',
  );
  check(
    `edited summary wins ${language}`,
    articleLabel(language, 'haath-ki-saafai', 'summary', 'नया सारांश'),
    'नया सारांश',
  );

  // A slug added after this file was written: no translation exists for it.
  check(
    `unknown slug ${language}`,
    categoryLabel(language, 'naya-vishay', 'title', 'नया विषय'),
    'नया विषय',
  );

  // An empty value must not become a key or a translated sentence.
  check(`empty value ${language}`, categoryLabel(language, 'dharmik-upay', 'subtitle', ''), '');
}

/* ── nothing may fall back to the raw key on screen ─────────────────────── */

for (const language of LANGUAGES) {
  for (const slug of CATEGORIES) {
    const shown = categoryLabel(language, slug, 'title', translate('hi', `cat.${slug}.title`));
    if (shown.includes('cat.')) {
      fail += 1;
      console.log(`FAIL raw key on screen: ${language} ${slug} -> ${shown}`);
    } else {
      pass += 1;
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
