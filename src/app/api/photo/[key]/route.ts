import { NextResponse } from 'next/server';
import { readImageBytes, isImageKey } from '@/server/images';
import { safeRead } from '@/server/db-guard';

/**
 * Serves an owner's photograph.
 *
 *     GET /api/photo/varsha-photo
 *
 * ── Why it is a route and not a file ────────────────────────────────────────
 *
 * Because a file in /public is deleted by the next deployment. See
 * `server/images.ts` for the whole argument; this is the read side of it.
 *
 * ── Caching ─────────────────────────────────────────────────────────────────
 *
 * `no-store`, which is the wrong choice for a photograph and the right one here.
 * The owner replaces it and expects the change to show, not to appear after a
 * cache expires somewhere they cannot reach. A four-megabyte photograph that a
 * browser holds for a month is a four-megabyte photograph somebody pays for on
 * their phone.
 *
 * A first visit costs one database read. After that the page itself is cached
 * and the browser has the picture for the session, which is the right amount of
 * caching for something that changes when a person says so.
 */
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
): Promise<NextResponse> {
  const { key } = await params;

  if (!isImageKey(key)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const image = await safeRead(`photo:${key}`, () => readImageBytes(key), null);

  if (!image || image.bytes.length === 0) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      'Content-Type': image.mime,
      'Content-Length': String(image.bytes.length),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
