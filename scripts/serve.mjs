/**
 * ===========================================================================
 *  STATIC SERVER
 * ===========================================================================
 *
 * Serves the project directory over HTTP, so `index.html` — the all-in-one
 * page — can be opened at a localhost address rather than by double-clicking
 * the file.
 *
 * Run:  node scripts/serve.mjs [port]
 * ===========================================================================
 *
 * ── Why this exists and is hand-written ───────────────────────────────────
 *
 * The all-in-one page is deliberately dependency-free: it must open and work
 * with nothing installed. A dev server that needed `npm install` to preview it
 * would contradict the point.
 *
 * Node's own `http` and `fs` are enough. The one thing worth doing properly is
 * path traversal: a static server that will happily read `../../.env` is a
 * real problem, not a theoretical one, so the resolved path is checked against
 * the root before anything is opened.
 */

import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const PORT = Number(process.argv[2]) || 3002;
const ROOT = resolve(process.cwd());

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

/*
 * Files that must never be served, whatever the path resolves to.
 *
 * The traversal check below is not enough on its own. `normalize('/../../.env')`
 * collapses to `\.env`, which then joins to `<root>\.env` — *inside* the root, so
 * it passes the containment test and the server hands out the file holding the
 * Gemini key and the owner's admin token. That is not hypothetical: the first
 * version of this server did exactly that, and a request for `/../../.env`
 * returned 200.
 *
 * So the rule is positive rather than negative: only files that are plainly
 * meant to be published are served, and anything starting with a dot is
 * refused. A dev preview does not need `.env`, `.git`, or `.next`.
 */
const ALLOW = /\.(html?|m?js|css|json|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|otf|txt|md|pdf|mp3|wav|ogg|webm)$/i;

function isServable(target) {
  const name = target.split(sep).pop() || '';
  // Any dotfile or dot-directory anywhere in the path: .env, .git, .next,
  // .vercel, .npmrc and so on.
  if (target.split(sep).some((part) => part.startsWith('.'))) return false;
  return ALLOW.test(name);
}

const server = createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0]);

  /*
   * Resolve, then confirm the result is still inside the root.
   *
   * `normalize` collapses `..` but does not stop an escape on its own, and the
   * check has to happen *after* joining — inspecting the string for ".." first
   * is the version that gets bypassed.
   */
  let target = join(ROOT, normalize(requested));
  if (resolve(target) !== ROOT && !resolve(target).startsWith(ROOT + sep)) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('403 — refused');
    return;
  }

  if (existsSync(target) && statSync(target).isDirectory()) {
    target = join(target, 'index.html');
  }

  if (!existsSync(target) || !statSync(target).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 — not found');
    return;
  }

  if (!isServable(target)) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('403 — refused');
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[extname(target).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  createReadStream(target).pipe(res);
});

/*
 * Bound to 127.0.0.1, not to every interface.
 *
 * `server.listen(PORT)` with no host binds 0.0.0.0, which puts the preview on
 * the local network. Combined with the missing dotfile check, that briefly
 * exposed `.env` to anything on the same Wi-Fi. A preview server has no reason
 * to be reachable from off the machine, so the host is stated explicitly.
 */
server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  स्थिर सर्वर: http://localhost:${PORT}/`);
  console.log(`  all-in-one page: http://localhost:${PORT}/index.html`);
  console.log(`  root: ${ROOT}`);
  console.log(`  bound to 127.0.0.1 only\n`);
});