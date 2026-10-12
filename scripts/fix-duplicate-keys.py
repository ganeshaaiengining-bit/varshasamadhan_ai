"""
Remove the duplicate `ask.sending` left behind by the attach-a-document batch.

    python scripts/fix-duplicate-keys.py

The attach strings were appended to all thirteen tables with a script that wrote
`ask.sending` as one of its keys, because at the time `ask.sending` was thought
to be free. It was not — the ask group already had one, meaning "thinking…" —
so every table gained two entries with the same name.

TypeScript caught it, which is the only reason it was caught: an object literal
with a repeated key is a hard error at compile time, not a warning. Every
language silently rendering whichever copy happened to come last would have been
a stranger's mistake to find.

The second copy is the one removed. It is the one in the attach block, which
sits after the ask group in the file, and it was written to mean "reading it…"
— but that string already exists as `attach.reading`, so nothing is lost.

Writes the same check it came in with: no table may contain a repeated key.
"""

import collections
import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

TABLES = [
    "HINDI", "ENGLISH", "MARATHI", "BENGALI", "TAMIL", "TELUGU", "GUJARATI",
    "KANNADA", "MALAYALAM", "PUNJABI", "URDU", "ARABIC", "SPANISH",
]

KEY_LINE = re.compile(r"^  '([^']+)': (?:'(?:[^'\\]|\\.)*'),\n", re.M)


def table_span(source: str, name: str) -> tuple[int, int]:
    start = re.search(r"const " + name + r"[^=]*=\s*\{", source)
    if not start:
        raise SystemExit(f"table {name} not found")
    body_start = start.end()
    return body_start, source.index("\n};", body_start)


def duplicates(body: str) -> list[str]:
    keys = KEY_LINE.findall(body)
    return [key for key, count in collections.Counter(keys).items() if count > 1]


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()
    total_removed = 0

    for name in TABLES:
        begin, end = table_span(source, name)
        body = source[begin:end]

        # Remove every repeat of a key, keeping the first occurrence. The first
        # one is the original; later copies came from a batch appended at the
        # end of the table.
        seen: set[str] = set()
        out: list[str] = []
        removed: list[str] = []

        position = 0
        for match in KEY_LINE.finditer(body):
            key = match.group(1)
            if key in seen:
                out.append(body[position : match.start()])
                removed.append(key)
                position = match.end()
            else:
                seen.add(key)

        out.append(body[position:])
        new_body = "".join(out)

        if removed:
            source = source[:begin] + new_body + source[end:]
            total_removed += len(removed)
            print(f"  {name:<10} removed {len(removed)}: {', '.join(sorted(set(removed)))}")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)
    print(f"\n{total_removed} duplicate line(s) removed")

    # Verify, rather than trusting the edit.
    source = io.open(FILE, encoding="utf-8").read()
    bad = []
    for name in TABLES:
        begin, end = table_span(source, name)
        found = duplicates(source[begin:end])
        if found:
            bad.append((name, found))

    if bad:
        for name, found in bad:
            print(f"STILL DUPLICATED  {name}: {found}")
        return 1

    print(f"all {len(TABLES)} tables clean — no repeated key in any of them")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())