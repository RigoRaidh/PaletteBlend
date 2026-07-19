-- =====================================================================
-- PaletteBlend — Supabase migration
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run: every statement is guarded (IF NOT EXISTS / DROP ... IF EXISTS).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. showcase_posts
-- ---------------------------------------------------------------------
create table if not exists public.showcase_posts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade default auth.uid(),
  discord_id         text not null,
  discord_username   text not null,
  discord_avatar_url text,
  title              text not null default 'Untitled',
  image_url          text not null,
  created_at         timestamptz not null default now()
);

alter table public.showcase_posts enable row level security;

drop policy if exists "showcase_posts_select_public" on public.showcase_posts;
create policy "showcase_posts_select_public"
  on public.showcase_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "showcase_posts_insert_own" on public.showcase_posts;
create policy "showcase_posts_insert_own"
  on public.showcase_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "showcase_posts_delete_own" on public.showcase_posts;
create policy "showcase_posts_delete_own"
  on public.showcase_posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 2. reviews
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade default auth.uid(),
  discord_id         text not null,
  discord_username   text not null,
  discord_avatar_url text,
  rating             smallint not null check (rating between 1 and 5),
  comment            text not null default '',
  created_at         timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews for select
  to anon, authenticated
  using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- NOTE: this allows multiple reviews per user, matching the brief as written.
-- If you'd rather cap it at one review per person, uncomment:
-- alter table public.reviews add constraint reviews_one_per_user unique (user_id);

-- ---------------------------------------------------------------------
-- 3. likes  (one like per user per post, enforced at the DB level)
-- ---------------------------------------------------------------------
create table if not exists public.likes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  post_id    uuid not null references public.showcase_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

alter table public.likes enable row level security;

drop policy if exists "likes_select_public" on public.likes;
create policy "likes_select_public"
  on public.likes for select
  to anon, authenticated
  using (true);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own"
  on public.likes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own"
  on public.likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 4. showcase_posts_with_counts
--    A view the client queries directly so it gets each post's like_count
--    in one round trip. `security_invoker = on` makes it respect the
--    querying user's own RLS instead of the view owner's — without this,
--    a view can accidentally bypass row level security.
-- ---------------------------------------------------------------------
drop view if exists public.showcase_posts_with_counts;
create view public.showcase_posts_with_counts
  with (security_invoker = on) as
  select
    p.*,
    coalesce(l.like_count, 0) as like_count
  from public.showcase_posts p
  left join (
    select post_id, count(*) as like_count
    from public.likes
    group by post_id
  ) l on l.post_id = p.id;

grant select on public.showcase_posts_with_counts to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Storage bucket for showcase uploads
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('showcase', 'showcase', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];

-- Public read so <img src> works for everyone, including logged-out visitors.
drop policy if exists "showcase_bucket_read_public" on storage.objects;
create policy "showcase_bucket_read_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'showcase');

-- Authenticated users may upload only into a folder named after their own
-- user id (the app uploads to `${user.id}/filename`, matching this check).
drop policy if exists "showcase_bucket_insert_own_folder" on storage.objects;
create policy "showcase_bucket_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'showcase'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "showcase_bucket_delete_own_folder" on storage.objects;
create policy "showcase_bucket_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'showcase'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
