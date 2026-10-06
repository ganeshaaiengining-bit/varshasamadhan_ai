import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { isOwnerConfigured, isOwnerSession } from '@/server/owner';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminArticles } from '@/components/admin/admin-articles';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'लेख',
  robots: { index: false, follow: false },
};

/**
 * Article management.
 *
 * The moderation queue lives at `/admin`; this is the other half of the same
 * session. It is a separate page rather than another tab there because writing an
 * article is a long task and the reviewer is usually working through a queue —
 * keeping them apart stops a half-finished draft being lost by a refresh.
 */
export default async function AdminArticlesPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  if (!(await isOwnerSession())) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12 sm:py-16">
          <AdminLogin configured={isOwnerConfigured()} />
        </div>
      </SiteChrome>
    );
  }

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
    updatedAt: true,
  } as const;

  const [categories, published, hidden] = await Promise.all([
    safeRead(
      'admin-articles:categories',
      () =>
        prisma.category.findMany({
          orderBy: { sortOrder: 'asc' },
          select: { id: true, slug: true, title: true },
        }),
      null,
    ),
    safeRead(
      'admin-articles:published',
      () =>
        prisma.article.findMany({
          where: { isPublished: true },
          orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
          select: selectArticle,
        }),
      null,
    ),
    safeRead(
      'admin-articles:hidden',
      () =>
        prisma.article.findMany({
          where: { isPublished: false },
          orderBy: { updatedAt: 'desc' },
          select: selectArticle,
        }),
      null,
    ),
  ]);

  /*
   * No fallback here either, and it matters more than anywhere else: an editor
   * showing "0 live, 0 hidden" would read as "your articles are gone", and the
   * instinct would be to start re-creating them. There is a backup button on this
   * page for exactly the reason that instinct is dangerous.
   */
  if (categories === null || published === null || hidden === null) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12">
          <DatabaseUnavailable language="hi" />
          <p className="mt-4 text-center text-sm text-ink-subtle">
            लेख डेटाबेस तक नहीं पहुँच सके। आपके लेख सुरक्षित हैं — कुछ देर बाद दोबारा देखिए।
          </p>
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <nav className="mb-6 flex flex-wrap gap-4 text-sm">
          <Link href="/admin" className="text-saffron-deep hover:underline">
            ← राय और सवाल
          </Link>
        </nav>

        <AdminArticles
          categories={categories}
          published={published.map((a) => ({ ...a, updatedAt: a.updatedAt.toISOString() }))}
          hidden={hidden.map((a) => ({ ...a, updatedAt: a.updatedAt.toISOString() }))}
        />
      </div>
    </SiteChrome>
  );
}