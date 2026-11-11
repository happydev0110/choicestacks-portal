"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";
import { usePlayer } from "../components/player-auth";
import { useGameWallet } from "../components/game-wallet";
import {
  type ProviderGame,
} from "../lib/gaming";
import { useGameLaunch } from "../lib/use-game-launch";
import "./provider-games.css";
import styles from "./game-player.module.css";

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
  const session = usePlayer();
  const authenticated = !session.loading && session.player?.id === playerId;
  const { state, retry } = useGameLaunch(
    game.uuid,
    playerId,
    launchEnabled && authenticated,
  );
  const redirecting = useRef(false);
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
  return (
    <section className={styles.player} aria-label={`${game.name} player`}>
      <h1 className="sr-only">{game.name}</h1>
      {link ? (
          <iframe
            className={styles.frame}
            title={`${game.name} sandbox game`}
            src={link}
            allow="fullscreen; autoplay"
            allowFullScreen
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-orientation-lock"
          />
      ) : (
        <div className={styles.state} aria-busy={opening}>
          <div className={styles.message}>
            {opening && <LoaderCircle className={styles.spinner} size={34} aria-hidden="true" />}
            <h2>{!launchEnabled ? "Game temporarily unavailable" : failed ? "Unable to open game" : "Opening game…"}</h2>
            {!launchEnabled ? (
              <p>Sandbox play is not available yet. Please try again later.</p>
            ) : failed && state.status === "failed" ? (
              <p className={styles.error} role="alert">{state.message}</p>
            ) : (
              <p role="status" aria-live="polite">
                {authenticated ? "Opening your game session…" : "Checking your player session…"}
              </p>
            )}
            {failed && launchEnabled && authenticated && (
              <>
                <div className={styles.actions}>
                  <button className="primary" onClick={() => retry()}><RefreshCw size={18} />Retry</button>
                  <button className="secondary" onClick={() => retry("demo")}><Play size={18} />Try demo mode</button>
                </div>
                <p>Retry opens a new session. Demo mode availability depends on the provider.</p>
              </>
            )}
            <Link className={styles.back} href="/casino">Back to games</Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function GamePlayerUnavailable({ title, message }: { title: string; message: string }) {
  return <section className={styles.state}>
    <div className={styles.message}>
      <h1>{title}</h1>
      <p>{message}</p>
      <Link className={styles.back} href="/casino">Back to games</Link>
    </div>
  </section>;
}
