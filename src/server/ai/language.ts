/**
 * ===========================================================================
 *  IS THIS ANSWER IN THE LANGUAGE THAT WAS ASKED FOR?
 * ===========================================================================
 *
 * One function and the range table it reads. No server imports, no fetch, no
 * environment — which is why it lives here rather than in providers.ts.
 *
 * ── Why it is its own file ─────────────────────────────────────────────────
 *
 * providers.ts begins with `import 'server-only'`, a Next.js marker that throws
 * outside a request. That is correct for that file and it makes the file
 * untestable: scripts/test-answer-language.ts failed with MODULE_NOT_FOUND the
 * first time it tried to import it.
 *
 * The obvious fix is to stub the marker in the test. The better fix is to notice
 * that this logic does not belong there. Checking the script of a string needs
 * nothing from any provider, nothing from the network and nothing from the
 * request. Putting it beside the code that fetches answers made it impossible to
 * test, and the one thing about it that needed proving was the part that was
 * hardest to reason about.
 *
 * ── What it refuses ────────────────────────────────────────────────────────
 *
 *   - an empty answer
 *   - an answer containing none of the language's own script
 *   - an answer containing any OTHER offered script
 *
 * The third rule is the one that earns its keep. A Bengali question answered in
 * Hindi fails the second rule already. But a model that half follows an
 * instruction writes the opening in the right script and then drifts — "প্রথমে
 * মূল সুইচ দেখুন। फिर मुख्य स्विच ऑफ करें।" — and that passes the second rule
 * and would have been shown to a visitor as a Bengali answer.
 *
 * ── What it allows ─────────────────────────────────────────────────────────
 *
 * Latin letters, digits and punctuation never count against an answer. Models
 * write "OK" and "SMS" inside Bengali sentences, and that is still a Bengali
 * sentence. Only the presence of a second script is a fault.
 *
 * ── What it cannot do ──────────────────────────────────────────────────────
 *
 * Hindi and Marathi share the Devanagari block, so a Marathi question answered
 * in Hindi passes every check here. Nothing in the text distinguishes them;
 * deciding it needs a dictionary of each language, not a script range. Said
 * here rather than left to be discovered.
 *
 * ── Why the table must list every offered language ──────────────────────────
 *
 * A language with no entry returns true — nothing to check against, so the
 * answer is allowed — and that is correct for a code the site does not offer.
 * It is not correct for one it does. scripts/test-answer-language.ts walks the
 * offered languages and fails if any of them is missing here, so a language
 * added to the switcher cannot go unchecked by silence.
 *
 * Note that the offered set is smaller than the set of scripts a visitor could
 * want. Assamese and Odia were tested as though they were offered, which
 * reported two failures that were the test being wrong rather than the site.
 * The list below matches LANGUAGES in src/content/i18n.ts.
 */

import { isKnownLanguage } from '@/content/i18n';

/** The script each offered language is written in. */
const SCRIPTS: Record<string, [number, number]> = {
  hi: [0x0900, 0x097f],
  mr: [0x0900, 0x097f],
  bn: [0x0980, 0x09ff],
  ta: [0x0b80, 0x0bff],
  te: [0x0c00, 0x0c7f],
  gu: [0x0a80, 0x0aff],
  kn: [0x0c80, 0x0cff],
  ml: [0x0d00, 0x0d7f],
  pa: [0x0a00, 0x0a7f],
  ur: [0x0600, 0x06ff],
  ar: [0x0600, 0x06ff],
  en: [0x0020, 0x024f],
  es: [0x0020, 0x024f],
  fr: [0x0020, 0x024f],
  de: [0x0020, 0x024f],
  pt: [0x0020, 0x024f],
  ru: [0x0400, 0x04ff],
  zh: [0x4e00, 0x9fff],
};

/**
 * Marks that several Indic scripts share, and which therefore say nothing about
 * which language was written.
 *
 * U+0964 DEVANAGARI DANDA is the important one. Bengali, Hindi, Marathi and
 * Nepali all end sentences with it, so it sits in the Devanagari block and a
 * Bengali answer is full of them. Without this list every single Bengali answer
 * was counted as containing Devanagari and refused — which is what the first run
 * of the test reported, on the one case that must never fail.
 *
 * This is the same trap check-scripts.py fell into from the other direction,
 * where it reported 101 correct Punjali dandas as Devanagari characters and was
 * wrong. Two checks, one trap, found twice.
 *
 * Digits are here too: ०१२ and ০১২ and ౦౧౨ are separate blocks, and a model
 * writing a number in the "wrong" one has not changed language.
 */
const SHARED_MARKS = new Set([
  0x0964, 0x0965, // devanagari danda, double danda — also Bengali, Marathi
  0x0966, 0x0967, 0x0968, 0x0969, 0x096a, 0x096b, 0x096c, 0x096d, 0x096e, 0x096f,
  0x09e6, 0x09e7, 0x09e8, 0x09e9, 0x09ea, 0x09eb, 0x09ec, 0x09ed, 0x09ee, 0x09ef,
  0x0a66, 0x0a67, 0x0a68, 0x0a69, 0x0a6a, 0x0a6b, 0x0a6c, 0x0a6d, 0x0a6e, 0x0a6f,
  0x0ae6, 0x0ae7, 0x0ae8, 0x0ae9, 0x0aea, 0x0aeb, 0x0aec, 0x0aed, 0x0aee, 0x0aef,
  0x0be6, 0x0be7, 0x0be8, 0x0be9, 0x0bea, 0x0beb, 0x0bec, 0x0bed, 0x0bee, 0x0bef,
  0x0c66, 0x0c67, 0x0c68, 0x0c69, 0x0c6a, 0x0c6b, 0x0c6c, 0x0c6d, 0x0c6e, 0x0c6f,
  0x0ce6, 0x0ce7, 0x0ce8, 0x0ce9, 0x0cea, 0x0ceb, 0x0cec, 0x0ced, 0x0cee, 0x0cef,
  0x0d66, 0x0d67, 0x0d68, 0x0d69, 0x0d6a, 0x0d6b, 0x0d6c, 0x0d6d, 0x0d6e, 0x0d6f,
  0x200c, 0x200d, // zero-width joiner and non-joiner
  0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, // hyphens and dashes
  0x2018, 0x2019, 0x201c, 0x201d, // quotes
  0x2026, // ellipsis
]);

/**
 * Would this answer be readable by someone who asked in this language?
 *
 * Returns true when there is nothing to check — an empty language code, or one
 * the site does not offer — rather than guessing. Refusing everything in those
 * cases would break every caller that has not been updated yet, and an answer
 * shown in a slightly wrong language beats no answer at all.
 */
export function answersInLanguage(text: string, languageCode?: string): boolean {
  if (!text.trim()) return false;
  if (!languageCode || !isKnownLanguage(languageCode)) return true;

  const own = SCRIPTS[languageCode];
  if (!own) return true;

  const foreign = Object.entries(SCRIPTS)
    .filter(([code]) => code !== languageCode)
    // Same block as our own? Then it is not a different script, it is the same
    // script with a different language in it, which this cannot see.
    .map(([, range]) => range)
    .filter((range) => range[0] !== own[0] || range[1] !== own[1]);

  let ownCount = 0;
  let foreignCount = 0;

  /*
   * Whether Latin counts as evidence.
   *
   * For every other language it must not. Models write "OK", "SMS" and "ATM"
   * inside Bengali sentences, and treating those as the answer's script would
   * have a mixed answer refused for containing a single Latin letter.
   *
   * For a language whose own script IS Latin the rule inverts, and getting it
   * wrong is not a rare edge case: skipping Latin unconditionally left ownCount
   * at zero for every English, Spanish, French, German and Portuguese answer,
   * so answersInLanguage returned false for all of them and the five Western
   * languages could never pass this check no matter how correct the answer was.
   * The language switched to, the answer was in that language, and it was
   * refused.
   */
  const ownIsLatin = own[0] <= 0x024f;

  let latinCount = 0;

  for (const character of text) {
    const code = character.codePointAt(0) ?? 0;

    /*
     * Roman letters are counted rather than skipped, and only because of what
     * came back in testing.
     *
     * A visitor asked in Roman Hindi — "Sardi bukhar ka ghar par ilaaj" — and
     * got an answer that opened "Doctor ke jaane se pehle ek chhota" in Roman
     * and then continued "नोट लिखो, जिसके नीचे" in Devanagari. Both scripts
     * present, so every check here passed it, and a visitor who cannot read
     * Roman was handed a sentence they could not finish.
     *
     * The rule is a ratio rather than a ban, because models legitimately write
     * "OK", "SMS" and a brand name inside an otherwise correct answer. It is
     * Roman *dominant* that is the fault: more Roman letters than the
     * language's own, which is what a model falls back to when it has partly
     * ignored the instruction rather than when it is quoting a word.
     */
    if (code < 0x0250) {
      // Letters only. Spaces, digits and punctuation would inflate every
      // answer, since a normal sentence is mostly those.
      if (code >= 0x0041 && code <= 0x024f) latinCount += 1;
      if (!ownIsLatin) continue;
    }
    if (SHARED_MARKS.has(code)) continue;

    if (code >= own[0] && code <= own[1]) {
      ownCount += 1;
    } else if (foreign.some(([low, high]) => code >= low && code <= high)) {
      foreignCount += 1;
    }
  }

  return ownCount > 0 && foreignCount === 0 && latinCount <= ownCount;
}
