import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

if "'ask.signInFirst'" in text:
    print("already added")
    raise SystemExit(0)

LANGS = 13

# What the box shows if it is somehow reached without a session. It normally is
# not: the gate renders instead of it, and the route refuses before anything is
# sent. This exists so that the one remaining path out of step two lands on a
# sentence rather than on a raw key.
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

if len(VALUES) != LANGS:
    raise SystemExit("wrong number of values")

ENTRIES = "\n".join(
    "  'ask.signInFirst': '%s'," % v.replace("\\", "\\\\").replace("'", "\\'")
    for v in VALUES
)


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


out = []
cursor = 0
count = 0

while count < LANGS:
    at = text.find("'lib.legal'", cursor)
    if at < 0:
        out.append(text[cursor:])
        break

    end = text.find("\n", at)
    end = len(text) if end < 0 else end + 1

    out.append(text[cursor:end])

    lines = []
    for value in VALUES:
        lines.append("  'ask.signInFirst': '%s'," % escape(value))
    out.append("\n".join(lines) + "\n")

    cursor = end
    count += 1

out.append(text[cursor:])

if count != LANGS:
    raise SystemExit(f"found {count} tables, expected {LANGS}")

io.open(PATH, "w", encoding="utf-8", newline="\n").write("".join(out))

print()
print("ask.signInFirst added to %d tables" % count)