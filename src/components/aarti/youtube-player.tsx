'use client';

import * as React from 'react';

/**
 * ===========================================================================
 *  A real singer, played from YouTube
 * ===========================================================================
 *
 * Some aartis have no free file of their own — the labels that recorded them
 * never released one under a licence this site can copy. The owner's answer to
 * that was blunt and correct: the visitor asked for *this* aarti, so play *this*
 * aarti, and take it from wherever it is already free.
 *
 * So it is played from the rights holder's own YouTube video, embedded. Nothing
 * is downloaded, copied or re-encoded, and the recording is never taken out of
 * the player the label controls: they keep the video, the views and the ads,
 * and the credit sits under the button.
 *
 * ── Why it does not load until it is pressed ───────────────────────────────
 *
 * An embedded player pulls roughly a megabyte of script before it can play a
 * note, and this audience is often on a small data pack. Until the visitor taps
 * the button there is nothing here but a button, so an aarti they did not want
 * to hear costs them nothing.
 *
 * `youtube-nocookie.com` is used so that opening the page does not set a
 * tracking cookie for somebody who never pressed play.
 */
export function YouTubePlayer({
  videoId,
  title,
  channel,
  listenLabel,
  creditLabel,
}: {
  /** The video's id, the part after `watch?v=`. */
  videoId: string;
  /** Shown to a screen reader and as the frame's title. */
  title: string;
  /** The channel the recording belongs to. Always shown; it is the credit. */
  channel: string;
  listenLabel: string;
  creditLabel: string;
}) {
  const [playing, setPlaying] = React.useState(false);

  if (!playing) {
    return (
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="btn-outline !min-h-[2.75rem] !px-4 text-sm"
        >
          <span aria-hidden="true">▶</span>
          {listenLabel}
        </button>
        <p className="mt-2 text-sm text-ink-subtle">
          {creditLabel} {channel} · YouTube
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={`${title} — ${channel}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <p className="mt-2 text-sm text-ink-subtle">
        {creditLabel} {channel} · YouTube
      </p>
    </div>
  );
}
