"""
Find double-encoded or unreadable text anywhere in the repository.

    python scripts/scan-mojibake.py            # every tracked text file
    python scripts/scan-mojibake.py src/server

WHAT THIS IS LOOKING FOR

Two different faults, both of which render as nonsense on screen and neither of
which any compiler, type check or existing script noticed:

  1. U+FFFD REPLACEMENT CHARACTER. What a decoder leaves when it cannot read a
     byte. Irrecoverable — the original characters are gone — so each one has to
     be rewritten by hand from what the surrounding sentence says.

  2. The Latin-1/Win-1252 signature: "â€”", "Ã©", "à¤µ". Reversible, because the
     original bytes are all still there, just read through the wrong codec.

FOUND, IN CODE THAT WAS SHIPPING

prisma/schema.prisma      comments in "�?" form where an em dash belongs
src/server/reviews/actions.ts   a Zod error message that a visitor would have
                                read, in unreadable bytes
src/content/i18n.ts       (checked separately — it is legitimately multilingual,
                          so a whole-file scan needs the per-value check)

The first two were missed because the earlier scan in fix-package-json.py only
looked at .json, .md, .mjs, .ts, .tsx and .txt — .prisma was not in the list —
and because it counted mangled characters per file without reporting a line, so
a file that also contains correct Devanagari looked like a false positive and got
dismissed. That is what happened: it reported four files, all four were checked,
all four were innocent, and the two real ones were never on the list.

WHAT IT DOES NOT DO

It does not fix anything. It prints file, line and the exact text, because a
reversal that "succeeds" can silently produce the wrong characters, and a
rewrite has to be read.
"""

import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

SKIP_DIRS = {".git", "node_modules", ".next", ".import", "out", "dist"}

# Everything that could hold text we wrote. .prisma is here because the fault
# was found in it.
EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".txt",
    ".prisma", ".css", ".html", ".yml", ".yaml", ".sql", ".env", ".example",
}

# The Latin-1 / Win-1252 signature. These are almost never intentional in a
# codebase that has no reason to contain them.
MOJIBAKE = re.compile(r"[àÃÂâð¤¥�]")

# Files that legitimately contain the scripts above. i18n.ts is Devanagari on
# purpose and free-library.ts is a list of library descriptions in many
# languages; a whole-file scan cannot tell mangled from correct in those, so
# scripts/find-mojibake.py handles them per value instead.
PER_VALUE = {"src/content/i18n.ts", "src/content/free-library.ts"}


def is_candidate(path: str) -> bool:
    if os.path.basename(path) in {".env", ".env.example"}:
        return True
    return os.path.splitext(path)[1].lower() in EXTENSIONS


def scan(path: str) -> list[tuple[int, str, str]]:
    """(line number, the offending text, why) for one file."""
    try:
        text = io.open(path, encoding="utf-8").read()
    except (OSError, UnicodeDecodeError):
        return []

    found = []
    for number, line in enumerate(text.split("\n"), 1):
        hits = MOJIBAKE.findall(line)
        if not hits:
            continue
        # Report the specific characters rather than the line, because a line of
        # correct Devanagari also contains characters that match nothing and a
        # line of correct Hindi next to one stray byte does.
        marks = sorted(set(hits))
        found.append((number, marks, line.strip()[:96]))
    return found


def walk(targets: list[str]) -> list[str]:
    paths: list[str] = []
    for target in targets:
        if os.path.isfile(target):
            paths.append(target)
            continue
        for root, dirs, files in os.walk(target):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for name in files:
                paths.append(os.path.join(root, name))
    return [p for p in paths if is_candidate(p)]


def main() -> int:
    targets = sys.argv[1:] or ["."]
    paths = walk(targets)

    total = 0
    skipped = 0
    for path in sorted(paths):
        normalised = path.replace("\\", "/")
        if normalised in PER_VALUE or normalised.lstrip("./") in PER_VALUE:
            skipped += 1
            continue

        found = scan(path)
        if not found:
            continue

        total += len(found)
        print(f"{path}")
        for number, marks, line in found[:12]:
            shown = "".join("U+%04X " % ord(m) for m in marks)
            print(f"  L{number:<5} {shown}")
            print(f"         {line}")
        if len(found) > 12:
            print(f"  ... and {len(found) - 12} more lines in this file")

    print()
    if skipped:
        print(f"{skipped} multilingual file(s) skipped — use find-mojibake.py for those.")
        print()

    if total:
        print(f"{total} line(s) carry unreadable or double-encoded text.")
        print()
        print("A U+FFFD cannot be reversed; the characters it replaced are gone.")
        print("Each one has to be rewritten from the sentence around it.")
        return 1

    print("No mojibake in any scannable file.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
