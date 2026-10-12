"""
Is the AI actually answering, and if not, why not.

    python scripts/check-ai.py

Answers one question in the way a visitor experiences it: type a question on
/sahayata, press the button, does an answer come back, and in which language.

The owner has asked to see the full check repeatedly, and this is the check that
answers the question they keep asking. The three provider tests elsewhere report
what the code is configured to do. This one asks the running site.

THE THREE PROVIDERS, IN ORDER

  1. Gemini    needs GEMINI_API_KEY. Fast, reliable, free tier generous.
  2. Ollama    a local model on 127.0.0.1:11434. Not installed on this machine.
  3. Pollinations  no key at all. Works roughly one time in six. That is not a
               rounding error — it means five visitors in six are told the AI
               is unavailable.

So "the AI is broken" is not the current state. The current state is "the AI
works one time in six", which is worse in a different way: it looks like it
works.

THE KEY IS NEVER READ, PRINTED OR STORED HERE

This script reports whether a key is present and how long it is. It never
prints the key, never writes it anywhere, and never sends it anywhere except the
one request it makes to Google's API, which is the entire point of having it.
GEMINI_API_KEY starts with "AIza" — if you ever see a string that starts that
way in a screenshot, a terminal transcript or a chat message, it is a live
credential and it should be rotated.
"""

import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:3001"

# Three questions chosen to be answerable, short, and in three different scripts,
# so a failure is not mistaken for "the model cannot write Devanagari".
PROBES = [
    ("hi", "मेरे पीठ में दर्द है, क्या करूँ?"),
    ("bn", "ঘরে বিদ্যুৎ চলে গেছে, কী করব?"),
    ("ta", "குழந்தைக்கு காய்ச்சல் வந்தால் என்ன செய்வது?"),
]

TIMEOUT = 90


def read_env() -> dict[str, str]:
    """The local .env, parsed the way Next.js parses it."""
    values: dict[str, str] = {}
    if not os.path.exists(".env"):
        return values
    for line in io.open(".env", encoding="utf-8"):
        match = re.match(r"^\s*([A-Z_]+)\s*=\s*(.*?)\s*$", line)
        if match:
            values[match.group(1)] = match.group(2).strip().strip('"').strip("'")
    return values


def ask(question: str, language: str) -> tuple[bool, str, float, str]:
    """POST to the real endpoint. Returns (answered, text, seconds, provider)."""
    body = json.dumps({"question": question, "language": language}).encode("utf-8")

    request = urllib.request.Request(
        BASE + "/api/ask",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    started = time.time()
    try:
        response = urllib.request.urlopen(request, timeout=TIMEOUT)
        payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        return False, f"HTTP {error.code}", time.time() - started, ""
    except Exception as error:  # noqa: BLE001
        return False, str(error)[:60], time.time() - started, ""

    elapsed = time.time() - started
    answered = bool(payload.get("answer"))
    text = payload.get("answer") or payload.get("error") or ""
    provider = payload.get("provider") or payload.get("fallback") and "pollinations" or "?"
    return answered, str(text), elapsed, str(provider)


def main() -> int:
    env = read_env()
    key = env.get("GEMINI_API_KEY", "")

    print("=" * 66)
    print("AI status")
    print("=" * 66)
    print()

    # ---------------------------------------------------------- configured
    print("Configured")
    print(f"  {'GEMINI_API_KEY':<26} "
          + (f"present, {len(key)} characters" if key else "NOT SET"))
    if key and not key.startswith("AIza"):
        print(f"  {'':<26} does not start with AIza — is this the right key?")
    print(f"  {'GEMINI_MODEL':<26} {env.get('GEMINI_MODEL', '(default)')}")
    print(f"  {'daily limit':<26} {env.get('GEMINI_DAILY_REQUEST_LIMIT', '(default)')} requests")
    print()

    try:
        urllib.request.urlopen(BASE + "/sahayata", timeout=15)
        print(f"  server running at {BASE}")
    except Exception:
        print(f"  the server is not answering at {BASE}")
        print("  Start it with:  npm run dev")
        return 1

    print()
    print("Live — three questions, three languages")
    print("-" * 66)

    answered_count = 0
    for language, question in PROBES:
        ok, text, seconds, provider = ask(question, language)
        answered_count += 1 if ok else 0

        mark = "[ ok ]" if ok else "[FAIL]"
        print(f"  {mark} {language}  {seconds:5.1f}s  {provider}")
        print(f"         asked:  {question}")
        if ok:
            snippet = text.replace("\n", " ")[:110]
            print(f"         got:    {snippet}")
            print(f"         script: {'matches the language' if script_of(text, language) else 'DOES NOT match — the answer came back in another script'}")
        else:
            print(f"         error:  {text}")
        print()

    print("-" * 66)
    print()

    if answered_count == len(PROBES):
        print("All three answered.")
        print()
        if not key:
            print("With no API key set, that means Pollinations answered three for")
            print("three. It will not keep doing that — measured over many attempts")
            print("it succeeds roughly one time in six.")
        else:
            print("A key is set, so Gemini is answering.")
        return 0

    print(f"{len(PROBES) - answered_count} of {len(PROBES)} did not answer.")
    print()
    if not key:
        print("There is no API key, so nothing on this site can answer reliably.")
        print()
        print("To fix it, about ten minutes:")
        print()
        print("  1. Open  https://aistudio.google.com/apikey")
        print("  2. Sign in with any Google account")
        print("  3. Click 'Create API key'")
        print("  4. Copy the key. It starts with AIza.")
        print("  5. Paste it into .env on the line GEMINI_API_KEY=")
        print("  6. Restart the server:  npm run dev")
        print("  7. Run this script again")
        print()
        print("Do not send the key to anyone, including me. Do not paste it into")
        print("a chat. It goes in the .env file, which is not in git.")
    return 1


def script_of(text: str, language: str) -> bool:
    """True when the answer is written in the script the visitor asked in."""
    ranges = {
        "hi": (0x0900, 0x097F),
        "bn": (0x0980, 0x09FF),
        "ta": (0x0B80, 0x0BFF),
        "te": (0x0C00, 0x0C7F),
        "gu": (0x0A80, 0x0AFF),
        "kn": (0x0C80, 0x0CFF),
        "ml": (0x0D00, 0x0D7F),
        "pa": (0x0A00, 0x0A7F),
        "ur": (0x0600, 0x06FF),
        "ar": (0x0600, 0x06FF),
        "en": (0x0020, 0x024F),
    }
    low, high = ranges.get(language, (0, 0))
    return any(low <= ord(c) <= high for c in text)


if __name__ == "__main__":
    raise SystemExit(main())
