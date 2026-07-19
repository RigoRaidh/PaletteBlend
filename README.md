# PaletteBlend

A premium, dark-glass single-page site for a Discord server design studio.
React + Vite + Tailwind CSS v4 + Supabase (Discord OAuth, Postgres, Storage).

## Stack

- **React 19** + **Vite** — SPA, no router (tabs are just component state)
- **Tailwind CSS v4** via `@tailwindcss/vite` — theme tokens live in `src/index.css`
- **Supabase** — Discord OAuth, Postgres (`showcase_posts`, `reviews`, `likes`), Storage (`showcase` bucket)
- **lucide-react** — icons

## Local setup

```bash
npm install
npm run dev
```

`.env` already has your Supabase URL and publishable key filled in (see
`.env.example` for the format if you need to point at a different project).

Before login/showcase/reviews will work, run `supabase/migration.sql` in your
Supabase project's SQL Editor — see that file's header comment, and the
deployment checklist you were given alongside this project.

## Project structure

```
src/
  lib/            Supabase client, auth context, Discord profile parsing
  components/     Header, background orbs, login gate, star rating, logo
  tabs/           Home, Work, Showcase, Reviews
  data/           Static Work-tab portfolio data
public/assets/    Drop your own images here (see public/assets/README.md)
supabase/
  migration.sql   Tables, RLS policies, view, storage bucket + policies
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Notes

- The Supabase key in `.env` is the **publishable** key (`sb_publishable_...`),
  which is designed to be embedded in client-side code — it's the direct
  equivalent of Supabase's old "anon" key. Actual data access is controlled
  by the Row Level Security policies in `supabase/migration.sql`, not by
  keeping this key secret.
- Discord profile fields (`avatar_url`, username, id) are read defensively in
  `src/lib/discordProfile.js` with fallbacks, since Supabase doesn't
  guarantee identical `user_metadata` shape across every account. If an
  avatar or name looks wrong after you test login, check Supabase Dashboard
  → Authentication → Users → your test user → raw user meta data, and adjust
  the field names in that file if needed.
- Showcase and review author info is stored denormalized on each row
  (captured at post time) rather than joined live from `auth.users`, since
  that table isn't client-queryable. This keeps the schema simple, at the
  tradeoff that a post shows the username/avatar the poster had *at the time
  they posted*, not necessarily their current one.
