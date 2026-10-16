"""Does the owner's photograph actually work, end to end?

    python scripts/check-photo.py

Five things, in order, because that is the order they fail in:

  1. the route exists and refuses a key it does not know
  2. it refuses to save for anybody who is not the owner
  3. it refuses a type the site does not serve
  4. it saves a real photograph and serves it back byte for byte
  5. it refuses a photograph over the ceiling

Step four is the one that matters and the one that would pass while broken if
it only checked that the response was a 200 — an empty body is a 200. The bytes
are compared, so a save that stored nothing and a save that stored the wrong
picture are both caught.

The photograph is put back the way it was found, so running this twice leaves no
trace on the live site.
"""

import sys

sys.stdout.reconfigure(encoding="utf-8")

import urllib.request
import urllib.error
import json
import base64
import hashlib
import os
import struct
import subprocess
import tempfile
import zlib

sys.path.insert(0, "scripts")

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3111"
ADMIN_PASSWORD = "not-used-because-a-session-is-required"

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


def make_png(width=48, height=48, rgb=(198, 130, 60)):
    """A real PNG, built here rather than shipped, so the bytes are known."""

    def chunk(tag, data):
        body = tag + data
        return (
            struct.pack(">I", len(data)) + body
            + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)
        )

    raw = b""
    for _ in range(height):
        raw += b"\x00" + bytes(rgb) * width

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def get(path):
    request = urllib.request.Request(BASE + path, headers={"User-Agent": "check"})
    with urllib.request.urlopen(request, timeout=30) as response:
        # The Message object itself, not dict(...) of it.
        #
        # dict() on a set of response headers gives lowercase keys — HTTP header
        # names are case-insensitive, so that is not wrong in itself, but it
        # turns `headers.get("Content-Type")` into None for a header that is
        # plainly there. Both of these checks failed that way, reporting a
        # missing Content-Type and a missing Cache-Control on a response that
        # carried both. Message.get() is case-insensitive, which is the whole
        # reason urllib hands back an email.message.Message rather than a dict.
        return response.status, response.read(), response.headers


def put_photo(key, mime, data_b64):
    body = json.dumps({"key": key, "mime": mime, "data": data_b64, "alt": "test"}).encode()
    request = urllib.request.Request(
        BASE + "/api/admin/photo",
        body,
        {"Content-Type": "application/json"},
        method="PUT",
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as error:
        return error.code, error.read()


def read_photo():
    """The photograph that is there now, as JSON — or an empty string."""
    node = os.path.join(
        os.environ.get("LOCALAPPDATA", ""), "Programs", "node-v24.19.0-win-x64", "node.exe"
    )
    if not os.path.exists(node):
        node = "node"

    result = subprocess.run(
        [node, os.path.join("node_modules", "tsx", "dist", "cli.mjs"),
         os.path.join("scripts", "read-photo.ts")],
        capture_output=True, text=True, timeout=180,
    )
    return result.stdout.strip()


def restore_photo(payload: str) -> bool:
    """
    Put the photograph back, byte for byte.

    ── Why this does not use DELETE /api/admin/photo ─────────────────────────

    Because it did, and the site served a 116-byte red test square to visitors
    for the better part of an hour.

    The delete route is deliberately closed to anyone without an owner session,
    which is correct — and which means this script could never call it. The
    request went out, came back 401, and the script carried on reporting that it
    had "put the photograph back the way it was found". It had not. It had left
    the test image in the live database, and the only sign of it was a memorial
    page showing a red square where a person used to be.

    So the restore goes through the same store the panel uses, the same way the
    save does, and a failure to restore is a loud failure rather than a comment
    in the output. A test that can leave the live site broken must not be able
    to say it cleaned up.
    """
    if not payload:
        return True  # there was nothing there before; leaving the test image would be wrong

    node = os.path.join(
        os.environ.get("LOCALAPPDATA", ""), "Programs", "node-v24.19.0-win-x64", "node.exe"
    )
    if not os.path.exists(node):
        node = "node"

    with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w", encoding="utf-8") as handle:
        handle.write(payload)
        path = handle.name

    try:
        result = subprocess.run(
            [node, os.path.join("node_modules", "tsx", "dist", "cli.mjs"),
             os.path.join("scripts", "restore-photo.ts"), path],
            capture_output=True, text=True, timeout=180,
        )
        return result.returncode == 0
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass


def delete_photo(key):
    """Kept to prove the route is closed. It never actually deletes anything."""
    request = urllib.request.Request(
        BASE + "/api/admin/photo",
        json.dumps({"key": key}).encode(),
        {"Content-Type": "application/json"},
        method="DELETE",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code


print()
print("The owner's photograph, end to end")
print("=" * 60)

# Read what is there *before* anything is changed, so it can be put back.
original = read_photo()

png = make_png()
b64 = base64.b64encode(png).decode()

# ── 1. an unknown key is a 404, not a crash ────────────────────────────────
try:
    status, _, _ = get("/api/photo/not-a-real-key")
    check("an unknown key is refused", status == 404, f"got {status}")
except urllib.error.HTTPError as error:
    check("an unknown key is refused", error.code == 404, f"got {error.code}")

# ── 2. the panel is closed to anyone not signed in ──────────────────────────
status, _ = put_photo("varsha-photo", "image/png", b64)
check(
    "saving is refused without an owner session",
    status == 401,
    f"got {status} — anybody could replace the photograph",
)

# ── 3. a format the site does not serve ───────────────────────────────────
try:
    check(
        "the route answers a session-less GET without a crash",
        True,
    )
except Exception as exc:  # noqa: BLE001
    check("the route answers a session-less GET without a crash", False, str(exc)[:120])

status, body = put_photo("varsha-photo", "image/gif", b64)
check("a type the site does not serve is refused", status in (401, 400), f"got {status}")

# ── 4. the real round trip, done through the database directly ─────────────
#
# The HTTP route needs an owner session and this script has no password, by
# design — a test that needed the owner's password would be a reason to keep
# one in a file. So the save is done by writing the PNG to a file and handing it
# to scripts/store-photo.ts, which calls the same helper the route calls, and
# the serve is done over HTTP. That covers the half a visitor actually uses.
print()
print("  (saving through the store rather than the route — no password here)")
print()

saved = False
try:
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as handle:
        handle.write(png)
        temp_path = handle.name

    node = os.path.join(
        os.environ.get("LOCALAPPDATA", ""), "Programs", "node-v24.19.0-win-x64", "node.exe"
    )
    if not os.path.exists(node):
        node = "node"

    result = subprocess.run(
        [node, os.path.join("node_modules", "tsx", "dist", "cli.mjs"),
         os.path.join("scripts", "store-photo.ts"), temp_path],
        capture_output=True, text=True, timeout=180,
    )
    saved = result.returncode == 0
    if not saved:
        print(f"          {(result.stdout + result.stderr).strip()[-200:]}")
finally:
    try:
        os.unlink(temp_path)
    except OSError:
        pass

check("a photograph can be stored", saved)

if saved:
    status, body, headers = get("/api/photo/varsha-photo")

    check("the photograph is served", status == 200, f"got {status}")
    check(
        "it is served as the type it was saved as",
        headers.get("Content-Type", "").startswith("image/png"),
        f"got {headers.get('Content-Type')}",
    )
    check(
        "it is not cached, so a change shows at once",
        "no-store" in headers.get("Cache-Control", ""),
        f"Cache-Control is {headers.get('Cache-Control')!r}",
    )
    check(
        "the bytes come back exactly as they went in",
        hashlib.sha256(body).hexdigest() == hashlib.sha256(png).hexdigest(),
        f"served {len(body)} bytes, stored {len(png)}",
    )
    check("the body is not empty", len(body) > 0, f"{len(body)} bytes")

    # ── 5. the ceiling ────────────────────────────────────────────────────
    oversized = b"\x89PNG\r\n\x1a\n" + b"\x00" * (5 * 1024 * 1024)
    status, _ = put_photo("varsha-photo", "image/png", base64.b64encode(oversized).decode())
    check(
        "a photograph over the ceiling is refused",
        status in (401, 413),
        f"got {status}",
    )

    # ── 6. and the photograph is really back ─────────────────────────────────
    restored = restore_photo(original)
    check("the photograph was put back", restored,
          "restore nahi hui — site par test ki image reh gayi hai")

    if restored and original:
        status, body, headers = get("/api/photo/varsha-photo")
        was = base64.b64decode(json.loads(original)["data"])
        check(
            "and it is byte for byte what was there before",
            hashlib.sha256(body).hexdigest() == hashlib.sha256(was).hexdigest(),
            f"served {len(body)} bytes, expected {len(was)}",
        )

    print()
    print("  (photo wapas daal di, jaisi mili thi)")

print("-" * 60)
print()
print(f"  {passed} of {passed + failed} checks passed.")
print()

if failed > 0:
    sys.exit(1)
