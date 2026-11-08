import styles from "./brand-logo.module.css";

export function BrandLogo({ variant = "header" }: { variant?: "header" | "drawer" | "banner" }) {
  return (
    <span className={`${styles.wordmark} ${styles[variant]}`}>
      <img
        className={styles.image}
        src="/assets/choicestakes-wordmark.png"
        alt="Choicestakes"
        width={2172}
        height={724}
        fetchPriority={variant === "header" ? "high" : "auto"}
      />
    </span>
  );
}
