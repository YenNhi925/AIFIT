import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, RotateCcw, AlertTriangle, CheckCircle2, Award, Home, History } from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { AppFooter } from '../../components/layout/AppFooter';
import { AccuracyRing } from '../../components/ui/AccuracyRing';
import { MOCK_SESSIONS } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { WorkoutSession } from '../../types';

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('aifit_latest_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.id === Number(sessionId)) {
          setSession(parsed);
          return;
        }
      } catch {
        // ignore
      }
    }

    const found = MOCK_SESSIONS.find(s => s.id === Number(sessionId));
    setSession(found || MOCK_SESSIONS[0]);
  }, [sessionId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex flex-col font-body">
        <TopNavbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-[#626770] font-medium text-sm">Đang tải thông tin chi tiết buổi tập...</p>
        </div>
        <AppFooter />
      </div>
    );
  }

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F2F1ED] text-[#202124] flex flex-col font-body selection:bg-[#B89545]/20 selection:text-[#202124]">
      <TopNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <PageTransition>
          {/* Nút quay lại lịch sử */}
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64676E] hover:text-[#202124] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại lịch sử tập luyện</span>
          </button>

          {/* Tiêu đề trang */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-5">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-1">
                Hồ sơ lưu trữ buổi tập
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#202124] tracking-tight">
                Chi tiết buổi tập — {session.exercise}
              </h1>
            </div>
            <span className="text-xs text-[#64676E] font-medium self-start sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-[#E8E2D6]">
              {new Date(session.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Thẻ tổng hợp Sinh cơ học */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="space-y-2 text-center sm:text-left max-w-md">
              <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-1.5 justify-center sm:justify-start">
                <Award className="w-4 h-4" />
                Đánh giá Sinh cơ học
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#202124]">
                Chất lượng Form: {session.accuracy >= 80 ? 'Chuẩn mực tối ưu' : 'Cần sửa đổi'}
              </h2>
              <p className="text-xs text-[#64676E] font-mono leading-relaxed">
                Tốc độ xử lý: {session.avgFps} FPS • Độ hiển thị điểm khớp:{' '}
                {Math.round(session.avgVisibility * 100)}% • Sự kiện mất người: {session.bodyLostCount}
              </p>
            </div>
            <div className="shrink-0 p-2">
              <AccuracyRing value={session.accuracy} size="lg" />
            </div>
          </div>

          {/* 4 Thẻ chỉ số (Baseline aligned) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E8E2D6] shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64676E] block mb-2">
                Thời lượng
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#202124] flex items-center gap-2 tabular-nums">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>{formatDuration(session.durationSec)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E8E2D6] shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64676E] block mb-2">
                {session.totalReps > 0 ? 'Tổng số Reps' : 'Thời gian giữ'}
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#202124] tabular-nums">
                {session.totalReps > 0 ? `${session.totalReps} reps` : `${session.durationSec}s`}
              </div>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                Đúng chuẩn
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-emerald-600 tabular-nums">
                {session.totalReps > 0 ? `${session.correctReps} reps` : `${session.correctHoldSec || 0}s`}
              </div>
            </div>

            <div className="bg-red-50/60 rounded-2xl p-5 border border-red-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block mb-2">
                Lỗi sai
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-red-600 tabular-nums">
                {session.totalReps > 0 ? `${session.incorrectReps} reps` : `${session.incorrectHoldSec || 0}s`}
              </div>
            </div>
          </div>

          {/* Danh sách lỗi sai tư thế */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#202124] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Các lỗi sai tư thế đã ghi nhận</span>
            </h3>

            {session.errors && session.errors.length > 0 ? (
              <div className="divide-y divide-[#E8E2D6]/70">
                {session.errors.map((err, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-[#202124]">{err.label}</span>
                    <span className="font-semibold text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                      {err.count} {session.totalReps > 0 ? 'lần mắc lỗi' : 'giây sai form'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2.5 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Không có lỗi tư thế nào trong buổi tập này!</span>
              </div>
            )}
          </div>

          {/* Các nút hành động */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/exercise/${session.exerciseId}/guide`)}
              className="h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-dark text-white shadow-md shadow-gold/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tập lại bài này</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-[#FAF6EC] text-[#202124] border border-[#E8E2D6] flex items-center gap-2 transition-all cursor-pointer"
            >
              <History className="w-4 h-4 text-gold" />
              <span>Quay lại lịch sử</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-[#FAF6EC] text-[#202124] border border-[#E8E2D6] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-gold" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </PageTransition>
      </main>

      <AppFooter />
    </div>
  );
}
