import glob
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

"""
Send every secret to Vercel without printing any of them.

WHY A SCRIPT RATHER THAN A COMMAND LINE

A secret has to reach Vercel's environment. Every obvious way of doing that puts
it somewhere it can be seen: `vercel env add KEY value` puts it in the shell
history, and echoing it to find out whether it worked puts it in this session's
log. Either way it is on disk in two places, written down, recoverable.

So each value is read from .env and handed to the child process on standard
input, which is what `vercel env add` reads when no argument follows the name.
No value is ever in an argument list, never in a command line another process
could read, and never printed. What is printed is the length and the first four
characters, which say only AIza or not.

WHAT IT SETS

  GEMINI_API_KEY   the Gemini key
  GEMINI_MODEL     the model the live runs settled on
  DATABASE_URL     the pooled connection string
  DIRECT_URL       the direct one, which Prisma uses for migrations

The database two were added when the password had to be rotated. That rotation is
exactly the case this script exists for: the new password is written into .env by
set-db-from-clipboard.py, comes here, and goes to Vercel, without being printed
once in between.

The daily cap and the timeouts are left at their defaults in code, so they do not
have to be kept in step here.
"""

ENV = ".env"

# ── where the CLI actually is ────────────────────────────────────────────────
#
# It was looked for in APPDATA, which is where npm puts global packages on most
# machines and not on this one. The lookup fell through to the bare name,
# CreateProcess could not find it, and every send reported FAILED with no cause
# given — which reads as a network problem and is not one. So every place it has
# actually been found on this machine is now looked in, newest guess first.


def find_node() -> str | None:
    """node.exe next to the python we are running under, or anywhere else."""
    here = os.path.join(os.path.dirname(sys.executable))
    for name in ("node.exe",):
        path = os.path.join(here, name)
        if os.path.exists(path):
            return path

    for pattern in (
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "node-*", "node.exe"),
        os.path.join(os.environ.get("ProgramFiles", ""), "nodejs", "node.exe"),
    ):
        found = sorted(glob.glob(pattern))
        if found:
            return found[-1]

    return None


def find_vercel() -> tuple[list[str], str]:
    """The command that runs the CLI, and a note of which kind it is."""
    npm_shims = [
        os.path.join(os.environ.get("APPDATA", ""), "npm", "vercel.cmd"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "npm", "vercel.cmd"),
    ]
    for shim in npm_shims:
        if os.path.exists(shim):
            return [shim], "npm shim"

    node = find_node()
    vc_js = sorted(
        glob.glob(
            os.path.join(
                os.environ.get("LOCALAPPDATA", ""),
                "Programs", "node-*", "node_modules", "vercel", "dist", "vc.js",
            )
        )
    )
    if node and vc_js:
        return [node, vc_js[-1]], "node + vc.js"

    return ["vercel.cmd"], "not found"


COMMAND, VERCEL_KIND = find_vercel()


def run(args, value=None):
    """Run the CLI, passing the value on stdin when there is one."""
    return subprocess.run(
        COMMAND + args,
        input=value,
        text=True,
        capture_output=True,
    )


WANTED = ["GEMINI_API_KEY", "GEMINI_MODEL", "DATABASE_URL", "DIRECT_URL"]


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
    print()
    print("Secrets se Vercel")
    print("=" * 46)
    print()
    print("  vercel: %s  (%s)" % (" ".join(COMMAND), VERCEL_KIND))
    print()

    if VERCEL_KIND == "not found":
        print("  vercel CLI nahi mili — kuch nahi bheja gaya.")
        print()
        return 1

    values = read_env()
    missing = [name for name in WANTED if not values.get(name)]

    if missing:
        print("  .env me ye nahi mila: %s" % ", ".join(missing))
        print()
        return 1

    key = values["GEMINI_API_KEY"]
    print("  key  : %s...  (%d characters)" % (key[:4], len(key)))
    db = values["DATABASE_URL"]
    host = db.split("@")[-1].split("/")[0].split("?")[0]
    print("  host : %s" % host)
    print()

    failed = []

    for name in WANTED:
        value = values[name]

        # `vercel env add NAME production` then the value on stdin.
        result = run(["env", "add", name, "production"], value=value)

        output = (result.stdout + result.stderr).strip()
        ok = result.returncode == 0

        print("  %-16s %s" % (name, "set" if ok else "FAILED"))
        if not ok:
            failed.append(name)
            # The command echoes the prompt and sometimes the value back; the
            # value is stripped from anything printed here.
            for line in output.splitlines():
                if value and value in line:
                    line = line.replace(value, "<hidden>")
                print("      " + line[:110])

    print()

    if failed:
        print("  Ye set nahi hue: %s" % ", ".join(failed))
        print()
        return 1

    print("  Sab set ho gaya. Ab deploy chahiye:")
    print()
    print("    vercel --prod --yes")
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
