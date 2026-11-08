"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlayer } from "../components/player-auth";
import type { Player } from "../lib/player";
import { SandboxWallet } from './provider-games';
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Gift,
  Heart,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import { allGames as games } from "../casino-data";
import { accountLinks, promotionOffers } from "../site-map";
import {
  EmptyState,
  GameGrid,
  Notice,
  PageHeading,
  useFavorites,
} from "./shared";

const transactions = [
  {
    id: "DEMO-1005",
    date: "03 Nov 2026, 14:20",
    type: "Deposit",
    method: "USDT",
    amount: 100,
    status: "Completed",
  },
  {
    id: "DEMO-1004",
    date: "02 Nov 2026, 11:45",
    type: "Withdrawal",
    method: "Bitcoin",
    amount: -25,
    status: "Pending",
  },
  {
    id: "DEMO-1003",
    date: "01 Nov 2026, 19:12",
    type: "Bonus",
    method: "Welcome offer",
    amount: 50,
    status: "Completed",
  },
  {
    id: "DEMO-1002",
    date: "31 Oct 2026, 09:30",
    type: "Deposit",
    method: "Ethereum",
    amount: 125,
    status: "Completed",
  },
  {
    id: "DEMO-1001",
    date: "30 Oct 2026, 16:08",
    type: "Withdrawal",
    method: "USDT",
    amount: -30,
    status: "Cancelled",
  },
];
function TransactionTable({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState("All");
  const [status, setStatus] = useState("All statuses");
  const rows = transactions
    .filter(
      (t) =>
        (filter === "All" || t.type === filter) &&
        (status === "All statuses" || t.status === status),
    )
    .slice(0, compact ? 3 : 10);
  return (
    <>
      {!compact && (
        <div className="catalog-toolbar">
          <select
            aria-label="Transaction type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All", "Deposit", "Withdrawal", "Bonus"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Transaction status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All statuses", "Completed", "Pending", "Cancelled"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      )}
      <div className="table-scroll">
        <table className="account-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td>
                  <strong>{t.type}</strong>
                  <small>
                    {t.id} · {t.date}
                  </small>
                </td>
                <td>{t.method}</td>
                <td className={t.amount > 0 ? "positive" : ""}>
                  {t.amount > 0 ? "+" : "−"}${Math.abs(t.amount).toFixed(2)}
                </td>
                <td>
                  <span className={`status-pill ${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="page-empty">
            No sample transactions match these filters.
          </p>
        )}
      </div>
    </>
  );
}
function Overview({ player }: { player: Player }) {
  return (
    <>
      <div className="account-welcome panel">
        <div className="avatar">
          <UserRound size={32} />
        </div>
        <div>
          <span className="eyebrow">PLAYER ACCOUNT</span>
          <h2>Welcome, {player.displayName}</h2>
          <p>Your activity, rewards, and settings in one place.</p>
        </div>
        <Link href="/account/profile" className="secondary">
          Edit profile
        </Link>
      </div>
      <div className="stat-grid">
        <div>
          <Wallet />
          <small>Demo balance</small>
          <strong>$250.00</strong>
          <Link href="/account/wallet">View wallet →</Link>
        </div>
        <div>
          <Gift />
          <small>Demo bonus</small>
          <strong>$50.00</strong>
          <Link href="/account/bonuses">Explore bonuses →</Link>
        </div>
        <div>
          <ShieldCheck />
          <small>Loyalty status</small>
          <strong>Basic</strong>
          <Link href="/loyalty-tiers">View tiers →</Link>
        </div>
      </div>
      <section className="panel">
        <div className="section-heading">
          <h2>Recent activity</h2>
          <Link href="/account/transactions" className="text-link">
            View all
          </Link>
        </div>
        <TransactionTable compact />
      </section>
    </>
  );
}
function Profile({ player }: { player: Player }) {
  return (
    <section className="panel">
      <h2>Personal profile</h2>
      <p>Your registered player details.</p>
      <div className="page-form">
        <label>Display name<input readOnly value={player.displayName} /></label>
        <label>Email address<input readOnly value={player.email} /></label>
        <label>Player ID<input readOnly value={player.id} /></label>
        <p className="fine-print">Email verification and profile editing will be available in a future update.</p>
      </div>
    </section>
  );
}
function WalletScreen() {
  return (
    <>
      <div className="wallet-card">
        <span className="eyebrow">YOUR DEMO WALLET</span>
        <small>Available balance</small>
        <strong>
          $250.00 <span>USD</span>
        </strong>
        <div className="button-row">
          <Link className="primary" href="/account/deposit">
            <ArrowDownLeft size={18} /> Deposit preview
          </Link>
          <Link className="secondary" href="/account/withdraw">
            <ArrowUpRight size={18} /> Withdraw preview
          </Link>
        </div>
      </div>
      <div className="stat-grid">
        <div>
          <small>Cash balance</small>
          <strong>$250.00</strong>
        </div>
        <div>
          <small>Bonus balance</small>
          <strong>$50.00</strong>
        </div>
        <div>
          <small>Pending withdrawal</small>
          <strong>$25.00</strong>
        </div>
      </div>
      <section className="panel">
        <div className="section-heading">
          <h2>Wallet activity</h2>
          <Link className="text-link" href="/account/transactions">
            View all
          </Link>
        </div>
        <TransactionTable compact />
      </section>
    </>
  );
}
function PaymentScreen({ withdraw = false }: { withdraw?: boolean }) {
  const [method, setMethod] = useState("USDT");
  const [amount, setAmount] = useState("50");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  return (
    <section className="panel payment-panel">
      <div className="step-indicator">
        <span className={step === 1 ? "active" : ""}>1 · Details</span>
        <span className={step === 2 ? "active" : ""}>2 · Review</span>
        <span className={done ? "active" : ""}>3 · Preview complete</span>
      </div>
      <h2>{withdraw ? "Withdraw funds" : "Add funds"}</h2>
      <p>
        {withdraw
          ? "Demo available balance: $250.00"
          : "Choose a payment method to explore the deposit flow."}
      </p>
      {done ? (
        <>
          <Notice success>
            {withdraw ? "Withdrawal" : "Deposit"} preview complete. No request
            was submitted, no payment was made, and your sample balance is
            unchanged.
          </Notice>
          <button
            className="secondary"
            onClick={() => {
              setDone(false);
              setStep(1);
            }}
          >
            Start another preview
          </button>
        </>
      ) : step === 1 ? (
        <form
          className="page-form"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <label>
            Payment method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {["USDT", "Bitcoin", "Ethereum", "USDC", "Solana"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Amount (USD)
            <input
              required
              type="number"
              min={withdraw ? 10 : 20}
              max={withdraw ? 250 : 10000}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <div className="amount-presets">
            {(withdraw ? [10, 25, 50, 100] : [20, 50, 100, 250]).map(
              (value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setAmount(String(value))}
                >
                  ${value}
                </button>
              ),
            )}
          </div>
          <p className="fine-print">
            {withdraw
              ? "Preview range: $10–$250."
              : "Preview range: $20–$10,000."}{" "}
            No payment details are collected.
          </p>
          <button type="submit" className="primary">
            Review {withdraw ? "withdrawal" : "deposit"}
          </button>
        </form>
      ) : (
        <div>
          <div className="review-box">
            <div className="summary-line">
              <span>Method</span>
              <strong>{method}</strong>
            </div>
            <div className="summary-line">
              <span>Amount</span>
              <strong>${Number(amount).toFixed(2)} USD</strong>
            </div>
            <div className="summary-line">
              <span>Mode</span>
              <strong>Frontend preview</strong>
            </div>
          </div>
          <Notice>
            A connected payment service is required to generate an address,
            calculate fees, or process a transfer.
          </Notice>
          <div className="button-row">
            <button className="secondary" onClick={() => setStep(1)}>
              Edit details
            </button>
            <button className="primary" onClick={() => setDone(true)}>
              Complete preview
            </button>
          </div>
        </div>
      )}
      <Link href="/account/wallet" className="text-link">
        Back to wallet →
      </Link>
    </section>
  );
}
function Bonuses() {
  return (
    <>
      <section className="panel">
        <h2>Your bonus dashboard</h2>
        <div className="summary-line">
          <span>Sample bonus balance</span>
          <strong>$50.00</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: "32%" }} />
        </div>
        <p className="fine-print">
          Sample wagering progress · 32% · No live bonus activity
        </p>
      </section>
      <div className="bonus-list">
        {promotionOffers.map((o) => (
          <section className="panel" key={o.slug}>
            <Gift size={30} />
            <div>
              <h3>{o.title}</h3>
              <p>100% up to {o.amount} · Sample welcome offer</p>
            </div>
            <Link href={`/promotions/${o.slug}`} className="secondary">
              View details
            </Link>
          </section>
        ))}
      </div>
    </>
  );
}
function Favorites() {
  const { favorites } = useFavorites();
  const saved = games.filter((g) => favorites.includes(g.name));
  return (
    <section className="panel">
      <h2>
        <Heart size={22} /> Your favorites
      </h2>
      {saved.length ? (
        <GameGrid items={saved} />
      ) : (
        <EmptyState title="Your collection starts here">
          Open a game and choose Add to favorites to save it on this device.
        </EmptyState>
      )}
    </section>
  );
}
function Security() {
  return <section className="panel">
    <h2>Account protection</h2>
    <div className="setting-row"><span><strong>Current session</strong><small>You are signed in on this browser.</small></span><span className="status-pill">Active</span></div>
    <p>Use Log out when you finish on a shared device. Password recovery, password changes, and two-factor setup are not available yet.</p>
  </section>;
}
function Verification() {
  const [step, setStep] = useState(0);
  return (
    <section className="panel">
      <h2>Identity verification</h2>
      <p>Explore the steps required for a typical verification experience.</p>
      <Notice>
        Walkthrough only. Do not provide identity documents or personal identity
        numbers.
      </Notice>
      <div className="verification-steps">
        {["Personal details", "Identity document", "Review"].map(
          (name, index) => (
            <button
              className={step === index ? "active" : ""}
              key={name}
              onClick={() => setStep(index)}
            >
              <span>{index + 1}</span>
              {name}
            </button>
          ),
        )}
      </div>
      <div className="verification-preview">
        <ShieldCheck size={46} />
        <h3>
          {
            ["Confirm your details", "Verify your identity", "Review status"][
              step
            ]
          }
        </h3>
        <p>
          {
            [
              "A connected account service would collect your legal name, date of birth, and address through a secure form.",
              "A secure identity provider would guide document capture and verification. Uploads are intentionally unavailable in this prototype.",
              "The verification provider would display a real review status here. This demo has not checked or approved any identity.",
            ][step]
          }
        </p>
        <span className="status-pill">Not connected</span>
      </div>
      <div className="button-row">
        {step > 0 && (
          <button className="secondary" onClick={() => setStep(step - 1)}>
            Previous step
          </button>
        )}
        {step < 2 && (
          <button className="primary" onClick={() => setStep(step + 1)}>
            Explore next step
          </button>
        )}
      </div>
    </section>
  );
}
function Limits() {
  const [saved, setSaved] = useState(false);
  const [timeout, setTimeoutChoice] = useState("24 hours");
  const [paused, setPaused] = useState(false);
  return (
    <>
      <section className="panel">
        <h2>Set your play limits</h2>
        <p>Preview the controls that help keep play within a budget.</p>
        <form
          className="page-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <div className="form-grid">
            <label>
              Daily deposit limit (USD)
              <input
                required
                type="number"
                min="0"
                max="10000"
                defaultValue="100"
                onChange={() => setSaved(false)}
              />
            </label>
            <label>
              Session reminder (minutes)
              <select defaultValue="30" onChange={() => setSaved(false)}>
                {[15, 30, 60, 90].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="primary" type="submit">
            Preview limits
          </button>
        </form>
        {saved && (
          <Notice success>
            Limit preview saved for this screen. No operational gambling
            restriction is enforced.
          </Notice>
        )}
      </section>
      <section className="panel">
        <h2>Take a break</h2>
        <p>Explore a cooling-off period or self-exclusion request.</p>
        <div className="page-form">
          <label>
            Break duration
            <select
              value={timeout}
              onChange={(e) => {
                setTimeoutChoice(e.target.value);
                setPaused(false);
              }}
            >
              {[
                "24 hours",
                "7 days",
                "30 days",
                "6 months",
                "Indefinite self-exclusion",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <button className="secondary" onClick={() => setPaused(true)}>
            Preview break request
          </button>
        </div>
        {paused && (
          <Notice success>
            Selected: {timeout}. This demo does not restrict access to a real
            service. Contact your gambling provider directly to activate an
            actual exclusion.
          </Notice>
        )}
        <Link href="/terms/responsible-gaming" className="text-link">
          Responsible gaming information →
        </Link>
      </section>
    </>
  );
}
export function AccountScreen({
  pageKey,
  title,
  player,
}: {
  pageKey: string;
  title: string;
  player: Player;
}) {
  const section = pageKey.split("/")[1] ?? "overview";
  const router = useRouter();
  const session = usePlayer();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!session.loading && !session.player) {
      router.replace('/login?next=' + encodeURIComponent('/' + pageKey));
      router.refresh();
    } else if (session.player && session.player.id !== player.id) {
      router.refresh();
    }
  }, [session.loading, session.player, router, pageKey, player.id]);
  async function logOut() {
    if (pending) return;
    setPending(true); setError("");
    try { await session.logout(); router.replace('/login'); router.refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to log out.'); }
    finally { setPending(false); }
  }
  if (!session.loading && !session.player) return <div className="page-wrap"><p role="status">Returning to sign in…</p></div>;
  return (
    <div className="page-wrap">
      <PageHeading title={title} eyebrow="MY ACCOUNT" />
      <Notice>
        Your player account is active. Game testing uses separate sandbox credits.
        Other balances and transactions are sample content; deposits, withdrawals,
        and identity verification are not connected.
      </Notice>
      <div className="account-layout">
        <nav className="panel account-nav" aria-label="Account navigation">
          {accountLinks.map(([label, path]) => (
            <Link
              key={path}
              href={path}
              className={`/${pageKey}` === path ? "active" : ""}
            >
              {label}
            </Link>
          ))}
          <button className="exit-demo account-logout" onClick={logOut} disabled={pending}>{pending ? "Logging out…" : "Log out"}</button>
          {error && <p className="auth-error" role="alert">{error}</p>}
        </nav>
        <div className="account-content">
          {section === "overview" ? (
            <Overview player={session.player ?? player} />
          ) : section === "profile" ? (
            <Profile player={session.player ?? player} />
          ) : section === "wallet" ? (
            <><SandboxWallet/><WalletScreen /></>
          ) : section === "deposit" ? (
            <PaymentScreen />
          ) : section === "withdraw" ? (
            <PaymentScreen withdraw />
          ) : section === "transactions" ? (
            <section className="panel">
              <h2>Transaction history</h2>
              <p>Filter the sample activity below.</p>
              <TransactionTable />
            </section>
          ) : section === "bonuses" ? (
            <Bonuses />
          ) : section === "favorites" ? (
            <Favorites />
          ) : section === "security" ? (
            <Security />
          ) : section === "verification" ? (
            <Verification />
          ) : (
            <Limits />
          )}
        </div>
      </div>
    </div>
  );
}
