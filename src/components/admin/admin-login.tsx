'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';

/**
 * Owner sign-in.
 *
 * ── Why the "no password set" message is the loudest thing on this page ────
 * A visitor who reaches `/admin` and is refused must be able to tell the
 * difference between "you did not guess right" and "this site has no owner
 * password, so nothing can get in". They are different problems with different
 * fixes, and a single generic "wrong password" leaves a half-built deployment
 * looking like a locked one.
 *
 * ── Why the password field is not turned off by the browser ────────────────
 * `autoComplete="current-password"` on purpose. Disabling it breaks password
 * managers, which is how people end up reusing one weak password across every
 * site they own — including this one, which holds other people's names.
 */

const MESSAGES: Record<string, string> = {
  'no-password-configured':
    'इस साइट पर अभी कोई प्रबंधक पासवर्ड सेट नहीं है। इसलिए कोई भी अंदर नहीं पा सकता। सेट करने के लिए `.env` फ़ाइल में `ADMIN_PASSWORD` लिखें (कम से कम 8 अक्षर), फिर साइट दोबारा चालू करें।',
  'locked-out':
    'बहुत बार ग़लत कोशिश हो चुकी है। 15 मिनट बाद दोबारा कोशिश कीजिए।',
  'wrong-password': 'पासवर्ड सही नहीं है।',
  'bad-request': 'कुछ गड़बड़ हो गई। दोबारा कोशिश कीजिए।',
  'network': 'सर्वर से जुड़ नहीं पाए। इंटरनेट जाँचिए।',
};

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok: boolean; reason?: string };

      if (data.ok) {
        // The password is dropped from memory the moment it is no longer needed,
        // rather than being left in the field while the new page renders.
        setPassword('');
        router.refresh();
        return;
      }

      setPassword('');
      setError(MESSAGES[data.reason ?? 'wrong-password'] ?? MESSAGES['wrong-password']);
    } catch {
      setError(MESSAGES['network']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saffron-soft text-saffron-deep">
          <Icon name="shield" size={28} />
        </span>
        <h1 className="mt-4 text-2xl">प्रबंधक</h1>
        <p className="mt-2 text-ink-muted">
          सिर्फ़ आपके लिए। यहाँ आपके आए हुए सवाल और लोगों की राय दिखती है।
        </p>
      </div>

      {/*
        Shown before the form rather than only after a failed attempt, because a
        deployment with no password set has no way to get in at all and the
        owner needs to be told that from the server, not inferred from silence.
      */}
      {!configured ? (
        <div
          role="alert"
          className="mt-6 rounded-[var(--radius)] border-2 border-rose/40 bg-rose-soft p-4 text-sm"
        >
          <p className="font-bold text-rose">पासवर्ड सेट नहीं है</p>
          <p className="mt-1">{MESSAGES['no-password-configured']}</p>
        </div>
      ) : null}

      <form onSubmit={submit} className="card mt-6 p-6">
        <label htmlFor="admin-password" className="label">
          पासवर्ड
        </label>
        <input
          id="admin-password"
          type="password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          // `new-password` would invite a password manager to *generate* one and
          // then the owner would not know what it is.
          name="owner-password"
          required
          maxLength={200}
        />

        <button type="submit" disabled={busy || !password} className="btn-primary mt-4 w-full">
          {busy ? 'जाँच रहे हैं…' : 'अंदर जाएँ'}
        </button>

        {error ? (
          <p role="alert" className="mt-3 rounded-md border border-danger/30 bg-danger-soft p-3 text-sm">
            {error}
          </p>
        ) : null}
      </form>

      <p className="mt-6 text-center text-sm text-ink-subtle">
        आपका पासवर्ड कभी यहाँ दिखाई नहीं देगा। यह सिर्फ़ सर्वर पर रहता है।
      </p>
    </div>
  );
}