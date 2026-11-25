import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Camera,
  Play,
  Dumbbell,
  AlertTriangle,
  Info,
  Activity,
  Check,
  X as XIcon,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { AppFooter } from '../../components/layout/AppFooter';
import { MOCK_EXERCISES } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';

// Standardized athletic images matching tone, quality, and side-view angle
const EXERCISE_GUIDE_IMAGES: Record<string, string> = {
  Squat: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
  Plank: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1200&q=80',
  'Push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1200&q=80',
};

export default function ExerciseGuidePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const exerciseId = Number(id);
  const exercise = MOCK_EXERCISES.find(e => e.id === exerciseId);

  if (!exercise || exercise.status !== 'Active') {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex flex-col font-body">
        <TopNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EDEAE3] text-[#80601D] flex items-center justify-center mb-4 border border-[#DEDDD7]">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl text-[#202124] mb-2">
            Bài tập chưa sẵn sàng
          </h2>
          <p className="text-[#626770] text-sm mb-6">
            Không tìm thấy bài tập được yêu cầu hoặc bài tập đang tạm dừng hoạt động.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl bg-[#B89545] hover:bg-[#9E7E36] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
        <AppFooter />
      </div>
    );
  }

  // Chi tiết bài tập
  const getGuideDetails = () => {
    switch (exercise.name) {
      case 'Squat':
        return {
          title: 'Squat — Đứng lên ngồi xuống',
          overview:
            'Bài tập đa khớp phát triển toàn diện sức mạnh thân dưới, cải thiện độ linh hoạt của khớp hông và củng cố gân cơ đầu gối.',
          targetAngle: 'Gập gối: 90°–110°',
          jointFormula: 'Hông › Đầu gối › Cổ chân',
          angleCallout: 'Góc gối: 98° (Mục tiêu chuẩn)',
          checkpoints: [
            'Hai chân mở rộng bằng vai, mũi bàn chân hơi xoay nhẹ ra ngoài 15–30 độ.',
            'Giữ cột sống thẳng tự nhiên, ngực ưỡn mở rộng trong suốt chu kỳ hạ và nâng người.',
            'Hạ hông xuống sâu cho đến khi khớp gối đạt góc chuẩn 90°–110°.',
            'Đầu gối luôn hướng theo chiều mũi chân, tuyệt đối không chụm gối vào trong.',
            'Dồn trọng tâm vào giữa bàn chân và đạp gót chân để đứng thẳng dậy hoàn toàn.',
          ],
          correctForm:
            'Đùi song song mặt sàn, lưng thẳng tự nhiên, đầu gối thẳng hàng với mũi chân.',
          incorrectForm:
            'Gối chụm vào trong, lưng cong hoặc võng quá mức, gót chân nhấc khỏi mặt đất.',
          cameraRules: [
            'Góc máy quay nhìn ngang sườn (profile) là bắt buộc để AI đo chính xác độ sâu gập gối.',
            'Đặt camera cao ngang tầm hông, cách người tập từ 2 đến 3 mét.',
            'Đảm bảo thấy toàn bộ cơ thể từ đỉnh đầu đến giày trong khung hình.',
            'Đủ ánh sáng phòng; tránh mặc quần áo quá thùng thình che khuất khớp.',
          ],
          notes: [
            'Khởi động kỹ khớp cổ chân và khớp hông trước khi tập.',
            'Hít vào khi hạ người xuống, thở mạnh ra bằng miệng khi đạp người đứng lên.',
            'Giữ mắt nhìn thẳng về phía trước, không cúi gập cổ nhìn xuống đất.',
          ],
        };

      case 'Plank':
        return {
          title: 'Plank — Giữ tư thế thẳng người',
          overview:
            'Bài tập tĩnh rèn luyện sức bền và sự ổn định của nhóm cơ lõi, bảo vệ cột sống và tăng cường tư thế thẳng tự nhiên.',
          targetAngle: 'Độ thẳng thân người: 165°–180°',
          jointFormula: 'Vai › Hông › Cổ chân',
          angleCallout: 'Độ thẳng thân: 174° (Mục tiêu chuẩn)',
          checkpoints: [
            'Đặt khuỷu tay vuông góc ngay dưới khớp vai, cẳng tay áp sát và song song trên sàn.',
            'Duy trì một đường thẳng tắp từ vai, hông xuống đến mắt cá chân trong suốt thời gian giữ.',
            'Chủ động siết chặt cơ bụng và cơ mông để ngăn ngừa võng hông (góc hông < 165°).',
            'Không nhô mông lên cao tạo góc nhọn hướng lên trần nhà.',
            'Giữ cổ thẳng tự nhiên, mắt nhìn thẳng xuống sàn giữa hai bàn tay.',
          ],
          correctForm:
            'Thân người tạo thành một đường thẳng tắp, cơ lõi gồng chắc, thở đều đặn.',
          incorrectForm:
            'Võng hông xuống sàn gây đau lưng, hoặc đẩy mông lên quá cao giảm áp lực cơ bụng.',
          cameraRules: [
            'Đặt camera góc ngang sườn trực diện, song song với mặt sàn.',
            'Camera cao ngang mặt sàn hoặc tầm hông, cách vị trí tập khoảng 2 mét.',
            'Cần thu trọn vẹn toàn bộ người từ đầu đến ngón chân trong suốt bài tập.',
            'Mặc đồ tương phản với màu sàn nhà để thuật toán nhận diện chính xác nhất.',
          ],
          notes: [
            'Duy trì nhịp thở hít sâu thở chậm đều đặn, tuyệt đối không nín thở.',
            'Dừng bài tập ngay khi thấy cơ bụng đuối sức dẫn đến võng lưng dưới.',
            'Sử dụng thảm tập êm ái để bảo vệ khớp khuỷu tay.',
          ],
        };

      case 'Push-up':
      default:
        return {
          title: 'Push-up — Chống đẩy',
          overview:
            'Bài tập kinh điển phát triển cơ ngực, cơ delta trước và cơ tam đầu bắp tay, đồng thời rèn luyện cơ lõi vững chắc.',
          targetAngle: 'Gập khuỷu tay: ≤ 90° ở đáy rep',
          jointFormula: 'Vai › Khuỷu tay › Cổ tay',
          angleCallout: 'Góc khuỷu tay: 88° (Hợp lệ)',
          checkpoints: [
            'Đặt hai tay rộng hơn vai một chút, các ngón tay bám chắc và hướng về phía trước.',
            'Hạ thân người có kiểm soát cho đến khi ngực cách sàn vài cm (khuỷu tay gập ≤ 90°).',
            'Khép khuỷu tay tạo góc 45°–60° so với thân người (không bạnh ngang > 75°).',
            'Giữ thân người thẳng tắp như tư thế plank từ đầu đến gót chân suốt hành trình.',
            'Đẩy thẳng tay trở lại vị trí cao nhất (~180°) để hoàn tất 1 lần tập hợp lệ.',
          ],
          correctForm:
            'Ngực hạ sát sàn, khuỷu tay khép 45 độ, thân người thẳng tắp.',
          incorrectForm:
            'Bạnh khuỷu tay ngang vai gây chấn thương, võng hông hoặc không hạ đủ độ sâu.',
          cameraRules: [
            'Đặt camera góc ngang sườn hoặc chếch 45 độ để thấy rõ độ sâu và đường thẳng thân.',
            'Camera cách khoảng 2 mét, cao tầm 0.5 mét so với mặt sàn.',
            'Đảm bảo khung hình thấy toàn bộ cánh tay, thân mình và hai chân.',
            'Ánh sáng đồng đều, tránh bóng tối quá sâu dưới lồng ngực.',
          ],
          notes: [
            'Khởi động kỹ khớp cổ tay và khớp vai trước khi thực hiện.',
            'Hít sâu khi hạ thấp ngực xuống, thở dứt khoát khi đẩy người lên.',
            'Không để cổ bị gục xuống sàn trước ngực.',
          ],
        };
    }
  };

  const guide = getGuideDetails();
  const guidePhoto = EXERCISE_GUIDE_IMAGES[exercise.name] || EXERCISE_GUIDE_IMAGES['Squat'];

  return (
    <div className="min-h-screen bg-[#F2F1ED] text-[#202124] flex flex-col font-body selection:bg-[#B89545]/20 selection:text-[#202124]">
      <TopNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageTransition>
          {/* Nút Quay lại */}
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64676E] hover:text-[#202124] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại danh mục bài tập</span>
          </NavLink>

          {/* Tiêu đề trang & Mục tiêu góc */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-6">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-1">
                Hướng dẫn Kỹ thuật Sinh cơ học
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#202124] tracking-tight">
                {guide.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D6] text-xs font-bold text-[#202124] shadow-xs flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-gold" />
                Mục tiêu góc: {guide.targetAngle}
              </span>
            </div>
          </div>

          {/* SECTION: TỔNG QUAN BÀI TẬP */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-2">
            <h3 className="font-display font-bold text-base text-[#202124] flex items-center gap-2">
              <Info className="w-4 h-4 text-gold shrink-0" />
              <span>Tổng quan bài tập</span>
            </h3>
            <p className="text-sm text-[#64676E] leading-relaxed">
              {guide.overview}
            </p>
          </div>

          {/* BỐ CỤC 2 CỘT CHÍNH (5 cols / 7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI: ẢNH VẬN ĐỘNG VIÊN CHÂN THỰC & ĐÁNH GIÁ ĐÚNG/SAI (5 cột) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Thẻ Ảnh Minh họa Vận Động Viên + Skeleton Overlay */}
              <div className="bg-obsidian rounded-3xl border border-[#252830] overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-gold tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tư thế chuẩn mực
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    CHUẨN SINH HỌC
                  </span>
                </div>

                {/* Athlete Real Photo with Aspect 4:3 */}
                <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={guidePhoto}
                    alt={exercise.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Angle Callout Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#16181C]/90 p-3 rounded-2xl border border-gold/30 backdrop-blur-md">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">
                        Chỉ số tối ưu
                      </span>
                      <span className="text-xs font-bold text-gold font-mono">
                        {guide.angleCallout}
                      </span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                <div className="p-4 bg-[#16181C] border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                  <span>Chuỗi khớp: <strong className="text-white font-mono">{guide.jointFormula}</strong></span>
                  <span className="text-gold font-mono text-[11px]">Tốc độ 28 FPS</span>
                </div>
              </div>

              {/* Tư thế đúng và sai */}
              <div className="bg-white rounded-3xl p-6 border border-[#E8E2D6] shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base text-[#202124] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gold shrink-0" />
                  <span>Tư thế đúng và sai</span>
                </h3>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-emerald-800 text-xs mb-0.5">Tư thế đúng:</strong>
                      <span>{guide.correctForm}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3">
                    <XIcon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-red-800 text-xs mb-0.5">Tư thế sai:</strong>
                      <span>{guide.incorrectForm}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: NHỮNG ĐIỂM AI KIỂM TRA & CAMERA (7 cột) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Những điểm AI sẽ kiểm tra */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#202124] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Những điểm AI sẽ kiểm tra</span>
                </h3>
                <ul className="space-y-3">
                  {guide.checkpoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#64676E] leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-[#FAF6EC] border border-[#E8E2D6] font-mono font-bold text-xs text-gold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hướng dẫn đặt camera */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#202124] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gold shrink-0" />
                  <span>Hướng dẫn đặt camera</span>
                </h3>
                <ul className="space-y-2.5">
                  {guide.cameraRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#64676E]">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lưu ý trước khi tập */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#202124] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Lưu ý trước khi tập</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#64676E]">
                  {guide.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>

                {/* Privacy Banner */}
                <div className="p-3.5 rounded-2xl bg-obsidian text-white flex items-center gap-3 text-xs border border-gold/20">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-gray-300">
                    Bảo mật tuyệt đối: Luồng camera chỉ phân tích cục bộ trên thiết bị của bạn.
                  </span>
                </div>
              </div>

              {/* Nút Bắt đầu tập luyện */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/exercise/${exercise.id}/workout`)}
                  className="w-full h-14 rounded-2xl font-display font-bold text-base uppercase tracking-wider bg-gold hover:bg-gold-dark text-white shadow-xl shadow-gold/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  <span>Bắt đầu tập luyện</span>
                </button>
                <p className="text-center text-xs text-[#64676E] mt-2">
                  Nhấp chuột sẽ bật camera và khởi động bộ phân tích chuyển động AI
                </p>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      {/* Global App Footer */}
      <AppFooter />
    </div>
  );
}
