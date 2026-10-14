import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

if "'jgd.placeSearch'" in text:
    print("already added")
    raise SystemExit(0)

TABLE_ORDER = [
    "HINDI", "ENGLISH", "BENGALI", "TAMIL", "TELUGU", "MARATHI",
    "GUJARATI", "KANNADA", "MALAYALAM", "PUNJABI", "URDU", "ARABIC", "SPANISH",
]

T = {
    "jgd.placeSearch": [
        "शहर का नाम लिखिए",
        "Type the name of your town",
        "আপনার শহরের নাম লিখুন",
        "உங்கள் ஊரின் பெயரைத் தட்டச்சு செய்யுங்கள்",
        "మీ ఊరి పేరు టైప్ చేయండి",
        "तुमच्या शहराचे नाव लिहा",
        "તમારા શહેરનું નામ લખો",
        "ನಿಮ್ಮ ಊರಿನ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ",
        "നിങ്ങളുടെ ഊരിന്റെ പേര് ടൈപ്പ് ചെയ്യുക",
        "ਆਪਣੇ ਸ਼ਹਿਰ ਦਾ ਨਾਮ ਲਿਖੋ",
        "اپنے شہر کا نام لکھیں",
        "اكتب اسم مدينتك",
        "Escribe el nombre de tu pueblo",
    ],
    "jgd.placeNoMatch": [
        "यह शहर नहीं मिला। कोई और नाम लिखिए।",
        "That town is not in the list. Try another name.",
        "এই শহরটি তালিকায় নেই। অন্য নাম লিখুন।",
        "இந்த ஊர் பட்டியலில் இல்லை. வேறு பெயரைத் தட்டச்சு செய்யுங்கள்.",
        "ఆ ఊరు జాబితాలో లేదు. వేరే పేరు ఇవ్వండి.",
        "हे शहर या यादीत नाही. दुसरे नाव वापरा.",
        "આ શહેર યાદીમાં નથી. બીજું નામ લખો.",
        "ಆ ಊರು ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ. ಬೇರೆ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ.",
        "ആ ഊര് പട്ടിയില് ഇല്ല. മറ്റൊരു പേര് ടൈപ്പ് ചെയ്യുക.",
        "ਇਹ ਸ਼ਹਿਰ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ। ਹੋਰ ਨਾਮ ਲਿਖੋ।",
        "یہ شہر فہرست میں نہیں۔ دوسرا نام لکھیں۔",
        "هذه المدينة ليست في القائمة. جرّب اسماً آخر.",
        "Ese pueblo no está en la lista. Prueba otro nombre.",
    ],
}


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


for index, name in enumerate(TABLE_ORDER):
    header = re.search(r"const " + name + r": Record<string, string> = \{", text)
    if not header:
        raise SystemExit(f"table {name} not found")

    entries = "\n".join(
        "  '%s': '%s'," % (key, escape(values[index]))
        for key, values in T.items()
    )

    text = text[: header.end()] + "\n" + entries + "\n" + text[header.end():]
    print("  %-12s added %d keys" % (name, len(T)))

io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

print()
print("  Added %d keys to %d tables" % (len(T), len(TABLE_ORDER)))