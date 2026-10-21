'use client';

import * as React from 'react';
import { localeTag } from '@/content/i18n';

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

/**
 * The tag for a site language code, for both speech recognition and speech
 * output.
 *
 * Delegates to `localeTag` in `i18n.ts` rather than keeping its own table. Two
 * copies of this mapping is how the date on a review, the voice reading an
 * article, and the language the AI writes in end up disagreeing with each other,
 * and none of the three would show an error when it happened.
 */
export function speechTag(languageCode: string): string {
  return localeTag(languageCode);
}

/** Human-readable error text in the visitor's language. */
const ERROR_KEYS: Record<string, string> = {
  'not-allowed': 'voice.notAllowed',
  'service-not-allowed': 'voice.serviceNotAllowed',
  'no-speech': 'voice.noSpeech',
  'audio-capture': 'voice.audioCapture',
  network: 'voice.network',
  aborted: 'voice.aborted',
};

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

  /*
   * Whether this browser can listen, worked out after the first paint.
   *
   * It used to be read during render:
   *
   *     supported: typeof window !== 'undefined' && recognitionCtor() !== null
   *
   * which is the textbook hydration mismatch. The server has no `window`, so it
   * always answered false; the browser, on a machine with Chrome or Edge,
   * answered true. React then found the rendered title, aria-pressed and class
   * of the microphone button describing a button that does not work, on a page
   * where the button works — and refused to correct it, because by then a user
   * could have clicked it.
   *
   * So it starts as false on both sides and is set once in an effect. The cost
   * is that the button's tooltip is briefly the generic one. The benefit is that
   * the HTML React sent and the HTML React received agree, which is the only
   * version in which clicking the button does what it looks like it does.
   *
   * It is set in an effect rather than lazily initialised because lazy
   * initialisation runs on the client during the first render — the same
   * render, a fraction of a second later — and produces exactly the same
   * mismatch with a tidier-looking line of code.
   */
  const [supported, setSupported] = React.useState(false);

  React.useEffect(() => {
    setSupported(recognitionCtor() !== null);
  }, []);

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
      setError('ask.micUnsupported|');
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
      // The raw key is returned so the caller can translate it; the Hindi text is
      // kept for anyone calling this hook without a language context.
      const key = ERROR_KEYS[event.error] ?? 'voice.generic';
      setError(`${key}|${ERROR_MESSAGES[event.error] ?? ''}`);
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

  return {
    state,
    interim,
    error,
    start,
    stop,
    // Held in state, set once after mount. See the note where it is declared.
    supported,
  };
}

// ---------------------------------------------------------------------------
// Speech output
// ---------------------------------------------------------------------------

export interface SpeakOptions {
  rate?: number;
  /** Site language code, e.g. `ta`. Decides both the utterance tag and the voice. */
  language?: string;
  onEnd?: () => void;
  /**
   * Receives a translation key, not a finished sentence, so the caller can
   * render it in the visitor's language.
   */
  onError?: (reasonKey: string) => void;
}

/**
 * Module-level, because a second click has to be able to kill the first one.
 *
 * `stopToken` is bumped on every new speak() and every stop: callbacks from an
 * older utterance check it before doing anything, so a queue that was cancelled
 * mid-sentence cannot keep walking and finish somebody else's answer.
 */
let keepAlive: number | null = null;
let stopToken = 0;

function clearKeepAlive(): void {
  if (keepAlive !== null) {
    window.clearInterval(keepAlive);
    keepAlive = null;
  }
}

/**
 * Speaks text aloud, slowly, in the visitor's chosen language.
 *
 * `rate` defaults to 0.85 rather than 1. The browser default is pitched at a
 * clear young speaker; for a 70-year-old on a small phone speaker, that is
 * simply too fast to follow, and a user who cannot follow the answer will
 * assume there was none.
 *
 * ── Why the language is a parameter ────────────────────────────────────────
 * This used to hardcode `hi-IN` and look for a voice matching `/^hi/`. That was
 * correct while the whole site was Hindi. Once a visitor could pick Tamil, the
 * answer came back in Tamil and was then read by a Hindi voice — which does not
 * merely sound wrong, it produces something the listener cannot decipher while
 * having no way to tell that the *audio* is at fault rather than the answer.
 * Matching the voice to the answer's language is the whole point of having a
 * read-aloud button on a multilingual page.
 */
export function speak(
  text: string,
  options: SpeakOptions = {},
) {
  const languageCode = options.language ?? 'hi';
  const tag = speechTag(languageCode);

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.('voice.speakFailed');
    return;
  }

  const synth = window.speechSynthesis;

  // Anything queued from a previous click would keep talking over the new answer.
  synth.cancel();
  clearKeepAlive();
  stopToken += 1;
  const token = stopToken;

  const chunks = chunksForSpeech(text);
  if (chunks.length === 0) {
    options.onError?.('voice.speakFailed');
    return;
  }

  let index = 0;

  const pickVoice = (): SpeechSynthesisVoice | null => {
    const voices = synth.getVoices();
    if (voices.length === 0) return null;

    /*
     * An exact tag match first, then a bare-language match. Chrome on Android
     * often reports `ta-IN` but some devices only ship `ta`, and a bare match
     * beats the default voice by a wide margin.
     */
    const exact = voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;

    const base = tag.split('-')[0].toLowerCase();
    return voices.find((v) => v.lang.toLowerCase().split(/[-_]/)[0] === base) ?? null;
  };

  const done = () => {
    if (token !== stopToken) return;
    clearKeepAlive();
    options.onEnd?.();
  };

  const speakNext = () => {
    if (token !== stopToken) return;

    if (index >= chunks.length) {
      done();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = tag;
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = 1;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      index += 1;
      speakNext();
    };

    utterance.onerror = (event) => {
      const reason = (event as unknown as { error?: string }).error;
      if (reason === 'interrupted' || reason === 'canceled') return; // our own cancel
      if (token !== stopToken) return;
      clearKeepAlive();
      options.onError?.('voice.speakFailed');
    };

    /*
     * Some devices accept the utterance, report no error, and produce no sound
     * at all — usually because no voice exists for this script. The button then
     * looks like it worked, which is the worst outcome: the visitor waits, hears
     * nothing, and blames the answer. This is the check that turns silence into
     * a sentence they can read.
     */
    if (index === 0) {
      window.setTimeout(() => {
        if (token !== stopToken) return;
        if (index === 0 && !synth.speaking && !synth.pending) {
          clearKeepAlive();
          options.onError?.('voice.speakFailed');
        }
      }, 1400);
    }

    synth.speak(utterance);
  };

  /*
   * Speak at once, rather than waiting for `voiceschanged`.
   *
   * The old version waited for the voice list before calling speak(), and only
   * called speak() inside that callback. On iOS the callback runs outside the
   * click's user gesture, and Safari refuses speech that was not started by a
   * gesture — so the button did nothing at all on the devices whose voice list
   * loads a moment late. Speaking now, with a null voice and the right `lang`,
   * lets the browser choose; a later chunk picks up the better voice once the
   * list arrives.
   */
  speakNext();

  // Chrome on desktop cuts long speech off after about fifteen seconds unless
  // it is nudged. The chunks keep most answers under that; this catches the
  // rest, and a nudge on a browser that does not need it is harmless.
  keepAlive = window.setInterval(() => {
    if (token !== stopToken) return;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      synth.resume();
    }
  }, 9000);
}

/**
 * Split text into speakable chunks.
 *
 * ── Why a chunk at all ──────────────────────────────────────────────────────
 * Because a single utterance of a whole answer is what makes the audio stop
 * halfway. Chrome (especially on Android) drops utterances after roughly
 * fifteen seconds, so a bhajan or an aarti read as one string simply ends part
 * of the way through, with no error and no way to know why. Feeding it sentence
 * by sentence keeps every piece short enough to finish, and the queue makes it
 * sound continuous.
 *
 * Sentences are cut on the marks that actually end one in these languages — the
 * Devanagari danda, the double danda, full stops, question marks, exclamation
 * marks and newlines — and a sentence too long for one chunk is split again at
 * spaces so no chunk is ever a single unbroken run.
 *
 * Exported because it is the only part of speech that can be tested without a
 * browser, and it is the part that was actually broken.
 */
export function chunksForSpeech(text: string, limit = 170): string[] {
  const clean = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
  if (clean.length === 0) return [];

  const sentences: string[] = [];
  let current = '';

  for (const ch of clean) {
    current += ch;
    if (ch === '।' || ch === '॥' || ch === '.' || ch === '!' || ch === '?' || ch === '\n') {
      if (current.trim()) sentences.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) sentences.push(current.trim());

  const chunks: string[] = [];
  let buffer = '';

  const push = (piece: string) => {
    if (buffer.length > 0 && buffer.length + 1 + piece.length > limit) {
      chunks.push(buffer);
      buffer = piece;
      return;
    }
    buffer = buffer.length > 0 ? `${buffer} ${piece}` : piece;
  };

  for (const sentence of sentences) {
    if (sentence.length <= limit) {
      push(sentence);
      continue;
    }

    // A single long sentence: break it at spaces.
    let rest = sentence;
    while (rest.length > limit) {
      const cut = rest.lastIndexOf(' ', limit);
      const take = cut > limit * 0.4 ? cut : limit;
      push(rest.slice(0, take).trim());
      rest = rest.slice(take).trim();
    }
    if (rest) push(rest);
  }

  if (buffer) chunks.push(buffer);
  return chunks;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    stopToken += 1;
    clearKeepAlive();
    window.speechSynthesis.cancel();
  }
}

/* ===========================================================================
 *  Removed
 *  ===========================================================================
 *
 *  `isVoiceInputSupported()` — superseded by the `supported` flag already
 *  returned from `useVoiceInput()`, which every caller used instead. Two ways to
 *  ask the same question is how one of them stops being updated.
 */

/** True when the machine has any Hindi voice at all — surfaced in the admin panel. */
export function hindiVoiceInstalled(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.getVoices().some((v) => /^hi(-|_|$)/i.test(v.lang));
}

/**
 * True when a voice exists for the chosen language.
 *
 * Kept because it is the check that belongs in front of the read-aloud button:
 * discovering the problem only when `speak()` fails is worse, because the button
 * appears to work, nothing is heard, and someone who cannot see the screen has
 * no way to know the audio path is at fault rather than the answer. Nothing calls
 * it yet, which is why it is documented rather than left looking load-bearing.
 */
export function voiceInstalledFor(languageCode: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const tag = speechTag(languageCode);
  const base = tag.split('-')[0].toLowerCase();
  return window.speechSynthesis
    .getVoices()
    .some((v) => v.lang.toLowerCase().split(/[-_]/)[0] === base);
}