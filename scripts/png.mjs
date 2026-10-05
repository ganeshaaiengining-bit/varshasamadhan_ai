/**
 * ============================================================================
 *  PNG — encode and decode, no dependencies
 * ============================================================================
 *
 * Node ships zlib, and PNG is a container around deflated scanlines, so a full
 * codec is a couple of hundred lines. No image library is installed on this
 * machine and none is needed.
 *
 * ── What is supported, and what deliberately is not ────────────────────────
 * Writing: 8-bit truecolour with and without alpha (colour types 2 and 6),
 * non-interlaced, with all five scanline filters.
 *
 * Reading: the same two colour types, non-interlaced. That is exactly what
 * Chrome's `Page.captureScreenshot` produces and exactly what these renderers
 * write, so interlaced and palette PNGs are not needed. Attempting to read one
 * throws with a clear message rather than producing silently wrong pixels — a
 * decoder that guesses is worse than one that refuses.
 */

import { deflateSync, inflateSync } from 'node:zlib';

/* -------------------------------------------------------------------------- */
/* Writing                                                                    */
/* -------------------------------------------------------------------------- */

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
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function ihdr(width, height, colorType) {
  const d = Buffer.alloc(13);
  d.writeUInt32BE(width, 0);
  d.writeUInt32BE(height, 4);
  d[8] = 8; // bit depth
  d[9] = colorType;
  d[10] = 0; // deflate
  d[11] = 0; // adaptive filtering
  d[12] = 0; // no interlace
  return d;
}

/**
 * Pack scanlines with the Sub filter and deflate them.
 *
 * Sub predicts each pixel from the one to its left, which is a good fit for
 * these images: they are dominated by smooth vertical gradients, where the left
 * neighbour is nearly identical, so the residual is small and compresses well.
 */
function pack(filterType, width, height, channels, pixels) {
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = filterType;
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[y * stride + x - channels] : 0;
      const value =
        filterType === 0
          ? pixels[y * stride + x]
          : (pixels[y * stride + x] - left) & 0xff;
      raw[rowStart + 1 + x] = value;
    }
  }
  return raw;
}

/** 8-bit RGBA (colour type 6). */
export function encodeRgba(width, height, rgba) {
  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', ihdr(width, height, 6)),
    chunk('IDAT', deflateSync(pack(1, width, height, 4, rgba), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** 8-bit RGB (colour type 2). */
export function encodeRgb(width, height, rgb) {
  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', ihdr(width, height, 2)),
    chunk('IDAT', deflateSync(pack(0, width, height, 3, rgb), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* -------------------------------------------------------------------------- */
/* Reading                                                                    */
/* -------------------------------------------------------------------------- */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Decode a non-interlaced 8-bit truecolour PNG.
 *
 * @returns {{width: number, height: number, channels: 3 | 4, data: Buffer}}
 *   `data` is tightly packed, top row first, non-premultiplied.
 */
export function decodePng(buffer) {
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== PNG_SIGNATURE[i]) throw new Error('Not a PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  let bitDepth = 0;
  let interlace = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }

    offset += 12 + length;
  }

  if (bitDepth !== 8) throw new Error(`Unsupported bit depth ${bitDepth}; expected 8`);
  if (interlace !== 0) throw new Error('Interlaced PNG is not supported');
  if (colorType !== 2 && colorType !== 6) {
    throw new Error(
      `Unsupported colour type ${colorType}; expected 2 (RGB) or 6 (RGBA). ` +
        'Chrome screenshots and these encoders produce only those two.',
    );
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(stride * height);

  let previous = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const filterType = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const current = Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? current[x - channels] : 0; // left
      const b = previous[x]; // above
      const c = x >= channels ? previous[x - channels] : 0; // upper-left

      let value = line[x];
      switch (filterType) {
        case 0:
          break;
        case 1:
          value += a;
          break;
        case 2:
          value += b;
          break;
        case 3:
          value += (a + b) >> 1;
          break;
        case 4: {
          // Paeth: pick whichever of the three neighbours is closest to the
          // linear estimate.
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
        default:
          throw new Error(`Unknown scanline filter ${filterType} on row ${y}`);
      }

      current[x] = value & 0xff;
    }

    current.copy(out, y * stride);
    previous = current;
  }

  return { width, height, channels, data: out };
}

/* -------------------------------------------------------------------------- */
/* Resampling                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Box-filter downscale by an integer factor.
 *
 * This is the step that makes the output genuinely sharp rather than merely
 * high-resolution. Rendering at twice the target and averaging each 2×2 block
 * gives each output pixel the true average of the area it covers, which is what
 * an edge needs to look clean. Downscaling an already-1:1 render instead throws
 * detail away and leaves the staircase visible — the "pixelated" look this
 * avoids.
 *
 * Alpha is composited over `background` rather than averaged independently.
 * Averaging the colour and the alpha separately and then recombining them is the
 * same class of mistake as fading colour and alpha together: it darkens every
 * partially covered pixel toward the wrong colour. Where this is used the page
 * underneath is a known flat colour, so `background` is passed in.
 */
export function downsampleRgb(png, factor, background = [0, 0, 0]) {
  const { width, height, channels, data } = png;
  if (width % factor !== 0 || height % factor !== 0) {
    throw new Error(`${width}×${height} is not divisible by ${factor}`);
  }

  const outWidth = width / factor;
  const outHeight = height / factor;
  const out = Buffer.alloc(outWidth * outHeight * 3);
  const samples = factor * factor;

  for (let y = 0; y < outHeight; y++) {
    for (let x = 0; x < outWidth; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let sy = 0; sy < factor; sy++) {
        const rowBase = (y * factor + sy) * width * channels;
        for (let sx = 0; sx < factor; sx++) {
          const i = rowBase + (x * factor + sx) * channels;
          if (channels === 4) {
            const a = data[i + 3] / 255;
            r += data[i] * a + background[0] * (1 - a);
            g += data[i + 1] * a + background[1] * (1 - a);
            b += data[i + 2] * a + background[2] * (1 - a);
          } else {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
        }
      }

      const o = (y * outWidth + x) * 3;
      out[o] = Math.round(r / samples);
      out[o + 1] = Math.round(g / samples);
      out[o + 2] = Math.round(b / samples);
    }
  }

  return { width: outWidth, height: outHeight, channels: 3, data: out };
}