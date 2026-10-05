/**
 * Switch the Prisma datasource between SQLite (local) and Postgres (deployed).
 *
 *   npm run db:use:sqlite     -> schema.prisma says "sqlite"
 *   npm run db:use:postgres   -> schema.prisma says "postgresql"
 *
 * ── Why this is a script and not just a comment ────────────────────────────
 *
 * Prisma does not read the provider from an environment variable — it has to be
 * a literal word in the schema file, because the choice decides which client
 * engine gets generated at install time. There is no way around that.
 *
 * But this project has to work in two places at once: a developer running it on
 * a laptop, where a SQLite file needs no account, no password and no server;
 * and a deployment on Vercel, where that same file is destroyed on every build.
 * Hard-coding either one breaks the other.
 *
 * So the provider is one edited line, and this script makes flipping it a single
 * command instead of something a person has to remember correctly. It rewrites
 * only the `provider =` line inside the datasource block and reports what it
 * did, so there is never a guess about which mode the tree is in.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SCHEMA = join(process.cwd(), 'prisma', 'schema.prisma');

const PROVIDERS = ['sqlite', 'postgresql'];

function main() {
  const requested = process.argv[2];

  if (!requested || !PROVIDERS.includes(requested)) {
    console.error(`usage: node scripts/use-db.mjs <${PROVIDERS.join('|')}>`);
    process.exit(2);
  }

  const target = requested;

  const source = readFileSync(SCHEMA, 'utf8');

  // Only the datasource block's provider. `generator client` has its own
  // `provider = "prisma-client-js"` and rewriting that would break the build.
  const datasourceBlock = /datasource db \{[^}]*\}/;
  const match = source.match(datasourceBlock);
  if (!match) {
    console.error('ERROR: no `datasource db { ... }` block found in prisma/schema.prisma');
    process.exit(1);
  }

  const current = match[0].match(/provider\s*=\s*"([^"]+)"/)?.[1];

  if (current === target) {
    console.log(`Already set to "${target}". Nothing to do.`);
    return;
  }

  const updated = match[0].replace(/provider\s*=\s*"[^"]+"/, `provider = "${target}"`);
  writeFileSync(SCHEMA, source.replace(datasourceBlock, updated), 'utf8');

  console.log(`prisma/schema.prisma: provider "${current}" -> "${target}"`);
  console.log('');
  console.log(
    target === 'sqlite'
      ? 'Now run:  npm run db:push      (creates prisma/dev.db from this schema)'
      : 'Now run:  npm run db:migrate   (applies prisma/migrations to Postgres)',
  );
}

main();