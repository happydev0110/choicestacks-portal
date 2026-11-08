'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { asset, banners } from '../data';
import 'swiper/css';
import 'swiper/css/pagination';
import './hero-carousel.css';

export function HeroCarousel({ onChoose }: { onChoose: (target: string) => void }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Reduced motion changes the transition, not whether offers advance.
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (paused) swiper.autoplay.stop();
    else swiper.autoplay.start();
    return () => { if (!swiper.destroyed) swiper.autoplay.stop(); };
  }, [swiper, paused]);

  return (
    <section className="hero-carousel" aria-label="Featured promotions" aria-roledescription="carousel">
      <Swiper
        className="promo-swiper"
        modules={[Autoplay, Pagination, A11y]}
        onSwiper={setSwiper}
        slidesPerView={1}
        breakpoints={{ 640: { slidesPerView: 'auto' } }}
        spaceBetween={16}
        speed={reducedMotion ? 0 : 900}
        rewind
        grabCursor
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          // CSS or reduced-motion settings can suppress transitionend entirely.
          waitForTransition: false,
        }}
        pagination={{ clickable: true }}
        a11y={{ paginationBulletMessage: 'Show promotion group {{index}}' }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.name}>
            <button className="promo-card" draggable={false} onClick={() => onChoose(banner.target)} aria-label={banner.name}>
              <img src={asset(banner.image)} alt="" draggable={false} />
              <span className="promo-shade" />
              <span className="promo-copy">
                <strong>{banner.name}</strong>
                <span>{banner.description}</span>
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        className="promo-playback"
        aria-label={paused ? 'Resume banner autoplay' : 'Pause banner autoplay'}
        title={paused ? 'Resume banner autoplay' : 'Pause banner autoplay'}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={12} /> : <Pause size={12} />}
      </button>
    </section>
  );
}
