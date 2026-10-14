import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Put the sign-in gate in front of every question box.

Five places render an AskBox and a check written five times is a check that will
be missed once, so all five go through one server wrapper instead. AskBox itself
is not modified at all: it stays exactly as it was, and the gate sits around it.
"""

PAGES = [
    "src/app/sahayata/page.tsx",
    "src/app/page.tsx",
    "src/app/p/[slug]/page.tsx",
    "src/components/health/health-box.tsx",
]

IMPORT_OLD = "import { AskBox } from '@/components/ask/ask-box';"
IMPORT_NEW = "import { AskBoxGate } from '@/components/ask/sign-in-wall';"

total = 0

for path in PAGES:
    text = io.open(path, encoding="utf-8").read()

    if IMPORT_OLD not in text:
        print("  %s: import not found, skipped" % path)
        continue

    text = text.replace(IMPORT_OLD, IMPORT_NEW, 1)

    # Every use site becomes the gate. Props are unchanged, so no call site has
    # to be rewritten.
    count = text.count("<AskBox")
    text = text.replace("<AskBox", "<AskBoxGate")

    io.open(path, "w", encoding="utf-8", newline="\n").write(text)
    total += count
    print("  %-40s %d box(es)" % (path, count))

print()
print("  %d question box(es) now behind sign-in" % total)
print()