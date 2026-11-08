"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Trophy,
  Flame,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { asset, categories, games, providers, type Game } from "./data";
import { HeroCarousel } from "./components/hero-carousel";
import { BrandLogo } from "./components/brand-logo";
import { SportsbookSection } from "./components/sportsbook-section";
import { WinsTable } from "./components/wins-table";
import { ProviderGamesLink } from './screens/provider-games';
import { useSite } from "./components/site-shell";
import { providerList } from "./site-map";
function GameRow({
  title,
  items,
  onGame,
  ranked = false,
  onAll,
}: {
  title: string;
  items: Game[];
  onGame: (g: Game) => void;
  ranked?: boolean;
  onAll: () => void;
}) {
  const row = useRef<HTMLDivElement>(null);
  return (
    <section className="game-section">
      <div className="section-heading">
        <h2>
          {ranked ? (
            <Trophy />
          ) : title === "Popular Games" ? (
            <Flame />
          ) : (
            <Star />
          )}
          {title}
        </h2>
        <div className="row-actions">
          <button onClick={onAll}>All</button>
          <button
            aria-label={`Previous ${title}`}
            onClick={() =>
              row.current?.scrollBy({ left: -650, behavior: "smooth" })
            }
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label={`Next ${title}`}
            onClick={() =>
              row.current?.scrollBy({ left: 650, behavior: "smooth" })
            }
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={row} className={`game-row ${ranked ? "ranked" : ""}`}>
        {items.map((g, i) => (
          <button
            className="game-card"
            key={g.name}
            onClick={() => onGame(g)}
            aria-label={`Preview ${g.name}`}
          >
            {ranked && <span className="rank">{i + 1}</span>}
            <div className="game-art">
              <img src={asset(g.image)} alt={g.name} loading="lazy" />
              <div className="game-overlay">
                <span>
                  <Play fill="currentColor" size={25} />
                </span>
                <strong>{g.name}</strong>
                <small>{g.provider}</small>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const { navigate: choose, openGame } = useSite();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Games");
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = games.filter(
    (g) =>
      (category === "All Games" || g.category === category) &&
      `${g.name} ${g.provider}`.toLowerCase().includes(query.toLowerCase()),
  );
  const winGames = games.slice(25).concat(games.slice(17, 24));
  const payouts = winGames.map((_, i) =>
    Number((35.99 + ((i * 129.42) % 1789)).toFixed(2)),
  );
  const winEntries = winGames.map((game, i) => ({
    game,
    player: ["Ma***us", "La***en", "Na***ra", "Ta***k5", "He***or", "Ya***in"][
      i % 6
    ],
    time: `04:${String(58 - i * 2).padStart(2, "0")} PM`,
    bet: payouts[i] / (i + 2),
    multiplier: i + 2,
    payout: payouts[i],
  }));

  return (
    <>
      <h1 className="sr-only">
        Win777 — Online Casino & Sportsbook
      </h1>
      <HeroCarousel onChoose={choose} />
      <ProviderGamesLink />
      <section className="wins-strip">
        <h2>
          <span className="live-dot" />
          Latest Wins <span className="sample-label">Demo data</span>
        </h2>
        <div className="mini-wins">
          {winGames.map((g, i) => (
            <button key={g.name} onClick={() => openGame(g)}>
              <img src={asset(g.image)} alt={g.name} />
              <span>
                {
                  [
                    "Ma***us",
                    "La***en",
                    "Na***ra",
                    "Ta***k5",
                    "He***or",
                    "Ya***in",
                  ][i % 6]
                }
              </span>
              <strong>+${payouts[i].toFixed(2)}</strong>
            </button>
          ))}
        </div>
      </section>
      <section className="feature-categories">
        <button onClick={() => choose("Live Casino")}>
          <span className="new-badge">NEW</span>
          <h2>♠ Live Casino</h2>
          <p>
            Blackjack, roulette and baccarat,
            <br /> streamed 24/7.
          </p>
          <img
            src={asset("live-casino-element.d7c46a6f.webp")}
            alt="Casino roulette and cards"
          />
        </button>
        <button onClick={() => choose("Sports")}>
          <span className="new-badge">NEW</span>
          <h2>◉ Sports</h2>
          <p>
            Live and pre-match betting on
            <br /> football, basketball, tennis and
            <br /> more.
          </p>
          <img src={asset("sports-trophy.429af003.webp")} alt="Sports trophy" />
        </button>
      </section>
      <section className="categories" aria-label="Game categories">
        {categories.map((c) => (
          <button
            key={c.name}
            className={category === c.name ? "chosen" : ""}
            aria-pressed={category === c.name}
            onClick={() => choose(c.name)}
          >
            <h2>
              <img src={asset(c.icon)} alt="" />
              {c.name}
            </h2>
            <img className="category-art" src={asset(c.image)} alt="" />
          </button>
        ))}
      </section>
      <div id="catalog" className="search-bar">
        <Search size={17} />
        <input
          ref={searchRef}
          aria-label="Search game catalog"
          placeholder="Search games"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}
        <SlidersHorizontal size={16} />
      </div>
      {query || category !== "All Games" ? (
        <section className="results">
          <div className="section-heading">
            <h2>
              {query ? `Results for “${query}”` : category}
              <small>{filtered.length} games</small>
            </h2>
            <button
              onClick={() => {
                setCategory("All Games");
                setQuery("");
              }}
            >
              Reset filters
            </button>
          </div>
          <div className="results-grid">
            {filtered.map((g) => (
              <button
                className="result-card"
                key={g.name}
                onClick={() => openGame(g)}
              >
                <img src={asset(g.image)} alt="" />
                <strong>{g.name}</strong>
                <span>{g.provider}</span>
              </button>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty">
              <Search size={38} />
              <h3>No games found</h3>
              <p>Try another name or choose a different category.</p>
            </div>
          )}
        </section>
      ) : (
        <>
          <GameRow
            title="Top Games"
            items={games.slice(0, 7)}
            ranked
            onGame={openGame}
            onAll={() => choose("Slots")}
          />
          <GameRow
            title="Popular Games"
            items={[...games.slice(7, 17), ...games.slice(0, 7)]}
            onGame={openGame}
            onAll={() => choose("Slots")}
          />
          <GameRow
            title="Featured Games"
            items={games.slice(17, 25)}
            onGame={openGame}
            onAll={() => choose("Live Casino")}
          />
          <section className="provider-section">
            <h2>Game Providers</h2>
            <div className="providers">
              {providers.map((p) => (
                <Link
                  key={p}
                  href={`/${providerList.find((provider) => provider[2] === p)?.[0] ?? "providers"}`}
                >
                  <img
                    src={asset(p)}
                    alt={
                      providerList.find((provider) => provider[2] === p)?.[1] ??
                      "Provider"
                    }
                  />
                </Link>
              ))}
            </div>
          </section>
          <GameRow
            title="Slots"
            items={games.filter((g) => g.category === "Slots")}
            onGame={openGame}
            onAll={() => choose("Slots")}
          />
          <GameRow
            title="Roulette"
            items={games.filter((g) => g.category === "Roulette")}
            onGame={openGame}
            onAll={() => choose("Roulette")}
          />
        </>
      )}
      <SportsbookSection />
      <section className="welcome-banner">
        <BrandLogo variant="banner" />
        <div>
          <span>EXCLUSIVE WELCOME PACKAGE</span>
          <h2>100% WELCOME BONUS</h2>
          <p>Up to $1,000 over your first 3 deposits</p>
          <small>CRYPTO READY · FAST DEPOSITS</small>
        </div>
        <div>
          <small>CLAIM IN SECONDS</small>
          <button className="primary" onClick={() => choose("Deposit Now")}>
            Deposit Now
          </button>
        </div>
      </section>
      <WinsTable entries={winEntries} />
    </>
  );
}
