"""Does every page still work, and does the left rail still leave room?

The Jyotish work changed the app shell — the rail's spacer and the flex row that
gives it room — and that shell is shared by every page on the site. A change
there is exactly the kind that breaks one page while the page being worked on
looks perfect.

So this walks every route, at a phone width and a desktop width, and checks two
things per page:

  1. the rail is not sitting on top of the content
  2. nothing is wider than the viewport, which is what a broken grid looks like
     on a phone

    python scripts/check-shell.py http://127.0.0.1:3111
"""

import sys

sys.stdout.reconfigure(encoding="utf-8")

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("  playwright nahi hai — pip install playwright")
    sys.exit(2)

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3111"

ROUTES = [
    "/",
    "/janam-ghathe",
    "/login",
    "/account",
    "/pustakalay",
    "/sahayata",
    "/madad",
    "/smriti",
    "/reviews",
    "/samaroh",
]

# The rail, once collapsed, is this wide on a phone.
RAIL = 72

passed = 0
failed = 0


def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  [ ok ]  {name}")
    else:
        failed += 1
        print(f"  [FAIL]  {name}")
        if detail:
            print(f"          {detail}")


def audit(page, route, width, label):
    # Twice, because the first visit to a route on a cold development server
    # compiles it, and that compile can take longer than the navigation timeout.
    # The failure it produces looks exactly like a broken route, which is the
    # worst kind of false alarm: it says the home page is down.
    for attempt in range(2):
        try:
            page.goto(f"{BASE}{route}", wait_until="domcontentloaded", timeout=60000)
            break
        except Exception:  # noqa: BLE001
            if attempt == 1:
                raise
            page.wait_for_timeout(3000)
    page.wait_for_timeout(900)

    # Nothing may extend past the right edge of the screen — except inside a
    # container that is meant to scroll sideways.
    #
    # The chip rows on /sahayata are a deliberate horizontal carousel, and their
    # buttons are wider than the screen by design. Counting those as overflow
    # made the check fail on a page that is working, which teaches whoever reads
    # the output to ignore it.
    overflow = page.evaluate(
        "() => {"
        " const w = document.documentElement.clientWidth;"
        " const scrolls = (el) => {"
        "   for (let p = el.parentElement; p; p = p.parentElement) {"
        "     const s = getComputedStyle(p);"
        "     if (s.overflowX === 'auto' || s.overflowX === 'scroll') return true;"
        "   }"
        "   return false;"
        " };"
        " let worst = 0, who = '';"
        " for (const el of document.querySelectorAll('body *')) {"
        "   const r = el.getBoundingClientRect();"
        "   if (r.width === 0 || r.height === 0) continue;"
        "   if (scrolls(el)) continue;"
        "   const over = Math.round(r.right - w);"
        "   if (over > worst) { worst = over; who = el.tagName + '.' + (el.className || '').toString().slice(0, 40); }"
        " }"
        " return { worst, who };"
        " }"
    )

    check(
        f"{label:8} {route:16} nothing overflows sideways",
        overflow["worst"] <= 2,
        f"{overflow['worst']}px past the edge, from {overflow['who']}",
    )

    if width < 600:
        # The main content must start clear of the rail.
        left = page.evaluate(
            "() => {"
            " const m = document.querySelector('main, .wrap, .wrap-narrow, header, h1');"
            " if (!m) return -1;"
            " const r = m.getBoundingClientRect();"
            " return Math.round(r.left);"
            " }"
        )
        check(
            f"{label:8} {route:16} the rail leaves room for the content",
            left >= RAIL - 2,
            f"content starts at x={left}, the rail covers 0–{RAIL}",
        )

    # And the page must say something.
    length = len(page.inner_text("body").strip())
    check(
        f"{label:8} {route:16} the page has content",
        length > 120,
        f"only {length} characters of text",
    )


with sync_playwright() as p:
    browser = p.chromium.launch()

    print()
    print("The app shell, every route, two widths")
    print("=" * 60)

    phone = browser.new_page(viewport={"width": 390, "height": 844})
    desktop = browser.new_page(viewport={"width": 1280, "height": 900})

    for route in ROUTES:
        try:
            audit(phone, route, 390, "phone")
            audit(desktop, route, 1280, "desktop")
        except Exception as exc:  # noqa: BLE001 — a failed route is a failed route
            check(f"         {route:16} loads", False, str(exc)[:160])

    browser.close()

print("-" * 60)
print()
print(f"  {passed} of {passed + failed} checks passed.")
print()

if failed > 0:
    print("A shell change is a change to every page.")
    print()
    sys.exit(1)
