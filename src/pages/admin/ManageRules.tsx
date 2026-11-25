import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  History,
  Sliders,
  CheckCircle,
  AlertCircle,
  Power,
  Compass,
  X,
  FileCode,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { MOCK_RULES } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { ExerciseRule } from '../../types';

export default function ManageRules() {
  const navigate = useNavigate();
  const { success } = useToast();

  const [rules, setRules] = useState<ExerciseRule[]>(MOCK_RULES);
  const [exerciseFilter, setExerciseFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [targetRule, setTargetRule] = useState<ExerciseRule | null>(null);
  const [versionRule, setVersionRule] = useState<ExerciseRule | null>(null);

  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchExercise = exerciseFilter === 'Tất cả' || r.exercise === exerciseFilter;
      const matchStatus = statusFilter === 'Tất cả' || r.status === statusFilter;
      return matchExercise && matchStatus;
    });
  }, [rules, exerciseFilter, statusFilter]);

  const handleDeactivateConfirm = () => {
    if (!targetRule) return;
    const nextStatus = targetRule.status === 'Active' ? 'Inactive' : 'Active';
    setRules(prev =>
      prev.map(r => (r.id === targetRule.id ? { ...r, status: nextStatus } : r))
    );
    success(
      `Quy tắc "${targetRule.label}" hiện đang ở trạng thái ${
        nextStatus === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'
      }.`
    );
    setTargetRule(null);
  };

  const formatThreshold = (min: number | null, max: number | null) => {
    if (min !== null && max !== null) return `${min}° – ${max}°`;
    if (min !== null) return `> ${min}°`;
    if (max !== null) return `< ${max}°`;
    return 'Bất kỳ góc nào';
  };

  return (
    <AdminLayout breadcrumbs={['Quản trị', 'Quản lý quy tắc tập luyện']}>
      <PageTransition>
        <div className="space-y-8">
          {/* ======================================================== */}
          {/* 9.1 PAGE HERO: AI CONFIGURATION STUDIO                   */}
          {/* ======================================================== */}
          <div className="relative overflow-hidden rounded-3xl bg-[#101114] bg-gradient-to-r from-[#101114] via-[#1B1D21] to-[#202124] border border-[#D5B56A]/25 p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  Hiệu chuẩn Sinh cơ học AI (NFR06)
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight">
                  Quản lý quy tắc tập luyện
                </h1>
                <p className="text-xs sm:text-sm text-[#CBD5E1]">
                  Cấu hình các tiêu chí đánh giá tư thế của từng bài tập. Thay đổi ngưỡng góc khớp sẽ tự động áp dụng ngay vào thuật toán phân tích mà không cần cập nhật mã nguồn.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/rules/new')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#161616] bg-gold hover:bg-gold-dark shadow-md shadow-gold/20 active:scale-98 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm quy tắc mới</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 9.2 FILTER TOOLBAR                                       */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D6] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64676E] uppercase">Lọc theo bài tập:</span>
                <select
                  value={exerciseFilter}
                  onChange={e => setExerciseFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-bold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                >
                  <option value="Tất cả">Tất cả bài tập</option>
                  <option value="Squat">Squat</option>
                  <option value="Plank">Plank</option>
                  <option value="Push-up">Push-up</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64676E] uppercase">Trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-bold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Active">Đang hoạt động</option>
                  <option value="Inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#64676E] bg-[#FAF6EC] px-3.5 py-1.5 rounded-full border border-[#D8D3C8]">
              Tổng số quy tắc: <strong className="text-[#202124]">{filteredRules.length}</strong>
            </span>
          </div>

          {/* ======================================================== */}
          {/* 9.3 RULES TABLE WITH VISUAL RANGE MINI BARS              */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-[#E8E2D6] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#E8E2D6] text-[11px] font-bold uppercase tracking-wider text-[#64676E]">
                    <th className="py-4 px-5">Bài tập</th>
                    <th className="py-4 px-5">Nhóm khớp</th>
                    <th className="py-4 px-5">Chỉ số đánh giá</th>
                    <th className="py-4 px-5">Ngưỡng góc (° / Range)</th>
                    <th className="py-4 px-5">Loại quy tắc</th>
                    <th className="py-4 px-5">Phân loại</th>
                    <th className="py-4 px-5">Tham chiếu</th>
                    <th className="py-4 px-5">Phiên bản</th>
                    <th className="py-4 px-5">Trạng thái</th>
                    <th className="py-4 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D6]/70">
                  {filteredRules.map(rule => {
                    const isCorrect = rule.type === 'Correct';
                    return (
                      <tr key={rule.id} className="hover:bg-[#FAF6EC]/80 transition-colors">
                        <td className="py-4 px-5 font-display font-bold text-sm text-[#202124]">
                          {rule.exercise}
                        </td>

                        <td className="py-4 px-5 font-mono text-[11px] text-[#64676E]">
                          {rule.jointSet}
                        </td>

                        <td className="py-4 px-5 font-semibold text-[#202124]">
                          {rule.metric}
                        </td>

                        {/* Ngưỡng góc kèm Visual Range Mini Bar */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-xs text-[#202124] block">
                              {formatThreshold(rule.min, rule.max)}
                            </span>
                            {/* Visual Range Indicator Bar */}
                            <div className="w-24 h-1.5 bg-[#E8E2D6] rounded-full overflow-hidden flex">
                              <div
                                className={`h-full rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
                                style={{
                                  width: `${Math.min(100, Math.max(30, ((rule.max || 180) - (rule.min || 0)) / 1.8))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Loại quy tắc */}
                        <td className="py-4 px-5">
                          <StatusBadge status={rule.type} />
                        </td>

                        <td className="py-4 px-5 text-[#374151] font-medium max-w-[180px]">
                          <span className="line-clamp-1" title={rule.label}>
                            {rule.label}
                          </span>
                        </td>

                        <td className="py-4 px-5 font-mono text-[11px] text-[#64676E]">
                          {rule.ref}
                        </td>

                        {/* Phiên bản */}
                        <td className="py-4 px-5">
                          <button
                            type="button"
                            onClick={() => setVersionRule(rule)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FAF6EC] border border-[#D8D3C8] text-[#92701B] hover:border-gold hover:bg-gold/10 transition-all cursor-pointer"
                            title="Xem lịch sử phiên bản"
                          >
                            <History className="w-3 h-3" />
                            <span>v{rule.version}</span>
                          </button>
                        </td>

                        <td className="py-4 px-5">
                          <StatusBadge status={rule.status} />
                        </td>

                        {/* Thao tác */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/rules/${rule.id}/edit`)}
                              className="p-2 rounded-xl border border-[#D8D3C8] text-[#92701B] hover:bg-gold/10 transition-all cursor-pointer"
                              title="Chỉnh sửa quy tắc"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setTargetRule(rule)}
                              className="p-2 rounded-xl border border-[#D8D3C8] text-[#64676E] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title={rule.status === 'Active' ? 'Ngừng kích hoạt' : 'Kích hoạt lại'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Xác nhận thay đổi trạng thái kích hoạt */}
        <ConfirmDialog
          isOpen={Boolean(targetRule)}
          title={
            targetRule?.status === 'Active'
              ? 'Ngừng kích hoạt quy tắc?'
              : 'Kích hoạt lại quy tắc?'
          }
          description={
            targetRule?.status === 'Active'
              ? `Bạn có chắc muốn tạm dừng quy tắc "${targetRule?.label}"? Quy tắc này sẽ không bị xóa và có thể kích hoạt lại bất kỳ lúc nào.`
              : `Kích hoạt lại quy tắc "${targetRule?.label}" để áp dụng vào thuật toán nhận diện sinh học.`
          }
          confirmLabel={targetRule?.status === 'Active' ? 'Ngừng kích hoạt' : 'Kích hoạt'}
          confirmVariant={targetRule?.status === 'Active' ? 'danger' : 'default'}
          onConfirm={handleDeactivateConfirm}
          onCancel={() => setTargetRule(null)}
        />

        {/* Modal: Chi tiết lịch sử phiên bản */}
        {versionRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#E8E2D6] shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-gold" />
                  <h3 className="font-display font-bold text-lg text-[#202124]">
                    Lịch sử phiên bản quy tắc
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setVersionRule(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#E8E2D6] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#202124]">Phiên bản hiện tại</span>
                    <span className="font-mono text-xs font-bold text-[#92701B] px-2 py-0.5 rounded-full bg-white border border-gold/30">
                      v{versionRule.version}
                    </span>
                  </div>
                  <p className="text-xs text-[#374151] font-semibold">{versionRule.label}</p>
                  <p className="font-mono text-[11px] text-[#64676E]">
                    Ngưỡng: {formatThreshold(versionRule.min, versionRule.max)} • Ref: {versionRule.ref}
                  </p>
                </div>

                <div className="text-xs text-[#64676E] space-y-2">
                  <p>
                    Hệ thống lưu trữ toàn bộ lịch sử thay đổi để đảm bảo tính toàn vẹn dữ liệu cho các buổi tập trong quá khứ.
                  </p>
                  <p className="italic text-[11px] text-[#374151]">
                    Khi cập nhật quy tắc này, hệ thống sẽ tự động phát hành phiên bản <strong>v{versionRule.version + 1}</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E2D6] flex justify-end">
                <button
                  type="button"
                  onClick={() => setVersionRule(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-[#FAF6EC] text-[#374151] border border-[#D8D3C8] transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </PageTransition>
    </AdminLayout>
  );
}
