import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<'trainee' | 'admin' | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string; form?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Định dạng email không hợp lệ.';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        success(`Chào mừng quay trở lại, ${res.user.fullName}!`);
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'Admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else if (res.error === 'account_locked') {
        setErrors({ form: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
      } else {
        setErrors({ form: 'Email hoặc mật khẩu không chính xác.' });
      }
    } catch {
      setErrors({ form: 'Không thể kết nối máy chủ. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string, type: 'trainee' | 'admin') => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setSelectedDemo(type);
    setErrors({});
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
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=85"
            alt="AIFit Studio Workout"
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
              <span className="block text-[#F8FAFC]">Vượt qua giới hạn.</span>
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
      {/* CỘT PHẢI (48%): PREMIUM AUTHENTICATION FORM              */}
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
              Đăng nhập
            </h2>
            <p className="font-body text-[15px] text-[#64676E] mt-1.5">
              Tiếp tục hành trình tập luyện của bạn cùng AIFit.
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

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[54px] min-h-[54px] rounded-xl font-semibold text-[16px] bg-[#C9A227] hover:bg-[#B18B20] text-[#161616] shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4 text-[#161616]" />
                </>
              )}
            </button>
          </form>

          {/* ======================================================== */}
          {/* TÀI KHOẢN THỬ NGHIỆM (MINIMAL OUTLINE CARDS)              */}
          {/* ======================================================== */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-[#E8E2D6] w-full" />
              <span className="bg-white px-3 text-[13px] text-[#64676E] whitespace-nowrap absolute">
                Hoặc trải nghiệm tài khoản mẫu
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Option 1: Học viên tập luyện */}
              <button
                type="button"
                onClick={() => handleQuickLogin('trainee@aifit.com', 'trainee123', 'trainee')}
                className={`h-[58px] px-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center ${
                  selectedDemo === 'trainee'
                    ? 'border-[#C9A227] bg-[#FAF6EC]'
                    : 'border-[#D8D3C8] bg-white hover:border-[#C9A227] hover:bg-[#FAF6EC]/50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#202124] font-medium text-[13px]">
                  <UserCheck className="w-3.5 h-3.5 text-[#92701B] shrink-0" />
                  <span>Học viên</span>
                </div>
                <span className="text-[11px] text-[#64676E] truncate block font-mono mt-0.5">
                  trainee@aifit.com
                </span>
              </button>

              {/* Option 2: Quản trị viên */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@aifit.com', 'admin123', 'admin')}
                className={`h-[58px] px-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center ${
                  selectedDemo === 'admin'
                    ? 'border-[#C9A227] bg-[#FAF6EC]'
                    : 'border-[#D8D3C8] bg-white hover:border-[#C9A227] hover:bg-[#FAF6EC]/50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#202124] font-medium text-[13px]">
                  <Shield className="w-3.5 h-3.5 text-[#92701B] shrink-0" />
                  <span>Quản trị viên</span>
                </div>
                <span className="text-[11px] text-[#64676E] truncate block font-mono mt-0.5">
                  admin@aifit.com
                </span>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="text-center text-[14px] text-[#64676E] pt-1">
            Bạn chưa có tài khoản?{' '}
            <NavLink
              to="/signup"
              className="font-semibold text-[#92701B] hover:text-[#7A5D13] hover:underline transition-colors"
            >
              Đăng ký ngay
            </NavLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
