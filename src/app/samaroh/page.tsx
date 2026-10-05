import Link from 'next/link';
import { prisma } from '@/server/db';
import { Icon, type IconName } from '@/components/ui/icon';
import { SiteChrome } from '@/components/layout/site-chrome';

/**
 * How the service works, what it will not do, and where the owner's words go.
 *
 * The prototype had no page like this. A service that answers questions about
 * health and money needs to say plainly what it is — and what it is not —
 * before anyone trusts it with something personal.
 */
export const dynamic = 'force-dynamic';
export const metadata = { title: 'संदर्भ' };

export default async function SamarohPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'वर्षा समाधान AI';
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { title: true, subtitle: true, _count: { select: { articles: { where: { isPublished: true } } } } },
  });

  const questions = await prisma.askedQuestion.count();

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <h1>यह सेवा क्या है, और क्या नहीं</h1>

        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p>
            यह सेवा श्रीमती वर्षा जी की स्मृति में समर्पित है। उनकी भावना थी कि कोई भी मदद के लिए
            मोहत्सल न जाए। इसलिए यह सेवा पूरी तरह निःशुल्क है।
          </p>

          <h2 className="pt-2">यह क्या करती है</h2>
          <ul className="space-y-2">
            {[
              'आपकी बात सरल हिंदी में समझती है — टाइप कीजिए या बोलिए।',
              'सामान्य जीवन की समस्याओं के लिए मार्गदर्शन देती है।',
              'हर विषय पर पहले से लिखी हुई जानकारी दिखाती है, जिसे बिना इंटरनेट के भी पढ़ा जा सकता है।',
              'किसी बात का जवाब हिंदी में सुना देती है, ताकि पढ़ना मुश्किल हो तो भी समझ आ जाए।',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <Icon name="check" size={22} className="mt-1.5 shrink-0 text-success" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <h2 className="pt-2">यह क्या नहीं करती</h2>
          <ul className="space-y-2">
            {[
              'यह डॉक्टर नहीं है। दवाई की सलाह कभी नहीं दी जाती।',
              'यह वकील नहीं है। कानूनी सलाह नहीं दी जाती।',
              'कोई भी पैसा नहीं लिया जाता, और कोई विज्ञापन नहीं दिखाया जाता।',
              'आपका नाम, पता या फ़ोन नंबर नहीं माँगा जाता और नहीं रखा जाता।',
              'कोई सरकारी योजना का दाम या नंबर नहीं बनाया जाता — सही जानकारी न हो तो साफ़ कहा जाता है कि नहीं पता।',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <Icon name="close" size={22} className="mt-1.5 shrink-0 text-danger" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="card border-rose/40 bg-rose-soft p-5">
            <h2 className="flex items-center gap-2 text-rose">
              <Icon name="alert" size={22} />
              ज़रूरी: यह डॉक्टर की सलाह नहीं है
            </h2>
            <p className="mt-2">
              बीमारी, दवाई या कोई भी ज़हरीली चीज़ से जुड़ी बात हो, तो सबसे पहले डॉक्टर से मिलिए।
              यहाँ दी गई जानकारी सिर्फ़ सामान्य मदद के लिए है। बच्चे के टीके, गर्भावस्था, या कोई भी दवाई
              शुरू करने से पहले डॉक्टर की सलाह ज़रूर लें।
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2>कितनी जानकारी मौजूद है</h2>
          <p className="mt-2 text-ink-muted">
            अभी {categories.length} विषयों पर{' '}
            {categories.reduce((n, c) => n + c._count.articles, 0)} लेख लिखे गए हैं।
            {questions > 0 ? ` अब तक ${questions} सवाल पूछे गए हैं।` : null}
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <li key={c.title} className="card flex items-center gap-3 p-4">
                <Icon name="scroll" size={20} className="shrink-0 text-saffron" />
                <span className="min-w-0">
                  <span className="block font-bold">{c.title}</span>
                  <span className="block text-sm text-ink-muted">{c.subtitle}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/sahayata" className="btn-primary">
            <Icon name="mic" size={20} />
            सवाल पूछें
          </Link>
          <Link href="/madad" className="btn-outline">
            हमारी मदद करें
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}