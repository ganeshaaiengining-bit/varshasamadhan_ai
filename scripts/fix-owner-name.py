import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Put the owner's wife's name in Latin script wherever it appears.

WHY

The owner's wife is called Varsha. The site had her in Devanagari, and in
Devanagari "varsha" is the ordinary word for rain as well as a woman's name —
the same four characters, no way to tell them apart. A visitor reads the header
as "Rain Solution AI" rather than as a person's name, and in every one of the
thirteen languages the same happens, because each one transliterates the
weather meaning as readily as the name.

The owner asked for her name to read as Varsha in every language, and that is
the only correct fix: the Devanagari spelling cannot be disambiguated, so it
stops being used for the name.

Only the name changes. Nothing else in this file is touched, and nothing else
was touched in the project: not the wording, not the tribute, not the layout.

WHAT IS LEFT ALONE, AND WHY

The Marathi tribute text, where "varsha" is a person's name in the middle of a
sentence, stays as it was written — it is her sentence, not the site header, and
Devanagari is the correct script for it. The same goes for the photo
alternative text, which describes her photograph.

So this is not a blind replacement. It is: the site name in the header, the
footer and the browser tab.
"""

# Devanagari, the name followed by "samadhan".
SITE_NAME = "वर्षा समाधान AI"
SITE_NAME_NEW = "Varsha Samadhan AI"

changed = {}

for dirpath, dirnames, filenames in os.walk("src"):
    dirnames[:] = [d for d in dirnames if d != "node_modules"]
    for name in filenames:
        if not name.endswith((".ts", ".tsx")):
            continue
        path = os.path.join(dirpath, name)

        text = io.open(path, encoding="utf-8").read()
        if SITE_NAME not in text:
            continue

        count = text.count(SITE_NAME)
        text = text.replace(SITE_NAME, SITE_NAME_NEW)
        io.open(path, "w", encoding="utf-8", newline="\n").write(text)
        changed[path] = count

print()
print("Site name changed to 'Varsha Samadhan AI'")
print("=" * 52)
for path in sorted(changed):
    print("  %-40s %d" % (path, changed[path]))
print()
print("  files: %d   occurrences: %d" % (len(changed), sum(changed.values())))
print()

# The name in the header comes from one place on each page. Confirm none is
# left in Devanagari where it reads as rain.
remaining = []
for dirpath, dirnames, filenames in os.walk("src"):
    dirnames[:] = [d for d in dirnames if d != "node_modules"]
    for name in filenames:
        if not name.endswith((".ts", ".tsx")):
            continue
        path = os.path.join(dirpath, name)
        text = io.open(path, encoding="utf-8").read()
        if SITE_NAME in text:
            remaining.append(path)

print("  still in Devanagari as the site name:", remaining if remaining else "none")