import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

PATH = "src/content/i18n.ts"
text = io.open(PATH, encoding="utf-8").read()

# ── 1. Remove the five languages that have no translation table ─────────────

REMOVE = ["fr", "de", "pt", "ru", "zh"]

NOTE = """
  /*
   * French, German, Portuguese, Russian and Chinese were listed here and had no
   * translation table behind them. A visitor who chose Russian was shown the
   * site in English with Hindi section headings mixed into the same page — 215
   * stray English words, measured by scripts/check-rendered-language.py.
   *
   * They are removed rather than left listed, because a language in this list
   * is a promise: everything below the switcher will be readable in it. Listing
   * one that cannot be honoured fails in the worst way, because it looks like
   * it worked — the page rendered, the layout was right, only the words were
   * wrong, and the visitor has no way to tell that is a fault rather than their
   * own reading.
   *
   * To add one back: write FRENCH, GERMAN, PORTUGUESE, RUSSIAN or CHINESE as a
   * table with the same keys as HINDI, add it to TABLES, then add the code
   * here. scripts/check-language-tables.py fails if the two lists disagree.
   */
"""

removed = []
for code in REMOVE:
    pattern = re.compile(r"^  \{ code: '" + code + r"'.*\n", re.M)
    if pattern.search(text):
        text = pattern.sub("", text)
        removed.append(code)

if removed:
    # The note goes where the entries were, so the next person to look here
    # knows the omission was deliberate.
    marker = "  { code: 'es', native: 'Español', english: 'Spanish', direction: 'ltr' },\n"
    text = text.replace(marker, marker + NOTE, 1)

# ── 2. Add the emergency banner to the four tables missing it ───────────────
#
# home.emergencyTitle existed in nine tables and home.emergencyNote in ten, so
# Kannada, Malayalam, Punjabi and Bengali each rendered the English banner on a
# page otherwise entirely in their own script. Bengali was missing the note but
# not the title, which is why its page showed a fragment of English rather than
# the whole line.

EMERGENCY = {
    # key: values for bn, kn, ml, pa — in the table order of the file
    "home.emergencyTitle": {
        "bn": "জরুরি — এখনই সাহায্য দরকার",
        "kn": "ತುರ್ತ ಸಹಾಯ ಬೇಕೇ?",
        "ml": "ഉടർന്നടെ സഹായം വേണോ?",
        "pa": "ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    },
    "home.emergencyNote": {
        "bn": "এগুলো আগে পড়ুন। বাকি সব পরে দেখা যাবে।",
        "kn": "ಇವನ್ನು ಮೊದಲು ಓದಿ. ಉಳಿದವೆಲ್ಲಾ ನಂತರ ನೋಡಬಹುದು.",
        "ml": "ഇവയെ ആദ്യം വായിക്കൂ. ബാക്കിയുള്ളവ സമയത്തിനു വായിച്ചോണം.",
        "pa": "ਇਹ ਪਹਿਲਾਂ ਪੜ੍ਹੋ। ਬਾਕੀ ਸਭ ਬਾਅਦ ਵਿੱਚ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    },
}

# Which table is which, by the language it starts with.
TABLE_ORDER = ["hi", "en", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "ar", "es"]
LANG_MARKER = {
    "hi": "हिन्दी", "en": "English", "bn": "বাংলা", "ta": "தமிழ்", "te": "తెలుగు",
    "mr": "मराठी", "gu": "ગુજરાતી", "kn": "ಕನ್ನಡ", "ml": "മലയാളം", "pa": "ਪੰਜਾਬੀ",
    "ur": "اردو", "ar": "العربية", "es": "Español",
}


def table_blocks(text: str):
    """Split the file into (start, end) spans, one per language table."""
    starts = []
    for code in TABLE_ORDER:
        marker = "const " + {
            "hi": "HINDI", "en": "ENGLISH", "bn": "BENGALI", "ta": "TAMIL",
            "te": "TELUGU", "mr": "MARATHI", "gu": "GUJARATI", "kn": "KANNADA",
            "ml": "MALAYALAM", "pa": "PUNJABI", "ur": "URDU", "ar": "ARABIC",
            "es": "SPANISH",
        }[code] + ": Record<string, string> = {"
        at = text.find(marker)
        if at >= 0:
            starts.append((code, at))
    starts.sort(key=lambda p: p[1])

    blocks = []
    for index, (code, start) in enumerate(starts):
        end = starts[index + 1][1] if index + 1 < len(starts) else len(text)
        blocks.append((code, start, end))
    return blocks


added = 0
# Rebuild from the end so earlier offsets stay valid.
for code, start, end in reversed(table_blocks(text)):
    if code not in ("bn", "kn", "ml", "pa"):
        continue

    block = text[start:end]
    additions = []

    for key in ("home.emergencyTitle", "home.emergencyNote"):
        if f"'{key}'" in block:
            continue
        value = EMERGENCY[key][code]
        escaped = value.replace("\\", "\\\\").replace("'", "\\'")
        additions.append("  '%s': '%s'," % (key, escaped))

    if not additions:
        continue

    # Insert after the last existing home.* key in this table so the group stays
    # together rather than landing at the top of the object.
    homes = list(re.finditer(r"^  'home\.[a-zA-Z]+'", block, re.M))
    at = homes[-1].end() if homes else block.index("{") + 1
    # Walk to the end of that line.
    nl = block.index("\n", at)
    block = block[: nl + 1] + "\n".join(additions) + "\n" + block[nl + 1:]

    text = text[:start] + block + text[end:]
    added += len(additions)

io.open(PATH, "w", encoding="utf-8", newline="\n").write(text)

print()
print("i18n.ts")
print("=" * 58)
print()
print("  removed %d untranslated language(s): %s" % (len(removed), " ".join(removed)))
print("  added    %d emergency string(s) to bn, kn, ml, pa" % added)
print()

for key in ("home.emergencyTitle", "home.emergencyNote"):
    hits = re.findall(r"'" + re.escape(key) + r"':\s*'([^']*)'", text)
    latin = [h for h in hits if re.match(r"^[\x20-\x24F]+$", h)]
    print("  %-22s %d/13 tables, %d still English" % (key, len(hits), len(latin)))