import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutSimulator } from '../../hooks/useWorkoutSimulator';
import { SkeletonCanvas } from '../../components/workout/SkeletonCanvas';
import { WorkoutMetrics } from '../../components/workout/WorkoutMetrics';
import { FeedbackPanel } from '../../components/workout/FeedbackPanel';
import { WorkoutControlBar } from '../../components/workout/WorkoutControlBar';
import { SystemMessages } from '../../components/workout/SystemMessages';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { WorkoutSession } from '../../types';

export default function LiveWorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [hasCameraStream, setHasCameraStream] = useState(false);

  const {
    exercise,
    workoutState,
    setWorkoutState,
    countdown,
    elapsedSec,
    totalReps,
    correctReps,
    incorrectReps,
    holdSec,
    correctHoldSec,
    incorrectHoldSec,
    accuracy,
    currentStatus,
    feedback,
    isVoiceOn,
    jointAngles,
    repResults,
    errorsSummary,
    bodyLostCount,
    isOffline,
    togglePause,
    toggleVoice,
    retryCamera,
  } = useWorkoutSimulator(Number(id));

  // Request actual camera feed for local mirror preview
  useEffect(() => {
    let active = true;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraStream(true);
      } catch (err) {
        console.warn('Camera access unavailable, proceeding in demo visualization mode:', err);
        setHasCameraStream(false);
      }
    }

    initCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Keyboard shortcut: Phím cách (Space) để Tạm dừng/Tiếp tục
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showStopConfirm) {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, showStopConfirm]);

  const handleStopClick = () => {
    if (workoutState === 'running') {
      togglePause(); // tự động tạm dừng khi hiện hộp thoại xác nhận
    }
    setShowStopConfirm(true);
  };

  const handleEndAndSave = () => {
    setShowStopConfirm(false);
    setWorkoutState('saving');

    // Tạo tóm tắt buổi tập
    const newSession: WorkoutSession = {
      id: Date.now(),
      exerciseId: exercise.id,
      exercise: exercise.name,
      date: new Date().toISOString(),
      durationSec: elapsedSec,
      totalReps: exercise.mode === 'reps' ? totalReps : 0,
      correctReps: exercise.mode === 'reps' ? correctReps : 0,
      incorrectReps: exercise.mode === 'reps' ? incorrectReps : 0,
      accuracy,
      correctHoldSec: exercise.mode === 'hold' ? correctHoldSec : undefined,
      incorrectHoldSec: exercise.mode === 'hold' ? incorrectHoldSec : undefined,
      repResults: repResults.length > 0 ? repResults : [
        { rep: 1, correct: true },
        { rep: 2, correct: true },
        { rep: 3, correct: false, errors: [errorsSummary[0]?.label || 'Lỗi lệch form'] },
      ],
      errors: errorsSummary.length > 0 ? errorsSummary : [{ label: 'Lệch nhẹ biên độ', count: 1 }],
      avgFps: 28,
      avgVisibility: 0.92,
      bodyLostCount,
      synced: !isOffline,
    };

    localStorage.setItem('aifit_latest_session', JSON.stringify(newSession));

    setTimeout(() => {
      navigate(`/session/${newSession.id}/summary`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-obsidian text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none overflow-hidden relative font-body selection:bg-gold/30 selection:text-white">
      {/* CÁC THÔNG BÁO HỆ THỐNG (UI-09) */}
      <SystemMessages
        workoutState={workoutState}
        countdown={countdown}
        isOffline={isOffline}
        onRetryCamera={retryCamera}
        onBackToExercises={() => navigate('/')}
      />

      {/* THANH TIÊU ĐỀ TRÊN CÙNG: Bài tập & Trạng thái */}
      <header className="flex items-center justify-between pb-4 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center font-display font-black text-white text-base">
            AI
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
              Tập trực tiếp: {exercise.name}
            </h1>
            <span className="text-[11px] font-mono text-gray-400">
              Khớp theo dõi: {exercise.jointSet}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-surface border border-dark-card text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono font-bold text-gray-300">
              {hasCameraStream ? 'CAMERA ĐANG BẬT' : 'CHẾ ĐỘ MÔ PHỎNG AI'}
            </span>
          </div>
          <span className="text-xs font-mono text-champagne hidden sm:inline">28 FPS</span>
        </div>
      </header>

      {/* KHUNG TẬP CHÍNH (Video 70% | Thông số 30%) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 items-stretch min-h-0">
        {/* BÊN TRÁI: Video & Khung xương AI (8 cột) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative flex-1 rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center min-h-[380px] lg:min-h-0">
            {/* Luồng camera thực tế hoặc Nền Studio ảo */}
            {hasCameraStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] opacity-75"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-dark-surface via-black to-dark-bg flex items-center justify-center">
                <div className="text-center p-6 space-y-2 opacity-30">
                  <p className="font-display font-bold text-lg text-white">Khung Theo Dõi Chuyển Động AI</p>
                  <p className="text-xs font-mono text-gray-400">Camera xử lý trực tiếp trên trình duyệt</p>
                </div>
              </div>
            )}

            {/* SKELETON CANVAS OVERLAY */}
            <SkeletonCanvas
              exerciseName={exercise.name}
              currentStatus={currentStatus}
              jointAngles={jointAngles}
            />

            {/* HUY HIỆU TRẠNG THÁI THỜI GIAN THỰC */}
            <div className="absolute top-5 left-5 z-20">
              <div
                className={`px-4 py-2 rounded-2xl font-display font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-xl backdrop-blur-md flex items-center gap-2 transition-all ${
                  workoutState === 'countdown' || elapsedSec < 2
                    ? 'bg-amber-600/90 text-white border border-amber-400/40'
                    : currentStatus === 'correct'
                    ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                    : 'bg-red-600/90 text-white border border-red-400/40'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>
                  {workoutState === 'countdown' || elapsedSec < 2
                    ? 'Đang nhận diện tư thế'
                    : currentStatus === 'correct'
                    ? 'Tư thế đúng'
                    : 'Tư thế chưa đúng'}
                </span>
              </div>
            </div>

            {/* Dấu bảo mật dữ liệu */}
            <div className="absolute bottom-4 left-5 z-20 pointer-events-none opacity-40 text-[10px] font-mono text-gray-400">
              AIFIT LOCAL EDGE INFERENCE • KHÔNG LƯU VIDEO ĐÁM MÂY
            </div>
          </div>

          {/* THANH PHẢN HỒI THỜI GIAN THỰC */}
          <FeedbackPanel
            feedbackText={feedback.text}
            isError={feedback.isError}
            isVoiceOn={isVoiceOn}
          />
        </div>

        {/* BÊN PHẢI: Bảng Thông số thời gian thực (4 cột) */}
        <div className="lg:col-span-4 h-full">
          <WorkoutMetrics
            exercise={exercise}
            totalReps={totalReps}
            correctReps={correctReps}
            incorrectReps={incorrectReps}
            holdSec={holdSec}
            correctHoldSec={correctHoldSec}
            incorrectHoldSec={incorrectHoldSec}
            accuracy={accuracy}
            elapsedSec={elapsedSec}
          />
        </div>
      </main>

      {/* THANH ĐIỀU KHIỂN TẬP LUYỆN */}
      <footer className="pt-2 z-10">
        <WorkoutControlBar
          isPaused={workoutState === 'paused'}
          isVoiceOn={isVoiceOn}
          onTogglePause={togglePause}
          onToggleVoice={toggleVoice}
          onStop={handleStopClick}
        />
      </footer>

      {/* HỘP THOẠI XÁC NHẬN DỪNG TẬP */}
      <ConfirmDialog
        isOpen={showStopConfirm}
        title="Dừng buổi tập và lưu kết quả?"
        description={`Bạn đã hoàn thành ${
          exercise.mode === 'reps' ? `${totalReps} lần tập` : `${holdSec} giây giữ tư thế`
        } với độ chính xác tư thế đạt ${accuracy}%. Bạn có muốn kết thúc buổi tập và xem tổng quan kết quả không?`}
        confirmLabel="Kết thúc buổi tập"
        cancelLabel="Tiếp tục"
        confirmVariant="default"
        onConfirm={handleEndAndSave}
        onCancel={() => {
          setShowStopConfirm(false);
          if (workoutState === 'paused') togglePause();
        }}
      />
    </div>
  );
}
