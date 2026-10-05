"""
Export the SQLite database to JSON, so the data can be moved into Postgres
(Supabase) without losing anything — including articles that were edited after
being seeded, which re-running the seeds would silently revert.

Read-only: it opens the database in read-only mode and prints. It never writes
to dev.db, so it is safe to run at any time.

Run:  python scripts/export-sqlite.py prisma/dev.db .import
"""

import json
import os
import sqlite3
import sys

TABLES = ["categories", "articles", "reviews", "asked_questions"]


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: export-sqlite.py <dev.db> <out folder>")
        return 2

    db_path, out_dir = sys.argv[1], sys.argv[2]
    if not os.path.exists(db_path):
        print(f"ERROR: no such database: {db_path}")
        return 1

    os.makedirs(out_dir, exist_ok=True)

    # `mode=ro` is not decoration. This script is expected to be run against a
    # database the site is also writing to, and read-only makes it impossible
    # for it to interfere with that traffic.
    uri = "file:" + db_path.replace("\\", "/") + "?mode=ro"
    conn = sqlite3.connect(uri, uri=True)
    conn.row_factory = sqlite3.Row

    found = {row["name"] for row in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    )}

    summary = {}
    for table in TABLES:
        if table not in found:
            print(f"  skip    {table} (not in this database)")
            summary[table] = None
            continue

        rows = [dict(r) for r in conn.execute(f"SELECT * FROM {table}")]
        path = os.path.join(out_dir, f"{table}.json")
        with open(path, "w", encoding="utf-8") as fh:
            # ensure_ascii=False keeps Devanagari readable in the file rather
            # than as \uXXXX escapes — these files are meant to be inspected.
            json.dump(rows, fh, ensure_ascii=False, indent=2)

        size_kb = os.path.getsize(path) / 1024
        print(f"  ok    {table:<16} {len(rows):>4} rows  {size_kb:>8.1f} KB")
        summary[table] = len(rows)

    conn.close()

    with open(os.path.join(out_dir, "summary.json"), "w", encoding="utf-8") as fh:
        json.dump(summary, fh, ensure_ascii=False, indent=2)

    print(f"\nDONE -> {out_dir}")
    print("Next: point DATABASE_URL at Postgres and run `npm run db:import`.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())