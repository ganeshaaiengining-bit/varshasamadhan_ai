"""Does the language picker and the URL prefix list agree?

`src/content/i18n.ts` holds the picker's list, with the table behind each code.
`src/middleware.ts` holds a literal copy of the codes it accepts as a URL prefix,
because that file runs in a separate runtime and cannot import eleven thousand
lines of translations.

Two lists that must match, in two files, is how a language ends up offered in the
picker and then silently dropped from the address bar: the visitor chooses Odia,
the page reloads at `/or/`, the middleware does not recognise `or`, and the choice
reverts to Hindi. Nobody would report that as a bug in the middleware; they would
report that "Odia does not work".

So this check reads both and says which code is where it should not be.

    python scripts/check-language-list.py
"""

import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

I18N = "src/content/i18n.ts"
MIDDLEWARE = "src/middleware.ts"


def read(path: str) -> str:
    return io.open(path, encoding="utf-8").read()


def picker_codes(source: str) -> list[str]:
    start = source.index("export const LANGUAGES")
    end = source.index("];", start)
    return re.findall(r"code:\s*'([a-z]{2,3})'", source[start:end])


def middleware_codes(source: str) -> list[str]:
    start = source.index("const CODES = new Set([")
    end = source.index("]);", start)
    return re.findall(r"'([a-z]{2,3})'", source[start:end])


def table_codes(source: str) -> list[str]:
    start = source.index("const TABLES")
    end = source.index("};", start)
    return re.findall(r"^\s*([a-z]{2,3}):\s*[A-Z]+,", source[start:end], re.M)


def main() -> int:
    i18n = read(I18N)
    picker = picker_codes(i18n)
    prefix = middleware_codes(read(MIDDLEWARE))
    tables = table_codes(i18n)

    problems = 0

    for code in picker:
        if code not in prefix:
            print(f"  [{code}] in the picker, missing from middleware CODES — /{code}/ is not a URL")
            problems += 1
        if code not in tables:
            print(f"  [{code}] in the picker, missing from TABLES — the page renders in English")
            problems += 1

    for code in prefix:
        if code not in picker:
            print(f"  [{code}] accepted as a URL prefix, not offered in the picker")
            problems += 1

    for code in tables:
        if code not in picker:
            print(f"  [{code}] has a table, not offered in the picker")
            problems += 1

    if problems == 0:
        print(f"  {len(picker)} languages: picker, TABLES and URL prefixes agree.")
        print("  " + ", ".join(picker))
    return problems


if __name__ == "__main__":
    raise SystemExit(1 if main() else 0)
