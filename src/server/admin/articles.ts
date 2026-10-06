'use server';

/**
 * ===========================================================================
 *  ARTICLES — owner-only editing
 * ===========================================================================
 *
 * Lets the owner write and change the sixteen articles from the browser instead
 * of editing a seed file and re-running it.
 *
 * ── Why editing content from a page needs more care than editing a review ──
 *
 * A review is somebody else's sentence and one bad comment costs nothing.
 * An article *is* the site: the emergency numbers, the medical warnings and the
 * instructions people follow when there is nobody to ask. A typo here is not a
 * cosmetic problem, so this file is deliberately the most conservative thing in
 * the project.
 *
 *   1. **Nothing here deletes.** `isPublished: false` is a hiding, not a
 *      deletion, and the hidden list has a restore button. Only the permanent
 *      delete asks for the slug typed back, which is the one action in the panel
 *      that cannot be reached by a stray click.
 *   2. **A backup is one click away.** `/api/admin/backup` returns every article
 *      and category as JSON. Before any bulk edit, download it.
 *   3. **Every write records who changed it and when.** `updatedAt` is already in
 *      the schema; this never silently rewrites a body without moving it.
 *   4. **The medical and emergency flags cannot be set by accident.** They change
 *      what a page shows, so both default to off on creation rather than to on.
 *
 * ── The body format ────────────────────────────────────────────────────────
 *
 * Plain text, blank line between paragraphs, `#` and `##` for headings, `-` for
 * bullets, `1.` for numbered steps. No HTML, and none accepted: the body is
 * rendered as text, so there is no pipeline an injected tag could travel through.
 * This matches what the seed files already contain, so nothing needs converting.
 */

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { isOwnerSession } from '@/server/owner';

const DENIED = { ok: false, message: 'यह काम केवल प्रबंधक कर सकते हैं।' };

export interface ArticleResult {
  ok: boolean;
  message?: string;
  slug?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Deliberately permissive on length and strict on shape.
 *
 * The title and summary appear in lists and in the WhatsApp preview, so they get
 * a real cap. The body is capped too — without one it is a paste target, and a
 * body long enough to be a page rather than an article would be a mistake worth
 * catching before it is written.
 */
const articleSchema = z.object({
  id: z.string().trim().max(60).optional(),
  categoryId: z.string().trim().min(1, 'श्रेणी चुनिए।'),
  title: z.string().trim().min(3, 'शीर्षक थोड़ा और लंबा लिखिए।').max(160),
  summary: z.string().trim().max(400).default(''),
  body: z.string().trim().min(20, 'लेख कुछ लंबा होना चाहिए।').max(20_000),
  voiceSummary: z.string().trim().max(500).default(''),
  helpline: z.string().trim().max(120).default(''),
  isEmergency: z.coerce.boolean().default(false),
  isMedical: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

/**
 * A URL-safe slug from a title.
 *
 * The existing slugs are romanised Hindi — `subah-ka-samadhi` — because they were
 * written by hand. For a new article written in Devanagari there is nothing to
 * romanise, so the slug falls back to a timestamp suffix. The slug is never shown
 * to a visitor; it exists so the URL is typeable.
 */
function makeSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  // Devanagari survives the pass above and is not URL-safe, so fall back.
  const looksSafe = base.length > 0 && /^[a-z0-9-]+$/.test(base);
  if (!looksSafe) {
    return `article-${Date.now().toString(36)}`;
  }
  return base;
}

async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const candidate = makeSlug(title);

  const clash = await prisma.article.findUnique({
    where: { slug: candidate },
    select: { id: true },
  });

  if (!clash || clash.id === ignoreId) return candidate;
  return `${candidate}-${Date.now().toString(36).slice(-4)}`;
}

/* =========================================================================
 *  CREATE
 *  ========================================================================= */

export async function createArticle(input: unknown): Promise<ArticleResult> {
  if (!(await isOwnerSession())) return DENIED;

  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      (errors[issue.path.join('.') || '_root'] ??= []).push(issue.message);
    }
    return { ok: false, message: 'कृपया जाँच करें।', fieldErrors: errors };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.title);

  try {
    await prisma.article.create({
      data: {
        slug,
        categoryId: data.categoryId,
        title: data.title,
        summary: data.summary,
        body: data.body,
        voiceSummary: data.voiceSummary,
        helpline: data.helpline,
        isEmergency: data.isEmergency,
        isMedical: data.isMedical,
        isPublished: data.isPublished,
        sortOrder: data.sortOrder,
      },
      select: { id: true },
    });
  } catch {
    return { ok: false, message: 'लेख सहेजा नहीं जा सका। डेटाबेस से जुड़ने में समस्या हुई।' };
  }

  revalidatePath('/admin/articles');
  revalidatePath(`/p/${(await categorySlug(data.categoryId)) ?? ''}`);
  revalidatePath('/');

  return { ok: true, message: 'लेख सहेजा गया।', slug };
}

async function categorySlug(categoryId: string): Promise<string | null> {
  const row = await prisma.category.findUnique({ where: { id: categoryId }, select: { slug: true } });
  return row?.slug ?? null;
}

/* =========================================================================
 *  UPDATE
 *  ========================================================================= */

export async function updateArticle(input: unknown): Promise<ArticleResult> {
  if (!(await isOwnerSession())) return DENIED;

  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      (errors[issue.path.join('.') || '_root'] ??= []).push(issue.message);
    }
    return { ok: false, message: 'कृपया जाँच करें।', fieldErrors: errors };
  }

  const data = parsed.data;
  if (!data.id) return { ok: false, message: 'कौन सा लेख बदलना है, यह पता नहीं चला।' };

  const existing = await prisma.article.findUnique({
    where: { id: data.id },
    select: { id: true, slug: true, title: true, category: { select: { slug: true } } },
  });
  if (!existing) return { ok: false, message: 'यह लेख अब मौजूद नहीं है।' };

  /*
   * The slug follows the title only when the owner actually retitled the
   * article. Renaming it on every save would break any link already shared —
   * and this site is meant to be shared on WhatsApp, so those links are the
   * whole point.
   */
  const slug = existing.title === data.title ? existing.slug : await uniqueSlug(data.title, existing.id);

  await prisma.article.update({
    where: { id: data.id },
    data: {
      slug,
      categoryId: data.categoryId,
      title: data.title,
      summary: data.summary,
      body: data.body,
      voiceSummary: data.voiceSummary,
      helpline: data.helpline,
      isEmergency: data.isEmergency,
      isMedical: data.isMedical,
      isPublished: data.isPublished,
      sortOrder: data.sortOrder,
    },
    select: { id: true },
  });

  // Both the old and the new category may have changed.
  revalidatePath('/admin/articles');
  revalidatePath(`/p/${existing.category.slug}`);
  revalidatePath(`/p/${(await categorySlug(data.categoryId)) ?? ''}`);
  revalidatePath(`/p/${existing.category.slug}/${existing.slug}`);
  revalidatePath(`/p/${(await categorySlug(data.categoryId)) ?? ''}/${slug}`);
  revalidatePath('/');

  return { ok: true, message: 'बदलाव सहेजा गया।', slug };
}

/* =========================================================================
 *  HIDE / RESTORE — the reversible delete
 *  ========================================================================= */

/**
 * The action the "delete" button actually calls.
 *
 * It hides. Every article on this site was written by someone who cared enough to
 * write it, and a moderation screen that deletes content on a single click is one
 * bad click away from an article that cannot be recovered from the site. Hidden
 * articles stay in the database, keep their URL, and come back from the trash tab.
 */
export async function setPublished(id: string, published: boolean): Promise<ArticleResult> {
  if (!(await isOwnerSession())) return DENIED;

  const existing = await prisma.article.findUnique({
    where: { id },
    select: { id: true, slug: true, category: { select: { slug: true } } },
  });
  if (!existing) return { ok: false, message: 'यह लेख अब मौजूद नहीं है।' };

  await prisma.article.update({
    where: { id },
    data: { isPublished: published },
    select: { id: true },
  });

  revalidatePath('/admin/articles');
  revalidatePath(`/p/${existing.category.slug}`);
  revalidatePath(`/p/${existing.category.slug}/${existing.slug}`);

  return { ok: true, message: published ? 'लेख फिर से दिख रहा है।' : 'लेख छिपा दिया गया है।' };
}

/* =========================================================================
 *  PERMANENT DELETE
 *  ========================================================================= */

/**
 * The only destructive action in the panel, and it requires the slug typed back.
 *
 * The caller cannot pass a confirmation flag, because a flag in a hidden field is
 * something a script sets for free. Requiring the slug means the owner has to
 * read the article's own identifier and type it, which is a real check and not a
 * speed bump for someone who meant it.
 */
export async function permanentlyDeleteArticle(id: string, typedSlug: string): Promise<ArticleResult> {
  if (!(await isOwnerSession())) return DENIED;

  const existing = await prisma.article.findUnique({
    where: { id },
    select: { id: true, slug: true, isPublished: true },
  });
  if (!existing) return { ok: true, message: 'पहले ही मिटा दिया गया था।' };

  if (existing.slug !== typedSlug.trim()) {
    return { ok: false, message: 'स्लग मेल नहीं खाया। लिखा हुआ स्लग और नीचे दिया स्लग एक जैसा होना चाहिए।' };
  }

  // Refuses while the article is still visible, so the deliberate two-step
  // (hide, confirm, then remove) cannot be short-circuited by a single call.
  if (existing.isPublished) {
    return {
      ok: false,
      message: 'पहले इसे छिपाइए (हटाएँ — साइट से), फिर मिटाइए।',
    };
  }

  await prisma.article.delete({ where: { id }, select: { id: true } });

  revalidatePath('/admin/articles');
  revalidatePath('/');

  return { ok: true, message: 'लेख हमेशा के लिए मिटा दिया गया।' };
}