'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useState} from 'react';
import {Link, useRouter} from '@/i18n/navigation';
import {api} from '@/lib/api';
import {getDeviceId, saveList} from '@/lib/device-store';
import {useSavedLists} from '@/lib/use-saved-lists';
import {useErrorMessage} from './ListScreen';
import {Brand, Disclaimers, Icon, paths} from './ui';

function whenLabel(iso: string, t: ReturnType<typeof useTranslations<'Lists'>>) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return t('openedToday');
  if (days === 1) return t('openedYesterday');
  return t('openedDaysAgo', {days});
}

export function ListsScreen() {
  const t = useTranslations('Lists');
  const locale = useLocale();
  const errorMessage = useErrorMessage();
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
      const {slug} = await api.createList(name, getDeviceId(), locale);
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
        <span className="label">{t('saved', {count})}</span>
        <h1 className="title">{t('title')}</h1>
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
            {t('newListLabel')}
          </label>
          <input id="new-list" type="text" autoComplete="off" maxLength={80} placeholder={t('newListPlaceholder')} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className="textButton" disabled={busy}>
            {t('create')}
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
              <span style={{fontSize: 13, lineHeight: '20px', color: 'var(--ink-muted)'}}>{whenLabel(l.openedAt, t)}</span>
            </span>
            <span style={{color: 'var(--ink-muted)', display: 'flex'}}>
              <Icon d={paths.chevronRight} size={20} strokeWidth={2} />
            </span>
          </Link>
        ))}
        {lists && lists.length === 0 && <p className="empty">{t('empty')}</p>}
        <div className="trust" style={{padding: '12px 4px 0'}}>
          <span style={{flexShrink: 0, marginTop: 1}}>
            <Icon d={paths.phone} size={18} />
          </span>
          <span>{t('deviceNote')}</span>
        </div>
      </div>

      <div className="footer">
        <Disclaimers />
      </div>
    </main>
  );
}
