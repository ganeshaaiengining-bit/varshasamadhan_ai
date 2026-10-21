import io
import json
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "https://varsha-samadhan.vercel.app"
SLUGS = [
    "dhyan-aur-yoog",
    "gharelu-marammat",
    "bachchon-ki-padhai",
    "budharge-seva",
    "shishu-dekhbhal",
    "dharmik-upay",
    "aapatkalen-gayide",
    "mahamari-suraksha",
]


def fetch(path):
    req = urllib.request.Request(
        BASE + path, headers={"cookie": "vs-lang=hi", "User-Agent": "seed-capture/1.0"}
    )
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")


def text_of(html):
    html = re.sub(r"<(script|style|svg)[\s\S]*?</\1>", " ", html)
    html = re.sub(r"<[^>]*>", "\n", html)
    return re.sub(r"\n{2,}", "\n", html).strip()


result = {}
for slug in SLUGS:
    html = fetch("/p/" + slug)
    lines = [l.strip() for l in text_of(html).split("\n") if l.strip()]
    # The category title and subtitle sit between the breadcrumb and the ask box.
    result[slug] = lines[:14]
    print("=====", slug)
    for line in lines[:12]:
        print("   ", line[:100])

    for article in sorted(set(re.findall(r'href="/p/%s/([^"]+)"' % slug, html))):
        page = fetch("/p/%s/%s" % (slug, article))
        alines = [l.strip() for l in text_of(page).split("\n") if l.strip()]
        result["%s/%s" % (slug, article)] = alines[:8]
        print("   --- article:", article)
        for line in alines[:6]:
            print("       ", line[:100])

io.open("scripts/_seeds.json", "w", encoding="utf-8").write(
    json.dumps(result, ensure_ascii=False, indent=1)
)
print("\nwrote scripts/_seeds.json")
