

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
  | "account";
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
export const categoryLinks = [
  ["All Games", "/all-games"],
  ["Featured Games", "/featured"],
  ["New Games", "/new-games"],
  ["Slots", "/slots"],
  ["Live Casino", "/live"],
  ["Crash & Instant", "/crash-instant"],
  ["Table & Cards", "/table-cards"],
  ["Lotto & Scratch", "/lotto-scratch"],
  ["Roulette", "/roulette"],
  ["Poker", "/poker"],
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
  ["Bet History", "/account/bets"],
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
  affiliates: { title: "Choicestakes Partners", kind: "affiliate" },
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
export const labelRoutes: Record<string, string> = {
  Home: "/",
  Casino: "/casino",
  "All Games": "/all-games",
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
