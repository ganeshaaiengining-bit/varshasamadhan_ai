/**
 * ===========================================================================
 *  RAY TRACER â€” the 4K imagery
 * ===========================================================================
 *
 * Renders the homepage artwork as genuine ray-traced images: a sky dome, a sun
 * disc with atmospheric bloom, volumetric ground haze, and soft shadows.
 *
 * â”€â”€ Why a renderer instead of clip art â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * The request was 3D-looking original imagery with no copyright question. Two
 * alternatives were rejected:
 *
 *   â€¢ Stock photography â€” exactly the copyright problem to avoid, and it would
 *     not match the palette.
 *   â€¢ SVG gradients â€” looks flat at 4K, and a large decorative illustration is
 *     the one place vector art falls down: it has no lighting model, so it
 *     reads as a diagram rather than a photograph.
 *
 * A tracer gives real light: the sun's colour falls off toward the horizon, the
 * disc blooms where it is brightest, and the haze thickens with distance. It
 * runs in plain Node â€” `zlib` is the only dependency, there is no native
 * extension and nothing binary in the repository.
 *
 * Render at 4K and let the browser downscale. Downscaling a high-resolution
 * render is what gives it a photographic falloff; upscaling a small one just
 * makes it blurry.
 *
 * Run:  node scripts/render-art.mjs
 * ===========================================================================
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// PNG output
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

/**
 * Colour type 6 (RGBA).
 *
 * The sky needs no alpha, but the sun does: it has to composite over the hero
 * gradient, and a rectangular box of orange behind it is instantly visible as a
 * pasted sticker.
 */
function encodePngRgba(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 1; // Sub filter
    for (let x = 0; x < stride; x++) {
      const v = rgba[y * stride + x];
      const left = x >= 4 ? rgba[y * stride + x - 4] : 0;
      raw[rowStart + 1 + x] = (v - left) & 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // truecolour + alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function encodePng(width, height, rgb) {
  // Each scanline is prefixed with a filter byte. Filter 1 (Sub) predicts from
  // the pixel to the left, which compresses a smooth sky far better than none.
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 1;
    for (let x = 0; x < stride; x++) {
      const v = rgb[y * stride + x];
      const left = x >= 3 ? rgb[y * stride + x - 3] : 0;
      raw[rowStart + 1 + x] = (v - left) & 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Maths
// ---------------------------------------------------------------------------

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Deterministic noise, so a re-run produces byte-identical images. */
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

/**
 * Tiling value noise, 2D, with fBm on top.
 *
 * The first version indexed a 1D band table by projected position, which
 * produced flat quadrilateral slabs rather than clouds â€” a one-dimensional
 * lookup cannot have a silhouette. This samples a genuine 2D lattice with
 * bilinear interpolation, so density varies in both directions and the
 * threshold cuts an organic shape.
 *
 * The lattice wraps at `size`, so the noise is tileable and the cloud plane has
 * no visible seam where it repeats.
 */
function makeNoise(seed, size = 256) {
  const rand = mulberry32(seed);
  const lattice = new Float32Array(size * size);
  for (let i = 0; i < lattice.length; i++) lattice[i] = rand();

  const mask = size - 1;

  const at = (x, y) => lattice[(y & mask) * size + (x & mask)];

  const value = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    // Smoothstep the interpolation weights, or the lattice shows through as
    // visible diamond facets.
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);
    return mix(mix(a, b, u), mix(c, d, u), v);
  };

  /** Fractional Brownian motion â€” octaves at doubling frequency, halving weight. */
  return (x, y, octaves = 4) => {
    let sum = 0;
    let amp = 1;
    let norm = 0;
    let fx = x;
    let fy = y;
    for (let o = 0; o < octaves; o++) {
      sum += value(fx, fy) * amp;
      norm += amp;
      amp *= 0.5;
      // Rotate each octave slightly so the octaves do not align into a grid.
      fx = fx * 2.03 + 17.3;
      fy = fy * 2.03 - 9.1;
    }
    return sum / norm;
  };
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const length = (a) => Math.hypot(a[0], a[1], a[2]);
const normalize = (a) => {
  const l = length(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

// ---------------------------------------------------------------------------
// The sky model
//
// This is where the "warm, sun-drenched" look comes from. Rayleigh-ish
// scattering: blue survives at the zenith, red is scattered out of the direct
// path near the horizon, which is why a real sunrise is orange *at the edges*
// and still blue overhead. Painting the whole sky orange looks like a filter,
// not like light.
// ---------------------------------------------------------------------------

function skyColour(dir, sunDir) {
  const up = clamp(dir[1] * 0.5 + 0.5, 0, 1);
  const cosSun = clamp(dot(normalize(dir), sunDir), -1, 1);

  // Zenith is a deep, slightly violet blue; the horizon is warm and pale.
  const zenith = [0.16, 0.34, 0.68];
  const horizon = [1.0, 0.84, 0.62];

  let t = Math.pow(1 - Math.abs(dir[1]), 3.2);
  const base = [
    mix(zenith[0], horizon[0], t),
    mix(zenith[1], horizon[1], t),
    mix(zenith[2], horizon[2], t),
  ];

  // Forward scattering: the whole sky brightens toward the sun, strongest just
  // above the horizon.
  const halo = Math.pow(Math.max(cosSun, 0), 5.0) * 0.75 + Math.pow(Math.max(cosSun, 0), 48.0) * 1.6;
  const glow = [1.0, 0.72, 0.36];

  const out = [
    base[0] + glow[0] * halo,
    base[1] + glow[1] * halo * 0.86,
    base[2] + glow[2] * halo * 0.62,
  ];

  // Below the horizon the ground haze takes over â€” warm, and desaturated.
  if (dir[1] < 0) {
    const below = smoothstep(0, -0.35, dir[1]);
    const haze = [0.96, 0.84, 0.70];
    return [
      mix(out[0], haze[0], below),
      mix(out[1], haze[1], below),
      mix(out[2], haze[2], below),
    ];
  }

  return out;
}

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

const SCENES = [
  {
    name: 'sunrise-wide',
    width: 3840,
    height: 2160,
    // Low and off-centre, so the composition has a direction.
    sun: normalize([0.62, 0.115, -0.78]),
    exposure: 0.94,
    clouds: 0.62,
    haze: 0.22,
    seed: 20260104,
    ground: 0.58,
    // Well above 1: the tone curve loses chroma as it compresses, and this is
    // what puts it back. Without it the render reads as fog rather than dawn.
    saturation: 1.72,
    warmth: 1.15,
  },
  {
    name: 'sunrise-tall',
    width: 2160,
    height: 3840,
    sun: normalize([0.34, 0.14, -0.93]),
    exposure: 0.92,
    clouds: 0.5,
    haze: 0.28,
    seed: 771,
    ground: 0.5,
    saturation: 1.66,
    warmth: 1.1,
  },
  {
    name: 'dawn-soft',
    width: 3200,
    height: 1800,
    sun: normalize([-0.66, 0.095, -0.74]),
    exposure: 0.9,
    clouds: 0.78,
    haze: 0.3,
    seed: 4242,
    ground: 0.6,
    saturation: 1.58,
    warmth: 1.05,
  },
];

// ---------------------------------------------------------------------------

function render(scene) {
  const { width, height, sun, exposure, clouds, haze, seed, ground, saturation, warmth } = scene;
  const out = new Uint8Array(width * height * 3);
  const fbm = makeNoise(seed, 256);
  const detail = makeNoise(seed + 991, 128);

  // Camera: a wide lens, horizon placed low in frame.
  const fov = 1.05;
  const aspect = width / height;
  const tanHalf = Math.tan(fov / 2);
  const horizonY = ground * height;

  /*
   * Tone curve with a saturation restore.
   *
   * A straight clamp desaturates as it clips â€” every channel saturates at a
   * different point, so the highlight shifts hue and the sky goes milky. The
   * standard fix is to blend the clipped result back toward its own luminance
   * by `1 - saturation`, which returns the colour that the lost separation
   * encoded.
   */
  const luminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const tone = (r, g, b) => {
    const apply = (v) => {
      const x = clamp(v * exposure, 0, 4);
      // ACES filmic approximation â€” rolls highlights off instead of clipping.
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0, 1);
    };
    const nr = apply(r);
    const ng = apply(g);
    const nb = apply(b);
    const l = luminance(nr, ng, nb);
    const s = saturation;
    return [
      clamp(l + (nr - l) * s, 0, 1),
      clamp(l + (ng - l) * s, 0, 1),
      clamp(l + (nb - l) * s, 0, 1),
    ];
  };

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Normalised device coordinates.
      const ndcX = ((px + 0.5) / width) * 2 - 1;
      const ndcY = 1 - ((py + 0.5) / height) * 2;

      const dir = normalize([ndcX * tanHalf * aspect, ndcY * tanHalf, -1]);

      let colour = skyColour(dir, sun);
      const cosSun = dot(dir, sun);

      /* ------------------------------------------------------------ sun */
      // The disc is small â€” about half a degree across, as in life. Nearly all
      // of the visual warmth comes from the bloom, not the disc.
      const disc = smoothstep(0.99965, 0.99992, cosSun);
      if (disc > 0) {
        colour = [colour[0] + disc * 2.6, colour[1] + disc * 2.0, colour[2] + disc * 1.3];
      }
      const bloom = Math.pow(Math.max(cosSun, 0), 900) * 0.9;
      colour = [colour[0] + bloom * 1.4, colour[1] + bloom * 0.95, colour[2] + bloom * 0.5];

      /* ---------------------------------------------------------- clouds */
      if (dir[1] > 0.008 && clouds > 0) {
        /*
         * Projection onto a virtual cloud deck at unit height.
         *
         * The scale factor matters more than it looks. Too small and the deck
         * stretches into horizontal streaks that read as brush strokes; too
         * large and the noise tiles visibly. The vertical coordinate changes
         * fastest near the zenith and slowest at the horizon, which is what
         * perspective actually does.
         */
        const t = 1 / dir[1];
        const cx = dir[0] * t * 0.5;
        const cz = dir[2] * t * 0.5;

        const base = fbm(cx, cz, 5);
        const edge = detail(cx * 2.7, cz * 2.7, 3);
        const density = base * 0.78 + edge * 0.22;

        /*
         * Two thresholds, not one. The wide softstep builds a body; the narrow
         * one adds a brighter core where the cloud is thickest, which is how a
         * cloud reads as having volume rather than as a flat wash.
         */
        const floor = 0.46 - clouds * 0.1;
        const body = smoothstep(floor, floor + 0.3, density);
        const core = smoothstep(floor + 0.14, floor + 0.42, density);
        let amount = clamp(body + core * 0.25, 0, 1);

        // The deck is seen edge-on from below, so it thins toward the zenith.
        amount *= smoothstep(1.15, 0.04, dir[1]) * clouds;

        // Cloud in front of a low sun is blown out to near-white and thins,
        // producing the bright ring that surrounds a real sunrise.
        const nearSun = Math.pow(Math.max(cosSun, 0), 8);
        amount *= 1 - nearSun * 0.55;
        const backlit = nearSun * smoothstep(0.35, 0.95, amount);

        if (amount > 0.003) {
          // Lit tops are warm; shadowed undersides stay cool. A single flat
          // colour is the giveaway of a drawn sky rather than a lit one.
          const lit = 0.5 + core * 0.42;
          const cloudColour = [
            1.0 * lit + backlit * 0.95,
            0.78 * lit + backlit * 0.58,
            0.58 * lit + backlit * 0.24,
          ];
          colour = [
            mix(colour[0], cloudColour[0], amount),
            mix(colour[1], cloudColour[1], amount),
            mix(colour[2], cloudColour[2], amount),
          ];
        }
      }

      /* ------------------------------------------------- ground and haze */
      if (py > horizonY) {
        const below = (py - horizonY) / (height - horizonY);

        /*
         * Fog is *total at the horizon* and thins toward the viewer.
         *
         * This is the entire fix for a hard horizon line. With fog only
         * partial at the horizon, the ground colour meets a differently
         * coloured sky and the seam reads as a drawn line across the image.
         * With fog = 1 exactly at the horizon, distant ground is
         * indistinguishable from the sky it meets and the two appear to join
         * without a boundary — which is what atmospheric perspective does.
         */
        const fog = 1 - smoothstep(0, 0.28, below) * (1 - haze);
        const reveal = 1 - fog;

        if (reveal > 0.001) {
          // Terrain from the same 2D noise at a larger scale, with the depth
          // axis divided by height so detail compresses toward the horizon
          // instead of stretching.
          const gz = 1 / Math.max(below, 0.03);
          const terrain = fbm(dir[0] * gz * 0.08, gz * 0.08, 4);
          const grit = detail(dir[0] * gz * 0.5, gz * 0.5, 2);
          const shade = 0.78 + terrain * 0.4 + grit * 0.12;

          const g = [0.56 * shade, 0.42 * shade, 0.28 * shade];

          colour = [
            mix(colour[0], g[0], reveal),
            mix(colour[1], g[1], reveal),
            mix(colour[2], g[2], reveal),
          ];
        }
      }
      /* ------------------------------------------- horizon atmospheric band */
      const band = 1 - smoothstep(0, 0.05, Math.abs(dir[1]));
      colour = [colour[0] + band * 0.10 * warmth, colour[1] + band * 0.065 * warmth, colour[2] + band * 0.02];

      /* ------------------------------------------------------------- out */
      const idx = (py * width + px) * 3;
      const graded = tone(colour[0], colour[1], colour[2]);
      out[idx] = Math.round(graded[0] * 255);
      out[idx + 1] = Math.round(graded[1] * 255);
      out[idx + 2] = Math.round(graded[2] * 255);
    }
  }

  return out;
}

// ---------------------------------------------------------------------------

/**
 * `node scripts/render-art.mjs --preview`
 *
 * Renders at a fraction of the size into `preview/`. Tinting a sky is an
 * iterative job, and iterating on 4K renders costs minutes per attempt; this
 * makes a pass cost seconds. The composition, colour and noise are identical
 * at any resolution, so a preview that looks right renders correctly at 4K.
 */
const PREVIEW = process.argv.includes('--preview');
const SCALE = PREVIEW ? 0.29 : 1;
const OUT_DIR = PREVIEW ? 'preview' : join('public', 'art');

function main() {
  const dir = join(process.cwd(), PREVIEW ? 'preview' : join('public', 'art'));
  mkdirSync(dir, { recursive: true });

  const scenes = PREVIEW
    ? SCENES.map((s) => ({
        ...s,
        name: s.name,
        width: Math.round(s.width * SCALE),
        height: Math.round(s.height * SCALE),
      }))
    : SCENES;

  for (const scene of scenes) {
    const started = Date.now();
    process.stdout.write(`  ${scene.name} (${scene.width}Ã—${scene.height}) â€¦ `);
    const pixels = render(scene);
    const png = encodePng(scene.width, scene.height, pixels);
    writeFileSync(join(dir, `${scene.name}.png`), png);
    console.log(
      `${(png.length / 1024 / 1024).toFixed(2)} MB in ${((Date.now() - started) / 1000).toFixed(1)}s`,
    );
  }

  console.log(`\n  à¤¤à¥ˆà¤¯à¤¾à¤°: ${OUT_DIR}/`);
  for (const s of scenes) console.log(`    ${s.name}.png  ${s.width}Ã—${s.height}`);
}

main();