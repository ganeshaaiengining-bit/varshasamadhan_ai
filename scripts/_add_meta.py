import io, re, sys

sys.stdout.reconfigure(encoding="utf-8")

T = {
    "HINDI": "मुफ़्त समाधान, आपके अपने शब्दों में",
    "ENGLISH": "Free answers, in your own words",
    "BENGALI": "বিনামূল্যে সমাধান, আপনার নিজের শব্দে",
    "TAMIL": "இலவச தீர்வு, உங்கள் சொற்களில்",
    "TELUGU": "ఉచిత సమాధానాలు, మీ సొంత మాటల్లో",
    "MARATHI": "मोफत उपाय, तुमच्या स्वतःच्या शब्दांत",
    "GUJARATI": "મફત સમાધાન, તમારા પોતાના શબ્દોમાં",
    "KANNADA": "ಉಚಿತ ಪರಿಹಾರ, ನಿಮ್ಮ ಸ್ವಂತ ಪದಗಳಲ್ಲಿ",
    "MALAYALAM": "സൗജന്യ പരിഹാരം, നിങ്ങളുടെ സ്വന്തം വാക്കുകളിൽ",
    "PUNJABI": "ਮੁਫ਼ਤ ਹੱਲ, ਆਪਣੇ ਸੁਭਾਅ ਦੇ ਸ਼ਬਦਾਂ ਵਿੱਚ",
    "URDU": "مفت حل، آپ کے اپنے الفاظ میں",
    "ARABIC": "حلول مجانية، بكلماتك أنت",
    "SPANISH": "Soluciones gratis, en tus propias palabras",
}

path = "src/content/i18n.ts"
lines = io.open(path, encoding="utf-8").read().split("\n")

current = None
changed = 0
for i, line in enumerate(lines):
    m = re.match(r"^const (\w+)", line)
    if m:
        current = m.group(1)
    if current in T and "nav.home" in line:
        if "home.metaTitle" in line:
            print("already present:", current)
            continue
        # Insert straight after the nav.home entry on this line.
        new_line, n = re.subn(
            r"('nav\.home':\s*'[^']*',)",
            r"\1 'home.metaTitle': '%s'," % T[current].replace("'", "\\'"),
            line,
            count=1,
        )
        if n:
            lines[i] = new_line
            changed += 1
        else:
            print("FAILED on", current, line[:80])

io.open(path, "w", encoding="utf-8", newline="").write("\n".join(lines))
print("home.metaTitle added to", changed, "tables")
