import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { getT } from '@/server/i18n';
import { Icon, type IconName } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AskBox } from '@/components/ask/ask-box';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

/** Always current: the owner can add an article at any time. */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Guarded: metadata is generated before the page body, so an unguarded read
  // here would throw before the page's own guard could answer.
  const category = await safeRead(
    `category-meta:${slug}`,
    () =>
      prisma.category.findUnique({
        where: { slug },
        select: { title: true, subtitle: true },
      }),
    undefined,
  );

  if (category === undefined) return { title: 'सेवा उपलब्ध नहीं है' };
  if (!category) return { title: 'नहीं मिला' };

  return {
    title: category.title,
    description: category.subtitle || category.title,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { t, tf, lang } = await getT();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  const category = await safeRead(
    `category:${slug}`,
    () =>
      prisma.category.findFirst({
        where: { slug, isActive: true },
        select: { id: true, slug: true, title: true, subtitle: true, icon: true },
      }),
    undefined,
  );

  /*
   * `undefined` means "the database could not answer", and a category that is
   * genuinely missing returns `null`. They are not the same and must not look the
   * same: telling a visitor the page does not exist when the database is merely
   * down sends them away from a page that is perfectly fine.
   */
  if (category === undefined) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12">
          <DatabaseUnavailable language={lang} />
        </div>
      </SiteChrome>
    );
  }
  if (!category) notFound();

  const articles = await safeRead(
    `category:${slug}:articles`,
    () =>
      prisma.article.findMany({
        where: { categoryId: category.id, isPublished: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          isEmergency: true,
          helpline: true,
        },
      }),
    [],
  );

  const others = await safeRead(
    `category:${slug}:others`,
    () =>
      prisma.category.findMany({
        where: { isActive: true, id: { not: category.id } },
        orderBy: { sortOrder: 'asc' },
        select: { slug: true, title: true },
        take: 8,
      }),
    [],
  );

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-8 sm:py-12">
        <Breadcrumbs
          ariaLabel={t('nav.path')}
          items={[{ href: '/', label: t('nav.home') }, { label: category.title }]}
        />

        <header className="mt-4 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-saffron-soft text-saffron-deep">
            <Icon name={category.icon as IconName} size={32} />
          </span>
          <h1 className="mt-4">{category.title}</h1>
          {category.subtitle ? <p className="mt-2 text-ink-muted">{category.subtitle}</p> : null}
          {articles.length > 0 ? (
            <p className="mt-2 text-sm text-ink-subtle">
              {tf('article.count', { count: articles.length })}
            </p>
          ) : null}
        </header>

        {/* ------------------------------------------------- ask in context */}
        <div className="card mt-9 border-saffron bg-saffron-soft/30 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-saffron-deep">
            <Icon name="mic" size={22} />
            {t('article.askAbout')}
          </h2>
          <div className="mt-4">
            <AskBox
              category={category.title}
              suggested={articles.slice(0, 3).map((a) => ({ label: a.title, question: a.summary || a.title }))}
            />
          </div>
        </div>

        {/* ------------------------------------------------------- articles */}
        {articles.length === 0 ? (
          <p className="card mt-8 p-8 text-center text-ink-muted">{t('cat.empty')}</p>
        ) : (
          <section aria-labelledby="articles-heading" className="mt-10">
            <h2 id="articles-heading" className="sr-only">
              {tf('article.heading', { category: category.title })}
            </h2>
            <ul className="space-y-4">
              {articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/p/${category.slug}/${article.slug}`}
                    className={`card flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-6 ${
                      article.isEmergency ? 'border-rose/40' : ''
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                        article.isEmergency ? 'bg-rose-soft text-rose' : 'bg-saffron-soft text-saffron-deep'
                      }`}
                    >
                      <Icon name={article.isEmergency ? 'alert' : 'scroll'} size={24} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-ink">{article.title}</span>
                        {article.isEmergency ? (
                          <span className="rounded-full bg-rose-soft px-2.5 py-0.5 text-xs font-bold text-rose">
                            {t('article.emergency')}
                          </span>
                        ) : null}
                      </span>
                      {article.summary ? (
                        <span className="mt-1 block text-ink-muted">{article.summary}</span>
                      ) : null}
                      {article.helpline ? (
                        <span className="mt-2 block font-bold text-rose">{article.helpline}</span>
                      ) : null}
                    </span>

                    <Icon name="arrow" size={22} className="mt-3 shrink-0 text-ink-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* -------------------------------------------------- other topics */}
        {others.length > 0 ? (
          <section aria-labelledby="others-heading" className="mt-12 border-t border-line pt-8">
            <h2 id="others-heading">{t('article.others')}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/p/${other.slug}`}
                    className="inline-flex items-center rounded-full border-2 border-line bg-surface px-4 py-2.5 font-semibold transition-colors hover:border-saffron hover:text-saffron-deep"
                  >
                    {other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* The article bodies are the owner's own writing and are not
            translated. Saying so beats a Tamil interface above a Hindi article. */}
        {lang !== 'hi' ? (
          <p className="mt-10 rounded-md border border-line bg-saffron-soft/40 px-4 py-3 text-sm text-ink-soft">
            {t('language.articlesIn')} {t('language.articlesInHint')}
          </p>
        ) : null}
      </div>
    </SiteChrome>
  );
}