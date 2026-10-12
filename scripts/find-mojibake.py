"""
Show exactly where double-encoding damage sits in a file, if anywhere.

    python scripts/find-mojibake.py src/content/i18n.ts

scripts/fix-package-json.py scans the repository for mangled text and reported
four files, one of them src/content/i18n.ts. That one cannot be taken at face
value: the Hindi table is legitimately Devanagari, and the heuristic it used —
"three or more mangled-looking characters" — cannot tell mangled Devanagari from
correct Devanagari that happens to contain à or •.

So this takes a file and separates the two cases properly, by attempting the
reversal on each individual string value and keeping only the ones where it
produces valid text that is *different* and looks like the script it should be.

WHAT COUNTS AS MANGLED HERE

A value is mangled if reversing its encoding yields a string containing
characters from the scripts this project actually uses, and the value does not
already contain them. Mangled Devanagari is all Latin-1 and C1 characters;
reversed, it is Devanagari. Correct Devanagari is already Devanagari, so
reversing it either fails or produces nonsense, and it is left alone.

Exit code is 1 when damage is found and 2 when the file cannot be read, so a
caller can tell "clean" from "not looked at".
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

# Ranges that count as "real" text this project uses.
SCRIPTS = [
    (0x0900, 0x097F, "Devanagari"),
    (0x0980, 0x09FF, "Bengali"),
    (0x0A00, 0x0A7F, "Gurmukhi"),
    (0x0A80, 0x0AFF, "Gujarati"),
    (0x0B80, 0x0BFF, "Tamil"),
    (0x0C00, 0x0C7F, "Telugu"),
    (0x0C80, 0x0CFF, "Kannada"),
    (0x0D00, 0x0D7F, "Malayalam"),
    (0x0600, 0x06FF, "Arabic"),
]

VALUE = re.compile(r"'((?:[^'\\]|\\.)*)'")


def script_of(text: str) -> str:
    for low, high, name in SCRIPTS:
        if any(low <= ord(c) <= high for c in text):
            return name
    return ""


def reverse(text: str) -> str:
    """Put mangled bytes back together. Same hybrid as fix-package-json."""
    out = bytearray()
    for char in text:
        try:
            out += char.encode("cp1252")
        except UnicodeEncodeError:
            code = ord(char)
            if code > 0xFF:
                return ""
            out.append(code)
    try:
        return bytes(out).decode("utf-8")
    except UnicodeDecodeError:
        return ""


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    damaged = 0
    for path in sys.argv[1:]:
        try:
            source = io.open(path, encoding="utf-8").read()
        except (OSError, UnicodeDecodeError) as error:
            print(f"{path}: could not read — {error}")
            return 2

        print(f"{path}")

        for number, line in enumerate(source.split("\n"), 1):
            for raw in VALUE.findall(line):
                value = raw.replace("\\'", "'").replace("\\\\", "\\")
                if not value:
                    continue

                # Already in a real script: this is correct text, not damage.
                if script_of(value):
                    continue

                repaired = reverse(value)
                if not repaired or repaired == value:
                    continue

                name = script_of(repaired)
                if not name:
                    continue

                print(f"  L{number}  {name}")
                print(f"    mangled: {value[:64]}")
                print(f"    should be: {repaired[:64]}")
                damaged += 1

    print()
    if damaged:
        print(f"{damaged} value(s) carry double-encoded text.")
        return 1

    print("No double-encoded values in these files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
