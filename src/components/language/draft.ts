/**
 * ===========================================================================
 *  SURVIVING A LANGUAGE CHANGE
 * ===========================================================================
 *
 * Changing the language reloads the page — see `LanguageProvider`. That is
 * correct and unavoidable, and it is invisible to the visitor *unless* they
 * have typed something.
 *
 * This module is what makes it invisible: whatever the visitor had half-finished
 * is put aside before the reload and put back afterwards.
 *
 * ── Why this has to exist ──────────────────────────────────────────────────
 *
 * The question box is the reason anyone is on this site. Someone who has typed
 * "मेरे पिताजी की दवाई…" and then noticed the site is in the wrong language has
 * to be able to switch without losing it. A reload that clears the field means
 * re-typing a sentence in a script they may not be comfortable typing — and the
 * person most likely to change the language is the one least able to afford that.
 *
 * ── Why sessionStorage and not localStorage ────────────────────────────────
 *
 * `sessionStorage` is per-tab and dies with the tab. The draft is meant to survive
 * one navigation and nothing else: leaving a stranger's half-written health
 * question in `localStorage` would mean it was still on the device tomorrow, and
 * possibly visible to the next person who opens the site on a shared computer.
 *
 * ── Why it is cleared on read ──────────────────────────────────────────────
 *
 * A draft is restored exactly once. If it stayed, the next language change would
 * resurrect a question from an hour ago and put it back in the box unasked.
 */

const KEY = 'vs-draft';

/** Keys that may be carried across the reload. Anything else is ignored. */
interface Draft {
  question?: string;
  comment?: string;
  scrollY?: number;
}

function read(): Draft {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Draft) : {};
  } catch {
    return {};
  }
}

export function saveDraft(draft: Draft): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* private browsing; the visitor retypes, which is the old behaviour */
  }
}

/**
 * Take the draft back, and forget it.
 *
 * Returns `{}` rather than null so callers can read `draft.question` without a
 * guard at every use.
 */
export function takeDraft(): Draft {
  const draft = read();
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
  return draft;
}

/**
 * Called just before a language change.
 *
 * Reads the page's own fields directly rather than being handed them, so no
 * component has to remember to participate. The ids are the ones the forms
 * already use.
 */
export function stashForLanguageChange(): void {
  if (typeof window === 'undefined') return;

  const question = document.querySelector<HTMLInputElement>('#ask-input')?.value ?? '';
  const comment = document.querySelector<HTMLTextAreaElement>('#rv-comment')?.value ?? '';

  saveDraft({
    question,
    comment,
    scrollY: window.scrollY,
  });
}

/**
 * Put the draft back, once, on the page that reloads after a language change.
 *
 * Scroll position is restored in a `requestAnimationFrame` because the browser
 * restores its own scroll asynchronously and the two fight otherwise — the page
 * visibly jumps twice, which is worse than not restoring it at all.
 */
export function restoreDraft(apply: (draft: Draft) => void): void {
  if (typeof window === 'undefined') return;

  const draft = takeDraft();
  if (!draft.question && !draft.comment && typeof draft.scrollY !== 'number') return;

  apply(draft);

  if (typeof draft.scrollY === 'number' && draft.scrollY > 0) {
    window.requestAnimationFrame(() => window.scrollTo(0, draft.scrollY as number));
  }
}