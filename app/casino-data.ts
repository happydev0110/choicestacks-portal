import { games, type Game } from "./data";

// Local artwork and ordering sampled from the public casino lobby.
export const casinoCategories = [
  {
    name: "Slots",
    href: "/slots",
    image: "cat3d-slots.cd4b952b.png",
  },
  {
    name: "Live Casino",
    href: "/live",
    image: "cat3d-live.acad90ea.png",
  },
  {
    name: "Crash & Instant",
    href: "/crash-instant",
    image: "cat3d-crash.cd02f732.png",
  },
  {
    name: "Table & Cards",
    href: "/table-cards",
    image: "cat3d-blackjack.b4cf0fdd.png",
  },
  {
    name: "Lotto & Scratch",
    href: "/lotto-scratch",
    image: "cat3d-roulette.329aa2e7.png",
  },
];
const collections = [
  {
    title: "Popular Games",
    href: "",
    icon: "favourite.6e968e7f.svg",
    category: "Slots",
    items: [
      {
        name: "French Roulette",
        image: "fb728c709add.png",
      },
      {
        name: "Aviator",
        image: "9cb57d01405c.png",
      },
      {
        name: "3 Charge Bison",
        image: "59c11a148169.jpg",
      },
      {
        name: "Mines",
        image: "3cec1767b391.png",
      },
      {
        name: "Luxury Life",
        image: "388492e90cff.png",
      },
      {
        name: "Age Of Seth 94",
        image: "f47893015922.png",
      },
      {
        name: "Butterfly Blossom",
        image: "445419745e6a.png",
      },
      {
        name: "American Roulette",
        image: "ba2fe9ed6913.png",
      },
      {
        name: "Andar Bahar",
        image: "d6ec95abdd4b.jpg",
      },
      {
        name: "Mega Fishing",
        image: "47abbb9a33ff.jpg",
      },
      {
        name: "Bad Rhinos",
        image: "9c4db10d121f.jpg",
      },
      {
        name: "Age of Dragons Mini-Max",
        image: "ec4ef5f0ee04.png",
      },
      {
        name: "Wild Heart",
        image: "aa2fb016b290.png",
      },
      {
        name: "Fortune Tiger",
        image: "62d453b3da8f.png",
      },
      {
        name: "Alchemy Gold",
        image: "eb3980c4b14f.png",
      },
    ],
  },
  {
    title: "Slots",
    href: "/slots",
    icon: "slots.00faba34.svg",
    category: "Slots",
    items: [
      {
        name: "Age Of Seth 94",
        image: "f47893015922.png",
      },
      {
        name: "Adventures",
        image: "23e736a5bcfb.png",
      },
      {
        name: "Age of Dragons Mini-Max",
        image: "ec4ef5f0ee04.png",
      },
      {
        name: "Agent Ace",
        image: "322a735d1e89.jpg",
      },
      {
        name: "Luxury Life",
        image: "388492e90cff.png",
      },
      {
        name: "American Sevens",
        image: "8675de1d6c5f.png",
      },
      {
        name: "Alchemy Gold",
        image: "eb3980c4b14f.png",
      },
      {
        name: "All Ways Egypt",
        image: "c2e2384901e5.jpg",
      },
      {
        name: "Always Hot",
        image: "72ec6177fe77.png",
      },
      {
        name: "Amazons' Battle",
        image: "5b796ada4c7f.jpg",
      },
      {
        name: "Alice: Time Rift",
        image: "a46f65c149aa.jpg",
      },
      {
        name: "AFK Airport Security",
        image: "0a83bc799347.jpg",
      },
      {
        name: "Arizona Heist: Hold and Win",
        image: "5905ce6d81e1.png",
      },
      {
        name: "Angels and Demons",
        image: "11f07c55b2de.png",
      },
      {
        name: "Arcane Woods",
        image: "95c916433534.jpg",
      },
      {
        name: "Abrakadabra",
        image: "16eae2ecc02d.png",
      },
      {
        name: "Brew Brothers: Xmas Brew",
        image: "7b32efda9743.png",
      },
      {
        name: "Age Of Seth",
        image: "8ffd13f432f2.png",
      },
      {
        name: "Banana Farm",
        image: "37605d2c5b9b.png",
      },
      {
        name: "A Dozen Jackpots",
        image: "6acad1cba4a1.jpg",
      },
    ],
  },
  {
    title: "Live Casino",
    href: "/live",
    icon: "liveCasino.c22186c9.svg",
    category: "Live Casino",
    items: [
      {
        name: "American Football Auto Roulette",
        image: "71935556e70f.png",
      },
      {
        name: "Andar Bahar",
        image: "d6ec95abdd4b.jpg",
      },
      {
        name: "Baccarat",
        image: "2fd44406d900.jpg",
      },
      {
        name: "AutoRoulette 2",
        image: "91c7718fded4.jpg",
      },
      {
        name: "Auto Roulette",
        image: "d30b249ff516.jpg",
      },
      {
        name: "Bet on Poker",
        image: "60d28ffdbe46.jpg",
      },
      {
        name: "AutoRoulette Lounge",
        image: "14a3e07ccb00.jpg",
      },
      {
        name: "Auto Claw Roulette",
        image: "a243191aaff0.png",
      },
      {
        name: "Blackjack 10",
        image: "432579896b17.jpg",
      },
      {
        name: "Dynamite Roulette",
        image: "b53e19534b65.jpg",
      },
      {
        name: "Bet with Streamers",
        image: "8d683bae98ba.png",
      },
      {
        name: "Golden Treasure",
        image: "1b6d345f64e8.jpg",
      },
      {
        name: "Wheel of Fortune",
        image: "64bbf85a5d77.jpg",
      },
      {
        name: "Magic Wheel",
        image: "32070ec1a4d3.png",
      },
      {
        name: "Jungle Wheel",
        image: "a7b77c5b1df3.png",
      },
      {
        name: "Wheel",
        image: "8caa51539824.png",
      },
      {
        name: "Wheel of Destiny",
        image: "1008324a7b50.png",
      },
      {
        name: "Football Duel",
        image: "bcc4aa5c67b1.jpg",
      },
    ],
  },
  {
    title: "Crash & Instant",
    href: "/crash-instant",
    icon: "crash.243a423b.svg",
    category: "Crash & Instant",
    items: [
      {
        name: "AviaFly 2",
        image: "0d310d6bbe00.jpg",
      },
      {
        name: "Adrenaline Rush: Scratch",
        image: "dbe13e3f6e26.png",
      },
      {
        name: "All-star Fishing",
        image: "d8552908f8db.jpg",
      },
      {
        name: "Atlantis",
        image: "8ed8a427f772.png",
      },
      {
        name: "Balloon Mania",
        image: "1d075128c6a2.png",
      },
      {
        name: "Avia Star",
        image: "154a0ef31397.png",
      },
      {
        name: "Aviator",
        image: "9cb57d01405c.png",
      },
      {
        name: "Football Grid",
        image: "1a0a45cb105a.jpg",
      },
      {
        name: "Boxes",
        image: "26f6def28be3.png",
      },
      {
        name: "Aviatrix Second Chance",
        image: "d1798f867efc.webp",
      },
      {
        name: "Fortune Pusher",
        image: "e8f24694f35c.png",
      },
      {
        name: "Balloon Odyssey Crash",
        image: "ffeeb7f5ca88.png",
      },
      {
        name: "Keno Rush",
        image: "1e0c314dffd6.png",
      },
      {
        name: "Land of Ra",
        image: "089f794d3370.jpg",
      },
      {
        name: "Heads Will Roll",
        image: "16e7623af932.png",
      },
      {
        name: "AviaFly",
        image: "d7f307ec7130.png",
      },
      {
        name: "Avia Rush",
        image: "3481cca470b5.png",
      },
      {
        name: "Bombing Fishing",
        image: "02774c09e080.jpg",
      },
      {
        name: "Cash Show",
        image: "9579f2a201e8.png",
      },
      {
        name: "Dice Clash",
        image: "a1a069c0ade7.png",
      },
    ],
  },
  {
    title: "Table & Cards",
    href: "/table-cards",
    icon: "blackjack.6ba96612.svg",
    category: "Table & Cards",
    items: [
      {
        name: "American Football Auto Roulette",
        image: "71935556e70f.png",
      },
      {
        name: "Andar Bahar",
        image: "d6ec95abdd4b.jpg",
      },
      {
        name: "AutoRoulette 2",
        image: "91c7718fded4.jpg",
      },
      {
        name: "American Roulette 3D",
        image: "41a7292029f0.png",
      },
      {
        name: "Baccarat",
        image: "2fd44406d900.jpg",
      },
      {
        name: "Classic Multihand Blackjack",
        image: "79b734c81780.png",
      },
      {
        name: "American Roulette",
        image: "f511cd83e662.jpg",
      },
      {
        name: "Joker Poker",
        image: "a1abce7a4d75.jpg",
      },
      {
        name: "Baccarat Deluxe",
        image: "aea5b77d05e6.png",
      },
      {
        name: "Mini Roulette",
        image: "e39e2fc594d8.png",
      },
      {
        name: "Auto Roulette",
        image: "d30b249ff516.jpg",
      },
      {
        name: "Baccarat No Commission",
        image: "7ba5b22548a8.png",
      },
      {
        name: "AutoRoulette Lounge",
        image: "14a3e07ccb00.jpg",
      },
      {
        name: "Baccarat 777",
        image: "fb4c13779237.png",
      },
      {
        name: "Bet on Poker",
        image: "60d28ffdbe46.jpg",
      },
    ],
  },
  {
    title: "Lotto & Scratch",
    href: "/lotto-scratch",
    icon: "lottery.db50aa65.svg",
    category: "Lottery",
    items: [
      {
        name: "Balloons",
        image: "fdd24b6ce1f1.png",
      },
      {
        name: "Bingo Adventure",
        image: "10c4ff081b17.jpg",
      },
      {
        name: "Bingo Star",
        image: "5c4b946f7d05.png",
      },
      {
        name: "Adrenaline Rush: Scratch",
        image: "dbe13e3f6e26.png",
      },
      {
        name: "Coin Blox Scratchcard",
        image: "5aed1f399381.png",
      },
      {
        name: "Dice Duel",
        image: "a522c8ae8899.jpg",
      },
      {
        name: "EZ Bingo 90 Brasileira",
        image: "aa16075109c0.png",
      },
      {
        name: "Jogo Do Bicho Simple",
        image: "6737c3634d8c.png",
      },
      {
        name: "Sweet Keno",
        image: "df4b795390a5.jpg",
      },
      {
        name: "Keno Rush",
        image: "1e0c314dffd6.png",
      },
      {
        name: "Break the Ice",
        image: "54c499ee3d57.png",
      },
      {
        name: "Bingo Carnaval",
        image: "64827c65dc9f.jpg",
      },
      {
        name: "Hot Gear",
        image: "887697489442.png",
      },
      {
        name: "Book Of Keno",
        image: "2a9a6b57e82e.png",
      },
      {
        name: "Ghost Father Scratchcard",
        image: "ae849a98c864.png",
      },
      {
        name: "Lucky 5",
        image: "1250b4175149.jpg",
      },
      {
        name: "EZ Speed Bingo 90",
        image: "6e1b2a97a5c6.png",
      },
      {
        name: "Jogo Do Bicho",
        image: "396107d4a8c1.png",
      },
      {
        name: "Cash Pool",
        image: "7d7b75a803c7.png",
      },
      {
        name: "Bingo Empire",
        image: "afbd4c1548d3.jpg",
      },
    ],
  },
];

const knownGames = new Map(games.map((game) => [game.name, game]));
export const casinoCollections = collections.map((collection) => ({
  ...collection,
  items: collection.items.map(
    (item) =>
      knownGames.get(item.name) ?? {
        ...item,
        category: collection.category,
        provider: "Demo collection",
      },
  ),
}));
export const allGames: Game[] = [
  ...new Map(
    [
      ...games,
      ...casinoCollections.flatMap((collection) => collection.items),
    ].map((game) => [game.name, game]),
  ).values(),
];
