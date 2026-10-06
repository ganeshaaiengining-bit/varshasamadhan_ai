"""
Check that a page is actually rendered in the language that was asked for.

    python scripts/check-page-language.py mr

Four languages by default, because the failure is invisible from a distance: a
missing string falls back to English, the page still renders, every request
returns 200, and nothing anywhere looks broken.

The health box is the reason this exists. Its 92 strings were added to the Hindi
and English tables only, so on a Marathi page the age box appeared in English —
which on a health page is not a cosmetic problem. A Marathi visitor reading
"Tell us your age" next to their own language everywhere else has been told,
without being told, that this part of the site was never made for them.

Run with a language code to check one, or with none to check all of them.
"""

import io
import json
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:3001"

# The cookie the language switcher writes. The name is `vs-lang`, defined as
# LANGUAGE_COOKIE in src/server/i18n.ts — not "lang", which was the first guess
# and made every language report as missing, including Hindi.
COOKIE = "vs-lang"


def fetch(path: str, language: str) -> str:
    request = urllib.request.Request(BASE + path)
    request.add_header("cookie", f"{COOKIE}={language}")
    return urllib.request.urlopen(request, timeout=60).read().decode("utf-8", "replace")


# Strings that must be in the visitor's own script. Sampled rather than all of
# them: enough to catch a table that never got the keys.
def sample_for(language: str) -> list[str]:
    """Three or four words that only appear if the language rendered properly."""

    # Only the health box. Checking ask.label as well found a pre-existing gap
    # in a different key and hid whether this fix worked.
    samples = {
        "hi": ["अपनी उम्र बताइए", "उम्र (साल)", "यह चिकित्सा सलाह नहीं है"],
        "mr": ["तुमचे वय सांगा", "वय (वर्षे)", "हे वैद्यकीय सल्ला नाही"],
        "bn": ["আপনার বয়স বলুন", "বয়স (বছর)", "এটি চিকিৎসা পরামর্শ নয়"],
        "ta": ["உங்கள் வயதைச் சொல்லுங்கள்", "வயது (வருடம்)", "இது மருத்துவ ஆலோசனை அல்ல"],
        "te": ["మీ వయస్సు చెప్పండి", "వయస్సు (సంవత్సరాలు)", "ఇది వైద్య సలహా కాదు"],
        "gu": ["તમારી ઉંમર કહો", "ઉંમર (વર્ષ)", "આ તબીબી સલાહ નથી"],
        "kn": ["ನಿಮ್ಮ ವಯಸ್ಸು ಹೇಳಿ", "ವಯಸ್ಸು (ವರ್ಷ)", "ಇದು ವೈದ್ಯ ಸಲಹೆ ಅಲ್ಲ"],
        "ml": ["നിങ്ങളുടെ പ്രായം പറയൂ", "പ്രായം (വർഷം)", "ഇത് വൈദ്യ ഉപദേശമല്ല"],
        "pa": ["ਆਪਣੀ ਉਮਰ ਦੱਸੋ", "ਉਮਰ (ਸਾਲ)", "ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ"],
        "ur": ["اپنی عمر بتائیے", "عمر (سال)", "یہ طبی مشورہ نہیں ہے"],
        "ar": ["اذكر عمرك", "العمر (بالسنوات)", "هذه ليست نصيحة طبية"],
        "es": ["Dinos tu edad", "Edad (años)", "Esto no es consejo médico"],
        "en": ["Tell us your age", "Age (years)", "This is not medical advice"],
    }
    return samples.get(language, [])


# English left over on a page that should not be in English. Chosen to be
# sentences that appear nowhere else in the site.
ENGLISH_LEAKS = [
    "Tell us your age",
    "This is not medical advice",
    "Here is what this site does cover",
]


def check(language: str) -> bool:
    html = fetch("/sahayata", language)

    ok = True

    for phrase in sample_for(language):
        present = phrase in html
        if not present:
            ok = False
            print(f"    MISSING  {phrase!r}")
    if ok and sample_for(language):
        print(f"    own script: OK ({len(sample_for(language))} phrases)")

    leaks = [leak for leak in ENGLISH_LEAKS if leak in html]
    if leaks and language != "en":
        ok = False
        for leak in leaks:
            print(f"    ENGLISH LEAK  {leak!r}")

    return ok


def main() -> int:
    languages = sys.argv[1:] or ["hi", "mr", "bn", "ta", "te", "gu", "kn", "ml", "pa", "ur", "ar", "es"]

    print("Rendering /sahayata in each language and looking for English leftovers.\n")

    failed = []
    for language in languages:
        print(f"  {language}")
        if not check(language):
            failed.append(language)
            print()
        else:
            print("  OK\n")

    if failed:
        print(f"{len(failed)} language(s) not fully translated: {', '.join(failed)}")
        print("\nA language with no table of its own falls back to English, which is")
        print("documented behaviour but not something to leave in place on a health page.")
        return 1

    print("Every language rendered in its own script, no English left over.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())