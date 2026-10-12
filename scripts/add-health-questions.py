"""
Fill health.q.* — the 32 questions the chips open.

    python scripts/add-health-questions.py

32 keys x 11 languages = 352 strings. Last of the three health batches.

THESE ARE QUESTIONS AND NOTHING ELSE

A chip fills the box, the visitor presses ask, and the model answers. So the
only thing written here is what the visitor typed. No answer, no advice, no
reassurance, no "you should see a doctor" — the whole point of health.notAdvice
above the box is that the answer is generated and not written by a clinician,
and padding a question with advice would quietly contradict the warning next to
it.

  health.q.infant1   "मेरे बच्चे को तeज़ बुखार है, क्या दूध दूँ?"
                     "should I give milk" — a question, left as a question. What
                     the answer says is not this file's decision.

THE GUARDS

  - every digit in the Hindi survives. health.q.later1 says "मेरी उम्र 54 साल
    है", and 54 is part of the question, not decoration
  - no dose, no named drug, no hospital — same rule as the other health batches
  - every question still ends in a question mark. A translation that turns one
    into a statement has changed what the visitor asked, and the answer will be
    confident about the wrong thing

Run once, then the checks, then test-language-switch.
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

# A question mark, in whichever form the script writes one. U+061F is what
# Arabic and Urdu use; the others here all take the ASCII mark.
QUESTION_MARKS = ("?", "؟")

T = {
    "mr": {
        "health.q.infant1": "माझ्या बाळाला ज्वर आलेला आहे, दूध द्यायचे का?",
        "health.q.infant2": "लहान बाळ खात नाही, काय करू?",
        "health.q.infant3": "बाळाला उल्टी होतेय, डॉक्टरांना कधी दाखवू?",
        "health.q.infant4": "बाळाला जुलोख्या होताय, काय खिलावू?",
        "health.q.child1": "बाळाच्या अभ्यासात मन लागत नाही, काय करू?",
        "health.q.child2": "बाळ रोज शाळेला जाण्यास नकार देत आहे, कारण काय असू शकते?",
        "health.q.child3": "बाळाला रात्री ज्वर येतो, काय करू?",
        "health.q.child4": "बाळाचे दात तडकत आहेत, दातांची कशी काळजी घ्यावी?",
        "health.q.teen1": "अभ्यासाचा खूप दबाव आहे, त्याचा सामना कसा करावा?",
        "health.q.teen2": "रात्री नींद ठीक येत नाही, काय करू?",
        "health.q.teen3": "मोबाइलची सवय लागली आहे, सोडण्याचा उपाय सांगा.",
        "health.q.teen4": "फार खोल उदासी वाटते, कोणाशी बोलावे?",
        "health.q.young1": "कामाचा खूप ताण आहे, कसा कमी करावा?",
        "health.q.young2": "बसून राहिल्याने पीठ दुखते आहे, काय करू?",
        "health.q.young3": "रात्री नींद येत नाही, काय उपाय आहे?",
        "health.q.young4": "पैसे कमी आहेत आणि खर्च जास्त, काय करू?",
        "health.q.middle1": "कमरेखालील दुखणे होत आहे, कारण काय असू शकते?",
        "health.q.middle2": "नींद चांगली येत नाही, सुधारण्यासाठी काय करावे?",
        "health.q.middle3": "घरात खूप ताण आहे, मुलांना कसे सांभाळू?",
        "health.q.middle4": "कामावर गेली वर्षे पोटात गॅसची समस्या आहे, काय करू?",
        "health.q.later1": "माझी वय 54 वर्षे आहे आणि पीठ दुखते आहे, काय करू?",
        "health.q.later2": "चढ़ताना गुडघा दुखतो, का?",
        "health.q.later3": "रात्री पायांची ऐंठण होते, काय करू?",
        "health.q.later4": "सकाळी उठल्यावर कमर जकडते, कारण काय असू शकते?",
        "health.q.senior1": "गुडघ्यांत इतका दुखणा आहे की चालणे अडचण आहे, काय करू?",
        "health.q.senior2": "अनेक औषधे रोज खावी लागतात — कोणी हानिकारक आहे हे कसे कळेल?",
        "health.q.senior3": "रात्री वारंवार पेशाबाची तक्रार आहे, काय करू?",
        "health.q.senior4": "कानी कमी ऐकते, ऐकण्याचा काही उपाय सांगा.",
        "health.q.elder1": "घरात पडण्याची भीती आहे, कोणती सुरक्षा ठेवावी?",
        "health.q.elder2": "नात्री कमजोर होत आहे, काय उपाय आहेत?",
        "health.q.elder3": "रोज दुखीचे औषध खावे लागते — याचा काही तोटा होतो का?",
        "health.q.elder4": "कधी डॉक्टरकडे जाणे आवश्यक आहे?",
    },
    "bn": {
        "health.q.infant1": "আমার ছেলের জ্বর হয়েছে, দুধ দেব কি?",
        "health.q.infant2": "ছোট বাচ্চা খাচ্ছে না, কী করব?",
        "health.q.infant3": "বাচ্চার বমি হচ্ছে, কখন ডাক্তারকে দেখাব?",
        "health.q.infant4": "বাচ্চার ডায়রিয়া হচ্ছে, কী খাওয়াব?",
        "health.q.child1": "ছেলের পড়াশোনায় মন বসছে না, কী করব?",
        "health.q.child2": "বাচ্চা প্রতিদিন স্কুলে যেতে মানা করছে, কারণ কী হতে পারে?",
        "health.q.child3": "বাচ্চার রাতে জ্বর আসে, কী করব?",
        "health.q.child4": "বাচ্চার দাঁত ভাঙছে, দাঁতের যত্ন কীভাবে করব?",
        "health.q.teen1": "পড়ার অনেক চাপ আছে, কীভাবে সামলাব?",
        "health.q.teen2": "রাতে ঠিকমতো ঘুম আসছে না, কী করব?",
        "health.q.teen3": "মোবাইলের অভ্যাস লেগে গেছে, ছাড়ার উপায় বলুন।",
        "health.q.teen4": "খুব মেসেজিত লাগে, কার সাথে কথা বলব?",
        "health.q.young1": "কাজের চাপ অনেক বেশি, কীভাবে কমাব?",
        "health.q.young2": "বসে থাকলে পিঠে ব্যথা হচ্ছে, কী করব?",
        "health.q.young3": "রাতে ঘুম আসছে না, কী উপায় আছে?",
        "health.q.young4": "পয়সা কম আর খরচ বেশি, কী করব?",
        "health.q.middle1": "কোমরে ব্যথা হচ্ছে, কারণ কী হতে পারে?",
        "health.q.middle2": "ঘুম ভালো আসছে না, উন্নত করতে কী করব?",
        "health.q.middle3": "বাড়িতে অনেক চাপ, সন্তানদের কীভাবে সামলাব?",
        "health.q.middle4": "কাজে বছরের পর বছর পেটে গ্যাসের সমস্যা, কী করব?",
        "health.q.later1": "আমার বয়স 54 বছর এবং পিঠে ব্যথা, কী করব?",
        "health.q.later2": "হাঁটতে গেলে হাঁটুতে ব্যথা হয়, কেন?",
        "health.q.later3": "রাতে পায়ে টান পড়ে, কী করব?",
        "health.q.later4": "সকালে উঠে কোমর শক্ত হয়ে যায়, কারণ কী হতে পারে?",
        "health.q.senior1": "হাঁটুতে এত ব্যথা যে হাঁটা কঠিন, কী করব?",
        "health.q.senior2": "অনেক ঔষধ প্রতিদিন খেতে হয় — কোনটি ক্ষতিকর কীভাবে বুঝব?",
        "health.q.senior3": "রাতে বারবার প্রস্রাবের সমস্যা, কী করব?",
        "health.q.senior4": "কম শুনি, শোনার কোনো উপায় আছে কি?",
        "health.q.elder1": "বাড়িতে পড়ে যাওয়ার ভয়, কোন সুরক্ষা রাখব?",
        "health.q.elder2": "স্মৃতি দুর্বল হচ্ছে, কী উপায় আছে?",
        "health.q.elder3": "প্রতিদিন ব্যথার ঔষধ খেতে হয় — এর কোনো ক্ষতি আছে কি?",
        "health.q.elder4": "কখন ডাক্তারের কাছে যাওয়া জরুরি?",
    },
    "ta": {
        "health.q.infant1": "என் குழந்தைக்கு காய்ச்சல் வந்துள்ளது, பால் கொடுக்கவா?",
        "health.q.infant2": "சிறிய குழந்தை சாப்பதில்லை, என்ன செய்வது?",
        "health.q.infant3": "குழந்தைக்கு வாந்தி வருகிறது, எப்போது மருத்துவரைக் காட்டுவது?",
        "health.q.infant4": "குழந்தைக்கு வயிற்றுப்போக்கு, என்ன கொடுக்கலாம்?",
        "health.q.child1": "குழந்தையின் படிப்பில் மனம் பொருட்டதில்லை, என்ன செய்வது?",
        "health.q.child2": "குழந்தை தினமும் பள்ளிக்குச் செல்ல மறுக்கிறது, காரணம் என்ன இருக்கலாம்?",
        "health.q.child3": "குழந்தைக்கு இரவில் காய்ச்சல் வருகிறது, என்ன செய்வது?",
        "health.q.child4": "குழந்தையின் பல் உடைகிறது, பல்லை எப்படி பராமரிக்கலாம்?",
        "health.q.teen1": "படிப்பில் மிகவும் அழுத்தம் உள்ளது, அதை எப்படி எதிர்கொள்வது?",
        "health.q.teen2": "இரவில் தூக்கம் சரியாக வரவில்லை, என்ன செய்வது?",
        "health.q.teen3": "மொபைல் பழக்கம் ஏறிவிட்டது, விடுவதற்கான வழி சொல்லுங்கள்.",
        "health.q.teen4": "மிகவும் மனக்கவலி தோன்றுகிறது, யாரிடம் பேசுவது?",
        "health.q.young1": "வேலையில் மிகவும் அழுத்தம், எப்படி குறைக்கலாம்?",
        "health.q.young2": "உட்கார்ந்தால் முதுகு வலிக்கிறது, என்ன செய்வது?",
        "health.q.young3": "இரவில் தூக்கம் வரவில்லை, என்ன வழி உள்ளது?",
        "health.q.young4": "பணம் குறைவு, செலவு அதிகம், என்ன செய்வது?",
        "health.q.middle1": "கீட்டில் வலி ஏற்படுகிறது, காரணம் என்ன இருக்கலாம்?",
        "health.q.middle2": "தூக்கம் சரியாக வரவில்லை, மேம்படுத்த என்ன செய்வது?",
        "health.q.middle3": "வீட்டில் அதிக அழுத்தம், குழந்தைகளை எப்படி கவனிக்கலாம்?",
        "health.q.middle4": "வேலையில் பல ஆண்டுகளாக வயிற்றில் வாயு, என்ன செய்வது?",
        "health.q.later1": "என் வயது 54, முதுகில் வலி உள்ளது, என்ன செய்வது?",
        "health.q.later2": "ஏறும்போது முட்டுவலிக்கிறது, ஏன்?",
        "health.q.later3": "இரவில் கால் இருப்பு, என்ன செய்வது?",
        "health.q.later4": "காலையில் எழும்பும்போது கீட்டு கட்டுப்பட்டுபோகிறது, காரணம் என்ன?",
        "health.q.senior1": "முட்டுகளில் அதிக வலி, நடக்க கடினமாக உள்ளது, என்ன செய்வது?",
        "health.q.senior2": "பல மருந்துகள் தினமும் செவ்வது — எது தீங்கு விளைவிப்பதை எப்படி அறியும்?",
        "health.q.senior3": "இரவில் அடிக்கடி சிறுநீர், என்ன செய்வது?",
        "health.q.senior4": "கேட்பது குறைந்துள்ளது, கேட்பதற்கான ஏதாவது வழி சொல்லுங்கள்.",
        "health.q.elder1": "வீட்டில் விழும் பயம் உள்ளது, என்ன பாதுகாப்பு வைக்கலாம்?",
        "health.q.elder2": "நினைவு பலவீதமாகிறது, என்ன வழி உள்ளது?",
        "health.q.elder3": "தினமும் வலி மருந்து செவ்வது — இதற்கு தீங்கு உள்ளதா?",
        "health.q.elder4": "எப்போது மருத்துவரிடம் செல்வது அவசியம்?",
    },
    "te": {
        "health.q.infant1": "నా బిడ్డికి జ్వరం వచ్చింది, పాలు ఇవ్వాలా?",
        "health.q.infant2": "చిన్న పిల్ల ఏమి తినడం లేదు, ఏమి చేయాలి?",
        "health.q.infant3": "పిల్లకు విరేచనాలు అవుతున్నాయి, ఎప్పుడు వైద్యునికి చూపించాలి?",
        "health.q.infant4": "పిల్లకు విరేచనాలు అవుతున్నాయి, ఏమి ఇవ్వాలి?",
        "health.q.child1": "పిల్ల చదువులో మనసు పెట్టుకోవడం లేదు, ఏమి చేయాలి?",
        "health.q.child2": "పిల్ల ప్రతిరోజూ బడికి వెళ్ళదని చెబుతున్నాడు, కారణమేమిటి?",
        "health.q.child3": "పిల్లకు రాత్రి జ్వరం వస్తుంది, ఏమి చేయాలి?",
        "health.q.child4": "పిల్ల పంట్లు పడుతున్నాయి, పంట్ల సంరక్షణ ఎలా చేయాలి?",
        "health.q.teen1": "చదువుపై ఎక్కువ ఒత్తిడి ఉంది, దానిని ఎలా ఎదురుకోవాలి?",
        "health.q.teen2": "రాత్రి నిద్ర సరిగా రావడం లేదు, ఏమి చేయాలి?",
        "health.q.teen3": "మొబైల్ అలవాటు కలిగిపోయింది, వదిలే విధానం ఏమిటో చెప్పండి.",
        "health.q.teen4": "తీవ్ర దుఃఖంగా ఉంది, ఎవరితో మాట్లాడాలి?",
        "health.q.young1": "పని ఒత్తిడి చాలా ఎక్కువ, ఎలా తగ్గించాలి?",
        "health.q.young2": "కూర్చుని ఉంటే మోపు నొప్పిస్తోంది, ఏమి చేయాలి?",
        "health.q.young3": "రాత్రి నిద్ర రావడం లేదు, ఏమి చేయాలి?",
        "health.q.young4": "డబ్బు తక్కువ, ఖర్చు ఎక్కువ, ఏమి చేయాలి?",
        "health.q.middle1": "కమ్ములో నొప్పి అవుతోంది, కారణమేమిటి?",
        "health.q.middle2": "నిద్ర సరిగా రావడం లేదు, మెరుగుపరచడానికి ఏమి చేయాలి?",
        "health.q.middle3": "ఇంట్లో ఎక్కువ ఒత్తిడి, పిల్లలను ఎలా పరిశీలించాలి?",
        "health.q.middle4": "పనిలో సంవత్సరాలుగా పేట్లో గ్యాస్ సమస్య, ఏమి చేయాలి?",
        "health.q.later1": "నా వయస్సు 54, మోపులో నొప్పి ఉంది, ఏమి చేయాలి?",
        "health.q.later2": "ఎబ్బేటప్పుడు కళ్ల నొప్పిస్తుంది, ఎందుకు?",
        "health.q.later3": "రాత్రి పాదాల్లో కుంపులు వస్తాయి, ఏమి చేయాలి?",
        "health.q.later4": "ఉదయం లేచినా కమ్ము గడ్డిపోతుంది, కారణమేమిటి?",
        "health.q.senior1": "కళ్లలో ఎంత నొప్పి ఉందండే, నడక కష్టంగా ఉంది, ఏమి చేయాలి?",
        "health.q.senior2": "చాలా మందులు రోజూ తినాల్సి ఉంటాయి — ఏది హానికరం అని ఎలా తెలుసుకోవాలి?",
        "health.q.senior3": "రాత్రి అది మూత్రం అవుతోంది, ఏమి చేయాలి?",
        "health.q.senior4": "వినడం తగ్గింది, వినేందుకు ఏదైనా ఉపాయం చెప్పండి.",
        "health.q.elder1": "ఇంట్లో పడిపోయే భయం ఉంది, ఏ రక్షణ పెట్టాలి?",
        "health.q.elder2": "జ్ఞాపకశక్తి బలహీనమవుతోంది, ఏమి చేయాలి?",
        "health.q.elder3": "రోజూ నొప్పి మందులు తినాల్సి ఉంటుంది — దీనికి హాని ఉందా?",
        "health.q.elder4": "ఎప్పుడు వైద్యునికి వెళ్ళడం అవసరం?",
    },
    "gu": {
        "health.q.infant1": "મારા બાળકને તાવ આવ્યો છે, દૂધ પાવું?",
        "health.q.infant2": "નાનું બાળક ખાતું નથી, શું કરું?",
        "health.q.infant3": "બાળકને ઉલટી થાય છે, ડૉક્ટરને ક્યારે બતાવું?",
        "health.q.infant4": "બાળકને ઝાડાનું થાય છે, શું ખિલાવું?",
        "health.q.child1": "બાળકના અભ્યાસમાં મન લાગતું નથી, શું કરું?",
        "health.q.child2": "બાળક રોજ સ્કૂલ જવા ના કરે, કારણ શું હોઈ શકે?",
        "health.q.child3": "બાળકને રાતે તાવ આવે છે, શું કરું?",
        "health.q.child4": "બાળકના દાંત તૂટી રહ્યા છે, દાંતની સંભાળ કેવી રીતે કરું?",
        "health.q.teen1": "અભ્યાસનું ઘણું દબાણ છે, તેનો સામ્નો કેવી રીતે કરું?",
        "health.q.teen2": "રાતે ઊંઘ ઠીકથી આવતી નથી, શું કરું?",
        "health.q.teen3": "મોબાઇલની ટેવ લાગી ગઈ છે, છોડવાનો ઉપાય કહો.",
        "health.q.teen4": "ઘણી ઉદાસી લાગે છે, કિસે વાત કરું?",
        "health.q.young1": "કામનું ઘણું તણાવ છે, કેવી રીતે ઘટાડું?",
        "health.q.young2": "બેસી રહેતાં પીઠમાં દુખાવો થાય છે, શું કરું?",
        "health.q.young3": "રાતે ઊંઘ આવતી નથી, શું ઉપાય છે?",
        "health.q.young4": "પૈસા ઓછા છે અને ખર્ચ વધુ, શું કરું?",
        "health.q.middle1": "કમરમાં દુખાવો થાય છે, કારણ શું હોઈ શકે?",
        "health.q.middle2": "ઊંઘ સારી આવતી નથી, સુધારવા શું કરું?",
        "health.q.middle3": "ઘરમાં ઘણું તણાવ છે, બાળકોને કેવી રીતે સંભાળું?",
        "health.q.middle4": "કામે વર્ષોથી પેટમાં ગેસની સમસ્યા છે, શું કરું?",
        "health.q.later1": "મારી ઉંમર 54 વર્ષ છે અને પીઠમાં દુખાવો છે, શું કરું?",
        "health.q.later2": "ચઢતાં ઘૂટણમાં દુખાવો થાય છે, કેમ?",
        "health.q.later3": "રાતે પગમાં એંઠણ થાય છે, શું કરું?",
        "health.q.later4": "સવારે ઊઠીને કમર જકડે છે, કારણ શું હોઈ શકે?",
        "health.q.senior1": "ઘૂટણમાં એટલો દુખાવો કે ચાલવું મુશ્કેલ છે, શું કરું?",
        "health.q.senior2": "ઘણી દવાઓ રોજ ખાવી પડે છે — કઈ નુકસાનકારી છે તે કેવી રીતે ખબર પડશે?",
        "health.q.senior3": "રાતે વારંવાર પેશાબની તકલીફ છે, શું કરું?",
        "health.q.senior4": "ઓછું સુંઘાય છે, સુંઘવાનો કોઈ ઉપાય કહો.",
        "health.q.elder1": "ઘરમાં પડી જવાનો ડર છે, કઈ સુરક્ષા રાખું?",
        "health.q.elder2": "યાદશક્તિ નબળી પડે છે, શું ઉપાય છે?",
        "health.q.elder3": "રોજ દુખની દવા ખાવી પડે છે — તેનો કોઈ નુકસાન છે?",
        "health.q.elder4": "ક્યારે ડૉક્ટર પાસે જવું જરૂરી છે?",
    },
    "kn": {
        "health.q.infant1": "ನನ್ನ ಮಗನಿಗೆ ಜ್ವರ ಬಂದಿದೆ, ಹಾಲು ಕೊಡಬೇಕೇ?",
        "health.q.infant2": "ಚಿಕ್ಕ ಮಗು ತಿನುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.infant3": "ಮಗನಿಗೆ ವಾತಿಸುತ್ತಿದೆ, ಯಾವಾಗ ವೈದ್ಯರನ್ನು ತೋರಿಸಬೇಕು?",
        "health.q.infant4": "ಮಗನಿಗೆ ಮಲಗೆಯುತ್ತಿದೆ, ಏನು ಕೊಡಬೇಕು?",
        "health.q.child1": "ಮಗನ ಓದುವಿನಲ್ಲಿ ಮನಸ್ಸು ಹಾಕುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.child2": "ಮಗು ಪ್ರತಿದಿನೂ ಶಾಲೆಗೆ ಹೋಗದೆ ಹೇಳುತ್ತಿದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?",
        "health.q.child3": "ಮಗನಿಗೆ ರಾತ್ರಿ ಜ್ವರ ಬರುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.child4": "ಮಗನ ಹಲ್ಲು ಉಡುತ್ತಿದೆ, ಹಲ್ಲಿನ ಆರೈಕೆ ಹೇಗೆ ಮಾಡಬೇಕು?",
        "health.q.teen1": "ಓದಿನ ತುಂಬಾ ಒತ್ತಡಿದೆ, ಅದನ್ನು ಹೇಗೆ ಎದುರಿಸಬೇಕು?",
        "health.q.teen2": "ರಾತ್ರಿ ನಿದ್ದೆ ಸರಿಯಾಗುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.teen3": "ಮೊಬೈಲ್ ಅಭಿವಾದ ಹಡಗಿದೆ, ಬಿಡಲು ಹೇಗೆ ಮಾಡಬೇಕೆಂದು ಹೇಳಿ.",
        "health.q.teen4": "ತುಂಬಾ ಬೇಸರಗೆ ಆಗುತ್ತದೆ, ಯಾರೊಂದಿಗೆ ಮಾತನಾಡಬೇಕು?",
        "health.q.young1": "ಕೆಲಸದ ತುಂಬಾ ಒತ್ತಡಿದೆ, ಹೇಗೆ ಕಡಿಮೆ ಮಾಡಬೇಕು?",
        "health.q.young2": "ಕುಳಿತಿದ್ದರೆ ಬೆನ್ನಿಗೆ ನೋವಾಗುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.young3": "ರಾತ್ರಿ ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.young4": "ಹಣ ಕಡಿಮೆ, ಖರ್ಚ ಹೆಚ್ಚು, ಏನು ಮಾಡಬೇಕು?",
        "health.q.middle1": "ಕೆನ್ನಿಗೆ ನೋವಾಗುತ್ತಿದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?",
        "health.q.middle2": "ನಿದ್ದೆ ಚೆನ್ನಾಗಿ ಬರುತ್ತಿಲ್ಲ, ಸುಧರಿಸಲು ಏನು ಮಾಡಬೇಕು?",
        "health.q.middle3": "ಮನೆಯಲ್ಲಿ ತುಂಬಾ ಒತ್ತಡ, ಮಕ್ಕಳನ್ನು ಹೇಗೆ ನೋಡಿಕೊಳ್ಳಬೇಕು?",
        "health.q.middle4": "ಕೆಲಸದಲ್ಲಿ ವರ್ಷಗಳಿಗೆ ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್ ಸಮಸ್ಯೆ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.later1": "ನನ್ನ ವಯಸ್ಸು 54 ಮತ್ತು ಬೆನ್ನಿಗೆ ನೋವು, ಏನು ಮಾಡಬೇಕು?",
        "health.q.later2": "ಹಣ ಹಾರುವಾಗ ಮೊಣಕೆಗೆ ನೋವಾಗುತ್ತದೆ, ಏಕೆ?",
        "health.q.later3": "ರಾತ್ರಿ ಕಾಲಿನಲ್ಲಿ ಮಂಜೂರಿ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.later4": "ಬೆಳಗಿನಲ್ಲಿ ಕೂಗಿದಾಗ ಬೆನ್ನು ಕೂಸುತ್ತದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?",
        "health.q.senior1": "ಮೊಣಕೆಯಲ್ಲಿ ಇತ್ತ ನೋವು, ನಡೆಯಲು ಕಷ್ಟ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.senior2": "ಹಲವು ಔಷಧಿ ಪ್ರತಿದಿನೂ ತೆಗೆಯಬೇಕು — ಯಾವುದು ಹಾನಿಕಾರಿ ಎಂದು ಹೇಗೆ ತಿಳಿಯುವುದು?",
        "health.q.senior3": "ರಾತ್ರಿ ಪದಕ್ಕೆ ಪದ ಮೂತ್ರ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.senior4": "ಕೇಳುವುದು ಕಡಿಮೆಯಾಗಿದೆ, ಕೇಳುವುದಕ್ಕೆ ಏನೋ ಉಪಾಯ ತಿಳಿಸಿ.",
        "health.q.elder1": "ಮನೆಯಲ್ಲಿ ಉದುರುವ ಭಯ, ಯಾವ ಸುರಕ್ಷತೆ ಇಡಬೇಕು?",
        "health.q.elder2": "ನೆನಪು ದುರ್ಬಲವಾಗುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?",
        "health.q.elder3": "ಪ್ರತಿದಿನೂ ನೋವಿನ ಔಷಧಿ ತೆಗೆಯಬೇಕು — ಇದರ ಹಾನಿ ಇದೆಯೇ?",
        "health.q.elder4": "ಯಾವಾಗ ವೈದ್ಯರ ಬಗ್ಗೆ ಹೋಗುವುದು ಅಗತ್ಯ?",
    },
    "ml": {
        "health.q.infant1": "എന്റെ കുഞ്ഞിക്ക് പനി വന്നിരിക്കുന്നു, പാലു കൊടുക്കണോ?",
        "health.q.infant2": "ചെറിയ കുഞ്ഞി കഴിക്കാരില്ല, എന്ത് ചെയ്യണം?",
        "health.q.infant3": "കുഞ്ഞിക്ക് ഓക്കരുകളിക്കുന്നു, എപ്പോൾ ഡോക്ടറെ കാണിക്കണം?",
        "health.q.infant4": "കുഞ്ഞിക്ക് മലങ്ങളിക്കുന്നു, എന്ത് കൊടുക്കണം?",
        "health.q.child1": "കുട്ടിയുടെ പഠനത്തിൽ മനസ്സിൽ താഴ്മായില്ല, എന്ത് ചെയ്യണം?",
        "health.q.child2": "കുട്ടി എല്ലാ ദിവസവും സ്കൂളിൽ പോകാൻ മറക്കുന്നു, കാരണം എന്താകാം?",
        "health.q.child3": "കുട്ടിക്ക് രാത്രി പനി വരുന്നു, എന്ത് ചെയ്യണം?",
        "health.q.child4": "കുട്ടിയുടെ പല്ലുകൾ പടിക്കുന്നു, പല്ലുകൾ എങ്ങനെ പരിചരിക്കണം?",
        "health.q.teen1": "പഠനത്തിൽ വളരെ സമ്മർദ്ദമുണ്ട്, അതു എങ്ങനെ നേരിക്കണം?",
        "health.q.teen2": "രാത്രി ഉറക്കം ശരിയായി വരുന്നില്ല, എന്ത് ചെയ്യണം?",
        "health.q.teen3": "മൊബൈൽ ശീലം പൂർത്തിയായി, വിടലാക്കാന്‍ ഉപായം പറയൂ.",
        "health.q.teen4": "കടുത്ത ദുഃഖം തോന്നുന്നു, ആരുമായി സംസാരിക്കണം?",
        "health.q.young1": "ജോലിയുടെ സമ്മർദ്ദം വളരെ കൂടുതലാണ്, എങ്ങനെ കുറയ്ക്കണം?",
        "health.q.young2": "ഇരിയുമ്പോൾ മുട്ടുത്തിന് വേദന, എന്ത് ചെയ്യണം?",
        "health.q.young3": "രാത്രി ഉറക്കം വരുന്നില്ല, എന്ത് ചെയ്യണം?",
        "health.q.young4": "പണം കുറവാണ്, ചെലവും കൂടുതല്, എന്ത് ചെയ്യണം?",
        "health.q.middle1": "കടുവിൽ വേദനയാകുന്നു, കാരണം എന്താകാം?",
        "health.q.middle2": "ഉറക്കം നല്ലയായി വരുന്നില്ല, മെച്ചപ്പെടുക്കാന്‍ എന്ത് ചെയ്യണം?",
        "health.q.middle3": "വീട്ടിൽ വളരെ സമ്മർദ്ദം, കുട്ടികളെ എങ്ങനെ പരിചരിക്കണം?",
        "health.q.middle4": "ജോലിയിൽ വർഷങ്ങായി വയറ്റിൽ വായു, എന്ത് ചെയ്യണം?",
        "health.q.later1": "എന്റെ പ്രായം 54, മുട്ടിൽ വേദന, എന്ത് ചെയ്യണം?",
        "health.q.later2": "കയറുമ്പോൾ മട്ടിൽ വേദന, എന്തുകൊണ്ട്?",
        "health.q.later3": "രാത്രി കാലിൽ വലിച്ചുരുക്കൽ, എന്ത് ചെയ്യണം?",
        "health.q.later4": "രാവിലെ കയറുമ്പോൾ കടുവ് കാഠമാകുന്നു, കാരണം എന്താകാം?",
        "health.q.senior1": "മട്ടിൽ വേദനയാൽ നടക്കാൻ ബുദ്ധിമുട്ട്, എന്ത് ചെയ്യണം?",
        "health.q.senior2": "പലത് മരുന്നുകൾ ദിവസവും കഴിക്കണം — ഏത് ദുഷ്ടകരമാണെന്ന് എങ്ങനെ അറിയണം?",
        "health.q.senior3": "രാത്രി വരിവരി മൂത്രം, എന്ത് ചെയ്യണം?",
        "health.q.senior4": "കേൾപ്പ് കുറവാണ്, കേളാൻ ഏതെങ്കിലും ഉപായം പറയൂ.",
        "health.q.elder1": "വീട്ടിൽ വീഴുമെന്ന് ഭയം, ഏത് സുരക്ഷാനിരക്ഷ വേണം?",
        "health.q.elder2": "ഓർമ്മപ്പതി ദുർബലമാകുന്നു, എന്ത് ചെയ്യണം?",
        "health.q.elder3": "ദിവസവും വേദനാ മരുന്ന് കഴിക്കണം — ഇതിന് ദോഷമുണ്ടോ?",
        "health.q.elder4": "എപ്പോൾ ഡോക്ടറെ കാണണം?",
    },
    "pa": {
        "health.q.infant1": "ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਬੁਖਾਰ ਹੈ, ਦੁੱਧ ਪਾਉਂ?",
        "health.q.infant2": "ਛੋਟਾ ਬੱਚਾ ਖਾ ਨਹੀਂ ਰਿਹਾ, ਕੀ ਕਰੂਂ?",
        "health.q.infant3": "ਬੱਚੇ ਨੂੰ ਉਲਟੀ ਹੋ ਰਹੀ ਹੈ, ਡਾਕਟਰ ਨੂੰ ਕਦੋਂ ਦਿਖਾਊਂ?",
        "health.q.infant4": "ਬੱਚੇ ਨੂੰ ਪੇਟ ਖਰਾਬ ਹੈ, ਕੀ ਖਿਲਾਊਂ?",
        "health.q.child1": "ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਮਨ ਨਹੀਂ ਲੱਗਦਾ, ਕੀ ਕਰੂਂ?",
        "health.q.child2": "ਬੱਚਾ ਰੋਜ਼ ਸਕੂਲ ਜਾਣ ਤੋਂ ਮਨਾ ਕਰਦਾ ਹੈ, ਕਾਰਨ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        "health.q.child3": "ਬੱਚੇ ਨੂੰ ਰਾਤ ਨੂੰ ਬੁਖਾਰ ਆਉਂਦਾ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.child4": "ਬੱਚੇ ਦੇ ਦੰਦ ਟੁੱਟ ਰਹੇ ਹਨ, ਦੰਦਾਂ ਦੀ ਸੰਭਾਲ ਕਿਵੇਂ ਕਰੂਂ?",
        "health.q.teen1": "ਪੜ੍ਹਾਈ ਦਾ ਬਹੁਤ ਦਬਾਅ ਹੈ, ਇਸ ਨਾਲ ਕਿਵੇਂ ਜੁਣਾਂ?",
        "health.q.teen2": "ਰਾਤ ਨੂੰ ਨੀਂਦ ਠੀਕ ਨਹੀਂ ਆਉਂਦੀ, ਕੀ ਕਰੂਂ?",
        "health.q.teen3": "ਮੋਬਾਈਲ ਦੀ ਆਦਤ ਲੱਗ ਗਈ ਹੈ, ਛੱਡਣ ਦਾ ਤਰੀਕਾ ਦੱਸੋ।",
        "health.q.teen4": "ਬਹੁਤ ਉਦਾਸੀ ਹੁੰਦੀ ਹੈ, ਕਿਸ ਨਾਲ ਗੱਲ ਕਰੂਂ?",
        "health.q.young1": "ਕੰਮ ਦਾ ਤਣਾਵ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ, ਕਿਵੇਂ ਘਟਾਊਂ?",
        "health.q.young2": "ਬੈਠੇ ਰਹਿੰਦੇ ਪਿੱਠ ਵਿੱਚ ਦਰਦ ਹੁੰਦਾ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.young3": "ਰਾਤ ਨੂੰ ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ, ਕੀ ਉਪਾਅ ਹੈ?",
        "health.q.young4": "ਪੈਸੇ ਘੱਟ ਹਨ ਅਤੇ ਖਰਚ ਵੱਧ, ਕੀ ਕਰੂਂ?",
        "health.q.middle1": "ਕਮਰ ਵਿੱਚ ਦਰਦ ਹੁੰਦਾ ਹੈ, ਕਾਰਨ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        "health.q.middle2": "ਨੀਂਦ ਚੰਗੀ ਨਹੀਂ ਆ ਰਹੀ, ਸੁਧਾਰਨ ਲਈ ਕੀ ਕਰੂਂ?",
        "health.q.middle3": "ਘਰ ਦਾ ਤਣਾਵ ਬਹੁਤ ਹੈ, ਬੱਚਿਆਂ ਨੂੰ ਕਿਵੇਂ ਸੰਭਾਲੂਂ?",
        "health.q.middle4": "ਕੰਮ 'ਤੇ ਕਈ ਸਾਲਾਂ ਤੋਂ ਪੇਟ ਵਿੱਚ ਗੈਸ ਦੀ ਸਮੱਸਿਆ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.later1": "ਮੇਰੀ ਉਮਰ 54 ਸਾਲ ਹੈ ਅਤੇ ਪਿੱਠ ਵਿੱਚ ਦਰਦ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.later2": "ਚੜ੍ਹਨ ਤੇ ਗੁੱਥੇ ਵਿੱਚ ਦਰਦ ਹੁੰਦਾ ਹੈ, ਕਿਉਂ?",
        "health.q.later3": "ਰਾਤ ਨੂੰ ਪੈਰ ਵਿੱਚ ਐਂਠਣ ਹੁੰਦੀ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.later4": "ਸਵੇਰੇ ਉੱਠ ਕੇ ਕਮਰ ਜਕੜਦੀ ਹੈ, ਕਾਰਨ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        "health.q.senior1": "ਘੂਟਣਾਂ ਵਿੱਚ ਇੰਨਾ ਦਰਦ ਹੈ ਕਿ ਚੱਲਣਾ ਔਖਾ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.senior2": "ਕਈ ਦਵਾਇਆਂ ਰੋਜ਼ ਖਾਣੀਆਂ ਪੈਂਦੀਆਂ ਹਨ — ਕਿਉਂਕਿ ਹਾਨੀਕਾਰਕ ਹੈ ਕਿਵੇਂ ਪਤਾ ਲੱਗੇਗਾ?",
        "health.q.senior3": "ਰਾਤ ਨੂੰ ਵਾਰ-ਵਾਰ ਪੇਸ਼ਾਬ ਦੀ ਦਿਕ਼ਕਤ ਹੈ, ਕੀ ਕਰੂਂ?",
        "health.q.senior4": "ਕਮ ਸੁਣਾਈ ਦਿੰਦਾ ਹੈ, ਸੁਣਨ ਦਾ ਕੋਈ ਉਪਾਅ ਦੱਸੋ।",
        "health.q.elder1": "ਘਰ ਵਿੱਚ ਡਿਗੱਗਣ ਦਾ ਡਰ ਹੈ, ਕਿਹੜੀ ਸੁਰੱਖਿਆ ਰੱਖਾਂ?",
        "health.q.elder2": "ਯਾਦਦਾਸ਼ਤ ਕਮਜ਼ੋਰ ਹੋ ਰਹੀ ਹੈ, ਕੀ ਉਪਾਅ ਹੈ?",
        "health.q.elder3": "ਰੋਜ਼ਾਨੀ ਦਰਦ ਦੀ ਦਵਾ ਖਾਣੀ ਪੈਂਦੀ ਹੈ — ਇਸ ਦਾ ਕੋਈ ਨੁਕਸਾਨ ਹੈ?",
        "health.q.elder4": "ਕਦੋਂ ਡਾਕਟਰ ਕੋਲ ਜਾਣਾ ਜ਼ਰੂਰੀ ਹੈ?",
    },
    "ur": {
        "health.q.infant1": "میرے بچے کو بخار ہے، دودھ دوں؟",
        "health.q.infant2": "چھوٹا بچہ کھا نہیں رہا، کیا کروں؟",
        "health.q.infant3": "بچے کو الٹی ہو رہی ہے، ڈاکٹر کو کب دکھاؤں؟",
        "health.q.infant4": "بچے کو پیچشش ہو رہی ہے، کیا کھلاؤں؟",
        "health.q.child1": "بچے کی پڑھائی میں دل نہیں لگتا، کیا کروں؟",
        "health.q.child2": "بچہ روز سکول جانے سے انکار کرتا ہے، وجہ کیا ہو سکتی ہے؟",
        "health.q.child3": "بچے کو رات کو بخار آتا ہے، کیا کروں؟",
        "health.q.child4": "بچے کے دانت گر رہے ہیں، دانتوں کی دیکھ بھال کیسے کروں؟",
        "health.q.teen1": "پڑھائی کا بہت دباؤ ہے، اس کا مقابلہ کیسے کروں؟",
        "health.q.teen2": "رات کو نیند ٹھیک سے نہیں آتی، کیا کروں؟",
        "health.q.teen3": "موبائل کی عادت لگ گئی ہے، چھوڑنے کا طریقہ بتائیے۔",
        "health.q.teen4": "بہت زیادہ اداسی محسوس ہوتی ہے، کس سے بات کروں؟",
        "health.q.young1": "کام کا دباؤ بہت زیادہ ہے، کیسے کم کروں؟",
        "health.q.young2": "بیٹھے رہنے سے پیٹھ میں درد ہوتا ہے، کیا کروں؟",
        "health.q.young3": "رات کو نیند نہیں آتی، کیا کیا کریں؟",
        "health.q.young4": "پیسے کم ہیں اور خرچ زیادہ، کیا کروں؟",
        "health.q.middle1": "کمر میں درد ہو رہا ہے، وجہ کیا ہو سکتی ہے؟",
        "health.q.middle2": "نیند اچھی نہیں آ رہی، بہتر کرنے کا کیا طریقہ ہے؟",
        "health.q.middle3": "گھر کا دباؤ بہت ہے، بچوں کو کیسے سنبھالوں؟",
        "health.q.middle4": "کام پر کئی سال سے پیٹ میں گیس کی مسئلہ ہے، کیا کروں؟",
        "health.q.later1": "میری عمر 54 سال ہے اور پیٹھ میں درد ہے، کیا کروں؟",
        "health.q.later2": "چڑھنے پر گھٹنے میں درد ہوتا ہے، کیوں؟",
        "health.q.later3": "رات کو پاؤں میں کھنچ ہوتی ہے، کیا کروں؟",
        "health.q.later4": "صبح اٹھ کر کمر میں سختی ہوتی ہے، وجہ کیا ہو سکتی ہے؟",
        "health.q.senior1": "گھٹنوں میں اتنا درد ہے کہ چلنا مشکل ہے، کیا کروں؟",
        "health.q.senior2": "کئی دوایں روز کھانی پڑتی ہیں — کون سی نقصانکار ہے، کیسے پتا چلے گا؟",
        "health.q.senior3": "رات کو بار بار پیشاب کی دکھل ہے، کیا کروں؟",
        "health.q.senior4": "کم سنائی دیتا ہے، سننے کا کوئی طریقہ بتائیے۔",
        "health.q.elder1": "گھر میں گرنے کا ڈر ہے، کون سی حفاظت رکھوں؟",
        "health.q.elder2": "یادداشت کمزور ہو رہی ہے، کیا کریں؟",
        "health.q.elder3": "روز درد کی دوا کھانی پڑتی ہے — کیا اس کا کوئی نقصان ہے؟",
        "health.q.elder4": "کب ڈاکٹر کے پاس جانا ضروری ہے؟",
    },
    "ar": {
        "health.q.infant1": "ابني مصاب بحمّى، هل أعطيه الحليب؟",
        "health.q.infant2": "الطفل الصغير لا يأكل، ماذا أفعل؟",
        "health.q.infant3": "ابني يتقيّأ، متى أعرضه على الطبيب؟",
        "health.q.infant4": "ابني مصاب بالإسهال، ماذا أطعمه؟",
        "health.q.child1": "ابني لا يركّز في الدراسة، ماذا أفعل؟",
        "health.q.child2": "ابني يرفض الذهاب إلى المدرسة كل يوم، ما السبب؟",
        "health.q.child3": "ابني تصيبه حمّى ليلاً، ماذا أفعل؟",
        "health.q.child4": "أسنان ابني تتكسر، كيف أعتني بها؟",
        "health.q.teen1": "الضغط على الدراسة كبير، كيف أتعامل معه؟",
        "health.q.teen2": "لا أنام جيداً في الليل، ماذا أفعل؟",
        "health.q.teen3": "أصبحت مدمناً للهاتف، ما طريقة التوقف؟",
        "health.q.teen4": "أشعر بحزن شديد، مع من أتحدث؟",
        "health.q.young1": "ضغط العمل كبير جداً، كيف أخفّضه؟",
        "health.q.young2": "وجع ظهري من الجلوس، ماذا أفعل؟",
        "health.q.young3": "لا ينام في الليل، ما الحل؟",
        "health.q.young4": "المال قليل والصرف كثير، ماذا أفعل؟",
        "health.q.middle1": "أشعر بألم أسفل الظهر، ما السبب؟",
        "health.q.middle2": "النوم غير جيد، كيف أحسّنه؟",
        "health.q.middle3": "الضغط في البيت كبير، كيف أعتني بالأولاد؟",
        "health.q.middle4": "غازات في البطن منذ سنوات في العمل، ماذا أفعل؟",
        "health.q.later1": "عمري 54 سنة ويؤلمني ظهري، ماذا أفعل؟",
        "health.q.later2": "ألم في الركبة عند صعود الدرج، لماذا؟",
        "health.q.later3": "تشنّج في الساق ليلاً، ماذا أفعل؟",
        "health.q.later4": "تيبّس أسفل الظهر عند الاستيقاظ، ما السبب؟",
        "health.q.senior1": "ألم الركبتين شديد وصراحة صعوب المشي، ماذا أفعل؟",
        "health.q.senior2": "آخذ عدة أدوية يومياً — كيف أعرف أيها ضار؟",
        "health.q.senior3": "تبوّل متكرر ليلاً، ماذا أفعل؟",
        "health.q.senior4": "سمع ضعيف، هل من وسيلة ل تحسين السمع؟",
        "health.q.elder1": "أخاف السقوط في البيت، أي احتياط أتخذ؟",
        "health.q.elder2": "ذاكرتي تضعف، ماذا أفعل؟",
        "health.q.elder3": "آخذ مسكّن للألم يومياً — هل له ضرر؟",
        "health.q.elder4": "متى يجب أن أزور الطبيب؟",
    },
    "es": {
        "health.q.infant1": "Mi niño tiene fiebre, ¿le doy leche?",
        "health.q.infant2": "El niño pequeño no come, ¿qué hago?",
        "health.q.infant3": "Mi niño vomita, ¿cuándo lo llevo al médico?",
        "health.q.infant4": "Mi niño tiene diarrea, ¿qué le doy de comer?",
        "health.q.child1": "A mi niño no le gusta estudiar, ¿qué hago?",
        "health.q.child2": "Mi niño se niega a ir al colegio cada día, ¿por qué será?",
        "health.q.child3": "Mi niño tiene fiebre por la noche, ¿qué hago?",
        "health.q.child4": "A mi niño se le caen los dientes, ¿cómo los cuido?",
        "health.q.teen1": "La presión de los estudios es mucha, ¿cómo la afronto?",
        "health.q.teen2": "No duermo bien por la noche, ¿qué hago?",
        "health.q.teen3": "Me he enganchado al móvil, ¿cómo lo dejo?",
        "health.q.teen4": "Me siento muy triste, ¿con quién hablo?",
        "health.q.young1": "El estrés del trabajo es mucho, ¿cómo lo bajo?",
        "health.q.young2": "Me duele la espalda de estar sentado, ¿qué hago?",
        "health.q.young3": "No consigo dormir por la noche, ¿qué hago?",
        "health.q.young4": "Tengo poco dinero y muchos gastos, ¿qué hago?",
        "health.q.middle1": "Me duele la zona lumbar, ¿a qué puede deberse?",
        "health.q.middle2": "No duermo bien, ¿cómo mejorarlo?",
        "health.q.middle3": "Hay mucha tensión en casa, ¿cómo ayudo a los niños?",
        "health.q.middle4": "Desde hace años tengo gases en el estómago en el trabajo, ¿qué hago?",
        "health.q.later1": "Tengo 54 años y me duele la espalda, ¿qué hago?",
        "health.q.later2": "Me duele la rodilla al subir escaleras, ¿por qué?",
        "health.q.later3": "De noche se me calaman las piernas, ¿qué hago?",
        "health.q.later4": "Al levantarse por la mañana tengo rigidez en la zona lumbar, ¿a qué se debe?",
        "health.q.senior1": "Las rodillas me duelen tanto que me cuesta caminar, ¿qué hago?",
        "health.q.senior2": "Tomo varias medicinas a diario — ¿cómo sé cuál es dañina?",
        "health.q.senior3": "Me levanto a orinar muchas veces por la noche, ¿qué hago?",
        "health.q.senior4": "Oigo poco, ¿hay alguna forma de mejorar el oído?",
        "health.q.elder1": "Tengo miedo de caerme en casa, ¿qué protección pongo?",
        "health.q.elder2": "Se me está borrando la memoria, ¿qué hago?",
        "health.q.elder3": "Tomo pastillas para el dolor todos los días — ¿hacen daño?",
        "health.q.elder4": "¿Cuándo es necesario ir al médico?",
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
    for code in T:
        for key, value in T[code].items():
            for number in re.findall(r"\d+", hindi.get(key, "")):
                if number not in value:
                    raise SystemExit(
                        f"{code} {key} lost the number {number}. It is part of"
                        f" what the visitor asked, not decoration."
                    )


def check_still_questions(hindi: dict[str, str]) -> None:
    """A translation that turned a question into a statement changed the question.

    The answer is generated from whatever the visitor submitted. A sentence
    where a question was would produce a confident answer to something they never
    asked, which is worse than an unhelpful one.

    The question mark is whatever that language actually uses. The first version
    looked for ASCII "?" and rejected all thirty-two Urdu strings, because Urdu
    and Arabic write the question mark as U+061F ARABIC QUESTION MARK, and doing
    so is not a translation fault — it is the script. A check that demands the
    Latin mark is a check that would push the translation towards being wrong.
    """
    for code in T:
        for key, value in T[code].items():
            source_text = hindi.get(key, "")
            if "?" not in source_text:
                continue
            if not any(mark in value for mark in QUESTION_MARKS):
                raise SystemExit(
                    f"{code} {key} lost its question mark:\n    {value}\n"
                    f"  The visitor asked a question; this now reads as a"
                    f" statement, and the answer will be confident about"
                    f" something they never asked."
                )


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

    check_digits(hindi)
    check_still_questions(hindi)
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
    print()
    print("The health box is complete in all eleven languages. These 32 questions")
    print("are what a visitor actually submits, and the answer is generated at")
    print("request time. A native speaker should still read them, and the health")
    print("and emergency strings alongside them, before this goes in front of")
    print("anyone who needs it.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
