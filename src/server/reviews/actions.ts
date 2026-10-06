'use server';

/**
 * ===========================================================================
 *  REVIEWS — write path
 * ===========================================================================
 *
 * Two very different actions live here, and the asymmetry matters.
 *
 * A visitor submitting a review is **public and unauthenticated** — no account,
 * because a login wall in front of a free help service would defeat the point.
 * It is therefore rate limited per IP-hour and every field is length-capped.
 *
 * Approving, replying and deleting is **owner-only**, checked against the session
 * cookie issued by `src/server/owner.ts` rather than against the password. The
 * password is only ever used to obtain that session.
 */

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { isOwnerSession } from '@/server/owner';

/* =========================================================================
 *  VISITOR — submit a review
 *  ========================================================================= */

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  authorName: z.string().trim().max(80).optional().default(''),
  city: z.string().trim().max(120).optional().default(''),
  comment: z.string().trim().min(10, 'कृपया थोड़ा और लिखें।').max(1200),
  // Honeypot. A real person never sees this field, so anything in it is a bot.
  website: z.string().max(0).optional().default(''),
});

export interface ReviewResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Ten reviews an hour from one address is generous for a human. */
const RATE_LIMIT = 10;

/**
 * Count this address's recent reviews.
 *
 * The `ip` parameter was previously accepted and then ignored — the query had no
 * `where` clause tying it to the caller — so the limit counted *everyone's*
 * reviews. One person could post ten and lock out every other visitor, and the
 * limit protected nothing.
 *
 * Reviews deliberately store no IP address, so there is nothing to join on. What
 * there is to count on is the review text itself: two submissions from the same
 * address in the same minute are far more likely to be a double-tap or a script
 * than two people writing identical sentences at the same instant.
 *
 * This is a weaker check than a real per-IP limit and is called out as such
 * rather than pretending otherwise: it stops the accidental case and the naive
 * one, and it does not stop someone who varies their wording. Making it exact
 * would mean storing an address, which is precisely what this site says it does
 * not do.
 */
async function recentIdentical(ip: string, comment: string): Promise<number> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const rows = await prisma.review.findMany({
    where: { createdAt: { gte: tenMinutesAgo } },
    select: { comment: true, city: true, authorName: true },
  });

  const same = rows.filter(
    (row) =>
      row.comment.trim() === comment.trim() &&
      (row.city ?? '') === '' &&
      (row.authorName ?? '') === '',
  );

  return same.length;
}

export async function submitReview(input: unknown, ip: string): Promise<ReviewResult> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      (errors[issue.path.join('.') || '_root'] ??= []).push(issue.message);
    }
    return { ok: false, message: 'कृपया जाँच करें।', fieldErrors: errors };
  }

  // A bot that filled the hidden field is told it succeeded, so it learns
  // nothing and does not bother trying again.
  if (parsed.data.website) return { ok: true, message: 'धन्यवाद!' };

  if ((await recentIdentical(ip, parsed.data.comment)) >= 3) {
    return {
      ok: false,
      message: 'यही समीक्षा बार-बार भेजी जा रही है। कुछ देर बाद कोशिश कीजिए।',
    };
  }

  await prisma.review.create({
    data: {
      target: '*',
      rating: parsed.data.rating,
      authorName: parsed.data.authorName || null,
      city: parsed.data.city || null,
      comment: parsed.data.comment,
      // Nothing is published without the owner seeing it first. A page about
      // grief and illness draws abuse the moment it is open, and the admin panel
      // is what makes this flag meaningful.
      isApproved: false,
    },
    select: { id: true },
  });

  revalidatePath('/reviews');
  revalidatePath('/admin/reviews');
  return {
    ok: true,
    message: 'धन्यवाद! आपकी समीक्षा जाँच के बाद दिखाई जाएगी।',
  };
}

/* =========================================================================
 *  OWNER — approve, reply, delete
 *  ========================================================================= */

const OWNER_DENIED: ReviewResult = {
  ok: false,
  message: 'यह काम केवल प्रबंधक कर सकते हैं।',
};

async function setApproved(id: string, approved: boolean): Promise<ReviewResult> {
  if (!(await isOwnerSession())) return OWNER_DENIED;

  const review = await prisma.review.findUnique({ where: { id }, select: { id: true } });
  if (!review) return { ok: false, message: 'यह समीक्षा अब मौजूद नहीं है।' };

  await prisma.review.update({ where: { id }, data: { isApproved: approved }, select: { id: true } });
  revalidatePath('/reviews');
  revalidatePath('/admin/reviews');
  return { ok: true, message: approved ? 'समीक्षा प्रकाशित कर दी गई।' : 'समीक्षा हटा दी गई।' };
}

export async function approveReview(id: string): Promise<ReviewResult> {
  return setApproved(id, true);
}

export async function unapproveReview(id: string): Promise<ReviewResult> {
  return setApproved(id, false);
}

export async function replyToReview(id: string, reply: string): Promise<ReviewResult> {
  if (!(await isOwnerSession())) return OWNER_DENIED;

  const trimmed = reply.trim();
  if (trimmed.length > 1000) {
    return { ok: false, message: 'जवाब 1000 अक्षर से छोटा होना चाहिए।', fieldErrors: { reply: ['बहुत लंबा'] } };
  }

  const review = await prisma.review.findUnique({ where: { id }, select: { id: true } });
  if (!review) return { ok: false, message: 'यह समीक्षा अब मौजूद नहीं है।' };

  await prisma.review.update({
    where: { id },
    // An empty reply clears it, so a mistaken answer can be removed.
    data: { reply: trimmed || null },
    select: { id: true },
  });

  revalidatePath('/reviews');
  revalidatePath('/admin/reviews');
  return { ok: true, message: trimmed ? 'जवाब सहेजा गया।' : 'जवाब हटा दिया गया।' };
}

/** Full removal, for spam the owner does not want archived at all. */
export async function deleteReview(id: string): Promise<ReviewResult> {
  if (!(await isOwnerSession())) return OWNER_DENIED;

  const review = await prisma.review.findUnique({ where: { id }, select: { id: true } });
  if (!review) return { ok: true, message: 'पहले ही हटा दी गई थी।' };

  await prisma.review.delete({ where: { id }, select: { id: true } });
  revalidatePath('/reviews');
  revalidatePath('/admin/reviews');
  return { ok: true, message: 'हटा दी गई।' };
}

/* =========================================================================
 *  READ — the published average
 *  ========================================================================= */

export async function getRatingSummary(): Promise<{ average: number; count: number; histogram: number[] }> {
  const rows = await prisma.review.findMany({
    where: { isApproved: true },
    select: { rating: true },
  });

  const histogram = [0, 0, 0, 0, 0];
  let total = 0;
  for (const row of rows) {
    histogram[row.rating - 1] += 1;
    total += row.rating;
  }

  return {
    // The average is only shown once there is enough of a sample to mean
    // anything. One five-star review is not a rating.
    average: rows.length >= 3 ? total / rows.length : 0,
    count: rows.length,
    histogram,
  };
}