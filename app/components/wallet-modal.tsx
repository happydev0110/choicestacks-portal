"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowDownToLine, ArrowUpFromLine, Bitcoin, Gift, Info, LockKeyhole, X } from "lucide-react";
import { usePlayer } from "./player-auth";
import styles from "./wallet-modal.module.css";

type Tab = "deposit" | "withdraw";
type Request = { playerId: string; pathname: string; trigger: HTMLElement };
const WalletModalContext = createContext<{
  request: Request | null;
  openWallet: (trigger: HTMLElement) => void;
  closeWallet: () => void;
} | null>(null);

export function useWalletModal() {
  const context = useContext(WalletModalContext);
  if (!context) throw new Error("useWalletModal requires WalletModalProvider.");
  return context;
}

export function WalletModalProvider({ children }: { children: React.ReactNode }) {
  const { player, loading } = usePlayer();
  const pathname = usePathname();
  const playerId = player?.id;
  const [request, setRequest] = useState<Request | null>(null);
  const closeWallet = useCallback(() => setRequest(null), []);
  const openWallet = useCallback((trigger: HTMLElement) => {
    if (!playerId || loading) return;
    setRequest({ playerId, pathname, trigger });
  }, [playerId, loading, pathname]);
  useEffect(closeWallet, [pathname, playerId, closeWallet]);
  const current = request?.playerId === playerId && request?.pathname === pathname ? request : null;
  return <WalletModalContext.Provider value={{ request: current, openWallet, closeWallet }}>
    {children}
  </WalletModalContext.Provider>;
}

// These tiles preview the design. Enabled methods, limits, fees, quotes and
// withdrawable funds must come from the payment backend before submission exists.
const methods = [
  { id: "eth-ethereum", coin: "ETH", network: "Ethereum", short: "ETH", icon: "eth" },
  { id: "sol-solana", coin: "SOL", network: "Solana", short: "Solana", icon: "sol" },
  { id: "btc-bitcoin", coin: "BTC", network: "Bitcoin", short: "BTC", icon: "btc" },
  { id: "usdt-ethereum", coin: "USDT", network: "Ethereum", short: "ETH", icon: "usdt" },
  { id: "usdc-ethereum", coin: "USDC", network: "Ethereum", short: "ETH", icon: "usdc" },
  { id: "usdt-tron", coin: "USDT", network: "Tron", short: "Tron", icon: "usdt" },
  { id: "usdt-polygon", coin: "USDT", network: "Polygon", short: "Polygon", icon: "usdt" },
] as const;
type Method = typeof methods[number];

function CoinIcon({ method }: { method: Method }) {
  if (method.icon === "eth") return <svg viewBox="0 0 28 28" aria-hidden="true">
    <path d="M14 1 5 15l9 5 9-5Z" fill="#8796d7" /><path d="M14 1v19l9-5Z" fill="#c3cced" />
    <path d="m5 17 9 10 9-10-9 5Z" fill="#7a89c6" /><path d="m14 22 9-5-9 10Z" fill="#dce3ff" />
  </svg>;
  if (method.icon === "sol") return <svg viewBox="0 0 28 28" aria-hidden="true">
    <path d="m7 4-5 5h19l5-5Z" fill="#6ff1cd" /><path d="m2 12 5 5h19l-5-5Z" fill="#65a9eb" />
    <path d="m7 20-5 5h19l5-5Z" fill="#a16bf2" />
  </svg>;
  if (method.icon === "btc") return <span className={`${styles.coinCircle} ${styles.bitcoin}`} aria-hidden="true"><Bitcoin size={21} /></span>;
  return <span className={styles.coinWrap} aria-hidden="true">
    <svg viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill={method.icon === "usdc" ? "#2875c9" : method.short === "Tron" ? "#ee454c" : "#39ac95"} />
      {method.icon === "usdc" ? <>
        <path d="M8 6a10 10 0 0 0 0 16M20 6a10 10 0 0 1 0 16" fill="none" stroke="#fff" strokeWidth="1.5" />
        <text x="14" y="21" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="21">$</text>
      </> : <>
        <path d="M7 7h14v4h-5v12h-4V11H7Z" fill="#fff" />
        <ellipse cx="14" cy="13" rx="9" ry="2.5" fill="none" stroke="#fff" strokeWidth="1.2" />
      </>}
    </svg>
    {method.short === "Polygon" && <span className={styles.networkBadge}>P</span>}
  </span>;
}

export function WalletModal() {
  const { request, closeWallet } = useWalletModal();
  return request ? <WalletDialog trigger={request.trigger} onClose={closeWallet} /> : null;
}

function WalletDialog({ trigger, onClose }: { trigger: HTMLElement; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropDown = useRef(false);
  const id = useId();
  const [tab, setTab] = useState<Tab>("deposit");
  const [methodId, setMethodId] = useState<Method["id"]>("eth-ethereum");
  const [amounts, setAmounts] = useState({ deposit: "", withdraw: "" });
  const [touched, setTouched] = useState({ deposit: false, withdraw: false });
  const [address, setAddress] = useState("");
  const method = methods.find((item) => item.id === methodId)!;
  const withdraw = tab === "withdraw";
  const amount = amounts[tab];
  const invalidAmount = amount !== "" && (!/^\d+(?:\.\d{1,2})?$/.test(amount) || !Number.isFinite(Number(amount)) || Number(amount) <= 0);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    // The game shell already owns its scroll lock. Only release our own lock.
    const ownsScrollLock = previousOverflow !== "hidden";
    if (ownsScrollLock) document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      if (ownsScrollLock) document.body.style.overflow = previousOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  function tabKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "deposit" : event.key === "End" ? "withdraw" : withdraw ? "deposit" : "withdraw";
    setTab(next);
    dialog.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
  }
  function setAmount(value: string) {
    setAmounts((current) => ({ ...current, [tab]: value }));
  }
  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled):not([tabindex="-1"]), input:not(:disabled):not([type="radio"]), input[type="radio"]:checked',
    ));
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-availability`}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onKeyDown={keepFocusInside}
    onPointerDown={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      backdropDown.current = event.target === event.currentTarget &&
        (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    }}
    onClick={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (backdropDown.current && event.target === event.currentTarget &&
          (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onClose();
      backdropDown.current = false;
    }}>
    <div className={styles.surface}>
      <div className={styles.heading}>
        <h2 id={`${id}-title`}>Wallet</h2>
        <button type="button" className={styles.close} aria-label="Close wallet" title="Close wallet" autoFocus onClick={onClose}><X size={18} aria-hidden="true" /></button>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Wallet actions">
        {(["deposit", "withdraw"] as const).map((value) => {
          const Icon = value === "deposit" ? ArrowDownToLine : ArrowUpFromLine;
          return <button key={value} type="button" role="tab" data-tab={value} id={`${id}-${value}-tab`}
            aria-selected={tab === value} aria-controls={`${id}-${value}-panel`} tabIndex={tab === value ? 0 : -1}
            onKeyDown={tabKeys} onClick={() => setTab(value)}>
            <Icon size={16} aria-hidden="true" />{value === "deposit" ? "Deposit" : "Withdraw"}
          </button>;
        })}
      </div>
      <div id={`${id}-${tab}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}-tab`} className={styles.columns}>
        <div className={styles.methodsColumn}>
          <fieldset className={styles.methods}>
            <legend>{withdraw ? "Withdraw to" : "Payment method"}</legend>
            <div className={styles.methodGrid}>
              {methods.map((item) => <label key={item.id} className={styles.method}>
                <input type="radio" name={`${id}-method`} value={item.id} checked={methodId === item.id}
                  aria-label={`${item.coin} on ${item.network}`}
                  onChange={() => { setMethodId(item.id); setAddress(""); }} />
                <span className={styles.methodFace}>
                  <CoinIcon method={item} /><strong>{item.coin}</strong><small>{item.short}</small>
                </span>
              </label>)}
            </div>
          </fieldset>
          {withdraw ? <>
            <div className={styles.available}><span>Available to withdraw</span><strong>Unavailable</strong></div>
            <p className={styles.helper}>Sandbox game balances cannot be withdrawn.</p>
          </> : <p className={styles.helper}>Payment methods shown for preview.</p>}
        </div>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          {withdraw && <div>
            <label className={styles.srOnly} htmlFor={`${id}-address`}>Withdrawal address</label>
            <input className={styles.address} id={`${id}-address`} value={address} maxLength={256}
              autoComplete="off" spellCheck={false} placeholder="Withdrawal address"
              onChange={(event) => setAddress(event.target.value)} aria-describedby={`${id}-network-help`} />
            <p id={`${id}-network-help`} className={styles.helper}>Selected network: {method.network}. Address checks will be available when withdrawals are connected.</p>
          </div>}
          <div>
            <label className={styles.srOnly} htmlFor={`${id}-amount`}>{withdraw ? "Withdrawal" : "Deposit"} amount (USD)</label>
            <div className={styles.amountField}>
              <span className={styles.dollar} aria-hidden="true">$</span>
              <input id={`${id}-amount`} inputMode="decimal" type="text" maxLength={16} autoComplete="off"
                placeholder={withdraw ? "Withdrawal amount" : "Deposit amount"} value={amount}
                onChange={(event) => setAmount(event.target.value)} onBlur={() => setTouched((current) => ({ ...current, [tab]: true }))}
                aria-invalid={touched[tab] && invalidAmount} aria-describedby={touched[tab] && invalidAmount ? `${id}-amount-error` : undefined} />
              <span className={styles.selectedAsset}>{method.coin} ({method.short})</span>
            </div>
            {touched[tab] && invalidAmount && <p id={`${id}-amount-error`} className={styles.error} role="alert">Enter a positive amount with up to two decimal places.</p>}
            <p className={styles.limit}>Limits and fees will appear when payments are available.</p>
          </div>
          <div className={styles.presets} aria-label={withdraw ? "Withdrawal percentages" : "Deposit amounts"}>
            {withdraw ? ["25%", "50%", "MAX"].map((label) => <button type="button" key={label} disabled title="A connected withdrawal balance is required">{label}</button>)
              : [20, 50, 100, 250].map((value) => <button type="button" key={value} aria-label={`Deposit $${value}`}
                  aria-pressed={amount === String(value)} onClick={() => { setAmount(String(value)); setTouched((current) => ({ ...current, deposit: true })); }}>${value}</button>)}
          </div>
          {!withdraw && <section className={styles.bonus} aria-label="Deposit bonus">
            <div className={styles.bonusHeading}>
              <Gift size={21} aria-hidden="true" />
              <div><h3>Deposit bonuses</h3><p>Offers coming soon</p></div>
              <button type="button" role="switch" aria-label="Apply deposit bonus" aria-checked={false} disabled className={styles.bonusSwitch}><span /></button>
            </div>
            <p>Available offers and their terms will appear here when deposits are enabled.</p>
          </section>}
          <div className={styles.availability} id={`${id}-availability`}>
            <Info size={17} aria-hidden="true" />
            <div><strong>Payments coming soon</strong><p>Deposits and withdrawals are not connected yet.</p></div>
          </div>
          <button type="submit" disabled className={styles.submit}>{withdraw ? "Withdraw Now" : "Deposit Now"}</button>
          <p className={styles.footnote}><LockKeyhole size={13} aria-hidden="true" />No funds will be transferred.</p>
        </form>
      </div>
    </div>
  </dialog>;
}
