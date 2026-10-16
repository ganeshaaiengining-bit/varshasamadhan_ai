"""Crop a photograph without needing an image library.

    python scripts/crop-photo.py <in> <out> <x> <y> <w> <h> [quality]

Pillow is not installed on this machine and installing it for one job would put
a dependency on the machine that outlives the job. A browser is already
installed and already knows how to draw one image onto a canvas and read it
back, so that is what this uses.

── Why the crop exists ───────────────────────────────────────────────────────

The photograph the owner gave is a sixteen-by-nine memorial card: her
photograph and a lotus on the left, "GV SEVA" and three lines of text on the
right. The owner does not want GV SEVA anywhere — so the right-hand side is cut
away and only she and the lotus are kept.

── Why the original is kept ──────────────────────────────────────────────────

Because a crop is a decision, not a fact. If the owner later wants the whole
card, the words "Dedicated to the Loving Memory of VARSHA" are only on the
uncropped original, and re-sending it is easier than re-editing it.
"""

import base64
import io
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402


def main() -> int:
    args = sys.argv[1:]

    if len(args) < 6:
        print("  python scripts/crop-photo.py <in> <out> <x> <y> <w> <h> [quality]")
        return 1

    src, dst = args[0], args[1]
    x, y, width, height = (int(v) for v in args[2:6])
    quality = int(args[6]) if len(args) > 6 else 90

    if not os.path.exists(src):
        print(f"  {src} nahi mila")
        return 1

    data = base64.b64encode(io.open(src, "rb").read()).decode()

    with sync_playwright() as play:
        browser = play.chromium.launch()
        page = browser.new_page()
        page.set_content(f"<img id='i' src='data:image/jpeg;base64,{data}'>")

        page.wait_for_function("() => { const i = document.getElementById('i'); return i && i.complete && i.naturalWidth; }")

        size = page.evaluate("() => { const i = document.getElementById('i'); return [i.naturalWidth, i.naturalHeight]; }")
        print(f"  source: {size[0]}x{size[1]}")

        if x + width > size[0] or y + height > size[1]:
            print(f"  crop {x}+{width} ya {y}+{height} image se bada hai")
            browser.close()
            return 1

        # Read the crop out as a JPEG data URL.
        out = page.evaluate(
            """async ({ x, y, w, h, q }) => {
                const i = document.getElementById('i');
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                const g = c.getContext('2d');
                g.fillStyle = '#fff';
                g.fillRect(0, 0, w, h);
                g.drawImage(i, x, y, w, h, 0, 0, w, h);
                return c.toDataURL('image/jpeg', q);
            }""",
            {"x": x, "y": y, "w": width, "h": height, "q": quality},
        )

        browser.close()

    io.open(dst, "wb").write(base64.b64decode(out.split(",", 1)[1]))

    print(f"  wrote {dst}: {width}x{height}, {int(os.path.getsize(dst) / 1024)} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())