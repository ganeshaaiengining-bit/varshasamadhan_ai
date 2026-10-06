import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/server/i18n';
import { Icon } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('support.howTitle') };
}

/**
 * A static "how you can help" page.
 *
 * No donation form and no payment gateway on purpose. Both cost money to run
 * (or cost trust, if a stranger's payment page sits on a service for people who
 * cannot afford anything), and the owner has not asked for one. When that
 * changes, this is where it goes.
 */
export default async function MadadPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';
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