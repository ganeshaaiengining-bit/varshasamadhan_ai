import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

/**
 * Breadcrumb trail.
 *
 * Rendered as an `<ol>` with the current page marked `aria-current`, so a screen
 * reader announces "2 of 3" rather than reading three unrelated links. The
 * separators are decorative spans, hidden from assistive technology — otherwise
 * every trail is announced as "Home, greater than, Category".
 */
export function Breadcrumbs({
  items,
  ariaLabel = 'Breadcrumb',
}: {
  items: { href?: string; label: string }[];
  /**
   * Passed in rather than looked up.
   *
   * This is a server component, so it has no access to the language context, and
   * the labels are already translated by the caller that owns them — reaching
   * for a second translator here would be a client component for the sake of one
   * `aria-label`.
   */
  ariaLabel?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-subtle">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-saffron-deep">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'font-semibold text-ink' : ''}>
                  {item.label}
                </span>
              )}
              {last ? null : (
                <Icon name="arrow" size={13} className="rotate-180 opacity-50" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}