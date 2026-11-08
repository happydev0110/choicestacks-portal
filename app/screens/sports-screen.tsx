"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Radio,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  ReceiptText,
  Settings,
  Trash2,
  Zap,
  Shield,
  CalendarDays,
} from "lucide-react";
import {
  FIXTURES,
  SPORTS,
  NAV_SPORTS,
  LIVE_SPORTS,
  SOCCER_LEAGUES,
  OUTRIGHTS,
  formatOdds,
  sportFromQuery,
  type Fixture,
  type Market,
  type OddsFormat,
  type SportId,
} from "./sportsbook-data";
import { BookIcon, SportIcon } from "./sportsbook-icons";
import {
  FilterDropdown,
  ScrollFilters,
  SportsMenu,
} from "./sportsbook-navigation";
import styles from "./sportsbook.module.css";

type Pick = {
  eventId: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
};
type SlipPreview = {
  id: number;
  picks: Pick[];
  stake: number;
  total: number;
  potential: number;
};
type View = "events" | "favorites" | "history";
type Mode = "Live" | "Upcoming" | "Outrights";

export function SportsScreen() {
  return (
    <Suspense
      fallback={<SportsPreview initialSport="football" initialMode="Live" />}
    >
      <SelectedSport />
    </Suspense>
  );
}

function SelectedSport() {
  const searchParams = useSearchParams();
  const initialSport = sportFromQuery(
    searchParams.get("sport"),
    searchParams.get("bt-path"),
  );
  const initialMode =
    searchParams.get("view") === "upcoming"
      ? "Upcoming"
      : searchParams.get("view") === "outrights"
        ? "Outrights"
        : "Live";
  return (
    <SportsPreview
      initialSport={initialSport}
      initialMode={initialMode}
      initialSection={
        searchParams.get("section") !== "live" &&
        (searchParams.has("sport") ||
          (!!searchParams.get("bt-path") &&
            searchParams.get("bt-path") !== "/live-section"))
      }
      initialLeague={searchParams.get("league") || "All"}
    />
  );
}

function SportsPreview({
  initialSport,
  initialMode,
  initialSection = false,
  initialLeague = "All",
}: {
  initialSport: SportId;
  initialMode: Mode;
  initialSection?: boolean;
  initialLeague?: string;
}) {
  const [sport, setSport] = useState<SportId>(initialSport);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [sportSection, setSportSection] = useState(initialSection);
  const [league, setLeague] = useState(initialLeague);
  const [view, setView] = useState<View>("events");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [hours, setHours] = useState("3");
  const [page, setPage] = useState(0);
  const [format, setFormat] = useState<OddsFormat>("European");
  const [picks, setPicks] = useState<Pick[]>([]);
  const [stake, setStake] = useState("10");
  const [slipOpen, setSlipOpen] = useState(false);
  const [quickBet, setQuickBet] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [history, setHistory] = useState<SlipPreview[]>([]);
  const searchInput = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sportTools = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setSport(initialSport);
    setMode(initialMode);
    setSportSection(initialSection);
    setLeague(initialLeague);
    setPage(0);
  }, [initialSport, initialMode, initialSection, initialLeague]);
  useEffect(() => {
    const track = sportTools.current;
    const active = track?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!track || !active) return;
    if (active.offsetLeft < track.scrollLeft)
      track.scrollLeft = active.offsetLeft;
    else if (
      active.offsetLeft + active.offsetWidth >
      track.scrollLeft + track.clientWidth
    )
      track.scrollLeft =
        active.offsetLeft + active.offsetWidth - track.clientWidth;
  }, [sport, sportSection]);
  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  const leagues =
    sport === "football"
      ? SOCCER_LEAGUES
      : [
          ...new Set(
            FIXTURES.filter((f) => f.sport === sport).map((f) => f.league),
          ),
        ].map((name) => ({ name, country: "International", flag: "world" }));
  const filtered = (mode === "Outrights" ? OUTRIGHTS : FIXTURES).filter(
    (f) =>
      (view === "favorites" ? favorites.includes(f.id) : f.sport === sport) &&
      (mode === "Outrights" || f.live === (mode === "Live")) &&
      (!sportSection || league === "All" || f.league === league) &&
      (sportSection ||
        mode !== "Upcoming" ||
        hours === "all" ||
        f.startsIn <= Number(hours)) &&
      `${f.home} ${f.away} ${f.league} ${f.country}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount - 1);
  const events = filtered.slice(currentPage * 12, currentPage * 12 + 12);
  const total = picks.reduce((value, pick) => value * pick.odds, 1);
  const validStake =
    Number.isFinite(Number(stake)) &&
    Number(stake) >= 0.01 &&
    Number(stake) <= 10000;
  const potential = validStake ? Number(stake) * total : 0;

  function updateLocation(
    id: SportId,
    nextMode: Mode,
    section: boolean,
    nextLeague = "All",
  ) {
    const params = new URLSearchParams();
    params.set("sport", id);
    params.set("section", section ? "sport" : "live");
    params.set("view", nextMode.toLowerCase());
    if (nextLeague !== "All") params.set("league", nextLeague);
    const next = `?${params.toString()}`;
    if (window.location.search !== next)
      window.history.pushState(null, "", next);
  }
  function chooseSport(id: SportId, section = sportSection) {
    setSport(id);
    setSportSection(section);
    setLeague("All");
    setQuery("");
    setView("events");
    setPage(0);
    setMoreOpen(false);
    updateLocation(id, mode, section);
  }
  function chooseMode(value: Mode) {
    setMode(value);
    setPage(0);
    updateLocation(sport, value, sportSection, league);
  }
  function reset() {
    setSport("football");
    setSportSection(false);
    setMode("Live");
    setLeague("All");
    setView("events");
    setPage(0);
    setMoreOpen(false);
    setQuery("");
    setSearchOpen(false);
    updateLocation("football", "Live", false);
  }
  function select(
    fixture: Fixture,
    market: Market,
    outcome: Market["outcomes"][number],
  ) {
    setConfirmed(false);
    setPicks((current) =>
      current.some(
        (p) =>
          p.eventId === fixture.id &&
          p.market === market.name &&
          p.selection === outcome.selection,
      )
        ? current.filter((p) => p.eventId !== fixture.id)
        : [
            ...current.filter((p) => p.eventId !== fixture.id),
            {
              eventId: fixture.id,
              match: `${fixture.home} vs ${fixture.away}`,
              market: market.name,
              selection: outcome.selection,
              odds: outcome.odds,
            },
          ],
    );
    setSlipOpen(true);
  }
  function toggleMarkets(id: string) {
    setExpanded((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }
  function changePage(value: number) {
    setPage(value);
    content.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function odds(market: Market, fixture: Fixture) {
    return market.outcomes.map((outcome) => {
      const selected = picks.some(
        (p) =>
          p.eventId === fixture.id &&
          p.market === market.name &&
          p.selection === outcome.selection,
      );
      return (
        <button
          key={outcome.label}
          type="button"
          className={`${styles.odd} ${selected ? styles.selectedOdd : ""}`}
          aria-pressed={selected}
          aria-label={`${fixture.home} vs ${fixture.away}: ${outcome.selection} at ${formatOdds(outcome.odds, format)}`}
          onClick={() => select(fixture, market, outcome)}
        >
          <span>{outcome.label}</span>
          <strong>{formatOdds(outcome.odds, format)}</strong>
        </button>
      );
    });
  }

  return (
    <div
      className={styles.page}
      id="sportsbook-page"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (moreOpen) menuButton.current?.focus();
          setMoreOpen(false);
          setSlipOpen(false);
          setSearchOpen(false);
        }
      }}
    >
      <h1 className="sr-only">Sportsbook — live and upcoming demo events</h1>
      <nav className={styles.toolbar} aria-label="Sportsbook navigation">
        <div className={styles.shortcuts}>
          <button aria-label="Sportsbook home" title="Home" onClick={reset}>
            <BookIcon name="ic-home" size={32} />
          </button>
          <button
            aria-label="Live events"
            title="Live events"
            onClick={() => {
              setView("events");
              setSportSection(false);
              setMode("Live");
              setLeague("All");
              setPage(0);
              updateLocation(sport, "Live", false);
            }}
          >
            <BookIcon name="ic-live" size={32} />
          </button>
          <button
            aria-label="Favorite events"
            title="Favorite events"
            aria-pressed={view === "favorites"}
            onClick={() => {
              setView("favorites");
              setPage(0);
            }}
          >
            <BookIcon name="ic-favourite" size={32} />
          </button>
          <button
            aria-label="My bet previews"
            title="My bet previews"
            aria-pressed={view === "history"}
            onClick={() => setView("history")}
          >
            <BookIcon name="ic-navbar-mybets" size={32} />
            {history.length > 0 && (
              <span className={styles.navCount}>{history.length}</span>
            )}
          </button>
        </div>
        <div className={styles.sportTools} ref={sportTools}>
          {NAV_SPORTS.map((item) => (
            <button
              key={item.id}
              aria-label={`Browse ${item.name}`}
              title={item.name}
              aria-pressed={
                sportSection && sport === item.id && view === "events"
              }
              onClick={() => chooseSport(item.id, true)}
            >
              <SportIcon sport={item.id} size={32} />
            </button>
          ))}
        </div>
        <div className={styles.moreWrap}>
          <button
            ref={menuButton}
            aria-label="More sports"
            title="More sports"
            aria-expanded={moreOpen}
            aria-controls="more-sports"
            onClick={() => setMoreOpen((value) => !value)}
          >
            <BookIcon name="ic-rounded-arrow" size={16} />
          </button>
        </div>
        <button
          className={styles.searchToggle}
          aria-label={searchOpen ? "Close event search" : "Search events"}
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((value) => !value);
            if (searchOpen) {
              setQuery("");
              setPage(0);
            }
          }}
        >
          {searchOpen ? <X /> : <BookIcon name="ic-search" size={32} />}
        </button>
        {moreOpen && (
          <SportsMenu
            sport={sport}
            onChoose={(id) => chooseSport(id, true)}
            onClose={() => {
              setMoreOpen(false);
              menuButton.current?.focus();
            }}
          />
        )}
      </nav>
      {moreOpen && (
        <button
          className={styles.menuBackdrop}
          aria-label="Dismiss sports menu"
          onClick={() => {
            setMoreOpen(false);
            menuButton.current?.focus();
          }}
        />
      )}

      <div className={styles.content} ref={content}>
        {searchOpen && (
          <label className={styles.search}>
            <Search size={18} />
            <input
              ref={searchInput}
              aria-label="Search sportsbook events"
              placeholder="Search teams, competitions or countries"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
            {query && (
              <button
                aria-label="Clear event search"
                onClick={() => {
                  setQuery("");
                  setPage(0);
                  searchInput.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
          </label>
        )}
        {view === "history" ? (
          <section className={styles.history} aria-label="My bet previews">
            <h2>My bet previews</h2>
            <p>Saved previews from this session. No bets have been placed.</p>
            {history.length ? (
              history.map((item) => (
                <article key={item.id}>
                  <div>
                    <strong>Preview #{item.id}</strong>
                    <span>
                      {item.picks.length === 1 ? "Single" : "Multiple"} ·{" "}
                      {item.picks.length} selection
                      {item.picks.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <ul>
                    {item.picks.map((p) => (
                      <li key={p.eventId}>
                        {p.selection} <span>{formatOdds(p.odds, format)}</span>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <span>Demo stake ${item.stake.toFixed(2)}</span>
                    <strong>Potential ${item.potential.toFixed(2)}</strong>
                  </div>
                </article>
              ))
            ) : (
              <div className={styles.empty}>
                <ReceiptText size={42} />
                <h3>No previews yet</h3>
                <p>Select event odds, then use Preview slip.</p>
                <button onClick={reset}>Browse live events</button>
              </div>
            )}
          </section>
        ) : (
          <>
            {sportSection && (
              <div className={styles.leagueNavigation}>
                <FilterDropdown
                  label="Select sport"
                  value={sport}
                  options={SPORTS.map((item) => ({
                    value: item.id,
                    label: item.name,
                    count: FIXTURES.filter((f) => f.sport === item.id).length,
                  }))}
                  onChange={(id) => chooseSport(id as SportId, true)}
                >
                  <SportIcon sport={sport} size={18} />
                </FilterDropdown>
                <ScrollFilters label="League filters" selected={league} large>
                  <button
                    aria-pressed={league === "All"}
                    onClick={() => {
                      setLeague("All");
                      setPage(0);
                      updateLocation(sport, mode, true);
                    }}
                  >
                    All
                  </button>
                  {leagues.map((item) => (
                    <button
                      key={item.name}
                      aria-pressed={league === item.name}
                      onClick={() => {
                        setLeague(item.name);
                        setPage(0);
                        updateLocation(sport, mode, true, item.name);
                      }}
                    >
                      <span
                        className={`${styles.flag} ${styles[item.flag]}`}
                        aria-hidden="true"
                      >
                        {item.flag === "world" ? "🌐" : ""}
                      </span>
                      {item.name}
                    </button>
                  ))}
                </ScrollFilters>
              </div>
            )}
            <div
              className={`${styles.modeTabs} ${sportSection ? styles.sportModeTabs : ""}`}
              aria-label="Event schedule"
            >
              <button
                aria-pressed={mode === "Live"}
                onClick={() => chooseMode("Live")}
              >
                <BookIcon name="ic-live-simple" size={18} />
                Live
              </button>
              <button
                aria-pressed={mode === "Upcoming"}
                onClick={() => chooseMode("Upcoming")}
              >
                <BookIcon name="ic-upcoming" size={18} />
                Upcoming
              </button>
              {sportSection && (
                <button
                  aria-pressed={mode === "Outrights"}
                  onClick={() => chooseMode("Outrights")}
                >
                  <CalendarDays size={16} />
                  Outrights
                </button>
              )}
              {view === "favorites" && (
                <span className={styles.favoriteLabel}>
                  <Star size={14} />
                  Favorites
                </span>
              )}
            </div>
            {!sportSection &&
              (mode === "Live" ? (
                <ScrollFilters label="Sports filters" selected={sport}>
                  {LIVE_SPORTS.map((item) => (
                    <button
                      key={item.id}
                      aria-pressed={sport === item.id}
                      onClick={() => chooseSport(item.id)}
                    >
                      <SportIcon sport={item.id} size={22} />
                      {item.name}
                    </button>
                  ))}
                </ScrollFilters>
              ) : (
                <div className={styles.upcomingFilters}>
                  <FilterDropdown
                    label="Upcoming sport"
                    value={sport}
                    options={SPORTS.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onChange={(id) => chooseSport(id as SportId, false)}
                  >
                    <SportIcon sport={sport} size={22} />
                  </FilterDropdown>
                  <FilterDropdown
                    label="Upcoming time range"
                    value={hours}
                    options={["1", "3", "6", "12", "24", "48", "72", "all"].map(
                      (value) => ({
                        value,
                        label: value === "all" ? "All upcoming" : `${value}h`,
                        count: FIXTURES.filter(
                          (f) =>
                            f.sport === sport &&
                            !f.live &&
                            (value === "all" || f.startsIn <= Number(value)),
                        ).length,
                      }),
                    )}
                    onChange={(value) => {
                      setHours(value);
                      setPage(0);
                    }}
                  >
                    <BookIcon name="ic-upcoming" size={18} />
                  </FilterDropdown>
                </div>
              ))}
            {events.length ? (
              <div
                className={styles.eventGrid}
                aria-label={`${mode} ${view === "favorites" ? "favorite" : SPORTS.find((s) => s.id === sport)!.name} events`}
              >
                {events.map((fixture) => (
                  <article className={styles.event} key={fixture.id}>
                    <div className={styles.league}>
                      <span>
                        <SportIcon sport={fixture.sport} size={13} />
                        {fixture.country} · {fixture.league}
                      </span>
                      <button
                        aria-label={`${favorites.includes(fixture.id) ? "Remove" : "Add"} ${fixture.home} vs ${fixture.away} ${favorites.includes(fixture.id) ? "from" : "to"} favorites`}
                        aria-pressed={favorites.includes(fixture.id)}
                        onClick={() =>
                          setFavorites((current) =>
                            current.includes(fixture.id)
                              ? current.filter((id) => id !== fixture.id)
                              : [...current, fixture.id],
                          )
                        }
                      >
                        <Star
                          size={14}
                          fill={
                            favorites.includes(fixture.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                    <button
                      className={styles.match}
                      aria-label={`Show markets for ${fixture.home} vs ${fixture.away}`}
                      aria-expanded={expanded.includes(fixture.id)}
                      onClick={() => toggleMarkets(fixture.id)}
                    >
                      <span
                        className={`${styles.status} ${fixture.live ? styles.liveStatus : ""}`}
                      >
                        {fixture.time}
                        {fixture.live && <Radio size={13} />}
                      </span>
                      {[fixture.home, fixture.away].map((team, index) => (
                        <span className={styles.team} key={team}>
                          <span
                            className={`${styles.crest} ${index ? styles.awayCrest : ""}`}
                          >
                            <Shield size={22} />
                            <small>{team.charAt(0)}</small>
                          </span>
                          <strong>{team}</strong>
                          {fixture.live && (
                            <b className={styles.score}>
                              {fixture.scores[index]}
                            </b>
                          )}
                        </span>
                      ))}
                    </button>
                    <div className={styles.marketTitle}>
                      {fixture.markets[0].name}
                    </div>
                    <div className={styles.odds}>
                      {odds(fixture.markets[0], fixture)}
                      <button
                        className={styles.expandMarkets}
                        aria-label={`${expanded.includes(fixture.id) ? "Hide" : "More"} markets for ${fixture.home} vs ${fixture.away}`}
                        aria-expanded={expanded.includes(fixture.id)}
                        onClick={() => toggleMarkets(fixture.id)}
                      >
                        {expanded.includes(fixture.id) ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    </div>
                    {expanded.includes(fixture.id) && (
                      <div className={styles.extraMarkets}>
                        <div className={styles.marketTitle}>
                          {fixture.markets[1].name}
                        </div>
                        <div className={styles.odds}>
                          {odds(fixture.markets[1], fixture)}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <Search size={38} />
                <h2>
                  {view === "favorites"
                    ? "No favorite events in this view"
                    : "No matching events"}
                </h2>
                <p>
                  {view === "favorites"
                    ? "Use the star on an event to save it here."
                    : "Try a different sport, time range or search."}
                </p>
                <button onClick={reset}>Show live events</button>
              </div>
            )}
            <div className={styles.pagination}>
              <span>
                {filtered.length
                  ? `${currentPage * 12 + 1} – ${Math.min((currentPage + 1) * 12, filtered.length)} of ${filtered.length}`
                  : "0 events"}
              </span>
              <div>
                <button
                  aria-label="Previous events page"
                  disabled={currentPage === 0}
                  onClick={() => changePage(currentPage - 1)}
                >
                  <ChevronLeft size={17} />
                </button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    aria-label={`Events page ${index + 1}`}
                    aria-current={currentPage === index ? "page" : undefined}
                    onClick={() => changePage(index)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  aria-label="Next events page"
                  disabled={currentPage === pageCount - 1}
                  onClick={() => changePage(currentPage + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
        <div className={styles.bottomBar}>
          <label>
            Odds Format{" "}
            <select
              aria-label="Odds format"
              value={format}
              onChange={(event) => setFormat(event.target.value as OddsFormat)}
            >
              {["European", "American", "Fractional"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <Link href="/terms/betting-rules">Betting Rules</Link>
        </div>
        <p className={styles.disclaimer}>
          Demo fixtures, scores and odds for this frontend preview. No live
          feed, real wagers or payments are connected.
        </p>
      </div>

      <aside className={styles.slip} aria-label="Bet slip preview">
        <div className={styles.slipHeader}>
          <button
            className={styles.slipToggle}
            aria-label={slipOpen ? "Collapse bet slip" : "Expand bet slip"}
            aria-expanded={slipOpen}
            aria-controls="sportsbook-slip"
            onClick={() => setSlipOpen((value) => !value)}
          >
            <ReceiptText size={28} />
            <strong>Betslip</strong>
            {picks.length > 0 && (
              <span className={styles.pickCount}>{picks.length}</span>
            )}
            {slipOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button
            className={styles.quickToggle}
            role="switch"
            aria-label="Quick bet preview"
            aria-checked={quickBet}
            onClick={() => {
              setQuickBet((value) => !value);
              setSlipOpen(true);
            }}
          >
            <span>Quick Bet</span>
            <i>
              <Zap size={13} />
            </i>
          </button>
        </div>
        {slipOpen && (
          <div className={styles.slipBody} id="sportsbook-slip">
            {picks.length ? (
              <>
                <div className={styles.slipTools}>
                  <strong>{picks.length > 1 ? "Multiple" : "Single"}</strong>
                  <button
                    aria-label="Clear bet slip"
                    onClick={() => {
                      setPicks([]);
                      setConfirmed(false);
                    }}
                  >
                    <Trash2 size={15} />
                    Clear
                  </button>
                </div>
                {picks.map((pick) => (
                  <div className={styles.pick} key={pick.eventId}>
                    <button
                      aria-label={`Remove ${pick.selection}`}
                      onClick={() => {
                        setPicks((current) =>
                          current.filter((p) => p.eventId !== pick.eventId),
                        );
                        setConfirmed(false);
                      }}
                    >
                      <X size={14} />
                    </button>
                    <div>
                      <strong>{pick.selection}</strong>
                      <b>{formatOdds(pick.odds, format)}</b>
                    </div>
                    <small>{pick.match}</small>
                    <small>{pick.market}</small>
                  </div>
                ))}
                <form
                  className={styles.slipForm}
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!validStake || confirmed) return;
                    setHistory((current) => [
                      ...current,
                      {
                        id: current.length + 1,
                        picks: [...picks],
                        stake: Number(stake),
                        total,
                        potential,
                      },
                    ]);
                    setConfirmed(true);
                  }}
                >
                  <label>
                    Demo stake (USD)
                    <input
                      aria-label="Demo stake (USD)"
                      type="number"
                      min="0.01"
                      max="10000"
                      step="0.01"
                      required
                      value={stake}
                      onChange={(event) => {
                        setStake(event.target.value);
                        setConfirmed(false);
                      }}
                    />
                  </label>
                  {quickBet && (
                    <div className={styles.presets}>
                      {[5, 10, 25, 50].map((amount) => (
                        <button
                          type="button"
                          key={amount}
                          onClick={() => {
                            setStake(String(amount));
                            setConfirmed(false);
                          }}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className={styles.summary}>
                    <span>Total odds</span>
                    <b>{formatOdds(total, format)}</b>
                  </div>
                  <div className={styles.summary}>
                    <span>Potential return</span>
                    <strong>${potential.toFixed(2)}</strong>
                  </div>
                  <button
                    className={styles.previewButton}
                    type="submit"
                    disabled={!validStake || confirmed}
                  >
                    {confirmed ? "Preview saved" : "Preview slip"}
                  </button>
                  {confirmed && (
                    <p className={styles.confirmation} role="status">
                      Preview saved to My bet previews. No bet was placed.
                    </p>
                  )}
                </form>
              </>
            ) : (
              <div className={styles.slipEmpty}>
                <span>
                  <ReceiptText size={34} />
                </span>
                <div>
                  <strong>Place your bets</strong>
                  <p>Your selections will appear in this area</p>
                </div>
              </div>
            )}
            <button
              className={styles.settingsButton}
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((value) => !value)}
            >
              <Settings size={16} />
              Odds Settings
            </button>
            {settingsOpen && (
              <label className={styles.settingsLabel}>
                Display odds as
                <select
                  aria-label="Bet slip odds format"
                  value={format}
                  onChange={(event) =>
                    setFormat(event.target.value as OddsFormat)
                  }
                >
                  {["European", "American", "Fractional"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            )}
            <p className={styles.slipNote}>
              {quickBet ? "Quick Bet preview · " : ""}Demo only · No real wagers
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
