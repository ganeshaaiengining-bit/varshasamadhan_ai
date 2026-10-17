import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3111"
TAB = sys.argv[2] if len(sys.argv) > 2 else "फलादेश"

with sync_playwright() as play:
    browser = play.chromium.launch()
    page = browser.new_page(viewport={"width": 900, "height": 1100})

    logs = []
    page.on("console", lambda m: logs.append(f"[{m.type}] {m.text[:250]}"))
    page.on("pageerror", lambda e: logs.append(f"PAGEERROR: {str(e)[:300]}"))

    page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded", timeout=90000)
    page.wait_for_selector("#jgd-name", timeout=60000)
    page.wait_for_timeout(1500)

    page.locator("#jgd-name").first.fill("Varsha")
    page.locator("#jgd-date").first.fill("1975-03-14")
    page.locator("#jgd-time").first.fill("14:30")
    page.locator("#jgd-place").first.fill("Nagpur")
    page.locator("#jgd-place").first.press("ArrowDown")
    page.wait_for_timeout(1200)
    opt = page.locator('button[role="option"]').first
    if opt.count():
        opt.click()
    page.wait_for_timeout(1000)

    page.locator('button[type="submit"]').first.click()
    page.wait_for_timeout(10000)

    tabs = page.locator('[role="tab"]')
    print("  tabs:", [tabs.nth(i).inner_text() for i in range(tabs.count())])

    for i in range(tabs.count()):
        if TAB in tabs.nth(i).inner_text():
            tabs.nth(i).click()
            break
    page.wait_for_timeout(4000)

    body = page.inner_text("body")
    print(f"  '{TAB}' khola. body length:", len(body))

    # What is actually inside the tab panel?
    info = page.evaluate(
        """(tabName) => {
            const panel = document.querySelector('[role="tabpanel"]');
            if (!panel) return { found: false };
            return {
                found: true,
                html: panel.innerHTML.length,
                text: panel.innerText.trim().length,
                children: panel.children.length,
                sample: panel.innerText.trim().slice(0, 300),
            };
        }""",
        TAB,
    )
    print("  panel:", {k: v for k, v in info.items() if k != "sample"})
    print("  sample:", repr(info.get("sample", ""))[:300])

    page.locator("text=फलादेश").first.scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    page.screenshot(path=f".shot-{TAB}.png")
    print(f"  .shot-{TAB}.png")

    print()
    print("  console:")
    for line in logs[-12:]:
        print("   ", line)

    browser.close()