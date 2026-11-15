import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,

  /**
   * `varsha-samadhan` sits beside two other projects in the parent folder, each
   * with its own lockfile. Without an explicit root, Next traces from the parent
   * and silently omits files it thinks belong to a sibling — which only shows up
   * as a missing module after a production build, never in dev.
   */
  outputFileTracingRoot: process.cwd(),

  /**
   * Prisma's query engine is a native binary, not JavaScript.
   *
   * Next bundles server code by copying what it can statically trace, and it
   * does not follow a `.node` file. Left out of this list, a production build
   * succeeds and then every database call fails at runtime with
   * "Cannot find module .prisma/client" — on the deployed site only, never
   * locally, because `npm run dev` does not bundle at all.
   */
  serverExternalPackages: ['@prisma/client', '.prisma/client'],

  poweredByHeader: false,

  async headers() {
    return [
      {
        // Voice input and text-to-speech need a secure context in production.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'microphone=(self)' },
        ],
      },
      {
        /*
         * Art and recordings never change under the same name.
         *
         * Without this, Vercel serves a public file with `max-age=0`, so a
         * returning visitor re-checks the sun, the sky and every aarti before
         * it can paint. A week is long enough to matter and short enough that a
         * replaced picture is not stuck in a cache for a year; the stale window
         * means the re-check happens in the background instead of in front of
         * the visitor.
         */
        source: '/art/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default config;