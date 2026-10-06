import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { getT } from '@/server/i18n';
import { LanguageProvider } from '@/components/language/language';
import { AppBar } from '@/components/layout/app-bar';
import { WelcomeDhun } from '@/components/audio/welcome-dhun';


/**
 * Root layout.
 *
 * `lang` and `dir` come from the cookie the language picker writes, not from a
 * literal. Both matter and neither is cosmetic:
 *
 *   - A screen reader picks its pronunciation from `lang`. Hardcoded `hi` meant
 *     a Tamil visitor was read Hindi text with a Hindi voice.
 *   - `dir` has to be `rtl` for Urdu and Arabic. Hardcoded `ltr` put every label
 *     on the wrong side of its own control for those two languages.
 *
 * This reads the cookie during the server render, so the very first HTML is
 * already correct — a page that visibly swaps language after hydration is worse
 * for this audience than one that is briefly slower.
 */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The prototype had no viewport-fit handling, so on a notched phone the
  // header sat under the notch.
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EA7400' },
    { media: '(prefers-color-scheme: dark)', color: '#14141A' },
  ],
};

/**
 * The site name comes from the environment, so it is a constant rather than a
 * query — no database round trip on every page render for a value that cannot
 * change without a deploy. If the owner later wants it editable from the admin
 * panel, that is the moment to move it into the database.
 */
function siteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'वर्षा समाधान AI';
}

export async function generateMetadata(): Promise<Metadata> {
  const name = await siteName();
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const description =
    'श्रीमती वर्षा जी की स्मृति में — निःशुल्क समाधान सेवा। बोलकर या लिखकर अपनी समस्या पूछें।';

  return {
    title: {
      default: name,
      template: `%s · ${name}`,
    },
    description,

    /**
     * Without these, a link shared on WhatsApp — the single most likely way this
     * site will spread — renders as a bare URL with no title and no picture.
     */
    openGraph: {
      type: 'website',
      locale: 'hi_IN',
      siteName: name,
      title: name,
      description,
      url: base,
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
    },

    // Search engines should index the help content but not the owner panel.
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, dir, t } = await getT();

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        {/*
          Applied before first paint so a visitor who chose dark mode never sees
          a white flash. Content is generated from a constant, not user input.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('vs-theme');var d=m==='dark'||(m!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.style.colorScheme=d?'dark':'light';document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        {/*
          Keyboard users land here first. The prototype had a skip link with no
          target, so it went nowhere.
        */}
        <a href="#main" className="sr-only focus:not-sr-only">
          <span className="fixed left-4 top-4 z-50 rounded-md bg-saffron px-5 py-3 font-bold text-white">
            {t('nav.skip')}
          </span>
        </a>
        <LanguageProvider initialLanguage={lang}>
          <ToastProvider>
            <AppBar siteName={siteName()} />
            {children}
            <WelcomeDhun />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}