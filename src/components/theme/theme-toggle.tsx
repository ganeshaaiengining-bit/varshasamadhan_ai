'use client';

import * as React from 'react';
import { useLanguage } from '@/components/language/language';

/**
 * Light / dark toggle.
 *
 * The initial state is read in an effect rather than during render, because the
 * server cannot know what is in localStorage. Rendering the server's guess and
 * then swapping it would flash the wrong icon on every page load.
 */
export function ThemeToggle() {
  const { t } = useLanguage();
  const [dark, setDark] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem('vs-theme');
    const isDark =
      stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
    setReady(true);
  }, []);

  const apply = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('vs-theme', next ? 'dark' : 'light');
    } catch {
      // Private browsing: the theme just will not persist. Not worth an alert.
    }
  };

  return (
    <button
      type="button"
      onClick={apply}
      aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
      className="btn-ghost !min-h-[2.75rem] !w-11 !px-0"
    >
      {ready ? <Icon2 dark={dark} /> : <span className="h-6 w-6" />}
    </button>
  );
}

/** Inline so the toggle stays a single small file. */
function Icon2({ dark }: { dark: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dark ? (
        <>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
        </>
      ) : (
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      )}
    </svg>
  );
}