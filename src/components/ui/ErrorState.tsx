import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã xảy ra sự cố',
  message = 'Không thể tải dữ liệu vào lúc này. Vui lòng thử lại.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-10 bg-red-50/60 rounded-2xl border border-red-200/80 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-xl text-red-950 mb-2">{title}</h3>
      <p className="font-body text-sm text-red-800 max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Thử lại</span>
        </Button>
      )}
    </div>
  );
};
