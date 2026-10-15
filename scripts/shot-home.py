"""Screenshot the home page where the age box now sits.

    python scripts/shot-home.py

Between the question box and the subject grid, which is the point: the subject
grid asks the visitor to know which of nine subjects their problem falls under,
and the age box does not.
"""

import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://varsha-samadhan.vercel.app"
OUT = "E:/web side design/varsha-samadhan"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 430, "height": 1000}, device_scale_factor=2)

    page.goto(BASE, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(3500)

    # The age box's own heading, scrolled to.
    target = page.query_selector("text=अपनी उम्र बताइए")
    if target is not None:
        target.scroll_into_view_if_needed()
        page.wait_for_timeout(500)

    path = f"{OUT}/.shot-home.png"
    page.screenshot(path=path)
    print("  ", path)

    # And the whole page, so the order is visible.
    page.screenshot(path=f"{OUT}/.shot-home-full.png", full_page=True)
    print("  ", f"{OUT}/.shot-home-full.png")

    browser.close()
