import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { getT } from '@/server/i18n';
import { SITE_URL, absolutePath, clampDescription, pageMetadata } from '@/server/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { categoryLabel, articleLabel } from '@/content/labels';
import { isRecitedArticle } from '@/content/recitation';
import { recordingFor } from '@/content/recordings';
import { Icon } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ReadAloud } from '@/components/ask/read-aloud';
import { SaveArticle } from '@/components/article/save-article';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}): Promise<Metadata> {
  const { article } = await params;
  const { t, lang } = await getT();

  /*
   * Guarded for the same reason as the page body: `generateMetadata` runs before
   * the page renders, so an unguarded read here throws first and the page's own
   * guard is never reached — the visitor gets an error screen instead.
   */
  const row = await safeRead(
    `article-meta:${article}`,
    () =>
      prisma.article.findUnique({
        where: { slug: article },
        select: {
          title: true,
          summary: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { slug: true } },
        },
      }),
    undefined,
  );

  if (row === undefined) {
    return { title: t('cat.notFound'), robots: { index: false, follow: false } };
  }
  if (!row) return { title: t('cat.notFound'), robots: { index: false, follow: false } };

  // The tab title speaks the visitor's language, the same as the heading below
  // it — see the note in `labels.ts` for why only the heading moves and not the
  // article itself.
  const title = articleLabel(lang, article, 'title', row.title);
  const description = row.summary ? articleLabel(lang, article, 'summary', row.summary) : title;

  return pageMetadata({
    // The article's own category, not the one in the URL: an article reached by
    // an old link should still declare one canonical address.
    path: `/p/${row.category.slug}/${article}`,
    lang,
    title,
    description: clampDescription(description || `${title} — ${t('home.metaTitle')}`),
    type: 'article',
    published: row.createdAt,
    modified: row.updatedAt,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}) {
  const { slug, article } = await params;
  const { t, lang } = await getT();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';

  const row = await safeRead(
    `article:${article}`,
    () =>
      prisma.article.findFirst({
        where: { slug: article, isPublished: true },
        select: {
          id: true,
          title: true,
          summary: true,
          body: true,
          voiceSummary: true,
          isEmergency: true,
          isMedical: true,
          helpline: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { slug: true, title: true } },
        },
      }),
    undefined,
  );

  /*
   * `undefined` is a database failure, `null` is a missing article. An article
   * page that answered 404 during an outage would look like a dead link — and
   * this is the page people are most likely to have bookmarked or been sent.
   */
  if (row === undefined) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-12">
          <DatabaseUnavailable language={lang} />
        </div>
      </SiteChrome>
    );
  }
  if (!row) notFound();

  /*
   * The body is plain text with blank-line paragraphs, written in Markdown by
   * the owner. Rendering it as text rather than HTML means the admin panel
   * cannot be used to inject a script tag — there is no HTML pipeline at all.
   *
   * Lines that start with `#`/`##` become headings and `-` becomes a list, so
   * the owner can structure a page without learning Markdown syntax being
   * required.
   */
  const blocks = renderBody(row.body);

  // Decided once, so the breadcrumb, the heading and the tab title cannot
  // disagree about what this page is called. See `content/labels.ts`.
  const heading = articleLabel(lang, article, 'title', row.title);
  const summary = articleLabel(lang, article, 'summary', row.summary);

  /*
   * A recited text is not read aloud in a made-up voice. See `content/recitation.ts`
   * for why, and `content/recordings.ts` for the real recording that replaces it
   * when the family has one.
   */
  const recited = isRecitedArticle({ categorySlug: row.category.slug, body: row.body });
  const recording = recited ? recordingFor(article) : null;
  const inCategory = categoryLabel(lang, row.category.slug, 'title', row.category.title);

  /*
   * The article as structured data.
   *
   * `dateModified` is the real `updatedAt` from the row, so a page the owner
   * fixed this morning says so, and a search engine can prefer it over a copy
   * it crawled last month. The breadcrumb is the same trail the visitor sees
   * above the heading — a marked-up trail that disagrees with the visible one is
   * a penalty, not a shortcut.
   */
  const pageUrl = absolutePath(`/p/${row.category.slug}/${article}`, lang);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: heading,
        ...(summary ? { description: summary } : {}),
        inLanguage: lang,
        mainEntityOfPage: pageUrl,
        datePublished: row.createdAt.toISOString(),
        dateModified: row.updatedAt.toISOString(),
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absolutePath('/', lang) },
          {
            '@type': 'ListItem',
            position: 2,
            name: inCategory,
            item: absolutePath(`/p/${row.category.slug}`, lang),
          },
          { '@type': 'ListItem', position: 3, name: heading, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <SiteChrome siteName={siteName}>
      <JsonLd data={structuredData} />
      <div className="wrap-narrow py-8 sm:py-12">
        <Breadcrumbs
          ariaLabel={t('nav.path')}
          items={[
            { href: '/', label: t('nav.home') },
            { href: `/p/${row.category.slug}`, label: inCategory },
            { label: heading },
          ]}
        />

        <article>
          <header className="mt-5">
            {row.isEmergency ? (
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-soft px-3 py-1.5 text-sm font-bold text-rose">
                <Icon name="alert" size={16} />
                {t('article.emergencyInfo')}
              </p>
            ) : null}

            <h1>{heading}</h1>
            {summary ? <p className="mt-3 text-ink-muted">{summary}</p> : null}
          </header>

          {/* The helpline sits above the text, not at the bottom. Someone in a
              panic should not have to scroll to find the number. */}
          {row.helpline ? (
            <div
              role="alert"
              className="card mt-6 border-rose/40 bg-rose-soft p-5 text-center"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-rose">{t('article.remember')}</p>
              <p className="mt-1 text-xl font-extrabold text-rose">{row.helpline}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2">
            {/*
              A recited text gets a real recording or no voice at all — never a
              computer reading an aarti.

              The owner's rule, in his words: an aarti or a song has to be in one
              chaal, the way it is actually sung, and in the voice of a singer or
              a kathakar — never an AI voice. A read-aloud button was here on
              every page, including the sacred ones, so pressing "listen" on an
              aarti played it flat in a synthetic voice. That is the prayer with
              the devotion taken out, so the button is gone from these pages.

              When the family gives a recording it is played here instead; see
              `content/recordings.ts`. Until then the words stay on the page, in
              full, for the visitor to read and sing.

              The button stays on every ordinary article, where a clear synthetic
              voice is a service and not a substitute for a singer.
            */}
            {recited ? null : (
              <ReadAloud
                /*
                 * The whole article, not its summary.
                 *
                 * This used to read `voiceSummary || title + summary`, so on every
                 * page the "listen" button read a paragraph and stopped. For an
                 * aarti or a bhajan that is the feature not working: the visitor
                 * presses listen to hear the text they cannot read, and gets the
                 * first two lines of it.
                 *
                 * The short line still comes first when one exists — it is a
                 * useful introduction — and the body follows it in full.
                 */
                text={[row.title, row.voiceSummary || row.summary, row.body]
                  .filter((part) => part && part.trim().length > 0)
                  .join('\n\n')}
                label={t('article.readAloud')}
              />
            )}

            {recording ? (
              <audio
                controls
                preload="metadata"
                src={recording}
                className="w-full rounded-md border border-line bg-surface p-2"
              />
            ) : null}

            {/*
              Save, next to listen.

              Both exist for the same visitor: someone who cannot read the
              screen easily, and someone who cannot come back to it later. An
              article they cannot keep is an article they have to find twice, and
              finding it a second time on a phone is the part that goes wrong.
            */}
            <SaveArticle
              title={heading}
              summary={summary}
              body={row.body}
              categoryTitle={inCategory}
            />
          </div>

          <div className="mt-8 space-y-5">
            {blocks.map((block, index) => {
              if (block.kind === 'h2') {
                return (
                  <h2 key={index} className="border-t border-line pt-6 text-2xl">
                    {block.text}
                  </h2>
                );
              }
              if (block.kind === 'h3') {
                return (
                  <h3 key={index} className="pt-2 text-xl">
                    {block.text}
                  </h3>
                );
              }
              if (block.kind === 'li') {
                return (
                  <div key={index} className="flex gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                    <span>{block.text}</span>
                  </div>
                );
              }
              if (block.kind === 'numbered') {
                return (
                  <div key={index} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron text-sm font-bold text-white">
                      {block.n}
                    </span>
                    <span className="pt-0.5">{block.text}</span>
                  </div>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {block.text}
                </p>
              );
            })}
          </div>

          {row.isMedical ? (
            <aside className="card mt-10 border-amber/40 bg-amber-soft p-5">
              <h2 className="flex items-center gap-2 text-amber">
                <Icon name="shield" size={20} />
                {t('article.medicalTitle')}
              </h2>
              <p className="mt-2">{t('article.medicalBody')}</p>
            </aside>
          ) : null}
        </article>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
          <Link href={`/p/${row.category.slug}`} className="btn-outline">
            ← {inCategory}
          </Link>
          <Link href="/sahayata" className="btn-primary">
            <Icon name="mic" size={20} />
            {t('article.askAny')}
          </Link>
        </div>

        {lang !== 'hi' ? (
          <p className="mt-8 rounded-md border border-line bg-saffron-soft/40 px-4 py-3 text-sm text-ink-soft">
            {t('language.articlesIn')} {t('language.articlesInHint')}
          </p>
        ) : null}
      </div>
    </SiteChrome>
  );
}

/* ------------------------------------------------------------------------ */

type Block =
  | { kind: 'h2' | 'h3' | 'p' | 'li'; text: string }
  | { kind: 'numbered'; text: string; n: number };

/**
 * Turns the owner's plain text into blocks.
 *
 * Deliberately not a Markdown library. The owner writes in Hindi and the syntax
 * they need is four characters; a full parser would be more code than the
 * format is worth, and would also mean parsing arbitrary input from a text
 * area in the admin panel.
 */
function renderBody(body: string): Block[] {
  const blocks: Block[] = [];
  let numbered = 0;

  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('## ')) {
      numbered = 0;
      blocks.push({ kind: 'h2', text: line.slice(3) });
    } else if (line.startsWith('# ')) {
      numbered = 0;
      blocks.push({ kind: 'h3', text: line.slice(2) });
    } else if (line.startsWith('- ')) {
      blocks.push({ kind: 'li', text: line.slice(2) });
    } else if (/^\d+\.\s/.test(line)) {
      numbered += 1;
      blocks.push({ kind: 'numbered', text: line.replace(/^\d+\.\s/, ''), n: numbered });
    } else {
      // A plain line resets a numbered run, so two separate lists do not merge.
      numbered = 0;
      blocks.push({ kind: 'p', text: line });
    }
  }

  return blocks;
}