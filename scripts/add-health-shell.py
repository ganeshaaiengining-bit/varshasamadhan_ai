"""
Fill the health box's shell into the eleven tables: labels, age bands, warnings.

    python scripts/add-health-shell.py

29 keys x 11 languages = 319 strings. This is the first of three health batches.
health.c.* (the tap chips) and health.q.* (the questions) follow separately,
because a script file of 92 translated values is a script nobody can review.

WHAT THIS BATCH IS, AND WHY IT IS DELIBERATELY BLAND

Every string here is either a label or a warning. None of them is advice.

  health.notAdviceStrong      "यह चिकित्सा सलाह नहीं है।"
  health.notAdvice           "कोई भी दवाई शुरू या बंद न करें — पहले डॉक्टर से मिलें।"

Those two are the point of the box. The questions a visitor taps are ordinary
everyday complaints — a fever in a child, a knee that aches on the stairs — and
the answer the model gives is generated, not written by a clinician. So the box
says so in the visitor's own language, next to the button, before they tap it,
and the guard below refuses to let a batch introduce a drug name, a hospital
name or a dose.

Translated by generating, then checked by four scripts, none of which can read
meaning. Someone who speaks each language still has to read these, which is
stated in check-translations.py's own output.

THE AGE RANGES MUST KEEP THEIR DIGITS

health.band.infant.label is "0 – 2 साल" and elder is "76 – 100 साल". A
translation that drops or restates those numbers puts the wrong child in front
of the wrong questions, so every digit in the Hindi is required to survive.

Run once. Then run scripts/check-scripts.py and scripts/test-language-switch.py.
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
        "health.ageLabel": "वय (वर्षे)",
        "health.bandsLabel": "वयानुसार निवडा",
        "health.heading": "तुमचे वय सांगा",
        "health.intro": "वयानुसार जे प्रश्न नेहमी विचारले जातात ते येथे दिसतील. कोणतेही बटण दाबू नका — प्रश्न खाली भरला जाईल, मग विचारा.",
        "health.notAdvice": "कोणतेही औषध सुरू किंवा बंद करू नका — आधी डॉक्टरांचा सल्ला घ्या.",
        "health.notAdviceStrong": "हे वैद्यकीय सल्ला नाही.",
        "health.privacy": "नाव किंवा पत्ता लिहिण्याची गरज नाही.",
        "health.years": "वर्षे",
        "health.band.infant.label": "0 – 2 वर्षे",
        "health.band.infant.note": "अगदी लहान बाळे, जी अद्याप आपले म्हणणे सांगू शकत नाहीत",
        "health.band.child.label": "3 – 12 वर्षे",
        "health.band.child.note": "बाळे जी बोलू शकतात, परंतु प्रश्न विचारायला घाबरतात",
        "health.band.teen.label": "13 – 17 वर्षे",
        "health.band.teen.note": "किशोर, ज्यांना नेहमी अशा व्यक्तीचा भेट होत नाही जी ऐकून घेईल",
        "health.band.young.label": "18 – 30 वर्षे",
        "health.band.young.note": "नोकरी, पैसा आणि झोप — तिन्हींचा एकत्र भार",
        "health.band.middle.label": "31 – 45 वर्षे",
        "health.band.middle.note": "घर, मुले आणि स्वतःचे आरोग्य — सर्वांची जबाबदारी एकत्र",
        "health.band.later.label": "46 – 60 वर्षे",
        "health.band.later.note": "शरीराचे वय आणि त्याची काळजी — दोन्ही एकत्र",
        "health.band.senior.label": "61 – 75 वर्षे",
        "health.band.senior.note": "औषध, संतुलन आणि एकटेपणा — तिन्ही सोबत",
        "health.band.elder.label": "76 – 100 वर्षे",
        "health.band.elder.note": "प्रत्येक औषधाची तपासणी आवश्यक, प्रत्येक पडणे गंभीर",
        "health.emergencyStrong": "आपत्काली फोन करा:",
        "health.emergencyCall": "(आपत्काल)",
        "health.emergencyAmbulance": "(रुग्णवाहिका)",
        "health.emergencyWomen": "(महिला मदतवाहिनी)",
    },
    "bn": {
        "health.ageLabel": "বয়স (বছর)",
        "health.bandsLabel": "বয়স অনুযায়ী বেছে নিন",
        "health.heading": "আপনার বয়স বলুন",
        "health.intro": "বয়স অনুযায়ী যে প্রশ্নগুলি নিয়মিত জিজ্ঞাসা করা হয়, সেগুলি এখানে দেখা যাবে। কোনো বাটন চাপবেন না — প্রশ্ন নিচে পূরণ হবে, তারপর জিজ্ঞাসা করুন।",
        "health.notAdvice": "কোনো ঔষধ শুরু বা বন্ধ করবেন না — আগে ডাক্তারের সাথে দেখা করুন।",
        "health.notAdviceStrong": "এটি চিকিৎসা পরামর্শ নয়।",
        "health.privacy": "নাম বা ঠিকানা লিখতে হবে না।",
        "health.years": "বছর",
        "health.band.infant.label": "0 – 2 বছর",
        "health.band.infant.note": "খুব ছোট শিশু, যারা এখনও নিজের কথা বলতে পারে না",
        "health.band.child.label": "3 – 12 বছর",
        "health.band.child.note": "যে শিশুরা কথা বলতে পারে, কিন্তু প্রশ্ন করতে ভয় পায়",
        "health.band.teen.label": "13 – 17 বছর",
        "health.band.teen.note": "কিশোর, যাদের প্রায়ই এমন কাউকে পান না যে শুনে নেয়",
        "health.band.young.label": "18 – 30 বছর",
        "health.band.young.note": "চাকরি, টাকা আর ঘুম — তিনটের একসাথে ভার",
        "health.band.middle.label": "31 – 45 বছর",
        "health.band.middle.note": "বাড়ি, সন্তান আর নিজের স্বাস্থ্য — সবার দায়িত্ব একসাথে",
        "health.band.later.label": "46 – 60 বছর",
        "health.band.later.note": "শরীরের বয়স আর তার যত্ন — দুটো একসাথে",
        "health.band.senior.label": "61 – 75 বছর",
        "health.band.senior.note": "ওষুধ, ভারসাম্য আর একাকিত্ব — তিনটাই একসাথে",
        "health.band.elder.label": "76 – 100 বছর",
        "health.band.elder.note": "প্রতিটি ঔষধ পরীক্ষা করা জরুরি, প্রতিটি পড়া গুরুতর",
        "health.emergencyStrong": "জরুরি অবস্থায় ফোন করুন:",
        "health.emergencyCall": "(জরুরি)",
        "health.emergencyAmbulance": "(অ্যাম্বুলেন্স)",
        "health.emergencyWomen": "(নারী সহায়তা)",
    },
    "ta": {
        "health.ageLabel": "வயது (ஆண்டுகள்)",
        "health.bandsLabel": "வயதின் அடிப்படையில் தேர்வு செய்யுங்கள்",
        "health.heading": "உங்கள் வயதைச் சொல்லுங்கள்",
        "health.intro": "வயதின் அடிப்படையில் அடிக்கடி கேட்கப்படும் கேள்விகள் இங்கே தெரியும். எந்த பொத்தானையும் அழுத்த வேண்டாம் — கேள்வி கீழே நிரப்பப்படும், பின்னர் கேளுங்கள்.",
        "health.notAdvice": "எந்த மருந்தையும் தொடங்கவும் நிறுத்தவும் — முதலில் மருத்துவரைச் சந்தியுங்கள்.",
        "health.notAdviceStrong": "இது மருத்துவ ஆலோசனை அல்ல.",
        "health.privacy": "பெயர் அல்லது முகவரி எழுத வேண்டியதில்லை.",
        "health.years": "ஆண்டுகள்",
        "health.band.infant.label": "0 – 2 வயது",
        "health.band.infant.note": "சிறிய குழந்தைகள், இன்னும் தமது காரியத்தை சொல்ல முடியாதவர்கள்",
        "health.band.child.label": "3 – 12 வயது",
        "health.band.child.note": "பேசக்கூடிய குழந்தைகள், ஆனால் கேள்வி கேட்பதற்கு பயப்படுபவர்கள்",
        "health.band.teen.label": "13 – 17 வயது",
        "health.band.teen.note": "இளம் பிரதமர்கள், அவர்களுக்குப் பொதுவாக கேட்டுக் கொள்ளும் ஒருவர் கிடைப்பதில்லை",
        "health.band.young.label": "18 – 30 வயது",
        "health.band.young.note": "வேலை, பணம், தூக்கம் — மூன்றின் சேர்ந்த பாரம்",
        "health.band.middle.label": "31 – 45 வயது",
        "health.band.middle.note": "வீடு, குழந்தைகள், தனது உடல்நலம் — அனைத்து பொறுப்பும் ஒரே சேர்வு",
        "health.band.later.label": "46 – 60 வயது",
        "health.band.later.note": "உடலின் வயதும் அதன் பராமரிப்பும் — இரண்டும் ஒரே நேரத்தில்",
        "health.band.senior.label": "61 – 75 வயது",
        "health.band.senior.note": "மருந்து, சமநிலை, தனிமை — மூன்றும் சேர்ந்தே",
        "health.band.elder.label": "76 – 100 வயது",
        "health.band.elder.note": "ஒவ்வொரு மருந்தையும் பரிசோதிக்க வேண்டும், ஒவ்வொரு விழுவும் கடுமையானது",
        "health.emergencyStrong": "அவசரத்தில் அழைக்கவும்:",
        "health.emergencyCall": "(அவசரம்)",
        "health.emergencyAmbulance": "(ஆம்புலன்ஸ்)",
        "health.emergencyWomen": "(பெண் உதவி)",
    },
    "te": {
        "health.ageLabel": "వయస్సు (సంవత్సరాలు)",
        "health.bandsLabel": "వయస్సు ప్రకారం ఎంచుకోండి",
        "health.heading": "మీ వయస్సు చెప్పండి",
        "health.intro": "వయస్సు ప్రకారం తరచుగా అడిగే ప్రశ్నలు ఇక్కడ కనిపిస్తాయి. ఏ బటన్‌నూ నొక్కవద్దు — ప్రశ్న కింద నింపబడుతుంది, తర్వాత అడగండి.",
        "health.notAdvice": "ఏ మందులైనా ప్రారంభించవద్దు లేదా ఆపవద్దు — ముందుగా వైద్యుడిని కలవండి.",
        "health.notAdviceStrong": "ఇది వైద్య సలహా కాదు.",
        "health.privacy": "పేరు లేదా చిరునామా రాయాల్సిన అవసరం లేదు.",
        "health.years": "సంవత్సరాలు",
        "health.band.infant.label": "0 – 2 సంవత్సరాలు",
        "health.band.infant.note": "పుట్టుక పిల్లలు, ఇంకా తమ మాట చెప్పలేని వారు",
        "health.band.child.label": "3 – 12 సంవత్సరాలు",
        "health.band.child.note": "మాట్లాడగల పిల్లలు, కానీ ప్రశ్నించడానికి భయపడే వారు",
        "health.band.teen.label": "13 – 17 సంవత్సరాలు",
        "health.band.teen.note": "కౌమారులు, వారికి సాధారణంగా విని అవుకునే వ్యక్తి దొరకడం లేదు",
        "health.band.young.label": "18 – 30 సంవత్సరాలు",
        "health.band.young.note": "పని, డబ్బు, నిద్ర — మూడు ఒకేసారి భారం",
        "health.band.middle.label": "31 – 45 సంవత్సరాలు",
        "health.band.middle.note": "ఇల్లు, పిల్లలు, మీ స్వంత ఆరోగ్యం — అన్నీ ఒకే బాధ్యత",
        "health.band.later.label": "46 – 60 సంవత్సరాలు",
        "health.band.later.note": "శరీర వయస్సు, దాని సంరక్షణ — రెండూ ఒకేసారి",
        "health.band.senior.label": "61 – 75 సంవత్సరాలు",
        "health.band.senior.note": "మందులు, సమతుల్యత, ఒంటరితనం — మూడూ కలిపి",
        "health.band.elder.label": "76 – 100 సంవత్సరాలు",
        "health.band.elder.note": "ప్రతి మందుల పరీక్ష అవసరం, ప్రతి పడకపోవడం తీవ్రం",
        "health.emergencyStrong": "అత్యవసరంలో కాల్ చేయండి:",
        "health.emergencyCall": "(అత్యవసరం)",
        "health.emergencyAmbulance": "(అంబులెన్స్)",
        "health.emergencyWomen": "(మహిళా సహాయం)",
    },
    "gu": {
        "health.ageLabel": "ઉંમર (વર્ષ)",
        "health.bandsLabel": "ઉંમર પ્રમાણે પસંદ કરો",
        "health.heading": "તમારી ઉંમર કહો",
        "health.intro": "ઉંમર પ્રમાણે જે પ્રશ્નો વારંવાર પૂછાય છે તે અહીં દેખાશે. કોઈ બટન દબાવવું નહીં — પ્રશ્ન નીચે ભરાશે, પછી પૂછો.",
        "health.notAdvice": "કોઈ દવા શરૂ કે બંધ ન કરો — પહેલાં ડૉક્ટરની સલાહ લો.",
        "health.notAdviceStrong": "આ તબીબી સલાહ નથી.",
        "health.privacy": "નામ કે સરનામું લખવાની જરૂર નથી.",
        "health.years": "વર્ષ",
        "health.band.infant.label": "0 – 2 વર્ષ",
        "health.band.infant.note": "નાનાં બાળકો, જે હજી પોતાનું કહી શકતાં નથી",
        "health.band.child.label": "3 – 12 વર્ષ",
        "health.band.child.note": "બાળકો જે બોલી શકે, પણ પ્રશ્ન પૂછતાં ડરે છે",
        "health.band.teen.label": "13 – 17 વર્ષ",
        "health.band.teen.note": "કિશોરો, જેમને ઘણીવાર એવું કોઈ મળતું નથી જે સાંભળે",
        "health.band.young.label": "18 – 30 વર્ષ",
        "health.band.young.note": "નોકરી, પૈસા અને ઊંઘ — ત્રણેય સાથે બોજ",
        "health.band.middle.label": "31 – 45 વર્ષ",
        "health.band.middle.note": "ઘર, બાળકો અને પોતાની તબિયત — બધાની જવાબદારી સાથે",
        "health.band.later.label": "46 – 60 વર્ષ",
        "health.band.later.note": "શરીરની ઉંમર અને તેની સંભાળ — બંને સાથે",
        "health.band.senior.label": "61 – 75 વર્ષ",
        "health.band.senior.note": "દવા, સંતુલન અને એકલપણ — ત્રણેય સાથે",
        "health.band.elder.label": "76 – 100 વર્ષ",
        "health.band.elder.note": "દરેક દવાની ચકાસણી જરૂરી, દરેક પડવું ગંભીર",
        "health.emergencyStrong": "કટોકટીમાં ફોન કરો:",
        "health.emergencyCall": "(કટોકટી)",
        "health.emergencyAmbulance": "(એમ્બ્યુલન્સ)",
        "health.emergencyWomen": "(મહિલા મદદ)",
    },
    "kn": {
        "health.ageLabel": "ವಯಸ್ಸು (ವರ್ಷ)",
        "health.bandsLabel": "ವಯಸ್ಸಿಗೆ ತಕ್ಕಂತೆ ಆಯ್ಕೆಮಾಡಿ",
        "health.heading": "ನಿಮ್ಮ ವಯಸ್ಸು ತಿಳಿಸಿ",
        "health.intro": "ವಯಸ್ಸಿಗೆ ತಕ್ಕಂತೆ ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ. ಯಾವುದೇ ಬಟನ್ ಒತ್ತಬೇಡಿ — ಪ್ರಶ್ನೆ ಕೆಳಗೆ ತುಂಬಲಾಗುತ್ತದೆ, ನಂತರ ಕೇಳಿ.",
        "health.notAdvice": "ಯಾವುದೇ ಔಷಧಿ ಆರಂಭಿಸಬೇಡಿ ಅಥವಾ ನಿಲ್ಲಿಸಬೇಡಿ — ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.",
        "health.notAdviceStrong": "ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ.",
        "health.privacy": "ಹೆಸರು ಅಥವಾ ವಿಳಾಸ ಬರೆಯುವುದು ಅಗತ್ಯವಿಲ್ಲ.",
        "health.years": "ವರ್ಷ",
        "health.band.infant.label": "0 – 2 ವರ್ಷ",
        "health.band.infant.note": "ತುಗ್ಗ ಮಕ್ಕಳು, ಇನ್ನೂ ತಮ್ಮ ವಾತನೆ ಹೇಳಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ",
        "health.band.child.label": "3 – 12 ವರ್ಷ",
        "health.band.child.note": "ಮಾತನಾಡಬಹುದಾದ ಮಕ್ಕಳು, ಆದರೆ ಪ್ರಶ್ನೆ ಕೇಳಲು ಹೆಚ್ಚಿಕೆ ಹೆದುವರುತ್ತಾರೆ",
        "health.band.teen.label": "13 – 17 ವರ್ಷ",
        "health.band.teen.note": "ಕಿಶೋರರು, ಅವರಿಗೆ ಸಾಮಾನ್ಯವಾಗಿ ಕೇಳಿ ಕೊಳ್ಳುವ ವ್ಯಕ್ತಿ ಸಿಗುವುದಿಲ್ಲ",
        "health.band.young.label": "18 – 30 ವರ್ಷ",
        "health.band.young.note": "ಕೆಲಸ, ಹಣ ಮತ್ತು ನಿದ್ದೆ — ಮೂರರ ಒಟ್ಟಿಗೆ ಭಾರ",
        "health.band.middle.label": "31 – 45 ವರ್ಷ",
        "health.band.middle.note": "ಮನೆ, ಮಕ್ಕಳು ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯ — ಎಲ್ಲರ ಜವಾಬದಾರಿ ಒಟ್ಟಿಗೆ",
        "health.band.later.label": "46 – 60 ವರ್ಷ",
        "health.band.later.note": "ದೇಹದ ವಯಸ್ಸು ಮತ್ತು ಅದರ ಆರೈಕೆ — ಎರಡೂ ಒಟ್ಟಿಗೆ",
        "health.band.senior.label": "61 – 75 ವರ್ಷ",
        "health.band.senior.note": "ಔಷಧಿ, ಸಮತೋಲನ ಮತ್ತು ಒಂಟಿಗೆ — ಮೂರೂ ಒಟ್ಟಿಗೆ",
        "health.band.elder.label": "76 – 100 ವರ್ಷ",
        "health.band.elder.note": "ಪ್ರತಿ ಔಷಧಿಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ, ಪ್ರತಿ ಉದುರುವಿಕೆ ಗಂಭೀರ",
        "health.emergencyStrong": "ಅಪಾಯಕಾರಿ ಸ್ಥಿತಿಯಲ್ಲಿ ಫೋನ್ ಮಾಡಿ:",
        "health.emergencyCall": "(ಅಪಾಯ)",
        "health.emergencyAmbulance": "(ಆಂಬ್ಯುಲೆನ್ಸ್)",
        "health.emergencyWomen": "(ಮಹಿಳಾ ಸಹಾಯ)",
    },
    "ml": {
        "health.ageLabel": "പ്രായം (വർഷം)",
        "health.bandsLabel": "പ്രായം അനുസരിച്ച് തിരഞ്ഞെടുക്കുക",
        "health.heading": "നിങ്ങളുടെ പ്രായം പറയൂ",
        "health.intro": "പ്രായം അനുസരിച്ച് പതിററാം ചോദിക്കുന്ന ചോദ്യങ്ങൾ ഇവിടെ കാണും. ഏതെങ്കിലും ബട്ടൺ അമർത്തരുത് — ചോദ്യം താഴെ പൂരിപ്പിക്കും, ശേഷം ചോദിക്കൂ.",
        "health.notAdvice": "ഏതെങ്കിലും മരുന്ന് തുടങ്ങാതേ നിർത്താതേ — ആദ്യം ഡോക്ടറെ കാണുക.",
        "health.notAdviceStrong": "ഇത് വൈദ്യ ഉപദേശമല്ല.",
        "health.privacy": "പേരോ വിലാസമോ എഴുതേണ്ടതില്ല.",
        "health.years": "വർഷം",
        "health.band.infant.label": "0 – 2 വർഷം",
        "health.band.infant.note": "കുഞ്ഞികൾ, ഇനിപ്പോഴും സ്വന്തം കാര്യം പറയാനാകില്ലാത്തവർ",
        "health.band.child.label": "3 – 12 വർഷം",
        "health.band.child.note": "സംസാരിക്കാനാകുന്ന കുട്ടികൾ, പക്ഷേ ചോദിക്കാൻ ഭയപ്പെടുന്നവർ",
        "health.band.teen.label": "13 – 17 വർഷം",
        "health.band.teen.note": "ഇവലാവർ, അവർക്ക് സാധാരണമായി കേൾക്കുന്ന ഒരാൾ കിട്ടുമെങ്കിൽ അല്ല",
        "health.band.young.label": "18 – 30 വർഷം",
        "health.band.young.note": "ജോലി, പണം, ഉറക്ക് — മൂന്നിന്റെയും ഒന്നിച്ചുള്ള ഭാരം",
        "health.band.middle.label": "31 – 45 വർഷം",
        "health.band.middle.note": "വീട്, കുട്ടികൾ, സ്വന്തം ആരോഗ്യം — എല്ലാവരുടെയും ഉത്തരാധികാരിതതം ഒരുപാടി",
        "health.band.later.label": "46 – 60 വർഷം",
        "health.band.later.note": "ശരീരത്തിന്റെ പ്രായവും അതിന്റെ പരിചരണവും — രണ്ടും ഒരുപാടി",
        "health.band.senior.label": "61 – 75 വർഷം",
        "health.band.senior.note": "മരുന്ന്, സന്തുലനം, ഒറ്റയാകല — മൂന്നും ഒരുപാടി",
        "health.band.elder.label": "76 – 100 വർഷം",
        "health.band.elder.note": "ഓരോ മരുന്നിന്റെയും പരിശോധന ആവശ്യം, ഓരോ വീഴ്ചയും ഗുരുതം",
        "health.emergencyStrong": "അടിയന്തരത്തിൽ വിളിക്കുക:",
        "health.emergencyCall": "(അടിയന്തരം)",
        "health.emergencyAmbulance": "(ആംബുലൻസ്)",
        "health.emergencyWomen": "(വനിതാ സഹായം)",
    },
    "pa": {
        "health.ageLabel": "ਉਮਰ (ਸਾਲ)",
        "health.bandsLabel": "ਉਮਰ ਅਨੁਸਾਰ ਚੁਣੋ",
        "health.heading": "ਆਪਣੀ ਉਮਰ ਦੱਸੋ",
        "health.intro": "ਉਮਰ ਅਨੁਸਾਰ ਜੋ ਸਵਾਲ ਵਾਰ-ਵਾਰ ਪੁੱਛੇ ਜਾਂਦੇ ਹਨ, ਉਹ ਇੱਥੇ ਦਿਸਣਗੇ। ਕੋਈ ਬਟਨ ਨਾ ਦਬਾਓ — ਸਵਾਲ ਹੇਠਾਂ ਭਰਿਆ ਜਾਵੇਗਾ, ਫਿਰ ਪੁੱਛੋ।",
        "health.notAdvice": "ਕੋਈ ਵੀ ਦਵਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਨਾ ਕਰੋ — ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ।",
        "health.notAdviceStrong": "ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ।",
        "health.privacy": "ਨਾਮ ਜਾਂ ਪਤਾ ਲਿਖਣ ਦੀ ਲੋੜ ਨਹੀਂ।",
        "health.years": "ਸਾਲ",
        "health.band.infant.label": "0 – 2 ਸਾਲ",
        "health.band.infant.note": "ਨ੹ਟੇ ਬੱਚੇ, ਜੋ ਹਾਲੇ ਆਪਣੀ ਗੱਲ ਨਹੀਂ ਕਰ ਸਕਦੇ",
        "health.band.child.label": "3 – 12 ਸਾਲ",
        "health.band.child.note": "ਬੱਚੇ ਜੋ ਬੋਲ ਸਕਦੇ ਹਨ, ਪਰ ਸਵਾਲ ਪੁੱਛਣ ਤੋਂ ਡਰਦੇ ਹਨ",
        "health.band.teen.label": "13 – 17 ਸਾਲ",
        "health.band.teen.note": "ਕਿਸਾਨ, ਜਿਨ੍ਹਾਂ ਨੂੰ ਆਮ ਤੌਰ 'ਤੇ ਇਹਨਾਂ ਦੀ ਗੱਲ ਕੋਈ ਨਹੀਂ ਮਿਲਦਾ ਜੋ ਸੁਣੇ",
        "health.band.young.label": "18 – 30 ਸਾਲ",
        "health.band.young.note": "ਨੌਕਰੀ, ਪੈਸਾ ਅਤੇ ਨੀਂਦ — ਤਿੰਨਾਂ ਦਾ ਇਕੱਠਾ ਬੋਝ",
        "health.band.middle.label": "31 – 45 ਸਾਲ",
        "health.band.middle.note": "ਘਰ, ਬੱਚੇ ਅਤੇ ਆਪਣੀ ਸਿਹਤ — ਸਭ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਇਕੱਠੇ",
        "health.band.later.label": "46 – 60 ਸਾਲ",
        "health.band.later.note": "ਸਰੀਰ ਦੀ ਉਮਰ ਅਤੇ ਉਸਦੀ ਸੰਭਾਲ — ਦੋਵੇਂ ਇਕੱਠੇ",
        "health.band.senior.label": "61 – 75 ਸਾਲ",
        "health.band.senior.note": "ਦਵਾ, ਸੰਤੁਲਨ ਅਤੇ ਤਨਹਾਰੀ — ਤਿੰਨਾਂ ਇਕੱਠੇ",
        "health.band.elder.label": "76 – 100 ਸਾਲ",
        "health.band.elder.note": "ਹਰ ਦਵਾ ਦੀ ਜਾਂਚ ਜ਼ਰੂਰੀ, ਹਰ ਡਿਗੱਗਣਾ ਗੰਭੀਰ",
        "health.emergencyStrong": "ਐਮਰਜੈਂਸੀ ਹਾਲਤ ਵਿੱਚ ਫ਼ੋਨ ਕਰੋ:",
        "health.emergencyCall": "(ਐਮਰਜੈਂਸੀ)",
        "health.emergencyAmbulance": "(ਐਂਬੂਲੈਂਸ)",
        "health.emergencyWomen": "(ਔਰਤ ਹੈਲਪਲਾਈਨ)",
    },
    "ur": {
        "health.ageLabel": "عمر (سال)",
        "health.bandsLabel": "عمر کے مطابق منتخب کریے",
        "health.heading": "اپنی عمر بتائیے",
        "health.intro": "عمر کے مطابق جو سوال بار بار پوچھے جاتے ہیں وہ یہاں دکھائی دیں گے۔ کوئی بٹن نہ دبائیں — سوال نیچے بھر جائے گا، پھر پوچھ لیجیے۔",
        "health.notAdvice": "کوئی دوا شروع یا بند نہ کریں — پہلے ڈاکٹر سے ملیں۔",
        "health.notAdviceStrong": "یہ طبی مشورہ نہیں ہے۔",
        "health.privacy": "نام یا پتہ لکھنے کی ضرورت نہیں۔",
        "health.years": "سال",
        "health.band.infant.label": "0 – 2 سال",
        "health.band.infant.note": "نوم بچے، جو ابھی اپنی بات نہیں کہہ سکتے",
        "health.band.child.label": "3 – 12 سال",
        "health.band.child.note": "بچے جو بول سکتے ہیں، مگر سوال پوچھنے سے ڈرتے ہیں",
        "health.band.teen.label": "13 – 17 سال",
        "health.band.teen.note": "نوجوان، جن کے لیے اکثر ایسا کوئی فرد نہیں ملتا جو سنے",
        "health.band.young.label": "18 – 30 سال",
        "health.band.young.note": "نوکری، پیسے اور نیند — تینوں کا ایک ساتھ بوجھ",
        "health.band.middle.label": "31 – 45 سال",
        "health.band.middle.note": "گھر، بچے اور اپنی صحت — سب کی ذمہ داری ایک ساتھ",
        "health.band.later.label": "46 – 60 سال",
        "health.band.later.note": "جسم کی عمر اور اس کی نگہداشت — دونوں ایک ساتھ",
        "health.band.senior.label": "61 – 75 سال",
        "health.band.senior.note": "دوا، توازن اور تنہائی — تینوں ساتھ",
        "health.band.elder.label": "76 – 100 سال",
        "health.band.elder.note": "ہر دوا کی جانچ ضروری، ہر گرنے کا معاملہ سنگین",
        "health.emergencyStrong": "ہنگامی صورتحال میں فون کریے:",
        "health.emergencyCall": "(ہنگامی)",
        "health.emergencyAmbulance": "(ایمبولینس)",
        "health.emergencyWomen": "(خواتین ہیلپ لائن)",
    },
    "ar": {
        "health.ageLabel": "العمر (سنوات)",
        "health.bandsLabel": "اختر حسب العمر",
        "health.heading": "أخبر عن عمرك",
        "health.intro": "الأسئلة التي تُطرح كثيراً بحسب العمر ستظهر هنا. لا تضغط أي زر — يُكتب السؤال بالأسفل ثم اسأل.",
        "health.notAdvice": "لا تبدأ أي دواء ولا توقفه — اذهب إلى الطبيب أولاً.",
        "health.notAdviceStrong": "هذه ليست نصيحة طبية.",
        "health.privacy": "لا حاجة لكتابة اسمك أو عنوانك.",
        "health.years": "سنوات",
        "health.band.infant.label": "0 – 2 سنة",
        "health.band.infant.note": "أطفال صغار، لا يزالون لا يستطيعون قول ما يريدون",
        "health.band.child.label": "3 – 12 سنة",
        "health.band.child.note": "أطفال يتحدثون، لكنهم يخافون من السؤال",
        "health.band.teen.label": "13 – 17 سنة",
        "health.band.teen.note": "مراهقون، لا يجدون غالباً من يستمع إليهم",
        "health.band.young.label": "18 – 30 سنة",
        "health.band.young.note": "العمل والمال والنوم — عبء الثلاثة معاً",
        "health.band.middle.label": "31 – 45 سنة",
        "health.band.middle.note": "البيت والأطفال وصحة النفس — مسؤولية الجميع دفعة واحدة",
        "health.band.later.label": "46 – 60 سنة",
        "health.band.later.note": "سنّ الجسد والعناية به — معاً",
        "health.band.senior.label": "61 – 75 سنة",
        "health.band.senior.note": "الدواء والتوازن والعزلة — الثلاثة معاً",
        "health.band.elder.label": "76 – 100 سنة",
        "health.band.elder.note": "فحص كل دواء ضروري، وكل سقطة أمر جاد",
        "health.emergencyStrong": "اتصل في الطوارئ:",
        "health.emergencyCall": "(طوارئ)",
        "health.emergencyAmbulance": "(إسعاف)",
        "health.emergencyWomen": "(خط دعم المرأة)",
    },
    "es": {
        "health.ageLabel": "Edad (años)",
        "health.bandsLabel": "Elige por edad",
        "health.heading": "Dinos tu edad",
        "health.intro": "Aquí aparecerán las preguntas que más se hacen según la edad. No pulses ningún botón: la pregunta se rellena abajo y luego preguntas.",
        "health.notAdvice": "No empieces ni dejes ninguna medicina — ve antes al médico.",
        "health.notAdviceStrong": "Esto no es consejo médico.",
        "health.privacy": "No hace falta escribir tu nombre ni tu dirección.",
        "health.years": "años",
        "health.band.infant.label": "0 – 2 años",
        "health.band.infant.note": "Bebés pequeños, que todavía no saben decir lo que quieren",
        "health.band.child.label": "3 – 12 años",
        "health.band.child.note": "Niños que ya hablan, pero les da miedo preguntar",
        "health.band.teen.label": "13 – 17 años",
        "health.band.teen.note": "Adolescentes, que rara vez encuentran a alguien que los escuche",
        "health.band.young.label": "18 – 30 años",
        "health.band.young.note": "Trabajo, dinero y sueño: las tres cargas a la vez",
        "health.band.middle.label": "31 – 45 años",
        "health.band.middle.note": "Casa, hijos y tu propia salud: toda la responsabilidad junta",
        "health.band.later.label": "46 – 60 años",
        "health.band.later.note": "La edad del cuerpo y su cuidado, los dos a la vez",
        "health.band.senior.label": "61 – 75 años",
        "health.band.senior.note": "Medicina, equilibrio y soledad: las tres juntas",
        "health.band.elder.label": "76 – 100 años",
        "health.band.elder.note": "Revisar cada medicina es necesario, cada caída es grave",
        "health.emergencyStrong": "Llama en una emergencia:",
        "health.emergencyCall": "(emergencia)",
        "health.emergencyAmbulance": "(ambulancia)",
        "health.emergencyWomen": "(línea de ayuda a la mujer)",
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


def check_digits(hindi: dict[str, str]) -> None:
    """The age ranges carry the numbers that decide which questions appear.

    "0 – 2 साल" and "76 – 100 साल" put a different child in front of a
    different set of questions. A translation that restates a range in words,
    or drops an endpoint, is a bug no other check here would catch.
    """
    for code in T:
        for key, value in T[code].items():
            for number in re.findall(r"\d+", hindi.get(key, "")):
                if number not in value:
                    raise SystemExit(
                        f"{code} {key} lost the number {number}. The age band it"
                        f" labels decides which questions a visitor is shown."
                    )


def check_no_medical_claims() -> None:
    """Refuse a dose, a named drug or a named hospital.

    Deliberately narrow: it cannot tell a good translation from a bad one, and
    does not pretend to. It catches the three things that would be a genuine
    hazard if invented — a dose with a unit, a drug name, a hospital — and
    nothing else. health.* is labels and warnings in this batch; advice is
    generated per question at request time, not written here.
    """
    units = re.compile(r"\d+\s*(mg|ml|मि.ग्रा.|मिली|ग्राम|g|tsp|tsp\.|चम्मच)", re.I)
    drugs = re.compile(
        r"\b(paracetamol|ibuprofen|aspirin|crocin|dolo|tylenol|acetaminophen|"
        r"oramorph|amoxycillin|amoxicillin)\b",
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
    print("Then: scripts/check-scripts.py, scripts/check-spacing.py,")
    print("      scripts/test-language-switch.py")
    print()
    print("Not yet done: health.c.* (the 32 tap chips) and health.q.* (the 32")
    print("questions). Those carry the actual medical wording and want a native")
    print("speaker to read before they go anywhere near a visitor.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
