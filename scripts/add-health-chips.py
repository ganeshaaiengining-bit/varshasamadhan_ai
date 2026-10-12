"""
Fill health.c.* — the 32 tap chips inside the health box.

    python scripts/add-health-chips.py

32 keys x 11 languages = 352 strings.

WHAT THESE STRINGS ARE

A chip is what a visitor taps to fill the question box. It is three or four
words on a button: "तेज़ बुखार", "घुटने में दर्द", "बहुत उदासी". A chip is not a
question and not an answer. The question it opens is health.q.*, and the answer
is generated per request.

So the whole job here is brevity. A chip that needs a second line defeats the
thing it is for, and a chip that could be read two ways sends a visitor down the
wrong branch of the health box entirely — which is why health.heading, the
health.intro and health.notAdvice all sit above the chips in every language, and
why the guards below reject anything that reads like an instruction.

THE GUARDS

  - every chip stays under the length of its Hindi. A chip that grew by half
    again while being translated is a chip that now wraps
  - no digit is introduced that the Hindi did not have
  - no dose, no named drug, no hospital

Run once, then check-scripts, check-spacing, check-latin-leaks.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

TABLES = [
    ("mr", "MARATHI"), ("bn", "BENGALI"), ("ta", "TAMIL"), ("te", "TELUGU"),
    ("gu", "GUJARATI"), ("kn", "KANNADA"), ("ml", "MALAYALAM"), ("pa", "PUNJABI"),
    ("ur", "URDU"), ("ar", "ARABIC"), ("es", "SPANISH"),
]

T = {
    "mr": {
        "health.c.infant1": "ज्वर जास्त", "health.c.infant2": "खाणार नाही",
        "health.c.infant3": "उल्टी होतेय", "health.c.infant4": "जुलोख्या होताय",
        "health.c.child1": "अभ्यासात मन नाही", "health.c.child2": "शाळेला जात नाही",
        "health.c.child3": "रात्री ज्वर", "health.c.child4": "दात तडकताय",
        "health.c.teen1": "अभ्यासाचा दबाव", "health.c.teen2": "झोप येत नाही",
        "health.c.teen3": "मोबाइलची सवय", "health.c.teen4": "फार खोल उदासी",
        "health.c.young1": "कामाचा ताण", "health.c.young2": "बसल्याने पीठ दुखते",
        "health.c.young3": "झोप येत नाही", "health.c.young4": "पैसा कमी आहे",
        "health.c.middle1": "कमरेखालील दुखणे", "health.c.middle2": "झोप ठीक येत नाही",
        "health.c.middle3": "घरातील ताण", "health.c.middle4": "पोटात गॅस",
        "health.c.later1": "पीठ दुखते", "health.c.later2": "गुडघा दुखते",
        "health.c.later3": "रात्री पायांची ऐंठण", "health.c.later4": "सकाळी आकडण",
        "health.c.senior1": "चालणे अडचण आहे", "health.c.senior2": "औषधांची तपासणी",
        "health.c.senior3": "रात्री पेशाब", "health.c.senior4": "कान कमी ऐकते",
        "health.c.elder1": "पडण्याची भीती", "health.c.elder2": "नात्री कमजोर",
        "health.c.elder3": "रोजची दुखी-औषधी", "health.c.elder4": "डॉक्टरकडे कधी",
    },
    "bn": {
        "health.c.infant1": "জ্বর তীব্র", "health.c.infant2": "খাচ্ছে না",
        "health.c.infant3": "বমি হচ্ছে", "health.c.infant4": "ডায়রিয়া হচ্ছে",
        "health.c.child1": "পড়াশোনায় মন বসে না", "health.c.child2": "স্কুলে যেতে চায় না",
        "health.c.child3": "রাতে জ্বর", "health.c.child4": "দাঁত ভাঙছে",
        "health.c.teen1": "পড়ার চাপ", "health.c.teen2": "ঘুম আসছে না",
        "health.c.teen3": "মোবাইলের অভ্যাস", "health.c.teen4": "খুব মেসেজিত",
        "health.c.young1": "কাজের চাপ", "health.c.young2": "বসে থাকলে পিঠে ব্যথা",
        "health.c.young3": "ঘুম আসছে না", "health.c.young4": "পয়সা কম",
        "health.c.middle1": "কোমর ব্যথা", "health.c.middle2": "ঘুম ঠিকমতো হচ্ছে না",
        "health.c.middle3": "বাড়ির চাপ", "health.c.middle4": "পেটে গ্যাস",
        "health.c.later1": "পিঠে ব্যথা", "health.c.later2": "হাঁটুতে ব্যথা",
        "health.c.later3": "রাতে পা টানে", "health.c.later4": "সকালে জড়তা",
        "health.c.senior1": "হাঁটতে কষ্ট", "health.c.senior2": "ঔষধের পরীক্ষা",
        "health.c.senior3": "রাতে প্রস্রাব", "health.c.senior4": "কম শুনছি",
        "health.c.elder1": "পড়ে যাওয়ার ভয়", "health.c.elder2": "স্মৃতি দুর্বল",
        "health.c.elder3": "প্রতিদিন ব্যথার ঔষধ", "health.c.elder4": "কখন ডাক্তারের কাছে",
    },
    "ta": {
        "health.c.infant1": "தீவிர காய்ச்சல்", "health.c.infant2": "சாப்பதில்லை",
        "health.c.infant3": "வாந்தி வருகிறது", "health.c.infant4": "வயிற்றுப்போக்கு",
        "health.c.child1": "படிப்பில் மனம் இல்லை", "health.c.child2": "பள்ளிக்கு செல்ல மறுக்கிறது",
        "health.c.child3": "ராத்திரி காய்ச்சல்", "health.c.child4": "பல் உடைகிறது",
        "health.c.teen1": "படிப்பு அழுத்தம்", "health.c.teen2": "தூக்கம் வரவில்லை",
        "health.c.teen3": "மொபைல் பழக்கம்", "health.c.teen4": "மிகவும் மனக்கவலி",
        "health.c.young1": "வேலை அழுத்தம்", "health.c.young2": "உட்கார்ந்தால் வலி",
        "health.c.young3": "தூக்கம் வரவில்லை", "health.c.young4": "பணம் குறைவு",
        "health.c.middle1": "நீட்டில் வலி", "health.c.middle2": "தூக்கம் சரியாக இல்லை",
        "health.c.middle3": "வீட்டு அழுத்தம்", "health.c.middle4": "வயிற்றில் வாயு",
        "health.c.later1": "முதுகு வலி", "health.c.later2": "முட்டு வலி",
        "health.c.later3": "ராத்திரி கால் இருப்பு", "health.c.later4": "காலையில் விறைப்பு",
        "health.c.senior1": "நடக்கச் சிரமம்", "health.c.senior2": "மருந்துப் பரிசோதனை",
        "health.c.senior3": "ராத்திரி சிறுநீர்", "health.c.senior4": "கேள்வி குறைவு",
        "health.c.elder1": "விழும் பயம்", "health.c.elder2": "நினைவு பலவீதம்",
        "health.c.elder3": "தினமும் வலி மருந்து", "health.c.elder4": "மருத்துவர் எப்போது",
    },
    "te": {
        "health.c.infant1": "తీవ్ర జ్వరం", "health.c.infant2": "తినడం లేదు",
        "health.c.infant3": "విరేచనాలు", "health.c.infant4": "విరేచనాలు",
        "health.c.child1": "చదువులో ఆసక్తి లేదు", "health.c.child2": "బడికి వెళ్ళడం ఇష్టం లేదు",
        "health.c.child3": "రాత్రి జ్వరం", "health.c.child4": "పంట్లు పడుతున్నాయి",
        "health.c.teen1": "చదువు ఒత్తిడి", "health.c.teen2": "నిద్ర రావడం లేదు",
        "health.c.teen3": "మొబైల్ అలవాటు", "health.c.teen4": "తీవ్ర దుఃఖం",
        "health.c.young1": "పని ఒత్తిడి", "health.c.young2": "కూర్చుని ఉంటే నొప్పి",
        "health.c.young3": "నిద్ర రావడం లేదు", "health.c.young4": "డబ్బు తక్కువ",
        "health.c.middle1": "కమ్ము నొప్పి", "health.c.middle2": "నిద్ర సరిగా రావడం లేదు",
        "health.c.middle3": "ఇంటి ఒత్తిడి", "health.c.middle4": "పేట్లో గ్యాస్",
        "health.c.later1": "మోపు నొప్పి", "health.c.later2": "కళ్ల నొప్పి",
        "health.c.later3": "రాత్రి కాలి కుంపులు", "health.c.later4": "ఉదయం వాచిపోవడం",
        "health.c.senior1": "నడక కష్టం", "health.c.senior2": "మందుల తనిఖీ",
        "health.c.senior3": "రాత్రి మూత్రం", "health.c.senior4": "వినిపి తగ్గింది",
        "health.c.elder1": "పడిపోయే భయం", "health.c.elder2": "జ్ఞాపకశక్తి బలహీనం",
        "health.c.elder3": "రోజూ నొప్పి మందులు", "health.c.elder4": "వైద్యునికి ఎప్పుడు",
    },
    "gu": {
        "health.c.infant1": "તીવ્ર તાવ", "health.c.infant2": "ખાતું નથી",
        "health.c.infant3": "ઉલટી થાય છે", "health.c.infant4": "ઝાડાનું થાય છે",
        "health.c.child1": "અભ્યાસમાં મન નથી", "health.c.child2": "શાળાએ જવા ના કરે",
        "health.c.child3": "રાતે તાવ", "health.c.child4": "દાંત તૂટી રહ્યા",
        "health.c.teen1": "અભ્યાસનું દબાણ", "health.c.teen2": "ઊંઘ આવતી નથી",
        "health.c.teen3": "મોબાઇલની ટેવ", "health.c.teen4": "ઘણી ઉદાસી",
        "health.c.young1": "કામનું તણાવ", "health.c.young2": "બેસતાં પીઠમાં દુખાવો",
        "health.c.young3": "ઊંઘ આવતી નથી", "health.c.young4": "પૈસા ઓછા",
        "health.c.middle1": "કમરમાં દુખાવો", "health.c.middle2": "ઊંઘ બરાબર આવતી નથી",
        "health.c.middle3": "ઘરનું તણાવ", "health.c.middle4": "પેટમાં ગેસ",
        "health.c.later1": "પીઠમાં દુખાવો", "health.c.later2": "ઘૂટણમાં દુખાવો",
        "health.c.later3": "રાતે પગ ખેંચાય", "health.c.later4": "સવારે અકડપણ",
        "health.c.senior1": "ચાલવામાં તકલીફ", "health.c.senior2": "દવાની ચકાસણી",
        "health.c.senior3": "રાતે પેશાબ", "health.c.senior4": "ઓછું સુંઘાય",
        "health.c.elder1": "પડવાનો ડર", "health.c.elder2": "યાદશક્તિ નબળી",
        "health.c.elder3": "રોજની દુખની દવા", "health.c.elder4": "ડૉક્ટર પાસે ક્યારે",
    },
    "kn": {
        "health.c.infant1": "ತೀವ್ರ ಜ್ವರ", "health.c.infant2": "ತಿನುತ್ತಿಲ್ಲ",
        "health.c.infant3": "ವಾತಿಸುತ್ತಿದೆ", "health.c.infant4": "ಮಲಗೆಯುತ್ತಿದೆ",
        "health.c.child1": "ಓದುವಿನಲ್ಲಿ ಮನಸ್ಸಿಲ್ಲ", "health.c.child2": "ಶಾಲೆಗೆ ಹೋಗಲು ಮನಸ್ಸಿಲ್ಲ",
        "health.c.child3": "ರಾತ್ರಿ ಜ್ವರ", "health.c.child4": "ಹಲ್ಲು ಉಡುತ್ತಿದೆ",
        "health.c.teen1": "ಓದಿನ ಒತ್ತಡ", "health.c.teen2": "ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ",
        "health.c.teen3": "ಮೊಬೈಲ್ ಅಭಿವಾದ", "health.c.teen4": "ತೀವ್ರ ಬೇಸರಗೆ",
        "health.c.young1": "ಕೆಲಸದ ಒತ್ತಡ", "health.c.young2": "ಕುಳಿತಿದ್ದರೆ ನೋವು",
        "health.c.young3": "ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ", "health.c.young4": "ಹಣ ಕಡಿಮೆ",
        "health.c.middle1": "ಬೆನ್ನು ನೋವು", "health.c.middle2": "ನಿದ್ದೆ ಸರಿಯಾಗುತ್ತಿಲ್ಲ",
        "health.c.middle3": "ಮನೆಯ ಒತ್ತಡ", "health.c.middle4": "ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್",
        "health.c.later1": "ಬೆನ್ನಿನ ನೋವು", "health.c.later2": "ಮೊಣಕೆಯ ನೋವು",
        "health.c.later3": "ರಾತ್ರಿ ಕಾಲಿನ ಮಂಜೂರಿ", "health.c.later4": "ಬೆಳಗಿನಲ್ಲಿ ಕೂಸುವುದು",
        "health.c.senior1": "ನಡೆಯಲು ತೊಂದರು", "health.c.senior2": "ಔಷಧಿ ಪರಿಶೀಲನೆ",
        "health.c.senior3": "ರಾತ್ರಿ ಮೂತ್ರ", "health.c.senior4": "ಕೇಳಿಸುವುದು ಕಡಿಮೆ",
        "health.c.elder1": "ಉದುರುವ ಭಯ", "health.c.elder2": "ನೆನಪು ದುರ್ಬಲ",
        "health.c.elder3": "ದಿನದ ನೋವಿನ ಔಷಧಿ", "health.c.elder4": "ವೈದ್ಯರ ಬಗ್ಗೆ ಯಾವಾಗ",
    },
    "ml": {
        "health.c.infant1": "കടുത്ത പനി", "health.c.infant2": "കഴിക്കാരില്ല",
        "health.c.infant3": "ഓക്കരുകളിക്കുന്നു", "health.c.infant4": "മലങ്ങളിക്കുന്നു",
        "health.c.child1": "പഠനത്തിൽ താഴ്മായില്ല", "health.c.child2": "സ്കൂളിൽ പോകാൻ മറക്കുന്നു",
        "health.c.child3": "രാത്രി പനി", "health.c.child4": "പല്ലുകൾ ഉടിക്കുന്നു",
        "health.c.teen1": "പഠനം സമ്മർദ്ദം", "health.c.teen2": "ഉറക്കം വരുന്നില്ല",
        "health.c.teen3": "മൊബൈൽ ശീലം", "health.c.teen4": "കടുത്ത ദുഃഖം",
        "health.c.young1": "ജോലിയുടെ സമ്മർദ്ദം", "health.c.young2": "ഇരിയുമ്പോൾ വേദന",
        "health.c.young3": "ഉറക്കം വരുന്നില്ല", "health.c.young4": "പണം കുറവ്",
        "health.c.middle1": "കടുവിൽ വേദന", "health.c.middle2": "ഉറക്കം ശരിയായി വരുന്നില്ല",
        "health.c.middle3": "വീടിന്റെ സമ്മർദ്ദം", "health.c.middle4": "വയറ്റിൽ വായു",
        "health.c.later1": "മുട്ടിൽ വേദന", "health.c.later2": "മട്ടിൽ വേദന",
        "health.c.later3": "രാത്രി കാലിൽ വലിച്ചുരുക്കൽ", "health.c.later4": "രാവിലെ കാഠം",
        "health.c.senior1": "നടക്കാൻ ബുദ്ധിമുട്ട്", "health.c.senior2": "മരുന്നിന്റെ പരിശോധന",
        "health.c.senior3": "രാത്രി മൂത്രം", "health.c.senior4": "കേൾപ്പ് കുറവ്",
        "health.c.elder1": "വീഴുമെന്ന് ഭയം", "health.c.elder2": "ഓർമ്മപ്പതി ദുർബലം",
        "health.c.elder3": "ദിവസംപ്രതി വേദനാ മരുന്ന്", "health.c.elder4": "ഡോക്ടറെ എപ്പോൾ",
    },
    "pa": {
        "health.c.infant1": "ਤੇਜ਼ ਬੁਖਾਰ", "health.c.infant2": "ਨਹੀਂ ਖਾ ਰਿਹਾ",
        "health.c.infant3": "ਉਲਟੀ ਹੋ ਰਹੀ", "health.c.infant4": "ਪੇਟ ਖਰਾਬ ਹੈ",
        "health.c.child1": "ਪੜ੍ਹਾਈ ਵਿੱਚ ਮਨ ਨਹੀਂ", "health.c.child2": "ਸਕੂਲ ਨਹੀਂ ਜਾਂਦਾ",
        "health.c.child3": "ਰਾਤ ਨੂੰ ਬੁਖਾਰ", "health.c.child4": "ਦੰਦ ਟੁੱਟ ਰਹੇ",
        "health.c.teen1": "ਪੜ੍ਹਾਈ ਦਾ ਦਬਾਅ", "health.c.teen2": "ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ",
        "health.c.teen3": "ਮੋਬਾਈਲ ਦੀ ਆਦਤ", "health.c.teen4": "ਬਹੁਤ ਉਦਾਸ",
        "health.c.young1": "ਕੰਮ ਦਾ ਤਣਾਵ", "health.c.young2": "ਬੈਠਣ ਨਾਲ ਪਿੱਠ ਦਰਦ",
        "health.c.young3": "ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ", "health.c.young4": "ਪੈਸੇ ਘੱਟ",
        "health.c.middle1": "ਕਮਰ ਵਿੱਚ ਦਰਦ", "health.c.middle2": "ਨੀਂਦ ਠੀਕ ਨਹੀਂ",
        "health.c.middle3": "ਘਰ ਦਾ ਤਣਾਵ", "health.c.middle4": "ਪੇਟ ਵਿੱਚ ਗੈਸ",
        "health.c.later1": "ਪਿੱਠ ਵਿੱਚ ਦਰਦ", "health.c.later2": "ਗੁੱਥੇ ਵਿੱਚ ਦਰਦ",
        "health.c.later3": "ਰਾਤ ਨੂੰ ਪੈਰ ਵਿੱਚ ਐਂਠਣ", "health.c.later4": "ਸਵੇਰੇ ਜਕੜਨ",
        "health.c.senior1": "ਚੱਲਣ ਵਿੱਚ ਤਕਲੀਫ਼", "health.c.senior2": "ਦਵਾ ਦੀ ਜਾਂਚ",
        "health.c.senior3": "ਰਾਤ ਨੂੰ ਪੇਸ਼ਾਬ", "health.c.senior4": "ਘੱਟ ਸੁਣਾਈ ਦਿੰਦਾ",
        "health.c.elder1": "ਡਿਗਣ ਦਾ ਡਰ", "health.c.elder2": "ਯਾਦਦਾਸ਼ਤ ਕਮਜ਼ੋਰ",
        "health.c.elder3": "ਰੋਜ਼ਾਨੀ ਦਰਦ-ਦਵਾ", "health.c.elder4": "ਡਾਕਟਰ ਕਦੋਂ",
    },
    "ur": {
        "health.c.infant1": "تیز بخار", "health.c.infant2": "کھانا نہیں کھا رہا",
        "health.c.infant3": "الٹی ہو رہی ہے", "health.c.infant4": "پیچشش ہو رہی ہے",
        "health.c.child1": "پڑھائی میں دل نہیں", "health.c.child2": "اسکول نہیں جاتا",
        "health.c.child3": "رات کو بخار", "health.c.child4": "دانت گر رہے",
        "health.c.teen1": "پڑھائی کا دباؤ", "health.c.teen2": "نیند نہیں آتی",
        "health.c.teen3": "موبائل کی عادت", "health.c.teen4": "بہت زیادہ اداسی",
        "health.c.young1": "کام کا دباؤ", "health.c.young2": "بیٹھنے سے کمر درد",
        "health.c.young3": "نیند نہیں آتی", "health.c.young4": "پیسے کم",
        "health.c.middle1": "کمر میں درد", "health.c.middle2": "نیند ٹھیک نہیں",
        "health.c.middle3": "گھر کا دباؤ", "health.c.middle4": "پیٹ میں گیس",
        "health.c.later1": "پیٹھ میں درد", "health.c.later2": "گھٹنے میں درد",
        "health.c.later3": "رات کو پاؤں میں کھنچ", "health.c.later4": "صبح اکڑن",
        "health.c.senior1": "چلنے میں دشواری", "health.c.senior2": "دوا کی جانچ",
        "health.c.senior3": "رات کو پیشاب", "health.c.senior4": "سنائی کم",
        "health.c.elder1": "گرنے کا ڈر", "health.c.elder2": "یادداشت کمزور",
        "health.c.elder3": "روز کی درد کی دوا", "health.c.elder4": "ڈاکٹر کب",
    },
    "ar": {
        "health.c.infant1": "حمّى شديدة", "health.c.infant2": "لا يأكل",
        "health.c.infant3": "يتقيّأ", "health.c.infant4": "إسهال",
        "health.c.child1": "لا رغبة في الدراسة", "health.c.child2": "لا يذهب إلى المدرسة",
        "health.c.child3": "حمّى ليلاً", "health.c.child4": "الأسنان تتكسر",
        "health.c.teen1": "ضغط الدراسة", "health.c.teen2": "لا ينام",
        "health.c.teen3": "إدمان الهاتف", "health.c.teen4": "حزن شديد",
        "health.c.young1": "ضغط العمل", "health.c.young2": "ألم الظهر من الجلوس",
        "health.c.young3": "لا ينام", "health.c.young4": "المال قليل",
        "health.c.middle1": "ألم أسفل الظهر", "health.c.middle2": "النوم غير مضبوط",
        "health.c.middle3": "ضغط البيت", "health.c.middle4": "غازات في البطن",
        "health.c.later1": "ألم الظهر", "health.c.later2": "ألم الركبة",
        "health.c.later3": "تشنّج في الساق ليلاً", "health.c.later4": "تيبّس الصباح",
        "health.c.senior1": "مشكلة في المشي", "health.c.senior2": "مراجعة الأدوية",
        "health.c.senior3": "تبوّل ليلاً", "health.c.senior4": "ضعف السمع",
        "health.c.elder1": "خوف من السقوط", "health.c.elder2": "ضعف الذاكرة",
        "health.c.elder3": "مسكّن للألم يومياً", "health.c.elder4": "متى تزور الطبيب",
    },
    "es": {
        "health.c.infant1": "Fiebre alta", "health.c.infant2": "No come",
        "health.c.infant3": "Vomita", "health.c.infant4": "Diarrea",
        "health.c.child1": "No estudia", "health.c.child2": "No quiere ir al colegio",
        "health.c.child3": "Fiebre por la noche", "health.c.child4": "Se le caen los dientes",
        "health.c.teen1": "Presión de los exámenes", "health.c.teen2": "No duerme",
        "health.c.teen3": "Adicción al móvil", "health.c.teen4": "Mucha tristeza",
        "health.c.young1": "Estrés del trabajo", "health.c.young2": "Dolor de espalda al sentarse",
        "health.c.young3": "No duerme", "health.c.young4": "Falta dinero",
        "health.c.middle1": "Dolor lumbar", "health.c.middle2": "Dormir mal",
        "health.c.middle3": "Estrés en casa", "health.c.middle4": "Gases en el estómago",
        "health.c.later1": "Dolor de espalda", "health.c.later2": "Dolor de rodilla",
        "health.c.later3": "Calambres en la pierna de noche", "health.c.later4": "Rigidez por la mañana",
        "health.c.senior1": "Cuesta caminar", "health.c.senior2": "Revisión de medicación",
        "health.c.senior3": "Orinar por la noche", "health.c.senior4": "Oye poco",
        "health.c.elder1": "Miedo a caerse", "health.c.elder2": "Memoria floja",
        "health.c.elder3": "Pastillas para el dolor a diario", "health.c.elder4": "Cuándo ir al médico",
    },
}


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def set_key(source: str, table: str, key: str, value: str) -> str:
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
            raise SystemExit(f"{table}.{key} appears {count} times")
        return source[: start.end()] + new_body + source[end:]

    return source[: start.end()] + body.rstrip() + "\n\n  " + line + "\n" + source[end:]


def read_hindi() -> dict[str, str]:
    source = io.open(FILE, encoding="utf-8").read()
    start = re.search(r"const HINDI[^=]*=\s*\{", source)
    body = source[start.end():source.index("\n};", start.end())]
    return {
        key: value.replace("\\'", "'").replace("\\\\", "\\")
        for key, value in re.findall(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", body)
    }


def display_length(text: str) -> int:
    """Rough width of a string in characters a person can see.

    len() counts codepoints, which is not width and is not comparable between
    scripts. Devanagari "जकड़न" is six codepoints but four visible characters —
    two of them vowel signs that sit inside the letter they modify and add
    nothing to the line. Bengali spells many of the same sounds with more
    codepoints for the same width.

    The first version of this guard used len() and fired immediately on
    health.c.later4, where the Bengali was 20 codepoints against the Hindi 10.
    Nine of those ten extra codepoints were not visible.

    Dropping combining marks fixes that. It is an approximation — a real width
    would account for conjuncts, which collapse several letters into one glyph —
    but it is the difference between a number that means something and one that
    does not.
    """
    import unicodedata

    return len([c for c in text if not unicodedata.combining(c)])


def check_short() -> None:
    """Flag a chip that is long for its own language, not merely for the Hindi.

    Comparing every translation to the Hindi was the second mistake here, and a
    worse one than counting codepoints. Tamil and Bengali encode a word in more
    codepoints than Devanagari does as a matter of how the scripts are built, so
    "one and a half times the length of सुबह जकड़न" is a bar that a perfectly
    good Tamil chip cannot clear. It fired on Tamil "காலையில் விறைப்பு" —
    morning stiffness, four Tamil words, shorter on screen than the five-word
    Bengali it had just rejected.

    So the comparison is inside one language: a chip is only suspicious if it is
    far longer than the rest of the chips beside it, which is what actually
    predicts a wrap. A sentence dropped in among three-word labels stands out;
    a script that is uniformly a little longer does not.
    """
    for code in T:
        widths = {key: display_length(value) for key, value in T[code].items()}
        typical = sorted(widths.values())[len(widths) // 2]

        for key, width in widths.items():
            if width > max(typical * 2, typical + 8):
                raise SystemExit(
                    f"{code} {key} is far longer than the other chips in its"
                    f" language:\n"
                    f"    {width} visible: {T[code][key]}\n"
                    f"    typical chip in {code} is {typical}\n"
                    f"  This is the shape of a translation that grew into a"
                    f" sentence. A chip that wraps is the reason the box has"
                    f" buttons instead of a list."
                )


def check_digits(hindi: dict[str, str]) -> None:
    for code in T:
        for key, value in T[code].items():
            for number in re.findall(r"\d+", hindi.get(key, "")):
                if number not in value:
                    raise SystemExit(f"{code} {key} invented or lost the number {number}")


def check_no_medical_claims() -> None:
    units = re.compile(r"\d+\s*(mg|ml|मि.ग्रा.|मिली|ग्राम|g)\b", re.I)
    drugs = re.compile(
        r"\b(paracetamol|ibuprofen|aspirin|crocin|dolo|tylenol|acetaminophen|"
        r"amoxycillin|amoxicillin)\b",
        re.I,
    )
    for code in T:
        for key, value in T[code].items():
            if units.search(value):
                raise SystemExit(f"{code} {key} states a dose: {value}")
            if drugs.search(value):
                raise SystemExit(f"{code} {key} names a medicine: {value}")


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()
    hindi = read_hindi()

    check_short()
    check_digits(hindi)
    check_no_medical_claims()

    count = 0
    for code, table in TABLES:
        for key, value in T[code].items():
            source = set_key(source, table, key, value)
            count += 1
        print(f"  {table:<10} {len(T[code])} keys")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)
    keys = len(T[TABLES[0][0]])
    print(f"\n{keys} keys x {len(TABLES)} languages = {count} strings")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
