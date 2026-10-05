import Link from 'next/link';
import { prisma } from '@/server/db';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AskBox } from '@/components/ask/ask-box';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'सहायता' };

/**
 * The plain help page: one box, no navigation to think about. Most visitors who
 * arrive here have a problem right now and want an answer, not a menu.
 */
export default async function SahayataPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { title: true, slug: true },
  });

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <h1>अपनी बात कहिए</h1>
          <p className="mt-3 text-ink-muted">
            नीचे लिखिए या माइक से बोलिए। कोई नाम या पता लिखने की ज़रूरत नहीं है।
          </p>
        </div>

        <div className="card mt-8 p-5 sm:p-7">
          <AskBox
            suggested={[
              { label: 'रिश्तों में झगड़ा', question: 'परिवार में बहुत झगड़ा हो रहा है, मन बहुत ख़राब है। क्या करूँ?' },
              { label: 'पैसों की चिंता', question: 'रोज़गार नहीं है और पैसों की बहुत चिंता है। क्या करूँ?' },
              { label: 'बीमारी की परेशानी', question: 'घर में कोई बीमार है, दवाई का पैसा नहीं है। क्या करूँ?' },
              { label: 'बच्चों का स्कूल छोड़ दिया', question: 'मेरे बच्चे ने स्कूल छोड़ दिया है। उसे वापस कैसे भेजूँ?' },
            ]}
          />
        </div>

        {categories.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-center">या कोई विषय चुनिए</h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/p/${c.slug}`}
                    className="inline-flex items-center rounded-full border-2 border-line bg-surface px-4 py-2.5 font-semibold hover:border-saffron hover:text-saffron-deep"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 text-center text-sm text-ink-subtle">
          कोई सवाल नहीं मिल रहा? बगल के विषयों में देखिए, बहुत कुछ वहीं लिखा है।
        </p>
      </div>
    </SiteChrome>
  );
}