import type { Metadata } from 'next';
import { getT } from '@/server/i18n';
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
 * recordings. This page is the listening side of it: the four recordings whose
 * licence is documented, each with the person who made it and the licence it
 * is used under. There is no read-aloud button here, and there cannot be one.
 *
 * ── Why the player says "preload=none" ─────────────────────────────────────
 * The temple bhajan is nearly seven megabytes. Nothing is fetched until the
 * visitor presses play, so the page costs them nothing to open on a phone with
 * a small data pack.
 *
 * ── Why the credit is not small print ──────────────────────────────────────
 * Three of these are CC BY-SA: the licence runs on attribution, and a site
 * that hides the name would be breaking it. The credit line is under every
 * player, with a link to the page it came from, so anybody can check it.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('aarti.title') };
}

export default async function AartiPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';
  const { t } = await getT();

  return (
    <SiteChrome siteName={siteName}>
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
                  Wikimedia Commons
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </SiteChrome>
  );
}
