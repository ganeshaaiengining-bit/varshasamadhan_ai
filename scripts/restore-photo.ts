/**
 * Put a photograph back, from a JSON file written by `read-photo.ts`.
 *
 *     npx tsx scripts/restore-photo.ts <file.json>
 *
 * The other half of `read-photo.ts`. Both photograph checks overwrite the
 * owner's picture on the live database in order to test the change, and both
 * call this to put it back byte for byte.
 *
 * The JSON arrives as a file path rather than as an argument, because a
 * photograph in base64 is longer than any command line will take on Windows and
 * because a shell argument is a place where a photograph could be written into
 * somebody's scrollback buffer.
 */

import { readFileSync } from 'node:fs';
import { saveImage } from '../src/server/images';
import { prisma } from '../src/server/db';

interface Payload {
  key?: string;
  mime?: string;
  data?: string;
  alt?: string;
}

async function main(): Promise<void> {
  const path = process.argv[2];

  if (!path) {
    console.error('  kis file se wapas daalna hai? path dijiye');
    process.exit(1);
  }

  const body = JSON.parse(readFileSync(path, 'utf-8')) as Payload;

  if (!body.data || !body.mime) {
    console.error('  file me data ya mime nahi hai');
    process.exit(1);
  }

  const saved = await saveImage({
    key: body.key || 'varsha-photo',
    mime: body.mime,
    data: body.data,
    byteSize: Buffer.from(body.data, 'base64').length,
    alt: body.alt || '',
  });

  console.log(`  restored ${saved.key}: ${saved.byteSize} bytes`);

  await prisma.$disconnect();
}

void main();