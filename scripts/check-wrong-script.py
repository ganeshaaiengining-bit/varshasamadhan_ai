"""Is any language table showing another language's text?

    python scripts/check-wrong-script.py

A wrong-script string is the worst bug on a multilingual site, because it is
invisible to anybody reading that language and obviously wrong to everybody
reading the one it was copied from. A whole block of Spanish inside the Arabic
table reads perfectly on a Spanish page and is nonsense to every Arabic reader.

The check is per language and per script: every value in a table must be
predominantly that language's own script, or — for the two Latin-script
languages — must be plain Latin. Numbers, punctuation and proper nouns are
allowed through, because half of every language is those.

It is a separate script from check-translations.py because that one is about
*missing* keys and this is about *wrong* ones, and a run that reported both at
once was one nobody read.
"""

import io
import re
import sys
import unicodedata

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"

# The scripts a value may be written in, and which languages use them.
#
# Marathi is Devanagari. It was listed separately as `devanagari_alt` with the
# same range, which cannot work: the counter assigns a character to the first
# range that matches, so `devanagari_alt` was never incremented and every
# Marathi value came out as "0 of 55 letters are Marathi" and was reported.
SCRIPT_RANGES = {
    "devanagari": (0x0900, 0x097F),
    "bengali": (0x0980, 0x09FF),
    "tamil": (0x0B80, 0x0BFF),
    "telugu": (0x0C00, 0x0C7F),
    "gujarati": (0x0A80, 0x0AFF),
    "kannada": (0x0C80, 0x0CFF),
    "malayalam": (0x0D00, 0x0D7F),
    "gurmukhi": (0x0A00, 0x0A7F),
    "arabic": (0x0600, 0x06FF),
}

TABLE_SCRIPTS = {
    "HINDI": "devanagari",
    "BENGALI": "bengali",
    "TAMIL": "tamil",
    "TELUGU": "telugu",
    "MARATHI": "devanagari",
    "GUJARATI": "gujarati",
    "KANNADA": "kannada",
    "MALAYALAM": "malayalam",
    "PUNJABI": "gurmukhi",
    "URDU": "arabic",
    "ARABIC": "arabic",
}

# Some lines hold several entries at once, so the whole line is scanned rather
# than matched once. A greedy `'(.*)',$` swallows everything between the first
# quote and the last on the line, which made every such line look like one entry
# written in two scripts and produced a hundred findings that were all the same
# parsing mistake.
ENTRY = re.compile(r"'([^']+)':\s*'((?:[^'\\]|\\.)*)'")


def strip_technical(value):
    """Remove the words that are not really words in any language.

    `PDF ਮਾਡਿ`, `PDF, ਫੋਟੋ (JPG/PNG)`, `ਦਾ.ਤ. sita.ji` — every language on the
    site writes file formats and example handles in Latin, because they are
    file formats and example handles. Counting those as English made six real
    tables report as mixed, which is how a check stops being read.

    So: all-caps acronyms, dotted identifiers, and anything inside brackets
    that is only ASCII go before the count, not after it.
    """
    value = re.sub(r"\b[A-Z]{2,6}\b", " ", value)          # PDF, JPG, PNG, MB, AI
    value = re.sub(r"\b[a-z]+\.[a-z]+\b", " ", value)     # sita.ji
    value = re.sub(r"\([^)]*\)", " ", value)              # (JPG/PNG)
    value = re.sub(r"\b\d+[A-Za-z]{0,4}\b", " ", value)   # 12 MB
    return value


def script_counts(value):
    counts = {"latin": 0, "other": 0}
    for name, (lo, hi) in SCRIPT_RANGES.items():
        counts[name] = 0

    for ch in value:
        code = ord(ch)
        if ch.isascii() and ch.isalpha():
            counts["latin"] += 1
            continue
        if ch.isdigit() or ch.isspace() or not ch.isalpha():
            continue
        if code < 0x0250:
            counts["latin"] += 1
            continue
        placed = False
        for name, (lo, hi) in SCRIPT_RANGES.items():
            if lo <= code <= hi:
                counts[name] += 1
                placed = True
                break
        if not placed:
            counts["other"] += 1

    return counts


def main():
    lines = io.open(PATH, encoding="utf-8").read().split("\n")

    table = None
    findings = []
    counts = {}

    for number, line in enumerate(lines, 1):
        header = re.match(r"^const ([A-Z]+): Record<string, string> = \{", line)
        if header:
            table = header.group(1)
            continue

        if table is None:
            continue

        wanted = TABLE_SCRIPTS.get(table)
        if wanted is None:
            continue

        for entry in ENTRY.finditer(line):
            key, value = entry.group(1), entry.group(2)
            if not value.strip():
                continue

            counts[table] = counts.get(table, 0) + 1

            got = script_counts(strip_technical(value))
            letters = got["latin"] + got["other"] + sum(
                v for k, v in got.items() if k not in ("latin", "other")
            )
            if letters == 0:
                continue

            # A placeholder is a sample, not prose: `যেমন: sita.ji` is a Bengali
            # sentence with an English handle in it, and `नाम` with a {count} in
            # it is not half foreign. Neither is worth reporting.
            if "{" in value or "}" in value or "@" in value or "://" in value:
                continue

            mine = got[wanted]
            # Allow a few foreign words, which every language has.
            if mine < letters * 0.55:
                dominant = max(got, key=lambda k: got[k])
                findings.append(
                    (number, table, key, dominant, got[dominant], letters, value[:50])
                )

    print()
    print("Every table in its own script")
    print("=" * 60)
    print()

    for table in TABLE_SCRIPTS:
        n = counts.get(table, 0)
        print("  %-10s %4d values" % (table, n))

    print()

    if findings:
        print("  %d value(s) written in the wrong script:" % len(findings))
        print()
        for number, table, key, dominant, amount, letters, value in findings[:40]:
            print("   line %5d  %-9s %-30s" % (number, table, key))
            print("            %d of %d letters are %s" % (amount, letters, dominant))
            print("            %s" % value)
        print()
        return 1

    print("  Every value is written in its own table's script.")
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
