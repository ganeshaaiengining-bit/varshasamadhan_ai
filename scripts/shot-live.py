"""Live site par kundali bana kar tasveeren.

    python scripts/shot-live.py [shaal]

Sirf dekhta hai aur tasveeren banata hai. Kuch nahi badalta, kuch nahi likhta.
Har tasveer ke neeche khaali hissa nahi chodta — poora kundali dikhe, warna
dekhne wale ko lagta hai ki kuch load nahi hua jabki sab theek hai.
"""

import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

BASE = "https://varsha-samadhan.vercel.app"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "shots")

CASES = {
    "1975-03-14|14:30|Nagpur": "varsha",
    "1990-01-01|00:05|Mumbai": "a",
    "2001-12-31|23:55|Chennai": "ramesh",
    "2024-02-29|09:05|Srinagar": "leela",
}

TABS = ['कुंडली', 'पंचांग', 'विमशोत्तरी दशा',
        'फलादेश', 'योग', 'शोडशवर्ग', 'केपी',
        'लाल किताब', 'अंक ज्योतिष', 'चालित',
        'अष्टकवर्ग', 'गोचर', 'शक्ति']


def open_page(pg, url: str, tries: int = 3) -> bool:
    for attempt in range(tries):
        try:
            pg.goto(url, wait_until="domcontentloaded", timeout=120000)
            return True
        except Exception:
            time.sleep(3)
    return False


def build_chart(pg, date: str, when: str, place: str, tab: str) -> bool:
    """Ek janam ki kundali bana kar ek tab ki poori tasveer lena."""
    if not open_page(pg, BASE + "/janam-ghathe"):
        return False

    pg.wait_for_selector("#jgd-name", timeout=90000)
    pg.wait_for_timeout(900)

    pg.locator("#jgd-name").first.fill("Janam Pariksha")
    pg.locator("#jgd-date").first.fill(date)
    pg.locator("#jgd-time").first.fill(when)

    box = pg.locator("#jgd-place").first
    box.click()
    pg.wait_for_timeout(400)
    box.type(place, delay=40)
    pg.wait_for_timeout(800)

    option = pg.locator('button[role="option"]').first
    if not option.count():
        print("  ! %s ki jagah nahi mili" % place)
        return False
    option.click()
    pg.wait_for_timeout(600)

    pg.locator('button[type="submit"]').first.click()
    pg.wait_for_timeout(11000)

    tabs = pg.locator('[role="tab"]')
    if tabs.count() == 0:
        print("  ! kundali bani hi nahi")
        return False

    for i in range(tabs.count()):
        label = tabs.nth(i).inner_text().strip()
        if tab in label:
            tabs.nth(i).click()
            break
    pg.wait_for_timeout(1500)

    return True


def shoot_chart(pg, date: str, when: str, place: str, tab: str, slug: str) -> None:
    if not build_chart(pg, date, when, place, tab):
        return

    # Poora hissa — table ka poora nichla hissa bhi, warna kata hua dikhta hai.
    pg.evaluate("""() => {
        document.querySelectorAll('*').forEach(el => {
            if (el.scrollHeight > el.clientHeight + 4 &&
                getComputedStyle(el).overflowY !== 'visible') {
                el.style.overflowY = 'visible';
                el.style.maxHeight = 'none';
            }
        });
    }""")
    pg.wait_for_timeout(700)

    path = os.path.join(OUT, "live-%s.png" % slug)
    pg.screenshot(path=path, full_page=True)
    print("  bani: %s" % path)


def main() -> None:
    os.makedirs(OUT, exist_ok=True)

    only = sys.argv[1] if len(sys.argv) > 1 else ""
    cases = {k: v for k, v in CASES.items() if not only or only in v or only in k}

    print()
    print("  live kundali ki tasveeren —", BASE)
    print("  " + "-" * 50)

    with sync_playwright() as play:
        browser = play.chromium.launch()
        pg = browser.new_page(viewport={"width": 1000, "height": 1400})
        pg.context.add_cookies([
            {"name": "vs-lang", "value": "hi", "url": BASE},
        ])

        for key, slug in cases.items():
            date, when, place = key.split("|")
            if slug == "varsha":
                shoot_chart(pg, date, when, place, "कुंडली", slug)
                for tab in ("पंचांग", "विमशोत्तरी दशा", "फलादेश", "अंक"):
                    short = {"पंचांग": "panchang", "विमशोत्तरी दशा": "dasha",
                             "फलादेश": "phaladesh", "अंक": "anka"}[tab]
                    shoot_chart(pg, date, when, place, tab, "%s-%s" % (slug, short))
            else:
                shoot_chart(pg, date, when, place, "कुंडली", slug)

        browser.close()

    print()
    print("  sab tasveeren: %s" % OUT)
    print()


if __name__ == "__main__":
    main()