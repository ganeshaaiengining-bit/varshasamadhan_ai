import 'server-only';

import { prisma } from '@/server/db';
import { safeRead } from '@/server/db-guard';

/**
 * ===========================================================================
 *  STORED ANSWERS — what the site knows without the AI
 * ===========================================================================
 *
 * When the AI is unavailable — no key, quota spent, network down, model renamed —
 * the visitor still gets something true and useful, because this site already
 * contains sixteen articles of real guidance written by the owner.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 *
 * The reported symptom was "you ask a question and nothing comes back". The
 * honest answer is that a site which *has* the answer in its own database and
 * shows nothing is failing in a way it does not have to. Someone asking about a
 * fever at two in the morning cannot be told to come back later.
 *
 * The AI is a better answer when it is available: it can handle a question that
 * matches no article, and it can follow up. This is the floor underneath it, not
 * a replacement.
 *
 * ── How a question is matched ──────────────────────────────────────────────
 *
 * Deliberately simple word overlap against the article's title, summary and body
 * — no embeddings, no vector database, no extra API to be down as well. A cosine
 * similarity search over sixteen documents would be a rounding error of a
 * difference against a brute-force scan, and it would add a failure mode.
 *
 * It also avoids stemming and stop-word lists on purpose. The audience writes
 * plain Hindi, and a query like "बुखार" should reach an article about fever by
 * matching the word "बुखार", not by being stemmed towards a form the article does
 * not contain. Getting nothing beats confidently returning the wrong article.
 */

export interface StoredAnswer {
  title: string;
  summary: string;
  slug: string;
  categorySlug: string;
  categoryTitle: string;
  /** 0–1. Below `MINIMUM_RELEVANCE` this is not an answer, it is a guess. */
  score: number;
}

/**
 * Below this, return nothing.
 *
 * A wrong article is worse than none here. Someone with a fever who is sent to
 * "ghar ki marammat" has been actively misled by a site that had the right answer
 * one page away and chose to guess.
 *
 * It was 0.08 to begin with, which is not a threshold so much as an excuse: every
 * question cleared it, and "share market kaise karta hai" was answered with the
 * infection-prevention article. Half is not too strict either — a question whose
 * words all land on the title is a clear match and should not be withheld.
 */
const MINIMUM_RELEVANCE = 0.34;

/**
 * Words too common to carry any signal about which article is meant.
 *
 * Every one of these was earning a point for a match. "काम" alone was enough to
 * return the fire-safety article to a question about the share market, because
 * every article on this site says "यह काम करता है" somewhere.
 */
const STOP_WORDS = new Set([
  'का', 'की', 'के', 'को', 'में', 'से', 'है', 'हैं', 'था', 'थी', 'और', 'या', 'यह', 'वह',
  'एक', 'लिए', 'लिये', 'दिया', 'किया', 'गया', 'कि', 'तो', 'ही', 'ना', 'नहीं', 'मुझे', 'मेरे',
  'क्या', 'कैसे', 'क्यों', 'कब', 'कहाँ', 'कौन', 'बताइए', 'बताएं', 'बताओ', 'चाहिए', 'करना', 'करें',
  'हो', 'दिन', 'दो', 'साल', 'महीने', 'बार', 'बहुत', 'कुछ', 'सब', 'ज्यादा', 'कम', 'अभी', 'अब',
  'उस', 'उन', 'इस', 'उसके', 'इसके', 'कोई', 'सबसे', 'अच्छा', 'बुरा', 'वाला', 'वाली', 'वाले',
  'काम', 'जैसे', 'तर', 'बात', 'बातें', 'सकता', 'सकती', 'सकते', 'करता', 'करती', 'करते',
  'जाता', 'जाती', 'जाते', 'रहा', 'रही', 'रहे', 'लिए', 'साथ', 'बिना', 'दूसरा', 'पहले', 'बाद',
  'समझ', 'जानते', 'जानना', 'रहा', 'लिखा', 'लेख', 'पन्ना', 'पेज', 'साइट', 'वेबसाइट',
]);

/**
 * Words are split on anything that is not a letter, a mark or a digit.
 *
 * **`\p{Mark}` is not optional here, and getting this wrong breaks every
 * Devanagari search on the site.** A conjunct like "बच्चे" is written
 * `च` + virama + `च` + `े`, and the virama is Unicode category *Mn* — a
 * combining mark, not a letter. Splitting on "anything that is not a letter or a
 * digit" therefore cuts the word in half at the virama: "बच्चे" tokenises to
 * "बच", and "बच" appears in half the articles on the site.
 *
 * The effect was not subtle. Every question returned the fire-safety article,
 * including "my child has a fever" and "the power went out". Tamil and Malayalam
 * have the same problem — their virama behaves identically.
 *
 * Splitting on `\p{Letter}\p{Number}\p{Mark}` keeps the conjunct whole and still
 * splits English on whitespace, because a space is none of the three.
 */
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{Letter}\p{Number}\p{Mark}]+/u)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Whether `haystack` contains `needle`, allowing for inflection.
 *
 * Hindi and Tamil both inflect, so "बुखा" is not the string "बुखार" that the
 * article happens to use, and a visitor who typed the first should still reach the
 * article about the second. Only applied to words of four characters or more, so
 * a short word does not match half the dictionary — "दर्द" would otherwise pull
 * in every article containing "दर्दना", "दर्दभरा" and "दर्दमा".
 */
function matches(haystack: string[], needle: string): boolean {
  if (haystack.includes(needle)) return true;
  if (needle.length < 4) return false;
  return haystack.some((word) => word.startsWith(needle));
}

/**
 * Find the stored article that best answers a question, if any does.
 *
 * Returns null rather than a low-scoring article, and the route turns that into
 * "ask again later" — which is a better outcome than a confidently wrong answer.
 */
export async function findStoredAnswer(question: string): Promise<StoredAnswer | null> {
  const wanted = tokenise(question);
  if (wanted.length === 0) return null;

  const articles = await safeRead(
    'stored-answer:articles',
    () =>
      prisma.article.findMany({
        where: { isPublished: true },
        select: {
          slug: true,
          title: true,
          summary: true,
          body: true,
          category: { select: { slug: true, title: true } },
        },
      }),
    [],
  );

  let best: StoredAnswer | null = null;

  for (const article of articles) {
    /*
     * The title and summary are weighted more heavily than the body, and a match
     * in the title counts double again. A body is long enough that a single
     * shared common word would otherwise match almost everything, which is how
     * "what should I do" ends up returning an article about repairs.
     */
    const title = tokenise(article.title);
    const summary = tokenise(article.summary);
    const body = tokenise(article.body);

    let score = 0;
    let headlineHits = 0;
    for (const word of wanted) {
      const inTitle = matches(title, word);
      const inSummary = matches(summary, word);
      if (inTitle) {
        score += 4;
        headlineHits += 1;
      }
      if (inSummary) {
        score += 2;
        headlineHits += 1;
      }
      if (matches(body, word)) score += 1;
    }

    /*
     * A word appearing somewhere in the body is not evidence that the article is
     * *about* that word. Long articles mention fever in passing while being about
     * something else entirely — this site's fire-safety article does — and a body
     * match alone was enough to return it for "my child has a fever", which the
     * site has no article about.
     *
     * So an article has to be about the question, not merely mention it. The title
     * and the summary are what the article is *about*; a body match only breaks
     * ties between articles that already qualify.
     */
    if (headlineHits === 0) continue;
    if (score === 0) continue;

    /*
     * A long article must not win just by being long.
     *
     * The first version of this scored one point per matching word anywhere in
     * the body, which meant the fire-safety article — the longest one on the site
     * — won almost every query, including "my child has a fever". Counting body
     * words and then dividing by the square root of the article length makes the
     * contribution a *density* instead of a raw count: matching five words in a
     * five-hundred-word article is weak evidence, matching five in a forty-word
     * article is strong.
     *
     * `sqrt` rather than a straight division because the difference between 40
     * and 500 words is not the same magnitude as the difference between 5,000 and
     * 50,000, and a linear divisor makes every long article score almost nothing.
     */
    const bodyHits = wanted.filter((word) => matches(body, word)).length;
    const density = bodyHits / Math.sqrt(Math.max(body.length, 1));

    const relevance = Math.min(1, score / (wanted.length * 4) + density * 0.5);

    if (best === null || relevance > best.score) {
      best = {
        title: article.title,
        summary: article.summary,
        slug: article.slug,
        categorySlug: article.category.slug,
        categoryTitle: article.category.title,
        score: relevance,
      };
    }
  }

  if (!best || best.score < MINIMUM_RELEVANCE) return null;
  return best;
}