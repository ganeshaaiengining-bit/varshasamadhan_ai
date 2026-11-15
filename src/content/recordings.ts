/**
 * ===========================================================================
 *  RECORDINGS — a real singer, or nothing
 * ===========================================================================
 *
 * A recitation has to be heard in a human voice. No text-to-speech engine sings
 * an aarti in its chaal, and a computer reading one aloud is not a cheaper
 * version of the real thing — it is the wrong thing. So audio appears on this
 * site only when a real recording exists.
 *
 * ── Two lists ──────────────────────────────────────────────────────────────
 *
 * `COLLECTION` is the listening page at `/aarti`: real aartis, kirtans and
 * bhajans, each with the singer, the place, and the licence it is used under.
 *
 * `RECORDINGS` maps an article slug to a file in `public/audio/`, for the case
 * where a recited article on the site also has its recording. Add one line:
 *
 *     'aarti-kaise-karein': '/audio/aarti-ganpati.mp3',
 *
 * The article page then shows a player instead of a read-aloud button. Until
 * there is an entry, the page shows the words and no voice at all — which is
 * the honest version, and the one the owner asked for.
 *
 * ── What must not go in here ───────────────────────────────────────────────
 *
 * Nothing generated. Not a TTS render, not an AI singing voice, not a clip
 * downloaded from a site whose licence is unclear. This is a memorial site;
 * everything on it should be either the family's own or plainly free, and every
 * entry below says in the page itself who made it and under what licence.
 *
 * ── Every entry is checked against its source ─────────────────────────────
 *
 * The files are the source's own MP3 transcode, downloaded unchanged, and each
 * entry links to the page it came from. The licence is the one that page
 * states — not one this file assumes. If a licence ever changes at the source,
 * the entry has to go.
 *
 * ── Why the standard aartis are here now, and why not the famous albums ────
 *
 * The well-known commercial recordings of Om Jai Jagdish Hare, Jai Ambe Gauri
 * and Sukhkarta Dukhharta cannot be used: they belong to the labels that paid
 * for them, and every "free" copy of those albums found online was uploaded
 * under a licence the uploader had no right to give.
 *
 * What can be used is a recording the publisher itself released under a free
 * licence, with the singer named. Three such publishers exist and all three are
 * used below: SUVRATSUT (Marathi devotional albums, CC BY-ND), Santoshi
 * Prachaar Records with singer Shankar Singh Thakur (CC BY-ND), and the
 * Swami Lakshman Joo Archives (CC0). The words and the chaal are the
 * traditional ones; the voice is a person singing, not a machine.
 *
 * NO-DERIVATIVES IS RESPECTED BY LEAVING THE FILES ALONE. CC BY-ND allows the
 * recording to be copied and passed on unchanged, with credit — not trimmed,
 * re-mixed or re-encoded. The files here are the publisher's own MP3s, byte
 * for byte.
 *
 * The owner or the family can add the family's own recordings at any time —
 * those need no licence at all.
 */

/** One recording on the listening page. */
export interface Recording {
  /** Stable id — also usable as an article slug later. */
  slug: string;
  /** Which kind of recitation it is; an i18n key, so every language reads it. */
  kindKey: 'aarti.kindAarti' | 'aarti.kindKirtan' | 'aarti.kindBhajan';
  /**
   * What it is and where, in Latin letters.
   *
   * A proper name is not translated — `Sukhkarta Dukhharta` is the name of the
   * aarti in every language, and a temple's name stays its own name too. The
   * kind (aarti, kirtan, bhajan) *is* translated, on the line above.
   */
  label: string;
  /**
   * The aarti's own name, in Devanagari, exactly as it is written in the
   * tradition.
   *
   * The Latin `label` above is a name for a reader of Latin letters. But this
   * page is read by people who say "सुखकर्ता दुःखहर्ता", not "Sukhkarta
   * Dukhharta", and showing them a Latin transliteration of their own aarti on
   * a Marathi page is how a page stops looking like it belongs to them. The
   * original name is shown first; the Latin label stays underneath as a second
   * line, and is still what search engines index.
   */
  titleDeva?: string;
  /** The language it is sung in, in that language's own script. */
  sungInNative?: string;
  /** The language it is sung in, in Latin letters. */
  sungIn: string;
  /** Minutes:seconds, measured from the file itself. */
  length: string;
  /** Path under `public/`. */
  src: string;
  /** Who made the recording, in their own words as far as possible. */
  credit: string;
  /** The licence stated at the source. */
  licence: string;
  licenceUrl: string;
  /** The page this came from, so the credit can be checked. */
  sourceUrl: string;
  /** The site that page belongs to, shown as the link text. */
  sourceName: string;
}

/**
 * The listening page.
 *
 * The six aartis first, because that is what a visitor comes for and because
 * they are the ones every household knows. The temple and festival recordings
 * follow: they are real, they are free, and they carry the regional voices the
 * aartis above cannot.
 */
export const COLLECTION: Recording[] = [
  {
    slug: 'aarti-sukhkarta-dukhharta',
    kindKey: 'aarti.kindAarti',
    label: 'Sukhkarta Dukhharta — Ganpati aarti',
    titleDeva: 'सुखकर्ता दुःखहर्ता',
    sungInNative: 'मराठी',
    sungIn: 'Marathi',
    length: '5:58',
    src: '/audio/aarti-ganpati-marathi.mp3',
    credit: 'SUVRATSUT — Ashtavinayaka, a Marathi devotional album',
    licence: 'CC BY-ND 3.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-nd/3.0/',
    sourceUrl: 'https://archive.org/details/Ashtavinayaka',
    sourceName: 'Internet Archive',
  },
  {
    slug: 'aarti-jai-ganesh-deva',
    kindKey: 'aarti.kindAarti',
    label: 'Jai Ganesh Deva — Ganpati aarti',
    titleDeva: 'जय गणेश जय गणेश जय गणेश देवा',
    sungInNative: 'हिंदी',
    sungIn: 'Hindi',
    length: '4:38',
    src: '/audio/aarti-jai-ganesh-deva.mp3',
    credit: 'Shankar Singh Thakur — Chalisa Aarti Sangrah, Santoshi Prachaar Records',
    licence: 'CC BY-ND 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-nd/4.0/',
    sourceUrl: 'https://archive.org/details/jai-ganesha-jai-ganesha-aarti',
    sourceName: 'Internet Archive',
  },
  {
    slug: 'aarti-om-jai-jagdish-hare',
    kindKey: 'aarti.kindAarti',
    label: 'Om Jai Jagdish Hare — Vishnu aarti',
    titleDeva: 'ॐ जय जगदीश हरे',
    sungInNative: 'हिंदी',
    sungIn: 'Hindi',
    length: '4:38',
    src: '/audio/aarti-om-jai-jagdish.mp3',
    credit: 'Swami Lakshman Joo Archives — bhajan 7, sung with Pyarelal',
    licence: 'CC0 1.0',
    licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl:
      'https://archive.org/details/swami-lakshman-joo-pyarelal-bhajans-7.-om-jai-jagdish.._833_j',
    sourceName: 'Internet Archive',
  },
  {
    slug: 'aarti-jai-ambe-gauri',
    kindKey: 'aarti.kindAarti',
    label: 'Jai Ambe Gauri — Durga aarti',
    titleDeva: 'जय अम्बे गौरी',
    sungInNative: 'हिंदी',
    sungIn: 'Hindi',
    length: '6:30',
    src: '/audio/aarti-jai-ambe-gauri.mp3',
    credit: 'Shankar Singh Thakur — Chalisa Aarti Sangrah, Santoshi Prachaar Records',
    licence: 'CC BY-ND 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-nd/4.0/',
    sourceUrl: 'https://archive.org/details/jai-ganesha-jai-ganesha-aarti',
    sourceName: 'Internet Archive',
  },
  {
    slug: 'aarti-jai-saraswati-mata',
    kindKey: 'aarti.kindAarti',
    label: 'Jai Saraswati Mata — Saraswati aarti',
    titleDeva: 'जय सरस्वती माता',
    sungInNative: 'हिंदी',
    sungIn: 'Hindi',
    length: '6:27',
    src: '/audio/aarti-saraswati.mp3',
    credit: 'Shankar Singh Thakur — Chalisa Aarti Sangrah, Santoshi Prachaar Records',
    licence: 'CC BY-ND 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-nd/4.0/',
    sourceUrl: 'https://archive.org/details/jai-ganesha-jai-ganesha-aarti',
    sourceName: 'Internet Archive',
  },
  {
    slug: 'aarti-hanuman-lala-ki',
    kindKey: 'aarti.kindAarti',
    label: 'Aarti Keejei Hanuman Lala Ki — Hanuman aarti',
    titleDeva: 'आरती कीजै हनुमान लला की',
    sungInNative: 'हिंदी',
    sungIn: 'Hindi',
    length: '4:51',
    src: '/audio/aarti-hanuman.mp3',
    credit: 'Granth-Nidhi — Bhakti songs collection',
    licence: 'CC0 1.0',
    licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://archive.org/details/fptu_aarti-keejei-hanuman-lala-ki',
    sourceName: 'Internet Archive',
  },
  {
    slug: 'kamakhya-bhajan',
    kindKey: 'aarti.kindBhajan',
    label: 'Kamakhya temple, Guwahati (Assam)',
    sungIn: 'Assamese',
    length: '5:43',
    src: '/audio/bhajan-kamakhya.mp3',
    credit: 'Subhashish Panigrahi — live recording of local musicians',
    licence: 'CC BY-SA 3.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Local_musicians_singing_bhajan_at_Kamakhya_temple,_Guwahati,_Assam,_India.ogg',
    sourceName: 'Wikimedia Commons',
  },
  {
    slug: 'kirtan-delhi',
    kindKey: 'aarti.kindKirtan',
    label: 'Hauz Khas, New Delhi',
    sungIn: 'Hindi',
    length: '1:29',
    src: '/audio/kirtan-hindi-delhi.mp3',
    credit: 'Subhashish Panigrahi — live recording of local singers',
    licence: 'CC BY-SA 3.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kirtana_in_Hindi.ogg',
    sourceName: 'Wikimedia Commons',
  },
  {
    slug: 'guru-tum-na-mile',
    kindKey: 'aarti.kindBhajan',
    label: 'Guru tum na mile — Jain bhajan',
    sungIn: 'Hindi',
    length: '1:47',
    src: '/audio/bhajan-guru-tum-na-mile.mp3',
    credit: 'The open draft — sung by a woman, released by the uploader',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Guru_tum_na_mile.ogg',
    sourceName: 'Wikimedia Commons',
  },
];

const RECORDINGS: Record<string, string> = {
  // 'aarti-kaise-karein': '/audio/…',
};

/** The real recording for this article, or null when there is none. */
export function recordingFor(slug: string): string | null {
  return RECORDINGS[slug] ?? null;
}
