"""Poori website ka audit — sirf dekhna, kuch badalna nahi.

    python scripts/audit.py [base]

Ek hi dafa me teen kaam:

  1. **Har page** — HTTP status, browser console, hydration error.
  2. **Har tab, har kundali** — 6 alag janam par 9 tab, koi crash to nahi.
  3. **Har bhasha** — 13 bhasha me AI jawab, apni bhasha me.

Badla kuch nahi jaata. Ye sirf batata hai ki kahan kuch galat hai, taaki phir
awaaz se fix kiya ja sake aur ek saath do cheezein bigad na jaayein.
"""

import json
import re
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://varsha-samadhan.vercel.app"

PAGES = [
    "/", "/janam-ghathe", "/smriti", "/madad", "/sahayata", "/pustakalay",
    "/reviews", "/samaroh", "/login", "/account",
    "/admin", "/admin/articles",
]

problems = []
notes = []


def note(section, text):
    problems.append(f"{section}: {text}")


# ── 1. every page ───────────────────────────────────────────────────────────

def open_page(page, url: str, timeout: int = 120000, tries: int = 3) -> bool:
    """Open a page, and try again if the network drops the connection.

    A suspended connection is not a fault in the page being tested — it is the
    network underneath it, and it happened once in the middle of a sweep of
    fifty-four chart renders. Without the retry the audit reported a crash that
    never happened, which is the one kind of wrong answer an audit cannot give.
    """
    for attempt in range(1, tries + 1):
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=timeout)
            return True
        except Exception as error:  # noqa: BLE001
            if attempt == tries:
                note("network", f"{url}: {type(error).__name__}")
                return False
            time.sleep(3)
    return False


def audit_pages() -> None:
    print()
    print("  1. HAR PAGE")
    print("  " + "-" * 50)

    for path in PAGES:
        started = time.time()
        try:
            request = urllib.request.Request(BASE + path, headers={"User-Agent": "audit"})
            with urllib.request.urlopen(request, timeout=90) as response:
                body = response.read()
                status = response.status
                ctype = response.headers.get("Content-Type", "")
        except urllib.error.HTTPError as error:
            # A 401 or a 404 on an owner-only page is the page working.
            note("pages", f"{path} -> HTTP {error.code}")
            print(f"    {status_str(path, error.code, '', 0.0)}")
            continue
        except Exception as error:  # noqa: BLE001
            note("pages", f"{path} -> {type(error).__name__}")
            print(f"    {path:<22} FAILED {type(error).__name__}")
            continue

        text = body.decode("utf-8", "replace")
        elapsed = time.time() - started

        # Things a healthy page must never contain.
        for needle, why in [
            ("undefined is not", "runtime error printed"),
            ("NaN", "a NaN on the page"),
            ("[object Object]", "an object printed as text"),
            ("Application error", "a crash"),
            ("वर्षा", "the name written in Devanagari"),
        ]:
            if needle in text:
                note("pages", f"{path} contains {why}: {needle!r}")

        print(f"    {status_str(path, status, ctype, elapsed)}  {len(body):>7} bytes")


def status_str(path, status, ctype, elapsed):
    flag = "" if status == 200 else "  <-- "
    return f"{path:<22} {flag}{status}  {elapsed:5.1f}s  {ctype[:24]}"


# ── 2. the charts ───────────────────────────────────────────────────────────

def audit_charts() -> None:
    from playwright.sync_api import sync_playwright

    print()
    print("  2. KUNDALI — 6 janam, 9-9 tab")
    print("  " + "-" * 50)

    CASES = [
        ("Varsha", "1975-03-14", "14:30", "Nagpur"),
        ("A", "1990-01-01", "00:05", "Mumbai"),
        ("Ramesh", "2001-12-31", "23:55", "Chennai"),
        ("Sunita", "1966-06-15", "06:20", "Kolkata"),
        ("Test", "1947-08-15", "12:00", "Delhi"),
        ("Leela", "2024-02-29", "09:05", "Srinagar"),
    ]
    TABS = ["कुंडली", "पंचांग", "विमशोत्तरी दशा", "फलादेश", "योग",
            "शोडशवर्ग", "केपी", "लाल किताब", "अंक ज्योतिष"]

    with sync_playwright() as play:
        browser = play.chromium.launch()
        page = browser.new_page(viewport={"width": 1000, "height": 1100})

        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)[:160]))
        page.on("console", lambda m: errors.append(m.text[:160])
                if m.type == "error" else None)

        for name, date, time_, place in CASES:
            errors.clear()
            if not open_page(page, f"{BASE}/janam-ghathe"):
                continue
            page.wait_for_selector("#jgd-name", timeout=90000)
            page.wait_for_timeout(1500)

            page.locator("#jgd-name").first.fill(name)
            page.locator("#jgd-date").first.fill(date)
            page.locator("#jgd-time").first.fill(time_)
            page.locator("#jgd-place").first.fill(place)
            page.locator("#jgd-place").first.press("ArrowDown")
            page.wait_for_timeout(1200)

            option = page.locator('button[role="option"]').first
            chosen = ""
            if option.count():
                chosen = option.inner_text().strip()
                option.click()
            else:
                note("charts", f"{name}: '{place}' ki jagah chun nahi payi")
            page.wait_for_timeout(900)

            page.locator('button[type="submit"]').first.click()
            page.wait_for_timeout(9000)

            tabs = page.locator('[role="tab"]')
            if tabs.count() == 0:
                note("charts", f"{name} {date}: kundali bani hi nahi")
                print(f"    {name:<9} {date}  CHART HI NAHI BANI")
                continue

            if tabs.count() != len(TABS):
                note("charts", f"{name}: {tabs.count()} tabs, {len(TABS)} hone chahiye")

            blanks = []
            for label in TABS:
                for i in range(tabs.count()):
                    if label in tabs.nth(i).inner_text():
                        tabs.nth(i).click()
                        break
                page.wait_for_timeout(800)

                length = page.evaluate(
                    """() => {
                        const boxes = [...document.querySelectorAll('div')]
                          .filter(d => d.textContent && d.textContent.length > 200);
                        return boxes.length ? boxes[boxes.length - 1].innerText.trim().length : 0;
                    }"""
                )
                if length < 120:
                    blanks.append(label)

            for error in errors[:2]:
                note("charts", f"{name} {date}: {error}")

            flag = "OK" if not blanks else "KHAALI: " + ", ".join(blanks)
            if blanks:
                note("charts", f"{name} {date}: {flag}")
            print(f"    {name:<9} {date}  {flag}")

        browser.close()


# ── 3. the languages ────────────────────────────────────────────

def audit_languages() -> None:
    """
    Thirteen languages, asked in the visitor's own chosen language.

    Deliberately **not** implemented here. The first version of this file put the
    language in the request body, and /api/ask ignores that field — the language
    is a cookie, and always was. So the check sat there reporting twelve broken
    languages on a site that was answering all thirteen correctly, every time it
    ran, in every language. A check that is confidently wrong is worse than no
    check, because it costs an afternoon to disprove.

    So the one copy of this test lives next door, where it sets the cookie the
    way the site actually reads it:

        python scripts/check-ai-language.py
    """
    print()
    print("  3. AI — 13 bhasha")
    print("  " + "-" * 50)
    print("    alag se chalega:  python scripts\\check-ai-language.py")
    print("    (bhasha cookie se aati hai, request body se nahi — yahi galti")
    print("     is file pehle kar chuka tha)")


if __name__ == "__main__":
    print()
    print("=" * 62)
    print("  POORI WEBSITE KA AUDIT —", BASE)
    print("=" * 62)

    audit_pages()
    audit_charts()
    audit_languages()

    print()
    print("=" * 62)
    if problems:
        print(f"  MILI HUI GALTIYAN: {len(problems)}")
        print("=" * 62)
        for item in problems:
            print("  •", item)
    else:
        print("  Koi galti nahi mili.")
    print()
