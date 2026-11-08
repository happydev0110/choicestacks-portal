"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Search,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, FreeMode } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { asset, type Game } from "../data";
import { allGames, casinoCategories, casinoCollections } from "../casino-data";
import { gameHref, slugify } from "../site-map";
import "swiper/css";
import "swiper/css/free-mode";
import "./casino.css";

function CasinoCard({ game }: { game: Game }) {
  return (
    <Link
      className="casino-game-card"
      href={gameHref(game.name)}
      aria-label={game.name}
    >
      <img
        src={asset(game.image)}
        alt={game.name}
        loading="lazy"
        width={125}
        height={166}
      />
      <span className="casino-card-overlay">
        <Play fill="currentColor" size={25} />
        <strong>{game.name}</strong>
      </span>
    </Link>
  );
}

function CasinoRow({
  collection,
  paused,
}: {
  collection: (typeof casinoCollections)[number];
  paused: boolean;
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (paused) swiper.autoplay.stop();
    else swiper.autoplay.start();
    return () => {
      if (!swiper.destroyed) swiper.autoplay.stop();
    };
  }, [swiper, paused]);
  const id = `casino-${slugify(collection.title)}`;
  return (
    <section className="casino-game-section" aria-labelledby={`${id}-heading`}>
      <div className="casino-row-heading">
        <h2 id={`${id}-heading`}>
          <img src={asset(collection.icon)} alt="" />
          {collection.title}
        </h2>
        <div className="casino-row-actions">
          {collection.href && (
            <Link href={collection.href} aria-label={`All ${collection.title}`}>
              All
            </Link>
          )}
          <button
            aria-label={`Previous ${collection.title}`}
            aria-controls={id}
            onClick={() => swiper?.slidePrev()}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label={`Next ${collection.title}`}
            aria-controls={id}
            onClick={() => swiper?.slideNext()}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <Swiper
        id={id}
        className="casino-game-swiper"
        modules={[A11y, Autoplay, FreeMode]}
        onSwiper={setSwiper}
        slidesPerView="auto"
        spaceBetween={11}
        breakpoints={{ 1024: { spaceBetween: 22 } }}
        speed={350}
        freeMode
        rewind
        grabCursor
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: false,
        }}
        a11y={{ containerMessage: `${collection.title} carousel` }}
      >
        {collection.items.map((game) => (
          <SwiperSlide key={game.name}>
            <CasinoCard game={game} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export function CasinoScreen() {
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  const search = query.trim().toLowerCase();
  const matches = allGames.filter((game) =>
    `${game.name} ${game.provider}`.toLowerCase().includes(search),
  );
  return (
    <div className="casino-lobby">
      <h1 className="sr-only">Online Casino</h1>
      <div className="casino-banner">
        <img
          src={asset("casino-banner.a71990e3.webp")}
          alt=""
          fetchPriority="high"
        />
      </div>
      <label className="casino-search">
        <Search size={17} />
        <input
          aria-label="Search casino games"
          placeholder="Search games"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button aria-label="Clear casino search" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}
      </label>
      <nav className="casino-category-nav" aria-label="Casino categories">
        {casinoCategories.map((category) => (
          <Link key={category.href} href={category.href}>
            <img src={asset(category.image)} alt="" />
            {category.name}
          </Link>
        ))}
      </nav>
      {search ? (
        <section
          className="casino-search-results"
          aria-label="Casino search results"
        >
          <p className="sr-only" role="status">
            {matches.length} {matches.length === 1 ? "game" : "games"} found
          </p>
          {matches.length ? (
            <div className="casino-results-grid">
              {matches.map((game) => (
                <CasinoCard key={game.name} game={game} />
              ))}
            </div>
          ) : (
            <div className="casino-search-empty">
              <Search size={32} />
              <h2>No games found</h2>
              <p>Try another game name.</p>
              <button className="secondary" onClick={() => setQuery("")}>
                Clear search
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="casino-collections">
            {casinoCollections.map((collection) => (
              <CasinoRow
                key={collection.title}
                collection={collection}
                paused={paused}
              />
            ))}
          </div>
          <div className="casino-motion-controls">
            <button onClick={() => setPaused((value) => !value)}>
              {paused ? <Play size={13} /> : <Pause size={13} />}{" "}
              {paused ? "Resume" : "Pause"} game carousels
            </button>
          </div>
        </>
      )}
    </div>
  );
}
