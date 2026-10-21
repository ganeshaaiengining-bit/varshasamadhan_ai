import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ChangePassword } from '@/components/admin/change-password';
import { SiteChrome } from '@/components/layout/site-chrome';
import { isOwnerSession } from '@/server/owner';
import { storedRecovery } from '@/server/owner-password';

/**
 * /admin/pasvard-badal — change the password while already signed in.
 *
 * ── Why a redirect and not a login form ─────────────────────────────────────
 * `/admin` shows the sign-in form because that page *is* the door. This page is
 * only ever reached from inside the panel, so anyone arriving without a session
 * has either signed out in another tab or has a stale bookmark — and the useful
 * answer for both is the door, not a second copy of it.
 *
 * ── Why the current question is read on the server ──────────────────────────
 * So it can be shown without a round trip, and so it never travels through a
 * client bundle. It is not a secret — it is printed on the page — but a page that
 * ships less is a page with fewer places to be wrong.
 */

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'पासवर्ड बदलिए · VARSHA SAMADHAN AI',
  robots: { index: false, follow: false },
};

export default async function ChangePasswordPage() {
  if (!(await isOwnerSession())) {
    redirect('/admin');
  }

  const recovery = await storedRecovery();

  return (
    <SiteChrome siteName={siteName}>
      <ChangePassword
        question={recovery?.question ?? ''}
        hasRecovery={recovery !== null}
      />
    </SiteChrome>
  );
}
