import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/server/db';
import { getT } from '@/server/i18n';
import { Icon } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ReadAloud } from '@/components/ask/read-aloud';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}): Promise<Metadata> {
  const { article } = await params;
  const row = await prisma.article.findUnique({ where: { slug: article }, select: { title: true, summary: true } });
  if (!row) return { title: 'नहीं मिला' };
  return { title: row.title, description: row.summary };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}) {
  const { slug, article } = await params;
  const { t, lang } = await getT();

  const row = await prisma.article.findFirst({
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
      category: { select: { slug: true, title: true } },
    },
  });
  if (!row) notFound();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

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

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-8 sm:py-12">
        <Breadcrumbs
          ariaLabel={t('nav.path')}
          items={[
            { href: '/', label: t('nav.home') },
            { href: `/p/${row.category.slug}`, label: row.category.title },
            { label: row.title },
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

            <h1>{row.title}</h1>
            {row.summary ? <p className="mt-3 text-ink-muted">{row.summary}</p> : null}
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
            <ReadAloud
              text={row.voiceSummary || `${row.title}। ${row.summary}`}
              label={t('article.readAloud')}
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
            ← {row.category.title}
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