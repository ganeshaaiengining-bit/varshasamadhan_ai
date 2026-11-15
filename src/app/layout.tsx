import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { getT } from '@/server/i18n';
import { LanguageProvider } from '@/components/language/language';
import { AppBar } from '@/components/layout/app-bar';
import { WelcomeDhun } from '@/components/audio/welcome-dhun';
import { JsonLd } from '@/components/seo/json-ld';
import {
  SITE_NAME,
  SITE_URL,
  absolutePath,
  clampDescription,
  languageAlternates,
  organizationNode,
  websiteNode,
} from '@/server/seo';


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
  return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'VARSHA SAMADHAN AI';
}

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getT();

  /*
   * The description is built from strings the site already carries in all
   * thirteen languages, not written here in Hindi. Before this, a Tamil visitor
   * shared a link and the preview card under it was in Hindi — the same fault
   * the page titles had, in the one place a visitor cannot fix by changing the
   * language afterwards.
   */
  const description = clampDescription(`${t('home.metaTitle')} — ${t('home.step3Body')}`);
  const title = `${SITE_NAME} — ${t('home.metaTitle')}`;
  const canonical = absolutePath('/', lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s · ${SITE_NAME}`,
    },
    description,

    /*
     * The site has thirteen languages on one set of paths. The canonical and
     * the hreflang block are what tell a search engine that `/ta/aarti` is the
     * Tamil version of the same page rather than a separate document, and that
     * Hindi is the one at the clean URL.
     */
    alternates: {
      canonical,
      languages: languageAlternates('/'),
    },

    /**
     * Without these, a link shared on WhatsApp — the single most likely way this
     * site will spread — renders as a bare URL with no title and no picture.
     */
    openGraph: {
      type: 'website',
      locale: 'hi_IN',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },

    /*
     * Phone numbers on this site are helplines and government numbers. Safari's
     * automatic number detection turns them into call links, which on a tablet
     * with no SIM is a dead end; the visitor should copy the number and decide.
     */
    formatDetection: { telephone: false },

    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: 'default',
    },

    manifest: '/manifest.webmanifest',

    // Search engines should index the help content but not the owner panel.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
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
          The site's machine-readable identity: who publishes it, where it is,
          and which languages it is actually written in. One graph on every
          page — the article and category pages add their own nodes below it.
        */}
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [organizationNode(), websiteNode(lang)],
          }}
        />
        {/*
          Keyboard users land here first. The prototype had a skip link with no
          target, so it went nowhere.
        */}
        <a href="#main" className="sr-only focus:not-sr-only">
          <span className="fixed start-4 top-4 z-50 rounded-md bg-saffron px-5 py-3 font-bold text-white">
            {t('nav.skip')}
          </span>
        </a>
        <LanguageProvider initialLanguage={lang}>
          <ToastProvider>
            {/*
              The rail is `fixed`, so it takes no space and the page would run
              underneath it. The AppBar renders a spacer beside it, and this flex
              row is what makes that spacer reserve anything at all — the row is
              what gives the spacer something to be a sibling of.
            */}
            <div className="flex min-h-screen">
              <AppBar siteName={siteName()} />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
            <WelcomeDhun />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}