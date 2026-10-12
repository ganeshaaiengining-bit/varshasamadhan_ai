"""
Fix seven faults in scripts/add-support-reviews.py before it is run.

    python scripts/fix-support-reviews.py

Found by scripts/check-scripts.py plus a scan for two things it cannot see.

check-scripts.py caught three:

  L397  Punjabi "ਉਲਝਾਣ" had a Gujarati vowel sign and a Gujarati ਣ at the end.
        Gurmukhi ਾ and ਣ, in a Punjabi sentence.
  L446  Urdu "گر گیا" was written with the Devanagari गया — Hindi, inside an
        Urdu sentence.
  L342  Malayalam "എന്തോ" was written "എ��്തോ", which is two U+FFFD REPLACEMENT
        CHARACTERs where ന്ത sat. A replacement character is what a decoder
        leaves behind when it cannot read a byte, and it renders as a black
        diamond: the script checker passes it, because U+FFFD belongs to no
        script at all. Nothing in the value is recognisable as a wrong language.

A scan for Latin words caught four more, none of which a script check will ever
see, because every character is Latin and belongs where it is:

  L155  Tamil  "வேறு someone க்கு" — the English word someone, with a Tamil
               suffix, in the middle of a Tamil sentence.
  L495  Arabic "أو إنreceived شيئاً" — an English verb glued to two Arabic words
               with no space.
  L527  Arabic "وال particulars الشخصية" — English "particulars" where Arabic
               التفاصيل belongs.
  L553  Spanish "se dedicate a mantener" — an English verb where "se dedica a"
               belongs. The Spanish is grammatical-looking, which is why it is
               worth writing down rather than trusting a reader to spot it.

Each entry carries the text it is meant to replace and refuses to run if that
text is no longer there, so it cannot clobber an edit made in the meantime.
"""

import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "scripts/add-support-reviews.py"

CHAR_FIXES = {
    397: [(0x0ABE, 0x0A3E), (0x0AA3, 0x0A23)],
    446: [(0x0917, 0x06AF), (0x092F, 0x06CC), (0x093E, 0x0627)],
}

TEXT_FIXES = {
    342: ("എ��്തോ", "എന്തോ"),
    155: ("வேறு someone க்கு", "வேறொருவருக்கு"),
    495: ("أو إنreceived شيئاً", "أو إن وجدتم شيئاً"),
    527: ("وال particulars الشخصية", "والتفاصيل الشخصية"),
    553: ("se dedicate a", "se dedica a"),
}

# The LEAKED_LATIN table inside the batch script, corrected. It was written with
# the Arabic entry mapping a string to itself, so it would have reported the
# fault as already fixed and changed nothing.
LEAKED_LATIN_EDITS = {
    591: ('("ta", "support.way3Title"): ("வேறு someone க்கு", "வேறொருவருக்கு"),',
          '# The faults below were fixed in the file itself, so this table is'),
    592: ('("ar", "support.way1Body"): ("أو إنreceived شيئاً", "أو إنreceived شيئاً"),',
          '# now empty on purpose. It is kept as a record of what went wrong, and'),
    593: ('("ar", "reviews.moderationNote"): ("وال particulars الشخصية", "والتفاصيل الشخصية"),',
          '# is not a checklist to run against a file that has moved on.'),
}


def main() -> int:
    lines = io.open(FILE, encoding="utf-8").read().split("\n")
    changed = 0

    for number, (old, new) in sorted(TEXT_FIXES.items()):
        if old not in lines[number - 1]:
            print(f"line {number}: no longer contains the text — stopping")
            print(f"  it reads: {lines[number - 1].strip()[:90]}")
            return 1
        lines[number - 1] = lines[number - 1].replace(old, new)
        print(f"line {number}: text fixed")
        changed += 1

    for number, swaps in sorted(CHAR_FIXES.items()):
        for wrong, right in swaps:
            if chr(wrong) not in lines[number - 1]:
                print(f"line {number}: no longer holds U+{wrong:04X} — stopping")
                return 1
            lines[number - 1] = lines[number - 1].replace(chr(wrong), chr(right))
            print(f"line {number}: U+{wrong:04X} -> U+{right:04X}")
            changed += 1

    for number, (old, new) in sorted(LEAKED_LATIN_EDITS.items()):
        if old not in lines[number - 1]:
            print(f"line {number}: LEAKED_LATIN entry has changed — stopping")
            return 1
        indent = lines[number - 1][: len(lines[number - 1]) - len(lines[number - 1].lstrip())]
        lines[number - 1] = indent + new
        print(f"line {number}: LEAKED_LATIN entry retired")
        changed += 1

    io.open(FILE, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
    print(f"\n{changed} fixed. Run scripts/check-scripts.py on it again.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
