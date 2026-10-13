'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language/language';
import { signIn, signUp } from '@/server/account/actions';
import { endSession } from '@/server/auth/session';
import type { AccountMode } from '@/server/account/actions';

/**
 * ===========================================================================
 *  THE ACCOUNT FORM
 * ===========================================================================
 *
 * Two boxes side by side on a wide screen: sign in, and make an account. One on
 * a phone, sign in first.
 *
 * ── Why it is not one form with a mode switch ──────────────────────────────
 *
 * A toggle means one extra tap before anything can be typed, and on a phone it
 * is easy to miss entirely. Two separate boxes are visible at once, so what is
 * available is known without trying anything.
 *
 * ── Why the password field says what the rule is ──────────────────────────
 *
 * A visitor who is told "at least six characters" while typing can see they
 * are failing. One told "invalid password" after submitting cannot. The hint is
 * under the field rather than in an error, for the same reason the rest of this
 * site says things before they are asked rather than after.
 *
 * ── Why the phone number is optional and said to be optional ───────────────
 *
 * It is not required to make an account, and a field that looks required when
 * it is not wastes the whole form for somebody who has decided not to give it.
 * The label says so in words.
 */
export function AccountForm({
  mode,
  className,
}: {
  mode: AccountMode;
  className?: string;
}) {
  const { t } = useLanguage();
  const router = useRouter();

  const [handle, setHandle] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  if (mode === 'logout') {
    return (
      <form
        className={className}
        action={async () => {
          await endSession();
          router.refresh();
        }}
      >
        <button type="submit" className={className}>
          {t('account.logout')}
        </button>
      </form>
    );
  }

  const register = mode === 'register';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setReason('');

    const result = register
      ? await signUp(handle, password, phone, document.documentElement.lang || 'hi')
      : await signIn(handle, password);

    setBusy(false);

    if (result.ok) {
      router.refresh();
      router.push('/account');
      return;
    }

    setReason(t(result.reason ?? 'account.errTryLater'));
  };

  return (
    <form
      onSubmit={submit}
      className={`card flex flex-col gap-4 p-6 sm:p-7 ${className ?? ''}`}
    >
      <h2 className="font-display text-2xl">{t(register ? 'account.register' : 'account.signIn')}</h2>
      <p className="text-sm text-ink-subtle">
        {t(register ? 'account.registerNote' : 'account.signInNote')}
      </p>

      <div className="grid gap-2">
        <label htmlFor={`${mode}-handle`} className="font-medium">
          {t('account.handle')}
        </label>
        <input
          id={`${mode}-handle`}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          minLength={3}
          maxLength={32}
          placeholder={t('account.handlePlaceholder')}
          className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${mode}-password`} className="font-medium">
          {t('account.password')}
        </label>
        <input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={register ? 'new-password' : 'current-password'}
          required
          minLength={6}
          className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
        />
        <p className="text-sm text-ink-subtle">{t('account.passwordHint')}</p>
      </div>

      {register && (
        <div className="grid gap-2">
          <label htmlFor={`${mode}-phone`} className="font-medium">
            {t('account.phone')} <span className="font-normal text-ink-subtle">({t('account.optional')})</span>
          </label>
          <input
            id={`${mode}-phone`}
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            maxLength={20}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
          />
          <p className="text-sm text-ink-subtle">{t('account.phoneHint')}</p>
        </div>
      )}

      {reason && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-danger">
          {reason}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary mt-1 text-lg">
        {busy ? t('account.wait') : t(register ? 'account.create' : 'account.signIn')}
      </button>
    </form>
  );
}