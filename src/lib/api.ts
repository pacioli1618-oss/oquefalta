import {supabase} from './supabase';

export type Category = {id: string; name: string; icon: string; sort: number; isOther: boolean};
export type Item = {id: string; name: string; categoryId: string | null; done: boolean; doneAt: string | null; createdAt: string};
export type ListData = {
  list: {slug: string; name: string; createdAt: string; updatedAt: string};
  categories: Category[];
  items: Item[];
};
export type CategoryDraft = {id: string | null; name: string; icon: string};

type RawCategory = {id: string; name: string; icon: string; sort: number; is_other: boolean};
type RawItem = {id: string; name: string; category_id: string | null; done: boolean; done_at: string | null; created_at: string};
type RawList = {
  list: {slug: string; name: string; created_at: string; updated_at: string};
  categories: RawCategory[];
  items: RawItem[];
};

/** Error with the business code raised by the database (list_not_found, rate_limited, ...). */
export class ApiError extends Error {
  constructor(public code: string, message?: string) {
    super(message ?? code);
  }
}

async function call<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const {data, error} = await supabase.rpc(fn, args);
  if (error) {
    const known = ['list_not_found', 'item_not_found', 'category_not_found', 'too_many_items', 'too_many_categories', 'rate_limited'];
    const code = known.find((c) => error.message?.includes(c)) ?? 'unknown';
    throw new ApiError(code, error.message);
  }
  return data as T;
}

export function mapItem(i: RawItem): Item {
  return {id: i.id, name: i.name, categoryId: i.category_id, done: i.done, doneAt: i.done_at, createdAt: i.created_at};
}

export function mapList(raw: RawList): ListData {
  return {
    list: {slug: raw.list.slug, name: raw.list.name, createdAt: raw.list.created_at, updatedAt: raw.list.updated_at},
    categories: raw.categories.map((c) => ({id: c.id, name: c.name, icon: c.icon, sort: c.sort, isOther: c.is_other})),
    items: raw.items.map(mapItem),
  };
}

export const api = {
  async getList(slug: string) {
    return mapList(await call<RawList>('of_get_list', {p_slug: slug}));
  },
  /** The locale picks the language of the default categories (they are data, editable later). */
  async createList(name: string, deviceId: string, locale: string) {
    return call<{slug: string}>('of_create_list', {p_name: name, p_device_id: deviceId, p_locale: locale});
  },
  renameList(slug: string, name: string) {
    return call<void>('of_rename_list', {p_slug: slug, p_name: name});
  },
  async addItem(slug: string, name: string, categoryId: string | null) {
    return mapItem(await call<RawItem>('of_add_item', {p_slug: slug, p_name: name, p_category_id: categoryId}));
  },
  setItemDone(slug: string, itemId: string, done: boolean) {
    return call<void>('of_set_item_done', {p_slug: slug, p_item_id: itemId, p_done: done});
  },
  updateItem(slug: string, itemId: string, name: string, categoryId: string) {
    return call<void>('of_update_item', {p_slug: slug, p_item_id: itemId, p_name: name, p_category_id: categoryId});
  },
  deleteItem(slug: string, itemId: string) {
    return call<void>('of_delete_item', {p_slug: slug, p_item_id: itemId});
  },
  clearDone(slug: string) {
    return call<void>('of_clear_done', {p_slug: slug});
  },
  saveCategories(slug: string, categories: CategoryDraft[]) {
    return call<void>('of_save_categories', {p_slug: slug, p_categories: categories});
  },
};

/** Listens for "changed" notices on this list and calls onChange (debounced by the caller). */
export function subscribeToList(slug: string, onChange: () => void, onReconnect: () => void) {
  let wasSubscribed = false;
  const channel = supabase
    .channel(`oqfalta:${slug}`)
    .on('broadcast', {event: 'changed'}, () => onChange())
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        if (wasSubscribed) onReconnect();
        wasSubscribed = true;
      }
    });
  return () => {
    void supabase.removeChannel(channel);
  };
}
