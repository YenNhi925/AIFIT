import React from 'react';
import { GrainOverlay } from './GrainOverlay';
import { AmbientLight } from './AmbientLight';

interface SectionBackgroundProps {
  variant?: 'dark' | 'cream' | 'tech' | 'athletic';
  children?: React.ReactNode;
  showGrain?: boolean;
  showAmbientLight?: boolean;
  ambientLightColor?: string;
  ambientLightPos?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({
  variant = 'dark',
  children,
  showGrain = true,
  showAmbientLight = true,
  ambientLightColor = '#C9A227',
  ambientLightPos = 'center',
  className = '',
}) => {
  const bgStyles = {
    dark: 'bg-dark-bg text-white',
    cream: 'bg-cream text-text-primary',
    tech: 'bg-dark-surface text-white',
    athletic: 'bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg text-white',
  };

  return (
    <div className={`relative overflow-hidden ${bgStyles[variant]} ${className}`}>
      {showAmbientLight && (
        <AmbientLight
          color={ambientLightColor}
          position={ambientLightPos}
          size="lg"
          intensity={variant === 'cream' ? 0.08 : 0.14}
        />
      )}
      {showGrain && <GrainOverlay opacity={variant === 'cream' ? 0.02 : 0.035} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
