import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Version shown in the footer: "version" from package.json (bump it on each release)
// plus the short commit of the deploy (Vercel sets VERCEL_GIT_COMMIT_SHA; empty locally).
const {version} = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {version: string};

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: version,
    APP_COMMIT: (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7),
  },
  experimental: {
    // The root layout lives in app/[locale]; URLs that match no route
    // fall back to app/global-not-found.tsx.
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Lists are private links: never send the list address to other sites.
          {key: 'Referrer-Policy', value: 'no-referrer'},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'X-Frame-Options', value: 'DENY'},
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
