"use client";

import { ReceiptText, RefreshCw } from "lucide-react";
import { useGameWallet } from "../components/game-wallet";
import styles from "./bet-history.module.css";

export function BetHistory() {
  const { wallet, error, loading, refresh } = useGameWallet();
  return <section className={`panel ${styles.panel}`}>
    <div className={styles.heading}>
      <div><h2>Recent game activity</h2><p>Your latest 20 game balance movements, including bets, wins, and reversals.</p></div>
      <button className="secondary" onClick={refresh} disabled={loading} aria-label="Refresh bet history"><RefreshCw size={16} /></button>
    </div>
    {error ? <p role="status">Game activity is temporarily unavailable. Use refresh to try again.</p>
      : !wallet ? <p role="status">Loading game activity…</p>
      : !wallet.transactions.length ? <div className={styles.empty}><ReceiptText size={32} /><h3>No game activity yet</h3><p>Your game activity will appear here after you play.</p></div>
      : <div className={styles.scroll}><table>
        <caption className={styles.caption}>Recent game balance movements in {wallet.currency}</caption>
        <thead><tr><th scope="col">Activity</th><th scope="col">Amount ({wallet.currency})</th><th scope="col">Status</th><th scope="col">Time</th></tr></thead>
        <tbody>{wallet.transactions.map((transaction, index) => {
          // MySQL timestamps without an offset are shown as supplied, not assigned a guessed timezone.
          const date = transaction.createdAt.replace("T", " ").replace(/\.\d+(?=Z?$)/, "").replace(/Z$/, " UTC");
          return <tr key={`${transaction.createdAt}-${index}`}>
            <td className={styles.action}>{transaction.action.replaceAll("_", " ")}</td>
            <td className={styles.amount}>{transaction.amount}</td>
            <td>{transaction.errorCode ? "Refused" : transaction.reversed ? "Reversed" : "Completed"}</td>
            <td><time dateTime={transaction.createdAt}>{date}</time></td>
          </tr>;
        })}</tbody>
      </table></div>}
  </section>;
}
