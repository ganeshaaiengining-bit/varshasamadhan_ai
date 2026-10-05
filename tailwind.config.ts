import type { Config } from 'tailwindcss';

/**
 * Tailwind is told about the CSS variables in `globals.css` rather than being
 * given hex values here, so the palette exists in exactly one place.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        saffron: 'rgb(var(--c-saffron) / <alpha-value>)',
        'saffron-soft': 'rgb(var(--c-saffron-soft) / <alpha-value>)',
        'saffron-deep': 'rgb(var(--c-saffron-deep) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--c-ink-soft) / <alpha-value>)',
        /*
         * Declared as three steps rather than as one colour with an opacity
         * modifier. `text-ink-muted/60` only resolves because the colour is a
         * real Tailwind token — hand-writing `text-ink-muted` in a `@layer
         * utilities` block produces a class that has no alpha support, which
         * fails the build the first time someone writes a modifier against it.
         */
        'ink-muted': 'rgb(var(--c-ink-soft) / 0.72)',
        'ink-subtle': 'rgb(var(--c-ink-soft) / 0.52)',
        teal: 'rgb(var(--c-teal) / <alpha-value>)',
        indigo: 'rgb(var(--c-indigo) / <alpha-value>)',
        rose: 'rgb(var(--c-rose) / <alpha-value>)',
        leaf: 'rgb(var(--c-leaf) / <alpha-value>)',
        amber: 'rgb(var(--c-amber) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
      },
      boxShadow: {
        card: '0 2px 8px -2px rgb(var(--c-ink) / 0.08)',
        lift: '0 12px 32px -8px rgb(var(--c-ink) / 0.18)',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;