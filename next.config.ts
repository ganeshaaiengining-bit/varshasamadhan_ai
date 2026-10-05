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
    ];
  },
};

export default config;