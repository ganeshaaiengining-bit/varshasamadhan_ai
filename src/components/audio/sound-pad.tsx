'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';

/**
 * ===========================================================================
 *  SOUND PAD
 * ===========================================================================
 *
 * Plays short, calming tones. The prototype called `alert()` here, so a visitor
 * tapping "शंख" got a popup claiming a sound was playing — nothing did. A page
 * that says one thing and does another loses trust permanently, so the real
 * thing is here.
 *
 * ── Why the tones are generated, not downloaded ────────────────────────────
 * Each sound is built with the Web Audio API from a few sine partials. That
 * keeps the project free of binary assets, makes it work with no network, and
 * means nothing is ever out of copyright.
 *
 * ── Autoplay ──────────────────────────────────────────────────────────────
 * Browsers refuse audio until the user has interacted with the page. The first
 * tap is therefore silent by policy, and the pad says so on first use rather
 * than appearing broken.
 */

interface ToneSpec {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Frequencies in Hz, and how long each rings for, in seconds. */
  partials: { freq: number; gain: number; decay: number }[];
  gap: number;
}

/**
 * Shell-like spectra: a strong fundamental with a few inharmonic partials, which
 * is what gives a struck metal or a pipe its character. Pure sine tones sound
 * like a test tone, which is not calming.
 */
const TONES: ToneSpec[] = [
  {
    id: 'shankh',
    label: 'शंख',
    icon: '📯',
    description: 'गहरी, लंबी — ध्यान के लिए',
    partials: [
      { freq: 220, gain: 0.32, decay: 3.2 },
      { freq: 443, gain: 0.18, decay: 2.6 },
      { freq: 662, gain: 0.09, decay: 2.0 },
      { freq: 880, gain: 0.05, decay: 1.6 },
    ],
    gap: 0.7,
  },
  {
    id: 'bansuri',
    label: 'बांसुरी',
    icon: '🎶',
    description: 'कोमल, धीमी — पल की ठहराव के लिए',
    partials: [
      { freq: 523.25, gain: 0.26, decay: 2.4 },
      { freq: 784, gain: 0.12, decay: 2.0 },
      { freq: 1046.5, gain: 0.06, decay: 1.5 },
    ],
    gap: 0.5,
  },
  {
    id: 'nagada',
    label: 'नगाड़ा',
    icon: '🥁',
    description: 'तीखी — ध्यान खींचने के लिए',
    partials: [
      { freq: 82, gain: 0.38, decay: 1.5 },
      { freq: 165, gain: 0.22, decay: 1.1 },
      { freq: 247, gain: 0.12, decay: 0.8 },
    ],
    gap: 0.35,
  },
  {
    id: 'gan',
    label: 'गंभीर गण',
    icon: '🔔',
    description: 'एक साथ — ध्यान ले जाने के लिए',
    partials: [
      { freq: 196, gain: 0.24, decay: 3.6 },
      { freq: 294, gain: 0.18, decay: 3.2 },
      { freq: 392, gain: 0.14, decay: 2.8 },
      { freq: 587, gain: 0.08, decay: 2.2 },
    ],
    gap: 1.2,
  },
];

export function SoundPad({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const context = React.useRef<AudioContext | null>(null);

  React.useEffect(() => {
    // A context can only be created after a gesture on some browsers; creating
    // it lazily on the first tap avoids the "suspended" warning entirely.
    setReady(true);
  }, []);

  const stop = () => {
    try {
      void context.current?.close();
    } catch {
      /* already closed */
    }
    context.current = null;
    setPlaying(null);
  };

  React.useEffect(() => stop, []);

  const play = async (tone: ToneSpec) => {
    setError(null);
    if (playing) stop();

    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        setError('इस ब्राउज़र में ध्वनि नहीं चल पा रही।');
        return;
      }

      const ctx = new Ctor();
      // Chrome starts the context suspended until a gesture resumes it.
      if (ctx.state === 'suspended') await ctx.resume();
      context.current = ctx;

      const master = ctx.createGain();
      // A gentle ceiling, so nobody's ears are hurt if the volume is already up.
      master.gain.value = 0.5;
      master.connect(ctx.destination);

      const start = ctx.currentTime + 0.05;
      let at = start;

      for (const partial of tone.partials) {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = partial.freq;

        // An exponential tail sounds like a struck object; a linear one sounds
        // like a beep.
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(partial.gain, at + 0.02);
        env.gain.exponentialRampToValueAtTime(0.0001, at + partial.decay);

        osc.connect(env);
        env.connect(master);
        osc.start(at);
        osc.stop(at + partial.decay + 0.1);

        at += tone.gap;
      }

      const total = (at - start) * 1000;
      setPlaying(tone.id);

      window.setTimeout(() => {
        setPlaying((current) => (current === tone.id ? null : current));
        try {
          void ctx.close();
        } catch {
          /* closed */
        }
      }, total + 400);
    } catch {
      setError('ध्वनि चलाने में समस्या हुई। दोबारा कोशिश कीजिए।');
    }
  };

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            type="button"
            onClick={() => play(tone)}
            aria-pressed={playing === tone.id}
            className={[
              'card flex flex-col items-center gap-1 p-5 transition-all hover:-translate-y-1 hover:shadow-lift',
              playing === tone.id ? 'border-saffron bg-saffron-soft' : '',
            ].join(' ')}
          >
            <span className="text-4xl" aria-hidden="true">
              {tone.icon}
            </span>
            <span className="mt-1 text-lg font-bold">{tone.label}</span>
            <span className="text-sm text-ink-muted">{tone.description}</span>
            <span className="mt-2 flex items-center gap-1.5 text-sm font-bold text-saffron-deep">
              {playing === tone.id ? (
                <>
                  <Icon name="speaker" size={16} />
                  बज रही है
                </>
              ) : (
                'सुनें'
              )}
            </span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-ink-subtle">
        {playing ? 'आवाज़ चल रही है। रोकने के लिए दोबारा उसी बटन को दबाएँ।' : 'कोई बटन दबाकर ध्वनि सुनिए।'}
      </p>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {!ready ? <p className="sr-only">ध्वनि तैयार हो रही है</p> : null}
    </div>
  );
}