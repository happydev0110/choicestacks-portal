"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Play,
  ShieldCheck,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";
import { usePlayer } from "../components/player-auth";
import {
  createGameRequestId,
  gamingRequest,
  type ProviderGame,
  type SandboxWalletData,
} from "../lib/gaming";
import { PageHeading } from "./shared";
import "./provider-games.css";

export { ProviderCatalog } from "./provider-catalog";

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
