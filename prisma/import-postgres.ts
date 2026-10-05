/**
 * ============================================================================
 *  वर्षा समाधान AI — move the SQLite data into Postgres
 *
 *  Run:  npx tsx prisma/import-postgres.ts "<folder holding the JSON files>"
 *
 *  ── Why this exists ────────────────────────────────────────────────────────
 *
 *  The site was built on SQLite, a single file. That file cannot be deployed:
 *  every serverless host resets its filesystem, so the site would come up empty
 *  on every deploy. The data therefore has to move to Postgres, and the only
 *  honest way to move it is to read what is really there rather than re-running
 *  the seeds.
 *
 *  Re-running the seeds would be simpler, and it is tempting — they are
 *  idempotent. But the seeds are not the same thing as the data: an article
 *  edited later from the admin panel exists in `dev.db` and in no seed file. This
 *  script copies whatever is actually in the file, so an edit made last week is
 *  not silently reverted to the seeded wording.
 *
 *  ── What it will not do ─────────────────────────────────────────────────────
 *
 *  It does not create the tables. Run `prisma migrate deploy` first — this
 *  script assumes the shape is already there and fails loudly if it is not,
 *  rather than writing rows into columns that do not exist.
 *
 *  ── Why ids are generated here ─────────────────────────────────────────────
 *
 *  The ids are not carried over from SQLite. `articles.category_id` is a foreign
 *  key into `categories.id`, and copying both sets verbatim would work only if
 *  every relationship survived intact. Instead each category keeps a fresh id
 *  and the article rows are rewritten to point at the new one, which is a
 *  mapping this script owns end to end and can therefore trust.
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/* Reading the export                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The generated client is typed against `provider = "postgresql"`, so it cannot
 * read a SQLite file even though the schema is otherwise identical. Rather than
 * keep a second client and a second copy of the schema in sync, the export step
 * is done with Python's stdlib `sqlite3` — no driver to install, nothing to keep
 * in step. That script writes one JSON file per table, and this reads them.
 */
interface CategoryRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon: string | null;
  accent: string | null;
  sortOrder: number;
  isActive: number | null;
}

interface ArticleRow {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  voiceSummary: string | null;
  isEmergency: number | null;
  isMedical: number | null;
  helpline: string | null;
  sortOrder: number;
  isPublished: number | null;
}

interface ReviewRow {
  id: string;
  target: string | null;
  rating: number;
  authorName: string | null;
  city: string | null;
  comment: string;
  isApproved: number | null;
  reply: string | null;
}

/**
 * SQLite has no boolean type; it stores 0 and 1.
 *
 * Only `1` is true. Anything else — including a column that was never set — is
 * false, which is the safe direction for the flags this is used on.
 */
function bool(value: number | null | undefined): boolean {
  return value === 1;
}

/**
 * A boolean flag that defaults to *on* when the column is empty.
 *
 * Separate from `bool()` because `is_active` and `is_published` both carry a
 * `DEFAULT 1`, so an empty column means the default was used and the row is
 * meant to be visible. Reading `null` as false here would silently unpublish
 * every article in the database — the site would come up with nine empty
 * categories and no obvious error.
 */
function onByDefault(value: number | null | undefined): boolean {
  return value === null || value === undefined ? true : value === 1;
}

function text(value: string | null | undefined): string {
  return value ?? '';
}

function read<T>(folder: string, file: string): T[] {
  const path = join(folder, file);
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T[];
  } catch {
    // An absent table is not an error worth stopping for — a fresh database has
    // no reviews yet, and the owner should still get their articles.
    console.log(`  skip    ${file} (not found)`);
    return [];
  }
}

/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const folder = process.argv[2] ?? './.import';

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set. Copy .env.example to .env first.');
    process.exit(1);
  }

  console.log(`Reading the export from: ${folder}\n`);

  const categories = read<CategoryRow>(folder, 'categories.json');
  const articles = read<ArticleRow>(folder, 'articles.json');
  const reviews = read<ReviewRow>(folder, 'reviews.json');

  console.log(`  found  ${categories.length} categories, ${articles.length} articles, ${reviews.length} reviews\n`);

  // Children before parents: `articles` references `categories`, so a category
  // must exist before the rows that point at it.
  const categoryIdBySlug = new Map<string, string>();

  for (const row of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: row.slug },
      // Match on slug, not id, so re-running updates instead of creating a
      // second copy of every category. This is the same rule the seeds follow.
      update: {
        title: row.title,
        subtitle: text(row.subtitle),
        icon: text(row.icon) || 'help',
        accent: text(row.accent) || 'saffron',
        sortOrder: row.sortOrder ?? 0,
        isActive: onByDefault(row.isActive),
      },
      create: {
        slug: row.slug,
        title: row.title,
        subtitle: text(row.subtitle),
        icon: text(row.icon) || 'help',
        accent: text(row.accent) || 'saffron',
        sortOrder: row.sortOrder ?? 0,
        isActive: onByDefault(row.isActive),
      },
      select: { id: true, slug: true },
    });

    categoryIdBySlug.set(row.slug, saved.id);
    console.log(`  category  ${row.slug}`);
  }

  /*
   * An article's category is looked up by *slug*, not by the id it had in
   * SQLite. The article rows do not carry a category slug — they carry the old
   * category id — so the mapping is built from the category rows first and
   * applied here. An article whose category is missing is reported and skipped
   * rather than imported with a dangling reference, which Postgres would reject
   * outright.
   */
  const categoryIdByOldId = new Map<string, string>();
  for (const row of categories) {
    const newId = categoryIdBySlug.get(row.slug);
    if (newId) categoryIdByOldId.set(row.id, newId);
  }

  let skipped = 0;
  for (const row of articles) {
    const categoryId = categoryIdByOldId.get(row.categoryId);
    if (!categoryId) {
      console.log(`  SKIP     ${row.slug} (its category was not in the export)`);
      skipped += 1;
      continue;
    }

    await prisma.article.upsert({
      where: { slug: row.slug },
      update: {
        categoryId,
        title: row.title,
        summary: text(row.summary),
        body: row.body,
        voiceSummary: text(row.voiceSummary),
        isEmergency: bool(row.isEmergency),
        isMedical: bool(row.isMedical),
        helpline: text(row.helpline),
        sortOrder: row.sortOrder ?? 0,
        isPublished: onByDefault(row.isPublished),
      },
      create: {
        categoryId,
        slug: row.slug,
        title: row.title,
        summary: text(row.summary),
        body: row.body,
        voiceSummary: text(row.voiceSummary),
        isEmergency: bool(row.isEmergency),
        isMedical: bool(row.isMedical),
        helpline: text(row.helpline),
        sortOrder: row.sortOrder ?? 0,
        isPublished: onByDefault(row.isPublished),
      },
    });
  }
  console.log(`\n  ${articles.length - skipped} articles written, ${skipped} skipped`);

  /*
   * Reviews are matched on their comment text rather than on an id, because a
   * comment is the only field here a visitor cannot repeat exactly. Without
   * this, a second run of this script would double every review on the site.
   */
  let written = 0;
  for (const row of reviews) {
    const existing = await prisma.review.findFirst({
      where: { comment: row.comment, target: text(row.target) },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.review.create({
      data: {
        target: text(row.target) || '*',
        rating: row.rating ?? 5,
        authorName: row.authorName,
        city: row.city,
        comment: row.comment,
        isApproved: bool(row.isApproved),
        reply: row.reply,
      },
    });
    written += 1;
  }
  console.log(`  ${written} reviews written (${reviews.length - written} already present)`);

  console.log('\nDONE. Check the site: the home page should list the articles again.');
}

main()
  .catch((error: unknown) => {
    console.error('\nIMPORT FAILED:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());