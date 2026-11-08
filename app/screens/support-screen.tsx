"use client";
import Link from "next/link";
import { useState } from "react";
import { Headphones, Mail, Search, ShieldCheck } from "lucide-react";
import { policyLinks } from "../site-map";
import { Notice, PageHeading } from "./shared";

const faqs = [
  {
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Open Join Now, complete the form, and confirm that you are at least 18. In this frontend, the form only validates locally; no account is created.",
  },
  {
    category: "Account",
    question: "I forgot my password. What can I do?",
    answer:
      "Use the Forgot password link on the login page. The reset page previews email validation. A connected authentication service is required to send a reset email.",
  },
  {
    category: "Account",
    question: "Where can I update my profile?",
    answer:
      "Open My Account, then Profile. You can preview editing your display name and preferences. Only the display name and preferences are stored on this device.",
  },
  {
    category: "Deposits",
    question: "How do I make a deposit?",
    answer:
      "Go to My Account → Deposit, choose a payment method, and enter an amount. This demo shows a review step only and never requests a payment.",
  },
  {
    category: "Deposits",
    question: "Which currencies are shown?",
    answer:
      "The frontend includes USD, Bitcoin, Ethereum, USDT, USDC, and Solana in its payment previews. Actual availability depends on a future payment integration.",
  },
  {
    category: "Withdrawals",
    question: "How can I withdraw funds?",
    answer:
      "The Withdraw page demonstrates a request and review flow. The displayed balance is sample data. No request is submitted and no funds are transferred.",
  },
  {
    category: "Withdrawals",
    question: "Why might verification be required?",
    answer:
      "A production operator may need identity and payment ownership checks before processing a withdrawal. The Verification page here only previews those steps; do not upload identity documents.",
  },
  {
    category: "Technical Support",
    question: "Why does a game show a preview screen?",
    answer:
      "Game artwork and navigation are available, but no game provider has been integrated. Opening a game displays its dedicated preview page.",
  },
  {
    category: "Technical Support",
    question: "Can I pause the top banners?",
    answer:
      "Yes. Use the pause button below the banner carousel. Use it again to resume autoplay. You can also swipe, drag, or select a pagination dot.",
  },
  {
    category: "General",
    question: "Are the wins, offers, and sports scores real?",
    answer:
      "No. All activity, promotions, fixtures, odds, and balances are sample content used to demonstrate the interface.",
  },
  {
    category: "General",
    question: "How do favorites work?",
    answer:
      "Open a game and choose Add to favorites. Favorites are saved in this browser and appear under My Account → Favorites.",
  },
  {
    category: "Payments & Fees",
    question: "Are the crypto exchange rates live?",
    answer:
      "No. The Buy Crypto page uses fixed illustrative rates. It does not connect to an exchange or include payment provider fees.",
  },
  {
    category: "Payments & Fees",
    question: "Will using this demo charge me?",
    answer:
      "No. There are no connected payment services, real wagers, or deposits in this frontend.",
  },
];
export function FaqScreen() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const results = faqs.filter(
    (f) =>
      (category === "All" || f.category === category) &&
      `${f.question} ${f.answer}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page-wrap">
      <PageHeading
        title="How can we help?"
        eyebrow="HELP CENTER"
        description="Quick answers about accounts, games, payments, and this demo."
      />
      <label className="field-search faq-search">
        <Search size={19} />
        <input
          placeholder="Search for an answer"
          aria-label="Search FAQs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="help-layout">
        <nav className="panel help-nav" aria-label="FAQ categories">
          {["All", ...new Set(faqs.map((f) => f.category))].map((name) => (
            <button
              className={category === name ? "active" : ""}
              onClick={() => setCategory(name)}
              key={name}
            >
              {name}
            </button>
          ))}
        </nav>
        <section className="faq-list">
          <h2>
            {category === "All" ? "Frequently asked questions" : category}
          </h2>
          {results.map((f) => (
            <details key={f.question} className="faq-item">
              <summary>
                {f.question}
                <span>+</span>
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
          {!results.length && (
            <div className="page-empty">
              <h3>No matching answers</h3>
              <button
                className="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
          <div className="contact-callout">
            <Headphones size={32} />
            <div>
              <h3>Still need help?</h3>
              <p>Explore the support enquiry form.</p>
            </div>
            <Link href="/contact" className="secondary">
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
export function ContactScreen({ complaint = false }: { complaint?: boolean }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="page-wrap">
      <PageHeading
        title={complaint ? "Complaints" : "Contact Us"}
        description={
          complaint
            ? "Tell us what happened so the review flow can be previewed."
            : "We’re here to help you find the right answer."
        }
      />
      <div className="contact-layout">
        <section className="panel">
          <h2>
            {complaint ? "Submit a complaint preview" : "Send us a message"}
          </h2>
          <p>Complete the form below. This preview does not send messages.</p>
          {sent ? (
            <>
              <Notice success>
                Your {complaint ? "complaint" : "message"} passed local
                validation. Nothing was sent to a support team.
              </Notice>
              <button className="secondary" onClick={() => setSent(false)}>
                Edit message
              </button>
            </>
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
                Your name
                <input
                  required
                  name="name"
                  placeholder="Full name"
                  autoComplete="name"
                />
              </label>
              <label>
                Email address
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
            </div>
            <label>
              Topic
              <select
                name="topic"
                defaultValue={complaint ? "Complaint" : "Account"}
              >
                {[
                  "Account",
                  "Payments",
                  "Games",
                  "Technical issue",
                  "Complaint",
                  "Other",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Subject
              <input
                required
                name="subject"
                maxLength={120}
                placeholder="How can we help?"
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your enquiry. Do not include passwords or payment details."
              />
              <span className="character-count">{message.length} / 2,000</span>
            </label>
            <button className="primary" type="submit">
              Preview {complaint ? "complaint" : "message"}
            </button>
          </form>
        </section>
        <aside>
          <section className="panel support-card">
            <Headphones size={46} />
            <h2>Support center</h2>
            <p>Find guidance for common questions.</p>
            <Link href="/faq" className="secondary">
              Browse FAQs
            </Link>
          </section>
          <section className="panel support-card">
            <Mail size={27} />
            <h3>Help with your account</h3>
            <p>Review your profile, wallet, or security preferences.</p>
            <Link href="/account" className="text-link">
              My account →
            </Link>
          </section>
          <Notice>
            Support integrations are not connected. No message or uploaded
            information leaves this frontend.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
const policies: Record<
  string,
  { intro: string; sections: [string, string][] }
> = {
  "terms-of-service": {
    intro:
      "These draft terms explain the scope of this independent interface demonstration.",
    sections: [
      [
        "About this preview",
        "This website is a visual and interactive frontend prototype. It does not operate a casino, accept wagers, create real accounts, or process money.",
      ],
      [
        "Eligibility and access",
        "The interface is intended for adults aged 18 and over. Production access requirements, permitted locations, and eligibility checks must be defined by the future operator.",
      ],
      [
        "Sample content",
        "Game names, artwork, balances, sports scores, promotions, and transaction records demonstrate page layouts. They do not establish an offer, contract, payout, or account entitlement.",
      ],
      [
        "Production terms",
        "Before launch, the operator must supply approved terms covering its identity, permitted jurisdictions, account obligations, payments, dispute handling, and service limitations.",
      ],
    ],
  },
  "privacy-policy": {
    intro: "This notice describes the local behavior of the demo frontend.",
    sections: [
      [
        "Information entered in forms",
        "Forms validate in your browser. They do not send registration, contact, payment, or identity information to an application backend. Passwords and identity documents are not stored by this demo.",
      ],
      [
        "Local preferences",
        "Cookie choices, game favorites, your chosen display name, and display preferences may be saved in browser local storage. Clearing this site’s browser data removes these preferences.",
      ],
      [
        "Hosting and requests",
        "Your browser requests pages, scripts, fonts, and images from the server hosting this frontend. Infrastructure logging depends on that server. No third-party analytics or marketing service is configured in the application.",
      ],
      [
        "Production privacy notice",
        "A deployed service needs an approved privacy notice naming the data controller, purposes, retention periods, recipients, contact method, and applicable user rights.",
      ],
    ],
  },
  "responsible-gaming": {
    intro:
      "The demo includes tools that illustrate a responsible-play experience.",
    sections: [
      [
        "Keep play within your limits",
        "Treat gambling as entertainment and set a budget and time limit before playing. Do not use money needed for essential expenses or chase losses.",
      ],
      [
        "Take a break",
        "Pause if play stops being enjoyable. The account Play Limits page demonstrates deposit limits and time-out controls; these controls do not enforce restrictions across an actual gambling service.",
      ],
      [
        "Underage access",
        "The interface is intended for adults aged 18 and over. A live operator must enforce applicable age restrictions and identity checks.",
      ],
      [
        "Getting support",
        "If gambling is causing harm, stop playing and seek support from an appropriate local support service or a qualified professional. Production support contacts must be configured for each supported region.",
      ],
    ],
  },
  "kyc-policy": {
    intro:
      "Identity verification is represented by a frontend walkthrough only.",
    sections: [
      [
        "Verification stages",
        "The account verification screen shows example steps for personal details, proof of identity, and review. It does not accept identity documents or start a verification session.",
      ],
      [
        "Document handling",
        "Do not enter or upload government ID, bank statements, or other sensitive verification material into this prototype. A production system needs a secure verification provider and approved retention procedures.",
      ],
      [
        "Review and decisions",
        "No identity check, eligibility decision, or verification approval is made by the demo. Production requirements must be set by the operator and its compliance team.",
      ],
    ],
  },
  "aml-policy": {
    intro:
      "This page is a placeholder policy draft for a future operational service, with no claim of active compliance monitoring.",
    sections: [
      [
        "No financial activity",
        "The frontend does not receive deposits, execute withdrawals, hold assets, or process cryptocurrency. Displayed activity is sample data.",
      ],
      [
        "Operational requirements",
        "A production operator must establish risk assessment, customer checks, transaction monitoring, escalation procedures, and record retention appropriate to its service and jurisdictions.",
      ],
      [
        "Suspicious activity",
        "No automated monitoring or reporting integration is connected. A live operator must provide a secure process for raising and investigating concerns.",
      ],
    ],
  },
  "bonus-policy": {
    intro: "All bonuses shown in this demo are non-redeemable design examples.",
    sections: [
      [
        "Sample eligibility",
        "The welcome package illustrates three offers. Eligibility, excluded users and locations, and activation rules are not implemented.",
      ],
      [
        "Displayed conditions",
        "The promotion cards display example deposit amounts, wagering requirements, and validity periods. These figures do not create an entitlement to funds or rewards.",
      ],
      [
        "Production conditions",
        "A live bonus policy must clearly define qualifying deposits, game contributions, maximum bets, expiry, withdrawals, exclusions, and dispute handling before an offer becomes available.",
      ],
    ],
  },
  "betting-rules": {
    intro:
      "The sportsbook is an interactive preview using fictional fixtures and fixed sample odds.",
    sections: [
      [
        "Selections and slips",
        "Selecting odds adds an item to a local preview slip. Selecting another outcome for the same event replaces the previous selection. No wager is placed.",
      ],
      [
        "Potential returns",
        "The preview multiplies the sample odds by the entered stake to illustrate a possible return. This figure is not a payout promise or a live market quote.",
      ],
      [
        "Settlement and cancellations",
        "No results feed, bet acceptance, cash-out, settlement, voiding, or cancellation service exists in this demo. A production sportsbook must publish its market and settlement rules.",
      ],
    ],
  },
  "cookie-policy": {
    intro:
      "The demo uses browser local storage for a small number of interface preferences.",
    sections: [
      [
        "Preference storage",
        "The cookie banner saves your selected preference on this device. Favorites and saved display preferences also use local storage. These values are not authentication tokens.",
      ],
      [
        "Analytics",
        "No analytics or advertising tracker is connected. Choosing optional analytics does not activate a tracking service in this demo.",
      ],
      [
        "Manage your choices",
        "Open Cookie Settings in the footer to update your selection. You can remove all stored demo preferences using your browser’s site-data controls.",
      ],
      [
        "Production changes",
        "If analytics, support widgets, payment services, or other integrations are introduced, this notice and the consent interface must be updated to reflect their actual behavior.",
      ],
    ],
  },
};
export function PolicyScreen({
  pageKey,
  title,
}: {
  pageKey: string;
  title: string;
}) {
  const policy = policies[pageKey.split("/").at(-1)!];
  return (
    <div className="page-wrap">
      <PageHeading title={title} eyebrow="INFORMATION & POLICIES" />
      <div className="help-layout">
        <nav className="panel help-nav" aria-label="Policy navigation">
          {policyLinks.map(([name, slug]) => (
            <Link
              href={`/terms/${slug}`}
              className={pageKey === `terms/${slug}` ? "active" : ""}
              key={slug}
            >
              {name}
            </Link>
          ))}
          <Link href="/complaints">Complaints</Link>
        </nav>
        <article className="panel prose">
          <span className="status-pill">
            <ShieldCheck size={14} /> DEMO POLICY DRAFT
          </span>
          <p className="policy-intro">{policy.intro}</p>
          {policy.sections.map(([heading, text], i) => (
            <section key={heading}>
              <h2>
                {i + 1}. {heading}
              </h2>
              <p>{text}</p>
            </section>
          ))}
          <Notice>
            Draft content for this prototype. Operational policies and legal
            review are required before a live service launches.
          </Notice>
          <Link href="/contact" className="text-link">
            Questions about this page? Contact support →
          </Link>
        </article>
      </div>
    </div>
  );
}
