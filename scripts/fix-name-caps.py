import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Write the name as VARSHA, in Latin capitals, everywhere it is the site name.

The owner asked for it four times in three languages and was answered with a
translation each time. VARSHA is a name. It is not a word and it has no
meaning in Hindi, Marathi or any other language here, so there is nothing to
translate. The previous change put it in title case; this puts it in capitals,
which is how the owner writes it.

The only thing this touches is the site name. The tribute in Marathi and the
photo description are her own words about her and are left exactly as written.
"""

NAME = "Varsha Samadhan AI"
WANTED = "VARSHA SAMADHAN AI"

# Every spelling the previous passes left behind, including the very first one.
VARIANTS = [
    ("वर्षा समाधान AI", WANTED),
    ("Varsha Samadhan AI", WANTED),
    ("वर्षा समाधान", "VARSHA SAMADHAN"),
]

changed = {}

for dirpath, dirnames, filenames in os.walk("src"):
    dirnames[:] = [d for d in dirnames if d != "node_modules"]
    for name in filenames:
        if not name.endswith((".ts", ".tsx")):
            continue
        path = os.path.join(dirpath, name)

        text = io.open(path, encoding="utf-8").read()
        original = text

        for old, new in VARIANTS:
            text = text.replace(old, new)

        # The bare Devanagari name, where it stands alone as the site name.
        text = re.sub(r"(?<![\u0900-\u097F])वर् षा(?![\u0900-\u097F])", WANTED, text)
        text = re.sub(r"(?<![\u0900-\u097F])वर्षा समाधान(?![\u0900-\u097F])", "VARSHA SAMADHAN", text)

        if text != original:
            io.open(path, "w", encoding="utf-8", newline="\n").write(text)
            changed[path] = sum(1 for a, b in zip(original.split("\n"), text.split("\n")) if a != b)

print()
print("Site name is now VARSHA, in capitals, Latin.")
print("=" * 50)
for path in sorted(changed):
    print("  %-40s %d line(s)" % (path, changed[path]))
print()
print("  files changed: %d" % len(changed))
print()