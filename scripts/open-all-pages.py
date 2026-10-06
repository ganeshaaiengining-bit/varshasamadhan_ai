"""
Open every page of the site in the real browser, one after another.

    python scripts/open-all-pages.py

For a person who wants to look at the whole site rather than click through eleven
pages, this does the clicking. Each URL is opened in a new tab, in reading order,
with a pause between them so the tabs do not all compete for the same single
serverless-style dev process on first compile.

Note the pages are the owner's own to review: `/admin` needs a password and is
deliberately left out, because opening it would either fail or ask for a
credential in a browser that is being driven unattended.
"""

import subprocess
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:3001"

# Reading order: the home page, then what a visitor is most likely to want next,
# then the pages that explain the service, then the owner's own surface.
PAGES = [
    ("Home", "/"),
    ("Sahayata — puchne ka page", "/sahayata"),
    ("Category — dhyana aur yoga", "/p/dhyan-aur-yoog"),
    ("Article — sabah ka samadhi", "/p/dhyan-aur-yoog/subah-ka-samadhi"),
    ("Emergency article — aag lagne par", "/p/aapatkalen-gayide/aag-lagne-par-kya-karein"),
    ("Reviews", "/reviews"),
    ("Samaroh — yeh kya hai", "/samaroh"),
    ("Smriti — smriti", "/smriti"),
    ("Madad — madad kaise karein", "/madad"),
]


def main() -> int:
    reachable = []
    unreachable = []

    for label, path in PAGES:
        try:
            with urllib.request.urlopen(BASE + path, timeout=120) as response:
                print(f"  HTTP {response.status}  {label:<34} {path}")
                reachable.append(path)
        except urllib.error.HTTPError as error:
            print(f"  HTTP {error.code}  {label:<34} {path}  ** check this **")
            unreachable.append((label, path, error.code))
        except Exception as error:  # noqa: BLE001
            print(f"  ERR       {label:<34} {path}  — {type(error).__name__}")
            unreachable.append((label, path, str(error)))

    print(f"\n{len(reachable)} of {len(PAGES)} pages responded.")
    if unreachable:
        print("\nNot reachable:")
        for label, path, status in unreachable:
            print(f"  {label} ({path}) -> {status}")
        return 1

    print("Opening each in a browser tab, in order...")
    for _label, path in PAGES:
        subprocess.run(["cmd", "/c", "start", "", f"{BASE}{path}"], shell=False)
        # Long enough for the dev server to finish compiling the route on its
        # first hit, which on this machine is most of a minute.
        time.sleep(6)

    print("Done — the tabs should be open now.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())