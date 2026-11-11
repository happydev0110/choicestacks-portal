import styles from "./brand-logo.module.css";
import mobileLogo from "../../public/assets/choicestakes-mobile-logo.png";
import desktopLogo from "../../public/assets/choicestakes-desktop-logo.png";

export function BrandLogo({ variant = "header" }: { variant?: "header" | "drawer" | "banner" }) {
  return (
    <span className={`${styles.wordmark} ${styles[variant]}`}>
      <picture>
        {variant === "header" && <source media="(max-width: 700px)" srcSet={mobileLogo.src} width={mobileLogo.width} height={mobileLogo.height} />}
        <img
          className={styles.image}
          src={variant === "header" ? desktopLogo.src : "/assets/choicestakes-wordmark.png"}
          alt="Choicestakes"
          width={variant === "header" ? desktopLogo.width : 2172}
          height={variant === "header" ? desktopLogo.height : 724}
          fetchPriority={variant === "header" ? "high" : "auto"}
        />
      </picture>
    </span>
  );
}
