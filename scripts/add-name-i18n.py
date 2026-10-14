import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

if "'account.name'" in text:
    print("already added")
    raise SystemExit(0)

TABLE_ORDER = [
    ("HINDI", "hi"), ("ENGLISH", "en"), ("BENGALI", "bn"), ("TAMIL", "ta"),
    ("TELUGU", "te"), ("MARATHI", "mr"), ("GUJARATI", "gu"), ("KANNADA", "kn"),
    ("MALAYALAM", "ml"), ("PUNJABI", "pa"), ("URDU", "ur"), ("ARABIC", "ar"),
    ("SPANISH", "es"),
]

T = {
    "account.name": [
        "आपका नाम",
        "Your name",
        "আপনার নাম",
        "உங்கள் பெயர்",
        "మీ పేరు",
        "तुमचे नाव",
        "તમારું નામ",
        "ನಿಮ್ಮ ಹೆಸರು",
        "നിങ്ങളുടെ പേര്",
        "ਤੁਹਾਡਾ ਨਾਮ",
        "آپ کا نام",
        "اسمك",
        "Tu nombre",
    ],
    "account.namePlaceholder": [
        "जैसे: सीता देवी",
        "e.g. Sita Devi",
        "যেমন: সীতা দেবী",
        "எ.கா. சீதா தேவி",
        "ఉదా. సీతా దేవి",
        "उदा. सीता देवी",
        "દા.ત. સીતા દેવી",
        "ಉದಾ. ಸೀತಾ ದೇವಿ",
        "ഉദാ. സീത ദേവി",
        "ਉਦਾ. ਸੀਤਾ ਦੇਵੀ",
        "مثلاً سیتا دیوی",
        "مثلاً سيدة ديفى",
        "p. ej. Sita Devi",
    ],
    "account.nameHint": [
        "यह आपकी पहचान के लिए है। कोई भी नाम चलेगा, और यह ज़रूरी नहीं है।",
        "So we know who you are. Any name will do, and it is not required.",
        "যাতে আমরা জানি আপনি কে। যেকোনো নাম চলবে, এবং এটি আবশ্যক নয়।",
        "நீங்கள் யார் என்பதை அறிய. எந்தப் பெயரும் போதும், இது தேவையில்லை.",
        "మీరు ఎవరో తెలుసుకోవడానికి. ఏ పేరైనా పోతుంది, ఇది అవసరం లేదు.",
        "हे कळणून आपण कोण आहात. कोणताही नाव चालेल, आणि हे आवश्यक नाही.",
        "આપણે કોણ છો તે જાણવા. કોઈપણ નામ ચાલશે, અને આ જરૂરી નથી.",
        "ನೀವು ಯಾರು ಎಂದು ತಿಳಿಯಲು. ಯಾವುದೇ ಹೆಸರು ಸ್ವೀಕರಿಸಿದರೂ, ಇದು ಅಗತ್ಯವಿಲ್ಲ.",
        "നിങ്ങൾ ആരാണെന്ന് അറിയാൻ. ഏത് പേരും സ്വീകരിക്കും, ഇത് ആവശ്യമല്ല.",
        "ਤੁਸੀਂ ਕੌਣ ਹੋ ਇਹ ਜਾਣਣ ਲਈ। ਕੋਈ ਵੀ ਨਾਮ ਚੱਲੇਗਾ, ਅਤੇ ਇਹ ਲੋੜੀਂਦਾ ਨਹੀਂ।",
        "یہ جاننے کے لیے کہ آپ کون ہیں۔ کوئی بھی نام چلے گا، اور یہ ضروری نہیں۔",
        "حتى نعرف من أنت. أي اسم سيفي، وليس مطلوبًا.",
        "Para saber quién eres. Cualquier nombre sirve y no es obligatorio.",
    ],
}


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


# Each table is located by its own header and edited in place. A shared search
# loop put thirteen copies of one key into the first table last time.
for name, code in TABLE_ORDER:
    header = re.search(r"const " + name + r": Record<string, string> = \{", text)
    if not header:
        raise SystemExit(f"table {name} not found")

    end = header.end()

    entries = []
    for key, values in T.items():
        entries.append("  '%s': '%s'," % (key, escape(values[TABLE_ORDER.index((name, code))])))

    text = text[:end] + "\n" + "\n".join(entries) + "\n" + text[end:]
    print("  %-12s added %d keys" % (name, len(T)))

io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

print()
print("  Added %d name keys to %d tables" % (len(T), len(TABLE_ORDER)))