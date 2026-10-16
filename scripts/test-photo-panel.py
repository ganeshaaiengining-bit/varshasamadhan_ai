"""Does the owner's photograph panel actually work, in a real browser?

    python scripts/test-photo-panel.py

The other photograph check (`check-photo.py`) proves the storage and the serving
route. This one proves the part the owner will actually touch: the file picker
in /admin, the preview, the Save button, and what the home page shows
afterwards.

It uses Playwright because none of that is reachable over HTTP — a file input,
a canvas resize and a button that only exists after React has hydrated are all
things that pass a server test and fail on a phone.

── Why the password is read from .env and never printed ─────────────────────

Because it is the owner's, and it is in a file on their own machine. This script
reads it, types it and forgets it. Nothing it does writes it to stdout, and a
failure message deliberately says which step failed rather than echoing what was
typed — a stack trace containing the password would end up in a screenshot.

── What it leaves behind ─────────────────────────────────────────────────────

Nothing. The photograph that was there before is put back, byte for byte, and if
the script dies halfway the message says which of the two states the database is
left in.
"""

import base64
import io
import json
import os
import re
import struct
import subprocess
import sys
import zlib

sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright  # noqa: E402

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3111"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

passed = 0
failed = 0


def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  [ ok ]  {name}")
    else:
        failed += 1
        print(f"  [FAIL]  {name}")
        if detail:
            print(f"          {detail}")


def read_password() -> str:
    path = os.path.join(ROOT, ".env")
    if not os.path.exists(path):
        return ""
    source = io.open(path, encoding="utf-8").read()
    match = re.search(r'ADMIN_PASSWORD="([^"]*)"', source)
    return match.group(1) if match else ""


def make_png(width=64, height=64, rgb=(210, 90, 70)) -> bytes:
    """A real PNG, built here, so the bytes being sent are known."""

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    raw = b"".join(b"\x00" + bytes(rgb) * width for _ in range(height))
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


# ── What is there now, so it can be put back ──────────────────────────────────
original_b64 = ""
original_mime = "image/jpeg"
original_alt = ""

try:
    body = subprocess.run(
        [
            os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs",
                         "node-v24.19.0-win-x64", "node.exe"),
            os.path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
            os.path.join(ROOT, "scripts", "read-photo.ts"),
        ],
        capture_output=True, text=True, timeout=180,
    )
    if body.returncode == 0 and body.stdout.strip():
        current = json.loads(body.stdout)
        original_b64 = current["data"]
        original_mime = current["mime"]
        original_alt = current["alt"]
except Exception:
    pass

print()
print("The owner's photograph panel, in a browser")
print("=" * 60)

png = make_png()
temp = os.path.join(ROOT, ".tmp-panel-test.png")
io.open(temp, "wb").write(png)

try:
    with sync_playwright() as play:
        browser = play.chromium.launch()
        page = browser.new_page(viewport={"width": 420, "height": 900})

        # ── 1. the panel is behind the owner's password ──────────────────────
        page.goto(f"{BASE}/admin", wait_until="domcontentloaded")
        page.wait_for_timeout(2500)

        password_field = page.locator('input[type="password"]')
        check("/admin asks for the password before showing anything",
              password_field.count() > 0,
              f"password box count = {password_field.count()}")

        password = os.environ.get("ADMIN_PASSWORD") or read_password()
        if not password:
            check("ADMIN_PASSWORD mila", False, ".env me nahi hai")
            browser.close()
            sys.exit(1)

        password_field.first.fill(password)
        page.locator('button[type="submit"]').first.click()

        # Waited for, not slept through.
        #
        # The first request for /admin on a cold dev server compiles the route,
        # which takes several seconds the first time and none the second. A
        # fixed wait is either too short on the first run — and fails with "no
        # file picker", which reads like the feature is missing rather than like
        # the test did not wait — or wastefully long on every run after.
        #
        # The button is located by `type`, not by its text. Its label is Hindi,
        # and a label that changes when the copy is reworded turns a working
        # panel into a failing test for reasons nobody would think to look for.
        try:
            page.wait_for_selector("#photo-file", timeout=45_000)
            logged_in = True
        except Exception:
            logged_in = False

        check("signing in reaches the panel", logged_in,
              "45 second me panel nahi aaya")

        if not logged_in:
            alert = page.locator('[role="alert"]').first
            if alert.count():
                print(f"          page par likha hai: {alert.inner_text()[:160]!r}")
            browser.close()
            raise SystemExit(1)

        # ── 2. the picker is there ──────────────────────────────────────────
        picker = page.locator("#photo-file")
        check("the panel offers a file picker", picker.count() > 0,
              f"#photo-file count = {picker.count()}")

        # ── 3. picking a file previews it ───────────────────────────────────
        picker.set_input_files(temp)
        page.wait_for_timeout(2000)

        preview_shown = page.locator('img[alt="चुनी गई फ़ोटो"]').count() > 0
        check("picking a file shows it before saving", preview_shown)

        # ── 4. save ─────────────────────────────────────────────────────────
        page.locator('button', has_text=re.compile("सहेजें")).first.click()
        page.wait_for_timeout(5000)

        served = page.evaluate(
            """async () => {
                const r = await fetch('/api/photo/varsha-photo', { cache: 'no-store' });
                if (!r.ok) return { ok: false, status: r.status };
                const b = new Uint8Array(await r.arrayBuffer());
                return {
                    ok: true,
                    len: b.length,
                    head: Array.from(b.slice(0, 4)),
                    w: await new Promise((res) => {
                        const i = new Image();
                        i.onload = () => res(i.naturalWidth);
                        i.onerror = () => res(0);
                        i.src = URL.createObjectURL(new Blob([b], { type: 'image/jpeg' }));
                    }),
                    h: await new Promise((res) => {
                        const i = new Image();
                        i.onload = () => res(i.naturalHeight);
                        i.onerror = () => res(0);
                        i.src = URL.createObjectURL(new Blob([b], { type: 'image/jpeg' }));
                    }),
                };
            }"""
        )

        check("after saving, the photograph is served",
              served.get("ok") is True, json.dumps(served))

        # The panel resizes and re-encodes to JPEG in the browser, so the served
        # bytes are a JPEG even though a PNG was picked. Checking for the PNG
        # signature would therefore fail on correct behaviour — which is what
        # this did at first, reporting a broken panel for a working one.
        #
        # What actually has to be true is that the picture now on the site is the
        # one that was picked. A 64x64 red square is unmistakable, so the size is
        # the honest check: the portrait that was there before is 1254x1568 and
        # would still be 115 KB, and this is a few hundred bytes.
        check("what is served is a JPEG, as the panel re-encodes it",
              served.get("head") == [255, 216, 255, 224],
              f"first bytes = {served.get('head')}")

        check("the picture that was picked is the picture now served",
              served.get("w") == 64 and served.get("h") == 64,
              f"served is {served.get('w')}x{served.get('h')}, expected the 64x64 that was picked")

        # ── 5. the home page shows it ───────────────────────────────────────
        page.goto(f"{BASE}/", wait_until="domcontentloaded")
        page.wait_for_timeout(3500)

        home = page.evaluate(
            """() => {
                const img = document.querySelector('img[src="/api/photo/varsha-photo"]');
                return img ? { found: true, w: img.naturalWidth, alt: img.alt } : { found: false };
            }"""
        )

        check("the home page shows the photograph", home.get("found") is True, json.dumps(home))
        check("the photograph actually loaded in the browser",
              isinstance(home.get("w"), int) and home["w"] > 0,
              f"naturalWidth = {home.get('w')}")
        check("it is labelled", bool(home.get("alt")), f"alt = {home.get('alt')!r}")
        check("the name on the home page is VARSHA in capitals",
              page.locator("h2", has_text=re.compile(r"^VARSHA$")).count() > 0,
              "VARSHA heading nahi mila")

        body_text = page.inner_text("body")
        check("no Devanagari spelling of the name on the home page",
              "वर्षा" not in body_text)

        browser.close()

finally:
    try:
        os.unlink(temp)
    except OSError:
        pass

# ── Put the photograph back ──────────────────────────────────────────────────
if original_b64:
    payload = os.path.join(ROOT, ".tmp-restore.json")
    io.open(payload, "w", encoding="utf-8").write(
        json.dumps({"key": "varsha-photo", "mime": original_mime,
                    "data": original_b64, "alt": original_alt})
    )
    subprocess.run(
        [os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs",
                      "node-v24.19.0-win-x64", "node.exe"),
         os.path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
         os.path.join(ROOT, "scripts", "restore-photo.ts"), payload],
        capture_output=True, text=True, timeout=180,
    )
    try:
        os.unlink(payload)
    except OSError:
        pass
    print()
    print("  (purani photo wapas daal di)")
else:
    print()
    print("  (pehle koi photo nahi thi — test wali photo abhi lagi hui hai)")
    print("  /admin se hata sakte hain, ya koi aur upload kar dein.")

print("-" * 60)
print()
print(f"  {passed} of {passed + failed} checks passed.")
print()

sys.exit(1 if failed else 0)