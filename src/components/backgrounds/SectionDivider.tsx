import React from 'react';

interface SectionDividerProps {
  variant?: 'gold' | 'dark' | 'faint';
  withDot?: boolean;
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'gold',
  withDot = true,
  className = '',
}) => {
  const gradientMap = {
    gold: 'from-transparent via-gold/40 to-transparent',
    dark: 'from-transparent via-white/10 to-transparent',
    faint: 'from-transparent via-cream-border to-transparent',
  };

  return (
    <div className={`relative flex items-center justify-center py-6 ${className}`} aria-hidden="true">
      <div className={`h-[1px] w-full bg-gradient-to-r ${gradientMap[variant]}`} />
      {withDot && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(201,162,39,0.8)]" />
        </div>
      )}
    </div>
  );
};
