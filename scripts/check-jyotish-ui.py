"""Does the Jyotish sheet actually render, or only compile?

The engines are covered by test-jyotish.ts and the build passes, which between
them prove the code is well formed. Neither proves the page shows anything. A
component can compile, type-check and still be unreachable — not mounted, or
mounted behind a condition that never fires.

So this drives the real page in a real browser, fills the form, presses the
button, and reads the result back out of the DOM.

    python scripts/check-jyotish-ui.py
"""

import sys
import time
import re

sys.stdout.reconfigure(encoding="utf-8")

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("  playwright nahi hai — pip install playwright")
    print("  phir:  playwright install chromium")
    sys.exit(2)

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3111"

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


TABS = [
    "कुंडली", "विमशोत्तरी दशा", "फलादेश", "योग",
    "शोडशवर्ग", "केपी", "लाल किताब", "अंक ज्योतिष",
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844})

    # `networkidle` never fires against a dev server, because the hot-reload
    # socket stays open for the life of the page. Waiting for the form instead
    # waits for the thing this test is actually about.
    page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded", timeout=45000)
    page.wait_for_selector("#jgd-name", timeout=45000)

    # Wait for hydration before touching anything.
    #
    # Every control on this form is a React component with no behaviour in the
    # server-rendered HTML. `wait_for_selector` returns as soon as the markup
    # exists, which on a cold production server is well before the JavaScript
    # arrives — so every interaction below would land on an inert page and the
    # run would report a combobox that does not open and a sheet that never
    # renders, on a page that works perfectly in a browser.
    #
    # The symptom was unmistakable: this failed against the live site every time
    # and passed against the dev server every time, and only against the live
    # site, which is the only place that is ever cold.
    page.wait_for_timeout(2500)

    print()
    print("Jyotish sheet, in a real browser")
    print("=" * 60)

    check("the page opens", page.title() is not None)

    # ── fill the form ─────────────────────────────────────────────────────
    page.fill("#jgd-name", "VARSHA")
    page.fill("#jgd-date", "1975-03-14")
    page.fill("#jgd-time", "10:30")

    # The city box is a combobox, not a select, so it needs typing.
    city = page.query_selector("#jgd-place")
    if city is None:
        check("the city box exists", False, "#jgd-place was not on the page")
        browser.close()
        sys.exit(1)

    # Ask the component's own flag rather than watching for an element.
    #
    # The input publishes `aria-expanded`, which is the one thing that is true
    # when — and only when — the list is open. Polling it also tolerates a slow
    # cold start without a fixed guess at how slow that is, and clicking again is
    # harmless because a second click on an already-focused box cannot close it.
    opened = False
    for _ in range(30):
        city.click()
        page.wait_for_timeout(400)
        if city.get_attribute("aria-expanded") == "true":
            opened = True
            break

    check("the city box opens when tapped", opened)

    city.fill("Mum")
    page.wait_for_timeout(900)

    # Match on role, not on a text scan of every button on the page.
    #
    # Scanning all buttons found the state header first — its text contains
    # "Mumbai" because it lists the cities under it — and clicked that instead.
    # The click collapsed the group and the city was never chosen, so the run
    # reported a broken combobox on a combobox that works.
    options = page.query_selector_all('[role="option"]')
    picked = False
    for opt in options:
        text = (opt.inner_text() or "").strip()
        if "Mumbai" in text or "मुंबई" in text:
            opt.click()
            picked = True
            break

    check("a city can be chosen from the list", picked, f"{len(options)} options were offered")

    # Scoped to the form. A bare `button[type="submit"]` also matches the
    # language switcher, which sits earlier in the document, so the click went to
    # the switcher and the chart was never asked for.
    page.click('form button[type="submit"]')

    # Wait for the sheet rather than for a fixed number of milliseconds: on the
    # live site a fixed wait was sometimes short enough to read the page before
    # the chart was drawn, and the run then failed on a page that had in fact
    # worked.
    try:
        page.wait_for_selector('[role="tab"]', timeout=30000)
        rendered = True
    except Exception:  # noqa: BLE001
        rendered = False

    page.wait_for_timeout(600)
    body = page.inner_text("body")

    # ── the sheet is there at all ─────────────────────────────────────────
    check(
        "the full sheet is rendered",
        rendered and "पूरी ज्योतिश कुंडली" in body,
        "the sheet heading never appeared",
    )

    # ── every tab opens and has content ───────────────────────────────────
    empty_tabs = []
    for label in TABS:
        # By role, not by text: `button:has-text("योग")` also matches the
        # "योग" inside the rail's link titles, and clicking that navigates away
        # from the page entirely.
        btn = page.query_selector(f'[role="tab"]:has-text("{label}")')
        if btn is None:
            empty_tabs.append(f"{label} (tab button missing)")
            continue
        btn.click()
        page.wait_for_timeout(350)

        text = page.inner_text("body")
        # A tab that switched but rendered nothing says something only if the
        # label is gone from the button row, which it never is. So check for the
        # section's own content instead.
        if len(text) < 800:
            empty_tabs.append(f"{label} (only {len(text)} chars on the page)")

    check("all eight tabs open with content", not empty_tabs, "; ".join(empty_tabs))

    # ── the chart has nine grahas and a real lagna ────────────────────────
    page.click('[role="tab"]:has-text("कुंडली")')
    page.wait_for_timeout(300)

    for graha in ["सूर्य", "चंद्र", "मंगल", "बुध", "बृहस्पति", "शुक्र", "शनि", "राहु", "केतु"]:
        if graha not in body:
            check(f"{graha} is on the chart", False, "not found in the rendered page")
            break
    else:
        check("all nine grahas are on the chart", True)

    lag = re.search(r"लग्न.*?\n([^\n]+)", body)
    check(
        "the lagna shows a sign name",
        lag is not None and any(
            s in (lag.group(1) if lag else "")
            for s in ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
                      "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"]
        ),
        f"lagna line was {lag.group(1) if lag else 'not found'}",
    )

    # ── dasha runs to 120 years ───────────────────────────────────────────
    page.click('[role="tab"]:has-text("विमशोत्तरी दशा")')
    page.wait_for_timeout(300)
    dasha_text = page.inner_text("body")

    years = [int(y) for y in re.findall(r"\b(1[89]\d\d|20\d\d)\b", dasha_text)]
    check(
        "the dasha table spans real years",
        len(years) >= 10,
        f"only {len(years)} four-digit years found",
    )
    if len(years) >= 10:
        span = max(years) - min(years)
        check(
            "the dasha table covers about 120 years",
            110 <= span <= 130,
            f"years run from {min(years)} to {max(years)}, a span of {span}",
        )

    check(
        "one dasha is marked as running now",
        "अभी" in dasha_text,
        "no period was marked current",
    )

    # ── nothing is printed as an error ────────────────────────────────────
    for bad in ["NaN", "undefined", "Infinity", "[object Object]"]:
        check(f"the page never prints {bad!r}", bad not in body)

    # ── it works on a phone width ─────────────────────────────────────────
    check(
        "the tab row wraps rather than overflowing on a 390px screen",
        page.evaluate(
            "() => { const r = document.querySelector('[role=tablist]');"
            " return r ? r.scrollWidth <= r.clientWidth + 2 : false; }"
        ) or page.evaluate(
            "() => { const r = document.querySelector('[role=tablist]');"
            " return r ? getComputedStyle(r).flexWrap === 'wrap' : false; }"
        ),
        "the tab row does not wrap and does not fit",
    )

    browser.close()

print("-" * 60)
print()
print(f"  {passed} of {passed + failed} checks passed.")
print()

if failed > 0:
    print("A page that compiles and a page that works are not the same page.")
    print()
    sys.exit(1)
