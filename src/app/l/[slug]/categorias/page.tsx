import type {Metadata} from 'next';
import {CategoriesScreen} from '@/components/CategoriesScreen';

export const metadata: Metadata = {title: 'Categorias · o que falta'};

export default async function Page({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  return <CategoriesScreen slug={slug} />;
}
