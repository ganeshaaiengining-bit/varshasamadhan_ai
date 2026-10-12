"""
Does the site actually answer? Measured, not assumed.

    python scripts/test-ai-live.py

The owner asked for "any question must get an answer from the AI", and got a
first answer after five days. Before reporting that as working, it should be
measured — because a provider that answers half the time is a different thing
from one that answers every time, and the difference is the whole question.

Checked in both directions, because both failures matter:

  1. Does *any* question come back with an answer at all?
  2. Does the answer come back in the visitor's own script? An answer in the
     right words but Latin letters is not an answer to someone who reads
     Devanagari, and it is exactly what a small model does when it is unsure.
  3. How long does it take? A help site that takes half a minute is one people
     stop coming back to.

The result decides whether to keep spending time on a local model or tell the
owner plainly where this stands.
"""

import io
import json
import statistics
import sys
import time
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:3001/api/ask"

# (language, script name, unicode range, question)
SCRIPTS = {
    "devanagari": (0x0900, 0x097F),
    "tamil": (0x0B80, 0x0BFF),
    "bengali": (0x0980, 0x09FF),
    "arabic": (0x0600, 0x06FF),
}

CASES = [
    ("hi", "devanagari", "मेरी उम्र 54 साल है और पीठ में दर्द है, क्या करूँ?"),
    ("hi", "devanagari", "छोटे बच्चे को खाना नहीं खा रहा, क्या करूँ?"),
    ("mr", "devanagari", "माझ्या घरातून दुर्गंध येते आहे, काय करावे?"),
    ("bn", "bengali", "আমার ছেলে পড়াশোনা করতে চায় না, কী করব?"),
    ("ta", "tamil", "என் மகன் படிக்க மறுக்கிறான், நான் என்ன செய்வது?"),
    ("ur", "arabic", "میرے گھر کے لوگ لڑ رہے ہیں، کیا کروں؟"),
]


def ask(language: str, question: str) -> dict:
    payload = json.dumps({"question": question, "lang": language}).encode("utf-8")
    request = urllib.request.Request(URL, data=payload, method="POST")
    request.add_header("content-type", "application/json")

    started = time.time()
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            data = json.loads(response.read())
            data["_ms"] = (time.time() - started) * 1000
            return data
    except Exception as error:  # noqa: BLE001
        return {"ok": False, "_error": str(error)[:70], "_ms": (time.time() - started) * 1000}


def in_script(text: str, script: str) -> bool:
    low, high = SCRIPTS[script]
    return sum(1 for ch in text if low <= ord(ch) <= high) > 10


def main() -> int:
    print("Har bhasha me ek asli sawaal, poora round trip.\n")

    answered = 0
    correct_script = 0
    times: list[float] = []
    providers: dict[str, int] = {}

    for language, script, question in CASES:
        data = ask(language, question)

        if data.get("ok") and data.get("answer"):
            answer = data["answer"]
            provider = data.get("provider", "?")
            providers[provider] = providers.get(provider, 0) + 1
            good = in_script(answer, script)
            answered += 1
            correct_script += 1 if good else 0
            ms = data["_ms"]
            times.append(ms)

            print(f"  {language}  {ms / 1000:5.1f}s  {provider:<12} "
                  f"{'script OK' if good else 'WRONG SCRIPT'}")
            print(f"      {answer[:110].replace(chr(10), ' ')}")
        else:
            print(f"  {language}  {data['_ms'] / 1000:5.1f}s  NO ANSWER "
                  f"({data.get('reasonKey') or data.get('_error')})")

        time.sleep(2)

    total = len(CASES)
    print()
    print(f"  answered      {answered}/{total}  ({answered / total * 100:.0f}%)")
    print(f"  own script    {correct_script}/{answered}" if answered else "  own script    -")
    print(f"  median time   {statistics.median(times) / 1000:.1f}s" if times else "  median time   -")
    print(f"  providers     {providers or '-'}")
    print()

    if answered == total and correct_script == answered:
        print("Har sawaal ka jawaab mila, apni bhasha me. Kaam ho gaya.")
        return 0

    print("Poora nahi. Jo bacha hai wo seedha batana padega — aadha jawaab")
    print("dena behtar hai chup rehne se, lekin poora kaam ka dawa karne se bhi")
    print("behtar hai. Local model install karne se ye number sudhrega.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())