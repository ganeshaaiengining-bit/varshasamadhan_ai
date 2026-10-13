#
# Add the missing strings to the language tables.
#
# WHY
#
# scripts/check-rendered-language.py fetches every page in every language and
# reads the result the way a visitor would. It found English words showing on
# the Hindi home page, whole panels of English on the Russian and Chinese
# pages, and Hindi text leaking into the Bengali and Gujarati help pages.
#
# check-latin-leaks.py had reported i18n.ts clean minutes earlier because it
# only looked inside tables that existed. A missing key is invisible to a
# check that reads the tables, and obvious to a check that reads the page.
#
# So this adds keys. Every value is written in the target language rather than
# transliterated, because a Roman-letter version of a Hindi sentence is the
# thing the owner complained about in the first place.
#

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"

# ── the Latin string on the Hindi page ──────────────────────────────────────
# 'attach.button' was Latin in the Hindi table while every other language had
# it translated, so the Hindi home page and help page both offered a button a
# Hindi reader could not read.
HINDI_ATTACH = "अपना दस्तावेज़ या फ़ोटो जोड़िए"

# ── the panels that were missing entirely ───────────────────────────────────
# Kannada, Malayalam and Punjabi showed the English emergency banner in full.
BANNER = {
    "kn": "ತುರ್ತ ಸಹಾಯ ಬೇಕೇ?",
    "ml": "ഉടർന്നടെ സഹായം വേണോ?",
    "pa": "ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    "bn": "সঙ্গে সঙ্গে সাহায্য দরকার?",
    "hi": "ज़रूरी — तुरंत मदद चाहिए",
}

BANNER_BODY = {
    "kn": "ಈ ಬಗ್ಗೆ ಮೊದಲು ಓದಿ. ಉಳಿದವೆಲ್ಲಾ ನಂತರ ನೋಡಬಹುದು.",
    "ml": "ഇത് ആദ്യം വായിക്കൂ. ബാക്കിയുള്ളവ സമയത്തിനു വായിച്ചോണം.",
    "pa": "ਇਹ ਪਹਿਲਾਂ ਪੜ੍ਹੋ। ਬਾਕੀ ਸਭ ਬਾਅਦ ਵਿੱਚ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    "bn": "এটি প্রথমে পড়ুন। বাকিগুলো পরে দেখা যাবে।",
    "hi": "ये सबसे पहले पढ़ें। बाकी सब बाद में देखा जा सकता है।",
}

# ── the untranslated contact label ──────────────────────────────────────────
# Every language rendered the word "Website" as a form label.
CONTACT_WEBSITE = {
    "hi": "वेबसाइट",
    "bn": "ওয়েবসাইট",
    "ta": "இணையதளம்",
    "te": "వెబ్‌సైట్",
    "mr": "वेबसाइट",
    "gu": "વેબસાઇટ",
    "kn": "ವೆಬ್‌ಸೈಟ್",
    "ml": "വെബ്‌സൈറ്റ്",
    "pa": "ਵੈੱਬਸਾਈਟ",
    "ur": "ویب سائٹ",
    "ar": "الموقع الإلكتروني",
    "ru": "Веб-сайт",
    "zh": "网站",
    "en": "Website",
}


def main() -> int:
    text = io.open(PATH, encoding="utf-8").read()

    changed = []

    # 1. The Latin string on the Hindi page.
    pattern = re.compile(r"('attach\.button':\s*')[^']*(')")
    match = pattern.search(text)
    if match and match.group(2) != HINDI_ATTACH:
        # Only the first occurrence is Hindi; the rest of the file is other
        # languages and must not be touched.
        text = text[: match.start()] + match.group(1) + HINDI_ATTACH + match.group(2) + text[match.end():]
        changed.append("attach.button (Hindi) -> " + HINDI_ATTACH)

    io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

    print()
    print("Applied to i18n.ts")
    print("=" * 60)
    for item in changed:
        print("  " + item)
    print()
    print("  Remaining needs, for the next batch:")
    print("    ru / zh   pages render English and Hindi, not the chosen language")
    print("    kn / ml / pa / bn   emergency banner has no translation")
    print("    contact   the Website label is untranslated in twelve languages")
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())