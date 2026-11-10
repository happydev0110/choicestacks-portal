"use client";
import { asset } from "./data";
import { HeroCarousel } from "./components/hero-carousel";
import { BrandLogo } from "./components/brand-logo";
import { SportsbookSection } from "./components/sportsbook-section";
import { ProviderCatalog } from "./screens/provider-catalog";
import { useSite } from "./components/site-shell";

export default function Page() {
  const { navigate: choose } = useSite();
  return (
    <>
      <h1 className="sr-only">Choicestakes — Casino &amp; Sportsbook</h1>
      <HeroCarousel onChoose={choose} />
      <section className="feature-categories">
        <button onClick={() => choose("All Games")}>
          <h2>Explore Games</h2>
          <p>
            Discover the full collection
            <br />
            and save your favorites.
          </p>
          <img
            src={asset("live-casino-element.d7c46a6f.webp")}
            alt="Casino roulette and cards"
          />
        </button>
        <button onClick={() => choose("Sports")}>
          <h2>Sports</h2>
          <p>
            Explore football, basketball,
            <br />
            tennis and more.
          </p>
          <img src={asset("sports-trophy.429af003.webp")} alt="Sports trophy" />
        </button>
      </section>
      <ProviderCatalog embedded />
      <SportsbookSection />
      <section className="welcome-banner">
        <BrandLogo variant="banner" />
        <div>
          <span>YOUR NEXT GAME STARTS HERE</span>
          <h2>EXPLORE THE COLLECTION</h2>
          <p>Browse games from our connected providers.</p>
        </div>
        <button className="primary" onClick={() => choose("Game Providers")}>
          Browse providers
        </button>
      </section>
    </>
  );
}
