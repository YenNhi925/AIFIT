import React from 'react';
import { Lock } from 'lucide-react';

interface PrivacyNoteProps {
  className?: string;
}

export const PrivacyNote: React.FC<PrivacyNoteProps> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-900 ${className}`}
    >
      <Lock className="w-3.5 h-3.5 text-gold shrink-0" />
      <span>Hình ảnh camera chỉ xử lý cục bộ trên máy bạn, tuyệt đối không lưu trữ hay tải lên máy chủ.</span>
    </div>
  );
};
