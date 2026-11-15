import type {Metadata} from 'next';
import {ListsScreen} from '@/components/ListsScreen';

export const metadata: Metadata = {title: 'Minhas listas · o que falta'};

export default function Page() {
  return <ListsScreen />;
}
