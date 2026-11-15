'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Sheet} from './ui';

export function RenameSheet({initial, onSave, onClose}: {initial: string; onSave: (name: string) => void; onClose: () => void}) {
  const t = useTranslations('Rename');
  const common = useTranslations('Common');
  const [name, setName] = useState(initial);
  const trimmed = name.trim();
  return (
    <Sheet title={t('title')} onClose={onClose}>
      <form
        style={{display: 'flex', flexDirection: 'column', gap: 16}}
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onSave(trimmed.slice(0, 80));
        }}
      >
        <div className="inputRow">
          <label htmlFor="list-name" className="visually-hidden">
            {t('title')}
          </label>
          <input id="list-name" value={name} maxLength={80} autoComplete="off" onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="primary" disabled={!trimmed}>
          {common('save')}
        </button>
      </form>
    </Sheet>
  );
}
