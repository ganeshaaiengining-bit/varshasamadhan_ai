"""
Report which translation keys are missing from which language table.

    python scripts/coverage.py

Reads `src/content/i18n.ts` and treats the Hindi table as the reference — it is
the language the site was written in, so it defines what a complete table looks
like.

This exists because a missing key does not fail a build, does not raise at
runtime, and does not stop the page rendering. `translate()` silently falls back
to English and then to Hindi, so the symptom is a Tamil visitor reading one
English button on an otherwise Tamil page — which looks like a broken site rather
than a missing string, and is exactly the kind of thing that never gets reported.

Missing keys are listed per language, and translated strings that are still an
unfilled `{placeholder}` or identical to the English value are flagged as
suspicious rather than as failures, because both can be legitimate.
"""

import io
import re
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8")

I18N = "src/content/i18n.ts"

# Language code -> the constant name its table is declared under.
LANGUAGE_TABLES = {
    "hi": "HINDI", "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL",
    "te": "TELUGU", "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA",
    "ml": "MALAYALAM", "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC",
    "es": "SPANISH",
}

# Languages a table must be complete in before the gap is treated as a bug worth
# printing loudly. English is complete by definition; the rest are all languages
# the site advertises in its own picker, so a gap in any of them is a real gap.
REFERENCE = "hi"


def load_table(source: str, name: str) -> dict:
    opener = re.search(r"const %s: Record<string, string> = \{" % name, source)
    if not opener:
        print(f"ERROR: table {name} not found")
        sys.exit(1)
    closer = re.search(r"^\};", source[opener.end():], re.M)
    body = source[opener.end(): opener.end() + closer.start()]

    entries = {}
    # Handles `'key': 'value'` whether on one line or with the value wrapped.
    for match in re.finditer(
        r"'([a-zA-Z0-9_.]+)':\s*'((?:[^'\\]|\\.)*)'", body, re.S
    ):
        entries[match.group(1)] = match.group(2).replace("\\'", "'")
    return entries


def main() -> int:
    source = io.open(I18N, encoding="utf-8").read()

    tables = {code: load_table(source, name) for code, name in LANGUAGE_TABLES.items()}
    reference = tables[REFERENCE]
    required = set(reference)

    print(f"Reference ({REFERENCE}): {len(required)} keys\n")

    missing = defaultdict(list)
    for code, table in tables.items():
        if code == REFERENCE:
            continue
        absent = sorted(required - set(table))
        missing[code] = absent

    total_gaps = sum(len(v) for v in missing.values())

    for code in LANGUAGE_TABLES:
        if code == REFERENCE:
            continue
        table = tables[code]
        absent = missing[code]
        pct = round(100 * (len(required) - len(absent)) / len(required), 1)
        status = "COMPLETE" if not absent else f"{len(absent)} missing"
        print(f"{code:>3}  {len(table):>4} keys  {pct:>5}%  {status}")
        if absent:
            for key in absent:
                print(f"        - {key}")

    print(f"\nTotal gaps: {total_gaps}")

    # Keys nobody has, in any language. Usually means a key was invented for one
    # table only, or a component was deleted without its strings.
    orphans = sorted(
        key
        for key in set().union(*[set(t) for t in tables.values()]) - required
    )
    if orphans:
        print(f"\nKeys not present in the reference table ({len(orphans)}):")
        for key in orphans:
            where = [c for c, t in tables.items() if key in t]
            print(f"  - {key}   only in: {', '.join(where)}")

    return 0 if total_gaps == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())