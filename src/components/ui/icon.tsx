import * as React from 'react';

/**
 * ===========================================================================
 *  ICONS
 * ===========================================================================
 *
 * Inline SVG, not emoji.
 *
 * The prototype used emoji as icons. Emoji are rendered by the operating system,
 * so the same page shows different pictures on Windows, Android and iOS — and a
 * number of them (🪈 in particular) show as an empty box on older builds. A
 * service for elderly people cannot afford to have its navigation look broken on
 * someone's phone.
 *
 * Each icon inherits `currentColor`, so a single CSS colour drives it.
 */

export type IconName =
  | 'sun'
  | 'lotus'
  | 'tools'
  | 'book'
  | 'elder'
  | 'baby'
  | 'om'
  | 'scroll'
  | 'alert'
  | 'virus'
  | 'mic'
  | 'speaker'
  | 'send'
  | 'arrow'
  | 'search'
  | 'menu'
  | 'close'
  | 'home'
  | 'heart'
  | 'phone'
  | 'shield'
  | 'clock'
  | 'check'
  | 'sparkle'
  | 'star'
  | 'edit'
  | 'share'
  | 'plus'
  | 'trash'
  | 'eye';

const PATHS: Record<IconName, React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 3c1.8 2.2 2.6 4.4 2.4 6.6C13.7 8.1 12.9 6.3 12 3z" />
      <path d="M12 9.6c2.6-1.6 5-1.7 7.2-.2-1.8 1.5-3.6 2.3-5.4 2.6" />
      <path d="M12 9.6C9.4 8 7 7.9 4.8 9.4 6.6 10.9 8.4 11.7 10.2 12" />
      <path d="M4 14.5h16c-1.1 3.4-4 5.5-8 5.5s-6.9-2.1-8-5.5z" />
    </>
  ),
  tools: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-7.4 7.4a2.1 2.1 0 0 1-3-3l7.4-7.4z" />
      <path d="M6.5 3.5 3 7l3.5 3.5L10 7 6.5 3.5z" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v17H5.5A1.5 1.5 0 0 1 4 18.5v-14z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H13v17h5.5a1.5 1.5 0 0 0 1.5-1.5v-14z" />
    </>
  ),
  elder: (
    <>
      <circle cx="12" cy="5" r="2.4" />
      <path d="M9 21v-5.5H7.5a2 2 0 0 1-1.9-2.6l1.2-4.6A3.5 3.5 0 0 1 10.2 6h3.6a3.5 3.5 0 0 1 3.4 2.3l1.2 4.6A2 2 0 0 1 16.5 15H15V21" />
      <path d="M10 13.5h4" />
    </>
  ),
  baby: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 10.5h.01M15 10.5h.01" />
      <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      <path d="M12 3.5c1.5 0 2.6.8 3 2" />
    </>
  ),
  om: (
    <>
      <path d="M12 3a9 9 0 1 0 5 16.2" />
      <path d="M12 7.5c-1.2 1.6-1.4 3.3-.5 5s3 2.4 4.2 1.3c1-1 .4-2.7-1.2-3.4" />
    </>
  ),
  scroll: (
    <>
      <path d="M7 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7" />
      <path d="M7 4a2 2 0 1 0 0 4h1" />
      <path d="M11 11h6M11 15h4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2.5 20h19L12 3z" />
      <path d="M12 9.5v5M12 17.2h.01" />
    </>
  ),
  virus: (
    <>
      <circle cx="12" cy="12" r="5.5" />
      <path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22M4.9 4.9l2.5 2.5M16.6 16.6l2.5 2.5M19.1 4.9l-2.5 2.5M7.4 16.6l-2.5 2.5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5 11.5a7 7 0 0 0 14 0M12 18.5V21M8.5 21h7" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path d="M16 9a4.5 4.5 0 0 1 0 6M18.8 6.2a8.5 8.5 0 0 1 0 11.6" />
    </>
  ),
  send: <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3z" />,
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  menu: <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />,
  close: <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />,
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />,
  heart: <path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.3-8.5 11.3z" />,
  phone: <path d="M21 16.5v2.6a1.9 1.9 0 0 1-2 1.9A17.6 17.6 0 0 1 3.9 5.9a1.9 1.9 0 0 1 1.9-2H8.4a1.9 1.9 0 0 1 1.9 1.6c.1 1 .4 1.9.7 2.8a1.9 1.9 0 0 1-.4 2L9.5 11.4a14.5 14.5 0 0 0 5.5 5.5l1.1-1.1a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.8.7a1.9 1.9 0 0 1 1.6 1.9z" />,
  shield: <path d="M12 2.8 4.5 6v6.1c0 4.6 3.1 8.4 7.5 9.6 4.4-1.2 7.5-5 7.5-9.6V6L12 2.8z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  star: <path d="m12 3.6 2.6 5.4 5.9.85-4.25 4.15 1 5.9L12 17.05 6.75 19.9l1-5.9L3.5 9.85l5.9-.85z" />,
  sparkle: (
    <>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  edit: <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />,
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  plus: <path d="M12 4.5v15M4.5 12h15" />,
  trash: <path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5" />,
  eye: (
    <>
      <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

export function Icon({
  name,
  size = 24,
  className,
}: {
  name: IconName | string;
  size?: number;
  className?: string;
}) {
  const paths = PATHS[name as IconName];

  // An unknown name must not crash the page. A neutral ring is invisible enough
  // to go unnoticed but keeps the layout intact.
  if (!paths) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );
}