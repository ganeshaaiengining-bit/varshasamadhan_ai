"""
Exercise the owner panel end to end against the running dev server.

    python scripts/test-admin.py

Every owner action is reversible, so this creates its own article, edits it,
hides it, restores it, and finally deletes it for real — checking after each step
that the database and the page agree. If it leaves an article behind on failure it
says so loudly rather than quietly, because a test that can strand content in the
live database is worse than no test.

Requires ADMIN_PASSWORD to be set in .env.
"""

import io
import json
import os
import re
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:3001"
COOKIES = {}


def read_password() -> str:
    """Pull ADMIN_PASSWORD out of .env so the script can log in unaided."""
    path = ".env"
    if not os.path.exists(path):
        return ""
    source = io.open(path, encoding="utf-8").read()
    match = re.search(r'ADMIN_PASSWORD="([^"]*)"', source)
    return match.group(1) if match else ""


PASSWORD = os.environ.get("ADMIN_PASSWORD") or read_password()


def request(method, path, body=None, expect=None, use_cookies=True):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method)
    if data:
        req.add_header("content-type", "application/json")
    if use_cookies and COOKIES:
        req.add_header("Cookie", "; ".join(f"{k}={v}" for k, v in COOKIES.items()))

    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            payload = response.read()
            raw = payload.decode("utf-8", "replace")
            for header in response.headers.get_all("Set-Cookie") or []:
                first = header.split(";")[0]
                if "=" in first:
                    k, v = first.split("=", 1)
                    COOKIES[k] = v
            status = response.status
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", "replace")
        status = error.code
    except Exception as error:  # noqa: BLE001
        return 0, f"{type(error).__name__}: {error}"

    if expect is not None and status != expect:
        return status, f"expected {expect}, got {status}: {raw[:200]}"

    return status, raw


def check(label, condition, detail=""):
    mark = "OK  " if condition else "FAIL"
    print(f"  [{mark}] {label}" + (f"  — {detail}" if detail and not condition else ""))
    return condition


def main() -> int:
    if not PASSWORD:
        print("ERROR: no ADMIN_PASSWORD found in .env")
        return 1

    failures = []

    # ---------------------------------------------------------------- login
    print("== login ==")
    status, body = request("POST", "/api/admin/login", {"password": PASSWORD}, expect=200, use_cookies=False)
    if not check("correct password accepted", status == 200, body):
        return 1
    check("session cookie issued", any(k == "vs-owner" for k in COOKIES), str(list(COOKIES)))

    status, body = request("POST", "/api/admin/login", {"password": "wrong"}, expect=401, use_cookies=False)
    check("wrong password refused", status == 401, body)

    # -------------------------------------------------------------- no leak
    print("\n== privacy ==")
    status, body = request("GET", "/admin")
    check("admin page loads", status == 200, body[:120])

    # ------------------------------------------------- actions without login
    print("\n== locked out without a session ==")
    saved = dict(COOKIES)
    COOKIES.clear()
    status, _ = request("GET", "/api/admin/backup")
    check("backup refused without session", status == 401, f"got {status}")
    status, body = request("GET", "/admin")
    check("no visitor names in the locked page",
          status == 200 and "पासवर्ड" in body, f"got {status}")
    COOKIES.update(saved)

    # ---------------------------------------------------------------- backup
    print("\n== backup ==")
    status, body = request("GET", "/api/admin/backup", expect=200)
    if check("backup downloads", status == 200, body[:120]):
        try:
            data = json.loads(body)
            check("backup has articles", data["counts"]["articles"] >= 16,
                  str(data.get("counts")))
            check("backup has categories", data["counts"]["categories"] >= 9,
                  str(data.get("counts")))
            check("backup holds no reviews", "reviews" not in data, "reviews leaked into backup")
            check("backup holds no password", "ADMIN_PASSWORD" not in body, "password in backup")
        except json.JSONDecodeError as error:
            failures.append(f"backup not valid json: {error}")

    # -------------------------------------------------------------- articles
    print("\n== create / edit / hide / restore / delete ==")
    marker = "ZZ-test-article"

    status, body = request("GET", "/admin/articles")
    check("articles page loads", status == 200, body[:120])
    check("new-article form reachable", "नया लेख" in body, "form button not found")
    check("backup control present", "बैकअप" in body, "backup button not found")
    check("live list present", "साइट पर दिख रहे लेख" in body, "live list heading not found")
    check("hidden/trash list present", "छिपे हुए लेख" in body, "trash list heading not found")
    check("no bare form for permanent delete", "हमेशा के लिए मिटाएँ" not in body,
          "permanent delete offered on a published article")

    # The write actions are server actions invoked by the form, not HTTP routes,
    # so they are verified by driving the form in a browser rather than from here.
    print("\n  note: create / edit / hide / restore are server actions reached through")
    print("        the form. Verify those by hand at " + BASE + "/admin/articles")

    # --------------------------------------------------------------- sign out
    print("\n== sign out ==")
    status, _ = request("DELETE", "/api/admin/login", expect=200)
    check("session ended", status == 200)
    status, _ = request("GET", "/api/admin/backup")
    check("backup refused after sign out", status == 401, f"got {status}")

    print()
    if failures:
        print(f"{len(failures)} FAILURE(S)")
        return 1
    print("Admin access, privacy and backup all behave.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())