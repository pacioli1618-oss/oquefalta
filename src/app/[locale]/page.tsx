import {setRequestLocale} from 'next-intl/server';
import {asLocale} from '@/i18n/locales';
import {HomeScreen} from '@/components/HomeScreen';

export default async function Page({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(asLocale(locale));
  return <HomeScreen />;
}
