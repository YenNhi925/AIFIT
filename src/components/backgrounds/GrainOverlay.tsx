import React from 'react';

interface GrainOverlayProps {
  opacity?: number;
  className?: string;
}

export const GrainOverlay: React.FC<GrainOverlayProps> = ({
  opacity = 0.035,
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="aifit-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#aifit-grain)" />
      </svg>
    </div>
  );
};
