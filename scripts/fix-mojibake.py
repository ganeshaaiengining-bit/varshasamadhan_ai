"""
Fix unreadable text found by scan-mojibake.py.

    python scripts/fix-mojibake.py

Two files, two very different problems.

prisma/seed.ts, line 318 — THE ONE THAT MATTERS

    helpline: 'एम्बुलेंस: 108 · ���ाष्ट्रिकल helpline: 1075'

Three U+FFFD REPLACEMENT CHARACTERS where विद्युत्सहायता belonged — the
electricity helpline, 1075, an Indian emergency line. This string is written
into the database by `npm run db:seed` and then shown to a visitor in a red box
on an article about preventing illness. So the three characters are not in a
comment: they are on the page, next to an ambulance number, in the one place on
the site where a garbled word could cost someone a phone call.

The characters are gone and cannot be recovered — a replacement character is
what the decoder left when it could not read the bytes, so there is nothing left
to reverse. It is rewritten from the number next to it: 1075 is the electrical
helpline, and the Hindi for that is विद्युत्सहायता. That is a judgement, not a
recovery, which is why it is done here in a file with its reasoning written
above it rather than by a script that guesses.

scripts/render-art.mjs — 14 lines in comments

  RAY TRACER â€” the 4K imagery
  â€¢ Stock photography â€” exactly the copyright problem to avoid

All of it reversible. Em dashes and bullet points read through Windows-1252 and
written back as UTF-8, which is the same fault as package.json's description and
the same fix. These are comments and one console line, so nothing a visitor sees
is affected — which is why this file is listed second and described as cosmetic
rather than bundled with the helpline as if they were equally urgent.

REVERSING, CAREFULLY

The reversal is applied per line, not to the whole file, and a line whose
reversed form does not decode is left exactly as it was. Applying it blindly
would be worse than not applying it: a file containing a single correctly
encoded string would come back wrong.
"""

import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

SEED = "prisma/seed.ts"
ART = "scripts/render-art.mjs"

# The helpline string, restored. 1075 is the Indian electricity helpline and
# विद्युत्सहायता is what it is called in Hindi.
HELPLINE_OLD = "एम्बुलेंस: 108 · " + "�" * 3 + "ाष्ट्रिकल helpline: 1075"
HELPLINE_NEW = "एम्बुलेंस: 108 · विद्युत्सहायता helpline: 1075"


def reverse(text: str) -> str:
    """Put mangled bytes back together, per character.

    cp1252 where cp1252 defines the character, its own codepoint where it does
    not. Neither codec alone reverses this: see the note in fix-package-json.py.
    """
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


def fix_seed() -> int:
    source = io.open(SEED, encoding="utf-8").read()

    if HELPLINE_OLD not in source:
        print(f"{SEED}: the helpline string is not in the state expected.")
        print(f"  it now reads: "
              f"{[l.strip() for l in source.split(chr(10)) if 'helpline' in l and '1075' in l]}")
        return 1

    source = source.replace(HELPLINE_OLD, HELPLINE_NEW)
    io.open(SEED, "w", encoding="utf-8", newline="\n").write(source)
    print(f"{SEED}")
    print(f"  helpline: {HELPLINE_NEW}")
    print("  This one reaches a visitor. Re-run `npm run db:seed` to put it in")
    print("  the database; the seeded row still holds the old bytes.")
    return 0


def fix_art() -> int:
    source = io.open(ART, encoding="utf-8").read()
    lines = source.split("\n")
    changed = 0

    for index, line in enumerate(lines):
        if "�" in line:
            continue  # nothing to reverse; U+FFFD is not reversible
        if not any(c in line for c in "\u00e0\u00c3\u00c2\u00e2\u00f5"):
            continue

        repaired = reverse(line)
        if not repaired or repaired == line:
            print(f"  {ART} L{index + 1}: would not decode, left alone")
            continue
        lines[index] = repaired
        changed += 1

    io.open(ART, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
    print(f"{ART}: {changed} line(s) reversed")
    return 0


def main() -> int:
    if fix_seed():
        return 1
    fix_art()
    print()
    print("Run scripts/scan-mojibake.py to confirm.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
