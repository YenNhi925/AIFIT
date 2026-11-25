import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Sliders,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavGroup {
  groupTitle: string;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'TỔNG QUAN',
      items: [
        { label: 'Tổng quan hệ thống', path: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'QUẢN LÝ',
      items: [
        { label: 'Quản lý người dùng', path: '/admin/users', icon: Users },
        { label: 'Quản lý bài tập', path: '/admin/exercises', icon: Dumbbell },
        { label: 'Quản lý quy tắc tập luyện', path: '/admin/rules', icon: Sliders },
      ],
    },
    {
      groupTitle: 'GIÁM SÁT',
      items: [
        { label: 'Nhật ký hệ thống', path: '/admin/logs', icon: FileText },
      ],
    },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    success('Bạn đã đăng xuất khỏi trang quản trị.');
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-[#101114] border-r border-[#1F2228] z-30 transition-all duration-250 ease-in-out flex flex-col justify-between selection:bg-gold/30 selection:text-white ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Subtle Tech Grid in Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

        {/* Ambient Gold Glow at bottom */}
        <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        {/* TOP BRANDING */}
        <div className="relative z-10">
          <div className="h-18 flex items-center justify-between px-5 border-b border-[#1F2228]">
            <NavLink to="/admin" className="flex items-center gap-3 overflow-hidden group">
              {/* Logo Gold Badge */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gold via-gold-dark to-obsidian flex items-center justify-center shrink-0 shadow-lg shadow-gold/20 border border-gold/40 group-hover:border-gold transition-colors">
                <span className="font-display font-black text-white text-base tracking-wider">
                  AI
                </span>
                <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {!collapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-extrabold text-base text-white tracking-tight leading-tight">
                      AIFit
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                      ADMIN
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#8C9099] tracking-wider uppercase">
                    Trung tâm quản trị
                  </span>
                </div>
              )}
            </NavLink>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg border border-[#252830] text-[#8C9099] hover:text-white hover:bg-[#1B1D21] transition-all cursor-pointer"
              title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* GROUPED NAVIGATION */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navGroups.map(group => (
              <div key={group.groupTitle} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-[#9CA3AF] uppercase">
                    {group.groupTitle}
                  </div>
                )}
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-[#22252A] text-[#D5B56A] font-bold shadow-xs'
                          : 'text-[#B8BEC8] hover:text-white hover:bg-[#1B1D21]'
                      } ${collapsed ? 'justify-center px-0' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Gold Left Border for Active Item */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#D5B56A]"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-[#D5B56A]' : 'text-[#9CA3AF] group-hover:text-white'
                        }`}
                      />

                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* BOTTOM ADMIN ACCOUNT & TRAINEE PORTAL */}
        <div className="relative z-10 p-3 border-t border-[#1F2228] space-y-2 bg-[#0C0D0F]/80">
          {!collapsed && (
            <NavLink
              to="/"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#B8BEC8] hover:text-[#D5B56A] hover:bg-[#1B1D21] transition-all"
            >
              <span>Về cổng Học viên</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>
          )}

          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-[#16181C] border border-[#252830] ${
              collapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-obsidian to-charcoal border border-gold/40 text-gold font-bold text-xs flex items-center justify-center shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F8FAFC] truncate leading-tight">
                  {user?.fullName || 'Quản trị viên'}
                </p>
                <p className="text-[11px] text-[#A8AFBB] truncate">{user?.email || 'admin@aifit.com'}</p>
              </div>
            )}

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-[#B8BEC8] hover:text-red-400 p-1.5 rounded-lg hover:bg-[#20232A] transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Đăng xuất khỏi Bảng Quản trị?"
        description="Bạn có chắc chắn muốn kết thúc phiên làm việc của Quản trị viên không?"
        confirmLabel="Đăng xuất"
        cancelLabel="Ở lại"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
