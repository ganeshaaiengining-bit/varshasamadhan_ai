import { translate } from './i18n';

/**
 * ===========================================================================
 *  THE OWNER'S HEADING, IN THE VISITOR'S LANGUAGE
 * ===========================================================================
 *
 * ── The problem this solves ────────────────────────────────────────────────
 *
 * Everything the site writes itself — navigation, buttons, help text, the
 * language picker, the `<title>` — has been translated into all thirteen
 * languages from the start. The content does not live there. The categories and
 * the articles are rows in the database, and she writes them once, in Hindi, so
 * a visitor who chose Marathi got a Marathi page with a Hindi heading in the
 * middle of it. That is the complaint this answers: change the language and the
 * page is still Hindi.
 *
 * ── Why the original is compared instead of trusting the translation ───────
 *
 * She edits titles from the admin panel at any time, and nobody has ever asked
 * her to keep them short or to leave a key behind. So the translated value is
 * offered only while the database still holds the exact string it was
 * translated from. The moment she changes a title, `stored !== seed`, her words
 * win and the translation is dropped rather than shown over text she has
 * replaced. A stale translation on a corrected page would be worse than no
 * translation at all.
 *
 * ── What is deliberately not translated ────────────────────────────────────
 *
 * The article bodies. They are her writing, they are long, and a machine
 * round-trip through five hundred paragraphs would put words in her mouth that
 * she never wrote. A translated heading over her own paragraphs is honest; a
 * translated body would be a different author. The AI answers in the visitor's
 * language for the same reason — it is generated, and generation can be
 * checked; her text is fixed, and a fixed text has to be written in the
 * language it is published in.
 */

/** What the database held before anyone translated anything. */
type Seed = { title: string; subtitle?: string; summary?: string };

/**
 * The nine categories and the six published articles, exactly as they came back
 * from the database when this file was written.
 *
 * Written out rather than read from the database on every request: this is the
 * comparison, and reading the value being compared against from the same place
 * that holds the value it is compared to would make the check meaningless.
 */
const SEEDS: Record<string, Seed> = {
  'dhyan-aur-yoog': {
    title: 'ध्यान और योग',
    subtitle: 'मन शांत करने के सरल उपाय',
  },
  'gharelu-marammat': {
    title: 'घरेलू मरम्मत',
    subtitle: 'घर की छोटी-छोटी समस्याओं का हल',
  },
  'bachchon-ki-padhai': {
    title: 'बच्चों की पढ़ाई',
    subtitle: 'पढ़ाई में लगे, परेशान हों',
  },
  'budharge-seva': {
    title: 'बुज़ुर्गों की सेवा',
    subtitle: 'देखभाल और सहायता',
  },
  'shishu-dekhbhal': {
    title: 'शिशु देखभाल',
    subtitle: 'नन्हे बच्चे की सही देखभाल',
  },
  'dharmik-upay': {
    title: 'धार्मिक उपाय',
    subtitle: 'मन की शांति के साथ',
  },
  'pavan-grah-aur-aarti': {
    title: 'पावन ग्रंथ व आरती',
    subtitle: 'श्रद्धा से पढ़ें और सुनें',
  },
  'aapatkalen-gayide': {
    title: 'आपातकालीन गाइड',
    subtitle: 'जब तुरंत मदद चाहिए',
  },
  'mahamari-suraksha': {
    title: 'महामारी सुरक्षा',
    subtitle: 'बीमारी फैलने से बचाव',
  },
  'aag-aur-bijli-ke-bachav': {
    title: 'आग और बिजली से बचाव के नियम',
    summary: 'घर में आग लगने की रोकथाम — सरल नियम',
  },
  'aag-lagne-par-kya-karein': {
    title: 'आग लग जाए तो क्या करें',
    summary: 'जलते हुए घर में आग — सबसे पहले क्या करें, क्या न करें',
  },
  'bimari-se-bachav': {
    title: 'संक्रमण से बचाव के सात नियम',
    summary: 'हाथ धोना, मास्क, टीका — आदि से बचाव',
  },
  'dhuwan-ka-jhakora': {
    title: 'धुआँ के झकौर के बचाव',
    summary: 'भरावूला, साँस नहीं चल रही — क्या करें, कब अस्पताल जाएँ',
  },
  'doodh-pani-band-ho': {
    title: 'बिजली या पानी अचानक बंद हो जाए',
    summary: 'क्या करें, किससे बचें, कब मदद माँगें',
  },
  'haath-ki-saafai': {
    title: 'बिना साबुन के हाथ साफ़ करने का तरीक़ा',
    summary: 'जब पानी या साबुन न हो',
  },
};

/**
 * One heading, decided once.
 *
 * `stored` is what the database holds right now, `seed` is what it held when it
 * was translated, and `key` is where the translation lives.
 */
function seedLabel(
  language: string,
  key: string,
  stored: string,
  seed: string | undefined,
): string {
  // Edited since: hers, exactly as she wrote it.
  if (seed === undefined || stored !== seed) return stored;
  const value = translate(language, key);
  // No translation for this language: fall back to the original rather than
  // showing the key itself, which is what `translate` returns when it misses.
  return value === key ? seed : value;
}

/** A category heading, `title` or `subtitle`. */
export function categoryLabel(
  language: string,
  slug: string,
  field: 'title' | 'subtitle',
  stored: string,
): string {
  return seedLabel(language, `cat.${slug}.${field}`, stored, SEEDS[slug]?.[field]);
}

/** An article heading, `title` or `summary`. */
export function articleLabel(
  language: string,
  slug: string,
  field: 'title' | 'summary',
  stored: string,
): string {
  return seedLabel(language, `art.${slug}.${field}`, stored, SEEDS[slug]?.[field]);
}
