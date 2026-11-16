import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import {LegalPage} from '@/components/LegalPage';
import {asLocale} from '@/i18n/locales';
import {site} from '@/lib/site';

export async function generateMetadata({params}: PageProps<'/[locale]/privacidade'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale: asLocale(locale), namespace: 'Privacy'});
  return {title: `${t('title')} · oquefalta`};
}

export default function Page({params}: PageProps<'/[locale]/privacidade'>) {
  setRequestLocale(asLocale(use(params).locale));
  const t = useTranslations('Privacy');
  return (
    <LegalPage title={t('title')} updated>
      <p>{t('intro')}</p>

      <h2>{t('collectTitle')}</h2>
      <p>{t('collect1')}</p>
      <p>{t('collect2')}</p>
      <p>{t('collect3')}</p>

      <h2>{t('visibilityTitle')}</h2>
      <p>{t('visibility')}</p>

      <h2>{t('deviceTitle')}</h2>
      <p>{t('device')}</p>

      <h2>{t('providersTitle')}</h2>
      <p>{t('providers')}</p>

      <h2>{t('retentionTitle')}</h2>
      <p>{t('retention')}</p>

      <h2>{t('rightsTitle')}</h2>
      <p>{t('rights1')}</p>
      <p>{t('rights2')}</p>

      <h2>{t('controllerTitle')}</h2>
      <p>{t('controller', {operator: site.operator})}</p>
    </LegalPage>
  );
}
