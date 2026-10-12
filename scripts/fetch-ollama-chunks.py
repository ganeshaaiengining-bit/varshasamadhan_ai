"""
Finish the Ollama installer download in chunks, so a dropping line costs 50 MB
instead of the whole run.

    python scripts/fetch-ollama-chunks.py

The single-shot download reached 1.08 GB of 1.58 GB and stopped twice. The
connection on this machine is not steady: the same host served 1.5 MB/s at one
moment and nothing at the next, and Google was unreachable while npm answered.
A 1.5 GB request over that line is asking for one uninterrupted transfer, which
is why it never finished.

The server does honour Range requests — it answers 206 with the correct
Content-Range — so the remaining bytes are fetched as independent 50 MB ranges.
Each one either arrives or does not, and a failure costs one chunk rather than
everything already downloaded. Chunks land in separate files and are joined at
the end, so a chunk that half-arrived can never corrupt the ones that finished.

Not fast. But it finishes, which is the only thing that matters here.
"""

import io
import os
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

URL = "https://github.com/ollama/ollama/releases/download/v0.40.3/OllamaSetup.exe"
EXPECTED = 1578217944
CHUNK = 50 * 1024 * 1024

TEMP = os.environ["TEMP"]
PARTS = os.path.join(TEMP, "ollama-parts")
DEST = os.path.join(TEMP, "OllamaSetup.exe")

CURL = os.path.join(os.environ["SystemRoot"], "System32", "curl.exe")


def part_path(index: int) -> str:
    return os.path.join(PARTS, f"p{index:04d}.bin")


def download(index: int, start: int, end: int) -> bool:
    """Fetch one range. Returns True only if it arrived complete."""
    target = part_path(index)
    if os.path.exists(target) and os.path.getsize(target) == end - start + 1:
        return True

    for _ in range(4):
        try:
            result = subprocess.run(
                [
                    CURL, "-sL", "--max-time", "180",
                    "-H", f"Range: bytes={start}-{end}",
                    "-o", target, URL,
                ],
                capture_output=True,
                timeout=200,
            )
        except subprocess.TimeoutExpired:
            print(f"      chunk {index}: timeout")
            continue

        got = os.path.getsize(target) if os.path.exists(target) else 0
        if got == end - start + 1:
            return True

        print(f"      chunk {index}: {got / 2**20:.0f} MB of "
              f"{(end - start + 1) / 2**20:.0f} MB, dobara")
        time.sleep(4)

    return False


def main() -> int:
    os.makedirs(PARTS, exist_ok=True)

    total_chunks = (EXPECTED + CHUNK - 1) // CHUNK
    print(f"{EXPECTED / 2**20:.0f} MB, {total_chunks} chunks of 50 MB")
    print("(pehle ka 1085 MB bacha hai — woh chunk 0-21 dobara aayenge)\n")

    done_bytes = 0
    for index in range(total_chunks):
        start = index * CHUNK
        end = min(start + CHUNK, EXPECTED) - 1
        size = end - start + 1

        if download(index, start, end):
            done_bytes += size
            print(f"  chunk {index + 1}/{total_chunks}  "
                  f"{done_bytes / 2**20:6.0f} MB  ({done_bytes / EXPECTED * 100:5.1f}%)")
        else:
            print(f"  chunk {index + 1}/{total_chunks}  FAILED")
            print("\nConnection abhi sahi nahi chal rahi. Dobara chalane se")
            print("jahan chhoda tha wahin se chalega — purana kaam nahi jayega.")
            return 1

    print("\nsaare chunks aa gaye. jod raha hoon...")
    with open(DEST, "wb") as out:
        for index in range(total_chunks):
            with open(part_path(index), "rb") as part:
                while True:
                    block = part.read(1024 * 1024)
                    if not block:
                        break
                    out.write(block)

    final = os.path.getsize(DEST)
    if final != EXPECTED:
        print(f"jodne ke baad size galat: {final} != {EXPECTED}")
        return 1

    print(f"poora file ban gaya: {final / 2**20:.0f} MB")
    print("\nAb install chalana hai:")
    print(f'  {DEST} /S')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())