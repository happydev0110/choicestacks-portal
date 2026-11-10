"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  ExternalLink,
  X,
  RefreshCw,
  Maximize,
  LoaderCircle,
} from "lucide-react";
import { usePlayer } from "../components/player-auth";
import { useGameWallet } from "../components/game-wallet";
import { useToast } from "../components/toast-provider";
import {
  type ProviderGame,
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
  const { wallet, error, loading, refresh } = useGameWallet();
  useEffect(() => {
    if (refreshKey > 0) refresh();
  }, [refreshKey, refresh]);
  return (
    <section className={`panel sandbox-wallet${compact ? " sandbox-wallet-compact" : ""}`}>
      <div className="sandbox-wallet-heading">
        <div>
          <h2>Game balance</h2>
        </div>
        <button
          className="secondary"
          aria-label="Refresh game balance"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw size={16} />
        </button>
      </div>
      {error ? (
        <p role="status">{error}</p>
      ) : !wallet ? (
        <p role="status">Loading game balance…</p>
      ) : (
        <>
          <strong className="sandbox-balance">
            {wallet.balance} <small>{wallet.currency}</small>
          </strong>
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
  const toast = useToast();
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
      toast.error("Fullscreen is unavailable in this browser. You can open the game in a new tab.");
    }
  }
  return (
    <div className="page-wrap">
      <PageHeading
        title={game.name}
        eyebrow="CHOICESTAKES"
        description={game.provider}
      />
      <Link className="provider-back-link" href="/casino">← All games</Link>
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
                {authenticated ? "Opening your game session…" : "Checking your player session…"}
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
