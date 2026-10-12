'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { useLanguage } from '@/components/language/language';

/**
 * ===========================================================================
 *  ATTACH A DOCUMENT — the visitor's own file, read and answered
 * ===========================================================================
 *
 * Lets somebody ask a question *about their own paper* instead of about the
 * site's articles: a bank's letter, a hospital slip, a legal notice, a school
 * result, a photograph of a prescription.
 *
 * ── Why this is the most-requested thing on the site ───────────────────────
 *
 * Every article here is general. The question people actually bring is specific:
 * "is this letter from the bank legitimate", "what does this slip say", "is this
 * medicine the one I was given". Both of those are questions about *a document in
 * the visitor's hand*, and no amount of writing general articles answers them.
 *
 * ── What is read, and where ────────────────────────────────────────────────
 *
 * Text is extracted in the browser, not on the server. That is a deliberate
 * privacy decision and the site's own front page makes a promise about personal
 * information that this is the feature most likely to break:
 *
 *   - the file is never uploaded to our server, so it is never stored, logged,
 *     or in the database for the owner to browse;
 *   - only the extracted text is sent to the model, alongside the question;
 *   - a bank letter contains an account number and a signature, and neither
 *     should end up on a disk because someone asked what it said.
 *
 * The cost is that a scanned PDF — an image of a page rather than selectable
 * text — has nothing to extract. That is handled and explained rather than
 * failing silently; see `describeScan`.
 *
 * ── Photographs ────────────────────────────────────────────────────────────
 *
 * An image cannot be turned into text here without a model that can read one.
 * So an image is passed to the model as an image, not as extracted text, and the
 * server route forwards it as a real image part. Every provider currently wired
 * up except Gemini cannot accept images, so photographs need the owner's key —
 * which is honest, and is the strongest possible argument for getting it.
 */

/** What the visitor attached, ready to be sent with their question. */
export interface Attachment {
  name: string;
  /** Bytes. Shown so somebody can see they attached the right file. */
  size: number;
  /** How the server should interpret it. */
  kind: 'image' | 'text';
  /** Extracted text, for documents. Base64 data URL, for photographs. */
  text?: string;
  dataUrl?: string;
}

/** Above this, extraction stops being useful and the model starts guessing. */
const MAX_TEXT_CHARS = 14_000;

/** Above this, a base64 image is a payload nothing will accept. */
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/** Enough for a letter, a notice or a few pages. */
const MAX_PDF_BYTES = 12 * 1024 * 1024;

export type ExtractState =
  | { kind: 'idle' }
  | { kind: 'reading'; name: string }
  | { kind: 'scanned'; name: string }
  | { kind: 'error'; message: string };

/**
 * Pull the text out of a PDF, in the browser.
 *
 * Imported lazily because pdf.js is about 400 kB of JavaScript and a visitor
 * who never attaches anything should not pay for it. Only reached when someone
 * actually chooses a PDF.
 */
async function readPdf(file: File): Promise<{ text: string; scanned: boolean }> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  /*
   * The worker is disabled deliberately. pdf.js would otherwise spawn a worker
   * from its own bundle, which some corporate and older mobile browsers block;
   * when that happens the whole feature is dead for exactly the audience it was
   * built for. Parsing on the main thread is slower and it always works.
   */
  pdfjs.GlobalWorkerOptions.workerSrc = '';

  const buffer = await file.arrayBuffer();
  const document_ = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
  }).promise;

  const pages: string[] = [];
  let chars = 0;

  for (let page = 1; page <= document_.numPages; page += 1) {
    if (chars > MAX_TEXT_CHARS) break;

    const content = await document_.getPage(page);
    const content_ = await content.getTextContent();

    // Items come back positioned, not in reading order, and the gap between two
    // items is what separates one line from the next. Without it a paragraph
    // comes out as one enormous run-on line and the model reads it as such.
    let line = '';
    let lastY: number | null = null;
    let pageText = '';

    for (const item of content_.items) {
      if (!('str' in item)) continue;

      const y = Array.isArray(item.transform) ? item.transform[5] : null;
      if (lastY !== null && typeof y === 'number' && Math.abs(y - lastY) > 2) {
        pageText += line.trim() + '\n';
        line = '';
      }
      line += item.str + ' ';
      lastY = typeof y === 'number' ? y : lastY;
    }
    pageText += line.trim();

    pages.push(pageText);
    chars += pageText.length;
  }

  const text = pages.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();

  return { text, scanned: text.length < 40 };
}

export function AttachFile({
  onAttach,
  state,
  setState,
}: {
  onAttach: (attachment: Attachment | null) => void;
  state: ExtractState;
  setState: (next: ExtractState) => void;
}) {
  const { t } = useLanguage();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    const lower = file.name.toLowerCase();

    /* ---------------------------------------------------------------- PDF */
    if (lower.endsWith('.pdf')) {
      if (file.size > MAX_PDF_BYTES) {
        onAttach(null);
        setState({ kind: 'error', message: t('attach.tooBigPdf') });
        return;
      }

      setState({ kind: 'reading', name: file.name });
      try {
        const { text, scanned } = await readPdf(file);

        if (scanned) {
          /*
           * A scan. Saying "I could not read this" is the only honest answer,
           * and it is more useful than silence: it tells the visitor to send a
           * photograph instead, which does work once a model that can read
           * images is connected.
           */
          onAttach(null);
          setState({ kind: 'error', message: t('attach.scannedPdf') });
          return;
        }

        onAttach({
          name: file.name,
          size: file.size,
          kind: 'text',
          text: text.slice(0, MAX_TEXT_CHARS),
        });
        setState({ kind: 'idle' });
      } catch {
        onAttach(null);
        setState({ kind: 'error', message: t('attach.pdfFailed') });
      }
      return;
    }

    /* -------------------------------------------------------------- IMAGE */
    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_BYTES) {
        onAttach(null);
        setState({ kind: 'error', message: t('attach.tooBigImage') });
        return;
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('read failed'));
        reader.readAsDataURL(file);
      }).catch(() => null);

      if (!dataUrl) {
        onAttach(null);
        setState({ kind: 'error', message: t('attach.imageFailed') });
        return;
      }

      onAttach({ name: file.name, size: file.size, kind: 'image', dataUrl });
      setState({ kind: 'idle' });
      return;
    }

    /* --------------------------------------------------------------- TEXT */
    if (
      file.type.startsWith('text/') ||
      lower.endsWith('.txt') ||
      lower.endsWith('.csv') ||
      lower.endsWith('.md')
    ) {
      const text = await file.text();
      onAttach({
        name: file.name,
        size: file.size,
        kind: 'text',
        text: text.slice(0, MAX_TEXT_CHARS),
      });
      setState({ kind: 'idle' });
      return;
    }

    onAttach(null);
    setState({ kind: 'error', message: t('attach.wrongType') });
  };

  const accept =
    'application/pdf,image/png,image/jpeg,image/webp,text/plain,text/csv,text/markdown,.md';

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        /*
         * The value is cleared after every pick so choosing the same file twice
         * fires a change event. Without this a visitor who picked the wrong file,
         * saw the error, and picked the same one again would see nothing happen
         * and conclude the button was broken.
         */
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) void handle(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state.kind === 'reading'}
        className="btn-ghost !min-h-[2.75rem] w-full !justify-center border border-dashed border-line text-sm disabled:opacity-60"
      >
        <Icon name="plus" size={16} />
        {state.kind === 'reading' ? t('attach.reading') : t('attach.button')}
      </button>

      <p className="mt-2 text-center text-xs text-ink-subtle">
        {t('attach.formats')}
      </p>

      {state.kind === 'reading' ? (
        <p className="mt-2 text-center text-sm text-ink-muted" role="status">
          {state.name}
        </p>
      ) : null}

      {state.kind === 'error' ? (
        <p role="alert" className="mt-2 text-center text-sm text-danger">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

/** Human-readable size, so nobody attaches a 9 MB scan without knowing. */
export function describeSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}