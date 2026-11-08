"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, FreeMode } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { asset } from "../data";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./sportsbook-section.module.css";

const sports = [
  { name: "Football", image: "football.2efdf0b1.png", sport: "football" },
  { name: "Tennis", image: "tennis.c4968e83.png", sport: "tennis" },
  { name: "Basketball", image: "basketball.d0d9105e.png", sport: "basketball" },
  { name: "E-Sports", image: "esports.84f5317a.png", sport: "e-sports" },
  { name: "Horse Racing", image: "horse-racing.13387785.png" },
  { name: "American Football", image: "american-football.b1544a10.png" },
  { name: "FIFA" },
  { name: "Ice Hockey" },
  { name: "Cricket" },
  { name: "Table Tennis" },
  { name: "Volleyball" },
  { name: "Baseball" },
];

export function SportsbookSection() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(preference.matches);
      setPaused(preference.matches);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (paused || focused) swiper.autoplay.stop();
    else swiper.autoplay.start();
    return () => {
      if (!swiper.destroyed) swiper.autoplay.stop();
    };
  }, [swiper, paused, focused]);

  return (
    <div className={styles.section} id="sportsbook-section">
      <section
        className={styles.banner}
        aria-labelledby="sportsbook-banner-title"
      >
        <img
          className={styles.background}
          src={asset("sports-banner-bg.8209c6da.jpg")}
          alt=""
          loading="lazy"
        />
        <div className={styles.mobileShade} aria-hidden="true" />
        <img
          className={styles.dice}
          src={asset("sports-banner-dice.08ed6df1.jpg")}
          alt=""
          loading="lazy"
        />
        <div className={styles.darkGlow} aria-hidden="true" />
        <div className={styles.copy}>
          <h2 id="sportsbook-banner-title">Sportsbook</h2>
          <p>Football, tennis, basketball and 30+ more.</p>
          <Link className={styles.action} href="/sportsbook">
            View Sports
          </Link>
        </div>
        <div className={styles.players}>
          <img
            src={asset("sports-banner-players.53725dc0.png")}
            alt="Football players competing for the ball"
            loading="lazy"
          />
        </div>
        <div className={styles.lightGlow} aria-hidden="true" />
      </section>

      <section
        className={styles.categories}
        aria-labelledby="sportsbook-categories-title"
        aria-roledescription="carousel"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
      >
        <div className={styles.heading}>
          <h2 id="sportsbook-categories-title">
            <img src={asset("football.2efdf0b1.png")} alt="" />
            Sportsbook
          </h2>
          <div className={styles.controls}>
            <Link href="/sportsbook" aria-label="All sports">
              All
            </Link>
            <button
              aria-label={
                paused ? "Resume sports autoplay" : "Pause sports autoplay"
              }
              aria-controls="sportsbook-categories"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}
            </button>
            <button
              aria-label="Previous sports"
              aria-controls="sportsbook-categories"
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              aria-label="Next sports"
              aria-controls="sportsbook-categories"
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
        <Swiper
          id="sportsbook-categories"
          className={styles.carousel}
          modules={[A11y, Autoplay, FreeMode]}
          onSwiper={setSwiper}
          slidesPerView="auto"
          spaceBetween={11}
          breakpoints={{ 1024: { spaceBetween: 22 } }}
          speed={reducedMotion ? 0 : 400}
          rewind
          freeMode
          grabCursor
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: false,
          }}
          a11y={{ containerMessage: "Sports categories" }}
        >
          {sports.map((sport) => (
            <SwiperSlide className={styles.slide} key={sport.name}>
              <Link
                className={styles.card}
                href={
                  sport.sport
                    ? `/sportsbook?sport=${sport.sport}`
                    : "/sportsbook"
                }
                aria-label={sport.name}
                draggable={false}
              >
                <span className={styles.art}>
                  {sport.image ? (
                    <img
                      src={asset(sport.image)}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <span
                      className={`${styles.wordmark} ${sport.name === "FIFA" ? styles.fifa : ""}`}
                    >
                      {sport.name}
                    </span>
                  )}
                </span>
                <span className={styles.label}>{sport.name}</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
