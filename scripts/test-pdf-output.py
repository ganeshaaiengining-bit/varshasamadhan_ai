"""
Does the printable HTML come out clean, for every article?

    python scripts/test-pdf-output.py

Checked against all published articles rather than one, because the bug this
exists for was invisible in the article used to build it.

The first version of the print window treated a stored block as a single line.
It is not one line. Blocks in this database look like:

    1. **जगह** — दीपक के लिए साफ़-सुथरी जगह, एक थाली।
    2. **दीपक** — घी का दीपक बढ़िया रहता है।      <- five lines, one block

    > जय अम्बे गौरी, मैया जय श्यामा गौरी         <- seven lines, one block,
    > ...                                         every line a quotation

So the PDF showed "1." alone on its own line followed by four unnumbered
paragraphs, and the aarti came out as a single run-on line with its ">" signs
visible. On a printed page that is not untidy layout — it reads as a site that
is broken, which is what the download button exists to avoid.

The assertion is on the *visible text* after tags are stripped, because <ol> and
<ul> are supposed to contain list markers. Checking the raw HTML would either
miss a real leak or force the test to understand the markup.

The rendering rules live in TypeScript inside a client component, so they are
re-implemented here rather than imported. That is a real risk of the two drifting
apart; it is called out at the rules in save-article.tsx — if one changes, so
must this.
"""

import html
import re
import sqlite3
import sys

sys.stdout.reconfigure(encoding="utf-8")

DB = "prisma/dev.db"

# Must not survive into the printed page as literal text.
FORBIDDEN = [
    (r"\*\*", "bold marker"),
    (r"(?<!#)#{1,6}\s", "heading marker"),
    (r"^[-*]\s", "bullet left as text"),
    (r"^\d{1,2}[.)]\s", "number left as text"),
    (r"^>\s", "quotation marker left as text"),
]


def escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(text: str) -> str:
    text = escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def render(summary: str, body: str, category: str, title: str) -> str:
    """Mirror of renderPrintable() in src/components/article/save-article.tsx."""
    head = [f'<p class="category">{escape(category)}</p>']
    if summary:
        head.append(f'<p class="summary">{escape(summary)}</p>')
    head.append(f"<h1>{escape(title)}</h1>")

    out: list[str] = []
    open_tag: str | None = None

    def close() -> None:
        nonlocal open_tag
        if open_tag is not None:
            out.append(f"</{open_tag}>")
            open_tag = None

    def open_list(tag: str) -> None:
        nonlocal open_tag
        if open_tag != tag:
            close()
            out.append(f"<{tag}>")
            open_tag = tag

    for block in body.split("\n\n"):
        if not block.strip():
            continue

        for raw in block.split("\n"):
            line = raw.strip()
            if not line:
                continue

            heading = re.match(r"^(#{1,6})\s+(.*)$", line)
            if heading:
                close()
                level = min(len(heading.group(1)), 3)
                out.append(f"<h{level}>{inline(heading.group(2).strip())}</h{level}>")
                continue

            quote = re.match(r"^>\s?(.*)$", line)
            if quote:
                open_list("blockquote")
                out.append(f"<p>{inline(quote.group(1).strip())}</p>")
                continue

            bullet = re.match(r"^[-*]\s+(.*)$", line)
            if bullet:
                open_list("ul")
                out.append(f"<li>{inline(bullet.group(1).strip())}</li>")
                continue

            numbered = re.match(r"^\d{1,2}[.)]\s+(.*)$", line)
            if numbered:
                open_list("ol")
                out.append(f"<li>{inline(numbered.group(1).strip())}</li>")
                continue

            close()
            out.append(f"<p>{inline(line)}</p>")

    close()
    return "\n".join(head + out)


def visible_text(html_output: str) -> str:
    """
    The text a reader would see, with one line per element.

    Headings are removed first, and that is the one judgement call in this test.
    Six articles number their headings — "## 1. हाथ बार-बार धोएँ", "## 2. ..." —
    so a heading legitimately contains "1. " and the marker check would otherwise
    flag six articles that are printing perfectly. What must never survive is a
    marker in running text: a numbered item that fell through to a paragraph, a
    bullet sign, a bold marker.
    """
    without_headings = re.sub(r"<h[1-6]>.*?</h[1-6]>", "", html_output, flags=re.S)
    return html.unescape(re.sub(r"<[^>]+>", "\n", without_headings))


def main() -> int:
    connection = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    rows = list(
        connection.execute(
            "select slug, title, summary, body from articles where is_published = 1"
        )
    )

    print(f"{len(rows)} published articles\n")

    failures = 0
    stats = {"list items": 0, "headings": 0, "quotes": 0}

    for slug, title, summary, body in rows:
        output = render(summary or "", body or "", "", title)
        text = visible_text(output)

        stats["list items"] += output.count("<li>")
        stats["headings"] += output.count("<h2>") + output.count("<h3>")
        stats["quotes"] += output.count("<blockquote>")

        problems = []
        for pattern, label in FORBIDDEN:
            found = re.search(pattern, text, re.M)
            if found:
                line = next(
                    (l for l in text.split("\n") if re.search(pattern, l, re.M)),
                    "",
                )
                problems.append(f"{label}: {found.group(0)!r}  |  would print: {line[:70]!r}")

        if f"<h1>{escape(title)}</h1>" not in output:
            problems.append("title missing from the page")

        if len(output) < 200:
            problems.append(f"suspiciously short ({len(output)} chars)")

        # An unclosed list tag means the aarti or a five-step block would bleed
        # into whatever follows it.
        for tag in ("ol", "ul", "blockquote"):
            opened = output.count(f"<{tag}>")
            closed = output.count(f"</{tag}>")
            if opened != closed:
                problems.append(f"<{tag}> opened {opened}, closed {closed}")

        if problems:
            failures += 1
            print(f"  FAIL  {slug}")
            for problem in problems[:3]:
                print(f"          {problem}")
        else:
            print(f"  ok    {slug}")

    print()
    print(f"  rendered: {stats['list items']} list items, "
          f"{stats['headings']} headings, {stats['quotes']} quote blocks")

    print()
    if failures:
        print(f"{failures} article(s) would print markers literally.")
        return 1

    print("Har lekh saaf — koi '**', '##', '-' ya '>' chhapt nahi hoga.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())