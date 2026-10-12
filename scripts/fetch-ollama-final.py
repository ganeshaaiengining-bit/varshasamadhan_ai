"""
Finish the Ollama download, reusing the 1.08 GB already on disk.

    python scripts/fetch-ollama-final.py

The earlier attempts re-downloaded from byte zero, which is why nothing ever
finished on a line that keeps dropping. 1.08 GB is already sitting on disk, so
this splits that partial file into the chunks it covers and only fetches what is
actually missing.

Two things this does that the previous versions did not:

  - Reuses the partial file. Re-downloading 1.08 GB to save 470 MB is not a
    trade, it is just wasting a connection that already worked once.
  - Writes each chunk to its own file and joins at the end, so a chunk that
    half-arrives cannot corrupt the ones that finished.

The server does honour Range requests, answering 206 with a correct
Content-Range, so the remaining bytes can be asked for in small independent
pieces. Each piece either arrives or it does not.
"""

import io
import os
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

URL = "https://github.com/ollama/ollama/releases/download/v0.40.3/OllamaSetup.exe"
EXPECTED = 1578217944
CHUNK = 40 * 1024 * 1024

TEMP = os.environ["TEMP"]
PARTS = os.path.join(TEMP, "ollama-parts")
DEST = os.path.join(TEMP, "OllamaSetup.exe")
CURL = os.path.join(os.environ["SystemRoot"], "System32", "curl.exe")


def part(index: int) -> str:
    return os.path.join(PARTS, f"p{index:03d}.bin")


def have_existing(start: int, length: int) -> bool:
    """True when the partial file already contains this whole range."""
    if not os.path.exists(DEST):
        return False
    existing = os.path.getsize(DEST)
    if existing < start + length:
        return False

    with open(DEST, "rb") as src, open(part(index), "wb") as out:
        src.seek(start)
        remaining = length
        while remaining > 0:
            block = src.read(min(1024 * 1024, remaining))
            if not block:
                return False
            out.write(block)
            remaining -= len(block)
    return True


def download(index: int, start: int, end: int) -> bool:
    """One range, retried. Returns True only on a complete chunk."""
    target = part(index)
    wanted = end - start + 1

    if os.path.exists(target) and os.path.getsize(target) == wanted:
        return True

    if have_existing(start, wanted):
        return True

    for attempt in range(1, 6):
        try:
            subprocess.run(
                [CURL, "-sL", "--max-time", "150",
                 "-H", f"Range: bytes={start}-{end}",
                 "-o", target, URL],
                capture_output=True, timeout=170,
            )
        except subprocess.TimeoutExpired:
            print(f"      timeout, retry {attempt}")
            time.sleep(5)
            continue

        got = os.path.getsize(target) if os.path.exists(target) else 0
        if got == wanted:
            return True

        print(f"      {got / 2**20:.0f} of {wanted / 2**20:.0f} MB, retry {attempt}")
        time.sleep(5)

    return False


def main() -> int:
    os.makedirs(PARTS, exist_ok=True)

    total = (EXPECTED + CHUNK - 1) // CHUNK
    already = os.path.getsize(DEST) if os.path.exists(DEST) else 0
    reused = already // CHUNK

    print(f"file: {EXPECTED / 2**20:.0f} MB in {total} chunks of {CHUNK / 2**20:.0f} MB")
    print(f"already on disk: {already / 2**20:.0f} MB -> first {reused} chunks reused\n")

    fetched = 0
    for index in range(total):
        start = index * CHUNK
        end = min(start + CHUNK, EXPECTED) - 1

        reused_chunk = index < reused
        if download(index, start, end):
            if not reused_chunk:
                fetched += 1
            print(f"  chunk {index + 1:2d}/{total}  "
                  f"{'reused' if reused_chunk else 'FETCHED'}   "
                  f"({(index + 1) / total * 100:5.1f}%)")
        else:
            print(f"  chunk {index + 1:2d}/{total}  FAILED — ruk raha hoon")
            print(f"\n{reused_chunk and 0 or fetched} MB naya aa chuka hai.")
            print("dobara chalaane se wahin se chalega, purana kaam nahi jayega.")
            return 1

    print("\njod raha hoon...")
    with open(DEST, "wb") as out:
        for index in range(total):
            with open(part(index), "rb") as src:
                while True:
                    block = src.read(1024 * 1024)
                    if not block:
                        break
                    out.write(block)

    final = os.path.getsize(DEST)
    if final != EXPECTED:
        print(f"size galat: {final} != {EXPECTED}")
        return 1

    print(f"POORA: {final / 2**20:.0f} MB")
    print("\ninstall karne ke liye:")
    print(f'  start "{DEST}" /S')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())