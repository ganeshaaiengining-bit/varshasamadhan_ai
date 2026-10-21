import { prisma } from '../src/server/db';

async function main(): Promise<void> {
  const row = await prisma.ownerCredential.findUnique({ where: { id: 'owner' } });
  if (!row) {
    console.log('koi row nahi');
  } else {
    console.log('updatedAt :', row.updatedAt.toISOString());
    console.log('sawaal hai? :', row.question.length > 0);
    console.log('jawaab hash?:', row.answerHash.length > 0);
    console.log('recoveryAt :', row.recoveryAt ? row.recoveryAt.toISOString() : 'null');
  }
  console.log('rate_limit rows:', await prisma.rateLimit.count());
}

main().finally(() => prisma.$disconnect());
