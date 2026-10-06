import type { Metadata } from 'next';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { getT } from '@/server/i18n';
import { SiteChrome } from '@/components/layout/site-chrome';
import { ReviewsSection } from '@/components/reviews/reviews-section';
import { getRatingSummary } from '@/server/reviews/actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t('reviews.pageTitle'),
    description: t('reviews.pageIntro'),
  };
}

export default async function ReviewsPage() {
  const { t, lang } = await getT();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  /*
   * Guarded, and unlike the other pages it does not fall back to an empty list.
   * A reviews page showing "no reviews yet" when the database is simply down is
   * a false statement, and this site is about not telling people things that
   * aren't true. Saying "the service is unavailable" is the honest answer.
   */
  const [reviews, summary] = await Promise.all([
    safeRead(
      'reviews:list',
      () =>
        prisma.review.findMany({
          // Only approved reviews are read here. The moderation state is not
          // leaked through this query, so a pending comment cannot be seen by
          // simply changing the URL.
          where: { isApproved: true },
          orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
          take: 50,
          select: {
            id: true,
            rating: true,
            authorName: true,
            city: true,
            comment: true,
            reply: true,
            createdAt: true,
          },
        }),
      null,
    ),
    safeRead('reviews:summary', () => getRatingSummary(), null),
  ]);

  if (reviews === null || summary === null) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12">
          <DatabaseUnavailable language={lang} />
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <h1>{t('reviews.title')}</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">{t('reviews.intro')}</p>
        </div>

        <ReviewsSection
          initialReviews={reviews.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          }))}
          summary={summary}
        />
      </div>
    </SiteChrome>
  );
}