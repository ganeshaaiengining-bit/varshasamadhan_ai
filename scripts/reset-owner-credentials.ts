/**
 * Delete the test password and recovery pair, and the rate-limit rows my test
 * created, so the owner's one-time setup link is usable again.
 *
 * ── Why this has to exist at all ────────────────────────────────────────────
 * The only way to test the setup link live is to use it, and using it is
 * exactly what kills it: once a password exists the route returns 409 forever.
 * So every live test of this feature leaves the production site in a state the
 * owner cannot use, and this is the undo.
 *
 * It deletes `owner_credentials` entirely rather than blanking it, because a row
 * with an empty hash is a row `setupAlreadyUsed()` would still count as a
 * password — the link would stay dead with nothing behind it.
 *
 * `rate_limits` rows go too: my test address is locked out for fifteen minutes,
 * and while that only affects that address, leaving a lock sitting in a table on
 * the owner's site because a script was in a hurry is the kind of thing nobody
 * notices until it matters.
 */
import { prisma } from '../src/server/db';

async function main(): Promise<void> {
  const credentials = await prisma.ownerCredential.deleteMany({});
  const limits = await prisma.rateLimit.deleteMany({});

  const remaining = await prisma.ownerCredential.count();
  const remainingLimits = await prisma.rateLimit.count();

  console.log('owner_credentials delete:', credentials.count, '| bache:', remaining);
  console.log('rate_limits delete:', limits.count, '| bache:', remainingLimits);

  if (remaining !== 0 || remainingLimits !== 0) {
    console.log('\nSAFSAI NAHI HUI — link abhi bhi band hoga.');
    process.exitCode = 1;
    return;
  }

  console.log('\nSetup link dobara zinda hai.');
}

main()
  .catch((error) => {
    console.error('Error:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
