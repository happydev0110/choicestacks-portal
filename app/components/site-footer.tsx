"use client";

import Link from "next/link";
import { useRef } from "react";
import { X } from "lucide-react";
import { asset } from "../data";
import styles from "./site-footer.module.css";

const casinoLinks = [
  ["New Games", "/new-games"],
  ["Slots", "/slots"],
  ["Live Casino", "/live"],
  ["Crash & Instant Games", "/crash-instant"],
  ["Table Games", "/table-cards"],
  ["Lottery & Scratch Cards", "/lotto-scratch"],
];
const policyLinks = [
  ["Terms & Legal", "/terms/terms-of-service"],
  ["Privacy Policy", "/terms/privacy-policy"],
  ["Cookie Settings", "cookies"],
  ["Responsible Gaming", "/terms/responsible-gaming"],
  ["KYC Policy", "/terms/kyc-policy"],
  ["AML Policy", "/terms/aml-policy"],
  ["Complaints", "/complaints"],
  ["Bonus Policy", "/terms/bonus-policy"],
  ["Betting Rules", "/terms/betting-rules"],
];
const badges = [
  ["GamCare", "badge1.a4900264.webp"],
  ["Responsible Gambling", "badge2.a64e55c3.webp"],
  ["BeGambleAware.org", "badge3.baba3ddf.webp"],
  ["18+", "badge4.c072c31d.webp"],
];

function FooterGroup({
  title,
  links,
  onCookieSettings,
  className = "",
}: {
  title: string;
  links: string[][];
  onCookieSettings?: () => void;
  className?: string;
}) {
  return (
    <section className={`${styles.group} ${className}`} aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {links.map(([label, href]) => (
          <li key={label}>
            {href === "cookies" ? (
              <button type="button" onClick={onCookieSettings}>
                {label}
              </button>
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SiteFooter({
  onCookieSettings,
}: {
  onCookieSettings: () => void;
}) {
  const chat = useRef<HTMLDialogElement>(null);
  const closeChat = () => chat.current?.close();
  return (
    <footer
      className={styles.root}
      role="contentinfo"
      aria-label="Site footer"
      id="site-footer"
    >
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.top}>
        <nav className={styles.navigation} aria-label="Footer navigation">
          <div className={styles.casinoColumn}>
            <FooterGroup title="Casino" links={casinoLinks} />
            <FooterGroup
              className={styles.mobileGroup}
              title="Promotions"
              links={[
                ["Promotions", "/promotions"],
                ["Loyalty Tiers", "/loyalty-tiers"],
                ["Referral Program", "/refer-a-friend"],
              ]}
            />
          </div>
          <div className={styles.sportsColumn}>
            <FooterGroup
              title="Sportsbook"
              links={[["Sportsbook", "/sportsbook"]]}
            />
            <FooterGroup
              className={styles.mobileGroup}
              title="Support"
              links={[
                ["Contact Us", "/contact"],
                ["FAQ", "/faq"],
              ]}
            />
          </div>
          <div className={styles.policyColumn}>
            <FooterGroup
              title="Policies"
              links={policyLinks}
              onCookieSettings={onCookieSettings}
            />
          </div>
          <FooterGroup
            className={styles.desktopGroup}
            title="Promotions"
            links={[
              ["Promotions", "/promotions"],
              ["Loyalty Tiers", "/loyalty-tiers"],
              ["Referral Program", "/refer-a-friend"],
            ]}
          />
          <FooterGroup
            className={styles.desktopGroup}
            title="Support"
            links={[
              ["Contact Us", "/contact"],
              ["FAQ", "/faq"],
            ]}
          />
        </nav>
        <aside className={styles.supportCard} aria-label="Support">
          <h3>24/7 Live Support</h3>
          <img
            className={styles.avatar}
            src={asset("support-avatar.a70df29b.png")}
            alt="Support representative"
            width={56}
            height={56}
            loading="lazy"
          />
          <p>
            Questions about your account, payments or games? Visit our help
            center.
          </p>
          <button
            className={styles.chatButton}
            type="button"
            onClick={() => chat.current?.showModal()}
          >
            Start Chat
          </button>
        </aside>
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.bottom}>
        <div
          className={styles.badges}
          aria-label="Responsible gaming information"
        >
          {badges.map(([label, image]) => (
            <img
              key={label}
              src={asset(image)}
              alt={label}
              height={40}
              loading="lazy"
            />
          ))}
        </div>
        <div className={styles.ageNotice}>
          <span>18+</span>
          <p>
            This demo is for adults aged 18 and over. Keep play within your
            limits and take regular breaks.
          </p>
        </div>
        <p className={styles.disclaimer}>
          Independent frontend demonstration. Games, odds, offers, account
          balances, and transactions are sample content. No real-money games,
          payments, or live support are connected. Player registration and sign-in are available.
        </p>
        <p className={styles.copyright}>© 2026 · Win777</p>
      </div>
      <dialog
        className={styles.chatDialog}
        ref={chat}
        aria-labelledby="footer-chat-heading"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeChat();
        }}
      >
        <div className={styles.chatPreview}>
          <button
            className={styles.closeChat}
            type="button"
            aria-label="Close support preview"
            onClick={closeChat}
          >
            <X size={20} />
          </button>
          <img
            className={styles.avatar}
            src={asset("support-avatar.a70df29b.png")}
            alt=""
            width={56}
            height={56}
          />
          <h2 id="footer-chat-heading">How can we help?</h2>
          <p>
            Live chat is not connected in this demo. Explore the support form or
            find an answer in our help center.
          </p>
          <Link href="/contact" className="primary" onClick={closeChat}>
            Contact support
          </Link>
          <Link href="/faq" className={styles.faqLink} onClick={closeChat}>
            Browse FAQs
          </Link>
        </div>
      </dialog>
    </footer>
  );
}
