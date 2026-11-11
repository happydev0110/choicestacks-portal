"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import styles from "./game-shell.module.css";

export function GameShell({ children, returnHref }: {
  children: React.ReactNode;
  returnHref: string;
}) {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const changingFullscreen = useRef(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const update = () => setFullscreen(Boolean(
      document.fullscreenElement && container.current?.contains(document.fullscreenElement),
    ));
    document.addEventListener("fullscreenchange", update);
    update();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("fullscreenchange", update);
    };
  }, []);

  async function toggleFullscreen() {
    if (changingFullscreen.current) return;
    changingFullscreen.current = true;
    setBusy(true);
    setError("");
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        if (!container.current?.requestFullscreen) throw new Error();
        // Fullscreen the entire shell so Wallet and Close stay accessible.
        await container.current.requestFullscreen();
      }
    } catch {
      setError("Fullscreen is unavailable in this browser. You can continue playing here.");
    } finally {
      changingFullscreen.current = false;
      setBusy(false);
    }
  }

  async function leave(href: string) {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch { /* Navigation still closes the player. */ }
    }
    router.push(href);
  }

  const fullscreenLabel = fullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div className={styles.shell} ref={container}>
      <a className="skip-link" href="#main-content">Skip to game</a>
      <header className={styles.header} aria-label="Game controls">
        <Link href="/" className={styles.brand} aria-label="Choicestakes home"
          onNavigate={(event) => { event.preventDefault(); void leave("/"); }}>
          <BrandLogo />
        </Link>
        <Link href="/account/wallet" className={styles.wallet}
          onNavigate={(event) => { event.preventDefault(); void leave("/account/wallet"); }}>
          Wallet
        </Link>
        <div className={styles.controls}>
          <button type="button" className={styles.iconButton}
            aria-label={fullscreenLabel} title={fullscreenLabel}
            aria-pressed={fullscreen} disabled={busy}
            onClick={() => void toggleFullscreen()}>
            {fullscreen ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}
          </button>
          <Link href={returnHref} className={styles.iconButton}
            aria-label="Close game" title="Close game"
            onNavigate={(event) => { event.preventDefault(); void leave(returnHref); }}>
            <X size={20} aria-hidden="true" />
          </Link>
        </div>
      </header>
      <main id="main-content" className={styles.main}>{children}</main>
      {error && (
        <div className={styles.notice}>
          <p role="alert">{error}</p>
          <button type="button" aria-label="Dismiss fullscreen message" onClick={() => setError("")}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
