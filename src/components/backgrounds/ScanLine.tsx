import React from 'react';

interface ScanLineProps {
  color?: string;
  durationSec?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const ScanLine: React.FC<ScanLineProps> = ({
  color = '#C9A227',
  durationSec = 6,
  direction = 'vertical',
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {direction === 'vertical' ? (
        <div
          className="absolute left-0 right-0 h-[2px] opacity-75 shadow-[0_0_12px_2px_rgba(201,162,39,0.6)] animate-scan-y"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            animationDuration: `${durationSec}s`,
          }}
        />
      ) : (
        <div
          className="absolute bottom-0 top-0 w-[2px] opacity-75 shadow-[0_0_12px_2px_rgba(201,162,39,0.6)] animate-scan-x"
          style={{
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            animationDuration: `${durationSec}s`,
          }}
        />
      )}
    </div>
  );
};
