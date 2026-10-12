"""
Catch missing spaces and doubled punctuation in translated values.

    python scripts/check-spacing.py

Added after a Spanish line came out as "se va la luz,hacia los niños" and an
Arabic one as "أو مسنالظلم" — a space missing, and in the Arabic case the
preposition ل with it, so the two words ran together into one unreadable token.

Neither shows up as a wrong-script character, so check-scripts.py passed both.
A missing space is easy to introduce and easy to miss, because the text still
looks like words.

WHAT IT FLAGS

  - punctuation with no space after it, where the next character is a letter
  - a comma immediately followed by another comma
  - two or more spaces in a row
  - a space before closing punctuation, or none after opening punctuation

The last one is deliberately conservative. It only looks at ASCII punctuation
inside non-Latin text, because the rules for spacing around Arabic comma and
question mark differ from the ones around a Latin period, and a check that
applied Latin rules to Arabic would report every Arabic sentence ending.

WHAT IT DOES NOT CATCH

A missing space between two words with no punctuation between them — "مسنالظلم"
where it should have been "مسن للظلم". Nothing about that is detectable from
the string alone without a dictionary for the language, so this check passes it
and it has to be caught by reading. It is worth knowing that a green result here
means "no punctuation spacing faults", not "the text is correct".
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

# ASCII punctuation after which a letter may follow directly. A period after a
# decimal or an initial is not in this list; a hyphen is not either, since
# compound words and phone numbers legitimately run together.
TIGHT = ",.;:!?"

# Punctuation that must always be followed by a space when a letter follows.
NEEDS_SPACE_AFTER = ",;:!?"

LATIN = re.compile(r"[A-Za-z]")
NON_LATIN_LETTER = re.compile(r"[^\W\d_]", re.UNICODE)


def tables(source: str) -> dict[str, str]:
    """code -> table name, from the TABLES record."""
    at = source.index("const TABLES")
    return dict(
        re.findall(r"^\s*([a-z]{2}):\s*([A-Z]+),", source[at:source.index("};", at)], re.M)
    )


def table_body(source: str, name: str) -> str:
    start = re.search(r"const " + name + r"[^=]*=\s*\{", source)
    return source[start.end():source.index("\n};", start.end())]


def check_value(code: str, key: str, value: str) -> list[str]:
    problems = []

    for index, char in enumerate(value):
        after = value[index + 1: index + 2]
        before = value[index - 1: index]

        if char == "," and after == ",":
            problems.append(f"{key}: doubled comma")
        elif char in NEEDS_SPACE_AFTER and after and NON_LATIN_LETTER.match(after):
            if not LATIN.match(after) or LATIN.match(char):
                problems.append(f"{key}: no space after '{char}'")
        elif char in TIGHT and after and LATIN.match(after):
            problems.append(f"{key}: no space after '{char}'")
        elif char in ")" and LATIN.match(after):
            problems.append(f"{key}: no space after ')'")
        elif char == " " and char == after:
            problems.append(f"{key}: two spaces in a row")
        elif char in ",;:" and before == " ":
            problems.append(f"{key}: space before '{char}'")

    return problems


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()
    mapping = tables(source)

    total = 0
    for code, name in sorted(mapping.items()):
        body = table_body(source, name)
        for key, value in re.findall(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", body):
            found = check_value(code, key, value.replace("\\'", "'"))
            total += len(found)
            for problem in found:
                print(f"  {name:<10} {problem}")

    print()
    if total:
        print(f"{total} spacing problem(s).")
        return 1
    print("Spacing looks right in every table.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
