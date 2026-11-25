import React from 'react';
import { AccuracyRing } from '../ui/AccuracyRing';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import type { Exercise } from '../../types';

interface WorkoutMetricsProps {
  exercise: Exercise;
  totalReps: number;
  correctReps: number;
  incorrectReps: number;
  holdSec: number;
  correctHoldSec: number;
  incorrectHoldSec: number;
  accuracy: number;
  elapsedSec: number;
}

export const WorkoutMetrics: React.FC<WorkoutMetricsProps> = ({
  exercise,
  totalReps,
  correctReps,
  incorrectReps,
  holdSec,
  correctHoldSec,
  incorrectHoldSec,
  accuracy,
  elapsedSec,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-3 h-full justify-between">
      {/* THẺ 1: TỔNG SỐ LẦN TẬP HOẶC THỜI GIAN GIỮ TƯ THẾ */}
      <div className="bg-dark-surface rounded-2xl p-5 border border-dark-card shadow-lg flex flex-col justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {exercise.mode === 'reps' ? 'Tổng số lần tập' : 'Thời gian giữ tư thế'}
        </span>
        <div className="font-display font-extrabold text-5xl sm:text-6xl text-white tracking-tight my-2">
          {exercise.mode === 'reps' ? (
            <AnimatedNumber value={totalReps} />
          ) : (
            <span className="tabular-nums">{formatTime(holdSec)}</span>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {exercise.mode === 'reps' ? 'Chu kỳ động tác hoàn thành' : 'Duy trì siết cơ liên tục'}
        </span>
      </div>

      {/* THẺ 2: SỐ LẦN TẬP ĐÚNG VS SỐ LẦN TẬP SAI */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Số lần tập đúng
          </span>
          <div className="font-display font-bold text-3xl sm:text-4xl text-emerald-300 my-1">
            {exercise.mode === 'reps' ? (
              <AnimatedNumber value={correctReps} />
            ) : (
              <span className="tabular-nums">{correctHoldSec}s</span>
            )}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium">Chuẩn kỹ thuật</span>
        </div>

        <div className="bg-red-950/40 rounded-2xl p-4 border border-red-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
            Số lần tập sai
          </span>
          <div className="font-display font-bold text-3xl sm:text-4xl text-red-300 my-1">
            {exercise.mode === 'reps' ? (
              <AnimatedNumber value={incorrectReps} />
            ) : (
              <span className="tabular-nums">{incorrectHoldSec}s</span>
            )}
          </div>
          <span className="text-[10px] text-red-400/80 font-medium">Sai lệch góc</span>
        </div>
      </div>

      {/* THẺ 3: ĐỘ CHÍNH XÁC */}
      <div className="bg-dark-surface rounded-2xl p-4 border border-dark-card shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            Độ chính xác
          </span>
          <p className="text-xs text-gray-400 max-w-[130px] leading-tight">
            Tỉ lệ chuẩn form đánh giá bởi AI
          </p>
        </div>
        <div className="shrink-0">
          <AccuracyRing value={accuracy} size="md" />
        </div>
      </div>

      {/* THẺ 4: THỜI GIAN TẬP LUYỆN */}
      <div className="bg-dark-surface rounded-2xl p-4 border border-dark-card shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            Thời gian tập luyện
          </span>
          <span className="font-mono font-bold text-2xl text-white tracking-wider">
            {formatTime(elapsedSec)}
          </span>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </div>
    </div>
  );
};
