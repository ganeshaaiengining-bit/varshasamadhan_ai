import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/server/i18n';
import { SiteChrome } from '@/components/layout/site-chrome';
import { Icon } from '@/components/ui/icon';
import { ENTRIES, GROUPS, isOpen } from '@/content/free-library';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('lib.title') };
}

/**
 * The free library.
 *
 * ── Why this page exists, in the owner's words ──────────────────────────────
 * "Any PDF a visitor wants — school books, books, even pictures — free, and with
 * no copyright problem, and easy to find."
 *
 * The last two clauses decide the whole thing. Material cannot simply be hosted
 * here: a book under copyright cannot be copied onto this site and handed out,
 * however small the site is. What can be done is to point at the places where
 * the same material is already published for exactly this purpose, by people who
 * hold the rights, at no cost to the reader.
 *
 * That is not a lesser offer. It is the ordinary one. A government textbook
 * portal, a public-domain library, a Creative Commons image archive — these are
 * how free books reach the public. Mirroring them would put the site in breach of
 * copyright and would achieve nothing that a link does not.
 *
 * ── What is not here, and why ───────────────────────────────────────────────
 *
 * No pirated textbooks. No "download any book" search that quietly returns
 * copyright-infringing files. No upload of somebody else's work.
 *
 * The page says so in one line, near the top rather than buried, because the
 * honest answer to "can I get any book here?" is "not any book — but these
 * dozens, legally and free, are one tap away", and a visitor deserves to hear
 * that before they spend ten minutes searching for something that is not there.
 */
export default async function LibraryPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';
  const { t } = await getT();

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <h1>{t('lib.title')}</h1>
          <p className="mt-3 text-ink-muted">{t('lib.intro')}</p>
        </div>

        {/*
          The honesty line, above the list.

          Stated plainly because the alternative is a visitor hunting through
          seventeen links for the novel they wanted and concluding the site is
          broken. It is also the point of the page: everything here is free to
          keep and free to pass on, which is not true of the book they were
          looking for.
        */}
        <div className="mt-6 rounded-md border border-leaf/40 bg-leaf-soft p-4 text-sm">
          <p className="flex items-start gap-2">
            <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-leaf" />
            <span>
              <strong>{t('lib.legalTitle')}</strong> {t('lib.legal')}
            </span>
          </p>
        </div>

        {/* Two badges, explained once, used throughout. */}
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
          <span className="flex items-center gap-2 rounded-full border-2 border-leaf bg-leaf-soft px-4 py-1.5">
            <strong className="text-leaf">{t('lib.openBadge')}</strong>
            <span className="text-ink-muted">{t('lib.openBadgeNote')}</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border-2 border-saffron bg-saffron-soft px-4 py-1.5">
            <strong className="text-saffron-deep">{t('lib.freeBadge')}</strong>
            <span className="text-ink-muted">{t('lib.freeBadgeNote')}</span>
          </span>
        </div>

        {GROUPS.map((group) => {
          const entries = ENTRIES.filter((entry) => entry.group === group.id);
          if (entries.length === 0) return null;

          return (
            <section key={group.id} className="mt-10">
              <h2 className="text-center">{t(group.labelKey)}</h2>
              <p className="mt-2 text-center text-sm text-ink-muted">{t(group.noteKey)}</p>

              <ul className="mt-5 space-y-4">
                {entries.map((entry) => (
                  <li key={entry.url} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg">{entry.title}</h3>
                        <p className="mt-1 text-ink-muted">{entry.what}</p>
                      </div>

                      {/* Government and no-signup are worth seeing without reading. */}
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span
                          className={[
                            'rounded-full px-3 py-1 text-xs font-bold',
                            isOpen(entry.licence)
                              ? 'bg-leaf-soft text-leaf'
                              : 'bg-saffron-soft text-saffron-deep',
                          ].join(' ')}
                        >
                          {isOpen(entry.licence) ? t('lib.openBadge') : t('lib.freeBadge')}
                        </span>

                        {entry.government ? (
                          <span className="rounded-full bg-indigo-soft px-3 py-1 text-xs font-semibold text-indigo">
                            {t('lib.govt')}
                          </span>
                        ) : null}

                        {entry.noSignup ? (
                          <span className="rounded-full bg-surface px-3 py-1 text-xs text-ink-muted">
                            {t('lib.noSignup')}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {entry.languages ? (
                      <p className="mt-2 text-sm text-ink-subtle">
                        <Icon name="om" size={14} /> {entry.languages}
                      </p>
                    ) : null}

                    {/*
                      The licence, in full, always.

                      The value of this page is that a visitor can pass the link on
                      without owing anybody anything. That claim has to be visible
                      on the page, not one click away — otherwise they cannot rely
                      on it and end up not sharing, which defeats the point.
                    */}
                    <p className="mt-3 rounded-md bg-surface p-3 text-sm">
                      {/*
                        The licence sentence is translated, not a literal.

                        It was a hardcoded Roman-Hindi string in free-library.ts,
                        so a Bengali or Tamil visitor saw their own language in
                        the title above and "Padhna free hai. Copy karke aage
                        dena..." directly underneath — on every card. This is
                        the text the page exists to replace, so it had to be in
                        the reader's language before anything else on the page
                        did.
                      */}
                      <strong>{entry.licence.name}</strong> — {t(entry.licence.shareKey)}
                    </p>

                    {/*
                      target and rel are not decoration. Without rel="noreferrer"
                      the destination can read where the visitor came from, and
                      without target the site they were given free books on is
                      replaced by the one they were sent to.
                    */}
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline mt-4 !min-h-[2.75rem] !px-5"
                    >
                      {t('lib.open')}
                      <Icon name="arrow" size={16} />
                    </a>
                  </li>
                ))}
              </ul>

            </section>
          );
        })}

        <div className="mt-12 rounded-md border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg">
            <Icon name="alert" size={20} className="text-saffron-deep" />
            {t('lib.warnTitle')}
          </h2>
          <p className="mt-2 text-ink-muted">{t('lib.warn')}</p>
          <p className="mt-3">
            <Link href="/sahayata" className="btn-outline !min-h-[2.75rem] !px-5">
              {t('lib.askInstead')}
              <Icon name="arrow" size={16} />
            </Link>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}