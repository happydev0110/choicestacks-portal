"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Gift,
  ShieldCheck,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { asset } from "../data";
import { promotionOffers } from "../site-map";
import { Notice, PageHeading } from "./shared";

export function PromotionsScreen() {
  const [filter, setFilter] = useState("All");
  return (
    <div className="page-wrap">
      <div className="marketing-hero gold-hero">
        <div>
          <span className="eyebrow">
            A LITTLE EXTRA FOR YOUR NEXT ADVENTURE
          </span>
          <h1>Bonus Offers</h1>
          <p>Discover the welcome package and explore your rewards.</p>
          <span className="status-pill">Sample promotions</span>
        </div>
        <img src={asset("promotions.2684d026.png")} alt="Gift box" />
      </div>
      <div className="cashback-callout">
        <Gift size={35} />
        <div>
          <h2>Something rewarding is coming</h2>
          <p>Explore loyalty levels and discover the cashback concept.</p>
        </div>
        <Link href="/loyalty-tiers" className="secondary">
          Explore loyalty <ArrowRight size={16} />
        </Link>
      </div>
      <nav className="pill-nav" aria-label="Promotion filters">
        {["All", "Casino", "Sports"].map((tab) => (
          <button
            className={filter === tab ? "active" : ""}
            key={tab}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {filter === "Sports" ? (
        <div className="page-empty">
          <Trophy size={40} />
          <h2>Sports offers are coming soon</h2>
          <p>Browse the sportsbook preview while we prepare this collection.</p>
          <Link href="/sportsbook" className="secondary">
            Explore sports
          </Link>
        </div>
      ) : (
        <div className="offer-grid">
          {promotionOffers.map((offer) => (
            <article className="offer-card" key={offer.slug}>
              <div
                className="offer-art"
                style={{ backgroundImage: `url(${asset(offer.image)})` }}
              >
                <span>DEPOSIT {offer.number}</span>
                <h2>
                  100%<small>up to {offer.amount}</small>
                </h2>
              </div>
              <div className="offer-body">
                <span className="eyebrow">WELCOME PACKAGE · CASINO</span>
                <h3>{offer.title}</h3>
                <p>Your next chapter starts with a little extra.</p>
                <div className="offer-facts">
                  <span>
                    Min. deposit <b>$20</b>
                  </span>
                  <span>
                    Wagering <b>25×</b>
                  </span>
                  <span>
                    Validity <b>30 days</b>
                  </span>
                </div>
                <Link href={`/promotions/${offer.slug}`} className="secondary">
                  Offer details <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
      <Notice>
        Promotions are design samples. No offer can be claimed and no deposit is
        accepted.
      </Notice>
    </div>
  );
}
export function PromotionScreen({ pageKey }: { pageKey: string }) {
  const offer = promotionOffers.find((o) => pageKey.endsWith(o.slug))!;
  return (
    <div className="page-wrap">
      <PageHeading title={offer.title} eyebrow="WELCOME PACKAGE" />
      <div className="promotion-detail panel">
        <div
          className="offer-art"
          style={{ backgroundImage: `url(${asset(offer.image)})` }}
        >
          <span>WELCOME OFFER {offer.number}</span>
          <h2>
            100%<small>up to {offer.amount}</small>
          </h2>
        </div>
        <div>
          <h2>A welcome worth exploring</h2>
          <p>Preview how a welcome offer would appear in your account.</p>
          <div className="offer-facts">
            <span>
              Minimum <b>$20</b>
            </span>
            <span>
              Wagering <b>25×</b>
            </span>
            <span>
              Duration <b>30 days</b>
            </span>
          </div>
          <Link href="/account/bonuses" className="primary">
            View demo bonuses <ArrowRight size={17} />
          </Link>
        </div>
      </div>
      <section className="panel prose">
        <h2>How this sample offer works</h2>
        <ol>
          <li>Explore the demo account and bonus dashboard.</li>
          <li>Review the example deposit and wagering conditions.</li>
          <li>Use the deposit preview to see the frontend flow.</li>
        </ol>
        <h3>Sample conditions</h3>
        <p>
          This offer illustrates a 100% match up to {offer.amount}. The sample
          conditions show a $20 minimum deposit, 25× wagering requirement, and
          30-day validity. Actual eligibility, excluded games, maximum bets, and
          withdrawal conditions require approved production terms.
        </p>
        <Notice>
          This is a non-redeemable sample. No bonus or wallet balance will be
          credited.
        </Notice>
        <Link className="text-link" href="/terms/bonus-policy">
          Read the demo bonus policy →
        </Link>
      </section>
    </div>
  );
}
const tiers = [
  { name: "Basic", xp: 0, color: "#a4b6cc", cashback: 6 },
  { name: "Bronze", xp: 2000, color: "#db9560", cashback: 8 },
  { name: "Silver", xp: 12000, color: "#dae3f1", cashback: 10 },
  { name: "Gold", xp: 45000, color: "#f5cc5b", cashback: 13 },
  { name: "Platinum", xp: 180000, color: "#7ce7e4", cashback: 17 },
  { name: "Diamond", xp: 750000, color: "#ab9cff", cashback: 25 },
];
export function LoyaltyScreen() {
  const [selected, setSelected] = useState(0);
  const [xp, setXp] = useState(12000);
  const current = tiers.filter((t) => xp >= t.xp).at(-1)!;
  const tier = tiers[selected];
  return (
    <div className="page-wrap">
      <div className="marketing-hero loyalty-hero">
        <div>
          <span className="eyebrow">EVERY LEVEL. MORE POSSIBILITIES.</span>
          <h1>
            Your loyalty.
            <br />
            Rewarded.
          </h1>
          <p>Discover six tiers, from Basic to Diamond.</p>
          <Link href="/account" className="primary">
            View demo account <ArrowRight size={18} />
          </Link>
        </div>
        <img src={asset("vip.cee8642b.png")} alt="Loyalty badge" />
      </div>
      <div className="tier-grid">
        {tiers.map((t, index) => (
          <button
            key={t.name}
            className={`tier-card ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            style={{ "--tier-color": t.color } as React.CSSProperties}
          >
            <Trophy />
            <strong>{t.name}</strong>
            <small>{t.xp.toLocaleString()} XP</small>
          </button>
        ))}
      </div>
      <section className="panel loyalty-detail">
        <div>
          <span className="eyebrow">EXPLORE YOUR BENEFITS</span>
          <h2 style={{ color: tier.color }}>{tier.name} tier</h2>
          <p>Preview the rewards available at this level.</p>
        </div>
        <div>
          <strong>{tier.cashback}%</strong>
          <span>Sample cashback</span>
        </div>
        <div>
          <strong>{tier.xp.toLocaleString()}</strong>
          <span>Qualifying XP</span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            {selected > 2 ? "Personal support concept" : "Support access"}
          </span>
        </div>
      </section>
      <section className="panel xp-preview">
        <h2>Explore your progress</h2>
        <p>Move the slider to preview a loyalty level.</p>
        <label htmlFor="xp-preview">
          {xp.toLocaleString()} XP <strong>{current.name}</strong>
        </label>
        <input
          id="xp-preview"
          type="range"
          min="0"
          max="800000"
          step="1000"
          value={xp}
          onChange={(e) => setXp(Number(e.target.value))}
        />
        <div className="summary-line">
          <span>Basic</span>
          <span>Diamond</span>
        </div>
      </section>
      <Notice>
        Tier thresholds and benefits are sample presentation data. XP and
        cashback are not earned in this demo.
      </Notice>
    </div>
  );
}
export function AffiliateScreen() {
  const [sent, setSent] = useState(false);
  return (
    <div className="page-wrap">
      <div className="marketing-hero affiliate-hero">
        <div>
          <span className="eyebrow">CHOICESTAKES PARTNERS</span>
          <h1>
            Build your audience.
            <br />
            Grow together.
          </h1>
          <p>
            A dedicated home for creators, publishers, and affiliate partners.
          </p>
          <a className="primary" href="#partner-form">
            Become a partner <ArrowRight size={18} />
          </a>
        </div>
        <img src={asset("sports-trophy.429af003.webp")} alt="Golden trophy" />
      </div>
      <div className="benefit-grid">
        {[
          [
            Users,
            "A partnership that fits",
            "Connect your community with a tailored campaign concept.",
          ],
          [
            Wallet,
            "Transparent reporting",
            "Preview a clear view of traffic, referrals, and earnings.",
          ],
          [
            ShieldCheck,
            "Dedicated support",
            "A direct place to request help with your partnership.",
          ],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof Users;
          return (
            <article className="panel" key={String(title)}>
              <I size={30} />
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </article>
          );
        })}
      </div>
      <section className="panel">
        <h2>Three simple steps</h2>
        <div className="steps-grid">
          {[
            ["Apply", "Tell us about your audience."],
            ["Connect", "Prepare your content and campaign."],
            ["Grow", "Review referrals in your dashboard."],
          ].map(([title, text], i) => (
            <div key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="panel form-panel" id="partner-form">
        <PageHeading
          title="Let’s work together"
          description="Preview an affiliate enquiry. Nothing is submitted to a partner service."
        />
        {sent ? (
          <Notice success>
            Your enquiry passed local validation. It has not been sent.{" "}
            <button className="text-link" onClick={() => setSent(false)}>
              Edit enquiry
            </button>
          </Notice>
        ) : null}
        <form
          hidden={sent}
          className="page-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="form-grid">
            <label>
              Full name
              <input name="name" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label>
            Website or social profile
            <input
              name="website"
              type="url"
              required
              placeholder="https://example.com"
            />
          </label>
          <label>
            Tell us about your audience
            <textarea
              name="audience"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
            />
          </label>
          <button className="primary" type="submit">
            Preview enquiry
          </button>
        </form>
      </section>
    </div>
  );
}
export function ReferralScreen() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const link = "https://example.com/register?ref=CHOICESTAKES-DEMO";
  return (
    <div className="page-wrap">
      <div className="marketing-hero">
        <div>
          <span className="eyebrow">BETTER TOGETHER</span>
          <h1>Refer a friend</h1>
          <p>
            Explore the referral experience with your own sample invitation
            link.
          </p>
        </div>
        <img src={asset("promotions.2684d026.png")} alt="Gift" />
      </div>
      <section className="panel form-panel">
        <h2>Your demo invitation</h2>
        <p>This sample link is not connected to a referral program.</p>
        <div className="copy-field">
          <input aria-label="Demo referral link" readOnly value={link} />
          <button
            className="primary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(link);
                setCopied(true);
                setError(false);
              } catch {
                setError(true);
              }
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {error && (
          <p role="status">
            Clipboard is unavailable on this connection. Select and copy the
            link above.
          </p>
        )}
        <div className="stat-grid">
          <div>
            <small>Invited friends</small>
            <strong>0</strong>
          </div>
          <div>
            <small>Qualified referrals</small>
            <strong>0</strong>
          </div>
          <div>
            <small>Demo rewards</small>
            <strong>$0.00</strong>
          </div>
        </div>
        <Link href="/account" className="secondary">
          Open demo account
        </Link>
      </section>
      <Notice>No invitations are sent and no rewards are credited.</Notice>
    </div>
  );
}
const coins = [
  { symbol: "BTC", name: "Bitcoin", rate: 60000, network: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum", rate: 3000, network: "Ethereum (ERC20)" },
  { symbol: "USDT", name: "Tether", rate: 1, network: "Tron (TRC20)" },
  { symbol: "USDC", name: "USD Coin", rate: 1, network: "Ethereum (ERC20)" },
  { symbol: "SOL", name: "Solana", rate: 150, network: "Solana" },
];
export function CryptoScreen() {
  const [amount, setAmount] = useState("100");
  const [symbol, setSymbol] = useState("BTC");
  const [preview, setPreview] = useState(false);
  const coin = coins.find((c) => c.symbol === symbol)!;
  return (
    <div className="page-wrap">
      <PageHeading
        title="Buy Crypto"
        description="A simple preview of a crypto purchase flow."
      />
      <div className="crypto-layout">
        <section className="panel">
          <span className="eyebrow">CRYPTO MADE SIMPLE</span>
          <h2>Your next step into crypto</h2>
          <img
            className="crypto-illustration"
            src={asset("hero-banner-wallet.306b8026.jpg")}
            alt="Digital wallet illustration"
          />
          <div className="steps-grid">
            {["Choose a coin", "Enter an amount", "Review your quote"].map(
              (step, i) => (
                <div key={step}>
                  <span>0{i + 1}</span>
                  <h3>{step}</h3>
                </div>
              ),
            )}
          </div>
          <Notice>
            Fixed illustrative rates only. Prices are not live, and no purchase
            or wallet connection is available.
          </Notice>
        </section>
        <section className="panel">
          <h2>Purchase preview</h2>
          <form
            className="page-form"
            onSubmit={(e) => {
              e.preventDefault();
              setPreview(true);
            }}
          >
            <label>
              You pay (USD)
              <input
                required
                type="number"
                min="20"
                max="10000"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setPreview(false);
                }}
              />
            </label>
            <label>
              You receive
              <select
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  setPreview(false);
                }}
              >
                {coins.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </label>
            <div className="quote-output">
              <small>Illustrative amount</small>
              <strong>
                {(Math.max(0, Number(amount) || 0) / coin.rate).toFixed(6)}{" "}
                <span>{coin.symbol}</span>
              </strong>
            </div>
            <div className="summary-line">
              <span>Network</span>
              <b>{coin.network}</b>
            </div>
            <div className="summary-line">
              <span>Sample rate</span>
              <b>
                1 {coin.symbol} = ${coin.rate.toLocaleString()}
              </b>
            </div>
            <p className="fine-print">
              Amounts exclude any provider fees. Preview range: $20–$10,000.
            </p>
            <button className="primary" type="submit">
              Review sample quote
            </button>
          </form>
          {preview && (
            <Notice success>
              Quote preview ready. A payment provider must be connected to
              continue. No purchase has been made.
            </Notice>
          )}
          <Link className="text-link" href="/account/deposit">
            Looking for the deposit preview? →
          </Link>
        </section>
      </div>
    </div>
  );
}
