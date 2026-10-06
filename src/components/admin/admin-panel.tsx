'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { useToast } from '@/components/ui/toast';
import { approveReview, unapproveReview, replyToReview, deleteReview } from '@/server/reviews/actions';

/**
 * ===========================================================================
 *  ADMIN PANEL
 * ===========================================================================
 *
 * Three tabs: waiting reviews, published reviews, and the questions visitors
 * asked the AI.
 *
 * ── Why the questions tab exists ───────────────────────────────────────────
 * `asked_questions` stores the ones the AI could not answer as well as the ones
 * it could. That is the most useful list on the whole site for an owner: it says
 * what people actually want, and the failures in particular are a to-do list —
 * each one is either a missing article or a question the prompt needs to handle.
 *
 * ── Why nothing here can touch an article ─────────────────────────────────
 * There is no edit or delete for the sixteen articles, on purpose. A moderation
 * screen that can also remove content is one stolen cookie away from losing the
 * reason the site exists. Article changes go through the database and the seed
 * files, where a mistake is a commit rather than a single click.
 *
 * ── Dates ──────────────────────────────────────────────────────────────────
 * Shown with the visitor's own locale, so a timestamp is readable to whoever is
 * reading the panel rather than always in Devanagari numerals.
 */

interface Review {
  id: string;
  rating: number;
  authorName: string | null;
  city: string | null;
  comment: string;
  reply: string | null;
  createdAt: string;
}

interface Question {
  id: string;
  question: string;
  category: string;
  wasAnswered: boolean;
  wasFailed: boolean;
  createdAt: string;
}

type Tab = 'pending' | 'published' | 'questions';

export function AdminPanel({
  pending,
  published,
  asked,
  failures,
}: {
  pending: Review[];
  published: Review[];
  asked: Question[];
  failures: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = React.useState<Tab>('pending');
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  const run = async (id: string, action: () => Promise<{ ok: boolean; message?: string }>) => {
    setBusyId(id);
    try {
      const result = await action();
      toast[result.ok ? 'success' : 'error'](result.ok ? 'हो गया' : 'नहीं हुआ', result.message ?? '');
      if (result.ok) router.refresh();
    } catch {
      toast.error('काम नहीं हुआ', 'सर्वर से जुड़ नहीं पाए।');
    } finally {
      setBusyId(null);
    }
  };

  const signOut = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.refresh();
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'pending', label: 'इंतज़ार में', count: pending.length },
    { id: 'published', label: 'प्रकाशित', count: published.length },
    { id: 'questions', label: 'पूछे गए सवाल', count: asked.length },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>प्रबंधक</h1>
          <p className="mt-1 text-ink-muted">
            {pending.length > 0
              ? `${pending.length} राय आपके इंतज़ार में है।`
              : 'कोई नई राय इंतज़ार में नहीं है।'}
          </p>
        </div>
        <button type="button" onClick={signOut} className="btn-outline !min-h-[2.75rem]">
          बाहर निकलें
        </button>
      </div>

      {/* The one number worth surfacing without opening a tab. */}
      {failures > 0 ? (
        <p className="mt-4 rounded-md border border-amber/40 bg-amber-soft p-3 text-sm">
          <strong>{failures} सवालों का</strong> जवाब नहीं मिल पाया — या तो AI की सीमा पूरी
          हुई, या कोई नया सवाल है जिसका जवाब साइट पर है ही नहीं।
        </p>
      ) : null}

      <div role="tablist" aria-label="प्रबंधक" className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={[
              'rounded-full border-2 px-4 py-2 font-semibold transition-colors',
              tab === item.id
                ? 'border-saffron bg-saffron-soft text-saffron-deep'
                : 'border-line bg-surface hover:border-saffron',
            ].join(' ')}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'pending' ? (
          pending.length === 0 ? (
            <Empty>कोई नई राय नहीं। जब कोई लिखेगा तो यहाँ दिखेगी।</Empty>
          ) : (
            <ul className="space-y-4">
              {pending.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  busy={busyId === review.id}
                  draft={drafts[review.id] ?? review.reply ?? ''}
                  onDraft={(value) => setDrafts((d) => ({ ...d, [review.id]: value }))}
                  onApprove={() => run(review.id, () => approveReview(review.id))}
                  onDelete={() => run(review.id, () => deleteReview(review.id))}
                  onReply={() =>
                    run(review.id, () => replyToReview(review.id, drafts[review.id] ?? review.reply ?? ''))
                  }
                />
              ))}
            </ul>
          )
        ) : null}

        {tab === 'published' ? (
          published.length === 0 ? (
            <Empty>अभी कोई राय प्रकाशित नहीं है।</Empty>
          ) : (
            <ul className="space-y-4">
              {published.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  busy={busyId === review.id}
                  draft={drafts[review.id] ?? review.reply ?? ''}
                  onDraft={(value) => setDrafts((d) => ({ ...d, [review.id]: value }))}
                  onUnpublish={() => run(review.id, () => unapproveReview(review.id))}
                  onReply={() =>
                    run(review.id, () => replyToReview(review.id, drafts[review.id] ?? review.reply ?? ''))
                  }
                />
              ))}
            </ul>
          )
        ) : null}

        {tab === 'questions' ? (
          asked.length === 0 ? (
            <Empty>अभी कोई सवाल नहीं पूछा गया।</Empty>
          ) : (
            <ul className="space-y-3">
              {asked.map((question) => (
                <li key={question.id} className="card p-4">
                  <p className="font-semibold">{question.question}</p>
                  <p className="mt-1.5 text-xs text-ink-subtle">
                    <span className={question.wasFailed ? 'text-rose' : 'text-success'}>
                      {question.wasFailed ? 'जवाब नहीं मिला' : 'जवाब मिला'}
                    </span>
                    {question.category ? ` · ${question.category}` : ''} ·{' '}
                    <Time value={question.createdAt} />
                  </p>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function ReviewCard({
  review,
  busy,
  draft,
  onDraft,
  onApprove,
  onUnpublish,
  onReply,
  onDelete,
}: {
  review: Review;
  busy: boolean;
  draft: string;
  onDraft: (value: string) => void;
  onApprove?: () => void;
  onUnpublish?: () => void;
  onReply: () => void;
  onDelete?: () => void;
}) {
  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Stars value={review.rating} />
        <span className="font-bold">{review.authorName ?? 'बिना नाम के'}</span>
        {review.city ? <span className="text-sm text-ink-muted">{review.city}</span> : null}
        <span className="ms-auto text-xs text-ink-subtle">
          <Time value={review.createdAt} />
        </span>
      </div>

      <p className="mt-3 leading-relaxed">{review.comment}</p>

      <div className="mt-4">
        <label htmlFor={`reply-${review.id}`} className="label text-sm">
          आपका जवाब (वैकल्पिक)
        </label>
        <textarea
          id={`reply-${review.id}`}
          className="field min-h-20"
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          maxLength={1000}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {onApprove ? (
          <button type="button" onClick={onApprove} disabled={busy} className="btn-primary !min-h-11">
            <Icon name="check" size={18} />
            प्रकाशित करें
          </button>
        ) : null}
        {onUnpublish ? (
          <button type="button" onClick={onUnpublish} disabled={busy} className="btn-outline !min-h-11">
            हटाएँ (साइट से)
          </button>
        ) : null}
        <button type="button" onClick={onReply} disabled={busy} className="btn-outline !min-h-11">
          जवाब सहेजें
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="btn-ghost !min-h-11 text-danger"
          >
            मिटाएँ (हमेशा के लिए)
          </button>
        ) : null}
      </div>
    </li>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-line p-8 text-center text-ink-muted">{children}</p>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`5 में से ${value} तारे`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={16}
          className={star <= Math.round(value) ? 'text-saffron' : 'text-line'}
        />
      ))}
    </span>
  );
}

function Time({ value }: { value: string }) {
  return (
    <time dateTime={value}>
      {new Date(value).toLocaleString('hi-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </time>
  );
}