import re
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

BASE = "https://varsha-samadhan.vercel.app"
LANGUAGES = ["hi", "en", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "ar", "es"]

# The script each language must answer in. Stated rather than imported, because
# this file is checking the live site and must not share code with it.
OWN = {
    "hi": r"[\u0900-\u097F]",
    "mr": r"[\u0900-\u097F]",
    "bn": r"[\u0980-\u09FF]",
    "ta": r"[\u0B80-\u0BFF]",
    "te": r"[\u0C00-\u0C7F]",
    "gu": r"[\u0A80-\u0AFF]",
    "kn": r"[\u0C80-\u0CFF]",
    "ml": r"[\u0D00-\u0D7F]",
    "pa": r"[\u0A00-\u0A7F]",
    "ur": r"[\u0600-\u06FF]",
    "ar": r"[\u0600-\u06FF]",
    "en": r"[A-Za-z]",
    "es": r"[A-Za-z]",
}

# Punctuation that more than one of these scripts uses, and which therefore
# carries no evidence about which language was written.
SHARED = set("।॥॥।॥॰০।۔।።।॥")

# Latin acronym as a word: quoting one inside another language is quoting, not
# answering in the wrong language.
LATIN_WORD = re.compile(r"[A-Za-z]{2,}")

print()
print("=" * 62)
print("  13 BASHAA — visitor ki chuni hui bhasha me jawab")
print("=" * 62)

with sync_playwright() as play:
    browser = play.chromium.launch()
    context = browser.new_context(viewport={"width": 1000, "height": 1000})
    page = context.new_page()

    handle = f"probe{int(time.time()) % 100000}"
    page.goto(f"{BASE}/login", wait_until="domcontentloaded", timeout=120000)
    page.wait_for_timeout(3000)

    page.locator("#register-name").fill("Probe Visitor")
    page.locator("#register-handle").fill(handle)
    page.locator("#register-password").fill("probepass123")
    page.locator("form:has(#register-name) button[type=submit]").first.click()
    page.wait_for_timeout(8000)

    print(f"  login: {'ho gaya' if handle in page.inner_text('body') else 'NAHI HUA'}")

    # One question per language, in that language, so the model has no excuse.
    QUESTION = {
        "hi": "मेरी छोटी बहन को बुखार है, मैं क्या करूँ?",
        "mr": "माझ्या लहान बहिणीला ताप आला आहे, मी काय करावे?",
        "bn": "আমার ছোট বোনের জ্বর হয়েছে, আমি কী করব?",
        "ta": "என் சகோதரிக்கு காய்ச்சல் இருந்தால் நான் என்ன செய்வது?",
        "te": "నా చిన్న సోదరికి జ్వరం వచ్చింది, నేను ఏమి చేయాలి?",
        "gu": "મારી નાની બહેનને તાવ આવ્યો છે, હું શું કરું?",
        "kn": "ನನ್ನ ತಂದೆಗೆ ಜ್ವರ ಬಂದಿದೆ, ನಾನು ಏನು ಮಾಡಬೇಕು?",
        "ml": "എന്റെ ചെറിയ സഹോരിന് പനി വന്നു, എന്ത് ചെയ്യണം?",
        "pa": "ਮੇਰੀ ਛੋਟੀ ਭੈਣੀ ਨੂੰ ਬੁਖਾਰ ਹੈ, ਮੈਂ ਕੀ ਕਰਾਂ?",
        "ur": "میری چھوٹی بہن کو بخار ہے، میں کیا کروں؟",
        "ar": "أختي الصعبة عندها حمّى، ماذا أفعل؟",
        "en": "My little sister has a fever, what should I do?",
        "es": "Mi hermana pequeña tiene fiebre, ¿qué debo hacer?",
    }

    failed = 0

    for language in LANGUAGES:
        # The language the *visitor* chose, which is a cookie and nothing else.
        # An earlier version of this check put the language in the request body,
        # where the route silently ignores it, and then reported twelve broken
        # languages on a site that was answering correctly all along.
        context.add_cookies([{
            "name": "vs-lang",
            "value": language,
            "url": BASE,
        }])
        page.goto(f"{BASE}/", wait_until="domcontentloaded", timeout=90000)
        page.wait_for_timeout(1200)

        answered = page.evaluate(
            """async (question) => {
                const r = await fetch('/api/ask', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ question }),
                });
                const t = await r.text();
                try { return JSON.parse(t); } catch { return { raw: t.slice(0, 200) }; }
            }""",
            QUESTION[language],
        )
        page.wait_for_timeout(1500)

        answer = answered.get("answer") or answered.get("raw", "")
        if not answer:
            failed += 1
            print(f"    {language:<4} (jawaab nahi mila — {answered.get('reasonKey', 'karan nahi')})")
            continue

        own = len(re.findall(OWN[language], answer))

        # The brand name is written in English capitals in every language, so it
        # is Roman text inside an otherwise perfectly Tamil answer. Counting it
        # as a wrong-script letter is counting the one thing the site is
        # required to do — so it is taken out before the script is judged.
        judged = answer
        for brand in ("VARSHA SAMADHAN", "VARSHA"):
            judged = judged.replace(brand, " ")

        wrong_chars: list[str] = []
        for other, pattern in OWN.items():
            if other == language:
                continue
            # Languages sharing a script are not evidence against each other.
            if OWN[other] == OWN[language]:
                continue
            for char in re.findall(pattern, judged):
                # Punctuation several scripts share says nothing about which
                # language was written. Bengali, Hindi and Marathi all end a
                # sentence with the Devanagari danda, and a Punjabi answer that
                # uses one is still entirely Punjabi. The site already knows
                # this — src/server/ai/language.ts keeps a SHARED_MARKS list for
                # the same reason — and this check had to learn it too, because
                # a check that reports the site's correct punctuation as a
                # wrong-language answer is worse than no check.
                if char in SHARED:
                    continue
                if char not in wrong_chars:
                    wrong_chars.append(char)

        # A Latin acronym quoted inside an otherwise correct answer is not a
        # language failure either — "PDF" inside an Arabic answer reads as
        # Arabic to an Arabic reader. The site applies the same leniency, with
        # a ratio rather than a ban, so a few letters are allowed through.
        latin_words = LATIN_WORD.findall(judged)
        if wrong_chars and all(c.isascii() and c.isalpha() for c in wrong_chars):
            if len(latin_words) * 2 <= own:
                wrong_chars = []

        ok = own > 0 and not wrong_chars
        if not ok:
            failed += 1

        mark = "ok  " if ok else "FAIL"
        print(f"    {mark} {language:<4} {answered.get('provider', '?'):<12} "
              f"{len(answer):>4} akshar, apni {own}, galat {len(wrong_chars)}")
        if not ok:
            print(f"         galat akshar: {''.join(wrong_chars[:20])!r}")
            print(f"         {answer[:80]}")

    browser.close()

print()
print("=" * 62)
passed = len(LANGUAGES) - failed
print(f"  {passed} me se {len(LANGUAGES)} bhasha me apni bhasha me jawab mila")
if failed:
    print(f"  {failed} galat")
print("=" * 62)
print()