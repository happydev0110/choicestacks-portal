export const asset = (name: string) => `/assets/${name}`;
export type Game = {
  name: string;
  image: string;
  category: string;
  provider: string;
};
export const games: Game[] = [
  ["3 Charge Bison", "59c11a148169.jpg", "Slots", "Pragmatic Play"],
  ["Mega Fishing", "47abbb9a33ff.jpg", "Slots", "JILI"],
  ["Wild Heart", "aa2fb016b290.png", "Slots", "Pragmatic Play"],
  ["Lucky Fortune", "d59123efa64d.png", "Slots", "PG Soft"],
  ["Age of Dragons Mini-Max", "ec4ef5f0ee04.png", "Slots", "Slotmill"],
  ["Golden Fortune", "49a54b577e40.png", "Slots", "PG Soft"],
  ["Adventures", "23e736a5bcfb.png", "Slots", "Evoplay"],
  ["French Roulette", "fb728c709add.png", "Roulette", "Evolution"],
  ["Aviator", "9cb57d01405c.png", "Crash & Instant", "Spribe"],
  ["Mines", "3cec1767b391.png", "Crash & Instant", "Spribe"],
  ["Luxury Life", "388492e90cff.png", "Slots", "Pragmatic Play"],
  ["Age Of Seth 94", "f47893015922.png", "Slots", "Hacksaw"],
  ["Butterfly Blossom", "445419745e6a.png", "Slots", "PG Soft"],
  ["American Roulette", "ba2fe9ed6913.png", "Roulette", "Evolution"],
  ["Andar Bahar", "d6ec95abdd4b.jpg", "Poker", "Ezugi"],
  ["Bad Rhinos", "9c4db10d121f.jpg", "Slots", "Pragmatic Play"],
  ["Alchemy Gold", "eb3980c4b14f.png", "Slots", "PG Soft"],
  ["Ultimate Blackjack", "f0e414e2b29a.jpg", "Live Casino", "Ezugi"],
  ["Blackjack 8", "628e77439762.jpg", "Live Casino", "Ezugi"],
  ["VIP Blackjack 4", "93c23004edc8.jpg", "Live Casino", "Ezugi"],
  ["Blackjack 35", "8add030ee30c.jpg", "Live Casino", "Ezugi"],
  ["Lucky 7", "f102c9cce32f.jpg", "Lottery", "BetGames"],
  ["Lucky Wheelionaire", "7fe615ba91a4.jpg", "Lottery", "BetGames"],
  ["Land of Ra", "089f794d3370.jpg", "Live Casino", "Ezugi"],
  ["Speed Baccarat 2", "d76d7e37fc72.jpg", "Live Casino", "Ezugi"],
  ["Rock’n’Lock", "4e9d5d7f449e.png", "Slots", "Hacksaw"],
  ["3 Thunders", "18327a642178.png", "Slots", "Pragmatic Play"],
  ["Burning Coins 40", "f373ce841d69.jpg", "Slots", "Amusnet"],
  ["Flash Roulette", "5afc35fbe6ed.jpg", "Roulette", "Evolution"],
  ["Jawsome Pirates", "b4d854aef192.png", "Slots", "Push Gaming"],
  ["Dragon Tiger", "544652771a11.png", "Poker", "Evolution"],
  ["Seasons", "5dcde7082795.png", "Slots", "Hacksaw"],
  ["Queen of Hearts Deluxe", "d99c3fbdd640.png", "Slots", "Novomatic"],
  ["Chicken Road", "91821805af0a.png", "Crash & Instant", "InOut"],
].map(([name, image, category, provider]) => ({
  name,
  image,
  category,
  provider,
}));
export const categories = [
  {
    name: "All Games",
    image: "all-games-gamepad.716acae7.webp",
    icon: "allGame.f63a8fae.svg",
  },
  {
    name: "Slots",
    image: "slots-machine.d48b1a72.webp",
    icon: "slots.00faba34.svg",
  },
  {
    name: "Roulette",
    image: "roulette-wheel.4f897a5a.webp",
    icon: "roulette.31ce215c.svg",
  },
  {
    name: "Poker",
    image: "poker-cards.46250a78.webp",
    icon: "poker.8c9f54a5.svg",
  },
  {
    name: "Lottery",
    image: "lottery-machine.b7106b6d.webp",
    icon: "lottery.db50aa65.svg",
  },
];
export const banners = [
  {
    name: "Live Betting",
    description: "Pre-match and live markets. Cash out anytime.",
    image: "hero-banner-sports.051a738b.jpg",
    target: "Sports",
  },
  {
    name: "Crash",
    description: "Cash out before it crashes.",
    image: "hero-banner-crash.2a878c8f.jpg",
    target: "Crash & Instant",
  },
  {
    name: "Crypto Payments",
    description: "15+ coins. Deposits land instantly.",
    image: "hero-banner-wallet.306b8026.jpg",
    target: "Crypto Payments",
  },
  {
    name: "New Games",
    description: "Latest slots, live casino and instant-win games.",
    image: "hero-banner-newgames.1df48699.jpg",
    target: "New Games",
  },
  {
    name: "Aviator",
    description: "Take your next adventure to new heights.",
    image: "hero-banner-aviator.1b5c4827.jpg",
    target: "Crash & Instant",
  },
];
export const providers = [
  "evolution.bca5ffc3.png",
  "hacksaw.6e258e64.png",
  "pgsoft.2293b900.png",
  "evoplay.03f0bb5d.png",
  "ezugi.520fd372.png",
  "betgamestv.7dc3c7d7.png",
  "nolimit.98fa5f7f.png",
  "slotmill.8ea56e8a.png",
];
