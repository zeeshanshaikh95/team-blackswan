# Team BlackSwan — Website

Mobile-first storefront for **Team BlackSwan** (@team_blackswan_) — an abaya atelier in Mumbai.
Primary conversion: browse → bag → **order over DM** (no payment gateway, by design).

**Live preview:** https://zeeshanshaikh95.github.io/team-blackswan/ (GitHub Pages — static catalogue
snapshot, no admin; see [Hosting](#hosting--live-url)).

Built to the same architecture as the client's earlier Glow by Parveen and Haya Nur sites (React SPA +
Express API + MongoDB, protected admin panel), with a different design system, a new split hero
slider and an abaya-specific catalogue model.

> **Data policy:** product names, fabrics, sizes, colours and copy come from the brand's own public
> Instagram posts (`Double Chiffon Plain Abayas`, `Premium Nida Abaya Collection`, `Velvet
> Collection`, `Fokha Fabric Daily Wear`, sizes 54–60). No prices, reviews, policies or business
> claims are invented. Prices default to **“price on request”**, matching how the studio quotes over
> DM. The studio's WhatsApp chat is invite-only, so order buttons fall back to Instagram DMs until a
> 1:1 number is set in Admin → Settings.

## Hosting / live URL

| Environment | URL | What works |
| GitHub Pages (live) | https://zeeshanshaikh95.github.io/team-blackswan/ | Browsing, filters, piece pages, bag, Instagram ordering |
| Local (`npm run dev`) | http://localhost:5173 | Everything, including `/admin` and analytics |

Pages is static, so it cannot run the Express API. The Pages build reads the committed snapshot
`client/public/demo/catalogue.json` (enabled by `VITE_DEMO_CATALOGUE=true`). Regenerate it after
changing catalogue content:

```shell
npm run dev:server          # in one terminal
npm run demo:catalogue      # writes the snapshot
```

Consequences of the static preview: order buttons open Instagram DMs, the admin panel has no API
behind it, and review/analytics writes are skipped. To run it as a real shop, host the API and set
the `VITE_API_URL` repository variable plus `VITE_DEMO_CATALOGUE=false` — see
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Tech stack

| Layer | Technology |
| Frontend | React 18 + Vite 6 + TypeScript, Tailwind CSS 3, React Router 6, react-helmet-async |
| Backend | Node + Express 4 + TypeScript, Zod validation |
| Database | MongoDB + Mongoose 8 (Atlas in production; bundled local mongod for dev) |
| Auth | JWT bearer tokens + bcrypt (12 rounds), protected `/api/admin/*` |
| Security | Helmet, CORS allow-list, rate limiting, Zod validation, secrets via env |
| Media | Multer uploads served from `/uploads` (swap in Cloudinary/S3 when the volume grows) |
| Hosting | Static SPA build + Node API + MongoDB Atlas |

## Design system

* **Palette** — obsidian (`#0B0B0C`) page, charcoal surfaces, ivory ink, champagne gold
  (`#C39A3E`) hairlines and accents, sampled from the brand's own emblem. No rounded cards,
  pastels or gradients beyond the gold rules.
* **Type** — Marcellus display caps with wide tracking, Manrope for body copy.
* **Hero** — a split editorial slider: media on the right, a black copy panel on the left with a
  numbered index, autoplay progress bars and a thumbnail rail. Slides are editable in
  Admin → Settings.
* **Logo** — the brand's Instagram emblem is used untouched at `client/public/brand/logo.jpg`
  (never redrawn or recoloured) in the header, footer and admin.

## Structure

```
├── client/                  React SPA
│   ├── public/              images, brand emblem, favicon, demo catalogue, sitemap
│   └── src/
│       ├── admin/           Protected admin panel (lazy-loaded bundle)
│       ├── api/             Typed API client + endpoint map
│       ├── components/      HeroSlider, ProductCard, MiniCart, Wordmark, layout…
│       ├── context/         Cart / Settings / Toast providers
│       ├── hooks/           useApi, usePageView
│       ├── lib/             WhatsApp builder, analytics, formatting, brand assets
│       └── pages/           Public pages
├── server/
│   └── src/
│       ├── config/          Env config + Mongo connection
│       ├── controllers/     Public + admin handlers
│       ├── middleware/      Auth, errors, rate limits, uploads
│       ├── models/          Mongoose schemas
│       ├── routes/          /api and /api/admin routers
│       ├── seed/            Bootstrap (admin + settings) and starter catalogue
│       ├── services/        Settings singleton
│       ├── utils/           asyncHandler, slugify
│       └── validation/      Zod schemas for every write
└── .env.example
```

## Quick start

Prerequisites: Node 20+.

```shell
npm install

# 1 — configure the API
cp .env.example server/.env        # then edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 2 — local database (downloads a mongod binary on first run, persists in server/.data/mongo)
npm run dev:db

# 3 — in a second terminal: bootstrap admin + settings + starter catalogue
npm run seed

# 4 — run the API and the client
npm run dev
# Client: http://localhost:5173     API: http://localhost:4000/api/health
```

`npm run dev:all` runs the database, API and client together.

**Admin panel:** http://localhost:5173/admin — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from
`server/.env`. A freshly bootstrapped account must choose a new password before the panel opens.

## Admin panel

* **Overview** — 7/30/90-day page views, piece views, cart adds, order messages, top pieces,
  referrers, plus a warning when no WhatsApp number is configured.
* **Pieces** — full CRUD, multi-image upload/reorder, size or colour options, new-in / bestseller /
  featured flags, archive & restore, SEO fields, display order.
* **Edits (categories)** — CRUD and reordering with live piece counts.
* **Reviews** — add, edit, approve, hide, delete. Only approved reviews reach the shop.
* **Lookbook** — images for the homepage strip and lookbook page.
* **Settings** — identity, WhatsApp number, **hero slider slides**, announcements, atelier story,
  order message templates, shipping and returns copy.
* **Security** — forced first-login password change, 10 login attempts / 15 min, JWT re-validated
  against the database on every request, Zod validation on all writes.

## Ordering behaviour

* With a WhatsApp number in Settings, every order button builds a `wa.me` link with a pre-filled
  message (items, options, quantities, estimated total).
* Without one, order buttons open the brand's Instagram DMs instead, so the shop is never a dead
  end. The dashboard flags this until the number is added.
* Prices are nullable end to end: blank means “Price on request”, never ₹0.

## Photography

* Product photography (`client/public/images/p-*.jpg`), the lookbook images and the profile emblem
  come from the brand's public Instagram feed.
* The three hero images and the atelier detail are editorial images generated for this build in the
  house palette; replace them in Admin → Settings (hero slides) with the brand's own photographs.

## Scripts

| Command | Purpose |
| `npm run dev` | API + client together |
| `npm run dev:all` | Database + API + client in one terminal |
| `npm run dev:db` | Local dev MongoDB (persists in `server/.data/mongo`) |
| `npm run seed` | Bootstrap admin + settings, add the starter catalogue if empty |
| `npm run seed:reset` | Wipe catalogue records and re-create them |
| `npm run build` | Typecheck + build both workspaces |
| `npm run typecheck` | TypeScript project-wide |

## Environment variables

| Variable | Purpose |
| `PORT` | API port (4000) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Long random string for signing admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (12h) |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `PUBLIC_SITE_URL` / `PUBLIC_API_URL` | Canonical URLs |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account (seed only) |
| `UPLOAD_MAX_BYTES` / `UPLOAD_MAX_FILES` | Upload limits |

Client (optional): `VITE_API_URL`, `VITE_PUBLIC_SITE_URL`, `VITE_BASE`, `VITE_DEMO_CATALOGUE`.

## Roadmap to production

1. Set the WhatsApp number and review the message templates in Admin → Settings.
2. Replace the generated hero and atelier images with the brand's own photography.
3. Add the real catalogue, lookbook images and approved customer reviews.
4. Set `JWT_SECRET`, a strong admin password and `CORS_ORIGINS` on the host; deploy the SPA build
   and API, and point MongoDB at Atlas.
