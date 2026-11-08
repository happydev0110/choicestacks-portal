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

Visit `/provider-games` for the synchronized provider catalog, search, filters, pagination and availability states. With sandbox keys configured and the catalog imported, `/casino` and `/providers` use this collection even before gameplay is enabled. A status message explains when sandbox play is pending. `/play/{uuid}` requires sign-in; its launch buttons remain disabled until the backend reports `launchEnabled=true`. Once enabled it offers sandbox sessions with test credits, optional vendor demo mode, an iframe and an external-tab fallback. The account wallet shows a separate sandbox balance. Existing reference/category pages remain previews.

Add sandbox credentials only to the backend `.env`, then run `npm run games:check` and `npm run games:sync` there to test access and import games without launching anything. For actual gameplay, configure the public HTTPS callback in both `.env` and the provider back office, set `APIMATIC_ENABLED=true`, and restart the backend. No provider secret belongs in the frontend. Without credentials, the collection displays a coming-soon state. Actual vendor gameplay cannot be verified until callback setup is complete.

## Included

- Dedicated `/casino` lobby matching the reference: wide static banner, compact search, five illustrated category links, and six horizontal game collections. Cards support automatic advance, pause/resume, arrow controls, mouse dragging, and touch swiping. Reduced-motion preferences pause automatic advance by default.

- Desktop icon rail expands on hover/focus into a 220px menu and collapses when leaving; content stays in place
- Mobile/tablet bottom navigation opens a full-height drawer, with Escape, close button, backdrop dismissal, and background scroll locking
- Swiper promotional carousel: 4.5-second autoplay, 900ms transitions, mouse dragging/touch swiping, rewind, and responsive pagination (fixed-width desktop cards and one mobile card)
- Autoplay continues while hovering or after manual interaction; an explicit pause/resume button controls it. Reduced motion uses instant slide changes instead of disabling autoplay.
- Dedicated game categories with search, provider filtering, alphabetical sorting, and load-more pagination
- Provider directory and 39 provider routes; providers without local titles show a clear empty state
- 110 game detail pages with preview areas, related games, and browser-saved favorites
- Sportsbook with sport/live filters, fictional fixtures, selectable odds, and a calculated preview bet slip
- Promotion filters and three offer detail pages, loyalty tier selector and XP explorer, affiliate and referral pages, and a crypto quote preview
- FAQ search and accordions, validated contact/complaint forms, and eight draft policy pages
- MySQL-backed login and registration, session persistence, logout, and protected account pages; password recovery placeholder
- Eleven account pages: overview, profile, wallet, deposit, withdrawal, transactions, bonuses, favorites, security, verification, and play limits
- Recent/biggest sample wins and persisted local cookie preferences
- Locally stored reference artwork and fonts, without runtime requests to the source site
- Shared reference-style footer with a rounded gradient panel, five desktop link columns, three mobile columns, support avatar card, responsible-play badges, cookie settings, and a local support preview. The legal area retains the independent-demo notice instead of reproducing the operator's license claims.

## Page routes

| Section            | Routes                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lobby & catalogs   | `/`, `/casino`, `/new-games`, `/slots`, `/live`, `/crash-instant`, `/table-cards`, `/lotto-scratch`, `/roulette`, `/poker`, `/search`                                                                                                      |
| Providers & games  | `/provider-games`, `/play/{uuid}`, `/providers`, provider slugs such as `/evolution` and `/pgsoft`, `/games/{game-slug}` |
| Sports             | `/sportsbook`                                                                                                                                                                                                                              |
| Promotions         | `/promotions`, `/promotions/first-deposit`, `/promotions/second-deposit`, `/promotions/third-deposit`                                                                                                                                      |
| Rewards & partners | `/loyalty-tiers`, `/affiliates`, `/refer-a-friend`                                                                                                                                                                                         |
| Crypto             | `/buy-crypto`                                                                                                                                                                                                                              |
| Help               | `/contact`, `/complaints`, `/faq`                                                                                                                                                                                                          |
| Policies           | `/terms/terms-of-service`, `/terms/privacy-policy`, `/terms/responsible-gaming`, `/terms/kyc-policy`, `/terms/aml-policy`, `/terms/bonus-policy`, `/terms/betting-rules`, `/terms/cookie-policy`                                           |
| Authentication     | `/login`, `/register`, `/forgot-password`                                                                                                                                                                                                  |
| Account            | `/account`, `/account/profile`, `/account/wallet`, `/account/deposit`, `/account/withdraw`, `/account/transactions`, `/account/bonuses`, `/account/favorites`, `/account/security`, `/account/verification`, `/account/responsible-gaming` |

`app/site-map.ts` is the route registry. The catch-all App Router page statically generates public routes. The dedicated `/account/[[...section]]` route checks authentication on the server for every account page. Unknown paths return a custom 404. Add games in `app/data.ts` or providers in `app/site-map.ts` to extend their collections.

## Validation

```powershell
npm run typecheck
npm run build
npm run check:routes -- http://198.18.1.255:3000
```

The route check reads the production build manifest and checks every generated page against a running server, verifies rendered internal link destinations, checks all eleven account routes redirect unauthenticated visitors, and checks unknown-route 404 responses. Build before running it. Browser checks cover catalog filters, favorites, promotion navigation, support forms, crypto quotes, loyalty tiers, deposit review, sportsbook calculations, mobile navigation, and the existing carousel.

## Scope

Player authentication is connected to MySQL. API-MATIC sandbox integration is implemented and awaits provider configuration; production games, payments, live odds, bonuses and customer support remain unconnected. The sandbox wallet uses actual test-credit records from the backend. Other balance/transaction displays are fixed sample records; previews never change them. Crypto rates are fixed illustrative values, not market prices. Identity uploads are unavailable. Play-limit and security screens illustrate controls without enforcing real account restrictions. Policy pages are original demo drafts and need approved operational content before launch.

Browser local storage holds only cookie choices, favorite game names, and optional currency preferences. Form previews, bet selections, and quote inputs remain in component memory and reset on navigation. Preferred currency does not convert fixed USD sample balances.

## Source files

- `app/page.tsx`: homepage lobby
- `app/components/site-shell.tsx`: shared layout and site navigation
- `app/components/site-footer.tsx` and `app/components/site-footer.module.css`: shared responsive footer and support preview
- `app/site-map.ts`: route definitions, provider directory, and navigation mappings
- `app/[...path]/page.tsx`: static route generation and page metadata
- `app/api/player/[action]/route.ts`: same-origin authentication proxy
- `app/account/[[...section]]/page.tsx`: server-side account protection
- `app/components/player-auth.tsx`: client session state and cross-tab refresh
- `app/screens/auth-screen.tsx`: login and registration forms
- `app/screens/`: catalog, sports, marketing, support, and account components
- `app/screens/screens.css`: responsive page styles
- `app/data.ts`: original homepage catalog and asset references
- `app/casino-data.ts`: casino collections and the combined game catalog
- `app/screens/casino-screen.tsx` and `app/screens/casino.css`: dedicated casino layout and interactions
- `app/globals.css`: original lobby styles
- `app/layout.tsx`: metadata and root layout
- `scripts/check-routes.mjs`: page and link checks

Reference artwork and fonts in `public/assets/` were obtained from the public reference at https://win777live.com/ for this requested design exercise. They remain the property of their respective owners; replace them with your licensed assets before production use. No third-party JavaScript was copied.
