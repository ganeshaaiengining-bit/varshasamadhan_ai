"""
Download Ollama, resuming a partial file instead of starting over.

    python scripts/fetch-ollama-resume.py

WHY THIS EXISTS

The install was attempted before and failed: the connection dropped at 1085 MB
of a 1505 MB installer. That file is still on disk. Starting from zero would
throw away 72% of a download that has already happened, which is why the earlier
attempt felt hopeless — it was not a slow connection, it was one bad moment.

The difference this time is that the download is resumable. A Range request asks
for the bytes after the ones already held, so a drop costs the bytes in flight
rather than the whole file. Retries are capped and the loop stops rather than
hammering a link that is already struggling.

WHY OLLAMA AT ALL, WHEN THE OWNER HAS A GOOGLE ACCOUNT

Because it needs none of the things that have been going wrong: no Google login,
no API key, no quota, no account, and no internet once the model is pulled. It
runs on this machine and answers in whatever language it is asked in.

It is the second provider in the chain already. ask.ts tries Ollama before
Pollinations whenever the model is present, so installing it is not new
architecture — it is filling in a slot the code was written to use.

HOW BIG, AND WHY THAT MATTERS

  OllamaSetup.exe   about 1505 MB
  the model         about 1000 MB for a small multilingual one

Both are downloads, and both have to survive the same connection. The model
pull goes through `ollama pull`, which is resumable on its own account — a
dropped pull retries and keeps what it got, so it is not scripted here.

A SMALL MODEL IS DELIBERATE

A 1-2 GB model runs on a CPU without a graphics card. A 7 GB one would not be
usable here at all, and would be no better for the job: this service asks short
everyday questions and wants an answer in an Indian language, not reasoning.
The small multilingual models are good at exactly that.
"""

import os
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

URL = "https://ollama.com/download/OllamaSetup.exe"

# Where the earlier attempt left it. Checked in this order, because the file has
# been in both at different points.
CANDIDATES = [
    os.path.expanduser("~/Downloads/OllamaSetup.exe"),
    os.path.expandvars(r"%TEMP%\OllamaSetup.exe"),
    os.path.expandvars(r"%LOCALAPPDATA%\Temp\OllamaSetup.exe"),
]

CHUNK = 1024 * 256          # 256 KB per read
MAX_ATTEMPTS = 40
GIVE_UP_AFTER = 8           # consecutive failures before stopping
TIMEOUT = 90


def find_partial() -> str | None:
    for path in CANDIDATES:
        if os.path.exists(path) and os.path.getsize(path) > 0:
            return path
    return None


def remote_size() -> int:
    request = urllib.request.Request(URL, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
    response = urllib.request.urlopen(request, timeout=60)
    return int(response.headers.get("Content-Length", 0))


def human(size: float) -> str:
    return f"{size / 1048576:.1f} MB"


def attempt(path: str, have: int, total: int) -> int:
    """One connection. Returns how many bytes were added, or -1 on failure."""
    headers = {"User-Agent": "Mozilla/5.0"}
    if have:
        headers["Range"] = f"bytes={have}-"

    request = urllib.request.Request(URL, headers=headers)
    response = urllib.request.urlopen(request, timeout=TIMEOUT)

    # A server that ignores Range replies 200 with the whole file, which would
    # silently restart from zero and waste everything already held. Detected
    # here rather than discovered afterwards by a file that came out twice as
    # long as it should.
    if have and response.status != 206:
        print("  server ignored the Range request — restarting from zero")
        with open(path, "wb"):
            pass
        have = 0

    mode = "ab" if have else "wb"
    written = 0
    last_report = time.time()

    with open(path, mode) as handle:
        while True:
            chunk = response.read(CHUNK)
            if not chunk:
                break
            handle.write(chunk)
            written += len(chunk)

            now = time.time()
            if now - last_report > 5:
                done = have + written
                percent = done / total * 100 if total else 0
                print(f"  {human(done)} / {human(total)}   {percent:.1f}%", flush=True)
                last_report = now

    return written


def main() -> int:
    print()
    print("Ollama download, resumed")
    print("=" * 46)
    print()

    total = remote_size()
    print(f"  full size      {human(total)}")

    path = find_partial()
    if path is None:
        path = CANDIDATES[0]
        print(f"  no partial file found, starting fresh into")
        print(f"    {path}")
    else:
        print(f"  found partial  {human(os.path.getsize(path))}")
        print(f"    {path}")

    print()

    if os.path.exists(path) and os.path.getsize(path) >= total:
        print("  already complete — nothing to download")
        return 0

    failures = 0
    attempt_number = 0

    while failures < GIVE_UP_AFTER and attempt_number < MAX_ATTEMPTS:
        attempt_number += 1
        have = os.path.getsize(path) if os.path.exists(path) else 0

        if total and have >= total:
            break

        try:
            print(f"  attempt {attempt_number} from {human(have)} ...", flush=True)
            added = attempt(path, have, total)
            failures = 0
            print(f"  gained {human(added)}")
        except (urllib.error.URLError, OSError, TimeoutError) as error:
            failures += 1
            now = os.path.getsize(path) if os.path.exists(path) else 0
            print(f"  dropped: {str(error)[:60]}")
            print(f"  still have {human(now)}, {GIVE_UP_AFTER - failures} tries left")
            # Nothing is lost and nothing is gained by retrying instantly; a
            # connection that just failed is usually still failing.
            time.sleep(min(5 * failures, 20))

    final = os.path.getsize(path) if os.path.exists(path) else 0
    print()

    if total and final >= total * 0.999:
        print(f"  COMPLETE  {human(final)}")
        print()
        print("  Next: run the installer, then pull a model. Say 'model' and the")
        print("  rest is scripted.")
        return 0

    print(f"  stopped at {human(final)} of {human(total)}")
    print(f"  the file is kept, so re-running this continues from there")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
