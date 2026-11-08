import type { SVGProps } from "react";
import paths from "./sportsbook-icon-paths.json";
import type { SportId } from "./sportsbook-data";

// Local vector shapes from the public reference navigation.
export function BookIcon({
  name,
  size = 24,
}: {
  name: keyof typeof paths;
  size?: number;
}) {
  const icon = paths[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
    >
      {icon.paths.map((path, index) => (
        <path key={index} {...(path as SVGProps<SVGPathElement>)} />
      ))}
    </svg>
  );
}

const sportIcons: Record<SportId, keyof typeof paths> = {
  football: "sport-soccer",
  "e-soccer": "sport-fifa-b",
  basketball: "sport-basketball",
  tennis: "sport-tennis",
  "american-football": "sport-americanfootball",
  "ice-hockey": "sport-icehockey",
  "e-sports": "sport-counterstrike",
  "dota-2": "sport-dota2",
  chess: "sport-chess",
  "formula-1": "sport-formula-1",
  "horse-racing": "sport-ehorseracing",
  volleyball: "sport-volleyball",
  "league-of-legends": "sport-leagueoflegends",
  "e-soccer-volta": "sport-fifa-volta",
  "e-soccer-penalty": "sport-fifa-penalty-b",
  handball: "sport-handball",
  "table-tennis": "sport-tabletennis",
  "e-fighting": "sport-e-fighting-b",
  "e-tennis": "sport-aotennis-b",
  "e-basketball": "sport-nba2k-b",
  baseball: "sport-baseball",
  boxing: "sport-boxing",
  padel: "sport-padel-tennis",
  "rugby-league": "sport-rugbyleague",
  "e-cricket": "sport-ecricket-b",
  mma: "sport-mma",
  badminton: "sport-badminton",
  "king-of-glory": "sport-king-of-glory",
  cricket: "sport-cricket",
  sumo: "sport-sumo",
  fifa: "sport-fifa-cyber",
  kabaddi: "sport-kabbadi",
  "nba-2k": "sport-nba2k",
  "x-battle-bats": "sport-x-battle-bats",
  "e-vaquejada": "sport-vaquejada-eletronico",
};

export function SportIcon({
  sport,
  size = 22,
}: {
  sport: SportId;
  size?: number;
}) {
  return <BookIcon name={sportIcons[sport]} size={size} />;
}
