'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { submitContact } from '@/server/contact/actions';
import { useToast } from '@/components/ui/toast';
import { useLanguage } from '@/components/language/language';

/**
 * ===========================================================================
 *  CONTACT FORM
 * ===========================================================================
 *
 * The page /madad asks for four things — write your experience, tell us about
 * your city, tell someone else, come and look — and had nowhere to do any of
 * them. The strings were already written in every language
 * (support.contactTitle, support.contactBody, support.faqTitle,
 * support.faqBody) and the page never called them, because there was nothing to
 * call them with. This is that something.
 *
 * ── Why this is an inline form, not a modal ──────────────────────────────
 * Same reason as the review form. The audience is largely elderly, and a modal
 * that traps focus and has to be dismissed is the most hostile pattern on the
 * web for a shaky finger or a screen reader.
 *
 * ── Why there is no "we will reply" ───────────────────────────────────────
 * The form does not promise a reply, because nobody has committed to reading
 * the inbox. It says what actually happens: this goes to the owner. A promise
 * of a reply on a service that is maintained by one person would be the kind of
 * small lie that makes a site feel like a company rather than a person.
 *
 * ── Why name and city are optional ───────────────────────────────────────
 * Every page on this site says it collects nothing. A contact form with a
 * required name field would contradict all of them, and the people most likely
 * to be reporting something wrong are exactly the ones least willing to give a
 * name to a stranger.
 */

export function ContactForm() {
  const toast = useToast();
  const { t } = useLanguage();
  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  /**
   * The form element, so the honeypot can be read out of the DOM.
   *
   * A ref rather than `event.currentTarget`, which React types as
   * `EventTarget & Element` and which therefore cannot be handed to
   * `new FormData()` without a cast. The cast would typecheck and be wrong the
   * moment the handler was moved, so the element is held where it is known to
   * be an HTMLFormElement.
   */
  const formRef = React.useRef<HTMLFormElement>(null);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setFieldErrors({});

    try {
      // The honeypot is read out of the DOM rather than out of component state,
      // because a bot filling the form never runs React. Reading state would
      // always send '' and the field would be decoration.
      const data = new FormData(formRef.current ?? undefined);

      const result = await submitContact({
        name,
        city,
        message,
        website: String(data.get('website') ?? ''),
      });

      if (result.ok) {
        toast.success(t('support.contactSent'), t('support.contactSentBody'));
        setMessage('');
        setName('');
        setCity('');
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(t('support.contactFailed'), result.message);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="contact-heading" className="mt-12">
      <div className="card p-6 sm:p-8">
        <h2 id="contact-heading" className="flex items-center gap-2 text-saffron-deep">
          <Icon name="edit" size={22} />
          {t('support.contactTitle')}
        </h2>
        <p className="mt-2 text-ink-muted">{t('support.contactBody')}</p>

        <form onSubmit={send} ref={formRef} className="mt-5" noValidate>
          {/* ---------------------------------------------------------- honeypot
              Not hidden with CSS and not display:none. Both leave it in the
              accessibility tree, so a screen reader reads a field nobody can
              see and a person with a motor impairment spends time on it. These
              two attributes remove it from both. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="ct-website">Website</label>
            <input
              id="ct-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className="label">
                {t('reviews.name')}
              </label>
              <input
                id="ct-name"
                name="name"
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
              />
            </div>
            <div>
              <label htmlFor="ct-city" className="label">
                {t('reviews.city')}
              </label>
              <input
                id="ct-city"
                name="city"
                className="field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={120}
                autoComplete="address-level2"
                aria-invalid={Boolean(fieldErrors.city)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="ct-message" className="label">
              {t('support.contactMessageLabel')}
            </label>
            <textarea
              id="ct-message"
              name="message"
              className="field min-h-32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={4000}
              rows={5}
              placeholder={t('support.contactPlaceholder')}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby="ct-message-help"
            />
            <p id="ct-message-help" className="mt-1.5 text-xs text-ink-subtle">
              {fieldErrors.message?.join(' ') ?? t('support.contactHelp')}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={sending}>
              <Icon name="send" size={18} />
              {sending ? t('support.contactSending') : t('support.contactSubmit')}
            </button>
            <p className="text-xs text-ink-subtle">{t('support.contactPrivacy')}</p>
          </div>
        </form>
      </div>
    </section>
  );
}

/**
 * The five questions the help page keeps answering in prose.
 *
 * Plain <details>, not an accordion component. <details> is a native element:
 * it works without JavaScript, it is announced correctly by a screen reader, it
 * is keyboard-operable without a single line of code, and it survives a failed
 * bundle. The audience is largely elderly and the site is free to run, which
 * means the cheapest correct thing is usually the right one.
 */
export function SupportFaq() {
  const { t } = useLanguage();

  const items = [
    { q: t('support.faq1Q'), a: t('support.faq1A') },
    { q: t('support.faq2Q'), a: t('support.faq2A') },
    { q: t('support.faq3Q'), a: t('support.faq3A') },
    { q: t('support.faq4Q'), a: t('support.faq4A') },
    { q: t('support.faq5Q'), a: t('support.faq5A') },
  ];

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="text-center">
        {t('support.faqTitle')}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-ink-muted">
        {t('support.faqBody')}
      </p>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="card group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-saffron transition-transform group-open:rotate-45"
              >
                <Icon name="plus" size={20} />
              </span>
            </summary>
            <p className="mt-3 text-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
