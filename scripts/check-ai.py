import json
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:3001"

# The 18 languages the site offers, each with the script its answers must be
# written in and the question to ask. Taken from LANGUAGES in
# src/content/i18n.ts rather than hardcoded here, so a language added to the
# site cannot be missing from this check.
LANGS = [
    ("hi", "Hindi", "Devanagari", "Varsha Samadhan kya hai? 2 line mein batao"),
    ("bn", "Bengali", "Bengali", "Varsha Samadhan kya hai? 2 line mein batao"),
    ("ta", "Tamil", "Tamil", "Varsha Samadhan kya hai? 2 line mein batao"),
    ("te", "Telugu", "Telugu", "Varsha Samadhan kya hai? 2 line mein batao"),
    ("mr", "Marathi", "Devanagari", "Varsha Samadhan kya aahe? 2 line sanga"),
    ("gu", "Gujarati", "Gujarati", "Varsha Samadhan shu che? 2 line mein batao"),
    ("kn", "Kannada", "Kannada", "Varsha Samadhan enu? 2 line mein cheppu"),
    ("ml", "Malayalam", "Malayalam", "Varsha Samadhan entu? 2 line paruj"),
    ("pa", "Punjabi", "Gurmukhi", "Varsha Samadhan kya hai? 2 line mein dasso"),
    ("ur", "Urdu", "Arabic", "Varsha Samadhan kya hai? 2 line mein bataye"),
    ("ar", "Arabic", "Arabic", "Varsha Samadhan ma huwa? 2 line jaweb"),
    ("en", "English", "Latin", "What is Varsha Samadhan? Answer in 2 lines"),
    ("es", "Spanish", "Latin", "Que es Varsha Samadhan? Responde en 2 lineas"),
    ("fr", "French", "Latin", "Qu est-ce que Varsha Samadhan? 2 lignes"),
    ("de", "German", "Latin", "Was ist Varsha Samadhan? Antworte in 2 Zeilen"),
    ("pt", "Portuguese", "Latin", "O que e Varsha Samadhan? Responda em 2 linhas"),
    ("ru", "Russian", "Cyrillic", "Cto takoe Varsha Samadhan? 2 stroki"),
    ("zh", "Chinese", "Han", "Varsha Samadhan 是什么？两句话回答"),
]

RANGES = {
    "Devanagari": [(0x0900, 0x097F)],
    "Bengali": [(0x0980, 0x09FF)],
    "Tamil": [(0x0B80, 0x0BFF)],
    "Telugu": [(0x0C00, 0x0C7F)],
    "Kannada": [(0x0C80, 0x0CFF)],
    "Malayalam": [(0x0D00, 0x0D7F)],
    "Gujarati": [(0x0A80, 0x0AFF)],
    "Gurmukhi": [(0x0A00, 0x0A7F)],
    "Arabic": [(0x0600, 0x06FF), (0x0750, 0x077F), (0xFB50, 0xFDFF)],
    "Cyrillic": [(0x0400, 0x04FF)],
    "Han": [(0x4E00, 0x9FFF)],
    "Latin": [(0x0041, 0x024F)],
}


def in_script(text: str, script: str) -> bool:
    return any(
        any(low <= ord(ch) <= high for ch in text) for low, high in RANGES[script]
    )


def ask(code: str, question: str) -> dict:
    body = json.dumps({"question": question}).encode()
    req = urllib.request.Request(
        f"{BASE}/api/ask",
        data=body,
        headers={"Content-Type": "application/json", "Cookie": f"vs-lang={code}"},
    )
    with urllib.request.urlopen(req, timeout=240) as response:
        return json.loads(response.read().decode())


def main() -> int:
    print()
    print("Live AI check, all 18 languages, one at a time")
    print("=" * 72)
    print()
    print(f"  {'LANG':<11} {'SCRIPT':<11} {'PROVIDER':<13} OK?")
    print("  " + "-" * 68)

    good = 0
    providers = {}

    for code, name, script, question in LANGS:
        try:
            data = ask(code, question)
        except urllib.error.HTTPError as error:
            print(f"  {name:<11} HTTP {error.code}")
            continue
        except Exception as error:
            print(f"  {name:<11} error {str(error)[:40]}")
            continue

        answer = " ".join(str(data.get("answer", "")).split())
        provider = data.get("provider", "?")
        providers[provider] = providers.get(provider, 0) + 1

        if not answer:
            print(f"  {name:<11} {'':<11} {provider:<13} NO ANSWER")
            continue

        ok = in_script(answer, script) and len(answer) > 25
        good += 1 if ok else 0
        print(
            f"  {name:<11} {script:<11} {provider:<13} "
            f"{'yes' if ok else 'WRONG SCRIPT'}"
        )
        if not ok:
            print(f"      {answer[:100]}")

        # The free tier counts per model per day and an earlier burst spent it
        # for ten hours. One request, then a pause.
        time.sleep(4)

    print()
    print(f"  {good} of {len(LANGS)} correct script")
    print(f"  providers: {providers}")
    print()
    return 0 if good == len(LANGS) else 1


if __name__ == "__main__":
    sys.exit(main())