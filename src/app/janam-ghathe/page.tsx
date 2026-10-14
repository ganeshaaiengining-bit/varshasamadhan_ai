import type { Metadata } from 'next';
import { getT } from '@/server/i18n';
import { SiteChrome } from '@/components/layout/site-chrome';
import { JanamGhathe } from '@/components/jgd/janam-ghathe';

/**
 * Janam gathe — the birth sheet.
 *
 * Numerology and Vedic astrology from a name, a date, and optionally a time and
 * a place. The calculation engines in src/content were written for this and had
 * never been connected to a page, so the work was there and the door was not.
 *
 * The page is a server component that does nothing but supply chrome and a
 * title. Everything that touches a birth detail runs in the browser, on purpose:
 * a name, a date and a birth time together identify one person, and this
 * service's argument is that it collects nothing. See the component for why.
 *
 * Nothing here is a claim about the future. The engines each carry a `limit`
 * string saying what the number does not settle, and those are rendered too.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  // nav.birthChart, not a jgd key: the metadata title has to match the label the
  // nav shows, so the browser tab and the menu cannot disagree.
  return { title: t('nav.birthChart') };
}

export default async function JanamGhathePage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';
  const { t } = await getT();

  return (
    <SiteChrome siteName={siteName}>
      <JanamGhathe />
      <p className="sr-only">{t('jgd.disclaimer')}</p>
    </SiteChrome>
  );
}