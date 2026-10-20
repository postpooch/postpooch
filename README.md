# PostPooch

PostPooch creates and publishes real-estate social posts. This repository
contains the central Trigger.dev automation that loads a PostgreSQL schedule,
renders Fabric.js JSON to JPEG, uploads the JPEGs to Cloudflare R2, and submits
the ordered post or carousel to Zernio.

## Architecture

One Trigger.dev scheduled task, `post-scheduled-social-post`, serves every
customer schedule:

1. Resolve the PostgreSQL `schedules.id` from the Trigger.dev schedule
   `externalId`.
2. Atomically claim this schedule occurrence in `posting_runs`.
3. For template posts, choose one random template and persist that choice.
   For custom posts, use the schedule itself.
4. Load media in ascending `display_order`.
5. Render each Fabric.js document and upload it to a deterministic R2 key.
6. Save the public media URLs, then publish through Zernio with a deterministic
   request ID.
7. Mark the occurrence published. If `delete_after_use` is true, delete the
   Trigger.dev schedule first and then its PostgreSQL schedule row.

The `posting_runs` ledger prevents concurrent processing and makes retries
resume from stable template/media state. R2 uploads overwrite the same key on
retry. Zernio receives the same request ID for the same occurrence.

## Setup

### 1. Install the database migrations

Apply the migrations in [`supabase/migrations`](supabase/migrations) with the
Supabase CLI. They create the posting ledger, atomic claim function, useful
media indexes, carousel-order constraints, and a least-privilege
`postpooch_worker` database login.

The worker role is deliberately created without a password. After applying the
role migration, generate a strong unique password and set it without committing
the password to the repository:

```sql
alter role postpooch_worker with password 'YOUR_UNIQUE_PASSWORD';
```

The two new media check constraints are `NOT VALID`, so legacy data does not
block installation. Clean up existing invalid rows and validate them later:

```sql
alter table public.media validate constraint media_display_order_positive;
alter table public.media validate constraint media_has_exactly_one_parent;
```

### 2. Configure Cloudflare R2

Create a bucket and an R2 API token with Object Read & Write access restricted
to that bucket. Attach a public custom domain to the bucket for production.
Zernio must be able to fetch every generated URL over public HTTPS.

The task uses content-addressed object names and sets a one-year immutable cache
header. Keep these objects available for as long as published posts may need
them. Use a deliberate retention policy for old objects rather than deleting
them immediately after Zernio accepts a post.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` for local development. Add the same
server-only values to each Trigger.dev environment (Development, Staging, and
Production as applicable):

Required:

- `DATABASE_URL` (use a transaction-pooler URL for `postpooch_worker`)
- `ZERNIO_API_KEY`
- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_PUBLIC_BASE_URL`

`DATABASE_URL` is a server-only secret. Never expose it to client code or use a
`NEXT_PUBLIC_` prefix. For Supabase's shared transaction pooler, use port `6543`
and the username `postpooch_worker.<PROJECT_REF>`. The worker does not use named
prepared statements, which keeps it compatible with transaction pooling. Since
it uses standard PostgreSQL queries, changing database providers later only
requires a compatible PostgreSQL URL.

Optional:

- `FABRIC_ALLOWED_IMAGE_HOSTS`
- `FABRIC_DEFAULT_WIDTH` / `FABRIC_DEFAULT_HEIGHT`
- `FABRIC_MAX_JSON_BYTES`
- `FABRIC_MAX_PIXELS`
- `FABRIC_MAX_OBJECTS`
- `FABRIC_RENDER_TIMEOUT_MS`
- `FABRIC_JPEG_QUALITY`
- `FABRIC_JPEG_BACKGROUND`
- `POSTING_LEASE_SECONDS`

### 4. Run and deploy Trigger.dev

```bash
npm run trigger:dev
npm run trigger:deploy
```

The deployed Trigger.dev container installs `fabric` and the native `canvas`
package externally. It also installs the Cairo/Pango image codecs and a broad
font fallback set: Noto Core, Noto CJK, Noto Color Emoji, DejaVu, Liberation,
Carlito, and Caladea. The self-hosted PostPooch design fonts under
`public/fonts` are copied into the Trigger image and registered with Canvas
before a design is rendered.

### 5. Attach customer schedules

When the schedule-creation flow is built, attach every dynamic Trigger.dev
schedule to `post-scheduled-social-post` and set:

- `externalId` to the UUID in `public.schedules.id`
- `deduplicationKey` to an environment-qualified stable value such as
  `prod:postpooch:<schedule UUID>`
- `timezone` to the customer's IANA timezone

Trigger.dev's own `scheduleId` looks like `sched_...`; it cannot equal a
database UUID. The task uses that internal ID only to remove the Trigger.dev
schedule after a successful one-time post.

Example creation code for the future scheduling flow:

```ts
import { schedules } from "@trigger.dev/sdk/v3";
import { postScheduledSocialPost } from "@/src/trigger/post-scheduled-social-post";

await schedules.create({
  task: postScheduledSocialPost.id,
  cron: "0 6 * * 1",
  timezone: "America/Phoenix",
  externalId: scheduleRow.id,
  deduplicationKey: `prod:postpooch:${scheduleRow.id}`,
});
```

## Fabric.js document contract

`media.image_design` must be a normal Fabric.js JSON object. Add top-level
`width` and `height` properties when saving it. If omitted, the configured
defaults are used.

External Fabric image `src` URLs must:

- use HTTPS;
- use a host in `FABRIC_ALLOWED_IMAGE_HOSTS` (the configured R2 public host is
  included automatically); or
- be a base64 PNG, JPEG, WebP, or GIF `data:image/...` URL (inline SVG is
  intentionally rejected).

Use the same Fabric major version in the editor and worker, avoid unregistered
custom Fabric classes, and save the canvas `width` and `height` with the JSON.
The worker validates every serialized Fabric type before rendering, so an
editor-only custom class fails clearly instead of creating a broken post.

The renderer supports Fabric's registered built-ins, including shapes, paths,
text/textboxes, groups, gradients, patterns, shadows, clip paths, image filters,
and embedded or hosted images. Animated GIF input is rendered as a still image
because social posts are exported as JPEG. Inline SVG data URLs are rejected;
hosted SVG assets must use an allowed HTTPS host.

### Font catalog

The editor-facing font catalog is exported from
`src/posting/font-catalog.ts`. It contains:

- Bebas Neue
- Cormorant Garamond
- DM Sans
- Inter
- Lato
- League Spartan
- Merriweather
- Montserrat
- Open Sans
- Oswald
- Playfair Display
- Poppins
- Raleway
- Roboto

These fonts are self-hosted for both the browser editor and Trigger.dev, so the
preview and posted JPEG use the same font files. The browser only downloads a
font when the editor asks for it:

```ts
import {
  loadPostPoochFont,
  POSTPOOCH_FONT_FAMILIES,
} from "@/src/posting/font-catalog";

await loadPostPoochFont("Poppins", 700);
// Now add or update the Fabric text object and render the canvas.
```

Always await `loadPostPoochFont` before adding text in that family or loading a
saved design into the browser canvas. Use `POSTPOOCH_FONT_FAMILIES` as the font
picker source rather than accepting arbitrary font names. Use
`POSTPOOCH_FONT_SPECS[family].weights` for that family's weight picker; this
keeps the editor on the exact static font instances used by node-canvas.

For imported designs, the worker also accepts its installed compatibility
families and normalizes common proprietary names: Arial/Helvetica to Liberation
Sans, Times New Roman to Liberation Serif, Courier New to Liberation Mono,
Calibri to Carlito, and Cambria to Caladea. Unknown font names are rejected
before upload or publication; they never silently become square glyphs.

Noto fallback fonts cover common international scripts, CJK text, and emoji.
The chosen design font must still contain the glyphs required by the text; when
it does not, Pango selects the installed Noto fallback for those glyphs.

Every bundled Google Font includes its `OFL.txt` license beside the font files.
Adding a font later requires all four pieces: its licensed file under
`public/fonts`, a catalog/browser-loader entry, a Canvas registration entry,
and a renderer test.

Variable sources used to generate the Inter, Open Sans, Roboto, and League
Spartan static renderer files are kept under `scripts/font-sources`. Rebuild
those static instances after changing a source file with:

```bash
python scripts/instantiate-renderer-fonts.py
```

This conversion happens during development, never during a scheduled task.

Every post needs at least one media row. `display_order` must be a unique
positive integer within the selected template, schedule, or post project.
The worker posts images in that exact order. Editor drafts live in
`post_projects` with child `media` rows (`post_project_id`). The posting
worker still loads publishable media by `template_id` or `schedule_id`.

## Development checks

```bash
npm run check
```

This runs ESLint, TypeScript, and the Vitest suite.
