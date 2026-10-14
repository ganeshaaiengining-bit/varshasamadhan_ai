"""Screenshot the live Jyotish sheet so it can be looked at without typing.

    python scripts/shot-live.py

The sheet is driven the way a visitor drives it: fill the form, press the
button, click a tab. Nothing here is mocked and nothing is staged — it is the
same page the owner is being sent to.
"""

import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

BASE = "https://varsha-samadhan.vercel.app"
OUT = "E:/web side design/varsha-samadhan"

WANTED = [
    ("kundali", "कुंडली"),
    ("dasha", "विमशोत्तरी दशा"),
    ("yoga", "योग"),
    ("kp", "केपी"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 430, "height": 1000}, device_scale_factor=2)

    page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_selector("#jgd-name", timeout=45000)
    page.wait_for_timeout(3000)  # hydration

    page.fill("#jgd-name", "VARSHA")
    page.fill("#jgd-date", "1975-03-14")
    page.fill("#jgd-time", "10:30")

    city = page.query_selector("#jgd-place")
    for _ in range(20):
        city.click()
        page.wait_for_timeout(400)
        if city.get_attribute("aria-expanded") == "true":
            break

    city.fill("Mum")
    page.wait_for_timeout(1000)

    for opt in page.query_selector_all('[role="option"]'):
        text = (opt.inner_text() or "").strip()
        if "Mumbai" in text or "मुंबई" in text:
            opt.click()
            break

    page.click('form button[type="submit"]')
    page.wait_for_selector('[role="tab"]', timeout=30000)
    page.wait_for_timeout(800)

    print()
    print("Live sheet —", BASE + "/janam-ghathe")
    print("=" * 52)
    print()

    for name, label in WANTED:
        tab = page.query_selector(f'[role="tab"]:has-text("{label}")')
        if tab is None:
            print("  tab missing:", label)
            continue
        tab.click()
        page.wait_for_timeout(700)
        page.query_selector('[role="tablist"]').scroll_into_view_if_needed()
        page.wait_for_timeout(300)

        path = f"{OUT}/.shot-{name}.png"
        page.screenshot(path=path)
        print("  ", path)

    browser.close()

print()
