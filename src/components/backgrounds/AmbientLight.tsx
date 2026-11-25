import React from 'react';

interface AmbientLightProps {
  color?: string; // e.g. '#C9A227' or '#E7CA80'
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  intensity?: number; // 0 to 1
  animate?: boolean;
  className?: string;
}

export const AmbientLight: React.FC<AmbientLightProps> = ({
  color = '#C9A227',
  position = 'center',
  size = 'md',
  intensity = 0.18,
  animate = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-[300px] h-[300px]',
    md: 'w-[500px] h-[500px]',
    lg: 'w-[800px] h-[800px]',
    hero: 'w-[1200px] h-[700px]',
  };

  const posMap = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
    'top-right': 'top-0 right-0 translate-x-1/4 -translate-y-1/4',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
    'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
  };

  return (
    <div
      className={`pointer-events-none absolute ${posMap[position]} ${sizeMap[size]} rounded-full blur-[120px] transition-all ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
      style={{
        backgroundColor: color,
        opacity: intensity,
        animationDuration: animate ? '8s' : undefined,
      }}
      aria-hidden="true"
    />
  );
};
