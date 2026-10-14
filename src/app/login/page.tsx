import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/server/i18n';
import { currentUser } from '@/server/auth/session';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AccountForm } from '@/components/account/account-form';
import { Icon } from '@/components/ui/icon';

/**
 * Sign in, or make an account.
 *
 * ── Why this is in the header and not the footer ───────────────────────────
 *
 * The owner asked for it there. That is the whole reason, and it is a good
 * one: every account control this site has lives in the header beside the
 * language picker, so both per-visitor settings are in the same place on every
 * page and a person who has found one has found the other.
 *
 * ── Why signing in is optional and stays optional ──────────────────────────
 *
 * There is no gate on the question box. The audience is elderly, often cannot
 * read or write easily, and are frequently on a borrowed phone, and putting a
 * password in front of the one thing they came for is the most reliable way to
 * lose them. An account carries the language they chose and the answers they
 * kept. Everything else works without one, permanently.
 *
 * ── What happens if the database is not there ──────────────────────────────
 *
 * The form is still rendered and still explains itself, rather than the page
 * collapsing into an error. A visitor who tries to sign in during an outage is
 * told so in one sentence they can act on.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('account.title') };
}

export default async function LoginPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';
  const { t } = await getT();
  const user = await currentUser();

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-16">
        <h1 className="font-display text-3xl sm:text-4xl">{t('account.title')}</h1>
        <p className="mt-3 text-ink-subtle">{t('account.intro')}</p>

        {/*
          Already signed in.

          Shown rather than redirecting, because a shared phone is the normal
          case here rather than the edge case. Somebody who opens this page
          expecting to sign in and finds somebody else's name and history on it
          needs to know, and needs the way out to be obvious.
        */}
        {user && (
          <div className="card mt-8 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-saffron/15 font-display text-xl text-saffron-deep">
                {user.handle.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-ink-subtle">{t('account.signedInAs')}</p>
                <p className="truncate font-display text-2xl">{user.handle}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/account" className="btn-primary">
                {t('account.open')}
              </Link>
              <AccountForm mode="logout" className="btn-ghost" />
            </div>
          </div>
        )}

        {!user && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <AccountForm mode="signin" />
            <AccountForm mode="register" />
          </div>
        )}

        {/*
          Why an account exists at all, said plainly.

          Without this, an account reads as a condition of being allowed to use
          the service, which is the impression most sites give and the one that
          stops people asking the question they came to ask.
        */}
        <section className="mt-10 rounded-lg bg-sun/10 p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <Icon name="shield" size={18} />
            {t('account.privacyTitle')}
          </h2>
          <p className="mt-2 text-ink-subtle">{t('account.privacyBody')}</p>
        </section>
      </div>
    </SiteChrome>
  );
}