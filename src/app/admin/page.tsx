import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { isOwnerConfigured, isOwnerSession } from '@/server/owner';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminPanel } from '@/components/admin/admin-panel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'प्रबंधक',
  // The owner panel holds the names and cities people typed in. It must never
  // appear in a search result, even though the rest of the site wants indexing.
  robots: { index: false, follow: false },
};

/**
 * The owner panel.
 *
 * ── What it can see ────────────────────────────────────────────────────────
 * Every review that has been submitted, with the name and city the visitor chose
 * to give, and whether it is published. That is all. There is no IP address
 * stored with a review, no session identifier, and nothing that ties a comment to
 * a particular visit — so the promise on the public pages that this site does not
 * collect personal information is true here too, not just of the part visitors
 * can see.
 *
 * ── What it deliberately cannot do ─────────────────────────────────────────
 * It cannot edit or delete an article. Article content is the reason the site
 * exists, and a moderation screen that could also remove it would put all
 * sixteen of them one stolen cookie away from gone.
 *
 * ── Two states, both explained ─────────────────────────────────────────────
 * "No password set" and "wrong password" are different problems with different
 * fixes, and an owner locked out of their own site is told which one it is.
 */
export default async function AdminPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  // Nothing is loaded at all until the session is confirmed. Rendering the panel
  // first and hiding it with CSS would ship the visitor names to anyone who
  // opened the page source.
  if (!(await isOwnerSession())) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12 sm:py-16">
          <AdminLogin configured={isOwnerConfigured()} />
        </div>
      </SiteChrome>
    );
  }

  const [pending, published, asked, failures] = await Promise.all([
    safeRead(
      'admin:pending',
      () =>
        prisma.review.findMany({
          where: { isApproved: false },
          orderBy: { createdAt: 'desc' },
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
    safeRead(
      'admin:published',
      () =>
        prisma.review.findMany({
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
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
    safeRead(
      'admin:asked',
      () =>
        prisma.askedQuestion.findMany({
          orderBy: { createdAt: 'desc' },
          take: 30,
          select: { id: true, question: true, category: true, wasAnswered: true, wasFailed: true, createdAt: true },
        }),
      null,
    ),
    safeRead('admin:failures', () => prisma.askedQuestion.count({ where: { wasFailed: true } }), null),
  ]);

  /*
   * The owner panel has no fallback. An empty moderation queue is actionable —
   * it looks like "nothing to do" — and here it would mean "the reviews you have
   * not read yet are still waiting and you cannot see them". Say so instead.
   */
  if (pending === null || published === null || asked === null || failures === null) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12">
          <DatabaseUnavailable language="hi" />
          <p className="mt-4 text-center text-sm text-ink-subtle">
            व्यवस्थापक पैनल को डेटाबेस तक पहुँच नहीं मिल पाई।
          </p>
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <AdminPanel
          pending={pending.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
          published={published.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
          asked={asked.map((q) => ({ ...q, createdAt: q.createdAt.toISOString() }))}
          failures={failures}
        />

        {/* The article editor is the other half of the panel and a separate page:
            writing an article is a long task, and keeping it away from the review
            queue stops a half-finished draft being lost to a refresh. */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
          <Link href="/admin/articles" className="btn-outline !min-h-[2.75rem]">
            लेख देखें / बदलें
          </Link>
          <Link href="/" className="btn-ghost !min-h-[2.75rem]">
            साइट देखें
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}