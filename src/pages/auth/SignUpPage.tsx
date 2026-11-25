import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export default function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên.';
    }

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Định dạng email không hợp lệ.';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có tối thiểu 8 ký tự.';
    } else if (password.length > 50) {
      newErrors.password = 'Mật khẩu tối đa 50 ký tự.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await register(fullName, email, password);
      if (res.success) {
        success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else if (res.error === 'email_exists') {
        setErrors({ email: 'Địa chỉ email này đã được sử dụng.' });
      } else {
        setErrors({ form: 'Không thể tạo tài khoản. Vui lòng thử lại.' });
      }
    } catch {
      setErrors({ form: 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#F8F5ED] selection:bg-gold/30 selection:text-obsidian">
      {/* ======================================================== */}
      {/* CỘT TRÁI (52%): CINEMATIC FITNESS BRANDING               */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-[52%] min-h-[440px] lg:min-h-[100dvh] bg-[#101114] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Layer 1: Athlete Photo with slow Ken Burns effect (1 to 1.04 in 25s) */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 25, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=85"
            alt="AIFit Studio Training"
            className="w-full h-full object-cover object-center"
          />
          {/* Layer 2: Real dark gradient overlay as specified */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(10,11,13,0.88) 0%, rgba(10,11,13,0.70) 50%, rgba(10,11,13,0.48) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101114] via-transparent to-transparent opacity-80" />
        </div>

        {/* SECTION TOP: BRANDING LOGO */}
        <div className="relative z-10">
          <NavLink to="/welcome" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D5B56A] via-[#C9A227] to-[#101114] flex items-center justify-center shadow-md shadow-gold/20 border border-[#D5B56A]/40 group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-white text-lg tracking-wider">AI</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-[#F8FAFC] block leading-tight">
                AIFit
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#D5B56A] uppercase block">
                Trợ lý tập luyện thông minh
              </span>
            </div>
          </NavLink>
        </div>

        {/* SECTION CENTER: CLEAN EDITORIAL HEADLINE & DESCRIPTION */}
        <div className="relative z-10 my-auto py-10 max-w-lg space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="font-display font-bold text-4xl sm:text-[46px] lg:text-[52px] tracking-tight leading-[1.2]">
              <span className="block text-[#F8FAFC]">Bắt đầu hành trình.</span>
              <span className="block text-[#D5B56A]">Làm chủ chuyển động.</span>
            </h1>

            <p className="font-body text-[#D1D5DB] text-[15px] sm:text-[16px] leading-relaxed max-w-md">
              Tập luyện thông minh hơn với công nghệ AI phân tích tư thế và theo dõi tiến độ của bạn.
            </p>
          </motion.div>
        </div>

        {/* SECTION BOTTOM: PRIVACY GUARANTEE */}
        <div className="relative z-10 flex items-center gap-2.5 text-xs text-[#9CA3AF] border-t border-white/10 pt-4">
          <ShieldCheck className="w-4 h-4 text-[#D5B56A] shrink-0" />
          <span>Hình ảnh camera được xử lý trực tiếp trên thiết bị của bạn và không được tải lên máy chủ.</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CỘT PHẢI (48%): PREMIUM REGISTRATION FORM                 */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 sm:p-10 lg:p-12 min-h-[100dvh] bg-[#F8F5ED]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[460px] bg-white rounded-[20px] border border-[#E8E2D6] p-8 sm:p-10 shadow-sm space-y-6"
        >
          {/* NÚT QUAY VỀ TRANG CHỦ */}
          <div>
            <NavLink
              to="/welcome"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#64676E] hover:text-[#92701B] transition-colors cursor-pointer group mb-4"
            >
              <ArrowLeft className="w-4 h-4 text-[#92701B] group-hover:-translate-x-0.5 transition-transform" />
              <span>Quay về trang chủ</span>
            </NavLink>

            <h2 className="font-display font-bold text-[30px] sm:text-[32px] text-[#202124] tracking-tight leading-tight">
              Bắt đầu hành trình của bạn
            </h2>
            <p className="font-body text-[15px] text-[#64676E] mt-1.5">
              Tạo tài khoản để trải nghiệm trợ lý tập luyện AI cá nhân hóa.
            </p>
          </div>

          {/* Form Error Notice */}
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errors.form}</span>
            </motion.div>
          )}

          {/* SIGNUP FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-medium text-[#202124]">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value);
                    setErrors(prev => ({ ...prev, fullName: undefined, form: undefined }));
                  }}
                  className={`w-full h-[54px] min-h-[54px] pl-[44px] pr-4 rounded-xl border text-[15px] font-normal transition-all outline-none bg-white text-[#202124] placeholder:text-[#757982] ${
                    errors.fullName
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#D8D3C8] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20'
                  }`}
                />
                <User className="w-4 h-4 text-[#757982] absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-medium text-[#202124]">
                Địa chỉ email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="tenban@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined, form: undefined }));
                  }}
                  className={`w-full h-[54px] min-h-[54px] pl-[44px] pr-4 rounded-xl border text-[15px] font-normal transition-all outline-none bg-white text-[#202124] placeholder:text-[#757982] ${
                    errors.email
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#D8D3C8] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20'
                  }`}
                />
                <Mail className="w-4 h-4 text-[#757982] absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-medium text-[#202124]">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 8 ký tự"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined, form: undefined }));
                  }}
                  className={`w-full h-[54px] min-h-[54px] pl-[44px] pr-12 rounded-xl border text-[15px] font-normal transition-all outline-none bg-white text-[#202124] placeholder:text-[#757982] ${
                    errors.password
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#D8D3C8] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20'
                  }`}
                />
                <Lock className="w-4 h-4 text-[#757982] absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757982] hover:text-[#202124] p-1.5 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-medium text-[#202124]">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({ ...prev, confirmPassword: undefined, form: undefined }));
                  }}
                  className={`w-full h-[54px] min-h-[54px] pl-[44px] pr-12 rounded-xl border text-[15px] font-normal transition-all outline-none bg-white text-[#202124] placeholder:text-[#757982] ${
                    errors.confirmPassword
                      ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#D8D3C8] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20'
                  }`}
                />
                <Lock className="w-4 h-4 text-[#757982] absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757982] hover:text-[#202124] p-1.5 cursor-pointer transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[54px] min-h-[54px] rounded-xl font-semibold text-[16px] bg-[#C9A227] hover:bg-[#B18B20] text-[#161616] shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-3"
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>Tạo tài khoản</span>
                  <ArrowRight className="w-4 h-4 text-[#161616]" />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="text-center text-[14px] text-[#64676E] pt-2">
            Bạn đã có tài khoản?{' '}
            <NavLink
              to="/login"
              className="font-semibold text-[#92701B] hover:text-[#7A5D13] hover:underline transition-colors"
            >
              Đăng nhập ngay
            </NavLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
