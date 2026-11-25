import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  History,
  TrendingUp,
  Activity,
  Lightbulb,
  Clock,
  Sparkles,
  Camera,
  Volume2,
  ShieldCheck,
  ChevronRight,
  Lock,
  CheckCircle2,
  Zap,
  Play,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { AppFooter } from '../../components/layout/AppFooter';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EXERCISES, MOCK_SESSIONS } from '../../data/mockData';
import { AccuracyRing } from '../../components/ui/AccuracyRing';
import { PageTransition } from '../../components/ui/PageTransition';
import {
  AmbientLight,
  FloatingParticles,
  ScanLine,
} from '../../components/backgrounds';

interface HomeSectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const HomeSectionHeading: React.FC<HomeSectionHeadingProps> = ({
  badge,
  title,
  description,
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6"
  >
    <div className="space-y-1.5">
      {badge && (
        <span className="text-xs font-semibold text-[#80601D] tracking-wide block">
          {badge}
        </span>
      )}
      <h2 className="font-display font-bold text-[26px] sm:text-[28px] text-[#202124] tracking-tight leading-[1.35]">
        {title}
      </h2>
      {description && (
        <p className="text-[14px] text-[#626770] font-normal leading-[1.65]">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </motion.div>
);

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Buổi tập gần nhất từ dữ liệu thực tế
  const latestSession = MOCK_SESSIONS.length > 0 ? MOCK_SESSIONS[0] : null;

  // Thống kê tính toán trực tiếp từ dữ liệu thực
  const totalSessions = MOCK_SESSIONS.length;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(MOCK_SESSIONS.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions)
      : 0;
  const totalDurationSec = MOCK_SESSIONS.reduce((acc, s) => acc + (s.durationSec || 0), 0);
  const totalDurationMins = Math.round(totalDurationSec / 60);

  // Bài tập đạt độ chính xác cao nhất từ dữ liệu thực
  const exerciseAccuracies = ['Squat', 'Plank', 'Push-up']
    .map(name => {
      const sessions = MOCK_SESSIONS.filter(s => s.exercise === name);
      const avg =
        sessions.length > 0
          ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length)
          : 0;
      return { name, avg, count: sessions.length };
    })
    .filter(e => e.count > 0)
    .sort((a, b) => b.avg - a.avg);

  const bestExercise = exerciseAccuracies[0] || { name: 'Squat', avg: 88 };

  // Ngày hiện tại
  const todayFormatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const activeExercises = MOCK_EXERCISES.filter(e => e.status === 'Active');

  const getExerciseDisplay = (name: string, index: number) => {
    const num = `0${index + 1}`;
    switch (name) {
      case 'Squat':
        return {
          num,
          title: 'Squat',
          subtitle: 'Đứng lên ngồi xuống',
          image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
          desc: 'Tăng cường sức mạnh cơ tứ đầu đùi, mông và hông theo góc gập sinh cơ học chuẩn.',
          joints: 'Hông › Đầu gối › Cổ chân',
          defaultId: '1',
        };
      case 'Plank':
        return {
          num,
          title: 'Plank',
          subtitle: 'Giữ tư thế thẳng người',
          image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
          desc: 'Siết chặt toàn bộ nhóm cơ lõi, gia cố sự vững chãi của cột sống thắt lưng.',
          joints: 'Vai › Hông › Cổ chân',
          defaultId: '2',
        };
      case 'Push-up':
      default:
        return {
          num,
          title: 'Push-up',
          subtitle: 'Chống đẩy',
          image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
          desc: 'Phát triển cơ ngực, vai trước và cơ tam đầu bắp tay với trọng lượng cơ thể.',
          joints: 'Vai › Khuỷu tay › Cổ tay',
          defaultId: '3',
        };
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trích xuất tên gọi ngắn gọn
  const firstName = user?.fullName?.trim().split(' ').pop() || 'bạn';

  return (
    <div className="min-h-screen bg-[#F2F1ED] text-[#202124] flex flex-col font-body select-none selection:bg-[#B89545]/20 selection:text-[#202124]">
      <TopNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <PageTransition className="flex flex-col gap-12">
          {/* ======================================================== */}
          {/* 1. HERO BANNER THỂ THAO ĐIỆN ẢNH VỚI AMBIENT & PARTICLES */}
          {/* ======================================================== */}
          <section className="relative rounded-[20px] overflow-hidden shadow-sm border border-[#DEDDD7] text-white min-h-[340px] sm:h-[370px] flex items-center p-8 sm:p-10 bg-[#111214]">
            {/* Ảnh vận động viên phòng tập cao cấp với chuyển động Ken Burns */}
            <motion.img
              initial={{ scale: 1 }}
              animate={{ scale: 1.04 }}
              transition={{ duration: 24, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=85"
              alt="AIFit Studio Workout"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-transform"
              loading="lazy"
            />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(15,16,18,0.94) 0%, rgba(15,16,18,0.78) 55%, rgba(15,16,18,0.45) 100%)',
              }}
            />

            {/* Ánh sáng vàng champagne ambient sống động */}
            <AmbientLight
              color="#B89545"
              position="top-right"
              size="lg"
              intensity={0.22}
              animate={true}
            />

            {/* Hạt bụi vàng lơ lửng như Landing Page */}
            <FloatingParticles
              count={22}
              color="#D6BC84"
              minSize={1}
              maxSize={2.4}
              speed={0.2}
              className="opacity-45 pointer-events-none"
            />

            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Bên trái: Tối đa 65% nội dung với Stagger Animation */}
              <div className="md:col-span-8 lg:col-span-8 space-y-4 max-w-[650px]">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D6BC84] text-xs font-medium backdrop-blur-md border border-white/10">
                    <Calendar className="w-3.5 h-3.5 text-[#B89545]" />
                    <span>{todayFormatted}</span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Engine 3.0 Sẵn sàng
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="font-display font-bold text-3xl sm:text-4xl lg:text-[42px] tracking-tight leading-[1.28] text-[#F7F7F7]"
                >
                  Sẵn sàng bứt phá,{' '}
                  <span className="text-[#D6BC84]">
                    {firstName}?
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16 }}
                  className="text-[#C5C8CE] text-[15px] leading-[1.65]"
                >
                  Mỗi buổi tập là một bước tiến đến phiên bản tốt hơn của chính bạn. Hãy bật camera và để AI tối ưu hóa từng chuyển động theo thời gian thực.
                </motion.p>

                {/* Tóm tắt ngắn gọn & Nút hành động nhanh */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.24 }}
                  className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#C5C8CE]"
                >
                  <span className="px-3 py-1.5 rounded-xl bg-[#18191B]/80 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Activity className="w-3.5 h-3.5 text-[#B89545]" />
                    Đã hoàn thành: <strong className="text-[#F7F7F7] font-semibold">{totalSessions} buổi tập</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#18191B]/80 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Độ chuẩn trung bình: <strong className="text-[#D6BC84] font-semibold">{avgAccuracy}%</strong>
                  </span>
                  <button
                    onClick={() => {
                      const el = document.getElementById('exercise-selection');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#B89545] hover:bg-[#9E7E36] active:scale-95 text-[#101114] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#B89545]/20 transition-all cursor-pointer animate-light-sweep"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Tập ngay</span>
                  </button>
                </motion.div>
              </div>

              {/* Bên phải: Vòng tròn HUD Studio AI động như Landing Page */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="hidden md:flex md:col-span-4 lg:col-span-4 justify-end"
              >
                <div className="relative w-[150px] h-[150px] flex items-center justify-center">
                  {/* Laser scan line quét nhẹ nhàng */}
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <ScanLine durationSec={4} color="#B89545" />
                  </div>

                  {/* Vòng ngoài xoay chậm với nét đứt champagne */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#B89545]/45 animate-spin-slow pointer-events-none" />

                  {/* Vòng đệm sáng pulse */}
                  <div className="absolute inset-2 rounded-full border border-[#D6BC84]/20 animate-pulse pointer-events-none" />

                  {/* Tâm HUD chứa điểm số và trạng thái */}
                  <div className="relative z-10 w-[116px] h-[116px] rounded-full border border-[#B89545]/50 flex items-center justify-center p-3 bg-[#18191B]/90 backdrop-blur-md shadow-2xl shadow-black/80">
                    <div className="text-center space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-[#D6BC84] font-semibold">
                          Studio AI
                        </span>
                      </div>
                      <span className="font-display font-black text-2xl text-white block tabular-nums tracking-tight">
                        {avgAccuracy}%
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 block">
                        Chuẩn form
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 2. TỔNG QUAN TẬP LUYỆN (3 Card với Motion Hover & Glow) */}
          {/* ======================================================== */}
          <section>
            <HomeSectionHeading
              badge="Chỉ số tích lũy cá nhân"
              title="Tổng quan tập luyện"
              description="Cập nhật tức thì sau mỗi hiệp tập thực tế"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Thẻ 1: Tổng số buổi tập */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white p-6 border border-[#DEDDD7] hover:border-[#B89545]/60 hover:shadow-lg hover:shadow-[#B89545]/5 transition-all duration-300 flex flex-col justify-between min-h-[150px] overflow-hidden cursor-default"
              >
                {/* Viền sáng vàng tinh tế trên đỉnh card khi hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B89545] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#626770] group-hover:text-[#80601D] transition-colors">
                    Tổng số buổi tập
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#F2F1ED] text-[#80601D] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-[38px] text-[#202124] tabular-nums leading-none">
                    {totalSessions}
                    <span className="text-sm font-normal text-[#626770] ml-1.5 font-sans">buổi</span>
                  </div>
                  <p className="mt-2.5 text-[13px] text-[#626770]">Ghi nhận đầy đủ trong nhật ký cá nhân</p>
                </div>
              </motion.div>

              {/* Thẻ 2: Độ chính xác trung bình */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white p-6 border border-[#DEDDD7] hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between min-h-[150px] overflow-hidden cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#626770] group-hover:text-emerald-700 transition-colors">
                    Độ chính xác trung bình
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16835D] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-[38px] text-[#16835D] tabular-nums leading-none">
                    {avgAccuracy}
                    <span className="text-2xl font-normal font-sans">%</span>
                  </div>
                  <p className="mt-2.5 text-[13px] text-[#626770]">
                    {avgAccuracy >= 80 ? 'Chuẩn mực xuất sắc, duy trì rất tốt' : 'Đang cải thiện đều qua từng buổi'}
                  </p>
                </div>
              </motion.div>

              {/* Thẻ 3: Tổng thời lượng tập luyện */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.19 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white p-6 border border-[#DEDDD7] hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between min-h-[150px] overflow-hidden cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#626770] group-hover:text-amber-700 transition-colors">
                    Tổng thời lượng tập luyện
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-[38px] text-[#202124] tabular-nums leading-none">
                    {totalDurationMins}
                    <span className="text-sm font-normal text-[#626770] ml-1.5 font-sans">phút</span>
                  </div>
                  <p className="mt-2.5 text-[13px] text-[#626770]">Thời gian vận động trực tiếp trước camera</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 3. CHỌN BÀI TẬP (3 Card tương tác sinh động với AI Badge)*/}
          {/* ======================================================== */}
          <section id="exercise-selection">
            <HomeSectionHeading
              badge="Hệ thống bài tập cốt lõi"
              title="Chọn bài tập của bạn"
              action={
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#80601D] px-3.5 py-1 rounded-full bg-[#EDEAE3] border border-[#DEDDD7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  3 bài tập sẵn sàng
                </span>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeExercises.map((exercise, index) => {
                const visual = getExerciseDisplay(exercise.name, index);
                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group rounded-2xl bg-white border border-[#DEDDD7] hover:border-[#B89545] shadow-xs hover:shadow-xl hover:shadow-[#B89545]/10 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Ảnh bài tập tỷ lệ 16:10 với Zoom & Gradient & Scanline */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111214]">
                      <img
                        src={visual.image}
                        alt={visual.title}
                        className="h-full w-full object-cover group-hover:scale-108 transition-all duration-700 ease-out will-change-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/85 via-[#111214]/20 to-transparent pointer-events-none" />

                      {/* Header overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-[#D6BC84] backdrop-blur-md border border-white/10 shadow-sm">
                          <Zap className="w-3 h-3 text-[#B89545]" />
                          {exercise.mode === 'reps' ? 'Đếm Reps' : 'Giữ thời gian'}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/60 text-white font-mono backdrop-blur-md border border-white/10 shadow-sm">
                          {visual.num}
                        </span>
                      </div>

                      {/* Tên bài tập */}
                      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
                        <div>
                          <h3 className="font-display font-bold text-2xl text-white group-hover:text-[#D6BC84] transition-colors tracking-tight">
                            {visual.title}
                          </h3>
                          <p className="text-xs text-[#D1D5DB] mt-0.5">
                            {visual.subtitle}
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-black/50 px-2 py-0.5 rounded border border-emerald-500/20 backdrop-blur-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          AI Sẵn sàng
                        </span>
                      </div>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <p className="text-[14px] text-[#626770] leading-[1.65]">
                          {visual.desc}
                        </p>
                        <div className="pt-2 border-t border-[#DEDDD7] text-xs flex items-center justify-between">
                          <span className="text-[#626770]">Khớp theo dõi:</span>
                          <strong className="text-[#202124] font-medium">{visual.joints}</strong>
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/exercise/${exercise.id}/guide`)}
                          className="w-full h-11 rounded-[10px] bg-[#B89545] hover:bg-[#9E7E36] active:scale-[0.98] text-[#18191B] hover:text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
                        >
                          <span className="group-hover/btn:tracking-wide transition-all">Bắt đầu tập luyện</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ======================================================== */}
          {/* 4. BUỔI TẬP GẦN NHẤT & TIẾN ĐỘ (Lưới 60:40 Cân Bằng)     */}
          {/* ======================================================== */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Buổi tập gần nhất (60% / 7 of 12 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#DEDDD7] hover:border-[#B89545]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-[#DEDDD7] pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[#80601D]" />
                    <h3 className="font-display font-bold text-[18px] sm:text-[20px] text-[#202124]">
                      Buổi tập gần nhất
                    </h3>
                  </div>
                  {latestSession && (
                    <Link to="/history" className="text-xs font-semibold text-[#80601D] hover:underline flex items-center gap-1 group">
                      <span>Xem tất cả lịch sử</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>

                {latestSession ? (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
                    <div className="sm:col-span-8 space-y-3">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EDEAE3] text-[#626770] inline-block">
                        {new Date(latestSession.date).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                      </span>
                      <h4 className="font-display font-bold text-2xl text-[#202124]">
                        {latestSession.exercise}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#626770]">
                        <span>Thời lượng: <strong className="text-[#202124]">{formatDuration(latestSession.durationSec)}</strong></span>
                        <span>•</span>
                        {latestSession.totalReps > 0 ? (
                          <span>Số lần: <strong className="text-[#202124]">{latestSession.totalReps}</strong> ({latestSession.correctReps} chuẩn)</span>
                        ) : (
                          <span>Thời gian giữ: <strong className="text-[#202124]">{latestSession.correctHoldSec || 0}s</strong></span>
                        )}
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => navigate(`/session/${latestSession.id}/summary`)}
                          className="px-4 py-2.5 rounded-xl bg-[#B89545] text-white font-semibold text-xs flex items-center gap-2 hover:bg-[#9E7E36] active:scale-95 transition-all cursor-pointer shadow-xs"
                        >
                          <span>Xem chi tiết buổi tập</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-[#F2F1ED] rounded-xl border border-[#DEDDD7] group-hover:border-[#B89545]/40 transition-colors">
                      <AccuracyRing value={latestSession.accuracy} size="md" />
                      <span className="text-xs font-semibold text-[#202124] mt-2">
                        {latestSession.accuracy >= 80 ? 'Chuẩn mực xuất sắc' : 'Cần chú ý thêm'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#626770] space-y-2">
                    <p className="text-sm font-semibold">Chưa có dữ liệu buổi tập nào.</p>
                    <p className="text-xs">Hãy chọn một bài tập ở trên để bắt đầu hiệp tập đầu tiên!</p>
                  </div>
                )}
              </motion.div>

              {/* Tiến độ của bạn (40% / 5 of 12 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#DEDDD7] hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#DEDDD7] pb-3 mb-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#16835D]" />
                      <h3 className="font-display font-bold text-[18px] sm:text-[20px] text-[#202124]">
                        Tiến độ của bạn
                      </h3>
                    </div>
                    <Link to="/history" className="text-xs font-semibold text-[#80601D] hover:underline flex items-center gap-1 group">
                      <span>Xem biểu đồ</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-[#F2F1ED] border border-[#DEDDD7] space-y-1 hover:border-[#B89545]/30 transition-colors">
                      <span className="text-xs text-[#626770] block">Bài tập hoàn thiện nhất</span>
                      <div className="flex items-center justify-between">
                        <strong className="font-bold text-base text-[#202124]">
                          {bestExercise.name}
                        </strong>
                        <span className="font-semibold text-sm text-[#16835D] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                          {bestExercise.avg}% form chuẩn
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F2F1ED] border border-[#DEDDD7] space-y-1 hover:border-[#B89545]/30 transition-colors">
                      <span className="text-xs text-[#626770] block">Khối lượng luyện tập</span>
                      <div className="flex items-center justify-between">
                        <strong className="font-bold text-base text-[#202124]">
                          {totalSessions} buổi tập hoàn thành
                        </strong>
                        <span className="text-xs font-semibold text-[#80601D] bg-[#EDEAE3] px-2 py-0.5 rounded">
                          {totalDurationMins} phút
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-xs text-[#626770] text-center">
                  Dữ liệu được cập nhật tự động từ các buổi tập luyện trực tiếp.
                </div>
              </motion.div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 5. HƯỚNG DẪN TẬP LUYỆN (4 Card với Stagger Scroll Reveal) */}
          {/* ======================================================== */}
          <section>
            <HomeSectionHeading
              badge="Kỹ thuật sinh cơ học"
              title="Hướng dẫn tập luyện"
              description="Các tiêu chuẩn kỹ thuật giúp bạn đạt hiệu quả cao nhất và tránh chấn thương"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Kỹ thuật Squat chuẩn góc',
                  desc: 'Biên độ gập gối 90°–110°, không chụm gối và giữ thẳng cột sống.',
                  link: '/exercise/1/guide',
                  badge: 'Hạ trọng tâm',
                },
                {
                  title: 'Giữ thẳng người trong Plank',
                  desc: 'Siết cơ bụng ngang và cơ mông, tạo trục thẳng 165°–180° từ vai đến gót chân.',
                  link: '/exercise/2/guide',
                  badge: 'Siết cơ lõi',
                },
                {
                  title: 'Kỹ thuật chống đẩy chuẩn',
                  desc: 'Khép khuỷu tay góc 45° so với thân, hạ ngực chạm biên độ tiêu chuẩn.',
                  link: '/exercise/3/guide',
                  badge: 'Thân trên',
                },
                {
                  title: 'Bố trí góc quay camera',
                  desc: 'Đặt máy ngang tầm hông cách 2–3 mét góc ngang sườn để thấy toàn thân.',
                  link: '/exercise/1/guide',
                  badge: 'Cài đặt AI',
                },
              ].map((guide, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => navigate(guide.link)}
                  className="rounded-2xl bg-white p-6 border border-[#DEDDD7] hover:border-[#B89545] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#EDEAE3] text-[#80601D] group-hover:bg-[#B89545]/15 transition-colors inline-block">
                      {guide.badge}
                    </span>
                    <h4 className="font-display font-bold text-[18px] text-[#202124] group-hover:text-[#80601D] transition-colors leading-snug">
                      {guide.title}
                    </h4>
                    <p className="text-[13px] text-[#626770] leading-[1.6]">
                      {guide.desc}
                    </p>
                  </div>
                  <div className="mt-auto pt-3 flex items-center text-[13px] font-semibold text-[#80601D]">
                    <span>Xem hướng dẫn</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* 6. KIẾN THỨC VÀ MẸO SỬ DỤNG (Tỷ lệ 1:1 Cân Đối)          */}
          {/* ======================================================== */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Kiến thức thể thao (Panel 1) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="bg-white rounded-2xl p-6 border border-[#DEDDD7] hover:border-[#B89545]/40 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 border-b border-[#DEDDD7] pb-3 mb-5">
                    <Sparkles className="w-5 h-5 text-[#B89545]" />
                    <h3 className="font-display font-bold text-[18px] sm:text-[20px] text-[#202124]">
                      Kiến thức thể thao
                    </h3>
                  </div>

                  <div className="space-y-4 text-[#626770]">
                    <div className="space-y-1.5 pb-4 border-b border-[#DEDDD7] hover:bg-[#F9F8F5] p-3 rounded-xl transition-colors">
                      <strong className="text-[#202124] block font-semibold text-[15px]">
                        Tại sao không nên chụm đầu gối vào trong khi Squat?
                      </strong>
                      <p className="text-[14px] leading-[1.65]">
                        Hiện tượng chụm gối (Knee Valgus) làm mất cân bằng lực kéo lên dây chằng chéo trước (ACL), dễ gây tổn thương sụn chêm. Hãy chủ động mở nhẹ mũi chân và đẩy đầu gối hướng theo mũi chân khi hạ người.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1 hover:bg-[#F9F8F5] p-3 rounded-xl transition-colors">
                      <strong className="text-[#202124] block font-semibold text-[15px]">
                        Nguyên tắc kích hoạt cơ bụng ngang khi Plank
                      </strong>
                      <p className="text-[14px] leading-[1.65]">
                        Không chỉ giữ người bất động, hãy chủ động rút rốn về phía cột sống và siết nhẹ cơ mông. Điều này kích hoạt nhóm cơ bụng sâu (Transverse Abdominis) bảo vệ thắt lưng khỏi tình trạng võng lưng.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mẹo sử dụng AIFit (Panel 2) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="bg-white rounded-2xl p-6 border border-[#DEDDD7] hover:border-[#B89545]/40 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 border-b border-[#DEDDD7] pb-3 mb-5">
                    <Lightbulb className="w-5 h-5 text-[#80601D]" />
                    <h3 className="font-display font-bold text-[18px] sm:text-[20px] text-[#202124]">
                      Mẹo sử dụng AIFit
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5 pb-4 border-b border-[#DEDDD7] hover:bg-[#F9F8F5] p-2.5 rounded-xl transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#F2F1ED] text-[#80601D] flex items-center justify-center shrink-0 mt-0.5 border border-[#DEDDD7]">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-[#202124] block font-semibold text-[15px]">Đặt camera ngang sườn</strong>
                        <p className="text-[14px] text-[#626770] leading-[1.6]">Khoảng cách 2–3m ngang tầm hông giúp đo độ sâu khớp chuẩn nhất.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pb-4 border-b border-[#DEDDD7] hover:bg-[#F9F8F5] p-2.5 rounded-xl transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#F2F1ED] text-[#80601D] flex items-center justify-center shrink-0 mt-0.5 border border-[#DEDDD7]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-[#202124] block font-semibold text-[15px]">Thấy trọn vẹn toàn thân</strong>
                        <p className="text-[14px] text-[#626770] leading-[1.6]">Đảm bảo từ đỉnh đầu đến mũi giày nằm trong khung hình nhận diện.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pt-1 hover:bg-[#F9F8F5] p-2.5 rounded-xl transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#F2F1ED] text-[#80601D] flex items-center justify-center shrink-0 mt-0.5 border border-[#DEDDD7]">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-[#202124] block font-semibold text-[15px]">Bật loa thiết bị</strong>
                        <p className="text-[14px] text-[#626770] leading-[1.6]">AIFit sẽ nhắc nhở sửa tư thế ngay trong lúc bạn đang tập bằng giọng nói tiếng Việt.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 7. QUYỀN RIÊNG TƯ — BANNER CHARCOAL VỚI AMBIENT GLOW     */}
          {/* ======================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl bg-[#18191B] text-white p-8 border border-white/10 shadow-sm space-y-3 overflow-hidden"
          >
            {/* Ánh sáng ambient vàng tinh tế ở góc phải */}
            <AmbientLight
              color="#B89545"
              position="bottom-right"
              size="sm"
              intensity={0.16}
              animate={true}
            />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-[#D6BC84]">
                <Lock className="w-4 h-4 text-[#B89545]" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Cam kết bảo mật dữ liệu
                </span>
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                Buổi tập của bạn. Quyền riêng tư của bạn.
              </h3>

              <p className="text-[#CBD5E1] text-[14px] leading-[1.65] max-w-2xl">
                Toàn bộ hình ảnh camera được xử lý hoàn toàn cục bộ ngay trên thiết bị của bạn. AIFit <strong className="text-[#D6BC84]">không bao giờ truyền phát hay lưu trữ hình ảnh hoặc video của bạn lên đám mây</strong>.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#C5C8CE]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16835D]" /> Xử lý 100% tại thiết bị
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16835D]" /> Không tải video lên máy chủ
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16835D]" /> Dữ liệu thuộc quyền sở hữu của bạn
                </span>
              </div>
            </div>
          </motion.section>
        </PageTransition>
      </main>

      <AppFooter />
    </div>
  );
}
