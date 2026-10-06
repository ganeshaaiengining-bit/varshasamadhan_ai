"""
Check that a question always produces something useful.

    python scripts/test-answers.py

Asks the running site the questions its own articles are about, and checks that
each one comes back with either an AI answer or a stored article.

This exists because "you ask a question and nothing comes back" is the worst
possible failure for a help service, and because the AI is currently *not*
configured — no API key — so the stored-answer path is the only one running. If
that path silently stopped matching, every test that only checked the HTTP status
would still pass.

It also checks the opposite: a question with no answer in the articles must NOT
be given an unrelated article. Guessing here would be worse than silence.
"""

import io
import json
import re
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:3001/api/ask"

# (question, a word that must appear in whatever comes back)
MUST_ANSWER = [
    ("मेरे बच्चे को बुखार है, क्या करूँ?", "बुखार"),
    ("घर में आग लग जाए तो क्या करें", "आग"),
    ("बिजली चली गई है, फोन कैसे चार्ज करें", "बिजली"),
    ("डाही हो रही है तो क्या करें", "डाह"),
    ("बच्चे की पढ़ाई में कमजोरी है", "पढ़ाई"),
    ("दूध बंद हो गया है तो क्या करें", "दूध"),
]

# No article is about these. A match here is a false positive in the matcher.
SHOULD_NOT_ANSWER = [
    "मेरा फोन कौन सा लें",
    "शेयर बाज़ार कैसे काम करता है",
    "cricket ka khel kaise khelein",
]


def ask(question: str):
    payload = json.dumps({"question": question, "category": "", "lang": "hi"}).encode()
    request = urllib.request.Request(URL, data=payload, method="POST")
    request.add_header("content-type", "application/json")
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as error:
        return {"ok": False, "httpError": error.code}
    except Exception as error:  # noqa: BLE001
        return {"ok": False, "error": str(error)}


def main() -> int:
    failures = []

    print("== questions the site has articles for ==")
    for question, expected in MUST_ANSWER:
        data = ask(question)

        if data.get("answer"):
            source = "AI"
            text = data["answer"]
        elif data.get("stored"):
            source = "stored"
            text = data["stored"].get("summary") or data["stored"].get("title", "")
        else:
            print(f"  FAIL {question}")
            print(f"       nothing came back: {data}")
            failures.append(question)
            continue

        hit = expected in text or expected in json.dumps(data, ensure_ascii=False)
        print(f"  {'OK  ' if hit else 'WARN'} {source:<6} {question}")
        if not hit:
            print(f"       expected {expected!r}; got {text[:90]!r}")
            failures.append(f"{question} (wrong article)")

    print("\n== questions it has no article for ==")
    for question in SHOULD_NOT_ANSWER:
        data = ask(question)
        if data.get("stored"):
            print(f"  FAIL {question}")
            print(f"       gave an article anyway: {data['stored']}")
            failures.append(f"{question} (false match)")
        else:
            print(f"  OK   {question}  -> no article, no guess")

    print()
    if failures:
        print(f"{len(failures)} failure(s):")
        for f in failures:
            print("  -", f)
        return 1

    print("Every answerable question got something; no unanswerable one guessed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())