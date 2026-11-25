import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Dumbbell,
  X,
  CheckCircle,
  Activity,
  Flame,
  Layers,
  Power,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { FormField } from '../../components/ui/FormField';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EXERCISES } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { Exercise } from '../../types';

// Real high-quality athletic photography thumbnails
const EXERCISE_THUMBNAILS: Record<string, string> = {
  Squat: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80',
  Plank: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=400&q=80',
  'Push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80',
};

export default function ManageExercises() {
  const { success } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [name, setName] = useState('');
  const [jointSet, setJointSet] = useState('');
  const [mode, setMode] = useState<'reps' | 'hold'>('reps');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Confirmation dialog for deactivation
  const [targetExercise, setTargetExercise] = useState<Exercise | null>(null);

  const openAddForm = () => {
    setEditingExercise(null);
    setName('');
    setJointSet('');
    setMode('reps');
    setStatus('Active');
    setDescription('');
    setErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (ex: Exercise) => {
    setEditingExercise(ex);
    setName(ex.name);
    setJointSet(ex.jointSet);
    setMode(ex.mode);
    setStatus(ex.status);
    setDescription(ex.description);
    setErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExercise(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Vui lòng nhập tên bài tập.' });
      return;
    }

    if (editingExercise) {
      setExercises(prev =>
        prev.map(ex =>
          ex.id === editingExercise.id
            ? { ...ex, name: name.trim(), jointSet: jointSet.trim(), mode, status, description: description.trim() }
            : ex
        )
      );
      success(`Đã cập nhật bài tập "${name}" thành công.`);
    } else {
      const newEx: Exercise = {
        id: Date.now(),
        name: name.trim(),
        jointSet: jointSet.trim() || 'Nhóm khớp tùy chỉnh',
        mode,
        status,
        description: description.trim(),
      };
      setExercises(prev => [...prev, newEx]);
      success(`Đã thêm bài tập mới "${name}" vào danh mục.`);
    }

    closeForm();
  };

  const handleToggleStatus = (ex: Exercise) => {
    const nextStatus = ex.status === 'Active' ? 'Inactive' : 'Active';
    setExercises(prev =>
      prev.map(item => (item.id === ex.id ? { ...item, status: nextStatus } : item))
    );
    success(`Bài tập "${ex.name}" hiện đang ở trạng thái ${nextStatus === 'Active' ? 'Đang hoạt động' : 'Tạm ngưng'}.`);
  };

  return (
    <AdminLayout breadcrumbs={['Quản trị', 'Quản lý bài tập']}>
      <PageTransition>
        <div className="space-y-8">
          {/* ======================================================== */}
          {/* PAGE HEADER: HIGH-CONTRAST COMMAND CENTER BANNER          */}
          {/* ======================================================== */}
          <div className="relative overflow-hidden rounded-3xl bg-[#101114] bg-gradient-to-r from-[#101114] via-[#1B1D21] to-[#202124] border border-[#D5B56A]/25 p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Phân hệ Quản lý Nội dung Huấn luyện
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight">
                  Quản lý bài tập
                </h1>
                <p className="text-xs sm:text-sm text-[#CBD5E1]">
                  Quản lý danh mục các bài tập được hỗ trợ phân tích tư thế sinh cơ học thời gian thực
                </p>
              </div>

              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#161616] bg-gold hover:bg-gold-dark shadow-md shadow-gold/20 active:scale-98 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bài tập mới</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 8.2 EXERCISE VISUAL OVERVIEW (3 CARDS)                   */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exercises.slice(0, 3).map(ex => {
              const thumb = EXERCISE_THUMBNAILS[ex.name] || EXERCISE_THUMBNAILS['Squat'];
              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-3xl border border-[#E8E2D6] overflow-hidden shadow-sm hover:border-gold/50 transition-all group"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-obsidian">
                    <img
                      src={thumb}
                      alt={ex.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-gold border border-gold/30 backdrop-blur-sm">
                        {ex.mode === 'reps' ? 'ĐẾM REP' : 'GIỮ THỜI GIAN'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={ex.status} />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-display font-black text-xl text-white tracking-tight">
                        {ex.name}
                      </h3>
                      <p className="text-[11px] text-gray-300 font-mono">
                        {ex.jointSet}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#374151] line-clamp-2 leading-relaxed">
                      {ex.description}
                    </p>
                    <div className="pt-2 border-t border-[#E8E2D6]/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openEditForm(ex)}
                        className="text-xs font-bold text-[#92701B] hover:text-[#7A5D13] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ex)}
                        className={`text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                          ex.status === 'Active'
                            ? 'text-[#64676E] hover:text-red-600'
                            : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{ex.status === 'Active' ? 'Tạm ngưng' : 'Kích hoạt'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* EXERCISE TABLE                                           */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-[#E8E2D6] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base text-[#202124]">
                  Bảng danh mục bài tập
                </h2>
                <p className="text-xs text-[#64676E]">
                  Danh sách tổng thể các bài tập và cấu hình chuỗi khớp theo dõi
                </p>
              </div>
              <span className="text-xs font-bold text-[#64676E] bg-[#FAF6EC] px-3 py-1 rounded-full border border-[#D8D3C8]">
                {exercises.length} bài tập
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#E8E2D6] text-[11px] font-bold uppercase tracking-wider text-[#64676E]">
                    <th className="py-4 px-5">Bài tập</th>
                    <th className="py-4 px-5">Mô tả</th>
                    <th className="py-4 px-5">Nhóm khớp theo dõi</th>
                    <th className="py-4 px-5">Chế độ</th>
                    <th className="py-4 px-5">Trạng thái</th>
                    <th className="py-4 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D6]/70">
                  {exercises.map(ex => {
                    const thumb = EXERCISE_THUMBNAILS[ex.name] || EXERCISE_THUMBNAILS['Squat'];
                    return (
                      <tr key={ex.id} className="hover:bg-[#FAF6EC]/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-obsidian shrink-0 border border-[#E8E2D6]">
                              <img src={thumb} alt={ex.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-display font-bold text-sm text-[#202124]">
                              {ex.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5 text-[#374151] max-w-xs">
                          <p className="line-clamp-2 leading-relaxed">{ex.description}</p>
                        </td>

                        <td className="py-4 px-5 font-mono text-[#64676E]">
                          {ex.jointSet}
                        </td>

                        <td className="py-4 px-5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-800 border border-amber-300/40">
                            {ex.mode === 'reps' ? 'ĐẾM REP' : 'GIỮ THỜI GIAN'}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <StatusBadge status={ex.status} />
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditForm(ex)}
                              className="p-2 rounded-xl border border-[#D8D3C8] text-[#92701B] hover:bg-gold/10 transition-all cursor-pointer"
                              title="Chỉnh sửa bài tập"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(ex)}
                              className="p-2 rounded-xl border border-[#D8D3C8] text-[#64676E] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title={ex.status === 'Active' ? 'Ngừng kích hoạt' : 'Kích hoạt lại'}
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

          {/* ======================================================== */}
          {/* 8.3 ADD / EDIT FORM PANEL (SLIDE DOWN)                   */}
          {/* ======================================================== */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold/30 shadow-lg space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-[#202124]">
                          {editingExercise ? `Chỉnh sửa bài tập: ${editingExercise.name}` : 'Thêm bài tập mới'}
                        </h3>
                        <p className="text-xs text-[#64676E]">
                          Cấu hình tên bài tập, nhóm khớp và thuật toán đánh giá sinh trắc học
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="p-2 rounded-xl text-[#64676E] hover:text-[#202124] hover:bg-[#FAF6EC] cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        label="Tên bài tập"
                        placeholder="Ví dụ: Lunge, Plank, Squat..."
                        value={name}
                        onChange={e => {
                          setName(e.target.value);
                          setErrors({});
                        }}
                        error={errors.name}
                        required
                      />

                      <FormField
                        label="Nhóm khớp theo dõi (Chuỗi chuyển động)"
                        placeholder="Ví dụ: Hông › Đầu gối › Cổ chân"
                        value={jointSet}
                        onChange={e => setJointSet(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                          Chế độ tập luyện
                        </label>
                        <select
                          value={mode}
                          onChange={e => setMode(e.target.value as 'reps' | 'hold')}
                          className="w-full h-12 px-4 rounded-xl border border-[#D8D3C8] bg-white text-xs font-semibold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                        >
                          <option value="reps">Đếm số lần lặp (Reps Mode)</option>
                          <option value="hold">Giữ tĩnh theo thời gian (Hold Mode)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                          Trạng thái hoạt động
                        </label>
                        <select
                          value={status}
                          onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
                          className="w-full h-12 px-4 rounded-xl border border-[#D8D3C8] bg-white text-xs font-semibold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                        >
                          <option value="Active">Đang hoạt động (Hiển thị cho học viên)</option>
                          <option value="Inactive">Tạm ngưng (Ẩn khỏi danh mục)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                        Mô tả chi tiết bài tập
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Nhập hướng dẫn mục tiêu nhóm cơ và tư thế chuẩn..."
                        className="w-full p-4 rounded-xl border border-[#D8D3C8] text-xs font-medium text-[#202124] placeholder:text-[#757982] outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#374151] hover:text-[#202124] hover:bg-[#FAF6EC] border border-[#D8D3C8] transition-all cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#161616] bg-gold hover:bg-gold-dark shadow-md shadow-gold/20 active:scale-98 transition-all cursor-pointer"
                      >
                        {editingExercise ? 'Lưu thay đổi' : 'Thêm bài tập'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
