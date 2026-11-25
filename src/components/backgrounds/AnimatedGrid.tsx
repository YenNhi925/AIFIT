import React from 'react';

interface AnimatedGridProps {
  opacity?: number;
  showRadar?: boolean;
  className?: string;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  opacity = 0.15,
  showRadar = true,
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Precision Grid lines */}
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(201, 162, 39, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201, 162, 39, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
        }}
      />

      {/* Orbiting Faint Radar Circles */}
      {showRadar && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-[600px] w-[600px]">
            <div className="absolute inset-0 rounded-full border border-gold/20" />
            <div className="absolute inset-[80px] rounded-full border border-gold/15" />
            <div className="absolute inset-[160px] rounded-full border border-gold/10" />
            <div className="absolute inset-[240px] rounded-full border border-gold/15 border-dashed animate-spin-slow" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
            <div className="absolute left-0 top-1/2 h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};
