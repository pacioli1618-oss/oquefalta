import type {Metadata} from 'next';
import {asLocale} from '@/i18n/locales';
import {getTranslations} from 'next-intl/server';
import {CategoriesScreen} from '@/components/CategoriesScreen';

export async function generateMetadata({params}: PageProps<'/[locale]/l/[slug]/categorias'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale: asLocale(locale), namespace: 'Metadata'});
  return {title: `${t('categoriesTitle')} · oquefalta`};
}

export default async function Page({params}: PageProps<'/[locale]/l/[slug]/categorias'>) {
  const {slug} = await params;
  return <CategoriesScreen slug={slug} />;
}
