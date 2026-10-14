"""
Read the database address straight out of the Windows clipboard.

    node scripts/set-db-from-clipboard.mjs

WHY THIS INSTEAD OF ASKING THEM TO PASTE

The hidden-input version asked for a right-click inside a terminal window. That
is a thing people can get wrong — right-click in some terminals pastes the old
selection, or does nothing, or opens a menu — and when it goes wrong the only
symptom is that .env silently keeps its old value and the next step fails
somewhere unrelated.

The address is already on the clipboard, because Neon put it there. Reading it
from there removes the one step that can fail. The script never prints it, so
copying it into the clipboard is safe; what is not safe is putting it in a chat
or a command line, and neither happens here.

WHAT IT CHECKS

Only the shape, before writing: it must begin postgresql://, it must carry
credentials, and the host must look like a database host. A clipboard holding
something else entirely is refused rather than written over a working value.

WHAT IT PRINTS

The length and the host, never the address. The host is enough to tell whether
the right database arrived and is not a secret; the rest of the string is.
"""

import io
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

ENV = ".env"

# Get-Clipboard is the only way to read it that needs nothing installed.
ps = "$([Console]::In.ReadToEnd())"  # placeholder, unused
try:
    result = subprocess.run(
        ["powershell", "-NoProfile", "-Command", "Get-Clipboard -Raw"],
        capture_output=True,
        text=True,
        timeout=30,
    )
except FileNotFoundError:
    print("  powershell nahi mila — Windows nahi lagta.")
    raise SystemExit(1)

clip = (result.stdout or "").strip()

print()
print("Clipboard se database link")
print("=" * 46)
print()

if not clip:
    print("  Clipboard khaali hai.")
    print("  Neon me jaakar link copy kijiye, phir ye dobara chalaiye.")
    print()
    raise SystemExit(1)

if not re.match(r"^postgres(ql)?://", clip):
    print("  Clipboard me database link nahi hai.")
    print("  Link aisa dikhta hai:  postgresql://neon.tech/...")
    print()
    print("  Abhi clipboard me hai: %s..." % clip[:34].replace("\n", " "))
    print()
    raise SystemExit(1)

if not re.match(r"^postgres(ql)?://[^:]+:[^@]+@", clip):
    print("  Isme password nahi hai — ye poora link nahi hai.")
    print("  Neon ka 'Connect' button dabaakar poora link copy kijiye.")
    print()
    raise SystemExit(1)

host = clip.split("@")[-1].split("/")[0].split("?")[0]

known = ["neon.tech", "supabase", "postgres.prisma.io", "amazonaws.com"]
guess = next((k for k in known if k in host), None)

if not guess:
    print("  ⚠️  Host pehchaan me nahi aaya: %s" % host)
    print("  Agar ye sahi link hai to theek hai. Warna dobara copy kijiye.")
    print()

text = io.open(ENV, encoding="utf-8").read()


def set_value(source: str, name: str, value: str) -> str:
    pattern = re.compile(r"^" + name + r"=.*$", re.M)
    if pattern.search(source):
        return pattern.sub(lambda m: '%s="%s"' % (name, value), source)
    return source + "\n%s=\"%s\"\n" % (name, value)


text = set_value(text, "DATABASE_URL", clip)
text = set_value(text, "DIRECT_URL", clip)

io.open(ENV, "w", encoding="utf-8", newline="\n").write(text)

print("  ✅ Save ho gaya — %d characters" % len(clip))
print("  Host: %s" % host)
if guess:
    print("  Provider: %s" % guess)
print()
print("  Ab ye chalaiye:")
print()
print("    npm run db:use:postgres")
print("    npx prisma db push")
print()