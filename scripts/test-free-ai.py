"""
Does a free, key-free AI actually work well enough to answer on this site?

    python scripts/test-free-ai.py

Asked before the Gemini key arrived, because the owner was stuck at a Google
login and pasting the wrong key a third time. If a key-free service can carry the
site, the key stops being the thing standing between them and a working website.

Answer so far: partly. Two models answer, the rest return 402. So the questions
that matter are not "does it work once" but:

  1. Does it work *again* — what fraction of calls come back empty or paid-up?
  2. Does it answer in the visitor's own script, not Roman letters? A Tamil
     visitor getting Devanagari or Latin script has not been answered.
  3. How long does it take? A help site that takes 40 seconds is not used.
  4. Does it follow the instruction about *what kind* of question it is?
     Asked about Kundalini awakening, one model answered with astrology, which is
     the exact confusion the owner already had to correct once.

Only a real, repeated measurement answers that. Run it when the network is calm.
"""

import io
import json
import statistics
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)

# Each case: language, a question, and the script it must come back in.
# `roman_ok` is false where Latin letters are a failure even if the words are
# right — a Hindi answer in Roman letters is not readable by the people this
# site is for.
CASES = [
    ("hi", "मेरे 8 महीने के बच्चे को तेज बुखार है। मुझे क्या करना चाहिए? 3 बातें बताइए।", "देवनागरी"),
    ("mr", "माझ्या ५४ वर्षाच्या पीठ दुखते आहे. काय करावे? ३ गोष्टी सांगा.", "देवनागरी"),
    ("ta", "என் 8 மாத குழந்தைக்கு காய்ச்சல் அதிகம். நான் என்ன செய்வது? 3 விஷயங்கள் சொல்லுங்கள்.", "தமிழ்"),
    ("bn", "আমার ৮ মাসের শিশুর জ্বর বেশি। আমি কী করব? ৩টি কথা বলুন।", "বাংলা"),
    ("ur", "میرے 8 ماہ کے بچے کو شدید بخار ہے۔ میں کیا کروں؟ 3 باتیں بتائیں۔", "اردو"),
]

# A range per script, used to decide whether an answer came back in it.
SCRIPTS = {
    "देवनागरी": (0x0900, 0x097F),
    "தமிழ்": (0x0B80, 0x0BFF),
    "বাংলা": (0x0980, 0x09FF),
    "اردو": (0x0600, 0x06FF),
}

MODELS = ["openai", "mpt"]
ROUNDS = 2
GAP = 4  # seconds between calls; hammering a free endpoint gets you 402


def ask(model: str, question: str) -> tuple[str, float] | None:
    prompt = (
        question
        + "\n\n"
        + "Answer only in the language and script of the question. "
        + "Do not reply in any other language. "
        + "Do not write in Roman letters. Be plain and short."
    )
    url = "https://text.pollinations.ai/" + urllib.parse.quote(prompt) + "?model=" + model

    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/plain"})
    start = time.time()
    try:
        with urllib.request.urlopen(request, timeout=70) as response:
            return response.read().decode("utf-8", "replace"), time.time() - start
    except urllib.error.HTTPError as error:
        print(f"        HTTP {error.code}")
        return None
    except Exception as error:  # noqa: BLE001
        print(f"        {str(error)[:70]}")
        return None


def in_script(text: str, script: str) -> bool:
    low, high = SCRIPTS[script]
    hits = sum(1 for ch in text if low <= ord(ch) <= high)
    return hits > 20


def main() -> int:
    for model in MODELS:
        ok = 0
        total = 0
        right_script = 0
        times: list[float] = []

        print(f"=== model: {model} ===")
        for _ in range(ROUNDS):
            for language, question, script in CASES:
                total += 1
                result = ask(model, question)
                if result is None:
                    print(f"  {language}  FAILED")
                else:
                    text, seconds = result
                    times.append(seconds)
                    ok += 1
                    correct = in_script(text, script)
                    right_script += 1 if correct else 0
                    print(f"  {language}  {seconds:5.1f}s  {len(text):4d} ch  "
                          f"{'script OK' if correct else 'WRONG SCRIPT'}")
                time.sleep(GAP)
            print()

        rate = 100 * ok / total if total else 0
        script_rate = 100 * right_script / ok if ok else 0
        median = statistics.median(times) if times else 0

        print(f"  answered      {ok}/{total}  ({rate:.0f}%)")
        print(f"  own script    {right_script}/{ok}  ({script_rate:.0f}%)")
        print(f"  median time   {median:.1f}s")
        print()

    print("A verdict of 'answered 100%, own script 100%, under 20s' would mean this")
    print("can carry the site without a key. Anything less and it becomes a")
    print("stopgap, not an answer — a help site that sometimes works is worse than")
    print("one that plainly does not, because people keep coming back to it.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())