import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

# ---------------------------------------------------------------------------
# The owner's own headings, in the visitor's language.
#
# Until now only the chrome translated. The moment a visitor opened a category
# the page heading, its subtitle and every article card came back in Hindi,
# whatever they had chosen — because those live in the database and she writes
# them once, in Hindi. That is what she reported: change the language to
# Marathi and the page is still Hindi.
#
# What this adds is a translation *of the original*, not a second copy of the
# content. `content/labels.ts` offers the translated heading only while the
# database still holds the exact Hindi string below; the first time she edits a
# title in the admin panel, her edit wins and the translation is dropped. So
# nothing here can put stale words on a page she has corrected.
#
# The article bodies stay as she wrote them. They are her writing, they are
# long, and a translated title over her own paragraphs is honest in a way that a
# machine-translated body would not be.
# ---------------------------------------------------------------------------

CAT = {
    "dhyan-aur-yoog": {
        "title": {
            "hi": "ध्यान और योग", "en": "Meditation and yoga", "bn": "ধ্যান ও যোগ",
            "ta": "தியானமும் யோகாவும்", "te": "ధ్యానం మరియు యోగ", "mr": "ध्यान आणि योग",
            "gu": "ધ્યાન અને યોગ", "kn": "ಧ್ಯಾನ ಮತ್ತು ಯೋಗ", "ml": "ധ്യാനവും യോഗയും",
            "pa": "ਧਿਆਨ ਅਤੇ ਯੋਗ", "ur": "ذہن اور یوگ", "ar": "اليوغا والتأمل",
            "es": "Meditación y yoga",
        },
        "subtitle": {
            "hi": "मन शांत करने के सरल उपाय", "en": "Simple ways to calm the mind",
            "bn": "মন শান্ত করার সহজ উপায়", "ta": "மனதை அமைதிப்படுத்த எளிய வழிகள்",
            "te": "మనసును ప్రశాంతపరచే సులభ మార్గాలు", "mr": "मन शांत करण्यास सोपी उपाय",
            "gu": "મન શાંત કરવાની સરળ રીતો", "kn": "ಮನವನ್ನು ಶಾಂತಪಡಿಸುವ ಸರಳ ವಿಧಾನಗಳು",
            "ml": "മനസ്സിനെ ശാന്തമാക്കാനുള്ള ലളിത മാർഗ്ഗങ്ങൾ", "pa": "ਮਨ ਸ਼ਾਂਤ ਕਰਨ ਦੇ ਸੌਖੇ ਤਰੀਕੇ",
            "ur": "ذہن پرسکون ہونے کے آسان طریقے", "ar": "طرق بسيطة لتهدئة العقل",
            "es": "Formas sencillas de calmar la mente",
        },
    },
    "gharelu-marammat": {
        "title": {
            "hi": "घरेलू मरम्मत", "en": "Home repairs", "bn": "ঘরের মেরামত",
            "ta": "வீட்டு பழுதுபார்ப்பு", "te": "ఇంటి మరమ్మత్తు", "mr": "घरगुती दुरुस्ती",
            "gu": "ઘરેલુ દુરુસ્તી", "kn": "ಮನೆ ದುರಸ್ತಿ", "ml": "വീട്ടുമുറത്തായ ശരിയാക്കൽ",
            "pa": "ਘਰੇਲੂ ਮੁਰੰਮਤ", "ur": "گھریلو مرمت", "ar": "إصلاحات منزلية",
            "es": "Reparaciones del hogar",
        },
        "subtitle": {
            "hi": "घर की छोटी-छोटी समस्याओं का हल", "en": "Fixes for small problems around the house",
            "bn": "বাড়ির ছোট ছোট সমস্যার সমাধান", "ta": "வீட்டின் சிறிய பிரச்சனைகளுக்குத் தீர்வு",
            "te": "ఇంట్లోని చిన్న సమస్యలకు పరిష్కారాలు", "mr": "घरातील छोट्या समस्यांचे उपाय",
            "gu": "ઘરની નાની સમસ્યાઓના ઉકેલ", "kn": "ಮನೆಯ ಸಣ್ಣ ಸಮಸ್ಯೆಗಳಿಗೆ ಪರಿಹಾರಗಳು",
            "ml": "വീട്ടിലെ ചെറിയ പ്രശ്നങ്ങൾക്കുള്ള പരിഹാരങ്ങൾ", "pa": "ਘਰ ਦੀਆਂ ਛੋਟੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦਾ ਹੱਲ",
            "ur": "گھر کی چھوٹی مسائل کا حل", "ar": "حلول للمشكلات الصغيرة في البيت",
            "es": "Soluciones para problemas pequeños de casa",
        },
    },
    "bachchon-ki-padhai": {
        "title": {
            "hi": "बच्चों की पढ़ाई", "en": "Children's studies", "bn": "সন্তানের পড়াশোনা",
            "ta": "குழந்தைகளின் படிப்பு", "te": "పిల్లల చదువు", "mr": "मुलांची अभ्यासासाठी",
            "gu": "બાળકોના અભ્યાસ", "kn": "ಮಕ್ಕಳ ಓದು", "ml": "കുട്ടികളുടെ പഠനം",
            "pa": "ਬੱਚਿਆਂ ਦੀ ਪੜ੍ਹਾਈ", "ur": "بچوں کی پڑھائی", "ar": "دراسة الأطفال",
            "es": "Los estudios de los niños",
        },
        "subtitle": {
            "hi": "पढ़ाई में लगे, परेशान हों", "en": "Studying, and worried about it",
            "bn": "পড়াশোনায় নিযোজিত, উদ্বিগ্ন", "ta": "படிப்பில் ஈடுபட்டு, கவலையில்",
            "te": "చదువులో ఉన్నారు, ఆందోళనలో ఉన్నారు", "mr": "अभ्यासात लागले, काळजीत",
            "gu": "અભ્યાસમાં લાગેલા, ચિંતિત", "kn": "ಓದಿನಲ್ಲಿ ತೊಡಗಿದ್ದಾರೆ, ಚಿಂತೆಯಲ್ಲಿ",
            "ml": "പഠനത്തിലാണ്, ആശങ്കയിലാണ്", "pa": "ਪੜ੍ਹਾਈ ਵਿੱਚ ਲੱਗੇ, ਪਰੇਸ਼ਾਨ",
            "ur": "پڑھائی میں لگے، پریشان", "ar": "يدرسون وهم قلقون",
            "es": "Estudian, y están preocupados",
        },
    },
    "budharge-seva": {
        "title": {
            "hi": "बुज़ुर्गों की सेवा", "en": "Caring for the elderly", "bn": "বয়স্কদের সেবা",
            "ta": "முதியோர் பராமரிப்பு", "te": "పెద్దల సేవ", "mr": "वयोवृद्धांची सेवा",
            "gu": "વૃદ્ધોની સેવા", "kn": "ಹಿರಿಯರ ಸೇವೆ", "ml": "മുതിർന്നവരുടെ സേവനം",
            "pa": "ਬਜ਼ੁਰਗਾਂ ਦੀ ਸੇਵਾ", "ur": "بزرگوں کی خدمت", "ar": "رعاية كبار السن",
            "es": "Cuidado de las personas mayores",
        },
        "subtitle": {
            "hi": "देखभाल और सहायता", "en": "Care and support", "bn": "যত্ন ও সহায়তা",
            "ta": "பராமரிப்பும் உதவியும்", "te": "శ్రద్ధ మరియు సహాయం", "mr": "काळजी आणि मदत",
            "gu": "કાળજી અને મદદ", "kn": "ಆರೈಕೆ ಮತ್ತು ಸಹಾಯ", "ml": "പരിചരണവും സഹായവും",
            "pa": "ਦੇਖਭਾਲ ਅਤੇ ਮਦਦ", "ur": "نگہداشت اور مدد", "ar": "رعاية ودعم",
            "es": "Cuidado y ayuda",
        },
    },
    "shishu-dekhbhal": {
        "title": {
            "hi": "शिशु देखभाल", "en": "Baby care", "bn": "শিশুর যত্ন",
            "ta": "குழந்தை பராமரிப்பு", "te": "శిశు సంరక్షణ", "mr": "शिशु देखभाल",
            "gu": "શિશુ જાળણી", "kn": "ಶಿಶು ಆರೈಕೆ", "ml": "ശിശു പരിചരണം",
            "pa": "ਸ਼ਿਸ਼ੂ ਦੇਖਭਾਲ", "ur": "شیشے کی دیکھ بھال", "ar": "رعاية الرضع",
            "es": "Cuidado del bebé",
        },
        "subtitle": {
            "hi": "नन्हे बच्चे की सही देखभाल", "en": "Looking after a small child properly",
            "bn": "ছোট শিশুর সঠিক যত্ন", "ta": "சிறிய குழந்தையை சரியாகப் பார்த்துக்கொள்ள",
            "te": "చిన్న పిల్లల సరైన సంరక్షణ", "mr": "लहान मुलाची अर्थशीर देखभाल",
            "gu": "નાના બાળકની યોગ્ય જાળણી", "kn": "ಚಿಕ್ಕ ಮಗುವಿನ ಸರಿಯಾದ ಆರೈಕೆ",
            "ml": "ചെറിയ കുഞ്ഞിന്റെ ശരിയായ പരിചരണം", "pa": "ਛੋਟੇ ਬੱਚੇ ਦੀ ਸਹੀ ਦੇਖਭਾਲ",
            "ur": "چھوٹے بچے کی درست دیکھ بھال", "ar": "رعاية صحية للطفل الصغير",
            "es": "Cuidar bien a un niño pequeño",
        },
    },
    "dharmik-upay": {
        "title": {
            "hi": "धार्मिक उपाय", "en": "Religious remedies", "bn": "ধর্মীয় উপায়",
            "ta": "ஆன்மிக தீர்வுகள்", "te": "మతపరమైన పరిష్కారాలు", "mr": "धार्मिक उपाय",
            "gu": "ધાર્મિક ઉપાય", "kn": "ಧಾರ್ಮಿಕ ಪರಿಹಾರಗಳು", "ml": "ആത്മീയ പരിഹാരങ്ങൾ",
            "pa": "ਧਾਰਮਿਕ ਹੱਲ", "ur": "مذہبی حل", "ar": "حلول دينية",
            "es": "Remedios religiosos",
        },
        "subtitle": {
            "hi": "मन की शांति के साथ", "en": "With peace of mind", "bn": "মনের শান্তি নিয়ে",
            "ta": "அமைதியான மனத்துடன்", "te": "ప్రశాంతమైన మనసుతో", "mr": "मनाच्या शांतीसह",
            "gu": "મનની શાંતિ સાથે", "kn": "ಶಾಂತ ಮನಸ್ಸಿನೊಂದಿಗೆ", "ml": "ശാന്തമായ മനസ്സോടെ",
            "pa": "ਮਨ ਦੀ ਸ਼ਾਂਤੀ ਨਾਲ", "ur": "پرسکون ذہن کے ساتھ", "ar": "مع طمأنينة البال",
            "es": "Con paz de interior",
        },
    },
    "pavan-grah-aur-aarti": {
        "title": {
            "hi": "पावन ग्रंथ व आरती", "en": "Holy texts and aarti", "bn": "পবিত্র গ্রন্থ ও আরতি",
            "ta": "புனித நூல்களும் ஆரத்தியும்", "te": "పవిత్ర గ్రంథాలు మరియు ఆరతి",
            "mr": "पवित्र ग्रंथ व आरती", "gu": "પવિત્ર ગ્રંથ અને આરતી", "kn": "ಪವಿತ್ರ ಗ್ರಂಥ ಮತ್ತು ಆರತಿ",
            "ml": "പുണ്യഗ്രന്ഥങ്ങളും ആരതിയും", "pa": "ਪਵਿੱਤਰ ਗ੍ਰੰਥ ਅਤੇ ਆਰਤੀ", "ur": "پاک گرانث اور آرتی",
            "ar": "النصوص المقدسة والآرتي", "es": "Textos sagrados y aarti",
        },
        "subtitle": {
            "hi": "श्रद्धा से पढ़ें और सुनें", "en": "Read and listen with devotion",
            "bn": "শ্রদ্ধার সাথে পড়ুন ও শুনুন", "ta": "பக்தியுடன் படியுங்கள், கேளுங்கள்",
            "te": "భక్తితో చదవండి, వినండి", "mr": "श्रद्धेने वाचा आणि ऐका",
            "gu": "શ્રદ્ધાથી વાંચો અને સાંભળો", "kn": "ಭಕ್ತಿಯಿಂದ ಓದಿ ಕೇಳಿ",
            "ml": "ഭക്തിയോടെ വായിക്കുകയും കേൾക്കുകയും ചെയ്യുക", "pa": "ਸ਼੍ਰਧਾ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਸੁਣੋ",
            "ur": "شرداد سے پڑھیں اور سنیں", "ar": "اقرأ وأنصت بإخلاص",
            "es": "Lee y escucha con devoción",
        },
    },
    "aapatkalen-gayide": {
        "title": {
            "hi": "आपातकालीन गाइड", "en": "Emergency guide", "bn": "জরুরি গাইড",
            "ta": "அவசர வழிகாட்டி", "te": "అత్యవసర మార్గదర్శి", "mr": "आपत्तकालीन मार्गदर्शक",
            "gu": "આપત્કાલીન માર્ગદર્શિકા", "kn": "ತುರ್ತು ಮಾರ್ಗದರ್ಶಿ", "ml": "അടിയന്തര വഴികാട്ടി",
            "pa": "ਐਮਰਜੈਂਸੀ ਗਾਈਡ", "ur": "ایمرجنسی گائیڈ", "ar": "دليل الطوارئ",
            "es": "Guía de emergencias",
        },
        "subtitle": {
            "hi": "जब तुरंत मदद चाहिए", "en": "When help is needed at once",
            "bn": "যখন তৎক্ষণাৎ সাহায্য দরকার", "ta": "உடனே உதவி தேவைப்படும்போது",
            "te": "వెంటనే సహాయం కావాలంటే", "mr": "लगेच मदत पाहिजे असताना",
            "gu": "તરત જ મદદ જોઈએ ત્યારે", "kn": "ತಕ್ಷಣ ಸಹಾಯ ಬೇಕಾದಾಗ",
            "ml": "ഉടനെ സഹായം വേണ്ടപ്പോൾ", "pa": "ਜਦੋਂ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੋਵੇ",
            "ur": "جب فوری مدد چاہیے", "ar": "عندما تحتاج المساعدة فوراً",
            "es": "Cuando hace falta ayuda ya",
        },
    },
    "mahamari-suraksha": {
        "title": {
            "hi": "महामारी सुरक्षा", "en": "Epidemic protection", "bn": "মহামারি সুরক্ষা",
            "ta": "தொற்றுநோய் பாதுகாப்பு", "te": "వ్యాధి రక్షణ", "mr": "महामारी संरक्षण",
            "gu": "મહામારી સુરક્ષા", "kn": "ಮಹಾಮಾರಿ ರಕ್ಷಣೆ", "ml": "മഹാമാരി സുരക്ഷ",
            "pa": "ਮਹਾਂਮਾਰੀ ਸੁਰੱਖਿਆ", "ur": "وبائی حفاظت", "ar": "الحماية من الأوبئة",
            "es": "Protección contra epidemias",
        },
        "subtitle": {
            "hi": "बीमारी फैलने से बचाव", "en": "Stopping illness from spreading",
            "bn": "রোগ ছড়ানো ঠেকানো", "ta": "நோய் பரவாமல் தடுப்பது",
            "te": "వ్యాధి వ్యాప్తిని అరికట్టడం", "mr": "आजार पसरण्यापासून रक्षण",
            "gu": "રોગ ફેલાતા અટકાવવો", "kn": "ರೋಗ ಹರಡದಂತೆ ತಡೆಯುವುದು",
            "ml": "രോഗം പരക്കാതെ തടയുക", "pa": "ਬਿਮਾਰੀ ਫੈਲਣ ਤੋਂ ਬਚਾਅ",
            "ur": "بیماری پھیلنے سے بچاؤ", "ar": "منع انتشار المرض",
            "es": "Evitar que la enfermedad se extienda",
        },
    },
}

LANGS = ["hi", "en", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "ar", "es"]
TABLE = {
    "hi": "HINDI", "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL", "te": "TELUGU",
    "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA", "ml": "MALAYALAM",
    "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC", "es": "SPANISH",
}

path = "src/content/i18n.ts"
text = io.open(path, encoding="utf-8").read()
lines = text.split("\n")

already = set(re.findall(r"'(cat\.[A-Za-z0-9._-]+)':", text))
current = None
added = 0
for i, line in enumerate(lines):
    m = re.match(r"^const (\w+)", line)
    if m:
        current = m.group(1)
    if current not in TABLE.values() or "home.metaTitle" not in line:
        continue
    code = [k for k, v in TABLE.items() if v == current][0]
    block = []
    for slug, parts in CAT.items():
        for part in ("title", "subtitle"):
            key = "cat.%s.%s" % (slug, part)
            if key in already:
                continue
            # Escape the apostrophe: "Children's studies" would otherwise close
            # the TypeScript string early and take the whole build with it.
            value = parts[part][code].replace("\\", "").replace("'", "\\'")
            block.append("  '%s': '%s'," % (key, value))
            added += 1
    lines[i + 1 : i + 1] = block

io.open(path, "w", encoding="utf-8", newline="").write("\n".join(lines))
print("category labels added:", added, "(already there:", len(already), ")")
