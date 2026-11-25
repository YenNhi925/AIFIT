import React from 'react';
import type { JointAngle } from '../../hooks/useWorkoutSimulator';

interface SkeletonCanvasProps {
  exerciseName: string;
  currentStatus: 'correct' | 'incorrect';
  jointAngles: JointAngle[];
}

export const SkeletonCanvas: React.FC<SkeletonCanvasProps> = ({
  exerciseName,
  currentStatus,
  jointAngles,
}) => {
  const isErr = currentStatus === 'incorrect';

  // Base colors
  const jointNormal = '#FFFFFF';
  const jointCorrect = '#16A34A';
  const jointError = '#DC2626';
  const boneNormal = 'rgba(255, 255, 255, 0.4)';
  const boneError = 'rgba(220, 38, 38, 0.8)';

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-lg aspect-square">
        <defs>
          <radialGradient id="errorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
        </defs>

        {exerciseName === 'Squat' && (
          <g>
            {/* SKELETON: Squat Profile View */}
            {/* Head */}
            <circle cx="170" cy="80" r="16" fill={jointNormal} />

            {/* Torso */}
            <line x1="170" y1="96" x2="140" y2="190" stroke={boneNormal} strokeWidth="6" strokeLinecap="round" />

            {/* Thigh (Hip to Knee) - Highlights on error */}
            <line
              x1="140"
              y1="190"
              x2="235"
              y2="205"
              stroke={isErr ? boneError : boneNormal}
              strokeWidth={isErr ? '8' : '6'}
              strokeLinecap="round"
            />

            {/* Shin (Knee to Ankle) */}
            <line
              x1="235"
              y1="205"
              x2="205"
              y2="330"
              stroke={isErr ? boneError : boneNormal}
              strokeWidth={isErr ? '8' : '6'}
              strokeLinecap="round"
            />

            {/* Foot */}
            <line x1="205" y1="330" x2="255" y2="330" stroke={boneNormal} strokeWidth="5" strokeLinecap="round" />

            {/* Arm for balance */}
            <line x1="165" y1="120" x2="230" y2="135" stroke={boneNormal} strokeWidth="5" strokeLinecap="round" />

            {/* Joint Markers */}
            {/* Shoulder */}
            <circle cx="165" cy="120" r="6" fill={jointNormal} />
            {/* Hip */}
            <circle cx="140" cy="190" r="7" fill={jointNormal} />

            {/* KNEE JOINT (Evaluated Joint) */}
            {isErr && <circle cx="235" cy="205" r="22" fill="url(#errorGlow)" />}
            <circle
              cx="235"
              cy="205"
              r={isErr ? '10' : '8'}
              fill={isErr ? jointError : jointCorrect}
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Ankle */}
            <circle cx="205" cy="330" r="6" fill={jointNormal} />

            {/* Joint Angle Overlay Pill */}
            {jointAngles.length > 0 && (
              <g transform="translate(250, 180)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="34"
                  rx="10"
                  fill="#101114"
                  stroke={isErr ? '#DC2626' : '#16A34A'}
                  strokeWidth="1.5"
                />
                <text x="10" y="15" fill="#A0A0A0" fontSize="9" fontWeight="bold" fontFamily="Inter">
                  {jointAngles[0].name.toUpperCase()}
                </text>
                <text
                  x="10"
                  y="28"
                  fill={isErr ? '#EF4444' : '#22C55E'}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="Space Grotesk"
                >
                  {jointAngles[0].angle}° ({jointAngles[0].targetRange})
                </text>
              </g>
            )}
          </g>
        )}

        {exerciseName === 'Plank' && (
          <g transform="translate(20, 50)">
            {/* SKELETON: Plank Profile View */}
            {/* Head */}
            <circle cx="60" cy="120" r="14" fill={jointNormal} />

            {/* Forearm support */}
            <line x1="90" y1="140" x2="90" y2="200" stroke={boneNormal} strokeWidth="6" strokeLinecap="round" />
            <line x1="90" y1="200" x2="130" y2="200" stroke={boneNormal} strokeWidth="6" strokeLinecap="round" />

            {/* Shoulder to Hip */}
            <line
              x1="90"
              y1="140"
              x2="210"
              y2={isErr ? '180' : '160'}
              stroke={isErr ? boneError : boneNormal}
              strokeWidth={isErr ? '8' : '6'}
              strokeLinecap="round"
            />

            {/* Hip to Ankle */}
            <line
              x1="210"
              y1={isErr ? '180' : '160'}
              x2="330"
              y2="175"
              stroke={isErr ? boneError : boneNormal}
              strokeWidth={isErr ? '8' : '6'}
              strokeLinecap="round"
            />

            {/* Feet */}
            <line x1="330" y1="175" x2="330" y2="200" stroke={boneNormal} strokeWidth="5" strokeLinecap="round" />

            {/* Joints */}
            <circle cx="90" cy="140" r="7" fill={jointNormal} />

            {/* HIP JOINT (Evaluated Joint) */}
            {isErr && <circle cx="210" cy="180" r="22" fill="url(#errorGlow)" />}
            <circle
              cx="210"
              cy={isErr ? '180' : '160'}
              r={isErr ? '10' : '8'}
              fill={isErr ? jointError : jointCorrect}
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            <circle cx="330" cy="175" r="6" fill={jointNormal} />

            {/* Joint Angle Pill */}
            {jointAngles.length > 0 && (
              <g transform="translate(140, 95)">
                <rect
                  x="0"
                  y="0"
                  width="145"
                  height="34"
                  rx="10"
                  fill="#101114"
                  stroke={isErr ? '#DC2626' : '#16A34A'}
                  strokeWidth="1.5"
                />
                <text x="10" y="15" fill="#A0A0A0" fontSize="9" fontWeight="bold" fontFamily="Inter">
                  BODY ALIGNMENT
                </text>
                <text
                  x="10"
                  y="28"
                  fill={isErr ? '#EF4444' : '#22C55E'}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="Space Grotesk"
                >
                  {jointAngles[0].angle}° ({jointAngles[0].targetRange})
                </text>
              </g>
            )}
          </g>
        )}

        {exerciseName === 'Push-up' && (
          <g transform="translate(20, 50)">
            {/* SKELETON: Push-up Profile View */}
            <circle cx="70" cy="100" r="14" fill={jointNormal} />

            {/* Shoulder to Elbow */}
            <line
              x1="100"
              y1="120"
              x2="125"
              y2="160"
              stroke={isErr ? boneError : boneNormal}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Elbow to Wrist */}
            <line
              x1="125"
              y1="160"
              x2="125"
              y2="200"
              stroke={isErr ? boneError : boneNormal}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Torso straight line */}
            <line x1="100" y1="120" x2="320" y2="180" stroke={boneNormal} strokeWidth="6" strokeLinecap="round" />
            <line x1="320" y1="180" x2="320" y2="200" stroke={boneNormal} strokeWidth="5" strokeLinecap="round" />

            <circle cx="100" cy="120" r="7" fill={jointNormal} />

            {/* ELBOW JOINT (Evaluated Joint) */}
            {isErr && <circle cx="125" cy="160" r="22" fill="url(#errorGlow)" />}
            <circle
              cx="125"
              cy="160"
              r={isErr ? '10' : '8'}
              fill={isErr ? jointError : jointCorrect}
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            <circle cx="125" cy="200" r="6" fill={jointNormal} />
            <circle cx="320" cy="180" r="6" fill={jointNormal} />

            {/* Angle Pill */}
            {jointAngles.length > 0 && (
              <g transform="translate(145, 110)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="34"
                  rx="10"
                  fill="#101114"
                  stroke={isErr ? '#DC2626' : '#16A34A'}
                  strokeWidth="1.5"
                />
                <text x="10" y="15" fill="#A0A0A0" fontSize="9" fontWeight="bold" fontFamily="Inter">
                  ELBOW FLEXION
                </text>
                <text
                  x="10"
                  y="28"
                  fill={isErr ? '#EF4444' : '#22C55E'}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="Space Grotesk"
                >
                  {jointAngles[0].angle}° ({jointAngles[0].targetRange})
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
