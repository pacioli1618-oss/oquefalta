import type {Metadata, Viewport} from 'next';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import {ogLocales} from '@/i18n/locales';
import {routing} from '@/i18n/routing';
import '../globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({locale, namespace: 'Metadata'});
  const description = t('description');
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: 'oquefalta',
    description,
    applicationName: 'oquefalta',
    openGraph: {title: 'oquefalta', description, siteName: 'oquefalta', type: 'website', locale: ogLocales[locale]},
    appleWebApp: {capable: true, title: 'oquefalta', statusBarStyle: 'default'},
    // Lists are private links: keep them out of search engines.
    robots: {index: false, follow: false},
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f3f4f6'},
    {media: '(prefers-color-scheme: dark)', color: '#0d0f13'},
  ],
};

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
