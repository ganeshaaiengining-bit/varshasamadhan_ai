/**
 * Aaj ka hisab — kaunsa model kitni baar bola.
 *
 *     vercel env pull .env.production.local   (ya .env.local)
 *     npx tsx scripts/usage-today.ts
 *
 * Ye sirf padhta hai. Kuch nahi badalta, kuch nahi bhejta, aur koi secret
 * screen par nahi dikhta — output me sirf provider aur model ke naam hain.
 *
 * ── Ye kis liye hai ──────────────────────────────────────────────────────────
 * Google ka free quota **har model ka alag** hai: bees calls per model per day.
 * Isiliye "aaj kitne sawaal hue" ek aadha jawab hai. Asli sawaal ye hai —
 *
 *     kaunsa model khatam ho gaya, aur kaunsa abhi bhi khaali hai?
 *
 * Agar ye table ek hi model dikhaye, to baaki paanch model ki bees-bees call
 * kahin pada hui hai aur koi istemal nahi kar raha. Wo hi galti pehle thi.
 */

import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const rows = await prisma.askedQuestion.groupBy({
    by: ['provider', 'model'],
    where: { createdAt: { gte: startOfDay } },
    _count: { _all: true },
  });

  console.log();
  console.log(`  aaj, ${startOfDay.toLocaleString('en-GB')} se ab tak`);
  console.log('  ' + '-'.repeat(56));

  if (rows.length === 0) {
    console.log('  abhi koi sawaal nahi.');
  }

  for (const row of rows.sort((a, b) => b._count._all - a._count._all)) {
    const who = row.provider || '(koi nahi)';
    const model = row.model || '-';
    const used = who === 'gemini' && model !== '-' ? row._count._all : 0;
    const left = who === 'gemini' && model !== '-' ? Math.max(0, 20 - used) : null;

    console.log(
      `  ${who.padEnd(13)} ${model.padEnd(26)} ${String(row._count._all).padStart(4)}  ` +
        (left === null ? '' : `(${left} bachi)`),
    );
  }

  console.log();

  const spentOnGemini = rows.filter((r) => r.provider === 'gemini');
  const withAllowance = spentOnGemini.filter((r) => r._count._all < 20);

  if (withAllowance.length === 0 && spentOnGemini.length > 0) {
    console.log('  Har model ki bhookh khatam. Website keyless par chalegi.');
  } else if (withAllowance.length > 0) {
    const left = withAllowance.reduce((sum, r) => sum + (20 - r._count._all), 0);
    console.log(`  ${withAllowance.length} model me abhi ${left} call bachi hain.`);
  }

  console.log();
}

main()
  .catch((error) => {
    console.error('  padha nahi ja saka:', error instanceof Error ? error.message : error);
  })
  .finally(() => prisma.$disconnect());