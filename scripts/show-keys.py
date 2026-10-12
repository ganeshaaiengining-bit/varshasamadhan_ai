"""
Print the Hindi source strings for a group of keys, ready to translate.

    python scripts/show-keys.py support reviews

Written because reading them out through `python -c` from PowerShell kept
losing part of the regular expression — the shell rewrites backslashes in the
heredoc, so the pattern silently matched nothing and printed "0 keys" for a
group that plainly has keys in it.

This is the first half of the translation batches: run it, write the
translations into a sibling script, then run scripts/check-scripts.py on that
script before letting it near i18n.ts.
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

FILE = "src/content/i18n.ts"

KEY = re.compile(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'")


def unescape(value: str) -> str:
    return value.replace("\\'", "'").replace("\\\\", "\\")


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    prefixes = tuple(sys.argv[1:])
    source = io.open(FILE, encoding="utf-8").read()
    start = re.search(r"const HINDI[^=]*=\s*\{", source)
    body = source[start.end():source.index("\n};", start.end())]
    table = {key: unescape(value) for key, value in KEY.findall(body)}

    for prefix in prefixes:
        keys = sorted(k for k in table if k.startswith(prefix))
        print(f"=== {prefix}  ({len(keys)} keys) ===")
        for key in keys:
            print(f"{key}\n   {table[key]}")
        print()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
