'use client';

import * as React from 'react';
import { localeTag, languageMeta } from '@/content/i18n';

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
   *
   * `values` carries what the sentence needs to mean something — for now just
   * `{name}` of the language that has no voice, because "no voice installed" on a
   * Hindi article read from a Tamil interface otherwise says nothing about which
   * voice is missing.
   */
  onError?: (reasonKey: string, values?: Record<string, string | number>) => void;
}

/**
 * Module-level, because a second click has to be able to kill the first one.
 *
 * `stopToken` is bumped on every new speak() and every stop: callbacks from an
 * older utterance check it before doing anything, so a queue that was cancelled
 * mid-sentence cannot keep walking and finish somebody else's answer.
 */
let stopToken = 0;

/**
 * The chunk of clear audio, if any, that is playing right now.
 *
 * The device's own voices are stopped by `synth.cancel()`, which speechSynthesis
 * handles for itself. Audio fetched from `/api/tts` is an `<audio>` element and
 * knows nothing about that cancel, so the current element and the way to settle
 * its waiting promise are held here — one pair, because chunks play strictly one
 * after another, never two at once.
 */
let networkAudio: HTMLAudioElement | null = null;
let releaseNetworkChunk: (() => void) | null = null;

/** Longest /api/tts may take to answer before the device voice takes over. */
const NETWORK_TTS_TIMEOUT_MS = 8_000;

/** Stop whatever clear audio is playing. Called by speak() and by stopSpeaking(). */
function stopNetworkSpeech(): void {
  const release = releaseNetworkChunk;
  if (release) {
    release();
  } else if (networkAudio) {
    try {
      networkAudio.pause();
    } catch {
      // A pause on an already-finished element throws nowhere worth catching.
    }
    networkAudio = null;
  }
}

/**
 * Plays one fetched chunk to its end, and reports whether it was heard.
 *
 * Resolves `true` only on `ended`: a file that errors, a play() the browser
 * refuses (autoplay policies on a first visit), or a stop arriving mid-sentence
 * all resolve `false`, which is the caller's signal to fall back rather than
 * leave the button spinning over silence.
 */
function playNetworkChunk(url: string, token: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (token !== stopToken) return resolve(false);

    const audio = new Audio(url);
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      try {
        audio.pause();
      } catch {
        // Settling twice is the goal here, not the failure.
      }
      audio.onended = null;
      audio.onerror = null;
      if (networkAudio === audio) networkAudio = null;
      if (releaseNetworkChunk) releaseNetworkChunk = null;
      resolve(ok);
    };

    networkAudio = audio;
    releaseNetworkChunk = () => finish(false);
    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.play().catch(() => finish(false));
  });
}

/**
 * The voice to use for a tag, or nothing.
 *
 * Any voice for the language qualifies — exact tag (`hi-IN`) or bare language
 * (`hi`), because Chrome on Android often reports `ta-IN` while some devices
 * only ship `ta` — but among those, the CLEAREST one wins, not the first.
 * See `voiceClarity` below for what "clear" means here and why the first
 * match was the wrong answer on Windows.
 *
 * Exported because "does this device have a Hindi voice?" is a question worth
 * asking of a plain list rather than of a live browser: the check that stops the
 * site reading Devanagari with an English voice is built on this, and it is the
 * kind of thing that passes by accident if it cannot be tested.
 */
export function bestVoiceFor(
  voices: SpeechSynthesisVoice[],
  tag: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const tagLower = tag.toLowerCase();
  const base = tag.split('-')[0].split('_')[0].toLowerCase();

  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;

  for (const voice of voices) {
    const lang = voice.lang.toLowerCase();
    const isExact = lang === tagLower;
    if (!isExact && lang.split(/[-_]/)[0] !== base) continue;

    let score = voiceClarity(voice);
    // The exact region tag only breaks ties between equally clear voices —
    // quality decides first, because a clear bare-language voice beats a
    // muffled exact-tag one every time a person has to listen to it.
    if (isExact) score += 5;

    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  return best;
}

/**
 * How clearly a voice is likely to sound, when a device offers more than one
 * for a language.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * The picker used to return the first voice whose language matched, and on
 * Windows that list usually starts with the muffled local SAPI voices
 * ("Microsoft Hemant", "Microsoft Swara") while the clear ones sit further
 * down. The owner heard exactly that and asked for "a good voice, one that can
 * be heard clearly". The speech API exposes no quality field, so the name and
 * the local/network flag are the only hints that exist:
 *
 *   100 — a neural/natural voice ("… (Natural) …", "… Neural …"). These are
 *         the clear, human-sounding ones, worth reaching for above everything.
 *    50 — Chrome's own "Google …" network voice. Not neural, but steady and
 *         far cleaner than anything installed locally.
 *    10 — any other network voice (localService false), fetched while speaking
 *         and usually better than what ships with the machine.
 *     0 — the local voice that is left.
 *
 * A voice with no hint in its name and no network behind it is the robotic
 * one — it still speaks, which is why it is the floor and not excluded.
 */
function voiceClarity(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (name.includes('natural') || name.includes('neural')) score += 100;
  if (name.startsWith('google')) score += 50;
  if (!voice.localService) score += 10;
  return score;
}

/**
 * Where the reading should come from on this device: its own voice, or the
 * clear audio from `/api/tts`.
 *
 * ── Why this is not `voiceClarity` ──────────────────────────────────────────
 * `voiceClarity` ranks voices *against each other*; this asks the blunter
 * question — is the device's best voice good enough to keep? The rule has to be
 * conservative, because the network path costs a fetch and can fail, while the
 * device path is instant:
 *
 *   - no voice for the language at all → network. Without this a phone with no
 *     regional pack reads Devanagari with an English voice, or says nothing;
 *   - the legacy Windows SAPI family ("Microsoft Hemant", "Microsoft Swara" —
 *     no "Natural" in the name) → network. These are the muffled ones the
 *     owner's own machine has, and they cannot be improved from the outside;
 *   - everything else → device. Apple's Siri voices, Samsung's, Chrome's Google
 *     voices and every neural voice are already clear, and no heuristic that
 *     merely fails to recognise a good voice should push a working phone onto
 *     the network for nothing.
 *
 * Exported for the same reason `bestVoiceFor` is: whether a device falls on the
 * muffled side of this line is exactly the kind of decision that passes by
 * accident if nothing can test it.
 */
export function playbackFor(voice: SpeechSynthesisVoice | null): 'device' | 'network' {
  if (!voice) return 'network';
  const name = voice.name.toLowerCase();
  const legacySapi =
    name.startsWith('microsoft') && !name.includes('natural') && !name.includes('neural');
  return legacySapi ? 'network' : 'device';
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
 *
 * ── And when the device has no voice for that language ─────────────────────
 * It says so and stops, rather than playing. See the check at the end.
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
  stopNetworkSpeech();
  stopToken += 1;
  const token = stopToken;

  const chunks = chunksForSpeech(text);
  if (chunks.length === 0) {
    options.onError?.('voice.speakFailed');
    return;
  }

  let index = 0;
  let started = false;

  const pickVoice = (): SpeechSynthesisVoice | null => bestVoiceFor(synth.getVoices(), tag);

  const done = () => {
    if (token !== stopToken) return;
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

    /*
     * `onstart` is the proof that the browser really began speaking.
     *
     * The silence check below used to look at `synth.speaking` instead, and on a
     * phone that is fetching a voice over the network `speaking` can still be
     * false a second later while everything is fine. That would have shown "could
     * not read this aloud" over audio that was about to play — a new bug in place
     * of the old one. This flag is only set by the event the browser fires when
     * it actually starts.
     */
    utterance.onstart = () => {
      started = true;
    };

    utterance.onend = () => {
      index += 1;
      speakNext();
    };

    utterance.onerror = (event) => {
      const reason = (event as unknown as { error?: string }).error;
      if (reason === 'interrupted' || reason === 'canceled') return; // our own cancel
      if (token !== stopToken) return;
      options.onError?.('voice.speakFailed');
    };

    /*
     * Some devices accept the utterance, report no error, and produce no sound
     * at all — usually because no voice exists for this script. The button then
     * looks like it worked, which is the worst outcome: the visitor waits, hears
     * nothing, and blames the answer. Three and a half seconds is long enough for
     * a voice to load and too long for a person to keep waiting in silence.
     */
    if (index === 0) {
      window.setTimeout(() => {
        if (token !== stopToken) return;
        if (!started) options.onError?.('voice.speakFailed');
      }, 3500);
    }

    synth.speak(utterance);
  };

  /*
   * The clear-audio path — for devices whose own voice is the muffled one.
   *
   * `/api/tts` speaks one chunk as real audio, so the visitor hears a clear
   * voice whatever their machine has installed. This is the owner's "other
   * users must hear a clear voice too" requirement, met without asking anyone
   * to change a setting: no voice pack, no OS dialog, no key — the site itself
   * brings the voice. Chunks play one at a time, the same sentence-by-sentence
   * walk the device queue takes, so a long article reads continuously.
   *
   * Every failure (offline, upstream refused, autoplay blocked, a stop button)
   * hands the remaining chunks to the device's own voice from the point of
   * failure, because muffled beats silent — and the honest "no voice for this
   * language" message is reserved for the case where there is no device voice
   * to fall back to either.
   */
  const fallbackToDevice = () => {
    if (token !== stopToken) return;
    const voices = synth.getVoices();
    if (voices.length === 0 || bestVoiceFor(voices, tag)) {
      speakNext(); // whatever the device has, even the muffled voice
      return;
    }
    // The list had loaded when the network path was chosen and held nothing for
    // this language; re-read it before refusing, because the list can change.
    stopToken += 1;
    synth.cancel();
    options.onError?.('voice.noVoice', { name: languageMeta(languageCode).native });
  };

  const speakNetwork = async (): Promise<void> => {
    while (index < chunks.length) {
      if (token !== stopToken) return;

      let url: string | null = null;
      let ok = false;
      try {
        const response = await fetch(
          `/api/tts?lang=${encodeURIComponent(languageCode)}&text=${encodeURIComponent(chunks[index])}`,
          { signal: AbortSignal.timeout(NETWORK_TTS_TIMEOUT_MS) },
        );
        if (!response.ok) throw new Error(`tts ${response.status}`);
        const blob = await response.blob();
        if (blob.size === 0) throw new Error('tts returned no audio');
        if (token !== stopToken) return;
        url = URL.createObjectURL(blob);
        ok = await playNetworkChunk(url, token);
      } catch {
        ok = false;
      } finally {
        if (url) URL.revokeObjectURL(url);
      }

      if (token !== stopToken) return;
      if (!ok) {
        console.warn(
          `[voice] clear-audio failed at chunk ${index + 1}/${chunks.length} — ` +
            'continuing with the device voice',
        );
        fallbackToDevice();
        return;
      }
      index += 1;
    }
    done();
  };

  /*
   * Who reads, and from where — decided once, at the click.
   *
   * ── The bug this replaced ─────────────────────────────────────────────────
   * Commit 12d36b7 meant to add "there is no voice for this language" and, in
   * doing so, removed the very first `speakNext()` — the check that replaced it
   * only ever reported and never started the queue. On every device WITH a
   * voice the button therefore played nothing and showed no error: the chunks
   * were ready and nobody ever called the queue. The comments above used to
   * describe speaking first and verifying afterwards; the speaking itself had
   * gone missing. Both branches below start speaking inside this function,
   * which is also what iOS needs — audio that begins inside the user's gesture.
   *
   * The three cases:
   *
   *   - list not loaded yet → speak immediately anyway (waiting for
   *     `voiceschanged` would land speech outside the click's gesture and
   *     Safari would refuse it), then verify the moment the list arrives;
   *   - a clear device voice → speak with it. Phones, iPhone, Edge and Chrome's
   *     own Google voices are already clear, and the device path is instant:
   *     no fetch, no latency;
   *   - only the legacy muffled Windows voice, or none at all → read the clear
   *     audio from `/api/tts`, falling back per chunk if it fails.
   */
  const loaded = synth.getVoices();

  if (loaded.length === 0) {
    speakNext();

    const verify = () => {
      const arrived = synth.getVoices();
      if (arrived.length === 0) return; // still no verdict
      synth.removeEventListener('voiceschanged', verify);
      if (!bestVoiceFor(arrived, tag)) {
        // Bumping the token kills the queue, the silence timer and any late `onend`.
        stopToken += 1;
        synth.cancel();
        options.onError?.('voice.noVoice', { name: languageMeta(languageCode).native });
      }
    };
    synth.addEventListener('voiceschanged', verify);
    window.setTimeout(() => {
      // Still nothing after this long: let it play best-effort rather than show
      // a message that might be wrong about a slow device.
      synth.removeEventListener('voiceschanged', verify);
    }, 1600);
    return;
  }

  const deviceVoice = bestVoiceFor(loaded, tag);

  if (playbackFor(deviceVoice) === 'network') {
    void speakNetwork();
    return;
  }

  if (!deviceVoice) {
    // Unreachable in practice — `playbackFor(null)` is 'network' — kept so a
    // future change to that rule cannot silently skip the honest message.
    stopToken += 1;
    synth.cancel();
    options.onError?.('voice.noVoice', { name: languageMeta(languageCode).native });
    return;
  }

  speakNext();
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
 * ── Why a hundred and twenty characters, and not two hundred ───────────────
 * The cutoff being avoided is measured in seconds, not letters, so the safe
 * length depends on how fast the language is spoken. Devanagari at 0.85 speed
 * runs at roughly twelve characters a second, which puts a 120-character chunk
 * at ten seconds — comfortably inside the fifteen-second limit Chrome enforces,
 * with room for a slower voice. Two hundred characters was the first attempt and
 * it landed right on the edge, which is not where a limit should be.
 *
 * Exported because it is the only part of speech that can be tested without a
 * browser, and it is the part that was actually broken.
 */
export function chunksForSpeech(text: string, limit = 120): string[] {
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
  // Unconditional: the network path settles on the token too, and a page that
  // somehow lacks speechSynthesis can still have an `<audio>` element talking.
  stopToken += 1;
  stopNetworkSpeech();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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