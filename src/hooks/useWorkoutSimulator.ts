import { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_EXERCISES, MOCK_RULES } from '../data/mockData';
import type { Exercise, RepResult, ErrorSummary } from '../types';

export type WorkoutState =
  | 'requesting-camera'
  | 'camera-denied'
  | 'loading-model'
  | 'countdown'
  | 'running'
  | 'paused'
  | 'body-lost'
  | 'saving';

export interface JointAngle {
  name: string;
  angle: number;
  isError: boolean;
  targetRange: string;
}

export function useWorkoutSimulator(exerciseId: number) {
  const exercise = MOCK_EXERCISES.find(e => e.id === exerciseId) || MOCK_EXERCISES[0];

  const [workoutState, setWorkoutState] = useState<WorkoutState>('requesting-camera');
  const [countdown, setCountdown] = useState<number>(3);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Repetition and Hold counters
  const [totalReps, setTotalReps] = useState(0);
  const [correctReps, setCorrectReps] = useState(0);
  const [incorrectReps, setIncorrectReps] = useState(0);

  // Plank Hold counters
  const [holdSec, setHoldSec] = useState(0);
  const [correctHoldSec, setCorrectHoldSec] = useState(0);
  const [incorrectHoldSec, setIncorrectHoldSec] = useState(0);

  // Performance
  const [currentStatus, setCurrentStatus] = useState<'correct' | 'incorrect'>('correct');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean }>({
    text: 'Vào tư thế chuẩn bị...',
    isError: false,
  });

  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [jointAngles, setJointAngles] = useState<JointAngle[]>([]);
  const [repResults, setRepResults] = useState<RepResult[]>([]);
  const [errorsSummary, setErrorsSummary] = useState<ErrorSummary[]>([]);
  const [bodyLostCount, setBodyLostCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Speech cooldown ref
  const lastSpokenTimeRef = useRef<{ [key: string]: number }>({});
  const repPhaseRef = useRef<'top' | 'going-down' | 'bottom' | 'going-up'>('top');
  const currentRepErrorsRef = useRef<string[]>([]);
  const timerRef = useRef<number | null>(null);

  // Speak helper with 3.5s cooldown
  const speakFeedback = useCallback((text: string) => {
    if (!isVoiceOn || !('speechSynthesis' in window)) return;
    const now = Date.now();
    const lastSpoken = lastSpokenTimeRef.current[text] || 0;
    if (now - lastSpoken < 3500) return; // 3.5s cooldown

    lastSpokenTimeRef.current[text] = now;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.lang = 'vi-VN';
    window.speechSynthesis.speak(utterance);
  }, [isVoiceOn]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // INITIAL BOOTSTRAP: camera -> model -> countdown -> running
  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    if (workoutState === 'requesting-camera') {
      t1 = setTimeout(() => {
        setWorkoutState('loading-model');
      }, 1000);
    } else if (workoutState === 'loading-model') {
      t2 = setTimeout(() => {
        setWorkoutState('countdown');
      }, 1400);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [workoutState]);

  // Countdown timer: 3 -> 2 -> 1 -> BẮT ĐẦU!
  useEffect(() => {
    if (workoutState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setWorkoutState('running');
      setFeedback({ text: 'Tư thế rất tốt! Tiếp tục phát huy.', isError: false });
    }
  }, [workoutState, countdown]);

  // Workout clock (elapsed seconds)
  useEffect(() => {
    if (workoutState === 'running') {
      timerRef.current = window.setInterval(() => {
        setElapsedSec(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workoutState]);

  // BIOMECHANICAL MOTION SIMULATION LOOP (runs while 'running')
  useEffect(() => {
    if (workoutState !== 'running') return;

    let cycleCount = 0;

    const interval = setInterval(() => {
      cycleCount++;

      // Occasional body-lost test simulation
      if (cycleCount > 20 && cycleCount % 45 === 0) {
        setWorkoutState('body-lost');
        setBodyLostCount(c => c + 1);
        setTimeout(() => {
          setWorkoutState('running');
        }, 2200);
        return;
      }

      if (exercise.mode === 'reps') {
        const phaseTick = cycleCount % 4;

        if (phaseTick === 1) {
          repPhaseRef.current = 'going-down';
        } else if (phaseTick === 2) {
          repPhaseRef.current = 'bottom';
          const isErroneous = Math.random() < 0.22;

          if (exercise.name === 'Squat') {
            if (isErroneous) {
              const errRule = MOCK_RULES.find(r => r.exercise === 'Squat' && r.type === 'Error') || {
                label: 'Squat chưa đủ sâu',
                voice: 'Hạ thấp hơn – gập đầu gối khoảng 90 độ.',
              };
              currentRepErrorsRef.current.push(errRule.label);
              setCurrentStatus('incorrect');
              setFeedback({ text: `${errRule.label} — ${errRule.voice}`, isError: true });
              speakFeedback(errRule.voice);
              setJointAngles([
                { name: 'Gập gối', angle: 78, isError: true, targetRange: '90°–110°' },
                { name: 'Thân - Cẳng chân', angle: 4, isError: false, targetRange: '±10°' },
              ]);
            } else {
              setCurrentStatus('correct');
              setFeedback({ text: 'Độ sâu chuẩn! Đạp gót chân đứng lên.', isError: false });
              setJointAngles([
                { name: 'Gập gối', angle: 102, isError: false, targetRange: '90°–110°' },
                { name: 'Thân - Cẳng chân', angle: 2, isError: false, targetRange: '±10°' },
              ]);
            }
          } else if (exercise.name === 'Push-up') {
            if (isErroneous) {
              const errVoice = 'Khép khuỷu tay gần thân người hơn.';
              currentRepErrorsRef.current.push('Mở khuỷu tay quá rộng');
              setCurrentStatus('incorrect');
              setFeedback({ text: `Mở khuỷu tay quá rộng — ${errVoice}`, isError: true });
              speakFeedback(errVoice);
              setJointAngles([
                { name: 'Gập khuỷu tay', angle: 88, isError: false, targetRange: '≤ 90°' },
                { name: 'Góc mở khuỷu', angle: 84, isError: true, targetRange: '≤ 75°' },
              ]);
            } else {
              setCurrentStatus('correct');
              setFeedback({ text: 'Biên độ hoàn hảo! Đẩy thẳng tay.', isError: false });
              setJointAngles([
                { name: 'Gập khuỷu tay', angle: 86, isError: false, targetRange: '≤ 90°' },
                { name: 'Góc mở khuỷu', angle: 55, isError: false, targetRange: '≤ 75°' },
              ]);
            }
          }
        } else if (phaseTick === 3) {
          repPhaseRef.current = 'going-up';
        } else if (phaseTick === 0 && cycleCount > 0) {
          // REP COMPLETED
          repPhaseRef.current = 'top';
          const repErrors = [...currentRepErrorsRef.current];
          const isRepCorrect = repErrors.length === 0;

          setTotalReps(t => t + 1);
          if (isRepCorrect) {
            setCorrectReps(c => c + 1);
          } else {
            setIncorrectReps(i => i + 1);
            repErrors.forEach(err => {
              setErrorsSummary(prev => {
                const found = prev.find(p => p.label === err);
                if (found) return prev.map(p => p.label === err ? { ...p, count: p.count + 1 } : p);
                return [...prev, { label: err, count: 1 }];
              });
            });
          }

          setRepResults(prev => [...prev, { rep: prev.length + 1, correct: isRepCorrect, errors: repErrors }]);
          currentRepErrorsRef.current = [];
          setCurrentStatus('correct');
        }
      } else {
        // PLANK HOLD LOGIC (Isometric)
        setHoldSec(h => h + 1);
        const isPlankSagging = Math.random() < 0.15;

        if (isPlankSagging) {
          setCurrentStatus('incorrect');
          setIncorrectHoldSec(s => s + 1);
          const voiceMsg = 'Hông đang bị võng. Nâng hông lên.';
          setFeedback({ text: `Võng hông — ${voiceMsg}`, isError: true });
          speakFeedback(voiceMsg);
          setJointAngles([
            { name: 'Độ thẳng thân người', angle: 158, isError: true, targetRange: '165°–180°' },
          ]);
          setErrorsSummary(prev => {
            const found = prev.find(p => p.label === 'Võng hông');
            if (found) return prev.map(p => p.label === 'Võng hông' ? { ...p, count: p.count + 1 } : p);
            return [...prev, { label: 'Võng hông', count: 1 }];
          });
        } else {
          setCurrentStatus('correct');
          setCorrectHoldSec(s => s + 1);
          setFeedback({ text: 'Giữ chắc tư thế! Siết chặt cơ bụng.', isError: false });
          setJointAngles([
            { name: 'Độ thẳng thân người', angle: 174, isError: false, targetRange: '165°–180°' },
          ]);
        }
      }
    }, exercise.mode === 'reps' ? 800 : 1000);

    return () => clearInterval(interval);
  }, [workoutState, exercise, speakFeedback]);

  // Accuracy computation
  const accuracy = exercise.mode === 'reps'
    ? totalReps > 0
      ? Math.round((correctReps / totalReps) * 100)
      : 100
    : holdSec > 0
    ? Math.round((correctHoldSec / holdSec) * 100)
    : 100;

  // Actions
  const togglePause = useCallback(() => {
    setWorkoutState(prev => (prev === 'running' ? 'paused' : 'running'));
  }, []);

  const toggleVoice = useCallback(() => {
    setIsVoiceOn(v => !v);
  }, []);

  const retryCamera = useCallback(() => {
    setWorkoutState('requesting-camera');
  }, []);

  return {
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
  };
}
