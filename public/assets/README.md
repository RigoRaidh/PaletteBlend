# public/assets

Drop your real image files in here with these exact names and the site picks
them up automatically — no code changes needed. Anything missing falls back
to a generated gradient tile, so the site still looks intentional before you
add real photos.

## Work tab (`/assets/work/`)

Recommended size: ~1000×1250px (4:5), JPG or WebP, under ~400KB each.

| File | Project |
|---|---|
| `work/work-1.jpg` | Nocturne — record label community |
| `work/work-2.jpg` | Founders Table — paid mastermind |
| `work/work-3.jpg` | Wyrmhall — raid guild |
| `work/work-4.jpg` | Atelier — design critique circle |
| `work/work-5.jpg` | Basecamp Trading — signals community |
| `work/work-6.jpg` | Verdant — wellness & book club |

Edit `src/data/workItems.js` if you want to rename, reorder, add, or remove
projects — each entry is just `{ id, name, category, description, image }`.

## Favicon / brand mark

`favicon.svg` is the generated PaletteBlend mark (two blending gold/blue
circles — echoes the app name). Replace it with your own logo if you'd like;
just keep the filename or update the `<link rel="icon">` in `index.html`.

## Showcase tab

Showcase images are **not** static files here — members upload them at
runtime and they're stored in Supabase Storage (bucket: `showcase`, created
by the SQL migration). Nothing to add to this folder for that tab.
