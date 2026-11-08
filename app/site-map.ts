import { allGames as games } from "./casino-data";

export type PageKind =
  | "casino"
  | "catalog"
  | "providers"
  | "sports"
  | "promotions"
  | "promotion"
  | "loyalty"
  | "affiliate"
  | "referral"
  | "crypto"
  | "contact"
  | "faq"
  | "policy"
  | "auth"
  | "account"
  | "game";
export type PageDefinition = {
  title: string;
  kind: PageKind;
  category?: string;
  provider?: string;
  description?: string;
};
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const gameHref = (name: string) => `/games/${slugify(name)}`;
export const categoryLinks = [
  ["All Games", "/casino"],
  ["New Games", "/new-games"],
  ["Slots", "/slots"],
  ["Live Casino", "/live"],
  ["Crash & Instant", "/crash-instant"],
  ["Table & Cards", "/table-cards"],
  ["Lotto & Scratch", "/lotto-scratch"],
  ["Roulette", "/roulette"],
  ["Poker", "/poker"],
];
export const providerList = [
  ["7mojos", "7Mojos", "7mojos.5b1cc2e7.png"],
  ["betgamestv", "BetGames", "betgamestv.7dc3c7d7.png"],
  ["blueprint_gaming", "Blueprint Gaming", "blueprint_gaming.7ee4187a.png"],
  ["btg", "Big Time Gaming", "btg.c0c789eb.png"],
  ["endorphina", "Endorphina", "endorphina.45d26b02.png"],
  ["evolution", "Evolution", "evolution.bca5ffc3.png"],
  ["evoplay", "Evoplay", "evoplay.03f0bb5d.png"],
  ["ezugi", "Ezugi", "ezugi.520fd372.png"],
  ["fantasma_games", "Fantasma Games", "fantasma_games.5d49337c.png"],
  ["habanero", "Habanero", "habanero.6c4890e3.png"],
  ["hacksaw", "Hacksaw", "hacksaw.6e258e64.png"],
  ["irondog", "Iron Dog", "irondog.f00a2103.png"],
  ["kalamba_games", "Kalamba Games", "kalamba_games.aa7d6206.png"],
  ["lucky-streak", "Lucky Streak", "lucky-streak.f315031f.png"],
  ["netent", "NetEnt", ""],
  ["nolimit", "Nolimit City", "nolimit.98fa5f7f.png"],
  ["novomatic", "Novomatic", "novomatic.87e346ca.png"],
  ["onetouch", "OneTouch", "onetouch.5c06c019.png"],
  ["pgsoft", "PG Soft", "pgsoft.2293b900.png"],
  ["playtech", "Playtech", ""],
  ["pragmaticplay", "Pragmatic Play", ""],
  ["quickspin", "Quickspin", ""],
  ["red_tiger", "Red Tiger", ""],
  ["redrake", "Red Rake", ""],
  ["rubyplay", "RubyPlay", ""],
  ["skywind", "Skywind", ""],
  ["slotmill", "Slotmill", "slotmill.8ea56e8a.png"],
  ["smartsoft", "SmartSoft", ""],
  ["spribe", "Spribe", ""],
  ["thunderkick", "Thunderkick", ""],
  ["turbogames", "Turbo Games", ""],
  ["wazdan", "Wazdan", ""],
  ["yggdrasil", "Yggdrasil", ""],
  ["bgaming", "BGaming", ""],
  ["tada", "TADA", ""],
  ["jili", "JILI", ""],
  ["amusnet", "Amusnet", ""],
  ["push-gaming", "Push Gaming", ""],
  ["inout", "InOut", ""],
];
export const policyLinks = [
  ["Terms & Legal", "terms-of-service"],
  ["Privacy Policy", "privacy-policy"],
  ["Responsible Gaming", "responsible-gaming"],
  ["KYC Policy", "kyc-policy"],
  ["AML Policy", "aml-policy"],
  ["Bonus Policy", "bonus-policy"],
  ["Betting Rules", "betting-rules"],
  ["Cookie Policy", "cookie-policy"],
];
export const accountLinks = [
  ["Overview", "/account"],
  ["Profile", "/account/profile"],
  ["Wallet", "/account/wallet"],
  ["Deposit", "/account/deposit"],
  ["Withdraw", "/account/withdraw"],
  ["Transactions", "/account/transactions"],
  ["My Bonuses", "/account/bonuses"],
  ["Favorites", "/account/favorites"],
  ["Security", "/account/security"],
  ["Verification", "/account/verification"],
  ["Play Limits", "/account/responsible-gaming"],
];
export const promotionOffers = [
  {
    slug: "first-deposit",
    title: "First deposit welcome bonus",
    amount: "$300",
    number: "01",
    image: "hero-banner-newgames.1df48699.jpg",
  },
  {
    slug: "second-deposit",
    title: "Second deposit welcome bonus",
    amount: "$300",
    number: "02",
    image: "hero-banner-wallet.306b8026.jpg",
  },
  {
    slug: "third-deposit",
    title: "Third deposit welcome bonus",
    amount: "$400",
    number: "03",
    image: "hero-banner-aviator.1b5c4827.jpg",
  },
];
export const pageDefinitions: Record<string, PageDefinition> = {
  casino: { title: "Online Casino", kind: "casino" },
  "new-games": { title: "New Games", kind: "catalog" },
  slots: { title: "Slots", kind: "catalog", category: "Slots" },
  live: { title: "Live Casino", kind: "catalog", category: "Live Casino" },
  "crash-instant": {
    title: "Crash & Instant",
    kind: "catalog",
    category: "Crash & Instant",
  },
  "table-cards": {
    title: "Table & Cards",
    kind: "catalog",
    category: "Table & Cards",
  },
  "lotto-scratch": {
    title: "Lotto & Scratch",
    kind: "catalog",
    category: "Lottery",
  },
  roulette: { title: "Roulette", kind: "catalog", category: "Roulette" },
  poker: { title: "Poker", kind: "catalog", category: "Poker" },
  search: { title: "Search Games", kind: "catalog" },
  providers: { title: "Game Providers", kind: "providers" },
  sportsbook: { title: "Sportsbook", kind: "sports" },
  promotions: { title: "Bonus Offers", kind: "promotions" },
  "loyalty-tiers": { title: "Loyalty Tiers", kind: "loyalty" },
  affiliates: { title: "Win777 Partners", kind: "affiliate" },
  "refer-a-friend": { title: "Refer a Friend", kind: "referral" },
  "buy-crypto": { title: "Buy Crypto", kind: "crypto" },
  contact: { title: "Contact Us", kind: "contact" },
  complaints: { title: "Complaints", kind: "contact" },
  faq: { title: "Frequently Asked Questions", kind: "faq" },
  login: { title: "Log In", kind: "auth" },
  register: { title: "Join Now", kind: "auth" },
  "forgot-password": { title: "Reset Password", kind: "auth" },
};
for (const [name, path] of categoryLinks)
  if (!pageDefinitions[path.slice(1)])
    pageDefinitions[path.slice(1)] = { title: name, kind: "catalog" };
for (const [slug, title] of providerList)
  pageDefinitions[slug] = { title, kind: "catalog", provider: title };
for (const [title, slug] of policyLinks)
  pageDefinitions[`terms/${slug}`] = { title, kind: "policy" };
for (const [title, path] of accountLinks)
  pageDefinitions[path.slice(1)] = {
    title: title === "Overview" ? "My Account" : title,
    kind: "account",
  };
for (const offer of promotionOffers)
  pageDefinitions[`promotions/${offer.slug}`] = {
    title: offer.title,
    kind: "promotion",
  };
for (const game of games)
  pageDefinitions[`games/${slugify(game.name)}`] = {
    title: game.name,
    kind: "game",
  };
export const labelRoutes: Record<string, string> = {
  Home: "/",
  Casino: "/casino",
  "All Games": "/casino",
  "New Games": "/new-games",
  Slots: "/slots",
  "Live Casino": "/live",
  "Crash & Instant": "/crash-instant",
  "Crash & Instant Games": "/crash-instant",
  "Table & Cards": "/table-cards",
  "Table Games": "/table-cards",
  "Lotto & Scratch": "/lotto-scratch",
  Lottery: "/lotto-scratch",
  Roulette: "/roulette",
  Poker: "/poker",
  Sports: "/sportsbook",
  Sportsbook: "/sportsbook",
  Promotions: "/promotions",
  "Loyalty Tiers": "/loyalty-tiers",
  Affiliate: "/affiliates",
  "Crypto Payments": "/buy-crypto",
  "Buy Crypto": "/buy-crypto",
  "Contact Us": "/contact",
  FAQ: "/faq",
  Complaints: "/complaints",
  "Log In": "/login",
  "Join Now": "/register",
  "Deposit Now": "/account/deposit",
  "Refer a Friend": "/refer-a-friend",
  Search: "/search",
  Account: "/account",
  "Game Providers": "/providers",
};
for (const [title, slug] of policyLinks) labelRoutes[title] = `/terms/${slug}`;
