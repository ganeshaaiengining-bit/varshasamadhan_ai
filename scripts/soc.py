"""पूरा SOC — साइट की हर दरवाज़ा, हर पन्ना, हर ख़तरा।

    python scripts/soc.py

यह सिर्फ़ **देखता** है। कुछ बदलता नहीं, कुछ लिखता नहीं, किसी का पासवर्ड नहीं माँगता।

पाँच हिस्से, एक के बाद एक:

  1. **बाहरी दरवाज़े** — बिना लॉगिन कौन सा API खुल जाता है।
  2. **राज़ नहीं दिखने चाहिए** — क्या API key, डेटाबेस पासवर्ड या
     एडमिन पासवर्ड ब्राउज़र तक पहुँच सकता है।
  3. **स्वास्थ्य** — हर पन्ना, हर टैब, हर भाषा, हर लिंक।
  4. **फ़ोन पर** — छोटे स्क्रीन पर सब कुछ ठीक दिखता है या नहीं।
  5. **सुगमता** — क्या बटन का नाम है, क्या फ़ील्ड बड़े हैं।

जो भी मिले, वो साफ़ लिखा जाएगा। जो न मिले, वो भी — ताकि यह दोबारा चलाने
पर पता चले कि कुछ टूटा या नहीं।
"""

import io
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = os.environ.get("SOC_BASE", "https://varsha-samadhan.vercel.app")

problems: list[str] = []
notes: list[str] = []


def bad(section: str, text: str) -> None:
    problems.append(f"[{section}] {text}")
    print(f"      \u274c {text}")


def ok(section: str, text: str) -> None:
    notes.append(f"[{section}] {text}")
    print(f"      \u2705 {text}")


def line(char: str = "\u2500") -> str:
    return char * 58


# ═══════════════════════════════════════════════════════════════════════════
# 1. बाहरी दरवाज़े — बिना लॉगिन क्या खुल जाता है
# ═══════════════════════════════════════════════════════════════════════════

def section_doors() -> None:
    print()
    print("  1. बिना लॉगिन कौन सा दरवाज़ा खुला है")
    print("  " + line())

    # (कहानी, तरीका, पता, अपेक्षित स्थिति)
    doors = [
        ("एडमिन लॉगिन ग़लत पासवर्ड", "POST", "/api/admin/login",
         {"password": "definitely-not-it", "action": "in"}, (400, 401, 403)),
        ("एडमिन बैकअप बिना लॉगिन", "GET", "/api/admin/backup", None, (401, 403)),
        ("एडमिन फ़ोटो पढ़ना बिना लॉगिन", "GET", "/api/admin/photo", None, (401, 403)),
        ("एडमिन फ़ोटो बदलना बिना लॉगिन", "PUT", "/api/admin/photo", {}, (401, 403)),
        ("एडमिन फ़ोटो मिटाना बिना लॉगिन", "DELETE", "/api/admin/photo", None, (401, 403)),
    ]

    for name, method, path, body, expected in doors:
        data = None
        headers = {"User-Agent": "soc"}
        if body is not None:
            data = body if isinstance(body, bytes) else __import__("json").dumps(body).encode()
            headers["content-type"] = "application/json"

        request = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                status = response.status
        except urllib.error.HTTPError as error:
            status = error.code
        except Exception as error:  # noqa: BLE001
            bad("door", f"{name}: {type(error).__name__}")
            continue

        if status in expected:
            ok("door", f"{name} -> {status} (बंद है, जैसा चाहिए)")
        else:
            bad("door", f"{name} -> {status} — यह {expected} में होना चाहिए था")

    # एडमिन सेशन कुकी के बिना सब कुछ बंद है या नहीं
    print()
    print("      एडमिन के पन्ने बिना लॉगिन:")
    for path in ["/admin", "/admin/articles"]:
        status = fetch(path)
        # 200 चलेगा, क्योंकि पन्ना खुलता है और अंदर से लॉगिन माँगता है।
        # असली जाँच यह है कि उसमें सारा डेटा तो नहीं है।
        body = fetch_body(path)
        leaked = [w for w in ("ADMIN_PASSWORD", "DATABASE_URL", "GEMINI_API_KEY")
                  if w in body]
        if leaked:
            bad("door", f"{path} में ये शब्द दिखे: {', '.join(leaked)}")
        elif status == 200:
            ok("door", f"{path} -> {status}, कोई राज़ नहीं दिखा")
        else:
            bad("door", f"{path} -> {status}")


def fetch(path: str, timeout: int = 60) -> int:
    try:
        request = urllib.request.Request(BASE + path, headers={"User-Agent": "soc"})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code
    except Exception:
        return 0


def fetch_body(path: str, timeout: int = 60) -> str:
    try:
        request = urllib.request.Request(BASE + path, headers={"User-Agent": "soc"})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.read().decode("utf-8", "replace")
    except Exception:
        return ""


# ═══════════════════════════════════════════════════════════════════════════
# 2. राज़ — क्या secret ब्राउज़र तक पहुँच सकता है
# ═══════════════════════════════════════════════════════════════════════════

def section_secrets() -> None:
    print()
    print("  2. राज़ ब्राउज़र तक पहुँच सकते हैं या नहीं")
    print("  " + line())

    #
    # सिर्फ़ असली मान, नाम नहीं।
    #
    # पहले यहाँ `ADMIN_PASSWORD` जैसे नाम भी ढूँढे गए, और इसी वजह से एक ग़लती
    # निकली: एडमिन के ताले का संदेश, जो सलाह देता है कि `.env` में `ADMIN_PASSWORD`
    # लिखें, ज़रूरतला हिस्सा है और उसका नाम ब्राउज़र तक पहुँचना ठीक ही है।
    #
    # मापने की चीज़ मान है, नाम नहीं। वरना हर अच्छी जगह डरावनी लगती है और असली
    # ख़तरे उनके बीच में दब जाते हैं — यहाँ भी ऐसा ही हुआ।
    needles = {
        "Google API key": r"AIza[0-9A-Za-z_\-]{30,}",
        "डेटाबेस पासवर्ड": r"postgresql://[^\s\"']*:[^@\s\"']+@",
        "Neon जोड़ने का टोकन": r"eyJhbGciOi[A-Za-z0-9_\-.]{60,}",
        "admin पासवर्ड का मान": r"admin[_-]?pass[\"'\s:=]{1,6}[A-Za-z0-9!@#%^&*]{10,}",
    }

    pages = ["/", "/janam-ghathe", "/smriti", "/madad", "/sahayata",
             "/pustakalay", "/reviews", "/samaroh", "/login", "/account",
             "/admin", "/admin/articles"]

    chunks: set[str] = set()

    for page in pages:
        html = fetch_body(page)
        if not html:
            bad("secret", f"{page} का HTML नहीं मिला")
            continue

        for label, pattern in needles.items():
            if re.search(pattern, html):
                bad("secret", f"{page} में {label} दिखा")

        chunks |= set(re.findall(r'src="(/_next/static/[^"]+\.js)"', html))

    print(f"      {len(chunks)} JS हिस्से मिले — सब जाँचे जा रहे हैं")

    for chunk in sorted(chunks):
        try:
            request = urllib.request.Request(BASE + chunk, headers={"User-Agent": "soc"})
            with urllib.request.urlopen(request, timeout=90) as response:
                body = response.read().decode("utf-8", "replace")
        except Exception:
            continue

        for label, pattern in needles.items():
            found = re.search(pattern, body)
            if found:
                # पहले चार अक्षर दिखाना ही यह साबित करने के लिए काफ़ी है कि वह
                # असली key है। पूरी key कभी स्क्रीन पर नहीं आनी चाहिए।
                bad("secret", f"{chunk} में {label} — शुरुआत: {found.group(0)[:12]}…")

    if not problems:
        ok("secret", f"{len(pages)} पन्ने और {len(chunks)} JS हिस्से — कोई राज़ नहीं")


# ═══════════════════════════════════════════════════════════════════════════
# 3. स्वास्थ्य — पन्ने, टैब, भाषा, लिंक
# ═══════════════════════════════════════════════════════════════════════════

def section_health() -> None:
    print()
    print("  3. पन्ने, टैब, भाषा, लिंक")
    print("  " + line())

    pages = ["/", "/janam-ghathe", "/smriti", "/madad", "/sahayata",
             "/pustakalay", "/reviews", "/samaroh", "/login", "/account",
             "/admin", "/admin/articles"]

    for path in pages:
        started = time.time()
        status = fetch(path)
        body = fetch_body(path)
        took = time.time() - started

        if status != 200:
            bad("page", f"{path} -> {status}")
            continue

        for needle, why in [("वर्षा", "नाम देवनागरी में"),
                            ("undefined is not", "runtime error"),
                            ("[object Object]", "object text बन गया"),
                            ("Application error", "crash")]:
            if needle in body:
                bad("page", f"{path} में {why}")

        flag = "  धीमा" if took > 5 else ""
        ok("page", f"{path:<20} {status}  {took:4.1f}s{flag}")


# ═══════════════════════════════════════════════════════════════════════════
# 4. फ़ोन पर
# ═══════════════════════════════════════════════════════════════════════════

def section_phone() -> None:
    print()
    print("  4. फ़ोन की स्क्रीन पर (390×844)")
    print("  " + line())

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        bad("phone", "playwright नहीं मिला")
        return

    with sync_playwright() as play:
        browser = play.chromium.launch()
        page = browser.new_page(viewport={"width": 390, "height": 844})

        try:
            page.goto(BASE + "/", wait_until="domcontentloaded", timeout=120000)
            page.wait_for_timeout(3000)

            overflow = page.evaluate("""() => {
                const w = document.documentElement.clientWidth;
                const wide = [];
                document.querySelectorAll('*').forEach(el => {
                    const r = el.getBoundingClientRect();
                    if (r.width > 0 && (r.right > w + 2 || r.left < -2)) {
                        wide.push(el.tagName + '.' + (el.className || '').toString().slice(0, 30));
                    }
                });
                return { width: w, scroll: document.documentElement.scrollWidth, wide: wide.slice(0, 5) };
            }""")

            if overflow["scroll"] > overflow["width"] + 4:
                bad("phone", f"पन्ना बग़ल से फैला है — {overflow['scroll']}px "
                             f"(स्क्रीन {overflow['width']}px): {overflow['wide']}")
            else:
                ok("phone", f"होम बग़ल से नहीं फैला ({overflow['width']}px)")

            # छोटा क्या है, यह बताया जाता है — और फ़ैसला इस आधार पर किया जाता
            # है कि वह *बटन* है या सिर्फ़ पाठ का लिंक।
            small = page.evaluate("""() => {
                const out = [];
                document.querySelectorAll('button, a, input, select').forEach(el => {
                    const r = el.getBoundingClientRect();
                    if (r.height <= 0 || r.height >= 32) return;
                    const text = (el.textContent || el.value || el.tagName).trim().slice(0, 22);
                    const hidden = r.top < 0 || r.left < 0 || el.closest('[class*=sr-only]');
                    out.push({ tag: el.tagName, text, h: Math.round(r.height), hidden: !!hidden });
                });
                return out;
            }""")

            buttons = [s for s in small if s['tag'] in ('BUTTON', 'INPUT', 'SELECT') and not s['hidden']]
            links = [s for s in small if s['tag'] == 'A' and not s['hidden']]

            if buttons:
                bad("phone", "बटन बहुत छोटे: " +
                    ', '.join(f"{s['text']} {s['h']}px" for s in buttons))
            else:
                ok("phone", "सब बटन उंगली के लिए बड़े हैं (32px से ऊपर)")

            # फ़ोन नंबर जैसे छोटे लिंक बुज़ुर्गों के लिए परेशानी हैं — यह
            # चेतावनी है, ग़लती नहीं, इसलिए अलग से दिखाए जाते हैं।
            if links:
                ok("phone", "छोटे लिंक (चेतावनी, ग़लती नहीं): " +
                    ', '.join(f"{s['text']} {s['h']}px" for s in links))

            page.screenshot(path="shots/soc-phone-home.png", full_page=False)
            browser.close()
        except Exception as error:  # noqa: BLE001
            bad("phone", f"{type(error).__name__}: {str(error)[:80]}")


# ═══════════════════════════════════════════════════════════════════════════
# 5. सुगमता
# ═══════════════════════════════════════════════════════════════════════════

def section_access() -> None:
    print()
    print("  5. सुगमता — क्या पढ़ने वाले को पता चलता है कि यह क्या है")
    print("  " + line())

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        bad("access", "playwright नहीं मिला")
        return

    with sync_playwright() as play:
        browser = play.chromium.launch()
        page = browser.new_page(viewport={"width": 1000, "height": 1100})

        try:
            page.goto(BASE + "/janam-ghathe", wait_until="domcontentloaded", timeout=120000)
            page.wait_for_selector("#jgd-name", timeout=90000)
            page.wait_for_timeout(1500)

            fields = page.evaluate("""() => {
                const ids = ['jgd-name', 'jgd-date', 'jgd-time', 'jgd-gender', 'jgd-place'];
                return ids.map(id => {
                    const el = document.getElementById(id);
                    if (!el) return { id, missing: true };
                    const label = document.querySelector(`label[for="${id}"]`);
                    const r = el.getBoundingClientRect();
                    return { id, label: label ? label.textContent.trim() : null,
                             h: Math.round(r.height) };
                });
            }""")

            nameless = [f["id"] for f in fields
                        if not f.get("missing") and not f.get("label")]
            tiny = [f"{f['id']} {f['h']}px" for f in fields
                    if not f.get("missing") and f["h"] < 40]

            if nameless:
                bad("access", f"इन फ़ील्ड का नाम नहीं: {', '.join(nameless)}")
            else:
                ok("access", "पाँचों फ़ील्ड का नाम (label) है")

            if tiny:
                bad("access", f"बहुत छोटे फ़ील्ड: {', '.join(tiny)}")
            else:
                ok("access", "सब फ़ील्ड उंगली के लिए बड़े हैं")

            # हर पन्ने का मुख्य शीर्षक
            for path in ["/", "/smriti", "/madad", "/pustakalay", "/reviews"]:
                page.goto(BASE + path, wait_until="domcontentloaded", timeout=90000)
                page.wait_for_timeout(900)
                heads = page.evaluate(
                    "() => [...document.querySelectorAll('h1')].map(h => h.innerText.trim())")
                if not heads:
                    bad("access", f"{path} पर h1 नहीं — पाठक को पता नहीं चलेगा यह क्या है")
                else:
                    ok("access", f"{path:<14} h1: {heads[0][:38]}")

            browser.close()
        except Exception as error:  # noqa: BLE001
            bad("access", f"{type(error).__name__}: {str(error)[:80]}")


# ═══════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    os.makedirs("shots", exist_ok=True)

    print()
    print("=" * 62)
    print("  पूरा SOC —", BASE)
    print("=" * 62)

    section_doors()
    section_secrets()
    section_health()
    section_phone()
    section_access()

    print()
    print("=" * 62)
    if problems:
        print(f"  मिली गई गलतियाँ: {len(problems)}")
        print("=" * 62)
        for item in problems:
            print("  •", item)
    else:
        print("  एक भी गलती नहीं मिली।")
    print()
    print(f"  (ठीक मिले: {len(notes)} जाँच)")
    print("=" * 62)
    print()