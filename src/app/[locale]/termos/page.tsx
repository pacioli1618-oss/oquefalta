import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import {LegalPage} from '@/components/LegalPage';
import {asLocale} from '@/i18n/locales';

export async function generateMetadata({params}: PageProps<'/[locale]/termos'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale: asLocale(locale), namespace: 'Terms'});
  return {title: `${t('title')} · oquefalta`};
}

export default function Page({params}: PageProps<'/[locale]/termos'>) {
  setRequestLocale(asLocale(use(params).locale));
  const t = useTranslations('Terms');
  return (
    <LegalPage title={t('title')} updated>
      <p>{t('intro')}</p>

      <h2>{t('serviceTitle')}</h2>
      <p>{t('service')}</p>

      <h2>{t('contentTitle')}</h2>
      <p>{t('content')}</p>

      <h2>{t('linksTitle')}</h2>
      <p>{t('links')}</p>

      <h2>{t('paymentsTitle')}</h2>
      <p>{t('payments')}</p>

      <h2>{t('codeTitle')}</h2>
      <p>{t('code')}</p>

      <h2>{t('lawTitle')}</h2>
      <p>{t('law')}</p>
    </LegalPage>
  );
}
