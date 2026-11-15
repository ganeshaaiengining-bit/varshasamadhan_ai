import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/server/seo';

/**
 * `/robots.txt`.
 *
 * Two things are kept out of the index, and they are not the same kind of thing:
 *
 *   - `/admin` is disallowed here as well as carrying `noindex`. Both are
 *     deliberate: `noindex` only works on a page that is crawled, and a crawler
 *     that never fetches the admin panel cannot accidentally index a form.
 *   - `/api/` answers POST requests and JSON. There is nothing there for a
 *     search engine, and crawling it only spends the owner's quota.
 *
 * Everything else is open, including the `/<code>/…` URLs. Those are the
 * per-language versions of every page, they are what the hreflang block points
 * at, and blocking them would leave twelve of the thirteen languages
 * unindexable. The older `?vs-lang=` form stays crawlable too: it is what the
 * language picker writes, and it canonicalises to the prefix URL rather than
 * being a second copy of the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
