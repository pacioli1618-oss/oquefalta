// Everything this app keeps in the browser: the device code and the saved lists.
// localStorage can be missing or throw (private mode, some in-app browsers), so every
// access is guarded and falls back to "nothing saved".

export type SavedList = {slug: string; name: string; openedAt: string};

const LISTS_KEY = 'oqfalta:lists';
const DEVICE_KEY = 'oqfalta:device';

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to do: the app keeps working, it just won't remember.
  }
  listeners.forEach((l) => l());
}

/** For useSyncExternalStore: changes from this tab and from other tabs. */
export function subscribeToStore(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

/** Raw saved-lists value: a string, so the snapshot only changes when the data changes. */
export function readSavedListsRaw(): string {
  return read(LISTS_KEY) ?? '[]';
}

export function getDeviceId(): string {
  let id = read(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    write(DEVICE_KEY, id);
  }
  return id;
}

export function getSavedLists(raw: string = readSavedListsRaw()): SavedList[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is SavedList => typeof l?.slug === 'string' && typeof l?.name === 'string')
      .sort((a, b) => (b.openedAt ?? '').localeCompare(a.openedAt ?? ''));
  } catch {
    return [];
  }
}

/** Saves (or refreshes) a list on this device. Opening a shared link saves it too. */
export function saveList(slug: string, name: string) {
  const others = getSavedLists().filter((l) => l.slug !== slug);
  write(LISTS_KEY, JSON.stringify([{slug, name, openedAt: new Date().toISOString()}, ...others]));
}

export function forgetList(slug: string) {
  write(LISTS_KEY, JSON.stringify(getSavedLists().filter((l) => l.slug !== slug)));
}
