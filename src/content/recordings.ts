/**
 * ===========================================================================
 *  RECORDINGS — a real singer, or nothing
 * ===========================================================================
 *
 * A recitation has to be heard in a human voice. No text-to-speech engine sings
 * an aarti in its chaal, and a computer reading one aloud is not a cheaper
 * version of the real thing — it is the wrong thing. So a recited text gets
 * audio here only when a real recording exists.
 *
 * ── How to add one ─────────────────────────────────────────────────────────
 *
 *   1. Put the file in `public/audio/` (mp3, mono, 64–96 kbps is plenty for
 *      spoken or sung voice and keeps a two-minute aarti under a megabyte).
 *   2. Add one line below, keyed by the article slug or the aarti's own name:
 *
 *        'aarti-kaise-karein': '/audio/aarti-ganpati.mp3',
 *
 * The article page then shows a player instead of a read-aloud button. Until
 * there is an entry, the page shows the words and no voice at all — which is
 * the honest version, and the one the owner asked for.
 *
 * ── What must not go in here ───────────────────────────────────────────────
 *
 * Nothing generated. Not a TTS render, not an AI singing voice, not a clip
 * downloaded from a site whose licence is unclear. Every recording in this map
 * should be one the owner or the family has the right to publish — their own
 * recording, a public-domain recording, or one released under a licence that
 * allows it. This is a memorial site; everything on it should be either the
 * family's own or plainly free.
 */

const RECORDINGS: Record<string, string> = {
  // 'aarti-kaise-karein': '/audio/…',
};

/** The real recording for this article, or null when there is none. */
export function recordingFor(slug: string): string | null {
  return RECORDINGS[slug] ?? null;
}
