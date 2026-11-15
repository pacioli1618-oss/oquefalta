'use client';

import Link from 'next/link';
import {useCallback, useState} from 'react';
import {api, ApiError, type Item, type ListData} from '@/lib/api';
import {forgetList} from '@/lib/device-store';
import {useList} from '@/lib/use-list';
import {ItemSheet} from './ItemSheet';
import {ListBody, countLabel, pickCategory, type AddResult} from './ListBody';
import {RenameSheet} from './RenameSheet';
import {ShareSheet} from './ShareSheet';
import {Brand, Disclaimers, Icon, paths} from './ui';

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'too_many_items') return 'A lista chegou ao limite de 500 itens. Limpe os comprados para abrir espaço.';
    if (error.code === 'rate_limited') return 'Muitas listas criadas em pouco tempo. Tente de novo mais tarde.';
    if (error.code === 'list_not_found') return 'Esta lista não existe mais.';
  }
  return 'Não deu para salvar. Confira a internet e tente de novo.';
}

export function ListScreen({slug}: {slug: string}) {
  const {state, mutate} = useList(slug);
  const [sheet, setSheet] = useState<'share' | 'rename' | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSheet(null), []);
  const closeEditor = useCallback(() => setEditing(null), []);

  if (state.status === 'loading') {
    return (
      <main className="screen">
        <div className="header">
          <div className="topbar">
            <Brand />
          </div>
        </div>
        <p className="empty">Carregando a lista…</p>
      </main>
    );
  }

  if (state.status === 'not_found' || state.status === 'error') {
    const notFound = state.status === 'not_found';
    return (
      <main className="screen">
        <div className="header">
          <div className="topbar">
            <Brand />
          </div>
        </div>
        <div className="empty">
          <p className="emptyTitle">{notFound ? 'Lista não encontrada' : 'Não deu para abrir a lista'}</p>
          {notFound ? 'O link pode estar incompleto ou a lista foi apagada.' : 'Confira a internet e tente de novo.'}
          <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10}}>
            {notFound && (
              <button type="button" className="secondary" onClick={() => forgetList(slug)}>
                Tirar das minhas listas
              </button>
            )}
            <Link className="primary" href="/listas">
              Ver minhas listas
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const data = state.data;

  async function run(change: (d: ListData) => ListData, write: () => Promise<unknown>) {
    setError(null);
    try {
      await mutate(change, write);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  async function add(name: string): Promise<AddResult | null> {
    const category = pickCategory(data.categories, name);
    const existing = data.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
    let itemId: string | null = existing?.id ?? null;
    const tempId = `temp-${Date.now()}`;
    await run(
      (d) =>
        existing
          ? {...d, items: d.items.map((i) => (i.id === existing.id ? {...i, done: false} : i))}
          : {...d, items: [...d.items, {id: tempId, name, categoryId: category?.id ?? null, done: false, doneAt: null, createdAt: new Date().toISOString()}]},
      async () => {
        const item = await api.addItem(slug, name, category?.id ?? null);
        itemId = item.id;
      },
    );
    const finalCategory = data.categories.find((c) => c.id === (existing?.categoryId ?? category?.id));
    return {itemName: existing?.name ?? name, categoryName: finalCategory?.name ?? 'Outros', itemId};
  }

  return (
    <main className="screen">
      <div className="header">
        <div className="topbar">
          <Brand />
          <div style={{display: 'flex'}}>
            <button type="button" className="iconButton" aria-label="Renomear lista" onClick={() => setSheet('rename')}>
              <Icon d={paths.pencil} size={21} />
            </button>
            <Link href={`/l/${slug}/categorias`} className="iconButton" aria-label="Editar categorias">
              <Icon d={paths.tag} size={22} />
            </Link>
          </div>
        </div>
        <span className="label">{countLabel(data.items)}</span>
        <Link href="/listas" className="titleLink" aria-label={`${data.list.name}: trocar de lista`}>
          <h1 className="title">{data.list.name}</h1>
          <span style={{color: 'var(--ink-soft)', display: 'flex'}}>
            <Icon d={paths.chevronDown} size={22} strokeWidth={2} />
          </span>
        </Link>
      </div>

      <ListBody
        categories={data.categories}
        items={data.items}
        error={error}
        onAdd={add}
        onEdit={setEditing}
        onToggle={(item) =>
          void run(
            (d) => ({...d, items: d.items.map((i) => (i.id === item.id ? {...i, done: !i.done} : i))}),
            () => api.setItemDone(slug, item.id, !item.done),
          )
        }
        onClearDone={() =>
          void run(
            (d) => ({...d, items: d.items.filter((i) => !i.done)}),
            () => api.clearDone(slug),
          )
        }
      />

      <div className="footer">
        <button type="button" className="primary" onClick={() => setSheet('share')}>
          <Icon d={paths.share} />
          Compartilhar lista
        </button>
        <Disclaimers />
      </div>

      {sheet === 'share' && <ShareSheet slug={slug} listName={data.list.name} onClose={closeSheet} />}
      {sheet === 'rename' && (
        <RenameSheet
          initial={data.list.name}
          onClose={closeSheet}
          onSave={(name) => {
            setSheet(null);
            void run(
              (d) => ({...d, list: {...d.list, name}}),
              () => api.renameList(slug, name),
            );
          }}
        />
      )}
      {editing && (
        <ItemSheet
          item={editing}
          categories={data.categories}
          onClose={closeEditor}
          onSave={(name, categoryId) => {
            const id = editing.id;
            setEditing(null);
            void run(
              (d) => ({...d, items: d.items.map((i) => (i.id === id ? {...i, name, categoryId} : i))}),
              () => api.updateItem(slug, id, name, categoryId),
            );
          }}
          onDelete={() => {
            const id = editing.id;
            setEditing(null);
            void run(
              (d) => ({...d, items: d.items.filter((i) => i.id !== id)}),
              () => api.deleteItem(slug, id),
            );
          }}
        />
      )}
    </main>
  );
}
