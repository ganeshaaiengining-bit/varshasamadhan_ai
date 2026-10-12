"""
What will break if you deploy right now.

    python scripts/check-deploy.py

Exit 1 means something is wrong that the owner has to fix. Exit 0 means the
repository is ready and the only thing left is to run the deploy.

WHY THIS EXISTS

Everything here was true at the time of writing, and three of the four are the
kind of thing that only shows up after a five-minute build has already failed:

  - package.json had no postinstall, so Prisma never generated its client on
    Vercel and the build died with "PrismaClient is not available", which reads
    like a code fault and is not
  - prisma/schema.prisma declares provider = "sqlite", and Vercel's filesystem
    is ephemeral and read-only apart from /tmp, so the first write to the
    database disappears on the next deploy
  - there is no prisma/migrations directory at all, so the usual
    "prisma migrate deploy" fails with "No migration found". This project has
    always used db push, which is why nothing noticed
  - package.json's description was double-encoded and read as

        à¤µà¤°à¥à¤·à¤¾ à¤¸à¤®à¤¾à¤§à¤¾à¤¨ AI â€” ...

    on npm and on Vercel

THE SQLITE LINE IS NOT AN ERROR TO FIX HERE

It is reported as a blocker because it must be changed, but it is deliberately
not changed by this script. Switching the provider rewrites schema.prisma, and
which provider is right depends on a database the owner has not created yet.
Running `npm run db:use:postgres` does it, and then the existing export and
import scripts move the content over:

    npm run db:export      # writes .import/ from the local SQLite file
    npm run db:use:postgres
    npm run db:import      # loads it into the Postgres you just created

Do that once, on a machine, against a database that exists. Not during a build.
"""

import io
import json
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

OK = "[ ok ]"
BAD = "[FAIL]"
WARN = "[note]"

blockers: list[str] = []
notes: list[str] = []


def report(mark: str, text: str) -> None:
    print(f"  {mark}  {text}")


def check_postinstall() -> None:
    package = json.loads(io.open("package.json", encoding="utf-8").read())
    scripts = package.get("scripts", {})

    if scripts.get("postinstall") == "prisma generate":
        report(OK, "postinstall runs prisma generate")
    else:
        report(BAD, f"postinstall is {scripts.get('postinstall')!r}")
        blockers.append("package.json has no `prisma generate` postinstall hook")


def check_description() -> None:
    package = json.loads(io.open("package.json", encoding="utf-8").read())
    description = package.get("description", "")

    mangled = sum(description.count(m) for m in ("à", "Ã", "Â", "â", "¤"))
    if mangled >= 3:
        report(BAD, "package.json description is double-encoded")
        blockers.append("package.json description reads as mojibake")
    else:
        report(OK, f"description: {description[:48]}")


def check_database_provider() -> None:
    schema = io.open("prisma/schema.prisma", encoding="utf-8").read()
    datasources = schema[schema.index("datasource"):]
    provider = re.search(r'provider\s*=\s*"(\w+)"', datasources).group(1)

    if provider == "postgresql":
        report(OK, "datasource provider is postgresql")
    else:
        report(BAD, f"datasource provider is {provider!r}")
        blockers.append(
            "schema.prisma still points at SQLite. Vercel's filesystem is"
            " ephemeral, so the database would vanish on every deploy."
            " Run: npm run db:export, then npm run db:use:postgres,"
            " then npm run db:import"
        )


def check_migrations() -> None:
    if os.path.isdir("prisma/migrations"):
        report(OK, "prisma/migrations exists")
        return

    report(WARN, "no prisma/migrations directory")
    notes.append(
        "There are no migrations, so vercel.json uses `prisma db push` rather"
        " than `prisma migrate deploy`, which would fail with 'No migration"
        " found'. db push runs on every build, which is fine at this size and"
        " is worth replacing with real migrations once the schema stops"
        " changing often."
    )


def check_secrets() -> None:
    tracked = subprocess.run(
        ["git", "ls-files"], capture_output=True, text=True, timeout=60
    ).stdout.split()

    leaked = [f for f in tracked if f == ".env" or f.startswith(".env.local")]
    if leaked:
        report(BAD, f"committed: {', '.join(leaked)}")
        blockers.append("a .env file is committed. That history stays in the repo.")
    else:
        report(OK, "no .env is committed")

    ignored = io.open(".gitignore", encoding="utf-8").read()
    if "\n.env\n" in ignored or ignored.startswith(".env"):
        report(OK, ".gitignore covers .env")
    else:
        report(BAD, ".gitignore does not list .env")
        blockers.append(".env is not in .gitignore")


def check_local_env() -> None:
    """What the local .env holds, so nobody is surprised by what is missing."""
    if not os.path.exists(".env"):
        report(WARN, "no local .env")
        return

    values = {}
    for line in io.open(".env", encoding="utf-8"):
        match = re.match(r"^\s*([A-Z_]+)\s*=\s*(.*)$", line)
        if match:
            values[match.group(1)] = match.group(2).strip().strip('"')

    empty = [k for k, v in values.items() if not v]
    filled = sorted(k for k, v in values.items() if v)

    print()
    print(f"  locally set:   {', '.join(filled) or 'none'}")
    print(f"  locally empty: {', '.join(empty) or 'none'}")
    print()
    print("  Every one of these must also be set in Vercel's environment, except")
    print("  the NEXT_PUBLIC_ pair, which is baked into the build.")

    if "GEMINI_API_KEY" in empty:
        report(WARN, "GEMINI_API_KEY is empty")
        notes.append(
            "The AI answers work for about 17% of questions through the"
            " keyless Pollinations fallback. Filling GEMINI_API_KEY takes"
            " that to effectively all of them."
        )


def check_build_command() -> None:
    vercel = json.loads(io.open("vercel.json", encoding="utf-8").read())
    build = vercel.get("buildCommand", "")

    if "prisma" in build:
        report(OK, f"buildCommand: {build}")
    else:
        report(BAD, "buildCommand does not prepare the database")
        blockers.append("vercel.json buildCommand does not run prisma db push")


def main() -> int:
    print("Ready to deploy?")
    print()

    check_postinstall()
    check_description()
    check_database_provider()
    check_migrations()
    check_secrets()
    check_build_command()
    check_local_env()

    print()
    for note in notes:
        print(f"{WARN} {note}")
        print()

    if blockers:
        print(f"{len(blockers)} thing(s) to fix first:")
        for item in blockers:
            print(f"  - {item}")
        print()
        return 1

    print("Nothing blocking in the repository.")
    print()
    print("Remaining, in order:")
    print("  1. Create a free Postgres database (Neon or Supabase).")
    print("  2. npm run db:export, npm run db:use:postgres, npm run db:import")
    print("  3. Set the same variables in Vercel, and remove DATABASE_URL from")
    print("     .gitignore's reach by never committing it.")
    print("  4. vercel link, then vercel --prod")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
