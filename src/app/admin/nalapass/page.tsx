import type { Metadata } from 'next';

import { SetupPassword } from '@/components/admin/setup-password';
import { SiteChrome } from '@/components/layout/site-chrome';
import { hasStoredPassword } from '@/server/owner-password';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';

/**
 * /admin/nalapass — set the owner's password, once.
 *
 * ── Why the token comes out of the address bar ───────────────────────────────
 * Because a query string ends up in the browser's history, in the referrer sent
 * to whatever the page links to, and in the server's access log.
 *
 * That normally argues for moving it out of sight first, and the first version of
 * this page tried: a route that reads the token from a header, hands it to the
 * page and redirects to a clean address. **That does not work.** A redirect cannot
 * attach a header to the request that follows it, so the clean page receives
 * nothing at all. It is written down here because the reasoning was plausible and
 * the mechanism was not, and because the version that ships is the boring one.
 *
 * ── Why the token being visible does not matter here ────────────────────────
 * Because it is single-use in the strongest sense available: once a password
 * exists in the table, the route that writes it refuses outright — not delayed,
 * not rate limited, simply no. The dangerous window is only the moment before the
 * first password, and once that is over this token authorises nothing forever.
 *
 * The token is still verified on the server, in constant time, before anything is
 * written. Hiding it from the address bar would be hygiene. It is not the
 * protection, and nothing here pretends otherwise.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'पासवर्ड बनाइए · VARSHA SAMADHAN AI',
  robots: { index: false, follow: false },
};

export default async function SetupPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;
  const token = typeof k === 'string' ? k : '';
  const alreadySet = await hasStoredPassword();

  if (!token || alreadySet) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="mx-auto max-w-lg px-4 py-10">
          <h1 className="text-2xl font-bold">यह लिंक अब काम नहीं करेगा</h1>
          <p className="mt-3 text-ink-subtle">
            {alreadySet
              ? 'पासवर्ड पहले ही बन चुका है। यह लिंक उसके बाद बेकार है — यही इसकी ताक़त है।'
              : 'लिंक अधूरा है। पूरा लिंक खोलिए।'}
          </p>
          <a href="/admin" className="btn-primary mt-6 inline-flex text-lg">
            प्रबंधक के पन्ने पर जाइए
          </a>
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome siteName={siteName}>
      <SetupPassword token={token} />
    </SiteChrome>
  );
}