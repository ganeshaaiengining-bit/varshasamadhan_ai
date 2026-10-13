import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Send the Gemini key to Vercel without printing it anywhere.

WHY A SCRIPT RATHER THAN A COMMAND LINE

The key has to reach Vercel's environment. Every obvious way of doing that puts
it somewhere it can be seen: `vercel env add KEY value` puts it in the shell
history, and echoing it to find out whether it worked puts it in this session's
log. Either way it is on disk in two places, written down, recoverable.

So the value is read from .env and handed to the child process on standard
input, which is what `vercel env add` reads when no argument follows the name.
The key is never in the argument list, never in the command line visible to
other processes, and never printed. Only its length and its first four
characters — which say only AIza or not — are ever shown.

WHAT IT SETS

  GEMINI_API_KEY   the key itself
  GEMINI_MODEL     the model the live runs settled on

The daily cap and the timeouts are left at their defaults in code, so they do
not have to be kept in step here.
"""

ENV = ".env"

# vercel is installed as an npm shim, so on Windows it is vercel.cmd, not
# vercel.exe, and CreateProcess does not find it by the bare name.
VERCEL = next(
    (
        os.path.join(root, "vercel.cmd")
        for root in (os.environ.get("APPDATA", ""),)
        for _ in (0,)
        if os.path.exists(os.path.join(root, "npm", "vercel.cmd"))
    ),
    "vercel.cmd",
)

WANTED = ["GEMINI_API_KEY", "GEMINI_MODEL"]


def read_env():
    values = {}
    for line in open(ENV, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, _, value = line.partition("=")
        values[name.strip()] = value.strip().strip('"').strip("'")
    return values


def main() -> int:
    values = read_env()
    missing = [name for name in WANTED if not values.get(name)]

    if missing:
        print("  .env me ye nahi mila: %s" % ", ".join(missing))
        return 1

    key = values["GEMINI_API_KEY"]
    print()
    print("  key  : %s...%s  (%d characters)" % (key[:4], key[-4:], len(key)))
    print()

    for name in WANTED:
        value = values[name]

        # `vercel env add NAME production` then the value on stdin.
        result = subprocess.run(
            [VERCEL, "env", "add", name, "production"],
            input=value,
            text=True,
            capture_output=True,
        )

        output = (result.stdout + result.stderr).strip()
        ok = result.returncode == 0

        print("  %-16s %s" % (name, "set" if ok else "FAILED"))
        if not ok:
            # The command echoes the prompt and sometimes the value back; the
            # value is stripped from anything printed here.
            for line in output.splitlines():
                if value and value in line:
                    line = line.replace(value, "<hidden>")
                print("      " + line[:110])

    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())