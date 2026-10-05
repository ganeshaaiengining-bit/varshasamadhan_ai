import { PrismaClient } from '@prisma/client';

/**
 * One client for the whole process.
 *
 * Next.js reloads modules in development, and a new client per reload exhausts
 * the database connection pool — which presents as the site randomly failing
 * after a few edits rather than as an obvious leak.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * ── Why the pooler ─────────────────────────────────────────────────────────
 *
 * This app is deployed to a serverless host, where every concurrent visitor may
 * be a separate function instance with its own client. Supabase's free tier
 * allows a small fixed number of direct database connections, so a busy
 * afternoon would exhaust them and the site would start refusing queries.
 *
 * The pooler is a small proxy in front of Postgres that recycles connections.
 * `connection_limit=1` then means "one connection per function instance",
 * instead of Prisma's default of `num_cpus * 2 + 1` — which is a number tuned
 * for a long-running server and is far too greedy for a serverless one.
 *
 * This is set in code rather than only in the connection string so it also
 * applies to the import and seed scripts, which read `DATABASE_URL` themselves.
 */
const poolerUrl = (url: string): string => {
  if (!url.includes('pooler.supabase.com')) return url;
  return url.includes('connection_limit=')
    ? url
    : `${url}${url.includes('?') ? '&' : '?'}connection_limit=1`;
};

const connectionString = process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(connectionString ? { datasources: { db: { url: poolerUrl(connectionString) } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;