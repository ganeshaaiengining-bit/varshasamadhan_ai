import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

s = io.open("src/content/i18n.ts", encoding="utf-8").read()
lines = s.split("\n")

bad = [l for l in lines if "\\" + "'" in l]
print("lines containing a backslash-quote:", len(bad))

print("home.metaTitle occurrences:", s.count("'home.metaTitle':"))
print("voice.noVoice occurrences:", s.count("'voice.noVoice':"))

# Every i18n entry line must have an even number of single quotes.
odd = []
for i, line in enumerate(lines, 1):
    if not line.lstrip().startswith("'"):
        continue
    if line.count("'") % 2 != 0:
        odd.append((i, line.strip()))
print("entry lines with an odd quote count:", len(odd))
for i, line in odd[:6]:
    print("   line", i, line[:110])

# Which keys does each table hold for the categories?
cats = sorted(set(re.findall(r"'(cat\.[a-z-]+\.(?:title|subtitle))':", s)))
print("category keys in file:", len(cats))
arts = sorted(set(re.findall(r"'(art\.[a-z-]+\.(?:title|summary))':", s)))
print("article keys in file:", len(arts))
