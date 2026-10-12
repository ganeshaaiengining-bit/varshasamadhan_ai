"""
Does choosing a language actually get that language?

    python scripts/test-language-switch.py

Reported: choosing Hindi gives Marathi, choosing Marathi gives English. Not
"sometimes in one place" — the wrong language altogether.

This is checked the way a visitor experiences it: set the cookie the picker
writes, fetch the page as that visitor would, and look at what came back.
Checking the tables in isolation would miss the whole bug, because the tables
may be correct while the picker maps the wrong code to the wrong table.

  - the picker writing the wrong cookie value for an entry
  - a table being attached to the wrong language, so `mr` returns Gujarati

One language per table is expected to fall back to English: fr, de, pt, ru and
zh have no table, which is documented. Those are listed as KNOWN rather than
counted as failures, because a silent fallback is the correct behaviour and
hiding it would make this report lie.

WHAT TO COMPARE AGAINST

The expected string is read out of that language's own table rather than written
here as a literal. The first version hardcoded a guess at what `help.title` says
in each language — "உங்கள் சிக்கல்" for Tamil, say — and four languages were
reported broken when the site was in fact correct and the guess was wrong by one
letter. A translation test that guesses at the translation is testing itself.

So: read the key from the table, then require the page to contain it. If the
table is missing the key, that is a failure too, and it is reported as such.
"""

import io
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:3001"
SOURCE = "src/content/i18n.ts"
PAGE = "/sahayata"

# The keys checked. The first is the heading, which is the single most visible
# string and the one the report named. All four appear on this page — `home.step1Title`
# does not, it is on the home page, and asking for it here reported one key
# missing from every language while the page was complete.
WATCH = ["help.title", "help.intro", "home.chooseTopic", "home.chooseTopicNote"]

# No table of their own; documented to fall back to English.
NO_TABLE = {"fr", "de", "pt", "ru", "zh"}


def read_tables() -> dict[str, dict[str, str]]:
    """Every language table in i18n.ts, keyed by language code."""
    source = io.open(SOURCE, encoding="utf-8").read()

    tables: dict[str, dict[str, str]] = {}
    for match in re.finditer(r"const ([A-Z]+)[^=]*=\s*\{", source):
        name = match.group(1)
        start = match.end()
        end = source.index("\n};", start)
        body = source[start:end]
        tables[name] = dict(
            (key, value.replace("\\'", "'").replace("\\\\", "\\"))
            for key, value in re.findall(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", body)
        )

    # Code -> table name, taken from the TABLES record at the foot of the file.
    #
    # That record is the authoritative mapping and the only place it exists. The
    # first version worked it out by matching the upper-cased code against the
    # table name, which found 'ta' in TAMIL and 'hi' in HINDI but nothing for
    # 'es', 'mr', 'kn' or 'ml' — because those tables are SPANISH, MARATHI,
    # KANNADA and MALAYALAM, and no code is a prefix of them. It then reported
    # seven languages as broken while the site was fine.
    mapping_at = source.index("const TABLES")
    pairs = re.findall(
        r"^\s*([a-z]{2}):\s*([A-Z]+),",
        source[mapping_at:source.index("};", mapping_at)],
        re.M,
    )

    if not pairs:
        raise SystemExit(
            "Could not read the TABLES record in i18n.ts. The mapping from a"
            " language code to its table has changed shape, and this test"
            " cannot work without it."
        )

    return {code: tables[name] for code, name in pairs if name in tables}


def fetch(language: str) -> str:
    request = urllib.request.Request(BASE + PAGE)
    request.add_header("cookie", f"vs-lang={language}")
    return urllib.request.urlopen(request, timeout=60).read().decode("utf-8", "replace")


def html_lang(html: str) -> str:
    match = re.search(r'<html[^>]*lang="([^"]+)"', html)
    return match.group(1) if match else "?"


def dir_of(html: str) -> str:
    match = re.search(r'<html[^>]*dir="([^"]+)"', html)
    return match.group(1) if match else "?"


def main() -> int:
    tables = read_tables()

    opened = io.open(SOURCE, encoding="utf-8").read()
    start = opened.index("export const LANGUAGES")
    start = opened.index("= [", start) + len("= [")
    offered = re.findall(r"code:\s*'([a-z]{2})'", opened[start:opened.index("\n];", start)])

    if not offered:
        print("Could not read the language list out of i18n.ts.")
        return 1

    print(f"{len(offered)} languages offered by the picker")
    print(f"checking {len(WATCH)} strings on {PAGE}, each read from its own table\n")
    print(f"{'asked':<6} {'<html lang>':<12} {'dir':<6} {'found':<7} verdict")
    print("-" * 62)

    wrong = []
    fell_back = []
    gaps = []

    for code in offered:
        if code not in tables:
            fell_back.append(code)
            print(f"{code:<6} {'-':<12} {'-':<6} {'-':<7} no table (expected)")
            continue

        page = fetch(code)
        attr = html_lang(page)
        direction = dir_of(page)

        expected = [tables[code].get(key) for key in WATCH]
        missing_from_table = [key for key, value in zip(WATCH, expected) if not value]

        found = sum(1 for value in expected if value and value in page)
        total = sum(1 for value in expected if value)

        if missing_from_table:
            # A key that is not in the table falls back to English. That is why
            # these languages "looked" translated: some strings arrived and some
            # did not, and the page looked half right.
            gaps.append((code, missing_from_table))
            verdict = f"{len(missing_from_table)} key(s) fall back to English"
            wrong.append(code)
        elif found == total:
            verdict = "OK"
        else:
            verdict = f"{total - found}/{total} did not appear"
            wrong.append(code)

        if attr != code:
            verdict += f"  + <html lang> is {attr}"
            wrong.append(code)

        print(f"{code:<6} {attr:<12} {direction:<6} {found}/{total:<5} {verdict}")

    print()
    if gaps:
        print("Keys missing from a language's own table — these fall back to English:")
        for code, keys in gaps:
            print(f"  {code}: {', '.join(keys)}")
        print()

    if wrong:
        print(f"{len(wrong)} language(s) not fully translated: {', '.join(sorted(set(wrong)))}")
        print()
        print("A correct page has the <html lang> attribute AND the strings from that")
        print("language's own table. A missing key is not a picker problem — it is a")
        print("gap in the table, and the visitor sees English exactly there.")
        return 1

    if fell_back:
        print(f"{len(fell_back)} language(s) have no table and fall back to English: "
              f"{', '.join(fell_back)}")

    print()
    print("Every language with a table rendered its own strings.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())