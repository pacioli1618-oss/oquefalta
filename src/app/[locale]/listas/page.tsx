import type {Metadata} from 'next';
import {asLocale} from '@/i18n/locales';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ListsScreen} from '@/components/ListsScreen';

export async function generateMetadata({params}: PageProps<'/[locale]/listas'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale: asLocale(locale), namespace: 'Metadata'});
  return {title: `${t('listsTitle')} · oquefalta`};
}

export default async function Page({params}: PageProps<'/[locale]/listas'>) {
  const {locale} = await params;
  setRequestLocale(asLocale(locale));
  return <ListsScreen />;
}
