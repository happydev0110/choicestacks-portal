"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Search, SlidersHorizontal, Play } from "lucide-react";
import { asset } from "../data";
import { allGames as games, casinoCollections } from "../casino-data";
import { categoryLinks, providerList, type PageDefinition } from "../site-map";
import { HeroCarousel } from "../components/hero-carousel";
import { useSite } from "../components/site-shell";
import { ProviderGamesLink } from './provider-games';
import {
  EmptyState,
  GameGrid,
  Notice,
  PageHeading,
  useFavorites,
} from "./shared";

export function CatalogScreen({
  definition,
  pageKey,
}: {
  definition: PageDefinition;
  pageKey: string;
}) {
  const { navigate } = useSite();
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("all");
  const [sort, setSort] = useState("featured");
  const [limit, setLimit] = useState(14);
  const categoryMatches = (category: string) =>
    !definition.category ||
    category === definition.category ||
    (definition.category === "Table & Cards" &&
      ["Poker", "Roulette", "Live Casino"].includes(category));
  const base = games.filter(
    (g) =>
      (categoryMatches(g.category) ||
        casinoCollections.some(
          (collection) =>
            collection.href === `/${pageKey}` &&
            collection.items.some((item) => item.name === g.name),
        )) &&
      (!definition.provider || g.provider === definition.provider),
  );
  const results = base.filter(
    (g) =>
      (provider === "all" || g.provider === provider) &&
      `${g.name} ${g.provider}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  if (sort === "az") results.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "za") results.sort((a, b) => b.name.localeCompare(a.name));
  else if (pageKey === "new-games") results.reverse();
  return (
    <div className="page-wrap catalog-page">
      <HeroCarousel onChoose={navigate} />
      <PageHeading
        title={definition.title}
        description={
          definition.provider
            ? `Explore the ${definition.provider} collection.`
            : "Find your next favorite. Browse the demo collection by game or provider."
        }
      />
      <nav className="pill-nav" aria-label="Game categories">
        {categoryLinks.map(([name, path]) => (
          <Link
            href={path}
            className={path === `/${pageKey}` ? "active" : ""}
            key={path}
          >
            {name}
          </Link>
        ))}
        <Link href="/providers">Providers</Link>
      </nav>
      <div className="catalog-toolbar">
        <label className="field-search">
          <Search size={18} />
          <input
            aria-label="Search games"
            autoFocus={pageKey === "search"}
            placeholder="Search games or providers"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(14);
            }}
          />
        </label>
        {!definition.provider && (
          <select
            aria-label="Filter provider"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setLimit(14);
            }}
          >
            <option value="all">All providers</option>
            {[...new Set(base.map((g) => g.provider))].sort().map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        )}
        <select
          aria-label="Sort games"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="featured">
            {pageKey === "new-games" ? "Newest in demo" : "Featured"}
          </option>
          <option value="az">Name: A–Z</option>
          <option value="za">Name: Z–A</option>
        </select>
      </div>
      <div className="result-summary">
        <span>
          <SlidersHorizontal size={15} /> {results.length}{" "}
          {results.length === 1 ? "game" : "games"} in this demo collection
        </span>
        {(query || provider !== "all") && (
          <button
            onClick={() => {
              setQuery("");
              setProvider("all");
            }}
          >
            Clear filters
          </button>
        )}
      </div>
      {results.length ? (
        <>
          <GameGrid items={results.slice(0, limit)} />
          {results.length > limit && (
            <div className="load-more">
              <p>
                Showing {Math.min(limit, results.length)} of {results.length}{" "}
                games
              </p>
              <button
                className="secondary"
                onClick={() => setLimit((value) => value + 14)}
              >
                Load more games
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={base.length ? "No matching games" : "Collection coming soon"}
        >
          {base.length
            ? "Try another search or clear the provider filter."
            : `No ${definition.provider ?? definition.title} titles have been added to this local catalog yet.`}
        </EmptyState>
      )}
    </div>
  );
}
export function ProvidersScreen() {
  const [query, setQuery] = useState("");
  const providers = providerList.filter(([, name]) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page-wrap">
      <PageHeading
        title="Game Providers"
        description="Discover the studios behind your favorite games."
      />
      <label className="field-search">
        <Search size={18} />
        <input
          aria-label="Search providers"
          placeholder="Search providers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="provider-grid">
        {providers.map(([slug, name, image]) => (
          <Link className="provider-tile" href={`/${slug}`} key={slug}>
            {image ? (
              <img src={asset(image)} alt="" />
            ) : (
              <span className="provider-wordmark">{name}</span>
            )}
            <strong>{name}</strong>
            <small>
              {games.filter((g) => g.provider === name).length} demo games →
            </small>
          </Link>
        ))}
      </div>
      {!providers.length && (
        <EmptyState title="No providers found">
          Try a different name.
        </EmptyState>
      )}
    </div>
  );
}
export function GameScreen({ definition }: { definition: PageDefinition }) {
  const game = games.find((g) => g.name === definition.title)!;
  const [preview, setPreview] = useState(false);
  const { favorites, toggle } = useFavorites();
  return (
    <div className="page-wrap">
      <PageHeading
        title={game.name}
        description={`${game.provider} · ${game.category}`}
      />
      <ProviderGamesLink />
      <div className={`game-stage ${preview ? "preview-open" : ""}`}>
        {preview ? (
          <div className="game-placeholder">
            <Play size={56} />
            <h2>{game.name}</h2>
            <p>The game preview area is ready for a provider integration.</p>
            <Notice>
              No game session is running. This frontend does not accept wagers.
            </Notice>
            <button className="secondary" onClick={() => setPreview(false)}>
              Back to game details
            </button>
          </div>
        ) : (
          <>
            <img
              className="game-cover"
              src={asset(game.image)}
              alt={game.name}
            />
            <div>
              <span className="eyebrow">GAME PREVIEW</span>
              <h2>{game.name}</h2>
              <p>Explore this title from {game.provider}.</p>
              <button className="primary" onClick={() => setPreview(true)}>
                <Play size={18} /> Open preview
              </button>
              <button
                className={`secondary favorite-action ${favorites.includes(game.name) ? "active" : ""}`}
                aria-pressed={favorites.includes(game.name)}
                onClick={() => toggle(game.name)}
              >
                <Heart
                  size={17}
                  fill={favorites.includes(game.name) ? "currentColor" : "none"}
                />
                {favorites.includes(game.name)
                  ? "Saved to favorites"
                  : "Add to favorites"}
              </button>
              <small>Visual demo · Provider connection required</small>
            </div>
          </>
        )}
      </div>
      <div className="section-heading">
        <h2>More from the collection</h2>
        <Link href="/casino" className="text-link">
          View all
        </Link>
      </div>
      <GameGrid
        items={games
          .filter(
            (g) =>
              g.name !== game.name &&
              (g.provider === game.provider || g.category === game.category),
          )
          .slice(0, 7)}
      />
    </div>
  );
}
