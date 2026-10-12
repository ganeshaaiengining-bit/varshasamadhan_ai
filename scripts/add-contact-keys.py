"""
Add the contact-form and FAQ strings to the HINDI table, then translate them.

    python scripts/add-contact-keys.py

The /madad page asked for four things — write your experience, tell us about
your city, tell someone else, come and look — and had nowhere to do any of them.
support.contactTitle, support.contactBody, support.faqTitle and support.faqBody
had been written in all twelve languages since the first translation batch and
were never rendered by anything.

check-translations.py did not catch it, and could not have: the keys were
present, correctly translated, and used by nobody. A translation gap and a dead
key look identical to a tool that reads tables. The one that found it was
fetching the page as each language and asking which strings appeared in the
HTML — a check that had been reporting "13 of 13 fine" for weeks.

Twenty-two new keys. Five are a question and answer pair each, so the FAQ reads
as five plain sentences rather than as five paragraphs.

WHAT THE FAQ DOES NOT SAY

It does not promise a reply. Nobody has committed to reading an inbox, and a
free service maintained by one person promising to answer every message is a
kind of lie that makes the site feel like a company. It says what is true: this
goes to the one person who runs it.
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

# The Hindi, which is the source and is written into HINDI by this script.
HI = {
    "support.contactMessageLabel": "आपकी बात",
    "support.contactPlaceholder": "जो लिखना हो वही लिखिए — गलती हो तो, कुछ अच्छा मिला हो तो, या कोई सवाल हो।",
    "support.contactHelp": "कम से कम 10 अक्षर। यह सीधे मालिक के पास जाता है।",
    "support.contactSubmit": "भेजिए",
    "support.contactSending": "भेज रहे हैं…",
    "support.contactPrivacy": "आपका नाम लिखना ज़रूरी नहीं है।",
    "support.contactSent": "पहुँच गया",
    "support.contactSentBody": "आपकी बात मालिक तक पहुँच गई है।",
    "support.contactFailed": "नहीं भेजा जा सका",
    "support.faq1Q": "क्या यह सच में मुफ़्त है?",
    "support.faq1A": "हाँ। कोई पैसा नहीं लिया जाता, कोई विज्ञापन नहीं दिखता, और कोई सदस्यता नहीं ली जाती। यह एक व्यक्ति के पैसे से चलती है, किसी कंपनी या सरकार के पैसे से नहीं।",
    "support.faq2Q": "क्या मेरा नाम, पता या फ़ोन नंबर लिया जाता है?",
    "support.faq2A": "नहीं, और यह भी नहीं लिया जाएगा। यह साइट अपने आप में कोई पहचान नहीं बनाती — कोई लॉगिन नहीं, कोई ट्रैकिंग स्क्रिप्ट नहीं। जो पूछा जाता है वह सिर्फ़ आपका सवाल है और जब आपता है।",
    "support.faq3Q": "क्या यह डॉक्टर या वकील है?",
    "support.faq3A": "नहीं। यह कोई दवाई का सलाह नहीं देता और न कोई कानूनी सलाह। जहाँ बात गंभीर होती है वहाँ यह आपको डॉक्टर या अधिकारी के पास जाने की बात कहता है — यह उनकी जगह नहीं लेता।",
    "support.faq4Q": "क्या हर जवाब सही होता है?",
    "support.faq4A": "हमेशा नहीं। जवाब एक कंप्यूटर लिखता है, कोई डॉक्टर नहीं — इसलिए हर जवाब के साथ यह लिखा है कि यह चिकित्सा सलाह नहीं है। कोई दवाई शुरू करने या बंद करने से पहले डॉक्टर से ज़रूर मिलें।",
    "support.faq5Q": "क्या मुझे कोई ऐप डाउनलोड करना होगा?",
    "support.faq5A": "नहीं। यह सिर्फ़ ब्राउज़र में खुलती है। कोई ऐप इंस्टॉल नहीं, कोई अनुमति नहीं, कोई अपडेट नहीं।",
}

T = {
    "mr": {
        "support.contactMessageLabel": "तुमचे म्हणणे",
        "support.contactPlaceholder": "जे लिहायचे आहे तेच लिहा — चूक असेल, काहीतरी चांगले मिळाले असेल, किंवा प्रश्न असेल.",
        "support.contactHelp": "किमान 10 अक्षरे. हे थेट मालकाकडे पोहोचते.",
        "support.contactSubmit": "पाठवा",
        "support.contactSending": "पाठवत आहे…",
        "support.contactPrivacy": "तुमचे नाव लिहिणे आवश्यक नाही.",
        "support.contactSent": "पोहोचले",
        "support.contactSentBody": "तुमचे म्हणणे मालकाकडे पोहोचले आहे.",
        "support.contactFailed": "पाठवता आले नाही",
        "support.faq1Q": "हे खरेच मोफत आहे?",
        "support.faq1A": "होय. कोणतेही पैसे घेतले जात नाहीत, कोणतीही जाहिरात दाखवली जात नाही, आणि कोणतीही सदस्यता घेतली जात नाही. हे एका व्यक्तीच्या पैशांनी चालते, कंपनी किंवा सरकारच्या नाही.",
        "support.faq2Q": "माझे नाव, पत्ता किंवा फोन नंबर घेतला जातो का?",
        "support.faq2A": "नाही, आणि घेतला जाणार नाही. हे साइट स्वतः कोणतीही ओळख तयार करत नाही — कोणतेही लॉगिन नाही, कोणताही ट्रॅकिंग स्क्रिप्ट नाही. विचारले जाते ते फक्त तुमचा प्रश्न आहे आणि तेवढेच साठवले जाते.",
        "support.faq3Q": "हे डॉक्टर किंवा वकील आहे का?",
        "support.faq3A": "नाही. हे औषधाचा किंवा कायदेशी सल्ला देत नाही. जिथे बात गंभीर असते तिथे हे तुम्हाला डॉक्टर किंवा अधिकाऱ्याकडे जाण्याची सांगते — त्यांची जागा हे घेत नाही.",
        "support.faq4Q": "प्रत्येक जवाब योग्य असतो का?",
        "support.faq4A": "नेहमी नाही. जवाब संगणक लिहितो, कोणी डॉक्टर नाही — म्हणूनच प्रत्येक जवाबासोबत हे लिहिले आहे की हे चिकित्सा सल्ला नाही. कोणतेही औषध सुरू करण्यापूर्वी किंवा बंद करण्यापूर्वी डॉक्टरांचा सल्ला घ्या.",
        "support.faq5Q": "मला काही ऐप डाउनलोड करावा लागेल का?",
        "support.faq5A": "नाही. हे फक्त ब्राउझरमध्ये उघडते. कोणतेही ऐप इन्स्टॉल नाही, कोणतीही परवानगी नाही, कोणतेही अपडेट नाही.",
    },
    "bn": {
        "support.contactMessageLabel": "আপনার কথা",
        "support.contactPlaceholder": "যা লিখতে চান তাই লিখুন — ভুল হলে, কিছু ভালো পেলে, বা কোনো প্রশ্ন থাকলে।",
        "support.contactHelp": "অন্তত ১০ অক্ষর। এটি সরাসরি মালিকের কাছে পৌঁছায়।",
        "support.contactSubmit": "পাঠান",
        "support.contactSending": "পাঠানো হচ্ছে…",
        "support.contactPrivacy": "আপনার নাম লেখা আবশ্যক নয়।",
        "support.contactSent": "পৌঁছে গেছে",
        "support.contactSentBody": "আপনার কথা মালিকের কাছে পৌঁছে গেছে।",
        "support.contactFailed": "পাঠানো যায়নি",
        "support.faq1Q": "এটি কি সত্যিই বিনামূল্যে?",
        "support.faq1A": "হ্যাঁ। কোনো টাকা নেওয়া হয় না, কোনো বিজ্ঞাপন দেখানো হয় না, কোনো সদস্যতা নেওয়া হয় না। এটি একজনের টাকায় চলে, কোনো কোম্পানি বা সরকারের টাকায় নয়।",
        "support.faq2Q": "আমার নাম, ঠিকানা বা ফোন নম্বর নেওয়া হয়?",
        "support.faq2A": "না, এবং নেওয়া হবে না। এই সাইট নিজে কোনো পরিচয় তৈরি করে না — কোনো লগইন নেই, কোনো ট্র্যাকিং স্ক্রিপ্ট নেই। যা জিজ্ঞাসা করা হয় তা শুধু আপনার প্রশ্ন এবং ততটুকুই সংরক্ষিত হয়।",
        "support.faq3Q": "এটি কি ডাক্তার বা আইনজীবী?",
        "support.faq3A": "না। এটি ওষুধের বা আইনি পরামর্শ দেয় না। যেখানে বিষয়টি গুরুতর সেখানে এটি বলে ডাক্তার বা কর্তৃপক্ষের কাছে যেতে — তাঁদের জায়গা এটি নেয় না।",
        "support.faq4Q": "প্রতিটি উত্তর কি সঠিক হয়?",
        "support.faq4A": "সবসময় না। উত্তর লেখে একটি কম্পিউটার, কোনো ডাক্তার নয় — তাই প্রতিটি উত্তরের সাথে লেখা আছে যে এটি চিকিৎসা পরামর্শ নয়। কোনো ঔষধ শুরু বা বন্ধ করার আগে অবশ্যই ডাক্তারের সাথে দেখা করুন।",
        "support.faq5Q": "আমাকে কি কোনো অ্যাপ ডাউনলোড করতে হবে?",
        "support.faq5A": "না। এটি শুধু ব্রাউজারে খোলে। কোনো অ্যাপ ইনস্টল নয়, কোনো অনুমতি নয়, কোনো আপডেট নয়।",
    },
    "ta": {
        "support.contactMessageLabel": "உங்கள் மொழி",
        "support.contactPlaceholder": "எழுத வேண்டியதை எழுதுங்கள் — தவறு இருந்தால், சிறந்தது கிடைத்தால், அல்லது கேள்வி இருந்தால்.",
        "support.contactHelp": "குறைந்தது 10 எழுத்துகள். இது நேரடியாக உரிமையாளருக்குச் செல்கிறது.",
        "support.contactSubmit": "அனுப்பு",
        "support.contactSending": "அனுப்பப்படுகிறது…",
        "support.contactPrivacy": "உங்கள் பெயர் எழுத வேண்டியதில்லை.",
        "support.contactSent": "சென்றுவிட்டது",
        "support.contactSentBody": "உங்கள் மொழி உரிமையாளரை அடைந்துவிட்டது.",
        "support.contactFailed": "அனுப்ப முடியவில்லை",
        "support.faq1Q": "இது உண்மையிலேயே இலவசமா?",
        "support.faq1A": "ஆம். பணம் எடுக்கப்படுவதில்லை, விளம்பரம் காட்டப்படுவதில்லை, சந்தா நீக்கப்படுவதில்லை. இது ஒருவரின் பணத்தில் நடக்கிறது, நிறுவனத்தின் அல்லது அரசின் பணத்தில் அல்ல.",
        "support.faq2Q": "என் பெயர், முகவரி அல்லது தொலைபேசி எண் எடுக்கப்படுகிறதா?",
        "support.faq2A": "இல்லை, எடுக்கப்படாது. இந்தத் தளம் தானாக எந்த அடையாளத்தையும் உருவாக்குவதில்லை — எந்த உள்நுழைவும் இல்லை, எந்த கண்காணிப்பு ஸ்கிரிப்டும் இல்லை. கேட்பது உங்கள் கேள்வி மட்டும், அதுவே சேமிக்கப்படுகிறது.",
        "support.faq3Q": "இது மருத்துவர் அல்லது வழக்குநரா?",
        "support.faq3A": "இல்லை. இது மருந்து அல்லது சட்ட ஆலோசனை வழங்காது. விஷயம் கடுமையாக இருக்கும் இடத்தில் இது மருத்துவர் அல்லது அதிகாரி அணுக உரையும் — அவர்களின் இடத்தை இது பற்றாது.",
        "support.faq4Q": "ஒவ்வொரு பதிலும் சரியானதா?",
        "support.faq4A": "எப்போதும் அல்ல. பதிலை எழுவது ஒரு கணினி, மருத்துவர் அல்ல — எனவே ஒவ்வொரு பதிலுடனும் இது மருத்துவ ஆலோசனை அல்ல என்று எழுதப்பட்டுள்ளது. எந்த மருந்தையும் தொடங்குவதற்கு முன் அல்லது நிறுத்துவதற்கு முன் மருத்துவரைக் காணுங்கள்.",
        "support.faq5Q": "ஏதாவது செயலியைப் பதிவிற்கிட வேண்டுமா?",
        "support.faq5A": "இல்லை. இது உலவாளரில் தான் திறக்கிறது. செயலி நிறுவல் இல்லை, அனுமதி இல்லை, புதுப்பிப்பு இல்லை.",
    },
    "te": {
        "support.contactMessageLabel": "మీ మాట",
        "support.contactPlaceholder": "రాయాలనుకున్నది అదే రాయండి — తప్పు ఉంటే, ఏదైనా మంచిదైతే, లేదా ప్రశ్న ఉంటే.",
        "support.contactHelp": "కనీసం 10 అక్షరాలు. ఇది నేరుగా యజమానికి చేరుతుంది.",
        "support.contactSubmit": "పంపండి",
        "support.contactSending": "పంపుతున్నాము…",
        "support.contactPrivacy": "మీ పేరు రాయడం అవసరం లేదు.",
        "support.contactSent": "చేరింది",
        "support.contactSentBody": "మీ మాట యజమానికి చేరింది.",
        "support.contactFailed": "పంపలేకపోయాము",
        "support.faq1Q": "ఇది నిజంగా ఉచితమా?",
        "support.faq1A": "అవును. డబ్బు తీసుకోరు, ప్రచారం చూపరు, సభ్యత్వం తీసుకోరు. ఇది ఒక వ్యక్తి డబ్బుతో నడుస్తుంది, సంస్థ లేదా ప్రభుత్వ డబ్బుతో కాదు.",
        "support.faq2Q": "నా పేరు, చిరునామా లేదా ఫోన్ నంబర్ తీసుకుంటారా?",
        "support.faq2A": "కాదు, తీసుకోరు. ఈ సైట్ దానంతట తన గుర్తింపును సృష్టించదు — లాగిన్ లేదు, ట్రాకింగ్ స్క్రిప్ట్ లేదు. అడిగేది మీ ప్రశ్న మాత్రమే, అదే భద్రపరచబడుతుంది.",
        "support.faq3Q": "ఇది వైద్యుడా లేదా న్యాయవాదియా?",
        "support.faq3A": "కాదు. ఇది మందుల లేదా చట్ట సలహా ఇవ్వదు. విషయం తీవ్రంగా ఉన్న చోట ఇది వైద్యుని లేదా అధికారిని దగ్గరకు వెళ్ళమని చెబుతుంది — వారి స్థానాన్ని ఇది తీసుకోదు.",
        "support.faq4Q": "ప్రతి సమాధానం సరైనదా?",
        "support.faq4A": "ఎప్పుడూ కాదు. సమాధానం రాసేది కంప్యూటర్, వైద్యుడు కాదు — అందుకే ప్రతి సమాధానంతో ఇది వైద్య సలహా కాదని రాయబడింది. ఏ మందులైనా ప్రారంభించే ముందు లేదా ఆపే ముందు వైద్యుడిని కలవండి.",
        "support.faq5Q": "ఏ యాప్ డౌన్‌లోడ్ చేయాలా?",
        "support.faq5A": "కాదు. ఇది బ్రౌజర్‌లోనే తెరుచుకుంటుంది. యాప్ ఇన్‌స్టాల్ లేదు, అనుమతి లేదు, అప్‌డేట్ లేదు.",
    },
    "gu": {
        "support.contactMessageLabel": "તમારી વાત",
        "support.contactPlaceholder": "જે લખવું હો તે જ લખો — ભૂલ હોય, કંઈ સારું મળે, અથવા કોઈ પ્રશ્ન હોય.",
        "support.contactHelp": "ઓછામાં ઓછા 10 અક્ષર. આ સીધું માલિક પર્યংતે પહોંચે છે.",
        "support.contactSubmit": "મોકલો",
        "support.contactSending": "મોકલી રહ્યા છીએ…",
        "support.contactPrivacy": "તમારું નામ લખવું જરૂરી નથી.",
        "support.contactSent": "પહોંચી ગયું",
        "support.contactSentBody": "તમારી વાત માલિક સુધી પહોંચી ગઈ છે.",
        "support.contactFailed": "મોકલી શકાયું નહીં",
        "support.faq1Q": "આ ખરેખર મફત છે?",
        "support.faq1A": "હા. કોઈ પૈસા લેવાતા નથી, કોઈ જાહેરાત બતાવવાતી નથી, કોઈ સભ્યસત્તા લેવાતી નથી. આ એક વ્યક્તિના પૈસાથી ચાલે છે, કંપની કે સરકારના નહીં.",
        "support.faq2Q": "મારું નામ, સરનામું કે ફોન નંબર લેવાય છે?",
        "support.faq2A": "ના, અને લેવામાં આવશે નહીં. આ સાઇટ જાતે કોઈ ઓળખ બનાવતી નથી — કોઈ લોગિન નહીં, કોઈ ટ્રેકિંગ સ્ક્રિપ્ટ નહીં. પૂછાતું તમારો સવાલ જ છે અને ફક્ત એટલું જ સાચવાય છે.",
        "support.faq3Q": "આ ડૉક્ટર કે વકીલ છે?",
        "support.faq3A": "ના. આ દવા કે કાનૂની સલાહ આપતી નથી. જ્યાં બાબ ગંભીર હોય ત્યાં આ તમને ડૉક્ટર કે અધિકારી પાસે જવાનું કહે છે — તેમની જગ્યા આ લેતી નથી.",
        "support.faq4Q": "દરેક જવાબ સાચો હોય છે?",
        "support.faq4A": "હંમેશાં નહીં. જવાબ કમ્પ્યુટર લખે છે, ડૉક્ટર નહીં — એટલે દરેક જવાબ સાથે લખેલું છે કે આ તબીબી સલાહ નથી. કોઈ દવા શરૂ કે બંદ કરતાં પહેલાં ડૉક્ટરની સલાહ લો.",
        "support.faq5Q": "મારે કોઈ એપ ડાઉનલોડ કરવી પડશે?",
        "support.faq5A": "ના. આ ફક્ત બ્રાઉઝરમાં ખૂલે છે. કોઈ એપ ઇન્સ્ટોલ નહીં, કોઈ પરવાનગી નહીં, કોઈ અપડેટ નહીં.",
    },
    "kn": {
        "support.contactMessageLabel": "ನಿಮ್ಮ ಮಾತು",
        "support.contactPlaceholder": "ಬರೆಯಬೇಕಾದದ್ದನ್ನೇ ಬರೆಯಿರಿ — ತಪ್ಪಿದ್ದರೆ, ಏನಾದರೂ ಚೆನ್ನದಿದ್ದರೆ, ಅಥವಾ ಪ್ರಶ್ನೆ ಇದ್ದರೆ.",
        "support.contactHelp": "ಕನಿಷ್ಠ 10 ಅಕ್ಷರ. ಇದು ನೇರವಾಗಿ ಮಾಲೀಕರಿಗೆ ತಲುಪುತ್ತದೆ.",
        "support.contactSubmit": "ಕಳುಹಿಸಿ",
        "support.contactSending": "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…",
        "support.contactPrivacy": "ನಿಮ್ಮ ಹೆಸರು ಬರೆಯುವುದು ಅಗತ್ಯವಿಲ್ಲ.",
        "support.contactSent": "ತಲುಪಿದೆ",
        "support.contactSentBody": "ನಿಮ್ಮ ಮಾತು ಮಾಲೀಕರಿಗೆ ತಲುಪಿದೆ.",
        "support.contactFailed": "ಕಳುಹಿಸಲಾಗಲಿಲ್ಲ",
        "support.faq1Q": "ಇದು ನಿಜವಾಗಿಯೂ ಉಚಿತವೇ?",
        "support.faq1A": "ಹೌದು. ಹಣಕಟಿ ತೆಗೆಯುವುದಿಲ್ಲ, ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ, ಸದಸ್ಯತ್ವ ತೆಗೆಯುವುದಿಲ್ಲ. ಇದು ಒಬ್ಬ ವ್ಯಕ್ತಿಯ ಹಣದಿಂದ ನಡೆಯುತ್ತದೆ, ಕಂಪನಿ ಅಥವಾ ಸರ್ಕಾರದದ್ದಲ್ಲ.",
        "support.faq2Q": "ನನ್ನ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ನಂಬರ್ ತೆಗೆಯುತ್ತಾರೆ?",
        "support.faq2A": "ಇಲ್ಲ, ಮತ್ತು ತೆಗೆಯುವುದಿಲ್ಲ. ಈ ಸೈಟ್ ತಾನಾಗೆ ಯಾವುದೇ ಗುರುತನ್ನು ರಚಿಸುವುದಿಲ್ಲ — ಲಾಗಿನ್ ಇಲ್ಲ, ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ಕ್ರಿಪ್ಟ್ ಇಲ್ಲ. ಕೇಳುವುದು ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮಾತ್ರ, ಅದೇ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.",
        "support.faq3Q": "ಇದು ವೈದ್ಯ ಅಥವಾ ವಕೀಲವೇ?",
        "support.faq3A": "ಇಲ್ಲ. ಇದು ಔಷಧಿ ಅಥವಾ ಕಾನೂನು ಸಲಹೆ ಕೊಡುವುದಿಲ್ಲ. ವಿಷಯವು ಗಂಭೀರವಾದಂತೆ ಇಲ್ಲಿ ನಿಮಗೆ ವೈದ್ಯರ ಅಥವಾ ಅಧಿಕಾರಿಯ ಬಗ್ಗೆ ಹೋಗಬೇಕೆಂದು ಹೇಳುತ್ತದೆ — ಅವರ ಸ್ಥಾನವನ್ನು ಇದು ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.",
        "support.faq4Q": "ಪ್ರತಿ ಉತ್ತರ ಸರಿಯೇ?",
        "support.faq4A": "ಎಂದಿಗೂ ಅಲ್ಲ. ಉತ್ತರ ಬರೆದ್ದೇ ಕಂಪ್ಯೂಟರ್, ವೈದ್ಯರಲ್ಲ — ಅತ್ತರಾಗಿ ಪ್ರತಿ ಉತ್ತರದೊಂದಿಗೆ ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ ಎಂದು ಬರೆದಿದೆ. ಯಾವುದೇ ಔಷಧಿ ಆರಂಭಿಸುವ ಮೊದಲು ಅಥವಾ ನಿಲ್ಲಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.",
        "support.faq5Q": "ನನಗೆ ಯಾವುದೇ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕೇ?",
        "support.faq5A": "ಇಲ್ಲ. ಇದು ಬ್ರೌಸರ್‌ನಲ್ಲೇ ತೆರೆಯುತ್ತದೆ. ಯಾವುದೇ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಇಲ್ಲ, ಯಾವುದೇ ಅನುಮತಿ ಇಲ್ಲ, ಯಾವುದೇ ಅಪ್‌ಡೇಟ್ ಇಲ್ಲ.",
    },
    "ml": {
        "support.contactMessageLabel": "നിങ്ങളുടെ വാക്കുകൾ",
        "support.contactPlaceholder": "എഴുതണം എന്ന് വിശ്വാസമുള്ളത് എഴുതൂ — തെറ്റ് ഉണ്ടെങ്കിൽ, എന്തെങ്കിലും നല്ലത് കിട്ടിയെങ്കിൽ, അല്ലെങ്കിൽ ചോദ്യമുണ്ടെങ്കിൽ.",
        "support.contactHelp": "കുറഞ്ഞത് 10 അക്ഷരങ്ങൾ. ഇത് നേരിട്ട് ഉടമയ്ക്ക് എത്തിച്ചേരും.",
        "support.contactSubmit": "അയയ്ക്കൂ",
        "support.contactSending": "അയയ്ക്കുന്നു…",
        "support.contactPrivacy": "നിങ്ങളുടെ പേര് എഴുതേണ്ടതില്ല.",
        "support.contactSent": "എത്തിച്ചേർന്നു",
        "support.contactSentBody": "നിങ്ങളുടെ വാക്കുകൾ ഉടമയ്ക്ക് എത്തിച്ചേർന്നു.",
        "support.contactFailed": "അയയ്ക്കാനായില്ല",
        "support.faq1Q": "ഇത് ശരിക്കും സൗജന്യമാണോ?",
        "support.faq1A": "അതെ. പണം എടുക്കുന്നില്ല, വിളംപരം കാണിക്കുന്നില്ല, അംഗത്വം ആനയ്ക്കുന്നില്ല. ഇത് ഒരാളുടെ പണത്തിൽ നടക്കുന്നു, കമ്പനിയുടെയോ സർക്കാർന്റെയോ അല്ല.",
        "support.faq2Q": "എന്റെ പേരോ വിലാസമോ ഫോൺ നമ്പറോ എടുക്കുന്നുണ്ടോ?",
        "support.faq2A": "ഇല്ല, എടുക്കുകയില്ല. ഈ സൈറ്റ് സ്വയം ഒരു തിരിച്ചറിയാപ്പെടുത്തിനും ഉംടുന്നില്ല — ലോഗിനില്ല, ട്രാക്കിംഗ് സ്ക്രിപ്റ്റില്ല. ചോദിക്കുന്നത് നിങ്ങളുടെ ചോദ്യം മാത്രമാണ്, അതും അത്ര സംഭവിക്കുന്നു.",
        "support.faq3Q": "ഇത് ഡോക്ടറോ അറ്റോർണിയോ?",
        "support.faq3A": "ഇല്ല. ഇത് മരുന്നിന്റെയോ നിയമത്തിന്റെയോ ഉപദേശം നൽകുന്നില്ല. കാര്യം ഗുരുതമാകുമ്പോൾ ഇത് ഡോക്ടറെയോ അധികാരിയെയോ കാണാൻ പറയും — അവരുടെ സ്ഥാനം ഇത് എടുക്കുന്നില്ല.",
        "support.faq4Q": "ഓരോ ഉത്തരവും ശരിയാണോ?",
        "support.faq4A": "എപ്പോഴും അല്ല. ഉത്തരം എഴുതുന്നത് ഒരു കമ്പ്യൂട്ടറാണ്, ഡോക്ടർ അല്ല — അതുകൊണ്ട് ഓരോ ഉത്തരത്തോടും ഇത് വൈദ്യ ഉപദേശമല്ല എന്ന് എഴുതിയിട്ടുണ്ട്. ഏതെങ്കിലും മരുന്ന് തുടങ്ങുകയോ നിർത്തുകയോ മുമ്പ് ഡോക്ടറുടെ ഉപദേശം എടുക്കുക.",
        "support.faq5Q": "എനിക്ക് ഏതെങ്കിലും ആപ്പ് ഡൗൺലോഡ് ചെയ്യണോ?",
        "support.faq5A": "ഇല്ല. ഇത് ബ്രൗസറിൽ തന്നെ തുറക്കും. ആപ്പ് ഇൻസ്റ്റാൾ ഇല്ല, അനുമതി ഇല്ല, അപ്ഡേറ്റ് ഇല്ല.",
    },
    "pa": {
        "support.contactMessageLabel": "ਤੁਹਾਡੀ ਗੱਲ",
        "support.contactPlaceholder": "ਜੋ ਲਿਖਣਾ ਹੈ ਉਹੀ ਲਿਖੋ — ਗ਼ਲਤੀ ਹੋਵੇ, ਕੁਝ ਚੰਗਾ ਮਿਲੇ, ਜਾਂ ਕੋਈ ਸਵਾਲ ਹੋਵੇ।",
        "support.contactHelp": "ਘੱਟੋ-ਘੱਟ 10 ਅੱਖਰ। ਇਹ ਸਿੱਧਾ ਮਾਲਕ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ।",
        "support.contactSubmit": "ਭੇਜੋ",
        "support.contactSending": "ਭੇਜ ਰਹੇ ਹਾਂ…",
        "support.contactPrivacy": "ਤੁਹਾਡਾ ਨਾਮ ਲਿਖਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ।",
        "support.contactSent": "ਪਹੁੰਚ ਗਿਆ",
        "support.contactSentBody": "ਤੁਹਾਡੀ ਗੱਲ ਮਾਲਕ ਤੱਕ ਪਹੁੰਚ ਗਈ ਹੈ।",
        "support.contactFailed": "ਨਹੀਂ ਭੇਜਿਆ ਜਾ ਸਕਾ",
        "support.faq1Q": "ਕੀ ਇਹ ਸੱਚ ਵਿੱਚ ਮੁਫ਼ਤ ਹੈ?",
        "support.faq1A": "ਹਾਂ। ਕੋਈ ਪੈਸੇ ਨਹੀਂ ਲਿਏ ਜਾਂਦੇ, ਕੋਈ ਜਾਹੇਰਾਤ ਨਹੀਂ ਦਿਸਾਉਂਦੀ, ਅਤੇ ਕੋਈ ਮੈਂਬਰਸ਼ਿਪ ਨਹੀਂ ਲਈ ਜਾਂਦੀ। ਇਹ ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਪੈਸਿਆਂ ਨਾਲ ਚੱਲਦੀ ਹੈ, ਕੰਪਨੀ ਜਾਂ ਸਰਕਾਰ ਦੇ ਨਹੀਂ।",
        "support.faq2Q": "ਕੀ ਮੇਰਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਲਿਆ ਜਾਂਦਾ ਹੈ?",
        "support.faq2A": "ਨਹੀਂ, ਅਤੇ ਲਿਆ ਵੀ ਨਹੀਂ ਜਾਵੇਗਾ। ਇਹ ਸਾਈਟ ਆਪਣੇ ਆਪ ਕੋਈ ਪਛਾਣ ਨਹੀਂ ਬਣਾਉਂਦੀ — ਕੋਈ ਲੌਗਇਨ ਨਹੀਂ, ਕੋਈ ਟ੍ਰੈਕਿੰਗ ਸਕ੍ਰਿਪਟ ਨਹੀਂ। ਪੁੱਛਿਆ ਜਾਂਦਾ ਹੈ ਸਿਰਫ਼ ਤੁਹਾਡਾ ਸਵਾਲ ਹੈ ਅਤੇ ਉਹੀ ਸੰਭਾਲਿਆ ਜਾਂਦਾ ਹੈ।",
        "support.faq3Q": "ਕੀ ਇਹ ਡਾਕਟਰ ਜਾਂ ਵਕੀਲ ਹੈ?",
        "support.faq3A": "ਨਹੀਂ। ਇਹ ਦਵਾ ਜਾਂ ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ ਦਿੰਦੀ। ਜਿੱਥੇ ਗੱਲ ਗੰਭੀਰ ਹੁੰਦੀ ਹੈ, ਉੱਥੇ ਇਹ ਤੁਹਾਨੂੰ ਡਾਕਟਰ ਜਾਂ ਅਧਿਕਾਰੀ ਕੋਲ ਜਾਣ ਨੂੰ ਕਹਿੰਦੀ ਹੈ — ਉਹਨਾਂ ਦੀ ਥਾਂ ਇਹ ਨਹੀਂ ਲੈਂਦੀ।",
        "support.faq4Q": "ਕੀ ਹਰ ਜਵਾਬ ਸਹੀ ਹੁੰਦਾ ਹੈ?",
        "support.faq4A": "ਹਮੇਸ਼ਾ ਨਹੀਂ। ਜਵਾਬ ਕੰਪਿਊਟਰ ਲਿਖਦਾ ਹੈ, ਕੋਈ ਡਾਕਟਰ ਨਹੀਂ — ਇਸ ਲਈ ਹਰ ਜਵਾਬ ਦੇ ਨਾਲ ਲਿਖਿਆ ਹੁੰਦਾ ਹੈ ਕਿ ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ। ਕੋਈ ਵੀ ਦਵਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ।",
        "support.faq5Q": "ਕੀ ਮੈਨੂੰ ਕੋਈ ਐਪ ਡਾਊਨਲੋਡ ਕਰਨੀ ਪਵੇਗੀ?",
        "support.faq5A": "ਨਹੀਂ। ਇਹ ਸਿਰਫ਼ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਖੁੱਲਦੀ ਹੈ। ਕੋਈ ਐਪ ਇੰਸਟਾਲ ਨਹੀਂ, ਕੋਈ ਇਜਾਜ਼ਤ ਨਹੀਂ, ਕੋਈ ਅੱਪਡੇਟ ਨਹੀਂ।",
    },
    "ur": {
        "support.contactMessageLabel": "آپ کی بات",
        "support.contactPlaceholder": "جو لکھنا ہے وہی لکھیے — غلطی ہو، کچھ اچھا ملے، یا کوئی سوال ہو۔",
        "support.contactHelp": "کم از کم 10 حروف۔ یہ براہِ راست مالک تک پہنچتا ہے۔",
        "support.contactSubmit": "بھیجیے",
        "support.contactSending": "بھیج رہے ہیں…",
        "support.contactPrivacy": "آپ کا نام لکھنا ضروری نہیں۔",
        "support.contactSent": "پہنچ گیا",
        "support.contactSentBody": "آپ کی بات مالک تک پہنچ گئی ہے۔",
        "support.contactFailed": "نہیں بھیجا جا سکا",
        "support.faq1Q": "کیا یہ واقعی مفت ہے؟",
        "support.faq1A": "ہاں۔ کوئی پیسے نہیں لیے جاتے، کوئی اشتہار نہیں دکھایا جاتا، اور کوئی رکنیت نہیں لی جاتی۔ یہ ایک فرد کے پیسوں سے چلتی ہے، کسی کمپنی یا سرکار کے نہیں۔",
        "support.faq2Q": "کیا میرا نام، پتہ یا فون نمبر لیا جاتا ہے؟",
        "support.faq2A": "نہیں، اور لیا بھی نہیں جائے گا۔ یہ سائٹ خود کوئی پہچان نہیں بناتی — کوئی لاگ اِن نہیں، کوئی ٹریکنگ اسکرپٹ نہیں۔ پوچھا جاتا ہے صرف آپ کا سوال اور بس اتنا ہی محفوظ ہوتا ہے۔",
        "support.faq3Q": "کیا یہ ڈاکٹر یا وکیل ہے؟",
        "support.faq3A": "نہیں۔ یہ دوا کا یا قانونی مشورہ نہیں دیتی۔ جہاں بات سنگین ہو وہاں یہ کہتی ہے کہ ڈاکٹر یا افسر سے ملیں — ان کی جگہ یہ نہیں لیتی۔",
        "support.faq4Q": "کیا ہر جواب درست ہوتا ہے؟",
        "support.faq4A": "ہمیشہ نہیں۔ جواب کمپیوٹر لکھتا ہے، کوئی ڈاکٹر نہیں — اسی لیے ہر جواب کے ساتھ یہ لکھا ہوتا ہے کہ یہ طبی مشورہ نہیں ہے۔ کوئی دوا شروع یا بند کرنے سے پہلے ڈاکٹر سے ملیں۔",
        "support.faq5Q": "کیا مجھے کوئی ایپ ڈاؤن لوڈ کرنی پڑے گی؟",
        "support.faq5A": "نہیں۔ یہ صرف براؤزر میں کھلتی ہے۔ کوئی ایپ انسٹال نہیں، کوئی اجازت نہیں، کوئی اپ ڈیٹ نہیں۔",
    },
    "ar": {
        "support.contactMessageLabel": "كلمتك",
        "support.contactPlaceholder": "اكتب ما تريد — خطأ، أو شيء جيد حدث، أو سؤال عندك.",
        "support.contactHelp": "عشرة أحرف على الأقل. يذهب هذا مباشرة إلى المالك.",
        "support.contactSubmit": "إرسال",
        "support.contactSending": "جارٍ الإرسال…",
        "support.contactPrivacy": "كتابة اسمك ليست مطلوبة.",
        "support.contactSent": "وصل",
        "support.contactSentBody": "وصلت كلمتك إلى المالك.",
        "support.contactFailed": "تعذّر الإرسال",
        "support.faq1Q": "هل هي مجانية فعلاً؟",
        "support.faq1A": "نعم. لا تُؤخذ أموال، ولا تُعرض إعلانات، ولا تُطلب عضوية. تعمل بمال شخص واحد، لا بمال شركة ولا حكومة.",
        "support.faq2Q": "هل يُؤخذ اسمي أو عنواني أو رقم هاتفي؟",
        "support.faq2A": "لا، ولن يُؤخذ. الموقع لا ينشئ عنك أي تعريف — لا تسجيل دخول، ولا أدوات تتبع. ما يُسأل هو سؤالك وحده، ولا يُحفظ إلا ذلك.",
        "support.faq3Q": "هل هو طبيب أو محامٍ؟",
        "support.faq3A": "لا. لا يعطي نصيحة دوائية ولا قانونية. وحين تكون المسألة خطيرة يقول لك إن تذهب إلى طبيب أو مسؤول — لا يأخذ مكانهما.",
        "support.faq4Q": "هل كل إجابة صحيحة؟",
        "support.faq4A": "ليس دائماً. الإجابة يكتبها حاسوب لا طبيب — ولذلك كُتب مع كل إجابة أنها ليست نصيحة طبية. استشر الطبيب قبل بدء أي دواء أو إيقافه.",
        "support.faq5Q": "هل عليّ تحميل أي تطبيق؟",
        "support.faq5A": "لا. تُفتح في المتصفح فقط. لا تثبيت تطبيق، ولا أذونات، ولا تحديثات.",
    },
    "es": {
        "support.contactMessageLabel": "Tu mensaje",
        "support.contactPlaceholder": "Escribe lo que quieras: un error, algo que estuvo bien, o una pregunta.",
        "support.contactHelp": "Al menos 10 caracteres. Esto va directamente al dueño.",
        "support.contactSubmit": "Enviar",
        "support.contactSending": "Enviando…",
        "support.contactPrivacy": "No hace falta escribir tu nombre.",
        "support.contactSent": "Ha llegado",
        "support.contactSentBody": "Tu mensaje ha llegado al dueño.",
        "support.contactFailed": "No se pudo enviar",
        "support.faq1Q": "¿Es realmente gratis?",
        "support.faq1A": "Sí. No se cobra dinero, no se muestran anuncios y no se pide membresía. Funciona con el dinero de una persona, no con el de una empresa ni el de un gobierno.",
        "support.faq2Q": "¿Tomáis mi nombre, mi dirección o mi teléfono?",
        "support.faq2A": "No, y no se tomará. El sitio no crea ninguna identidad sobre ti: ni inicio de sesión ni scripts de seguimiento. Solo se guarda lo que preguntaste.",
        "support.faq3Q": "¿Es un médico o un abogado?",
        "support.faq3A": "No. No da indicaciones sobre medicamentos ni asesoramiento legal. Cuando el asunto es grave te dice que vayas a un médico o a una autoridad, no ocupa su lugar.",
        "support.faq4Q": "¿Todas las respuestas son correctas?",
        "support.faq4A": "No siempre. Las respuestas las escribe un ordenador, no un médico, y por eso cada respuesta lleva escrito que no es consejo médico. Consulta a un médico antes de empezar o dejar cualquier medicina.",
        "support.faq5Q": "¿Tengo que instalar alguna aplicación?",
        "support.faq5A": "No. Se abre en el navegador. Sin instalar aplicaciones, sin permisos, sin actualizaciones.",
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


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()

    for key, value in HI.items():
        source = set_key(source, "HINDI", key, value)

    count = len(HI)
    for code, table in TABLES:
        for key, value in T[code].items():
            source = set_key(source, table, key, value)
        print(f"  {table:<10} {len(T[code])} keys")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)
    print(f"\n{count} keys x {len(TABLES)} languages = {count * len(TABLES)} strings")
    print("Plus HINDI, which is the source.")
    print()
    print("Run: npm run db:push   to add the contact_messages table")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
