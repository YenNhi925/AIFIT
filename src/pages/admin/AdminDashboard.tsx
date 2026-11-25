import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  Target,
  AlertTriangle,
  Download,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Radio,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { MOCK_USERS, MOCK_LOGS } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { success } = useToast();
  const [period, setPeriod] = useState<'7' | '30'>('7');

  // Dữ liệu biểu đồ số buổi tập mỗi ngày
  const dailyActivityData = useMemo(() => {
    if (period === '7') {
      return [
        { day: 'Thứ 2', sessions: 28 },
        { day: 'Thứ 3', sessions: 42 },
        { day: 'Thứ 4', sessions: 35 },
        { day: 'Thứ 5', sessions: 58 },
        { day: 'Thứ 6', sessions: 46 },
        { day: 'Thứ 7', sessions: 67 },
        { day: 'Chủ nhật', sessions: 52 },
      ];
    } else {
      return [
        { day: 'Tuần 1', sessions: 210 },
        { day: 'Tuần 2', sessions: 245 },
        { day: 'Tuần 3', sessions: 280 },
        { day: 'Tuần 4', sessions: 315 },
      ];
    }
  }, [period]);

  // Tổng số buổi tập tính chuẩn xác từ nguồn dữ liệu biểu đồ để đảm bảo nhất quán tuyệt đối
  const totalActivitySessions = useMemo(() => {
    return dailyActivityData.reduce((acc, d) => acc + d.sessions, 0);
  }, [dailyActivityData]);

  // Các chỉ số KPI tổng thể
  const totalUsers = MOCK_USERS.length;
  const avgAccuracy = 84; // Độ chính xác trung bình toàn hệ thống (%)
  const errors24h = MOCK_LOGS.filter(l => l.type === 'Camera denied' || l.type === 'API error').length;

  // Dữ liệu chất lượng nhận diện sinh trắc học AI theo từng bài tập
  const qualityData = [
    { exercise: 'Squat', avgVisibility: 0.93, avgFps: 27, bodyLost: 4 },
    { exercise: 'Plank', avgVisibility: 0.95, avgFps: 28, bodyLost: 1 },
    { exercise: 'Push-up', avgVisibility: 0.91, avgFps: 26, bodyLost: 3 },
  ];

  const recentErrors = MOCK_LOGS.slice(0, 5);

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Chỉ số,Giá trị',
        `Tổng người dùng,${totalUsers}`,
        `Số buổi tập (${period === '7' ? '7 ngày qua' : '30 ngày qua'}),${totalActivitySessions}`,
        `Độ chính xác trung bình,${avgAccuracy}%`,
        `Số lỗi hệ thống (24h),${errors24h}`,
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `aifit-bao-cao-quan-tri-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Đã xuất báo cáo quản trị định dạng CSV thành công.');
  };

  return (
    <AdminLayout breadcrumbs={['Quản trị', 'Tổng quan hệ thống']}>
      <PageTransition>
        <div className="space-y-8">
          {/* ======================================================== */}
          {/* 2. SỬA BANNER TỔNG QUAN: HIGH-CONTRAST DARK COMMAND CENTER */}
          {/* ======================================================== */}
          <div className="relative w-full rounded-3xl bg-[#101114] bg-gradient-to-r from-[#101114] via-[#1B1D21] to-[#202124] border border-[#D5B56A]/25 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-lg">
            {/* Tech Grid Background Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:1.75rem_1.75rem] pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#D5B56A]/10 blur-3xl pointer-events-none" />

            {/* Left Content with High-Contrast Typography */}
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D5B56A]/15 border border-[#D5B56A]/35 text-[#D5B56A] text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                <Radio className="w-3.5 h-3.5 text-[#D5B56A] animate-pulse" />
                TRUNG TÂM ĐIỀU HÀNH AIFIT
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#F8FAFC] tracking-tight leading-tight">
                Tổng quan hệ thống
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                Xin chào Quản trị viên. Theo dõi hoạt động tập luyện, hiệu suất nhận diện của bộ máy thị giác máy tính và tình trạng hệ thống viễn trắc theo thời gian thực.
              </p>
            </div>

            {/* Right Graphic: AI Motion Tracking & Data Node Illustration */}
            <div className="relative z-10 shrink-0 w-full md:w-72 h-36 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl bg-[#16181C] border border-[#D5B56A]/30 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Scanning line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D5B56A] to-transparent motion-safe:animate-scan-y pointer-events-none opacity-80" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D5B56A] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#D5B56A]" />
                    AI Engine Core
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    SẴN SÀNG
                  </span>
                </div>

                {/* Simulated Joint Nodes Wireframe */}
                <div className="relative h-16 w-full flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 240 60">
                    <line x1="30" y1="30" x2="80" y2="18" stroke="#D5B56A" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="80" y1="18" x2="130" y2="40" stroke="#D5B56A" strokeWidth="1.5" opacity="0.8" />
                    <line x1="130" y1="40" x2="180" y2="20" stroke="#D5B56A" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="180" y1="20" x2="220" y2="35" stroke="#D5B56A" strokeWidth="1.5" opacity="0.8" />

                    <circle cx="30" cy="30" r="4" fill="#C9A227" />
                    <circle cx="80" cy="18" r="5" fill="#D5B56A" />
                    <circle cx="130" cy="40" r="6" fill="#FFFFFF" stroke="#C9A227" strokeWidth="2" />
                    <circle cx="180" cy="20" r="4" fill="#C9A227" />
                    <circle cx="220" cy="35" r="4" fill="#16A34A" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#A8AFBB] font-mono">
                  <span>33 Khớp xương</span>
                  <span>FPS: 28.2</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. THANH CÔNG CỤ (VỚI NÚT XUẤT BÁO CÁO RÕ NÉT)            */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-base text-[#202124]">
                Thống kê hoạt động
              </h2>
              <p className="text-xs text-[#64676E]">
                Dữ liệu đo lường theo dõi trong khoảng {period === '7' ? '7 ngày gần nhất' : '30 ngày gần nhất'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as '7' | '30')}
                className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-bold text-[#374151] shadow-xs outline-none focus:border-[#C9A227] transition-all cursor-pointer"
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
              </select>

              {/* Nút Xuất Báo Cáo rõ nét chuẩn Secondary Button */}
              <button
                type="button"
                onClick={handleExportReport}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold text-[#374151] bg-white hover:bg-[#F8F5ED] hover:text-[#161616] border border-[#D8D3C8] hover:border-[#C9A227] shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4 text-[#92701B]" />
                <span>Xuất báo cáo</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 7. BỐN THẺ KPI CÙNG CHIỀU CAO VÀ THẲNG HÀNG BASELINE    */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1: Tổng số người dùng */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E2D6] shadow-xs flex flex-col justify-between h-[156px] group hover:border-[#C9A227]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64676E]">
                  Tổng người dùng
                </span>
                <div className="w-9 h-9 rounded-xl bg-gold/10 text-[#92701B] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#202124] tabular-nums">
                  {totalUsers}
                </span>
                <span className="text-xs font-semibold text-[#64676E]">tài khoản</span>
              </div>
              <div className="text-[11px] text-[#64676E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Đồng bộ cơ sở dữ liệu
              </div>
            </div>

            {/* KPI 2: Số buổi tập (NHẤT QUÁN 100% VỚI BIỂU ĐỒ) */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E2D6] shadow-xs flex flex-col justify-between h-[156px] group hover:border-[#C9A227]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64676E]">
                  Số buổi tập
                </span>
                <div className="w-9 h-9 rounded-xl bg-gold/10 text-[#92701B] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#202124] tabular-nums">
                  {totalActivitySessions}
                </span>
                <span className="text-xs font-semibold text-[#64676E]">phiên hoàn tất</span>
              </div>
              <div className="text-[11px] text-[#64676E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#92701B]" />
                Tổng ghi nhận {period === '7' ? '7 ngày' : '30 ngày'}
              </div>
            </div>

            {/* KPI 3: Độ chính xác trung bình */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E2D6] shadow-xs flex flex-col justify-between h-[156px] group hover:border-[#C9A227]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64676E]">
                  Độ chính xác TB
                </span>
                <div className="w-9 h-9 rounded-xl bg-gold/10 text-[#92701B] flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#92701B] tabular-nums">
                  {avgAccuracy}%
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Đạt chuẩn
                </span>
              </div>
              <div className="text-[11px] text-[#64676E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Chuẩn sinh học mục tiêu &gt; 80%
              </div>
            </div>

            {/* KPI 4: Lỗi hệ thống trong 24h */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E2D6] shadow-xs flex flex-col justify-between h-[156px] group hover:border-red-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64676E]">
                  Lỗi hệ thống (24h)
                </span>
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-red-600 tabular-nums">
                  {errors24h}
                </span>
                <span className="text-xs font-semibold text-[#64676E]">sự cố camera/API</span>
              </div>
              <div className="text-[11px] text-red-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Nhật ký sự cố viễn trắc
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 8. BIỂU ĐỒ HOẠT ĐỘNG (NHẤT QUÁN 100% VỚI KPI)           */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D6] pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-[#202124]">
                  Số buổi tập luyện theo ngày
                </h3>
                <p className="text-xs text-[#64676E]">
                  Khối lượng vận động của người dùng toàn hệ thống AIFit
                </p>
              </div>
              <div className="text-xs font-bold text-[#92701B] font-mono bg-amber-50/80 px-3 py-1 rounded-full border border-[#D5B56A]/40">
                Tổng cộng: {totalActivitySessions} buổi
              </div>
            </div>

            <div className="w-full h-[280px] min-h-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailyActivityData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EADB" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: '#374151' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E8E2D6' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#374151' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E8E2D6' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101114',
                      borderColor: '#C9A227',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`${val} buổi tập`, 'Số lượng']}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="#C9A227"
                    radius={[6, 6, 0, 0]}
                    name="Số buổi tập"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HIỆU SUẤT NHẬN DIỆN AI & SỰ CỐ GẦN ĐÂY                   */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel: Hiệu suất nhận diện AI */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-xs flex flex-col justify-between space-y-4">
              <div className="border-b border-[#E8E2D6] pb-3">
                <div className="flex items-center gap-2 text-[#92701B] text-xs font-bold uppercase tracking-wider mb-1">
                  <Cpu className="w-4 h-4" />
                  Thị giác máy tính & Sinh trắc học
                </div>
                <h3 className="font-display font-bold text-lg text-[#202124]">
                  Hiệu suất nhận diện AI
                </h3>
                <p className="text-xs text-[#64676E]">
                  Chất lượng nhận diện MediaPipe Pose thực tế trên thiết bị học viên
                </p>
              </div>

              <div className="space-y-4">
                {qualityData.map(item => {
                  const visibilityPct = Math.round(item.avgVisibility * 100);
                  const isFpsLow = item.avgFps < 20;

                  return (
                    <div
                      key={item.exercise}
                      className="p-4 rounded-2xl bg-[#FAF6EC]/80 border border-[#E8E2D6] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-[#202124]">
                          Bài tập {item.exercise}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isFpsLow
                                ? 'bg-red-50 text-red-700 border-red-300'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                          >
                            {item.avgFps} FPS
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-[#64676E]">
                          <span>Độ hiển thị điểm khớp TB:</span>
                          <span className="font-bold text-[#202124]">{visibilityPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#E8E2D6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C9A227] rounded-full transition-all duration-500"
                            style={{ width: `${visibilityPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64676E] pt-1">
                        <span>Số lần mất nhận diện khớp:</span>
                        <span className="font-mono font-bold text-[#202124]">{item.bodyLost} lần</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#64676E] italic">
                * Tốc độ xử lý FPS &gt; 20 đảm bảo thời gian thực theo tiêu chuẩn NFR01.
              </p>
            </div>

            {/* Panel: Sự cố hệ thống gần đây */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
                <div>
                  <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Giám sát viễn trắc
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#202124]">
                    Sự cố hệ thống gần đây
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/admin/logs')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#92701B] hover:text-[#C9A227] cursor-pointer hover:underline"
                >
                  <span>Xem tất cả nhật ký</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {recentErrors.map(err => {
                  const dateObj = new Date(err.time);
                  return (
                    <div
                      key={err.id}
                      className="p-3.5 rounded-2xl border border-[#E8E2D6] bg-white hover:bg-[#FAF6EC] transition-colors flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0">
                        <StatusBadge status={err.type} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#202124] truncate">
                            {err.user}
                          </span>
                          <span className="text-[10px] text-[#64676E] shrink-0 font-mono">
                            {dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#374151] mt-0.5 line-clamp-1">
                          {err.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#E8E2D6]/70 flex items-center justify-between text-xs text-[#64676E]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Kênh viễn trắc đang mở
                </span>
                <span>Tự động cập nhật từ phiên tập</span>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
