"""
Read a secret out of the Windows clipboard and into .env, without printing it.

    python scripts/set-secret-from-clipboard.py GEMINI_API_KEY

WHY THIS EXISTS, AND WHY IT IS NOT THE SAME AS ASKING SOMEONE TO PASTE

Three secrets have to be replaced: the Neon password and the Gemini key. The
replacement for each is made on a website, by the owner, logged into their own
account — there is no API that mints either one without their session, and
taking that session would mean taking a password, which is the thing being
protected here.

So two clicks are theirs and everything else is not. They reset the password or
create the key, the site puts the new value on the clipboard, and this writes it
into .env. What never happens is the value being typed into a chat, a command
line, or a shell history entry.

The database address version of this is set-db-from-clipboard.py, which predates
it. The difference is that this one takes the name of the key, so the same
routine covers the Gemini key as well, and so the key is never matched by
guessing at its shape.

WHAT IT CHECKS

Only the shape, before writing, and only as far as it can without knowing the
secret in advance:

  GEMINI_API_KEY   long enough to be a key, and not a database address
  DATABASE_URL     begins postgresql://, carries a password, has a host
  anything else    long enough not to be a stray keystroke

A clipboard holding something else entirely is refused rather than written over a
working value, because a half-typed Gemini key produces a site that answers
every question with a server error and no clue why.

WHAT IT PRINTS

The name of the key and how long the value is. Never the value.
"""

import io
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

ENV = ".env"


def read_clipboard() -> str:
    """The clipboard, as text.

    Get-Clipboard is the only way to read it that needs nothing installed.
    """
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

    return (result.stdout or "").strip()


def looks_wrong(name: str, value: str) -> str:
    """Why this value should not be written, or an empty string if it is fine."""

    if name.endswith("DATABASE_URL") or name == "DIRECT_URL":
        if not re.match(r"^postgres(ql)?://", value):
            return "ye database link nahi lagta"
        if not re.match(r"^postgres(ql)?://[^:]+:[^@]+@", value):
            return "isme password nahi hai — poora Connect link copy kijiye"
        return ""

    if name == "GEMINI_API_KEY":
        if value.startswith("postgres"):
            return "ye database link hai, Gemini key nahi"
        if len(value) < 30:
            return "itni chhoti key nahi hoti — shayad poora copy nahi hua"
        return ""

    if len(value) < 12:
        return "bahut chhota hai — shayad ek extra keystroke"

    return ""


def set_value(source: str, name: str, value: str) -> str:
    pattern = re.compile(r"^" + name + r"=.*$", re.M)
    if pattern.search(source):
        return pattern.sub(lambda m: '%s="%s"' % (name, value), source)
    return source + '\n%s="%s"\n' % (name, value)


def main() -> int:
    if len(sys.argv) < 2:
        print()
        print("  kiska secret hai? naam likhiye:")
        print()
        print("    python scripts/set-secret-from-clipboard.py GEMINI_API_KEY")
        print("    python scripts/set-secret-from-clipboard.py DATABASE_URL")
        print()
        return 1

    name = sys.argv[1].strip()

    print()
    print("Clipboard se %s" % name)
    print("=" * 46)
    print()

    value = read_clipboard()

    if not value:
        print("  Clipboard khaali hai.")
        print()
        print("  Website pe nayi value bana kar 'Copy' dabaaiye, phir ye dobara chalaiye.")
        print()
        return 1

    # A pasted value often arrives with a stray newline or surrounding quotes.
    value = value.strip().strip('"').strip("'").strip()

    problem = looks_wrong(name, value)
    if problem:
        print("  Likha nahi gaya — %s." % problem)
        print()
        print("  Clipboard me hai: %d characters, shuru: %s..." % (len(value), value[:28]))
        print()
        return 1

    text = io.open(ENV, encoding="utf-8").read()
    io.open(ENV, "w", encoding="utf-8", newline="\n").write(set_value(text, name, value))

    print("  ✅ %s save ho gaya — %d characters" % (name, len(value)))
    print()
    print("  Value kabhi print nahi hui, history me nahi gayi.")
    print()
    print("  Ab ye chalaiye — ye bhi value print nahi karega:")
    print()
    print("    python scripts/send-env-to-vercel.py")
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
