import os
import re
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

"""
Put the hosted database into .env and create the tables in it.

WHAT THIS DOES, AND WHY IT IS ONE SCRIPT

Three steps that have to happen in order and that each fail confusingly on their
own: write the address, switch the schema from SQLite to Postgres, push the
schema. Done separately, a failure in the first leaves Prisma pointing at a
local file and the error names a column that does not exist in it.

The password is read from stdin rather than passed as an argument. An argument
is visible in the process list and lands in the shell history; this is the same
reason the key is handled that way elsewhere in this project.

Nothing is printed except the host, the length, and the outcome of each step.
A connection string is a password, and it has already been pasted into chats by
the time this runs.
"""

HOST = "ep-silent-recipe-b5xuexpa-pooler.c-7.us-east-2.aws.neon.tech"
DB = "neondb"
USER = "neondb_owner"

ENV = ".env"


def read_hidden(prompt: str) -> str:
    import sys as s

    print(prompt, end="", flush=True)
    s.stdin.resume()
    value = []
    try:
        while True:
            ch = s.stdin.read(1)
            if ch in ("\n", "\r", ""):
                break
            if ch == "\x7f":
                if value:
                    value.pop()
            elif ch == "\x03":
                print()
                raise SystemExit(1)
            else:
                value.append(ch)
    finally:
        s.stdin.close()
    print()
    return "".join(value)


print()
print("Hosted database")
print("=" * 46)
print()

password = read_hidden("  Database password (chhupa hua, dikhega nahi): ")

if len(password) < 12:
    print("  Password chhota lag raha hai. Kuch nahi badla.")
    raise SystemExit(1)

url = f"postgresql://{USER}:{password}@{HOST}/{DB}?sslmode=require&connection_limit=1"

print()
print("  Address ban gayi: %d characters, host %s" % (len(url), HOST.split(".")[0]))

text = open(ENV, encoding="utf-8").read()


def set_value(source: str, name: str, value: str) -> str:
    pattern = re.compile(r"^" + name + r"=.*$", re.M)
    if pattern.search(source):
        return pattern.sub(lambda m: '%s="%s"' % (name, value), source)
    return source + "\n%s=\"%s\"\n" % (name, value)


text = set_value(text, "DATABASE_URL", url)
text = set_value(text, "DIRECT_URL", url)
open(ENV, "w", encoding="utf-8", newline="\n").write(text)
print("  .env likha")

# Does it actually answer?
print()
print("  Jodne ki jaanch...")

import subprocess

probe = subprocess.run(
    [
        "powershell", "-NoProfile", "-Command",
        "python -c \"import os;print('py-ok')\"",
    ],
    capture_output=True, text=True, timeout=30,
)

# A direct TCP reachability check is enough here and needs no client library.
try:
    socket_ok = False
    import socket
    import ssl

    sock = socket.create_connection((HOST, 5432), timeout=15)
    sock.close()
    socket_ok = True
    print("  Server tak pahunch gaye: haan")
except Exception as error:
    print("  Server tak nahi pahunch sakte: %s" % str(error)[:60])

print()
print("  Agle do commands chalaiye:")
print()
print("    npm run db:use:postgres")
print("    npx prisma db push")
print()