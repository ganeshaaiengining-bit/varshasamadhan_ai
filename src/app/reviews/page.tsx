import type { Metadata } from 'next';
import { prisma } from '@/server/db';
import { SiteChrome } from '@/components/layout/site-chrome';
import { ReviewsSection } from '@/components/reviews/reviews-section';
import { getRatingSummary } from '@/server/reviews/actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'समीक्षाएँ',
  description: 'लोगों की राय — और आप अपनी राय लिख सकते हैं। बिना पंजीकरण, बिना फ़ोन नंबर।',
};

export default async function ReviewsPage() {
  const [reviews, summary] = await Promise.all([
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
    getRatingSummary(),
  ]);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <h1>आपकी राय, आपकी बात</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            क्या यह सेवा आपके काम आई? अपनी बात लिखिए — आपका नाम लेना ज़रूरी नहीं है।
            आपकी बात से दूसरे लोगों को फ़ैसला लेने में मदद मिलेगी।
          </p>
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