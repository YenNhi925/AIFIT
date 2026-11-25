import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  Clock,
  Award,
  Filter,
  Calendar,
  ChevronRight,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { AppFooter } from '../../components/layout/AppFooter';
import { MOCK_SESSIONS } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import { AmbientLight } from '../../components/backgrounds';

// Exercise thumbnails
const EXERCISE_THUMBS: Record<string, string> = {
  Squat: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=240&q=80',
  Plank: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=240&q=80',
  'Push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=240&q=80',
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [exerciseFilter, setExerciseFilter] = useState<string>('Tất cả');
  const [periodFilter, setPeriodFilter] = useState<string>('30 ngày qua');
  const [barMetricMode, setBarMetricMode] = useState<'reps' | 'hold'>('reps');

  // Lọc dữ liệu theo bài tập & khoảng thời gian
  const filteredSessions = useMemo(() => {
    let result = [...MOCK_SESSIONS];

    if (exerciseFilter !== 'Tất cả') {
      result = result.filter(s => s.exercise === exerciseFilter);
    }

    const now = new Date('2026-11-23').getTime();
    if (periodFilter === '7 ngày qua') {
      const cut = now - 7 * 24 * 3600 * 1000;
      result = result.filter(s => new Date(s.date).getTime() >= cut);
    } else if (periodFilter === '30 ngày qua') {
      const cut = now - 30 * 24 * 3600 * 1000;
      result = result.filter(s => new Date(s.date).getTime() >= cut);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [exerciseFilter, periodFilter]);

  // Thống kê tổng hợp
  const totalSessions = filteredSessions.length;
  const totalDurationSec = filteredSessions.reduce((acc, s) => acc + (s.durationSec || 0), 0);
  const totalMinutes = Math.round(totalDurationSec / 60);
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(filteredSessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / totalSessions)
      : 0;

  // Dữ liệu cho Line Chart: độ chính xác qua các buổi
  const accuracyChartData = useMemo(() => {
    return [...filteredSessions]
      .reverse()
      .map((s, index) => ({
        index: index + 1,
        date: new Date(s.date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
        fullDate: new Date(s.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        accuracy: Number(s.accuracy) || 0,
        exercise: s.exercise,
      }));
  }, [filteredSessions]);

  // Dữ liệu cho Stacked Bar Chart
  const barChartData = useMemo(() => {
    return [...filteredSessions]
      .reverse()
      .filter(s => {
        if (exerciseFilter === 'Plank') return s.exercise === 'Plank';
        if (exerciseFilter === 'Squat' || exerciseFilter === 'Push-up') return s.exercise === exerciseFilter;
        return barMetricMode === 'hold' ? s.exercise === 'Plank' : s.exercise !== 'Plank';
      })
      .map(s => {
        const isPlank = s.exercise === 'Plank';
        return {
          id: s.id,
          date: new Date(s.date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
          exercise: s.exercise,
          correct: isPlank ? (s.correctHoldSec || 0) : (s.correctReps || 0),
          incorrect: isPlank ? (s.incorrectHoldSec || 0) : (s.incorrectReps || 0),
          total: isPlank ? (s.durationSec || 0) : (s.totalReps || 0),
          unit: isPlank ? 'giây' : 'lần',
        };
      });
  }, [filteredSessions, exerciseFilter, barMetricMode]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isPlankActive = exerciseFilter === 'Plank' || (exerciseFilter === 'Tất cả' && barMetricMode === 'hold');

  return (
    <div className="min-h-screen bg-[#F2F1ED] flex flex-col font-body selection:bg-[#B89545]/20 selection:text-[#202124]">
      <TopNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTransition className="flex flex-col gap-8">
          {/* ======================================================== */}
          {/* 9.1 PAGE HERO: BOXED BANNER (220 - 250px)                */}
          {/* ======================================================== */}
          <section className="relative rounded-3xl overflow-hidden shadow-md border border-[#DEDDD7] text-white min-h-[220px] sm:min-h-[240px] flex items-center p-8 sm:p-12 bg-[#18191B]">
            {/* Background Image with Dark Gradient */}
            <motion.img
              initial={{ scale: 1 }}
              animate={{ scale: 1.03 }}
              transition={{ duration: 25, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
              alt="AIFit History Banner"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              loading="lazy"
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(17,18,20,0.94) 0%, rgba(24,25,27,0.78) 55%, rgba(17,18,20,0.50) 100%)',
              }}
            />

            <AmbientLight
              color="#B89545"
              position="top-right"
              size="md"
              intensity={0.2}
              animate={true}
            />

            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D6BC84] text-xs font-medium backdrop-blur-md border border-white/10">
                <BarChart3 className="w-3.5 h-3.5 text-[#B89545]" />
                <span>Nhật ký sinh cơ học cá nhân</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#F7F7F7] tracking-tight">
                Hành trình tiến bộ của bạn
              </h1>
              <p className="text-[#CBD5E1] text-xs sm:text-sm leading-relaxed">
                Theo dõi sát sao từng buổi tập, đánh giá độ chuẩn xác sinh cơ học và đo lường sự tiến bộ qua thời gian thực.
              </p>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 9.2 FILTER TOOLBAR (Cao đồng đều 44px)                    */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DEDDD7] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Bộ lọc bài tập bên trái */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#626770] font-medium mr-2">
                <Filter className="w-3.5 h-3.5 text-[#80601D]" />
                <span>Bài tập:</span>
              </div>
              {['Tất cả', 'Squat', 'Plank', 'Push-up'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setExerciseFilter(tab)}
                  className={`h-10 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    exerciseFilter === tab
                      ? 'bg-[#18191B] text-white shadow-xs'
                      : 'bg-[#F2F1ED] text-[#626770] hover:text-[#202124] hover:bg-[#EDEAE3]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Bộ lọc thời gian bên phải */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#626770] font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#80601D]" />
                <span>Thời gian:</span>
              </div>
              <select
                value={periodFilter}
                onChange={e => setPeriodFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-[#DEDDD7] bg-[#F2F1ED] text-xs font-semibold text-[#202124] outline-none focus:border-[#B89545] cursor-pointer"
              >
                <option value="7 ngày qua">7 ngày qua</option>
                <option value="30 ngày qua">30 ngày qua</option>
                <option value="Toàn bộ">Toàn bộ lịch sử</option>
              </select>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 9.3 BA THẺ KPI THỐNG KÊ (Cùng chiều cao và căn chỉnh)     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-[#DEDDD7] shadow-xs flex flex-col justify-between min-h-[136px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[#626770]">
                  Tổng số buổi tập
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F2F1ED] text-[#80601D] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-bold text-3xl sm:text-[34px] text-[#202124] tabular-nums my-1">
                {totalSessions}
                <span className="text-sm font-normal text-[#626770] ml-1.5">buổi</span>
              </div>
              <p className="text-xs text-[#626770]">Trong giai đoạn đang chọn</p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-[#DEDDD7] shadow-xs flex flex-col justify-between min-h-[136px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[#626770]">
                  Thời lượng vận động
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F2F1ED] text-[#80601D] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-bold text-3xl sm:text-[34px] text-[#202124] tabular-nums my-1">
                {totalMinutes}
                <span className="text-sm font-normal text-[#626770] ml-1.5">phút</span>
              </div>
              <p className="text-xs text-[#626770]">Thời gian tập luyện trực tiếp</p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-[#DEDDD7] shadow-xs flex flex-col justify-between min-h-[136px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[#626770]">
                  Độ chính xác trung bình
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16835D] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-bold text-3xl sm:text-[34px] text-[#16835D] tabular-nums my-1">
                {avgAccuracy}%
              </div>
              <p className="text-xs text-[#626770]">
                {avgAccuracy >= 80 ? 'Chuẩn mực kỹ thuật rất tốt' : 'Tiếp tục cải thiện các góc khớp'}
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 9.4 HAI BIỂU ĐỒ PHÂN TÍCH (Cùng chiều cao & padding)      */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Chart 1: Line / Area Chart - Độ chính xác (%) */}
            <div className="bg-white rounded-2xl p-6 border border-[#DEDDD7] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#DEDDD7] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#80601D]" />
                  <h3 className="font-display font-bold text-base text-[#202124]">
                    Xu hướng độ chuẩn xác theo buổi (%)
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#80601D] bg-[#EDEAE3] px-2.5 py-0.5 rounded-full">
                  Mục tiêu ≥ 80%
                </span>
              </div>

              <div className="h-64 w-full">
                {accuracyChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-[#626770]">
                    Chưa có đủ dữ liệu cho khoảng thời gian này
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accuracyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B89545" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#B89545" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DEDDD7" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#626770', fontSize: 11 }} tickLine={false} />
                      <YAxis domain={[40, 100]} tick={{ fill: '#626770', fontSize: 11 }} unit="%" tickLine={false} />
                      <Tooltip
                        formatter={(val: number) => [`${val}%`, 'Độ chuẩn']}
                        labelFormatter={label => `Ngày: ${label}`}
                        contentStyle={{
                          backgroundColor: '#18191B',
                          borderColor: '#DEDDD7',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#B89545"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#accuracyGradient)"
                        dot={{ r: 3.5, fill: '#80601D', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                        activeDot={{ r: 5, fill: '#B89545' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Stacked Bar Chart - Chuẩn vs Lỗi */}
            <div className="bg-white rounded-2xl p-6 border border-[#DEDDD7] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#DEDDD7] pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#80601D]" />
                  <h3 className="font-display font-bold text-base text-[#202124]">
                    Phân tích số lần tập chuẩn & sai ({isPlankActive ? 'giây' : 'lần'})
                  </h3>
                </div>

                {exerciseFilter === 'Tất cả' && (
                  <div className="flex items-center gap-1 bg-[#F2F1ED] p-0.5 rounded-lg text-[11px] font-medium border border-[#DEDDD7]">
                    <button
                      type="button"
                      onClick={() => setBarMetricMode('reps')}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        barMetricMode === 'reps'
                          ? 'bg-[#18191B] text-white font-bold'
                          : 'text-[#626770] hover:text-[#202124]'
                      }`}
                    >
                      Reps
                    </button>
                    <button
                      type="button"
                      onClick={() => setBarMetricMode('hold')}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        barMetricMode === 'hold'
                          ? 'bg-[#18191B] text-white font-bold'
                          : 'text-[#626770] hover:text-[#202124]'
                      }`}
                    >
                      Plank
                    </button>
                  </div>
                )}
              </div>

              <div className="h-64 w-full">
                {barChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-[#626770]">
                    Chưa có đủ dữ liệu cho khoảng thời gian này
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DEDDD7" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#626770', fontSize: 11 }} tickLine={false} />
                      <YAxis tick={{ fill: '#626770', fontSize: 11 }} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18191B',
                          borderColor: '#DEDDD7',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                      />
                      <Bar dataKey="correct" name="Đúng chuẩn" stackId="a" fill="#16835D" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="incorrect" name="Sai kỹ thuật" stackId="a" fill="#C53030" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 9.5 BẢNG LỊCH SỬ TẬP LUYỆN (Tối ưu cột & chữ)             */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-[#DEDDD7] shadow-xs overflow-hidden space-y-0">
            <div className="p-5 border-b border-[#DEDDD7] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#202124]">
                  Nhật ký chi tiết các buổi tập
                </h3>
                <p className="text-xs text-[#626770]">
                  Ghi nhận đầy đủ thông số hiệp tập, thời lượng và trạng thái lưu trữ
                </p>
              </div>
              <span className="text-xs font-semibold text-[#626770] bg-[#F2F1ED] px-3 py-1 rounded-full border border-[#DEDDD7]">
                {filteredSessions.length} buổi tập
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F2F1ED] border-b border-[#DEDDD7] text-[11px] font-semibold uppercase tracking-wider text-[#626770]">
                    <th className="py-3.5 px-5">Bài tập</th>
                    <th className="py-3.5 px-5">Thời điểm tập</th>
                    <th className="py-3.5 px-5">Thời lượng</th>
                    <th className="py-3.5 px-5">Kết quả</th>
                    <th className="py-3.5 px-5">Độ chuẩn</th>
                    <th className="py-3.5 px-5 text-center">Trạng thái</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEDDD7]">
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#626770]">
                        Không tìm thấy buổi tập nào theo bộ lọc đã chọn.
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map(session => {
                      const thumb = EXERCISE_THUMBS[session.exercise] || EXERCISE_THUMBS['Squat'];
                      const isHighAcc = session.accuracy >= 80;

                      return (
                        <tr
                          key={session.id}
                          className="hover:bg-[#F2F1ED]/60 transition-colors"
                        >
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#18191B] shrink-0 border border-[#DEDDD7]">
                                <img src={thumb} alt={session.exercise} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-semibold text-sm text-[#202124]">
                                {session.exercise}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-5 text-[#3F4246] whitespace-nowrap">
                            <div className="font-medium">
                              {new Date(session.date).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] text-[#626770]">
                              {new Date(session.date).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>

                          <td className="py-3.5 px-5 font-mono text-[#3F4246] whitespace-nowrap">
                            {formatDuration(session.durationSec)}
                          </td>

                          <td className="py-3.5 px-5 whitespace-nowrap">
                            {session.totalReps > 0 ? (
                              <span className="text-[#3F4246]">
                                <strong className="text-[#16835D]">{session.correctReps}</strong> / {session.totalReps} lần
                              </span>
                            ) : (
                              <span className="text-[#3F4246]">
                                Giữ <strong className="text-[#16835D]">{session.correctHoldSec || 0}s</strong>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold text-xs ${
                                isHighAcc ? 'text-[#16835D]' : 'text-[#B45309]'
                              }`}
                            >
                              {isHighAcc ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5" />
                              )}
                              <span>{session.accuracy}%</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-5 text-center whitespace-nowrap">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-[#16835D] border border-emerald-200">
                              Đã lưu máy chủ
                            </span>
                          </td>

                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => navigate(`/session/${session.id}/summary`)}
                              className="px-3 py-1.5 rounded-xl border border-[#DEDDD7] text-xs font-semibold text-[#80601D] hover:bg-[#EDEAE3] transition-colors cursor-pointer"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </PageTransition>
      </main>

      <AppFooter />
    </div>
  );
}
