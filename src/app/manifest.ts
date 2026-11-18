import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/server/seo';

/**
 * `/manifest.webmanifest`.
 *
 * The site is a browser service and stays one — there is no app to install, and
 * the help page says so. This file exists for two smaller reasons:
 *
 *   - A visitor who adds the site to their home screen gets the name and the
 *     saffron theme colour rather than a screenshot and a URL fragment. For an
 *     audience that opens the same three sites every day, that is the difference
 *     between a bookmark and a habit.
 *   - A manifest with a name, a language and icons is one of the signals a
 *     search engine uses to treat a site as a real, maintained destination
 *     rather than a page.
 *
 * `lang` is Hindi because that is the default the clean URL renders; the other
 * twelve languages are reached through `?vs-lang=`, and a manifest is per-site
 * rather than per-language.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — मुफ़्त समाधान`,
    short_name: 'VARSHA',
    description:
      'Free answers in your own words, in every Indian language, in memory of Smt. VARSHA.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFF8ED',
    theme_color: '#EA7400',
    lang: 'hi',
    dir: 'ltr',
    categories: ['health', 'education', 'reference'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
