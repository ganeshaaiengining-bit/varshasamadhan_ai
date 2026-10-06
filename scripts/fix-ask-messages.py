"""
Stop telling visitors to press the ask button again when pressing it cannot help.

    python scripts/fix-ask-messages.py

Two changes across all thirteen language tables:

1. `ask.notAnswer` said, in every language, "no answer found — press the ask
   button again". That was the message behind the reported symptom: the same
   sentence on every question, forever. It was true only of a question the model
   refused to answer. The same key was also used when no API key was configured,
   where retrying is guaranteed to fail — the visitor was being told to do the one
   thing that could not work.

   The key now says only what is true in both cases: we do not have a direct
   answer. No instruction to retry.

2. `ask.notConfigured` is new, for the missing-key case alone, so the owner can
   tell "the library has no entry for this" apart from "the AI is not switched
   on". The wording stays visitor-facing and does not name the missing setting.

Reworded rather than deleted everywhere: `ask.notAnswer` already had a real
translation in each language, and falling back to English would put English on
pages that are otherwise entirely Tamil or Bengali.

Run once. Both keys are replaced in place.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

NOT_ANSWER = {
    "hi": "इस सवाल का सीधा जवाब हमारे पास नहीं है।",
    "en": "We do not have a direct answer to this question.",
    "bn": "এই প্রশ্নের সরাসরি উত্তর আমাদের কাছে নেই।",
    "ta": "இந்தக் கேள்விக்கு நேரடி பதில் எங்களிடம் இல்லை.",
    "te": "ఈ ప్రశ్నకు నేరుగా సమాధానం మేము వద్ద లేదు.",
    "mr": "या प्रश्नाचे थेट उत्तर आमच्याकडे नाही.",
    "gu": "આ પ્રશ્નનું સીધું જવાબ અમારે પાસે નથી.",
    "kn": "ಈ ಪ್ರಶ್ನೆಗೆ ನೇರ ಉತ್ತರ ನಮ್ಮ ಬಳಿ ಇಲ್ಲ.",
    "ml": "ഈ ചോദ്യത്തിന് നേരിട്ട ഉത്തരം ഞങ്ങളുടെ കയ്യിൽ ഇല്ല.",
    "pa": "ਇਸ ਸਵਾਲ ਦਾ ਸਿੱਧਾ ਜਵਾਬ ਸਾਡੇ ਕੋਲ ਨਹੀਂ ਹੈ।",
    "ur": "اس سوال کا براہِ راست جواب ہمارے پاس نہیں ہے۔",
    "ar": "ليس لدينا جواب مباشر عن هذا السؤال.",
    "es": "No tenemos una respuesta directa a esta pregunta.",
}

NOT_CONFIGURED = {
    "hi": "यह सेवा अभी अपने पुराने जवाबों के बंद दराज़ से जवाब दे रही है। आपका सवाल उसमें नहीं मिला।",
    "en": "This service is answering from its saved library for now. Your question was not in it.",
    "bn": "এই সেবাটি এখন সংরক্ষিত উত্তরের ভাণ্ডার থেকে উত্তর দিচ্ছে। আপনার প্রশ্ন সেখানে ছিল না।",
    "ta": "இந்தச் சேவை இப்போது சேமித்த பதிவுகளிலிருந்து பதிலளிக்கிறது. உங்கள் கேள்வி அதில் இல்லை.",
    "te": "ఈ సేవ ఇప్పుడు సేవ్ చేసిన సమాధానాల కోస్తం నుండి సమాధానమిస్తోంది. మీ ప్రశ్న దానిలో లేదు.",
    "mr": "ही सेवा सध्या जतन केलेल्या उत्तरांच्या संग्रहातून उत्तर देत आहे. तुमचा प्रश्न त्यात नाही.",
    "gu": "આ સેવા હાલ સચવાયેલા જવાબોના ભંડોળમાંથી જવાબ આપી રહી છે. તમારો પ્રશ્ન તેમાં નથી.",
    "kn": "ಈ ಸೇವೆ ಈಗ ಉಳಿಸಿದ ಉತ್ತರಗಳ ದಾಸ್ತಾನದಿಂದ ಉತ್ತರಿಸುತ್ತಿದೆ. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅದರಲ್ಲಿ ಇಲ್ಲ.",
    "ml": "ഈ സേവനം ഇപ്പോൾ സംരക്ഷിച്ച ഉത്തരങ്ങളുടെ ആക്കെയിൽ നിന്ന് ഉത്തരിക്കുന്നു. നിങ്ങളുടെ ചോദ്യം അതിൽ ഇല്ല.",
    "pa": "ਇਹ ਸੇਵਾ ਹਾਲੇ ਸੰਭਾਲੀਆਂ ਜਵਾਬਾਂ ਦੇ ਭੰਡਾਰ ਤੋਂ ਜਵਾਬ ਦੇ ਰਹੀ ਹੈ। ਤੁਹਾਡਾ ਸਵਾਲ ਉਸਮੇਂ ਨਹੀਂ ਮਿਲਿਆ।",
    "ur": "یہ خدمت اِس وقت محفوظ جوابات کے ذخیرے سے جواب دے رہی ہے۔ آپ کا سوال اس میں نہیں ملا۔",
    "ar": "تخدم هذه الخدمة حالياً من مكتبتها المحفوظة. لم يظهر سؤالك فيها.",
    "es": "Este servicio responde ahora desde su biblioteca guardada. Tu pregunta no estaba en ella.",
}

TABLES = [
    "HINDI", "ENGLISH", "BENGALI", "TAMIL", "TELUGU", "MARATHI", "GUJARATI",
    "KANNADA", "MALAYALAM", "PUNJABI", "URDU", "ARABIC", "SPANISH",
]
CODES = ["hi", "en", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "ar", "es"]


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def replace_key(source: str, table: str, key: str, value: str) -> tuple[str, bool]:
    """Set one key inside one table. Returns whether the key already existed."""
    start = re.search(r"const " + table + r"[^=]*=\s*\{", source)
    if not start:
        raise SystemExit(f"table {table} not found")

    end = source.index("\n};", start.end())
    body = source[start.end() : end]

    pattern = re.compile(r"( *)'" + re.escape(key) + r"':\s*'(?:[^'\\]|\\.)*',")
    line = f"'{key}': '{esc(value)}',"

    if pattern.search(body):
        new_body, count = pattern.subn(lambda m: m.group(1) + line, body)
        if count != 1:
            raise SystemExit(f"{table}.{key} appeared {count} times — expected once")
        return source[: start.end()] + new_body + source[end:], True

    # New key: append before the closing brace with a one-space indent.
    indent = "  "
    new_body = body.rstrip() + "\n\n" + indent + line + "\n"
    return source[: start.end()] + new_body + source[end:], False


def main() -> int:
    source = io.open(FILE, encoding="utf-8").read()

    added = 0
    for table, code in zip(TABLES, CODES):
        source, had_not_answer = replace_key(source, table, "ask.notAnswer", NOT_ANSWER[code])
        source, had_not_configured = replace_key(
            source, table, "ask.notConfigured", NOT_CONFIGURED[code]
        )
        added += 0 if had_not_configured else 1
        print(f"  {table:<10} notAnswer {'rewritten' if had_not_answer else 'NOT FOUND'}   "
              f"notConfigured {'added' if not had_not_configured else 'already present'}")

    io.open(FILE, "w", encoding="utf-8", newline="\n").write(source)

    print()
    print(f"updated {len(TABLES)} tables, {added} new keys")
    print()
    print("The retry instruction is gone from every language. ask.notConfigured now")
    print("distinguishes 'the library has no entry for this' from 'the AI is off', so")
    print("the admin panel can tell the owner which one it is.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())