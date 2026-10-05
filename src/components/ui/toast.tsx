'use client';

import * as React from 'react';

/**
 * A small, non-blocking notice.
 *
 * Not a modal. A modal that appears over the content, traps focus and has to be
 * dismissed is the most hostile pattern on the web for a screen-reader user or
 * someone with a shaky hand — and this site exists for exactly those people.
 * So a notice announces politely, sits at the top of the document flow, and
 * goes away by itself.
 */

type Tone = 'success' | 'error';

interface Toast {
  id: number;
  tone: Tone;
  title: string;
  message?: string;
}

const ToastContext = React.createContext<{
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}>({ success: () => {}, error: () => {} });

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const nextId = React.useRef(1);

  const dismiss = React.useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (tone: Tone, title: string, message?: string) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, tone, title, message }]);
      // Errors stay longer, because they usually need reading twice.
      window.setTimeout(() => dismiss(id), tone === 'error' ? 8000 : 4500);
    },
    [dismiss],
  );

  const value = React.useMemo(
    () => ({
      success: (title: string, message?: string) => push('success', title, message),
      error: (title: string, message?: string) => push('error', title, message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/*
        `polite` rather than `assertive`: a visitor who is typing a review
        should not have their input stolen by a screen reader announcing an
        error over the top of it.
      */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-3 top-3 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              'pointer-events-auto flex items-start gap-3 rounded-[var(--radius)] border-2 bg-surface p-4 shadow-lift',
              toast.tone === 'success' ? 'border-success/40' : 'border-danger/50',
            ].join(' ')}
          >
            <span
              className={[
                'grid h-9 w-9 shrink-0 place-items-center rounded-full',
                toast.tone === 'success' ? 'bg-leaf-soft text-success' : 'bg-danger-soft text-danger',
              ].join(' ')}
              aria-hidden="true"
            >
              {toast.tone === 'success' ? '✓' : '!'}
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-bold">{toast.title}</p>
              {toast.message ? <p className="mt-0.5 text-sm text-ink-muted">{toast.message}</p> : null}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="बंद करें"
              className="btn-ghost !min-h-[2rem] !w-8 !px-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}