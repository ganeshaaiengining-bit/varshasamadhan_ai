'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/icon';
import { Sunrise } from '@/components/visual/sunrise';
import { BrandTitle } from '@/components/visual/brand-title';
import { useLanguage } from '@/components/language/language';
import { VARSHA } from '@/content/tribute';

/**
 * ===========================================================================
 *  APP BAR — the left edge
 * ===========================================================================
 *
 * A persistent vertical strip on the left of every page, plus a slide-out panel.
 *
 * ── Why a left app bar at all ──────────────────────────────────────────────
 * The brief asked for it, and it earns its place for a specific reason: the
 * primary users of this service are people who are not confident with a website
 * and are often using one hand on a phone. A permanent, always-visible target
 * with one job — open the menu — is far easier to find than hunting a hamburger
 * icon in a corner that may be scrolled off.
 *
 * On a narrow screen the bar is a slim always-there edge button; on a wide one
 * it expands into a labelled rail with the same items visible. Either way the
 * menu is one tap away and never more than a thumb's reach from the edge.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 * A drawer that traps focus but does not say it traps focus is a keyboard trap.
 * So: focus moves into the panel on open, Escape closes it, focus returns to the
 * button that opened it, and the body stops scrolling while it is open.
 */

interface NavItem {
  href: string;
  labelKey: string;
  icon: IconName;
}

const NAV: NavItem[] = [
  { href: '/', labelKey: 'nav.home', icon: 'home' },
  { href: '/smriti', labelKey: 'nav.tribute', icon: 'sun' },
  { href: '/sahayata', labelKey: 'nav.help', icon: 'mic' },
  { href: '/reviews', labelKey: 'nav.reviews', icon: 'star' },
  { href: '/samaroh', labelKey: 'nav.reference', icon: 'scroll' },
  { href: '/madad', labelKey: 'nav.support', icon: 'heart' },
];

export function AppBar({ siteName }: { siteName: string }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [rail, setRail] = React.useState(true);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);

  /* -------------------------------------------------- close on navigation */
  // Following a link inside the panel must not leave it hanging over the page
  // the visitor just asked for.
  React.useEffect(() => setOpen(false), [pathname]);

  /* ------------------------------------------------------------ focus trap */
  React.useEffect(() => {
    if (!open) return;

    // Move focus into the panel, so a keyboard user's next Tab is inside it
    // rather than somewhere behind the overlay.
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      // Send focus back where it came from, or the next Tab starts at the top
      // of the document with no indication of where the visitor was.
      trigger.current?.focus();
    };
  }, [open]);

  const label = t('nav.menu');

  return (
    <>
      {/* ====================================================== the rail */}
      {/*
        `position: fixed` and full height, so it stays put while the page
        scrolls. On a small screen it is a narrow edge target; from `lg` it gains
        labels and the site content shifts right to clear it.
      */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-40 hidden shrink-0 border-e border-line bg-surface/95 backdrop-blur',
          'transition-[width] duration-300',
          'flex flex-col items-center gap-2 py-3',
          rail ? 'w-[4.5rem] lg:w-[13rem] lg:items-stretch lg:px-3' : 'w-[4.5rem] lg:w-[4.5rem]',
          // Always visible on a phone too — this is the point of the bar.
          'max-lg:flex',
        ].join(' ')}
      >
        {/* Menu button */}
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="app-panel"
          aria-label={label}
          className="btn-ghost !min-h-[3rem] !w-full !justify-center lg:!justify-start lg:!px-3"
        >
          <Icon name="menu" size={24} />
          <span className="hidden text-base lg:inline">{label}</span>
        </button>

        <span className="h-px w-8 shrink-0 bg-line" aria-hidden="true" />

        {/* Quick links, visible without opening anything on a wide screen. */}
        <nav aria-label={label} className="flex w-full flex-1 flex-col gap-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={t(item.labelKey)}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex min-h-[2.75rem] items-center justify-center gap-3 rounded-md px-2 text-sm font-semibold transition-colors lg:justify-start lg:px-3',
                  active ? 'bg-saffron-soft text-saffron-deep' : 'text-ink-muted hover:bg-card-hover',
                ].join(' ')}
              >
                <Icon name={item.icon} size={20} className="shrink-0" />
                <span className="hidden truncate lg:inline">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Rail collapse, wide screens only */}
        <button
          type="button"
          onClick={() => setRail((v) => !v)}
          aria-label={rail ? 'बाँस बंद करें' : 'बाँस खोलें'}
          aria-expanded={rail}
          className="btn-ghost hidden !min-h-[2.75rem] !w-full !px-0 lg:flex"
        >
          <Icon name={rail ? 'chevron-left' : 'chevron-right'} size={18} />
        </button>
      </div>

      {/* Push the page clear of the rail on wide screens. */}
      {rail ? <div className="hidden w-[13rem] shrink-0 lg:block" aria-hidden="true" /> : null}

      {/* ===================================================== the panel */}
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={t('nav.closeMenu')}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />

          <div
            ref={panel}
            id="app-panel"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col overflow-y-auto bg-surface shadow-lift"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-line p-4">
              <Sunrise size={40} />
              <BrandTitle size="sm">{siteName}</BrandTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('nav.closeMenu')}
                className="btn-ghost ms-auto !min-h-[2.75rem] !w-11 !px-0"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            {/* navigation */}
            <nav aria-label={label} className="flex-1 p-3">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={[
                          'flex min-h-[3.25rem] items-center gap-3 rounded-md px-4 text-lg font-semibold transition-colors',
                          active ? 'bg-saffron-soft text-saffron-deep' : 'hover:bg-card-hover',
                        ].join(' ')}
                      >
                        <Icon name={item.icon} size={22} className="shrink-0" />
                        {t(item.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* the tribute, given room rather than a single line */}
              <Link
                href="/smriti"
                className="mt-4 block rounded-[var(--radius)] border-2 border-saffron bg-saffron-soft/40 p-4 transition-colors hover:bg-saffron-soft"
              >
                <p className="flex items-center gap-2 font-bold text-saffron-deep">
                  <Sunrise size={28} />
                  {VARSHA.honorific} {VARSHA.name} जी
                </p>
                <p className="mt-1.5 text-sm text-ink-muted">{t('footer.readStory')}</p>
              </Link>
            </nav>

            <p className="border-t border-line p-4 text-sm text-ink-subtle">{t('footer.free')}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}