"""
Fix eight values in src/content/i18n.ts that carry the wrong script.

    python scripts/fix-wrong-script-values.py

Found by scripts/check-scripts.py, which exists because these are invisible in a
diff of several hundred lines. A visitor reading any of these pages sees a few
words from a language they cannot read, in the middle of one they can.

  bn dhun.unsupported       "ব্রাউজ़ার" — a Devanagari nukta on a Bengali consonant.
                            Bengali spells it ব্রাউজার.
  bn help.q2.question       "সুधारू" — Hindi for "how do I improve it", left in a
                            Bengali sentence by the home/help batch.
  gu voice.audioCapture     "ઉપકરણ" — Devanagari ra in a Gujarati word.
  gu lib.legal              Devanagari na and vowel sign in a Gujarati sentence.
  ml health.intro           a Kannada la in "അമർത്തിയാല്".
  ml lib.group.padhai.note  "विद्याभ्यास सामग्री" — Hindi, in a Malayalam string.
                            The whole clause was never translated.
  ml help.howBody           Tamil characters in a Malayalam sentence, also left
                            by the home/help batch.
  ur voice.speakFailed      "سنायا" — Devanagari na for Urdu ن.
  ar ref.helpline4          "مسنالظلم" — a space missing, and with it the
                            preposition ل, so two words ran together.

Each value is replaced whole rather than patched character by character. The
first two of these were corruption inside an otherwise good sentence and could
have been repaired in place, but three of them are clauses that were never
translated at all, and a partial repair would have hidden that.

The script refuses to run if a key it is meant to fix is no longer in the file,
so it cannot quietly do nothing after the file has moved on.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

FIXES = {
    ("BENGALI", "dhun.unsupported"): "এই ব্রাউজার ধ্বনি বাজাতে পারে না।",
    ("BENGALI", "help.q2.question"): "আমার ছেলের পড়াশোনায় খুব দুর্বলতা আছে। বাড়িতে কীভাবে সুধারাব?",
    ("GUJARATI", "voice.audioCapture"): "માઇક મળ્યો નહીં. ઉપકરણ જોડો, અથવા લખીને પૂછો.",
    ("GUJARATI", "lib.legal"): "અહીં જે આપ્યું છે તે સંપૂર્ણ મફત છે અને તમે તે આગળ શેર કરી શકો. જે પુસ્તક હજી કોપીરાઇટમાં છે તે અહીં નથી — તેને કોપી કરવાની પરવાનગી નથી, તે સ્પષ્ટ કહેવું જ યોગ્ય છે.",
    ("MALAYALAM", "health.intro"): "ഈ പ്രായത്തിലുള്ളവർ ഏറ്റവും കൂടുതൽ ചോദിക്കുന്ന ചോദ്യങ്ങൾ. ഏതെങ്കിലും അമർത്തിയാൽ അത് താഴെയുള്ള ബോക്സിൽ നിറയും, ശേഷം ചോദിക്കൂ.",
    ("MALAYALAM", "lib.group.padhai.note"): "സ്കൂൾ, കോളേജ്, സർക്കാർ വിദ്യാഭ്യാസ സാമഗ്രികൾ",
    ("MALAYALAM", "help.howBody"): "ഓരോ ചോദ്യവും രേഖപ്പെടുത്തുകയും അതിന്റെ ഉത്തരം ഉടൻ ലഭിക്കുന്നു. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും എവിടെയും എടുക്കപ്പെട്ടില്ല. എല്ലാം സൗജന്യമാണ്.",
    ("URDU", "voice.speakFailed"): "یہ جواب پڑھ کر سنایا نہیں جا سکا۔",
    ("ARABIC", "ref.helpline4"): "إن تعرض طفل أو مسن للظلم، يمكن تقديم شكوى على 1098.",
}


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()

    for (table, key), value in sorted(FIXES.items()):
        start = re.search(r"const " + table + r"[^=]*=\s*\{", source)
        if not start:
            print(f"table {table} not found — stopping")
            return 1
        end = source.index("\n};", start.end())
        body = source[start.end():end]

        pattern = re.compile(r"( *)'" + re.escape(key) + r"':\s*'(?:[^'\\]|\\.)*',")
        matches = pattern.findall(body)
        if len(matches) != 1:
            print(f"{table}.{key} matched {len(matches)} times — stopping")
            return 1

        line = f"{matches[0]}'{key}': '{esc(value)}',"
        body = pattern.sub(lambda m: line, body, count=1)
        source = source[: start.end()] + body + source[end:]
        print(f"  {table:<10} {key}")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)
    print(f"\n{len(FIXES)} values rewritten.")
    print("Run scripts/check-scripts.py to confirm nothing is left.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
