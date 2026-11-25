import React from 'react';

interface AnimatedContourLinesProps {
  opacity?: number;
  color?: string;
  className?: string;
}

export const AnimatedContourLines: React.FC<AnimatedContourLinesProps> = ({
  opacity = 0.12,
  color = '#C9A227',
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full object-cover"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,150 C300,50 600,280 1000,120 C1300,0 1500,200 1600,160"
          stroke={color}
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M-80,300 C250,200 650,450 1100,280 C1380,180 1520,380 1620,320"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M-120,480 C320,380 720,620 1150,460 C1420,350 1550,560 1640,500"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="8 6"
        />
        <path
          d="M-50,680 C280,560 800,800 1200,640 C1450,520 1580,720 1660,680"
          stroke={color}
          strokeWidth="1.4"
        />
        <path
          d="M-100,850 C350,720 780,950 1250,820 C1480,720 1600,880 1680,840"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="6 6"
        />
      </svg>
    </div>
  );
};
