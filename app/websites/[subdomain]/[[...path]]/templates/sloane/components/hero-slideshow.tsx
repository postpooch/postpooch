"use client";

import { useEffect, useState } from "react";

type HeroSlideshowProps = {
  slides: readonly string[];
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="hero-slideshow">
      {slides.map((slide, i) => (
        <img
          key={`${slide}-${i}`}
          className={i === index ? "active" : ""}
          src={slide}
          alt="Luxury residential architecture"
        />
      ))}
      <div className="hero-shade" />
      <div className="hero-pagination">
        {slides.map((_, i) => (
          <button
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={i === index ? "active" : ""}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
