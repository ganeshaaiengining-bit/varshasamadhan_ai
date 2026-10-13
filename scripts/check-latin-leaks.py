import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Find visitor-facing text that is written in Latin letters inside a language the
site does not write in Latin.

WHY THIS EXISTS

The site offers eighteen languages, ten of them in non-Latin scripts. A Hindi
visitor reading "Apna document ya photo lagayein" sees English and has to work
out what it means, which is exactly the audience this site is for: people who
often cannot read English and are sometimes listening rather than reading.

One instance was found on the home page during a walk through the rendered
site, after check-latin-leaks.py had reported the file clean. That script
looked for English inside non-Latin *translation tables*; this one looks at
every string literal in every source file, and it reads the page rather than the
table, because the string that mattered was a hardcoded default in a component
and never went near a table.

WHAT IT COUNTS AS A FAULT

A string literal that contains Latin words of three letters or more AND no
characters from any non-Latin script. The second half matters: a line may
legitimately hold both, as in

    'attach.hint': 'Yeh .PDF, .DOCX ya photo ho sakti hai.'

which is Latin but is deliberately written that way for a plain-Latin
translation, and

    <p>जानकारी {item.count} बार पढ़ा गया</p>

which is Devanagari with a Latin variable name on the same line.

So the test is per-string-literal, and a literal has to be entirely Latin to be
reported. Known abbreviations — AI, SMS, PDF, ATM, PIN — are allowed, because
they are used that way in the languages this site serves.

WHAT IT PRINTS

File, line, and the string. Anything it reports is either a bug or a string
that needs a human decision.
"""

ROOT = "src"
LATIN_WORD = re.compile(r"[A-Za-z]{3,}")
NON_LATIN = re.compile(r"[\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF"
                       r"\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF"
                       r"\u0D00-\u0D7F]")

# Allowed inside a non-Latin string: names, units and acronyms that are used
# as-is in these languages rather than translated.
ALLOWED = {
    "AI", "SMS", "PDF", "DOC", "DOCX", "ATM", "PIN", "OTP", "UPI", "QR",
    "PDF ko", "SMS ko", "AI se", "App", "Google", "WhatsApp", "YouTube",
}

# A string literal: single, double or template quoted, allowing escapes.
STRING = re.compile(r"(?P<q>['\"`])(?P<body>(?:\\.|[^\\])*?)(?P=q)")

CODE_HINTS = ("import ", "export ", "function ", "className=", "from '", 'from "')


def looks_like_code(line: str) -> bool:
    return any(h in line for h in CODE_HINTS)


def main() -> int:
    total = 0
    by_file = {}

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d != "node_modules"]
        for name in filenames:
            if not name.endswith((".ts", ".tsx")):
                continue
            path = os.path.join(dirpath, name)

            try:
                lines = io.open(path, encoding="utf-8").read().split("\n")
            except Exception:
                continue

            for number, line in enumerate(lines, 1):
                stripped = line.strip()
                if not stripped or stripped.startswith("//") or stripped.startswith("*"):
                    continue

                for match in STRING.finditer(line):
                    body = match.group("body")
                    if len(body) < 3:
                        continue
                    if NON_LATIN.search(body):
                        continue
                    if not LATIN_WORD.search(body):
                        continue

                    words = set(LATIN_WORD.findall(body))
                    if words and words <= ALLOWED:
                        continue

                    # A whole line that is clearly code, where the string is a
                    # module path or a URL, is not visitor-facing.
                    if looks_like_code(line) and ("/" in body or "." in body):
                        continue

                    total += 1
                    by_file.setdefault(path, []).append((number, body))
                    break  # one report per line is enough

    print()
    print("Latin text inside non-Latin pages")
    print("=" * 66)
    print()

    if total == 0:
        print("  None. Every visitor-facing string in a non-Latin language is in")
        print("  that language's own script.")
        print()
        return 0

    for path in sorted(by_file):
        print(f"  {path}")
        for number, body in by_file[path]:
            print(f"    line {number}:  {body[:96]}")
        print()

    print(f"  {total} line(s) need attention across {len(by_file)} file(s).")
    print()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())