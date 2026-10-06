/**
 * Runs the built production server on a given port, with whatever
 * DATABASE_URL the caller has put in the environment.
 *
 * Run:  npm run serve:outage -- [port]
 *
 * Separate from `scripts/serve.mjs`, which is a hand-written static file server
 * for the single-page prototype and knows nothing about Next.js. This one boots
 * the real `next start`, because the question "does the site survive a database
 * outage" has to be answered against the same server a visitor meets — a dev
 * server and a production server surface failures differently, and only one of
 * them is the thing being shipped.
 */

import { spawn } from 'node:child_process';

const port = Number(process.argv[2]) || 3101;

/*
 * `shell: true` is required on Windows and not optional politeness there:
 * `npx` resolves to `npx.cmd`, and spawning a `.cmd` without a shell fails with
 * `EINVAL` because CreateProcess will not run a batch file directly. On
 * non-Windows the shell is unnecessary, so it is added only where it is needed.
 */
const useShell = process.platform === 'win32';

const child = spawn(
  useShell ? 'npx.cmd' : 'npx',
  ['next', 'start', '-p', String(port)],
  {
    stdio: 'inherit',
    shell: useShell,
    env: { ...process.env, PORT: String(port) },
  },
);

const stop = () => {
  child.kill();
  process.exit(0);
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

child.on('exit', (code) => process.exit(code ?? 0));