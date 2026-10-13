import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/server/i18n';
import { currentUser } from '@/server/auth/session';
import { prisma } from '@/server/db';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AccountForm } from '@/components/account/account-form';
import { Icon } from '@/components/ui/icon';

/**
 * The signed-in person's own page: their handle, their saved answers, and the
 * way out.
 *
 * ── Why saved answers, and nothing else ────────────────────────────────────
 *
 * An account that only records a login has no reason to exist. What makes one
 * worth having is being able to come back to an answer — the medicines a
 * relative was taking, the number somebody was given on the phone — and read it
 * again later, out loud, when it has been forgotten.
 *
 * Every read here is guarded. A database that is down must show a sentence a
 * person can act on, not a stack trace, and that is the same rule every other
 * page on this site follows.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('account.title') };
}

export default async function AccountPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';
  const { t } = await getT();
  const user = await currentUser();

  if (!user) {
    return (
      <SiteChrome siteName={siteName}>
        <div className="wrap-narrow py-16 text-center">
          <h1 className="font-display text-3xl">{t('account.signedOut')}</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-subtle">{t('account.signedOutBody')}</p>
          <Link href="/login" className="btn-primary mt-6 inline-flex">
            {t('account.signIn')}
          </Link>
        </div>
      </SiteChrome>
    );
  }

  let notes: Array<{ id: string; question: string; answer: string; createdAt: Date }> = [];
  let unreadable = false;

  try {
    notes = await prisma.savedNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, question: true, answer: true, createdAt: true },
    });
  } catch {
    unreadable = true;
  }

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-16">
        <h1 className="font-display text-3xl sm:text-4xl">{t('account.title')}</h1>

        <div className="card mt-6 flex flex-wrap items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-saffron/15 font-display text-xl text-saffron-deep">
            {user.handle.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-subtle">{t('account.signedInAs')}</p>
            <p className="truncate font-display text-2xl">{user.handle}</p>
          </div>
          <AccountForm mode="logout" className="btn-ghost" />
        </div>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-2xl">
            <Icon name="star" size={22} />
            {t('account.saved')}
          </h2>

          {unreadable ? (
            <p className="mt-4 rounded-lg bg-sun/10 p-4">{t('account.savedUnavailable')}</p>
          ) : notes.length === 0 ? (
            <p className="mt-4 rounded-lg bg-surface p-5 text-ink-subtle">
              {t('account.savedEmpty')}
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {notes.map((note) => (
                <li key={note.id} className="card p-5">
                  <p className="font-bold">{note.question}</p>
                  <p className="mt-2 whitespace-pre-wrap text-ink-subtle">{note.answer}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </SiteChrome>
  );
}