import type { MetadataRoute } from 'next';
import { prisma } from '@/server/db';
import { safeRead } from '@/server/db-guard';
import { SITE_URL, languageAlternates } from '@/server/seo';

/**
 * `/sitemap.xml`.
 *
 * ── Why the routes are listed here and not discovered by crawling ───────────
 * The site's navigation is complete enough that a crawler would eventually find
 * every page, but "eventually" is the wrong timeline for a service that is a
 * month old and has no inbound links. A sitemap is the one file that says, on
 * the first day, "these are the pages, this is when each changed".
 *
 * ── The database ────────────────────────────────────────────────────────────
 * Categories and articles are read, not hardcoded — the owner adds them in the
 * admin panel and the sitemap has to follow. The read is guarded: an
 * unreachable database returns the static pages rather than an empty sitemap or
 * a 500, because a sitemap missing its articles for an hour is recoverable and
 * a sitemap that is a stack trace is not.
 *
 * `lastModified` on an article is the real `updatedAt`, which is what tells a
 * crawler to come back for the one article that changed without re-reading the
 * other nine.
 */

export const revalidate = 3600;

type Entry = {
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastModified?: Date;
};

const STATIC: Entry[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/gharguti', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/sahayata', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/aarti', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/smriti', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/samaroh', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pustakalay', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/reviews', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/madad', priority: 0.5, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await safeRead(
    'sitemap:categories',
    () =>
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    [],
  );

  const articles = await safeRead(
    'sitemap:articles',
    () =>
      prisma.article.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
      }),
    [],
  );

  const entries: Entry[] = [
    ...STATIC,
    ...categories.map((category) => ({
      path: `/p/${category.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: category.updatedAt,
    })),
    ...articles.map((article) => ({
      path: `/p/${article.category.slug}/${article.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: article.updatedAt,
    })),
  ];

  return entries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.lastModified ?? new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: { languages: languageAlternates(entry.path) },
  }));
}
