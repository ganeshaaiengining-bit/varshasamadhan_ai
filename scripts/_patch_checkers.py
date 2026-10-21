import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

# ---------------------------------------------------------------------------
# 1. The health-page sampler expected wording that the tables no longer use.
#
# Nothing was missing — Tamil calls years "ஆண்டுகள்" where the sample said
# "வருடம்", Kannada says "ತಿಳಿಸಿ" where it said "ஹೇಳಿ", Arabic says
# "أخبر عن عمرك" where it said "اذكر عمرك". All three are correct in their own
# language, so the check was reporting a fault that did not exist — which is
# worse than no check, because the next real gap arrives in the same list and
# gets ignored along with it.
# ---------------------------------------------------------------------------

HEALTH = "scripts/check-page-language.py"
source = io.open(HEALTH, encoding="utf-8").read()

replacements = [
    ("வயது (வருடம்)", "வயது (ஆண்டுகள்)"),
    ("ನಿಮ್ಮ ವಯಸ್ಸು ಹೇಳಿ", "ನಿಮ್ಮ ವಯಸ್ಸು ತಿಳಿಸಿ"),
    ("العمر (بالسنوات)", "العمر (سنوات)"),
    ("اذكر عمرك", "أخبر عن عمرك"),
]
for old, new in replacements:
    count = source.count(old)
    source = source.replace(old, new)
    print("%s -> %s  (%d)" % (old, new, count))

io.open(HEALTH, "w", encoding="utf-8", newline="").write(source)

# ---------------------------------------------------------------------------
# 2. The rendered-page check counted VARSHA SAMADHAN as Latin leakage.
#
# The brief is that the name is written in Latin capitals in every language, so
# it is on every page of every language. Reporting it 1359 times meant the
# summary said "0 of 77 clean" while every page was in fact clean, and a check
# that always fails is one nobody reads.
# ---------------------------------------------------------------------------

RENDERED = "scripts/check-rendered-language.py"
source = io.open(RENDERED, encoding="utf-8").read()

anchor = '"App", "WhatsApp", "YouTube", "Google", "Android", "iOS", "IV",'
addition = (
    '"App", "WhatsApp", "YouTube", "Google", "Android", "iOS", "IV",\n'
    "    # The site's own name, written in Latin capitals in every language by\n"
    "    # the brief itself. Counting it as a fault failed every page in every\n"
    "    # language, and a check that never passes cannot find anything.\n"
    '    "VARSHA", "SAMADHAN",'
)
if '"VARSHA"' in source:
    print("rendered check already allows VARSHA")
else:
    assert anchor in source, "acronym list not found"
    source = source.replace(anchor, addition, 1)
    io.open(RENDERED, "w", encoding="utf-8", newline="").write(source)
    print("rendered check: VARSHA and SAMADHAN allowed")
