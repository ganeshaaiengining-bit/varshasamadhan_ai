"""Does the gender choice actually change the reading, or is it decoration?

    python scripts/check-gender.py

The seventh house is read through Jupiter for a husband and through Venus for a
wife in KP. That is the whole reason the question is asked at all, so "the
option is on the page" is not the thing to check — the answer has to change.

The two are also compared with nothing selected, which must report both rather
than quietly picking one.
"""

import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3111"

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


def read_seventh(page):
    """The seventh-house block, as text."""
    page.click('[role="tab"]:has-text("केपी")')
    page.wait_for_timeout(600)
    text = page.inner_text("body")
    i = text.find("सप्तम भाव")
    return text[i: i + 500] if i >= 0 else ""


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 430, "height": 950})

    print()
    print("Gender, and whether it changes the answer")
    print("=" * 60)

    page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_selector("#jgd-name", timeout=45000)
    page.wait_for_timeout(3000)  # hydration

    # ── the control exists and is a real choice ─────────────────────────
    box = page.query_selector("#jgd-gender")
    check("the gender control is on the form", box is not None, "#jgd-gender was not there")

    if box is None:
        browser.close()
        sys.exit(1)

    options = [o.strip() for o in box.eval_on_selector_all(
        "option", "els => els.map(e => e.textContent)"
    )]
    check("it offers female, male and 'rather not say'", len(options) == 3, f"got {options}")

    readings = {}

    for label, value in [
        ("स्त्री", "female"),
        ("पुरुष", "male"),
        ("बताना नहीं चाहते", "undisclosed"),
    ]:
        # Reloaded each time, because the form is replaced by the result once it
        # is submitted — the gender control is gone after the first run, and a
        # test that does not notice reports a control that never worked.
        page.goto(f"{BASE}/janam-ghathe", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_selector("#jgd-name", timeout=45000)
        page.wait_for_timeout(2500)

        page.fill("#jgd-name", "VARSHA")
        page.fill("#jgd-date", "1975-03-14")
        page.fill("#jgd-time", "10:30")
        page.select_option("#jgd-gender", value)

        city = page.query_selector("#jgd-place")
        for _ in range(25):
            city.click()
            page.wait_for_timeout(400)
            if city.get_attribute("aria-expanded") == "true":
                break
        city.fill("Mum")
        page.wait_for_timeout(900)
        for opt in page.query_selector_all('[role="option"]'):
            text = (opt.inner_text() or "").strip()
            if "Mumbai" in text or "मुंबई" in text:
                opt.click()
                break

        page.click('form button[type="submit"]')
        page.wait_for_selector('[role="tab"]', timeout=30000)
        page.wait_for_timeout(500)
        readings[value] = read_seventh(page)

    check(
        "a woman's seventh house is read through Venus",
        "शुक्र" in readings["female"],
        f"the block was: {readings['female'][:110]}",
    )

    check(
        "a husband's seventh house is read through Jupiter",
        "बृहस्पति" in readings["male"],
        f"the block was: {readings['male'][:110]}",
    )

    check(
        "choosing nothing reports both rather than picking one",
        "शुक्र" in readings["undisclosed"] and "बृहस्पति" in readings["undisclosed"],
        f"the block was: {readings['undisclosed'][:110]}",
    )

    check(
        "the three readings are not all the same sentence",
        readings["female"] != readings["male"],
        "the reading did not change with the choice",
    )

    browser.close()

print("-" * 60)
print()
print(f"  {passed} of {passed + failed} checks passed.")
print()

if failed > 0:
    sys.exit(1)
