import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import {LegalPage} from '@/components/LegalPage';
import {asLocale} from '@/i18n/locales';
import {site} from '@/lib/site';

export async function generateMetadata({params}: PageProps<'/[locale]/sobre'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale: asLocale(locale), namespace: 'About'});
  return {title: t('title')};
}

export default function Page({params}: PageProps<'/[locale]/sobre'>) {
  setRequestLocale(asLocale(use(params).locale));
  const t = useTranslations('About');
  return (
    <LegalPage title={t('title')}>
      <p>{t('intro')}</p>

      <h2>{t('safeTitle')}</h2>
      <p>{t('safe1')}</p>
      <p>{t('safe2')}</p>
      {site.host && <p>{t('safeHost', {host: site.host})}</p>}

      <h2>{t('whoTitle')}</h2>
      <p>{t('who', {operator: site.operator})}</p>

      <h2>{t('codeTitle')}</h2>
      <p>{t.rich('code', {repo: (chunks) => <a href={site.repositoryUrl}>{chunks}</a>})}</p>
    </LegalPage>
  );
}
