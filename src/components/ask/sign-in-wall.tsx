'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { useLanguage } from '@/components/language/language';

/**
 * ===========================================================================
 *  SHOWN INSTEAD OF THE QUESTION BOX
 * ===========================================================================
 *
 * The owner decided that nobody may ask anything until they have an account.
 * This is what a visitor sees instead of the box, and it says two things: that
 * signing in takes a moment, and what they will get once they have.
 *
 * ── Why the box is not shown greyed out ────────────────────────────────────
 *
 * Both halves of a half-measure are worse than the whole. A disabled box with
 * no explanation invites a second attempt and then a third. A box that accepts
 * the question and then refuses it loses what they typed, which is the one thing
 * somebody in a hurry cannot rewrite. They are told up front instead.
 *
 * ── Why this file is a client component ────────────────────────────────────
 *
 * Because one of its callers is. The health box on the help page is a client
 * component, because the chips and the follow-up questions it holds are state,
 * and it cannot import a server component. So the wall itself is client-safe and
 * takes its words from the language context, and the session check lives one
 * level up in AskBoxGate, which is a server component.
 *
 * The split matters: the wall decides nothing. It only says what to show. What
 * decides whether a question is answered is currentUser() in the gate, and
 * currentUser() again inside the route.
 */
export function SignInWall() {
  const { t } = useLanguage();

  return (
    <div className="card mx-auto max-w-xl p-6 text-center sm:p-8">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saffron/15 text-saffron-deep">
        <Icon name="name" size={26} />
      </span>

      <h2 className="mt-4 font-display text-2xl">{t('ask.signInTitle')}</h2>
      <p className="mt-2 text-ink-subtle">{t('ask.signInBody')}</p>

      <Link href="/login" className="btn-primary mt-6 inline-flex items-center gap-2 text-lg">
        {t('ask.signInCta')}
        <Icon name="arrow" size={18} />
      </Link>

      {/*
        The rest still works. A person who cannot sign in — no memory for a
        password, a phone they do not own — should not be left with nothing at
        all, and the emergency numbers are the thing that matters most in exactly
        that situation.
      */}
      <div className="mt-6 border-t border-line pt-5">
        <p className="text-sm text-ink-subtle">{t('ask.signInOr')}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <a href="tel:112" className="btn-ghost">
            112 — {t('footer.emergency')}
          </a>
          <a href="tel:108" className="btn-ghost">
            108 — {t('footer.ambulance')}
          </a>
          <Link href="/pustakalay" className="btn-ghost">
            {t('nav.library')}
          </Link>
        </div>
      </div>
    </div>
  );
}