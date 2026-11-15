-- o que falta: default categories in the language of whoever creates the list.
--
-- of_create_list gains p_locale ('pt-BR', 'es' or 'en'; anything else falls back to pt-BR).
-- Category names are data: once created, they stay as they are for everyone who opens the
-- link, whatever their language, and can be renamed. The icon keys stay the same in every
-- language, so the automatic categorization (src/lib/categorize.ts) keeps working.
--
-- Compatible with the app already deployed: it calls with named arguments (p_name, p_device_id),
-- which still resolves to this function, with p_locale = 'pt-BR'.

drop function public.of_create_list(text, uuid);

create function public.of_create_list(p_name text, p_device_id uuid default null, p_locale text default 'pt-BR')
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_slug   text;
  v_id     uuid;
  v_locale text := case when p_locale in ('pt-BR', 'es', 'en') then p_locale else 'pt-BR' end;
begin
  perform oqfalta.check_create_list_rate(p_device_id);

  loop
    v_slug := oqfalta.random_text(12);
    exit when not exists (select 1 from oqfalta.lists where slug = v_slug);
  end loop;

  insert into oqfalta.lists (slug, name)
  values (v_slug, coalesce(nullif(trim(p_name), ''),
                           case v_locale when 'es' then 'Compras de la casa' when 'en' then 'Groceries' else 'Compras de casa' end))
  returning id into v_id;

  insert into oqfalta.categories (list_id, name, icon, sort, is_other)
  select v_id,
         case v_locale when 'es' then d.name_es when 'en' then d.name_en else d.name_pt end,
         d.icon, d.sort, d.icon = 'outros'
  from (values
    ('Hortifruti',        'Frutas y verduras', 'Produce',       'hortifruti', 1),
    ('Padaria',           'Panadería',         'Bakery',        'padaria',    2),
    ('Laticínios e ovos', 'Lácteos y huevos',  'Dairy & eggs',  'laticinios', 3),
    ('Carnes',            'Carnes',            'Meat & fish',   'carnes',     4),
    ('Mercearia',         'Despensa',          'Pantry',        'mercearia',  5),
    ('Bebidas',           'Bebidas',           'Drinks',        'bebidas',    6),
    ('Congelados',        'Congelados',        'Frozen',        'congelados', 7),
    ('Limpeza',           'Limpieza',          'Cleaning',      'limpeza',    8),
    ('Higiene',           'Higiene',           'Personal care', 'higiene',    9),
    ('Pet',               'Mascotas',          'Pets',          'pet',        10),
    ('Outros',            'Otros',             'Other',         'outros',     99)
  ) as d(name_pt, name_es, name_en, icon, sort);

  return jsonb_build_object('slug', v_slug);
end $$;

revoke execute on function public.of_create_list(text, uuid, text) from public;
grant execute on function public.of_create_list(text, uuid, text) to anon, authenticated;
