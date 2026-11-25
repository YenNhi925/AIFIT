import React, { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  X,
  AlertTriangle,
  Camera,
  Activity,
  RefreshCw,
  Radio,
  Clock,
  User,
  Dumbbell,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { MOCK_LOGS } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { SystemLog } from '../../types';

export default function SystemLogs() {
  const { success } = useToast();
  const [logs] = useState<SystemLog[]>(MOCK_LOGS);
  const [periodFilter, setPeriodFilter] = useState('7');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  // Group metrics
  const apiErrorCount = logs.filter(l => l.type === 'API error').length;
  const bodyLostCount = logs.filter(l => l.type === 'Body lost').length;
  const cameraDeniedCount = logs.filter(l => l.type === 'Camera denied').length;
  const syncFailedCount = logs.filter(l => l.type === 'Sync failed').length;

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchType =
        typeFilter === 'Tất cả' ||
        (typeFilter === 'Từ chối camera' && l.type === 'Camera denied') ||
        (typeFilter === 'Mất nhận diện người' && l.type === 'Body lost') ||
        (typeFilter === 'Lỗi đồng bộ' && l.type === 'Sync failed') ||
        (typeFilter === 'Lỗi API' && l.type === 'API error');
      return matchType;
    });
  }, [logs, typeFilter]);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Thời gian,Người dùng,Bài tập,Loại lỗi,Thông báo',
        ...filteredLogs.map(
          l => `"${l.time}","${l.user}","${l.exercise}","${l.type}","${l.message}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `aifit-nhat-ky-loi-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Đã xuất nhật ký lỗi định dạng CSV thành công.');
  };

  return (
    <AdminLayout breadcrumbs={['Quản trị', 'Nhật ký hệ thống']}>
      <PageTransition>
        <div className="space-y-8">
          {/* ======================================================== */}
          {/* 11.1 PAGE HEADER: SYSTEM MONITORING CENTER               */}
          {/* ======================================================== */}
          <div className="relative overflow-hidden rounded-3xl bg-[#101114] bg-gradient-to-r from-[#101114] via-[#1B1D21] to-[#202124] border border-[#D5B56A]/25 p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <span className="text-xs font-bold text-gold uppercase tracking-wider block">
                  Trung tâm Giám sát Viễn trắc & Sự cố Kỹ thuật
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight">
                  Nhật ký hệ thống
                </h1>
                <p className="text-xs sm:text-sm text-[#CBD5E1]">
                  Theo dõi và chẩn đoán toàn diện các sự kiện kỹ thuật, sự cố truy cập camera và lỗi đồng bộ dữ liệu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#374151] bg-white hover:bg-[#F8F5ED] border border-[#D8D3C8] shadow-xs active:scale-98 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#92701B]" />
                <span>Xuất file CSV</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 11.2 OVERVIEW CHIPS (4 ERROR GROUPS)                     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Lỗi API
                </span>
                <span className="font-display font-black text-2xl text-red-600 tabular-nums">
                  {apiErrorCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Mất nhận diện người
                </span>
                <span className="font-display font-black text-2xl text-amber-600 tabular-nums">
                  {bodyLostCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Từ chối Camera
                </span>
                <span className="font-display font-black text-2xl text-red-600 tabular-nums">
                  {cameraDeniedCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Lỗi đồng bộ
                </span>
                <span className="font-display font-black text-2xl text-amber-600 tabular-nums">
                  {syncFailedCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 11.3 TOOLBAR                                             */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D6] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64676E] uppercase">Loại sự cố:</span>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-bold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                >
                  <option value="Tất cả">Tất cả loại sự cố</option>
                  <option value="Từ chối camera">Từ chối camera</option>
                  <option value="Mất nhận diện người">Mất nhận diện người</option>
                  <option value="Lỗi đồng bộ">Lỗi đồng bộ</option>
                  <option value="Lỗi API">Lỗi API</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64676E] uppercase">Thời gian:</span>
                <select
                  value={periodFilter}
                  onChange={e => setPeriodFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-bold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                >
                  <option value="1">24 giờ qua</option>
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="all">Toàn bộ thời gian</option>
                </select>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#64676E] bg-[#FAF6EC] px-3.5 py-1.5 rounded-full border border-[#D8D3C8]">
              Tổng số bản ghi: <strong className="text-[#202124]">{filteredLogs.length}</strong>
            </span>
          </div>

          {/* ======================================================== */}
          {/* 11.4 LOG TABLE                                           */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-[#E8E2D6] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#E8E2D6] text-[11px] font-bold uppercase tracking-wider text-[#64676E]">
                    <th className="py-4 px-5">Thời điểm ghi nhận</th>
                    <th className="py-4 px-5">Tài khoản</th>
                    <th className="py-4 px-5">Bài tập</th>
                    <th className="py-4 px-5">Phân loại sự cố</th>
                    <th className="py-4 px-5">Chi tiết thông báo</th>
                    <th className="py-4 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D6]/70">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#64676E]">
                        Không có sự cố nào được ghi nhận theo bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(l => {
                      const dateObj = new Date(l.time);
                      return (
                        <tr
                          key={l.id}
                          onClick={() => setSelectedLog(l)}
                          className="hover:bg-[#FAF6EC]/80 transition-colors group cursor-pointer"
                        >
                          <td className="py-4 px-5">
                            <div>
                              <span className="font-mono font-bold text-xs text-[#202124] block">
                                {dateObj.toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="text-[10px] text-[#64676E]">
                                {dateObj.toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-5 font-semibold text-xs text-[#202124]">
                            {l.user}
                          </td>

                          <td className="py-4 px-5 font-bold text-xs text-[#202124]">
                            {l.exercise}
                          </td>

                          <td className="py-4 px-5">
                            <StatusBadge status={l.type} />
                          </td>

                          <td className="py-4 px-5 text-[#374151] max-w-md">
                            <span className="line-clamp-1 block group-hover:text-[#92701B] transition-colors" title={l.message}>
                              {l.message}
                            </span>
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedLog(l);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-[#D8D3C8] text-xs font-bold text-[#374151] group-hover:border-gold group-hover:text-[#92701B] hover:bg-gold/10 transition-all cursor-pointer"
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
        </div>

        {/* ======================================================== */}
        {/* 11.5 DETAIL DRAWER (SLIDE OUT FROM RIGHT)                */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedLog && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLog(null)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
              />

              {/* Right Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-[#E8E2D6] shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-[#E8E2D6] flex items-center justify-between bg-[#FAF6EC]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-[#202124]">
                          Chi tiết Sự cố Hệ thống
                        </h3>
                        <span className="font-mono text-[10px] text-[#777981]">
                          Log ID: #{selectedLog.id}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedLog(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Body */}
                  <div className="p-6 space-y-6">
                    {/* Status & Badge */}
                    <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#E8E2D6] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#64676E] uppercase">Phân loại sự cố:</span>
                      <StatusBadge status={selectedLog.type} />
                    </div>

                    {/* Metadata Grid */}
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between py-2 border-b border-[#E8E2D6]/80">
                        <span className="text-[#64676E] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          Thời điểm ghi nhận:
                        </span>
                        <span className="font-mono font-bold text-[#202124]">
                          {new Date(selectedLog.time).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-[#E8E2D6]/80">
                        <span className="text-[#64676E] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gold" />
                          Tài khoản người dùng:
                        </span>
                        <span className="font-bold text-[#202124]">{selectedLog.user}</span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-[#E8E2D6]/80">
                        <span className="text-[#64676E] flex items-center gap-1.5">
                          <Dumbbell className="w-3.5 h-3.5 text-gold" />
                          Bài tập liên quan:
                        </span>
                        <span className="font-bold text-[#202124]">{selectedLog.exercise}</span>
                      </div>
                    </div>

                    {/* Message Details Box */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#64676E] uppercase tracking-wider block">
                        Nội dung thông điệp sự cố:
                      </span>
                      <div className="p-4 rounded-2xl bg-obsidian text-emerald-400 font-mono text-xs border border-[#252830] leading-relaxed break-words">
                        {selectedLog.message}
                      </div>
                    </div>

                    {/* Troubleshooting Hint */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                      <span className="font-bold block">Khuyến nghị kỹ thuật:</span>
                      <p className="text-[11px] leading-relaxed">
                        Kiểm tra quyền truy cập webcam trên trình duyệt của người dùng, đảm bảo điều kiện ánh sáng phòng tập tối ưu và kiểm tra đường truyền kết nối mạng internet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-6 border-t border-[#E8E2D6] bg-[#FAF6EC] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedLog(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#101114] text-white hover:bg-gold hover:text-[#161616] transition-all cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </PageTransition>
    </AdminLayout>
  );
}
