import type {Metadata} from 'next';
import {ListScreen} from '@/components/ListScreen';

export const metadata: Metadata = {
  title: 'Lista de compras · o que falta',
  description: 'Abra para ver e marcar o que já comprou. Não precisa de cadastro.',
};

export default async function Page({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  return <ListScreen slug={slug} />;
}
