import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

# The key on the keyboard is labelled Enter in Latin, but a hint written in
# Devanagari or Bengali is not improved by dropping an English word into the
# middle of it — the owner read the Marathi page, saw "Enter दाबूनही पाठवता
# येईल", and took the page for unfinished. It is written out in the script of
# each language instead, which is how the word is said when it is read aloud,
# and a reader who needs to know the key still recognises it.
#
# Spanish already did this ("Intro"), which is why it was the only table of the
# thirteen that never had the problem.

VALUES = [
    "एंटर दबाकर भी भेज सकते हैं।",
    "You can also press Enter to send.",
    "এন্টার চাপলেও পাঠানো যাবে।",
    "என்டர் அழுத்தினாலும் அனுப்பலாம்.",
    "ఎంటర్ నొక్కి పంపవచ్చు.",
    "एंटर दाबूनही पाठवता येईल.",
    "એન્ટર દબાવીને પણ મોકલી શકાય.",
    "ಎಂಟರ್ ಒತ್ತಿದರೂ ಕಳುಹಿಸಬಹುದು.",
    "എന്റർ അമർത്തിയാലും അയയ്ക്കാം.",
    "ਐਂਟਰ ਦਬਾ ਕੇ ਵੀ ਭੇਜ ਸਕਦੇ ਹੋ।",
    "اینٹر دبائ کر بھی بھیج سکتے ہیں۔",
    "يمكنك الضغط على Enter للإرسال.",
    "También puede pulsar Intro para enviar.",
]


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


pattern = re.compile(r"'ask\.help':\s*'[^']*'")
found = pattern.findall(text)

if len(found) != len(VALUES):
    raise SystemExit(f"found {len(found)} values, expected {len(VALUES)}")

it = iter(VALUES)
text = pattern.sub(lambda m: "'ask.help': '%s'" % escape(next(it)), text)

io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

print()
print("ask.help rewritten in %d languages" % len(VALUES))
print()

# Confirm no non-Latin table still carries the Latin key name.
checks = re.findall(r"'ask\.help':\s*'([^']*)'", text)
latin = [c for c in checks if "Enter" in c]
print("  still carrying the Latin word:", latin)
print()