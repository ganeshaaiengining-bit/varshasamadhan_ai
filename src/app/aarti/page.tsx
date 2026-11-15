import type { Metadata } from 'next';
import { getT } from '@/server/i18n';
import { SITE_NAME, SITE_URL, clampDescription, pageMetadata } from '@/server/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { SiteChrome } from '@/components/layout/site-chrome';
import { COLLECTION } from '@/content/recordings';
import { Icon } from '@/components/ui/icon';

/**
 * ===========================================================================
 *  आरती व भजन — असली आवाज़ में
 * ===========================================================================
 *
 * The owner's rule, in his words: an aarti or a song has to be in one chaal,
 * the way it is actually sung, in the voice of a singer or a kathakar — never
 * an AI voice.
 *
 * That rule cannot be met by generation, so it is met by playing real
 * recordings. This page is the listening side of it: the recordings whose
 * licence is documented, each with the person who made it and the licence it
 * is used under. There is no read-aloud button here, and there cannot be one.
 *
 * ── Why the player says "preload=none" ─────────────────────────────────────
 * The temple bhajan is nearly seven megabytes. Nothing is fetched until the
 * visitor presses play, so the page costs them nothing to open on a phone with
 * a small data pack.
 *
 * ── Why the credit is not small print ──────────────────────────────────────
 * The licences here are a mix: CC BY-SA, CC BY-ND and CC0. The first two run
 * on attribution, and a site that hides the name would be breaking them. The
 * credit line is under every player, with a link to the page it came from, so
 * anybody can check it.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getT();
  return pageMetadata({
    path: '/aarti',
    lang,
    title: t('aarti.title'),
    description: clampDescription(t('aarti.intro')),
  });
}

/** `1:03` → `PT1M3S`, the duration format schema.org expects. */
function isoDuration(length: string): string {
  const [minutes, seconds] = length.split(':').map((part) => Number(part) || 0);
  return `PT${minutes}M${seconds}S`;
}

export default async function AartiPage() {
  const { t, lang } = await getT();

  /*
   * Each recording as a `MusicRecording`.
   *
   * This is the one page where the content is genuinely audio, and marking it
   * up as audio is what lets a search engine offer it as something to listen to
   * rather than as a page of text that happens to mention a file. The licence
   * and the source URL are part of the node because they are part of the truth
   * about the recording.
   */
  const recordings = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('aarti.title'),
    itemListElement: COLLECTION.map((recording, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MusicRecording',
        name: `${t(recording.kindKey)} — ${recording.label}`,
        description: `${recording.credit}. ${recording.licence}. ${recording.sungIn}.`,
        contentUrl: `${SITE_URL}${recording.src}`,
        encodingFormat: 'audio/mpeg',
        duration: isoDuration(recording.length),
        inLanguage: recording.sungIn,
        license: recording.licenceUrl,
        isBasedOn: recording.sourceUrl,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    })),
  };

  return (
    <SiteChrome siteName={SITE_NAME}>
      <JsonLd data={recordings} />
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <h1>{t('aarti.title')}</h1>
          <p className="mt-3 text-ink-muted">{t('aarti.intro')}</p>
        </div>

        {/*
          The rule itself, said plainly. The visitor who wonders why this site
          has no "listen" button on an aarti should not have to guess.
        */}
        <div className="mt-6 flex items-start gap-3 rounded-md border border-line bg-surface p-4">
          <Icon name="speaker" size={20} className="mt-0.5 shrink-0 text-saffron-deep" />
          <p className="text-sm text-ink-soft">{t('aarti.note')}</p>
        </div>

        <ul className="mt-8 space-y-5">
          {COLLECTION.map((recording) => (
            <li key={recording.slug} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-lg text-ink">
                  {t(recording.kindKey)} — {recording.label}
                </h2>
                <span className="text-sm text-ink-subtle">
                  {recording.sungIn} · {recording.length}
                </span>
              </div>

              {/*
                A plain <audio controls>: every phone and browser on the site
                already knows how to play an MP3, and the native player brings
                its own pause, seek and volume buttons — the three things this
                audience needs and the three things a custom player usually
                forgets to keep reachable with a thumb.
              */}
              <audio
                controls
                preload="none"
                src={recording.src}
                aria-label={`${t(recording.kindKey)} — ${recording.label}`}
                className="mt-3 w-full"
              />

              <p className="mt-3 text-sm text-ink-subtle">
                {t('aarti.credit')} {recording.credit} · {t('aarti.licence')}{' '}
                <a
                  href={recording.licenceUrl}
                  rel="license noopener noreferrer"
                  target="_blank"
                  className="underline hover:text-saffron-deep"
                >
                  {recording.licence}
                </a>{' '}
                ·{' '}
                <a
                  href={recording.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline hover:text-saffron-deep"
                >
                  {recording.sourceName}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </SiteChrome>
  );
}
