"""
Fix four English words sitting inside translations, two of them in Hindi itself.

    python scripts/fix-latin-leaks.py

Found by scripts/check-latin-leaks.py, which was written after English got into
a translation five times while batches were being written and no existing check
could see it. Every character in "வேறு someone க்கு" is Latin, and Latin belongs
exactly where it is, so check-scripts.py, check-spacing.py and
check-translations.py all passed it.

  HINDI  lib.openBadgeNote   "इसे copy कर सकते हैं"
  HINDI  lib.freeBadgeNote   "पढ़ सकते हैं, copy नहीं"
        The Hindi is the source these batches translate FROM, so this is not a
        translation fault at all — the English was in the original. Hindi does
        write कॉपी, and a visitor reading this page in Hindi would have seen an
        English verb in a Devanagari sentence for as long as the page existed.

  TELUGU footer.readStory   " her పూర్తి కథ చదవండి"
        Leading space, then "her". Hindi is "उनकी पूरी कथा पढ़िए" — read their
        whole story.

  URDU  dhun.consent        "شاخ، bansuri اور ڈھول مل کر۔"
        "bansuri" is a transliteration of the Hindi, not an Urdu word. Urdu for
        a flute is بنسوری.

WHAT THE CHECKER STILL ALLOWS

MB, PDF, JPG, PNG, Enter, AI and similar are in the allow list, because a file
format is written PDF in Bengali exactly as it is in English — it is the word
printed on the file the visitor is holding. The allow list is short on purpose.
Every entry added is a real leak that stops being caught, so a term earns a
place only when writing it in the local script would make it harder to
recognise.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

FIXES = {
    ("HINDI", "lib.openBadgeNote"): "इसे कॉपी कर सकते हैं",
    ("HINDI", "lib.freeBadgeNote"): "पढ़ सकते हैं, कॉपी नहीं",
    ("TELUGU", "footer.readStory"): "ఇక్కడ పూర్తి కథ చదవండి",
    ("URDU", "dhun.consent"): "شاخ، بنسوری اور ڈھول مل کر۔ سننے کے لیے چھوئیں۔",
}


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()

    for (table, key), value in sorted(FIXES.items()):
        start = re.search(r"const " + table + r"[^=]*=\s*\{", source)
        if not start:
            print(f"table {table} not found — stopping")
            return 1
        end = source.index("\n};", start.end())
        body = source[start.end():end]

        pattern = re.compile(r"( *)'" + re.escape(key) + r"':\s*'(?:[^'\\]|\\.)*',")
        matches = pattern.findall(body)
        if len(matches) != 1:
            print(f"{table}.{key} matched {len(matches)} times — stopping")
            return 1

        line = f"{matches[0]}'{key}': '{esc(value)}',"
        body = pattern.sub(lambda m: line, body, count=1)
        source = source[: start.end()] + body + source[end:]
        print(f"  {table:<10} {key}  ->  {value}")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)
    print(f"\n{len(FIXES)} rewritten. Run scripts/check-latin-leaks.py to confirm.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
