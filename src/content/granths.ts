import { stringsFor } from '@/content/i18n';

/**
 * ===========================================================================
 *  ग्रंथ, चालीसा और स्तोत्र — heard, not read out by a machine
 * ===========================================================================
 *
 * The owner's rule for aartis turned out to be the rule for everything sacred:
 * whatever the visitor names is the thing that must be shown, and it must be
 * *heard* in a real voice, from a real recording. He said it about aartis, then
 * said it again about granths — "सभी जो भी आरती या ग्रंथ है वो ओडीओ मे सुनाई देणे
 * चाहिए जो युजर चाहता हो", whichever one the user wants, in audio.
 *
 * ── Why these are recordings and not text ──────────────────────────────────
 *
 * A chalisa is forty chaupais and a sahasranama is a thousand names. Writing
 * them into a chat answer from a model's memory is how wrong words get into a
 * prayer, and this site has already been burned by exactly that. So each of
 * these carries the recording of that same text, by a named singer, on the
 * channel that published it — embedded, credited, never downloaded.
 *
 * ── Why only two of them have words here ───────────────────────────────────
 *
 * The Gayatri and the Mahamrityunjay are short enough to store exactly, and
 * they were checked word by word. The chalisas are not stored: the full text of
 * each is on screen in the recording itself, and a forty-verse text typed out
 * with one word wrong is worse than no text at all. The answer says so plainly
 * rather than pretending.
 */
export interface Granth {
  /** Stable id, also the anchor on `/aarti`. */
  slug: string;
  /** The name, in Devanagari, as it is spoken. */
  name: string;
  /** चालीसा / स्तोत्र / मंत्र / पाठ — what kind of text it is. */
  kind: string;
  /** The language it is recited in, in that language's own script. */
  recitedIn: string;
  /** One line, in Devanagari, saying what it is and who wrote it. */
  about: string;
  /** The words, only where they have been checked and are short enough to store. */
  lines?: string[];
  /** The recording of this same text, on the channel that owns it. */
  video: { id: string; channel: string };
  /**
   * Words that mean this text. Longest and most specific first: "दुर्गा चालीसा"
   * must be tested before the bare word "चालीसा", or every chalisa would be
   * answered with Hanuman's.
   */
  words: string[];
}

export const GRANTHS: Granth[] = [
  {
    slug: 'granth-durga-chalisa',
    name: 'दुर्गा चालीसा',
    kind: 'चालीसा',
    recitedIn: 'हिंदी',
    about: 'माँ दुर्गा की चालीस चौपाइयों वाली स्तुति — "नमो नमो दुर्गे सुख करनी"।',
    video: { id: 'AXvmt88JLWg', channel: 'T-Series Bhakti Sagar' },
    words: ['दुर्गा चालीसा', 'दुर्गा चालिसा', 'durga chalisa', 'दुर्गे चालीसा'],
  },
  {
    slug: 'granth-shiv-chalisa',
    name: 'शिव चालीसा',
    kind: 'चालीसा',
    recitedIn: 'हिंदी',
    about: 'शिव जी की चालीसा — "जय गिरिजापति दीन दयाला"।',
    video: { id: '-mUoM-sSzkc', channel: 'T-Series Bhakti Sagar' },
    words: ['शिव चालीसा', 'शिव चालिसा', 'शंकर चालीसा', 'shiv chalisa'],
  },
  {
    slug: 'granth-hanuman-chalisa',
    name: 'हनुमान चालीसा',
    kind: 'चालीसा',
    recitedIn: 'अवधी',
    about: 'गोस्वामी तुलसीदास जी की चालीस चौपाइयाँ — "जय हनुमान ज्ञान गुन सागर"।',
    video: { id: 'AETFvQonfV8', channel: 'T-Series Bhakti Sagar' },
    words: ['हनुमान चालीसा', 'हनुमान चालिसा', 'hanuman chalisa', 'चालीसा', 'चालिसा', 'chalisa'],
  },
  {
    slug: 'granth-vishnu-sahasranama',
    name: 'विष्णु सहस्रनाम',
    kind: 'स्तोत्र',
    recitedIn: 'संस्कृत',
    about: 'महाभारत के अनुशासन पर्व से — विष्णु जी के हज़ार नाम।',
    video: { id: 'HaiY_HYUjGk', channel: 'Vagishwari Sadhna' },
    words: ['विष्णु सहस्रनाम', 'विष्णुसहस्रनाम', 'सहस्रनाम', 'vishnu sahasranam', 'sahasranama'],
  },
  {
    slug: 'granth-haripath',
    name: 'हरिपाठ',
    kind: 'पाठ',
    recitedIn: 'मराठी',
    about: 'संत ज्ञानेश्वर महाराजांचे हरिपाठाचे अभंग — विठ्ठलाच्या नामाचा पाठ.',
    video: { id: 'Wk38Ye-LZY4', channel: 'Sumeet Music' },
    words: ['हरिपाठ', 'हरीपाठ', 'haripath'],
  },
  {
    slug: 'granth-bhagavad-gita',
    name: 'श्रीमद्भगवद्गीता',
    kind: 'पाठ',
    recitedIn: 'संस्कृत',
    about: 'श्रीकृष्ण अर्जुनाला केलेला उपदेश — अठरा अध्याय, सातशे श्लोक.',
    video: { id: 'b61KNQeMfQI', channel: 'ISKCON Nashik' },
    words: ['भगवद्गीता', 'भगवद गीता', 'श्रीमद्भगवद्गीता', 'गीता', 'गीता जी', 'bhagavad gita', 'bhagwat geeta', 'geeta'],
  },
  {
    slug: 'granth-gayatri-mantra',
    name: 'गायत्री मंत्र',
    kind: 'मंत्र',
    recitedIn: 'संस्कृत',
    about: 'ऋग्वेदातील सविता देवतेचा मंत्र — सर्व मंत्रांतील मुख्य मंत्र.',
    lines: [
      'ॐ भूर्भुवः स्वः ।',
      'तत्सवितुर्वरेण्यं ।',
      'भर्गो देवस्य धीमहि ।',
      'धियो यो नः प्रचोदयात् ॥',
    ],
    video: { id: 'nwRoHC83wx0', channel: 'T-Series Bhakti Sagar' },
    words: ['गायत्री मंत्र', 'गायत्री मन्त्र', 'गायत्री', 'gayatri mantra', 'gayatri'],
  },
  {
    slug: 'granth-mahamrityunjay-mantra',
    name: 'महामृत्युंजय मंत्र',
    kind: 'मंत्र',
    recitedIn: 'संस्कृत',
    about: 'ऋग्वेदातील रुद्राचा मंत्र — भय आणि आजार यांच्यासाठी जपला जातो.',
    lines: [
      'ॐ त्र्यम्बकं यजामहे ।',
      'सुगन्धिं पुष्टिवर्धनम् ।',
      'उर्वारुकमिव बन्धनान् ।',
      'मृत्योर्मुक्षीय मामृतात् ॥',
    ],
    video: { id: 'L-y1sr1qUlE', channel: 'T-Series Bhakti Sagar' },
    words: ['महामृत्युंजय', 'महामृत्युंजय मंत्र', 'मृत्युंजय', 'mahamrityunjay', 'mrityunjay'],
  },
];

/**
 * The granth a question asks for, or null.
 *
 * Longest first, so "दुर्गा चालीसा" is not caught by the bare word "चालीसा" in
 * the Hanuman entry. Done by sorting on the matched word's length rather than
 * by relying on the order of the array, because the array will be edited later
 * and the order is the one thing nobody remembers.
 */
function granthIn(question: string): Granth | null {
  const q = question.toLowerCase();
  let best: { granth: Granth; length: number } | null = null;

  for (const granth of GRANTHS) {
    for (const word of granth.words) {
      if (!q.includes(word.toLowerCase())) continue;
      if (!best || word.length > best.length) best = { granth, length: word.length };
    }
  }

  return best?.granth ?? null;
}

/** Does this question name a granth, chalisa, stotra or mantra this site has? */
export function asksForGranth(question: string): boolean {
  return granthIn(question) !== null;
}

/**
 * The answer to a granth question, or null when the question is not one.
 *
 * The recording is returned as well, so the card plays it inline — the same
 * shape the aarti answers use, and for the same reason: the visitor should not
 * have to leave the answer to hear the thing they asked for.
 */
export function granthAnswer(
  question: string,
  lang: string,
): { answer: string; slug: string; name: string; video: { id: string; channel: string } } | null {
  const granth = granthIn(question);
  if (!granth) return null;

  const t = stringsFor(lang);

  const answer = [
    `${granth.name} — ${granth.kind} (${granth.recitedIn})`,
    granth.about,
    '',
    ...(granth.lines ?? []),
    ...(granth.lines ? [''] : []),
    granth.lines ? t('aarti.textPrinted') : t('aarti.textNotStored'),
    `${t('aarti.credit')} ${granth.video.channel} · YouTube`,
  ]
    .join('\n')
    .trim();

  return { answer, slug: granth.slug, name: granth.name, video: granth.video };
}
