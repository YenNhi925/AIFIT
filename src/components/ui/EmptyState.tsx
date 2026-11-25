import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có bản ghi nào để hiển thị.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-cream-border ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center text-gold mb-4 shadow-inner">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="font-display font-bold text-xl text-text-primary mb-2">{title}</h3>
      <p className="font-body text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
