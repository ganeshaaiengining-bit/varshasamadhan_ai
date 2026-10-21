import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

"""
Fetch the site as a visitor would and report any visible Latin text in a
language not written in Latin.

    python scripts/check-rendered-language.py

WHY THIS EXISTS, AND WHY IT REPLACED A STATIC SCAN

The first version of this check walked the source looking for Latin strings and
reported four hundred hits, every one of them an import path, a Tailwind class
or a Prisma column name. It was measuring the wrong thing: whether a string is
Latin, rather than whether a visitor can read it.

That distinction is not academic. The bug that prompted this file was
'attach.button' reading "Apna document ya photo lagayein" on the Hindi home
page, and the static check-latin-leaks.py had reported i18n.ts as clean
minutes earlier — because it only looked inside the translation tables, and
this string was never in one.

So this reads the pages. A cookie sets the language, the response is stripped
of tags and scripts, and what is left is what someone would actually read. A
hit here is a hit a visitor would see.

WHAT COUNTS AS A FAULT

  - a run of three or more Latin letters inside a non-Latin page, excluding
    acronyms the languages genuinely use untranslated: AI, SMS, PDF, ATM, PIN,
    OTP, UPI, QR, App
  - a Devanagari answer answered in Latin, which is the same failure one level up

Base64 data in an inline script is stripped first. Href values are dropped
along with tags, so a link target in Latin is not counted while link text is.

WHY EVERY LANGUAGE IS FETCHED

Because the failure is not always in the same place. One string missing from
one table shows up in exactly one language, and a check that only looked at
Hindi would have found this bug today by luck rather than by design.
"""

BASE = "http://127.0.0.1:3001"

PAGES = [
    ("/", "home"),
    ("/sahayata", "help"),
    ("/madad", "contact"),
    ("/pustakalay", "library"),
    ("/smriti", "memory"),
    ("/samaroh", "reference"),
    ("/janam-ghathe", "birthchart"),
]

# Written in Latin, so Latin text is correct on these and is not a fault.
LATIN_LANGUAGES = {"en", "es", "fr", "de", "pt"}

LANGUAGES = [
    ("hi", "Hindi"),
    ("bn", "Bengali"),
    ("ta", "Tamil"),
    ("te", "Telugu"),
    ("mr", "Marathi"),
    ("gu", "Gujarati"),
    ("kn", "Kannada"),
    ("ml", "Malayalam"),
    ("pa", "Punjabi"),
    ("ur", "Urdu"),
    ("ar", "Arabic"),
]

# Languages in the switcher with no translation table behind them are removed
# rather than listed, so this list matches src/content/i18n.ts. Russian and
# Chinese used to be here: they rendered English and Hindi together, 215 stray
# words on the home page alone, because no table existed for them.

ACRONYMS = {
    "AI", "SMS", "PDF", "DOC", "DOCX", "XLS", "ATM", "PIN", "OTP", "UPI",
    "QR", "App", "WhatsApp", "YouTube", "Google", "Android", "iOS", "IV",
    # The site's own name, written in Latin capitals in every language by
    # the brief itself. Counting it as a fault failed every page in every
    # language, and a check that never passes cannot find anything.
    "VARSHA", "SAMADHAN",
    "MB", "GB", "KG", "CM", "MM", "PM", "AM", "VIP", "OK", "TV", "URL",
}

TAG = re.compile(r"<[^>]*>")
SCRIPT = re.compile(r"<(script|style|svg)[\s\S]*?</\1>", re.I)
LATIN_RUN = re.compile(r"\b[A-Za-z][A-Za-z'’-]{2,}\b")
DATA_URI = re.compile(r"data:[^\s\"')]+")


def visible(html: str) -> str:
    html = SCRIPT.sub(" ", html)
    html = DATA_URI.sub(" ", html)
    text = TAG.sub(" ", html)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&quot;", '"')
    text = re.sub(r"\s+", " ", text)
    return text


def fetch(path: str, language: str) -> str:
    request = urllib.request.Request(
        f"{BASE}{path}",
        headers={"Cookie": f"vs-lang={language}", "User-Agent": "check-rendered/1.0"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, "replace")


def main() -> int:
    print()
    print("Rendered pages, read as a visitor reads them")
    print("=" * 70)
    print()

    faults = 0
    pages_ok = 0

    for path, label in PAGES:
        for code, name in LANGUAGES:
            try:
                html = fetch(path, code)
            except urllib.error.HTTPError as error:
                print(f"  {label:<10} {name:<10} HTTP {error.code}")
                faults += 1
                continue
            except Exception as error:
                print(f"  {label:<10} {name:<10} error {str(error)[:40]}")
                faults += 1
                continue

            text = visible(html)
            words = [w for w in LATIN_RUN.findall(text) if w not in ACRONYMS]

            if not words:
                pages_ok += 1
                continue

            # Count the distinct offenders rather than every repeat, and show
            # where each one is so it can be found.
            unique = sorted(set(words))
            faults += len(unique)
            print(f"  {label:<10} {name:<10} {len(words)} latin words: {', '.join(unique[:12])}")
            # A sample of the sentence, so the string is findable by eye.
            first = words[0]
            at = text.find(first)
            if at > 0:
                print(f"             ...{text[max(0, at - 50):at + 70]}...")

    total = len(PAGES) * len(LANGUAGES)
    print()
    print(f"  {pages_ok} of {total} page-and-language combinations are clean")
    if faults:
        print(f"  {faults} distinct Latin string(s) a visitor would see")
    print()
    return 0 if faults == 0 else 1


if __name__ == "__main__":
    import urllib.error  # noqa: E402  used inside main's except clauses

    raise SystemExit(main())