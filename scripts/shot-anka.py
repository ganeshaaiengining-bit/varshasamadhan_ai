"""Fill in the birth form on /janam-ghathe and open the Anka tab.

    python scripts/shot-anka.py

Used while building the Anka Ganit panel, and kept because the panel is the one
part of the Jyotish sheet that has to be *seen* rather than merely checked: a
grid with a count in the wrong cell computes perfectly and draws wrong.

The form is filled the same way a person fills it — one key at a time into the
day, month and year spinbuttons — because `fill()` does not commit a date input
and a script that skips the commit is testing something nobody does.
"""

import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3111"


def type_into(page, selector, text):
    element = page.locator(selector).first
    element.click()
    for ch in text:
        element.type(ch)


def fill_date(page, selector, value):
    """
    A date input, filled the way a browser can actually commit.

    `fill()` works here — this form is a single `<input type="date">`, not three
    spinbuttons — but the value has to be the one the input expects, and an
    Indian-format date string is silently ignored rather than rejected, so the
    result is checked afterwards instead of assumed.
    """
    page.locator(selector).first.fill(value)
    page.wait_for_timeout(500)
    return page.locator(selector).first.input_value()


with sync_playwright() as play:
    browser = play.chromium.launch()
    page = browser.new_page(viewport={"width": 900, "height": 1200})

    page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded")
    page.wait_for_timeout(8000)

    print("  inputs:", page.evaluate(
        "() => Array.from(document.querySelectorAll('input,select')).map(e => (e.id || e.name || e.tagName) + ':' + e.type).slice(0, 16)"
    ))

    try:
        given = fill_date(page, "#jgd-date", "1975-03-14")
        print("  date field holds:", given)

        fill_date(page, "#jgd-time", "14:30")
        page.wait_for_timeout(400)

        name = page.locator("#jgd-name")
        if name.count():
            name.first.fill("Varsha")
            page.wait_for_timeout(600)

        place = page.locator("#jgd-place")
        if place.count():
            place.first.fill("Nagpur")
            place.first.press("ArrowDown")
            page.wait_for_timeout(700)

            # The suggestion list is a listbox of buttons, not a `<datalist>`, so
            # typing into the box is not enough — the place has to be *chosen*.
            # Left unchosen, its panel stays open over the submit button and the
            # click lands on a city name instead of submitting anything.
            option = page.locator('button[role="option"]').first
            if option.count():
                option.click()
                page.wait_for_timeout(900)
            else:
                place.first.press("Escape")
                page.wait_for_timeout(400)

            print("  place chosen:", place.first.input_value())

        submit = page.locator('button[type="submit"]').first
        submit.scroll_into_view_if_needed()
        submit.click()
        page.wait_for_timeout(10000)
    except Exception as error:  # noqa: BLE001
        print("  form par:", str(error)[:200])

    tabs = page.locator('[role="tab"]')
    print("  tabs:", tabs.count(), [tabs.nth(i).inner_text() for i in range(tabs.count())])

    wanted = sys.argv[2] if len(sys.argv) > 2 else "अंक"
    for i in range(tabs.count()):
        if wanted in tabs.nth(i).inner_text():
            tabs.nth(i).click()
            break
    else:
        print(f"  tab '{wanted}' nahi mila")

    page.wait_for_timeout(3500)

    body = page.inner_text("body")
    for probe in ["लोश ग्रिड", "लो-शु वर्ग", "अनुकूल", "उपाय", "कर्मांक", "लेख अंक", "भवांक",
                  "पंचांग", "तिथि", "नक्षत्र", "योग", "करण", "चाँद का प्रतिशत"]:
        print(f"  {'ok ' if probe in body else 'MISSING'} {probe}")

    page.screenshot(path=".shot-anka.png", full_page=True)
    print("  .shot-anka.png")

    browser.close()