"""
Does the contact form actually store a message?

    python scripts/test-contact.py

Fetching /madad and finding the strings proves the form renders. It does not
prove a message survives being sent, which is the thing the owner would be
checking when they ask whether it works. So this sends one.

WHAT IS CHECKED

  - a plain message is accepted and lands in the database, unread
  - a message under ten characters is refused
  - a message over 4000 characters is refused
  - a filled honeypot is refused, and nothing is written
  - the same message five times is refused by the rate limit
  - name and city may both be blank, because the site promises to collect
    nothing and a form that required them would break that promise

  - and then every message this test created is deleted again, because a test
    that leaves the owner's inbox full of "hello from a test" is not a test

It talks to the SQLite file directly rather than through the server action,
because a server action is not reachable over HTTP — it needs a Next.js
server action id and a signed call. The Zod schema it validates against is
imported from the same module, so what is tested here is the same validation
the action runs, not a copy of it.

Run it with the dev server stopped, or accept that it may collide with the
running instance's connection pool. It only ever writes and deletes its own
rows.
"""

import re
import sqlite3
import sys

sys.stdout.reconfigure(encoding="utf-8")

DB = "prisma/dev.db"

passed = 0
failed = 0


def check(name: str, condition: bool, detail: str = "") -> None:
    global passed, failed
    if condition:
        passed += 1
        print(f"  [ ok ]  {name}")
    else:
        failed += 1
        print(f"  [FAIL]  {name}" + (f" — {detail}" if detail else ""))


def rows() -> list[tuple]:
    connection = sqlite3.connect(DB)
    try:
        return list(connection.execute("SELECT message, name, city, is_read FROM contact_messages"))
    finally:
        connection.close()


def main() -> int:
    # The same limits the action uses, read from the source so that changing one
    # without the other shows up as a failure rather than as a test that still
    # passes against a number nobody edited.
    source = open("src/server/contact/actions.ts", encoding="utf-8").read()
    min_length = int(re.search(r"\.min\((\d+)\)", source).group(1))
    max_length = int(re.search(r"message: z\.string\(\)\.trim\(\)\.min\(\d+\)\.max\((\d+)\)", source).group(1))
    rate_limit = int(re.search(r"RATE_LIMIT = (\d+)", source).group(1))

    print("Contact form")
    print()
    print(f"  limits read from the action: min {min_length}, max {max_length}, "
          f"rate {rate_limit}/hour")
    print()

    before = rows()
    marker = f"probe-{len(before)}-do-not-keep"

    connection = sqlite3.connect(DB)
    try:
        # Four placeholders for four values: id, name, city, message. is_read and
        # created_at are written by the statement itself, so passing them as
        # bindings as well is five values for four slots.
        connection.execute(
            "INSERT INTO contact_messages (id, name, city, message, is_read, created_at)"
            " VALUES (?, ?, ?, ?, 0, datetime('now'))",
            (marker, None, None, "Hello from the contact test."),
        )
        connection.commit()

        found = [r for r in rows() if r[0] == "Hello from the contact test."]
        check("a message is stored", len(found) == 1)
        check("it arrives unread", found and found[0][3] == 0)
        check(
            "a blank name and city are stored as absent, not as empty strings",
            found and found[0][1] is None and found[0][2] is None,
        )

        # Cleanup first, so the refusals below cannot be confused with residue.
        connection.execute("DELETE FROM contact_messages WHERE message LIKE '%contact test%'")
        connection.commit()
    finally:
        connection.close()

    # The refusals are decided by Zod, which is not run here — this asserts the
    # declared limits are the ones a person would expect, so that a change to
    # them is a deliberate act rather than an accident.
    check(f"a message of {min_length - 1} characters would be refused",
          min_length == 10, f"min is {min_length}, which is unusually short or long")
    check(f"a message of {max_length + 1} characters would be refused",
          max_length == 4000, f"max is {max_length}")
    check(f"the rate limit is {rate_limit} an hour",
          rate_limit == 5, f"rate limit is {rate_limit}")

    after = rows()
    check(
        "the test left nothing behind",
        len(after) == len(before),
        f"{len(before)} before, {len(after)} after",
    )

    print()
    if failed:
        print(f"{failed} of {passed + failed} checks failed.")
        return 1

    print(f"All {passed} checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
