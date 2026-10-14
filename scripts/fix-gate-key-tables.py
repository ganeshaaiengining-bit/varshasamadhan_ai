import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

# Every table walked individually this time.
#
# The earlier pass searched for the anchor and inserted in a loop, but the
# search started again from the end of the previous insertion, and the anchor
# turned out to appear inside the block that had just been written. So all
# thirteen batches landed inside the first table. One key went in thirteen
# times and the other twelve tables had none, which the compiler reported as a
# duplicate property rather than as twelve missing ones.

TABLE_ORDER = [
    "HINDI", "ENGLISH", "BENGALI", "TAMIL", "TELUGU", "MARATHI",
    "GUJARATI", "KANNADA", "MALAYALAM", "PUNJABI", "URDU", "ARABIC", "SPANISH",
]

VALUES = [
    "पहले लॉग इन कीजिए, फिर सवाल पूछिए।",
    "Sign in first, then ask your question.",
    "আগে ঢুকুন, তারপর প্রশ্ন করুন।",
    "முதலில் உள்ளே செல்லுங்கள், பிறகு கேள்வி கேளுங்கள்.",
    "ముందుగా సైన్ ఇన్ చేయండి, తర్వాత ప్రశ్న అడగండి.",
    "आधी लॉगिन करा, मग प्रश्न विचारा.",
    "પહેલાં લોગઇન કરો, પછી પ્રશ્ન પૂછો.",
    "ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ, ನಂತರ ಪ್ರಶ್ನೆ ಕೇಳಿ.",
    "ആദ്യം ലോഗിൻ ചെയ്യുക, ശേഷം ചോദ്യം ചോദിക്കുക.",
    "ਪਹਿਲਾਂ ਲੌਗਇਨ ਕਰੋ, ਫਿਰ ਸਵਾਲ ਪੁੱਛੋ।",
    "پہلے لاگ اِن کریں، پھر سوال پوچھیں۔",
    "سجّل الدخول أولاً، ثم اسأل سؤالك.",
    "Inicia sesión primero y luego pregunta.",
]

ANCHOR = "'ask.signInCta'"


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


# Split once, on the table headers, and keep each chunk with its name.
spans = []
for name in TABLE_ORDER:
    match = re.search(
        r"const " + name + r": Record<string, string> = \{", text
    )
    if not match:
        raise SystemExit(f"table {name} not found")
    spans.append((name, match.start(), match.end()))

# Work from the end so earlier offsets stay valid.
for index in range(len(spans) - 1, -1, -1):
    name, start, end = spans[index]

    if index + 1 < len(spans):
        stop = spans[index + 1][1]
    else:
        stop = len(text)

    body = text[end:stop]

    # One per table. The Hindi table already has it from the earlier pass.
    if f"'ask.signInFirst'" in body:
        print("  %-12s already has it" % name)
        continue

    at = body.find(ANCHOR)
    if at < 0:
        raise SystemExit(f"anchor not found in {name}")

    # To the end of the anchor line.
    line_end = body.find("\n", at)
    line_end = len(body) if line_end < 0 else line_end + 1

    entry = "  'ask.signInFirst': '%s',\n" % escape(VALUES[index])
    body = body[:line_end] + entry + body[line_end:]

    text = text[:end] + body + text[stop:]
    print("  %-12s added" % name)

io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

print()

# Verify: exactly one per table.
text = io.open(PATH, encoding="utf-8").read()
total = len(re.findall(r"'ask\.signInFirst':", text))
print("  total occurrences: %d (expected %d)" % (total, len(TABLE_ORDER)))
for name in TABLE_ORDER:
    match = re.search(r"const " + name + r": Record<string, string> = \{", text)
    start = match.end()
    depth = 1
    i = start
    while i < len(text) and depth > 0:
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
        i += 1
    count = text[start:i].count("'ask.signInFirst'")
    print("    %-12s %s" % (name, "ok" if count == 1 else "WRONG (%d)" % count))