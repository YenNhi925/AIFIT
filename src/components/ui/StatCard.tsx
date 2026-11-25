import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'default' | 'success' | 'error' | 'warning' | 'gold';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix = '',
  prefix = '',
  icon,
  trend,
  trendUp,
  color = 'default',
  className = '',
}) => {
  const colorMap = {
    default: 'text-text-primary',
    success: 'text-emerald-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    gold: 'text-gold',
  };

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-cream-border shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
          {label}
        </span>
        {icon && <div className="text-text-secondary/70">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <div className={`font-display font-bold text-3xl sm:text-4xl ${colorMap[color]}`}>
          <AnimatedNumber value={value} suffix={suffix} prefix={prefix} />
        </div>

        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
