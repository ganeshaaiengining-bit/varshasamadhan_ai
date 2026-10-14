import io
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Send DATABASE_URL and DIRECT_URL to Vercel without either being printed.

Same reasoning as the Gemini key: the value is read from .env and handed to the
child process on standard input, never as an argument, so it does not land in
the shell history, the process list, or this log.

It runs vercel's own entry point with node rather than the vercel command. The
command is an npm shim that resolves through PowerShell's profile, which means
CreateProcess cannot launch it from Python, and the shim's real location
depends on where npm decided to install — not somewhere a fixed path can assume.
"""

ENV = ".env"

WANTED = ["DATABASE_URL", "DIRECT_URL"]

NODE = None
VC_JS = None

for base in (
    os.environ.get("LOCALAPPDATA", ""),
    os.environ.get("APPDATA", ""),
):
    for folder in ("node_modules", "npm/node_modules"):
        candidate = os.path.join(base, folder, "vercel", "dist", "vc.js")
        if os.path.exists(candidate):
            VC_JS = candidate
            break
    if VC_JS:
        break

node_bin = "node"
for base in (
    os.environ.get("LOCALAPPDATA", ""),
    os.environ.get("APPDATA", ""),
):
    for folder in ("Programs/node-v24.19.0-win-x64", ""):
        candidate = os.path.join(base, folder, "node.exe") if folder else os.path.join(base, "node.exe")
        if os.path.exists(candidate):
            node_bin = candidate
            break

if not VC_JS:
    print("  vercel ka entry point nahi mila — chhoda")
    raise SystemExit(1)

print("  using:", VC_JS)

values = {}
for line in io.open(ENV, encoding="utf-8"):
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    name, _, value = line.partition("=")
    values[name.strip()] = value.strip().strip('"').strip("'")

print()
for name in WANTED:
    value = values.get(name)
    if not value:
        print("  %-14s .env me nahi mila — chhoda" % name)
        continue

    result = subprocess.run(
        [node_bin, VC_JS, "env", "add", name, "production"],
        input=value,
        text=True,
        capture_output=True,
    )

    ok = result.returncode == 0
    print("  %-14s %s" % (name, "set" if ok else "FAILED"))

    if not ok:
        output = (result.stdout + result.stderr)
        if value in output:
            output = output.replace(value, "<hidden>")
        for line in output.splitlines()[:6]:
            print("      " + line.strip()[:100])

print()
print("  Check karne ke liye:  vercel env ls")
print()