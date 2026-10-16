/**
 * Print the stored photograph as JSON, so a script can put it back afterwards.
 *
 *     npx tsx scripts/read-photo.ts
 *
 * `check-photo.py` and `test-photo-panel.py` both change the photograph on the
 * live database. A test that leaves a 64x64 red square where a portrait of a
 * person was would be worse than no test, so both save it first and restore it
 * through this.
 *
 * The base64 of a person's photograph is written to stdout on purpose: this
 * runs on the owner's own machine, against their own database, and the output
 * is consumed by another script on the same disk. It is never sent anywhere.
 * Nothing else on the site prints it, because nothing else on the site reads
 * it.
 */

import { prisma } from '../src/server/db';

async function main(): Promise<void> {
  const row = await prisma.siteImage.findUnique({ where: { key: 'varsha-photo' } });

  if (!row) {
    console.log('');
    await prisma.$disconnect();
    return;
  }

  console.log(
    JSON.stringify({ key: row.key, mime: row.mime, alt: row.alt, data: row.data }),
  );

  await prisma.$disconnect();
}

void main();