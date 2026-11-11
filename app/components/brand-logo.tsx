import styles from "./brand-logo.module.css";
import mobileLogo from "../icon.png";

export function BrandLogo({ variant = "header" }: { variant?: "header" | "drawer" | "banner" }) {
  return (
    <span className={`${styles.wordmark} ${styles[variant]}`}>
      <picture>
        {variant === "header" && <source media="(max-width: 700px)" srcSet={mobileLogo.src} width={750} height={750} />}
        <img
          className={styles.image}
          src="/assets/choicestakes-wordmark.png"
          alt="Choicestakes"
          width={2172}
          height={724}
          fetchPriority={variant === "header" ? "high" : "auto"}
        />
      </picture>
    </span>
  );
}
