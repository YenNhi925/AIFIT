import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  History,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Share2,
  ArrowRight,
  Home,
  Award,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { AppFooter } from '../../components/layout/AppFooter';
import { AccuracyRing } from '../../components/ui/AccuracyRing';
import { useToast } from '../../components/ui/Toast';
import { MOCK_SESSIONS } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { WorkoutSession } from '../../types';

export default function WorkoutSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isRetryingSync, setIsRetryingSync] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('aifit_latest_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.id === Number(id) || id === 'latest') {
          setSession(parsed);
          return;
        }
      } catch {
        // ignore
      }
    }

    const found = MOCK_SESSIONS.find(s => s.id === Number(id)) || MOCK_SESSIONS[0];
    setSession(found);
  }, [id]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex flex-col font-body">
        <TopNavbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-[#626770] font-medium text-sm">Đang tải tóm tắt kết quả...</p>
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

  const handleRetrySync = () => {
    setIsRetryingSync(true);
    setTimeout(() => {
      setIsRetryingSync(false);
      if (session) {
        const updated = { ...session, synced: true };
        setSession(updated);
        localStorage.setItem('aifit_latest_session', JSON.stringify(updated));
        success('Đã đồng bộ kết quả buổi tập lên máy chủ thành công.');
      }
    }, 1200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `AIFit — Buổi tập ${session.exercise}`,
          text: `Tôi vừa đạt ${session.accuracy}% độ chuẩn xác khi tập ${session.exercise} với AIFit!`,
        })
        .catch(() => {});
    } else {
      success('Đã sao chép kết quả buổi tập vào bộ nhớ tạm.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F1ED] text-[#202124] flex flex-col font-body selection:bg-[#B89545]/20 selection:text-[#202124]">
      <TopNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageTransition>
          {/* BANNER CHÚC MỪNG HOÀN THÀNH */}
          <section className="text-center space-y-3 max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 text-gold-dark text-xs font-bold uppercase tracking-wider border border-gold/30"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Tổng quan kết quả buổi tập</span>
            </motion.div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#202124] tracking-tight uppercase leading-tight">
              TUYỆT VỜI! BẠN ĐÃ HOÀN THÀNH BUỔI TẬP
            </h1>

            <p className="font-body text-xs sm:text-sm text-[#64676E]">
              Bài tập: <span className="font-bold text-[#202124]">{session.exercise}</span> •{' '}
              {new Date(session.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </section>

          {/* ĐỘ CHÍNH XÁC TƯ THẾ (GAUGE CARD) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 max-w-md">
              <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Đánh giá Sinh cơ học AI
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#202124]">
                {session.accuracy >= 80
                  ? 'Chuẩn mực xuất sắc'
                  : session.accuracy >= 60
                  ? 'Tương đối chuẩn xác'
                  : 'Cần chú ý điều chỉnh'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64676E] leading-relaxed">
                {session.accuracy >= 80
                  ? 'Bạn kiểm soát chuyển động và biên độ góc khớp rất tốt trong từng lần tập, tuân thủ đúng tiêu chuẩn y sinh học.'
                  : 'Phát hiện có độ lệch góc khớp so với tiêu chuẩn. Hãy theo dõi các gợi ý sửa lỗi cụ thể bên dưới để hoàn thiện form.'}
              </p>
            </div>

            <div className="shrink-0 p-2">
              <AccuracyRing value={session.accuracy} size="xl" />
            </div>
          </div>

          {/* 4 THẺ THỐNG KÊ TẬP LUYỆN (BASELINE ALIGNED) */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#202124]">
              Thống kê buổi tập
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Thẻ 1: Thời lượng */}
              <div className="bg-white rounded-2xl p-5 border border-[#E8E2D6] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64676E] block mb-2">
                  Thời lượng tập
                </span>
                <div className="font-display font-black text-2xl sm:text-3xl text-[#202124] flex items-center gap-2 tabular-nums">
                  <Clock className="w-5 h-5 text-gold shrink-0" />
                  <span>{formatDuration(session.durationSec)}</span>
                </div>
              </div>

              {/* Thẻ 2: Khối lượng */}
              <div className="bg-white rounded-2xl p-5 border border-[#E8E2D6] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64676E] block mb-2">
                  {session.totalReps > 0 ? 'Tổng số lần tập' : 'Thời gian giữ'}
                </span>
                <div className="font-display font-black text-2xl sm:text-3xl text-[#202124] tabular-nums">
                  {session.totalReps > 0 ? `${session.totalReps} reps` : `${session.durationSec}s`}
                </div>
              </div>

              {/* Thẻ 3: Số lần đúng */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                  Đúng chuẩn kỹ thuật
                </span>
                <div className="font-display font-black text-2xl sm:text-3xl text-emerald-600 tabular-nums">
                  {session.totalReps > 0 ? `${session.correctReps} reps` : `${session.correctHoldSec || 0}s`}
                </div>
              </div>

              {/* Thẻ 4: Số lần sai */}
              <div className="bg-red-50/60 rounded-2xl p-5 border border-red-200 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block mb-2">
                  Lỗi sai tư thế
                </span>
                <div className="font-display font-black text-2xl sm:text-3xl text-red-600 tabular-nums">
                  {session.totalReps > 0 ? `${session.incorrectReps} reps` : `${session.incorrectHoldSec || 0}s`}
                </div>
              </div>
            </div>
          </div>

          {/* PHÂN TÍCH TỪNG LẦN TẬP */}
          {session.repResults && session.repResults.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D6]/70 pb-3">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#202124]">
                  Phân tích từng lần tập (Reps Breakdown)
                </h3>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#64676E]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500" /> Đúng chuẩn
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-red-500" /> Cần sửa
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {session.repResults.map((r, idx) => (
                  <div
                    key={idx}
                    title={
                      r.correct
                        ? `Lần ${r.rep}: Đúng chuẩn`
                        : `Lần ${r.rep}: ${r.errors?.join(', ')}`
                    }
                    className={`w-11 h-14 rounded-xl flex flex-col items-center justify-between py-2 text-white font-mono font-bold text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                      r.correct ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                    }`}
                  >
                    <span>#{r.rep}</span>
                    <span className="text-[11px]">{r.correct ? '✓' : '✗'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NHỮNG LỖI CẦN CẢI THIỆN */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#202124] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Những lỗi cần cải thiện</span>
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
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Không phát hiện lỗi tư thế nào! Đạt độ chuẩn xác hoàn hảo suốt buổi tập.</span>
              </div>
            )}
          </div>

          {/* NHẬN XÉT BUỔI TẬP */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-2">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#202124] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold shrink-0" />
              <span>Nhận xét huấn luyện viên AI</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#64676E] leading-relaxed">
              {session.accuracy >= 85
                ? 'Buổi tập có chất lượng rất cao. Bạn duy trì nhịp độ ổn định, giữ đúng trục chuyển động của các khớp then chốt và hoàn thành bài tập với phong độ tuyệt vời. Hãy giữ vững phong độ này trong các buổi tập kế tiếp!'
                : session.accuracy >= 65
                ? 'Bạn đã nỗ lực hoàn thành bài tập rất tốt. Ở những rep cuối khi cơ thể bắt đầu mỏi, hãy chú ý giữ nhịp thở đều và kiểm soát tốc độ hạ người để tránh bị lệch góc khớp chuẩn.'
                : 'Cần chú ý thêm về tư thế ban đầu và góc gập khớp. Hãy xem lại hướng dẫn chi tiết của bài tập trước khi thực hiện lượt tiếp theo để đạt hiệu quả cao nhất và tránh chấn thương.'}
            </p>
          </div>

          {/* TRẠNG THÁI ĐỒNG BỘ */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] flex items-center justify-between text-xs font-medium shadow-xs">
            <div className="flex items-center gap-2">
              {session.synced ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-800 font-semibold">
                    Dữ liệu buổi tập đã đồng bộ lên máy chủ
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-amber-800 font-semibold">
                    Chế độ ngoại tuyến — đang lưu trên thiết bị
                  </span>
                </>
              )}
            </div>

            {!session.synced && (
              <button
                type="button"
                onClick={handleRetrySync}
                disabled={isRetryingSync}
                className="font-bold text-gold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetryingSync ? 'animate-spin' : ''}`} />
                <span>Đồng bộ lại</span>
              </button>
            )}
          </div>

          {/* CÁC NÚT ĐIỀU HƯỚNG CÂN ĐỐI */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/exercise/${session.exerciseId}/guide`)}
              className="w-full sm:w-auto min-w-[190px] h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-dark text-white shadow-md shadow-gold/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tập lại bài này</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="w-full sm:w-auto min-w-[190px] h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-[#FAF6EC] text-[#202124] border border-[#E8E2D6] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <History className="w-4 h-4 text-gold" />
              <span>Xem lịch sử tập</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto min-w-[190px] h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-[#FAF6EC] text-[#202124] border border-[#E8E2D6] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-gold" />
              <span>Về trang chủ</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="h-12 w-12 rounded-xl border border-[#E8E2D6] bg-white text-[#64676E] hover:text-gold hover:border-gold flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Chia sẻ kết quả"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </PageTransition>
      </main>

      <AppFooter />
    </div>
  );
}
