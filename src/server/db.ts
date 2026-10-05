import { PrismaClient } from '@prisma/client';

/**
 * One client for the whole process.
 *
 * Next.js reloads modules in development, and a new client per reload exhausts
 * the database connection pool — which presents as the site randomly failing
 * after a few edits rather than as an obvious leak.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;