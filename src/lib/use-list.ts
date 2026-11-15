'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {api, ApiError, subscribeToList, type ListData} from './api';
import {saveList} from './device-store';

const REFRESH_DEBOUNCE_MS = 300;

export type ListState =
  | {status: 'loading'}
  | {status: 'not_found'}
  | {status: 'error'}
  | {status: 'ready'; data: ListData};

/**
 * Keeps one list fresh: loads it, reloads when the database announces a change
 * (Realtime broadcast), when the tab becomes visible again, and after our own writes.
 * An older response never overwrites a newer one.
 */
export function useList(slug: string) {
  const [state, setState] = useState<ListState>({status: 'loading'});
  const latest = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const refresh = useCallback(async () => {
    const request = ++latest.current;
    try {
      const data = await api.getList(slug);
      if (request !== latest.current) return;
      setState({status: 'ready', data});
      saveList(slug, data.list.name);
    } catch (error) {
      if (request !== latest.current) return;
      if (error instanceof ApiError && error.code === 'list_not_found') setState({status: 'not_found'});
      else setState((s) => (s.status === 'ready' ? s : {status: 'error'}));
    }
  }, [slug]);

  useEffect(() => {
    const schedule = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void refresh(), REFRESH_DEBOUNCE_MS);
    };
    const unsubscribe = subscribeToList(slug, schedule, () => void refresh());
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    queueMicrotask(() => void refresh());
    return () => {
      clearTimeout(timer.current);
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [slug, refresh]);

  /** Applies a local change right away (optimistic), runs the write, then reloads. */
  const mutate = useCallback(
    async (change: (data: ListData) => ListData, write: () => Promise<unknown>) => {
      setState((s) => (s.status === 'ready' ? {status: 'ready', data: change(s.data)} : s));
      try {
        await write();
      } finally {
        await refresh();
      }
    },
    [refresh],
  );

  return {state, refresh, mutate};
}
