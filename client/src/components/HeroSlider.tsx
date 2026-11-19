import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { assetUrl } from '@/lib/brand';
import type { HeroSlide } from '@/types';

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    imageUrl: '/images/hero-chiffon.jpg',
    eyebrow: 'The atelier',
    headline: 'Abayas, cut for the evening',
    subheadline:
      'Double chiffon, premium nida and velvet — made in small runs and finished by hand in Mumbai.',
    ctaLabel: 'Enter the atelier',
    ctaHref: '/shop',
    active: true,
  },
];

const AUTOPLAY_MS = 6500;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HeroSlider() {
  const { settings } = useSettings();

  const slides = useMemo(() => {
    const configured = (settings.heroSlides ?? []).filter(
      (slide) => slide.active && (slide.imageUrl || slide.headline)
    );
    return configured.length ? configured : FALLBACK_SLIDES;
  }, [settings.heroSlides]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef<number | null>(null);

  const total = slides.length;
  const slide = slides[Math.min(index, total - 1)] ?? FALLBACK_SLIDES[0];

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total]
  );

  useEffect(() => {
    if (index > total - 1) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    setProgress(0);
    if (total < 2 || paused || prefersReducedMotion()) return;

    const started = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setProgress(Math.min(elapsed / AUTOPLAY_MS, 1));
      if (elapsed >= AUTOPLAY_MS) setIndex((current) => (current + 1) % total);
    }, 80);

    return () => window.clearInterval(tick);
  }, [index, paused, total]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative bg-obsidian"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1);
        if (event.key === 'ArrowLeft') go(index - 1);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
        if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <div className="grid lg:min-h-[88vh] lg:grid-cols-[minmax(0,42%)_1fr]">
        {/* Media — first on mobile, right on desktop */}
        <div className="relative order-1 h-[54vh] min-h-[380px] overflow-hidden lg:order-2 lg:h-auto">
          {slides.map((item, itemIndex) => {
            const src = item.imageUrl.startsWith('http') ? item.imageUrl : assetUrl(item.imageUrl);
            const isActive = itemIndex === index % total;
            return (
              <div
                key={`${item.imageUrl}-${itemIndex}`}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-[1200ms] ease-editorial ${
                  isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {src ? (
                  <img
                    src={src}
                    alt={item.headline || 'Team BlackSwan abaya'}
                    className={`h-full w-full object-cover object-[center_22%] ${
                      isActive ? 'animate-ken-burns' : ''
                    }`}
                    loading={itemIndex === 0 ? 'eager' : 'lazy'}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent lg:bg-gradient-to-r lg:from-obsidian/95 lg:via-obsidian/10 lg:to-transparent" />
              </div>
            );
          })}

          {/* Thumbnail rail */}
          {total > 1 ? (
            <div className="absolute bottom-5 right-4 hidden gap-2 sm:flex lg:bottom-8 lg:right-8 lg:flex-col">
              {slides.map((item, itemIndex) => {
                const thumb = item.imageUrl.startsWith('http')
                  ? item.imageUrl
                  : assetUrl(item.imageUrl);
                const isActive = itemIndex === index;
                return (
                  <button
                    key={`thumb-${itemIndex}`}
                    type="button"
                    onClick={() => go(itemIndex)}
                    aria-label={`Show slide ${itemIndex + 1}`}
                    aria-current={isActive}
                    className={`relative h-16 w-12 overflow-hidden border transition-all duration-300 lg:h-20 lg:w-14 ${
                      isActive
                        ? 'border-gold-400 opacity-100'
                        : 'border-ink/20 opacity-55 hover:opacity-90'
                    }`}
                  >
                    {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-px lg:bg-gradient-to-b" />
        </div>

        {/* Copy panel */}
        <div className="order-2 flex flex-col justify-between border-t border-gold-500/15 px-5 pb-8 pt-8 sm:px-8 lg:order-1 lg:border-r lg:border-t-0 lg:px-12 lg:py-14 xl:px-16">
          <div className="flex items-center justify-between gap-6">
            <p className="eyebrow">Team BlackSwan · Atelier</p>
            <p className="hidden text-[10px] uppercase tracking-wide2 text-ink-faint sm:block">
              Sizes 54 — 60
            </p>
          </div>

          <div key={index} className="mt-10 max-w-xl animate-fade-up lg:mt-0">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-sm text-gold-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="h-px w-10 bg-gold-500/50" />
              <span className="text-[10px] uppercase tracking-micro text-ink-faint">
                {String(total).padStart(2, '0')}
              </span>
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-micro text-gold-300">
              {slide.eyebrow || 'The collection'}
            </p>
            <h1 className="mt-4 font-display text-[2.7rem] leading-[1.02] text-ink text-balance sm:text-6xl xl:text-[4.3rem]">
              {slide.headline || 'Abayas, cut for the evening'}
            </h1>
            {slide.subheadline ? (
              <p className="mt-6 max-w-md text-sm leading-[1.9] text-ink-soft sm:text-[15px]">
                {slide.subheadline}
              </p>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to={slide.ctaHref || '/shop'} className="btn-solid">
                {slide.ctaLabel || 'Shop the collection'}
              </Link>
              <Link to="/contact" className="btn-line">
                Book an appointment
              </Link>
            </div>
          </div>

          <div className="mt-10 flex items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
                className="flex h-10 w-10 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
                className="flex h-10 w-10 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="ml-2 hidden text-[9px] uppercase tracking-micro text-ink-faint sm:block">
                {paused ? 'Paused' : 'Auto'}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-2 sm:max-w-[220px]">
              {slides.map((_item, itemIndex) => (
                <span key={`bar-${itemIndex}`} className="h-px flex-1 bg-ink/15">
                  <span
                    className="block h-px bg-gold-400 transition-[width] duration-100 ease-linear"
                    style={{
                      width: itemIndex < index ? '100%' : itemIndex === index ? `${progress * 100}%` : '0%',
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
