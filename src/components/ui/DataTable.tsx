import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'Chưa có dữ liệu',
  emptyDescription = 'Không có bản ghi nào phù hợp để hiển thị.',
  pageSize = 10,
  className = '',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-white rounded-2xl border border-cream-border">
        <SkeletonLoader count={5} className="h-12 w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className={className} />;
  }

  return (
    <div className={`bg-white rounded-2xl border border-cream-border shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-cream-border bg-cream/50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-5 py-4 font-display font-semibold text-xs uppercase tracking-wider text-text-secondary ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-border/60">
            {currentData.map((item, index) => (
              <tr key={keyExtractor(item)} className="hover:bg-cream/20 transition-colors">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 text-text-primary ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    } ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(item, startIndex + index)
                      : (item as Record<string, unknown>)[col.key] != null
                      ? String((item as Record<string, unknown>)[col.key])
                      : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-cream-border flex items-center justify-between bg-cream/20 text-xs text-text-secondary">
          <span>
            Đang xem mục <strong className="text-text-primary">{startIndex + 1}</strong> đến{' '}
            <strong className="text-text-primary">{Math.min(startIndex + pageSize, data.length)}</strong> trong tổng số{' '}
            <strong className="text-text-primary">{data.length}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-cream-border bg-white text-text-primary hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-text-primary px-2">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-cream-border bg-white text-text-primary hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
