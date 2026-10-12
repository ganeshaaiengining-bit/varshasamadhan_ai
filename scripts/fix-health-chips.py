"""
Fix two corrupted values in scripts/add-health-chips.py before it is run.

    python scripts/fix-health-chips.py

  ar health.c.child1   "لا/Pagesah في الدراسة"
      A URL path fragment and a misspelling where "لا رغبة في الدراسة" belongs —
      no interest in studying. check-latin-leaks.py caught it, because "Pagesah"
      is Latin sitting in an Arabic sentence.

  gu health.c.middle1  "�મરમાં દુખાવો"
      A U+FFFD REPLACEMENT CHARACTER where ક belonged. It is what a decoder leaves
      when it cannot read a byte, and it renders to a visitor as a black diamond
      in the middle of a word.

      Nothing caught this one. check-scripts.py compared every character against
      the range the language uses, and U+FFFD is in none of them — but it also
      did not read as "a character from some other language", because it is not
      from any language. check-spacing.py saw no punctuation. check-translations
      saw a well-formed value. check-latin-leaks saw no Latin. Four checks, and
      the one fault all of them shared was that the bad character belonged to
      nothing at all.

      So check-scripts.py now rejects U+FFFD outright, rather than inferring from
      ranges. It is the second time this has appeared — a Malayalam "എന്തോ" came
      through as "എ��്തോ" in an earlier batch — and a check that misses the same
      fault twice is not really checking.
"""

import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "scripts/add-health-chips.py"

# line -> (text as written, replacement)
FIXES = {
    1: None,  # placeholder, replaced below; real numbers come from the search
}


def find_lines(source: str) -> list[tuple[int, str]]:
    """The lines carrying each fault, located by content rather than by number.

    Numbered positions would break the moment a single line is added above, and
    the previous fixers in this repository all had that problem.
    """
    wanted = []
    for number, line in enumerate(source.split("\n"), 1):
        if "Pagesah" in line:
            wanted.append((number, line))
        elif "�" in line:
            wanted.append((number, line))
    return wanted


REPLACEMENTS = [
    ("لا/Pagesah في الدراسة", "لا رغبة في الدراسة"),
    ("�મરમાં દુખાવો", "કમરમાં દુખાવો"),
]


def main() -> int:
    lines = io.open(FILE, encoding="utf-8").read().split("\n")
    changed = 0

    for (old, new) in REPLACEMENTS:
        found = False
        for index, line in enumerate(lines):
            if old in line:
                lines[index] = line.replace(old, new)
                print(f"line {index + 1}: {new}")
                found = True
                changed += 1
        if not found:
            print(f"could not find {old!r} — stopping")
            return 1

    io.open(FILE, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
    print(f"\n{changed} fixed. Re-run the checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
