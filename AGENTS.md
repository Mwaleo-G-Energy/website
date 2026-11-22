# Mwaleo Green Energy — Website (Illustriober Creatives)

Custom storefront for Mwaleo Green Energy, a solar equipment dealer in Nairobi CBD. Built and managed by Illustriober Creatives (Harmon). The code started as an export of the Watch Fusion Kenya site (no git history carried over): Wix headless backend with a custom Next.js front end on Vercel. The repo is `Mwaleo-G-Energy/website` (private). Until the clean-base phase lands, the code still holds Watch Fusion names, assets and copy.

Items marked **TBC** are unconfirmed. Ask Harmon before relying on them, and never invent business facts such as prices, licence numbers, addresses or phone numbers.

## The business

- **Name:** Mwaleo Green Energy (confirmed). Use this name everywhere. The old public site uses "Mwaleo Solar Solution"; replace that name wherever it appears.
- **Domain:** mwaleogreenenergy.co.ke. It is registered with a non-Wix provider, so DNS will point to Vercel.
- **What it does:** sells, and possibly installs (TBC), solar inverters, lithium batteries and system kits.
- **Launch focus: one brand, Felicity Solar.** The owner is tired of listing many products that don't sell, so the launch catalogue is a small, curated Felicity range with a premium presentation. Other brands (e.g. MUST) are out of scope.
- **Authorised Felicity dealer (confirmed).** He can order any Felicity product on request. The site may use official Felicity product photos, datasheets and manuals, and an "Authorised Felicity Solar Dealer" mark. The site stays Mwaleo-branded: Felicity's logo appears only as a dealer badge, never as the site identity.
- **Launch range: Felicity off-grid systems only** (in stock now), plus off-grid kits. Hybrid inverters, C&I storage and other lines come later, so the data model and navigation must allow new categories without code changes.
- **Kits: yes.** The owner will send his kit list with prices (TBC). Each kit is one Wix product linking to its component products.
- **Brand design (logo, colours, type) comes later, as a separate step.** Build with neutral placeholder design tokens that are easy to swap.
- **Location:** Gaberone Plaza, 3rd Floor, Rm T17, Nairobi CBD (TBC, taken from the old site).
  - Phone and WhatsApp: TBC.
  - EPRA licence class and number: TBC.
- **Previous site:** hosted on Odoo, and possibly a WordPress site at mwaleosolarsolution.co.ke. It had corrupted prices and leftover template demo pages. Do not copy its content without checking it first.

## Customers and how they buy

- Mostly mobile users in Kenya, often on slow or unstable data. Keep pages light:
  - optimised images
  - minimal client-side JS
  - no new animation libraries
  - fallbacks when requests fail
- High-ticket items (KES 25k–300k+). Buyers compare prices online, then message on WhatsApp for stock, a quote or delivery, and often book a site survey.
- **Primary conversion is a WhatsApp enquiry or quote, not online checkout.** Every product page, kit and listing needs a clear WhatsApp CTA. Phone call is the secondary CTA.
- Payment: M-Pesa is expected. Online checkout is secondary; confirm the approach with Harmon first (Wix checkout, Pesapal link, or Till/Paybill confirmed on WhatsApp).
- Prices in KES, shown **VAT-inclusive** and labelled clearly (competitors often show ex-VAT, which confuses buyers). VAT treatment varies by product type, especially batteries after the Finance Act 2026. Never hard-code VAT logic; prices come from Wix.

## Design direction

**Reference:** felicitysolar.us. Its homepage, the off-grid inverter listing (`/all-off-grid-inverter`) and a product page (`/product/ivem6048-ii`). The Africa site (africa.felicitysolar.com) redirected to the US site when checked. The owner likes its premium, image-led look. Build something **close in feel, but lighter, smoother and cleaner**. This is Mwaleo's own site selling Felicity products. It must not look like, or be mistaken for, the official Felicity website: use Mwaleo's own branding, name, logo and colours.

**Keep from the reference:**
- Large product renders on plain, light backgrounds. Generous whitespace, bold section headings, short copy.
- Model names presented as the hero, with a one-line spec subtitle (e.g. "6kW | Single Phase | 48V").
- Product page structure:
  1. Hero image + title + spec subtitle + primary CTA
  2. "What sets it apart" feature cards (6–9, short)
  3. A compact spec table
  4. Application scenarios (home, shop, school, clinic)
  5. Downloads (datasheet, user manual)
- Listing filters by **type** (off-grid, hybrid, battery), **power (kW)**, **battery voltage (12/24/48V)** and **phase**, plus series tiles above the grid.
- Solutions-style entry points: Home backup, Small business, Off-grid.

**Improve on the reference:**
- **Show KES prices** (VAT-inclusive) and stock status on cards and product pages. The reference shows no prices.
- Show 2–3 key specs on listing cards (kW, battery voltage, PV input). The reference cards show only the model name.
- Product cards and pages lead to a **WhatsApp quote CTA**, not a long pop-up form.
- No hero video, 3D embed, heavy mega-menus or animation libraries. Use a static, optimised hero image, CSS transitions only, and a simple sticky header.
- A thumbnail gallery on product pages (the reference has a single image).
- A "Pairs well with" block (inverter ↔ compatible battery ↔ kit). The reference has no related products.
- No placeholder or lorem ipsum text in production. The reference still has some.

## Catalogue shape for launch

Off-grid only. Exact models and prices come from the owner (TBC).
- **Off-grid inverters:** Felicity's current off-grid range, i.e. IVEM-II series (IVEM4024-II, IVEM6048-II, IVEM8~12048-II), IVEM3/5kW-LV, IVCM series (IVCM2012~3024P1G2, IVCM1012~3024-PRO) and IVAM12048P1G1. Publish only the models he stocks.
- **Supporting off-grid components** he stocks (batteries, panels, combiner boxes): TBC.
- **Kits:** off-grid bundles (inverter + battery + panels) priced as one product, from his list.

Navigation for launch: Off-grid inverters, Kits, and component categories once confirmed. Hybrid and other categories are hidden until stocked.

All of this comes from Wix Stores. Wix product fields and CMS collections must hold:
- specs, as structured fields usable for filters
- feature cards
- scenarios
- download links

The owner then adds new models without code changes.

## Differentiators the site should support

- EPRA licence badge in the footer and on the About and Contact pages, once the number is confirmed.
- Ready-made **solar kits** (e.g. 1.5kW starter, 3kW home backup, 5kW full home) as single products, with "what's in the kit" and "what it powers".
- Spec tables and a simple **"What system do I need?"** sizing guide (appliance checklist → recommended kit). Keep it static and lightweight.
- Clean, correct, up-to-date prices. Competitor sites are badly maintained.

## Stack (same as Watch Fusion)

- Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, Zustand. GSAP only if already used and needed; no new animation libraries.
- Wix headless SDK: `@wix/stores`, `ecom`, `members`, `data`, `redirects`. Client code lives in `src/lib/wixClientServer.ts` and `wixApps.ts`.
- Wix plan: **Core** (paid by the client, in the client's own Wix account). Products, categories, tags and SEO fields are managed in the Wix dashboard.
- Wix CMS collections hold owner-editable content (banners, FAQs, testimonials, kit descriptions) so the client can update content without code.
- Hosting: Vercel. `main` = live, `develop` = preview.
- Google:
  - Merchant Center via the Wix Google channel (this works on Watch Fusion). Verify that product links resolve to the Next.js product URLs.
  - Search Console and Google Business Profile are set up outside the code.
  - Add conversion tracking for WhatsApp clicks, call clicks and quote forms.

## Commands

`npm test` (Vitest), `npm run lint`, `npm run typecheck`, `npm run build`. CI runs all four on every PR.

## Workflow

- Branch from `develop` (`feat/`, `fix/`, `chore/`). Open PRs as drafts into `develop` with checks passing, and merge with a merge commit.
- The owner reviews the Vercel preview. Then open one PR `develop` → `main` listing the changes.
- Hotfixes go to `main`, then back-merge `main` → `develop`.
- **The preview uses the live Wix store, so orders placed there are real.** Mark test orders and cancel them.
- Wix settings must exist in **both** Vercel Preview and Production env vars: client ID, app ID, category IDs. A green build doesn't prove they are set.
- Never commit secrets or Wix keys. Env values live in Vercel only.

## Conventions (enforced by tests — keep them enforced)

- **Brand palette:** TBC. The Watch Fusion navy/gold palette tests must be **replaced** with Mwaleo's palette, not deleted. Red only for errors and remove actions.
- No emoji in source, SVG, JSON or public files. Use `icons.tsx` / `NavIcons.tsx`. ©, ® and ™ are allowed.
- One listing route: `/shop` and `/shop/<category>`. `/list` permanently redirects; there is no `src/app/list`.
- Server-only code stays server-only.
- Every lib and component has a co-located `*.test.ts(x)`, updated with each behaviour change.
- Remote images only from hosts listed in `next.config.mjs`.
- Prices and delivery in KES. Delivery rates and fees live in `src/lib/delivery*.ts` and `feeSync.ts`. **Mwaleo's delivery and installation rules are TBC, so do not reuse Watch Fusion's rates.**

## Separation from Watch Fusion

This is a separate client. No shared Wix site, keys, Vercel project, Google accounts, analytics IDs, delivery rates, copy or branding. Search for and remove every Watch Fusion reference (name, domain, WhatsApp number, colours, logos, category IDs, product copy, metadata, OG images, sitemap host, structured data).

## Environment & Secrets

Values live in Vercel (Preview and Production) and `.env.local`. Wix settings affect requests even when the production build passes.

| Variable | Required | When missing |
|---|---|---|
| `NEXT_PUBLIC_WIX_CLIENT_ID` | yes | Wix auth fails at request time (the build itself passes). Public identifier, not a secret. |
| `WIX_CLIENT_SECRET` | only for delivery fees and the contact form | Those features stay off. Server-only: never prefix with `NEXT_PUBLIC_`, never log it. |
| `FEATURED_PRODUCTS_CATEGORY_ID` | optional | The homepage hides the section. |
| `NEW_PRODUCTS_CATEGORY_ID` | optional | The homepage hides the section. |

CI builds with GitHub repository variables `NEXT_PUBLIC_WIX_CLIENT_ID` and `FEATURED_PRODUCTS_CATEGORY_ID`. The build still passes without them, but Wix calls fail at request time.

## Read Before Touching This

### Wix errors are swallowed

Product-list category lookups and the cart store catch and drop Wix errors. A broken Wix connection can look like an empty page, so check server logs, not just the rendered page. Seen on Watch Fusion; re-check here.

### Wix packages are unpinned

`@wix/sdk`, `@wix/stores`, `@wix/ecom` and `@wix/redirects` are `latest` in `package.json`. Only the lockfile pins them, so do not run `npm update` or regenerate the lockfile casually.

### Catalog version

The listing uses the Catalog V3 REST search. The product page uses the older `queryProducts()` module. Confirm both work against Mwaleo's Wix site before relying on either.

### Install and dependency risk

Install with `npm ci --ignore-scripts`. Watch Fusion's notes reported 32 `npm audit` findings (7 critical) on Next 14.2.2; not re-checked here. A Next upgrade is its own change.

## Working rules

- Prefer simple, reliable solutions.
- No design or visual-direction changes beyond what is requested. Flag any implied design change in the PR description.
- Owner-facing PR summaries are short and non-technical: what changed, what they'll see on the preview, what to check.
- State assumptions instead of asking when a sensible default exists. Ask when a business fact is missing.
