"""
Find files and exports that nothing uses.

    python scripts/dead-code.py

Two checks, because they catch different mistakes:

  1. Modules nothing imports. A file can sit in `src/` looking load-bearing and
     be wired to nothing at all — the project had two components both named
     `SoundPad`, and only one of them was ever imported, so the other was a
     second copy of the same UI waiting to be edited by mistake.

  2. Exports nothing references. Slower to get right than unused imports, because
     a component is often used only through JSX that names it as a tag, and an
     icon set is often consumed by string key. Anything exported from a file
     that is not a route, not an entry point and not a barrel is reported for a
     human to confirm rather than deleted automatically.

Nothing here deletes anything. It prints findings.
"""

import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

SOURCE_ROOT = "src"

# Files that are legitimately referenced without anything importing them.
ENTRY_POINTS = {
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/not-found.tsx",
    "src/app/error.tsx",
    "src/app/global-error.tsx",
}


def walk_sources():
    for base, _dirs, files in os.walk(SOURCE_ROOT):
        for name in files:
            if name.endswith((".ts", ".tsx")):
                path = os.path.join(base, name).replace("\\", "/")
                yield path


def main() -> int:
    paths = list(walk_sources())
    sources = {path: io.open(path, encoding="utf-8").read() for path in paths}

    print(f"Scanned {len(paths)} source files.\n")

    # ---------------------------------------------------------------- 1. modules
    print("=== modules nothing imports ===")
    dead_modules = []
    for path in paths:
        name = os.path.basename(path)
        if name in ENTRY_POINTS:
            continue

        stem = name.rsplit(".", 1)[0]
        referenced = False
        for other, source in sources.items():
            if other == path:
                continue
            if "@/" + path[4:] in source or path in source:
                referenced = True
                break
            # A bare relative import of the same file name from a sibling.
            if re.search(r"from\s+['\"][^'\"]*/%s['\"]" % re.escape(stem), source):
                referenced = True
                break

        if not referenced:
            dead_modules.append(path)
            print(f"  {path}")

    if not dead_modules:
        print("  none")

    # --------------------------------------------------------------- 2. exports
    print("\n=== exports no other file references ===")
    # Next.js uses these by convention rather than by import.
    conventional = {
        "default", "metadata", "generateMetadata", "viewport", "dynamic",
        "revalidate", "generateStaticParams", "runtime", "dynamicParams",
        "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS",
    }

    suspects = []
    for path, source in sources.items():
        if path.startswith("src/app/"):
            continue  # route files export by convention

        exports = re.findall(
            r"^export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)",
            source, re.M,
        )
        for symbol in exports:
            if symbol in conventional or symbol.startswith("_"):
                continue

            used = False
            for other, other_source in sources.items():
                if other == path:
                    continue
                if re.search(r"\b%s\b" % re.escape(symbol), other_source):
                    used = True
                    break

            if not used:
                suspects.append(f"{path}: {symbol}")

    for line in suspects:
        print(f"  {line}")
    if not suspects:
        print("  none")

    io.open(".import/dead-code.json", "w", encoding="utf-8").write(
        json.dumps({"dead_modules": dead_modules, "unused_exports": suspects}, indent=2)
    )

    print(f"\n{len(dead_modules)} dead module(s), {len(suspects)} unused export(s).")
    print("Nothing was deleted. Confirm before removing anything.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())