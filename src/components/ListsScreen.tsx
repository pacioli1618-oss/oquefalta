'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {api} from '@/lib/api';
import {getDeviceId, saveList} from '@/lib/device-store';
import {useSavedLists} from '@/lib/use-saved-lists';
import {errorMessage} from './ListScreen';
import {Brand, Disclaimers, Icon, paths} from './ui';

function whenLabel(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'aberta hoje';
  if (days === 1) return 'aberta ontem';
  return `aberta há ${days} dias`;
}

export function ListsScreen() {
  const router = useRouter();
  const lists = useSavedLists();
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    const name = draft.trim().slice(0, 80);
    if (!name || busy) return;
    setBusy(true);
    setError(null);
    try {
      const {slug} = await api.createList(name, getDeviceId());
      saveList(slug, name);
      router.push(`/l/${slug}`);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  }

  const count = lists?.length ?? 0;

  return (
    <main className="screen">
      <div className="header">
        <div className="topbar">
          <Brand href="/" />
        </div>
        <span className="label">{count === 1 ? '1 lista salva' : `${count} listas salvas`}</span>
        <h1 className="title">Minhas listas</h1>
      </div>

      <div style={{padding: '0 24px'}}>
        <form
          className="inputRow"
          onSubmit={(e) => {
            e.preventDefault();
            void create();
          }}
        >
          <label htmlFor="new-list" className="visually-hidden">
            Nome da nova lista
          </label>
          <input id="new-list" type="text" autoComplete="off" maxLength={80} placeholder="nova lista (ex.: churrasco)" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className="textButton" disabled={busy}>
            Criar
          </button>
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="content" style={{gap: 10}}>
        {lists?.map((l) => (
          <Link key={l.slug} href={`/l/${l.slug}`} className="listCard">
            <span className="listIcon" aria-hidden="true">
              <Icon d={paths.list} size={22} />
            </span>
            <span style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
              <span style={{fontSize: 17, lineHeight: '24px', fontWeight: 600, overflowWrap: 'anywhere'}}>{l.name}</span>
              <span style={{fontSize: 13, lineHeight: '20px', color: 'var(--ink-muted)'}}>{whenLabel(l.openedAt)}</span>
            </span>
            <span style={{color: 'var(--ink-muted)', display: 'flex'}}>
              <Icon d={paths.chevronRight} size={20} strokeWidth={2} />
            </span>
          </Link>
        ))}
        {lists && lists.length === 0 && <p className="empty">Nenhuma lista neste celular ainda. Crie uma acima.</p>}
        <div className="trust" style={{padding: '12px 4px 0'}}>
          <span style={{flexShrink: 0, marginTop: 1}}>
            <Icon d={paths.phone} size={18} />
          </span>
          <span>As listas ficam salvas neste celular, sem conta. Cada uma tem o próprio link: abra o link em outro aparelho e ela aparece lá também.</span>
        </div>
      </div>

      <div className="footer">
        <Disclaimers />
      </div>
    </main>
  );
}
