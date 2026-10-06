"""
Catch translation mistakes before they reach the site.

    python scripts/check-translations.py

Four checks, all cheap, none of them a substitute for a person reading the text:

1. **Leftover Latin script.** The Indian languages here are written in their own
   script, so a value that is still ASCII is nearly always a typo — a word pasted
   from the English table, or a mistyped quote. `es` is excluded (Latin is
   correct for it) and so are values that legitimately contain a number, a
   shortcode, or a product name.

2. **Values identical to English.** A Tamil string that is byte-for-byte the
   English one is nearly always an untranslated copy rather than a word that
   genuinely looks the same in both languages.

3. **Empty or suspiciously short values.** An empty label renders a button with
   nothing in it, and a screen reader announces nothing at all.

4. **Placeholder mismatch.** If the Hindi value has `{count}` and the Tamil one
   does not, the sentence is broken in a way nobody notices until the reader
   counts the missing number.

Run it after adding any batch of translations.
"""

import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

I18N = "src/content/i18n.ts"

TABLES = {
    "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL", "te": "TELUGU",
    "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA", "ml": "MALAYALAM",
    "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC", "es": "SPANISH",
}

# Languages written in a non-Latin script, so a Latin value is a real finding.
SCRIPT_LANGUAGES = {"bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "ar"}

# The Unicode blocks each of those languages is written in.
BLOCKS = {
    "bn": (0x0980, 0x09FF),   # Bengali
    "ta": (0x0B80, 0x0BFF),   # Tamil
    "te": (0x0C00, 0x0C7F),   # Telugu
    "mr": (0x0900, 0x097F),   # Devanagari (Marathi/Hindi/Nepali)
    "gu": (0x0A80, 0x0AFF),   # Gujarati
    "kn": (0x0C80, 0x0CFF),   # Kannada
    "ml": (0x0D00, 0x0D7F),   # Malayalam
    "pa": (0x0A00, 0x0A7F),   # Gurmukhi
    "ur": (0x0600, 0x06FF),   # Arabic (Urdu shares it)
    "ar": (0x0600, 0x06FF),   # Arabic
}

# Values where Latin is expected even in a non-Latin language: an emergency
# number, a version string, a URL. Checked by hand rather than by pattern.
LATIN_ALLOWED = {"vs-lang", "https", "http"}


def load_table(source, name):
    opener = re.search(r"const %s: Record<string, string> = \{" % name, source)
    closer = re.search(r"^\};", source[opener.end():], re.M)
    body = source[opener.end(): opener.end() + closer.start()]
    return dict(re.findall(r"'([a-zA-Z0-9_.]+)':\s*'((?:[^'\\]|\\.)*)'", body, re.S))


def has_native_script(value, language):
    low, high = BLOCKS[language]
    return any(low <= ord(ch) <= high for ch in value)


def placeholders(value):
    return set(re.findall(r"\{(\w+)\}", value))


def main():
    source = io.open(I18N, encoding="utf-8").read()
    tables = {code: load_table(source, name) for code, name in TABLES.items()}
    hi = load_table(source, "HINDI")

    problems = []

    for language, table in tables.items():
        if language == "en":
            continue

        for key, value in table.items():
            reference = hi.get(key) or tables["en"].get(key)

            if not value.strip():
                problems.append(f"{language} {key}: empty")
                continue

            if len(value.strip()) < 2 and language not in ("es",):
                problems.append(f"{language} {key}: suspiciously short ({value!r})")

            if language in SCRIPT_LANGUAGES and not has_native_script(value, language):
                # A value with no native script in a native-script language.
                # Allowed only when it is purely a number or a code.
                if not re.fullmatch(r"[\d\s\-.:()]+", value):
                    problems.append(f"{language} {key}: no native script — {value!r}")

            if language not in SCRIPT_LANGUAGES and value == tables["en"].get(key):
                problems.append(f"{language} {key}: identical to the English text")

            if reference and placeholders(reference) != placeholders(value):
                problems.append(
                    f"{language} {key}: placeholders differ — "
                    f"want {sorted(placeholders(reference))}, got {sorted(placeholders(value))}"
                )

    if problems:
        print(f"{len(problems)} finding(s):\n")
        for line in problems:
            print("  " + line)
        return 1

    print("No translation problems found.")
    print("(This checks shape and script, not meaning. Someone who speaks the")
    print(" language still has to read the health and emergency strings.)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())