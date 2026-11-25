import React, { useEffect, useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt?: string;
  opacity?: number;
  scale?: boolean;
  parallaxSpeed?: number;
  className?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt = 'Background',
  opacity = 0.4,
  scale = true,
  parallaxSpeed = 0.15,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!container || !img) return;
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Calculate how far into view the element is
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const distance = (windowHeight / 2 - (rect.top + rect.height / 2)) * parallaxSpeed;
            img.style.setProperty('--parallax-y', `${distance.toFixed(1)}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxSpeed]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-transform will-change-transform ${
          scale ? 'animate-kenburns' : ''
        }`}
        style={{
          opacity,
          transform: `translateY(var(--parallax-y, 0px))`,
        }}
        loading="lazy"
      />
    </div>
  );
};
