'use client';

import {useTranslations} from 'next-intl';
import {useRef, useState, type ReactNode} from 'react';
import type {Category, Item} from '@/lib/api';
import {guessIcon} from '@/lib/categorize';
import {CategoryIcon, Icon, paths} from './ui';

export type AddResult = {itemName: string; categoryName: string; itemId: string | null};

/** Pending count label: "FALTAM 5 ITENS". */
export function useCountLabel() {
  const t = useTranslations('ListBody');
  return (items: Item[]) => t('count', {pending: items.filter((i) => !i.done).length, total: items.length});
}

/** Category for a new item: by guessed icon, else "Outros". */
export function pickCategory(categories: Category[], itemName: string): Category | undefined {
  const icon = guessIcon(itemName);
  return (icon && categories.find((c) => c.icon === icon && !c.isOther)) || categories.find((c) => c.isOther);
}

/** Input + grouped items + bought items. Data and writes come from the parent. */
export function ListBody({
  categories,
  items,
  onAdd,
  onToggle,
  onClearDone,
  onEdit,
  busy,
  error,
}: {
  categories: Category[];
  items: Item[];
  onAdd: (name: string) => Promise<AddResult | null>;
  onToggle: (item: Item) => void;
  onClearDone: () => void;
  onEdit: (item: Item) => void;
  busy?: boolean;
  error?: string | null;
}) {
  const t = useTranslations('ListBody');
  const [draft, setDraft] = useState('');
  const [last, setLast] = useState<AddResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    const name = draft.trim().slice(0, 80);
    if (!name) return;
    setDraft('');
    inputRef.current?.focus();
    const result = await onAdd(name);
    setLast(result);
  }

  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);
  const ordered = [...categories].sort((a, b) => Number(a.isOther) - Number(b.isOther) || a.sort - b.sort);
  const other = categories.find((c) => c.isOther);
  const groups = ordered
    .map((c) => ({category: c, items: pending.filter((i) => (i.categoryId ?? other?.id) === c.id)}))
    .filter((g) => g.items.length > 0);
  const lastItem = last?.itemId ? items.find((i) => i.id === last.itemId) : undefined;

  return (
    <>
      <div style={{padding: '0 24px'}}>
        <form
          className="inputRow"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <label htmlFor="new-item" className="visually-hidden">
            {t('newItem')}
          </label>
          <input
            id="new-item"
            ref={inputRef}
            type="text"
            autoComplete="off"
            enterKeyHint="done"
            placeholder={t('placeholder')}
            maxLength={80}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="addButton" aria-label={t('add')} disabled={busy}>
            <Icon d={paths.plus} size={22} strokeWidth={2} />
          </button>
        </form>
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : (
          last && (
            <p className="hint" aria-live="polite">
              {t('added', {item: last.itemName, category: last.categoryName})}{' '}
              {lastItem && (
                <button type="button" className="linkButton" style={{minHeight: 0, padding: 0, fontSize: 13}} onClick={() => onEdit(lastItem)}>
                  {t('change')}
                </button>
              )}
            </p>
          )
        )}
      </div>

      <div className="content">
        {groups.map(({category, items: groupItems}) => (
          <section key={category.id} className="group" aria-label={category.name}>
            <div className="groupHead">
              <span className="iconChip" aria-hidden="true">
                <CategoryIcon icon={category.icon} />
              </span>
              <span className="groupName">{category.name}</span>
              <span className="groupCount">{groupItems.length}</span>
            </div>
            <div className="card">
              {groupItems.map((item) => (
                <ItemRow key={item.id} item={item} onToggle={onToggle} onEdit={onEdit}>
                  <span className="box" aria-hidden="true" />
                </ItemRow>
              ))}
            </div>
          </section>
        ))}

        {items.length === 0 && (
          <div className="empty">
            <p className="emptyTitle">{t('emptyTitle')}</p>
            {t('emptyText')}
          </div>
        )}

        {done.length > 0 && (
          <section className="group" aria-label={t('cart')}>
            <div className="sectionHead">
              <span className="label">{t('cartCount', {count: done.length})}</span>
              <button type="button" className="linkButton" onClick={onClearDone}>
                {t('clearDone')}
              </button>
            </div>
            <div className="card">
              {done.map((item) => (
                <ItemRow key={item.id} item={item} onToggle={onToggle} onEdit={onEdit}>
                  <span className="boxChecked" aria-hidden="true">
                    <Icon d={paths.check} size={14} strokeWidth={3} />
                  </span>
                </ItemRow>
              ))}
            </div>
          </section>
        )}

        {items.length > 0 && (
          <p className="hint" style={{textAlign: 'center'}}>
            {t('tapHint')}
          </p>
        )}
      </div>
    </>
  );
}

/** Tap toggles; long press (or right click) opens the editor. */
function ItemRow({item, onToggle, onEdit, children}: {item: Item; onToggle: (i: Item) => void; onEdit: (i: Item) => void; children: ReactNode}) {
  const t = useTranslations('ListBody');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const longPressed = useRef(false);
  const start = useRef<{x: number; y: number} | null>(null);

  function cancel() {
    clearTimeout(timer.current);
    start.current = null;
  }

  return (
    <button
      type="button"
      className={item.done ? 'row done' : 'row'}
      aria-label={item.done ? t('markPending', {name: item.name}) : t('markDone', {name: item.name})}
      onPointerDown={(e) => {
        longPressed.current = false;
        start.current = {x: e.clientX, y: e.clientY};
        timer.current = setTimeout(() => {
          longPressed.current = true;
          onEdit(item);
        }, 550);
      }}
      onPointerMove={(e) => {
        if (start.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 10) cancel();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => {
        e.preventDefault();
        cancel();
        longPressed.current = true;
        onEdit(item);
      }}
      onClick={() => {
        if (longPressed.current) {
          longPressed.current = false;
          return;
        }
        onToggle(item);
      }}
    >
      {children}
      <span className="rowText">{item.name}</span>
    </button>
  );
}
