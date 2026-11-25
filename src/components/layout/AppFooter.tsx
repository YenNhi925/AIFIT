import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, User, Lock } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="relative bg-[#111214] text-[#C5C8CE] text-[13px] border-t border-white/10 select-none">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-8 mb-10">
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#18191B] flex items-center justify-center font-display font-bold text-[#D6BC84] text-sm border border-[#B89545]/40">
                AI
              </div>
              <span className="font-display font-bold text-xl text-[#F7F7F7] tracking-tight group-hover:text-[#D6BC84] transition-colors">
                AIFit
              </span>
            </Link>
            <p className="text-[#C5C8CE] leading-relaxed text-[13px]">
              Trợ lý tập luyện AI hỗ trợ phân tích chuyển động và tư thế sinh cơ học thời gian thực, đảm bảo chuẩn kỹ thuật và tối ưu an toàn.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#D6BC84]">
              <Shield className="w-3.5 h-3.5 text-[#B89545] shrink-0" />
              <span>Xử lý camera 100% tại thiết bị của bạn</span>
            </div>
          </div>

          {/* Cột 2 — Bài tập cốt lõi */}
          <div>
            <h4 className="font-display font-semibold text-sm text-[#F7F7F7] mb-3.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6BC84]" />
              <span>Bài tập cốt lõi</span>
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="hover:text-white transition-colors">
                Trang chủ tập luyện
              </Link>
              <Link to="/exercise/1/guide" className="hover:text-white transition-colors">
                Kỹ thuật Squat — Đứng lên ngồi xuống
              </Link>
              <Link to="/exercise/2/guide" className="hover:text-white transition-colors">
                Kỹ thuật Plank — Giữ tư thế thẳng người
              </Link>
              <Link to="/exercise/3/guide" className="hover:text-white transition-colors">
                Kỹ thuật Push-up — Chống đẩy
              </Link>
            </div>
          </div>

          {/* Cột 3 — Phân hệ học viên */}
          <div>
            <h4 className="font-display font-semibold text-sm text-[#F7F7F7] mb-3.5 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D6BC84]" />
              <span>Khu vực cá nhân</span>
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/history" className="hover:text-white transition-colors">
                Lịch sử & Phân tích tiến độ
              </Link>
              <Link to="/profile" className="hover:text-white transition-colors">
                Hồ sơ & Cài đặt bảo mật
              </Link>
              <Link to="/welcome" className="hover:text-white transition-colors">
                Giới thiệu hệ sinh thái AIFit
              </Link>
            </div>
          </div>

          {/* Cột 4 — Thông tin & Cam kết */}
          <div>
            <h4 className="font-display font-semibold text-sm text-[#F7F7F7] mb-3.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D6BC84]" />
              <span>Quyền riêng tư</span>
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/welcome#about" className="hover:text-white transition-colors">
                Chính sách bảo mật dữ liệu
              </Link>
              <Link to="/welcome#about" className="hover:text-white transition-colors">
                Tiêu chuẩn sinh trắc học AI
              </Link>
              <span className="text-[#858A93] cursor-default text-xs">
                AIFit Studio V10.0 Enterprise
              </span>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền dưới cùng */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#858A93]">
          <span>© 2026 AIFit. Bảo lưu mọi quyền. Dự án C1SE.87 — Đại học Duy Tân.</span>
          <span>Nền tảng Personal Training Studio chuẩn quốc tế dành riêng cho người Việt.</span>
        </div>
      </div>
    </footer>
  );
};
