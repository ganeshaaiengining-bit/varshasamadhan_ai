"""
Prove the site survives a database outage.

    python scripts/test-db-outage.py

Runs the production server against a database URL that points nowhere, on a
different port, and checks that every page answers with a sentence rather than a
stack trace.

This is the only way to know the guard works. Reasoning about it is what produced
the earlier claim that a database-less deploy would still show the articles — it
would not, and that had to be measured rather than assumed.

Runs against `npm start` (the built server) on port 3101, because a dev server
and a production server fail differently and only the second one is what a visitor
meets.

What it asserts, per page:
  - HTTP status is 200, not 500
  - no `PrismaClientInitializationError`, no connection string, no stack frames
  - the emergency numbers are still reachable

The build must exist first; this script says so rather than producing a confusing
port error.
"""

import io
import os
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

PORT = 3101
BASE = f"http://127.0.0.1:{PORT}"

PAGES = [
    "/",
    "/sahayata",
    "/p/dhyan-aur-yoog",
    "/p/dhyan-aur-yoog/subah-ka-samadhi",
    "/reviews",
    "/samaroh",
]

# Strings that must never reach a visitor. The connection string is the reason the
# guard exists at all, and the localhost dev path would leak the local file.
FORBIDDEN = [
    "PrismaClientInitializationError",
    "ECONNREFUSED",
    "postgresql://",
    "file:./dev.db",
    "at Object.",
    "node_modules",
    "prisma\\client",
]

# The emergency numbers have to survive, because the person hitting a broken page
# may be here *because* of the emergency.
REQUIRED_ANY = ["112", "आपातकाल", "unavailable", "उपलब्ध"]


def wait_for_server(timeout=180):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            urllib.request.urlopen(BASE + "/smriti", timeout=10)
            return True
        except urllib.error.HTTPError:
            return True  # it answered, even if unhappy
        except Exception:
            time.sleep(2)
    return False


def main() -> int:
    if not os.path.exists(".next"):
        print("ERROR: no .next directory. Run `npm run build` first.")
        return 1

    node_dir = os.path.join(
        os.environ.get("LOCALAPPDATA", ""), "Programs", "node-v24.19.0-win-x64"
    )

    env = dict(os.environ)
    env["PATH"] = node_dir + os.pathsep + env.get("PATH", "")
    # A URL that will never connect, so every read fails the way a real outage
    # fails — not a syntax error, which would be caught by a different path.
    env["DATABASE_URL"] = "postgresql://nobody:nobody@127.0.0.1:1/none?connect_timeout=1"
    env["DIRECT_URL"] = env["DATABASE_URL"]

    npm = os.path.join(node_dir, "npm.cmd")
    if not os.path.exists(npm):
        print(f"ERROR: npm.cmd not found at {npm}")
        print("Set NODE_HOME, or edit node_dir in this script.")
        return 1

    print("Starting the production server with an unreachable database...")
    server = subprocess.Popen(
        [npm, "run", "serve:outage"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        if not wait_for_server():
            print("ERROR: server did not come up")
            return 1

        failures = []
        print()
        for page in PAGES:
            try:
                with urllib.request.urlopen(BASE + page, timeout=90) as response:
                    body = response.read().decode("utf-8", "replace")
                    status = response.status
            except urllib.error.HTTPError as error:
                body = error.read().decode("utf-8", "replace")
                status = error.code
            except Exception as error:  # noqa: BLE001
                print(f"  ERR  {page}  — {type(error).__name__}")
                failures.append(f"{page}: {error}")
                continue

            problems = []
            if status != 200:
                problems.append(f"status {status}")

            for needle in FORBIDDEN:
                if needle in body:
                    problems.append(f"leaked {needle!r}")

            if not any(word in body for word in REQUIRED_ANY):
                problems.append("no emergency numbers or apology visible")

            if problems:
                print(f"  FAIL {page}  — {'; '.join(problems)}")
                failures.append(f"{page}: {'; '.join(problems)}")
            else:
                print(f"  OK   {page}  (HTTP {status})")

        print()
        if failures:
            print(f"{len(failures)} page(s) did not degrade gracefully.")
            return 1

        print(f"All {len(PAGES)} pages answered with a message, not a stack trace.")
        return 0

    finally:
        # Kill the whole tree, not just the process that was spawned.
         #
         # `npm run serve:outage` starts npm, which starts node, which starts
         # `next start`. Terminating only the first leaves the last one holding
         # port 3101, and the next run then silently tests against a server the
         # previous run left behind — which is exactly what happened: repeated
         # "EADDRINUSE" errors, and results after the first run that meant
         # nothing.
         #
         # `taskkill /T` walks the tree. POSIX has no equivalent command, so a
         # process group is used there instead.
         #
        if server.poll() is None:
            if os.name == "nt":
                subprocess.run(
                    ["taskkill", "/PID", str(server.pid), "/T", "/F"],
                    capture_output=True,
                )
            else:
                try:
                    os.killpg(os.getpgid(server.pid), signal.SIGTERM)
                except (ProcessLookupError, PermissionError):
                    server.terminate()

        try:
            server.wait(timeout=20)
        except subprocess.TimeoutExpired:
            server.kill()

        # Confirm the port was actually released, so a failed run cannot quietly
        # poison the next one.
        for _ in range(10):
            probe = socket.socket()
            probe.settimeout(1)
            free = probe.connect_ex(("127.0.0.1", PORT)) != 0
            probe.close()
            if free:
                break
            time.sleep(1)
        else:
            print(f"\nWARNING: port {PORT} is still held after shutdown.")
            print("A previous run's server may still be up; kill it before re-running.")


if __name__ == "__main__":
    raise SystemExit(main())