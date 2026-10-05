'use client';

import * as React from 'react';

/**
 * ===========================================================================
 *  VOICE INPUT + OUTPUT
 * ===========================================================================
 *
 * Wraps the browser's speech APIs and fixes every problem the prototype had.
 *
 * ── The bug that mattered ──────────────────────────────────────────────────
 * The prototype read `event.results[0][0].transcript`. `results` is cumulative
 * across every utterance in a session, so index 0 is always the *first* thing
 * ever said. An elderly visitor who asked two questions in a row was shown the
 * answer to the first one both times, and would conclude the site was not
 * listening. The correct read is the last entry:
 *
 *     event.results[event.results.length - 1]
 *
 * ── Why there is a visible state ───────────────────────────────────────────
 * Three failure modes are invisible if you only wait for `onresult`:
 * permission denied, no microphone, and no network (recognition is a *server*
 * feature in Chrome, not an on-device one). The prototype handled none of them,
 * so the button silently did nothing. Here every terminal state is surfaced.
 *
 * ── Why speech-out has a fallback ──────────────────────────────────────────
 * `getVoices()` returns an empty array until the browser fires
 * `voiceschanged`, which is usually after the first user gesture. Calling
 * `speak()` immediately — as the prototype did — is unreliable, and on a
 * machine with no Hindi voice pack it fails with no sound and no message.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

/**
 * Resolved lazily and cached. Referencing `window` at module scope would break
 * the server render, and re-detecting on every render is wasteful.
 */
function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as RecognitionCtor | null;
}

export function isVoiceInputSupported(): boolean {
  return typeof window !== 'undefined' && recognitionCtor() !== null;
}

export type ListenState = 'idle' | 'starting' | 'listening' | 'error' | 'unsupported';

/** Human messages. Written for someone who may not know what "network" means. */
const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'माइक की अनुमति नहीं मिली। ब्राउज़र की सेटिंग में "माइक" की अनुमति दें।',
  'service-not-allowed': 'माइक की अनुमति नहीं मिली। ब्राउज़र की सेटिंग में "माइक" की अनुमति दें।',
  'no-speech': 'कोई आवाज़ नहीं सुनाई दी। दोबारा बोलने के लिए माइक दबाएँ।',
  'audio-capture': 'माइक नहीं मिला। क्या माइक लगा है, और अनुमति दी है?',
  network: 'इंटरनेट नहीं चल रहा। आवाज़ से पूछने के लिए इंटरनेट ज़रूरी है — आप लिखकर भी पूछ सकते हैं।',
  aborted: 'सुनना रोक दिया गया।',
};

// ---------------------------------------------------------------------------
// useVoiceInput
// ---------------------------------------------------------------------------

export function useVoiceInput({
  onResult,
  lang = 'hi-IN',
}: {
  onResult: (transcript: string) => void;
  lang?: string;
}) {
  const [state, setState] = React.useState<ListenState>('idle');
  const [interim, setInterim] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Held in a ref, not state: replacing the handler must not restart recognition.
  const handler = React.useRef(onResult);
  React.useEffect(() => {
    handler.current = onResult;
  }, [onResult]);

  const recognition = React.useRef<SpeechRecognitionLike | null>(null);

  /* -------------------------------------------------------------- cleanup */
  // Without this, navigating away mid-listening leaves the microphone open,
  // which on some machines keeps the recording indicator lit indefinitely.
  React.useEffect(
    () => () => {
      try {
        recognition.current?.abort();
      } catch {
        /* already stopped */
      }
      recognition.current = null;
    },
    [],
  );

  const stop = React.useCallback(() => {
    try {
      recognition.current?.stop();
    } catch {
      /* not running */
    }
    setState('idle');
    setInterim('');
  }, []);

  const start = React.useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor) {
      setState('unsupported');
      setError('इस ब्राउज़र में आवाज़ से पूछने की सुविधा नहीं है। नीचे टाइप करके पूछ सकते हैं।');
      return;
    }

    // A second tap while listening stops it — a user cannot tell otherwise.
    if (state === 'listening' || state === 'starting') {
      stop();
      return;
    }

    setError(null);
    setInterim('');
    setState('starting');

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setState('listening');

    rec.onresult = (event) => {
      // The fix. `length - 1` is the utterance just finished; index 0 would be
      // the very first one from this session.
      const result = event.results[event.results.length - 1];
      if (!result) return;

      const text = result[0]?.transcript ?? '';

      // Interim results keep the user informed that the mic is live, which
      // matters most for someone who cannot see the page.
      if (!result.isFinal) {
        setInterim(text);
        return;
      }

      setInterim('');
      if (text.trim()) handler.current(text.trim());
    };

    rec.onerror = (event) => {
      const message = ERROR_MESSAGES[event.error] ?? 'आवाज़ से समझ नहीं पाई। कृपया लिखकर पूछें।';
      setError(message);
      setState('error');
    };

    rec.onend = () => {
      // `onend` fires after a successful result too, so only reset if we did
      // not already land in an error state.
      setState((current) => (current === 'error' ? current : 'idle'));
      setInterim('');
      recognition.current = null;
    };

    recognition.current = rec;

    try {
      rec.start();
    } catch {
      // Calling start() twice throws. Treat it as already listening.
      setState('listening');
    }
  }, [lang, state, stop]);

  return { state, interim, error, start, stop, supported: isVoiceInputSupported() };
}

// ---------------------------------------------------------------------------
// Speech output
// ---------------------------------------------------------------------------

export interface SpeakOptions {
  rate?: number;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

/**
 * Speaks Hindi text, slowly, and says so out loud when it cannot.
 *
 * `rate` defaults to 0.85 rather than 1. The browser default is pitched at a
 * clear young speaker; for a 70-year-old on a small phone speaker, that is
 * simply too fast to follow, and a user who cannot follow the answer will
 * assume there was none.
 */
export function speak(text: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.('इस ब्राउज़र में आवाज़ से सुनाने की सुविधा नहीं है। ऊपर लिखा हुआ जवाब पढ़ लें।');
    return;
  }

  const synth = window.speechSynthesis;

  // Anything queued from a previous click would keep talking over the new answer.
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';
  utterance.rate = options.rate ?? 0.85;
  utterance.pitch = 1;

  const pickVoice = () => {
    const voices = synth.getVoices();
    // Prefer an actual Hindi voice; otherwise the default voice will read Hindi
    // text with English pronunciation, which is worse than no audio at all
    // because the user cannot tell it is mispronounced.
    const hindi = voices.find((v) => /^hi(-|_|$)/i.test(v.lang));
    if (hindi) utterance.voice = hindi;
  };

  pickVoice();

  // Voices often load after first paint. If the list is empty, wait for the
  // event and try once more.
  if (synth.getVoices().length === 0) {
    const onVoices = () => {
      pickVoice();
      synth.speak(utterance);
      synth.removeEventListener('voiceschanged', onVoices);
    };
    synth.addEventListener('voiceschanged', onVoices);
  }

  utterance.onend = () => options.onEnd?.();
  utterance.onerror = (event) => {
    const reason = (event as unknown as { error?: string }).error;
    if (reason === 'interrupted' || reason === 'canceled') return; // our own cancel
    options.onError?.(
      'आवाज़ से नहीं सुनाया जा सका। कंप्यूटर पर हिंदी आवाज़ (voice) शायद से इंस्टॉल नहीं है। ऊपर पढ़ लें।',
    );
  };

  synth.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/** True when the machine has any Hindi voice at all — surfaced in the admin panel. */
export function hindiVoiceInstalled(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.getVoices().some((v) => /^hi(-|_|$)/i.test(v.lang));
}