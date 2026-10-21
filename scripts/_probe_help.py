import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

url = "https://varsha-samadhan.vercel.app/sahayata"
request = urllib.request.Request(
    url, headers={"Cookie": "vs-lang=ta", "User-Agent": "check/1.0"}
)
html = urllib.request.urlopen(request, timeout=60).read().decode("utf-8", "replace")

needle = "The health box is a client component"
at = html.find(needle)
print("found in raw html at:", at)
if at > 0:
    print("---- 300 chars before ----")
    print(html[max(0, at - 300):at])
    print("---- 120 chars after ----")
    print(html[at:at + 120])

# Is it inside a <script>? Count script tags before it.
print("script opens before it:", html[:at].count("<script"))
print("script closes before it:", html[:at].count("</script>"))
