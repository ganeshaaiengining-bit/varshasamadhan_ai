import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/server/db';
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

  const [categories, published, hidden] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, title: true },
    }),
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
      select: {
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
      },
    }),
    prisma.article.findMany({
      where: { isPublished: false },
      orderBy: { updatedAt: 'desc' },
      select: {
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
      },
    }),
  ]);

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