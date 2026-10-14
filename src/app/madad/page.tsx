import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/server/i18n';
import { Icon } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';
import { ContactForm, SupportFaq } from '@/components/contact/contact-section';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('support.howTitle') };
}

/**
 * A "how you can help" page, with somewhere to actually help.
 *
 * ── What changed, and why ─────────────────────────────────────────────────
 * The four cards have always asked the visitor to write their experience, to
 * tell us about their city, to tell someone else, and to come and look. All
 * four ask for something the page gave no way to do. The strings were already
 * written in all twelve languages — support.contactTitle, support.contactBody,
 * support.faqTitle, support.faqBody — and were never called, because there was
 * no form and no FAQ to call them from.
 *
 * So the page asked for reports it could not receive. That is the kind of gap a
 * translation audit hides: the strings existed, check-translations.py was
 * satisfied, and nobody looked at what the page actually did with them.
 *
 * No donation form and no payment gateway, still. Both cost money to run, or
 * cost trust if a stranger's payment page sits on a service for people who
 * cannot afford anything, and the owner has not asked for one.
 */
export default async function MadadPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';
  const { t } = await getT();

  const ways = [
    { icon: 'book' as const, title: t('support.way1Title'), body: t('support.way1Body') },
    { icon: 'elder' as const, title: t('support.way2Title'), body: t('support.way2Body') },
    { icon: 'mic' as const, title: t('support.way3Title'), body: t('support.way3Body') },
    { icon: 'share' as const, title: t('support.way4Title'), body: t('support.way4Body') },
  ];

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-soft text-rose">
            <Icon name="heart" size={32} />
          </span>
          <h1 className="mt-4">{t('support.howTitle')}</h1>
          <p className="mt-3 text-ink-muted">{t('support.intro')}</p>
        </div>

        <h2 className="mt-10 text-center">{t('support.waysTitle')}</h2>
        <ul className="mt-5 space-y-4">
          {ways.map((item) => (
            <li key={item.title} className="card flex gap-4 p-5 sm:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron-soft text-saffron-deep">
                <Icon name={item.icon} size={24} />
              </span>
              <div className="min-w-0">
                <h3>{item.title}</h3>
                <p className="mt-1.5 text-ink-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="card mt-10 border-saffron bg-saffron-soft/40 p-6 text-center">
          <h2 className="flex items-center justify-center gap-2 text-saffron-deep">
            <Icon name="shield" size={22} />
            {t('support.alwaysFreeTitle')}
          </h2>
          <p className="mx-auto mt-2 max-w-xl">{t('support.alwaysFreeBody')}</p>
        </div>

        {/* ---------------------------------------------------------- contact
            Placed after the four ways and before the ask button, so the page
            reads in the order it asks: here is how you can help, here is where
            you can tell us, and here is where to get an answer. */}
        <ContactForm />

        <SupportFaq />

        <div className="mt-10 text-center">
          <Link href="/sahayata" className="btn-primary">
            <Icon name="mic" size={20} />
            {t('article.askAny')}
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}