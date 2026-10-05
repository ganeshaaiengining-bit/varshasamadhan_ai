import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';

export const metadata = { title: 'हमारी मदद करें' };

/**
 * A static "how you can help" page.
 *
 * No donation form and no payment gateway on purpose. Both cost money to run
 * (or cost trust, if a stranger's payment page sits on a service for people who
 * cannot afford anything), and the owner has not asked for one. When that
 * changes, this is where it goes.
 */
export default function MadadPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-soft text-rose">
            <Icon name="heart" size={32} />
          </span>
          <h1 className="mt-4">हमारी मदद कैसे करें</h1>
          <p className="mt-3 text-ink-muted">
            यह सेवा चलाने के लिए पैसा लगता है — सर्वर, और मशीनों को जोड़ने का ख़र्च। आप कई तरीकों से
            मदद कर सकते हैं।
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {[
            {
              icon: 'book' as const,
              title: 'जानकारी लिखिए',
              body: 'अगर आपको कोई विषय अच्छे से आता है — दवा, खेती, पढ़ाई, कोई भी — तो वह लिख कर भेजिए। आपके जैसे लोगों की वजह से यह सेवा काम करती है।',
            },
            {
              icon: 'elder' as const,
              title: 'बुज़ुर्गों को सिखाइए',
              body: 'अपने परिवार के बुज़ुर्गों को बताइए कि यह सेवा है। जो लोग टाइप नहीं कर पाते, वे बोलकर सवाल पूछ सकते हैं।',
            },
            {
              icon: 'mic' as const,
              title: 'जानकारी सुधारिए',
              body: 'कुछ जानकारी पुरानी या ग़लत लगे तो बताइए। ग़लती ठीक हो जाती है और दूसरे लोगों का समय बच जाता है।',
            },
            {
              icon: 'share' as const,
              title: 'आगे बढ़ाइए',
              body: 'व्हाट्सएप पर यह लिंक किसी ऐसे व्यक्ति को भेजिए जिसे मदद की ज़रूरत हो। एक संदेश भी काफ़ी है।',
            },
          ].map((item) => (
            <li key={item.title} className="card flex gap-4 p-5 sm:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron-soft text-saffron-deep">
                <Icon name={item.icon} size={24} />
              </span>
              <div className="min-w-0">
                <h2>{item.title}</h2>
                <p className="mt-1.5 text-ink-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="card mt-10 border-saffron bg-saffron-soft/40 p-6 text-center">
          <h2 className="flex items-center justify-center gap-2 text-saffron-deep">
            <Icon name="shield" size={22} />
            यह सेवा हमेशा निःशुल्क रहेगी
          </h2>
          <p className="mx-auto mt-2 max-w-xl">
            जो भी मदद मिले, वह सेवा चलाने में लगेगी। किसी से कभी पैसा नहीं लिया जाएगा।
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/sahayata" className="btn-primary">
            <Icon name="mic" size={20} />
            सवाल पूछें
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}