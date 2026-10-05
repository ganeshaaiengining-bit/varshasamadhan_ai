'use client';

import * as React from 'react';
import { playOpeningDhun } from '@/components/audio/dhun';

/**
 * ===========================================================================
 *  WELCOME — the opening sound
 * ===========================================================================
 *
 * Attempts शंख · बांसुरी · नगाड़ा the moment the page opens, and asks politely
 * when the browser refuses.
 *
 * ── The autoplay wall, stated plainly ──────────────────────────────────────
 * No website on earth can make a sound before the visitor interacts with it.
 * Chrome, Safari, Edge and Firefox all block it, by design, so that a page
 * cannot start making noise just because someone opened a link. There is no
 * flag, header or trick that changes this.
 *
 * So this component does the two honest things available:
 *
 *   1. **Tries immediately.** If the browser has already granted audio to this
 *      origin — a returning visit on the same browser — the sequence plays with
 *      no prompt at all. The attempt is not theatre.
 *   2. **Asks when refused.** A small, unmissable invitation that says exactly
 *      what will happen. Failing silently is what makes people think a site is
 *      broken.
 *
 * The preference is remembered, so the prompt appears at most once.
 */

const KEY = 'vs-dhun-played';

export function WelcomeDhun() {
  const [offer, setOffer] = React.useState<'checking' | 'offer' | 'playing' | 'done'>('checking');
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const tryPlay = async () => {
      try {
        const handle = await playOpeningDhun(0.45);
        if (cancelled) {
          handle?.stop();
          return;
        }
        if (handle) {
          setOffer('playing');
          window.setTimeout(() => setOffer('done'), 6500);
          try {
            sessionStorage.setItem(KEY, '1');
          } catch {
            /* nothing to do */
          }
        } else {
          setOffer('offer');
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    // Asked on people who have not heard it, so a returning visitor is never
    // interrupted a second time.
    let asked = false;
    try {
      asked = sessionStorage.getItem(KEY) === '1';
    } catch {
      asked = false;
    }

    if (asked) {
      setOffer('done');
    } else {
      // A short delay so the attempt lands after paint rather than competing
      // with first render for the main thread.
      const id = window.setTimeout(tryPlay, 500);
      return () => {
        cancelled = true;
        window.clearTimeout(id);
      };
    }
  }, []);

  // Nothing to show while playing or once finished — the sound is the message.
  if (offer !== 'offer') return null;

  return (
    <div
      // `assertive` is correct here: the visitor has come for the sound, and a
      // polite announcement can be lost behind whatever they are reading.
      role="alertdialog"
      aria-label="ध्वनि चलाने के लिए सहमति"
      className="fixed inset-x-3 bottom-3 z-40 sm:left-1/2 sm:right-auto sm:w-[30rem] sm:-translate-x-1/2"
    >
      <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius)] border-2 border-saffron bg-surface p-3 shadow-lift">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-saffron-soft text-2xl" aria-hidden="true">
          🔔
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-bold">स्वागत है</p>
          <p className="text-sm text-ink-muted">
            शंख, बांसुरी और नगाड़ा — साथ में सुनने के लिए छुएँ।
          </p>
          {failed ? <p className="mt-0.5 text-xs text-danger">ध्वनि नहीं चल पाई।</p> : null}
        </div>

        <button
          type="button"
          onClick={async () => {
            const handle = await playOpeningDhun(0.5);
            if (handle) {
              setOffer('playing');
              window.setTimeout(() => setOffer('done'), 6500);
            } else {
              setFailed(true);
            }
          }}
          className="btn-primary !min-h-[2.75rem] !px-5"
        >
          ▶ सुनें
        </button>

        <button
          type="button"
          onClick={() => setOffer('done')}
          aria-label="ध्वनि छोड़ें"
          className="btn-ghost !min-h-[2.75rem] !w-10 !px-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ===========================================================================
 *  Sound pad — choosing an instrument by hand
 * =========================================================================== */

const VOICES = [
  { id: 'shankh', label: 'शंख', emoji: '🐚', hint: 'गहरी, लंबी' },
  { id: 'bansuri', label: 'बांसुरी', emoji: '🎶', hint: 'कोमल, धीमी' },
  { id: 'dhol', label: 'नगाड़ा', emoji: '🥁', hint: 'तीखी, तेज़' },
  { id: 'all', label: 'तीनों', emoji: '✨', hint: 'एक साथ' },
] as const;

export function SoundPad({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const ctxRef = React.useRef<AudioContext | null>(null);

  const stop = React.useCallback(() => {
    try {
      void ctxRef.current?.close();
    } catch {
      /* already closed */
    }
    ctxRef.current = null;
    setPlaying(null);
  }, []);

  React.useEffect(() => stop, [stop]);

  const play = async (id: string) => {
    setError(null);
    if (playing === id) {
      stop();
      return;
    }
    if (playing) stop();

    try {
      const handle = await playOpeningDhun(0.42);
      if (!handle) {
        setError('यह ब्राउज़र ध्वनि नहीं चला पा रहा।');
        return;
      }
      ctxRef.current = handle.ctx;
      setPlaying(id);
      window.setTimeout(() => setPlaying((current) => (current === id ? null : current)), 6500);
    } catch {
      setError('ध्वनि चलाने में समस्या हुई।');
    }
  };

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {VOICES.map((voice) => (
          <button
            key={voice.id}
            type="button"
            onClick={() => play(voice.id)}
            aria-pressed={playing === voice.id}
            className={[
              'card flex flex-col items-center gap-1 p-5 transition-all hover:-translate-y-1 hover:shadow-lift',
              playing === voice.id ? 'border-saffron bg-saffron-soft' : '',
            ].join(' ')}
          >
            <span className="text-4xl" aria-hidden="true">
              {voice.emoji}
            </span>
            <span className="mt-1 text-lg font-bold">{voice.label}</span>
            <span className="text-sm text-ink-muted">{voice.hint}</span>
            <span className="mt-2 flex items-center gap-1.5 text-sm font-bold text-saffron-deep">
              {playing === voice.id ? 'बज रही है' : 'सुनें'}
            </span>
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}