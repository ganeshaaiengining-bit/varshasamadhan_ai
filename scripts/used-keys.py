"""
List which translation keys are actually rendered, and which are defined but dead.

    python scripts/used-keys.py

Two things this answers:

  1. Keys used in code but missing from the Hindi table. Those are the dangerous
     ones — `translate()` returns the key itself for an unknown key, so they
     render on screen as the literal text `ask.fooBar`. Nobody notices that in a
     build, and a visitor sees it.
  2. Keys defined but never referenced. These cost nothing to leave in place but
     should not be translated into eleven languages on the strength of a grep —
     translating dead strings is work that can never be seen or tested.

Writes `.import/used-keys.json` so the translation work can be scoped to what
the site actually shows.
"""

import glob
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

I18N = "src/content/i18n.ts"

# Keys referenced indirectly, through the voice hook and the ask route, which
# build key names at runtime rather than writing them as `t('...')` literals.
INDIRECT = {
    "voice.notAllowed",
    "voice.serviceNotAllowed",
    "voice.noSpeech",
    "voice.audioCapture",
    "voice.network",
    "voice.aborted",
    "voice.generic",
    "voice.speakFailed",
    "voice.unsupported",
    "ask.micUnsupported",
    "ask.welcome",
    "ask.notAnswer",
    "ask.errorRateLimit",
    "ask.errorNetwork",
    "ask.emptyAnswer",
    "sound.errUnsupported",
    "sound.errGeneric",
    "dhun.unsupported",
    "dhun.failedTry",
}

PATTERNS = [
    r"(?<![A-Za-z0-9_.])t\('([a-zA-Z0-9_.]+)'",
    r"tf\('([a-zA-Z0-9_.]+)'",
    r"labelKey: '([a-zA-Z0-9_.]+)'",
    r"descriptionKey: '([a-zA-Z0-9_.]+)'",
    r"hintKey: '([a-zA-Z0-9_.]+)'",
]


def main() -> int:
    used = set(INDIRECT)

    for path in glob.glob("src/**/*.ts", recursive=True) + glob.glob("src/**/*.tsx", recursive=True):
        normalised = path.replace("\\", "/")
        if normalised.endswith("content/i18n.ts"):
            continue  # the tables themselves; not a consumer
        source = io.open(path, encoding="utf-8").read()
        for pattern in PATTERNS:
            used |= set(re.findall(pattern, source))

    i18n = io.open(I18N, encoding="utf-8").read()
    reference = re.search(r"const HINDI: Record<string, string> = \{(.*?)\n\};", i18n, re.S)
    if not reference:
        print("ERROR: could not read the Hindi table")
        return 1
    defined = set(re.findall(r"'([a-zA-Z0-9_.]+)':", reference.group(1)))

    print(f"defined in Hindi : {len(defined)}")
    print(f"rendered in code : {len(used)}")

    undefined = sorted(used - defined)
    dead = sorted(defined - used)

    print(f"\nUSED BUT NOT DEFINED ({len(undefined)}) — these render as their own key name:")
    for key in undefined:
        print("   ", key)

    print(f"\nDEFINED BUT NEVER RENDERED ({len(dead)}) — safe to leave untranslated:")
    for key in dead:
        print("   ", key)

    real_work = sorted(used & defined)
    print(f"\nStrings that actually need translating into 11 more languages: {len(real_work)}")
    print(f"  11 x {len(real_work)} = {11 * len(real_work)} translations")

    os.makedirs(".import", exist_ok=True)
    io.open(".import/used-keys.json", "w", encoding="utf-8").write(
        json.dumps(real_work, ensure_ascii=False, indent=1)
    )

    return 1 if undefined else 0


if __name__ == "__main__":
    raise SystemExit(main())