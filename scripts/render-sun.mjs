/**
 * ============================================================================
 *  SUN RENDERER — a rising sun, 4K
 * ============================================================================
 *
 * Rendered, not drawn. No emoji, no stock photography, so there is no copyright
 * question and it looks identical on every device.
 *
 * ── What went wrong the first two times, and why it read as an icon ────────
 *
 * 1. **The colour was computed per channel.** `R = heat; G = 0.95*heat;
 *    B = 0.84*heat` produced (255, 252, 214) — a pale cream. Multiplying
 *    channels toward white is how you lose the orange entirely. The fix is a
 *    **colour ramp**: a table of real solar colours sampled by radius, so the
 *    chromaticity is chosen rather than derived, and every pixel on a given
 *    radius is exactly the colour intended.
 *
 * 2. **A hard rim in the corona.** `exp(-((t-1.02)/0.085)^2) * 0.55` is a
 *    narrow gaussian sitting just outside the disc — which is literally a drawn
 *    ring. A real aureole is **monotone**: brightest at the limb, falling away
 *    with no feature at all. One power law does it, and it cannot ring because
 *    it has no local maximum to create one.
 *
 * 3. **Granulation was invisible.** The noise was sampled ~5 cycles across the
 *    disc, so each cell was ~400px at 4K — a broad mottle, not granulation. Real
 *    granulation is convection cells a few thousand km across: on a 2300px disc
 *    that is ~10px cells, which needs a sampling frequency around 50.
 *
 * ── The thing that makes it read as *rising* rather than as a circle ───────
 * A disc drawn complete, in open sky, is a shape. A rising sun is:
 *
 *   - **Vertically flattened.** Atmospheric refraction compresses a sun on the
 *     horizon by roughly 15–20%. This is a real optical effect and it is the
 *     single strongest cue that a sun is low, so it is applied to the geometry
 *     (an ellipse), not painted on.
 *   - **Redder along the bottom.** The light reaching the lower limb has passed
 *     through more atmosphere than the light from the upper limb, so the bottom
 *     of the disc is deep orange while the top is still gold.
 *   - **Occluded by the horizon.** The component draws a fixed bright band
 *     across the lower frame; the disc sits behind it. The sun emerges *from
 *     behind* the skyline rather than being dragged upward past it.
 *
 * Run:  node scripts/render-sun.mjs [--preview]
 * ============================================================================
 */

import { encodeRgb, encodeRgba } from './png.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* ---------------------------------------------------------------------------
 * PNG — RGBA
 *
 * Alpha matters here. A sun pasted onto the page as an opaque square would be
 * instantly readable as a sticker, so the glow has to feather to nothing at the
 * edges of the frame and composite over whatever is behind it.
 * ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
 * Small maths helpers
 * ------------------------------------------------------------------------ */

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth tiling value noise, with per-octave rotation so nothing aligns. */
function makeNoise(seed, size = 256) {
  const rand = mulberry32(seed);
  const g = new Float32Array(size * size);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  const mask = size - 1;
  const at = (x, y) => g[(y & mask) * size + (x & mask)];
  const value = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = (x - xi) ** 2 * (3 - 2 * (x - xi));
    const v = (y - yi) ** 2 * (3 - 2 * (y - yi));
    return mix(
      mix(at(xi, yi), at(xi + 1, yi), u),
      mix(at(xi, yi + 1), at(xi + 1, yi + 1), u),
      v,
    );
  };
  return (x, y, octaves = 3) => {
    let sum = 0;
    let amp = 1;
    let norm = 0;
    let fx = x;
    let fy = y;
    for (let o = 0; o < octaves; o++) {
      sum += value(fx, fy) * amp;
      norm += amp;
      amp *= 0.5;
      // Rotate each octave, otherwise the layers stack into a visible grid.
      fx = fx * 2.07 + 11.3;
      fy = fy * 2.07 - 5.9;
    }
    return sum / norm;
  };
}

/* ---------------------------------------------------------------------------
 * THE COLOUR RAMP — the heart of the fix
 *
 * Photographic reference for a sun sitting a few degrees above a hazy horizon:
 * the core is blown out to warm white, and chromaticity shifts steadily cooler
 * to warmer toward the limb because the line of sight through the atmosphere
 * lengthens. These are the colours, in 0–255.
 *
 * Sampling a table is what stops the result going grey. Deriving colour by
 * multiplying channels cannot express "deep burnt orange" — it can only make
 * things lighter or darker, and lighter means whiter.
 *
 *   s = 0.00  core, overexposed to warm white
 *   s = 0.35  pale gold
 *   s = 0.60  amber
 *   s = 0.80  deep amber
 *   s = 0.92  orange
 *   s = 1.00  the limb, burnt red-orange — where the air is thickest
 */
const RAMP = [
  [0.0, 255, 250, 236],
  [0.1, 255, 244, 216],
  [0.22, 255, 233, 183],
  [0.38, 255, 218, 143],
  [0.54, 255, 199, 100],
  [0.7, 255, 178, 62],
  [0.84, 255, 152, 34],
  [0.93, 255, 124, 22],
  [1.0, 250, 96, 14],
];

function ramp(s) {
  s = clamp(s, 0, 1);
  for (let i = 1; i < RAMP.length; i++) {
    const [s1, r1, g1, b1] = RAMP[i];
    if (s <= s1) {
      const [s0, r0, g0, b0] = RAMP[i - 1];
      const t = (s - s0) / (s1 - s0);
      return [mix(r0, r1, t), mix(g0, g1, t), mix(b0, b1, t)];
    }
  }
  const last = RAMP[RAMP.length - 1];
  return [last[1], last[2], last[3]];
}

/* ------------------------------------------------------------------------ */

function renderSun(size) {
  const out = new Uint8Array(size * size * 4);

  // Granulation: convection cells. High frequency (48 cycles across the disc) so
  // they are ~10px cells at 4K — visible texture, not a mottle.
  const granule = makeNoise(9137, 256);

  // Supergranulation: the larger, slower cells underneath. Two scales together
  // read as a photosphere; either one alone reads as noise.
  const supercell = makeNoise(2281, 256);

  // Rays. Sampled on the unit circle rather than on theta directly, so the
  // pattern is continuous across the ±π seam — sampling theta leaves a visible
  // vertical scar down the left of the frame.
  const rayNoise = makeNoise(5501, 256);

  const cx = size / 2;
  const cy = size / 2;

  // The disc fills a little under a third of the frame. A disc that fills the
  // frame has nowhere for its light to go, and reads as a coin; one that is too
  // small floats in a haze with no presence.
  const radius = size * 0.31;

  /*
   * Refraction squash. A sun on the horizon is compressed vertically by
   * roughly 15–20%. Applied to the geometry, so the silhouette itself is an
   * ellipse — the strongest available cue that this is a *rising* sun and not a
   * full disc parked in the sky.
   */
  const SQUASH = 0.84;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const dx = px + 0.5 - cx;
      const dy = py + 0.5 - cy;

      // Squashed radius: 1.0 exactly on the silhouette of the ellipse.
      const rNorm = Math.hypot(dx, dy / SQUASH);
      const s = rNorm / radius;

      let R = 0;
      let G = 0;
      let B = 0;
      let A = 0;

      /* ========================================================== the disc */
      if (s <= 1) {
        let [cr, cg, cb] = ramp(s);

        /*
         * Bottom-of-disc reddening.
         *
         * The lower limb's light has crossed more atmosphere than the upper
         * limb's, so it arrives with most of its blue scattered out. Applied as
         * a pull toward deep orange, weighted so the effect only appears in the
         * bottom half — put it on symmetrically and the sun looks stained rather
         * than low.
         */
        const vertical = clamp((dy / (radius * SQUASH) + 1) / 2, 0, 1);
        const redden = Math.pow(vertical, 2.6);
        cg = mix(cg, 118, 0.6 * redden);
        cb = mix(cb, 22, 0.82 * redden);

        /*
         * Limb darkening.
         *
         * At the limb we see through less plasma, so the edge is dimmer as well
         * as redder. This is most of what turns a filled circle into a sphere:
         * a disc with uniform brightness never will, however good the gradient
         * is. Applied as a multiplier on all three channels *after* the ramp, so
         * it darkens without desaturating — multiplying before the ramp would
         * darken toward grey.
         *
         * The range is kept narrow (0.86–1.0) on purpose. An earlier version ran
         * 0.78–1.0, which measured a mean luminance of 148 against a page at 250
         * — the disc came out *darker than the sky behind it* and read as a
         * brown egg rather than a light source. Enough falloff to feel spherical,
         * not so much that the sun stops being the brightest thing on screen.
         */
        const mu = Math.sqrt(Math.max(0, 1 - s * s));
        let shade = 0.86 + 0.14 * Math.pow(mu, 0.55);

        /* ------------------------------------------------------- granulation */
        const fine = granule((dx / radius) * 48 + 40, (dy / radius) * 48 + 40, 3);
        const coarse = supercell((dx / radius) * 7.5 + 11, (dy / radius) * 7.5 + 11, 2);
        // Contrast kept deliberately low. The eye is looking at a blown-out
        // bright object; anything stronger reads as dirt on the lens.
        shade *= 1 + (fine - 0.5) * 0.075 + (coarse - 0.5) * 0.05;

        /* ------------------------------------------------- specular sheen */
        /*
         * The "shiny" from the brief. A soft highlight across the upper-left,
         * as if the disc were polished glass — falling away toward the limb so
         * it reads as curvature. Painted over the finished disc instead, it reads
         * as a decal.
         */
        const sx = (dx + radius * 0.38) / (radius * 1.35);
        const sy = (dy + radius * 0.46) / (radius * 1.35);
        const sheen = Math.exp(-(sx * sx + sy * sy) * 2.6) * 0.62 * clamp(mu * 1.7, 0, 1);

        R = clamp((cr * shade) / 255 + sheen * 0.42, 0, 1);
        G = clamp((cg * shade) / 255 + sheen * 0.38, 0, 1);
        B = clamp((cb * shade) / 255 + sheen * 0.26, 0, 1);
        A = 1;

        /*
         * Feather the last pixel. A hard circular cut is the single clearest
         * tell of a flat drawing, so the silhouette is softened over about
         * 1.5% of the radius — optically almost nothing, visually decisive.
         */
        const feather = smoothstep(1.0, 0.984, s);
        R *= feather;
        G *= feather;
        B *= feather;
        A *= feather;
      }

      /* ================================================= the aureole/corona */
      /*
       * Monotone by construction: one power law, `t^-3`, which equals 1 at the
       * limb and only ever decreases. The previous version added a gaussian
       * "rim" at t=1.02, and a local maximum just outside the disc *is* a drawn
       * ring — no amount of tuning hides it. A single decaying term cannot
       * produce one.
       *
       * ALPHA carries the falloff, and the colour is assigned outright.
       *
       * This is the single most important line in the file. Fading the colour by
       * the same factor that sets the alpha squares the falloff — the visible
       * contribution becomes alpha x colour — so at t=1.3 the aureole arrives at
       * the page at barely 20% strength. Measured, that came out as
       * (195,178,150): a dull grey-tan ring around a sun, which is precisely the
       * "flat icon with a dirty halo" look. Colour is set at full strength and
       * alpha alone does the fading, and the same halo comes out as (255,228,180)
       * — bright gold, which is what light scattered through air actually is.
       */
      if (s > 1) {
        const t = s;
        const glow = Math.pow(1 / t, 3.0);

        // Scattered light loses blue as it travels, so the outer halo reddens.
        const far = smoothstep(1.0, 3.4, t);
        R = 1.0;
        G = mix(0.82, 0.56, far);
        B = mix(0.46, 0.14, far);
        A = glow;

        /*
         * A broad warm haze filling the frame.
         *
         * Without it the aureole ends at some radius and the sun looks pasted
         * on. Real sunrise glow reaches the whole sky, so this is a much slower
         * decay than the aureole's and takes over as the dominant term in the
         * far field, blending the edge of the glow into whatever the page
         * background happens to be.
         */
        const haze = 0.3 * Math.pow(1 / t, 1.6);
        if (haze > A) {
          const hfar = smoothstep(1.0, 3.5, t);
          R = 1.0;
          G = mix(0.86, 0.62, hfar);
          B = mix(0.56, 0.22, hfar);
          A = haze;
        }
      }

      /* ============================================= crepuscular rays */
      {
        // Angular variation sampled on the unit circle — continuous, no seam.
        const ux = Math.cos(Math.atan2(dy, dx));
        const uy = Math.sin(Math.atan2(dy, dx));

        const angular = rayNoise(ux * 26 + 40, uy * 26 + 40, 3);
        // A second, higher-frequency band along the radius gives the rays their
        // streaky length — refraction makes them smudge as they travel.
        const alongRay = rayNoise(ux * 60 + 90, uy * 60 + 90, 2);

        /*
         * Expand before shaping.
         *
         * fBm averages its octaves, so its output clusters tightly around 0.5
         * and its deviations are small. Raising it to a power directly therefore
         * does almost nothing: pow(0.5, 3.6) is 0.08, and a ray whose peak
         * strength is 8% is invisible. The first version did exactly this, and
         * the measured result was a smooth featureless ball with no rays in it at
         * all. Multiplying the deviation by ~5.5 first spreads the distribution
         * back across the full 0–1 range, and *then* the power shapes it into
         * distinct rays — bright where the noise was bright, absent where it was
         * not.
         */
        const expanded = clamp((angular - 0.5) * 5.5 + 0.5, 0, 1);
        const rays = Math.pow(expanded, 1.9);
        const streak = Math.pow(clamp((alongRay - 0.5) * 4 + 0.5, 0, 1), 1.4);

        // Grows in just outside the disc, then falls away with the aureole.
        // The reach is a little wider than the aureole's (t^-3) but stops well
        // short of the frame edge. Letting the rays run to the corners turns the
        // sun into a clipart starburst — real crepuscular rays fade within a few
        // solar radii and are never the same length.
        const envelope = smoothstep(3.0, 1.0, s) * smoothstep(0.9, 1.12, s);
        const strength = clamp(rays * (0.62 + 0.38 * streak) * envelope, 0, 1) * 0.68;

        if (strength > 0.003) {
          // Same rule as the aureole: the colour is assigned at full strength
          // and alpha alone carries the falloff. Rays are light, so they are
          // composited over whatever the aureole already put there rather than
          // replacing it.
          R = mix(R, 1.0, strength);
          G = mix(G, 0.93, strength);
          B = mix(B, 0.74, strength);
          A = Math.max(A, strength);
        }
      }

      /* ================================================ frame fade */
      /*
       * Fade the alpha out at the very edge of the frame, and nothing else.
       *
       * Two mistakes were made here first, and both showed up as a dark ring of
       * streaks around the sun.
       *
       * 1. **It was radial.** `smoothstep(size*0.5, size*0.43, dist)` reaches
       *    zero at half the frame width, which is only s=1.6 — cutting a hard
       *    circle straight through an aureole that still has plenty of strength
       *    there. Measured, every pixel beyond s=1.6 was (0,0,0,0): the glow was
       *    amputated. Box distance is used instead, which also fades the corners,
       *    so the sun dissolves into the page rather than ending in a disc.
       *
       * 2. **It was applied to the colour as well as the alpha** — the same
       *    double-counting that wrecked the aureole. A pixel at 50% fade was
       *    half as bright *and* half as opaque, so it composited to a muddy
       *    dark smear. This is non-premultiplied RGBA: alpha alone carries
       *    transparency, and the colour must be left at full strength.
       */
      const boxDistance = Math.min(
        Math.min(px, size - 1 - px),
        Math.min(py, size - 1 - py),
      ) / (size * 0.5);
      A *= smoothstep(0.0, 0.16, boxDistance);

      const idx = (py * size + px) * 4;
      out[idx] = Math.round(clamp(R, 0, 1) * 255);
      out[idx + 1] = Math.round(clamp(G, 0, 1) * 255);
      out[idx + 2] = Math.round(clamp(B, 0, 1) * 255);
      out[idx + 3] = Math.round(clamp(A, 0, 1) * 255);
    }
  }

  return out;
}

/* ------------------------------------------------------------------------ */

/**
 * Flatten the RGBA sun over the page's warm cream, so the preview can be judged
 * as it will actually appear.
 *
 * Judging a transparent PNG in isolation is misleading: the aureole's warmth
 * depends entirely on what is behind it, and against an image viewer's grey
 * backdrop a perfectly good warm glow looks muddy. This composites over the
 * real `--paper` colour from the Tailwind theme, plus a hint of the sunrise
 * gradient the hero paints, so what is checked here is what ships.
 */
function flattenOverCream(rgba, size) {
  // The warm cream of the page, and a slightly warmer band where the hero's
  // sunrise gradient sits behind the sun.
  const paperTop = [255, 250, 240];
  const paperBottom = [253, 240, 222];

  const out = Buffer.alloc(size * size * 3);
  for (let y = 0; y < size; y++) {
    const t = y / (size - 1);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const a = rgba[i + 3] / 255;
      const bg = [
        mix(paperTop[0], paperBottom[0], t),
        mix(paperTop[1], paperBottom[1], t),
        mix(paperTop[2], paperBottom[2], t),
      ];
      const o = (y * size + x) * 3;
      out[o] = Math.round(rgba[i] * a + bg[0] * (1 - a));
      out[o + 1] = Math.round(rgba[i + 1] * a + bg[1] * (1 - a));
      out[o + 2] = Math.round(rgba[i + 2] * a + bg[2] * (1 - a));
    }
  }
  return out;
}


function main() {
  const preview = process.argv.includes('--preview');
  // 4096, so a 4K display *downsamples* it. Downscaling a high-resolution render
  // is what produces the soft photographic falloff; upscaling a small one only
  // ever produces blur.
  const size = preview ? 320 : 4096;

  const dir = join(process.cwd(), preview ? 'preview' : join('public', 'art'));
  mkdirSync(dir, { recursive: true });

  const started = Date.now();
  process.stdout.write(`  सूर्य ${size}×${size} … `);
  const pixels = renderSun(size);
  const png = encodeRgba(size, size, pixels);
  writeFileSync(join(dir, 'sun.png'), png);

  console.log(
    `${(png.length / 1024 / 1024).toFixed(2)} MB in ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );

  if (preview) {
    const flat = encodeRgb(size, size, flattenOverCream(pixels, size));
    writeFileSync(join(dir, 'sun-on-paper.png'), flat);
    console.log('  तैयार: preview/sun-on-paper.png  (cream पृष्ठभूमि पर)');
  }

  console.log(`\n  तैयार: ${preview ? 'preview' : 'public/art'}/sun.png`);
}

main();
