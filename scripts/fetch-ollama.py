"""
Download the Ollama installer, resuming if the connection drops.

    python scripts/fetch-ollama.py

curl managed 1.08 GB of 1.58 GB and then stopped, twice, with no error. It was
killed rather than finishing, and it left a partial file with nothing to say why.
Restarting it did nothing because the resume flag needs the redirect followed
first, and the process was dying before it got that far.

So this does the obvious thing properly: a Range request for whatever is
missing, retried until the file is the size the server said it would be, with
the expected length passed in rather than trusted from a header that changes.

Nothing here is clever. It is just a download that survives a bad line.
"""

import io
import os
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

URL = "https://github.com/ollama/ollama/releases/download/v0.40.3/OllamaSetup.exe"
DEST = os.path.join(os.environ["TEMP"], "OllamaSetup.exe")
EXPECTED = 1578217944

CHUNK = 1024 * 256
PAUSE = 3


def size_on_disk() -> int:
    return os.path.getsize(DEST) if os.path.exists(DEST) else 0


def fetch(attempt: int) -> None:
    have = size_on_disk()
    if have >= EXPECTED:
        return

    request = urllib.request.Request(URL)
    if have:
        # Only resume if the server will honour it. Asking for the whole file and
        # writing it over the top would waste the 1 GB already downloaded, and
        # that is exactly what happened before.
        request.add_header("Range", f"bytes={have}-")
    request.add_header("User-Agent", "Mozilla/5.0")

    with urllib.request.urlopen(request, timeout=120) as response:
        status = response.status

        if have and status != 206:
            raise RuntimeError(
                f"server ne resume (Range) maanga nahi, balki {status} diya — "
                "poora file dobara download hoga, isliye ruk raha hoon"
            )

        mode = "ab" if have else "wb"
        with open(DEST, mode) as out:
            while True:
                block = response.read(CHUNK)
                if not block:
                    break
                out.write(block)


def main() -> int:
    if size_on_disk() >= EXPECTED:
        print(f"already poora hai ({size_on_disk()} bytes)")
        return 0

    print(f"target: {EXPECTED / 2**20:.0f} MB -> {DEST}\n")

    attempt = 0
    last_report = 0

    while size_on_disk() < EXPECTED:
        attempt += 1
        if attempt > 40:
            print("\n40 koshishon ke baad bhi poora nahi hua. Connection nahi sambhal raha.")
            return 1

        before = size_on_disk()
        try:
            fetch(attempt)
        except urllib.error.HTTPError as error:
            print(f"  [{attempt}] HTTP {error.code}")
            time.sleep(PAUSE)
            continue
        except Exception as error:  # noqa: BLE001
            print(f"  [{attempt}] {str(error)[:60]}")
            time.sleep(PAUSE)
            continue

        now = size_on_disk()
        gained = now - before
        pct = now / EXPECTED * 100
        print(f"  [{attempt}] {now / 2**20:6.0f} MB  ({pct:5.1f}%)  "
              f"+{gained / 2**20:5.1f} MB")

        if gained == 0 and attempt > 3:
            print("\nProgress nahi ho raha. Ruk raha hoon.")
            return 1

        if now - last_report > 200 * 2**20:
            print("      (internet dheema chal raha hai)")
            last_report = now

    print(f"\npoora download hua: {size_on_disk() / 2**20:.0f} MB")
    print("ab install karna hai — woh agli step me.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())