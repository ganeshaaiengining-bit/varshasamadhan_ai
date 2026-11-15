/**
 * One-off: make phone-sized copies of the rendered art.
 *
 * `sun.png` is 4096Ã—4096 and 5.9 MB, and the header shows it at 44 px.
 * `sunrise-wide.png` is 3840Ã—2160 and 629 KB behind the hero. Both are served at
 * full size on every phone that opens the site, which is the single largest
 * thing on the page.
 *
 * The alpha channel is averaged with the colour rather than composited onto a
 * flat background: the sun sits over three different backgrounds, so a flattened
 * copy would show as a square.
 *
 * Run with: node scripts/resize-art.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { decodePng, encodeRgba } from './png.mjs';

function resize(png, factor) {
  const { width, height, channels, data } = png;
  if (width % factor || height % factor) {
    throw new Error(`${width}Ã—${height} is not divisible by ${factor}`);
  }

  const outWidth = width / factor;
  const outHeight = height / factor;
  const out = Buffer.alloc(outWidth * outHeight * 4);
  const samples = factor * factor;

  for (let y = 0; y < outHeight; y++) {
    for (let x = 0; x < outWidth; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let sy = 0; sy < factor; sy++) {
        const row = (y * factor + sy) * width * channels;
        for (let sx = 0; sx < factor; sx++) {
          const i = row + (x * factor + sx) * channels;
          const alpha = channels === 4 ? data[i + 3] / 255 : 1;
          r += data[i] * alpha;
          g += data[i + 1] * alpha;
          b += data[i + 2] * alpha;
          a += alpha;
        }
      }

      const o = (y * outWidth + x) * 4;
      if (a > 0) {
        out[o] = Math.round(r / a);
        out[o + 1] = Math.round(g / a);
        out[o + 2] = Math.round(b / a);
        out[o + 3] = Math.round((a / samples) * 255);
      }
    }
  }

  return { width: outWidth, height: outHeight, channels: 4, data: out };
}

const jobs = [
  ['public/art/sun.png', 32, 'public/art/sun-128.png'],
  ['public/art/sun.png', 16, 'public/art/sun-256.png'],
  ['public/art/sunrise-wide.png', 3, 'public/art/sunrise-wide-1280.png'],
  ['public/art/sunrise-wide.png', 2, 'public/art/sunrise-wide-1920.png'],
];

for (const [source, factor, target] of jobs) {
  const png = decodePng(readFileSync(source));
  const small = resize(png, factor);
  const buffer = encodeRgba(small.width, small.height, small.data);
  writeFileSync(target, buffer);
  console.log(`${target} ${small.width}Ã—${small.height} ${Math.round(buffer.length / 1024)} KB`);
}

