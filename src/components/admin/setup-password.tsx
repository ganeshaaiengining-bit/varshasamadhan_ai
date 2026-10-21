'use client';

import React from 'react';

/**
 * The one-time setup page: set the owner's password, yourself, once.
 *
 * ── Why this page exists at all ──────────────────────────────────────────────
 * The password used to be an environment variable. Which meant the owner could
 * not change it without handing the new value to somebody else to put there —
 * and the value then lived in a chat, in a command line, and in a shell history,
 * all of which keep it after everybody has forgotten about it.
 *
 * So the owner sets it here, on their own screen, and it goes straight into the
 * database hashed. Nobody else sees it, including me.
 *
 * ── Why the link is safe to hand out ─────────────────────────────────────────
 * Because it stops working the moment it is used. The server refuses to set a
 * password at all once one exists — not with a delay, not with a rate limit,
 * simply no. So the dangerous moment is only the moment before the first
 * password, and once that is over the link has nothing left to open.
 *
 * ── Two fields, and both are asked for ──────────────────────────────────────
 * A confirmation field exists for one reason: this is the owner's password for
 * their own site and there is nobody to recover it for them. The second box is
 * the last chance to notice a typo, and there is no "email me a reset link"
 * behind it.
 */

const MESSAGES: Record<string, string> = {
  'too-short': 'कम से कम 8 अक्षर के हिस्से हों।',
  'too-long': 'यह बहुत लंबा है — 200 अक्षर से कम रखिए।',
  'bad-token': 'यह लिंक काम नहीं कर रहा। शायद इसे पहले ही इस्तेमाल किया जा चुका है।',
  'already-set': 'पासवर्ड पहले से बना हुआ है। अगर आप उसे भूल गए हैं तो लिंक दोबारा काम नहीं करेगा — यही इसकी ताक़त है।',
  'network': 'सर्वर से जुड़ नहीं पाए। थोड़ी देर में कोशिश कीजिए।',
  'saved': 'पासवर्ड बन गया। आप अंदर हैं — अब ये तीनों सिर्फ़ आपके पास हैं: पासवर्ड, सवाल, जवाब।',
  'question-too-short': 'सवाल थोड़ा लंबा लिखिए — कम से कम 4 अक्षर।',
  'question-too-long': 'सवाल बहुत लंबा है — 200 अक्षर से कम रखिए।',
  'answer-too-short': 'जवाब कम से कम 2 अक्षर का हो।',
  'answer-too-long': 'जवाब बहुत लंबा है — 200 अक्षर से कम रखिए।',
};

export function SetupPassword({ token }: { token: string }) {
  const [password, setPassword] = React.useState('');
  const [again, setAgain] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
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
      const response = await fetch('/api/admin/setup-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password, question, answer }),
      });

      const data = (await response.json()) as { ok: boolean; reason?: string };

      if (data.ok) {
        setTone('good');
        setMessage(MESSAGES.saved);
        setPassword('');
        setAgain('');
        setQuestion('');
        setAnswer('');

        // Straight to the panel. They have just proved who they are, so making
        // them type it again on the next screen would be asking twice.
        window.setTimeout(() => {
          window.location.href = '/admin';
        }, 1200);
        return;
      }

      setTone('error');
      setMessage(MESSAGES[data.reason ?? 'network'] ?? 'कुछ गड़बड़ हो गई।');
    } catch {
      setTone('error');
      setMessage(MESSAGES.network);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">अपना पासवर्ड बनाइए</h1>

      <p className="mt-3 text-ink-subtle">
        यह सिर्फ़ एक बार का काम है। जो पासवर्ड आप यहाँ लिखेंगे, वह इस साइट पर आपका दरवाज़ा
        बनेगा — और यह आपके बिना किसी और को कभी नहीं दिखेगा।
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4">
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
            दोबारा लिखिए
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

        {/*
          The recovery pair, asked right here rather than later.

          It is asked at setup for one reason: this is the only moment the owner
          is both present and unhurried. A nag afterwards gets dismissed, and a
          recovery that is set up after the password has already been forgotten
          is a recovery nobody can use exactly when they need it. Two examples
          under the box instead of rules above it — a person choosing a question
          wants to see what a good one looks like, not read a policy.
        */}
        <div className="rounded-[var(--radius)] border border-line bg-sun/10 p-4">
          <p className="font-semibold">अगर पासवर्ड भूल गए तो?</p>
          <p className="mt-1 text-sm text-ink-subtle">
            एक सवाल और उसका जवाब तय कीजिए। जब भी पासवर्ड याद न रहे, यही जवाब आपको अंदर
            ले जाएगा। दोनों सिर्फ़ आपके पास रहेंगे।
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="recovery-question" className="font-medium">
            सवाल
          </label>
          <input
            id="recovery-question"
            type="text"
            autoComplete="off"
            placeholder="जैसे: मेरी माँ का नाम क्या है?"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            required
            maxLength={200}
          />
          <p className="text-sm text-ink-subtle">
            कोई ऐसा सवाल जिसका जवाब सिर्फ़ आप जानते हैं — और जो आप भूलें नहीं।
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="recovery-answer" className="font-medium">
            जवाब
          </label>
          <input
            id="recovery-answer"
            type="text"
            autoComplete="off"
            placeholder="जैसे: सुनीता"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            required
            maxLength={200}
          />
          <p className="text-sm text-ink-subtle">
            बड़े-छोटे अक्षर और खाली जगह का फ़र्क नहीं पड़ता — लेकिन जो लिखेंगे वही याद रखिए।
          </p>
        </div>

        {mismatch && (
          <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-danger">
            दोनों बॉक्स में एक जैसा नहीं है।
          </p>
        )}

        {message && (
          <p
            role="status"
            className={
              'rounded-lg px-4 py-3 ' +
              (tone === 'good' ? 'bg-leaf/10 text-leaf' : 'bg-danger/10 text-danger')
            }
          >
            {message}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary text-lg">
          {busy ? 'बन रहा है…' : 'पासवर्ड बनाइए'}
        </button>
      </form>

      {/*
        The one thing worth saying out loud, because it is the whole reason this
        page is safe to hand somebody a link for.
      */}
      <p className="mt-6 rounded-lg bg-sun/10 px-4 py-3 text-sm text-ink-subtle">
        यह लिंक अपने आप बंद हो जाएगा जिस दिन आप पहली बार पासवर्ड बना लेंगे। उसके बाद यह
        कभी किसी का काम नहीं आएगा — इसलिए इसे चुपचाप रखा जा सकता है, कहीं भी।
      </p>
    </div>
  );
}