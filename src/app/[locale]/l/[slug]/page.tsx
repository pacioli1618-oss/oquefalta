import type {Metadata} from 'next';
import {asLocale} from '@/i18n/locales';
import {getTranslations} from 'next-intl/server';
import {ListScreen} from '@/components/ListScreen';

export async function generateMetadata({params}: PageProps<'/[locale]/l/[slug]'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale: asLocale(locale), namespace: 'Metadata'});
  return {title: `${t('listTitle')} · oquefalta`, description: t('listDescription')};
}

export default async function Page({params}: PageProps<'/[locale]/l/[slug]'>) {
  const {slug} = await params;
  return <ListScreen slug={slug} />;
}
