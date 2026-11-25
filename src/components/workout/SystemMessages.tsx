import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraOff, AlertTriangle, WifiOff, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface SystemMessagesProps {
  workoutState: string;
  countdown: number;
  isOffline: boolean;
  onRetryCamera: () => void;
  onBackToExercises: () => void;
  onRetrySync?: () => void;
}

export const SystemMessages: React.FC<SystemMessagesProps> = ({
  workoutState,
  countdown,
  isOffline,
  onRetryCamera,
  onBackToExercises,
  onRetrySync,
}) => {
  return (
    <>
      {/* 1. THÔNG BÁO TỪ CHỐI QUYỀN CAMERA (UI-09a) */}
      <AnimatePresence>
        {workoutState === 'camera-denied' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-cream-border"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <CameraOff className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-2xl text-text-primary tracking-tight">
                  Từ chối quyền Camera
                </h3>
                <p className="font-body text-sm text-text-secondary mt-2 leading-relaxed">
                  AIFit cần quyền truy cập camera để nhận diện các khớp xương và sửa tư thế theo thời gian thực.
                  Hình ảnh chỉ xử lý ngay trong trình duyệt của bạn, hoàn toàn không được lưu trữ hay tải lên máy chủ.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button variant="primary" size="lg" className="w-full" onClick={onRetryCamera}>
                  Thử lại kết nối Camera
                </Button>
                <button
                  type="button"
                  onClick={onBackToExercises}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-gold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại danh mục bài tập</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. CẢNH BÁO MẤT NHẬN DIỆN CƠ THỂ (UI-09b) */}
      <AnimatePresence>
        {workoutState === 'body-lost' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-4"
          >
            <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3 backdrop-blur-md border border-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
              <div className="flex-1">
                <p className="font-display font-bold text-sm">Không nhận diện được cơ thể</p>
                <p className="text-xs text-amber-100">Vui lòng lùi lại để toàn bộ cơ thể hiển thị trọn vẹn trong khung hình.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MẤT KẾT NỐI MẠNG (UI-09c) */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 right-4 z-30"
          >
            <div className="bg-red-950/90 border border-red-500/50 text-white rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
              <WifiOff className="w-4 h-4 text-red-400" />
              <div className="text-xs">
                <span className="font-bold block">Chế độ Ngoại tuyến</span>
                <span className="text-gray-300">Buổi tập vẫn lưu cục bộ</span>
              </div>
              {onRetrySync && (
                <button
                  type="button"
                  onClick={onRetrySync}
                  className="ml-2 p-1 text-xs font-semibold text-gold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Thử lại</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MÀN ĐẾM NGƯỢC (3 -> 2 -> 1 -> BẮT ĐẦU!) */}
      <AnimatePresence>
        {workoutState === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <span className="text-xs font-bold tracking-widest text-champagne uppercase mb-4">
              CHUẨN BỊ BẮT ĐẦU TRONG
            </span>
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display font-black text-8xl sm:text-9xl text-gold"
            >
              {countdown > 0 ? countdown : 'BẮT ĐẦU!'}
            </motion.div>
            <span className="text-sm text-gray-300 font-medium mt-6">
              Đứng vào vị trí sẵn sàng trước camera
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. TẠM DỪNG */}
      <AnimatePresence>
        {workoutState === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3"
          >
            <span className="font-display font-extrabold text-5xl tracking-tight text-white">
              TẠM DỪNG
            </span>
            <p className="text-sm text-gray-300">Đồng hồ và phân tích tư thế AI đang tạm dừng</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. TẢI MÔ HÌNH NHẬN DIỆN AI */}
      <AnimatePresence>
        {workoutState === 'loading-model' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-dark-bg flex flex-col items-center justify-center text-white space-y-4"
          >
            <Loader2 className="w-12 h-12 text-gold animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-xl">Khởi động Thị giác Máy tính AI</h3>
              <p className="text-xs text-gray-400">Đang khởi tạo bộ phân tích 33 khớp xương...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. ĐANG LƯU KẾT QUẢ */}
      <AnimatePresence>
        {workoutState === 'saving' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-4"
          >
            <Loader2 className="w-12 h-12 text-gold animate-spin" />
            <h3 className="font-display font-bold text-2xl">Đang lưu kết quả buổi tập...</h3>
            <p className="text-xs text-gray-400">Đang tổng hợp thông số góc sinh học và lịch sử chuyển động</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
