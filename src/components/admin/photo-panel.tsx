'use client';

import * as React from 'react';

/**
 * ===========================================================================
 *  THE OWNER'S PHOTOGRAPH
 * ===========================================================================
 *
 * Pick a picture, see it, save it. Nothing else — no crop, no filter, no editor.
 *
 * ── Why there is no editor ──────────────────────────────────────────────────
 *
 * Because every extra control is one more thing to get wrong from a phone, and
 * because the photograph is not a design. It is a person. A crop box that can
 * crop her face off is a worse thing to hand somebody than no crop box at all.
 *
 * The file is resized in the browser before it is sent, which is the one
 * transformation worth having: a phone photograph is three or four megabytes,
 * the site does not need four megabytes, and a person on a slow connection
 * should not be made to upload four megabytes of a photograph that will be
 * shown at four hundred.
 *
 * ── Why it goes to the database and not to the project ──────────────────────
 *
 * Because a file placed in the project is deleted by the next deployment. See
 * `server/images.ts`. In short: this photograph has to still be here after a
 * push, and the only place that survives a deploy is the one that was never in
 * the deploy.
 *
 * ── Language ───────────────────────────────────────────────────────────────
 *
 * Written in Hindi, unlike most of the admin panel.
 *
 * The panel is the one page on this site used almost exclusively by one person,
 * on one phone, and the person using it does not read English. The rest of the
 * site is in thirteen languages because a visitor may be in any of them; this
 * page is not for visitors.
 */

const MAX_BYTES = 4 * 1024 * 1024;

/** The long edge we resize to. Wide enough for a hero, small enough to send. */
const LONG_EDGE = 1600;

interface Meta {
  byteSize: number;
  updatedAt: string;
}

export function PhotoPanel() {
  const [meta, setMeta] = React.useState<Meta | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState('');
  const [size, setSize] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  /*
   * The shrunk picture is kept in a ref, not in state.
   *
   * State holds the object URL for the preview, which is a short string. The
   * bytes themselves are a few hundred kilobytes, and React compares state by
   * value — a blob in state is compared by identity, so every render sees a
   * changed value and the preview flickers. The ref also means the save does not
   * have to read the picture back out of a URL it just created, which is a
   * second trip through the browser's object store for no reason.
   */
  const pending = React.useRef<{ blob: Blob; mime: string } | null>(null);

  const loaded = React.useRef(false);

  /** Release the previous preview URL, or there is one leaked per pick. */
  const clearPreview = React.useCallback(() => {
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    pending.current = null;
    setFileName('');
    setSize(0);
  }, []);

  React.useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    fetch('/api/admin/photo')
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (body?.ok && body.meta) setMeta(body.meta as Meta);
      })
      .catch(() => {
        // The panel is usable without this: the important part is the picker.
      });
  }, []);

  /** Shrink the picture in the browser so the upload is a few hundred KB. */
  const shrink = React.useCallback((file: File): Promise<{ blob: Blob; mime: string }> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(url);

        const scale = Math.min(1, LONG_EDGE / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas'));
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve({ blob, mime: 'image/jpeg' });
            else reject(new Error('encode'));
          },
          'image/jpeg',
          0.86,
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('decode'));
      };

      image.src = url;
    });
  }, []);

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setMessage('');
    setError('');
    if (!file) return;

    if (!/^image\//.test(file.type)) {
      setError('यह फ़ाइल फ़ोटो नहीं है।');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('फ़ाइल बहुत बड़ी है — 20 MB से कम कीजिए।');
      return;
    }

    try {
      const { blob, mime } = await shrink(file);

      clearPreview();
      pending.current = { blob, mime };
      setPreview(URL.createObjectURL(blob));
      setFileName(file.name);
      setSize(blob.size);
      setMessage('तैयार है — "सहेजें" दबाइए।');
    } catch {
      setError('यह फ़ोटो पढ़ी नहीं जा सकी। दूसरी फ़ोटो चुनिए।');
    }
  };

  const save = async () => {
    const chosen = pending.current;
    if (!chosen) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
        reader.onerror = () => reject(new Error('read'));
        reader.readAsDataURL(chosen.blob);
      });

      const put = await fetch('/api/admin/photo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'varsha-photo',
          mime: chosen.mime,
          data,
          alt: 'श्रीमती VARSHA जी',
        }),
      });

      const body = await put.json();

      if (!put.ok || !body.ok) {
        setError(
          body?.reason === 'too-large'
            ? 'फ़ोटो अब भी बड़ी है।'
            : 'सहेजा नहीं जा सका।',
        );
        return;
      }

      setMeta({ byteSize: body.byteSize, updatedAt: body.updatedAt });
      clearPreview();
      setMessage('सहेजा गया। ✅');
    } catch {
      setError('कुछ गड़बड़ हुई। फिर कोशिश कीजिए।');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError('');
    try {
      await fetch('/api/admin/photo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'varsha-photo' }),
      });
      setMeta(null);
      setMessage('फ़ोटो हटा दी गई।');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card p-5 sm:p-7">
      <h2 className="font-display text-xl">फ़ोटो बदलिए</h2>
      <p className="mt-2 text-sm text-ink-muted">
        यह फ़ोटो होम पेज और स्मृति पेज दोनों पर दिखेगी। बदलने पर तुरंत दिखेगी, और
        साइट अपडेट होने पर भी मिटेगी नहीं।
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-[200px_1fr]">
        <div className="overflow-hidden rounded-xl border border-line bg-sun/10">
          {preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={preview} alt="चुनी गई फ़ोटो" className="h-full w-full object-cover" />
          ) : meta ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/api/photo/varsha-photo"
              alt="अभी लगी फ़ोटो"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid aspect-square place-items-center p-4 text-center text-sm text-ink-subtle">
              अभी कोई फ़ोटो नहीं है
            </div>
          )}
        </div>

        <div className="grid content-start gap-4">
          <div className="grid gap-2">
            <label htmlFor="photo-file" className="font-medium">
              फ़ोटो चुनिए
            </label>
            <input
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              onChange={onPick}
              disabled={busy}
              className="rounded-lg border border-line bg-paper px-4 py-3 file:me-3 file:rounded file:border-0 file:bg-saffron file:px-4 file:py-2 file:font-medium"
            />
            <p className="text-sm text-ink-subtle">
              {fileName
                ? `${fileName} — ${Math.round(size / 1024)} KB (होम पेज पर यही दिखेगी)`
                : `अधिकतम ${Math.round(MAX_BYTES / 1024 / 1024)} MB। बड़ी फ़ोटो अपने आप छोटी कर दी जाएगी।`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              disabled={!preview || busy}
              className="btn-primary"
            >
              {busy ? 'सहेज रहे हैं…' : 'सहेजें'}
            </button>

            <button type="button" onClick={remove} disabled={busy || !meta} className="btn-ghost">
              हटाएँ
            </button>

            {preview && (
              <button
                type="button"
                onClick={clearPreview}
                disabled={busy}
                className="btn-ghost"
              >
                रद्द करें
              </button>
            )}
          </div>

          {message && <p className="text-sm text-leaf">{message}</p>}
          {error && <p className="text-sm text-rose">{error}</p>}

          {meta && !preview && (
            <p className="text-sm text-ink-subtle">
              अभी लगी फ़ोटो: {Math.round(meta.byteSize / 1024)} KB
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
