"""Does the live site actually answer, in the visitor's own language?

    python scripts/test-live-ai.py

The question route requires a signed-in visitor — that is a decision, not a
bug, and it is the right one: an open endpoint on a free key is an open bill.
But it also means every earlier check of this route returned 401 and proved
nothing at all about whether the answer comes back.

So this makes a real account through the real form and then asks through the
real route, which is the only way to see the whole chain: the key on Vercel, the
model, the daily budget, the script check, and the language the visitor picked.

It creates an account with a throwaway handle and leaves it behind, because
deleting an account is a thing the application does not offer and inventing a
delete here would be a second untested code path.
"""

import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://varsha-samadhan.vercel.app"

HANDLE = "probe%d" % int(time.time() % 100000)
PASSWORD = "probe-%d-x" % int(time.time() % 100000)

QUESTIONS = [
    ("hi", "हिंदी", "मेरे घर में पेड़ के लिए कौन सा ग्रह लगता है?"),
    ("ta", "Tamil", "என் வாழ்வில் வெற்றி எப்படி வரும்?"),
    ("bn", "Bengali", "জীবনে শান্তি কীভাবে আসবে?"),
]

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


def script_of(text):
    """Which script the answer is written in.

    Enough to tell whether it came back in the visitor's language: a Devanagari
    answer to a Tamil question is the failure this test exists for, and it is
    visible without reading a word of it.
    """
    devanagari = sum(1 for c in text if "ऀ" <= c <= "ॿ")
    tamil = sum(1 for c in text if "஀" <= c <= "௿")
    bengali = sum(1 for c in text if "ঀ" <= c <= "৿")
    latin = sum(1 for c in text if c.isascii() and c.isalpha())

    scripts = {"devanagari": devanagari, "tamil": tamil, "bengali": bengali, "latin": latin}
    best = max(scripts, key=lambda k: scripts[k])
    return best if scripts[best] > 0 else "none"


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1100, "height": 900})

    print()
    print("The live site, answering a real question")
    print("=" * 60)

    page.goto(f"{BASE}/login", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(3500)  # hydration

    # Two forms sit side by side: one to sign in and one to register. The ids
    # carry the mode, so the register form is addressed directly rather than by
    # guessing from placeholder text in twelve languages.
    name_box = page.query_selector("#register-name")
    handle_box = page.query_selector("#register-handle")
    password_box = page.query_selector("#register-password")

    check(
        "the sign-up form is on the page",
        name_box is not None and handle_box is not None and password_box is not None,
        f"name={name_box is not None} handle={handle_box is not None} password={password_box is not None}",
    )

    if name_box is None or handle_box is None or password_box is None:
        browser.close()
        sys.exit(1)

    name_box.fill("Probe Visitor")
    handle_box.fill(HANDLE)
    password_box.fill(PASSWORD)

    # The register form's own submit, not the first one on the page — the sign-in
    # form is rendered first and its button would sign in as nobody.
    page.click("#register-name ~ * button[type=submit], form:has(#register-name) button[type=submit]")
    page.wait_for_timeout(6000)

    # Signed in means the account page shows the handle. Before the sign-in the
    # gate answers 401, so the API call below is the real proof; this only says
    # the form went through without an error being shown.
    page.goto(f"{BASE}/account", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(2500)
    signed_in = HANDLE in page.inner_text("body")
    check("a visitor can sign up", signed_in, f"the account page did not show {HANDLE}")

    # ── now ask, through the real route ──────────────────────────────────
    for lang, label, question in QUESTIONS:
        page.context.add_cookies([{
            "name": "vs-lang",
            "value": lang,
            "url": BASE,
        }])

        try:
            response = page.request.post(
                f"{BASE}/api/ask",
                data={"question": question, "language": lang},
                headers={"Content-Type": "application/json"},
                timeout=150000,
            )
            payload = response.json()
        except Exception as exc:  # noqa: BLE001
            check(f"{label:8} asks", False, str(exc)[:140])
            continue

        if not payload.get("ok"):
            check(f"{label:8} asks", False, json.dumps(payload, ensure_ascii=False)[:140])
            continue

        answer = payload.get("answer") or ""
        got = script_of(answer)

        expected = {"hi": "devanagari", "ta": "tamil", "bn": "bengali"}[lang]

        check(f"{label:8} answers", len(answer) > 40, f"only {len(answer)} characters")
        check(
            f"{label:8} answers in its own script",
            got == expected,
            f"asked in {label}, got {got}",
        )
        print(f"            {answer[:96]}")

    browser.close()

print("-" * 60)
print()
print(f"  {passed} of {passed + failed} checks passed.")
print()
print(f"  Account left behind: {HANDLE}  (delete when convenient)")
print()

if failed > 0:
    sys.exit(1)
