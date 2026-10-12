'use client';

import * as React from 'react';

/**
 * ===========================================================================
 *  स्मृति चौकट — the memorial portrait frame
 * ===========================================================================
 *
 * The photograph of वर्षा जी, in a double gilt frame, with her nameplate
 * beneath it.
 *
 * ── Why a component and not markup in the page ─────────────────────────────
 * The gilt is the fiddly part: a gradient that has to run at an angle through
 * two nested bands and still read as metal rather than as a yellow rectangle.
 * Written inline in the page it would be duplicated the moment the frame
 * appeared anywhere else — the footer, a share card — and the two copies would
 * drift apart. It lives here so there is exactly one frame to get right.
 *
 * ── Why the bands are gradients and not flat gold ──────────────────────────
 * A flat #FFD700 fill reads as a highlighter. Real gilt has a *directional*
 * sheen because it is a surface catching light from one side, so the colour
 * runs light → dark → light across the band instead of staying put. That
 * travelling highlight is the whole trick; the stops below are what make the
 * border look pressed rather than printed.
 *
 * ── The crop ───────────────────────────────────────────────────────────────
 * `aspect-[4/5]` with `object-top`, not a square. A square of this photograph
 * would include the desk, the laptop and the pen holder, and she would become a
 * person at a workstation. The 4:5 crop keeps head and shoulders and lets her
 * face sit high in the frame, which is how a memorial portrait is meant to
 * read. `object-top` is what stops the crop eating her forehead — the browser
 * centres by default, and centring this photo cuts the top of her head off.
 *
 * ── If the photograph is missing ───────────────────────────────────────────
 * The frame renders nothing at all. A broken-image icon inside an ornate gilt
 * border would look like a bug on a memorial page, which is the worst place on
 * the whole site to have one. The page stays whole; it simply has no portrait,
 * exactly as it does today.
 */

export function MemoryFrame({
  src,
  alt,
  /** The plate under the portrait. Omit for no plate. */
  nameplate,
  className = '',
}: {
  src: string;
  alt: string;
  nameplate?: string;
  className?: string;
}) {
  const [missing, setMissing] = React.useState(false);

  // Reset when the photograph is swapped, so the new one gets a fresh attempt.
  React.useEffect(() => setMissing(false), [src]);

  if (missing) return null;

  return (
    <figure className={`m-0 ${className}`}>
      {/* ------------------------------------------------- outer gilt band */}
      <div
        className="rounded-[var(--radius)] p-[11px] shadow-lift"
        style={{
          background:
            'linear-gradient(135deg, #f9e3a0 0%, #d8a733 14%, #f7e5b4 30%, #b8860b 48%,' +
            ' #f2dda4 64%, #c8952a 80%, #efdc9e 100%)',
        }}
      >
        {/* --------------------------------------- inner rule, the dark gap */}
        <div
          className="rounded-[7px] p-[3px]"
          style={{ background: 'linear-gradient(135deg, #7d5a12 0%, #b8860b 50%, #6d4d10 100%)' }}
        >
          {/* ------------------------------------------- the photograph */}
          <div className="overflow-hidden rounded-[5px] bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element -- the
                memorial portrait. It is a fixed, hand-checked asset on the
                server, and next/image would only add an optimisation step and
                a layout shift to a page that must not reflow. */}
            <img
              src={src}
              alt={alt}
              width={1254}
              height={1568}
              onError={() => setMissing(true)}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- the nameplate */}
      {nameplate ? (
        <figcaption className="mt-5 text-center">
          {/* Two short gilt rules, with the nameplate between them. */}
          <div
            aria-hidden="true"
            className="mx-auto h-px w-16"
            style={{ background: 'linear-gradient(90deg, transparent, #b8860b, transparent)' }}
          />
          <p className="mt-3 font-bold tracking-[0.12em] text-saffron-deep">{nameplate}</p>
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-px w-16"
            style={{ background: 'linear-gradient(90deg, transparent, #b8860b, transparent)' }}
          />
        </figcaption>
      ) : null}
    </figure>
  );
}
