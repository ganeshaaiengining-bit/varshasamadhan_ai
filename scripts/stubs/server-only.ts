/**
 * A stand-in for Next's `server-only`, used by exactly one script.
 *
 * In the app, importing `server-only` from a module is a promise: this code
 * never reaches the browser, and Next enforces it by making the import throw
 * anywhere that is not a server bundle. That is the right behaviour for the app
 * and the wrong one for a test, which runs in plain Node and would otherwise be
 * refused the very file it is meant to examine.
 *
 * So this file does nothing, and `test-rate-limit.ts` points the resolver at it
 * and nowhere else. The guard stays in `rate-limit.ts` where it belongs — the
 * alternative, deleting the import so the test runs, would leave the protection
 * off in production in order to make a script happy.
 */
export {};
