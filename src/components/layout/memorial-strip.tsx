import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { readImageMeta, photoUrl } from '@/server/images';
import { VARSHA } from '@/content/tribute';
import { getT } from '@/server/i18n';
import { prisma } from '@/server/db';
import { safeRead } from '@/server/db-guard';

/**
 * ===========================================================================
 *  THE MEMORIAL STRIP — who this site is for
 * ===========================================================================
 *
 * The photograph, her name, and the line she is remembered by, on the home page
 * above everything else.
 *
 * ── Why the picture is fetched and not imported ────────────────────────────
 *
 * Because the owner changes it. `/public/art/varsha.jpg` was a file in the
 * build output, which means the next deployment deletes it — the photograph
 * vanishes with no error on a page whose whole purpose is remembrance. This
 * reads it from the database instead, where the owner can replace it from a
 * phone and it survives every deploy.
 *
 * When nothing has been uploaded, the component renders nothing at all. An
 * empty grey box where a person should be is worse than no box, and a broken
 * image icon on a memorial page is worse still.
 *
 * ── Why `VARSHA` is spelled the way it is ──────────────────────────────────
 *
 * The owner's instruction, given more than once: in English capitals, in every
 * language. The Devanagari spelling of her name is also the Hindi word for
 * rain, and it is not written here even in a comment — a rule that is broken
 * once in a file becomes normal.
 *
 * So the heading is written V-A-R-S-H-A and nothing else, even though the
 * surrounding prose is Hindi. `nameplate` is kept in the tribute file for the
 * sentences that refer to her in the third person; the heading, which is the
 * thing people read first, uses the capitals.
 */
export async function MemorialStrip() {
  const { t } = await getT();

  const meta = await safeRead(
    'home:memorial-photo',
    () => readImageMeta('varsha-photo'),
    null,
  );

  // Nothing uploaded, so nothing drawn.
  if (!meta) return null;

  // Read once, not per render, and not at all if the database is unreachable.
  const exists = await safeRead(
    'home:memorial-photo-exists',
    () => prisma.siteImage.count({ where: { key: 'varsha-photo' } }),
    0,
  );
  if (exists === 0) return null;

  return (
    <section
      aria-labelledby="memorial-heading"
      className="relative overflow-hidden border-b border-line bg-surface"
    >
      {/*
        No image component here.

        `next/image` wants to know the width and height at build time to stop a
        layout jumping when the picture arrives, and this picture has neither —
        it is whatever the owner uploaded, changed whenever they choose. The
        width and height are therefore set from the element itself, the
        container has an aspect ratio, and the box holds its shape before
        anything loads. An optimisation that needs the dimensions the thing does
        not have is the wrong optimisation.
      */}
      <div className="wrap">
        <div className="grid items-center gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 sm:py-14">
          {/*
            The whole picture, never a crop of it.

            The first version of this put the photograph in a circle, which cut
            the memorial card down to her shoulder beside the letters GV S.

            The card was then cropped to the left side — her photograph, the
            lotus and the gold circle — because the owner does not want GV SEVA
            anywhere on the site, and those words were printed inside the image.
            The uncropped card is kept at /art/gv-seva-full.jpg, because a crop
            is a decision and not a fact, and the original is the only place the
            full card still exists.

            So it is shown whole. That is the right default for this picture and
            for the next one as well, because the owner can replace it from the
            panel without knowing anything about how it will be cropped.

            `object-contain`, not `object-cover`, for the same reason: a
            photograph of a person should not lose part of itself to a box.
            No fixed height either — the picture is nearly square, so a box that
            imposed a shape would letterbox it on purpose.
          */}
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-sun/10 shadow-lift lg:mx-0 lg:max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl(meta.key)}
              alt={meta.alt || VARSHA.nameplate}
              className="max-h-[26rem] w-full object-contain"
              // The owner replaces this and expects to see it. Caching it for a
              // month is the one behaviour that would make the panel look
              // broken.
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-saffron-deep">
              {t('home.memorialEyebrow')}
            </p>

            <h2 id="memorial-heading" className="mt-2 font-display text-3xl sm:text-4xl">
              VARSHA SAMADHAN
            </h2>

            <p className="mt-1 text-lg text-ink-muted">{VARSHA.nameplate}</p>

            <p className="mx-auto mt-4 max-w-xl text-ink-subtle lg:mx-0">
              {t('home.memorialLine')}
            </p>

            <Link href="/smriti" className="btn-outline mt-6 !min-h-[2.75rem]">
              <Icon name="arrow" size={16} />
              {t('home.memorialMore')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
