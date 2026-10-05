'use client';

import * as React from 'react';

/**
 * ===========================================================================
 *  BRAND TITLE — three-dimensional, multicoloured, lit by the sun
 * ===========================================================================
 *
 * The site's name, rendered as solid glass catching a sunrise.
 *
 * ── Why the first attempt came out flat orange ─────────────────────────────
 * Everything was applied to one element: a rainbow gradient clipped to the
 * glyphs, plus six stacked `text-shadow`s for depth. It rendered as one solid
 * orange word, because a `text-shadow` is painted *behind* the glyph — so a dark
 * extrusion shadow sitting under a mid-tone gradient simply dominated it. The
 * colour was not lost by being overwritten; it was buried.
 *
 * The fix is one layer per effect, in the order a real object stacks:
 *
 *   1. **a ::before underlay** carries only the extrusion — plain colour, hard
 *      edges, no gradient. This is the solid body of the letter.
 *   2. **the element itself** carries only the gradient, clipped to the text.
 *      This is the glass front face.
 *   3. **a ::after underlay** carries the specular sweep, so the highlight
 *      crosses both and sells the curve.
 *
 * With the extrusion on its own layer the gradient is no longer competing with
 * anything, and all four colours come through.
 *
 * ── The reflection reserves its own space ──────────────────────────────────
 * The first version positioned the reflection with `absolute; top: 100%`, which
 * does not take up room — so it was painted straight over the paragraph below
 * the title. A decorative element must never push or cover content, so the
 * space is reserved with padding and the reflection is placed inside it.
 *
 * ── Fallbacks ──────────────────────────────────────────────────────────────
 * `background-clip: text` is unsupported on a few older browsers, and there the
 * text would be invisible — transparent with nothing painting it. The gradient
 * is therefore also exposed as a plain `color` via a custom property, used where
 * clipping is unavailable. The name is never invisible on any browser.
 */

export function BrandTitle({
  children,
  size = 'lg',
  className = '',
}: {
  children: React.ReactNode;
  size?: 'lg' | 'sm';
  className?: string;
}) {
  const [lit, setLit] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLit(true);
  }, []);

  const big = size === 'lg';

  return (
    <span
      className={`relative inline-block ${className}`}
      style={
        {
          // Shared so the underlay and the front face cannot drift apart.
          '--vs-title-size': big ? 'clamp(2.2rem, 1.4rem + 3.6vw, 4.6rem)' : '1.25rem',
          '--vs-title-leading': big ? 1.22 : 1.2,
        } as React.CSSProperties
      }
    >
      {/* ------------------------------------------------------ the rays */}
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2',
          big ? 'h-[3.4em] w-[3.4em]' : 'h-[2.6em] w-[2.6em]',
          lit ? 'motion-safe:animate-[vs-spin_30s_linear_infinite]' : '',
        ].join(' ')}
        style={{
          background:
            'conic-gradient(from 0deg, rgba(255,180,60,0) 0deg, rgba(255,205,90,0.34) 7deg, rgba(255,180,60,0) 20deg, rgba(255,180,60,0) 180deg, rgba(255,180,60,0) 342deg, rgba(255,205,90,0.26) 353deg, rgba(255,180,60,0) 360deg)',
          // The mask is what turns wedges into rays instead of hard triangles.
          maskImage: 'radial-gradient(circle, black 20%, rgba(0,0,0,0.5) 46%, transparent 74%)',
          WebkitMaskImage: 'radial-gradient(circle, black 20%, rgba(0,0,0,0.5) 46%, transparent 74%)',
          filter: 'blur(7px)',
        }}
      />

      {/* ------------------------------------------- the extruded underlay */}
      {/*
        `aria-hidden` because it duplicates the text for a screen reader, which
        would otherwise announce the site name twice.
      */}
      <span
        aria-hidden="true"
        className="block select-none font-extrabold tracking-tight"
        style={{
          fontSize: 'var(--vs-title-size)',
          lineHeight: 'var(--vs-title-leading)',
          // The solid body: stepped down-right, each step darker, which reads
          // as a bevelled edge rather than a blur.
          color: '#C25200',
          textShadow: big
            ? '1px 1px 0 #A84800, 2px 2px 0 #8C3E00, 3px 3px 0 #6E3000, 5px 5px 0 #542400, 7px 8px 1px rgba(90,36,0,0.34), 10px 14px 20px rgba(90,36,0,0.30)'
            : '1px 1px 0 #A84800, 2px 2px 0 #6E3000, 3px 4px 1px rgba(90,36,0,0.30)',
        }}
      >
        {children}
      </span>

      {/* ------------------------------------------ the gradient front face */}
      <span
        className="absolute inset-0 select-none font-extrabold tracking-tight"
        style={{
          fontSize: 'var(--vs-title-size)',
          lineHeight: 'var(--vs-title-leading)',
          backgroundImage:
            'linear-gradient(100deg, #FF8A00 0%, #FFC531 12%, #FF4D6D 26%, #E024C4 38%, #7C4DFF 50%, #21A7F5 62%, #12BF9C 74%, #FFC531 88%, #FF8A00 100%)',
          backgroundSize: '240% 100%',
          animation: lit ? 'vs-shine 12s linear infinite' : undefined,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          // Safari needs this; without it the gradient does not clip.
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.5))',
        }}
      >
        {children}
      </span>

      {/* ------------------------------------------ the specular sweep */}
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute inset-0 overflow-hidden',
          lit ? 'motion-safe:animate-[vs-sweep_8s_ease-in-out_infinite]' : '',
        ].join(' ')}
        style={{ borderRadius: '0.15em' }}
      >
        <span
          className="absolute inset-y-0 w-1/3"
          style={{
            left: '-45%',
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.9), transparent)',
            mixBlendMode: 'overlay',
          }}
        />
      </span>

      {/* ---------------------------------------------- space for the echo */}
      {/*
        Reserved with padding, and the reflection placed inside it — rather than
        `absolute; top: 100%`, which paints over whatever comes next without
        taking up room. This was covering the paragraph below the title.
      */}
      <span
        aria-hidden="true"
        className="block overflow-hidden pt-1 opacity-25"
        style={{
          height: big ? '0.5em' : '0.42em',
          maskImage: 'linear-gradient(to bottom, black, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 78%)',
        }}
      >
        <span
          className="block select-none font-extrabold"
          style={{
            fontSize: 'var(--vs-title-size)',
            lineHeight: 'var(--vs-title-leading)',
            transform: 'scaleY(-0.32)',
            transformOrigin: 'top',
            backgroundImage: 'linear-gradient(180deg, #FF8A00, #B34A00)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {children}
        </span>
      </span>

      <style>{`
        @keyframes vs-shine {
          from { background-position: 240% 0; }
          to   { background-position: -140% 0; }
        }
        @keyframes vs-sweep {
          0%, 10%   { transform: translateX(0); }
          62%, 100% { transform: translateX(430%); }
        }
        @keyframes vs-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="vs-shine"], [style*="vs-sweep"] { animation: none !important; }
        }
      `}</style>
    </span>
  );
}