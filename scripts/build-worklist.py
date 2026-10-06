"""
Build the translation worklist: which keys each language still needs.

    python scripts/build-worklist.py

Writes `.import/worklist.json`, grouped by key prefix, listing for every one of
the eleven non-Hindi languages which of the *rendered* keys it is missing.

Only keys the site actually renders are listed. `i18n.ts` holds 233 keys, but 46
of them are never referenced — translating a string nothing can display is work
that can never be reviewed by looking at the page, so it is left out and the
count stays honest about what is being asked for.
"""

import io
import json
import os
import re
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8")

I18N = "src/content/i18n.ts"
USED = ".import/used-keys.json"
OUT = ".import/worklist.json"

TABLES = {
    "hi": "HINDI", "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL",
    "te": "TELUGU", "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA",
    "ml": "MALAYALAM", "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC",
    "es": "SPANISH",
}

# English and Hindi are complete by definition, so they are not targets.
TARGETS = [c for c in TABLES if c not in ("hi", "en")]


def load_table(source: str, name: str) -> dict:
    opener = re.search(r"const %s: Record<string, string> = \{" % name, source)
    closer = re.search(r"^\};", source[opener.end():], re.M)
    body = source[opener.end(): opener.end() + closer.start()]
    return dict(re.findall(r"'([a-zA-Z0-9_.]+)':\s*'((?:[^'\\]|\\.)*)'", body, re.S))


def main() -> int:
    source = io.open(I18N, encoding="utf-8").read()
    tables = {code: load_table(source, name) for code, name in TABLES.items()}

    if not os.path.exists(USED):
        print("ERROR: run scripts/used-keys.py first")
        return 1

    rendered = set(json.load(io.open(USED, encoding="utf-8")))
    required = sorted(k for k in tables["hi"] if k in rendered)

    worklist = {}
    for code in TARGETS:
        missing = [k for k in required if k not in tables[code]]
        if missing:
            worklist[code] = missing

    os.makedirs(".import", exist_ok=True)
    io.open(OUT, "w", encoding="utf-8").write(
        json.dumps(worklist, ensure_ascii=False, indent=1)
    )

    by_group = defaultdict(list)
    for keys in worklist.values():
        for key in keys:
            by_group[key.split(".")[0]].append(key)

    print(f"rendered keys      : {len(required)}")
    print(f"languages to fill  : {len(TARGETS)}\n")

    for code in TARGETS:
        print(f"  {code}  {len(worklist.get(code, [])):>4} missing")

    total = sum(len(v) for v in worklist.values())
    print(f"\nTOTAL translations : {total}\n")

    print("by group (in the order they are easiest to review):")
    ordered = sorted(by_group, key=lambda g: -len(set(by_group[g])))
    for group in ordered:
        keys = sorted(set(by_group[group]))
        print(f"  {group:<9} {len(keys):>3} keys  ->  {len(keys) * len(TARGETS):>4} translations")

    print(f"\nwrote {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())