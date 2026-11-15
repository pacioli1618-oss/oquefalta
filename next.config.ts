import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
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
