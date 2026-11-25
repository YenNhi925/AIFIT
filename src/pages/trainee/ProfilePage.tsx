import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Lock,
  LogOut,
  ShieldCheck,
  Calendar,
  Activity,
  Clock,
  Award,
  Eye,
  EyeOff,
  Home,
  History,
  ChevronRight,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { AppFooter } from '../../components/layout/AppFooter';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../../components/ui/PageTransition';
import { AmbientLight } from '../../components/backgrounds';
import { MOCK_SESSIONS } from '../../data/mockData';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | undefined>();

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [pwErrors, setPwErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  // Logout Dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Derived training stats from MOCK_SESSIONS
  const totalSessions = MOCK_SESSIONS.length;
  const totalMinutes = Math.round(
    MOCK_SESSIONS.reduce((acc, s) => acc + (s.durationSec || 0), 0) / 60
  );
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(MOCK_SESSIONS.reduce((acc, s) => acc + (s.accuracy || 0), 0) / totalSessions)
      : 0;

  const isProfileChanged =
    fullName.trim() !== (user?.fullName || '') && fullName.trim().length > 0;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileError('Vui lòng nhập họ và tên.');
      return;
    }
    setProfileError(undefined);
    setIsSavingProfile(true);

    setTimeout(() => {
      setIsSavingProfile(false);
      updateUser({ fullName: fullName.trim() });
      success('Đã cập nhật thông tin cá nhân.');
    }, 500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof pwErrors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    } else if (currentPassword !== 'trainee123' && currentPassword !== 'admin123') {
      errors.currentPassword = 'Mật khẩu hiện tại không chính xác.';
    }

    if (!newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự.';
    } else if (newPassword.length > 50) {
      errors.newPassword = 'Mật khẩu không được vượt quá 50 ký tự.';
    } else if (newPassword === currentPassword) {
      errors.newPassword = 'Mật khẩu mới phải khác với mật khẩu hiện tại.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu mới.';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
    }

    if (Object.keys(errors).length > 0) {
      setPwErrors(errors);
      return;
    }

    setPwErrors({});
    setIsUpdatingPw(true);

    setTimeout(() => {
      setIsUpdatingPw(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      success('Đã đổi mật khẩu thành công.');
    }, 600);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    success('Bạn đã đăng xuất khỏi hệ thống.');
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AI';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F2F1ED] flex flex-col font-body selection:bg-[#B89545]/20 selection:text-[#202124]">
      <TopNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTransition className="flex flex-col gap-8">
          {/* ======================================================== */}
          {/* 10.1 COVER BANNER: BOXED (200 - 240px)                   */}
          {/* ======================================================== */}
          <section className="relative rounded-3xl overflow-hidden shadow-md border border-[#DEDDD7] text-white min-h-[200px] sm:min-h-[220px] flex items-center p-8 sm:p-12 bg-[#18191B]">
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80"
              alt="Profile Cover Background"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40"
              loading="lazy"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(17,18,20,0.92) 0%, rgba(24,25,27,0.78) 55%, rgba(17,18,20,0.50) 100%)',
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
                <UserIcon className="w-3.5 h-3.5 text-[#B89545]" />
                <span>Thiết lập tài khoản</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#F7F7F7] tracking-tight">
                Hồ sơ cá nhân
              </h1>
              <p className="text-[#CBD5E1] text-xs sm:text-sm leading-relaxed">
                Quản lý thông tin tài khoản, xem thống kê tập luyện tổng quan và cập nhật bảo mật cá nhân.
              </p>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 10.2 & 10.3 HAI CỘT: ACCOUNT CARD & FORMS                */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột trái (340px / 4 of 12 cols): Thẻ tài khoản */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#DEDDD7] shadow-xs text-center space-y-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-[#111214] text-[#D6BC84] font-display font-bold text-2xl flex items-center justify-center mx-auto border-2 border-[#B89545]/40 shadow-sm">
                  {getInitials(user?.fullName)}
                </div>

                <div>
                  <h2 className="font-display font-bold text-xl text-[#202124] tracking-tight">
                    {user?.fullName}
                  </h2>
                  <p className="text-xs text-[#626770] mt-0.5">{user?.email}</p>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDEAE3] text-[#80601D] border border-[#DEDDD7]">
                      <Award className="w-3.5 h-3.5" />
                      {user?.role === 'Admin' ? 'Quản trị viên AIFit' : 'Học viên AIFit'}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-[#626770]">
                    <Calendar className="w-3.5 h-3.5 text-[#80601D]" />
                    <span>Thành viên từ: Tháng 09/2026</span>
                  </div>
                </div>

                {/* 3 ô thống kê đồng đều */}
                <div className="pt-4 border-t border-[#DEDDD7] grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#F2F1ED] border border-[#DEDDD7]">
                    <div className="text-[10px] font-medium uppercase text-[#626770]">Buổi tập</div>
                    <div className="font-display font-bold text-base text-[#202124] mt-0.5">
                      {totalSessions}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F2F1ED] border border-[#DEDDD7]">
                    <div className="text-[10px] font-medium uppercase text-[#626770]">Thời lượng</div>
                    <div className="font-display font-bold text-base text-[#202124] mt-0.5">
                      {totalMinutes}p
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F2F1ED] border border-[#DEDDD7]">
                    <div className="text-[10px] font-medium uppercase text-[#626770]">Chuẩn xác</div>
                    <div className="font-display font-bold text-base text-[#16835D] mt-0.5">
                      {avgAccuracy}%
                    </div>
                  </div>
                </div>

                {/* Liên kết điều hướng nhanh */}
                <div className="pt-2 border-t border-[#DEDDD7] space-y-1 text-left text-xs">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#626770] hover:text-[#202124] hover:bg-[#F2F1ED] transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#80601D]" />
                      Trang chủ tập luyện
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#626770] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/history')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#626770] hover:text-[#202124] hover:bg-[#F2F1ED] transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-4 h-4 text-[#80601D]" />
                      Lịch sử & Phân tích
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#626770] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Nút đăng xuất tinh tế */}
                <div className="pt-2 border-t border-[#DEDDD7]">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full h-11 rounded-xl border border-[#C53030] text-[#C53030] hover:bg-red-50/70 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cột phải (8 of 12 cols): Form thông tin cá nhân & Đổi mật khẩu */}
            <div className="lg:col-span-8 space-y-6">
              {/* Form 1: Thông tin cá nhân */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DEDDD7] shadow-xs space-y-5">
                <div className="border-b border-[#DEDDD7] pb-3">
                  <h3 className="font-display font-bold text-xl text-[#202124]">
                    Thông tin tài khoản
                  </h3>
                  <p className="text-xs text-[#626770] mt-0.5">
                    Cập nhật họ và tên hiển thị trong các báo cáo phân tích
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[14px] font-medium text-[#202124]">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => {
                        setFullName(e.target.value);
                        setProfileError(undefined);
                      }}
                      className="w-full h-[52px] px-4 rounded-[10px] border border-[#DEDDD7] bg-white text-[15px] font-normal text-[#202124] outline-none focus:border-[#B89545] transition-colors"
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                    {profileError && (
                      <p className="text-xs text-red-600 font-medium">{profileError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[14px] font-medium text-[#202124]">
                      Địa chỉ email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full h-[52px] px-4 rounded-[10px] border border-[#DEDDD7] bg-[#F2F1ED] text-[15px] text-[#626770] cursor-not-allowed"
                    />
                    <p className="text-xs text-[#626770]">
                      Email tài khoản được cố định và sử dụng để định danh hệ thống.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!isProfileChanged || isSavingProfile}
                      className="h-12 px-6 rounded-xl bg-[#B89545] hover:bg-[#9E7E36] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Form 2: Đổi mật khẩu */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DEDDD7] shadow-xs space-y-5">
                <div className="border-b border-[#DEDDD7] pb-3">
                  <h3 className="font-display font-bold text-xl text-[#202124]">
                    Thay đổi mật khẩu
                  </h3>
                  <p className="text-xs text-[#626770] mt-0.5">
                    Đảm bảo mật khẩu an toàn với tối thiểu 8 ký tự
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  {/* Mật khẩu hiện tại */}
                  <div className="space-y-2">
                    <label className="block text-[14px] font-medium text-[#202124]">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => {
                          setCurrentPassword(e.target.value);
                          setPwErrors(prev => ({ ...prev, currentPassword: undefined }));
                        }}
                        className="w-full h-[52px] pl-4 pr-12 rounded-[10px] border border-[#DEDDD7] bg-white text-[15px] font-normal text-[#202124] outline-none focus:border-[#B89545] transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#626770] hover:text-[#202124] p-1.5 cursor-pointer"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwErrors.currentPassword && (
                      <p className="text-xs text-red-600 font-medium">{pwErrors.currentPassword}</p>
                    )}
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="space-y-2">
                    <label className="block text-[14px] font-medium text-[#202124]">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => {
                          setNewPassword(e.target.value);
                          setPwErrors(prev => ({ ...prev, newPassword: undefined }));
                        }}
                        className="w-full h-[52px] pl-4 pr-12 rounded-[10px] border border-[#DEDDD7] bg-white text-[15px] font-normal text-[#202124] outline-none focus:border-[#B89545] transition-colors"
                        placeholder="Tối thiểu 8 ký tự"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#626770] hover:text-[#202124] p-1.5 cursor-pointer"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwErrors.newPassword && (
                      <p className="text-xs text-red-600 font-medium">{pwErrors.newPassword}</p>
                    )}
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="space-y-2">
                    <label className="block text-[14px] font-medium text-[#202124]">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => {
                          setConfirmPassword(e.target.value);
                          setPwErrors(prev => ({ ...prev, confirmPassword: undefined }));
                        }}
                        className="w-full h-[52px] pl-4 pr-12 rounded-[10px] border border-[#DEDDD7] bg-white text-[15px] font-normal text-[#202124] outline-none focus:border-[#B89545] transition-colors"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#626770] hover:text-[#202124] p-1.5 cursor-pointer"
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwErrors.confirmPassword && (
                      <p className="text-xs text-red-600 font-medium">{pwErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingPw || !currentPassword || !newPassword || !confirmPassword}
                      className="h-12 px-6 rounded-xl bg-[#18191B] hover:bg-[#B89545] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingPw ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      <AppFooter />

      {/* Confirmation Dialog Logout */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản AIFit? Mọi tiến trình tập luyện đã được lưu trữ an toàn."
        confirmLabel="Đăng xuất"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
