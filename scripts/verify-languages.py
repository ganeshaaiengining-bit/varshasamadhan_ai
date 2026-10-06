"""
Check that the site actually renders in every language, on every page.

    python scripts/verify-languages.py

For each page, for each language, request the page with the language cookie set and
check that the words *this* project has stored for that language come back.

The expected strings are read out of `src/content/i18n.ts` rather than typed in
here. Guessing them in the test is how a verification script ends up passing while
the page is wrong — a hand-written "Tamil home page" word that is not actually
the one the site uses proves nothing, and a wrong one fails forever for a reason
that has nothing to do with the code.

Only the standard library is used — no dependencies to install.
"""

import io
import json
import re
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://localhost:3001"
I18N = "src/content/i18n.ts"

# Pages every visitor can reach. `/admin` is deliberately absent: it is behind a
# password and returns a different document entirely.
PAGES = [
    "/",
    "/sahayata",
    "/smriti",
    "/samaroh",
    "/madad",
    "/reviews",
    "/p/dhyan-aur-yoog",
    "/p/dhyan-aur-yoog/subah-ka-samadhi",
    "/p/mahamari-suraksha/bimari-se-bachav",
    "/p/aapatkalen-gayide/aag-lagne-par-kya-karein",
]

# Keys that must appear on *every* page: header, footer and skip link.
EVERYWHERE = ["nav.home", "footer.pages", "footer.helplines", "footer.free"]

# Keys that belong to specific pages, checked only there.
PER_PAGE = {
    "/sahayata": ["help.title"],
    "/smriti": ["smriti.whyTitle"],
    "/samaroh": ["ref.title", "ref.notTitle", "ref.medicalTitle"],
    "/madad": ["support.howTitle", "support.waysTitle", "support.alwaysFreeTitle"],
    "/reviews": ["reviews.title", "reviews.write"],
    "/p/dhyan-aur-yoog": ["article.askAbout"],
    "/p/dhyan-aur-yoog/subah-ka-samadhi": ["article.askAny"],
    # `bimari-se-bachav` is flagged `isMedical`, and the emergency badge and the
    # helpline box only appear on an article flagged `isEmergency`. Checking
    # those strings on an article that is not flagged would report a failure for
    # correct behaviour.
    "/p/mahamari-suraksha/bimari-se-bachav": ["article.medicalTitle"],
    "/p/aapatkalen-gayide/aag-lagne-par-kya-karein": ["article.emergencyInfo", "article.remember"],
}

LANGUAGE_TABLES = {
    "hi": "HINDI", "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL",
    "te": "TELUGU", "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA",
    "ml": "MALAYALAM", "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC",
    "es": "SPANISH",
}


def load_tables():
    """Read key -> value for every language table, straight from the source."""
    source = io.open(I18N, encoding="utf-8").read()
    tables = {}

    for code, name in LANGUAGE_TABLES.items():
        opener = re.search(r"const %s: Record<string, string> = \{" % name, source)
        if not opener:
            print(f"ERROR: table {name} not found in {I18N}")
            sys.exit(1)
        closer = re.search(r"^\};", source[opener.end():], re.M)
        body = source[opener.end(): opener.end() + closer.start()]

        entries = {}
        for match in re.finditer(r"'([a-zA-Z0-9_.]+)':\s*'((?:[^'\\]|\\.)*)'", body):
            entries[match.group(1)] = match.group(2).replace("\\'", "'")

        # Multi-line values were skipped by the single-line pattern above; catch
        # them so a key that is deliberately wrapped is not reported as missing.
        for match in re.finditer(r"'([a-zA-Z0-9_.]+)':\s*\n\s*'((?:[^'\\]|\\.)*)'", body):
            entries.setdefault(match.group(1), match.group(2).replace("\\'", "'"))

        tables[code] = entries

    return tables


def fetch(path: str, language: str) -> str:
    request = urllib.request.Request(BASE + path)
    request.add_header("Cookie", f"vs-lang={language}")
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", "replace")


def main() -> int:
    tables = load_tables()
    print(f"Read {len(tables)} language tables from {I18N}\n")

    failures = []
    checks = 0

    for language in LANGUAGE_TABLES:
        table = tables[language]
        all_keys = set(EVERYWHERE) | {k for ks in PER_PAGE.values() for k in ks}
        missing_keys = sorted(k for k in all_keys if k not in table)

        if missing_keys:
            # Not a crash. A table that lacks a key still renders — `translate()`
            # falls back to English — so the page works, it is just partly in the
            # wrong language, and that is a coverage finding rather than a bug.
            print(f"--- {language} ---  (table lacks {len(missing_keys)} of these keys; "
                  f"they fall back to English)")
            failures.append(f"{language}: table missing {len(missing_keys)} keys")

        print(f"--- {language} ---")
        for page in PAGES:
            try:
                html = fetch(page, language)
            except Exception as error:  # noqa: BLE001 - a failed page is a finding
                print(f"  {page:<42} FETCH FAILED: {error}")
                failures.append(f"{language} {page}: {error}")
                continue

            keys = EVERYWHERE + PER_PAGE.get(page, [])
            absent = []
            untranslatable = 0
            for key in keys:
                if key not in table:
                    untranslatable += 1
                    continue
                checks += 1
                value = table[key]
                # A value still containing a placeholder cannot be matched as a
                # literal, so only check plain strings here.
                if "{" in value:
                    continue
                if value not in html:
                    absent.append(f"{key}={value!r}")

            note = f" ({untranslatable} fall back to English)" if untranslatable else ""
            if absent:
                print(f"  {page:<42} MISSING {len(absent)}: {'; '.join(absent[:3])}")
                failures.append(f"{language} {page}: {len(absent)} translated string(s) not found")
            else:
                print(f"  {page:<42} OK ({len(keys) - untranslatable} strings){note}")

    print(f"\n{checks} strings checked across {len(PAGES)} pages x {len(LANGUAGE_TABLES)} languages.")
    if failures:
        print(f"\n{len(failures)} FAILURE(S):")
        for failure in failures:
            print("  ", failure)
        return 1
    print("All pages render in all languages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())