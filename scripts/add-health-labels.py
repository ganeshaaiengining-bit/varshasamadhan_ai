"""
Translate the health box's surrounding text into the other eleven languages.

    python scripts/add-health-labels.py

The health box was added with its 92 strings in the Hindi and English tables
only, so on every other language the page fell back to English. A Marathi
visitor saw "Tell us your age" and "This is not medical advice" sitting inside an
otherwise Marathi page — on a health page, which is the one place on the site
where a string in the wrong language is not a cosmetic problem.

This covers the 20 strings that are *not* health questions:

    12 chrome    heading, intro, age label, years, band label, the disclaimer,
                 the three emergency labels and the privacy line
     8 band      the "0 – 2 years" … "76 – 100 years" labels

The remaining 72 are the four tap-to-ask questions per band. Those are left for a
separate pass on purpose: a question about a nine-month-old's fever is health
content, and health content in a language nobody on the team speaks should be
written by someone who speaks it rather than produced in bulk here. The box
renders them in English until that pass is done, which is honest — a Marathi
visitor sees an English question rather than a plausible wrong one.

The emergency numbers are keyed by the number itself. 112 is the emergency
number, 108 the ambulance, 181 the women's helpline, and a label that drifts off
its number sends someone to the wrong service. Asserted below rather than trusted.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

TABLES = {
    "mr": "MARATHI",
    "bn": "BENGALI",
    "ta": "TAMIL",
    "te": "TELUGU",
    "gu": "GUJARATI",
    "kn": "KANNADA",
    "ml": "MALAYALAM",
    "pa": "PUNJABI",
    "ur": "URDU",
    "ar": "ARABIC",
    "es": "SPANISH",
}

CHROME = {
    "mr": {
        "health.heading": "तुमचे वय सांगा",
        "health.intro": "या वयातील लोकांचे सर्वाधिक विचारले जाणारे प्रश्न. एखादा वर क्लिक केल्यावर तो खालील डब्यात भरला जातो, मग विचारा.",
        "health.ageLabel": "वय (वर्षे)",
        "health.years": "वर्षे",
        "health.bandsLabel": "वयानुसार निवडा",
        "health.notAdviceStrong": "हे वैद्यकीय सल्ला नाही.",
        "health.notAdvice": "कोणतेही औषध सुरू करू नका किंवा बंद करू नका — आधी डॉक्टरांचा सल्ला घ्या.",
        "health.emergencyStrong": "आणीबाणीत फोन करा:",
        "health.emergencyCall": "(आणीबाणी)",
        "health.emergencyAmbulance": "(रुग्णवाहिका)",
        "health.emergencyWomen": "(महिला मदतवाहिनी)",
        "health.privacy": "नाव किंवा पत्ता लिहिण्याची गरज नाही.",
    },
    "bn": {
        "health.heading": "আপনার বয়স বলুন",
        "health.intro": "প্রতিটি বয়সের মানুষ সবচেয়ে বেশি যে প্রশ্নগুলো করেন। যেকোনো একটিতে চাপ দিলে সেটি নিচের ঘরে বসবে, তারপর জিজ্ঞাসা করুন।",
        "health.ageLabel": "বয়স (বছর)",
        "health.years": "বছর",
        "health.bandsLabel": "বয়স অনুযায়ী বেছে নিন",
        "health.notAdviceStrong": "এটি চিকিৎসা পরামর্শ নয়।",
        "health.notAdvice": "কোনো ওষুধ শুরু বা বন্ধ করবেন না — আগে ডাক্তারের পরামর্শ নিন।",
        "health.emergencyStrong": "জরুরি অবস্থায় ফোন করুন:",
        "health.emergencyCall": "(জরুরি)",
        "health.emergencyAmbulance": "(অ্যাম্বুলেন্স)",
        "health.emergencyWomen": "(নারী সহায়তা নম্বর)",
        "health.privacy": "নাম বা ঠিকানা লিখতে হবে না।",
    },
    "ta": {
        "health.heading": "உங்கள் வயதைச் சொல்லுங்கள்",
        "health.intro": "ஒவ்வொரு வயதினரும் அதிகம் கேட்பது கேள்விகள். ஏதொன்றைத் தட்டினால் அது கீழே இடத்தில் நிரம்பி, பின்னர் கேளுங்கள்.",
        "health.ageLabel": "வயது (வருடம்)",
        "health.years": "வருடம்",
        "health.bandsLabel": "வயதால் தேர்வு செய்யுங்கள்",
        "health.notAdviceStrong": "இது மருத்துவ ஆலோசனை அல்ல.",
        "health.notAdvice": "எந்த மருந்தையும் தொடங்கவோ நிறுத்தவோ மாட்டீர்கள் — முதலில் மருத்துவரைப் பாருங்கள்.",
        "health.emergencyStrong": "அவசர நிலையில் அழைக்கவும்:",
        "health.emergencyCall": "(அவசரம்)",
        "health.emergencyAmbulance": "(ஆம்புலன்ஸ்)",
        "health.emergencyWomen": "(பெண்கள் உதவி எண்)",
        "health.privacy": "பெயர் அல்லது முகவரி எழுதத் தேவையில்லை.",
    },
    "te": {
        "health.heading": "మీ వయస్సు చెప్పండి",
        "health.intro": "ఏ వయస్సుల వారు అత్యధికంగా అడిగే ప్రశ్నలు ఇవి. ఏదైనా నొక్కండి అది దిగువ బాక్స్‌లో నింపుతుంది, తర్వాత అడగండి.",
        "health.ageLabel": "వయస్సు (సంవత్సరాలు)",
        "health.years": "సంవత్సరాలు",
        "health.bandsLabel": "వయస్సు ప్రకారం ఎంచుకోండి",
        "health.notAdviceStrong": "ఇది వైద్య సలహా కాదు.",
        "health.notAdvice": "ఏ మందులను మొదలు పెట్టవద్దు లేదా ఆపవద్దు — ముందుగా వైద్యుడిని సంప్రదించండి.",
        "health.emergencyStrong": "అత్యవసరంలో ఫోన్ చేయండి:",
        "health.emergencyCall": "(అత్యవసరం)",
        "health.emergencyAmbulance": "(అంబులెన్స్)",
        "health.emergencyWomen": "(మహిళా సహాయం)",
        "health.privacy": "పేరు లేదా చిరునామా రాయాల్సిన అవసరం లేదు.",
    },
    "gu": {
        "health.heading": "તમારી ઉંમર કહો",
        "health.intro": "આ ઉંમરના લોકો સૌથી વધુ પૂછતા હોય એવા પ્રશ્નો. કોઈપણ એક પર ક્લિક કરો, તે નીચે બોક્સમાં ભરાઈ જશે, પછી પૂછો.",
        "health.ageLabel": "ઉંમર (વર્ષ)",
        "health.years": "વર્ષ",
        "health.bandsLabel": "ઉંમર પ્રમાણે પસંદ કરો",
        "health.notAdviceStrong": "આ તબીબી સલાહ નથી.",
        "health.notAdvice": "કોઈ દવા શરૂ કરો કે બંધ કરો નહીં — પહેલા ડૉક્ટરને મળો.",
        "health.emergencyStrong": "કટોકટીમાં ફોન કરો:",
        "health.emergencyCall": "(કટોકટી)",
        "health.emergencyAmbulance": "(એમ્બ્યુલન્સ)",
        "health.emergencyWomen": "(મહિલા મદદ નંબર)",
        "health.privacy": "નામ કે સરનામું લખવાની જરૂર નથી.",
    },
    "kn": {
        "health.heading": "ನಿಮ್ಮ ವಯಸ್ಸು ಹೇಳಿ",
        "health.intro": "ಈ ವಯಸ್ಸಿನ ಜನರು ಹೆಚ್ಚು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು ಇವೆ. ಯಾವುದನ್ನಾದರೂ ಒತ್ತಿದರೆ ಅದು ಕೆಳಗಿನ ಪೆಟ್ಟಿಗೆಗೆ ಹೋಗುತ್ತದೆ, ನಂತರ ಕೇಳಿ.",
        "health.ageLabel": "ವಯಸ್ಸು (ವರ್ಷ)",
        "health.years": "ವರ್ಷ",
        "health.bandsLabel": "ವಯಸ್ಸಿನ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ",
        "health.notAdviceStrong": "ಇದು ವೈದ್ಯ ಸಲಹೆ ಅಲ್ಲ.",
        "health.notAdvice": "ಯಾವುದೇ ಔಷಧಿ ಪ್ರಾರಂಭಿಸಬೇಡಿ ಅಥವಾ ನಿಲ್ಲಿಸಬೇಡಿ — ಮೊದಲು ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ.",
        "health.emergencyStrong": "ತುರ್ತು ಸಂಭವದಲ್ಲಿ ಫೋನ್ ಮಾಡಿ:",
        "health.emergencyCall": "(ತುರ್ತು ಸಂಭವ)",
        "health.emergencyAmbulance": "(ಅಂಬ್ಯುಲೆನ್ಸ್)",
        "health.emergencyWomen": "(ಮಹಿಳಾ ಸಹಾಯ ಸಂಖ್ಯೆ)",
        "health.privacy": "ಹೆಸರು ಅಥವಾ ವಿಳಾಸ ಬರೆಯುವ ಅಗತ್ಯವಿಲ್ಲ.",
    },
    "ml": {
        "health.heading": "നിങ്ങളുടെ പ്രായം പറയൂ",
        "health.intro": "ഈ പ്രായത്തിലുള്ളവർ ഏറ്റവും കൂടുതൽ ചോദിക്കുന്ന ചോദ്യങ്ങൾ. ഏതെങ്കിലും അമർത്തിയാಲ് അത് താഴെയുള്ള ബോക്സിൽ നിറയും, ശേഷം ചോദിക്കൂ.",
        "health.ageLabel": "പ്രായം (വർഷം)",
        "health.years": "വർഷം",
        "health.bandsLabel": "പ്രായം അനുസരിച്ച് തിരഞ്ഞെടുക്കുക",
        "health.notAdviceStrong": "ഇത് വൈദ്യ ഉപദേശമല്ല.",
        "health.notAdvice": "ഏത് മരുന്നും തുടങ്ങുകയോ നിർത്തുകയോ ചെയ്യരുത് — ആദ്യം ഡോക്ടറെ കാണുക.",
        "health.emergencyStrong": "അടിയന്തരത്തിൽ വിളിക്കുക:",
        "health.emergencyCall": "(അടിയന്തരം)",
        "health.emergencyAmbulance": "(ആംബുലൻസ്)",
        "health.emergencyWomen": "(വനിതാ സഹായ നമ്പർ)",
        "health.privacy": "പേരോ വിലാസമോ എഴുതേണ്ടതില്ല.",
    },
    "pa": {
        "health.heading": "ਆਪਣੀ ਉਮਰ ਦੱਸੋ",
        "health.intro": "ਇਸ ਉਮਰ ਦੇ ਲੋਕਾਂ ਦੁਆਰਾਂ ਸਭ ਤੋਂ ਵੱਧ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ ਇਹ ਹਨ। ਕੋਈ ਵੀ ਦਬਾਓ, ਇਹ ਹੇਠਾਂ ਖਾਲੇ ਵਿੱਚ ਭਰ ਜਾਵੇਗਾ, ਫਿਰ ਪੁੱਛੋ।",
        "health.ageLabel": "ਉਮਰ (ਸਾਲ)",
        "health.years": "ਸਾਲ",
        "health.bandsLabel": "ਉਮਰ ਅਨੁਸਾਰ ਚੁਣੋ",
        "health.notAdviceStrong": "ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ।",
        "health.notAdvice": "ਕੋਈ ਦਵਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਨਾ ਕਰੋ — ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ।",
        "health.emergencyStrong": "ਐਮਰਜੈਂਸੀ ਹਾਲਤ ਵਿੱਚ ਫ਼ੋਨ ਕਰੋ:",
        "health.emergencyCall": "(ਐਮਰਜੈਂਸੀ)",
        "health.emergencyAmbulance": "(ਐਂਬੂਲੰਸ)",
        "health.emergencyWomen": "(ਔਰਤ ਹੈਲਪਲਾਈਨ)",
        "health.privacy": "ਨਾਮ ਜਾਂ ਪਤਾ ਲਿਖਣ ਦੀ ਲੋੜ ਨਹੀਂ।",
    },
    "ur": {
        "health.heading": "اپنی عمر بتائیے",
        "health.intro": "اس عمر کے لوگوں کے سب سے زیادہ پوچھے جانے والے سوالات یہ ہیں۔ کوئی بھی ایک دبائیں، وہ نیچے خانے میں بھر جائے گا، پھر پوچھ لیں۔",
        "health.ageLabel": "عمر (سال)",
        "health.years": "سال",
        "health.bandsLabel": "عمر کے مطابق منتخب کریں",
        "health.notAdviceStrong": "یہ طبی مشورہ نہیں ہے۔",
        "health.notAdvice": "کوئی دوا شروع یا بند نہ کریں — پہلے ڈاکٹر سے ملیں۔",
        "health.emergencyStrong": "ہنگامی صورتحال میں فون کریں:",
        "health.emergencyCall": "(ہنگامی)",
        "health.emergencyAmbulance": "(ایمبولینس)",
        "health.emergencyWomen": "(خواتین کی مدد کا نمبر)",
        "health.privacy": "نام یا پتہ لکھنے کی ضرورت نہیں۔",
    },
    "ar": {
        "health.heading": "اذكر عمرك",
        "health.intro": "هذه أكثر الأسئلة التي يطرحها الناس في هذا العمر. اضغط على أي سؤال فيملأ الخانة بالأسفل، ثم اسأل.",
        "health.ageLabel": "العمر (بالسنوات)",
        "health.years": "سنوات",
        "health.bandsLabel": "اختر حسب العمر",
        "health.notAdviceStrong": "هذه ليست نصيحة طبية.",
        "health.notAdvice": "لا تبدأ أي دواء ولا توقفه — راجع الطبيب أولاً.",
        "health.emergencyStrong": "في الحالات الطارئة اتصل على:",
        "health.emergencyCall": "(الطوارئ)",
        "health.emergencyAmbulance": "(الإسعاف)",
        "health.emergencyWomen": "(خط مساعدة المرأة)",
        "health.privacy": "لا حاجة لكتابة الاسم أو العنوان.",
    },
    "es": {
        "health.heading": "Dinos tu edad",
        "health.intro": "Estas son las preguntas que más hacen las personas de esta edad. Toca cualquiera y se rellenará el recuadro de abajo; luego pregunta.",
        "health.ageLabel": "Edad (años)",
        "health.years": "años",
        "health.bandsLabel": "Elige por edad",
        "health.notAdviceStrong": "Esto no es consejo médico.",
        "health.notAdvice": "No empieces ni dejes ninguna medicina; consulta antes con un médico.",
        "health.emergencyStrong": "En una emergencia, llama al:",
        "health.emergencyCall": "(emergencias)",
        "health.emergencyAmbulance": "(ambulancia)",
        "health.emergencyWomen": "(línea de ayuda a la mujer)",
        "health.privacy": "No hace falta escribir tu nombre ni tu dirección.",
    },
}

BAND_LABELS = {
    "infant": {"mr": "० – २ वर्षे", "bn": "০ – ২ বছর", "ta": "0 – 2 வருடம்", "te": "0 – 2 సంవత్సరాలు", "gu": "0 – 2 વર્ષ", "kn": "0 – 2 ವರ್ಷ", "ml": "0 – 2 വർഷം", "pa": "0 – 2 ਸਾਲ", "ur": "0 – 2 سال", "ar": "0 – 2 سنة", "es": "0 – 2 años"},
    "child": {"mr": "३ – १२ वर्षे", "bn": "৩ – ১২ বছর", "ta": "3 – 12 வருடம்", "te": "3 – 12 సంవత్సరాలు", "gu": "3 – 12 વર્ષ", "kn": "3 – 12 ವರ್ಷ", "ml": "3 – 12 വർഷം", "pa": "3 – 12 ਸਾਲ", "ur": "3 – 12 سال", "ar": "3 – 12 سنة", "es": "3 – 12 años"},
    "teen": {"mr": "१३ – १७ वर्षे", "bn": "১৩ – ১৭ বছর", "ta": "13 – 17 வருடம்", "te": "13 – 17 సంవత్సరాలు", "gu": "13 – 17 વર્ષ", "kn": "13 – 17 ವರ್ಷ", "ml": "13 – 17 വർഷം", "pa": "13 – 17 ਸਾਲ", "ur": "13 – 17 سال", "ar": "13 – 17 سنة", "es": "13 – 17 años"},
    "young": {"mr": "१८ – ३० वर्षे", "bn": "১৮ – ৩০ বছর", "ta": "18 – 30 வருடம்", "te": "18 – 30 సంవత్సరాలు", "gu": "18 – 30 વર્ષ", "kn": "18 – 30 ವರ್ಷ", "ml": "18 – 30 വർഷം", "pa": "18 – 30 ਸਾਲ", "ur": "18 – 30 سال", "ar": "18 – 30 سنة", "es": "18 – 30 años"},
    "middle": {"mr": "३१ – ४५ वर्षे", "bn": "৩১ – ৪৫ বছর", "ta": "31 – 45 வருடம்", "te": "31 – 45 సంవత్సరాలు", "gu": "31 – 45 વર્ષ", "kn": "31 – 45 ವರ್ಷ", "ml": "31 – 45 വർഷം", "pa": "31 – 45 ਸਾਲ", "ur": "31 – 45 سال", "ar": "31 – 45 سنة", "es": "31 – 45 años"},
    "later": {"mr": "४६ – ६० वर्षे", "bn": "৪৬ – ৬০ বছর", "ta": "46 – 60 வருடம்", "te": "46 – 60 సంవత్సరాలు", "gu": "46 – 60 વર્ષ", "kn": "46 – 60 ವರ್ಷ", "ml": "46 – 60 വർഷം", "pa": "46 – 60 ਸਾਲ", "ur": "46 – 60 سال", "ar": "46 – 60 سنة", "es": "46 – 60 años"},
    "senior": {"mr": "६१ – ७५ वर्षे", "bn": "৬১ – ৭৫ বছর", "ta": "61 – 75 வருடம்", "te": "61 – 75 సంవత్సరాలు", "gu": "61 – 75 વર્ષ", "kn": "61 – 75 ವರ್ಷ", "ml": "61 – 75 വർഷം", "pa": "61 – 75 ਸਾਲ", "ur": "61 – 75 سال", "ar": "61 – 75 سنة", "es": "61 – 75 años"},
    "elder": {"mr": "७६ – १०० वर्षे", "bn": "৭৬ – ১০০ বছর", "ta": "76 – 100 வருடம்", "te": "76 – 100 సంవత్సరాలు", "gu": "76 – 100 વર્ષ", "kn": "76 – 100 ವರ್ಷ", "ml": "76 – 100 വർഷം", "pa": "76 – 100 ਸਾਲ", "ur": "76 – 100 سال", "ar": "76 – 100 سنة", "es": "76 – 100 años"},
}

# Number, key, and the word that must appear in the value. Checked, not trusted:
# a label that drifts off its number sends someone to the wrong service during
# an emergency and looks entirely normal on the page.
EMERGENCY_CHECKS = {
    "health.emergencyCall": ("112", ["emergency", "आणीबाणी", "জরুরি", "அவசரம்", "అత్యవసరం", "કટોકટી", "ತುರ್ತು", "അടിയന്തരം", "ਐਮਰਜੈਂਸੀ", "ہنگامی", "الطوارئ", "emergencias"]),
    "health.emergencyAmbulance": ("108", ["ambulance", "ambulan", "रुग्णवाहिका", "অ্যাম্বুলেন্স", "ஆம்புலன்ஸ்", "అంబులెన్స్", "એમ્બ્યુલન્સ", "ಅಂಬ್ಯುಲೆನ್ಸ್", "ആംബുലൻസ്", "ਐਂਬੂਲੰਸ", "ایمبولینس", "الإسعاف", "ambulancia"]),
    "health.emergencyWomen": ("181", ["helpline", "hotline", "help line", "मदतवाहिनी", "সহায়তা", "உதவி", "సహాయం", "મદદ", "ಸಹಾಯ", "സഹായ", "ਹੈਲਪਲਾਈਨ", "مدد", "مساعدة", "ayuda"]),
}


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def set_key(source: str, table: str, key: str, value: str) -> tuple[str, bool]:
    """Set one key in one table. Returns whether it was already there."""
    start = re.search(r"const " + table + r"[^=]*=\s*\{", source)
    if not start:
        raise SystemExit(f"table {table} not found")

    end = source.index("\n};", start.end())
    body = source[start.end():end]

    pattern = re.compile(r"( *)'" + re.escape(key) + r"':\s*'(?:[^'\\]|\\.)*',")
    line = f"'{key}': '{esc(value)}',"

    if pattern.search(body):
        new_body, count = pattern.subn(lambda m: m.group(1) + line, body)
        if count != 1:
            raise SystemExit(f"{table}.{key} appears {count} times, expected once")
        return source[: start.end()] + new_body + source[end:], True

    return source[: start.end()] + body.rstrip() + "\n\n  " + line + "\n" + source[end:], False


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()

    # Check every emergency label before writing anything.
    print("Checking the emergency labels\n")
    for code, strings in CHROME.items():
        for key, (number, words) in EMERGENCY_CHECKS.items():
            value = strings[key]
            if not any(w.lower() in value.lower() for w in words):
                raise SystemExit(
                    f"{code}: {key} should describe {number} "
                    f"(one of {words[:4]}) but reads {value!r}"
                )
            print(f"  {number} -> {code}  {value}")
    print()

    added = 0
    for code, table in TABLES.items():
        strings = dict(CHROME[code])
        for band, labels in BAND_LABELS.items():
            strings[f"health.band.{band}.label"] = labels[code]

        count = 0
        for key, value in strings.items():
            source, existed = set_key(source, table, key, value)
            if not existed:
                count += 1
        added += count
        print(f"  {table:<10} {len(strings)} keys, {count} new")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)

    print()
    print(f"{added} new strings across {len(TABLES)} tables.")
    print()
    print("Still to translate: the 72 tap-to-ask questions (health.c.* and health.q.*).")
    print("Left for a separate pass on purpose - a question about a nine-month-old's")
    print("fever is health content, and health content in a language nobody on the")
    print("team speaks should be written by someone who speaks it.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())