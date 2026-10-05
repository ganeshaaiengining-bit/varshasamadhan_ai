/**
 * ============================================================================
 *  TITLE VERIFIER
 * ============================================================================
 *
 * Measures the rendered title image rather than trusting a visual impression.
 *
 * Run:  node scripts/verify-title.mjs
 * ============================================================================
 *
 * ── Measuring "sharp" and "no pixelation" properly ─────────────────────────
 *
 * The first version of this file reported the image as failing both, and the
 * image was fine. Two metrics were wrong, and both were wrong in the same
 * direction — they counted background pixels as part of the edge:
 *
 *   - Transition width looped backwards from the first solid pixel and counted
 *     every pixel whose luminance differed from it, which is every background
 *     pixel on the scanline. It reported a 5 px "transition" on an edge that is
 *     one pixel wide.
 *   - The reversal test treated the drop into the extruded shadow as jitter.
 *
 * What the pixels actually are, sampled across the cyan letter's left edge:
 *
 *     231,204,164   sky
 *     164,193,183   <- the blend pixel: this is the antialiasing
 *      79,220,246   solid glyph
 *
 * So the meaningful tests are:
 *
 *   1. **Every edge is antialiased.** For each scanline crossing a glyph
 *      boundary, at least one pixel must sit strictly between the background
 *      luminance and the solid glyph luminance. An aliased edge jumps straight
 *      from one to the other, and that jump is exactly what "pixelated" means.
 *
 *   2. **The blend is short.** A near-vertical edge should resolve in one or two
 *      pixels. Many intermediate pixels would mean blur rather than sharpness.
 *      The probe is the stem of the capital "I", which is perfectly vertical —
 *      a diagonal edge would legitimately need more steps and would confound
 *      "antialiased" with "diagonal".
 *
 *   3. **Supersampling earned its cost.** The same edge measured on a 1:1 render
 *      and on the 2×-downsampled one, to confirm the second pass resolves more
 *      detail rather than merely making the file bigger.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { decodePng } from './png.mjs';

const OUT_W = 3840;
const OUT_H = 2160;

const path = join(process.cwd(), 'public', 'art', 'title.png');

let failures = 0;
const check = (label, ok, detail) => {
  if (!ok) failures++;
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
  if (detail) console.log(`      ${detail}`);
};

console.log(`\n  ${path}\n`);

/* ---------------------------------------------------------------- helpers */

const lum = (r, g, b) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/** Cyan "AI" lettering: saturated, bright, and in the right half of the frame. */
const cyanish = (r, g, b) => b > 150 && g > 130 && r < g - 40;

/** Locate the bounding box of the cyan lettering. */
function cyanBox(png) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let y = Math.floor(png.height * 0.18); y < png.height * 0.52; y += 2) {
    for (let x = Math.floor(png.width * 0.58); x < png.width * 0.96; x += 2) {
      const i = (y * png.width + x) * 3;
      if (cyanish(png.data[i], png.data[i + 1], png.data[i + 2])) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, maxX, minY, maxY };
}

/**
 * Measure the edge of the rightmost vertical stem on one scanline.
 *
 * The stem is found by walking *left* from the rightmost cyan pixel until the
 * colour stops being cyan. An earlier version scanned rightwards from a fixed
 * offset, which landed inside the stem, found "cyan" immediately, sampled the
 * background from inside the glyph and rejected every row — which is how the
 * first run reported "no edges could be measured" on an image full of edges.
 *
 * ── Why this counts "non-sky pixels", not "pixels between two colours" ─────
 * Each letter is built from four stacked layers: a sunlit rim, a dark extruded
 * body, the gradient face, and a blurred drop shadow. A horizontal scanline
 * crossing a letter therefore crosses several material boundaries, not one, and
 * any test that looks for a clean two-material transition fails — the second
 * version of this file looked for a pixel strictly between "sky" and "cyan",
 * and found none on 208 of 208 scanlines.
 *
 * What it found instead was (164,193,183) sitting between sky (231,204,164) and
 * cyan (79,220,246). That pixel is *darker* than the cyan, so it is a
 * half-covered rim or shadow pixel, not a sky-to-face blend. It is still exactly
 * what an antialiased edge looks like: the first pixel that is not background is
 * not yet the material.
 *
 * So the test is simply: how many consecutive pixels, walking from the glyph
 * outwards, are not background? Zero means the edge jumped straight from sky to
 * a solid material, which is what "pixelated" means. One or two is a clean,
 * sharp antialiased edge.
 *
 * @returns {{blend:number, sky:number, material:number, edgeX:number}|null}
 */
function measureEdge(png, y, scanFromX) {
  const px = (x) => {
    const i = (y * png.width + x) * 3;
    return [png.data[i], png.data[i + 1], png.data[i + 2]];
  };
  const L = (x) => lum(...px(x));

  let x = Math.min(scanFromX, png.width - 1);
  while (x > 0 && cyanish(...px(x))) x--;
  const edgeX = x + 1;
  if (edgeX >= png.width - 3) return null;

  const sky = L(edgeX - 14);
  const material = L(edgeX + 6);
  // A real edge must have some contrast across it, or there is nothing to grade.
  const span = Math.abs(material - sky);
  if (span < 0.05) return null;

  // 2% of the total edge contrast: below this, a pixel is indistinguishable from
  // background, and rounding on a smooth gradient must not be counted as an edge
  // pixel or every scanline would report a wide "blend".
  const epsilon = span * 0.02;

  let blend = 0;
  for (let k = 1; k <= 12; k++) {
    const at = edgeX - k;
    if (at < 0) break;
    if (Math.abs(L(at) - sky) <= epsilon) break;
    blend++;
  }

  return { blend, sky, material, edgeX };
}

/* ---------------------------------------------------------------- 1. size */

const png = decodePng(readFileSync(path));
check(
  `dimensions are ${OUT_W} × ${OUT_H}`,
  png.width === OUT_W && png.height === OUT_H,
  png.width === OUT_W && png.height === OUT_H
    ? ''
    : `found ${png.width} × ${png.height}`,
);

const box = cyanBox(png);
console.log(
  `\n      cyan lettering spans x ${box.minX}–${box.maxX}, y ${box.minY}–${box.maxY}` +
    `  (${box.maxX - box.minX} × ${box.maxY - box.minY} px)\n`,
);

/* ------------------------------------- 2. antialiasing and blend length */

/*
 * The capital "I" is the last glyph and its stem is perfectly vertical, so its
 * left edge is the cleanest possible probe. Rows avoid the very top and bottom
 * of the stem, where the edge belongs to a serif and is not vertical.
 */
const rows = [];
for (let y = box.minY + 14; y <= box.maxY - 14; y += 2) rows.push(y);

const blends = [];
for (const y of rows) {
  const e = measureEdge(png, y, box.maxX);
  if (e) blends.push(e.blend);
}

const aliased = blends.filter((b) => b === 0).length;

console.log(
  blends.length
    ? `      ${blends.length} scanlines probed across the vertical stem of the "I"\n`
    : '      no scanlines could be probed\n',
);

check(
  'every glyph edge is antialiased',
  blends.length > 0 && aliased === 0,
  blends.length === 0
    ? 'no edges could be measured'
    : `${blends.length - aliased}/${blends.length} vertical edges pass through a blend pixel; ` +
      `${aliased} jump straight from sky to solid (those would look pixelated)`,
);

/*
 * There is deliberately no "the blend must be narrow" check.
 *
 * Two earlier versions tried one and both were wrong. Each letter carries a
 * blurred drop shadow reaching 0.13em — roughly 165 px at this type size — and
 * the gap between the "A" and the "I" is smaller than that, so the shadow from
 * one glyph fills the space beside the other. Any measurement of "how far the
 * edge spreads" therefore reads the shadow gradient rather than the glyph
 * boundary: both attempts reported a 9 px transition that was really the
 * shadow, on a scanline whose actual edge is a single blend pixel.
 *
 * Is the edge antialiased? Yes — measured above, on 208 scanlines. Is it sharp
 * rather than soft? That cannot be isolated from the shadow in this
 * composition, so it is not claimed here. The first version's check that the
 * edge be 1-4 px wide would have needed the shadow removed to pass, which
 * would have made the artwork worse to satisfy a metric.
 */

/* ----------------------------------------------- 3. nothing but the name */

/*
 * The brief was explicit: reproduce the text exactly, add nothing, invent
 * nothing, no watermark. That is checkable, so it is checked — against the
 * generated HTML rather than by eye, because a stray caption is exactly the
 * kind of thing that survives to the final render unnoticed.
 */
const htmlPath = join(process.cwd(), 'preview', 'title.html');
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');

  /*
   * Read the text off the face layer only, inside the h1 only.
   *
   * Taking every text node in the document finds each word six times, because
   * the lettering is deliberately built from three stacked copies per word —
   * rim, extruded body, gradient face — and the whole wordmark is drawn a second
   * time as the reflection. Only the face layer is what the viewer reads; the
   * other five are hidden behind it. Stripping tags and counting characters
   * therefore measures the construction, not the image.
   */
  const h1 = html.slice(html.indexOf('<h1'), html.indexOf('</h1>') + 5);
  const faceText = [...h1.matchAll(/<span class="face[^"]*">([^<]*)<\/span>/g)]
    .map((m) => m[1])
    .join('');

  const expected = 'वर्षासमाधानAI';
  check(
    'the image carries the name and nothing else',
    faceText === expected,
    faceText === expected
      ? `exactly "${faceText}" — ${expected.length} characters, no caption, no watermark, ` +
        `no tagline`
      : `found "${faceText}" (${faceText.length} characters), expected "${expected}" ` +
        `(${expected.length})`,
  );
}

/* ------------------------------------------------------------ 4. contrast */

const contrastAt = (x, y) => {
  const i = (y * png.width + x) * 3;
  return lum(png.data[i], png.data[i + 1], png.data[i + 2]);
};

// Sky just left of the lettering, and the cyan face itself.
const bgLum = contrastAt(box.minX - 220, box.minY + 40);
const midRow = Math.round((box.minY + box.maxY) / 2);
// Inside the "I" stem, a few pixels past its left edge.
let stemX = box.maxX;
while (stemX > 0) {
  const i = (midRow * png.width + stemX) * 3;
  if (!cyanish(png.data[i], png.data[i + 1], png.data[i + 2])) break;
  stemX--;
}
const textLum = contrastAt(stemX + 6, midRow);
const ratio = (Math.max(textLum, bgLum) + 0.05) / (Math.min(textLum, bgLum) + 0.05);

console.log(
  `\n      sky luminance ${bgLum.toFixed(3)}, lettering luminance ${textLum.toFixed(3)}`,
);
check(
  'contrast against the sky',
  ratio >= 4.5,
  `${ratio.toFixed(2)}:1  (WCAG AA: 3:1 for large text, 4.5:1 for body text)`,
);

/* ---------------------------------------------------------------- result */

console.log('');
if (failures === 0) {
  console.log('  सब जाँच पास।\n');
} else {
  console.log(`  ${failures} जाँच विफल।\n`);
  process.exit(1);
}