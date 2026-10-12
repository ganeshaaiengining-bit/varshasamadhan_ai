"""
Check that no translation carries a character from the wrong script.

    python scripts/check-scripts.py [add-ref.py]

Added after a batch of translations went in with Chinese characters sitting
inside an Arabic string and Hindi characters inside a Spanish one. Both are
obvious once seen and invisible in a diff of 400 lines.

Scope matters here. An earlier version of this scanned the whole of i18n.ts and
reported several hundred "Devanagari in the wrong place" findings — every one of
them the Hindi table, which is supposed to be Devanagari. A check that cannot tell
Hindi from Malayalam is not a check.

So it only looks at the tables this batch is adding to, and it compares against
the script each of those languages actually uses. Arabic and Urdu are checked
against the Arabic block, which both share, and Latin-script languages are
exempt from the non-Latin rules while still being checked for stray braces — a
template placeholder left in a value renders as literal text to a visitor.

Pass a script file to check the strings it holds before running it. Run with no
argument to check what is already in i18n.ts.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

# code -> (name, ranges that are correct)
SCRIPTS = {
    "hi": ("HINDI", [(0x0900, 0x097F), (0x200C, 0x200D), (0x2010, 0x2027), (0x20A0, 0x20BF)]),
    "mr": ("MARATHI", [(0x0900, 0x097F), (0x200C, 0x200D), (0x2010, 0x2027), (0x20A0, 0x20BF)]),
    # Bengali and Punjabi are listed with U+0964 as permitted. They do not own a
    # danda: the Gurmukhi and Bengali blocks contain no sentence terminator, so
    # DEVANAGARI DANDA is what correct text in those scripts uses. The first
    # version of this check flagged all sixty-five of them as "Devanagari
    # character in pa", which is a fault in the check, not in the text.
    "bn": ("BENGALI", [(0x0980, 0x09FF), (0x0964, 0x0965), (0x200C, 0x200D)]),
    "ta": ("TAMIL", [(0x0B80, 0x0BFF), (0x200C, 0x200D)]),
    "te": ("TELUGU", [(0x0C00, 0x0C7F), (0x200C, 0x200D)]),
    "gu": ("GUJARATI", [(0x0A80, 0x0AFF), (0x200C, 0x200D)]),
    "kn": ("KANNADA", [(0x0C80, 0x0CFF), (0x200C, 0x200D)]),
    "ml": ("MALAYALAM", [(0x0D00, 0x0D7F), (0x200C, 0x200D)]),
    "pa": ("PUNJABI", [(0x0A00, 0x0A7F), (0x0964, 0x0965), (0x200C, 0x200D)]),
    "ur": ("URDU", [(0x0600, 0x06FF), (0x0750, 0x077F), (0x200C, 0x200D)]),
    "ar": ("ARABIC", [(0x0600, 0x06FF), (0x0750, 0x077F), (0x200C, 0x200D)]),
    "es": ("SPANISH", [(0x0020, 0x024F), (0x200C, 0x200D)]),
}

# Script names, for the message.
NAMES = [
    (0x0900, 0x097F, "Devanagari"),
    (0x0980, 0x09FF, "Bengali"),
    (0x0A00, 0x0A7F, "Gurmukhi"),
    (0x0A80, 0x0AFF, "Gujarati"),
    (0x0B80, 0x0BFF, "Tamil"),
    (0x0C00, 0x0C7F, "Telugu"),
    (0x0C80, 0x0CFF, "Kannada"),
    (0x0D00, 0x0D7F, "Malayalam"),
    (0x0600, 0x06FF, "Arabic"),
    (0x4E00, 0x9FFF, "CJK"),
    (0x3040, 0x30FF, "Japanese kana"),
]

ENTRY = re.compile(r"^\s*([a-z]{2}):\s*\{", re.M)


def script_of(char: str) -> str:
    point = ord(char)
    for low, high, name in NAMES:
        if low <= point <= high:
            return name
    return ""


def check_value(code: str, key: str, value: str) -> list[str]:
    allowed = SCRIPTS[code][1]
    problems = []

    # Braces are checked as pairs, not as characters. `article.count` is
    # legitimately '{count} लेख' and `reviews.averageOutOf` is '{value} / {total}'
    # — a translation that drops the placeholder loses the number it was meant to
    # carry, so braces have to be allowed. What must not survive is an unpaired
    # brace, which renders to the visitor as a literal curly bracket. The first
    # version flagged every brace and reported 135 problems, of which all were
    # working placeholders.
    stripped = re.sub(r"\{[A-Za-z0-9_.]+\}", "", value)
    for brace in stripped:
        if brace in "{}":
            problems.append(f"{key}: unpaired '{brace}' — a placeholder was broken, not left whole")

    for char in value:
        # U+FFFD REPLACEMENT CHARACTER is what a decoder leaves behind when it
        # cannot read a byte. It belongs to no script, so the range test below
        # waves it through — it is neither inside the expected range nor outside
        # it in any way this check noticed. To a visitor it renders as a black
        # diamond in the middle of a word.
        #
        # It has got through twice: a Malayalam "എന്തോ" written "എ��്തോ", and a
        # Gujarati "કમરમાં દુખાવો" written "�મરમાં દુખાવો". Both times the rest of
        # the word was intact, so both times every other check passed it.
        if char == "�":
            problems.append(f"{key}: U+FFFD replacement character — a byte here did not decode")
            continue

        for low, high in allowed:
            if low <= ord(char) <= high:
                break
        else:
            # Latin, digits and punctuation are fine anywhere; only a script that
            # belongs to *another* language is a fault.
            if ord(char) < 0x0250:
                continue
            name = script_of(char)
            if name:
                problems.append(f"{key}: {name} character {char!r} in {code}")

    return problems


def check_i18n() -> int:
    source = io.open("src/content/i18n.ts", encoding="utf-8").read()
    mapping_at = source.index("const TABLES")
    mapping = dict(re.findall(r"^\s*([a-z]{2}):\s*([A-Z]+),", source[mapping_at:source.index("};", mapping_at)], re.M))

    if not mapping:
        raise SystemExit(
            "Could not read the TABLES record in i18n.ts, so nothing can be"
            " checked. The code-to-table mapping has changed shape."
        )

    total = 0
    for code, (table, _) in SCRIPTS.items():
        name = mapping.get(code)
        if not name:
            continue

        start = re.search(r"const " + name + r"[^=]*=\s*\{", source)
        body = source[start.end():source.index("\n};", start.end())]

        for key, value in re.findall(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", body):
            found = check_value(code, key, value.replace("\\'", "'").replace("\\\\", "\\"))
            total += len(found)
            for problem in found[:6]:
                print(f"  {name:<10} {problem}")

    return total


def check_script_file(path: str) -> int:
    source = io.open(path, encoding="utf-8").read()

    # Each language's block in the T dictionary.
    blocks = re.findall(r"^\s{4}\"([a-z]{2})\": \{(.*?)^\s{4}\},", source, re.S | re.M)
    if not blocks:
        print(f"  could not find any language blocks in {path}")
        return 1

    total = 0
    for code, block in blocks:
        if code not in SCRIPTS:
            print(f"  {code}: no expected script recorded — add it to SCRIPTS")
            total += 1
            continue

        for key, value in re.findall(r"\"([^\"]+)\":\s*\"((?:[^\"\\]|\\.)*)\"", block):
            found = check_value(code, key, value.replace('\\"', '"').replace("\\\\", "\\"))
            total += len(found)
            for problem in found[:6]:
                print(f"  {code:<4} {problem}")

    return total


def main() -> int:
    if len(sys.argv) > 1:
        print(f"Checking {sys.argv[1]} before it is run\n")
        total = check_script_file(sys.argv[1])
    else:
        print("Checking i18n.ts\n")
        total = check_i18n()

    print()
    if total:
        print(f"{total} problem(s). A character from the wrong script renders as")
        print("nonsense to a reader, and it is invisible in a long diff.")
        return 1

    print("No wrong-script characters.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())