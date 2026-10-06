'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Sunrise } from '@/components/visual/sunrise';
import { LanguageSelect, useLanguage } from '@/components/language/language';
import { VARSHA } from '@/content/tribute';

/**
 * Site header and footer.
 *
 * A client component because the mobile drawer and the theme toggle both need
 * state. Everything else on the page stays a server component.
 */
export function SiteChrome({
  siteName,
  children,
}: {
  siteName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const { t } = useLanguage();

  // A drawer left open behind a page navigation traps a screen-reader user.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  /*
   * The header no longer carries its own navigation, and the mobile drawer is
   * gone with it. The left app bar is the only navigation on the site.
   *
   * Two reasons, and the second is the important one:
   *
   * 1. **It overflowed.** At exactly 768px — a tablet width, and the first width
   *    where Tailwind's `md:` applies — the inline nav appeared *and* the new
   *    language pill was in the header, and the row came to 844px in a 768px
   *    viewport. Every page overflowed by 76px.
   *
   * 2. **It was a duplicate.** The app bar already lists all six destinations,
   *    both as quick links in the rail and as a full panel. A second copy in the
   *    header meant two places to look for the same thing, two different
   *    behaviours to learn, and a drawer that duplicated the panel — which is
   *    most of what made the page read as boxes stacked on boxes. One navigation
   *    is easier to use and easier to read.
   *
   * What stays in the header is the two controls that have no equivalent
   * anywhere else: the site name, and the language picker.
   */
  const links = [
    { href: '/', labelKey: 'nav.home', icon: 'home' },
    { href: '/smriti', labelKey: 'nav.tribute', icon: 'sun' },
    { href: '/sahayata', labelKey: 'nav.help', icon: 'search' },
    { href: '/samaroh', labelKey: 'nav.reference', icon: 'scroll' },
    { href: '/reviews', labelKey: 'nav.reviews', icon: 'star' },
    { href: '/madad', labelKey: 'nav.support', icon: 'heart' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="wrap flex min-h-[4.5rem] items-center gap-3 py-2">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${siteName} — ${t('nav.home')}`}>
            {/* The rising sun plays on load, then rests as a plain mark. */}
            <Sunrise size={44} />
            <span className="hidden text-lg font-extrabold leading-tight sm:block">
              {siteName}
            </span>
          </Link>

          <div className="ms-auto flex items-center gap-1.5">
            {/*
              The language picker lives here, in the header, and not in the middle
              of the hero.

              It was first placed between the hero's subtitle and the question
              box. That put a fourth bordered surface into a column that already
              had the sun, the title, the subtitle and the ask box stacked in it,
              and the page read as boxes inside boxes — the complaint that prompted
              this move. A control in the header also turns out to be better for
              the person using it: it is in the same place on every page, so once
              found it is never hunted for again, and it does not compete with the
              headline for attention.
            */}
            <LanguageSelect />

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="min-h-[60vh]">
        {children}
      </main>

      <footer className="mt-16 border-t border-line bg-surface py-10">
        <div className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Sunrise size={40} />

              <span className="text-lg font-extrabold">{siteName}</span>
            </div>

            <p className="mt-4 max-w-prose text-ink-muted">
              {VARSHA.shortLine}
            </p>
            <Link
              href="/smriti"
              className="mt-3 inline-flex items-center gap-1.5 font-bold text-saffron-deep hover:underline"
            >
              {t('footer.readStory')}
              <Icon name="arrow" size={16} />
            </Link>

            <p className="mt-4 text-sm text-ink-subtle">{t('footer.free')}</p>
          </div>

          <nav aria-label={t('footer.pages')}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-subtle">
              {t('footer.pages')}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-muted hover:text-saffron-deep">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-ink-muted hover:text-saffron-deep">
                  {t('footer.admin')}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-subtle">
              {t('footer.helplines')}
            </h2>
            <ul className="mt-3 space-y-2 text-ink-muted">
              <li className="flex items-center gap-2">
                <Icon name="phone" size={16} />
                <a href="tel:112" className="hover:text-saffron-deep">
                  112 — {t('footer.emergency')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="phone" size={16} />
                <a href="tel:108" className="hover:text-saffron-deep">
                  108 — {t('footer.ambulance')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="phone" size={16} />
                <a href="tel:181" className="hover:text-saffron-deep">
                  181 — {t('footer.women')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="wrap mt-10 border-t border-line pt-6 text-sm text-ink-subtle">
          © {new Date().getFullYear()} {siteName} · {t('footer.rights')}
        </div>
      </footer>
    </>
  );
}