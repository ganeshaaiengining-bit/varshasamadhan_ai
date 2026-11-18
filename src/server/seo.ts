import type { Metadata } from 'next';
import { LANGUAGES } from '@/content/i18n';

/**
 * ===========================================================================
 *  ONE PLACE FOR WHAT SEARCH ENGINES AND SHARED LINKS READ
 * ===========================================================================
 *
 * The site has thirteen languages and one URL per page, and until this file
 * existed neither fact reached a search engine:
 *
 *   - every page carried the same description, written in Hindi, whatever
 *     language the visitor was reading
 *   - the root layout read NEXT_PUBLIC_SITE_URL, which in production was still
 *     the local development address, so a shared link's og:url pointed at
 *     localhost
 *   - no page declared a canonical URL, so `/?vs-lang=ta` and `/` were two
 *     unrelated documents as far as a crawler was concerned
 *   - there was no sitemap, no robots file and no structured data
 *
 * ── The language URLs ───────────────────────────────────────────────────────
 *
 * The language lives in a cookie, and a crawler does not keep cookies. The
 * middleware solves that for people whose browser refuses cookies: it turns
 * `?vs-lang=xx` — or a `/<lang>/` prefix — into the request's own cookie before
 * the page is rendered, so a crawler asking for `/ta/aarti` receives Tamil HTML
 * with no JavaScript and no cookie jar. That is what makes a per-language URL
 * real rather than decorative, and it is why every canonical and every hreflang
 * below names one.
 *
 * The prefix is used rather than the query, and the reason is not taste.
 * Next.js resolves metadata URLs with its own helper, which collapses any URL
 * whose pathname is `/` down to the bare origin. `/?vs-lang=ta` therefore
 * became `https://…` in the canonical tag — the query quietly gone — while
 * `/aarti?vs-lang=ta` survived. A prefix has no such edge: `/ta` is a real
 * pathname and keeps everything after it.
 *
 * Hindi is the default and keeps the clean URL. Every other language is the
 * same route under `/<code>`. `x-default` is the clean URL, which is what a
 * visitor from a country with none of these languages should get.
 */

/**
 * The public address of the site.
 *
 * The fallback is the deployed domain rather than `localhost`, because the one
 * environment where this value is missing is production and a canonical URL
 * pointing at localhost is worse than no canonical at all. The environment
 * variable still wins, so a future domain move is one setting.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://varsha-samadhan.vercel.app'
).replace(/\/+$/, '');

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'VARSHA SAMADHAN AI';

/**
 * Open Graph wants a locale, not a language code, and the two are not the same
 * shape. Urdu is written and read in Pakistan, Arabic is offered for readers of
 * the Gulf, and the Indian languages are `_IN` even when a large diaspora lives
 * elsewhere — a mismatch here is not fatal, it only means the "also available
 * in" list in a share card is less precise.
 */
const OG_LOCALE: Record<string, string> = {
  hi: 'hi_IN',
  en: 'en_IN',
  bn: 'bn_IN',
  ta: 'ta_IN',
  te: 'te_IN',
  mr: 'mr_IN',
  gu: 'gu_IN',
  kn: 'kn_IN',
  ml: 'ml_IN',
  pa: 'pa_IN',
  ur: 'ur_PK',
  as: 'as_IN',
  or: 'or_IN',
  ne: 'ne_IN',
  sa: 'sa_IN',
  ks: 'ks_IN',
  sd: 'sd_IN',
  kok: 'kok_IN',
  mai: 'mai_IN',
  doi: 'doi_IN',
  brx: 'brx_IN',
  mni: 'mni_IN',
  sat: 'sat_IN',
  ar: 'ar_SA',
  es: 'es_ES',
};

/** The path a visitor would use for this page in this language. */
export function languagePath(path: string, code: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (code === 'hi') return clean;

  const [pathname, ...rest] = clean.split('?');
  const prefixed = pathname === '/' ? `/${code}` : `/${code}${pathname}`;
  return rest.length ? `${prefixed}?${rest.join('?')}` : prefixed;
}

/** The same path, absolute — what a canonical, a sitemap and hreflang need. */
export function absolutePath(path: string, code: string): string {
  return `${SITE_URL}${languagePath(path, code)}`;
}

/**
 * Every language this page exists in, plus `x-default`.
 *
 * Built from `LANGUAGES` rather than typed out, so adding a fourteenth language
 * to the site adds it to every hreflang block at once. A list copied into each
 * page is a list that goes stale silently, and a missing hreflang does not show
 * up as an error anywhere.
 */
export function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const language of LANGUAGES) {
    alternates[language.code] = absolutePath(path, language.code);
  }
  alternates['x-default'] = `${SITE_URL}${path}`;
  return alternates;
}

/**
 * A description that survives a search result.
 *
 * Google shows roughly a hundred and fifty characters and cuts the rest, often
 * mid-word. Cutting at the last full stop inside the limit is the difference
 * between a sentence and a sentence with its head taken off. The limit is
 * counted in characters rather than bytes because these are all multi-byte
 * scripts and a byte count would truncate Devanagari at a third of the text.
 */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const stop = Math.max(
    cut.lastIndexOf('।'),
    cut.lastIndexOf('॥'),
    cut.lastIndexOf('.'),
    cut.lastIndexOf('!'),
    cut.lastIndexOf('?'),
    cut.lastIndexOf('؟'),
    cut.lastIndexOf('۔'),
  );

  return stop > 60 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`;
}

export interface PageSeo {
  /** The route without a language parameter, e.g. `/aarti`. */
  path: string;
  /** The visitor's language code, from the cookie. */
  lang: string;
  title: string;
  description: string;
  type?: 'website' | 'article' | 'profile';
  /** Login, account and error pages: crawlable, but not shown in results. */
  noindex?: boolean;
  published?: Date;
  modified?: Date;
}

/**
 * The metadata every page returns.
 *
 * Written once because the four parts that matter — canonical, hreflang, Open
 * Graph and Twitter — have to agree, and a page that sets three of them is the
 * normal way a site ends up with a share card in the wrong language.
 *
 * `images` is deliberately not set here. The `opengraph-image` file next to the
 * root layout supplies the picture to every route that does not define its own,
 * and naming a path here would break that inheritance.
 */
export function pageMetadata(seo: PageSeo): Metadata {
  const { path, lang, title, description, type = 'website', noindex = false } = seo;
  const canonical = absolutePath(path, lang);
  const locale = OG_LOCALE[lang] ?? 'hi_IN';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale,
      alternateLocale: LANGUAGES.filter((language) => language.code !== lang).map(
        (language) => OG_LOCALE[language.code] ?? 'hi_IN',
      ),
      url: canonical,
      title,
      description,
      ...(seo.published ? { publishedTime: seo.published.toISOString() } : {}),
      ...(seo.modified ? { modifiedTime: seo.modified.toISOString() } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
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

/** A schema.org Organization node, shared by every page that needs a publisher. */
export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.svg`,
    },
    description:
      'A free help service in every Indian language, in memory of Smt. VARSHA: health, money, family, work, government offices and rituals, answered in the visitor\'s own language.',
  };
}

/**
 * The site node.
 *
 * `inLanguage` lists every language the site actually offers, taken from the
 * same table the language picker reads. It is the machine-readable version of
 * "this is a thirteen-language service", which a text description alone does not
 * convey to a search engine.
 */
export function websiteNode(lang: string) {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      'Free answers in your own words, in every Indian language, in memory of Smt. VARSHA.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: LANGUAGES.map((language) => language.code),
    mainEntityOfPage: absolutePath('/', lang),
  };
}
