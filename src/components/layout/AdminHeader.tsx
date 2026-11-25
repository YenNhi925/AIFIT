import React from 'react';
import { Menu, ChevronRight, Calendar, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  breadcrumbs: string[];
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  breadcrumbs,
  collapsed,
  onToggleSidebar,
}) => {
  const { user } = useAuth();
  const todayStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-[#F8F5ED]/90 backdrop-blur-md border-b border-[#E8E2D6] px-4 sm:px-8 flex items-center justify-between transition-all">
      {/* Left: Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#374151] hover:text-[#202124] hover:bg-white border border-[#E8E2D6] transition-all cursor-pointer shadow-xs"
          title={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-xs font-semibold text-[#64676E]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                <span className={isLast ? 'text-[#202124] font-bold' : 'hover:text-[#202124]'}>
                  {crumb}
                </span>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Date, Status, Admin Identity */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#374151] font-medium bg-white px-3.5 py-1.5 rounded-xl border border-[#E8E2D6] shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#92701B]" />
          <span className="capitalize">{todayStr}</span>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E8E2D6]">
          <div className="w-8 h-8 rounded-full bg-obsidian text-gold border border-gold/30 font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-[#202124] leading-tight">
              {user?.fullName || 'Quản trị viên'}
            </span>
            <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
