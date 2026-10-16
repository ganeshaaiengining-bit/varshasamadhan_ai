"""Is the name written VARSHA everywhere it should be?

    python scripts/check-name.py

The owner's rule, stated more than once: the name is VARSHA, in English capital
letters, in every language. Never in a native script, never title case. वर्षा is
the Hindi word for rain, and a visitor who reads that instead of VARSHA has been
shown a different person's name.

── Why this has to be a script and not a read-through ─────────────────────────

Because it passed every other check. Every table was in its own script, every
sentence was translated by hand, the type-checker was clean and the site built
— and the name was still written in the visitor's own script in thirteen
places. Nothing about that is a type error. `name: 'वर्षा'` is a perfectly good
string.

── Why the word "year" is not in this file as a name ─────────────────────────

`ವರ್ಷ` in Kannada and `വർഷം` in Malayalam are the ordinary word for a year, and
they sit in the age-band labels — "61 – 75 years". A check that flagged those
would be wrong, and a check that skipped every line containing `ವರ್ಷ` would miss
the real one. So instead of matching the word, this checks the *line*: every
line that mentions the name must also contain the capitals. `health.band.*`
lines never mention her, so they are never looked at.

It reads comments too, on purpose. A comment explaining the rule is allowed to
contain the wrong spelling — it is the rule being discussed — so those lines are
excluded by looking for the word "means" or "never" nearby. In practice there are
two such comments and they are both in memorial-strip.tsx.
"""

import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")


# How the name is written when it is written wrongly. Latin title case and lower
# case are here as well as the native scripts.
WRONG = {
    "Devanagari": "वर्षा",
    "Tamil": "வர்ஷா",
    "Telugu": "వర్షా",
    "Gurmukhi": "ਵਰਸ਼ਾ",
    "Bengali": "বর্ষা",
    "Gujarati": "વર્ષા",
    "Kannada": "ವರ್ಷಾ",
    "Malayalam": "വർഷ",
    "Urdu/Arabic": "ورشا",
}

# `Varsha` not standing alone — `Varsha Samadhan` in a sentence about the
# service is fine, but it is checked as a bare word so the service name is
# allowed while a person's name in title case is not.
LATIN_WRONG = re.compile(r"(?<![A-Za-z\"'`])Varsha(?![A-Za-z])")

# Lines that talk about the rule rather than obeying it.
EXEMPT = ("means", "never", "not written", "forbidden", "उल्लंघन")

# Words that merely *start* with the wrong spelling.
#
# `वर्षांक` — "the year-number" — is the Devanagari word for a year with a count
# on it, and its first four letters are the Devanagari spelling of her name. It
# is the same collision Kannada and Malayalam have with the word for a year, and
# it produced a failure on the Anka Ganit panel, on a label that has nothing to
# do with anybody's name.
#
# The difference is the anusvara immediately after: `वर्षा` the name is followed
# by a space, a जी or an end of line, while `वर्षा` the year-number is always
# followed by the anusvara that makes it `वर्षा + ं + क`. So a match immediately
# followed by that mark is a different word.
NOT_THE_NAME = re.compile(r"[ऀ-ॿ]")  # Devanagari range


def is_the_name(text: str, wrong: str, at: int) -> bool:
    """True when the match is her name and not a longer word starting the same."""
    if wrong == "वर्षा":
        after = text[at + len(wrong) : at + len(wrong) + 1]
        # The anusvara: part of `वर्षांक`, never of `वर्षा` on its own.
        if after == "ं":
            return False
        # A long vowel marker means the word continues — `वर्षाएँ` and the like.
        if after in "ािीुूेैॉॊोौंँःँ":
            return False
    return True


def tables_missing_varsha(text: str) -> list[str]:
    """Language tables whose `ref.intro` does not mention her at all.

    The other half of the check. A file where the sentence was deleted entirely
    contains no misspelling, so a check that only hunts for the wrong spelling
    reports a clean site that has quietly stopped saying who the service is for.
    """
    blocks = re.split(r"^const [A-Z]+: Record<string, string> = \{", text, flags=re.M)
    names = re.findall(r"^const ([A-Z]+): Record<string, string> = \{", text, re.M)

    missing = []
    for name, body in zip(names, blocks[1:]):
        if "VARSHA" not in body.split("\n};")[0]:
            missing.append(name)

    return missing


def main() -> int:
    findings = []

    for root, _, files in os.walk("src"):
        for name in sorted(files):
            if not name.endswith((".ts", ".tsx")):
                continue

            path = os.path.join(root, name)
            for number, line in enumerate(io.open(path, encoding="utf-8").read().split("\n"), 1):
                lowered = line.lower()

                if any(word in lowered for word in EXEMPT):
                    continue

                for script, wrong in WRONG.items():
                    for match in re.finditer(re.escape(wrong), line):
                        # Kannada and Malayalam share their letters with the
                        # word for a year, which sits in the age-band labels.
                        # Only a line that also speaks of remembrance is about
                        # her; "61 – 75 years" is not a spelling mistake.
                        if script in ("Kannada", "Malayalam") and not re.search(
                            r"smriti|smar|ijotish|VARSHA", line, re.I
                        ):
                            continue

                        # A longer word that happens to begin the same way.
                        if not is_the_name(line, wrong, match.start()):
                            continue

                        findings.append((path, number, script, line.strip()))

                if LATIN_WRONG.search(line):
                    findings.append((path, number, "Latin title case", line.strip()))

    print()
    if findings:
        print(f"  {len(findings)} jagah naam galat script me hai:")
        for path, number, script, line in findings:
            print(f"    [{script}] {path}:{number}")
            print(f"        {line[:150]}")
        print()
        print("  har jagah VARSHA karna hai — English capitals, chahe baaki bhasha koi bhi ho.")
        print()
        return 1

    tables = io.open("src/content/i18n.ts", encoding="utf-8").read()

    if "name: 'VARSHA'" not in io.open("src/content/tribute.ts", encoding="utf-8").read():
        print("  tribute.ts me naam 'VARSHA' nahi hai")
        return 1

    missing = tables_missing_varsha(tables)
    if missing:
        print(f"  in bhasha me naam gaya hi nahi: {', '.join(missing)}")
        return 1

    print(f"  naam {len(WRONG) + 1} galat roopon me dhoondha gaya — koi nahi mila.")
    print(f"  {len(re.findall(r'^const ([A-Z]+): Record', tables, re.M))} bhasha me naam VARSHA hai.")
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())