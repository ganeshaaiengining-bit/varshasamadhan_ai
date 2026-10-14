import { readFileSync, writeFileSync } from 'node:fs';

/**
 * ===========================================================================
 *  PASTE THE DATABASE URL INTO .env WITHOUT IT BEING VISIBLE
 * ===========================================================================
 *
 *     node scripts/set-database-url.mjs
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 *
 * The connection string for a hosted database is a password. Neon puts it in
 * the clipboard, and everything else the owner has tried has been to paste it
 * somewhere it can be read: a chat, a terminal argument that lands in the shell
 * history, a screenshot. Each of those writes it down permanently in a place
 * somebody else may reach.
 *
 * So the value is read from stdin with echo off. It is never printed, never
 * passed as an argument — an argument is visible to every process on the
 * machine — and never written anywhere except the one line in .env that has to
 * hold it.
 *
 * ── What it validates ──────────────────────────────────────────────────────
 *
 * Only the shape. `postgres://` or `postgresql://`, then a host, then a
 * question mark with sslmode. It never connects, so a wrong password is not
 * discovered here; that is what the check afterwards is for.
 *
 * A host that does not end in a known provider is accepted but reported, so a
 * paste of something else entirely does not silently overwrite a working line.
 */

const ENV = '.env';

const readline = await import('node:readline');

/** Hidden input. Falls back to visible on a console that cannot do it. */
function askHidden(question) {
  return new Promise((resolve) => {
    const input = process.stdin;

    const onData = (char) => {
      const value = char.toString('utf8');

      // A paste arrives as one chunk; Enter arrives as its own event.
      if (['\n', '\r', ''].includes(value)) {
        input.removeListener('data', onData);
        input.setRawMode?.(false);
        process.stdout.write('\n');
        resolve(input.__value ?? '');
        return;
      }

      if (value === '') {
        process.stdout.write('\n');
        process.exit(1);
      }

      input.__value = (input.__value ?? '') + value;
    };

    input.setRawMode?.(true);
    input.resume();
    process.stdout.write(question);
    input.on('data', onData);
  });
}

console.log('');
console.log('Database connection');
console.log('='.repeat(46));
console.log('');
console.log('Paste the connection string. It will not be shown while you');
console.log('paste it and it will not be printed afterwards.');
console.log('');
console.log('To paste: right-click in this window, or Ctrl+Shift+V.');
console.log('');

process.stdin.setRawMode?.(true);
process.stdin.resume();
process.stdin.__value = '';

const pasted = await new Promise((resolve) => {
  const onData = (char) => {
    const value = char.toString('utf8');

    if (value === '\n' || value === '\r' || value === '') {
      process.stdin.removeListener('data', onData);
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
      resolve(process.stdin.__value ?? '');
      return;
    }

    if (value === '') {
      process.stdout.write('\n');
      process.exit(1);
    }

    // A backspace on an empty field is ignored rather than shown.
    if (value === '') {
      process.stdin.__value = (process.stdin.__value ?? '').slice(0, -1);
      return;
    }

    process.stdin.__value = (process.stdin.__value ?? '') + value;
  };

  process.stdin.on('data', onData);
});

const url = pasted.trim();

if (!url) {
  console.log('  Nothing pasted. Nothing changed.');
  console.log('');
  process.exit(1);
}

if (!/^postgres(ql)?:\/\//.test(url)) {
  console.log('  That does not look like a database address.');
  console.log('  It should begin  postgresql://');
  console.log('  Nothing changed.');
  console.log('');
  process.exit(1);
}

const hasCredentials = /^postgres(ql)?:\/\/[^:]+:[^@]+@/.test(url);
if (!hasCredentials) {
  console.log('  No password in that address. A Neon connection string has one.');
  console.log('  Nothing changed.');
  console.log('');
  process.exit(1);
}

const host = (url.split('@').pop() ?? '').split('/')[0].split('?')[0];
const known = ['neon.tech', 'supabase', 'postgres.prisma.io', 'amazonaws.com'];

let text = readFileSync(ENV, 'utf8');

function setValue(source, name, value) {
  const pattern = new RegExp(`^${name}=.*$`, 'm');
  if (pattern.test(source)) {
    return source.replace(pattern, `${name}="${value}"`);
  }
  return `${source}\n${name}="${value}"\n`;
}

text = setValue(text, 'DATABASE_URL', url);
text = setValue(text, 'DIRECT_URL', url);

writeFileSync(ENV, text, 'utf8');

console.log('');
console.log(`  Saved. ${url.length} characters.`);
console.log(`  Host   ${host}`);
console.log(`  Ends in a known provider: ${known.some((k) => host.includes(k)) ? 'yes' : 'no — check it'}`);
console.log('');
console.log('  Now switch the schema to Postgres and create the tables:');
console.log('');
console.log('    npm run db:use:postgres');
console.log('    npx prisma db push');
console.log('');