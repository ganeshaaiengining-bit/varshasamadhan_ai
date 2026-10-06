import type { Metadata } from 'next';
import Link from 'next/link';
import { Sunrise } from '@/components/visual/sunrise';
import { getT } from '@/server/i18n';
import { SiteChrome } from '@/components/layout/site-chrome';
import { VARSHA } from '@/content/tribute';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${VARSHA.honorific} ${VARSHA.name} जी — स्मृति`,
    description: VARSHA.shortLine,
  };
}

/**
 * The memorial page.
 *
 * Deliberately plain. A dignified account does not need decoration competing with
 * it, and every element here earns its place: the sun marks the site, the
 * headings break the story into readable steps, and there is nothing on the page
 * that could not be read aloud to someone standing in a room.
 *
 * ── On the story's language ────────────────────────────────────────────────
 * The chrome around the story is translated, but the story itself is the one
 * piece of writing on this site that exists because somebody wrote it, and it is
 * in Hindi. It is not translated, and rather than let a Tamil visitor land on a
 * Tamil interface followed by a Hindi eulogy with no explanation, the page says
 * plainly which language the text is in. The same notice the article pages use
 * for the same reason.
 */
export default async function SmritiPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';
  const { lang, t } = await getT();

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-16">
        {/* ------------------------------------------------------- heading */}
        <header className="text-center">
          <Sunrise size={96} />

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-saffron-deep">
            {t('smriti.eyebrow')}
          </p>

          <h1 className="mt-2">
            {VARSHA.honorific} {VARSHA.name} जी
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft sm:text-xl">
            {VARSHA.shortLine}
          </p>

          {lang !== 'hi' ? (
            <p className="mx-auto mt-4 max-w-xl rounded-md border border-line bg-saffron-soft/50 px-4 py-2 text-sm text-ink-soft">
              {t('language.articlesIn')}{' '}
              <span className="text-ink-subtle">{t('language.articlesInHint')}</span>
            </p>
          ) : null}
        </header>

        {/* --------------------------------------------------------- story */}
        <article className="mt-12 space-y-7">
          {VARSHA.paragraphs.map((para, i) => (
            <section key={i}>
              {para.heading ? (
                <h2 className="border-t border-line pt-6 text-2xl">{para.heading}</h2>
              ) : null}
              <p className="mt-3 text-lg leading-relaxed sm:text-xl">{para.text}</p>
            </section>
          ))}
        </article>

        {/* ------------------------------------------------------- purpose */}
        <section className="card mt-12 border-saffron bg-saffron-soft/40 p-6 text-center sm:p-8">
          <h2 className="text-saffron-deep">{t('smriti.whyTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed">{VARSHA.purpose}</p>
        </section>

        {/* -------------------------------------------------------- ending */}
        <p className="mt-12 text-center text-2xl text-ink-muted">{t('smriti.ending')}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3 border-t border-line pt-8">
          <Link href="/sahayata" className="btn-primary">
            {t('article.askAny')}
          </Link>
          <Link href="/" className="btn-outline">
            {t('nav.home')}
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}