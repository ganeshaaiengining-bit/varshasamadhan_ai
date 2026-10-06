import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { getT } from '@/server/i18n';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AskBox } from '@/components/ask/ask-box';
import { HealthBox } from '@/components/health/health-box';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('help.title') };
}

/**
 * The plain help page: one box, no navigation to think about. Most visitors who
 * arrive here have a problem right now and want an answer, not a menu.
 */
export default async function SahayataPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';
  const { t, lang } = await getT();

  /*
   * The topic chips below the question box are the only part of this page that
   * comes from the database, so losing it costs almost nothing — the box itself
   * still works, because the AI answer does not touch the database.
   */
  const categories = await safeRead(
    'sahayata:categories',
    () =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { title: true, slug: true },
      }),
    [],
  );

  if (categories.length === 0) {
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
          <h1>{t('help.title')}</h1>
          <p className="mt-3 text-ink-muted">{t('help.intro')}</p>
        </div>

        <div className="card mt-8 p-5 sm:p-7">
          <AskBox
            suggested={[
              { label: t('help.q1.label'), question: t('help.q1.question') },
              { label: t('help.q2.label'), question: t('help.q2.question') },
              { label: t('help.q3.label'), question: t('help.q3.question') },
              { label: t('help.q4.label'), question: t('help.q4.question') },
            ]}
          />
        </div>

        {/*
         * The age box sits above the topic chips, not below them.

         * The topic chips ask the visitor to know which of the nine subjects
         * their problem falls under, which is the thing someone in pain is least
         * able to do — the reported case was a fifty-four-year-old asking about
         * back pain and getting nothing back. Age is something everyone knows
         * without diagnosing themselves, so it is asked first and the subject
         * chips stay as the second, harder way in.
         */}
        <HealthBox />

        {categories.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-center">{t('home.chooseTopic')}</h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/p/${c.slug}`}
                    className="inline-flex items-center rounded-full border-2 border-line bg-surface px-4 py-2.5 font-semibold hover:border-saffron hover:text-saffron-deep"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 text-center text-sm text-ink-subtle">{t('home.chooseTopicNote')}</p>
      </div>
    </SiteChrome>
  );
}