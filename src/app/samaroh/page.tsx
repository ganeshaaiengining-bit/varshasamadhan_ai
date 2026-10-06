import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { safeRead } from '@/server/db-guard';
import { getT } from '@/server/i18n';
import { Icon } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';

/**
 * How the service works, what it will not do, and where the owner's words go.
 *
 * The prototype had no page like this. A service that answers questions about
 * health and money needs to say plainly what it is — and what it is not —
 * before anyone trusts it with something personal.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('ref.title') };
}

export default async function SamarohPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';
  const { t, tf } = await getT();

  /*
   * This page is mostly prose — what the service does and does not do — and only
   * its statistics come from the database. The refusals on it are the most
   * important text on the site ("this is not a doctor", "we never invent a
   * helpline number"), so the page is worth keeping even with no counts at all.
   * The counts simply go to zero rather than taking the page down with them.
   */
  const categories = await safeRead(
    'samaroh:categories',
    () =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          title: true,
          subtitle: true,
          _count: { select: { articles: { where: { isPublished: true } } } },
        },
      }),
    [],
  );

  const questions = await safeRead('samaroh:questionCount', () => prisma.askedQuestion.count(), 0);

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <h1>{t('ref.title')}</h1>

        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p>{t('ref.intro')}</p>

          <h2 className="pt-2">{t('ref.whatTitle')}</h2>
          <ul className="space-y-2">
            {[t('ref.what1'), t('ref.what2'), t('ref.what3'), t('ref.what4')].map((line) => (
              <li key={line} className="flex gap-3">
                <Icon name="check" size={22} className="mt-1.5 shrink-0 text-success" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <h2 className="pt-2">{t('ref.notTitle')}</h2>
          <ul className="space-y-2">
            {[t('ref.not1'), t('ref.not2'), t('ref.not3'), t('ref.not4'), t('ref.not5')].map(
              (line) => (
                <li key={line} className="flex gap-3">
                  <Icon name="close" size={22} className="mt-1.5 shrink-0 text-danger" />
                  <span>{line}</span>
                </li>
              ),
            )}
          </ul>

          <div className="card border-rose/40 bg-rose-soft p-5">
            <h2 className="flex items-center gap-2 text-rose">
              <Icon name="alert" size={22} />
              {t('ref.medicalTitle')}
            </h2>
            <p className="mt-2">{t('ref.medicalBody')}</p>
          </div>
        </div>

        <section className="mt-12">
          <h2>{t('ref.statsTitle')}</h2>
          <p className="mt-2 text-ink-muted">
            {tf('ref.statsCategories', { count: categories.length })}{' '}
            {tf('ref.statsArticles', { count: categories.reduce((n, c) => n + c._count.articles, 0) })}
            {questions > 0 ? ` ${tf('ref.statsQuestions', { count: questions })}` : null}
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <li key={c.title} className="card flex items-center gap-3 p-4">
                <Icon name="scroll" size={20} className="shrink-0 text-saffron" />
                <span className="min-w-0">
                  <span className="block font-bold">{c.title}</span>
                  <span className="block text-sm text-ink-muted">{c.subtitle}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/sahayata" className="btn-primary">
            <Icon name="mic" size={20} />
            {t('ask.send')}
          </Link>
          <Link href="/madad" className="btn-outline">
            {t('nav.support')}
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}