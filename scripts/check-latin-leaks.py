"""
Find English words sitting inside a non-English translation.

    python scripts/check-latin-leaks.py                 # i18n.ts, as it stands
    python scripts/check-latin-leaks.py scripts/add-health-shell.py

English inside a Tamil sentence is invisible to a script check: every character
is Latin, and Latin belongs exactly where it is. It has got through five times
while writing these batches.

  - Tamil   "வேறு someone க்கு"  — the English word someone, with a Tamil suffix
  - Arabic  "أو إنreceived شيئاً" — an English verb glued to Arabic words
  - Arabic  "وال particulars الشخصية"
  - Spanish "se dedicate a mantener" — and grammatical-looking, which is why it
    needed writing down rather than trusting a reader to spot it
  - Telugu "పుట్టుక children" — a whole noun, in the middle of a Telugu note

WHAT IS FLAGGED

An English word of two letters or more, inside a value that is otherwise in a
non-Latin script. Single letters are ignored: "a" and "I" are too common in
prose, brand names and units to be evidence of anything.

WHAT IS NOT FLAGGED

Values that are Latin-script in the first place — Spanish, and the English
table itself. A Spanish translation legitimately contains "de", "que" and
"para", and flagging those would bury the five real findings under hundreds of
false ones. So a value is only examined if the majority of its letters are
outside Latin, which is also what tells us it was meant to be a translation and
not a brand name that happens to sit in a sentence.

Products, place names and units are allowed through, because "WhatsApp" or
"112" inside a Bengali sentence is correct. Each finding is printed with its
key so it can be judged rather than bulk-accepted.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

SOURCE = "src/content/i18n.ts"

# Languages whose values are Latin, so they are not examined.
LATIN_LANGUAGES = {"en", "es"}

# Non-Latin letter ranges. A value is examined only if most of its letters fall
# inside these.
SCRIPTS = [
    (0x0900, 0x097F), (0x0980, 0x09FF), (0x0A00, 0x0A7F), (0x0A80, 0x0AFF),
    (0x0B80, 0x0BFF), (0x0C00, 0x0C7F), (0x0C80, 0x0CFF), (0x0D00, 0x0D7F),
    (0x0600, 0x06FF),
]

# Two letters is the floor. "a" and "I" appear in prose, names and units.
ENGLISH = re.compile(r"[A-Za-z]{2,}")

# {value}, {count} and {rating} are the placeholders check-spacing.py already
# guards, and they are Latin by definition. Stripping them first is what keeps
# the real findings from drowning: every review string in every language carries
# one, and reported 30 times over, nobody reads the one that matters.
PLACEHOLDER = re.compile(r"\{[A-Za-z0-9_.]+\}")

# Terms that are genuinely Latin inside these languages and are correct there.
# A file format is written PDF in Bengali exactly as it is in English, because
# that is how it appears on the file the visitor is holding. A key name is
# written Enter because that is the word printed on their key.
#
# This list is deliberately short. A word earns its place here only when putting
# it in the local script would make it harder to recognise, and adding an entry
# is how this check gets slowly useless — every false negative added is one
# real leak no longer caught.
ALLOWED = {
    "PDF", "JPG", "JPEG", "PNG", "WEBP", "MP3", "MP4", "TXT", "CSV", "DOCX",
    "SMS", "URL", "PDFs",
    "AI", "APP", "OK",
    "Enter", "Space", "Backspace", "Shift",
    "WhatsApp", "Google", "Neon", "Supabase", "Vercel", "Gemini", "Pollinations",
    "Email", "Login", "Logout", "Admin",
    # Units. SI symbols are written the same in every language and the local
    # spelling would be harder to recognise, not easier.
    "MB", "KB", "GB", "TB", "kB", "MBs", "Hz", "kHz", "GHz",
}

VALUE = re.compile(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'")


def letters(text: str) -> list[str]:
    return [c for c in text if c.isalpha()]


def mostly_non_latin(text: str) -> bool:
    chars = letters(text)
    if len(chars) < 4:
        return False
    inside = sum(1 for c in chars if any(lo <= ord(c) <= hi for lo, hi in SCRIPTS))
    return inside * 2 > len(chars)


def words_in(value: str) -> list[str]:
    """English words worth reporting, with placeholders and known terms removed."""
    without_placeholders = PLACEHOLDER.sub(" ", value)
    return [w for w in ENGLISH.findall(without_placeholders) if w not in ALLOWED]


def report(name: str, key: str, value: str, words: list[str]) -> None:
    print(f"  {name:<10} {key}")
    print(f"      {value[:88]}")
    print(f"      English: {', '.join(words)}")


def scan_i18n() -> int:
    source = io.open(SOURCE, encoding="utf-8").read()
    at = source.index("const TABLES")
    pairs = dict(re.findall(r"^\s*([a-z]{2}):\s*([A-Z]+),", source[at:source.index("};", at)], re.M))

    total = 0
    for code, name in sorted(pairs.items()):
        if code in LATIN_LANGUAGES:
            continue
        start = re.search(r"const " + name + r"[^=]*=\s*\{", source)
        body = source[start.end():source.index("\n};", start.end())]

        for key, value in VALUE.findall(body):
            value = value.replace("\\'", "'").replace("\\\\", "\\")
            if not mostly_non_latin(value):
                continue
            words = words_in(value)
            if words:
                total += 1
                report(name, key, value, words)

    return total


def scan_script_file(path: str) -> int:
    source = io.open(path, encoding="utf-8").read()
    blocks = re.findall(r"^\s{4}\"([a-z]{2})\": \{(.*?)^\s{4}\},", source, re.S | re.M)
    if not blocks:
        print(f"  could not find any language blocks in {path}")
        return 1

    total = 0
    for code, block in blocks:
        if code in LATIN_LANGUAGES:
            continue
        for key, value in re.findall(r"\"([^\"]+)\":\s*\"((?:[^\"\\]|\\.)*)\"", block):
            value = value.replace('\\"', '"').replace("\\\\", "\\")
            if not mostly_non_latin(value):
                continue
            words = words_in(value)
            if words:
                total += 1
                report(code, key, value, words)

    return total


def main() -> int:
    if len(sys.argv) > 1:
        print(f"Checking {sys.argv[1]} before it is run\n")
        total = scan_script_file(sys.argv[1])
    else:
        print("Checking i18n.ts\n")
        total = scan_i18n()

    print()
    if total:
        print(f"{total} value(s) contain English inside another language.")
        print("Judge each one — a product name is fine, a stray noun is not.")
        return 1

    print("No English inside any non-Latin translation.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
