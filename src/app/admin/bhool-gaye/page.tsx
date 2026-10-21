import type { Metadata } from 'next';

import { ForgotPassword } from '@/components/admin/forgot-password';
import { SiteChrome } from '@/components/layout/site-chrome';
import { storedRecovery } from '@/server/owner-password';

/**
 * /admin/bhool-gaye — the locked-out owner's page.
 *
 * ── Why the question is read on the server ──────────────────────────────────
 * Because it is the only thing here that has to be shown *before* anything is
 * submitted, and anything fetched after the first round trip would leave the
 * owner staring at an empty box on the exact screen where they are already
 * frustrated. It also keeps the question out of any client bundle that could be
 * cached and diffed — not that the question is secret, but a page that ships
 * fewer moving parts has fewer to get wrong.
 *
 * ── Why "no recovery set" is a real page, not an error ──────────────────────
 * Because it is a real state: a deployment where the password came from an
 * environment variable has no question in the database, and the owner deserves
 * to be told that plainly instead of being allowed to guess answers at nothing.
 */

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'पासवर्ड भूल गए · VARSHA SAMADHAN AI',
  // Recovery is nobody's business but the owner's, and a page describing how to
  // enter the admin panel has no business in a search result.
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const recovery = await storedRecovery();

  if (!recovery) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="mx-auto max-w-lg px-4 py-10">
          <h1 className="text-2xl font-bold">पासवर्ड भूल गए?</h1>
          <p className="mt-3 text-ink-subtle">
            इस साइट पर अभी कोई रिकवरी सवाल सेट नहीं है, इसलिए यहाँ से पासवर्ड नहीं बदल सकते।
            रिकवरी सवाल तब बनता है जब पासवर्ड पहली बार सेट किया जाता है।
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
      <ForgotPassword question={recovery.question} />
    </SiteChrome>
  );
}
