/**
 * ============================================================================
 *  TITLE RENDERER — the site name, 4K, multicolour
 * ============================================================================
 *
 * Produces a 3840 × 2160 image of the site's name as multicoloured dimensional
 * lettering, lit from behind by a sunrise.
 *
 * Run:  node scripts/render-title.mjs [--preview]
 * ============================================================================
 *
 * ── Why this goes through the browser at all ────────────────────────────────
 * The obvious approach is to draw the glyphs in the ray tracer, which is what
 * the artwork is made of. That is not possible for this, and the reason is
 * specific: **Devanagari is a shaping script.** न, मा and क्ष are not stored as
 * those characters — they are stored as न + ा, म + ा, क् + ष and a font's
 * OpenType tables decide how they combine, where the matra sits, which reph
 * forms, and how the headline adjusts. There is no font rasteriser in the ray
 * tracer and writing one is a project in itself.
 *
 * Chrome already has one. Driving it over the DevTools Protocol gives real
 * shaping, real kerning, real hinting — and, importantly, means the image is
 * rendered by the same engine that will display the site, so the two agree.
 *
 * ── Why 2× supersampling ───────────────────────────────────────────────────
 * The image is rendered at 7680 × 4320 and box-filtered down to 3840 × 2160.
 *
 * Rendering at 1:1 and calling it 4K gives an image that is 4K in *size* and
 * nothing else — the glyph edges are whatever Chrome's antialiasing happened to
 * produce at that size, and at 600px type those edges still carry a visible
 * staircase. Averaging each 2×2 block gives every output pixel the true average
 * of the area it covers, which is what makes an edge look clean rather than
 * merely large. This is the difference between "high resolution" and "sharp",
 * and it is the whole reason for the extra pass.
 *
 * ── Fonts ──────────────────────────────────────────────────────────────────
 * Kokila Bold for the Devanagari. It has the weight a display face needs and its
 * forms stay clean at large sizes — Nirmala UI, the Windows default, is well
 * drawn but far too light to carry 600px lettering, and light strokes at that
 * size break up. Segoe UI Black for the Latin "AI", which has a comparable
 * weight so the two scripts sit on the same optical line.
 *
 * ── On the text ────────────────────────────────────────────────────────────
 * The site name, exactly as it appears in the app, and nothing else. No
 * tagline, no watermark, no caption — a title image with extra words on it
 * stops being a title image.
 */

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { encodeRgb, decodePng, downsampleRgb } from './png.mjs';

/* -------------------------------------------------------------------------- */

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

/**
 * The site name, split into words so each can take its own colour.
 *
 * This is the one place the words are defined, and they are transcribed
 * character for character — the whole point of a title image is that it says
 * what the app is called. The Latin word carries a different font-family
 * because a Devanagari face has no Latin "A" or "I" worth using.
 */
const WORDS = [
  { text: 'वर्षा', family: "'Kokila'", tint: 'gold' },
  { text: 'समाधान', family: "'Kokila'", tint: 'pearl' },
  { text: 'AI', family: "'Segoe UI Black', 'Segoe UI'", tint: 'cyan' },
];

/** Matches --paper in the Tailwind theme: the cream the site sits on. */
const PAGE_BACKGROUND = [26, 11, 51];

/* -------------------------------------------------------------------------- */
/* The composition                                                            */
/* -------------------------------------------------------------------------- */

function buildHtml(width, height) {
  /*
   * Every dimension below is in CSS pixels at the *supersampled* size, so the
   * layout is identical in proportion at any output resolution and only the
   * final numbers change.
   */
  const words = WORDS.map(
    (w) => `
      <span class="word" style="--family:${w.family}">
        <span class="rim" aria-hidden="true">${w.text}</span>
        <span class="under" aria-hidden="true">${w.text}</span>
        <span class="face ${w.tint}">${w.text}</span>
      </span>`,
  ).join('');

  return `<!doctype html>
<html lang="hi"><head><meta charset="utf-8"><title>title</title>
<style>
  /* ---- reset ------------------------------------------------------- */
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{
    width:${width}px;height:${height}px;overflow:hidden;
    /* Opaque, so Chrome hands back a fully opaque screenshot. A transparent
       page would force the downsampler to composite against an assumed
       colour, and any mismatch shows as a tinted edge on the lettering. */
    background:rgb(${PAGE_BACKGROUND.join(',')});
  }

  .stage{position:relative;width:${width}px;height:${height}px;isolation:isolate;overflow:hidden}

  /* ---- the sky ----------------------------------------------------- */
  /*
   * Warm and deep, not black. The brief asked for strong contrast against the
   * lettering and no dark theme; a deep plum-to-gold sunrise gives contrast
   * because the middle of the gradient is genuinely dark, while every colour in
   * it is warm and in the site's family.
   */
  .sky{
    position:absolute;inset:0;
    background:linear-gradient(180deg,
      #1B0B33 0%,
      #3A1150 20%,
      #6B1455 40%,
      #A81C4E 58%,
      #DE4A22 73%,
      #F5861B 85%,
      #FFC048 100%);
  }

  /*
   * The sun's glow, sitting on the horizon below the lettering.
   *
   * This is the light source the whole image is lit by: the extrusion on each
   * letter falls down-right, away from it, and the rim highlight falls up-left,
   * toward it. Without a visible source the letters would have shading with no
   * explanation, which reads as decoration rather than as light.
   */
  .glow{
    position:absolute;left:50%;bottom:-16%;translate:-50% 0;
    width:${width * 0.62}px;height:${height * 0.72}px;
    background:radial-gradient(ellipse at 50% 100%,
      rgba(255,242,196,0.98) 0%,
      rgba(255,196,92,0.62) 26%,
      rgba(255,142,42,0.24) 52%,
      rgba(255,120,40,0) 76%);
  }

  /*
   * Crepuscular rays, from the horizon upward.
   *
   * Two repeating-conic-gradients at different angular periods (26 and 41
   * wedges) are overlaid. A single one is a perfect even starburst, which reads
   * as clipart; two incommensurate periods interfere, so some rays reinforce and
   * others partly cancel — which is exactly the irregular spacing real light
   * has after refraction through moving air.
   *
   * The radial mask is what turns hard wedges into rays: it fades them out with
   * distance, so they have no visible end.
   */
  .rays{
    position:absolute;inset:0;
    background:
      repeating-conic-gradient(from 200deg at 50% 100%,
        rgba(255,232,170,0.16) 0deg 1.6deg, rgba(255,232,170,0) 1.6deg 13.8deg),
      repeating-conic-gradient(from 214deg at 50% 100%,
        rgba(255,214,130,0.12) 0deg 1.1deg, rgba(255,214,130,0) 1.1deg 8.8deg);
    mask-image:radial-gradient(ellipse 62% 78% at 50% 100%, #000 8%, rgba(0,0,0,0.55) 40%, transparent 72%);
    -webkit-mask-image:radial-gradient(ellipse 62% 78% at 50% 100%, #000 8%, rgba(0,0,0,0.55) 40%, transparent 72%);
  }

  /*
   * Haze bands on the horizon.
   *
   * A real sky at sunrise is banded — layers of aerosol at different heights
   * catch the light separately. Without them the gradient is a smooth ramp,
   * which is the giveaway that a background is CSS rather than air.
   */
  .haze{position:absolute;left:0;right:0;pointer-events:none}
  .haze.a{height:${height * 0.16}px;bottom:${height * 0.06}px;
    background:linear-gradient(180deg,rgba(255,206,120,0) 0%,rgba(255,214,132,0.34) 46%,rgba(255,236,182,0.5) 100%);
    filter:blur(${height * 0.02}px)}
  .haze.b{height:${height * 0.1}px;bottom:${height * 0.16}px;
    background:linear-gradient(180deg,rgba(255,180,90,0) 0%,rgba(255,196,110,0.24) 100%);
    filter:blur(${height * 0.016}px)}

  /*
   * Corner vignette.
   *
   * Pulls the eye to the centre and stops the brightest part of the sky —
   * directly behind the lettering — from competing with it.
   */
  .vignette{
    position:absolute;inset:0;
    background:radial-gradient(ellipse 78% 68% at 50% 46%,
      rgba(0,0,0,0) 42%, rgba(24,6,40,0.42) 100%);
  }

  /* ---- the lettering ----------------------------------------------- */
  .stack{
    position:absolute;inset:0;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    /* Sits above centre: the sun glow occupies the lower third, and a title
       centred on the image would collide with it. */
    padding-top:${height * 0.14}px;
  }

  .title{
    font-size:400px;             /* replaced by the fit pass before capture */
    line-height:1.02;
    font-weight:700;
    white-space:nowrap;
    display:flex;align-items:baseline;gap:0.24em;
    /* Lifts the whole title clear of the brightest part of the sky. */
    position:relative;z-index:3;
  }

  .word{position:relative;display:inline-block;font-family:var(--family)}

  /*
   * Three layers per word, in the order a solid object stacks them.
   *
   * They are separate elements rather than stacked properties on one, because
   * A text-shadow is painted *behind* the glyph. One element carrying both a
   * dark extrusion shadow and a bright gradient fill renders as whichever wins —
   * in practice a flat dark word with the colour buried. Separate layers is the
   * only way to get both.
   */

  /* 1. Rim: the sunlit edge, offset toward the light. Thin, unblurred — a blur
        here would be the single softest thing in the image, and this is meant
        to be sharp. */
  .rim{
    position:absolute;left:0;top:0;
    translate:-0.014em -0.016em;
    color:rgba(255,236,178,0.85);
    z-index:0;
  }

  /* 2. Body: the extrusion. Stepped down-right, each step darker, which reads
        as a bevelled edge rather than a blurred drop shadow. */
  .under{
    position:absolute;left:0;top:0;
    color:#5C1038;
    z-index:1;
    text-shadow:
      0.012em 0.012em 0 #4A0C2C,
      0.026em 0.028em 0 #3A0820,
      0.042em 0.046em 0 #2B0517,
      0.060em 0.068em 0 #1D0310,
      0.085em 0.100em 0.012em rgba(20,2,12,0.62),
      0.130em 0.165em 0.038em rgba(14,1,8,0.50);
  }

  /* 3. Face: the glass front, filled with a vertical gradient.

        THIS LAYER STAYS IN NORMAL FLOW, and that is load-bearing rather than
        incidental. It is the only in-flow child of the word box, so it is what gives
        the word its width. The first render positioned all three layers
        absolutely; the .word box then had no in-flow content at all, collapsed to
        width, and all three words began at the same x — the output was
        "वर्षा समाधान AI" piled on top of itself in the left third of the frame.
        The underlay and rim are positioned against the word box and must be out of
        flow; the face must not be. */
  .face{
    position:relative;
    -webkit-background-clip:text;background-clip:text;
    color:transparent;-webkit-text-fill-color:transparent;
    z-index:2;
  }

  /*
   * Each word its own colour, and each gradient lit from the top.
   *
   * The shared shape of the three gradients is deliberate — light at the top,
   * saturated mid, deep at the base — so they read as three materials under one
   * light source rather than three unrelated colours.
   */
  .gold{
    background-image:linear-gradient(180deg,
      #FFF4BC 0%, #FFDD62 24%, #FFB020 56%, #FF7A05 84%, #E85A00 100%);
  }
  .pearl{
    background-image:linear-gradient(180deg,
      #FFFFFF 0%, #FFF8F4 26%, #FFE6F3 58%, #FFB9DF 86%, #F87FC0 100%);
  }
  .cyan{
    background-image:linear-gradient(180deg,
      #E6FFFF 0%, #8FF6FF 24%, #35D2F2 56%, #12A5DC 84%, #0A7CC0 100%);
  }

  /*
   * Specular sweep.
   *
   * One broad diagonal band of light across the whole image, as if a pane of
   * glass were catching a sunrise.
   *
   * This was first placed inside the title element, which produced a hard-edged
   * pale rectangle sitting across the first word: the band was clipped to the
   * title's bounding box, so its top and bottom cuts were straight lines with a
   * visible corner where they met the band. It is now a stage-level layer,
   * taller than the lettering and masked so it dissolves at both ends — a light
   * sweep rather than a box.
   *
   * soft-light rather than overlay: overlay pushes anything it touches
   * toward the extremes of its own range, which on a mid-tone sky visibly
   * posterises. soft-light brightens gently and keeps the gradient smooth.
   */
  .spec{
    position:absolute;inset:0;z-index:2;pointer-events:none;
    mix-blend-mode:soft-light;
  }
  .spec i{
    position:absolute;
    left:-30%;right:-30%;
    /* Spans past the frame and is masked, so its own ends are never the ones
       that show. */
    top:16%;bottom:16%;
    background:linear-gradient(101deg,
      rgba(255,255,255,0) 34%,
      rgba(255,246,226,0.52) 47%,
      rgba(255,255,255,0.78) 50%,
      rgba(255,246,226,0.52) 53%,
      rgba(255,255,255,0) 66%);
    -webkit-mask-image:linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%);
    mask-image:linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%);
  }

  /* 4. Reflection: a solid object on a polished floor reflects, and its absence
        is what makes a headline look pasted on. Flipped, faded, and masked.

        Kept faint on purpose. At full strength it competes with the lettering
        for attention and pulls the eye down into the empty half of the frame;
        at 14% it reads as a polished surface, which is the only job it has. */
  .echo{
    position:relative;z-index:2;
    margin-top:-0.02em;
    font-size:400px;line-height:1.02;font-weight:700;white-space:nowrap;
    display:flex;align-items:baseline;gap:0.24em;justify-content:center;
    opacity:0.14;
    -webkit-mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.3) 26%, transparent 58%);
    mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.3) 26%, transparent 58%);
  }
  .echo .word{color:transparent}
  .echo .under{display:none}
  .echo .rim{display:none}
  .echo .face{
    position:static;
    background-image:linear-gradient(180deg,#FFFFFF 0%,#FFD9A0 44%,#FF9E4A 100%);
    transform:scaleY(-0.36);transform-origin:top;
  }
</style></head>
<body>
  <div class="stack">
    <div>
      <h1 class="title" id="title">${words}</h1>
      <div class="echo" aria-hidden="true">${words}</div>
    </div>
  </div>

  <div class="stage">
    <div class="sky"></div>
    <div class="rays"></div>
    <div class="glow"></div>
    <div class="haze a"></div>
    <div class="haze b"></div>
    <div class="spec"><i></i></div>
    <div class="vignette"></div>
  </div>

  <script>
    // The lettering sits above the sky. Set here rather than in the stylesheet so
    // the markup above reads top to bottom as the list of background layers.
    document.querySelector('.stack').style.zIndex = '3';
    document.querySelector('.stage').style.zIndex = '1';

    /*
     * Fit the title to the frame.
     *
     * Guessing a font size is fragile: the rendered width of Devanagari depends
     * on the shaping of matras and conjuncts, which varies with the font, so
     * the same nominal size gives a different width for different words. This
     * measures the real width and converges on the largest size that still fits
     * inside the target, rather than trusting arithmetic.
     */
    (function fit() {
      const title = document.getElementById('title');
      const echo = document.querySelector('.echo');
      const target = ${Math.round(width * 0.855)};

      let lo = 120, hi = 1600, best = lo;
      for (let i = 0; i < 26; i++) {
        const mid = (lo + hi) / 2;
        title.style.fontSize = mid + 'px';
        echo.style.fontSize = mid + 'px';
        const w = title.getBoundingClientRect().width;
        if (w <= target) { best = mid; lo = mid; } else { hi = mid; }
      }
      // A hair under the limit, so a rounding difference cannot push it over.
      const size = best * 0.995;
      title.style.fontSize = size + 'px';
      echo.style.fontSize = size + 'px';

      document.title = 'ready:' + Math.round(size);
    })();
  </script>
</body></html>`;
}

/* -------------------------------------------------------------------------- */
/* Chrome over the DevTools Protocol                                         */
/* -------------------------------------------------------------------------- */

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`${method} timed out`));
        }
      }, 120_000);
    });
  }
}

function findChrome() {
  for (const path of CHROME_CANDIDATES) if (existsSync(path)) return path;
  throw new Error('Chrome or Edge not found');
}

async function capture(htmlPath, width, height) {
  const profile = mkdtempSync(join(tmpdir(), 'vs-title-'));
  // An explicit port, not port 0. Chrome only prints a `ws://` endpoint when
  // remote debugging is switched on, and relying on that stderr line is brittle
  // across locales and Chrome versions. Asking the HTTP endpoint instead is one
  // request and always works.
  const port = 9700 + Math.floor(Math.random() * 500);

  const chrome = spawn(
    findChrome(),
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--mute-audio',
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${port}`,
      `--window-size=${width},${height}`,
      /*
       * Both of these matter for the supersampled pass. Hinting snaps stems to
       * the pixel grid at the *rendered* size; rendering at 2× and averaging
       * afterwards then leaves uneven stroke weights where the hinting differed.
       * Turning it off makes the geometry pure outline, which averages cleanly.
       * The same applies to subpixel positioning, which would otherwise shift
       * glyphs by fractions of a pixel and show up as uneven colour edges.
       */
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--disable-lcd-text',
      '--force-device-scale-factor=1',
      'about:blank',
    ],
    // stderr is left alone; the endpoint comes from the HTTP API below.
    { stdio: 'ignore' },
  );

  try {
    /*
     * Connect to a *page* target, not the browser endpoint.
     *
     * `/json/version` returns the browser-level WebSocket, which only speaks
     * `Browser.*` and `Target.*`; sending it `Page.enable` closes the socket with
     * "Page.enable wasn't found". A page target's own WebSocket is what accepts
     * `Page.*`, so `/json/list` is queried for one.
     */
    const endpoint = await new Promise((resolve, reject) => {
      const deadline = Date.now() + 30_000;
      const attempt = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:${port}/json/list`);
          const targets = await res.json();
          const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
          if (page) return resolve(page.webSocketDebuggerUrl);
        } catch {
          /* not listening yet */
        }
        if (Date.now() > deadline) {
          reject(new Error('Chrome did not open its debugging port'));
          return;
        }
        await sleep(250);
        void attempt();
      };
      void attempt();
    });

    const ws = new WebSocket(endpoint);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error('CDP socket failed')), {
        once: true,
      });
    });

    const cdp = new Cdp(ws);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // Device metrics rather than window size: headless clamps real windows, and
    // 7680 × 4320 is past what it will give.
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `file:///${htmlPath.replace(/\\/g, '/')}` });
    await sleep(2500);

    // The fit pass reports the chosen size in the title; if it did not run, the
    // layout is unsized and the capture would be wrong. Better to stop here.
    const ready = await cdp.send('Runtime.evaluate', {
      expression: 'document.title',
      returnByValue: true,
    });
    if (!String(ready.result.value).startsWith('ready:')) {
      throw new Error('The fit pass did not run; refusing to capture an unsized page');
    }
    const chosenSize = Number(String(ready.result.value).split(':')[1]);

    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      clip: { x: 0, y: 0, width, height, scale: 1 },
    });

    ws.close();
    return { buffer: Buffer.from(shot.data, 'base64'), chosenSize };
  } finally {
    chrome.kill();
    // Wait for the process to actually exit before deleting its profile.
    // Removing a directory Chrome still holds fails with EPERM on Windows, and
    // the failure aborts the whole render after the image was already captured.
    await new Promise((resolve) => {
      if (chrome.exitCode !== null) return resolve();
      const timer = setTimeout(resolve, 8000);
      chrome.on('exit', () => {
        clearTimeout(timer);
        resolve();
      });
    });
    // Best effort: a stray lock file left behind is harmless, a throw here is not.
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
    } catch {
      /* Chrome will release it; the OS clears the temp directory eventually */
    }
  }
}

/* -------------------------------------------------------------------------- */

async function main() {
  const preview = process.argv.includes('--preview');

  // Output is 4K UHD, exactly. Preview is the same composition at a size quick
  // enough to iterate on.
  const OUT_W = 3840;
  const OUT_H = 2160;
  const factor = preview ? 1 : 2;
  const renderW = OUT_W * factor;
  const renderH = OUT_H * factor;

  const dir = join(process.cwd(), preview ? 'preview' : join('public', 'art'));
  mkdirSync(dir, { recursive: true });
  const htmlPath = join(dir, 'title.html');
  writeFileSync(htmlPath, buildHtml(renderW, renderH), 'utf8');

  process.stdout.write(
    `  शीर्षक ${OUT_W}×${OUT_H}${factor > 1 ? ` (${renderW}×${renderH} से supersampled)` : ''} … `,
  );

  const { buffer, chosenSize } = await capture(htmlPath, renderW, renderH);
  const decoded = decodePng(buffer);

  if (decoded.width !== renderW || decoded.height !== renderH) {
    throw new Error(
      `Screenshot was ${decoded.width}×${decoded.height}, expected ${renderW}×${renderH}`,
    );
  }

  const final =
    factor > 1
      ? downsampleRgb(decoded, factor, PAGE_BACKGROUND)
      : { ...decoded, channels: 3 };

  const png = encodeRgb(final.width, final.height, final.data);
  const outPath = join(dir, 'title.png');
  writeFileSync(outPath, png);

  console.log(`\n  फ़ॉन्ट आकार: ${chosenSize}px`);
  console.log(`  तैयार: ${dir.replace(process.cwd() + '\\', '')}/title.png`);
  console.log(
    `  ${final.width}×${final.height}, ${(png.length / 1024 / 1024).toFixed(2)} MB\n`,
  );
}

main().catch((error) => {
  console.error(`\n  विफल: ${error.message}\n`);
  process.exit(1);
});