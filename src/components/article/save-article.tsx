'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { useLanguage } from '@/components/language/language';

/**
 * ===========================================================================
 *  SAVE AN ARTICLE — PDF, or plain text
 * ===========================================================================
 *
 * Two buttons on every article: take it away with you.
 *
 * ── Why a visitor wants this ───────────────────────────────────────────────
 *
 * The audience is people who read on a phone, often with a slow connection,
 * and who may need the same advice again later. Anything they cannot keep, they
 * have to look up a second time — and the second time they may not find it,
 * because search on a phone is exactly the thing that is hardest for them.
 *
 * Printing was already possible with the browser's own menu, but that is three
 * hidden taps deep and prints the navigation, the footer and the page numbers
 * around the advice. For somebody who needs the answer itself, that is noise.
 *
 * ── Why PDF is generated in the browser ────────────────────────────────────
 *
 * The text is already here. Sending it to a server to be turned into a file
 * would mean the article, and then the PDF, makes two round trips over a
 * connection that is sometimes down — and this is a help site for people who
 * cannot afford a failed request.
 *
 * `window.print()` is used rather than a PDF library, because the browser's own
 * writer produces a real, searchable, selectable PDF on every device, in every
 * language's own script, with no 400 kB of JavaScript. What it does not do is
 * print just this article, so the stylesheet prints a clean version — see
 * `article-print` below.
 */

/** Filenames must survive every filesystem, so the title is reduced to this. */
function fileName(title: string, extension: string): string {
  const safe = title
    // Anything that is not a letter, digit, space or a hyphen becomes a hyphen.
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return `varsha-samadhan-${safe || 'lekh'}.${extension}`;
}

export function SaveArticle({
  title,
  summary,
  body,
  categoryTitle,
}: {
  title: string;
  summary: string;
  /** Plain paragraphs, separated by a blank line — the same text as on the page. */
  body: string;
  categoryTitle: string;
}) {
  const { t } = useLanguage();
  const [busy, setBusy] = React.useState<'pdf' | 'txt' | null>(null);

  /**
   * The plain-text file.
   *
   * Built as a Blob rather than a data: URL because a long article's base64
   * exceeds the length some browsers cap a data URL at, and the failure is a
   * silent "nothing downloaded" that is very hard to diagnose.
   */
  const downloadText = () => {
    setBusy('txt');

    try {
      const header = `${title}\n${'='.repeat(title.length)}\n\n${categoryTitle}\n\n`;
      const text = header + body + '\n\n— — —\n' + t('footer.rights') + '\n';

      // A BOM, so Notepad on Windows opens Devanagari and Tamil correctly.
      // Without it the file opens as mojibake, which reads to the visitor as a
      // broken download rather than as a missing character.
      const blob = new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName(title, 'txt');
      link.click();

      // Revoked immediately after the click: leaving it leaks the blob for as
      // long as the tab is open, and the download has already started by then.
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  };

  /**
   * The PDF.
   *
   * Opens a clean, article-only window and lets the browser print it. This is
   * not a hack — it is the only way to get a real PDF with proper font shaping
   * for Devanagari, Tamil and Arabic on a machine with no idea what fonts the
   * reader has. A library that draws its own text gets conjuncts wrong in
   * exactly the languages this site exists for.
   */
  const downloadPdf = () => {
    setBusy('pdf');

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        // Blocked. A popup blocker is doing its job; say so rather than doing
        // nothing and leaving the visitor wondering.
        window.alert(t('download.blocked'));
        return;
      }

      /*
       * Written as one document. A separate stylesheet would be a second request
       * on a connection that may be the reason the visitor is here at all.
       *
       * `print-color-adjust` is kept so a heading printed in the site's saffron
       * stays saffron; without it every browser strips colour and the one thing
       * that separates the emergency line from the rest disappears on paper.
       */
      printWindow.document.write(`<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { margin: 18mm 16mm; }
  body {
    font-family: 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans',
                 'Nirmala UI', system-ui, sans-serif;
    line-height: 1.75;
    color: #1a1a1a;
    max-width: 42em;
    margin: 0 auto;
    font-size: 12.5pt;
  }
  h1 { font-size: 19pt; line-height: 1.4; margin: 0 0 4pt; }
  .summary { color: #555; font-size: 12pt; margin: 0 0 14pt; }
  .category {
    font-size: 9pt; letter-spacing: .08em; text-transform: uppercase;
    color: #a1560f; margin: 0 0 6pt;
  }
  h2 { font-size: 15pt; margin: 18pt 0 6pt; border-top: 1px solid #ddd; padding-top: 10pt; }
  h3 { font-size: 13pt; margin: 12pt 0 4pt; }
  li { margin: 5pt 0; }
  strong { font-weight: 700; }
  .help {
    border: 1.5pt solid #b91c1c; background: #fef2f2; color: #7f1d1d;
    padding: 10pt; margin: 16pt 0; font-weight: 700; font-size: 13pt;
    text-align: center;
  }
  footer {
    margin-top: 22pt; padding-top: 10pt; border-top: 1px solid #ddd;
    font-size: 9.5pt; color: #666;
  }
  .no-print {
    position: fixed; top: 12px; right: 12px;
    font: 600 14px system-ui; padding: 10px 18px; cursor: pointer;
    background: #1a1a1a; color: #fff; border: 0; border-radius: 8px;
  }
  @media print { .no-print { display: none; } }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()">${escapeHtml(t('download.printNow'))}</button>
${renderPrintable(summary, body, categoryTitle)}
<footer>${escapeHtml(t('footer.rights'))}</footer>
</body>
</html>`);

      printWindow.document.close();
      printWindow.focus();

      /*
       * Printing is left to the visitor rather than fired automatically.
       *
       * `window.print()` straight after writing a document prints whatever has
       * loaded so far, and on a slow connection that is a blank page. Waiting
       * for onload and then asking means the choice — print, or save as PDF —
       * is theirs, which is also the only way to get "Save as PDF" on Android.
       */
      printWindow.addEventListener('load', () => printWindow.print());
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={downloadPdf}
        disabled={busy !== null}
        className="btn-outline !min-h-[2.75rem] !px-4 text-sm disabled:opacity-60"
      >
        <Icon name="book" size={16} />
        {busy === 'pdf' ? t('download.preparing') : t('download.pdf')}
      </button>

      <button
        type="button"
        onClick={downloadText}
        disabled={busy !== null}
        className="btn-outline !min-h-[2.75rem] !px-4 text-sm disabled:opacity-60"
      >
        <Icon name="scroll" size={16} />
        {busy === 'txt' ? t('download.preparing') : t('download.text')}
      </button>
    </div>
  );
}

/** Escaped, because the article text is the owner's, and a stray & breaks the page. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * The same block parser the page uses, turned into printable HTML.
 *
 * Duplicated rather than imported because the page's version returns JSX and this
 * one returns a string for a `document.write`. The rules are identical and are
 * commented at both ends; if one is changed the other must be.
 */
function renderPrintable(summary: string, body: string, categoryTitle: string): string {
  const parts: string[] = [
    `<p class="category">${escapeHtml(categoryTitle)}</p>`,
  ];

  if (summary) parts.push(`<p class="summary">${escapeHtml(summary)}</p>`);

  for (const block of body.split(/\n{2,}/)) {
    const text = block.trim();
    if (!text) continue;

    // A line that is only a number followed by a dot is a numbered item.
    const numbered = text.match(/^(\d+)[.)]\s+(.*)$/s);
    if (numbered) {
      parts.push(
        `<p><strong>${escapeHtml(numbered[1])}.</strong> ${inline(text.slice(numbered[0].indexOf(numbered[1]) + numbered[1].length).trim())}</p>`,
      );
      continue;
    }

    if (text.startsWith('**') && text.endsWith('**') && text.indexOf('\n') === -1) {
      parts.push(`<p><strong>${escapeHtml(text.replace(/\*\*/g, ''))}</strong></p>`);
      continue;
    }

    parts.push(`<p>${inline(text)}</p>`);
  }

  return parts.join('\n');
}

/** Paragraph-internal markdown: **bold** only. Nothing else is honoured. */
function inline(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}