'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMemo, useState} from 'react';
import {api, type CategoryDraft} from '@/lib/api';
import {ICONS, ICON_KEYS} from '@/lib/icons';
import {useList} from '@/lib/use-list';
import {errorMessage} from './ListScreen';
import {CategoryIcon, Icon, paths} from './ui';

type Row = CategoryDraft & {key: string; isOther: boolean};

export function CategoriesScreen({slug}: {slug: string}) {
  const router = useRouter();
  const {state} = useList(slug);
  const [edited, setRows] = useState<Row[] | null>(null);
  const [picking, setPicking] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The list's categories until the first edit; after that, the screen's own copy until "Salvar".
  const initial = useMemo<Row[] | null>(() => {
    if (state.status !== 'ready') return null;
    const sorted = [...state.data.categories].sort((a, b) => Number(a.isOther) - Number(b.isOther) || a.sort - b.sort);
    return sorted.map((c) => ({key: c.id, id: c.id, name: c.name, icon: c.icon, isOther: c.isOther}));
  }, [state]);
  const rows = edited ?? initial;

  const back = `/l/${slug}`;

  if (state.status === 'not_found' || state.status === 'error') {
    return (
      <main className="screen">
        <p className="empty">Não deu para abrir as categorias desta lista.</p>
        <Link className="primary" href={back} style={{margin: '0 24px', width: 'auto'}}>
          Voltar para a lista
        </Link>
      </main>
    );
  }

  const movable = rows ? rows.filter((r) => !r.isOther).length : 0;

  function update(key: string, patch: Partial<Row>) {
    if (rows) setRows(rows.map((r) => (r.key === key ? {...r, ...patch} : r)));
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (!rows || j < 0 || j >= movable) return;
    const next = [...rows];
    [next[index], next[j]] = [next[j], next[index]];
    setRows(next);
  }

  function addRow() {
    if (!rows || rows.length >= 30) return;
    const key = `new-${Date.now()}`;
    const next = [...rows];
    next.splice(movable, 0, {key, id: null, name: 'Nova categoria', icon: 'casa', isOther: false});
    setRows(next);
    setPicking(key);
  }

  async function save() {
    if (!rows) return;
    const clean = rows.map((r) => ({...r, name: r.name.trim().slice(0, 40)}));
    if (clean.some((r) => !r.name)) {
      setError('Toda categoria precisa de um nome.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.saveCategories(slug, clean.map(({id, name, icon}) => ({id, name, icon})));
      router.push(back);
    } catch (e) {
      setError(errorMessage(e));
      setSaving(false);
    }
  }

  return (
    <main className="screen">
      <div className="header" style={{paddingLeft: 12}}>
        <Link href={back} className="linkButton" style={{display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', textDecoration: 'none', padding: '0 8px'}}>
          <Icon d={paths.chevronLeft} size={20} strokeWidth={2} />
          Voltar para a lista
        </Link>
        <div style={{paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 6}}>
          <h1 className="title">Categorias</h1>
          <p style={{margin: 0, fontSize: 15, lineHeight: '23px', color: 'var(--ink-muted)'}}>
            A lista segue esta ordem. Deixe na ordem dos corredores do seu mercado. Toque no ícone para trocar.
          </p>
        </div>
      </div>

      <div className="content" style={{gap: 12, paddingTop: 8}}>
        {rows === null ? (
          <p className="empty">Carregando…</p>
        ) : (
          <div className="card">
            {rows.map((r, index) => (
              <div key={r.key} style={{display: 'flex', flexDirection: 'column'}}>
                <div className="catRow" style={index === 0 ? {borderTop: 0} : undefined}>
                  <button
                    type="button"
                    className="catIcon"
                    aria-label={`Trocar ícone de ${r.name}`}
                    aria-expanded={picking === r.key}
                    onClick={() => setPicking(picking === r.key ? null : r.key)}
                  >
                    <CategoryIcon icon={r.icon} size={22} />
                  </button>
                  <label htmlFor={`cat-${r.key}`} className="visually-hidden">
                    Nome da categoria
                  </label>
                  <input id={`cat-${r.key}`} className="catName" value={r.name} maxLength={40} onChange={(e) => update(r.key, {name: e.target.value})} />
                  <button type="button" className="iconButton" style={{width: 40}} aria-label={`Subir ${r.name}`} disabled={r.isOther || index === 0} onClick={() => move(index, -1)}>
                    <Icon d={paths.chevronUp} size={20} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="iconButton"
                    style={{width: 40}}
                    aria-label={`Descer ${r.name}`}
                    disabled={r.isOther || index >= movable - 1}
                    onClick={() => move(index, 1)}
                  >
                    <Icon d={paths.chevronDown} size={20} strokeWidth={2} />
                  </button>
                  {r.isOther ? (
                    <span style={{width: 40, flexShrink: 0}} aria-hidden="true" />
                  ) : (
                    <button
                      type="button"
                      className="iconButton"
                      style={{width: 40, color: 'var(--ink-muted)'}}
                      aria-label={`Apagar ${r.name}`}
                      onClick={() => setRows(rows.filter((x) => x.key !== r.key))}
                    >
                      <Icon d={paths.trash} size={19} />
                    </button>
                  )}
                </div>
                {picking === r.key && (
                  <div style={{padding: '2px 8px 14px', display: 'flex', flexDirection: 'column', gap: 8}}>
                    <span className="label" style={{fontSize: 11}}>
                      Escolha um ícone
                    </span>
                    <div className="iconGrid">
                      {ICON_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          className="iconChoice"
                          aria-label={ICONS[key].label}
                          aria-pressed={r.icon === key}
                          onClick={() => {
                            update(r.key, {icon: key});
                            setPicking(null);
                          }}
                        >
                          <CategoryIcon icon={key} size={20} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button type="button" className="dashed" onClick={addRow} disabled={!rows || rows.length >= 30}>
          <Icon d={paths.plus} size={20} strokeWidth={2} />
          Nova categoria
        </button>
        <p className="hint" style={{margin: '0 4px'}}>
          Itens que o app não reconhece vão para Outros. Ao apagar uma categoria, os itens dela também vão para Outros.
        </p>
      </div>

      <div className="footer">
        {error && (
          <p className="error" role="alert" style={{margin: 0}}>
            {error}
          </p>
        )}
        <button type="button" className="primary" onClick={save} disabled={saving || !rows}>
          {saving ? 'Salvando…' : 'Salvar categorias'}
        </button>
      </div>
    </main>
  );
}
