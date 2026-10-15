import Link from 'next/link';
import { prisma } from '@/server/db';
import { safeRead, DatabaseUnavailable } from '@/server/db-guard';
import { Icon, type IconName } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AskBoxGate } from '@/components/ask/ask-box-gate';
import { HealthBox } from '@/components/health/health-box';

import { Sunrise, SunriseBanner } from '@/components/visual/sunrise';
import { BrandTitle } from '@/components/visual/brand-title';
import { SoundPad } from '@/components/audio/welcome-dhun';
import { getT } from '@/server/i18n';
import { currentUser } from '@/server/auth/session';
import { VARSHA } from '@/content/tribute';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'मुफ़्त समाधान, आपके अपने शब्दों में' };

/** Accent → Tailwind classes. Written out, never assembled at runtime. */
const ACCENT: Record<string, { bg: string; text: string; border: string }> = {
  saffron: { bg: 'bg-saffron-soft', text: 'text-saffron-deep', border: 'border-saffron' },
  teal: { bg: 'bg-teal-soft', text: 'text-teal', border: 'border-teal/40' },
  indigo: { bg: 'bg-indigo-soft', text: 'text-indigo', border: 'border-indigo/40' },
  rose: { bg: 'bg-rose-soft', text: 'text-rose', border: 'border-rose/40' },
  amber: { bg: 'bg-amber-soft', text: 'text-amber', border: 'border-amber/40' },
  leaf: { bg: 'bg-leaf-soft', text: 'text-leaf', border: 'border-leaf/40' },
};

/**
 * The category row as it comes back from the database, counts included.
 *
 * The empty array is the fallback when the database is unreachable, so the type
 * only has to describe the real shape — but it must include `_count`, because
 * the grid below reads it to show "12 lekh" under each category. Leaving it off
 * made that a type error, which is how a missing field gets noticed at build time
 * rather than as an `undefined` on the page.
 */
type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  _count: { articles: number };
};

export default async function HomePage() {
  // The visitor's language, read from the cookie the picker writes. Without this
  // the whole page renders in Hindi no matter what the interface says.
  const { t, tf, lang } = await getT();

  /*
   * Both reads go through `safeRead`.
   *
   * The home page is the one page that must not fail: it is the link people
   * share and the first thing an arriving stranger sees. An unguarded
   * `findMany` here means an unconfigured database turns the site's front door
   * into a stack trace — and the exception text carries the connection string,
   * which carries the database password.
   */
  const categories = await safeRead<CategoryRow[]>(
    'home:categories',
    () =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          icon: true,
          accent: true,
          _count: { select: { articles: { where: { isPublished: true } } } },
        },
      }) as unknown as Promise<CategoryRow[]>,
    [] as CategoryRow[],
  );

  const emergency = await safeRead(
    'home:emergency',
    () =>
      prisma.article.findMany({
        where: { isEmergency: true, isPublished: true },
        orderBy: { sortOrder: 'asc' },
        select: { slug: true, title: true, helpline: true, category: { select: { slug: true } } },
        take: 3,
      }),
    [],
  );

  /*
   * Whether somebody is already signed in.
   *
   * Only so the health box can decide whether to show the tap-to-ask button or
   * the sign-in wall. The AI route checks it again regardless, so this is not
   * a security decision — it is so that a visitor who has already signed in is
   * not asked to sign in twice on the same page.
   */
  const user = await currentUser();

  /*
   * The question box does not come from the database. The AI endpoint, the
   * language, the prompt — none of it touches Prisma. So an empty category list
   * must not cost the visitor the only thing they came for.
   *
   * This branch used to return the outage notice on its own, which meant that a
   * deployment with no database yet showed a polite page explaining that the
   * service was unavailable, on a service whose entire purpose is answering a
   * question. It was deployed that way on the first attempt and the live site
   * showed only this message and no way to ask anything.
   *
   * So the hero and the question box now render either way. Only the subject
   * grid below them is conditional, because there is nothing honest to put in
   * an empty grid.
   */
  const noCategories = categories.length === 0;

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';

  return (
    <SiteChrome siteName={siteName}>
      {/* ===================================================== hero */}
      <section className="relative isolate overflow-hidden border-b border-line py-12 sm:py-16 lg:py-24">
        {/*
          The rendered sunrise, behind everything. It is decorative, so it is
          aria-hidden and sits under the content rather than behind it — a
          screen reader gains nothing from it.
        */}
        <SunriseBanner src="/art/sunrise-wide.png" />

        <div className="wrap relative text-center">
          <Sunrise size={112} />

          <h1 className="animate-rise mt-6 sm:mt-8" style={{ animationDelay: '80ms' }}>
            <BrandTitle>{siteName}</BrandTitle>
          </h1>

          <p
            className="animate-rise mx-auto mt-4 max-w-2xl text-lg text-ink-soft sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {VARSHA.honorific} {VARSHA.name} जी की स्मृति में{t('home.dedication1')}{' '}
            {t('home.dedication2')}
          </p>

          {/*
            The tribute link sits under the subtitle as plain text, not in a box.

            There is no second control surface in the hero now. The sun, the
            title, one paragraph, and the question box are the whole hero — four
            things, each with a clear job. An earlier version also put the
            language picker here, between the paragraph and the question box, and
            the result was a stack of bordered panels down the middle of the
            screen that read as boxes inside boxes. The picker moved to the header,
            which is both less cluttered and a better place for it.
          */}
          <p
            className="animate-rise mt-5 text-ink-muted"
            style={{ animationDelay: '200ms' }}
          >
            <Link href="/smriti" className="font-bold text-saffron-deep hover:underline">
              {t('footer.readStory')}
            </Link>
          </p>

          <div className="animate-rise mx-auto mt-9 max-w-2xl text-left" style={{ animationDelay: '240ms' }}>
            <AskBoxGate
              suggested={[
                { label: 'बिजली चली गई तो क्या करें?', question: 'घर में अचानक बिजली चली गई है, अंधेरा हो गया है। क्या करना चाहिए?' },
                { label: 'बच्चे की पढ़ाई में कमज़ोरी', question: 'मेरे बच्चे की पढ़ाई में बहुत कमज़ोरी है। घर पर उसकी पढ़ाई कैसे बेहतर करें?' },
                { label: 'माँ की देखभाल', question: 'मेरी माँ की बहुत उम्र हो गई है। उनकी देखभाल कैसे करूँ?' },
                { label: 'आग लग जाए तो', question: 'अगर घर में आग लग जाए तो सबसे पहले क्या करना चाहिए?' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================================================ emergency bar */}
      {emergency.length > 0 ? (
        <section aria-labelledby="emergency-heading" className="border-b border-rose/30 bg-rose-soft py-8">
          <div className="wrap">
            <h2 id="emergency-heading" className="flex items-center gap-2 text-rose">
              <Icon name="alert" size={24} />
              {t('home.emergencyTitle')}
            </h2>
            <p className="mt-1 text-ink-muted">{t('home.emergencyNote')}</p>

            <ul className="mt-5 grid gap-3 md:grid-cols-3">
              {emergency.map((item) => (
                <li key={item.slug} className="card border-rose/40 p-5">
                  <h3 className="text-lg">{item.title}</h3>
                  {item.helpline ? (
                    <p className="mt-2 font-bold text-rose">{item.helpline}</p>
                  ) : null}
                  <Link
                    href={`/p/${item.category.slug}/${item.slug}`}
                    className="btn-primary mt-4 !min-h-[2.75rem] w-full text-sm"
                  >
                    {t('home.readMore')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ================================================ health by age */}
      {/*
        The same age box that `/sahayata` carries, put on the home page.

        It was built for that page and stayed there, which meant the one way in
        that does not require anybody to work out which of nine subjects their
        problem belongs to was also the one you had to know a second URL for.
        Somebody landing on the home page and in pain was one step further from
        an answer than somebody who already knew where to look.

        It sits directly under the question box, above the subject grid, because
        the subject grid is the harder way in and age is the easier one.
      */}
      {/*
        No heading of its own here. HealthBox brings one — "अपनी उम्र बताइए" —
        and adding a second for the document outline meant a screen reader
        announced the same heading twice on arrival.
      */}
      <section className="py-12 sm:py-14">
        <div className="wrap-narrow">
          <HealthBox signedIn={Boolean(user)} />
        </div>
      </section>

      {/* ================================================ categories */}
      {noCategories ? (
        /*
         * No subjects to list, but there is still a service to use.
         *
         * The outage notice is shown, and the question box above it is still
         * live. Saying "come back later" on a page whose whole purpose is
         * answering now is the wrong sentence — the honest one is that the
         * subject list is unavailable and the answer is not.
         */
        <section className="py-14 sm:py-16">
          <div className="wrap">
            <DatabaseUnavailable language={lang} />
          </div>
        </section>
      ) : (
      <section aria-labelledby="categories-heading" className="py-14 sm:py-16">
        <div className="wrap">
          <h2 id="categories-heading" className="text-center">
            {t('home.chooseTopic')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-ink-muted">{t('home.chooseTopicNote')}</p>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => {
              const accent = ACCENT[category.accent] ?? ACCENT.saffron;
              return (
                <li key={category.id}>
                  {/*
                    A link styled as a card, not a div with onclick. This is the
                    whole navigation of the site, and in the prototype all nine
                    of these were unreachable without a mouse.
                  */}
                  <Link
                    href={`/p/${category.slug}`}
                    className={`card group flex h-full flex-col ${accent.bg} p-6 transition-all hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1`}
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-2xl bg-surface ${accent.text}`}
                    >
                      <Icon name={category.icon as IconName} size={28} />
                    </span>

                    <h3 className="mt-4 text-xl text-ink">{category.title}</h3>
                    <p className="mt-1.5 flex-1 text-ink-muted">{category.subtitle}</p>

                    <span className={`mt-4 flex items-center gap-1.5 text-sm font-bold ${accent.text}`}>
                      {category._count.articles > 0
                        ? tf('article.count', { count: category._count.articles })
                        : t('home.categoryEmpty')}
                      <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      )}

      {/* ================================================== sound pad */}
      <section aria-labelledby="sound-heading" className="border-y border-line bg-surface py-14">
        <div className="wrap-narrow text-center">
          <h2 id="sound-heading">{t('home.soundTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">{t('home.soundIntro')}</p>
          <SoundPad className="mt-8" />
        </div>
      </section>

      {/* ================================================ how it works */}
      <section aria-labelledby="how-heading" className="py-14">
        <div className="wrap-narrow">
          <h2 id="how-heading" className="text-center">{t('home.howTitle')}</h2>

          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { icon: 'mic' as IconName, title: t('home.step1Title'), body: t('home.step1Body') },
              { icon: 'sparkle' as IconName, title: t('home.step2Title'), body: t('home.step2Body') },
              { icon: 'heart' as IconName, title: t('home.step3Title'), body: t('home.step3Body') },
            ].map((step, i) => (
              <li key={step.title} className="card p-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saffron-soft text-saffron-deep">
                  <Icon name={step.icon} size={26} />
                </span>
                <p className="mt-1 text-sm font-bold text-ink-subtle">
                  {t('home.stepLabel')} {i + 1}
                </p>
                <h3 className="mt-1">{step.title}</h3>
                <p className="mt-2 text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="card mt-8 border-saffron bg-saffron-soft/40 p-6 text-center">
            <h3 className="flex items-center justify-center gap-2 text-saffron-deep">
              <Icon name="shield" size={22} />
              {t('home.freeTitle')}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-ink-muted">{t('home.freeBody')}</p>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}