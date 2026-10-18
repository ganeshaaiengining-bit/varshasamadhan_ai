"""Kya har link kahin jaata hai?

    python scripts/check-links.py

Site ka menu aur footer ek dozen jagah bulate hain. Ek bhi link jo page par
hai aur page nahi hai, to ek asli galti hai — koi us par click karega aur
use seedha 404 milega, aur woh sochega ki site kharab hai.

Ye un dono cheezon ko alag-alag dhoondta hai:

  · jo link kahin **maujood** nahi hai
  · jo link kisi **database** se banti hai aur database me us shabd ki shuruaat
    hi nahi hoti — woh tabhi pata chalti hai jab database slow ho, isliye ye
    database se poochta bhi hai
"""

import glob
import io
import re
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://varsha-samadhan.vercel.app"

# ── 1. which routes exist ────────────────────────────────────────────────────

routes = set()

for path in glob.glob("src/app/**/page.tsx", recursive=True):
    route = path.replace("\\", "/").replace("src/app", "").replace("/page.tsx", "")
    route = re.sub(r"//+", "/", route)
    routes.add(route if route else "/")

print()
print("  site par maujood pages:")
for route in sorted(routes):
    print(f"    {route}")

# ── 2. every link in the source ─────────────────────────────────────────────

HREF = re.compile(r"""href\s*=\s*\{?\s*["'`]([^"'`]*)["'`]""")

links: dict[str, set[str]] = {}

for path in glob.glob("src/**/*.tsx", recursive=True):
    text = io.open(path, encoding="utf-8").read()
    for match in HREF.finditer(text):
        href = match.group(1)
        links.setdefault(href, set()).add(path.replace("\\", "/"))

# ── 3. which of them go nowhere ──────────────────────────────────────────────

def resolves(href: str) -> bool:
    base = href.split("?")[0].split("#")[0]

    if base in ("", "/"):
        return True
    if base in routes:
        return True

    # A dynamic route: /p/[slug] answers /p/anything.
    for route in routes:
        if "[" not in route:
            continue
        pattern = "^" + re.sub(r"/\[\w+\]", "/[^/]+", route) + "$"
        if re.match(pattern, base):
            return True

    return False


dead = {href: files for href, files in links.items() if not resolves(href)}

print()
if dead:
    print(f"  {len(dead)} link kahin nahi jaati:")
    for href in sorted(dead):
        print(f"    {href}")
        for f in sorted(dead[href])[:3]:
            print(f"        {f}")
else:
    print("  har link kisi page par jaati hai.")

# ── 4. and which of the surviving ones 404 in practice ───────────────────────

print()
print("  har link par khud pooch kar dekha:")

bad = 0
for href in sorted(links):
    base = href.split("?")[0].split("#")[0]
    if base in ("", "/") or not base.startswith("/"):
        continue
    if "{slug}" in base or "$" in base:
        continue

    try:
        request = urllib.request.Request(BASE + base, headers={"User-Agent": "check-links"})
        with urllib.request.urlopen(request, timeout=60) as response:
            status = response.status
    except urllib.error.HTTPError as error:
        status = error.code
    except Exception:  # noqa: BLE001
        status = 0

    if status != 200:
        bad += 1
        print(f"    {base:<24} {status}")

if bad == 0:
    print("    sab 200 de rahe hain.")

print()