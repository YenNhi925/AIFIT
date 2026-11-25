import React from 'react';
import { Shield } from 'lucide-react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E8E2D6] bg-white/70 py-4 px-6 text-xs text-[#64676E] flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-obsidian flex items-center justify-center text-gold font-bold text-[10px]">
          AI
        </div>
        <span className="font-semibold text-[#202124]">AIFit Admin Console</span>
        <span className="text-[#D8D3C8]">|</span>
        <span className="flex items-center gap-1 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-gold" />
          Trung tâm điều hành & Quản trị AI
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <span>Phiên bản v2.4.0 (Enterprise)</span>
        <span className="text-[#D8D3C8]">•</span>
        <span>© 2026 AIFit Inc. Tất cả quyền được bảo lưu.</span>
      </div>
    </footer>
  );
};
