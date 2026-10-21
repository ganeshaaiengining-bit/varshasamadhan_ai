"""
The licence names a visitor reads under every library card.

    python scripts/_lib_licence_names.py

Five of the seven licences carry an English sentence as their name — "Public
domain", "Government of India", "Creative Commons (mixed)", "Free to read" — and
that sentence is printed on the card whatever language has been chosen. It was
the last English left on the page: the title above it, the line under it and the
licence explanation below it had all been translated, and then
"<strong>Free to read</strong>" appeared in the middle of a Tamil card.

The two that are pure acronyms (CC BY 4.0, CC BY-SA 4.0) are deliberately not
given a key: they are matched by eye against the licence text on the page they
come from, and translating them would only break that.

Re-runnable: a key already present is left alone.
"""

import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
I18N = os.path.join(HERE, "..", "src", "content", "i18n.ts")

VALUES = {
    "lib.licence.ccZero.name": {
        "hi": "CC0 / सार्वजनिक डोमेन",
        "en": "CC0 / Public domain",
        "bn": "CC0 / পাবলিক ডোমেইন",
        "ta": "CC0 / பப்ளிக் டொமைன்",
        "te": "CC0 / పబ్లిక్ డొమైన్",
        "mr": "CC0 / पब्लिक डोमेन",
        "gu": "CC0 / પબ્લિક ડોમેન",
        "kn": "CC0 / ಪಬ್ಲಿಕ್ ಡೊಮೇನ್",
        "ml": "CC0 / പബ്ലിക് ഡൊമെയ്ൻ",
        "pa": "CC0 / ਪਬਲਿਕ ਡੋਮੇਨ",
        "ur": "CC0 / پبلک ڈومین",
        "ar": "CC0 / النطاق العام",
        "es": "CC0 / Dominio público",
    },
    "lib.licence.pd.name": {
        "hi": "सार्वजनिक डोमेन",
        "en": "Public domain",
        "bn": "পাবলিক ডোমেইন",
        "ta": "பப்ளிக் டொமைன்",
        "te": "పబ్లిక్ డొమైన్",
        "mr": "पब्लिक डोमेन",
        "gu": "પબ્લિક ડોમેન",
        "kn": "ಪಬ್ಲಿಕ್ ಡೊಮೇನ್",
        "ml": "പബ്ലിക് ഡൊമെയ്ൻ",
        "pa": "ਪਬਲਿਕ ਡੋਮੇਨ",
        "ur": "پبلک ڈومین",
        "ar": "النطاق العام",
        "es": "Dominio público",
    },
    "lib.licence.govtIndia.name": {
        "hi": "भारत सरकार",
        "en": "Government of India",
        "bn": "ভারত সরকার",
        "ta": "இந்திய அரசு",
        "te": "భారత ప్రభుత్వం",
        "mr": "भारत सरकार",
        "gu": "ભારત સરકાર",
        "kn": "ಭಾರತ ಸರ್ಕಾರ",
        "ml": "ഇന്ത്യൻ സർക്കാർ",
        "pa": "ਭਾਰਤ ਸਰਕਾਰ",
        "ur": "ہندوستان حکومت",
        "ar": "حكومة الهند",
        "es": "Gobierno de la India",
    },
    "lib.licence.creativeCommons.name": {
        "hi": "क्रिएटिव कॉमन्स (मिश्रित)",
        "en": "Creative Commons (mixed)",
        "bn": "ক্রিয়েটিভ কমন্স (মিশ্র)",
        "ta": "கிரியேட்டிவ் காமன்ஸ் (கலவை)",
        "te": "క్రియేటివ్ కామన్స్ (మిశ్రమ)",
        "mr": "क्रिएटिव्ह कॉमन्स (मिश्रित)",
        "gu": "ક્રિએટિવ કોમન્સ (મિશ્ર)",
        "kn": "ಕ್ರಿಯೇಟಿವ್ ಕಾಮನ್ಸ್ (ಮಿಶ್ರ)",
        "ml": "ക്രിയേറ്റീവ് കോമൺസ് (മിശ്രിതം)",
        "pa": "ਕ੍ਰਿਏਟਿਵ ਕਾਮਨਜ਼ (ਮਿਸ਼ਰਤ)",
        "ur": "کری ایٹو کامنز (آمیختہ)",
        "ar": "كرييتف كومنز (مختلط)",
        "es": "Creative Commons (mixto)",
    },
    "lib.licence.freeToRead.name": {
        "hi": "पढ़ने के लिए स्वतंत्र",
        "en": "Free to read",
        "bn": "পড়ার জন্য মুক্ত",
        "ta": "படிக்க இலவசம்",
        "te": "చదవడానికి ఉచితం",
        "mr": "वाचण्यासाठी मोफत",
        "gu": "વાંચવા માટે મફત",
        "kn": "ಓದಲು ಉಚಿತ",
        "ml": "വായിക്കാൻ സൗജന്യം",
        "pa": "ਪੜ੍ਹਨ ਲਈ ਮੁਫ਼ਤ",
        "ur": "پڑھنے کے لیے مفت",
        "ar": "مجاناً للقراءة",
        "es": "Gratis para leer",
    },
}

TABLES = {
    "hi": "HINDI", "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL",
    "te": "TELUGU", "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA",
    "ml": "MALAYALAM", "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC",
    "es": "SPANISH",
}


def escape(value):
    return value.replace("\\", "").replace("'", "\\'")


def main():
    source = io.open(I18N, encoding="utf-8").read()
    blocks = {table: [] for table in TABLES.values()}
    for key, per_language in VALUES.items():
        for code, table in TABLES.items():
            if "'%s':" % key in source:
                continue
            blocks[table].append("  '%s': '%s'," % (key, escape(per_language[code])))

    lines = source.split("\n")
    out = []
    current = None
    added = {table: 0 for table in TABLES.values()}
    for line in lines:
        match = re.match(r"^const (\w+)", line)
        if match:
            current = match.group(1)
        out.append(line)
        if "'home.metaTitle':" in line and current in added and blocks.get(current):
            out.extend(blocks[current])
            added[current] += len(blocks[current])

    for table, count in added.items():
        if count and count != len(VALUES):
            raise SystemExit("%s got %d of %d keys" % (table, count, len(VALUES)))

    io.open(I18N, "w", encoding="utf-8", newline="\n").write("\n".join(out))
    print("licence name keys added: %d across %d tables"
          % (sum(len(v) for v in blocks.values()), len(TABLES)))


if __name__ == "__main__":
    main()
