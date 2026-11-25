import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Sliders,
  Play,
  Volume2,
  CheckCircle,
  AlertCircle,
  Compass,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import { MOCK_RULES } from '../../data/mockData';
import { PageTransition } from '../../components/ui/PageTransition';
import type { RuleType } from '../../types';

export default function AddEditRule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const isEdit = Boolean(id);
  const existingRule = isEdit ? MOCK_RULES.find(r => r.id === Number(id)) : null;

  // Form Fields
  const [exercise, setExercise] = useState(existingRule?.exercise || 'Squat');
  const [jointSet, setJointSet] = useState(existingRule?.jointSet || '');
  const [metric, setMetric] = useState(existingRule?.metric || '');
  const [minAngle, setMinAngle] = useState<string>(
    existingRule?.min != null ? String(existingRule.min) : ''
  );
  const [maxAngle, setMaxAngle] = useState<string>(
    existingRule?.max != null ? String(existingRule.max) : ''
  );
  const [ruleType, setRuleType] = useState<RuleType>(existingRule?.type || 'Error');
  const [refNo, setRefNo] = useState(existingRule?.ref || 'Ref. 3.3');
  const [label, setLabel] = useState(existingRule?.label || '');
  const [voice, setVoice] = useState(existingRule?.voice || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (existingRule) {
      setExercise(existingRule.exercise);
      setJointSet(existingRule.jointSet);
      setMetric(existingRule.metric);
      setMinAngle(existingRule.min != null ? String(existingRule.min) : '');
      setMaxAngle(existingRule.max != null ? String(existingRule.max) : '');
      setRuleType(existingRule.type);
      setRefNo(existingRule.ref);
      setLabel(existingRule.label);
      setVoice(existingRule.voice);
    }
  }, [existingRule]);

  // Voice speech synthesis test
  const handlePreviewVoice = () => {
    if (!voice.trim()) {
      error('Vui lòng nhập câu thoại cảnh báo bằng giọng nói trước.');
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(voice);
      u.rate = 1.05;
      u.pitch = 1.0;
      u.lang = 'vi-VN';
      window.speechSynthesis.speak(u);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!jointSet.trim()) newErrors.jointSet = 'Vui lòng nhập nhóm khớp / pha chuyển động.';
    if (!metric.trim()) newErrors.metric = 'Vui lòng nhập tên chỉ số.';
    if (!label.trim()) newErrors.label = 'Vui lòng nhập nhãn phân loại.';

    if (minAngle && maxAngle && Number(minAngle) >= Number(maxAngle)) {
      newErrors.minAngle = 'Góc tối thiểu phải nhỏ hơn góc tối đa.';
    }

    if (ruleType === 'Error' && !voice.trim()) {
      newErrors.voice = 'Quy tắc lỗi bắt buộc phải có câu thoại cảnh báo giọng nói.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit && existingRule) {
      const nextVersion = existingRule.version + 1;
      success(`Đã phát hành quy tắc mới dưới phiên bản v${nextVersion}.`);
    } else {
      success('Đã thêm quy tắc góc sinh cơ học mới thành công.');
    }

    navigate('/admin/rules');
  };

  // Compute angle values for the SVG preview
  const numMin = minAngle ? Number(minAngle) : 0;
  const numMax = maxAngle ? Number(maxAngle) : 180;
  const targetAngle = minAngle && maxAngle ? Math.round((numMin + numMax) / 2) : numMin || numMax || 90;

  // Arc path computation for dynamic visual preview
  const cx = 100;
  const cy = 100;
  const radius = 60;
  const startAngleRad = (Math.PI / 180) * (180 - targetAngle);
  const endX = cx + radius * Math.cos(startAngleRad);
  const endY = cy - radius * Math.sin(startAngleRad);

  return (
    <AdminLayout
      breadcrumbs={[
        'Quản trị',
        'Quản lý quy tắc tập luyện',
        isEdit ? `Chỉnh sửa quy tắc #${id}` : 'Thêm quy tắc mới',
      ]}
    >
      <PageTransition>
        <div className="space-y-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/admin/rules')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64676E] hover:text-[#202124] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Quay lại danh sách quy tắc</span>
          </button>

          {/* Page Title */}
          <div className="border-b border-[#E8E2D6] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider block">
                Trình Hiệu chỉnh Ngưỡng Sinh cơ học (Visual Rule Studio)
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#202124] tracking-tight">
                {isEdit ? `Chỉnh sửa quy tắc: ${existingRule?.label}` : 'Thêm quy tắc mới'}
              </h1>
            </div>

            {isEdit && (
              <span className="self-start sm:self-auto font-mono text-xs font-bold text-[#92701B] px-3 py-1 rounded-full bg-white border border-gold/30">
                Phiên bản hiện tại: v{existingRule?.version || 1}
              </span>
            )}
          </div>

          {/* ======================================================== */}
          {/* TWO-COLUMN LAYOUT: FORM (LEFT) vs PREVIEW (RIGHT)        */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ==================================================== */}
            {/* CỘT TRÁI (7 cols): FORM NHÓM 1, 2, 3                */}
            {/* ==================================================== */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
                {/* NHÓM 1: THÔNG TIN QUY TẮC */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-sm space-y-4">
                  <div className="border-b border-[#E8E2D6]/80 pb-3">
                    <h3 className="font-display font-bold text-base text-[#202124] flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-gold" />
                      Nhóm 1: Thông tin bài tập & Nhóm khớp
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                        Bài tập áp dụng
                      </label>
                      <select
                        value={exercise}
                        onChange={e => setExercise(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-[#D8D3C8] bg-white text-xs font-bold text-[#202124] shadow-xs outline-none focus:border-gold cursor-pointer"
                      >
                        <option value="Squat">Squat</option>
                        <option value="Plank">Plank</option>
                        <option value="Push-up">Push-up</option>
                      </select>
                    </div>

                    <FormField
                      label="Nhóm khớp / Pha theo dõi"
                      placeholder="Ví dụ: Hông › Đầu gối › Cổ chân"
                      value={jointSet}
                      onChange={e => {
                        setJointSet(e.target.value);
                        setErrors(prev => ({ ...prev, jointSet: '' }));
                      }}
                      error={errors.jointSet}
                      required
                    />
                  </div>

                  <FormField
                    label="Chỉ số sinh trắc học đánh giá"
                    placeholder="Ví dụ: Độ sâu gập gối, Góc thẳng lưng, Góc khuỷu tay..."
                    value={metric}
                    onChange={e => {
                      setMetric(e.target.value);
                      setErrors(prev => ({ ...prev, metric: '' }));
                    }}
                    error={errors.metric}
                    required
                  />
                </div>

                {/* NHÓM 2: NGƯỠNG GÓC ĐÁNH GIÁ */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-sm space-y-4">
                  <div className="border-b border-[#E8E2D6]/80 pb-3">
                    <h3 className="font-display font-bold text-base text-[#202124] flex items-center gap-2">
                      <Compass className="w-4 h-4 text-gold" />
                      Nhóm 2: Ngưỡng góc khớp & Phân loại chuẩn
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Góc tối thiểu (°)"
                      type="number"
                      placeholder="Ví dụ: 90"
                      value={minAngle}
                      onChange={e => {
                        setMinAngle(e.target.value);
                        setErrors(prev => ({ ...prev, minAngle: '' }));
                      }}
                      error={errors.minAngle}
                    />

                    <FormField
                      label="Góc tối đa (°)"
                      type="number"
                      placeholder="Ví dụ: 110"
                      value={maxAngle}
                      onChange={e => {
                        setMaxAngle(e.target.value);
                        setErrors(prev => ({ ...prev, minAngle: '' }));
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-[#64676E] italic">
                    * Để trống góc tối thiểu hoặc tối đa nếu muốn áp dụng khoảng mở (ví dụ: &lt; 90° hoặc &gt; 165°).
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E8E2D6]/60">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                      Loại quy tắc
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          ruleType === 'Correct'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                            : 'bg-white border-[#D8D3C8] text-[#374151]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ruleType"
                          checked={ruleType === 'Correct'}
                          onChange={() => setRuleType('Correct')}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span className="text-xs">Đúng tư thế (Mục tiêu)</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          ruleType === 'Error'
                            ? 'bg-red-50 border-red-300 text-red-800 font-bold'
                            : 'bg-white border-[#D8D3C8] text-[#374151]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ruleType"
                          checked={ruleType === 'Error'}
                          onChange={() => setRuleType('Error')}
                          className="accent-red-600 w-4 h-4"
                        />
                        <span className="text-xs">Lỗi sai kỹ thuật</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* NHÓM 3: PHẢN HỒI & GIỌNG NÓI */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-sm space-y-4">
                  <div className="border-b border-[#E8E2D6]/80 pb-3">
                    <h3 className="font-display font-bold text-base text-[#202124] flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gold" />
                      Nhóm 3: Thông tin phản hồi & Hướng dẫn âm thanh
                    </h3>
                  </div>

                  <FormField
                    label="Nhãn phân loại (Hiển thị tóm tắt)"
                    placeholder="Ví dụ: Squat chưa đủ sâu, Lưng bị võng..."
                    value={label}
                    onChange={e => {
                      setLabel(e.target.value);
                      setErrors(prev => ({ ...prev, label: '' }));
                    }}
                    error={errors.label}
                    required
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                        Câu thoại cảnh báo giọng nói (Text-to-Speech)
                      </label>
                      <button
                        type="button"
                        onClick={handlePreviewVoice}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#92701B] hover:text-[#7A5D13] cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Nghe thử</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={voice}
                      onChange={e => {
                        setVoice(e.target.value);
                        setErrors(prev => ({ ...prev, voice: '' }));
                      }}
                      placeholder="Ví dụ: Hãy hạ thấp hông hơn nữa, giữ đùi song song sàn."
                      className={`w-full p-3.5 rounded-xl border text-xs font-medium text-[#202124] outline-none transition-all placeholder:text-[#757982] ${
                        errors.voice
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-[#D8D3C8] focus:border-gold'
                      }`}
                    />
                    {errors.voice && (
                      <p className="text-xs text-red-600 font-medium">{errors.voice}</p>
                    )}
                  </div>

                  <FormField
                    label="Tài liệu tham chiếu học thuật (Ref)"
                    placeholder="Ví dụ: Ref. 3.3, NSCA Standards..."
                    value={refNo}
                    onChange={e => setRefNo(e.target.value)}
                    helperText="Mã tham chiếu theo tài liệu CMU Capstone Project"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/rules')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#374151] hover:text-[#202124] hover:bg-[#FAF6EC] border border-[#D8D3C8] transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#161616] bg-gold hover:bg-gold-dark shadow-md shadow-gold/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isEdit ? 'Lưu phiên bản mới' : 'Tạo quy tắc mới'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ==================================================== */}
            {/* CỘT PHẢI (5 cols): DYNAMIC VISUAL PREVIEW PANEL      */}
            {/* ==================================================== */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-[#101114] rounded-3xl p-6 sm:p-7 border border-[#252830] text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#252830] pb-3">
                  <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    Trực quan hóa góc đo AI
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ruleType === 'Correct'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {ruleType === 'Correct' ? 'Đúng chuẩn' : 'Lỗi kỹ thuật'}
                  </span>
                </div>

                {/* SVG Visual Angle Measurement */}
                <div className="relative w-full h-56 rounded-2xl bg-[#16181C] border border-[#252830] flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 160">
                    {/* Background grid dots */}
                    <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.5" fill="#ffffff15" />
                    </pattern>
                    <rect width="200" height="160" fill="url(#dotPattern)" />

                    {/* Joint Bone 1 (Horizontal baseline) */}
                    <line x1="100" y1="120" x2="160" y2="120" stroke="#777981" strokeWidth="4" strokeLinecap="round" />

                    {/* Joint Bone 2 (Angled bone) */}
                    <line
                      x1="100"
                      y1="120"
                      x2={100 - 55 * Math.cos((targetAngle * Math.PI) / 180)}
                      y2={120 - 55 * Math.sin((targetAngle * Math.PI) / 180)}
                      stroke={ruleType === 'Correct' ? '#16A34A' : '#DC2626'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Arc indicating angle */}
                    <path
                      d="M 130 120 A 30 30 0 0 0 100 90"
                      stroke="#C9A227"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      fill="none"
                    />

                    {/* Joint Node Circles */}
                    <circle cx="100" cy="120" r="7" fill="#C9A227" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="160" cy="120" r="5" fill="#777981" />
                    <circle
                      cx={100 - 55 * Math.cos((targetAngle * Math.PI) / 180)}
                      cy={120 - 55 * Math.sin((targetAngle * Math.PI) / 180)}
                      r="5"
                      fill={ruleType === 'Correct' ? '#16A34A' : '#DC2626'}
                    />

                    {/* Text showing current angle calculation */}
                    <text x="100" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">
                      {minAngle || 0}° {maxAngle ? `– ${maxAngle}°` : '+'}
                    </text>
                    <text x="100" y="55" textAnchor="middle" fill="#D5B56A" fontSize="10">
                      Biên độ hiệu chỉnh: ~{targetAngle}°
                    </text>
                  </svg>
                </div>

                {/* Summary Info in Card */}
                <div className="space-y-3 text-xs bg-[#16181C] p-4 rounded-2xl border border-[#252830]">
                  <div className="flex justify-between py-1 border-b border-[#252830]">
                    <span className="text-[#A8AFBB]">Bài tập:</span>
                    <span className="font-bold text-[#F8FAFC]">{exercise}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#252830]">
                    <span className="text-[#A8AFBB]">Chỉ số:</span>
                    <span className="font-bold text-[#F8FAFC]">{metric || 'Chưa đặt'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#252830]">
                    <span className="text-[#A8AFBB]">Nhãn phân loại:</span>
                    <span className="font-bold text-gold">{label || 'Chưa đặt'}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-[#A8AFBB] block mb-1">Câu thoại cảnh báo:</span>
                    <p className="text-[#E2E8F0] italic text-[11px] bg-black/40 p-2.5 rounded-lg border border-[#252830]">
                      "{voice || 'Chưa có câu thoại cảnh báo.'}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
