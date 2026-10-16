import { prisma } from '@/server/db';

/**
 * ===========================================================================
 *  THE OWNER'S PICTURES
 * ===========================================================================
 *
 * The owner's photographs, stored in the database so that a deployment cannot
 * take them away.
 *
 * ── Why not /public ────────────────────────────────────────────────────────
 *
 * Because `public/` is part of the build output. Every deploy replaces it. A
 * photograph placed there works perfectly until the next push, then 404s — with
 * no error anywhere, on a memorial page, which is the worst place on a site for
 * something to disappear without explanation.
 *
 * Stored here instead, the owner changes it from a phone, it survives deploys
 * and rollbacks, and nobody has to ask me to put it back.
 *
 * ── What this file does not do ─────────────────────────────────────────────
 *
 * It does not check whether the caller is the owner, and it does not check the
 * size. Both of those are in the route, which is the only place that can see the
 * request — a helper called from three places would check them three times and
 * the fourth caller would forget. This is the storage; the route is the door.
 */

/** The largest photograph worth storing, decoded. */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/**
 * What a browser will actually paint.
 *
 * WebP is listed because a phone photograph is usually 2–4 MB as a JPEG and
 * about 400 KB as a WebP, and the difference matters on a slow connection. PNG
 * is there for a screenshot or a drawing with text in it, where WebP would blur
 * the letters.
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export interface SiteImage {
  key: string;
  mime: string;
  alt: string;
  byteSize: number;
  updatedAt: Date;
}

/** The names of the pictures the site knows about. */
export const IMAGE_KEYS = {
  /** Shown on the home page and the memorial page. */
  varsha: 'varsha-photo',
} as const;

export type ImageKey = (typeof IMAGE_KEYS)[keyof typeof IMAGE_KEYS];

export function isImageKey(value: string): value is ImageKey {
  return Object.values(IMAGE_KEYS).includes(value as ImageKey);
}

/** The public path a photograph is served from. */
export function photoUrl(key: string): string {
  return `/api/photo/${encodeURIComponent(key)}`;
}

/** Replace a photograph. The old one is overwritten, not kept. */
export async function saveImage(input: {
  key: string;
  mime: string;
  data: string;
  byteSize: number;
  alt: string;
}): Promise<SiteImage> {
  return prisma.siteImage.upsert({
    where: { key: input.key },
    create: {
      key: input.key,
      mime: input.mime,
      data: input.data,
      byteSize: input.byteSize,
      alt: input.alt,
    },
    update: {
      mime: input.mime,
      data: input.data,
      byteSize: input.byteSize,
      alt: input.alt,
    },
    select: { key: true, mime: true, alt: true, byteSize: true, updatedAt: true },
  });
}

/** Take a photograph away. Returns whether there was one to remove. */
export async function deleteImage(key: string): Promise<boolean> {
  try {
    await prisma.siteImage.delete({ where: { key } });
    return true;
  } catch {
    // Prisma's not-found error, or a database that is not there. Both mean the
    // same thing to the caller: there is nothing to remove.
    return false;
  }
}

/** The picture's description, without the picture itself. */
export async function readImageMeta(key: string): Promise<SiteImage | null> {
  try {
    return await prisma.siteImage.findUnique({
      where: { key },
      select: { key: true, mime: true, alt: true, byteSize: true, updatedAt: true },
    });
  } catch {
    return null;
  }
}

/**
 * The picture's bytes, as a buffer.
 *
 * The base64 is decoded here rather than being handed out as a string, because
 * the caller wants to set a content length and write a buffer and does not want
 * to think about either.
 */
export async function readImageBytes(
  key: string,
): Promise<{ mime: string; alt: string; bytes: Buffer } | null> {
  try {
    const row = await prisma.siteImage.findUnique({ where: { key } });
    if (!row) return null;
    return {
      mime: row.mime,
      alt: row.alt,
      bytes: Buffer.from(row.data, 'base64'),
    };
  } catch {
    return null;
  }
}
