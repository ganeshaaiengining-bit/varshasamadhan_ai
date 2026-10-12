'use server';

/**
 * ===========================================================================
 *  CONTACT — write path
 * ===========================================================================
 *
 * A visitor writes to the owner: an error they found, something this service
 * got wrong, a question, a place they are that is not here yet.
 *
 * Nothing here is public. A message never appears on a page, never becomes an
 * article, and is never sent anywhere. It sits in the database for the owner to
 * read at /admin. That is the whole design: the page said "कुछ बताना है?" and
 * gave a visitor somewhere to say it, and a place to write to that is
 * monitored and answered would be a promise this service cannot keep.
 *
 * THE SAME ASYMMETRY AS REVIEWS
 *
 * Submitting is public and unauthenticated — no account, because a login wall
 * in front of a free help service defeats its purpose. Reading is owner-only,
 * checked against the session cookie from src/server/owner.ts.
 *
 * NO NAME IS REQUIRED, AND THAT IS NOT AN OVERSIGHT
 *
 * The service asks for no personal information anywhere, and a contact form
 * that demands a name would contradict every other page on the site. Plenty of
 * people will leave one, plenty will not, and the message reads the same either
 * way.
 *
 * THE MESSAGE IS NEVER STORED AS HTML
 *
 * It is plain text, rendered with whitespace preserved and every character
 * escaped by React. An owner reading a message that renders as a page would be
 * reading whatever someone chose to send.
 */

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/server/db';

/* =========================================================================
 *  VISITOR — send a message
 *  ========================================================================= */

const contactSchema = z.object({
  // Optional, and optional means it may be empty, not that it may be absent.
  // `undefined` and `''` are different to a form and different to a validator.
  name: z.string().trim().max(80).optional().default(''),
  // Where they are, if they want to say. Useful for "your city is not here yet",
  // which is one of the four things support.way2 asks for.
  city: z.string().trim().max(120).optional().default(''),
  // What went wrong, or what was right, or what was wanted. Ten characters,
  // because "thanks" is a message and should not be refused for being short.
  message: z.string().trim().min(10).max(4000),
  // Honeypot. No person sees this field; anything in it is a bot.
  website: z.string().max(0).optional().default(''),
});

export interface ContactResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Five messages an hour from one address. Nobody has twenty corrections to make. */
const RATE_LIMIT = 5;

const WINDOW_MS = 60 * 60 * 1000;

/**
 * Count this visitor's recent messages.
 *
 * The count is on the message text, for the same reason the review limit is:
 * messages store no IP address, because the site collects no personal
 * information, so there is nothing to join on. Two identical long messages
 * inside a minute is a script. Two people writing identical words by
 * coincidence is not.
 *
 * This is weaker than a real per-IP limit and is said to be so rather than
 * pretending otherwise.
 */
async function countRecent(message: string): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS);

  return prisma.contactMessage.count({
    where: {
      message: { equals: message },
      createdAt: { gte: since },
    },
  });
}

export interface ContactInput {
  name: string;
  city: string;
  message: string;
  /**
   * The honeypot field, which no person sees and must be empty.
   *
   * It is passed separately from the other three rather than being ignored. An
   * earlier version of this signature took a FormData and read every field from
   * it; it was changed to a plain object to match submitReview, and in the
   * change the honeypot was quietly set to '' instead of being read — which
   * would have made the field decorative. A honeypot that is not checked is
   * three lines of markup pretending to be a defence.
   */
  website: string;
}

export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse({
    name: input.name ?? '',
    city: input.city ?? '',
    message: input.message ?? '',
    website: input.website ?? '',
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'message');
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const { name, city, message } = parsed.data;

  try {
    if ((await countRecent(message)) >= RATE_LIMIT) {
      return { ok: false, message: 'rate_limited' };
    }

    await prisma.contactMessage.create({
      data: {
        // Empty is stored as absent rather than as "". An absent name and a name
        // that happens to be blank mean the same thing, and pretending
        // otherwise would make the owner's list count two kinds of nothing.
        name: name || null,
        city: city || null,
        message,
        // Nothing is published. There is no path that sets this to true, on
        // purpose: a contact message becoming a page is a decision for the
        // owner to make deliberately by writing an article, not a side effect
        // of someone typing a complaint.
        isRead: false,
      },
    });

    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    // Deliberately not logging the message itself. If the database is down,
    // what is worth knowing is that it is down, not what a visitor wrote into
    // it while it was.
    console.error('contact: could not store a message', error);
    return { ok: false, message: 'failed' };
  }
}
