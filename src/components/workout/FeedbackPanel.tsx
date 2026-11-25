import React from 'react';
import { Volume2, VolumeX, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FeedbackPanelProps {
  feedbackText: string;
  isError: boolean;
  isVoiceOn: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedbackText,
  isError,
  isVoiceOn,
}) => {
  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 flex items-center justify-between border transition-all duration-300 shadow-md ${
        isError
          ? 'bg-amber-950/80 border-amber-500/50 text-amber-100'
          : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isError ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {isError ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest block opacity-75 mb-0.5">
            Phản hồi từ AI
          </span>
          <p className="font-display font-bold text-base sm:text-lg truncate tracking-tight">
            {feedbackText}
          </p>
        </div>
      </div>

      {/* Voice status */}
      <div className="flex items-center gap-3 pl-4 shrink-0">
        {isVoiceOn ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs text-gray-300">
            <Volume2 className="w-4 h-4 text-gold shrink-0" />
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-gold animate-pulse" />
              <span className="w-0.5 h-3 bg-gold animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-gold animate-pulse delay-150" />
            </div>
            <span className="text-[11px] hidden sm:inline text-gold">Giọng nói bật</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/30 text-xs text-gray-400">
            <VolumeX className="w-4 h-4" />
            <span className="text-[11px] hidden sm:inline">Tắt tiếng</span>
          </div>
        )}
      </div>
    </div>
  );
};
