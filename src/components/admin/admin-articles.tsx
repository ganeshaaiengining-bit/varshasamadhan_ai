'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { useToast } from '@/components/ui/toast';
import {
  createArticle,
  updateArticle,
  setPublished,
  permanentlyDeleteArticle,
} from '@/server/admin/articles';

/**
 * ===========================================================================
 *  ARTICLE EDITOR
 * ===========================================================================
 *
 * Three lists — live, hidden (the trash), and a new-article form — plus a backup
 * download that is deliberately the first thing on the page.
 *
 * ── Why the backup is at the top and not buried in a menu ──────────────────
 *
 * An article written here exists only in the database. The seed files are a
 * starting point, not a record, so there is nothing in git to fall back on and
 * nothing in the terminal to run. The panel is therefore the only place a backup
 * can be taken from, and a control nobody can find is not a backup.
 *
 * ── Why "delete" hides ─────────────────────────────────────────────────────
 *
 * The button says "हटाएँ (साइट से)" — remove from the site — because that is
 * exactly what it does. It moves the article to the hidden tab, where it can be
 * restored. The permanent delete is a separate control that only appears on an
 * already-hidden article and refuses until its slug is typed back.
 *
 * ── The body field ─────────────────────────────────────────────────────────
 *
 * Plain text, not rich text. The renderer turns blank lines into paragraphs,
 * `#` and `##` into headings and `-` into bullets, and it never interprets HTML.
 * That is a security property as much as a simplicity one: there is no pipeline
 * an injected tag could travel through, so the owner cannot accidentally — or
 * anyone else deliberately — break the page.
 */

export interface ArticleRow {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  voiceSummary: string;
  isEmergency: boolean;
  isMedical: boolean;
  helpline: string;
  sortOrder: number;
  updatedAt: string;
}

interface Category {
  id: string;
  slug: string;
  title: string;
}

const EMPTY = {
  id: '',
  categoryId: '',
  title: '',
  summary: '',
  body: '',
  voiceSummary: '',
  helpline: '',
  isEmergency: false,
  isMedical: false,
  isPublished: true,
  sortOrder: 0,
};

type FormState = typeof EMPTY;

export function AdminArticles({
  categories,
  published,
  hidden,
}: {
  categories: Category[];
  published: ArticleRow[];
  hidden: ArticleRow[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [editing, setEditing] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const run = async (action: () => Promise<{ ok: boolean; message?: string; fieldErrors?: Record<string, string[]> }>) => {
    setBusy(true);
    setErrors({});
    try {
      const result = await action();
      toast[result.ok ? 'success' : 'error'](result.ok ? 'हो गया' : 'नहीं हुआ', result.message ?? '');
      if (result.ok) {
        setForm(EMPTY);
        setEditing(null);
        setOpen(false);
        router.refresh();
      } else if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      }
    } catch {
      toast.error('काम नहीं हुआ', 'सर्वर से जुड़ नहीं पाए।');
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(() => (form.id ? updateArticle(form) : createArticle(form)));

  const edit = (article: ArticleRow) => {
    setForm({
      id: article.id,
      categoryId: article.categoryId,
      title: article.title,
      summary: article.summary,
      body: article.body,
      voiceSummary: article.voiceSummary,
      helpline: article.helpline,
      isEmergency: article.isEmergency,
      isMedical: article.isMedical,
      isPublished: true,
      sortOrder: article.sortOrder,
    });
    setEditing(article.id);
    setOpen(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const begin = () => {
    setForm({ ...EMPTY, categoryId: categories[0]?.id ?? '' });
    setEditing(null);
    setErrors({});
    setOpen(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1>लेख</h1>
          <p className="mt-1 text-ink-muted">
            {published.length} लेख दिख रहे हैं, {hidden.length} छिपे हुए।
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/*
            An anchor, not a button: the browser owns downloads. A `fetch` here
            would put the JSON in memory and need a Blob to save it, which is more
            code for the same file.
          */}
          <a
            href="/api/admin/backup"
            className="btn-outline !min-h-[2.75rem]"
            download
          >
            <Icon name="scroll" size={18} />
            बैकअप लें
          </a>
          <button type="button" onClick={begin} className="btn-primary !min-h-[2.75rem]">
            नया लेख
          </button>
        </div>
      </div>

      <p className="mt-3 rounded-md border border-amber/40 bg-amber-soft p-3 text-sm">
        बड़ा बदलाव करने से पहले <strong>बैकअप लें</strong> दबाएँ। यह लेख सिर्फ़
        डेटाबेस में हैं — इनके अलावा यहाँ कोई दूसरी नकल नहीं है।
      </p>

      {open ? (
        <Editor
          form={form}
          categories={categories}
          errors={errors}
          busy={busy}
          editing={Boolean(form.id)}
          onChange={set}
          onSave={save}
          onCancel={() => {
            setOpen(false);
            setEditing(null);
            setForm(EMPTY);
          }}
        />
      ) : null}

      {/* ------------------------------------------------------- live list */}
      <h2 className="mt-10 text-xl">साइट पर दिख रहे लेख</h2>
      {published.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-line p-6 text-center text-ink-muted">
          कोई लेख नहीं है।
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {published.map((article) => (
            <Row
              key={article.id}
              article={article}
              busy={busy}
              categoryTitle={categories.find((c) => c.id === article.categoryId)?.title ?? '—'}
              onEdit={() => edit(article)}
              onHide={() => run(() => setPublished(article.id, false))}
            />
          ))}
        </ul>
      )}

      {/* ------------------------------------------------------ hidden list */}
      <h2 className="mt-10 text-xl">छिपे हुए लेख</h2>
      <p className="mt-1 text-sm text-ink-muted">
        यहाँ का लेख साइट पर नहीं दिखता, लेकिन मिटाया नहीं गया। यहीं से वापस ला सकते हैं।
      </p>
      {hidden.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-line p-6 text-center text-ink-muted">
          कोई छिपा हुआ लेख नहीं है।
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {hidden.map((article) => (
            <Row
              key={article.id}
              article={article}
              busy={busy}
              categoryTitle={categories.find((c) => c.id === article.categoryId)?.title ?? '—'}
              onEdit={() => edit(article)}
              onRestore={() => run(() => setPublished(article.id, true))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Row({
  article,
  categoryTitle,
  busy,
  onEdit,
  onHide,
  onRestore,
}: {
  article: ArticleRow;
  categoryTitle: string;
  busy: boolean;
  onEdit: () => void;
  onHide?: () => void;
  onRestore?: () => void;
}) {
  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold">{article.title}</span>
        {article.isEmergency ? (
          <span className="rounded-full bg-rose-soft px-2 py-0.5 text-xs font-bold text-rose">
            ज़रूरी
          </span>
        ) : null}
        {article.isMedical ? (
          <span className="rounded-full bg-amber-soft px-2 py-0.5 text-xs font-bold text-amber">
            चिकित्सा
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-sm text-ink-subtle">
        {categoryTitle} · <code className="text-xs">{article.slug}</code>
      </p>

      {article.summary ? (
        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{article.summary}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onEdit} disabled={busy} className="btn-outline !min-h-11">
          बदलें
        </button>
        {onHide ? (
          <button
            type="button"
            onClick={onHide}
            disabled={busy}
            className="btn-ghost !min-h-11 text-rose"
          >
            हटाएँ (साइट से)
          </button>
        ) : null}
        {onRestore ? (
          <>
            <button
              type="button"
              onClick={onRestore}
              disabled={busy}
              className="btn-primary !min-h-11"
            >
              वापस लाएँ
            </button>
            <PurgeButton article={article} />
          </>
        ) : null}
      </div>
    </li>
  );
}

/**
 * The permanent delete.
 *
 * Collapsed until asked for, then it asks for the slug to be typed back. This is
 * the only control in the panel that cannot be undone from inside the panel, and
 * that is why it costs two deliberate actions rather than one.
 */
function PurgeButton({ article }: { article: ArticleRow }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const go = async () => {
    setBusy(true);
    try {
      const result = await permanentlyDeleteArticle(article.id, typed);
      toast[result.ok ? 'success' : 'error'](result.ok ? 'हो गया' : 'नहीं हुआ', result.message ?? '');
      if (result.ok) {
        setOpen(false);
        setTyped('');
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost !min-h-11 text-danger"
      >
        हमेशा के लिए मिटाएँ
      </button>
    );
  }

  return (
    <div className="mt-3 w-full rounded-md border-2 border-rose/40 bg-rose-soft p-3">
      <p className="text-sm">
        यह लेख <strong>हमेशा के लिए</strong> मिट जाएगा। वापस नहीं आएगा। पक्का करने के
        लिए नीचे लिखा स्लग टाइप करें:
      </p>
      <p className="mt-1 font-mono text-sm">{article.slug}</p>

      <input
        className="field mt-2"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder={article.slug}
        autoComplete="off"
        aria-label="स्लग टाइप करके पक्का करें"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={go}
          disabled={busy || typed.trim() !== article.slug}
          className="btn !min-h-11 bg-danger text-white"
        >
          हाँ, मिटाएँ
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost !min-h-11">
          रहने दें
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Editor({
  form,
  categories,
  errors,
  busy,
  editing,
  onChange,
  onSave,
  onCancel,
}: {
  form: FormState;
  categories: Category[];
  errors: Record<string, string[]>;
  busy: boolean;
  editing: boolean;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <section className="card mt-6 border-saffron bg-saffron-soft/20 p-5 sm:p-6">
      <h2 className="text-xl text-saffron-deep">{editing ? 'लेख बदलें' : 'नया लेख'}</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="श्रेणी" error={errors.categoryId?.[0]}>
          <select
            className="field"
            value={form.categoryId}
            onChange={(e) => onChange('categoryId', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="क्रम (छोटा नंबर पहले)" error={errors.sortOrder?.[0]}>
          <input
            className="field"
            type="number"
            min={0}
            max={999}
            value={form.sortOrder}
            onChange={(e) => onChange('sortOrder', Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="शीर्षक" error={errors.title?.[0]}>
          <input
            className="field"
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            maxLength={160}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="छोटा विवरण (सूची में दिखेगा)" error={errors.summary?.[0]}>
          <input
            className="field"
            value={form.summary}
            onChange={(e) => onChange('summary', e.target.value)}
            maxLength={400}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field
          label="लेख का मुख्य भाग"
          error={errors.body?.[0]}
          hint="खाली लाइन = नया अनुच्छेद।  ## = बड़ा शीर्षक,  # = छोटा शीर्षक,  - = बिंदु,  1. = क्रम।"
        >
          <textarea
            className="field min-h-96 font-mono text-sm"
            value={form.body}
            onChange={(e) => onChange('body', e.target.value)}
            maxLength={20000}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field
          label="सुनने के लिए (छोटा, ऊपर से पढ़ा जाएगा)"
          error={errors.voiceSummary?.[0]}
          hint="बुज़ुर्ग या नेत्रहीन यात्री यही सुनते हैं। दो-तीन वाक्य काफ़ी हैं।"
        >
          <textarea
            className="field min-h-24"
            value={form.voiceSummary}
            onChange={(e) => onChange('voiceSummary', e.target.value)}
            maxLength={500}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field
          label="हेल्पलाइन नंबर (अगर ज़रूरी हो)"
          error={errors.helpline?.[0]}
          hint="सिर्फ़ भारत के नंबर डालें। यह लाल रंग में ऊपर दिखेगा।"
        >
          <input
            className="field"
            value={form.helpline}
            onChange={(e) => onChange('helpline', e.target.value)}
            maxLength={120}
            inputMode="tel"
          />
        </Field>
      </div>

      {/*
        Both flags change what a page shows, so they are stated in words rather
        than as bare checkboxes. `isEmergency` puts the number in a red box above
        the text; `isMedical` puts a "not medical advice" notice under it. Both
        default to off on a new article — a page about grief that opens with an
        ambulance number is its own kind of harm.
      */}
      <fieldset className="mt-5">
        <legend className="label">चिह्न</legend>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.isEmergency}
            onChange={(e) => onChange('isEmergency', e.target.checked)}
          />
          <span>
            <strong>ज़रूरी जानकारी</strong>
            <span className="block text-sm text-ink-subtle">
              ऊपर लाल बक्सा और "ज़रूरी" का निशान दिखेगा।
            </span>
          </span>
        </label>

        <label className="mt-3 flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.isMedical}
            onChange={(e) => onChange('isMedical', e.target.checked)}
          />
          <span>
            <strong>चिकित्सा से जुड़ा है</strong>
            <span className="block text-sm text-ink-subtle">
              नीचे "यह चिकित्सा सलाह नहीं है" का संदेश दिखेगा।
            </span>
          </span>
        </label>
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={onSave} disabled={busy} className="btn-primary !min-h-12">
          {busy ? 'सहेज रहे हैं…' : editing ? 'बदलाव सहेजें' : 'लेख सहेजें'}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className="btn-ghost !min-h-12">
          रद्द करें
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-sm text-ink-subtle">{hint}</span> : null}
      {error ? <span className="mt-1 block text-sm text-danger">{error}</span> : null}
    </label>
  );
}