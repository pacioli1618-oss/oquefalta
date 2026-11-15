'use client';

import {useState} from 'react';
import {Sheet} from './ui';

export function RenameSheet({initial, onSave, onClose}: {initial: string; onSave: (name: string) => void; onClose: () => void}) {
  const [name, setName] = useState(initial);
  const trimmed = name.trim();
  return (
    <Sheet title="Nome da lista" onClose={onClose}>
      <form
        style={{display: 'flex', flexDirection: 'column', gap: 16}}
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onSave(trimmed.slice(0, 80));
        }}
      >
        <div className="inputRow">
          <label htmlFor="list-name" className="visually-hidden">
            Nome da lista
          </label>
          <input id="list-name" value={name} maxLength={80} autoComplete="off" onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="primary" disabled={!trimmed}>
          Salvar
        </button>
      </form>
    </Sheet>
  );
}
