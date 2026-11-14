/**
 * ===========================================================================
 *  WHICH TEXTS MAY NEVER BE READ IN A MADE-UP VOICE
 * ===========================================================================
 *
 * The owner's rule: an aarti, a bhajan, a song or a katha is heard in a real
 * singer's or kathakar's voice, in its proper chaal — the way it is actually
 * sung. It is never played in a computer voice. A synthetic voice reading "jai
 * ambe gauri" flat, without the tune the family knows, is worse than silence:
 * it is the prayer with the devotion taken out.
 *
 * ── What this file decides ─────────────────────────────────────────────────
 *
 * Two questions, asked in two places:
 *
 *   1. `asksForRecitedText(question)` — is the visitor asking for a text that
 *      is meant to be sung or recited? If so the answer card does not offer to
 *      read it aloud. The words are still given in full, in the right script,
 *      so the visitor can read and sing them; only the fake voice is withheld.
 *
 *   2. `isRecitedArticle({ categorySlug, body })` — is this page itself a
 *      recited text (or a method page carrying one)? If so the article page
 *      does not offer a read-aloud button either.
 *
 * ── Why a word list and not the AI ─────────────────────────────────────────
 *
 * Asking the model whether it just wrote an aarti would cost a second call, and
 * the model that follows the instruction is exactly the one that would answer
 * "no". The question the visitor typed is cheap to read and is the reliable
 * signal: someone who typed "गणपतीची आरती" has asked for an aarti.
 *
 * ── Why it errs towards silence ────────────────────────────────────────────
 *
 * A false yes costs the listener a button on an answer that could have been
 * read aloud. A false no plays an aarti in a robot voice — the exact thing the
 * owner rejected. So the list leans generous: "मंत्र का अर्थ क्या है?" also
 * loses the button. That is the acceptable side of the mistake.
 */

/** Categories whose whole subject is sacred or recited material. */
const RECITED_CATEGORIES = new Set([
  'pavan-grah-aur-aarti', // पावन ग्रंथ व आरती
]);

/**
 * Words that ask for a text meant to be sung, chanted or narrated.
 *
 * Matched as substrings for the Indic scripts, because the inflections hang off
 * the word (आरती / आरतीची / आरतीत) and a word boundary is not written there.
 */
const RECITED_WORDS = [
  // Devanagari — Hindi, Marathi and the shared religious vocabulary
  'आरती',
  'भजन',
  'चालीसा',
  'चालिसा',
  'स्तोत्र',
  'स्तुति',
  'मंत्र',
  'मन्त्र',
  'श्लोक',
  'श्लोकः',
  'कीर्तन',
  'कथा',
  'अभंग',
  'भागवत',
  'रामायण',
  'गीता',
  'नामस्मरण',
  'गाणे',
  'गीत',
  'गाना',
  'धुन',
  'कव्वाली',

  // Bengali
  'আরতি',
  'ভজন',
  'চালিশা',
  'স্তোত্র',
  'মন্ত্র',
  'শ্লোক',
  'কীর্তন',
  'কথা',
  'গান',

  // Tamil
  'ஆரத்தி',
  'பஜனை',
  'சாலிசா',
  'ஸ்தோத்திரம்',
  'மந்திரம்',
  'ஸ்லோகம்',
  'கீர்த்தனை',
  'கதை',
  'பாடல்',

  // Telugu
  'ఆరతి',
  'భజన',
  'చాలీసా',
  'స్తోత్రం',
  'మంత్రం',
  'శ్లోకం',
  'కీర్తన',
  'కథ',
  'పాట',

  // Gujarati
  'આરતી',
  'ભજન',
  'ચાલીસા',
  'સ્તોત્ર',
  'મંત્ર',
  'શ્લોક',
  'કીર્તન',
  'કથા',
  'ગીત',

  // Kannada
  'ಆರತಿ',
  'ಭಜನೆ',
  'ಚಾಲೀಸಾ',
  'ಸ್ತೋತ್ರ',
  'ಮಂತ್ರ',
  'ಶ್ಲೋಕ',
  'ಕೀರ್ತನೆ',
  'ಕಥೆ',
  'ಹಾಡು',

  // Malayalam
  'ആരതി',
  'ഭജനം',
  'ചാലീസ',
  'സ്തോത്രം',
  'മന്ത്രം',
  'ശ്ലോകം',
  'കീർത്തനം',
  'കഥ',
  'പാട്ട്',

  // Punjabi
  'ਆਰਤੀ',
  'ਭਜਨ',
  'ਚਾਲੀਸਾ',
  'ਸ਼ਲੋਕ',
  'ਮੰਤਰ',
  'ਕੀਰਤਨ',
  'ਕਥਾ',
  'ਗੀਤ',

  // Urdu
  'آرتی',
  'بھجن',
  'چالیسا',
  'منتر',
  'شلوک',
  'کیرتن',
  'کتھا',
  'گیت',
] as const;

/**
 * The same words in Roman letters, matched as whole words.
 *
 * Whole words, not substrings: "arti" sits inside "article" and "partial", and
 * a substring match would silently take the voice off every English answer that
 * mentioned one.
 */
const RECITED_WORDS_LATIN =
  /\b(aarti|arti|bhajan|bhajans|chalisa|challisa|stotra|stotram|mantra|mantras|shloka|sloka|kirtan|keertan|katha|abhang|abhangs|bhagwat|bhagavad|ramayan|ramayana|gita|geeta|geet|gaana|qawwali|lyrics|song|songs|hymn|hymns|prayer|prayers|devotional)\b/i;

/** Is the visitor asking for a text that is sung, chanted or narrated? */
export function asksForRecitedText(question: string): boolean {
  if (RECITED_WORDS_LATIN.test(question)) return true;
  return RECITED_WORDS.some((word) => question.includes(word));
}

/** Is the whole page a sacred subject? */
export function isSacredCategory(slug: string): boolean {
  return RECITED_CATEGORIES.has(slug);
}

/**
 * Is this article itself recited — either because of its subject, or because it
 * carries a quoted text to be said?
 *
 * The second test is for pages like "आरती करने का सही तरीक़ा": its subject is
 * ritual, and it carries the aarti itself in quote lines. The instructions are
 * the owner's own writing, but the aarti in the middle must not be read in a
 * made-up voice, and reading the page with that part missing would be worse than
 * not reading it at all. So a run of two or more quoted lines is treated as
 * recited text and the page gives no read-aloud button.
 */
export function isRecitedArticle(input: { categorySlug: string; body: string }): boolean {
  if (isSacredCategory(input.categorySlug)) return true;

  let run = 0;
  for (const line of input.body.split('\n')) {
    if (line.trim().startsWith('>')) {
      run += 1;
      if (run >= 2) return true;
    } else {
      run = 0;
    }
  }

  return false;
}
