'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import type {Category, Item} from '@/lib/api';
import {CategoryIcon, Icon, Sheet, paths} from './ui';

/** Edit one item: name, category, or delete. Opened with a long press on the item. */
export function ItemSheet({
  item,
  categories,
  onSave,
  onDelete,
  onClose,
}: {
  item: Item;
  categories: Category[];
  onSave: (name: string, categoryId: string) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const t = useTranslations('Item');
  const common = useTranslations('Common');
  const fallback = categories.find((c) => c.isOther)?.id ?? categories[0]?.id ?? '';
  const [name, setName] = useState(item.name);
  const [categoryId, setCategoryId] = useState(item.categoryId ?? fallback);
  const trimmed = name.trim();

  return (
    <Sheet title={t('title')} onClose={onClose}>
      <form
        style={{display: 'flex', flexDirection: 'column', gap: 18}}
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onSave(trimmed.slice(0, 80), categoryId);
        }}
      >
        <div className="inputRow">
          <label htmlFor="item-name" className="visually-hidden">
            {t('nameLabel')}
          </label>
          <input id="item-name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        </div>
        <fieldset style={{border: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8}}>
          <legend className="label" style={{marginBottom: 8}}>
            {t('category')}
          </legend>
          <div className="choiceGrid">
            {categories.map((c) => (
              <button key={c.id} type="button" className="choice" aria-pressed={c.id === categoryId} onClick={() => setCategoryId(c.id)}>
                <span className="iconChip" style={{width: 24, height: 24}}>
                  <CategoryIcon icon={c.icon} size={16} />
                </span>
                <span style={{overflowWrap: 'anywhere'}}>{c.name}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="primary" disabled={!trimmed}>
          {common('save')}
        </button>
        <button type="button" className="secondary" onClick={onDelete}>
          <Icon d={paths.trash} size={19} />
          {t('delete')}
        </button>
      </form>
    </Sheet>
  );
}
