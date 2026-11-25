import React, { useState, useMemo } from 'react';
import {
  Search,
  Lock,
  Unlock,
  Trash2,
  Users,
  GraduationCap,
  ShieldAlert,
  UserX,
  X,
  Filter,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { User } from '../../types';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const { success } = useToast();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  // Confirmation dialogs
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<'lock' | 'unlock' | 'delete' | null>(null);

  // Overview metrics derived from data
  const totalUsers = users.length;
  const traineeCount = users.filter(u => u.role === 'Trainee').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const lockedCount = users.filter(u => u.status === 'Locked').length;

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole =
        roleFilter === 'Tất cả' ||
        (roleFilter === 'Học viên' && u.role === 'Trainee') ||
        (roleFilter === 'Quản trị viên' && u.role === 'Admin');
      const matchStatus =
        statusFilter === 'Tất cả' ||
        (statusFilter === 'Đang hoạt động' && u.status === 'Active') ||
        (statusFilter === 'Đã khóa' && u.status === 'Locked');
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleActionConfirm = () => {
    if (!targetUser || !dialogMode) return;

    if (dialogMode === 'lock') {
      setUsers(prev =>
        prev.map(u => (u.id === targetUser.id ? { ...u, status: 'Locked' } : u))
      );
      success(`Tài khoản "${targetUser.fullName}" đã được khóa.`);
    } else if (dialogMode === 'unlock') {
      setUsers(prev =>
        prev.map(u => (u.id === targetUser.id ? { ...u, status: 'Active' } : u))
      );
      success(`Tài khoản "${targetUser.fullName}" đã được mở khóa thành công.`);
    } else if (dialogMode === 'delete') {
      setUsers(prev => prev.filter(u => u.id !== targetUser.id));
      success(`Đã xóa vĩnh viễn tài khoản người dùng "${targetUser.fullName}".`);
    }

    setTargetUser(null);
    setDialogMode(null);
  };

  return (
    <AdminLayout breadcrumbs={['Quản trị', 'Quản lý người dùng']}>
      <PageTransition>
        <div className="space-y-8">
          {/* ======================================================== */}
          {/* PAGE HEADER: HIGH-CONTRAST DARK BANNER                   */}
          {/* ======================================================== */}
          <div className="relative rounded-3xl bg-[#101114] bg-gradient-to-r from-[#101114] via-[#1B1D21] to-[#202124] border border-[#D5B56A]/25 p-6 sm:p-8 text-white overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:1.75rem_1.75rem] pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#D5B56A]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl space-y-2">
              <span className="text-xs font-bold text-[#D5B56A] uppercase tracking-wider block">
                Phân hệ Quản trị Tài khoản
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight">
                Quản lý người dùng
              </h1>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                Quản lý danh sách tài khoản học viên và quản trị viên, kiểm soát quyền truy cập và bảo mật hệ thống AIFit.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* USER OVERVIEW CHIPS (4 METRICS)                          */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Tổng người dùng
                </span>
                <span className="font-display font-black text-2xl text-[#202124] tabular-nums">
                  {totalUsers}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gold/10 text-[#92701B] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Học viên
                </span>
                <span className="font-display font-black text-2xl text-blue-700 tabular-nums">
                  {traineeCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Quản trị viên
                </span>
                <span className="font-display font-black text-2xl text-purple-700 tabular-nums">
                  {adminCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64676E] uppercase tracking-wider block">
                  Tài khoản bị khóa
                </span>
                <span className="font-display font-black text-2xl text-red-600 tabular-nums">
                  {lockedCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TOOLBAR: SEARCH & FILTERS                                */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input with Clear Button */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#64676E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên học viên hoặc địa chỉ email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-9 rounded-xl border border-[#D8D3C8] bg-[#FAF6EC]/40 text-xs font-semibold text-[#202124] placeholder:text-[#757982] focus:bg-white focus:border-[#C9A227] outline-none transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64676E]">Vai trò:</span>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-semibold text-[#374151] shadow-xs outline-none focus:border-[#C9A227] cursor-pointer"
                >
                  <option value="Tất cả">Tất cả vai trò</option>
                  <option value="Học viên">Học viên</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64676E]">Trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[#D8D3C8] bg-white text-xs font-semibold text-[#374151] shadow-xs outline-none focus:border-[#C9A227] cursor-pointer"
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Đã khóa">Đã khóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* DATA TABLE                                               */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-[#E8E2D6] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#E8E2D6] text-[11px] font-bold uppercase tracking-wider text-[#777981]">
                    <th className="py-4 px-5">STT</th>
                    <th className="py-4 px-5">Họ và tên / Email</th>
                    <th className="py-4 px-5">Vai trò</th>
                    <th className="py-4 px-5">Trạng thái</th>
                    <th className="py-4 px-5">Ngày tạo</th>
                    <th className="py-4 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D6]/70">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#777981]">
                        Không tìm thấy người dùng nào phù hợp với điều kiện tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => {
                      const isSelf = currentUser?.email.toLowerCase() === u.email.toLowerCase();
                      const dateObj = new Date(u.createdAt);

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-[#FAF6EC]/80 transition-colors group"
                        >
                          <td className="py-4 px-5 font-mono text-[#777981]">{idx + 1}</td>

                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-obsidian to-charcoal text-gold font-bold text-xs flex items-center justify-center shrink-0 border border-gold/20 shadow-xs">
                                {u.fullName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-[#202124] block text-xs">
                                  {u.fullName}
                                </span>
                                <span className="text-[11px] text-[#777981]">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-5">
                            <StatusBadge status={u.role} />
                          </td>

                          <td className="py-4 px-5">
                            <StatusBadge status={u.status} />
                          </td>

                          <td className="py-4 px-5 text-[#777981]">
                            {dateObj.toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.status === 'Active' ? (
                                <button
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => {
                                    setTargetUser(u);
                                    setDialogMode('lock');
                                  }}
                                  className="p-2 rounded-xl border border-[#E8E2D6] text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  title={isSelf ? 'Không thể khóa tài khoản của chính mình' : 'Khóa tài khoản'}
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetUser(u);
                                    setDialogMode('unlock');
                                  }}
                                  className="p-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                                  title="Mở khóa tài khoản"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => {
                                  setTargetUser(u);
                                  setDialogMode('delete');
                                }}
                                className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                title={isSelf ? 'Không thể xóa tài khoản của chính mình' : 'Xóa tài khoản'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#E8E2D6] bg-[#FAF6EC]/50 flex items-center justify-between text-xs text-[#777981]">
              <span>Hiển thị {filteredUsers.length} trên tổng số {totalUsers} người dùng</span>
              <span>Hệ thống phân quyền Role-Based Access Control (RBAC)</span>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={dialogMode !== null}
          title={
            dialogMode === 'lock'
              ? 'Xác nhận khóa tài khoản?'
              : dialogMode === 'unlock'
              ? 'Xác nhận mở khóa tài khoản?'
              : 'Xác nhận xóa tài khoản vĩnh viễn?'
          }
          description={
            dialogMode === 'lock'
              ? `Bạn có chắc chắn muốn khóa tài khoản "${targetUser?.fullName}" không? Người dùng sẽ không thể đăng nhập vào ứng dụng cho đến khi được mở khóa.`
              : dialogMode === 'unlock'
              ? `Bạn có chắc chắn muốn khôi phục quyền truy cập cho tài khoản "${targetUser?.fullName}" không?`
              : `Hành động này KHÔNG THỂ HOÀN TÁC. Toàn bộ hồ sơ của "${targetUser?.fullName}" sẽ bị xóa khỏi cơ sở dữ liệu.`
          }
          confirmLabel={
            dialogMode === 'lock' ? 'Khóa tài khoản' : dialogMode === 'unlock' ? 'Mở khóa' : 'Xóa vĩnh viễn'
          }
          confirmVariant={dialogMode === 'delete' || dialogMode === 'lock' ? 'danger' : 'default'}
          onConfirm={handleActionConfirm}
          onCancel={() => {
            setTargetUser(null);
            setDialogMode(null);
          }}
        />
      </PageTransition>
    </AdminLayout>
  );
}
