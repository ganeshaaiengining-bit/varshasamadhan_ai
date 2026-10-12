"""
Fix two malformed lines in scripts/add-contact-keys.py.

    python scripts/fix-contact-keys.py

    L189  "support.faq4A": ಎಂದಿಗೂ ಅಲ್ಲ. ...            ← no opening quote
    L210  "support.faq4A": എപ്പോഴും അല്ല. ...          ← no opening quote

Both Kannada and Malayalam came out missing the quote that opens the value, so
each line ended in a bare Kannada or Malayalam word followed by ",", which Python
reads as a syntax error rather than as a string. Both also picked up a stray
em-dash from nowhere, which is the same class of slip as the U+FFFD characters
found in three earlier batches: writing four hundred lines of translation by hand
produces a stray mark roughly every third file.

Located by scanning for lines whose key is right but whose value does not start
with a quote, rather than by line number, so this does not break if anything is
inserted above.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "scripts/add-contact-keys.py"

# key -> the value as it should read
REPLACEMENTS = {
    "support.faq4A": {
        "kn": "ಎಂದಿಗೂ ಅಲ್ಲ. ಉತ್ತರ ಬರೆದ್ದೇ ಕಂಪ್ಯೂಟರ್, ವೈದ್ಯರಲ್ಲ — ಅತ್ತರಾಗಿ ಪ್ರತಿ ಉತ್ತರದೊಂದಿಗೆ ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ ಎಂದು ಬರೆದಿದೆ. ಯಾವುದೇ ಔಷಧಿ ಆರಂಭಿಸುವ ಮೊದಲು ಅಥವಾ ನಿಲ್ಲಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.",
        "ml": "എപ്പോഴും അല്ല. ഉത്തരം എഴുതുന്നത് ഒരു കമ്പ്യൂട്ടറാണ്, ഡോക്ടർ അല്ല — അതുകൊണ്ട് ഓരോ ഉത്തരത്തോടും ഇത് വൈദ്യ ഉപദേശമല്ല എന്ന് എഴുതിയിട്ടുണ്ട്. ഏതെങ്കിലും മരുന്ന് തുടങ്ങുകയോ നിർത്തുകയോ മുമ്പ് ഡോക്ടറുടെ ഉപദേശം എടുക്കുക.",
    },
}

# A well-formed value line is   "key": "value",   — a quote follows the colon
# and the space. These two do not have one.
#
# The lookahead is `(?!\s*")` rather than `(?!")`. Written as `(?!")` after a
# `\s*`, it matches every line in the file: `\s*` is free to match nothing, the
# next character is then the space rather than the quote, the lookahead passes,
# and the fixer reported "no replacement recorded for mr" on a Marathi line that
# was never broken — twice, stopping before the two lines it was written for.
# `(?!\s*")` cannot match when any amount of space is followed by a quote.
BROKEN = re.compile(r'^(\s*)"(support\.faq4A)":(?!\s*")')


def main() -> int:
    lines = io.open(FILE, encoding="utf-8").read().split("\n")
    changed = 0

    for index, line in enumerate(lines):
        match = BROKEN.match(line)
        if not match:
            continue

        indent, key = match.group(1), match.group(2)
        # Work out which language block this line is in, so the right value goes
        # back. The block headers are four-space-indented quotes.
        language = None
        for back in range(index - 1, -1, -1):
            head = re.match(r'^    "([a-z]{2})": \{', lines[back])
            if head:
                language = head.group(1)
                break

        # A line before the T dictionary has no language block above it — it is
        # in HI, which is written correctly. Skipped rather than treated as an
        # error: the first version returned 1 here and stopped before reaching
        # the two lines it was written for, because it had matched a line that
        # was never broken.
        if language is None:
            continue

        value = REPLACEMENTS.get(key, {}).get(language)
        if not value:
            print(f"line {index + 1}: no replacement recorded for {language}")
            return 1

        lines[index] = f'{indent}"{key}": "{value}",'
        print(f"line {index + 1}: {language} {key} repaired")
        changed += 1

    io.open(FILE, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
    print(f"\n{changed} repaired.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
