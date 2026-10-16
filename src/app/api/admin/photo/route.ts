import { NextResponse } from 'next/server';
import { isOwnerSession } from '@/server/owner';
import {
  saveImage,
  deleteImage,
  readImageMeta,
  isImageKey,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from '@/server/images';

/**
 * The owner replaces a photograph.
 *
 *     PUT    /api/admin/photo  { key, mime, data (base64), alt }
 *     DELETE /api/admin/photo  { key }
 *
 * ── Why the bytes arrive as base64 in a JSON body ───────────────────────────
 *
 * Because a multipart form on a phone is where uploads usually go wrong: the
 * file is read into memory whole, the body limit is applied by something else,
 * and a four-megabyte photograph on a slow connection fails in a way the owner
 * sees as "it didn't work". Base64 in JSON is one code path, testable, with the
 * size checked before anything else happens with it.
 *
 * The cost is a third more bytes on the wire. For one photograph, from one
 * person, once in a while, that is the right trade.
 *
 * ── What is checked before anything is stored ──────────────────────────────
 *
 * The session, then the key, then the type, then the size. In that order,
 * because each one makes the next one meaningless: there is no point measuring
 * a picture that this visitor may not upload, of a name that does not exist,
 * in a format the site does not serve.
 *
 * The size is checked on the *decoded* bytes. A base64 string four times the
 * limit decodes to something over the limit, and checking the string would let
 * through a twelve-megabyte photograph dressed as a four-megabyte one.
 */

export const dynamic = 'force-dynamic';

interface SaveBody {
  key?: unknown;
  mime?: unknown;
  data?: unknown;
  alt?: unknown;
}

interface DeleteBody {
  key?: unknown;
}

export async function PUT(request: Request) {
  if (!(await isOwnerSession())) {
    return NextResponse.json({ ok: false, reason: 'not-owner' }, { status: 401 });
  }

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const key = typeof body.key === 'string' ? body.key : '';
  if (!isImageKey(key)) {
    return NextResponse.json({ ok: false, reason: 'unknown-key' }, { status: 400 });
  }

  const mime = typeof body.mime === 'string' ? body.mime : '';
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(mime)) {
    return NextResponse.json(
      { ok: false, reason: 'bad-type', allowed: ALLOWED_IMAGE_TYPES },
      { status: 400 },
    );
  }

  const data = typeof body.data === 'string' ? body.data : '';
  if (data.length === 0) {
    return NextResponse.json({ ok: false, reason: 'empty' }, { status: 400 });
  }

  /*
   * The ceiling is on the decoded size, not the string length.
   *
   * base64 is four characters for every three bytes, so the string is already
   * about a third larger and a naive check against the string length lets
   * through a photograph three times the size it claims to be — into a database
   * column nobody sized for it.
   */
  const bytes = Buffer.from(data, 'base64');
  if (bytes.length === 0) {
    return NextResponse.json({ ok: false, reason: 'not-base64' }, { status: 400 });
  }
  if (bytes.length > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, reason: 'too-large', max: MAX_IMAGE_BYTES, got: bytes.length },
      { status: 413 },
    );
  }

  const alt = typeof body.alt === 'string' ? body.alt.slice(0, 200) : '';

  const saved = await saveImage({
    key,
    mime,
    data: bytes.toString('base64'),
    byteSize: bytes.length,
    alt,
  });

  return NextResponse.json({
    ok: true,
    key: saved.key,
    byteSize: saved.byteSize,
    updatedAt: saved.updatedAt,
  });
}

export async function DELETE(request: Request) {
  if (!(await isOwnerSession())) {
    return NextResponse.json({ ok: false, reason: 'not-owner' }, { status: 401 });
  }

  let body: DeleteBody;
  try {
    body = (await request.json()) as DeleteBody;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  const key = typeof body.key === 'string' ? body.key : '';
  if (!isImageKey(key)) {
    return NextResponse.json({ ok: false, reason: 'unknown-key' }, { status: 400 });
  }

  const removed = await deleteImage(key);
  return NextResponse.json({ ok: true, removed });
}

/** What is there now, for the panel. */
export async function GET() {
  if (!(await isOwnerSession())) {
    return NextResponse.json({ ok: false, reason: 'not-owner' }, { status: 401 });
  }

  const meta = await readImageMeta('varsha-photo');
  return NextResponse.json({ ok: true, meta });
}
