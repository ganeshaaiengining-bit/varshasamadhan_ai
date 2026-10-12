"""
Fix four wrong-script characters in scripts/add-ref.py.

    python scripts/fix-add-ref-lines.py

Written because the edit tool kept failing to match these lines exactly. All
four were found by scripts/check-scripts.py, which is the tool that should be
believed here — an earlier ad-hoc scan of mine mis-assigned languages to blocks
and reported the entire file as broken when three lines were at fault.

  L226  Kannada  U+0AA3 'ણ' is the Gujarati letter. Kannada needs U+0CA3 'ಣ',
        in "ಇರಬೇಣ" — "if one no longer feels like living".
  L248  Malayalam U+0CCB 'ೋ' is the Kannada vowel sign. Malayalam needs
        U+0D4B 'ോ', in "ഒഴിസോ" — "delete".
  L297  Urdu     36 Devanagari characters: the clause "ऐसी आम समस्याओं के आसान
        उपाय, साफ़-सुथरी भाषा मیں" was Hindi sitting inside an Urdu sentence.
  L361  Spanish  "se va la luz,hacia" — a comma with no space after it.

Rewriting by line number rather than by matching, because matching is what
failed. Each entry carries the codepoint it is meant to replace and the one it
should have been, so the script refuses to run if the line no longer holds it
and cannot clobber an edit made in the meantime.
"""

import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "scripts/add-ref.py"

# line -> list of (wrong codepoint, right codepoint), applied in order.
CHAR_FIXES = {
    226: [(0x0AA3, 0x0CA3)],
    248: [(0x0CCB, 0x0D4B)],
}

# line -> (the exact text to replace, its replacement)
TEXT_FIXES = {
    297: (
        "— ऐसी आम समस्याओं के आसान उपाय, साफ़-सुथरी भाषा میں۔",
        "— ایسی عام مسائل کے آسان حل، صاف ستھری زبان میں۔",
    ),
    361: ("se va la luz,hacia", "se va la luz, hacia"),
}


def main() -> int:
    lines = io.open(FILE, encoding="utf-8").read().split("\n")
    changed = 0

    for number, swaps in sorted(CHAR_FIXES.items()):
        line = lines[number - 1]
        for wrong, right in swaps:
            if chr(wrong) not in line:
                print(f"line {number} no longer holds U+{wrong:04X} — not touching it")
                print(f"  it reads: {line.strip()[:90]}")
                return 1
            line = line.replace(chr(wrong), chr(right))
            print(f"line {number}: U+{wrong:04X} -> U+{right:04X}")
            changed += 1
        lines[number - 1] = line

    for number, (old, new) in sorted(TEXT_FIXES.items()):
        line = lines[number - 1]
        if old not in line:
            print(f"line {number} no longer contains the text — not touching it")
            print(f"  it reads: {line.strip()[:90]}")
            return 1
        lines[number - 1] = line.replace(old, new)
        print(f"line {number}: text replaced")
        changed += 1

    io.open(FILE, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
    print(f"\n{changed} fixed. Now run scripts/check-scripts.py scripts/add-ref.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
