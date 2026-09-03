-- adventureTRPG: run this file in the Supabase SQL Editor.
create extension if not exists pgcrypto;

-- DiscordのユーザーIDを登録したアカウントだけが利用できます。
-- Discordの開発者モードをONにして、ユーザーを右クリック > ユーザーIDをコピーしてください。
create table if not exists public.allowed_discord_users (
  discord_user_id text primary key check (char_length(trim(discord_user_id)) between 1 and 32),
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.allowed_discord_users enable row level security;
revoke all on table public.allowed_discord_users from anon, authenticated, public;

-- 画面からは許可リストを変更できないようにし、SQL Editorから管理します。
-- insert into public.allowed_discord_users (discord_user_id, display_name)
-- values ('123456789012345678', '参加者A');

create or replace function public.is_current_user_allowed()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.identities as identity_record
    join public.allowed_discord_users as allowed
      on allowed.discord_user_id = identity_record.provider_id
    where identity_record.user_id = auth.uid()
      and identity_record.provider = 'discord'
  );
$$;

revoke execute on function public.is_current_user_allowed() from anon, public;
grant execute on function public.is_current_user_allowed() to authenticated;

-- 新規の未許可ユーザーはAuthユーザー自体を作成させません。
-- Supabase Dashboard > Authentication > Hooks > Before User Created で有効化してください。
create or replace function public.hook_restrict_discord_signup(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  discord_user_id text;
begin
  select identity_record->>'provider_id'
    into discord_user_id
    from jsonb_array_elements(coalesce(event->'user'->'identities', '[]'::jsonb)) as identity_record
   where identity_record->>'provider' = 'discord'
   limit 1;

  discord_user_id := coalesce(discord_user_id, event->'user'->'user_metadata'->>'provider_id');

  if exists (
    select 1 from public.allowed_discord_users
    where allowed_discord_users.discord_user_id = discord_user_id
  ) then
    return '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'このDiscordアカウントは許可リストに登録されていません。'
    )
  );
end;
$$;

grant execute on function public.hook_restrict_discord_signup(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_restrict_discord_signup(jsonb) from anon, authenticated, public;

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  data jsonb not null default '{}'::jsonb,
  portrait_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_user_id_updated_at_idx on public.characters(user_id, updated_at desc);
alter table public.characters enable row level security;

drop policy if exists "Users can view own characters" on public.characters;
create policy "Users can view own characters" on public.characters for select using (auth.uid() = user_id and public.is_current_user_allowed());
drop policy if exists "Users can create own characters" on public.characters;
create policy "Users can create own characters" on public.characters for insert with check (auth.uid() = user_id and public.is_current_user_allowed());
drop policy if exists "Users can update own characters" on public.characters;
create policy "Users can update own characters" on public.characters for update using (auth.uid() = user_id and public.is_current_user_allowed()) with check (auth.uid() = user_id and public.is_current_user_allowed());
drop policy if exists "Users can delete own characters" on public.characters;
create policy "Users can delete own characters" on public.characters for delete using (auth.uid() = user_id and public.is_current_user_allowed());

-- 公開閲覧用の共有リンク。トークンを知っている人だけが、該当キャラクターを読み取り専用で閲覧できます。
create table if not exists public.character_shares (
  token text primary key default encode(gen_random_bytes(24), 'hex'),
  character_id uuid not null references public.characters(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  portrait_path text,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index if not exists character_shares_one_active_per_character_idx
  on public.character_shares(character_id)
  where revoked_at is null;

alter table public.character_shares enable row level security;
revoke all on table public.character_shares from anon, public;
grant select, insert, update, delete on table public.character_shares to authenticated;

drop policy if exists "Owners can view character shares" on public.character_shares;
create policy "Owners can view character shares" on public.character_shares
  for select to authenticated
  using (owner_id = auth.uid() and public.is_current_user_allowed());
drop policy if exists "Owners can create character shares" on public.character_shares;
create policy "Owners can create character shares" on public.character_shares
  for insert to authenticated
  with check (
    owner_id = auth.uid()
    and public.is_current_user_allowed()
    and exists (
      select 1 from public.characters
      where characters.id = character_shares.character_id
        and characters.user_id = auth.uid()
    )
  );
drop policy if exists "Owners can update character shares" on public.character_shares;
create policy "Owners can update character shares" on public.character_shares
  for update to authenticated
  using (owner_id = auth.uid() and public.is_current_user_allowed())
  with check (owner_id = auth.uid() and public.is_current_user_allowed());
drop policy if exists "Owners can delete character shares" on public.character_shares;
create policy "Owners can delete character shares" on public.character_shares
  for delete to authenticated
  using (owner_id = auth.uid() and public.is_current_user_allowed());

-- RPC経由でトークンに一致する1件だけを返します。user_idや共有管理情報は返しません。
create or replace function public.get_shared_character(_share_token text)
returns table (
  id uuid,
  name text,
  data jsonb,
  portrait_path text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    characters.id,
    characters.name,
    characters.data,
    character_shares.portrait_path,
    characters.created_at,
    characters.updated_at
  from public.character_shares
  join public.characters on characters.id = character_shares.character_id
  where character_shares.token = _share_token
    and character_shares.revoked_at is null
  limit 1;
$$;

revoke all on function public.get_shared_character(text) from public;
grant execute on function public.get_shared_character(text) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('character-portraits', 'character-portraits', false)
on conflict (id) do nothing;

-- 共有リンクで表示する立ち絵だけを置く公開バケットです。
insert into storage.buckets (id, name, public)
values ('character-share-portraits', 'character-share-portraits', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Users can view own portraits" on storage.objects;
create policy "Users can view own portraits" on storage.objects for select to authenticated
using (bucket_id = 'character-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());
drop policy if exists "Users can upload own portraits" on storage.objects;
create policy "Users can upload own portraits" on storage.objects for insert to authenticated
with check (bucket_id = 'character-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());
drop policy if exists "Users can update own portraits" on storage.objects;
create policy "Users can update own portraits" on storage.objects for update to authenticated
using (bucket_id = 'character-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed())
with check (bucket_id = 'character-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());
drop policy if exists "Users can delete own portraits" on storage.objects;
create policy "Users can delete own portraits" on storage.objects for delete to authenticated
using (bucket_id = 'character-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());

drop policy if exists "Allowed users can upload share portraits" on storage.objects;
create policy "Allowed users can upload share portraits" on storage.objects for insert to authenticated
with check (bucket_id = 'character-share-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());
drop policy if exists "Allowed users can update share portraits" on storage.objects;
create policy "Allowed users can update share portraits" on storage.objects for update to authenticated
using (bucket_id = 'character-share-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed())
with check (bucket_id = 'character-share-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());
drop policy if exists "Allowed users can delete share portraits" on storage.objects;
create policy "Allowed users can delete share portraits" on storage.objects for delete to authenticated
using (bucket_id = 'character-share-portraits' and (storage.foldername(name))[1] = (select auth.uid()::text) and public.is_current_user_allowed());
