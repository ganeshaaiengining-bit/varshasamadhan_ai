import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

if "'ask.signInTitle'" in text:
    print("already added")
    raise SystemExit(0)

LANGS = 13

T = {
    "ask.signInTitle": [
        "पहले लॉग इन कीजिए",
        "Sign in first",
        "আগে ঢুকুন",
        "முதலில் உள்ளே செல்லுங்கள்",
        "ముందుగా సైన్ ఇన్ చేయండి",
        "आधी लॉगिन करा",
        "પહેલાં લોગઇન કરો",
        "ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ",
        "ആദ്യം ലോഗിൻ ചെയ്യുക",
        "ਪਹਿਲਾਂ ਲੌਗਇਨ ਕਰੋ",
        "پہلے لاگ اِن کریں",
        "سجّل الدخول أولاً",
        "Inicia sesión primero",
    ],
    "ask.signInBody": [
        "सवाल पूछने के लिए अपना खाता बनाइए। इसमें एक मिनट से भी कम लगता है, और आप पूछते रहेंगे।",
        "Make an account to ask a question. It takes under a minute, and then you can keep asking.",
        "প্রশ্ন করতে একটি অ্যাকাউন্ট বানান। এক মিনিটেরও কম লাগে, তারপর আপনি প্রশ্ন করতে পারবেন।",
        "கேள்வி கேட்க ஒரு கணக்கு உருவாக்குங்கள். ஒரு நிமிடத்திற்கும் குறைவுதான், பிறகு கேள்வி கேட்டுக் கொள்ளலாம்.",
        "ప్రశ్నించడానికి ఖాతా సృష్టించండి. ఒక నిమిషంలోపు తక్కువ సమయమే, తర్వాత మీరు ప్రశ్నలు అడగవచ్చు.",
        "प्रश्न विचारण्यासाठी खाते तयार करा. एक मिनिटापेक्षा कमी वेळ लागते, आणि नंतर तुम्ही प्रश्न विचारत रहा.",
        "પ્રશ્ન પૂછવા ખાતું બનાવો. એક મિનિટથી ઓછો વારનો, પછી તમે પ્રશ્નો પૂછતા રહો.",
        "ಪ್ರಶ್ನೆ ಕೇಳಲು ಖಾತೆ ತೆರೆಯಿರಿ. ಒಂದು ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ, ನಂತರ ನೀವು ಪ್ರಶ್ನೆ ಕೇಳುತ್ತಿರಿ.",
        "ചോദ്യങ്ങൾ ചോദിക്കാൻ ഒരു അക്കൗണ്ട് ഉണ്ടാക്കുക. ഒരു മിനിറ്റിൽ താഴെ, ശേഷം നിങ്ങൾ ചോദ്യങ്ങൾ ചോദിക്കാം.",
        "ਸਵਾਲ ਪੁੱਛਣ ਲਈ ਖਾਤਾ ਬਣਾਓ. ਇੱਕ ਮਿੰਟ ਤੋਂ ਵੀ ਘੱਟ, ਫਿਰ ਤੁਸੀਂ ਸਵਾਲ ਪੁੱਛਦੇ ਰਹੋ.",
        "سوال پوچھنے کے لیے اکاؤنٹ بنائیں۔ ایک منٹ سے بھی کم، پھر آپ سوال پوچھتے رہیں۔",
        "أنشئ حسابًا لتسأل سؤالًا. يستغرق أقل من دقيقة، ثم يمكنك مواصلة السؤال.",
        "Crea una cuenta para preguntar. Toma menos de un minuto, y después puedes seguir preguntando.",
    ],
    "ask.signInCta": [
        "खाता बनाइए या लॉग इन कीजिए",
        "Make an account or sign in",
        "অ্যাকাউন্ট করুন বা ঢুকুন",
        "கணக்கு உருவாக்கு அல்லது உள்ளே செல்",
        "ఖాతా సృష్టించండి లేదా సైన్ ఇన్ చేయండి",
        "खाते तयार करा किंवा लॉगिन करा",
        "ખાતું બનાવો અથવા લોગઇન કરો",
        "ಖಾತೆ ತೆರೆಯಿರಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ",
        "അക്കൗണ്ട് ഉണ്ടാക്കുക അല്ലെങ്കിൽ സൈൻ ഇൻ ചെയ്യുക",
        "ਖਾਤਾ ਬਣਾਓ ਜਾਂ ਲੌਗਇਨ ਕਰੋ",
        "اکاؤنٹ بنائیں یا لاگ اِن کریں",
        "أنشئ حسابًا أو سجّل الدخول",
        "Crear cuenta o iniciar sesión",
    ],
    "ask.signInOr": [
        "अभी खाता नहीं बना सकते? ये काम भी आपके बिना हो जाएगा:",
        "Cannot make an account now? These work without one:",
        "এখন অ্যাকাউন্ট বানানো যাচ্ছে না? এগুলো অ্যাকাউন্ট ছাড়াই কাজ করে:",
        "இப்போது கணக்கு உருவாக்க முடியவில்லையா? இவை கணக்கு இல்லாமலும் வேலை செய்கின்றன:",
        "ఇప్పుడు ఖాతా సృష్టించలేకపోతున్నారా? ఇవి ఖాతా లేకుండానే పనిచేస్తాయి:",
        "आता खाते तयार करता येत नाही? हे खात्याशिवायही चालतात:",
        "હાલ ખાતું બનાવી શકતા નથી? આ ખાતા વગર પણ કામ કરે છે:",
        "ಈಗ ಖಾತೆ ತೆರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲವೇ? ಇವು ಖಾತೆಯಿಲ್ಲದೆಯೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ:",
        "ഇപ്പോൾ അക്കൗണ്ട് ഉണ്ടാക്കാമോ? ഇവ അക്കൗണ്ടില്ലാതെയും പ്രവർത്തിക്കും:",
        "ਹੁਣ ਖਾਤਾ ਬਣਾਇਆ ਨਹੀਂ ਜਾ ਸਕਦੇ? ਇਹ ਬਿਨਾਂ ਖਾਤੇ ਵੀ ਕੰਮ ਕਰਦੇ ਹਨ:",
        "ابھی اکاؤنٹ نہیں بن سکتے؟ یہ اکاؤنٹ کے بغیر بھی کام کرتے ہیں:",
        "لا تستطيع إنشاء حساب الآن؟ هذه تعمل بدون حساب:",
        "¿No puedes crear una cuenta ahora? Esto funciona sin ella:",
    ],
}


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


for key, values in T.items():
    if len(values) != LANGS:
        raise SystemExit(f"{key}: {len(values)} values, expected {LANGS}")

out = []
cursor = 0
count = 0

while count < LANGS:
    at = text.find("'lib.legal'", cursor)
    if at < 0:
        out.append(text[cursor:])
        break

    end = text.find("\n", at)
    end = len(text) if end < 0 else end + 1

    out.append(text[cursor:end])

    lines = []
    for key, values in T.items():
        lines.append("  '%s': '%s'," % (key, escape(values[count])))
    out.append("\n".join(lines) + "\n")

    cursor = end
    count += 1

out.append(text[cursor:])

if count != LANGS:
    raise SystemExit(f"found {count} tables, expected {LANGS}")

io.open(PATH, "w", encoding="utf-8", newline="\n").write("".join(out))

print()
print("Added %d sign-in gate keys to %d tables" % (len(T), count))
print()
for key in T:
    print("  " + key)