'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {useRouter} from '@/i18n/navigation';
import {api} from '@/lib/api';
import {getDeviceId, saveList} from '@/lib/device-store';
import {useSavedLists} from '@/lib/use-saved-lists';
import {ListBody, pickCategory, type AddResult} from './ListBody';
import {useErrorMessage} from './ListScreen';
import {Brand, Disclaimers, Icon, paths} from './ui';
import {HeaderControls} from './HeaderControls';
import {InstallButton} from './InstallButton';

/**
 * "/": opens the last list used on this device. With none, shows an empty list right away
 * (no screen before the list). The list is only created in the database on the first item.
 */
export function HomeScreen() {
  const t = useTranslations('Home');
  const common = useTranslations('Common');
  const locale = useLocale();
  const errorMessage = useErrorMessage();
  const defaultName = common('defaultListName');
  const router = useRouter();
  const lists = useSavedLists();
  const redirecting = lists === null || lists.length > 0;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lists && lists.length > 0) router.replace(`/l/${lists[0].slug}`);
  }, [lists, router]);

  async function add(name: string): Promise<AddResult | null> {
    setBusy(true);
    setError(null);
    try {
      const {slug} = await api.createList(defaultName, getDeviceId(), locale);
      saveList(slug, defaultName);
      const data = await api.getList(slug);
      const category = pickCategory(data.categories, name);
      await api.addItem(slug, name, category?.id ?? null);
      router.replace(`/l/${slug}`);
      return null;
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
      return null;
    }
  }

  if (redirecting) return <main className="screen" />;

  return (
    <main className="screen">
      <div className="header">
        <div className="topbar">
          <Brand />
          <HeaderControls />
        </div>
        <span className="label">{t('newList')}</span>
        <h1 className="title">{defaultName}</h1>
      </div>
      <ListBody categories={[]} items={[]} busy={busy} error={error} onAdd={add} onToggle={() => {}} onClearDone={() => {}} onEdit={() => {}} />
      <div className="footer">
        <button type="button" className="primary" disabled style={{opacity: 0.5}} aria-describedby="share-later">
          <Icon d={paths.share} />
          {common('share')}
        </button>
        <p id="share-later" className="fine">
          {t('shareLater')}
        </p>
        <InstallButton />
        <Disclaimers />
      </div>
    </main>
  );
}
