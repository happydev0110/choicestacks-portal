"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  gamingRequest,
  type ProviderCatalogData,
  type ProviderGame,
  type ProviderLobbyData,
} from "../lib/gaming";
import { ProviderGameCard, ProviderGameGrid } from "./provider-cards";
import {
  CatalogAvailability,
  collectionIsEmpty,
  usePendingCatalogRefresh,
} from "./catalog-availability";
import "./provider-games.css";
import "./casino.css";

const categories = [
  { category: "slots", title: "Slots", icon: "slots.b6762e18.png" },
  { category: "live", title: "Live Casino", icon: "live-casino.b9d52e4b.png" },
  {
    category: "crash-instant",
    title: "Crash & Instant",
    icon: "dice.bdc6efaf.png",
  },
  {
    category: "table-cards",
    title: "Table & Cards",
    icon: "blackjack.5ed1c9b4.png",
  },
  {
    category: "lotto-scratch",
    title: "Lotto & Scratch",
    icon: "scratch-cards.d8bb04ad.png",
  },
];
const rows = [
  { category: "featured", title: "Featured Games", icon: "" },
  ...categories,
  { category: "new-games", title: "New Games", icon: "" },
  { category: "roulette", title: "Roulette", icon: "" },
  { category: "poker", title: "Poker", icon: "" },
];

function CasinoRow({
  title,
  category,
  icon,
  total,
  games,
  pending = false,
  unavailable = false,
}: {
  title: string;
  category: string;
  icon?: string;
  total: number;
  games: ProviderGame[];
  pending?: boolean;
  unavailable?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  function updateScroll() {
    const node = track.current;
    if (node)
      setCanScroll({
        left: node.scrollLeft > 1,
        right: node.scrollLeft + node.clientWidth < node.scrollWidth - 2,
      });
  }
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    updateScroll();
    const observer = new ResizeObserver(updateScroll);
    observer.observe(node);
    return () => observer.disconnect();
  }, [games, pending]);
  function scroll(direction: number) {
    const node = track.current;
    node?.scrollBy({
      left: direction * node.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      className="casino-game-section"
      aria-labelledby={`casino-${category}-heading`}
    >
      <div className="casino-row-heading">
        <h2 id={`casino-${category}-heading`}>
          {icon ? (
            <img src={`/assets/${icon}`} alt="" />
          ) : (
            <Gamepad2 size={23} />
          )}
          {title}
        </h2>
        <div className="casino-row-actions">
          {total > 0 && (
            <Link href={`/${category}`} aria-label={category === "all-games" ? "View all games" : `View all ${title}`}>
              View all <span className="casino-row-count">({total})</span>
            </Link>
          )}
          <button
            aria-label={`Previous ${title}`}
            disabled={!canScroll.left || pending}
            onClick={() => scroll(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            aria-label={`Next ${title}`}
            disabled={!canScroll.right || pending}
            onClick={() => scroll(1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {pending || games.length ? (
        <div
          className="casino-provider-track"
          ref={track}
          onScroll={updateScroll}
          aria-busy={pending}
        >
          {pending
            ? Array.from({ length: 12 }, (_, index) => (
                <div
                  className="casino-card-skeleton"
                  key={index}
                  aria-hidden="true"
                />
              ))
            : games.map((game) => (
                <ProviderGameCard key={game.uuid} game={game} />
              ))}
        </div>
      ) : (
        <p className="casino-category-empty">
          {unavailable ? "This collection is temporarily unavailable." : "No games available in this category yet."}{" "}
          <Link href="/all-games">Browse all games</Link>
        </p>
      )}
    </section>
  );
}

export function CasinoLobby({
  initialData = null,
  initialError = "",
  pending = false,
}: {
  initialData?: ProviderLobbyData | null;
  initialError?: string;
  pending?: boolean;
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(!initialData && !initialError);
  const [retry, setRetry] = useState(0);
  const [filters, setFilters] = useState({ search: "", provider: "", page: 1 });
  const [results, setResults] = useState<ProviderCatalogData | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchRetry, setSearchRetry] = useState(0);
  const searching = !!(filters.search.trim() || filters.provider);
  usePendingCatalogRefresh(data, error, setRetry);
  useEffect(() => {
    if (pending || (!retry && (initialData || initialError))) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    gamingRequest<ProviderLobbyData>("lobby", undefined, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "The game collection is temporarily unavailable. Please try again.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [initialData, initialError, pending, retry]);
  useEffect(() => {
    if (!searching) {
      setSearchLoading(false);
      setSearchError("");
      return;
    }
    const controller = new AbortController();
    setSearchLoading(true);
    setSearchError("");
    const timer = setTimeout(() => {
      const query = new URLSearchParams({
        search: filters.search.trim(),
        provider: filters.provider,
        page: String(filters.page),
      });
      gamingRequest<ProviderCatalogData>(
        `games?${query}`,
        undefined,
        controller.signal,
      )
        .then((value) => {
          if (!controller.signal.aborted) setResults(value);
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setSearchError(
              "Unable to search games right now. Please try again.",
            );
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearchLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searching, filters, searchRetry]);
  const busy = pending || (loading && !data);
  return (
    <div className="casino-lobby">
      <h1 className="sr-only">Online Casino</h1>
      <div className="casino-banner">
        <img
          src="/assets/casino-banner.a71990e3.webp"
          alt=""
          fetchPriority="high"
        />
      </div>
      <div className="casino-filter-bar">
        <label className="casino-search">
          <Search size={18} />
          <input
            aria-label="Search casino games"
            placeholder="Search games"
            maxLength={100}
            value={filters.search}
            disabled={pending}
            onChange={(event) =>
              setFilters({ ...filters, search: event.target.value, page: 1 })
            }
          />
          {filters.search && (
            <button
              aria-label="Clear casino search"
              onClick={() => setFilters({ ...filters, search: "", page: 1 })}
            >
              <X size={18} />
            </button>
          )}
        </label>
        <select
          className="casino-provider-filter"
          aria-label="Filter casino provider"
          value={filters.provider}
          disabled={pending}
          onChange={(event) =>
            setFilters({ ...filters, provider: event.target.value, page: 1 })
          }
        >
          <option value="">All providers</option>
          {data?.providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </div>
      <nav className="casino-category-nav" aria-label="Casino categories">
        {categories.map(({ category, title, icon }) => (
          <Link key={category} href={`/${category}`}>
            <img src={`/assets/${icon}`} alt="" />
            {title}
          </Link>
        ))}
      </nav>
      <div className="casino-collection-info">
        <span>
          <ShieldCheck size={15} />
          Sandbox · Test credits only
          {data?.total ? ` · ${data.total} games` : ""}
        </span>
        <Link href="/all-games">All games</Link>
        <Link href="/providers">Providers</Link>
      </div>
      {searching ? (
        <section
          className="casino-search-results"
          aria-label="Casino search results"
          aria-busy={searchLoading}
        >
          <div className="casino-row-heading">
            <h2>Search results</h2>
            <button
              className="secondary"
              onClick={() => setFilters({ search: "", provider: "", page: 1 })}
            >
              Clear filters
            </button>
          </div>
          {searchError ? (
            <div className="casino-category-empty" role="alert">
              <p>{searchError}</p>
              <button
                className="secondary"
                onClick={() => setSearchRetry((value) => value + 1)}
              >
                Try again
              </button>
            </div>
          ) : searchLoading || !results ? (
            <div className="casino-results-skeleton" role="status">
              <span className="sr-only">Searching games</span>
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  className="casino-card-skeleton"
                  key={index}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : !results.games.length ? (
            <p className="casino-category-empty" role="status">
              No matching games. Try another search or provider.
            </p>
          ) : (
            <>
              <p className="result-summary" role="status">
                {results.total} matching games
              </p>
              <ProviderGameGrid games={results.games} />
              <nav
                className="provider-pagination"
                aria-label="Search result pages"
              >
                <button
                  className="secondary"
                  disabled={results.page === 1}
                  onClick={() =>
                    setFilters({ ...filters, page: results.page - 1 })
                  }
                >
                  Previous
                </button>
                <span>
                  Page {results.page} of{" "}
                  {Math.ceil(results.total / results.perPage)}
                </span>
                <button
                  className="secondary"
                  disabled={results.page * results.perPage >= results.total}
                  onClick={() =>
                    setFilters({ ...filters, page: results.page + 1 })
                  }
                >
                  Next
                </button>
              </nav>
            </>
          )}
        </section>
      ) : (
        <>
          {error && (
            <div className="casino-category-empty" role="alert">
              <p>{error}</p>
              <button
                className="secondary"
                onClick={() => setRetry((value) => value + 1)}
              >
                Refresh collection
              </button>
            </div>
          )}
          {!busy && !error && data && collectionIsEmpty(data) && (
            <CatalogAvailability
              data={data}
              onRetry={() => setRetry((value) => value + 1)}
            />
          )}
          {data?.catalog?.status === "stale" && (
            <p className="provider-availability">
              Showing the last available collection while updates are
              temporarily unavailable.
            </p>
          )}
          <CasinoRow
            title="All Games"
            category="all-games"
            total={data?.total ?? 0}
            games={data?.games ?? []}
            pending={busy}
            unavailable={!!error && !data}
          />
          {rows.map((row) => {
            const section = data?.sections.find(
              (item) => item.category === row.category,
            );
            if (
              ["featured", "new-games"].includes(row.category) &&
              !section?.total
            )
              return null;
            return (
              <CasinoRow
                key={row.category}
                {...row}
                total={section?.total ?? 0}
                games={section?.games ?? []}
                pending={busy}
                unavailable={!!error && !data}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
