/**
 * Put the Gemini key into .env without opening the file by hand.
 *
 *     node scripts/set-gemini-key.mjs
 *
 * Written because the owner has said "ho gaya" four times with the key still
 * not in the file. The browser part they managed — the project, the key, the
 * copy. What kept failing was the last mile: opening a dotfile in an editor,
 * finding line 28, placing the cursor between two quotation marks, and pasting
 * without adding a space.
 *
 * Every one of those steps is a way to get it slightly wrong, and a slightly
 * wrong key looks exactly like no key at all: the site starts, answers come
 * back from the free provider, and nothing says why.
 *
 * So this does the last mile instead. Paste, press enter, done.
 *
 * WHAT IT GUARANTEES, AND WHY EACH ONE MATTERS
 *
 *   - the key is never echoed. Raw mode is used so that a paste of forty
 *     characters does not appear on screen, in a screenshot, or in a screen
 *     share
 *   - the key must start with AIza. A Google Cloud key begins with AQ and is
 *     refused here rather than failing silently at runtime — which is exactly
 *     the key that was pasted into a chat by mistake
 *   - the length is checked. A key cut short by a terminal paste looks
 *     plausible and simply never authenticates
 *   - the line is replaced whole, so running it twice does not produce
 *     GEMINI_API_KEY="AIza...AIza..."
 *   - nothing else in .env is touched
 *   - .env is verified to be ignored by git before writing, and the write is
 *     refused if it is not. A key committed to a repository is a key that has
 *     to be deleted and replaced, and by then it is in someone's history.
 *
 * If .env does not exist it is created with just this line, which is enough
 * for the AI to work and leaves the database settings for the owner to fill in.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { stdin, stdout, exit } from 'node:process';

const ENV_PATH = '.env';
const LINE = /^GEMINI_API_KEY\s*=.*$/m;

function fail(message) {
  console.error(`\n  ${message}\n`);
  exit(1);
}

/**
 * Refuse to write a credential into a file git would commit.
 *
 * Checked before the write rather than after, because the point is to never
 * have written it. This repository ignores .env, so on a normal run both
 * checks pass and nothing is printed.
 */
function confirmGitIgnoresEnv() {
  try {
    const listed = execFileSync('git', ['ls-files', '--error-unmatch', ENV_PATH], {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (listed.toString().trim()) {
      fail(
        '.env is tracked by git. A committed key has to be deleted and replaced.\n' +
          '    Run:  git rm --cached .env',
      );
    }
  } catch {
    // git said "not tracked", which is the answer wanted. A repository with no
    // commits also fails here, and refusing to write into one would be solving
    // a problem this project does not have.
  }

  if (!existsSync('.gitignore')) {
    fail('there is no .gitignore, so a key written now could be committed.');
  }

  try {
    execFileSync('git', ['check-ignore', '-q', ENV_PATH], { stdio: 'ignore' });
  } catch {
    fail('.env is not listed in .gitignore. Add it before writing a key into it.');
  }
}

/**
 * Read a line with nothing echoed.
 *
 * Not readline: it echoes what is typed, and a forty-character key pasted into
 * an echoing prompt appears on screen, in any recording of the terminal, and in
 * a screenshot of the window. Raw mode turns that off, and the Enter key is
 * matched by hand because raw mode delivers control characters rather than
 * lines.
 */
function askHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);

    // Raw mode needs a real terminal. Piped input — a test, a script, CI —
    // has no TTY and no setRawMode, and asking for it there throws
    // "stdin.setRawMode is not a function" and takes the whole script down.
    //
    // Piped input cannot leak onto a screen, because there is no screen, so
    // it is read normally. Only an interactive terminal needs the echo
    // suppressed, and only an interactive terminal has one.
    const interactive = typeof stdin.setRawMode === 'function' && stdin.isTTY;

    if (!interactive) {
      let piped = '';
      stdin.setEncoding('utf8');
      stdin.on('data', (chunk) => {
        piped += chunk;
      });
      stdin.on('end', () => {
        process.stdout.write('\n');
        resolve(piped.trim());
      });
      return;
    }

    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let buffer = '';

    const finish = (value) => {
      stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
      stdin.removeListener('data', onData);
      process.stdout.write('\n');
      resolve(value);
    };

    function onData(chunk) {
      for (const character of chunk) {
        const code = character.charCodeAt(0);

        // Ctrl+C, Ctrl+D — the user gave up.
        if (code === 3 || code === 4) {
          stdin.setRawMode(Boolean(wasRaw));
          stdin.pause();
          process.stdout.write('\n');
          exit(1);
        }

        // Enter.
        if (character === '\r' || character === '\n') {
          finish(buffer.trim());
          return;
        }

        // Backspace.
        if (character === '\u007f' || character === '\b') {
          buffer = buffer.slice(0, -1);
          continue;
        }

        // A stray escape or arrow key arriving from a paste of rich text.
        if (code === 27) {
          continue;
        }

        if (code >= 0x20) buffer += character;
      }
    }

    stdin.on('data', onData);
  });
}

async function main() {
  console.log('');
  console.log('  Gemini key');
  console.log('  ===========');
  console.log('');
  console.log('  Paste the key below. It begins AIzaSy.');
  console.log('  Nothing you type is shown on screen or kept in history.');
  console.log('');

  const key = await askHidden('  Key: ');

  if (!key) fail('nothing was pasted.');

  if (!key.startsWith('AIza')) {
    fail(
      'that does not begin AIza, so it is not a Gemini API key.\n' +
        '    A Google Cloud key begins AQ and will not work here.',
    );
  }

  if (key.length < 30) {
    fail(
      `only ${key.length} characters; a Gemini key is about 39.\n` +
        '    The paste was probably cut short — copy it again in full.',
    );
  }

  const clean = key.replace(/\s+/g, '');
  const line = `GEMINI_API_KEY="${clean}"`;

  let source = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf-8') : '';

  if (LINE.test(source)) {
    source = source.replace(LINE, line);
  } else {
    if (source && !source.endsWith('\n')) source += '\n';
    source += line + '\n';
  }

  confirmGitIgnoresEnv();
  writeFileSync(ENV_PATH, source, 'utf-8');

  console.log('');
  console.log(`  Saved. ${clean.length} characters, begins AIza.`);
  console.log('');
  console.log('  Now restart the server so it picks the key up:');
  console.log('');
  console.log('      npm run dev');
  console.log('');
  console.log('  Then check it worked:');
  console.log('');
  console.log('      python scripts/check-ai.py');
  console.log('');
  console.log('  It should say "present" beside GEMINI_API_KEY, and every answer');
  console.log('  should come from "gemini" rather than "pollinations".');
  console.log('');
  console.log('  The key itself was not printed and is not in git.');
  console.log('');
}

main();
