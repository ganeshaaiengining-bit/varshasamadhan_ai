import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { isDatabaseFailure } from '@/server/db-guard';
import { isOwnerSession } from '@/server/owner';

/**
 * GET /api/admin/backup
 *
 * Downloads every article and category as JSON.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 *
 * The owner can now write and edit articles from a browser form. That is worth
 * doing, and it also means a mistake is one bad paste away — and the database is
 * the only copy. A seed file can be regenerated, but an article written in this
 * panel cannot: it never existed in any file.
 *
 * So the escape hatch has to be inside the panel rather than in a terminal, and
 * it has to be one click. The instructions are therefore: download a backup
 * before any large edit, not after something has gone wrong.
 *
 * ── What it contains, and what it must never contain ───────────────────────
 *
 * Articles and categories only. No reviews — those hold names and cities people
 * typed in, and a backup is the last thing that should travel casually between
 * laptops. No `ADMIN_PASSWORD`, no API key: this route reads the database, and
 * the environment is not in the database.
 *
 * The file is served only to an owner session, with `no-store` so a shared
 * machine does not keep a copy of it in a cache.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isOwnerSession())) {
    return NextResponse.json({ ok: false, message: 'केवल प्रबंधक के लिए।' }, { status: 401 });
  }

  /*
   * Typed explicitly rather than inferred from `findMany`'s default return, which
   * includes `createdAt`/`updatedAt` that this route's `select` does not ask for.
   * Inferring it and then narrowing would need a cast; this is the honest shape.
   */
  const selectCategory = {
    id: true,
    slug: true,
    title: true,
    subtitle: true,
    icon: true,
    accent: true,
    sortOrder: true,
    isActive: true,
  } as const;

  const selectArticle = {
    id: true,
    categoryId: true,
    slug: true,
    title: true,
    summary: true,
    body: true,
    voiceSummary: true,
    isEmergency: true,
    isMedical: true,
    helpline: true,
    sortOrder: true,
    isPublished: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  let categories: { slug: string }[] & Record<string, unknown>[] = [];
  let articles: { slug: string }[] & Record<string, unknown>[] = [];

  try {
    [categories, articles] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        select: selectCategory,
      }),
      prisma.article.findMany({
        orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
        select: selectArticle,
      }),
    ]) as [typeof categories, typeof articles];
  } catch (error) {
    /*
     * A backup that silently returns zero rows is worse than no backup at all:
     * the owner would store an empty file, believe their work was saved, and only
     * discover otherwise when they needed it. So a database failure here is a 503
     * with an explanation, never an empty download.
     *
     * The reason is filtered through `isDatabaseFailure` for the same reason as
     * every other page — the Prisma message contains the connection string, and
     * this route returns JSON a browser will show.
     */
    if (!isDatabaseFailure(error)) throw error;
    console.error('[backup] could not read the articles:', error);
    return NextResponse.json(
      { ok: false, message: 'डेटाबेस तक पहुँच नहीं बन पाई। बैकअप अधूरा है, इसे भरोज़र न करें।' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const payload = {
    format: 'varsha-samadhan/articles-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    note: 'Restore with the seed files or by inserting into the articles table. Ids are included so relations survive.',
    counts: { categories: categories.length, articles: articles.length },
    categories,
    articles,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="varsha-backup-${stamp}.json"`,
      // A backup is the most sensitive file the owner will hold. It must not be
      // cached by the browser, a proxy, or a CDN sitting in front of the site.
      'cache-control': 'no-store, max-age=0',
    },
  });
}