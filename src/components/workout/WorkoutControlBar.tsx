import React from 'react';
import { Play, Pause, Volume2, VolumeX, Square } from 'lucide-react';

interface WorkoutControlBarProps {
  isPaused: boolean;
  isVoiceOn: boolean;
  onTogglePause: () => void;
  onToggleVoice: () => void;
  onStop: () => void;
}

export const WorkoutControlBar: React.FC<WorkoutControlBarProps> = ({
  isPaused,
  isVoiceOn,
  onTogglePause,
  onToggleVoice,
  onStop,
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-4 py-2">
      {/* PAUSE / RESUME */}
      <button
        type="button"
        onClick={onTogglePause}
        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-dark-surface border border-dark-card hover:border-gold/50 text-white font-display font-semibold text-sm shadow-md transition-all active:scale-95"
      >
        {isPaused ? (
          <>
            <Play className="w-4 h-4 fill-current text-emerald-400" />
            <span>Tiếp tục</span>
          </>
        ) : (
          <>
            <Pause className="w-4 h-4 text-amber-400" />
            <span>Tạm dừng</span>
          </>
        )}
      </button>

      {/* VOICE ON / OFF */}
      <button
        type="button"
        onClick={onToggleVoice}
        className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border font-display font-semibold text-sm shadow-md transition-all active:scale-95 ${
          isVoiceOn
            ? 'bg-dark-surface border-dark-card text-white hover:border-gold/50'
            : 'bg-dark-surface/60 border-dark-card text-gray-400 hover:text-white'
        }`}
      >
        {isVoiceOn ? (
          <>
            <Volume2 className="w-4 h-4 text-gold" />
            <span>Tắt giọng nói</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-gray-500" />
            <span>Bật giọng nói</span>
          </>
        )}
      </button>

      {/* STOP WORKOUT */}
      <button
        type="button"
        onClick={onStop}
        className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95"
      >
        <Square className="w-4 h-4 fill-current" />
        <span>Kết thúc buổi tập</span>
      </button>
    </div>
  );
};
