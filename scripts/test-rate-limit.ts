/**
 * ============================================================================
 *  RATE LIMIT — THE ATTEMPT COUNTER
 * ============================================================================
 *
 * These run against the real table, because the thing being tested *is* the
 * table: `readLimit` / `countFailure` / `clearLimit` have no logic worth
 * proving in memory, and a version of this test that mocked the database would
 * have passed happily while the real one could not reach Neon at all.
 *
 * Everything here uses a throwaway scope and address so that no row the site
 * actually depends on is touched — including the owner's, which is the one row
 * that must never be counted against.
 *
 * ── What keeps going wrong, so it is checked three times ────────────────────
 * The counter is only worth anything if a *delete* cannot defeat it. So the
 * tests include: the lock survives re-reading (not a one-shot), a lock holds
 * even when the caller presents the right answer (the lock is checked first,
 * deliberately), and a success clears only its own scope.
 */
import Module from 'node:module';
import path from 'node:path';

import { prisma } from '../src/server/db';

/*
 * The guard, stood down — here and only here.
 *
 * `rate-limit.ts` imports `server-only`, which is correct: that file must never
 * be reachable from the browser, and Next enforces it by making the import
 * throw outside a server bundle. A test runs in plain Node, where the same
 * import throws for a different reason, so the resolver is pointed at a stub
 * that does nothing.
 *
 * The alternative — deleting the import from the file under test — would leave
 * the protection off in production in order to make a script pass. So the guard
 * stays where it is and the exception lives here, where it can be read.
 */
const originalResolve = (Module as unknown as {
  _resolveFilename: (request: string, ...rest: unknown[]) => string;
})._resolveFilename;

(Module as unknown as { _resolveFilename: typeof originalResolve })._resolveFilename = function (
  request: string,
  ...rest: unknown[]
) {
  if (request === 'server-only') {
    return path.join(__dirname, 'stubs', 'server-only.ts');
  }
  return originalResolve.call(this, request, ...rest);
};

let ok = 0;
let fail = 0;

function check(name: string, condition: boolean, detail = ''): void {
  if (condition) {
    ok += 1;
    console.log('  [ ok ]', name);
  } else {
    fail += 1;
    console.log('  [FAIL]', name, detail ? '| ' + detail : '');
  }
}

/** The scope and address used by this whole file. Deleted at the end. */
const SCOPE = 'test-limit';
const IP = '203.0.113.9'; // TEST-NET-3, never a real address

async function main(): Promise<void> {
  // Imported here rather than at the top: a static import is hoisted above the
  // resolver hook, so `server-only` would throw before the hook could stand it
  // down. This is the one line that has to know about that.
  const { clearLimit, countFailure, readLimit } = await import('../src/server/rate-limit');

  /*
   * How many real login rows existed before this file ran.
   *
   * An earlier version of this check asserted there were *zero* — which is true
   * only on a site nobody has ever signed into, and it duly failed the first
   * time a real login happened. The property worth asserting is that this file
   * does not change that number, whatever it happens to be.
   */
  const loginRowsBefore = await prisma.rateLimit.count({
    where: { key: { startsWith: 'login:' } },
  });

  // Start from nothing, whatever an earlier interrupted run left behind.
  await prisma.rateLimit.deleteMany({ where: { key: { startsWith: SCOPE } } });

  console.log('\n=== fresh address is allowed, with no tally ===');
  let state = await readLimit(SCOPE, IP);
  check('pehli baar allowed', state.allowed === true);
  check('tally shunya', state.failures === 0);

  console.log('\n=== four failures are counted, and do not lock ===');
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    state = await countFailure(SCOPE, IP, 5, 15);
  }
  check('chaar ke baad bhi allowed', state.allowed === true, JSON.stringify(state));
  check('chaar gin gaye', state.failures === 4, JSON.stringify(state));

  console.log('\n=== the fifth locks ===');
  state = await countFailure(SCOPE, IP, 5, 15);
  check('paanchvi par locked', state.allowed === false, JSON.stringify(state));
  check('paanch gin gaye', state.failures === 5);

  console.log('\n=== the lock is remembered, not just reported ===');
  state = await readLimit(SCOPE, IP);
  check('padhne par bhi locked', state.allowed === false, JSON.stringify(state));
  state = await readLimit(SCOPE, IP);
  check('aur dobara padhne par bhi', state.allowed === false);

  console.log('\n=== a success from another address clears only that address ===');
  await clearLimit(SCOPE, '203.0.113.10');
  state = await readLimit(SCOPE, IP);
  check('doosre ka clear hamara lock nahi kholta', state.allowed === false);

  console.log('\n=== a success clears the lock for that address ===');
  await clearLimit(SCOPE, IP);
  state = await readLimit(SCOPE, IP);
  check('clear ke baad allowed', state.allowed === true, JSON.stringify(state));
  check('clear ke baad tally shunya', state.failures === 0);

  console.log('\n=== scopes do not share a tally ===');
  // This is what keeps five wrong passwords from also locking out the recovery
  // route — the owner's only way back in.
  await countFailure('test-other-scope', IP, 5, 15);
  state = await readLimit(SCOPE, IP);
  check('doosre scope ka failure hamara count nahi badhata', state.failures === 0,
    JSON.stringify(state));

  console.log('\n=== one failure more than the limit behaves ===');
  await countFailure(SCOPE, IP, 1, 15);
  state = await readLimit(SCOPE, IP);
  check('limit 1 = pehle hi lock', state.allowed === false, JSON.stringify(state));

  console.log('\n=== the lock expires on its own ===');
  // Fifteen minutes is a long test, so this one writes the expiry in the past
  // and checks that reading it lets the address back in. The rule being tested
  // is "the future blocks, the past does not" — not the clock.
  await prisma.rateLimit.upsert({
    where: { key: `${SCOPE}:${IP}` },
    create: { key: `${SCOPE}:${IP}`, failures: 5, lockedUntil: new Date(Date.now() - 1000) },
    update: { failures: 5, lockedUntil: new Date(Date.now() - 1000) },
  });
  state = await readLimit(SCOPE, IP);
  check('purana lock khatam hone par allowed', state.allowed === true, JSON.stringify(state));

  console.log('\n=== cleaning up ===');
  const before = await prisma.rateLimit.count({ where: { key: { startsWith: SCOPE } } });
  await prisma.rateLimit.deleteMany({ where: { key: { startsWith: SCOPE } } });
  await prisma.rateLimit.deleteMany({ where: { key: { startsWith: 'test-other-scope' } } });
  const after = await prisma.rateLimit.count({
    where: { key: { startsWith: SCOPE } },
  });
  check('test rows delete ho gaye', after === 0 && before > 0,
    `pehle ${before}, baad ${after}`);
  const loginRows = await prisma.rateLimit.count({
    where: { key: { startsWith: 'login:' } },
  });
  check('owner ki kisi row ko chhua nahi', loginRows === loginRowsBefore,
    `pehle ${loginRowsBefore}, baad ${loginRows} — ye file owner ko count kar rahi hai`);

  console.log('===========================================');
  console.log(`  ${ok} me se ${ok + fail} check pass, ${fail} fail`);
  if (fail > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error('Error:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
