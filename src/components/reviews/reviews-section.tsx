'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { submitReview } from '@/server/reviews/actions';
import { useToast } from '@/components/ui/toast';

/**
 * ===========================================================================
 *  REVIEWS
 * ===========================================================================
 *
 * Rating summary plus a form for leaving one.
 *
 * ── Why the form is a plain form and not a modal ──────────────────────────
 * The audience is largely elderly. A modal that traps focus and has to be
 * dismissed is the single most hostile pattern on the web for someone using a
 * screen reader or a shaky finger. Everything here is inline, in reading order.
 *
 * ── Stars are radio buttons ───────────────────────────────────────────────
 * Not a custom widget. A five-star picker built from divs is invisible to a
 * keyboard and to a screen reader; a radio group announces "3 of 5" and works
 * with the arrow keys for free.
 */

export function ReviewsSection({
  initialReviews,
  summary,
}: {
  initialReviews: {
    id: string;
    rating: number;
    authorName: string | null;
    city: string | null;
    comment: string;
    reply: string | null;
    createdAt: string;
  }[];
  summary: { average: number; count: number; histogram: number[] };
}) {
  const toast = useToast();
  const [reviews, setReviews] = React.useState(initialReviews);
  const [rating, setRating] = React.useState(5);
  const [hovered, setHovered] = React.useState(0);
  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const shown = hovered || rating;

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setErrors({});

    try {
      const result = await submitReview(
        { rating, authorName: name, city, comment },
        // The server decides the real address; this is only a hint and is not
        // trusted for anything.
        'visitor',
      );

      if (result.ok) {
        toast.success('धन्यवाद', result.message);
        setComment('');
        setName('');
        setCity('');
      } else {
        setErrors(result.fieldErrors ?? {});
        toast.error('नहीं भेजा जा सका', result.message);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="reviews-heading" className="mt-16">
      <h2 id="reviews-heading" className="text-center">
        लोगों की राय
      </h2>

      {/* ------------------------------------------------------- summary */}
      <div className="card mt-6 p-6 sm:p-8">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div className="text-center md:text-left">
            {/*
              No average is shown below three reviews. One five-star comment is
              not a rating, and publishing "5.0" off a single person reads as a
              fabricated score.
            */}
            {summary.average > 0 ? (
              <>
                <p className="text-6xl font-extrabold leading-none text-saffron-deep">
                  {summary.average.toFixed(1)}
                </p>
                <div className="mt-2 flex justify-center md:justify-start">
                  <Stars value={summary.average} />
                </div>
                <p className="mt-2 text-sm text-ink-muted">{summary.count} समीक्षाएँ</p>
              </>
            ) : (
              <p className="text-sm text-ink-muted">
                अभी पर्याप्त समीक्षाएँ नहीं हैं।
              </p>
            )}
          </div>

          {summary.count > 0 ? (
            <ul className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const n = summary.histogram[star - 1];
                const pct = summary.count > 0 ? (n / summary.count) * 100 : 0;
                return (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 text-ink-muted">{star} ★</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-saffron-soft">
                      <span className="block h-full rounded-full bg-saffron" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-8 shrink-0 text-right tabular-nums text-ink-subtle">{n}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------- list */}
      {reviews.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Stars value={review.rating} />
                <span className="font-bold">
                  {review.authorName ?? 'एक अज्ञात व्यक्ति'}
                </span>
                {review.city ? <span className="text-sm text-ink-muted">{review.city}</span> : null}
                <span className="ml-auto text-2xs text-ink-subtle">
                  {new Date(review.createdAt).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="mt-3 leading-relaxed">{review.comment}</p>

              {review.reply ? (
                <div className="mt-4 rounded-md border-s-4 border-saffron bg-saffron-soft/50 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-saffron-deep">
                    <Icon name="heart" size={16} />
                    प्रबंधक का जवाब
                  </p>
                  <p className="mt-1.5 leading-relaxed">{review.reply}</p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-md border border-dashed border-line p-8 text-center text-ink-muted">
          अभी कोई समीक्षा प्रकाशित नहीं है। नीचे पहली लिखिए।
        </p>
      )}

      {/* ---------------------------------------------------------- form */}
      <form onSubmit={send} className="card mt-8 border-saffron bg-saffron-soft/30 p-5 sm:p-7">
        <h3 className="flex items-center gap-2 text-saffron-deep">
          <Icon name="edit" size={22} />
          अपनी राय लिखिए
        </h3>
        <p className="mt-1.5 text-sm text-ink-muted">
          आपका नाम और शहर लिखना ज़रूरी नहीं है। कोई पंजीकरण नहीं, कोई फ़ोन नंबर नहीं।
        </p>

        <fieldset className="mt-5">
          <legend className="label">कितने तारे देंगे?</legend>
          <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className="cursor-pointer p-1"
                onMouseEnter={() => setHovered(value)}
              >
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  className="sr-only"
                />
                <span
                  className={[
                    'block transition-transform',
                    value <= shown ? 'text-saffron' : 'text-line',
                    value === shown ? 'scale-115' : '',
                  ].join(' ')}
                >
                  <Icon name="star" size={34} />
                </span>
                <span className="sr-only">{value} तारे</span>
              </label>
            ))}
            <span className="ml-3 text-sm text-ink-muted">{shown} / 5</span>
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rv-name" className="label">
              आपका नाम (ज़रूरी नहीं)
            </label>
            <input
              id="rv-name"
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="rv-city" className="label">
              आपका शहर (ज़रूरी नहीं)
            </label>
            <input
              id="rv-city"
              className="field"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={120}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="rv-comment" className="label">
            आपकी बात
          </label>
          <textarea
            id="rv-comment"
            className="field min-h-32"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1200}
            required
            minLength={10}
            placeholder="सेवा कैसी लगी? आपकी बात दूसरों के काम आ सकती है।"
            aria-describedby={errors.comment ? 'rv-comment-error' : undefined}
          />
          {errors.comment ? (
            <p id="rv-comment-error" role="alert" className="mt-1 text-sm text-danger">
              {errors.comment[0]}
            </p>
          ) : null}
        </div>

        <button type="submit" disabled={sending} className="btn-primary mt-5 w-full sm:w-auto">
          {sending ? 'भेज रहे हैं…' : 'भेजिए'}
        </button>

        <p className="mt-3 text-xs text-ink-subtle">
          आपकी समीक्षा प्रकाशित होने से पहले एक बार देखी जाती है।
        </p>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------------ */

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value.toFixed(1)} में से 5 तारे`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={18}
          className={star <= Math.round(value) ? 'text-saffron' : 'text-line'}
        />
      ))}
    </span>
  );
}