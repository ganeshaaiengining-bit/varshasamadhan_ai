/**
 * Dump the exact category and article text the database holds.
 *
 *     npx tsx scripts/_dump-titles.ts
 *
 * Written while translating the owner's own headings into the thirteen
 * languages. The translated value is only offered when the database still holds
 * the original — the moment she edits a title in the admin panel the site shows
 * what she wrote — so the comparison needs the original exactly, including its
 * punctuation. Scraping the page gave the navigation labels instead.
 */
import { prisma } from '../src/server/db';

async function main() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { slug: true, title: true, subtitle: true },
  });
  const articles = await prisma.article.findMany({
    orderBy: { slug: 'asc' },
    select: { slug: true, title: true, summary: true, isPublished: true },
  });
  console.log(JSON.stringify({ categories, articles }, null, 1));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
