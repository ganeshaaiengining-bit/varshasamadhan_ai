"""
Insert the health-box strings into the Hindi and English tables in i18n.ts.

    python scripts/add-health-keys.py

Why a script rather than a hand edit: i18n.ts is nearly three thousand lines and
the strings have to land in two specific tables. A misplaced brace is a syntax
error in a file that has to typecheck, and doing it by hand meant reading the
same shape twice.

The chips are questions the visitor would ask, never advice about what to do.
A question cannot be wrong in the way medical guidance can. See the note at the
top of src/content/health-questions.ts.

Run once. It refuses to add anything if the keys are already there.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

# ---------------------------------------------------------------------------
# Chrome around the box. Shared shape, both languages written by hand.
# ---------------------------------------------------------------------------
HINDI_CHROME = {
    "health.heading": "अपनी उम्र बताइए",
    "health.intro": "उम्र के हिसाब से जो सवाल अक्सर पूछे जाते हैं, वे यहाँ दिखेंगे। कोई बटन दबाइए — सवाल नीचे भर जाएगा, फिर पूछ लीजिए।",
    "health.ageLabel": "उम्र (साल)",
    "health.years": "साल",
    "health.bandsLabel": "उम्र के हिसाब से चुनिए",
    "health.notAdviceStrong": "यह चिकित्सा सलाह नहीं है।",
    "health.notAdvice": "कोई भी दवाई शुरू या बंद न करें — पहले डॉक्टर से मिलें।",
    "health.emergencyStrong": "आपातकाल में फोन कीजिए:",
    "health.emergencyCall": "(आपातकाल)",
    "health.emergencyAmbulance": "(एम्बुलेंस)",
    "health.emergencyWomen": "(महिला हेल्पलाइन)",
    "health.privacy": "कोई नाम या पता लिखने की ज़रूरत नहीं है।",
}

ENGLISH_CHROME = {
    "health.heading": "Tell us your age",
    "health.intro": "The questions people of each age ask most often. Tap any one — it fills the box below, then ask it.",
    "health.ageLabel": "Age (years)",
    "health.years": "years",
    "health.bandsLabel": "Choose by age",
    "health.notAdviceStrong": "This is not medical advice.",
    "health.notAdvice": "Do not start or stop any medicine — see a doctor first.",
    "health.emergencyStrong": "In an emergency, call:",
    "health.emergencyCall": "(emergency)",
    "health.emergencyAmbulance": "(ambulance)",
    "health.emergencyWomen": "(women's helpline)",
    "health.privacy": "No name or address is needed.",
}

# The three emergency numbers, in the order the component renders them: 112, 108,
# 181. Each label is keyed by the number it belongs to rather than by position,
# because getting a name/position pairing wrong here is how "(emergency)" ends up
# next to the ambulance number. The mapping is asserted in main().
EMERGENCY_NUMBERS = [("112", "health.emergencyCall"), ("108", "health.emergencyAmbulance"), ("181", "health.emergencyWomen")]

# ---------------------------------------------------------------------------
# Per band: label, note, four chip labels, four full questions.
# ---------------------------------------------------------------------------
BANDS = {
    "infant": {
        "hi": {
            "label": "0 – 2 साल",
            "note": "नन्हे बच्चे, जो अभी अपनी बात नहीं बता सकते",
            "chips": [
                "तेज़ बुखार",
                "खाना नहीं खा रहा",
                "उल्टी हो रही है",
                "दस्त हो रहे हैं",
            ],
            "questions": [
                "मेरे बच्चे को तेज़ बुखार है, क्या दूध दूँ?",
                "छोटा बच्चा खाना नहीं खा रहा, क्या करूँ?",
                "बच्चे को उल्टी हो रही है, कब डॉक्टर को दिखाऊँ?",
                "बच्चे को दस्त हो रहे हैं, क्या खिलाऊँ?",
            ],
        },
        "en": {
            "label": "0 – 2 years",
            "note": "Babies too young to say what is wrong",
            "chips": ["High fever", "Not eating", "Vomiting", "Diarrhoea"],
            "questions": [
                "My baby has a high fever — should I give milk?",
                "My baby is not eating at all, what should I do?",
                "My baby is vomiting, when should I see a doctor?",
                "My baby has diarrhoea, what should I feed?",
            ],
        },
    },
    "child": {
        "hi": {
            "label": "3 – 12 साल",
            "note": "बच्चे जो बोल सकते हैं, पर सवाल पूछने से डरते हैं",
            "chips": ["पढ़ाई में मन नहीं", "स्कूल से मना करता है", "रात में बुखार", "दाँत टूट रहे हैं"],
            "questions": [
                "बच्चे की पढ़ाई में मन नहीं लगता, क्या करूँ?",
                "बच्चा रोज़ स्कूल जाने से मना कर रहा है, कारण क्या हो सकता है?",
                "बच्चे को रात में बुखार आता है, क्या करूँ?",
                "बच्चे के दाँत टूट रहे हैं, दाँतों की देखभाल कैसे करूँ?",
            ],
        },
        "en": {
            "label": "3 – 12 years",
            "note": "Children who can speak, but are afraid to ask",
            "chips": ["Won't study", "Refuses school", "Night fever", "Teeth breaking"],
            "questions": [
                "My child will not concentrate on studies, what should I do?",
                "My child refuses to go to school every day, why might that be?",
                "My child gets a fever at night, what should I do?",
                "My child's teeth are breaking, how do I look after them?",
            ],
        },
    },
    "teen": {
        "hi": {
            "label": "13 – 17 साल",
            "note": "किशोर, जिन्हें अक्सर कोई ऐसा व्यक्ति नहीं मिलता जो सुन ले",
            "chips": ["पढ़ाई का दबाव", "नींद नहीं आती", "मोबाइल की लत", "बहुत उदासी"],
            "questions": [
                "पढ़ाई का बहुत दबाव है, इसे कैसे सामना करूँ?",
                "रात को नींद ठीक से नहीं आती, क्या करूँ?",
                "मोबाइल की लत लग गई है, छोड़ने का तरीका बताइए।",
                "बहुत उदासी महसूस होती है, किससे बात करूँ?",
            ],
        },
        "en": {
            "label": "13 – 17 years",
            "note": "Teenagers, who often have nobody who will listen",
            "chips": ["Study pressure", "No sleep", "Phone addiction", "Very low mood"],
            "questions": [
                "The pressure of studies is too much, how do I handle it?",
                "I cannot sleep properly at night, what should I do?",
                "I am addicted to my phone, how do I get free of it?",
                "I feel very depressed, who should I talk to?",
            ],
        },
    },
    "young": {
        "hi": {
            "label": "18 – 30 साल",
            "note": "नौकरी, पैसा और नींद — तीनों का एक साथ बोझ",
            "chips": ["काम का तनाव", "बैठने से पीठ दर्द", "नींद नहीं आती", "पैसा कम है"],
            "questions": [
                "काम का तनाव बहुत ज़्यादा है, कैसे कम करूँ?",
                "बैठे रहने से पीठ में दर्द हो रहा है, क्या करूँ?",
                "रात को नींद नहीं आती, क्या उपाय है?",
                "पैसे कम हैं और खर्च ज़्यादा, क्या करूँ?",
            ],
        },
        "en": {
            "label": "18 – 30 years",
            "note": "Work, money and sleep — all three at once",
            "chips": ["Work stress", "Back pain from sitting", "No sleep", "Money is short"],
            "questions": [
                "The stress from work is far too much, how do I reduce it?",
                "My back hurts from sitting all day, what should I do?",
                "I cannot fall asleep at night, what can I try?",
                "My money is short and my expenses are high, what should I do?",
            ],
        },
    },
    "middle": {
        "hi": {
            "label": "31 – 45 साल",
            "note": "घर, बच्चे और अपनी सेहत — सबकी ज़िम्मेदारी एक साथ",
            "chips": ["कमर में दर्द", "नींद सही नहीं", "घर का तनाव", "पेट में गैस"],
            "questions": [
                "कमर में दर्द हो रहा है, कारण क्या हो सकती है?",
                "नींद अच्छी नहीं आ रही, सुधारने का क्या उपाय है?",
                "घर का तनाव बहुत है, बच्चों को कैसे संभालूँ?",
                "काम पर कई साल से पेट में गैस की समस्या है, क्या करूँ?",
            ],
        },
        "en": {
            "label": "31 – 45 years",
            "note": "Home, children and your own health, all at once",
            "chips": ["Lower back pain", "Poor sleep", "Stress at home", "Stomach gas"],
            "questions": [
                "I have lower back pain, what could be causing it?",
                "My sleep is not improving, what can I do about it?",
                "There is a lot of stress at home, how do I handle the children?",
                "I have had stomach gas at work for years, what should I do?",
            ],
        },
    },
    "later": {
        "hi": {
            "label": "46 – 60 साल",
            "note": "शरीर की उम्र और उसकी देखभाल — दोनों एक साथ",
            "chips": ["पीठ में दर्द", "घुटने में दर्द", "रात को पैर में ऐंठन", "सुबह जकड़न"],
            "questions": [
                "मेरी उम्र 54 साल है और मेरी पीठ में दर्द है, क्या करूँ?",
                "घुटने में दर्द हो रहा है चढ़ने पर, क्यों?",
                "रात को पैर में ऐंठन होता है, क्या करूँ?",
                "सुबह उठकर कमर में जकड़न होती है, कारण क्या हो सकती है?",
            ],
        },
        "en": {
            "label": "46 – 60 years",
            "note": "The age of the body, and looking after it, together",
            "chips": ["Back pain", "Knee pain", "Night cramps", "Morning stiffness"],
            "questions": [
                "I am 54 years old and I have back pain, what should I do?",
                "My knee hurts when I climb stairs, why is that?",
                "I get cramps in my leg at night, what should I do?",
                "My lower back is stiff when I get up in the morning, why?",
            ],
        },
    },
    "senior": {
        "hi": {
            "label": "61 – 75 साल",
            "note": "दवाई, संतुलन और अकेलापन — तीनों साथ में",
            "chips": ["चलने में तकलीफ़", "दवाई की जाँच", "रात में पेशाब", "सुनाई कम"],
            "questions": [
                "घुटनों में इतना दर्द है कि चलना मुश्किल है, क्या करूँ?",
                "कई दवाइयाँ रोज़ खानी पड़ती हैं — कैसे पता चलेगा कि कौन सी हानिकारक है?",
                "रात को बार-बार पेशाब की दिक़्क़त है, क्या करूँ?",
                "कम सुनाई देता है, सुनने का कोई उपाय बताइए।",
            ],
        },
        "en": {
            "label": "61 – 75 years",
            "note": "Medicines, balance and loneliness, all together",
            "chips": ["Trouble walking", "Too many medicines", "Night urine", "Hearing loss"],
            "questions": [
                "My knees hurt so much that walking is difficult, what should I do?",
                "I have to take many medicines daily — how do I know which ones are harmful?",
                "I have to get up for the toilet several times a night, what should I do?",
                "I am finding it hard to hear — what can I do about it?",
            ],
        },
    },
    "elder": {
        "hi": {
            "label": "76 – 100 साल",
            "note": "हर दवा की जाँच ज़रूरी, हर गिरना गंभीर",
            "chips": ["गिरने का डर", "याददाश्त कमज़ोर", "रोज़ की दर्द-दवा", "कब डॉक्टर के पास"],
            "questions": [
                "घर में गिर जाने का डर है, कौन-सी सुरक्षा रखूँ?",
                "याददाश्त कमज़ोर हो रही है, क्या उपाय है?",
                "दर्द की दवा रोज़ खानी पड़ती है — क्या इसका कोई नुकसान है?",
                "कब डॉक्टर के पास जाना ज़रूरी है?",
            ],
        },
        "en": {
            "label": "76 – 100 years",
            "note": "Every medicine needs checking, every fall matters",
            "chips": ["Fear of falling", "Failing memory", "Daily painkillers", "When to see a doctor"],
            "questions": [
                "I am afraid of falling at home — what safety can I add?",
                "My memory is getting weaker, what can I do about it?",
                "I take a painkiller every day — is that harmful?",
                "When does it become important to see a doctor?",
            ],
        },
    },
}


def build(language: str) -> list[tuple[str, str]]:
    """The full key/value list for one language, chrome first then per band."""
    chrome = HINDI_CHROME if language == "hi" else ENGLISH_CHROME
    out = [(k, v) for k, v in chrome.items()]

    for band_id, band in BANDS.items():
        words = band[language]
        out.append((f"health.band.{band_id}.label", words["label"]))
        out.append((f"health.band.{band_id}.note", words["note"]))
        for i in range(4):
            out.append((f"health.c.{band_id}{i + 1}", words["chips"][i]))
            out.append((f"health.q.{band_id}{i + 1}", words["questions"][i]))

    return out


def insert(source: str, table: str, pairs: list[tuple[str, str]]) -> str:
    """Add the pairs to the named table, just before its closing brace."""
    match = re.search(r"const " + table + r"[^=]*=\s*\{", source)
    if not match:
        raise SystemExit(f"table {table} not found in {FILE}")

    close = source.index("\n};", match.end())
    block = ["\n  /* ---- health questions, by age ---- */"]
    for key, value in pairs:
        escaped = value.replace("\\", "\\\\").replace("'", "\\'")
        block.append(f"  '{key}': '{escaped}',")
    block.append("")

    return source[:close] + "\n".join(block) + source[close:]


def check_emergency_labels() -> None:
    """Each emergency number must be labelled by what it actually is.

    Not decoration. 112 is the emergency number, 108 is the ambulance and 181 is
    the women's helpline; a label that drifts off its number is a visitor being
    sent to the wrong service during an emergency, and it would look entirely
    normal on the page.
    """
    expected = {
        "health.emergencyCall": ("112", ("emergency", "आपातकाल")),
        "health.emergencyAmbulance": ("108", ("ambulance", "एम्बुलेंस")),
        "health.emergencyWomen": ("181", ("helpline", "हेल्पलाइन")),
    }

    for key, (number, words) in expected.items():
        for table, name in ((HINDI_CHROME, "Hindi"), (ENGLISH_CHROME, "English")):
            if key not in table:
                raise SystemExit(f"{name} is missing {key}")
            value = table[key].lower()
            if not any(w in value for w in words):
                raise SystemExit(
                    f"{name} {key} should describe {number} — one of {words} — "
                    f"but reads {table[key]!r}"
                )
        print(f"  {number} -> {key}")


def main() -> int:
    check_emergency_labels()

    source = io.open(FILE, encoding="utf-8").read()

    if "health.heading" in source:
        raise SystemExit(
            "health.* keys are already in i18n.ts — nothing to do. "
            "If you meant to change them, edit the table directly."
        )

    before = source.count("': '")
    source = insert(source, "HINDI", build("hi"))
    source = insert(source, "ENGLISH", build("en"))
    after = source.count("': '")

    added = after - before
    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)

    print(f"added {added} strings to HINDI and ENGLISH in {FILE}")
    print(f"  chrome  : {len(HINDI_CHROME)}")
    print(f"  bands   : {len(BANDS)} x (label + note + 4 chips + 4 questions) = {len(BANDS) * 10}")
    print(f"  per lang: {len(build('hi'))}, two languages")
    print()
    print("Every key the component reads is now present in both tables:")
    print("  health.heading / intro / ageLabel / years / bandsLabel")
    print("  health.notAdviceStrong / notAdvice / emergencyStrong / privacy")
    print("  health.band.<id>.label / .note  and  health.c.<id><n> / health.q.<id><n>")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())