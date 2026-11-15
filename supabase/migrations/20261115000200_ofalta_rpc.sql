-- o que falta: public RPCs (public.of_*)
--
-- Every function takes the list slug: having the link is the permission.
-- Business errors used by the app:
--   list_not_found, item_not_found, category_not_found, too_many_items, too_many_categories,
--   invalid_categories, rate_limited (DETAIL 'hour' or 'day')

------------------------------------------------------------------------
-- Read
------------------------------------------------------------------------

create function public.of_get_list(p_slug text)
returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  l ofalta.lists;
begin
  l := ofalta.list_by_slug(p_slug);
  return jsonb_build_object(
    'list', jsonb_build_object('slug', l.slug, 'name', l.name, 'created_at', l.created_at, 'updated_at', l.updated_at),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'icon', c.icon, 'sort', c.sort, 'is_other', c.is_other)
                       order by c.is_other, c.sort, c.created_at)
      from ofalta.categories c where c.list_id = l.id), '[]'::jsonb),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object('id', i.id, 'name', i.name, 'category_id', i.category_id,
                                          'done', i.done, 'done_at', i.done_at, 'created_at', i.created_at)
                       order by i.created_at)
      from ofalta.items i where i.list_id = l.id), '[]'::jsonb)
  );
end $$;

------------------------------------------------------------------------
-- Lists
------------------------------------------------------------------------

-- Creates a list with the default categories. Returns the slug.
create function public.of_create_list(p_name text, p_device_id uuid default null)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_slug text;
  v_id   uuid;
begin
  perform ofalta.check_create_list_rate(p_device_id);

  loop
    v_slug := ofalta.random_text(12);
    exit when not exists (select 1 from ofalta.lists where slug = v_slug);
  end loop;

  insert into ofalta.lists (slug, name)
  values (v_slug, coalesce(nullif(trim(p_name), ''), 'Compras de casa'))
  returning id into v_id;

  insert into ofalta.categories (list_id, name, icon, sort, is_other)
  select v_id, d.name, d.icon, d.sort, d.icon = 'outros'
  from (values
    ('Hortifruti', 'hortifruti', 1),
    ('Padaria', 'padaria', 2),
    ('Laticínios e ovos', 'laticinios', 3),
    ('Carnes', 'carnes', 4),
    ('Mercearia', 'mercearia', 5),
    ('Bebidas', 'bebidas', 6),
    ('Congelados', 'congelados', 7),
    ('Limpeza', 'limpeza', 8),
    ('Higiene', 'higiene', 9),
    ('Pet', 'pet', 10),
    ('Outros', 'outros', 99)
  ) as d(name, icon, sort);

  return jsonb_build_object('slug', v_slug);
end $$;

create function public.of_rename_list(p_slug text, p_name text)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  l ofalta.lists;
begin
  l := ofalta.list_by_slug(p_slug);
  update ofalta.lists set name = trim(p_name), updated_at = now() where id = l.id;
end $$;

------------------------------------------------------------------------
-- Items
------------------------------------------------------------------------

-- Adds an item. If the list already has an item with the same name, brings it back
-- (done = false) instead of creating a duplicate. Returns the item.
create function public.of_add_item(p_slug text, p_name text, p_category_id uuid default null)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  l        ofalta.lists;
  v_name   text := trim(p_name);
  v_cat    uuid;
  v_item   ofalta.items;
begin
  l := ofalta.list_by_slug(p_slug);

  select * into v_item from ofalta.items
  where list_id = l.id and lower(name) = lower(v_name)
  limit 1;

  if found then
    update ofalta.items set done = false, done_at = null where id = v_item.id returning * into v_item;
  else
    if (select count(*) from ofalta.items where list_id = l.id) >= 500 then
      raise exception 'too_many_items';
    end if;
    select id into v_cat from ofalta.categories where id = p_category_id and list_id = l.id;
    v_cat := coalesce(v_cat, ofalta.other_category(l.id));
    insert into ofalta.items (list_id, category_id, name) values (l.id, v_cat, v_name) returning * into v_item;
  end if;

  perform ofalta.touch(l.id);
  return jsonb_build_object('id', v_item.id, 'name', v_item.name, 'category_id', v_item.category_id,
                            'done', v_item.done, 'done_at', v_item.done_at, 'created_at', v_item.created_at);
end $$;

create function public.of_set_item_done(p_slug text, p_item_id uuid, p_done boolean)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  l ofalta.lists;
begin
  l := ofalta.list_by_slug(p_slug);
  update ofalta.items
  set done = p_done, done_at = case when p_done then now() else null end
  where id = p_item_id and list_id = l.id;
  if not found then raise exception 'item_not_found'; end if;
  perform ofalta.touch(l.id);
end $$;

create function public.of_update_item(p_slug text, p_item_id uuid, p_name text, p_category_id uuid)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  l     ofalta.lists;
  v_cat uuid;
begin
  l := ofalta.list_by_slug(p_slug);
  select id into v_cat from ofalta.categories where id = p_category_id and list_id = l.id;
  if v_cat is null then raise exception 'category_not_found'; end if;
  update ofalta.items set name = trim(p_name), category_id = v_cat
  where id = p_item_id and list_id = l.id;
  if not found then raise exception 'item_not_found'; end if;
  perform ofalta.touch(l.id);
end $$;

create function public.of_delete_item(p_slug text, p_item_id uuid)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  l ofalta.lists;
begin
  l := ofalta.list_by_slug(p_slug);
  delete from ofalta.items where id = p_item_id and list_id = l.id;
  perform ofalta.touch(l.id);
end $$;

-- "Limpar comprados": removes the items marked as bought.
create function public.of_clear_done(p_slug text)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  l ofalta.lists;
begin
  l := ofalta.list_by_slug(p_slug);
  delete from ofalta.items where list_id = l.id and done;
  perform ofalta.touch(l.id);
end $$;

------------------------------------------------------------------------
-- Categories
------------------------------------------------------------------------

-- Saves the whole category list at once, in the order given:
--   p_categories = [{"id": uuid|null, "name": text, "icon": text}, ...]
-- New entries have id null. Categories left out are deleted and their items go to "Outros".
-- "Outros" must be in the array (it keeps its id) and always ends up last.
create function public.of_save_categories(p_slug text, p_categories jsonb)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  l        ofalta.lists;
  v_other  uuid;
  v_keep   uuid[] := '{}';
  v_entry  jsonb;
  v_id     uuid;
  v_pos    int := 0;
begin
  l := ofalta.list_by_slug(p_slug);
  v_other := ofalta.other_category(l.id);

  if jsonb_typeof(p_categories) <> 'array' then raise exception 'invalid_categories'; end if;
  if jsonb_array_length(p_categories) > 30 then raise exception 'too_many_categories'; end if;

  for v_entry in select value from jsonb_array_elements(p_categories) loop
    v_pos := v_pos + 1;
    v_id := nullif(v_entry->>'id', '')::uuid;

    if v_id is not null and not exists (select 1 from ofalta.categories where id = v_id and list_id = l.id) then
      raise exception 'category_not_found';
    end if;

    if v_id is null then
      insert into ofalta.categories (list_id, name, icon, sort)
      values (l.id, trim(v_entry->>'name'), v_entry->>'icon', v_pos)
      returning id into v_id;
    else
      update ofalta.categories
      set name = trim(v_entry->>'name'),
          icon = v_entry->>'icon',
          sort = case when is_other then 99 else v_pos end
      where id = v_id;
    end if;
    v_keep := v_keep || v_id;
  end loop;

  update ofalta.items set category_id = v_other
  where list_id = l.id and (category_id is null or not (category_id = any(v_keep || v_other)));

  delete from ofalta.categories
  where list_id = l.id and not is_other and not (id = any(v_keep));

  perform ofalta.touch(l.id);
end $$;

------------------------------------------------------------------------
-- Grants: only these functions are reachable from the browser.
------------------------------------------------------------------------

revoke execute on function
  public.of_get_list(text),
  public.of_create_list(text, uuid),
  public.of_rename_list(text, text),
  public.of_add_item(text, text, uuid),
  public.of_set_item_done(text, uuid, boolean),
  public.of_update_item(text, uuid, text, uuid),
  public.of_delete_item(text, uuid),
  public.of_clear_done(text),
  public.of_save_categories(text, jsonb)
from public;

grant execute on function
  public.of_get_list(text),
  public.of_create_list(text, uuid),
  public.of_rename_list(text, text),
  public.of_add_item(text, text, uuid),
  public.of_set_item_done(text, uuid, boolean),
  public.of_update_item(text, uuid, text, uuid),
  public.of_delete_item(text, uuid),
  public.of_clear_done(text),
  public.of_save_categories(text, jsonb)
to anon, authenticated;
