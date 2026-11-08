"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { asset, type Game } from "../data";
import { gameHref } from "../site-map";
import styles from "./wins-table.module.css";

const tabs = ["Recent Wins", "Biggest Wins"] as const;

export type WinEntry = {
  game: Game;
  player: string;
  time: string;
  bet: number;
  multiplier: number;
  payout: number;
};

const money = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function WinsTable({ entries }: { entries: WinEntry[] }) {
  const [active, setActive] = useState(0);
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const rows = (
    active === 1
      ? [...entries].sort(
          (a, b) => b.multiplier - a.multiplier || b.payout - a.payout,
        )
      : entries
  ).slice(0, 12);

  return (
    <section
      className={styles.section}
      id="wins-section"
      aria-label="Recent and biggest wins"
    >
      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Wins activity"
          >
            {tabs.map((label, index) => (
              <button
                key={label}
                ref={(button) => {
                  tabButtons.current[index] = button;
                }}
                type="button"
                role="tab"
                id={`wins-tab-${index}`}
                aria-selected={active === index}
                aria-controls="wins-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 1
                        : ["ArrowLeft", "ArrowRight"].includes(event.key)
                          ? 1 - index
                          : null;
                  if (next === null) return;
                  event.preventDefault();
                  setActive(next);
                  tabButtons.current[next]?.focus();
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <span className={styles.sample}>Sample activity</span>
        </div>
        <div
          role="tabpanel"
          id="wins-panel"
          aria-labelledby={`wins-tab-${active}`}
          tabIndex={0}
        >
          <table className={styles.table}>
            <caption className="sr-only">
              {tabs[active]} — demo game activity.{" "}
              {active === 1
                ? "Sorted by highest multiplier."
                : "Most recent first."}
            </caption>
            <thead>
              <tr>
                <th scope="col">Game</th>
                <th scope="col">Player</th>
                <th scope="col" className={styles.desktopColumn}>
                  Time
                </th>
                <th scope="col" className={styles.desktopColumn}>
                  Bet Amount
                </th>
                <th scope="col">Multiplier</th>
                <th scope="col">Payout</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((entry) => (
                <tr key={entry.game.name}>
                  <td>
                    <Link
                      className={styles.game}
                      href={gameHref(entry.game.name)}
                      aria-label={entry.game.name}
                      title={entry.game.name}
                    >
                      <img
                        src={asset(entry.game.image)}
                        alt=""
                        width={24}
                        height={27}
                        loading="lazy"
                      />
                      <span>{entry.game.name}</span>
                    </Link>
                  </td>
                  <td>
                    <div className={styles.player}>
                      <picture>
                        <source
                          media="(max-width: 1023px)"
                          srcSet={asset("user1.6696151a.png")}
                        />
                        <img
                          src={asset("user-rank-badge.91867297.png")}
                          alt=""
                          width={24}
                          height={23}
                          loading="lazy"
                        />
                      </picture>
                      <span title={entry.player}>{entry.player}</span>
                    </div>
                  </td>
                  <td className={styles.desktopColumn}>{entry.time}</td>
                  <td className={styles.desktopColumn}>${money(entry.bet)}</td>
                  <td>{entry.multiplier.toFixed(2)}x</td>
                  <td className={styles.payout}>+${money(entry.payout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
