"""
Fix four corrupted values in scripts/add-health-questions.py before it is run.

    python scripts/fix-health-questions.py

  kn health.q.young4   two U+FFFD where ಮಾ sat — "ಏನು ��ಾಡಬೇಕು?"
  ta health.q.teen4   "த sensed" — the English verb, with a space on either side,
                       inside a Tamil sentence
  te health.q.teen3    "వదిలే way" — the English noun
  ar health.q.teen3    "أbecome مدمناً" — the English verb fused to an Arabic
                       letter with no space, so it reads as one broken word

The Kannada one is the check added in the previous commit earning its place on
its first use. It is the third time U+FFFD has appeared in a batch — the first
two were a Malayalam "എന്തോ" and a Gujarati "કમરમાં" — and both times it reached
i18n.ts, because a character belonging to no script is invisible to a check that
infers the script by range.

Located by content rather than by line number. The fixers earlier in this
repository all used line numbers, and every one of them broke the moment a line
was added above.
"""

import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "scripts/add-health-questions.py"

FIXES = [
    ("ಹಣ ಕಡಿಮೆ, ಖರ್ಚ ಹೆಚ್ಚು, ಏನು �ಾಡಬೇಕು?", "ಹಣ ಕಡಿಮೆ, ಖರ್ಚ ಹೆಚ್ಚು, ಏನು ಮಾಡಬೇಕು?"),
    ("மிகவும் மனக்கவலி த sensed, யாரிடம் பேசுவது?", "மிகவும் மனக்கவலி தோன்றுகிறது, யாரிடம் பேசுவது?"),
    ("వదిలే way ఏమిటో చెప్పండి.", "వదిలే విధానం ఏమిటో చెప్పండి."),
    ("أbecome مدمناً للهاتف", "أصبحت مدمناً للهاتف"),
]


def main() -> int:
    lines = io.open(FILE, encoding="utf-8").read().split("\n")
    changed = 0

    for old, new in FIXES:
        found = False
        for index, line in enumerate(lines):
            if old in line:
                lines[index] = line.replace(old, new)
                print(f"line {index + 1}: {new}")
                found = True
                changed += 1
        if not found:
            print(f"could not find: {old!r}")
            print("  stopping without writing")
            return 1

    io.open(FILE, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
    print(f"\n{changed} fixed. Re-run the checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
