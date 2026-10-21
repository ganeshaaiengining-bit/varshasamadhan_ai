'use client';

import React from 'react';

/**
 * Change the owner's password, from inside the panel.
 *
 * ── Why this page exists when "forgot password" already can change it ───────
 * The recovery route changes the password *because the owner could not get in*.
 * Using it while already signed in works, but it asks the owner to pretend to be
 * locked out: answer a security question, set a password, and hope the session
 * they already had survives it. That is a strange way to do an ordinary thing,
 * and a strange way to do an ordinary thing is a way people stop doing it.
 *
 * ── The three fields, and why they are in this order ────────────────────────
 * Current password first, because it is the one the owner is certain about, and
 * putting the uncertain new one after it means a mistake in either is reported
 * against the right box. Then the new password twice, because there is no email
 * to confirm it and a typo here is a lockout — the recovery question is the only
 * way back, and needing it is exactly what this screen exists to avoid.
 *
 * ── The recovery pair is behind a switch ────────────────────────────────────
 * Off by default, showing the current question in plain text. Most visits here
 * are about the password; the question is the rarer errand, and a form that
 * always asks for both is a form that asks the owner to rewrite something they
 * did not come to rewrite — with an empty answer box that refuses to submit.
 */

const MESSAGES: Record<string, string> = {
  'not-signed-in': 'आपका सत्र खत्म हो गया। दोबारा अंदर आइए।',
  'wrong-current': 'अभी वाला पासवर्ड ठीक नहीं है।',
  'locked-out': 'बहुत बार ग़लत पासवर्ड डला। 15 मिनट बाद कोशिश कीजिए।',
  'too-short': 'नया पासवर्ड कम से कम 8 अक्षर का हो।',
  'too-long': 'यह बहुत लंबा है — 200 अक्षर से कम रखिए।',
  'question-too-short': 'सवाल कम से कम 4 अक्षर का हो।',
  'question-too-long': 'सवाल 200 अक्षर से कम रखिए।',
  'answer-too-short': 'जवाब कम से कम 2 अक्षर का हो।',
  'answer-too-long': 'जवाब 200 अक्षर से कम रखिए।',
  'bad-request': 'कुछ अधूरा भरा है। दोबारा देखिए।',
  'recovery-required':
    'पहली बार सवाल और जवाब भी बनाने होंगे — वरना पासवर्ड भूलने पर वापस आने का रास्ता नहीं रहेगा।',
  network: 'सर्वर से जुड़ नहीं पाए। इंटरनेट जाँचिए।',
  saved: 'पासवर्ड बदल गया। नया पासवर्ड अभी नोट्स में लिख लीजिए।',
  savedWithRecovery: 'पासवर्ड और सवाल-जवाब — दोनों बदल गए। अभी नोट्स में लिख लीजिए।',
};

export function ChangePassword({
  question,
  hasRecovery,
}: {
  question: string;
  hasRecovery: boolean;
}) {
  const [current, setCurrent] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [again, setAgain] = React.useState('');
  const [changeRecovery, setChangeRecovery] = React.useState(!hasRecovery);
  const [newQuestion, setNewQuestion] = React.useState('');
  const [newAnswer, setNewAnswer] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [tone, setTone] = React.useState<'error' | 'good'>('error');

  const mismatch = again.length > 0 && password !== again;
  const recoveryIncomplete =
    changeRecovery && (newQuestion.trim().length === 0 || newAnswer.trim().length === 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (mismatch) {
      setTone('error');
      setMessage('दोनों बॉक्स में एक जैसा नहीं है।');
      return;
    }

    if (recoveryIncomplete) {
      setTone('error');
      setMessage('नया सवाल और उसका जवाब — दोनों भरिए, वरना पुराना ही रहेगा।');
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          current,
          password,
          question: changeRecovery ? newQuestion : '',
          answer: changeRecovery ? newAnswer : '',
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        reason?: string;
        recoveryChanged?: boolean;
      };

      if (data.ok) {
        setTone('good');
        setMessage(data.recoveryChanged ? MESSAGES.savedWithRecovery : MESSAGES.saved);

        // Cleared the moment it works: these fields hold two passwords and,
        // when the switch is on, the answer to the recovery question. Leaving
        // them on a screen the owner will walk away from is how they end up on
        // a desk for a week.
        setCurrent('');
        setPassword('');
        setAgain('');
        setNewQuestion('');
        setNewAnswer('');
        setChangeRecovery(false);
        return;
      }

      setTone('error');
      setMessage(MESSAGES[data.reason ?? 'bad-request'] ?? 'कुछ गड़बड़ हो गई।');
    } catch {
      setTone('error');
      setMessage(MESSAGES.network);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">पासवर्ड बदलिए</h1>

      <p className="mt-3 text-ink-subtle">
        अभी वाला पासवर्ड डालिए, फिर नया बनाइए। नया पासवर्ड बनाते ही पुराना काम करना बंद
        कर देगा।
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="current-password" className="font-medium">
            अभी वाला पासवर्ड
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="new-password" className="font-medium">
            नया पासवर्ड
          </label>
          <input
            id="new-password"
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
          <label htmlFor="new-password-again" className="font-medium">
            नया पासवर्ड दोबारा
          </label>
          <input
            id="new-password-again"
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

        {/* The current question, in plain text. Shown even when the switch is
            off, because an owner who cannot remember which question they chose
            should be able to find out here rather than by getting locked out. */}
        <div className="rounded-[var(--radius)] border border-line bg-sun/10 p-4">
          <p className="text-sm text-ink-subtle">अभी का रिकवरी सवाल</p>
          <p className="mt-1 font-semibold">
            {hasRecovery ? question : 'अभी कोई सवाल सेट नहीं है।'}
          </p>

          <label className="mt-3 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              onChange={(event) => setChangeRecovery(event.target.checked)}
              className="mt-1"
              // When there is no question yet, this box is not a choice: a
              // password with no way back is the state this whole page exists to
              // end. Shown disabled rather than hidden so the owner can see the
              // rule instead of being surprised by a required field.
              disabled={!hasRecovery}
              checked={!hasRecovery ? true : changeRecovery}
            />
            <span>
              {hasRecovery
                ? 'सवाल और जवाब भी बदलने हैं'
                : 'पहली बार सवाल और जवाब बनाने होंगे (पासवर्ड भूलने पर यही काम आएगा)'}
            </span>
          </label>
        </div>

        {changeRecovery ? (
          <>
            <div className="grid gap-2">
              <label htmlFor="new-question" className="font-medium">
                नया सवाल
              </label>
              <input
                id="new-question"
                type="text"
                autoComplete="off"
                placeholder="जैसे: मेरी माँ का नाम क्या है?"
                value={newQuestion}
                onChange={(event) => setNewQuestion(event.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
                maxLength={200}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="new-answer" className="font-medium">
                उसका जवाब
              </label>
              <input
                id="new-answer"
                type="text"
                autoComplete="off"
                value={newAnswer}
                onChange={(event) => setNewAnswer(event.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
                maxLength={200}
              />
              <p className="text-sm text-ink-subtle">
                बड़े-छोटे अक्षर और खाली जगह का फ़र्क नहीं पड़ता।
              </p>
            </div>
          </>
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

        <button
          type="submit"
          disabled={busy || !current || !password}
          className="btn-primary text-lg"
        >
          {busy ? 'बदल रहे हैं…' : 'पासवर्ड बदलिए'}
        </button>
      </form>

      <p className="mt-6 rounded-lg bg-sun/10 px-4 py-3 text-sm text-ink-subtle">
        पासवर्ड बदलते ही जो भी फ़ोन या कंप्यूटर पहले से खुला था, वह बंद हो जाएगा। यही सही
        है — पुराना पासवर्ड अब किसी काम का नहीं।
      </p>

      <p className="mt-4 text-center text-sm">
        <a href="/admin" className="underline text-ink-subtle hover:text-ink">
          प्रबंधक के पन्ने पर वापस
        </a>
      </p>
    </div>
  );
}
