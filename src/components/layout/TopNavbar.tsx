import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Shield, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';

export const TopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    success('Bạn đã đăng xuất thành công.');
    navigate('/login');
  };

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Lịch sử tập luyện', path: '/history' },
    { label: 'Hồ sơ cá nhân', path: '/profile' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-[76px] transition-all duration-300 ${
          scrolled
            ? 'bg-[#F2F1ED]/95 backdrop-blur-md border-b border-[#DEDDD7] shadow-xs'
            : 'bg-[#F2F1ED]/90 backdrop-blur-sm border-b border-[#DEDDD7]'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Bên trái: Logo AIFit */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#111214] flex items-center justify-center border border-[#B89545]/40 group-hover:border-[#B89545] transition-all shrink-0">
              <span className="font-display font-bold text-[#D6BC84] text-base tracking-wider">AI</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-[#202124] tracking-tight leading-none group-hover:text-[#80601D] transition-colors">
                AIFit
              </span>
              <span className="text-[11px] font-normal text-[#626770] mt-0.5 tracking-tight">
                Trợ lý tập luyện thông minh
              </span>
            </div>
          </NavLink>

          {/* Ở giữa: 3 Mục điều hướng chính với gạch chân tinh tế */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-[15px] transition-colors duration-150 ${
                    isActive
                      ? 'text-[#80601D] font-semibold'
                      : 'text-[#626770] font-medium hover:text-[#202124]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#80601D] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </NavLink>
              );
            })}

            {user?.role === 'Admin' && (
              <NavLink
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDEAE3] text-[#202124] hover:bg-[#DEDDD7] transition-colors ml-3 border border-[#DEDDD7]"
              >
                <Shield className="w-3.5 h-3.5 text-[#80601D]" />
                <span>Bảng Quản trị</span>
              </NavLink>
            )}
          </nav>

          {/* Bên phải: Avatar & Thông tin tài khoản */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-[#EDEAE3] transition-colors border border-transparent hover:border-[#DEDDD7] cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-[#111214] text-[#D6BC84] font-bold text-xs flex items-center justify-center border border-[#B89545]/30">
                  {getInitials(user?.fullName)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#202124] max-w-[130px] truncate leading-tight">
                    {user?.fullName || 'Học viên'}
                  </span>
                  <span className="text-[10px] text-[#626770] leading-none mt-0.5">
                    {user?.role === 'Admin' ? 'Quản trị viên' : 'Học viên'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#626770] transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#DEDDD7] shadow-lg py-1.5 z-50 text-xs"
                  >
                    <div className="px-4 py-2.5 border-b border-[#DEDDD7]">
                      <div className="font-semibold text-[#202124] truncate">
                        {user?.fullName}
                      </div>
                      <div className="text-[11px] text-[#626770] truncate mt-0.5">
                        {user?.email}
                      </div>
                    </div>

                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#3F4246] hover:text-[#202124] hover:bg-[#F2F1ED] transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#80601D]" />
                        <span>Hồ sơ cá nhân</span>
                      </NavLink>

                      {user?.role === 'Admin' && (
                        <NavLink
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#3F4246] hover:text-[#202124] hover:bg-[#F2F1ED] transition-colors"
                        >
                          <Shield className="w-4 h-4 text-[#80601D]" />
                          <span>Bảng điều hành Quản trị</span>
                        </NavLink>
                      )}
                    </div>

                    <div className="border-t border-[#DEDDD7] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#C53030] hover:bg-red-50/70 transition-colors cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4 text-[#C53030]" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#202124] hover:bg-[#EDEAE3] transition-colors cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#F2F1ED] border-b border-[#DEDDD7] px-4 py-3 space-y-1"
            >
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-white text-[#80601D] font-bold shadow-xs'
                        : 'text-[#626770] hover:bg-white hover:text-[#202124]'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                );
              })}

              {user?.role === 'Admin' && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#80601D] bg-[#EDEAE3]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Bảng Quản trị</span>
                </NavLink>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Confirmation Dialog Logout */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản AIFit? Tiến trình tập luyện hiện tại đã được lưu an toàn."
        confirmLabel="Đăng xuất"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
