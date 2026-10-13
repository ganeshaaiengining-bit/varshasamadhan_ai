import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/free-library.ts"
text = io.open(PATH, encoding="utf-8").read()

if "shareKey" in text:
    print("already patched")
    raise SystemExit(0)

# ── What this changes ────────────────────────────────────────────────────────
#
# The licence sentence under every book card was a hardcoded Roman-Hindi string
# in this file. It is the one piece of the library page that repeats on every
# card, so a Bengali or Tamil visitor saw their own language above it and then
# "Padhna free hai. Copy karke aage dena kisi aur ke condition par hai." right
# underneath, which is the text the page exists to replace.
#
# A shared string also has no business being one: it appears under every card,
# so a visitor sees the same sentence dozens of times. Making it a key means it
# can be said once, in their language, and said properly.
#
# The book titles and descriptions stay as they are for now. They are thirty
# entries and each names a specific resource in a specific language, so they
# need translating individually rather than mechanically — see the note left
# above ENTRIES.

SHARES = {
    "ccBy": [
        "आप इसे कॉपी और शेयर कर सकते हैं, छाप भी सकते हैं — बस स्रोत का नाम देना होगा।",
        "You may copy, share and print it, provided you credit the source.",
        "আপনি কপি, শেয়ার ও ছাপ করতে পারেন — উৎসের নাম দিতে হবে।",
        "நீங்கள் நகலெடுத்து பகிரலாம் அல்லது அச்சிடலாம் — மூலத்தைக் குறிப்பிட வேண்டும்.",
        "మీరు కాపీ చేసి, పంచుకోవచ్చు, ముద్రించవచ్చు — మూలాన్ని పేర్కొనాలి.",
        "तुम्ही कॉपी, शेअर आणि छापू शकता — स्रोताचे नाव सांगितले पाहिजे.",
        "તમે કૉપિ, શેર અને છાપી શકો — સ્રોતનું નામ આપવું પડશે.",
        "ನೀವು ನಕಲಿಸಿ, ಹಂಚಿಕೊಳ್ಳಬಹುದು, ಮುದ್ರಿಸಬಹುದು — ಮೂಲದ ಹೆಸರು ಹೇಳಬೇಕು.",
        "നിങ്ങൾക്ക് പകർത്തിയെടുക്കാം, പങ്കിടാം, അച്ചടിക്കാം — ഉറവിന്റെ പേര് പറയണം.",
        "ਤੁਸੀਂ ਕਾਪੀ ਕਰ ਸਕਦੇ ਹੋ, ਸਾਂਝਾ ਸਕਦੇ ਹੋ, ਛਾਪ ਸਕਦੇ ਹੋ — ਸਰੋਤ ਦਾ ਨਾਮ ਦੱਸਣਾ ਹੈ।",
        "آپ اسے نقل، شیئر اور چھاپ سکتے ہیں — ماخذ کا نام دینا ہوگا۔",
        "يمكنك نسخها ومشاركتها وطباعتها بشرط ذكر المصدر.",
        "Puedes copiarla, compartirla e imprimirla citando la fuente.",
    ],
    "ccBySa": [
        "आप इसे कॉपी और छाप सकते हैं। जो बदलाव करेंगे, वे भी खुल कर देना होगा।",
        "You may copy and print it. Any change you make must also be shared openly.",
        "আপনি কপি ও ছাপ করতে পারেন। যে পরিবর্তন করবেন, সেটিও খোলা করে দিতে হবে।",
        "நகலெடுத்து அச்சிடலாம். செய்த மாற்றங்களையும் திறந்து பகிர வேண்டும்.",
        "కాపీ చేసి ముద్రించవచ్చు. చేసిన మార్పులను కూడా తెరిచి పంచాలి.",
        "तुम्ही कॉपी आणि छापू शकता. केलेले बदलही उघडेपणे द्यायला हवेत.",
        "તમે કૉપિ અને છાપી શકો. કરેલા ફેરફાર પણ ખુલ્લા કરી શેર કરવા પડશે.",
        "ನೀವು ನಕಲಿಸಿ ಮುದ್ರಿಸಬಹುದು. ಮಾಡಿದ ಬದಲಾವಣೆಗಳನ್ನೂ ತೆರೆದು ಹಂಚಬೇಕು.",
        "പകർത്തിയെടുക്കാം, അച്ചടിക്കാം. വരുത്തിയ മാറ്റങ്ങളും തുറന്ന് പങ്കിടണം.",
        "ਤੁਸੀਂ ਕਾਪੀ ਕਰ ਸਕਦੇ ਹੋ, ਛਾਪ ਸਕਦੇ ਹੋ। ਕੀਤੇ ਤਬਦੀਲੀਆਂ ਵੀ ਖੁੱਲ੍ਹੀ ਕਰ ਦੇਣੀਆਂ ਲੱਗਦੀਆਂ ਹਨ।",
        "اسے نقل اور چھاپا جا سکتا ہے۔ کی گئی تبدیلیاں بھی کھل کر دینی ہوں گی۔",
        "Puedes copiarla e imprimirla. Tus cambios deben compartirse también de forma abierta.",
        "Puedes copiarla e imprimirla. Tus cambios deben compartirse igualmente.",
    ],
    "ccZero": [
        "पूरी तरह मुफ़्त। स्रोत का नाम देना भी ज़रूरी नहीं।",
        "Entirely free. Not even a credit is required.",
        "সম্পূর্ণ বিনামূল্যে। উৎসের নামও দিতে হবে না।",
        "முற்றிலும் இலவசம். ஆதாரம் கூற வேண்டியதில்லை.",
        "పూర్తిగా ఉచితం. మూలాన్ని పేర్కొనాల్సిన అవసరం లేదు.",
        "पूर्णपणे मोफत. स्रोताचे नाव सांगण्याची गरज नाही.",
        "સંપૂર્ણ મફત. સ્રોતનું નામ આપવાની જરૂર નથી.",
        "ಸಂಪೂರ್ಣ ಉಚಿತ. ಮೂಲದ ಹೆಸರು ಕೊಡುವ ಅಗತ್ಯವಿಲ್ಲ.",
        "പൂർണ്ണമായി സൗജന്യം. ഉറവും പറയണമെന്നില്ല.",
        "ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ। ਸਰੋਤ ਦਾ ਨਾਮ ਦੱਸਣਾ ਵੀ ਲੋੜੀਂਦਾ ਨਹੀਂ।",
        "مکمل طور پر مفت۔ ذریعہ کا نام دینا بھی لازم نہیں۔",
        "Totalmente libre. Ni siquiera hace falta atribuir la fuente.",
        "Totalmente libre. Ni siquiera se necesita citar la fuente.",
    ],
    "pd": [
        "किसी का कॉपीराइट नहीं — जो चाहे कॉपी कर सकते हैं।",
        "Nobody holds the copyright — copy it freely.",
        "এর কোনো কপিরাইট নেই — যা খুশি কপি করুন।",
        "இதற்கு பொறுப்புடைய அண்டர் இல்லை — நீங்கள் விரும்பியபடி நகலெடுக்கலாம்.",
        "దీనికి కాపీరైట్ లేదు — ఇష్టమేను కాపీ చేయవచ్చు.",
        "याचे कोणाचेही कॉपीराइट नाही — हवे तसे कॉपी करा.",
        "આનું કોઈનું કોપીરાઇટ નથી — ઇચ્છા મુજબ કૉપિ કરો.",
        "ಇದಕ್ಕೆ ಯಾರದೂ ಕಾಪಿರೈಟ್ ಇಲ್ಲ — ಬೇಕಾದರೆ ನಕಲಿಸಿ.",
        "ഇതിന് കോപ്പിറൈറ്റ് ആരുടെയുമില്ല — ഇഷ്ടമുന്നതുകൊണ്ട് പകർത്താം.",
        "ਇਸ ਦਾ ਕੋਈ ਕਾਪੀਰਾਈਟ ਨਹੀਂ — ਜਿਵੇਂ ਮਰਜ਼ੀ ਕਾਪੀ ਕਰੋ।",
        "اس کا کوئی کاپی رائٹ نہیں — جو چاہیۺ کاپی کریں۔",
        "Nadie tiene los derechos de autor: cópiala libremente.",
        "Nadie tiene los derechos: cópiala libremente.",
    ],
    "govtIndia": [
        "भारत सरकार की वेबसाइट पर। पढ़ना और छापना दोनों मुफ़्त।",
        "On a Government of India website. Reading and printing are both free.",
        "ভারত সরকারের ওয়েবসাইটে। পড়া ও ছাপা দুটোই বিনামূল্যে।",
        "இந்திய அரசு வலதசாலையில். படித்தலும் அச்சித்தலும் இரண்டும் இலவசம்.",
        "భారత ప్రభుత్వ వెబ్‌సైట్‌లో. చదవడం, ముద్రించడం రెండూ ఉచితం.",
        "भारत सरकारच्या संकेतस्थळावर. वाचणे आणि छापणे दोन्ही मोफत.",
        "ભારત સરકારની વેબસાઇટ પર. વાંચવું અને છાપવું બંને મફત.",
        "ಭಾರತ ಸರ್ಕಾರದ ಜಾಲದಲ್ಲಿ. ಓದುವುದು ಮತ್ತು ಮುದ್ರಿಸುವುದು ಎರಡೂ ಉಚಿತ.",
        "ഇന്ത്യൻ സർക്കാർ വെബ്സൈറ്റിൽ. വായന്നുവയും അച്ചടിക്കുന്നും രണ്ടും സൗജന്യം.",
        "ਭਾਰਤ ਸਰਕਾਰ ਦੀ ਵੈੱਬਸਾਈਟ 'ਤੇ। ਪੜ੍ਹਨਾ ਅਤੇ ਛਾਪਣਾ ਦੋਵੇਂ ਮੁਫ਼ਤ।",
        "بھارتی سرکٹر کی ویب سائٹ پر۔ پڑھنا اور چھپانا دونوں مفت ہیں۔",
        "En un sitio del Gobierno de la India. Leer e imprimir son gratis.",
        "En un sitio del Gobierno de la India. Leer e imprimir es gratis.",
    ],
    "creativeCommons": [
        "हर फ़ाइल का अपना लाइसेंस है — फ़ाइल पर देखिए।",
        "Each file has its own licence — look at the file.",
        "প্রতিটি ফাইলের নিজস্ব লাইসেন্স আছে — ফাইলে দেখুন।",
        "ஒவ்வொரு கோப்புக்கும் தனி உரிமம் உண்டு — கோப்பைப் பாருங்கள்.",
        "ప్రతి ఫైల్‌కు దాని లైసెన్స్ ఉంది — ఫైల్ చూడండి.",
        "प्रत्येक फाइलचा स्वतःचा परवाना आहे — फाइल पहा.",
        "દરેક ફાઇલનો પોતાનો લાઇસન્સ છે — ફાઇલ જુઓ.",
        "ಪ್ರತಿ ಕಡತಕ್ಕೂ ತನ್ನದೇ ಪರವಾನಗಿ ಇದೆ — ಕಡತ ನೋಡಿ.",
        "ഓരോ ഫയലിനും സ്വന്തം ലൈസൻസ് ഉണ്ട് — ഫയൽ നോക്കുക.",
        "ਹਰ ਫ਼ਾਈਲ ਦਾ ਆਪਣਾ ਲਾਇਸੰਸ ਹੈ — ਫ਼ਾਈਲ ਵੇਖੋ।",
        "ہر فائل کا اپنا لائسنس ہے — فائل دیکھیں۔",
        "Cada archivo tiene su propia licencia: mira el archivo.",
        "Cada archivo tiene su propia licencia: míralo.",
    ],
    "freeToRead": [
        "पढ़ना मुफ़्त है। कॉपी करके आगे देना भी उसी शर्त पर है जिस पर यह मिला।",
        "Free to read. Passing it on is allowed on the same terms it came with.",
        "পড়া বিনামূল্যে। অন্যকে দেওয়াও একই শর্তে করা যাবে, যেই শর্তে এসেছে।",
        "படிப்பது இலவசம். மற்றொருவருக்குக் கொடுப்பதும் அது கிடைத்த அதே நிபந்தனையில்.",
        "చదవడం ఉచితం. ఇతరులకు ఇవ్వడం దాని పొందిన షరతుల్లోనే సాధ్యం.",
        "वाचणे मोफत. पुढे देणेही त्याच नियमांनुसारच शक्य आहे.",
        "વાંચવું મફત. આગળ આપવું પણ એ જ નિયમો પ્રમાણે જ શક્ય છે.",
        "ಓದುವುದು ಉಚಿತ. ಮುಂದಿಗೆ ಕೊಡುವುದೂ ಅದೇ ನಿಯಮಗಳ ಪ್ರಕಾರವೇ ಸಾಧ್ಯ.",
        "വായന്നുവുന്നത് സൗജന്യം. മറ്റൊരാൾക്ക് പങ്കിടുന്നതും അതേ നിബന്ധനകളിൽ.",
        "ਪੜ੍ਹਨਾ ਮੁਫ਼ਤ। ਅੱਗੇ ਦੇਣਾ ਵੀ ਉਸੇ ਹੀ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ ਹੈ।",
        "پڑھنا مفت ہے۔ آگے دینا بھی اُسی شرط کے تحت ہے۔",
        "Leer es gratis. Compartirlo se permite en los mismos términos.",
        "Leer es gratis. Se puede compartir en los mismos términos.",
    ],
}

# Turn `shares: '...'` into `shareKey: 'lib.licence.ccBy'`, one per licence.
for name in SHARES:
    pattern = re.compile(
        r"(\b" + name + r":\s*\{[^}]*?)\bshares:\s*'(?:[^'\\]|\\.)*'", re.S
    )
    text, count = pattern.subn(
        lambda m: m.group(1) + "shareKey: 'lib.licence.%s'" % name, text
    )
    if count != 1:
        raise SystemExit(f"{name}: matched {count} times, expected 1")

io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

print()
print("free-library.ts: %d licences now carry a translation key" % len(SHARES))
print()

# Emit the i18n lines so they can be pasted into a batch script.
import json

path = "scripts/_lib-i18n.json"
io.open(path, "w", encoding="utf-8", newline="\n").write(
    json.dumps({"lib.licence." + k: v for k, v in SHARES.items()},
               ensure_ascii=False, indent=2)
)
print("wrote " + path)
for k, v in SHARES.items():
    print("  lib.licence.%-18s %d languages" % (k, len(v)))