"use client";

import { useEffect, useState } from "react";

import { CloseIcon } from "./icons";

type PropertyGalleryProps = {
  images: string[];
  address: string;
};

export function PropertyGallery({ images, address }: PropertyGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <div className="property-gallery">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            className={`gallery-item item-${i + 1}`}
            onClick={() => setActive(i)}
          >
            <img src={image} alt={`${address} photo ${i + 1}`} />
            {i === 0 && <span>View photos</span>}
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
          <button
            className="lightbox-nav prev"
            type="button"
            onClick={() => setActive((active - 1 + images.length) % images.length)}
            aria-label="Previous photo"
          >
            ←
          </button>
          <img src={images[active]} alt={`${address} large photo ${active + 1}`} />
          <button
            className="lightbox-nav next"
            type="button"
            onClick={() => setActive((active + 1) % images.length)}
            aria-label="Next photo"
          >
            →
          </button>
          <span className="lightbox-count">
            {active + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
