'use client';

import {useMemo, useSyncExternalStore} from 'react';
import {getSavedLists, readSavedListsRaw, subscribeToStore, type SavedList} from './device-store';

/** Lists saved on this device, newest first. `null` on the server and before hydration. */
export function useSavedLists(): SavedList[] | null {
  const raw = useSyncExternalStore(subscribeToStore, readSavedListsRaw, () => null);
  return useMemo(() => (raw === null ? null : getSavedLists(raw)), [raw]);
}
