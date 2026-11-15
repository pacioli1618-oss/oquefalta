-- o que falta: schema, tables and helpers
--
-- Everything lives in the "oqfalta" schema, outside the Data API. The browser only reaches it
-- through the public.of_* RPCs (next migration). Same access model as QuemLeva:
--   * slug (12 random characters) -> whoever has the list link can see and edit the list
--   * device_id (uuid made in the browser) -> only used to rate-limit list creation

create schema if not exists oqfalta;
revoke all on schema oqfalta from public, anon, authenticated;

create table oqfalta.lists (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null check (length(trim(name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table oqfalta.categories (
  id         uuid primary key default gen_random_uuid(),
  list_id    uuid not null references oqfalta.lists(id) on delete cascade,
  name       text not null check (length(trim(name)) between 1 and 40),
  icon       text not null check (icon ~ '^[a-z]{2,20}$'),
  sort       int  not null default 0,
  -- "Outros": always exists, always last, cannot be deleted. Unknown items go here.
  is_other   boolean not null default false,
  created_at timestamptz not null default now()
);
create index categories_list_sort_idx on oqfalta.categories (list_id, sort);
create unique index categories_one_other_idx on oqfalta.categories (list_id) where is_other;

create table oqfalta.items (
  id          uuid primary key default gen_random_uuid(),
  list_id     uuid not null references oqfalta.lists(id) on delete cascade,
  category_id uuid references oqfalta.categories(id) on delete set null,
  name        text not null check (length(trim(name)) between 1 and 80),
  done        boolean not null default false,
  done_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index items_list_idx on oqfalta.items (list_id);
create index items_category_idx on oqfalta.items (category_id);

-- Anti-spam for of_create_list. The IP is never stored as is (salted sha256), rows live 1 day.
create table oqfalta.secrets (
  name  text primary key,
  value text not null
);
insert into oqfalta.secrets (name, value)
values ('ip_salt', encode(extensions.gen_random_bytes(32), 'hex'));

create table oqfalta.create_list_log (
  id         bigint generated always as identity primary key,
  device_id  uuid,
  ip_hash    text,
  created_at timestamptz not null default now()
);
create index create_list_log_device_idx on oqfalta.create_list_log (device_id, created_at desc) where device_id is not null;
create index create_list_log_ip_idx on oqfalta.create_list_log (ip_hash, created_at desc) where ip_hash is not null;
create index create_list_log_created_idx on oqfalta.create_list_log (created_at);

-- RLS on and no policies: no direct access by anon/authenticated.
alter table oqfalta.lists           enable row level security;
alter table oqfalta.categories      enable row level security;
alter table oqfalta.items           enable row level security;
alter table oqfalta.secrets         enable row level security;
alter table oqfalta.create_list_log enable row level security;
revoke all on all tables in schema oqfalta from public, anon, authenticated;

------------------------------------------------------------------------
-- Helpers (not callable from the browser)
------------------------------------------------------------------------

create function oqfalta.random_text(n int)
returns text language sql volatile set search_path = '' as $$
  select string_agg(substr('abcdefghjkmnpqrstuvwxyz23456789', (get_byte(b, i) % 31) + 1, 1), '' order by i)
  from (select extensions.gen_random_bytes(n) as b) x, generate_series(0, n - 1) as i
$$;

create function oqfalta.sha256(t text)
returns text language sql immutable set search_path = '' as $$
  select encode(extensions.digest(t, 'sha256'), 'hex')
$$;

create function oqfalta.list_by_slug(p_slug text)
returns oqfalta.lists
language plpgsql stable set search_path = '' as $$
declare
  l oqfalta.lists;
begin
  select * into l from oqfalta.lists where slug = p_slug;
  if not found then
    raise exception 'list_not_found' using errcode = 'P0002';
  end if;
  return l;
end $$;

create function oqfalta.other_category(p_list_id uuid)
returns uuid
language sql stable set search_path = '' as $$
  select id from oqfalta.categories where list_id = p_list_id and is_other
$$;

create function oqfalta.touch(p_list_id uuid)
returns void
language sql set search_path = '' as $$
  update oqfalta.lists set updated_at = now() where id = p_list_id
$$;

create function oqfalta.request_ip_hash()
returns text
language sql stable set search_path = '' as $$
  with h as (select nullif(current_setting('request.headers', true), '')::json as headers),
       ip as (
         select nullif(trim(coalesce(
                  headers->>'cf-connecting-ip',
                  split_part(headers->>'x-forwarded-for', ',', 1))), '') as value
         from h)
  select case when ip.value is null then null
              else oqfalta.sha256((select value from oqfalta.secrets where name = 'ip_salt') || ip.value)
         end
  from ip
$$;

-- Limits (generous: mobile carriers put many people behind one IP):
--   per device: 20 lists per hour, 60 per day; per IP: 60 per hour, 200 per day.
create function oqfalta.check_create_list_rate(p_device_id uuid)
returns void
language plpgsql set search_path = '' as $$
declare
  v_ip_hash text := oqfalta.request_ip_hash();
begin
  if p_device_id is not null then perform pg_advisory_xact_lock(hashtext('of_create:' || p_device_id::text)); end if;
  if v_ip_hash   is not null then perform pg_advisory_xact_lock(hashtext('of_create:' || v_ip_hash)); end if;

  delete from oqfalta.create_list_log where created_at < now() - interval '1 day';

  if p_device_id is not null then
    if (select count(*) from oqfalta.create_list_log
        where device_id = p_device_id and created_at > now() - interval '1 hour') >= 20 then
      raise exception 'rate_limited' using detail = 'hour';
    end if;
    if (select count(*) from oqfalta.create_list_log where device_id = p_device_id) >= 60 then
      raise exception 'rate_limited' using detail = 'day';
    end if;
  end if;

  if v_ip_hash is not null then
    if (select count(*) from oqfalta.create_list_log
        where ip_hash = v_ip_hash and created_at > now() - interval '1 hour') >= 60 then
      raise exception 'rate_limited' using detail = 'hour';
    end if;
    if (select count(*) from oqfalta.create_list_log where ip_hash = v_ip_hash) >= 200 then
      raise exception 'rate_limited' using detail = 'day';
    end if;
  end if;

  insert into oqfalta.create_list_log (device_id, ip_hash) values (p_device_id, v_ip_hash);
end $$;

revoke execute on all functions in schema oqfalta from public, anon, authenticated;

------------------------------------------------------------------------
-- Realtime: a light "changed" notice on the public channel "oqfalta:<slug>".
-- No list data goes in the notice; the client calls of_get_list again.
------------------------------------------------------------------------

create function oqfalta.notify_change()
returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  r      record;
  v_list uuid;
  v_slug text;
begin
  if tg_op = 'DELETE' then r := old; else r := new; end if;
  if tg_table_name = 'lists' then v_list := r.id; else v_list := r.list_id; end if;

  select slug into v_slug from oqfalta.lists where id = v_list;
  if v_slug is null then return null; end if;   -- list being deleted

  begin
    perform realtime.send(jsonb_build_object('table', tg_table_name, 'op', tg_op), 'changed', 'oqfalta:' || v_slug, false);
  exception when others then
    null;  -- a Realtime failure must not undo the write
  end;
  return null;
end $$;

revoke execute on function oqfalta.notify_change() from public, anon, authenticated;

-- Every write RPC ends with oqfalta.touch(list), so one trigger on lists gives one notice per write.
create trigger lists_notify after update on oqfalta.lists
  for each row execute function oqfalta.notify_change();
