import React from 'react';
import { ParallaxImage } from './ParallaxImage';
import { AmbientLight } from './AmbientLight';
import { GrainOverlay } from './GrainOverlay';
import { FloatingParticles } from './FloatingParticles';

interface CinematicBackgroundProps {
  imageSrc?: string;
  imageOpacity?: number;
  showParticles?: boolean;
  particleCount?: number;
  ambientColor?: string;
  gradientOverlay?: string;
  children: React.ReactNode;
  className?: string;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=85',
  imageOpacity = 0.42,
  showParticles = true,
  particleCount = 40,
  ambientColor = '#C9A227',
  gradientOverlay = 'linear-gradient(to bottom, rgba(16,17,20,0.92) 0%, rgba(16,17,20,0.72) 40%, rgba(16,17,20,0.95) 100%)',
  children,
  className = '',
}) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-dark-bg text-white ${className}`}>
      {/* LAYER 1: Parallax Gym Background Image with slow zoom */}
      <ParallaxImage
        src={imageSrc}
        alt="AIFit Cinematic Athlete Training"
        opacity={imageOpacity}
        scale={true}
        parallaxSpeed={0.12}
      />

      {/* LAYER 2: Dark Gradient Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: gradientOverlay }}
        aria-hidden="true"
      />

      {/* LAYER 3: Ambient Gold Spotlight */}
      <AmbientLight
        color={ambientColor}
        position="center"
        size="hero"
        intensity={0.2}
      />

      {/* LAYER 4: Film Grain Texture */}
      <GrainOverlay opacity={0.038} />

      {/* LAYER 5: Floating Luminous Gold Dust */}
      {showParticles && (
        <FloatingParticles
          count={particleCount}
          color="#E7CA80"
          speed={0.25}
        />
      )}

      {/* LAYER 6: Foreground Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};
