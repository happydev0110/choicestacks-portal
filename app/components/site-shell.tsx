"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Search,
  Menu,
  Home,
  Headphones,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { asset } from "../data";
import { labelRoutes, pageDefinitions } from "../site-map";
import { Sidebar } from "./sidebar";
import { SiteFooter } from "./site-footer";
import { BrandLogo } from "./brand-logo";
import { usePlayer } from "./player-auth";

const SiteContext = createContext<{
  navigate: (label: string) => void;
}>({ navigate: () => {} });
export const useSite = () => useContext(SiteContext);
export function SiteShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { player, logout } = usePlayer();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  async function logOut() {
    if (loggingOut) return;
    setLoggingOut(true); setLogoutError('');
    try { await logout(); router.replace('/login'); router.refresh(); }
    catch (error) { setLogoutError(error instanceof Error ? error.message : 'Unable to log out. Try again.'); }
    finally { setLoggingOut(false); }
  }
  const [menu, setMenu] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const language = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    setCookies(!localStorage.getItem("win777-demo-cookies"));
  }, []);
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  const navigate = (label: string) => {
    setMenu(false);
    if (label === "Language") {
      language.current?.showModal();
      return;
    }
    router.push(labelRoutes[label] ?? "/casino");
  };
  const active =
    pathname === "/" || pathname === "/casino"
      ? "Casino"
      : pathname.startsWith("/promotions")
        ? "Promotions"
        : (pageDefinitions[pathname.slice(1)]?.title ?? "Casino");
  const consent = (value: string) => {
    localStorage.setItem("win777-demo-cookies", value);
    setCookies(false);
    setPreferences(false);
  };
  return (
    <SiteContext.Provider
      value={{ navigate }}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="header">
        <Link className="brand" href="/" aria-label="Home">
          <BrandLogo />
        </Link>
        <div className="header-actions">
          <Link
            className="search-circle"
            href="/search"
            aria-label="Search games"
          >
            <Search size={18} />
          </Link>
          <Link
            className="account-shortcut"
            href="/account"
            aria-label="My account"
          >
            <UserRound size={19} />
          </Link>
          {player ? <>
            <Link className="primary player-account-link" href="/account" title={player.displayName}>My Account</Link>
            <button className="login" onClick={logOut} disabled={loggingOut}>{loggingOut ? 'Logging out…' : 'Log out'}</button>
          </> : <>
            <Link className="login" href="/login">Log In</Link>
            <Link className="primary" href="/register">Join Now</Link>
          </>}
        </div>
      </header>
      {logoutError && <p className="auth-toast" role="alert">{logoutError}</p>}
      <Sidebar
        active={active === "Sportsbook" ? "Sports" : active}
        mobileOpen={menu}
        onClose={() => setMenu(false)}
        onChoose={navigate}
      />
      <main id="main-content">
        {children}
        <SiteFooter onCookieSettings={() => setCookies(true)} />
      </main>
      <Link href="/contact" className="chat-fab" aria-label="Contact support">
        <Headphones size={25} />
      </Link>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          <Menu />
          Menu
        </button>
        <Link
          href="/search"
          className={pathname === "/search" ? "selected" : ""}
        >
          <Search />
          Search
        </Link>
        <Link
          href="/casino"
          className={pathname === "/casino" ? "selected" : ""}
        >
          <img src={asset("casino.9e4b02a8.svg")} alt="" />
          Casino
        </Link>
        <Link
          href="/sportsbook"
          className={pathname === "/sportsbook" ? "selected" : ""}
        >
          <Trophy />
          Sports
        </Link>
        <Link href="/" className={pathname === "/" ? "selected" : ""}>
          <Home />
          Home
        </Link>
      </nav>
      {cookies && (
        <section className="cookie-banner" aria-label="Cookie preferences">
          <p>
            This demo stores your preference on this device. Optional analytics
            are disabled and no tracking service is connected.
          </p>
          {preferences && (
            <label className="analytics-toggle">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              Allow optional analytics
            </label>
          )}
          <div>
            <button className="primary" onClick={() => consent("all")}>
              Accept All
            </button>
            <button onClick={() => consent("necessary")}>Reject All</button>
            <button
              onClick={() =>
                preferences
                  ? consent(analytics ? "all" : "necessary")
                  : setPreferences(true)
              }
            >
              {preferences ? "Save Preferences" : "Manage Preferences"}
            </button>
          </div>
        </section>
      )}
      <dialog
        ref={language}
        aria-label="Language"
        onClick={(e) => {
          if (e.target === e.currentTarget) language.current?.close();
        }}
      >
        <div className="modal">
          <button
            className="close-modal"
            aria-label="Close dialog"
            onClick={() => language.current?.close()}
          >
            <X />
          </button>
          <h2>Language</h2>
          <p>English is the language available in this frontend.</p>
          <button className="primary" onClick={() => language.current?.close()}>
            English ✓
          </button>
        </div>
      </dialog>
    </SiteContext.Provider>
  );
}
