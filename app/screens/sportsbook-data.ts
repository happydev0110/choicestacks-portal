export const SPORTS = [
  { id: "football", name: "Soccer" },
  { id: "e-soccer", name: "eSoccer" },
  { id: "basketball", name: "Basketball" },
  { id: "tennis", name: "Tennis" },
  { id: "american-football", name: "American Football" },
  { id: "ice-hockey", name: "Ice Hockey" },
  { id: "e-sports", name: "Counter-Strike" },
  { id: "dota-2", name: "Dota 2" },
  { id: "chess", name: "Chess" },
  { id: "formula-1", name: "Formula 1" },
  { id: "horse-racing", name: "eHorse Racing" },
  { id: "volleyball", name: "Volleyball" },
  { id: "league-of-legends", name: "League of Legends" },
  { id: "e-soccer-volta", name: "eSoccer: Volta" },
  { id: "e-soccer-penalty", name: "eSoccer: Penalty" },
  { id: "handball", name: "Handball" },
  { id: "table-tennis", name: "Table Tennis" },
  { id: "e-fighting", name: "eFighting" },
  { id: "e-tennis", name: "eTennis" },
  { id: "e-basketball", name: "eBasketball" },
  { id: "baseball", name: "Baseball" },
  { id: "boxing", name: "Boxing" },
  { id: "padel", name: "Padel Tennis" },
  { id: "rugby-league", name: "Rugby League" },
  { id: "e-cricket", name: "eCricket" },
  { id: "mma", name: "Mixed Martial Arts" },
  { id: "badminton", name: "Badminton" },
  { id: "king-of-glory", name: "King of Glory" },
  { id: "cricket", name: "Cricket" },
  { id: "sumo", name: "Sumo" },
  { id: "fifa", name: "FC 27" },
  { id: "kabaddi", name: "Kabaddi" },
  { id: "nba-2k", name: "NBA 2K27" },
  { id: "x-battle-bats", name: "eCricket: X-Battle Bats" },
  { id: "e-vaquejada", name: "eVaquejada" },
] as const;

export const NAV_SPORTS = SPORTS.slice(0, 16);
export const LIVE_SPORTS = SPORTS.filter(
  (s) => !["formula-1", "league-of-legends", "handball"].includes(s.id),
);
export const ESPORT_IDS = [
  "e-sports",
  "dota-2",
  "league-of-legends",
  "king-of-glory",
  "fifa",
  "nba-2k",
];
export const SOCCER_LEAGUES = [
  { name: "FA Cup", country: "England", flag: "england" },
  { name: "Serie A", country: "Italy", flag: "italy" },
  { name: "Bundesliga", country: "Germany", flag: "germany" },
  { name: "Brasileiro Serie A", country: "Brazil", flag: "brazil" },
  { name: "LaLiga", country: "Spain", flag: "spain" },
  { name: "MLS", country: "USA", flag: "usa" },
  { name: "Liga Profesional", country: "Argentina", flag: "argentina" },
  {
    name: "AFC Champions League Elite",
    country: "International",
    flag: "world",
  },
];

export type SportId = (typeof SPORTS)[number]["id"];
export type Market = {
  name: string;
  outcomes: { label: string; selection: string; odds: number }[];
};
export type Fixture = {
  id: string;
  sport: SportId;
  country: string;
  league: string;
  home: string;
  away: string;
  live: boolean;
  time: string;
  startsIn: number;
  scores: [string, string];
  markets: Market[];
  outright?: boolean;
};

const soccerTeams = [
  ["London FC", "Manchester City FC"],
  ["Madrid United", "Paris Athletic"],
  ["Seoul City", "Osaka United"],
  ["Almaty Youth", "Budapest Juniors"],
  ["Sleman City", "Ciamis FC"],
  ["Java United", "Bekasi City"],
  ["Depok Athletic", "Kudus FC"],
  ["Karsiyaka Youth", "Aliaga United"],
  ["Falcon FC", "Hantharwady City"],
  ["Nongkrem SC", "Mawpat United"],
  ["Huambo Heroes", "Alto Zambeze"],
  ["Bangkok City", "Chiang Mai FC"],
];
const competitions = [
  ["England", "Premier League"],
  ["International", "Champions Cup"],
  ["International", "Asian Champions Cup"],
  ["International", "Youth Champions League"],
  ["Indonesia", "National Cup"],
  ["Indonesia", "National Cup"],
  ["Indonesia", "National Cup"],
  ["Turkiye", "U19 League"],
  ["Myanmar", "U20 League"],
  ["India", "Champions Cup"],
  ["Angola", "National League"],
  ["Thailand", "League One"],
];
const otherTeams: Partial<Record<SportId, [string, string]>> = {
  tennis: ["A. Martin", "J. Anderson"],
  basketball: ["Los Angeles Stars", "Boston Green"],
  "e-sports": ["Team Nova", "Team Eclipse"],
  "dota-2": ["Phoenix", "Storm"],
  "american-football": ["Denver Mustangs", "Dallas Rangers"],
  "ice-hockey": ["Toronto Ice", "Montreal North"],
  chess: ["A. Petrov", "M. Lee"],
  "horse-racing": ["Silver Comet", "Golden Arrow"],
  volleyball: ["Berlin Volley", "Warsaw Aces"],
  "table-tennis": ["S. Chen", "D. Novak"],
  baseball: ["New York Knights", "Chicago Bears"],
  cricket: ["Mumbai Stars", "Delhi Capitals XI"],
};

function createFixture(sport: SportId, index: number, live: boolean): Fixture {
  const soccer = [
    "football",
    "e-soccer",
    "e-soccer-volta",
    "e-soccer-penalty",
    "fifa",
  ].includes(sport);
  const names = soccer
    ? soccerTeams[index % soccerTeams.length]
    : (otherTeams[sport] ?? ["Team North", "Team South"]);
  const [home, away] = index % 2 && !soccer ? [...names].reverse() : names;
  const [country, league] = soccer
    ? sport === "football"
      ? [
          SOCCER_LEAGUES[index % SOCCER_LEAGUES.length].country,
          SOCCER_LEAGUES[index % SOCCER_LEAGUES.length].name,
        ]
      : competitions[index % competitions.length]
    : [
        "International",
        `${SPORTS.find((s) => s.id === sport)!.name} Championship`,
      ];
  const scores: [string, string] =
    sport === "basketball"
      ? ["74", "69"]
      : sport === "tennis"
        ? ["6  2", "4  3"]
        : [String(index % 3), String((index + 1) % 2)];
  const first = index === 0 ? 1.85 : +(1.3 + (index % 6) * 0.38).toFixed(2);
  const markets: Market[] = [
    {
      name: soccer ? "1x2" : "Match winner",
      outcomes: [
        { label: "1", selection: home, odds: first },
        ...(soccer
          ? [
              {
                label: "draw",
                selection: "Draw",
                odds: +(3.4 + (index % 4) * 0.25).toFixed(2),
              },
            ]
          : []),
        {
          label: "2",
          selection: away,
          odds: soccer ? +(4.1 + (index % 3) * 0.45).toFixed(2) : 2.1,
        },
      ],
    },
    {
      name: soccer ? "Total goals · 2.5" : "Total points",
      outcomes: [
        {
          label: "over",
          selection: soccer ? "Over 2.5 goals" : "Over total points",
          odds: 1.92,
        },
        {
          label: "under",
          selection: soccer ? "Under 2.5 goals" : "Under total points",
          odds: 1.88,
        },
      ],
    },
  ];
  return {
    id: `${sport}-${live ? "live" : "upcoming"}-${index}`,
    sport,
    country,
    league,
    home,
    away,
    live,
    time: live
      ? sport === "tennis"
        ? "Set 2"
        : sport === "basketball"
          ? "Q3 · 04:28"
          : sport === "e-sports" || sport === "dota-2"
            ? "Map 2"
            : index % 4 === 3
              ? "Halftime"
              : `${17 + index * 3}′ ${17 + index * 3 > 45 ? "2nd" : "1st"} half`
      : `Today, ${String(15 + (index % 8)).padStart(2, "0")}:30`,
    startsIn: 1 + (index % 8),
    scores,
    markets,
  };
}

// Fixed local fixtures keep every preview deterministic; no live service is called.
export const FIXTURES: Fixture[] = SPORTS.flatMap(({ id }) => [
  ...Array.from({ length: id === "football" ? 24 : 4 }, (_, i) =>
    createFixture(id, i, true),
  ),
  ...Array.from({ length: id === "football" ? 12 : 4 }, (_, i) =>
    createFixture(id, i, false),
  ),
]);

export type OddsFormat = "European" | "American" | "Fractional";
export const OUTRIGHTS: Fixture[] = SPORTS.flatMap(({ id, name }) => {
  const leagues =
    id === "football"
      ? SOCCER_LEAGUES
      : [{ name: `${name} Championship`, country: "International" }];
  return leagues.map((league, index) => {
    const fixture = createFixture(id, index, false);
    return {
      ...fixture,
      id: `${id}-outright-${index}`,
      country: league.country,
      league: league.name,
      home: `${league.name} — Winner`,
      away: "Tournament outright",
      time: "Season winner",
      outright: true,
      markets: [
        {
          name: "Winner",
          outcomes: [
            { label: fixture.home, selection: fixture.home, odds: 3.5 },
            { label: fixture.away, selection: fixture.away, odds: 4.25 },
          ],
        },
        fixture.markets[1],
      ],
    };
  });
});

export function formatOdds(odds: number, format: OddsFormat) {
  if (format === "American")
    return odds >= 2
      ? `+${Math.round((odds - 1) * 100)}`
      : `${Math.round(-100 / (odds - 1))}`;
  if (format === "Fractional") {
    let numerator = Math.round((odds - 1) * 100),
      denominator = 100;
    let a = numerator,
      b = denominator;
    while (b) [a, b] = [b, a % b];
    numerator /= a;
    denominator /= a;
    return `${numerator}/${denominator}`;
  }
  return odds.toFixed(2).replace(/0$/, "");
}

export function sportFromQuery(
  sport: string | null,
  providerPath: string | null,
): SportId {
  const aliases: Record<string, SportId> = {
    "/soccer-1": "football",
    "/tennis-5": "tennis",
    "/basketball-2": "basketball",
    "/american-football-16": "american-football",
    "/fifa-300": "fifa",
  };
  return (
    SPORTS.find((item) => item.id === sport)?.id ??
    aliases[providerPath ?? ""] ??
    "football"
  );
}
