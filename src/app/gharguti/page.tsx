import type { Metadata } from 'next';
import { getT } from '@/server/i18n';
import { SiteChrome } from '@/components/layout/site-chrome';
import { AskBoxGate } from '@/components/ask/ask-box-gate';
import { Icon } from '@/components/ui/icon';

/**
 * ===========================================================================
 *  आयुर्वेदिक घरेलू उपचार — the owner's option one
 * ===========================================================================
 *
 * One box, one list of troubles. The visitor taps the thing that is wrong with
 * them — cough, headache, arthritis, itching, diabetes, back pain, difficulty
 * walking — or says it in their own words, and the answer comes back as the
 * home-and-Ayurvedic measures for that trouble: kadha, massage, diet, what to
 * avoid, and when it is no longer enough.
 *
 * ── Why the conditions are chips, not articles ─────────────────────────────
 * The owner's objection to article fallbacks was right: a page about something
 * adjacent is not an answer to the question asked. A chip here does not open an
 * article — it fills the question box with the condition in the visitor's own
 * language, and the AI answers that condition, in that language, in full.
 *
 * ── The emergency strip stays above the box ────────────────────────────────
 * Snake bite, scorpion sting and dog bite are on the owner's list, and they are
 * on the list because people ask about them — not because a household remedy
 * belongs anywhere near them. The first line for all three is a hospital. The
 * strip sits above the chips so it is read before a chip is tapped, in the same
 * place the health page puts its warning.
 *
 * ── Why the labels come from the translation tables ────────────────────────
 * A condition chip in Hindi shown to a Tamil reader is not a smaller mistake on
 * this page than elsewhere; it is the whole page failing. All thirteen strings
 * are in i18n.ts and checked by scripts/check-i18n.ts.
 */

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t('remedy.title') };
}

/** The owner's ten troubles, in the order he named them. */
const CONDITIONS = [
  'remedy.cough',
  'remedy.headache',
  'remedy.joints',
  'remedy.itching',
  'remedy.snake',
  'remedy.scorpion',
  'remedy.dog',
  'remedy.diabetes',
  'remedy.back',
  'remedy.walking',
] as const;

export default async function GhargutiPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VARSHA SAMADHAN AI';
  const { t } = await getT();

  /*
   * The chip's label is also its question. A visitor who taps "खांसी" is asking
   * for cough, and the page category below tells the model what kind of answer
   * that is — so the chip does not need a second, longer sentence in thirteen
   * languages, and the visitor still sees their own word filled into the box.
   */
  const suggested = CONDITIONS.map((key) => ({
    label: t(key),
    question: t(key),
  }));

  return (
    <SiteChrome siteName={siteName}>
      <div className="wrap-narrow py-10 sm:py-14">
        <div className="text-center">
          <h1>{t('remedy.title')}</h1>
          <p className="mt-3 text-ink-muted">{t('remedy.intro')}</p>
        </div>

        {/*
         * The emergency line comes before the box, not after it. Someone who has
         * just been bitten is not going to scroll, and a household remedy for a
         * snake bite is the one answer on this page that can kill.
         */}
        <div className="mt-6 rounded-md border border-danger/30 bg-danger-soft p-4">
          <p className="flex items-center gap-2 font-bold text-danger">
            <Icon name="alert" size={20} />
            {t('remedy.emergencyStrong')}
          </p>
          <p className="mt-2 text-ink-soft">
            {t('remedy.emergency')}{' '}
            <a href="tel:112" className="-mx-1 inline-block px-1 py-2 font-bold text-danger underline">
              112
            </a>
          </p>
        </div>

        <div className="card mt-8 p-5 sm:p-7">
          <AskBoxGate
            /*
             * English on purpose: this string reaches the model as context, and a
             * fixed phrase is what the system prompt's home-remedy rule is
             * written against. The answer's language is set by the visitor's
             * chosen language, never by this line.
             */
            category="Ayurvedic home remedies (gharguti upchar)"
            suggested={suggested}
            suggestedLabel={t('remedy.choose')}
          />
        </div>

        <p className="mt-6 flex items-start justify-center gap-2 text-center text-sm text-ink-subtle">
          <Icon name="shield" size={16} className="mt-0.5 shrink-0" />
          <span>{t('remedy.note')}</span>
        </p>
      </div>
    </SiteChrome>
  );
}
