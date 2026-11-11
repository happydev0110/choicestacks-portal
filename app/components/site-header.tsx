"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Bell, Coins, LogOut, Plus, ReceiptText, Search, Trophy, UserRound, Wallet } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { usePlayer } from "./player-auth";
import { useGameWallet } from "./game-wallet";
import { useWalletModal } from "./wallet-modal";
import styles from "./site-header.module.css";

const accountItems = [
  { label: "Wallet", href: "/account/wallet", icon: Wallet },
  { label: "Bet History", href: "/account/bets", icon: ReceiptText },
  { label: "Loyalty Tiers", href: "/loyalty-tiers", icon: Trophy },
  { label: "Account Settings", href: "/account/profile", icon: UserRound },
];
type Panel = "account" | "notifications" | null;

export function SiteHeader() {
  const { player, loading, logout } = usePlayer();
  const { wallet, error: walletError } = useGameWallet();
  const { openWallet, request } = useWalletModal();
  const pathname = usePathname();
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const logoutPending = useRef(false);
  const accountButton = useRef<HTMLButtonElement>(null);
  const notificationButton = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const playerId = player?.id;

  useEffect(() => { setPanel(null); setLogoutError(""); }, [pathname, playerId]);
  useEffect(() => {
    if (!panel) return;
    const trigger = panel === "account" ? accountButton.current : notificationButton.current;
    const container = popup.current;
    (container?.querySelector<HTMLElement>('[role="menuitem"]') ?? container)?.focus();
    const outside = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && !container?.contains(target)
        && !accountButton.current?.contains(target) && !notificationButton.current?.contains(target)) setPanel(null);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault(); setPanel(null); trigger?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [panel]);

  function toggle(next: Exclude<Panel, null>) {
    setLogoutError("");
    setPanel((current) => current === next ? null : next);
  }
  function menuKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'));
    if (!items.length) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
      : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  }
  async function logOut() {
    if (logoutPending.current) return;
    logoutPending.current = true;
    setLoggingOut(true); setLogoutError("");
    try {
      await logout(); setPanel(null); router.replace("/login"); router.refresh();
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    } finally { logoutPending.current = false; setLoggingOut(false); }
  }

  const name = player?.displayName.trim() || "My Account";
  const initials = name.split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0]).join("").toUpperCase();
  const currencySymbol = wallet ? ({ USD: "$", EUR: "€", GBP: "£" } as Record<string, string>)[wallet.currency] : null;
  const balanceLabel = wallet ? `Game balance: ${wallet.balance} ${wallet.currency}`
    : walletError ? "Game balance unavailable" : "Loading game balance";

  return (
    <header className={`header ${styles.header}`}>
      <Link className={styles.brand} href="/" aria-label="Choicestakes home"><BrandLogo /></Link>
      <div className={styles.center}>
        {!loading && player && <div className={styles.balance}>
          <Link href="/account/wallet" className={styles.balanceValue} aria-label={balanceLabel} title={balanceLabel}>
            <span className={styles.currency} aria-hidden="true">{currencySymbol ?? <Coins size={14} />}</span>
            <span className={styles.amount}>{wallet?.balance ?? (walletError ? "—" : "…")}</span>
          </Link>
          <button type="button" className={styles.addFunds} aria-label="Open deposit wallet" title="Deposit"
            aria-haspopup="dialog" aria-expanded={Boolean(request)}
            onClick={(event) => { setPanel(null); openWallet(event.currentTarget); }}><Plus size={23} strokeWidth={3} aria-hidden="true" /></button>
        </div>}
      </div>
      <div className={styles.actions}>
        <Link className={`${styles.circle} ${styles.search}`} href="/search" aria-label="Search games"><Search size={18} /></Link>
        {loading ? <span className={styles.skeleton} role="status" aria-label="Loading account" /> : player ? <>
          <div className={styles.anchor}>
            <button ref={notificationButton} className={`${styles.circle} ${panel === "notifications" ? styles.selected : ""}`}
              aria-label="Notifications" aria-expanded={panel === "notifications"} aria-controls="header-notifications" aria-haspopup="dialog"
              onClick={() => toggle("notifications")}><Bell size={20} /></button>
            {panel === "notifications" && <div ref={popup} id="header-notifications" className={`${styles.popup} ${styles.notifications}`}
              role="dialog" aria-labelledby="notifications-title" tabIndex={-1}>
              <div className={styles.notificationHeading}><h2 id="notifications-title">Notifications</h2><button disabled>Mark All as Read</button></div>
              <div className={styles.emptyNotifications}><Bell size={28} strokeWidth={1.5} /><p>No new notifications.</p></div>
            </div>}
          </div>
          <div className={styles.anchor}>
            <button ref={accountButton} className={`${styles.profile} ${panel === "account" ? styles.selected : ""}`}
              aria-label={`Account menu for ${name}`} aria-expanded={panel === "account"} aria-controls="header-account-menu" aria-haspopup="menu"
              onClick={() => toggle("account")} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setPanel("account"); } }}>
              <span className={styles.avatar} aria-hidden="true">{initials}</span><span className={styles.username}>{name}</span>
            </button>
            {panel === "account" && <div ref={popup} id="header-account-menu" className={`${styles.popup} ${styles.accountMenu}`}
              role="menu" aria-label="Account" onKeyDown={menuKeys}>
              {accountItems.map(({ label, href, icon: Icon }) => <Link key={href} role="menuitem" className={styles.menuItem} href={href} onClick={() => setPanel(null)}>
                <span className={styles.menuIcon}><Icon size={18} /></span>{label}
              </Link>)}
              <div className={styles.divider} role="separator" />
              <button className={`${styles.menuItem} ${styles.logout}`} role="menuitem" onClick={logOut} disabled={loggingOut}>
                <span className={styles.menuIcon}><LogOut size={18} /></span>{loggingOut ? "Logging out…" : "Log Out"}
              </button>
              {logoutError && <p className={styles.error} role="alert">{logoutError}</p>}
            </div>}
          </div>
        </> : <><Link className="login" href="/login">Log In</Link><Link className="primary" href="/register">Join Now</Link></>}
      </div>
    </header>
  );
}
