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
   * A proper name is not translated — `Shri Vyadeshwar Mandir` is the temple's
   * name in every language, and putting it in Devanagari inside a Tamil page
   * would give that reader a word they cannot read. The kind (aarti, kirtan,
   * bhajan) *is* translated, on the line above.
   */
  label: string;
  /** The language it is sung in, in Latin letters. */
  sungIn: string;
  /** Minutes:seconds, taken from the source file's own metadata. */
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
}

/**
 * The listening page.
 *
 * ── Why these four ─────────────────────────────────────────────────────────
 *
 * Because they are the ones whose licence is actually documented. The famous
 * aartis — Om Jai Jagdish Hare, Jai Ambe Gauri, Sukhkarta Dukhharta — exist as
 * commercial recordings, and every free copy of them found was a commercial
 * album re-uploaded under a licence the uploader had no right to give. Putting
 * one of those here would be exactly the "downloaded from a site whose licence
 * is unclear" the note above forbids.
 *
 * What is left is the real thing at a smaller scale: an aarti recorded inside
 * a Maharashtra temple by the person who was standing there, two live temple
 * or street recordings, and a bhajan released by the woman who sang it. Each
 * is credited, and each links to its source page.
 *
 * The owner or the family can add the family's own recordings at any time —
 * those need no licence at all.
 */
export const COLLECTION: Recording[] = [
  {
    slug: 'vyadeshwar-aarti',
    kindKey: 'aarti.kindAarti',
    label: 'Shri Vyadeshwar Mandir, Guhagar (Maharashtra)',
    sungIn: 'Marathi',
    length: '1:03',
    src: '/audio/aarti-vyadeshwar.mp3',
    credit: 'Gsmodak — self-recorded inside the temple',
    licence: 'CC BY-SA 3.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shri_Vyadshwar_Aarti_Audio_file.ogg',
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
  },
];

const RECORDINGS: Record<string, string> = {
  // 'aarti-kaise-karein': '/audio/…',
};

/** The real recording for this article, or null when there is none. */
export function recordingFor(slug: string): string | null {
  return RECORDINGS[slug] ?? null;
}
