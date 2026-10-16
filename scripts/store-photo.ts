/**
 * Save a photograph the way the admin route does, without an owner session.
 *
 *     npx tsx scripts/store-photo.ts <file> [key]
 *
 * `check-photo.py` cannot put a photograph through `PUT /api/admin/photo`,
 * because that route requires the owner's session and the check deliberately
 * has no password. A test that needed a password would be a reason to keep one
 * in a file, and a file with the owner's password in it is the problem this
 * whole arrangement exists to avoid.
 *
 * So the save goes through `server/images.ts` — the same helper the route calls
 * — and the read goes over HTTP. That covers the half a visitor actually
 * depends on: is the picture there, is it the right bytes, is it served with
 * the right headers.
 *
 * The owner does not use this. They use the panel in /admin.
 */

import { readFileSync } from 'node:fs';
import { saveImage } from '../src/server/images';
import { prisma } from '../src/server/db';

/*
 * An async function rather than top-level await.
 *
 * This file is outside `src/`, so tsx compiles it as CommonJS, and esbuild
 * refuses top-level await in CommonJS. It is the only script in here that
 * touches the database and it is run by check-photo.py, so the failure was a
 * one-line stack trace rather than an obvious mistake at the call site.
 *
 * The catch is here for the same reason. A dropped Neon connection printed four
 * lines of Node internals and nothing about what failed, which reads like a
 * broken script rather than a database that was briefly unreachable — and the
 * photograph silently stayed as it was.
 */
async function main(): Promise<void> {
  try {
    const [, , path, key = 'varsha-photo'] = process.argv;

    if (!path) {
      console.error('  kis file ko karna hai? path dijiye');
      process.exit(1);
    }

    const bytes = readFileSync(path);

    const extension = path.split('.').pop()?.toLowerCase();
    const mime =
      extension === 'png' ? 'image/png'
      : extension === 'webp' ? 'image/webp'
      : 'image/jpeg';

    const saved = await saveImage({
      key,
      mime,
      data: bytes.toString('base64'),
      byteSize: bytes.length,
      alt: 'श्रीमती VARSHA जी',
    });

    console.log(`  saved ${saved.key}: ${saved.byteSize} bytes as ${mime}`);
    await prisma.$disconnect();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  photo save nahi hui: ${message}`);
    console.error('  database tak nahi pahunch paye — 5 second baad dobara chalaiye.');
    process.exit(1);
  }
}

void main();
