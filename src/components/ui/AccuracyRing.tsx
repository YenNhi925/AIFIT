import React from 'react';
import { motion } from 'framer-motion';

interface AccuracyRingProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export const AccuracyRing: React.FC<AccuracyRingProps> = ({
  value,
  size = 'md',
  showLabel = true,
  className = '',
  animate = true,
}) => {
  const sizeConfig = {
    sm: { diameter: 48, strokeWidth: 4, text: 'text-xs' },
    md: { diameter: 72, strokeWidth: 6, text: 'text-base' },
    lg: { diameter: 100, strokeWidth: 8, text: 'text-2xl' },
    xl: { diameter: 140, strokeWidth: 10, text: 'text-4xl' },
  };

  const { diameter, strokeWidth, text } = sizeConfig[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 80) return '#16A34A'; // emerald
    if (v >= 50) return '#EA580C'; // warning amber
    return '#DC2626'; // error red
  };

  const ringColor = getColor(clampedValue);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: diameter, height: diameter }}
    >
      <svg width={diameter} height={diameter} className="rotate-[-90deg]">
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="#E8DFC8"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.4}
        />
        {animate ? (
          <motion.circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        ) : (
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        )}
      </svg>
      {showLabel && (
        <span
          className={`absolute font-display font-bold tabular-nums text-text-primary ${text}`}
        >
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
};
