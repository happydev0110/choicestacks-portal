"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Play,
  Search,
  ShieldCheck,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";
import { usePlayer } from "../components/player-auth";
import {
  createGameRequestId,
  gamingRequest,
  type ProviderCatalogData,
  type ProviderGame,
  type SandboxWalletData,
} from "../lib/gaming";
import { PageHeading } from "./shared";
import "./provider-games.css";

export function ProviderGamesLink() {
  return (
    <div className="provider-entry">
      <span>
        <Gamepad2 size={19} />
        Provider games
      </span>
      <Link href="/provider-games">Explore the collection →</Link>
    </div>
  );
}

export function ConnectedCasino({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<ProviderCatalogData | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void gamingRequest<ProviderCatalogData>(
      "games",
      undefined,
      controller.signal,
    )
      .then(setCatalog)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  if (catalog?.configured) return <ProviderCatalog initial={catalog} />;
  return (
    <>
      <ProviderGamesLink />
      {children}
    </>
  );
}

export function ProviderCatalog({
  initial,
}: {
  initial?: ProviderCatalogData;
}) {
  const [data, setData] = useState<ProviderCatalogData | null>(initial ?? null);
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = setTimeout(
      () => {
        void gamingRequest<ProviderCatalogData>(
          "games?" +
            new URLSearchParams({ search, provider, page: String(page) }),
          undefined,
          controller.signal,
        )
          .then(setData)
          .catch((error) => {
            if (!controller.signal.aborted)
              setError(
                error instanceof Error
                  ? error.message
                  : "Unable to load games.",
              );
          })
          .finally(() => {
            if (!controller.signal.aborted) setLoading(false);
          });
      },
      search ? 250 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, provider, page, retry]);
  return (
    <div className="page-wrap provider-catalog">
      <PageHeading
        title="Provider Games"
        eyebrow="CHOICESTAKES"
        description="Discover your next game, all in one place."
      />
      <div className="provider-mode">
        <ShieldCheck size={18} />
        <span>
          Sandbox play · Test credits only · No deposits or withdrawals
        </span>
      </div>
      {data?.configured && !data.launchEnabled && (
        <p className="provider-availability" role="status">
          Browse the collection now. Sandbox play will be available once setup
          is complete.
        </p>
      )}
      {data?.configured && (
        <div className="catalog-toolbar">
          <label className="field-search">
            <Search size={18} />
            <input
              aria-label="Search provider games"
              placeholder="Search games"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <select
            aria-label="Filter game provider"
            value={provider}
            onChange={(event) => {
              setProvider(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All providers</option>
            {data.providers.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span className="provider-currency">
            {data.currency} test credits
          </span>
        </div>
      )}
      {error ? (
        <div className="panel provider-empty" role="alert">
          <h2>Games temporarily unavailable</h2>
          <p>{error}</p>
          <button
            className="secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="panel provider-empty" role="status">
          <Gamepad2 size={38} />
          <p>Loading games…</p>
        </div>
      ) : !data?.configured ? (
        <div className="panel provider-empty">
          <Gamepad2 size={48} />
          <h2>A new collection is on its way</h2>
          <p>
            Provider games are being prepared. Check back soon to explore the
            collection.
          </p>
          <Link href="/" className="secondary">
            Back to the lobby
          </Link>
        </div>
      ) : !data.games.length ? (
        <div className="panel provider-empty">
          <Search size={38} />
          <h2>
            {search || provider ? "No matching games" : "Games are coming soon"}
          </h2>
          <p>
            {search || provider
              ? "Try another search or provider."
              : "The collection will appear here once it is available."}
          </p>
          {(search || provider) && (
            <button
              className="secondary"
              onClick={() => {
                setSearch("");
                setProvider("");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="result-summary">
            {data.total} games · {data.currency} test credits
          </p>
          <div className="catalog-grid">
            {data.games.map((game) => (
              <Link
                key={game.uuid}
                className="catalog-card"
                href={`/play/${game.uuid}`}
              >
                <div className="catalog-art provider-art">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Gamepad2 size={46} />
                  )}
                  <span className="catalog-play">
                    <Play size={28} />
                  </span>
                </div>
                <strong>{game.name}</strong>
                <small>{game.provider}</small>
              </Link>
            ))}
          </div>
          <div className="provider-pagination">
            <button
              className="secondary"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.max(1, Math.ceil(data.total / data.perPage))}
            </span>
            <button
              className="secondary"
              disabled={page * data.perPage >= data.total}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function SandboxWallet({
  refreshKey = 0,
  compact = false,
}: {
  refreshKey?: number;
  compact?: boolean;
}) {
  const [wallet, setWallet] = useState<SandboxWalletData | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    void gamingRequest<SandboxWalletData>(
      "wallet",
      undefined,
      controller.signal,
    )
      .then(setWallet)
      .catch((reason) => {
        if (!controller.signal.aborted) {
          setWallet(null);
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load test credits.",
          );
        }
      });
    return () => controller.abort();
  }, [refreshKey, refresh]);
  return (
    <section className="panel sandbox-wallet">
      <div className="sandbox-wallet-heading">
        <div>
          <span className="eyebrow">SANDBOX WALLET</span>
          <h2>Test credits</h2>
        </div>
        <button
          className="secondary"
          aria-label="Refresh test balance"
          onClick={() => setRefresh((value) => value + 1)}
        >
          <RefreshCw size={16} />
        </button>
      </div>
      {error ? (
        <p role="status">{error}</p>
      ) : !wallet ? (
        <p role="status">Loading test credits…</p>
      ) : (
        <>
          <strong className="sandbox-balance">
            {wallet.balance} <small>{wallet.currency}</small>
          </strong>
          <p>
            {wallet.initialized
              ? "These credits are for game testing and have no cash value."
              : `${wallet.initialCredits} test credits are allocated once, when you first launch a game.`}
          </p>
          {!compact && wallet.transactions.length > 0 && (
            <div className="sandbox-history">
              <h3>Recent game activity</h3>
              {wallet.transactions.map((item, index) => (
                <div key={index}>
                  <span>
                    {item.action}
                    {item.errorCode
                      ? " · refused"
                      : item.reversed
                        ? " · reversed"
                        : ""}
                  </span>
                  <strong>
                    {item.amount} {wallet.currency}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {!compact && (
        <Link href="/provider-games" className="secondary">
          Browse provider games
        </Link>
      )}
    </section>
  );
}

export function ProviderGamePlayer({
  game,
  playerId,
  launchEnabled,
}: {
  game: ProviderGame;
  playerId: string;
  launchEnabled: boolean;
}) {
  const router = useRouter();
  const session = usePlayer();
  const [link, setLink] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (
      !session.loading &&
      (!session.player || session.player.id !== playerId)
    ) {
      setLink("");
      router.replace("/login?next=" + encodeURIComponent("/play/" + game.uuid));
      router.refresh();
    }
  }, [session.loading, session.player, playerId, router, game.uuid]);
  async function launch(mode: "real" | "demo") {
    if (pending || !launchEnabled) return;
    setPending(true);
    setError("");
    try {
      const result = await gamingRequest<{ link: string }>(
        `games/${game.uuid}/launch`,
        { requestId: createGameRequestId(), mode },
      );
      setLink(result.link);
      setRefresh((value) => value + 1);
    } catch (reason) {
      if (
        reason instanceof Error &&
        "status" in reason &&
        reason.status === 401
      ) {
        router.replace(
          "/login?next=" + encodeURIComponent("/play/" + game.uuid),
        );
      } else
        setError(
          reason instanceof Error ? reason.message : "Unable to launch game.",
        );
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="page-wrap">
      <PageHeading
        title={game.name}
        eyebrow="CHOICESTAKES"
        description={game.provider}
      />
      <div className="provider-mode">
        <ShieldCheck size={18} />
        <span>Sandbox session · Test credits only</span>
        <Link href="/provider-games">All games</Link>
      </div>
      {launchEnabled ? (
        <SandboxWallet refreshKey={refresh} compact />
      ) : (
        <p className="provider-availability" role="status">
          This game is in the collection. Sandbox play will be available once
          setup is complete.
        </p>
      )}
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {link ? (
        <section className="provider-player">
          <div className="provider-player-toolbar">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Open in new tab <ExternalLink size={16} />
            </a>
            <button
              onClick={() => {
                setLink("");
                setRefresh((value) => value + 1);
              }}
            >
              <X size={18} />
              Close game
            </button>
          </div>
          <iframe
            title={`${game.name} sandbox game`}
            src={link}
            allow="fullscreen; autoplay"
            allowFullScreen
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-orientation-lock"
          />
        </section>
      ) : (
        <section className="panel provider-launch">
          <div className="provider-launch-art">
            {game.imageUrl ? (
              <img
                src={game.imageUrl}
                alt={game.name}
                referrerPolicy="no-referrer"
              />
            ) : (
              <Gamepad2 size={64} />
            )}
          </div>
          <div>
            <h2>{launchEnabled ? "Ready to play?" : "Game preview"}</h2>
            <p>
              Explore this game using your sandbox credits. No real money is
              involved.
            </p>
            <div className="provider-launch-actions">
              <button
                className="primary"
                disabled={!launchEnabled || pending || session.loading}
                onClick={() => void launch("real")}
              >
                <Play size={18} />
                {pending ? "Opening game…" : "Play with test credits"}
              </button>
              <button
                className="secondary"
                disabled={!launchEnabled || pending || session.loading}
                onClick={() => void launch("demo")}
              >
                Try demo mode
              </button>
            </div>
            <small>Demo mode availability depends on the game provider.</small>
          </div>
        </section>
      )}
    </div>
  );
}
