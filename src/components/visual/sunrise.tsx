'use client';

import * as React from 'react';

/**
 * ===========================================================================
 *  SUNRISE
 * ===========================================================================
 *
 * The ray-traced sun, climbing out of the horizon on load. The first thing
 * anyone sees when the site opens.
 *
 * ── Why a rendered PNG and not an SVG ──────────────────────────────────────
 * The SVG version read as an icon, because it *was* one: a gradient-filled
 * circle with rectangular rays has no shading model, so nothing suggested a
 * luminous sphere. The rendered sun has limb darkening (the edge of a real star
 * is dimmer and redder, which is most of what sells the sphere), a two-lobe
 * corona, and uneven crepuscular rays. It is a picture of light, not a drawing
 * of one. See `scripts/render-sun.mjs`.
 *
 * ── Why the horizon does not move ──────────────────────────────────────────
 * The obvious way to animate a rising sun is to slide a finished picture
 * upward, but that reads as a sticker being dragged — the horizon travels with
 * it. Here the sun moves and the horizon is fixed at the bottom of the frame,
 * so the sun emerges *from behind* the skyline.
 *
 * ── Reduced motion ────────────────────────────────────────────────────────
 * A large moving element is genuinely unpleasant for someone with vestibular
 * sensitivity. `prefers-reduced-motion` skips straight to the risen state, and
 * the page is fully usable either way — this is decoration, never a gate.
 *
 * ── Once per session ──────────────────────────────────────────────────────
 * The animation belongs to the app opening, not to navigating. `sessionStorage`
 * stops it replaying on every internal link, which would quickly become the
 * thing people complain about.
 */

const KEY = 'vs-sunrise-seen';

export function Sunrise({
  size = 40,
  /** How far below its final position the sun starts, as a fraction of size. */
  rise = 0.55,
  className = '',
}: {
  size?: number;
  rise?: number;
  className?: string;
}) {
  const [phase, setPhase] = React.useState<'hidden' | 'rising' | 'done'>('hidden');

  React.useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(KEY) === '1';
    } catch {
      // Private browsing: play it each time rather than risk nothing happening.
    }

    if (alreadySeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* nothing to do */
      }
      return;
    }

    setPhase('rising');
    const done = window.setTimeout(() => {
      setPhase('done');
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* nothing to do */
      }
    }, 2200);

    return () => window.clearTimeout(done);
  }, []);

  // `hidden` is only the pre-hydration frame; rendering the finished state
  // there keeps server and client markup identical so React does not discard
  // and rebuild the header.
  const risen = phase !== 'rising';

  return (
    <span
      className={`relative block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/*
        The horizon: a bright band across the bottom of the frame. Fixed, so the
        sun passes behind it rather than carrying it upward.
      */}
      <span
        className="absolute inset-x-[-18%] bottom-[-6%] h-[26%] rounded-[100%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255,190,80,0.95) 0%, rgba(255,150,20,0.5) 45%, rgba(255,150,20,0) 72%)',
        }}
      />

      <span
        className="absolute inset-0 transition-transform"
        style={{
          // Slight overshoot on the settle, so the sun arrives with a little
          // weight rather than sliding to a stop like a UI element.
          transform: risen ? 'translateY(0) scale(1)' : `translateY(${rise * 100}%) scale(0.86)`,
          transitionDuration: '1900ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 0.85, 0.3, 1)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element — the sun is the
            brand mark; next/image would add a layout shift and an optimisation
            step for a file that is already a traced, hand-tuned PNG. */}
        <img src="/art/sun.png" alt="" width={size} height={size} className="h-full w-full" />
      </span>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .vs-sunrise * { transition: none !important; }
        }
      `}</style>
    </span>
  );
}

/**
 * The wide sky behind the hero, sharing the timing of the header sun so the
 * page reads as one event rather than two.
 *
 * Kept as a separate component because it serves a different job: it is the
 * atmosphere the sun sits in, not the sun itself.
 */
export function SunriseBanner({ src }: { src: string }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    // One frame's delay so the browser paints the initial state first; without
    // it the transition has nothing to transition *from*.
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/*
        The rendered sky. The image darkens slightly, then floods with light —
        that is the sunrise moment, carried by the whole background rather than
        by a graphic sitting on top of it.
      */}
      <div
        className="absolute inset-0 transition-[opacity,filter] duration-[2600ms] ease-out"
        style={{
          opacity: visible ? 1 : 0,
          filter: visible ? 'saturate(1.06) brightness(1.02)' : 'saturate(0.6) brightness(0.86)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a rendered
            background, and next/image would add a layout shift for nothing. */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>

      {/*
        Legibility wash.

        A single gradient at 35–55% white looked clean over empty sky but let
        the rendered clouds show straight through the headline. Text over
        imagery needs a floor, not just a tint: this adds a solid-ish centre
        band so contrast never drops below the readable threshold no matter what
        the render puts behind the words.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/75 via-paper/70 to-paper/95" />
    </div>
  );
}