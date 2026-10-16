"""Screenshot the home page's subject grid, where the chart card now sits.

    python scripts/shot-topics.py
"""

import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://varsha-samadhan.vercel.app"
OUT = "E:/web side design/varsha-samadhan"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 430, "height": 1050}, device_scale_factor=2)

    page.goto(BASE, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(3500)

    target = page.query_selector("text=किस विषय में जानना है?")
    if target is not None:
        target.scroll_into_view_if_needed()
        page.wait_for_timeout(600)

    path = f"{OUT}/.shot-topics.png"
    page.screenshot(path=path)
    print("  ", path)

    browser.close()
