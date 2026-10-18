import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://varsha-samadhan.vercel.app"

# Several different births, because a panel that is blank for one person and
# full for another is a crash on a particular input and not a broken tab.
CASES = [
    ("Varsha",  "1975-03-14", "14:30", "Nagpur"),
    ("A",       "1990-01-01", "00:05", "Mumbai"),
    ("Ramesh",  "2001-12-31", "23:55", "Chennai"),
    ("Sunita",  "1966-06-15", "06:20", "Kolkata"),
    ("Test",    "1947-08-15", "12:00", "Delhi"),
]

TABS = ['कुंडली', 'पंचांग', 'विमशोत्तरी दशा',
        'फलादेश', 'योग', 'शोडशवर्ग', 'केपी',
        'लाल किताब', 'अंक ज्योतिष', 'चालित',
        'अष्टकवर्ग', 'गोचर', 'शक्ति']

with sync_playwright() as play:
    browser = play.chromium.launch()
    page = browser.new_page(viewport={"width": 900, "height": 1000})

    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)[:200]))
    page.on("console", lambda m: errors.append(f"[{m.type}] {m.text[:200]}")
            if m.type == "error" else None)

    for name, date, time_, place in CASES:
        errors.clear()
        page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded", timeout=120000)
        page.wait_for_selector("#jgd-name", timeout=90000)
        page.wait_for_timeout(1500)

        page.locator("#jgd-name").first.fill(name)
        page.locator("#jgd-date").first.fill(date)
        page.locator("#jgd-time").first.fill(time_)
        page.locator("#jgd-place").first.fill(place)
        page.locator("#jgd-place").first.press("ArrowDown")
        page.wait_for_timeout(1200)
        opt = page.locator('button[role="option"]').first
        if opt.count():
            opt.click()
        page.wait_for_timeout(900)

        page.locator('button[type="submit"]').first.click()
        page.wait_for_timeout(9000)

        tabs = page.locator('[role="tab"]')
        if tabs.count() == 0:
            print(f"  {name} {date}: CHART HI NAHI BANA")
            continue

        print(f"  {name:8} {date}")
        for label in TABS:
            for i in range(tabs.count()):
                if label in tabs.nth(i).inner_text():
                    tabs.nth(i).click()
                    break
            page.wait_for_timeout(900)

            length = page.evaluate(
                """() => {
                    const el = [...document.querySelectorAll('div')]
                      .filter(d => d.textContent && d.textContent.length > 200)
                      .pop();
                    return el ? el.innerText.trim().length : 0;
                }"""
            )
            flag = "OK  " if length > 150 else "KHALI"
            print(f"     {flag} {label:16} {length} chars")

        if errors:
            print("     errors:", errors[:3])

        page.screenshot(path=f".shot-phal-{name}.png", full_page=True)

    browser.close()