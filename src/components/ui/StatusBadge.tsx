import React from 'react';

export type BadgeVariant =
  | 'Active'
  | 'Inactive'
  | 'Locked'
  | 'Correct'
  | 'Error'
  | 'Camera denied'
  | 'Body lost'
  | 'Sync failed'
  | 'API error'
  | 'reps'
  | 'hold'
  | 'Trainee'
  | 'Admin';

interface StatusBadgeProps {
  status: BadgeVariant | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyleAndLabel = (s: string): { style: string; label: string } => {
    switch (s) {
      case 'Active':
        return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', label: 'Đang hoạt động' };
      case 'Correct':
        return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', label: 'Đúng chuẩn' };
      case 'Locked':
        return { style: 'bg-red-50 text-red-700 border-red-200/80', label: 'Đã khóa' };
      case 'Error':
        return { style: 'bg-red-50 text-red-700 border-red-200/80', label: 'Lỗi tư thế' };
      case 'Camera denied':
        return { style: 'bg-red-50 text-red-700 border-red-200/80', label: 'Từ chối Camera' };
      case 'API error':
        return { style: 'bg-red-50 text-red-700 border-red-200/80', label: 'Lỗi API' };
      case 'Body lost':
        return { style: 'bg-amber-50 text-amber-700 border-amber-200/80', label: 'Mất nhận diện' };
      case 'Sync failed':
        return { style: 'bg-amber-50 text-amber-700 border-amber-200/80', label: 'Đồng bộ thất bại' };
      case 'Inactive':
        return { style: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Ngừng hoạt động' };
      case 'reps':
        return { style: 'bg-amber-500/10 text-amber-700 border-amber-300/40 text-[11px] font-bold', label: 'ĐẾM REP' };
      case 'hold':
        return { style: 'bg-amber-500/10 text-amber-700 border-amber-300/40 text-[11px] font-bold', label: 'GIỮ THỜI GIAN' };
      case 'Admin':
        return { style: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Quản trị viên' };
      case 'Trainee':
        return { style: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Học viên' };
      default:
        return { style: 'bg-gray-50 text-gray-700 border-gray-200', label: s };
    }
  };

  const { style, label } = getStyleAndLabel(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {label}
    </span>
  );
};
