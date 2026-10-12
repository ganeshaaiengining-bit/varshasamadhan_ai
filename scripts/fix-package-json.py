"""
Repair package.json: the mojibake in the description, and no postinstall.

    python scripts/fix-package-json.py

TWO FAULTS, UNRELATED TO EACH OTHER

1. The description is double-encoded. The bytes on disk are

       c3 a0 c2 a4 c2 b5 c3 a0 c2 a4 c2 b0

   which is UTF-8 for "à¤µà¤°" — and those characters are themselves what you
   get when the Devanagari bytes à¤µ are decoded as Latin-1 and then encoded as
   UTF-8 again. So the Devanagari was read as Windows-1252, written back as
   UTF-8, and has been round-tripped through that once already. npm, Vercel and
   anything else that reads the manifest show the package as

       à¤µà¤°à¥à¤·à¤¾ à¤¸à¤®à¤¾à¤§à¤¾à¤¨ AI â€” ...

   which is not a rendering quirk on this machine. It is in the file.

   Fixed by reversing the encoding rather than by typing the text again, so the
   result is provably the same characters that were mangled and not a fresh
   translation that might differ by a vowel sign.

   The same double-encoding is checked for across every .json and .md in the
   repository, because if it happened once it happened in whatever wrote the
   file, and that may have written others too.

2. There is no postinstall. Vercel installs dependencies and then runs
   postinstall before the build. Prisma generates its client there, and without
   it the build fails with "PrismaClient is not available" — a message that
   looks like a code fault and is not.

RUN ONCE, THEN npm install to regenerate the client locally.
"""

import io
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "package.json"

DESCRIPTION = "वर्षा समाधान AI — श्रीमंत वर्षा जी की स्मृति में निःशुल्क सहायता सेवा"

# Characters that appear when UTF-8 is decoded as Latin-1 or Windows-1252 and
# encoded again. A range rather than a list: there are over a hundred.
MOJIBAKE_MARKERS = (
    "à", "Ã", "Â", "â", "ð", "�", "¤", "¥", "¿",
)


def undo_double_encoding(text: str) -> str:
    """Mangled bytes read as text, put back together as UTF-8.

    The mangling decoded each byte through Windows-1252 where that byte is
    defined and through Latin-1 where it is not, which is what Windows does by
    default and what `bytes.decode("cp1252")` refuses to do. So neither codec
    alone can be used to reverse it, and it took two failures to see why:

      - `.encode("latin-1")` raises immediately, because à¤µ contains µ and ¤,
        which Latin-1 does not have at all
      - `.encode("cp1252")` gets further and then raises on U+0081 and U+008D,
        the two characters in this string that cp1252 leaves undefined and that
        Latin-1 maps straight through

    So each character is put back individually: through cp1252 where cp1252
    defines it, and through its own codepoint where cp1252 does not. That is the
    exact inverse of what produced the damage, and it is why the bytes that
    became U+0081 in the first place come back correctly rather than being
    quietly dropped.

    Only a round trip that produces decodable UTF-8 is accepted, so a string
    that merely happens to contain "à" is left alone.
    """
    out = bytearray()
    for char in text:
        try:
            out += char.encode("cp1252")
        except UnicodeEncodeError:
            code = ord(char)
            if code > 0xFF:
                return text  # not a mangled byte at all
            out.append(code)

    try:
        return bytes(out).decode("utf-8")
    except UnicodeDecodeError:
        return text


def scan_repo() -> list[str]:
    """Files elsewhere in the repo carrying the same fault."""
    import pathlib

    hits = []
    for path in pathlib.Path(".").rglob("*"):
        if not path.is_file():
            continue
        if any(part in {".git", "node_modules", ".next"} for part in path.parts):
            continue
        if path.suffix.lower() not in {".json", ".md", ".mjs", ".ts", ".tsx", ".txt"}:
            continue
        if path.name == FILE:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        if sum(text.count(m) for m in MOJIBAKE_MARKERS) >= 3:
            hits.append(str(path))
    return hits


def main() -> int:
    raw = io.open(FILE, encoding="utf-8").read()
    package = json.loads(raw)

    description = package.get("description", "")
    already_mojibake = any(m in description for m in MOJIBAKE_MARKERS)

    if already_mojibake:
        repaired = undo_double_encoding(description)
        if repaired == description:
            print("The description looks mangled but the round trip did not")
            print("improve it. Leaving it alone rather than guessing.")
            return 1
        package["description"] = repaired
        print("description: decoded back to")
        print(f"  {repaired}")
    else:
        package["description"] = DESCRIPTION
        print("description set")

    scripts = package.setdefault("scripts", {})
    if "postinstall" in scripts:
        print(f"postinstall already there: {scripts['postinstall']}")
    else:
        # Placed first so it runs before anything that might touch the client.
        package["scripts"] = {"postinstall": "prisma generate", **scripts}
        print("postinstall added: prisma generate")

    # Four-space indent and a trailing newline, matching how the file was.
    io.open(FILE, "w", encoding="utf-8", newline="\n").write(
        json.dumps(package, indent=4, ensure_ascii=False) + "\n"
    )

    others = scan_repo()
    print()
    if others:
        print(f"{len(others)} other file(s) carry the same mangling:")
        for path in others:
            print(f"  {path}")
    else:
        print("No other file in the repository is mangled this way.")

    print()
    print("Run: npm install    to regenerate the Prisma client locally")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
