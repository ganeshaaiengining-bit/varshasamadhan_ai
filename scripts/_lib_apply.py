"""
Give the library's eighteen entries their own translated headings.

    python scripts/_lib_apply.py

WHAT THIS DOES, IN ONE GO

1. Reads the Hindi each entry already carries in src/content/free-library.ts —
   the wording is taken from there rather than retyped, so the Hindi table ends
   up holding exactly what the page was already showing.

2. Adds `id` to every entry, so the page can ask for a translation by a stable
   name (`lib.entry.ncert.title`) instead of by position in an array, which
   would silently translate the wrong row the moment an entry is inserted.

3. Inserts those keys into all thirteen tables of src/content/i18n.ts.

WHY THE LIBRARY IS DIFFERENT FROM THE CATEGORIES

The categories are rows the owner edits from the admin panel, so a translated
heading has to be offered only while the stored value is still the original
(see src/content/labels.ts). Nothing here is editable: this file is the only
place these lines exist, so the translation cannot go stale against an edit
somebody else made, and the page can simply ask for the key.
"""

import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from _lib_labels_1 import DATA as D1  # noqa: E402
from _lib_labels_2 import DATA as D2  # noqa: E402
from _lib_labels_3 import DATA as D3  # noqa: E402
from _lib_labels_4 import DATA as D4  # noqa: E402
from _lib_labels_5 import DATA as D5  # noqa: E402

LIBRARY = os.path.join(HERE, "..", "src", "content", "free-library.ts")
I18N = os.path.join(HERE, "..", "src", "content", "i18n.ts")

# The table names in src/content/i18n.ts, in file order.
TABLES = [
    "HINDI", "ENGLISH", "BENGALI", "TAMIL", "TELUGU", "MARATHI",
    "GUJARATI", "KANNADA", "MALAYALAM", "PUNJABI", "URDU", "ARABIC", "SPANISH",
]

# Every language but the first, which is the source text itself.
OTHERS = TABLES[1:]

# Table name -> the language code the translations were written under.
CODE = {
    "HINDI": "hi", "ENGLISH": "en", "BENGALI": "bn", "TAMIL": "ta",
    "TELUGU": "te", "MARATHI": "mr", "GUJARATI": "gu", "KANNADA": "kn",
    "MALAYALAM": "ml", "PUNJABI": "pa", "URDU": "ur", "ARABIC": "ar",
    "SPANISH": "es",
}

# The order of the entries as they stand in the file — the ids are assigned by
# position here, and only here.
ORDER = [
    "ncert", "pm-evidya", "diksha", "khan-academy", "openstax", "nios",
    "ignou", "gutenberg", "pratham-books", "internet-archive-texts",
    "wikisource", "wikimedia-commons", "pixabay", "unsplash", "openverse",
    "librivox", "internet-archive-audio", "vande-mataram",
]

WANTED = ("title", "what", "langs")


def escape(value):
    """A single-quoted TypeScript string, safe to paste into the table."""
    return value.replace("\\", "").replace("'", "\\'")


def read_entries(source):
    """The Hindi each entry already shows, in file order."""
    body = source.split("export const ENTRIES", 1)[1]
    pieces = body.split("\n  },")
    entries = []
    for piece in pieces:
        title = re.search(r"^\s*title: '([^']*)',", piece, re.M)
        if not title:
            continue
        found = {"title": title.group(1)}
        what = re.search(r"^\s*what: '([^']*)',", piece, re.M)
        if what:
            found["what"] = what.group(1)
        langs = re.search(r"^\s*languages: '([^']*)',", piece, re.M)
        if langs:
            found["langs"] = langs.group(1)
        entries.append(found)
    return entries


def patch_library(source, entries):
    """Add an `id` to each entry, and declare it on the type."""
    offset = 0
    for i, entry_id in enumerate(ORDER):
        # Already patched by an earlier run — the ids must never double up.
        if "    id: '%s'," % entry_id in source:
            continue
        marker = "\n    group: '"
        start = source.index(marker, offset) + len(marker)
        end = source.index("'", start)
        group = source[start:end]
        insert_at = source.index("\n", end) + 1
        source = source[:insert_at] + "    id: '%s',\n" % entry_id + source[insert_at:]
        offset = insert_at + len(entry_id) + 12
        entries[i]["group"] = group

    source = source.replace(
        "export const ENTRIES: Array<LibraryEntry & { group: string }> = [",
        "export const ENTRIES: Array<LibraryEntry & { group: string; id: string }> = [",
        1,
    )
    return source


def build_blocks(entries):
    """The lines to add to every table: id -> field -> text."""
    translated = {}
    for data in (D1, D2, D3, D4, D5):
        translated.update(data)

    missing = [i for i in ORDER if i not in translated]
    if missing:
        raise SystemExit("no translation written for: %s" % ", ".join(missing))

    blocks = {table: [] for table in TABLES}
    for entry_id, hindi in zip(ORDER, entries):
        for field in WANTED:
            if field not in hindi:
                if field in ("title", "what"):
                    raise SystemExit("%s has no %s in free-library.ts" % (entry_id, field))
                continue
            key = "lib.entry.%s.%s" % (entry_id, field)
            blocks["HINDI"].append("  '%s': '%s'," % (key, escape(hindi[field])))
            for table in OTHERS:
                try:
                    value = translated[entry_id][field][CODE[table]]
                except KeyError:
                    raise SystemExit("missing %s %s in %s" % (entry_id, field, table))
                blocks[table].append("  '%s': '%s'," % (key, escape(value)))
    return blocks


def patch_i18n(source, blocks):
    """Put each table's lines under that table's `home.metaTitle` anchor."""
    lines = source.split("\n")
    out = []
    current = None
    added = {table: 0 for table in TABLES}
    for line in lines:
        match = re.match(r"^const (\w+)", line)
        if match:
            current = match.group(1)
        out.append(line)
        if "'home.metaTitle':" in line and current in blocks:
            out.extend(blocks[current])
            added[current] += 1
    for table in TABLES:
        if added[table] != 1:
            raise SystemExit("anchor found %d times in %s" % (added[table], table))
    return "\n".join(out)


def main():
    library = io.open(LIBRARY, encoding="utf-8").read()
    entries = read_entries(library)
    if len(entries) != len(ORDER):
        raise SystemExit("expected %d entries, found %d" % (len(ORDER), len(entries)))

    library = patch_library(library, entries)
    io.open(LIBRARY, "w", encoding="utf-8", newline="\n").write(library)

    blocks = build_blocks(entries)
    i18n = io.open(I18N, encoding="utf-8").read()
    i18n = patch_i18n(i18n, blocks)
    io.open(I18N, "w", encoding="utf-8", newline="\n").write(i18n)

    total = sum(len(v) for v in blocks.values())
    print("ids added: %d, translation lines added: %d across %d tables"
          % (len(ORDER), total, len(TABLES)))


if __name__ == "__main__":
    main()
