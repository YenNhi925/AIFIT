import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TOTAL_DURATION = 5000; // ms
const FORCE_TIMEOUT = 6000;

function markSeen() {
  sessionStorage.setItem('aifit_intro_seen', '1');
}

// 20 hạt ánh sáng vàng di chuyển
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.round(5 + (i * 4.7) % 90),
  y: Math.round(3 + (i * 7.3) % 90),
  delay: parseFloat(((i * 0.17) % 1.8).toFixed(2)),
  size: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
}));

// Tọa độ các khớp xương chuẩn
const JOINTS = [
  { id: 'head',           cx: 100, cy: 30  },
  { id: 'left-shoulder',  cx: 68,  cy: 75  },
  { id: 'right-shoulder', cx: 132, cy: 75  },
  { id: 'left-elbow',     cx: 52,  cy: 125 },
  { id: 'right-elbow',    cx: 148, cy: 125 },
  { id: 'left-wrist',     cx: 44,  cy: 170 },
  { id: 'right-wrist',    cx: 156, cy: 170 },
  { id: 'left-hip',       cx: 78,  cy: 160 },
  { id: 'right-hip',      cx: 122, cy: 160 },
  { id: 'left-knee',      cx: 72,  cy: 230 },
  { id: 'right-knee',     cx: 128, cy: 230 },
  { id: 'left-ankle',     cx: 68,  cy: 300 },
  { id: 'right-ankle',    cx: 132, cy: 300 },
];

const CONNECTIONS = [
  ['left-shoulder','right-shoulder'],
  ['left-shoulder','left-elbow'],
  ['left-elbow','left-wrist'],
  ['right-shoulder','right-elbow'],
  ['right-elbow','right-wrist'],
  ['left-shoulder','left-hip'],
  ['right-shoulder','right-hip'],
  ['left-hip','right-hip'],
  ['left-hip','left-knee'],
  ['left-knee','left-ankle'],
  ['right-hip','right-knee'],
  ['right-knee','right-ankle'],
];

const JOINT_APPEAR_ORDER = [
  'left-shoulder','right-shoulder','left-hip','right-hip',
  'left-knee','right-knee','left-elbow','right-elbow','left-wrist','right-wrist',
];

export default function IntroPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      markSeen();
      navigate('/welcome', { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => {
      markSeen();
      navigate('/welcome', { replace: true });
    }, FORCE_TIMEOUT);
    return () => clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => {
      markSeen();
      navigate('/welcome', { replace: true });
    }, TOTAL_DURATION);
    return () => clearTimeout(t);
  }, [navigate]);

  function handleSkip() {
    markSeen();
    navigate('/welcome', { replace: true });
  }

  function handleExplore() {
    markSeen();
    navigate('/welcome', { replace: true });
  }

  const jointMap = Object.fromEntries(JOINTS.map(j => [j.id, j]));

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center select-none px-4"
      style={{ background: '#101114' }}
    >
      {/* Trường hạt ánh sáng vàng */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: '#C9A227',
              opacity: 0,
              animation: `particle-fade ${1.5 + p.delay}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Silhouette & Khung xương SVG */}
      <motion.div
        className="relative"
        style={{ width: 180, height: 280 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <svg
          viewBox="0 0 200 320"
          width={180}
          height={280}
          className="absolute inset-0"
          style={{ filter: 'drop-shadow(0 0 24px #C9A22766)' }}
        >
          <ellipse cx="100" cy="28" rx="18" ry="22" fill="#C9A22733" />
          <rect x="70" y="48" width="60" height="80" rx="10" fill="#C9A22733" />
          <rect x="44" y="52" width="22" height="100" rx="8" fill="#C9A22733" />
          <rect x="134" y="52" width="22" height="100" rx="8" fill="#C9A22733" />
          <rect x="78" y="128" width="20" height="90" rx="8" fill="#C9A22733" />
          <rect x="102" y="128" width="20" height="90" rx="8" fill="#C9A22733" />
          <rect x="76" y="218" width="18" height="78" rx="7" fill="#C9A22733" />
          <rect x="106" y="218" width="18" height="78" rx="7" fill="#C9A22733" />

          {CONNECTIONS.map(([a, b]) => {
            const ja = jointMap[a];
            const jb = jointMap[b];
            if (!ja || !jb) return null;
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={ja.cx} y1={ja.cy}
                x2={jb.cx} y2={jb.cy}
                stroke="#C9A227"
                strokeWidth={1.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              />
            );
          })}

          {JOINT_APPEAR_ORDER.map((id, i) => {
            const j = jointMap[id];
            if (!j) return null;
            return (
              <motion.circle
                key={id}
                cx={j.cx}
                cy={j.cy}
                r={5}
                fill="#C9A227"
                stroke="#E7CA80"
                strokeWidth={1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 1.4 + i * 0.12 }}
              />
            );
          })}
        </svg>

        {/* Tia quét AI màu vàng */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #C9A227, #E7CA80, #C9A227, transparent)',
            boxShadow: '0 0 12px 3px #C9A22788',
          }}
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, delay: 0.9, ease: 'linear' }}
        />
      </motion.div>

      {/* Logo AIFit */}
      <motion.div
        className="mt-6 font-display font-black text-4xl sm:text-5xl tracking-wider text-center"
        style={{
          color: '#C9A227',
          textShadow: '0 0 32px #C9A22799, 0 0 64px #C9A22733',
          letterSpacing: '0.12em',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 2.0 }}
      >
        AIFit
      </motion.div>

      {/* Tiêu đề chính theo đặc tả */}
      <motion.h1
        className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-center mt-3 tracking-tight max-w-2xl"
        style={{ color: '#FAF6EC' }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.4 }}
      >
        CHUYỂN ĐỘNG CHUẨN XÁC — BỨT PHÁ GIỚI HẠN
      </motion.h1>

      {/* Phụ đề theo đặc tả */}
      <motion.p
        className="text-sm sm:text-base text-center mt-2 font-medium max-w-lg"
        style={{ color: '#E7CA80' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.7 }}
      >
        Trợ lý tập luyện thông minh dành riêng cho bạn.
      </motion.p>

      {/* Nút tác vụ (Bỏ qua & Khám phá AIFit) */}
      <motion.div
        className="flex items-center gap-4 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 3.0 }}
      >
        <motion.button
          onClick={handleSkip}
          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer"
          style={{
            borderColor: '#C9A22766',
            color: '#C9A227',
            background: 'transparent',
          }}
          whileHover={{ borderColor: '#C9A227', backgroundColor: '#C9A22722' }}
        >
          Bỏ qua giới thiệu
        </motion.button>

        <motion.button
          onClick={handleExplore}
          className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-gold/20"
          style={{
            background: '#C9A227',
            color: '#101114',
          }}
          whileHover={{ backgroundColor: '#A8841A' }}
        >
          <span>Khám phá AIFit</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Thanh tiến trình thời gian mỏng dưới cùng */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: '#191B20' }}
      >
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #C9A227, #E7CA80)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: TOTAL_DURATION / 1000, ease: 'linear' }}
        />
      </div>

      <style>{`
        @keyframes particle-fade {
          0% { opacity: 0; transform: scale(0.8) translateY(0); }
          50% { opacity: 0.7; }
          100% { opacity: 0.1; transform: scale(1.2) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
