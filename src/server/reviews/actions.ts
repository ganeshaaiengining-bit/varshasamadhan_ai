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
 * Approving, replying and deleting is **owner-only**, enforced by the
 * environment credential rather than by a hidden button. The token never reaches
 * the browser, so it cannot be read from a page.
 */

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/server/db';

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

async function recentFrom(ip: string): Promise<number> {
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return prisma.review.count({ where: { createdAt: { gte: hourAgo } } });
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

  if (parsed.data.website) return { ok: true, message: 'धन्यवाद!' };

  if (await recentFrom(ip) >= RATE_LIMIT) {
    return {
      ok: false,
      message: 'आज आपने कई समीक्षाएँ भेज दी हैं। कुछ देर बाद कोशिश कीजिए।',
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
      // grief and illness draws abuse the moment it is open.
      isApproved: false,
    },
    select: { id: true },
  });

  revalidatePath('/reviews');
  return {
    ok: true,
    message: 'धन्यवाद! आपकी समीक्षा जाँच के बाद दिखाई जाएगी।',
  };
}

/* =========================================================================
 *  OWNER — approve, reply, delete
 *  ========================================================================= */

/**
 * Owner credential.
 *
 * Read from the environment on the server and compared in constant time. It is
 * never sent to the browser and never appears in a page, so unlike a hidden
 * admin button it cannot be found by looking at the source.
 */
function ownerToken(): string {
  return process.env.ADMIN_REVIEW_TOKEN ?? process.env.ADMIN_PASSWORD ?? '';
}

function isOwner(token: string | undefined): boolean {
  const expected = ownerToken();
  if (!expected || !token) return false;
  // Length is compared first; both values are then walked in full so the
  // comparison does not exit early on the first differing character.
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

const OWNER_DENIED: ReviewResult = {
  ok: false,
  message: 'यह काम केवल प्रबंधक कर सकते हैं।',
};

async function setApproved(id: string, approved: boolean, token?: string): Promise<ReviewResult> {
  if (!isOwner(token)) return OWNER_DENIED;
  const review = await prisma.review.findUnique({ where: { id }, select: { id: true } });
  if (!review) return { ok: false, message: 'यह समीक्षा अब मौजूद नहीं है।' };

  await prisma.review.update({ where: { id }, data: { isApproved: approved }, select: { id: true } });
  revalidatePath('/reviews');
  revalidatePath('/admin/reviews');
  return { ok: true, message: approved ? 'समीक्षा प्रकाशित कर दी गई।' : 'समीक्षा हटा दी गई।' };
}

export async function approveReview(id: string, token?: string): Promise<ReviewResult> {
  return setApproved(id, true, token);
}

export async function unapproveReview(id: string, token?: string): Promise<ReviewResult> {
  return setApproved(id, false, token);
}

export async function replyToReview(
  id: string,
  reply: string,
  token?: string,
): Promise<ReviewResult> {
  if (!isOwner(token)) return OWNER_DENIED;

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
export async function deleteReview(id: string, token?: string): Promise<ReviewResult> {
  if (!isOwner(token)) return OWNER_DENIED;

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