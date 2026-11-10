"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  ShieldCheck,
  ExternalLink,
  X,
  RefreshCw,
  Maximize,
  LoaderCircle,
} from "lucide-react";
import { usePlayer } from "../components/player-auth";
import {
  gamingRequest,
  type ProviderGame,
  type SandboxWalletData,
} from "../lib/gaming";
import { PageHeading } from "./shared";
import { ProviderArtwork } from "./provider-cards";
import { useGameLaunch } from "../lib/use-game-launch";
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
    <section className={`panel sandbox-wallet${compact ? " sandbox-wallet-compact" : ""}`}>
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
  const authenticated = !session.loading && session.player?.id === playerId;
  const { state, retry } = useGameLaunch(
    game.uuid,
    playerId,
    launchEnabled && authenticated,
  );
  const playerContainer = useRef<HTMLElement>(null);
  const redirecting = useRef(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const link = authenticated && launchEnabled && state.status === "playing"
    ? state.link : "";
  const failed = state.status === "failed" && !state.unauthorized;
  const opening = launchEnabled && !failed && !link;
  const unauthorized = state.status === "failed" && state.unauthorized;
  const mustSignIn = !session.loading && (!authenticated || unauthorized);
  useEffect(() => {
    if (!mustSignIn || redirecting.current) return;
    redirecting.current = true;
    if (unauthorized) void session.refresh();
    router.replace("/login?next=" + encodeURIComponent("/play/" + game.uuid));
    router.refresh();
  }, [mustSignIn, unauthorized, session.refresh, router, game.uuid]);
  async function fullscreen() {
    setFullscreenError("");
    try {
      if (!playerContainer.current?.requestFullscreen) throw new Error();
      await playerContainer.current.requestFullscreen();
    } catch {
      setFullscreenError("Fullscreen is unavailable in this browser. You can open the game in a new tab.");
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
        <Link href="/casino">All games</Link>
      </div>
      {launchEnabled ? (
        <SandboxWallet refreshKey={link ? 1 : 0} compact />
      ) : null}
      {link ? (
        <section className="provider-player" ref={playerContainer}>
          <div className="provider-player-toolbar">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Open in new tab <ExternalLink size={16} />
            </a>
            <button onClick={() => void fullscreen()}>
              <Maximize size={16} />
              Fullscreen
            </button>
            <Link href="/casino">
              <X size={18} />
              Close game
            </Link>
          </div>
          {fullscreenError && <p className="provider-availability" role="status">{fullscreenError}</p>}
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
        <section className="panel provider-launch" aria-busy={opening}>
          <div className="provider-launch-art">
            <ProviderArtwork game={game} />
          </div>
          <div>
            <h2>{!launchEnabled ? "Game temporarily unavailable" : failed ? "Unable to open game" : "Opening game…"}</h2>
            {!launchEnabled ? (
              <p>Sandbox play is not available yet. Please try again later.</p>
            ) : failed && state.status === "failed" ? (
              <p className="auth-error" role="alert">{state.message}</p>
            ) : (
              <p className="provider-opening" role="status" aria-live="polite">
                <LoaderCircle size={20} aria-hidden="true" />
                {authenticated ? "Starting your sandbox session with test credits." : "Checking your player session…"}
              </p>
            )}
            {failed && launchEnabled && authenticated && (
              <>
                <div className="provider-launch-actions">
                  <button className="primary" onClick={() => retry()}><RefreshCw size={18} />Retry</button>
                  <button className="secondary" onClick={() => retry("demo")}><Play size={18} />Try demo mode</button>
                </div>
                <p>Retry opens a new session. Demo mode availability depends on the provider.</p>
              </>
            )}
            <Link className="text-link" href="/casino">Back to games</Link>
          </div>
        </section>
      )}
    </div>
  );
}
