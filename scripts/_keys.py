import io, re, sys

sys.stdout.reconfigure(encoding="utf-8")

t = io.open("src/content/i18n.ts", encoding="utf-8").read()

# Find the key whose Hindi value is the age label
m = re.search(r"'([A-Za-z0-9._-]+)':\s*'उम्र \(साल\)'", t)
age_key = m.group(1) if m else None
print("age label key:", age_key)

tables = {}
current = None
for line in t.split("\n"):
    m2 = re.match(r"^const (\w+)", line)
    if m2:
        current = m2.group(1)
        tables.setdefault(current, {})
    m3 = re.match(r"\s*'?([A-Za-z0-9._-]+)'?:\s*'([^']*)',?\s*$", line)
    if m3 and current:
        tables[current][m3.group(1)] = m3.group(2)

name_to_code = {
    "HINDI": "hi", "ENGLISH": "en", "BENGALI": "bn", "TAMIL": "ta", "TELUGU": "te",
    "MARATHI": "mr", "GUJARATI": "gu", "KANNADA": "kn", "MALAYALAM": "ml",
    "PUNJABI": "pa", "URDU": "ur", "ARABIC": "ar", "SPANISH": "es",
}

for key in ["health.heading", "article.medicalTitle", age_key]:
    print("\n--- %s ---" % key)
    for table, code in name_to_code.items():
        print("  %-3s %s" % (code, tables.get(table, {}).get(key, "(MISSING)")))
