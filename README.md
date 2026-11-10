# Choicestakes portal

A responsive Choicestakes frontend built with Next.js App Router, TypeScript, and plain CSS. Public pages and authenticated account screens share the lobby header, sidebar, and footer. Player registration and sign-in connect to the Node.js/MySQL backend in `../choicestacks-backend`.

## Run locally

```powershell
cd E:\Web\CP\_dev\choicestacks-portal
npm install
npm run dev
```

Open the Local URL printed in the terminal (normally http://localhost:3000), or the existing development address http://198.18.1.255:3000. Run `npm run build`, then `npm start` for the production server. Run `npm run typecheck` to check TypeScript separately. The project can be deployed to a host supporting Next.js or Node.js.

Development access through `http://127.0.0.1:3000/` and `http://198.18.1.255:3000/` is explicitly allowed in `next.config.ts`. If your development address changes, add its hostname to `allowedDevOrigins` and restart the development server. Otherwise Next.js may block development resources and leave the page without working client interactions. Authentication forms stay disabled until their client code loads and use POST even without JavaScript, so credentials cannot fall back to URL query parameters.

## Player authentication

Start the backend on port 4000 after configuring its MySQL settings and running `npm run db:migrate` (see the backend README). The portal uses `BACKEND_URL=http://127.0.0.1:4000` by default. Copy `.env.example` to `.env.local` if you need to change this server-only URL, then restart Next.js. Never put database settings or secrets in `NEXT_PUBLIC_*`.

The browser calls same-origin `/api/player/register`, `/api/player/login`, `/api/player/me`, and `/api/player/logout`. Next.js forwards these requests to the backend. An HttpOnly cookie keeps the session across reloads; neither passwords nor tokens are written to browser storage. Production requires HTTPS and a backend configured with `NODE_ENV=production`. Add the exact portal origin to the backend's `CORS_ORIGINS` for the origin/CSRF checks.

Registration needs a display name, email, matching password of 12–128 characters, and the age/terms declaration. Duplicate emails and unavailable services display errors. Server-rendered `/account/*` pages check the session and redirect visitors to sign in, preserving their account destination. The header and account menu provide logout, which revokes the database session. Profile details are read from the saved player record.

MySQL must be enabled and migrated for registration/login to succeed; there is no local account fallback. Email verification, password recovery, profile edits, and 2FA are not implemented. The recovery and security screens clearly indicate this. The sandbox wallet reads test credits from MySQL; other account balances and payment transactions remain sample content.

## Provider games

Global toast notifications use `useToast()` from `app/components/toast-provider.tsx`. Call `toast.success(message)` or `toast.error(message)` after a user action. Success cards are green and errors are red; both include a close button. They survive client navigation, show at most three cards, and suppress identical visible messages. Success cards close after five seconds and errors after seven, pausing on hover, keyboard focus, or a hidden tab. Login, registration, both logout controls, favorites, and game-launch/fullscreen failures use this shared component; passive background refreshes remain quiet.

The signed-in header shows the saved display name with an initials avatar, the current game balance, notifications, and an account menu. The green plus opens Wallet; payments are not connected. The header and game screens share one wallet request, refreshed on navigation, returning to the tab, and every 30 seconds while visible. An unavailable wallet displays a dash rather than a zero balance. Login checks use a loading placeholder instead of briefly showing guest controls.

Bet History (`/account/bets`) uses the wallet API's latest 20 game ledger entries. It is recent activity, not a complete paginated betting report; the existing endpoint does not return game names or round IDs. The notification panel currently has an empty state and disabled Mark All as Read, ready for a future notification service. Menus support keyboard navigation, Escape, outside-click dismissal, and mobile layouts.

Home, Casino, Search, category pages, the provider directory, public `/games/{uuid}` details, and browser favorites all use the synchronized provider catalog. Cards display the provider name, artwork, and UUID; there is no sample-game fallback. `/play/{uuid}` requires sign-in and gameplay remains disabled until callback setup is complete. The account wallet shows a separate sandbox test balance. Categories are assigned manually; unassigned games remain visible in All Games. See `../choicestakes-backend/docs/provider-catalog.md` for deployment and classification commands.

Clicking any provider game card opens `/play/{uuid}` directly, with prefetch disabled. Signed-out players return to their selected game after login or registration. Once the player session is confirmed, the player automatically makes one sandbox launch request and embeds the returned game URL. Effect replays and account refreshes reuse the same attempt; failures are retried only by clicking Retry (or the optional demo fallback). Each explicit retry opens a new session. Launch responses are ignored after leaving the player, and game URLs are kept only in memory. Fullscreen, open-in-new-tab, and close controls are available in the player. If `launchEnabled` is false, the page shows an unavailable message and sends no launch request. No provider credentials or environment settings are changed by this UI flow.

Add sandbox credentials only to the backend `.env`, then run `npm run games:check` and `npm run games:sync` there to test access and import games without launching anything. For actual gameplay, configure the public HTTPS callback in both `.env` and the provider back office, set `APIMATIC_ENABLED=true`, and restart the backend. No provider secret belongs in the frontend. Without credentials, the collection displays a coming-soon state. Actual vendor gameplay cannot be verified until callback setup is complete.

## Included

- Shared provider catalog with search, provider filters, category links, and complete server-side pagination.

- Desktop icon rail expands on hover/focus into a 220px menu and collapses when leaving; content stays in place
- Mobile/tablet bottom navigation opens a full-height drawer, with Escape, close button, backdrop dismissal, and background scroll locking
- Swiper promotional carousel: 4.5-second autoplay, 900ms transitions, mouse dragging/touch swiping, rewind, and responsive pagination (fixed-width desktop cards and one mobile card)
- Autoplay continues while hovering or after manual interaction; an explicit pause/resume button controls it. Reduced motion uses instant slide changes instead of disabling autoplay.
- Dedicated game categories with search, provider filtering, alphabetical sorting, and server-side pagination
- Dynamic provider directory with counts from MySQL and `/providers/{provider}` routes.
- Dynamic `/games/{uuid}` detail pages with browser-saved favorites and authenticated sandbox launch links.
- Sportsbook with sport/live filters, fictional fixtures, selectable odds, and a calculated preview bet slip
- Promotion filters and three offer detail pages, loyalty tier selector and XP explorer, affiliate and referral pages, and a crypto quote preview
- FAQ search and accordions, validated contact/complaint forms, and eight draft policy pages
- MySQL-backed login and registration, session persistence, logout, and protected account pages; password recovery placeholder
- Eleven account pages: overview, profile, wallet, deposit, withdrawal, transactions, bonuses, favorites, security, verification, and play limits
- Persisted local cookie preferences; fabricated wins and popularity rankings are removed.
- Locally stored reference artwork and fonts, without runtime requests to the source site
- Shared reference-style footer with a rounded gradient panel, five desktop link columns, three mobile columns, support avatar card, responsible-play badges, cookie settings, and a local support preview. The legal area retains the independent-demo notice instead of reproducing the operator's license claims.

## Page routes

| Section            | Routes                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lobby & catalogs   | `/`, `/casino`, `/new-games`, `/slots`, `/live`, `/crash-instant`, `/table-cards`, `/lotto-scratch`, `/roulette`, `/poker`, `/search`                                                                                                      |
| Providers & games  | `/provider-games`, `/play/{uuid}`, `/providers`, `/providers/{provider}`, `/games/{uuid}` |
| Sports             | `/sportsbook`                                                                                                                                                                                                                              |
| Promotions         | `/promotions`, `/promotions/first-deposit`, `/promotions/second-deposit`, `/promotions/third-deposit`                                                                                                                                      |
| Rewards & partners | `/loyalty-tiers`, `/affiliates`, `/refer-a-friend`                                                                                                                                                                                         |
| Crypto             | `/buy-crypto`                                                                                                                                                                                                                              |
| Help               | `/contact`, `/complaints`, `/faq`                                                                                                                                                                                                          |
| Policies           | `/terms/terms-of-service`, `/terms/privacy-policy`, `/terms/responsible-gaming`, `/terms/kyc-policy`, `/terms/aml-policy`, `/terms/bonus-policy`, `/terms/betting-rules`, `/terms/cookie-policy`                                           |
| Authentication     | `/login`, `/register`, `/forgot-password`                                                                                                                                                                                                  |
| Account            | `/account`, `/account/profile`, `/account/wallet`, `/account/deposit`, `/account/withdraw`, `/account/transactions`, `/account/bonuses`, `/account/favorites`, `/account/security`, `/account/verification`, `/account/responsible-gaming` |

`app/site-map.ts` is the route registry. The catch-all App Router page statically generates public routes. The dedicated `/account/[[...section]]` route checks authentication on the server for every account page. Unknown paths return a custom 404. Games and providers are resolved at runtime from MySQL; run the backend catalog sync to update them.

## Validation

```powershell
npm run typecheck
npm run build
npm run check:routes -- http://198.18.1.255:3000
```

The route check reads the production build manifest and checks every generated page against a running server, verifies rendered internal link destinations, checks all eleven account routes redirect unauthenticated visitors, and checks unknown-route 404 responses. Build before running it. Browser checks cover catalog filters, favorites, promotion navigation, support forms, crypto quotes, loyalty tiers, deposit review, sportsbook calculations, mobile navigation, and the existing carousel.

## Scope

Player authentication is connected to MySQL. API-MATIC sandbox integration is implemented and awaits provider configuration; production games, payments, live odds, bonuses and customer support remain unconnected. The sandbox wallet uses actual test-credit records from the backend. Other balance/transaction displays are fixed sample records; previews never change them. Crypto rates are fixed illustrative values, not market prices. Identity uploads are unavailable. Play-limit and security screens illustrate controls without enforcing real account restrictions. Policy pages are original demo drafts and need approved operational content before launch.

Browser local storage holds only cookie choices, provider game UUIDs (up to 100 favorites), and optional currency preferences. Form previews, bet selections, and quote inputs remain in component memory and reset on navigation. Preferred currency does not convert fixed USD sample balances.

## Source files

- `app/page.tsx`: homepage lobby
- `app/components/site-shell.tsx`: shared layout and site navigation
- `app/components/site-footer.tsx` and `app/components/site-footer.module.css`: shared responsive footer and support preview
- `app/site-map.ts`: static page definitions and navigation mappings
- `app/[...path]/page.tsx`: static route generation and page metadata
- `app/api/player/[action]/route.ts`: same-origin authentication proxy
- `app/account/[[...section]]/page.tsx`: server-side account protection
- `app/components/player-auth.tsx`: client session state and cross-tab refresh
- `app/screens/auth-screen.tsx`: login and registration forms
- `app/screens/`: catalog, sports, marketing, support, and account components
- `app/screens/screens.css`: responsive page styles
- `app/data.ts`: promotional banners and asset references
- `app/screens/provider-catalog.tsx`: shared catalog, filters, pagination, and provider directory
- `app/casino/page.tsx` and `app/casino/loading.tsx`: dynamic server-rendered casino lobby and matching loading state
- `app/screens/casino-lobby.tsx` and `app/screens/casino.css`: permanent casino layout, provider search and category rows
- `app/globals.css`: original lobby styles
- `app/layout.tsx`: metadata and root layout
- `scripts/check-routes.mjs`: page and link checks

Reference artwork and fonts in `public/assets/` were obtained from the supplied design reference. They remain the property of their respective owners; replace them with your licensed assets before production use. No third-party JavaScript was copied. The active wordmark is `choicestakes-wordmark.png`; unused legacy wordmarks have been removed.

`asset-sources.json` records local asset URLs and available CDN references. The optional artwork helper reuses existing files. To restore a missing relative asset, set `ASSET_SOURCE_ORIGIN` to the HTTPS origin of your authorized artwork source before running `node scripts/sync-casino-assets.mjs`.

## Casino category setup

Deploy the matching backend first: the lobby uses `GET /api/v1/gaming/lobby`. Set the portal's server-only `BACKEND_URL`, rebuild and restart the portal. `/casino` keeps its layout before and after hydration; `/all-games` provides the full grid. Existing category pages read their complete categories with pagination.

The provider does not supply verified category tags. In the backend, run `npm run games:categories:export -- ./game-categories.json`, review the game names/UUIDs and fill in their `categories`, then run `npm run games:classify -- ./game-categories.json`. Supported tags are `featured`, `new-games`, `slots`, `live`, `crash-instant`, `table-cards`, `lotto-scratch`, `roulette`, and `poker`. Games without assignments remain in All Games. Category imports take effect on the next page load without a rebuild and survive provider sync. See the backend's `docs/provider-catalog.md` for the file format and full deployment instructions.
