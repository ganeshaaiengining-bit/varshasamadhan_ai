import io, os, re, sys

sys.stdout.reconfigure(encoding="utf-8")

for p in ["src/server/categories.ts", "src/content/categories.ts", "src/server/article-labels.ts"]:
    if os.path.exists(p):
        s = io.open(p, encoding="utf-8").read()
        print("=====", p, "lines", s.count("\n"))
        print(s[:2400])

print("===== i18n keys carrying धार्मिक =====")
t = io.open("src/content/i18n.ts", encoding="utf-8").read()
for m in re.finditer(r"'([^']*)':\s*'([^']*धार्मिक[^']*)'", t):
    print(m.group(0)[:150])

print("===== where is category name rendered? =====")
for root, dirs, files in os.walk("src"):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".next")]
    for f in files:
        if f.endswith((".ts", ".tsx")):
            p = os.path.join(root, f)
            s = io.open(p, encoding="utf-8").read()
            for i, line in enumerate(s.split("\n"), 1):
                if re.search(r"\bcategory\.(name|blurb|description|tagline)\b", line):
                    print("%s:%d: %s" % (p, i, line.strip()[:120]))
