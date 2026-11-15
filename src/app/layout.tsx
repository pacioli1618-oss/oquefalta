import type {Metadata, Viewport} from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const description = 'Lista de compras compartilhada, sem cadastro. Manda o link e pronto.';

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: 'o que falta',
  description,
  applicationName: 'o que falta',
  openGraph: {title: 'o que falta', description, siteName: 'o que falta', type: 'website', locale: 'pt_BR'},
  appleWebApp: {capable: true, title: 'o que falta', statusBarStyle: 'default'},
  // Lists are private links: keep them out of search engines.
  robots: {index: false, follow: false},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f3f4f6'},
    {media: '(prefers-color-scheme: dark)', color: '#0d0f13'},
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
