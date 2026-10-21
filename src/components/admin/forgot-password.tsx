'use client';

import React from 'react';

/**
 * Forgot-password, the owner's way back in.
 *
 * ── Why there is no email here ──────────────────────────────────────────────
 * Because there is no email to send to. This site has no accounts with
 * addresses, no billing, and no mail service — and buying one to recover a
 * password would mean the owner's ability to enter their own site depended on a
 * third party being up, paid for, and still willing to send mail to whoever
 * controls that inbox. A question the owner chose does not go down when
 * somebody else does.
 *
 * ── Why the question is shown before anything is typed ──────────────────────
 * So the owner can recognise it. A recovery prompt that hides the question
 * until after a submission makes the owner guess what they were even asked a
 * year ago; showing it costs nothing, because the question was never the secret
 * — the answer is.
 *
 * ── Two boxes, one reason ───────────────────────────────────────────────────
 * The password is asked twice because this is the one moment a typo becomes a
 * lockout with no second attempt. There is no "we'll email you a link to
 * confirm" behind it, so the confirmation has to happen here.
 */

const MESSAGES: Record<string, string> = {
  'no-recovery': 'इस साइट पर अभी कोई रिकवरी सवाल सेट नहीं है, इसलिए पासवर्ड यहाँ से नहीं बदल सकते।',
  'wrong-answer': 'जवाब ठीक नहीं लग रहा। एक बार और सोचिए — बड़े-छोटे अक्षर और खाली जगह कोई फ़र्क नहीं डालती।',
  'locked-out': 'बहुत बार ग़लत कोशिश हो चुकी है। 15 मिनट बाद दोबारा कोशिश कीजिए।',
  'too-short': 'नया पासवर्ड कम से कम 8 अक्षर का हो।',
  'too-long': 'यह बहुत लंबा है — 200 अक्षर से कम रखिए।',
  'bad-request': 'कुछ गड़बड़ हो गई। दोबारा कोशिश कीजिए।',
  'network': 'सर्वर से जुड़ नहीं पाए। इंटरनेट जाँचिए।',
  'saved': 'पासवर्ड बदल गया। आप अंदर हैं — नया पासवर्ड अभी लिख लीजिए।',
};

export function ForgotPassword({ question }: { question: string }) {
  const [answer, setAnswer] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [again, setAgain] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [tone, setTone] = React.useState<'error' | 'good'>('error');

  const mismatch = again.length > 0 && password !== again;

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (mismatch) {
      setTone('error');
      setMessage('दोनों बॉक्स में एक जैसा नहीं है।');
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answer, password }),
      });

      const data = (await response.json()) as { ok: boolean; reason?: string };

      if (data.ok) {
        setTone('good');
        setMessage(MESSAGES.saved);
        // Cleared immediately. The answer and the new password have both served
        // their purpose, and leaving either in a field on a screen the owner
        // will walk away from is how secrets end up on a desk for a week.
        setAnswer('');
        setPassword('');
        setAgain('');

        window.setTimeout(() => {
          window.location.href = '/admin';
        }, 1200);
        return;
      }

      setTone('error');
      setMessage(MESSAGES[data.reason ?? 'wrong-answer'] ?? 'कुछ गड़बड़ हो गई।');
    } catch {
      setTone('error');
      setMessage(MESSAGES.network);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">पासवर्ड भूल गए?</h1>

      <p className="mt-3 text-ink-subtle">
        कोई बात नहीं। आपने जो सवाल तय किया था, उसका जवाब दीजिए — फिर नया पासवर्ड बना लीजिए।
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div className="rounded-[var(--radius)] border border-line bg-sun/10 p-4">
          <p className="text-sm text-ink-subtle">आपका सवाल</p>
          <p className="mt-1 text-lg font-semibold">{question}</p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="recovery-answer" className="font-medium">
            जवाब
          </label>
          <input
            id="recovery-answer"
            type="text"
            autoComplete="off"
            // Not `off`-switched or disabled: the answer is a word, and a field
            // that fights the person typing it is a field people give up on.
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            required
            maxLength={200}
          />
          <p className="text-sm text-ink-subtle">
            बड़े-छोटे अक्षर और खाली जगह का फ़र्क नहीं पड़ता।
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="new-admin-password" className="font-medium">
            नया पासवर्ड
          </label>
          <input
            id="new-admin-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            required
          />
          <p className="text-sm text-ink-subtle">कम से कम 8 अक्षर।</p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="new-admin-password-again" className="font-medium">
            दोबारा लिखिए
          </label>
          <input
            id="new-admin-password-again"
            type="password"
            autoComplete="new-password"
            value={again}
            onChange={(event) => setAgain(event.target.value)}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            required
          />
        </div>

        {mismatch ? (
          <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-danger">
            दोनों बॉक्स में एक जैसा नहीं है।
          </p>
        ) : null}

        {message ? (
          <p
            role="status"
            className={
              'rounded-lg px-4 py-3 ' +
              (tone === 'good' ? 'bg-leaf/10 text-leaf' : 'bg-danger/10 text-danger')
            }
          >
            {message}
          </p>
        ) : null}

        <button type="submit" disabled={busy || !answer || !password} className="btn-primary text-lg">
          {busy ? 'जाँच रहे हैं…' : 'नया पासवर्ड बनाइए'}
        </button>
      </form>

      {/*
        Said out loud, because it is the honest limit of this design: five wrong
        answers and the address waits. A recovery that a script could sit and
        grind through all evening would be worse than no recovery at all.
      */}
      <p className="mt-6 rounded-lg bg-sun/10 px-4 py-3 text-sm text-ink-subtle">
        ग़लत जवाब पाँच बार डालने पर 15 मिनट तक रोक लग जाती है। पासवर्ड और सवाल दोनों याद
        रखिए — दोनों ही सिर्फ़ आपके पास हैं।
      </p>
    </div>
  );
}
