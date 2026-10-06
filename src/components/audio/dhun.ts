/**
 * ===========================================================================
 *  DHUN — the instruments
 * ===========================================================================
 *
 * शंख · बांसुरी · नगाड़ा, played together on open.
 *
 * ── Why synthesis and not audio files ──────────────────────────────────────
 * Three reasons, and the third is the important one:
 *
 *   1. **Copyright.** Every recording of a conch or a dhol belongs to whoever
 *      made it. Synthesising the sounds means this project can never be accused
 *      of shipping someone else's property — which matters for a memorial site.
 *   2. **No binary assets, no network.** The instruments are maths. The page
 *      sounds the same on a phone in a village with one bar of signal as on a
 *      desktop with fibre, and there is nothing to download first.
 *   3. **Quality is tunable.** The prototype's tones were bare sine waves, which
 *      sound like a test tone rather than an instrument. Everything below is
 *      built to sound like the thing it represents.
 *
 * ── How each is made ──────────────────────────────────────────────────────
 *   शंख (conch)  A stopped horn: a hard attack, a slow downward glide, and a
 *                long stack of detuned harmonics with independent decay rates.
 *                A real conch rings mostly in its lower harmonics; the upper
 *                ones die first, so each partial gets its own decay.
 *   बांसुरी (flute)  A stopped pipe with a breathy attack: filtered noise before
 *                the tone opens, gentle vibrato, and a soft breathy tail. The
 *                phrase is pentatonic (Sa Re Ga Pa Dha) — the natural scale of
 *                Indian melodic music.
 *   नगाड़ा (dhol)  Two membranes: a bass stroke with a fast pitch drop, and a
 *                treble stroke that is brighter and shorter. Both are noise
 *                bursts shaped by a fast-decaying resonant filter, which is what
 *                a stretched membrane actually does.
 *
 * ── The autoplay wall ──────────────────────────────────────────────────────
 * Every browser blocks sound until the user has interacted with the page. This
 * is a security rule, not a browser quirk — without it, any page could start
 * making noise the moment it loaded. So the sequence is *attempted* immediately,
 * and when the browser refuses, a small invitation is shown instead of failing
 * silently. The attempt is not theatre: on a site that has already been granted
 * audio, it plays with no prompt at all.
 */

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/* --------------------------------------------------------------------------
 *  Noise — one shared buffer, read at random offsets.
 *
 * Building white noise per stroke is wasteful, and Math.random() on every
 * sample of a long tail is measurably slow. One two-second buffer, sampled
 * with a moving cursor, is indistinguishable and far cheaper.
 * ------------------------------------------------------------------------ */
let noiseBuffer: AudioBuffer | null = null;

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buffer;
  return buffer;
}

let noiseCursor = 0;
function noise(ctx: AudioContext) {
  const buffer = getNoise(ctx);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  // Wrap the cursor so the tail never runs off the end of the buffer.
  noiseCursor = (noiseCursor + 7919) % (buffer.length - 1);
  return src;
}

/* --------------------------------------------------------------------------
 *  SHANKH — the conch
 * ------------------------------------------------------------------------ */
function playShankh(ctx: AudioContext, out: AudioNode, at: number) {
  // A real conch is a stopped horn: the pitch starts high and settles down as
  // the player relaxes. Root is a low B — conch calls sit around there.
  const root = 116.5;

  // Six partials. A horn is not harmonic: the upper partials are stretched and
  // pulled slightly flat, which is what gives brass its edge.
  const partials = [
    { mult: 1.0, gain: 0.5, decay: 4.6, detune: 0 },
    { mult: 2.0, gain: 0.3, decay: 3.4, detune: -6 },
    { mult: 3.01, gain: 0.19, decay: 2.6, detune: -14 },
    { mult: 4.02, gain: 0.12, decay: 1.9, detune: -22 },
    { mult: 5.04, gain: 0.075, decay: 1.4, detune: -32 },
    { mult: 6.9, gain: 0.045, decay: 1.0, detune: -44 },
  ];

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, at);
  // Hard attack — a conch has no soft onset.
  master.gain.exponentialRampToValueAtTime(0.62, at + 0.035);
  master.gain.exponentialRampToValueAtTime(0.0001, at + 5.2);

  // A gentle low-pass keeps the very top from sounding thin and reedy.
  const warmth = ctx.createBiquadFilter();
  warmth.type = 'lowpass';
  warmth.frequency.setValueAtTime(5200, at);
  warmth.frequency.exponentialRampToValueAtTime(1600, at + 4.5);
  warmth.Q.value = 0.6;

  master.connect(warmth);
  warmth.connect(out);

  for (const p of partials) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';

    // The downward glide, done per-partial so they settle together.
    osc.frequency.setValueAtTime(root * p.mult * 1.06, at);
    osc.frequency.exponentialRampToValueAtTime(root * p.mult, at + 0.55);
    osc.detune.setValueAtTime(p.detune, at);
    // The very slight upward drift at the end is the player's breath.
    osc.detune.linearRampToValueAtTime(p.detune + 14, at + p.decay);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(p.gain, at + 0.03);
    // Each partial dies at its own rate — this is the whole trick.
    env.gain.exponentialRampToValueAtTime(0.0001, at + p.decay);

    osc.connect(env);
    env.connect(master);
    osc.start(at);
    osc.stop(at + p.decay + 0.2);
  }

  // A puff of air at the attack: breath hitting the mouthpiece.
  const air = noise(ctx);
  const airEnv = ctx.createGain();
  airEnv.gain.setValueAtTime(0.16, at);
  airEnv.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
  const airFilter = ctx.createBiquadFilter();
  airFilter.type = 'bandpass';
  airFilter.frequency.value = 1800;
  airFilter.Q.value = 0.8;
  air.connect(airFilter);
  airFilter.connect(airEnv);
  airEnv.connect(out);
  air.start(at, Math.random() * 1.2);
  air.stop(at + 0.3);
}

/* --------------------------------------------------------------------------
 *  BANSDRI — the flute
 * ------------------------------------------------------------------------ */

/** Sa Re Ga Pa Dha. The phrase moves up and comes home — a natural shape. */
const PHRASE = [
  { at: 0.0, len: 0.85, freq: 261.63 },
  { at: 0.72, len: 0.5, freq: 293.66 },
  { at: 1.12, len: 0.5, freq: 329.63 },
  { at: 1.52, len: 1.1, freq: 392.0 },
  { at: 2.42, len: 0.6, freq: 440.0 },
  { at: 2.9, len: 1.5, freq: 392.0 },
];

function playBansuri(ctx: AudioContext, out: AudioNode, startAt: number) {
  const master = ctx.createGain();
  master.gain.value = 0.34;
  master.connect(out);

  for (const note of PHRASE) {
    const at = startAt + note.at;
    const end = at + note.len;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, at);

    // Vibrato, delayed so the note opens straight and then warms — which is how
    // a played note actually goes.
    const vib = ctx.createOscillator();
    vib.frequency.value = 4.6;
    const vibDepth = ctx.createGain();
    vibDepth.gain.setValueAtTime(0, at);
    vibDepth.gain.linearRampToValueAtTime(note.freq * 0.006, at + 0.35);
    vib.connect(vibDepth);
    vibDepth.connect(osc.frequency);
    vib.start(at);
    vib.stop(end + 0.2);

    const env = ctx.createGain();
    // Soft attack: a flute never starts hard.
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(0.5, at + 0.09);
    env.gain.setValueAtTime(0.5, at + note.len * 0.7);
    env.gain.exponentialRampToValueAtTime(0.0001, end + 0.16);

    osc.connect(env);
    env.connect(master);
    osc.start(at);
    osc.stop(end + 0.3);

    /*
     * Breath. A bamboo flute is mostly air, and without this layer the note is a
     * clean sine — which reads as a test tone. Filtered noise over the note is
     * what makes it sound like breath across a hole.
     */
    const breath = noise(ctx);
    const breathFilter = ctx.createBiquadFilter();
    breathFilter.type = 'bandpass';
    // Centred an octave above the note: that is where flute noise sits.
    breathFilter.frequency.value = note.freq * 2;
    breathFilter.Q.value = 1.6;

    const breathEnv = ctx.createGain();
    breathEnv.gain.setValueAtTime(0.0001, at);
    breathEnv.gain.exponentialRampToValueAtTime(0.05, at + 0.05);
    breathEnv.gain.exponentialRampToValueAtTime(0.0001, end + 0.12);

    breath.connect(breathFilter);
    breathFilter.connect(breathEnv);
    breathEnv.connect(master);
    breath.start(at, Math.random() * 1.2);
    breath.stop(end + 0.2);
  }
}

/* --------------------------------------------------------------------------
 *  DHOL — the drum
 * ------------------------------------------------------------------------ */

/**
 * One stroke. A membrane is a taut shell: it displaces, springs back, and the
 * displaced column of air above it resonates. That gives a fast pitch drop
 * followed by a ringing tone — modelled here as a noise burst through a
 * resonant filter whose frequency sweeps downward.
 */
function dholStroke(
  ctx: AudioContext,
  out: AudioNode,
  at: number,
  { freq, gain, decay, click }: { freq: number; gain: number; decay: number; click: number },
) {
  const body = noise(ctx);

  const membrane = ctx.createBiquadFilter();
  membrane.type = 'bandpass';
  // The sweep is the whole character of a drum hit.
  membrane.frequency.setValueAtTime(freq * 2.6, at);
  membrane.frequency.exponentialRampToValueAtTime(freq, at + decay * 0.28);
  membrane.Q.value = 2.4;

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, at + decay);

  body.connect(membrane);
  membrane.connect(env);
  env.connect(out);
  body.start(at, Math.random() * 1.2);
  body.stop(at + decay + 0.1);

  // The stick itself: a very short, bright tick on top of the body.
  const stick = noise(ctx);
  const stickFilter = ctx.createBiquadFilter();
  stickFilter.type = 'highpass';
  stickFilter.frequency.value = 3200;
  const stickEnv = ctx.createGain();
  stickEnv.gain.setValueAtTime(0.0001, at);
  stickEnv.gain.exponentialRampToValueAtTime(click, at + 0.002);
  stickEnv.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
  stick.connect(stickFilter);
  stickFilter.connect(stickEnv);
  stickEnv.connect(out);
  stick.start(at, Math.random() * 1.2);
  stick.stop(at + 0.08);
}

/** Te — Ta — Te | Te — Ta, the classic thekan cycle. */
const THEKAN = [0, 0.42, 0.72, 1.08, 1.5, 1.86, 2.28, 2.7, 3.0];

function playDhol(ctx: AudioContext, out: AudioNode, startAt: number) {
  for (const offset of THEKAN) {
    const at = startAt + offset;
    const bass = offset % 1.08 < 0.2;
    dholStroke(ctx, out, at,
      bass
        ? { freq: 68, gain: 0.62, decay: 0.62, click: 0.1 }
        : { freq: 172, gain: 0.3, decay: 0.24, click: 0.16 },
    );
  }
}

/* --------------------------------------------------------------------------
 *  The opening sequence
 * ------------------------------------------------------------------------ */

export interface DhunHandle {
  ctx: AudioContext;
  stop(): void;
}

/**
 * Shankh, bansuri and dhol, together.
 *
 * They enter in sequence rather than all at once, which is how an aarti
 * actually opens: the drum establishes the pulse, the flute enters over it, and
 * the conch sounds once on top. All three are alive simultaneously for most of
 * the sequence, which is what "ek saath" means here.
 */
export async function playOpeningDhun(volume = 0.5): Promise<DhunHandle | null> {
  if (typeof window === 'undefined') return null;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();

  // A context created before a gesture starts suspended; this is the request
  // that either succeeds or throws, and it is the whole autoplay question.
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      // Refused. The caller shows the invitation instead.
      void ctx.close();
      return null;
    }
  }

  /*
   * The master chain.
   *
   * The high shelf lift is small but it is what separates this from a sine
   * sweep: real instruments have presence in the upper mids, and without a
   * gentle lift the whole thing sits down in the mud.
   */
  const master = ctx.createGain();
  master.gain.value = clamp(volume, 0, 1) * 0.55;

  const presence = ctx.createBiquadFilter();
  presence.type = 'highshelf';
  presence.frequency.value = 3200;
  presence.gain.value = 4;

  // A limiter, so three instruments peaking together cannot clip.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -8;
  limiter.knee.value = 6;
  limiter.ratio.value = 8;
  limiter.attack.value = 0.004;
  limiter.release.value = 0.18;

  master.connect(presence);
  presence.connect(limiter);
  limiter.connect(ctx.destination);

  const t0 = ctx.currentTime + 0.12;

  playDhol(ctx, master, t0);
  playBansuri(ctx, master, t0 + 0.25);
  playShankh(ctx, master, t0 + 0.5);

  return {
    ctx,
    stop: () => {
      try {
        void ctx.close();
      } catch {
        /* already closed */
      }
    },
  };
}

/* ===========================================================================
 *  Removed
 *  ===========================================================================
 *
 *  `audioLikelyBlocked()` — it answered the same question as "does `playOpeningDhun`
 *  return null?", by opening a throwaway `AudioContext` to read its state and then
 *  discarding it. Callers already branch on the return value, and on Safari the
 *  probe and the real context can disagree, so it could report "blocked" for a
 *  context that then played fine.
 */