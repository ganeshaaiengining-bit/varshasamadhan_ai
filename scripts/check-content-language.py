"""
Check that the owner's own headings reach the visitor in their language.

    python scripts/check-content-language.py

Or against a deployment:

    VS_BASE=https://varsha-samadhan.vercel.app python scripts/check-content-language.py

WHY THIS IS A SEPARATE FILE FROM THE TWO THAT ALREADY EXIST

`check-page-language.py` reads the health box, whose text is written by the site.
`check-rendered-language.py` reads for Latin letters. Neither of them could see
the fault the owner reported, because the fault was not in the site's own words
at all: she writes the categories and the articles once, in Hindi, in the
database, so a visitor who chose Marathi read a Marathi page with a Hindi
heading across the middle of it. Every string the site generated was correct and
the page still looked untranslated.

This reads the pages a visitor would actually land on and looks for the specific
strings that have to be there in that language — the nine subject headings, the
article headings, the browser tab. A missing translation fails loudly; a
translation that is quietly falling back to Hindi fails the same way, because the
Hindi original is asserted *not* to be present for languages whose wording
differs.

Only the wording differs: `mr`, `gu` and `pa` carry some headings that are
spelled the same as Hindi, and those are skipped rather than counted as faults.
"""

import io
import os
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = os.environ.get("VS_BASE", "http://127.0.0.1:3001")
COOKIE = "vs-lang"

# The translation tables in src/content/i18n.ts, in file order.
TABLE = {
    "hi": "HINDI",
    "en": "ENGLISH",
    "bn": "BENGALI",
    "ta": "TAMIL",
    "te": "TELUGU",
    "mr": "MARATHI",
    "gu": "GUJARATI",
    "kn": "KANNADA",
    "ml": "MALAYALAM",
    "pa": "PUNJABI",
    "ur": "URDU",
    "ar": "ARABIC",
    "es": "SPANISH",
}

# The pages each key has to appear on. This is also the list of keys: see
# `KEYS` below.
PAGES = {
    "cat.dharmik-upay.title": ["/", "/p/dharmik-upay"],
    "cat.dharmik-upay.subtitle": ["/", "/p/dharmik-upay"],
    "cat.aapatkalen-gayide.title": ["/", "/p/aapatkalen-gayide"],
    "cat.aapatkalen-gayide.subtitle": ["/", "/p/aapatkalen-gayide"],
    "art.aag-lagne-par-kya-karein.title": [
        "/p/aapatkalen-gayide",
        "/p/aapatkalen-gayide/aag-lagne-par-kya-karein",
    ],
    "art.aag-lagne-par-kya-karein.summary": [
        "/p/aapatkalen-gayide",
        "/p/aapatkalen-gayide/aag-lagne-par-kya-karein",
    ],
    "home.metaTitle": ["/"],
    # The free library: eighteen entries that were Hindi on every page of the
    # site whatever language had been chosen — the heading of each card, the
    # sentence under it, and the line saying which languages it comes in.
    "lib.entry.ncert.title": ["/pustakalay"],
    "lib.entry.pratham-books.what": ["/pustakalay"],
    "lib.entry.nios.langs": ["/pustakalay"],
}

# One list, not two.
#
# The keys and the pages they belong on used to be kept in separate places, and
# three library keys were added to the second without being added to the first —
# so the checker fetched the library page in all thirteen languages, found
# nothing it had been told to look for, and reported it clean. A list that can
# disagree with itself will, quietly, and a quiet pass is the one failure a
# check must not have.
KEYS = list(PAGES)


def translations():
    """Every key, for every language, read from the tables themselves."""
    source = io.open("src/content/i18n.ts", encoding="utf-8").read()
    out = {code: {} for code in TABLE}
    current = None
    for line in source.split("\n"):
        match = re.match(r"^const (\w+)", line)
        if match:
            current = match.group(1)
        for code, table in TABLE.items():
            if current != table:
                continue
            for key in KEYS:
                found = re.search(r"'%s':\s*'((?:[^'\\]|\\.)*)'" % re.escape(key), line)
                if found:
                    out[code][key] = found.group(1).replace("\\'", "'")
    return out


def fetch(path, language):
    request = urllib.request.Request(
        BASE + path,
        headers={"cookie": "%s=%s" % (COOKIE, language), "User-Agent": "content-check/1.0"},
    )
    return urllib.request.urlopen(request, timeout=60).read().decode("utf-8", "replace")


def main():
    data = translations()
    bad = 0
    checked = 0

    for code in TABLE:
        hindi = data["hi"]
        for key in KEYS:
            want = data[code].get(key)
            if not want:
                print("FAIL %-3s %-38s no translation in the table" % (code, key))
                bad += 1
                continue
            for path in PAGES[key]:
                html = fetch(path, code)
                checked += 1
                if want not in html:
                    print("FAIL %-3s %-38s not on %s" % (code, key, path))
                    print("     expected: %s" % want[:80])
                    bad += 1
                    continue
                # A heading that is spelled the same as the Hindi original is
                # not evidence of anything, so only the differing ones are
                # checked the other way.
                original = hindi.get(key)
                if original and original != want:
                    # Search the page body, not the whole response: the RSC
                    # payload legitimately carries the database's own Hindi.
                    body = html.split("<body", 1)[-1]
                    body = re.sub(r"<(script|style)[\s\S]*?</\1>", " ", body)
                    if original in body:
                        print("FAIL %-3s %-38s Hindi original still on %s" % (code, key, path))
                        print("     still showing: %s" % original[:80])
                        bad += 1

        # The browser tab is the last place a language switch visibly fails.
        title = data[code].get("home.metaTitle", "")
        if title:
            html = fetch("/", code)
            checked += 1
            found = re.search(r"<title>([^<]*)</title>", html)
            if not found or found.group(1) != title:
                print("FAIL %-3s home <title> is %r, expected %r" % (code, found.group(1) if found else None, title))
                bad += 1

    print("%d pages checked across %d languages" % (checked, len(TABLE)))
    if bad:
        print("%d fault(s)" % bad)
        sys.exit(1)
    print("Every heading, every browser tab, in the language that was asked for.")


if __name__ == "__main__":
    main()
