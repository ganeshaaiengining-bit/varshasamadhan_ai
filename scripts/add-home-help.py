"""
Fill the home and help strings into the eleven tables that never had them.

    python scripts/add-home-help.py

Reported: choosing Marathi gives English. Not one page — most of the site.

Hindi carries 367 keys. Bengali, Marathi, Tamil, Telugu and Gujarati carry 194;
the rest carry 187. So between 173 and 180 strings per language fall through to
English, and they are the ones a visitor reads first: the home page's three
steps, the help page's heading and its four example questions.

Why this was invisible for so long: the health box had been translated for all
eleven languages, so the check that looked at /sahayata found Marathi on the
page. It looked at the age box and never at the heading above it.

Run once. Then run scripts/test-language-switch.py, which fetches each language
as a visitor and says what came back.
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
        "help.title": "तुमची समस्या लिहा",
        "help.intro": "खाली लिहा किंवा बोला. माहीत नसेल तर जसाच मनात आहे तसाच लिहा — हेच सर्वात महत्त्वाचे आहे.",
        "help.howTitle": "ही सेवा कशी चालते",
        "help.howBody": "प्रत्येक प्रश्न नोंदवला जातो आणि त्याचे उत्तर लगेच मिळते. तुमचे नाव, पत्ता किंवा फोन नंबर कुठेही घेतला जात नाही. सर्व काही मोफत आहे.",
        "help.suggested": "नेहमीचे प्रश्न",
        "help.q1.label": "वीज गेले आहे, काय करू?",
        "help.q1.question": "घरात वीज चालू गेली आहे. काय करावे, आणि मोबाइल फोन कसा चार्ज करावा?",
        "help.q2.label": "मुलाचा अभ्यासात कमजोरी",
        "help.q2.question": "माझ्या मुलाच्या अभ्यासात खूप कमजोरी आहे. घरी कसे सुधारू?",
        "help.q3.label": "वृद्धाचे उपचार",
        "help.q3.question": "माझ्या बाबांचे वय खूप जास्त आहे, त्यांचे उपचार कसे करावेत?",
        "help.q4.label": "घरात आग लागल्यास",
        "help.q4.question": "रात्री घरात आग लागल्यास सर्वात आधी काय करावे?",
        "home.stepLabel": "टप्पा",
        "home.step1Title": "तुमचे म्हणणे लिहा किंवा बोला",
        "home.step1Body": "मराठीत टाइप करा, किंवा मायक दाबून बोला. काहीही वेगळे करायची गरज नाही — जे मनात आहे ते लिहा.",
        "home.step2Title": "लगेच उत्तर मिळते",
        "home.step2Body": "प्रत्येक प्रश्न नोंदवला जातो आणि त्याचे उत्तर लगेच मिळते. खूप मोठ्या प्रश्नाआधी लहान प्रश्नापासून सुरुवात करा.",
        "home.step3Title": "पैसे नाहीत, वैयक्तिक माहिती नाही",
        "home.step3Body": "ही सेवा पूर्णपणे मोफत आहे. तुमचे नाव, पत्ता किंवा फोन नंबर मागितला जात नाही, आणि जाहिरात दाखवली जात नाही.",
        "home.chooseTopicNote": "खालील विषयांवर टॅप करा. प्रत्येक ठिकाणी साध्या भाषेत माहिती दिली आहे.",
        "home.categoryEmpty": "या विषयात अद्याप कोणतेही लेख लिहिलेले नाहीत.",
        "home.soundIntro": "कोणतेही शुल्क नाही, कोणतीही जाहिरात नाही. फक्त मन शांत करण्यासाठी.",
        "home.dedication1": "स्मृतिमध्ये — पूर्णपणे मोफत सेवा.",
        "home.dedication2": "तुमची समस्या लिहा किंवा बोला.",
    },
    "bn": {
        "help.title": "আপনার সমস্যা লিখুন",
        "help.intro": "নিচে লিখুন বা বলুন। জানা না থাকলে মনে যা আসে লিখে দিন — এটিই সবচেয়ে জরুরি।",
        "help.howTitle": "এই সেবা কীভাবে কাজ করে",
        "help.howBody": "প্রতিটি প্রশ্ন নথিভুক্ত হয় এবং তার উত্তর সঙ্গে সঙ্গে পাওয়া যায়। আপনার নাম, ঠিকানা বা ফোন নম্বর কোথাও নেওয়া হয় না। সবই বিনামূল্যে।",
        "help.suggested": "সাধারণ প্রশ্ন",
        "help.q1.label": "বিদ্যুৎ চলে গেছে, কী করব?",
        "help.q1.question": "বাড়িতে বিদ্যুৎ চলে গেছে। কী করা উচিত, আর মোবাইল কীভাবে চার্জ করব?",
        "help.q2.label": "সন্তানের পড়াশোনায় দুর্বলতা",
        "help.q2.question": "আমার ছেলের পড়াশোনায় খুব দুর্বলতা আছে। বাড়িতে কীভাবে सुधारू?",
        "help.q3.label": "বৃদ্ধের চিকিৎসা",
        "help.q3.question": "আমার বাবার বয়স খুব বেশি, তাঁর চিকিৎসা কীভাবে করব?",
        "help.q4.label": "বাড়িতে আগুন লাগলে",
        "help.q4.question": "রাতে বাড়িতে আগুন লাগলে সবার আগে কী করা উচিত?",
        "home.stepLabel": "ধাপ",
        "home.step1Title": "আপনার কথা লিখুন বা বলুন",
        "home.step1Body": "বাংলায় টাইপ করুন, বা মাইক চেপে বলুন। কিছু বিশেষ করার দরকার নেই — মনে যা আসে তাই লিখুন।",
        "home.step2Title": "সঙ্গে সঙ্গে উত্তর পাবেন",
        "home.step2Body": "প্রতিটি প্রশ্ন নথিভুক্ত হয় এবং তার উত্তর সঙ্গে সঙ্গে পাওয়া যায়। খুব বড় প্রশ্নের আগে ছোট প্রশ্ন দিয়ে শুরু করুন।",
        "home.step3Title": "টাকা নেই, ব্যক্তিগত তথ্য নেই",
        "home.step3Body": "এই সেবা সম্পূর্ণ বিনামূল্যে। আপনার নাম, ঠিকানা বা ফোন নম্বর চাওয়া হয় না, আর কোনো বিজ্ঞাপনও দেখানো হয় না।",
        "home.chooseTopicNote": "নিচের বিষয়ে ট্যাপ করুন। প্রতিটি জায়গায় সহজ ভাষায় তথ্য দেওয়া আছে।",
        "home.categoryEmpty": "এই বিষয়ে এখনো কোনো লেখা লেখা হয়নি।",
        "home.soundIntro": "কোনো ফি নেই, কোনো বিজ্ঞাপন নেই। শুধু মন শান্ত করার জন্য।",
        "home.dedication1": "স্মরণে — সম্পূর্ণ বিনামূল্যে সেবা।",
        "home.dedication2": "আপনার সমস্যা লিখুন বা বলুন।",
    },
    "ta": {
        "help.title": "உங்கள் சிக்கலை எழுதுங்கள்",
        "help.intro": "கீழே எழுதுங்கள் அல்லது பேசுங்கள். தெரியாவிட்டால் மனதில் வருபனவே எழுதிவிடுங்கள் — இதுவே மிக முக்கியம்.",
        "help.howTitle": "இந்தச் சேவை எப்படி வேலை செய்கிறது",
        "help.howBody": "ஒவ்வொரு கேள்வியும் பதிவு செய்யப்படுகிறது, அதற்கான பதில் உடனே கிடைக்கிறது. உங்கள் பெயர், முகவரி அல்லது தொலைபேசி எண் எங்கும் எடுக்கப்படுவதில்லை. அனைத்தும் இலவசம்.",
        "help.suggested": "வழக்கமான கேள்விகள்",
        "help.q1.label": "மின்சாரம் போனது, என்ன செய்வது?",
        "help.q1.question": "வீட்டில் மின்சாரம் போனது. என்ன செய்ய வேண்டும், மொபைல் போன் எப்படி சார்ஜ் செய்வது?",
        "help.q2.label": "பிள்ளை கல்வியில் குறைபாடு",
        "help.q2.question": "என் மகனின் படிப்பில் மிகக் குறைபாடு உள்ளது. வீட்டில் எப்படி மேம்படுத்துவது?",
        "help.q3.label": "மூத்தோர் சிகிச்சை",
        "help.q3.question": "என் தந்தையின் வயது மிக அதிகம், அவருக்கு சிகிச்சை எப்படி செய்வது?",
        "help.q4.label": "வீட்டில் தீ வைத்தால்",
        "help.q4.question": "ராத்திரி வீட்டில் தீ வைத்தால் முதலில் என்ன செய்ய வேண்டும்?",
        "home.stepLabel": "படி",
        "home.step1Title": "உங்கள் கூற்றை எழுதுங்கள் அல்லது பேசுங்கள்",
        "home.step1Body": "தமிழில் தட்டச்சு செய்யுங்கள், அல்லது மைக் அழுத்திப் பேசுங்கள். தனிக்க ஏதும் தேவையில்லை — மனத்தில் உள்ளதை எழுதுங்கள்.",
        "home.step2Title": " உடனே பதில் கிடைக்கும்",
        "home.step2Body": "ஒவ்வொரு கேள்வியும் பதிவு செய்யப்படுகிறது, அதற்கான பதில் உடனே கிடைக்கிறது. மிகப் பெரிய கேள்விக்கு முன் சிறிய கேள்வியால் தொடங்குங்கள்.",
        "home.step3Title": "பணம் இல்லை, தனிப்பட்ட தகவல் இல்லை",
        "home.step3Body": "இந்தச் சேவை முற்றிலும் இலவசம். உங்கள் பெயர், முகவரி அல்லது தொலைபேசி எண் கேட்கப்படுவதில்லை, விளம்பரமும் காட்டப்படுவதில்லை.",
        "home.chooseTopicNote": "கீழே உள்ள தலைப்பைத் தட்டவும். ஒவ்வொரு இடத்திலும் எளிய மொழியில் விவரம் உள்ளது.",
        "home.categoryEmpty": "இந்தத் தலைப்பில் இன்னும் எதுவும் எழுதப்படவில்லை.",
        "home.soundIntro": "கட்டணம் இல்லை, விளம்பரம் இல்லை. மனதை அமைதியாக்க மட்டும்.",
        "home.dedication1": "நினைவில் — முற்றிலும் இலவசமான சேவை.",
        "home.dedication2": "உங்கள் சிக்கலை எழுதுங்கள் அல்லது பேசுங்கள்.",
    },
    "te": {
        "help.title": "మీ సమస్యను రాయండి",
        "help.intro": "కింద రాయండి లేదా మాట్లాడండి. తెలియకపోతే మనసులో వచ్చినట్టు రాయండి — ఇదే అత్యంత ముఖ్యం.",
        "help.howTitle": "ఈ సేవ ఎలా పనిచేస్తుంది",
        "help.howBody": "ప్రతి ప్రశ్న నమోదు అవుతుంది, దానికి సమాధానం వెంటనే అందుబాటులో ఉంటుంది. మీ పేరు, చిరునామా ఫోన్ నంబర్ ఎక్కడా తీసుకోవడం జరగదు. అన్నీ ఉచితం.",
        "help.suggested": "సాధారణ ప్రశ్నలు",
        "help.q1.label": "విద్యుత్తు పోయింది, ఏమి చేయాలి?",
        "help.q1.question": "ఇంట్లో విద్యుత్తు పోయింది. ఏమి చేయాలి, మరియు మొబైల్ ఫోన్ ఎలా చార్జ్ చేయాలి?",
        "help.q2.label": "పిల్లల విద్యలో బలహీనత",
        "help.q2.question": "నా కొడుకు చదువులో చాలా బలహీనత ఉంది. ఇంట్లో ఎలా మెరుగుపరచాలి?",
        "help.q3.label": "వృద్ధుల చికిత్స",
        "help.q3.question": "నా తండ్రి వయస్సు చాలా ఎక్కువ, వారికి చికిత్స ఎలా చేయాలి?",
        "help.q4.label": "ఇంట్లో అగ్ని ప్రారంభమైతే",
        "help.q4.question": "రాత్రి ఇంట్లో అగ్ని ప్రారంభమైతే మొదట ఏమి చేయాలి?",
        "home.stepLabel": "దశ",
        "home.step1Title": "మీ మాట రాయండి లేదా మాట్లాడండి",
        "home.step1Body": "తెలుగులో టైప్ చేయండి, లేదా మైక్ నొక్కి మాట్లాడండి. ప్రత్యేకంగా ఏమీ చేయాల్సిన అవసరం లేదు — మనసులో ఉన్నది రాయండి.",
        "home.step2Title": "వెంటనే సమాధానం",
        "home.step2Body": "ప్రతి ప్రశ్న నమోదు అవుతుంది, దానికి సమాధానం వెంటనే అందుబాటులో ఉంటుంది. చాలా పెద్ద ప్రశ్నకు ముందు చిన్న ప్రశ్నతో మొదలైపెట్టండి.",
        "home.step3Title": "డబ్బు లేదు, వ్యక్తిగత సమాచారం లేదు",
        "home.step3Body": "ఈ సేవ పూర్తిగా ఉచితం. మీ పేరు, చిరునామా లేదా ఫోన్ నంబర్ అడగబడదు, ప్రచారం కూడా చూపబడదు.",
        "home.chooseTopicNote": "కింద ఉన్న అంశాన్ని నొక్కండి. ప్రతి చోట అర్థమయ్యే భాషలో సమాచారం ఇవ్వబడింది.",
        "home.categoryEmpty": "ఈ అంశంలో ఇంకా ఏమీ రాయలేదు.",
        "home.soundIntro": "ఫీజు లేదు, ప్రచారం లేదు. మనసు ప్రశాంతం చేయడానికి మాత్రమే.",
        "home.dedication1": "స్మరణలో — పూర్తిగా ఉచిత సేవ.",
        "home.dedication2": "మీ సమస్యను రాయండి లేదా మాట్లాడండి.",
    },
    "gu": {
        "help.title": "તમારી સમસ્યા લખો",
        "help.intro": "નીચે લખો અથવા બોલો. ખબર ન હોય તો જે મનમાં આવે તે જ લખી દો — આ જ સૌથી અગત્યનું છે.",
        "help.howTitle": "આ સેવા કેવી રીતે કામ કરે છે",
        "help.howBody": "દરેક પ્રશ્ન નોંધાય છે અને તેનો જવાબ તરત મળે છે. તમારું નામ, સરનામું કે ફોન નંબર ક્યાંય લેવાતું નથી. બધું મફત છે.",
        "help.suggested": "સામાન્ય પ્રશ્નો",
        "help.q1.label": "વીજળી ગઈ છે, શું કરું?",
        "help.q1.question": "ઘરમાં વીજળી ચાલુ ગઈ છે. શું કરવું જોઈએ, અને મોબાઇલ ફોન કેવી રીતે ચાર્જ કરવો?",
        "help.q2.label": "બાળકના અભ્યાસમાં નબળાઈ",
        "help.q2.question": "મારા બાળકના અભ્યાસમાં ઘણી નબળાઈ છે. ઘરે કેવી રીતે સુધારું?",
        "help.q3.label": "વૃદ્ધનો ઈલાજ",
        "help.q3.question": "મારા પિતાજીની ઉંમર ઘણી વધુ છે, તેમનો ઈલાજ કેવી રીતે કરું?",
        "help.q4.label": "ઘરમાં આગ લાગે તો",
        "help.q4.question": "રાત્રે ઘરમાં આગ લાગે તો સૌથી પહેલા શું કરવું જોઈએ?",
        "home.stepLabel": "પગલું",
        "home.step1Title": "તમારી વાત લખો અથવા બોલો",
        "home.step1Body": "ગુજરાતીમાં ટાઇપ કરો, અથવા માઇક દબાવીને બોલો. કંઈ ખાસ કરવાનું નથી — જે મનમાં છે તે લખી દો.",
        "home.step2Title": "તરત જવાબ મળે છે",
        "home.step2Body": "દરેક પ્રશ્ન નોંધાય છે અને તેનો જવાબ તરત મળે છે. ઘણા મોટા પ્રશ્ન પહેલાં નાના પ્રશ્નથી શરૂ કરો.",
        "home.step3Title": "પૈસા નહીં, વ્યક્તિગત માહિતી નહીં",
        "home.step3Body": "આ સેવા સંપૂર્ણ મફત છે. તમારું નામ, સરનામું કે ફોન નંબર માંગવામાં આવતું નથી, અને કોઈ જાહેરાત બતાવવામાં આવતી નથી.",
        "home.chooseTopicNote": "નીચેના વિષય પર ટેપ કરો. દરેક જગ્યાએ સરળ ભાષામાં માહિતી આપવામાં આવી છે.",
        "home.categoryEmpty": "આ વિષયમાં હજી કંઈ લખાયું નથી.",
        "home.soundIntro": "કોઈ ફી નહીં, કોઈ જાહેરાત નહીં. ફક્ત મન શાંત કરવા માટે.",
        "home.dedication1": "સ્મૃતિમાં — સંપૂર્ણ મફત સેવા.",
        "home.dedication2": "તમારી સમસ્યા લખો અથવા બોલો.",
    },
    "kn": {
        "help.title": "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ",
        "help.intro": "ಕೆಳಗೆ ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ. ಗೊತ್ತಿಲ್ಲದಿದ್ದರೆ ಮನಸಿನಲ್ಲಿ ಬರುವಷ್ಟೇ ಬರೆಯಿರಿ — ಇದೇ ಅತ್ಯಂತ ಮುಖ್ಯ.",
        "help.howTitle": "ಈ ಸೇವೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
        "help.howBody": "ಪ್ರತಿ ಪ್ರಶ್ನೆ ದಾಖಲಾಗುತ್ತದೆ ಮತ್ತು ಅದರ ಉತ್ತರ ತಕ್ಷಣ ಸಿಗುತ್ತದೆ. ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಎಲ್ಲಿಯೂ ತೆಗೆಯುವುದಿಲ್ಲ. ಎಲ್ಲವೂ ಉಚಿತ.",
        "help.suggested": "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು",
        "help.q1.label": "ವಿದ್ಯುತ್ ಹೋಗಿದೆ, ಏನು ಮಾಡಬೇಕು?",
        "help.q1.question": "ಮನೆಯಲ್ಲಿ ವಿದ್ಯುತ್ ಹೋಗಿದೆ. ಏನು ಮಾಡಬೇಕು, ಮತ್ತು ಮೊಬೈಲ್ ಫೋನ್ ಹೇಗೆ ಚಾರ್ಜ್ ಮಾಡಬೇಕು?",
        "help.q2.label": "ಮಕುವಿನ ಓದುವಿನಲ್ಲಿ ದುರ್ಬಲತೆ",
        "help.q2.question": "ನನ್ನ ಮಗನ ಓದುವಿನಲ್ಲಿ ತುಂಬಾ ದುರ್ಬಲತೆ ಇದೆ. ಮನೆಯಲ್ಲಿ ಹೇಗೆ ಸುಧರಿಸಬೇಕು?",
        "help.q3.label": "ವೃದ್ಧರ ಚಿಕಿತ್ಸೆ",
        "help.q3.question": "ನನ್ನ ತಂದೆಯ ವಯಸ್ಸು ತುಂಬಾ ಹೆಚ್ಚು, ಅವರಿಗೆ ಚಿಕಿತ್ಸೆ ಹೇಗೆ ಕೊಡಬೇಕು?",
        "help.q4.label": "ಮನೆಯಲ್ಲಿ ಅಗ್ನಿ ಸಂಭವಿಸಿದರೆ",
        "help.q4.question": "ರಾತ್ರಿ ಮನೆಯಲ್ಲಿ ಅಗ್ನಿ ಸಂಭವಿಸಿದರೆ ಮೊದಲು ಏನು ಮಾಡಬೇಕು?",
        "home.stepLabel": "ಹಂತ",
        "home.step1Title": "ನಿಮ್ಮ ಮಾತನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ",
        "home.step1Body": "ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ, ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ. ಏನೂ ವಿಶೇಷ ಮಾಡಬೇಕಿಲ್ಲ — ಮನಸಿನಲ್ಲಿರುವದ್ದನ್ನೇ ಬರೆಯಿರಿ.",
        "home.step2Title": "ತಕ್ಷಣ ಉತ್ತರ ಸಿಗುತ್ತದೆ",
        "home.step2Body": "ಪ್ರತಿ ಪ್ರಶ್ನೆ ದಾಖಲಾಗುತ್ತದೆ ಮತ್ತು ಅದರ ಉತ್ತರ ತಕ್ಷಣ ಸಿಗುತ್ತದೆ. ತುಂಬಾ ದೊಡ್ಡ ಪ್ರಶ್ನೆಗೆ ಮೊದಲು ಪುಟ್ಟ ಪ್ರಶ್ನೆಯಿಂದ ಆರಂಭಿಸಿ.",
        "home.step3Title": "ಹಣಕಟಿಯಿಲ್ಲ, ಖಾಸಗಿ ಮಾಹಿತಿಯಿಲ್ಲ",
        "home.step3Body": "ಈ ಸೇವೆ ಸಂಪೂರ್ಣ ಉಚಿತ. ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಕೇಳುವುದಿಲ್ಲ, ಮತ್ತು ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ.",
        "home.chooseTopicNote": "ಕೆಳಗಿನ ವಿಷಯಕ್ಕೆ ಒತ್ತಿ. ಪ್ರತಿ ಕಡೆ ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ.",
        "home.categoryEmpty": "ಈ ವಿಷಯದಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಬರೆಯಲಾಗಿಲ್ಲ.",
        "home.soundIntro": "ಶುಲ್ಕವಿಲ್ಲ, ಜಾಹೀರಾತಿಲ್ಲ. ಮನಸು ಶಾಂತಗೊಳಿಸಲು ಮಾತ್ರ.",
        "home.dedication1": "ಸ್ಮರಣದಲ್ಲಿ — ಸಂಪೂರ್ಣ ಉಚಿತ ಸೇವೆ.",
        "home.dedication2": "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ.",
    },
    "ml": {
        "help.title": "നിങ്ങളുടെ പ്രശ്നം എഴുതുക",
        "help.intro": "താഴെ എഴുതുകയോ പറയുകയോ ചെയ്യുക. അറിയില്ലെങ്കിൽ മനസ്സിൽ വരുന്നത് എഴുതിവയ്ക്കുക — ഇതാണ് ഏറ്റവും പ്രധാനം.",
        "help.howTitle": "ഈ സേവനം എങ്ങനെ പ്രവർത്തിക്കുന്നു",
        "help.howBody": "ഓരോ ചോദ്യവും രേഖപ്പെടുത്തുകയും അതിന്റെ ഉത്തരം ഉടனே ലഭിക്കുന്നു. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും എവിടെയും എടുക്കപ്പെട്ടില്ല. എല്ലാം സൗജന്യമാണ്.",
        "help.suggested": "പ്രത്യേക ചോദ്യങ്ങൾ",
        "help.q1.label": "വൈദ്യുത് പോയി, എന്ത് ചെയ്യണം?",
        "help.q1.question": "വീട്ടിൽ വൈദ്യുത് പോയി. എന്ത് ചെയ്യണം, മൊബൈൽ ഫോൺ എങ്ങനെ ചാർജ്ജ് ചെയ്യണം?",
        "help.q2.label": "കുട്ടിയുടെ പഠനത്തിൽ ദുർബലത",
        "help.q2.question": "എന്റെ മകന്റെ പഠനത്തിൽ വളരെ ദുർബലതയുണ്ട്. വീട്ടിൽ എങ്ങനെ മാറ്റിയെടുക്കണം?",
        "help.q3.label": "വൃദ്ധരുടെ ചികിത്സ",
        "help.q3.question": "എന്റെ അച്ചിന്റെ പ്രായം വളരെ കൂടുതലാണ്, അവർക്ക് ചികിത്സ എങ്ങനെ നൽകണം?",
        "help.q4.label": "വീട്ടിൽ തീ പൊത്തിട്ടാൽ",
        "help.q4.question": "രാത്രി വീട്ടിൽ തീ പൊത്തിട്ടാൽ ആദ്യം എന്ത് ചെയ്യണം?",
        "home.stepLabel": "ഘട്ടം",
        "home.step1Title": "നിങ്ങളുടെ കാര്യം എഴുതുകയോ പറയുകയോ ചെയ്യുക",
        "home.step1Body": "മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക, അല്ലെങ്കിൽ മൈക്രോൺ അമർത്തി പറയുക. പ്രത്യേകം ഒന്നും ചെയ്യേണ്ടതില്ല — മനസ്സിലുള്ളത് എഴുതിവയ്ക്കുക.",
        "home.step2Title": "ഉടൻ ഉത്തരം ലഭിക്കും",
        "home.step2Body": "ഓരോ ചോദ്യവും രേഖപ്പെടുത്തുകയും അതിന്റെ ഉത്തരം ഉടന്ന് ലഭിക്കുന്നു. വലിയ ചോദ്യത്തിന് മുമ്പ് ചെറിയ ചോദ്യത്തിൽ തുടങ്ങുക.",
        "home.step3Title": "പണമില്ല, സ്വകാര്യ വിവരമില്ല",
        "home.step3Body": "ഈ സേവനം പൂർണ്ണമായും സൗജന്യമാണ്. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും ആരോഗ്യദാരും ചോദിക്കപ്പെട്ടില്ല, പരസ്താരവുമില്ല.",
        "home.chooseTopicNote": "താഴെയുള്ള വിഷയത്തിൽ അമർത്തുക. ഓരോ സ്ഥലത്തും എളുപ്പമായ ഭാഷയിൽ വിവരങ്ങൾ നൽകിയിട്ടുണ്ട്.",
        "home.categoryEmpty": "ഈ വിഷയത്തിൽ ഇതുവരെ ഒന്നും എഴുതിയിട്ടില്ല.",
        "home.soundIntro": "ഫീസില്ല, പരസ്താരമില്ല. മനസ്സ് ശാന്തമാക്കാൻ മാത്രം.",
        "home.dedication1": "സ്മരണയിൽ — പൂർണ്ണമായും സൗജന്യമായ സേവനം.",
        "home.dedication2": "നിങ്ങളുടെ പ്രശ്നം എഴുതുകയോ പറയുകയോ ചെയ്യുക.",
    },
    "pa": {
        "help.title": "ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ",
        "help.intro": "ਹੇਠਾਂ ਲਿਖੋ ਜਾਂ ਬੋਲੋ। ਨਾ ਪਤਾ ਹੋਵੇ ਤਾਂ ਜੋ ਮਨ ਵਿੱਚ ਆਵੇ ਲਿਖ ਦਿਓ — ਇਹੀ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਹੈ।",
        "help.howTitle": "ਇਹ ਸੇਵਾ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ",
        "help.howBody": "ਹਰ ਸਵਾਲ ਦਰਜ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਜਵਾਬ ਤੁਰੰਤ ਮਿਲਦਾ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਕਿਤੇ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ। ਸਭ ਕੁਝ ਮੁਫ਼ਤ ਹੈ।",
        "help.suggested": "ਆਮ ਸਵਾਲ",
        "help.q1.label": "ਬਿਜਲੀ ਚਲੀ ਗਈ, ਕੀ ਕਰੂੰ?",
        "help.q1.question": "ਘਰ ਵਿੱਚ ਬਿਜਲੀ ਚਲੀ ਗਈ ਹੈ। ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ, ਅਤੇ ਮੋਬਾਈਲ ਫੋਨ ਕਿਵੇਂ ਚਾਰਜ ਕਰੀਏ?",
        "help.q2.label": "ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਕਮਜ਼ੋਰੀ",
        "help.q2.question": "ਮੇਰੇ ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਬਹੁਤ ਕਮਜ਼ੋਰੀ ਹੈ। ਘਰ ਵਿੱਚ ਕਿਵੇਂ ਸੁਧਾਰੀਏ?",
        "help.q3.label": "ਬਜ਼ੁਰਗ ਦਾ ਇਲਾਜ",
        "help.q3.question": "ਮੇਰੇ ਪਿਤਾ ਜੀ ਦੀ ਉਮਰ ਬਹੁਤ ਵੱਧ ਹੈ, ਉਨ੍ਹਾਂ ਦਾ ਇਲਾਜ ਕਿਵੇਂ ਕਰੂੰ?",
        "help.q4.label": "ਘਰ ਵਿੱਚ ਅੱਗ ਲੱਗ ਜਾਵੇ ਤਾਂ",
        "help.q4.question": "ਜੇ ਰਾਤ ਨੂੰ ਘਰ ਵਿੱਚ ਅੱਗ ਲੱਗ ਜਾਵੇ ਤਾਂ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "home.stepLabel": "ਕਦਮ",
        "home.step1Title": "ਆਪਣੀ ਗੱਲ ਲਿਖੋ ਜਾਂ ਬੋਲੋ",
        "home.step1Body": "ਪੰਜਾਬੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ, ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ। ਕੁਝ ਖ਼ਾਸ ਨਹੀਂ ਕਰਨਾ — ਜੋ ਮਨ ਵਿੱਚ ਹੈ ਲਿਖ ਦਿਓ।",
        "home.step2Title": "ਤੁਰੰਤ ਜਵਾਬ ਮਿਲਦਾ ਹੈ",
        "home.step2Body": "ਹਰ ਸਵਾਲ ਦਰਜ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਜਵਾਬ ਤੁਰੰਤ ਮਿਲਦਾ ਹੈ। ਬਹੁਤ ਲੰਬੇ ਸਵਾਲ ਤੋਂ ਪਹਿਲਾਂ ਛੋਟੇ ਸਵਾਲ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।",
        "home.step3Title": "ਕੋਈ ਪੈਸਾ ਨਹੀਂ, ਕੋਈ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨਹੀਂ",
        "home.step3Body": "ਇਹ ਸੇਵਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਨਹੀਂ ਮੰਗਿਆ ਜਾਂਦਾ, ਅਤੇ ਕੋਈ ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ ਦਿਖਾਇਆ ਜਾਂਦਾ।",
        "home.chooseTopicNote": "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਸ਼ੇ 'ਤੇ ਟੈਪ ਕਰੋ। ਹਰ ਥਾਂ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।",
        "home.categoryEmpty": "ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਹਾਲੇ ਕੁਝ ਵੀ ਨਹੀਂ ਲਿਖਿਆ ਗਿਆ।",
        "home.soundIntro": "ਕੋਈ ਫ਼ੀਸ ਨਹੀਂ, ਕੋਈ ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ। ਸਿਰਫ਼ ਮਨ ਸ਼ਾਂਤ ਕਰਨ ਲਈ।",
        "home.dedication1": "ਸ਼ਰਧਾਂਜਲੀ ਵਿੱਚ — ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਸੇਵਾ।",
        "home.dedication2": "ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ ਜਾਂ ਬੋਲੋ।",
    },
    "ur": {
        "help.title": "اپنا مسئلہ لکھیے",
        "help.intro": "نیچے لکھیے یا بولیے۔ پتا نہ ہو تو جو دل میں آئے وہی لکھ دیجیے — یہی سب سے ضروری ہے۔",
        "help.howTitle": "یہ خدمت کیسے کام کرتی ہے",
        "help.howBody": "ہر سوال درج ہوتا ہے اور اس کا جواب فوراً ملتا ہے۔ آپ کا نام، پتہ یا فون نمبر کہیں نہیں لیا جاتا۔ سب کچھ مفت ہے۔",
        "help.suggested": "عام سوالات",
        "help.q1.label": "بجلی چلی گئی، کیا کریں؟",
        "help.q1.question": "گھر میں بجلی چلی گئی ہے۔ کیا کرنا چاہیے، اور موبائل فون کیسے چارج کریں؟",
        "help.q2.label": "بچے کی پڑھائی میں کمزوری",
        "help.q2.question": "میرے بچے کی پڑھائی میں بہت کمزوری ہے۔ گھر پر کیسے بہتر کریں؟",
        "help.q3.label": "بوڑھے کا علاج",
        "help.q3.question": "میرے والد صاحب کی عمر بہت زیادہ ہے، ان کا علاج کیسے کروں؟",
        "help.q4.label": "گھر میں آگ لگے تو",
        "help.q4.question": "اگر رات کو گھر میں آگ لگے تو سب سے پہلے کیا کرنا چاہیے؟",
        "home.stepLabel": "مرحلہ",
        "home.step1Title": "اپنی بات لکھیے یا بولیے",
        "home.step1Body": "اردو میں ٹائپ کریے، یا مائیک دبا کر بولیے۔ کچھ خاص کرنے کی ضرورت نہیں — جو دل میں ہے وہی لکھ دیجیے۔",
        "home.step2Title": "فوراً جواب ملتا ہے",
        "home.step2Body": "ہر سوال درج ہوتا ہے اور اس کا جواب فوراً ملتا ہے۔ بہت لمبے سوال سے پہلے چھوٹے سوال سے شروع کریے۔",
        "home.step3Title": "پیسے نہیں، نجی معلومات نہیں",
        "home.step3Body": "یہ خدمت مکمل طور پر مفت ہے۔ آپ کا نام، پتہ یا فون نمبر نہیں مانگا جاتا، اور کوئی اشتہار نہیں دکھایا جاتا۔",
        "home.chooseTopicNote": "نیچے دیے گئے موضوع پر ٹیپ کریے۔ ہر جگہ آسان زبان میں معلومات دی گئی ہے۔",
        "home.categoryEmpty": "اس موضوع میں ابھی کچھ بھی نہیں لکھا گیا۔",
        "home.soundIntro": "کوئی فیس نہیں، کوئی اشتہار نہیں۔ بس ذہن شانت کرنے کے لیے۔",
        "home.dedication1": "یاد میں — مکمل طور پر مفت خدمت۔",
        "home.dedication2": "اپنا مسئلہ لکھیے یا بولیے۔",
    },
    "ar": {
        "help.title": "اكتب مشكلتك",
        "help.intro": "اكتب في الأسفل أو تحدّث. وإن لم تعرف فاكتب ما يخطر ببالك — هذا أهم شيء.",
        "help.howTitle": "كيف تعمل هذه الخدمة",
        "help.howBody": "كل سؤال يُسجَّل ويصل جوابه فوراً. لا يُؤخذ اسمك ولا عنوانك ولا رقم هاتفك في أي مكان. كل شيء مجاني.",
        "help.suggested": "أسئلة شائعة",
        "help.q1.label": "الكهرباء انقطعت، ماذا أفعل؟",
        "help.q1.question": "انقطعت الكهرباء في البيت. ماذا يجب أن أفعل، وكيف أشحن الهاتف؟",
        "help.q2.label": "ضعف في درس الأولاد",
        "help.q2.question": "ابني يتعثر كثيراً في الدراسة. كيف أحسّن دراسته في البيت؟",
        "help.q3.label": "علاج كبار السن",
        "help.q3.question": "والدي كبير في السن جداً، كيف أعتني بعلاجه؟",
        "help.q4.label": "إذا اشتعل الحريق في البيت",
        "help.q4.question": "إذا اشتعل الحريق في البيت ليلاً، فما أول ما يجب فعله؟",
        "home.stepLabel": "خطوة",
        "home.step1Title": "اكتب كلامك أو تحدّث",
        "home.step1Body": "اكتب بالعربية، أو اضغط الميكروفون وتحدّث. لا حاجة إلى أي شيء خاص — اكتب ما يخطر ببالك.",
        "home.step2Title": "الجواب يصل فوراً",
        "home.step2Body": "كل سؤال يُسجَّل ويصل جوابه فوراً. ابدأ بسؤال صغير قبل أن تسأل سؤالاً طويلاً.",
        "home.step3Title": "لا مال ولا معلومات شخصية",
        "home.step3Body": "هذه الخدمة مجانية تماماً. لا يُطلب اسمك ولا عنوانك ولا رقم هاتفك، ولا تظهر أي إعلانات.",
        "home.chooseTopicNote": "اضغط على الموضوع أدناه. المعلومات مكتوبة بلغة بسيطة في كل مكان.",
        "home.categoryEmpty": "لم يُكتب شيء في هذا الموضوع بعد.",
        "home.soundIntro": "لا رسوم ولا إعلانات. فقط لتهدئة النفس.",
        "home.dedication1": "في الذاكرة — خدمة مجانية تماماً.",
        "home.dedication2": "اكتب مشكلتك أو تحدّث.",
    },
    "es": {
        "help.title": "Escribe tu problema",
        "help.intro": "Escribe abajo o habla. Si no sabes, escribe lo que te venga a la mente: eso es lo más importante.",
        "help.howTitle": "Cómo funciona este servicio",
        "help.howBody": "Cada pregunta queda registrada y su respuesta llega enseguida. No se pide tu nombre, ni tu dirección, ni tu teléfono. Todo es gratis.",
        "help.suggested": "Preguntas frecuentes",
        "help.q1.label": "Se fue la luz, ¿qué hago?",
        "help.q1.question": "Se fue la luz en casa. ¿Qué debo hacer y cómo cargo el móvil?",
        "help.q2.label": "Dificultades en los estudios",
        "help.q2.question": "Mi hijo tiene muchas dificultades en la escuela. ¿Cómo mejorar en casa?",
        "help.q3.label": "Cuidado de mayores",
        "help.q3.question": "Mi padre ya es muy anciano, ¿cómo le cuido?",
        "help.q4.label": "Si hay fuego en casa",
        "help.q4.question": "Si hay fuego en casa de noche, ¿qué hago primero?",
        "home.stepLabel": "Paso",
        "home.step1Title": "Escribe o habla",
        "home.step1Body": "Escribe en español, o pulsa el micrófono y habla. No hace falta nada especial: escribe lo que te venga a la mente.",
        "home.step2Title": "La respuesta llega enseguida",
        "home.step2Body": "Cada pregunta queda registrada y su respuesta llega enseguida. Empieza con una pregunta corta antes de una larga.",
        "home.step3Title": "Sin dinero ni datos personales",
        "home.step3Body": "Este servicio es totalmente gratis. No se pide tu nombre, ni tu dirección, ni tu teléfono, y no se muestran anuncios.",
        "home.chooseTopicNote": "Toca el tema de abajo. La información está en lenguaje sencillo en todas partes.",
        "home.categoryEmpty": "Todavía no se ha escrito nada en este tema.",
        "home.soundIntro": "Sin cuota y sin anuncios. Solo para calmar la mente.",
        "home.dedication1": "En memoria: un servicio totalmente gratuito.",
        "home.dedication2": "Escribe tu problema o habla.",
    },
}


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def set_key(source: str, table: str, key: str, value: str) -> tuple[str, bool]:
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
        return source[: start.end()] + new_body + source[end:], True

    return source[: start.end()] + body.rstrip() + "\n\n  " + line + "\n" + source[end:], False


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()
    count = len(next(iter(T.values())))

    for code, table in TABLES:
        for key, value in T[code].items():
            source, _ = set_key(source, table, key, value)
        print(f"  {table:<10} {count} keys")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)
    print(f"\n{count} keys x {len(TABLES)} languages = {count * len(TABLES)} strings")
    print()
    print("Next, in the same pattern: ref.* (21), support.* (10), reviews.* (23),")
    print("and health.* (72) — which is the tap-to-ask questions left out earlier.")
    print("Run scripts/test-language-switch.py afterwards to see what changed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())