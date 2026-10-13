import io
import json
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

I18N = "src/content/i18n.ts"
DATA = json.load(io.open("scripts/_lib-i18n.json", encoding="utf-8"))

text = io.open(I18N, encoding="utf-8").read()

if "lib.licence.ccBy" in text:
    print("already added")
    raise SystemExit(0)

TABLE_ORDER = [
    ("HINDI", "hi"), ("ENGLISH", "en"), ("BENGALI", "bn"), ("TAMIL", "ta"),
    ("TELUGU", "te"), ("MARATHI", "mr"), ("GUJARATI", "gu"), ("KANNADA", "kn"),
    ("MALAYALAM", "ml"), ("PUNJABI", "pa"), ("URDU", "ur"), ("ARABIC", "ar"),
    ("SPANISH", "es"),
]

for key, values in DATA.items():
    if len(values) != len(TABLE_ORDER):
        raise SystemExit(f"{key}: {len(values)} values, expected {len(TABLE_ORDER)}")


def block_for(index: int) -> str:
    lines = []
    for key, values in DATA.items():
        value = values[index].replace("\\", "\\\\").replace("'", "\\'")
        lines.append("  '%s': '%s'," % (key, value))
    return "\n".join(lines) + "\n"


# Same walk as before: insert after each table's last 'lib.*' key.
out = []
cursor = 0
count = 0

while count < len(TABLE_ORDER):
    at = text.find("'lib.legal'", cursor)
    if at < 0:
        out.append(text[cursor:])
        break

    end = text.find("\n", at)
    end = len(text) if end < 0 else end + 1

    out.append(text[cursor:end])
    out.append(block_for(count))
    cursor = end
    count += 1

out.append(text[cursor:])

if count != len(TABLE_ORDER):
    raise SystemExit(f"found {count} tables, expected {len(TABLE_ORDER)}")

io.open(I18N, "w", encoding="utf-8", newline="\n").write("".join(out))

print()
print("Added %d keys to %d tables" % (len(DATA), count))
for key in DATA:
    print("  " + key)