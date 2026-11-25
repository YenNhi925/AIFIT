import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Mic,
  BarChart2,
  Lock,
  ChevronDown,
  Menu,
  X,
  CheckCircle,
  Zap,
  Eye,
  Shield,
  ArrowRight,
  Play,
  Camera,
  Brain,
  TrendingUp,
  HelpCircle,
  ChevronUp,
  Dumbbell,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CinematicBackground,
  ParallaxImage,
  AmbientLight,
  GrainOverlay,
  FloatingParticles,
  AnimatedGrid,
  AnimatedContourLines,
  ScanLine,
  SectionDivider,
  SectionBackground,
} from '../components/backgrounds';

// ─── Dữ liệu hằng số ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Công nghệ AI', href: '#tech' },
  { label: 'Bài tập', href: '#exercises' },
  { label: 'Hướng dẫn', href: '#how-it-works' },
  { label: 'Giới thiệu', href: '#about' },
];

const ACCURACY_DATA = [
  { session: 'B1', accuracy: 68 },
  { session: 'B2', accuracy: 74 },
  { session: 'B3', accuracy: 79 },
  { session: 'B4', accuracy: 82 },
  { session: 'B5', accuracy: 88 },
  { session: 'B6', accuracy: 92 },
];

const SKELETON_JOINTS = [
  { id: 'head', cx: 100, cy: 32 },
  { id: 'ls', cx: 70, cy: 78 },
  { id: 'rs', cx: 130, cy: 78 },
  { id: 'le', cx: 54, cy: 128 },
  { id: 're', cx: 146, cy: 128 },
  { id: 'lw', cx: 46, cy: 172 },
  { id: 'rw', cx: 154, cy: 172 },
  { id: 'lh', cx: 80, cy: 162 },
  { id: 'rh', cx: 120, cy: 162 },
  { id: 'lk', cx: 76, cy: 232 },
  { id: 'rk', cx: 124, cy: 232 },
  { id: 'la', cx: 72, cy: 302 },
  { id: 'ra', cx: 128, cy: 302 },
];

const SKELETON_CONNECTIONS = [
  ['ls', 'rs'],
  ['ls', 'le'],
  ['le', 'lw'],
  ['rs', 're'],
  ['re', 'rw'],
  ['ls', 'lh'],
  ['rs', 'rh'],
  ['lh', 'rh'],
  ['lh', 'lk'],
  ['lk', 'la'],
  ['rh', 'rk'],
  ['rk', 'ra'],
];

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-bg/85 backdrop-blur-xl border-b border-gold/20 shadow-2xl shadow-black/50 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/welcome"
          className="font-display font-black text-2xl tracking-wider flex items-center gap-2.5 group"
          style={{ color: '#C9A227' }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-black text-dark-bg text-sm shadow-md shadow-gold/25 group-hover:scale-105 transition-transform">
            AI
          </div>
          <span className="group-hover:text-champagne transition-colors">AIFit</span>
        </Link>

        {/* Menu máy tính */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-semibold text-gray-300 hover:text-gold transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Nút đăng nhập & Bắt đầu */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-gold/25 cursor-pointer animate-light-sweep"
            style={{ background: '#C9A227', color: '#101114' }}
          >
            Bắt đầu ngay
          </button>
        </div>

        {/* Nút mở menu mobile */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-surface/95 backdrop-blur-xl border-b border-gold/20 px-6 py-6 space-y-4 shadow-2xl"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left py-2 text-base font-semibold text-gray-200 hover:text-gold"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl border border-gold/40 text-gold font-bold text-sm text-center"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 rounded-xl bg-gold text-dark-bg font-bold text-sm text-center"
              >
                Bắt đầu ngay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-screen">
      <CinematicBackground
        imageSrc="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=85"
        imageOpacity={0.42}
        particleCount={36}
      >
        <div className="min-h-screen flex items-center pt-28 pb-16">
          <div className="relative max-w-7xl mx-auto px-6 w-full grid md:grid-cols-12 gap-12 items-center">
            {/* Cột trái: Tiêu đề & Kêu gọi hành động (7 cột) */}
            <div className="md:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4 backdrop-blur-md"
                  style={{
                    background: 'rgba(201, 162, 39, 0.15)',
                    color: '#E7CA80',
                    border: '1px solid rgba(201, 162, 39, 0.35)',
                  }}
                >
                  <Zap size={14} className="text-gold" />
                  <span>TRỢ LÝ TẬP LUYỆN TRÍ TUỆ NHÂN TẠO</span>
                </span>
              </motion.div>

              <motion.h1
                className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.15] text-white tracking-tight"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                TẬP LUYỆN THÔNG MINH.
                <br />
                <span style={{ color: '#E7CA80' }}>CHINH PHỤC GIỚI HẠN.</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Khám phá phương pháp tập luyện thế hệ mới với công nghệ AI phân tích
                tư thế, phản hồi tức thì và theo dõi tiến độ của bạn.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 pt-2"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 rounded-2xl font-display font-bold text-base flex items-center gap-3 transition-all shadow-xl shadow-gold/25 cursor-pointer animate-light-sweep"
                  style={{ background: '#C9A227', color: '#101114' }}
                >
                  <span>Bắt đầu tập luyện</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => {
                    const el = document.querySelector('#tech');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-2xl font-display font-semibold text-base flex items-center gap-2 border border-white/20 text-white hover:border-gold hover:text-gold backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <span>Khám phá công nghệ</span>
                  <ChevronDown size={18} />
                </button>
              </motion.div>
            </div>

            {/* Cột phải: Khung mô phỏng AI Pose Tracking chuẩn V3.0 (5 cột) */}
            <div className="md:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-full max-w-sm rounded-3xl p-6 bg-[#15171C]/75 backdrop-blur-xl border border-gold/30 shadow-2xl flex flex-col items-center overflow-hidden"
              >
                {/* Ảnh vận động viên thực tế bán trong suốt */}
                <img
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80"
                  alt="Vận động viên Squat AI Tracking"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
                  loading="lazy"
                />

                {/* Laser scan line quét chậm */}
                <ScanLine durationSec={5} color="#C9A227" />

                <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    NHẬN DIỆN TRỰC TIẾP: 28 FPS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[10px] font-bold">
                    MÔ PHỎNG
                  </span>
                </div>

                {/* Khung hình SVG Pose & Skeleton Overlay */}
                <div className="relative z-10 w-full aspect-[4/5] flex items-center justify-center my-4">
                  <svg viewBox="0 0 200 320" className="w-full h-full">
                    {/* Khung xương liên kết với hiệu ứng vẽ đường */}
                    {SKELETON_CONNECTIONS.map(([a, b]) => {
                      const ja = SKELETON_JOINTS.find(j => j.id === a);
                      const jb = SKELETON_JOINTS.find(j => j.id === b);
                      if (!ja || !jb) return null;
                      return (
                        <line
                          key={`${a}-${b}`}
                          x1={ja.cx}
                          y1={ja.cy}
                          x2={jb.cx}
                          y2={jb.cy}
                          stroke="#C9A227"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity={0.85}
                        />
                      );
                    })}

                    {/* Các điểm khớp xương có hiệu ứng pulse */}
                    {SKELETON_JOINTS.map(j => {
                      const isKeyJoint = j.id === 'lk' || j.id === 'rk';
                      return (
                        <g key={j.id}>
                          {isKeyJoint && (
                            <circle
                              cx={j.cx}
                              cy={j.cy}
                              r={10}
                              fill="#16A34A"
                              opacity={0.3}
                              className="animate-ping"
                            />
                          )}
                          <circle
                            cx={j.cx}
                            cy={j.cy}
                            r={isKeyJoint ? 6 : 4}
                            fill={isKeyJoint ? '#16A34A' : '#C9A227'}
                            stroke="#FAF6EC"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Nhãn góc nổi với bóng đổ điện ảnh */}
                  <div className="absolute top-1/2 right-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gold/50 text-[11px] font-mono text-champagne shadow-xl">
                    Gập gối: 96° (Chuẩn)
                  </div>
                  <div className="absolute bottom-16 left-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/50 text-[11px] font-mono text-emerald-400 shadow-xl">
                    Cột sống: 88° (Thẳng)
                  </div>
                </div>

                {/* Phản hồi tức thì */}
                <div className="relative z-10 w-full p-3 rounded-2xl bg-emerald-950/70 backdrop-blur-md border border-emerald-500/40 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Tư thế hoàn hảo</span>
                    <span className="text-emerald-300">Độ sâu squat lý tưởng, giữ ngực thẳng</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </CinematicBackground>
    </section>
  );
}

// ─── 1. Công nghệ thay đổi cách bạn tập luyện ──────────────────────────────────
function Section1TechChange() {
  return (
    <section id="tech" className="relative py-24 bg-dark-surface border-y border-white/5 overflow-hidden">
      {/* Background Animated Grid & Precision Circles */}
      <AnimatedGrid opacity={0.2} showRadar={true} />
      <AmbientLight color="#C9A227" position="top-right" size="lg" intensity={0.12} />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            01 — CÔNG NGHỆ THỊ GIÁC ĐỈNH CAO
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Công nghệ thay đổi cách bạn tập luyện.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            AIFit đưa sức mạnh của thị giác máy tính vào từng chuyển động. Không
            cần phòng lab chuyên dụng hay thiết bị đeo rườm rà, bạn có ngay một
            chuyên gia sinh cơ học trực tiếp bên cạnh.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-8">
          <FadeUp delay={0.1}>
            <div className="p-8 rounded-3xl bg-dark-bg border border-white/10 hover:border-gold/50 transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center font-bold">
                <Eye size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Nhận diện 33 điểm khớp
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Thuật toán xác định chính xác vị trí các khớp then chốt từ vai,
                  khuỷu tay, hông, đầu gối đến mắt cá chân trong từng mili-giây.
                </p>
              </div>
              <div className="pt-2 font-mono text-xs text-gold font-bold">
                Tốc độ xử lý: 20–30 FPS
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="p-8 rounded-3xl bg-dark-bg border border-white/10 hover:border-gold/50 transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Xử lý cục bộ tại thiết bị
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Mô hình chạy trực tiếp bằng WebAssembly trên CPU/GPU máy bạn.
                  Không gửi hình ảnh qua Internet, không gián đoạn kết nối.
                </p>
              </div>
              <div className="pt-2 font-mono text-xs text-emerald-400 font-bold">
                Độ trễ gần như bằng 0
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="p-8 rounded-3xl bg-dark-bg border border-white/10 hover:border-gold/50 transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Chuẩn hóa Y học Thể thao
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Toàn bộ biên độ góc và quy tắc kiểm tra được thiết lập dựa
                  trên giáo trình đào tạo thể thao và phục hồi chức năng chuẩn.
                </p>
              </div>
              <div className="pt-2 font-mono text-xs text-amber-400 font-bold">
                Biên độ sai số: ±2 độ
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Không chỉ là tập luyện (Giới thiệu AIFit — Nền Kem Cao Cấp) ──────────────
function Section2NotJustWorkout() {
  return (
    <section className="relative py-24 bg-cream text-text-primary overflow-hidden border-y border-cream-border">
      {/* Animated Contour Lines & Luxury Cream Background */}
      <AnimatedContourLines opacity={0.16} color="#C9A227" />
      <AmbientLight color="#E7CA80" position="bottom-right" size="lg" intensity={0.15} />
      <GrainOverlay opacity={0.025} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <FadeUp className="space-y-6">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            02 — TRẢI NGHIỆM ĐỒNG HÀNH
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight leading-tight">
            Không chỉ là tập luyện.
            <br />
            <span className="text-gold-dark">
              Đây là sự khai phóng cơ thể.
            </span>
          </h2>
          <p className="text-text-secondary text-base leading-relaxed">
            Phần lớn người tập tại nhà bỏ cuộc hoặc gặp chấn thương do không có
            ai hướng dẫn sửa form. AIFit xóa bỏ nỗi lo này bằng cách biến mọi
            không gian sống thành một studio cao cấp với huấn luyện viên luôn sát
            cánh.
          </p>

          <div className="space-y-4 pt-2">
            {[
              'Sửa lỗi tư thế bằng giọng nói ngay trong lúc bạn đang di chuyển.',
              'Tự động nhận diện lần lặp hoàn thành mà không cần bấm nút.',
              'Ghi nhớ lịch sử luyện tập và nhắc nhở điều chỉnh kỹ thuật liên tục.',
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <CheckCircle size={15} />
                </div>
                <span className="text-sm font-medium text-text-secondary">{text}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="flex justify-center">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-cream-border shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-cream-border pb-4">
              <span className="text-xs font-mono font-bold text-gold-dark">
                PHẢN HỒI ÂM THANH TRỰC TIẾP
              </span>
              <Mic size={18} className="text-gold animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong className="block text-amber-800 font-bold mb-1">
                  Cảnh báo AI:
                </strong>
                "Hông đang bị võng. Hãy siết cơ bụng và nâng hông lên."
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <strong className="block text-emerald-800 font-bold mb-1">
                  Khích lệ AI:
                </strong>
                "Độ sâu gập gối rất chuẩn! Đạp gót chân đứng thẳng lên."
              </div>
            </div>

            <p className="text-xs text-text-secondary text-center italic">
              Giọng nói tiếng Việt chuẩn xác, hỗ trợ chuyển đổi bật/tắt linh
              hoạt.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── 3. Mỗi chuyển động đều có ý nghĩa ─────────────────────────────────────────
function Section3EveryMovementMatters() {
  return (
    <section className="py-24 bg-dark-surface border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            03 — CHI TIẾT SINH HỌC
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Mỗi chuyển động đều có ý nghĩa.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Tập nhiều rep sai không bằng một rep chuẩn form. Từng góc khớp gập
            đúng chuẩn giúp kích hoạt tối đa nhóm cơ mục tiêu và bảo vệ các dây
            chằng khớp xương.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              part: 'Khớp Đầu Gối',
              range: '90° – 110°',
              desc: 'Tối ưu cơ tứ đầu đùi và mông, giải phóng áp lực bánh chè.',
            },
            {
              part: 'Góc Cột Sống',
              range: 'Thẳng tự nhiên',
              desc: 'Giữ lưng trung tính, triệt tiêu nguy cơ thoát vị đĩa đệm.',
            },
            {
              part: 'Khớp Khuỷu Tay',
              range: '≤ 90° đáy rep',
              desc: 'Biên độ đầy đủ để phát triển ngực và tay sau toàn diện.',
            },
            {
              part: 'Đường Thẳng Thân',
              range: '165° – 180°',
              desc: 'Siết cơ lõi tối đa, ngăn ngừa võng hoặc nhô hông khi plank.',
            },
          ].map((item, idx) => (
            <FadeUp key={idx} delay={idx * 0.1}>
              <div className="p-6 rounded-3xl bg-dark-bg border border-white/10 hover:border-gold/40 transition-all space-y-3">
                <span className="text-xs font-bold text-gold uppercase tracking-wider block">
                  {item.part}
                </span>
                <div className="font-display font-black text-2xl text-white">
                  {item.range}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Khám phá bộ bài tập (V3.0 Cinematic Exercise Cards) ────────────────────
function Section4ExerciseCollection() {
  const navigate = useNavigate();

  const exercises = [
    {
      id: 1,
      name: 'Squat',
      sub: 'Đứng lên ngồi xuống',
      mode: 'Đo số lần tập (Reps)',
      joints: 'Hông › Đầu gối › Cổ chân',
      desc: 'Bài tập vua phát triển sức mạnh toàn diện thân dưới, cơ mông và đùi trước.',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: 'Plank',
      sub: 'Giữ tư thế thẳng người',
      mode: 'Giữ thời gian (Hold Time)',
      joints: 'Vai › Hông › Cổ chân',
      desc: 'Kích hoạt toàn bộ nhóm cơ lõi, gia cố sự vững chãi của cột sống thắt lưng.',
      image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name: 'Push-up',
      sub: 'Chống đẩy',
      mode: 'Đo số lần tập (Reps)',
      joints: 'Vai › Khuỷu tay › Cổ tay',
      desc: 'Tăng cường sức mạnh thân trên: ngực, vai và tay sau với trọng lượng cơ thể.',
      image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="exercises" className="relative py-24 bg-dark-bg overflow-hidden">
      {/* Dynamic Athletic Energy Lines Background */}
      <AmbientLight color="#C9A227" position="center" size="lg" intensity={0.12} />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            04 — DANH MỤC HUẤN LUYỆN
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Khám phá bộ bài tập.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Các bài tập nền tảng được số hóa với bộ quy tắc sinh học tiêu chuẩn.
            Lựa chọn bài tập và bắt đầu chỉ với 2 cú nhấp chuột.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-8">
          {exercises.map((ex, idx) => (
            <FadeUp key={ex.id} delay={idx * 0.1}>
              <div className="rounded-3xl bg-dark-surface border border-white/10 hover:border-gold/60 transition-all flex flex-col justify-between h-full group overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-gold/10">
                {/* Image Header with Mask Reveal & Zoom */}
                <div className="relative h-56 w-full overflow-hidden bg-black">
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="h-full w-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 will-change-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-champagne backdrop-blur-md border border-gold/30">
                      {ex.mode}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/60 text-gray-300 backdrop-blur-md">
                      Bài #{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 z-10">
                    <h3 className="font-display font-black text-3xl text-white group-hover:text-gold transition-colors">
                      {ex.name}
                    </h3>
                    <p className="text-xs font-semibold text-champagne mt-0.5">
                      {ex.sub}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {ex.desc}
                  </p>

                  <div className="pt-3 border-t border-white/10 text-xs text-gray-400">
                    <span className="text-gray-400 block mb-1">
                      Chuỗi khớp theo dõi:
                    </span>
                    <strong className="text-champagne font-mono">{ex.joints}</strong>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => navigate(`/exercise/${ex.id}/guide`)}
                      className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-gold hover:text-dark-bg text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-gold/20"
                    >
                      <span>Khám phá bài tập</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Trải nghiệm sức mạnh của AI ───────────────────────────────────────────
function Section5AIPower() {
  const [demoState, setDemoState] = useState<'correct' | 'incorrect'>('correct');

  return (
    <section className="py-24 bg-dark-surface border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            05 — TRỰC QUAN HÓA THỜI GIAN THỰC
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Trải nghiệm sức mạnh của AI.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Xem cách trí tuệ nhân tạo nhận biết chính xác chuyển động và phản hồi
            ngay khi phát hiện sai lệch.
          </p>
        </FadeUp>

        <div className="max-w-4xl mx-auto bg-dark-bg rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-2xl space-y-8">
          {/* Thanh chuyển đổi trạng thái test */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-white/10">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Mô phỏng Nhận diện Góc Squat
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Nhấp nút bên phải để kiểm tra cơ chế phân tích form của AI
              </p>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-dark-surface border border-white/10">
              <button
                onClick={() => setDemoState('correct')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  demoState === 'correct'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tư thế đúng
              </button>
              <button
                onClick={() => setDemoState('incorrect')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  demoState === 'incorrect'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tư thế sai (Lỗi)
              </button>
            </div>
          </div>

          {/* Khung hiển thị thông số mô phỏng */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-dark-surface border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Trạng thái tư thế
              </span>
              <div
                className={`font-display font-black text-2xl ${
                  demoState === 'correct' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {demoState === 'correct' ? 'ĐÚNG CHUẨN FORM' : 'SAI LỆCH TƯ THẾ'}
              </div>
              <span className="text-xs text-gray-400">
                {demoState === 'correct' ? 'Nằm trong biên độ mục tiêu' : 'Vượt ngưỡng cho phép'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Góc gập đầu gối
              </span>
              <div className="font-display font-black text-3xl text-white">
                {demoState === 'correct' ? '98°' : '76°'}
              </div>
              <span className="text-xs text-champagne font-mono">
                Ngưỡng chuẩn: 90° – 110°
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Độ chuẩn xác form
              </span>
              <div
                className={`font-display font-black text-3xl ${
                  demoState === 'correct' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {demoState === 'correct' ? '94%' : '65%'}
              </div>
              <span className="text-xs text-gray-400">
                {demoState === 'correct' ? 'Xuất sắc' : 'Cần cải thiện'}
              </span>
            </div>
          </div>

          {/* Câu thông báo phản hồi từ AI */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              demoState === 'correct'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-100'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Volume2Icon isError={demoState === 'incorrect'} />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  CÂU THOẠI AI PHÁT RA LOA:
                </span>
                <p className="font-display font-bold text-base sm:text-lg">
                  {demoState === 'correct'
                    ? '“Tư thế rất tốt! Tiếp tục đạp gót đứng thẳng lên.”'
                    : '“Squat chưa đủ sâu — vui lòng hạ thấp hơn để gập gối khoảng 90 độ.”'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Volume2Icon({ isError }: { isError: boolean }) {
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        isError ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
      }`}
    >
      <Mic size={20} />
    </div>
  );
}

// ─── 6. Tập đúng tư thế — nâng cao hiệu quả (Motion Analysis Grid) ────────────
function Section6CorrectPosture() {
  return (
    <section className="relative py-24 bg-dark-bg overflow-hidden border-y border-white/5">
      {/* Motion Analysis Grid Background */}
      <AnimatedGrid opacity={0.14} showRadar={false} />
      <AmbientLight color="#16A34A" position="top-left" size="md" intensity={0.08} />
      <AmbientLight color="#DC2626" position="bottom-right" size="md" intensity={0.08} />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <FadeUp className="space-y-6">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            06 — AN TOÀN & HIỆU QUẢ
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Tập đúng tư thế —
            <br />
            <span style={{ color: '#E7CA80' }}>nâng cao hiệu quả.</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Sai tư thế trong thời gian dài là nguyên nhân hàng đầu dẫn đến thoái
            hóa khớp gối và chấn thương lưng dưới. AIFit đóng vai trò như một tấm
            khiên bảo vệ bạn trong mọi buổi tập.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-dark-surface/90 border border-emerald-500/40 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                TƯ THẾ ĐÚNG
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Kích thích 100% sợi cơ, xây dựng cơ bắp cân đối và tăng cường mật
                độ xương khớp.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface/90 border border-red-500/40 shadow-lg shadow-red-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl pointer-events-none" />
              <span className="text-xs font-bold text-red-400 block mb-1">
                TƯ THẾ SAI
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Gây áp lực chéo lên sụn chêm, sai lệch trục cột sống và giảm hiệu
                suất tiêu hao calo.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="space-y-4">
          <div className="p-6 rounded-3xl bg-dark-surface border border-white/10 hover:border-red-500/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-white text-base">
                Lỗi Võng Hông (Plank)
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Nguy hiểm</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Trọng lực đè nặng lên các đốt sống L4-L5 gây đau lưng dưới. AI sẽ
              nhắc nâng hông ngay khi góc thân giảm dưới 165 độ.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-surface border border-white/10 hover:border-amber-500/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-white text-base">
                Lỗi Mở Khuỷu Tay Quá Rộng (Push-up)
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Cần chỉnh</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Khuỷu mở góc trên 75 độ gây chèn ép gân cơ trên gai ở vai. AI nhắc
              khép khuỷu tạo góc 45-60 độ an toàn.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-surface border border-white/10 hover:border-yellow-500/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-white text-base">
                Lỗi Squat Nửa Vời
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Thiếu biên độ</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Không gập đủ 90 độ khiến cơ mông không được kích hoạt. AI chỉ tính
              rep hợp lệ khi đạt độ sâu chuẩn.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── 7. Ba bước để bắt đầu (V3.0 Golden Timeline Running Line) ─────────────────
function Section7ThreeSteps() {
  const steps = [
    {
      num: '01',
      title: 'Chọn bài tập của bạn',
      desc: 'Lựa chọn Squat, Plank hoặc Push-up từ danh mục. Xem nhanh các hướng dẫn đặt góc máy và điểm chú ý.',
      icon: <Dumbbell size={28} className="text-gold" />,
    },
    {
      num: '02',
      title: 'Bố trí góc quay camera',
      desc: 'Đặt điện thoại hoặc laptop cách vị trí tập từ 2 đến 3 mét góc nhìn ngang sườn. Đảm bảo thấy toàn thân.',
      icon: <Camera size={28} className="text-gold" />,
    },
    {
      num: '03',
      title: 'Tập luyện cùng trợ lý AI',
      desc: 'Màn hình đếm ngược 3 giây. Thực hiện bài tập và lắng nghe phản hồi điều chỉnh giọng nói tức thì từ AI.',
      icon: <Brain size={28} className="text-gold" />,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-dark-surface border-y border-white/5 overflow-hidden">
      <AmbientLight color="#C9A227" position="center" size="lg" intensity={0.1} />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            07 — ĐƠN GIẢN & TIỆN LỢI
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Ba bước để bắt đầu.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Không cần cài đặt ứng dụng phức tạp hay đăng ký gói cước đắt đỏ. Bạn
            có thể bắt đầu buổi tập đầu tiên chỉ sau 30 giây.
          </p>
        </FadeUp>

        {/* Timeline container */}
        <div className="relative">
          {/* Golden Horizontal Timeline Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-[2px] bg-gradient-to-r from-gold/20 via-gold/60 to-gold/20 -translate-y-8 z-0" />

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((st, idx) => (
              <FadeUp key={st.num} delay={idx * 0.15}>
                <div className="p-8 rounded-3xl bg-dark-bg/95 backdrop-blur-md border border-white/10 hover:border-gold/60 transition-all space-y-5 h-full relative overflow-hidden shadow-xl group">
                  <span className="font-display font-black text-6xl text-white/5 absolute -right-2 -bottom-2 select-none group-hover:text-gold/10 transition-colors">
                    {st.num}
                  </span>

                  <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center border border-gold/30 shadow-md shadow-gold/10 group-hover:scale-110 transition-transform">
                    {st.icon}
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-champagne uppercase tracking-widest block mb-1">
                      BƯỚC {st.num}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-gold transition-colors">
                      {st.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. Theo dõi từng bước tiến bộ (V3.0 Faint Chart Waveforms Background) ────
function Section8TrackProgress() {
  return (
    <section className="relative py-24 bg-dark-bg overflow-hidden border-y border-white/5">
      {/* Background Decorative Chart Waveforms & Glow */}
      <AmbientLight color="#C9A227" position="bottom-left" size="lg" intensity={0.12} />
      <GrainOverlay opacity={0.03} />

      {/* Faint Decorative Waveform Lines in Background */}
      <div className="pointer-events-none absolute inset-0 opacity-10 overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full object-cover" viewBox="0 0 1200 400" fill="none">
          <path
            d="M0,280 Q300,120 600,240 T1200,160"
            stroke="#C9A227"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <path
            d="M0,320 Q400,200 800,290 T1200,220"
            stroke="#E7CA80"
            strokeWidth="2"
          />
          <circle cx="600" cy="240" r="8" fill="#C9A227" className="animate-ping opacity-75" />
          <circle cx="600" cy="240" r="4" fill="#E7CA80" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            08 — TIẾN TRÌNH & THỐNG KÊ
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Theo dõi từng bước tiến bộ.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Mỗi giọt mồ hôi đều được ghi nhận bằng số liệu trực quan, giúp bạn
            thấy rõ sự cải thiện kỹ thuật qua từng tuần.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Biểu đồ Recharts xu hướng độ chính xác */}
          <FadeUp className="lg:col-span-7 bg-dark-surface/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Độ chuẩn xác form qua các buổi tập
                </h3>
                <p className="text-xs text-gray-400">Xu hướng tăng trưởng độ chuẩn kỹ thuật (%)</p>
              </div>
              <span className="text-xs font-bold text-gold font-mono">+24% tiến bộ</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACCURACY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A227" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C9A227" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="session" stroke="#737780" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#737780" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101114',
                      borderColor: '#C9A227',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#C9A227"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#goldArea)"
                    name="Độ chính xác (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FadeUp>

          {/* 3 Thẻ chỉ số tổng kết */}
          <FadeUp delay={0.2} className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-dark-surface/90 backdrop-blur-md border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Độ chính xác trung bình
              </span>
              <div className="font-display font-black text-4xl text-emerald-400">
                87.5%
              </div>
              <p className="text-xs text-gray-400">Nằm trong nhóm chuẩn mực xuất sắc</p>
            </div>

            <div className="p-6 rounded-3xl bg-dark-surface/90 backdrop-blur-md border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tổng số Reps chuẩn form
              </span>
              <div className="font-display font-black text-4xl text-white">
                482 reps
              </div>
              <p className="text-xs text-gray-400">Đã hoàn thành trong 30 ngày qua</p>
            </div>

            <div className="p-6 rounded-3xl bg-dark-surface/90 backdrop-blur-md border border-white/10 space-y-1 shadow-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Thời gian giữ tư thế tích lũy
              </span>
              <div className="font-display font-black text-4xl text-gold">
                1,240s
              </div>
              <p className="text-xs text-gray-400">Tương đương hơn 20 phút siết cơ lõi</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── 9. Quyền riêng tư của bạn là ưu tiên của chúng tôi (V3.0 Pulse Shield Waves)
function Section9PrivacyPriority() {
  return (
    <section className="relative py-28 bg-dark-surface border-y border-white/5 overflow-hidden">
      {/* Pulsing Shield Radar Ripples Background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute inset-0 rounded-full border border-gold/15 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-[60px] rounded-full border border-gold/20" />
          <div className="absolute inset-[130px] rounded-full border border-gold/15 border-dashed" />
          <div className="absolute inset-[200px] rounded-full bg-gold/5 blur-2xl" />
        </div>
      </div>
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <FadeUp>
          <div className="w-20 h-20 rounded-3xl bg-gold/15 text-gold flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold/20 border border-gold/30">
            <Lock size={36} />
          </div>

          <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-2">
            09 — BẢO MẬT DỮ LIỆU
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Quyền riêng tư của bạn là ưu tiên của chúng tôi.
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            Hình ảnh camera được xử lý trọn vẹn trong trình duyệt của bạn và{' '}
            <strong className="text-gold">tuyệt đối không bao giờ được lưu trữ</strong>{' '}
            hay tải lên bất kỳ máy chủ nào. Chỉ có số liệu hiệu suất được lưu — và
            hoàn toàn theo ý muốn của bạn.
          </p>

          <div className="pt-8 flex flex-wrap gap-4 justify-center">
            {[
              'Không tải video lên máy chủ',
              'Xử lý 100% trong trình duyệt',
              'Dữ liệu thuộc quyền sở hữu của bạn',
              'Không theo dõi danh tính cá nhân',
            ].map(item => (
              <span
                key={item}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border border-gold/30 bg-dark-bg/80 backdrop-blur-md text-gray-200 shadow-md"
              >
                <CheckCircle size={14} className="text-gold" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── 10. Câu hỏi thường gặp (FAQ) ─────────────────────────────────────────────
function Section10FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Tôi có cần mua thêm thiết bị hoặc cảm biến đeo tay không?',
      a: 'Hoàn toàn không. Bạn chỉ cần một chiếc điện thoại thông minh, máy tính bảng hoặc laptop có webcam thông thường. Toàn bộ công nghệ AI thị giác đều xử lý trực tiếp trên camera có sẵn.',
    },
    {
      q: 'Hình ảnh video quay lúc tôi tập có bị ai khác nhìn thấy không?',
      a: 'Không. Thuật toán MediaPipe chạy trực tiếp ngay trên bộ nhớ trình duyệt của bạn. Hình ảnh chuyển đổi thành các tọa độ góc khớp toán học và tự động hủy ngay sau khung hình đó, không bao giờ gửi ra ngoài Internet.',
    },
    {
      q: 'Làm thế nào để AIFit nhận diện tư thế của tôi chính xác nhất?',
      a: 'Bạn chỉ cần đặt camera ngang tầm hông, cách người tập từ 2 đến 3 mét với góc nhìn ngang sườn (profile). Đảm bảo phòng đủ ánh sáng và toàn bộ cơ thể từ đầu đến chân nằm trong khung hình.',
    },
    {
      q: 'AIFit hiện đang hỗ trợ theo dõi những bài tập nào?',
      a: 'Phiên bản hiện tại tập trung sâu vào 3 bài tập nền tảng quan trọng nhất: Squat (Đứng lên ngồi xuống), Plank (Giữ tư thế thẳng người) và Push-up (Chống đẩy) với đầy đủ các quy tắc phát hiện lỗi y học thể thao.',
    },
    {
      q: 'Nếu tôi mất kết nối Internet trong lúc tập thì sao?',
      a: 'Hệ thống AIFit hỗ trợ chế độ ngoại tuyến hoàn toàn. Buổi tập của bạn vẫn được theo dõi và tính toán bình thường. Dữ liệu sẽ tự động lưu cục bộ trên thiết bị và đồng bộ lại khi có mạng.',
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-dark-bg overflow-hidden border-b border-white/5">
      <AmbientLight color="#C9A227" position="bottom-right" size="lg" intensity={0.1} />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <FadeUp className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block">
            10 — GIẢI ĐÁP THẮC MẮC
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Câu hỏi thường gặp.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Mọi điều bạn cần biết trước khi bắt đầu hành trình tập luyện thông minh cùng AIFit.
          </p>
        </FadeUp>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <FadeUp key={idx} delay={idx * 0.08}>
                <div className="rounded-2xl bg-dark-surface/90 backdrop-blur-md border border-white/10 hover:border-gold/40 overflow-hidden transition-all shadow-lg">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-display font-bold text-base sm:text-lg text-white">
                      {faq.q}
                    </span>
                    <span className="text-gold shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 11. Final CTA Background (V3.0 Cinematic Athlete Parallax & Sweep) ────────
function Section11FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-dark-surface overflow-hidden">
      {/* Full-width Athlete Background with Ken Burns & Parallax */}
      <ParallaxImage
        src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1920&q=85"
        alt="Vận động viên AIFit Bứt phá giới hạn"
        opacity={0.35}
        scale={true}
        parallaxSpeed={0.14}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(16,17,20,0.8) 0%, rgba(16,17,20,0.95) 100%)',
        }}
        aria-hidden="true"
      />

      <AmbientLight color="#C9A227" position="center" size="lg" intensity={0.22} />
      <GrainOverlay opacity={0.04} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <FadeUp>
          <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-3">
            11 — BẮT ĐẦU NGAY HÔM NAY
          </span>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-tight uppercase">
            GIỚI HẠN HÔM NAY.
            <br />
            <span style={{ color: '#E7CA80' }}>SỨC MẠNH NGÀY MAI.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mt-4">
            Đừng để những rep tập sai kìm hãm sự tiến bộ của bạn. Hãy trải
            nghiệm trợ lý AI cá nhân hoàn toàn miễn phí ngay bây giờ.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl font-display font-black text-base transition-all shadow-2xl shadow-gold/30 cursor-pointer flex items-center justify-center gap-2 animate-light-sweep"
              style={{ background: '#C9A227', color: '#101114' }}
            >
              <span>Bắt đầu hành trình của bạn</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-bold text-base border border-white/20 text-white hover:border-gold hover:text-gold backdrop-blur-md transition-colors cursor-pointer"
            >
              Đăng nhập tài khoản
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer Background (V3.0 Obsidian Black with Watermark Typography) ─────────
function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 bg-[#101114] text-gray-400 text-xs overflow-hidden">
      {/* Thin Golden Top Glow Line */}
      <SectionDivider variant="gold" withDot={true} className="py-0 mb-12" />

      {/* Large Subtle Watermark Logo */}
      <div
        className="pointer-events-none absolute right-4 bottom-2 text-8xl sm:text-9xl font-display font-black text-white/5 select-none"
        aria-hidden="true"
      >
        AIFIT
      </div>

      <GrainOverlay opacity={0.025} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Cột thương hiệu */}
          <div className="space-y-3">
            <div className="font-display font-black text-2xl text-gold flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gold text-dark-bg text-xs font-black flex items-center justify-center">
                AI
              </span>
              <span>AIFit</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Trợ lý Thể hình Trí tuệ Nhân tạo — Ứng dụng công nghệ thị giác máy
              tính phân tích tư thế sinh cơ học thời gian thực.
            </p>
          </div>

          {/* Cột sản phẩm */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Sản phẩm</h4>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map(l => (
                <button
                  key={l.label}
                  onClick={() => scrollTo(l.href)}
                  className="text-left hover:text-gold transition-colors cursor-pointer"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cột bài tập */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Bài tập chính</h4>
            <div className="flex flex-col gap-2.5">
              <span className="hover:text-white">Squat — Đứng lên ngồi xuống</span>
              <span className="hover:text-white">Plank — Giữ tư thế thẳng người</span>
              <span className="hover:text-white">Push-up — Chống đẩy</span>
            </div>
          </div>

          {/* Cột pháp lý & bảo mật */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Pháp lý & Bảo mật</h4>
            <div className="flex flex-col gap-2.5">
              <span className="hover:text-white">Điều khoản Dịch vụ</span>
              <span className="hover:text-white">Chính sách Bảo mật Thông tin</span>
              <span className="hover:text-white">Xử lý Cục bộ Trình duyệt</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <span>© 2026 AIFit. Bảo lưu mọi quyền. Dự án C1SE.87 — Đại học Duy Tân.</span>
          <span>Thiết kế & Công nghệ chuẩn quốc tế dành riêng cho người dùng Việt Nam.</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white select-none">
      <Navbar />
      <main>
        <HeroSection />
        <Section1TechChange />
        <Section2NotJustWorkout />
        <Section3EveryMovementMatters />
        <Section4ExerciseCollection />
        <Section5AIPower />
        <Section6CorrectPosture />
        <Section7ThreeSteps />
        <Section8TrackProgress />
        <Section9PrivacyPriority />
        <Section10FAQ />
        <Section11FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
