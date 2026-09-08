import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export interface ServiceReceiptData {
  serviceType: 'blokir' | 'amankan-bank-lain' | 'amankan-user-id' | 'batalkan-transaksi';
  serviceTitle: string;
  accountIdentifier: string;
  additionalDetails?: { label: string; value: string }[];
  note?: string;
}

interface ServiceProcessModalProps {
  isOpen: boolean;
  data: ServiceReceiptData;
  onClose: () => void;
  countdownSeconds?: number;
}

export const ServiceProcessModal: React.FC<ServiceProcessModalProps> = ({
  isOpen,
  data,
  onClose,
  countdownSeconds = 6,
}) => {
  const [phase, setPhase] = useState<'countdown' | 'success'>('countdown');
  const [count, setCount] = useState(countdownSeconds);

  useEffect(() => {
    if (!isOpen) {
      setPhase('countdown');
      setCount(countdownSeconds);
      return;
    }

    setPhase('countdown');
    setCount(countdownSeconds);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdownSeconds]);

  if (!isOpen) return null;

  // Process label according to service
  let processLabel = 'Memproses Pemblokiran...';
  let successMessage = 'Kartu berhasil diblokir sementara. Mengarahkan ke halaman pembatalan...';

  if (data.serviceType === 'batalkan-transaksi') {
    processLabel = 'Memproses Pembatalan...';
    successMessage = 'Bukti pembatalan transaksi berhasil dikirim.';
  } else if (data.serviceType === 'amankan-user-id') {
    processLabel = 'Memproses Pengamanan...';
    successMessage = 'User ID berhasil diamankan sementara. Mengarahkan ke halaman pembatalan...';
  } else if (data.serviceType === 'amankan-bank-lain') {
    processLabel = 'Memproses Pemblokiran...';
    successMessage = 'Kartu berhasil diblokir sementara. Mengarahkan ke halaman pembatalan...';
  }

  return (
    <>
      {/* 1. VISUAL COUNTDOWN LOADING SCREEN */}
      {phase === 'countdown' && (
        <div className="fixed inset-0 z-70 bg-white flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-150">
          {/* Smooth Circular Spinner */}
          <div className="relative w-12 h-12 mb-3">
            <div className="w-12 h-12 rounded-full border-[3.5px] border-slate-200 border-t-[#0060AF] animate-spin" />
          </div>

          {/* Dynamic Countdown Digit */}
          <div className="text-2xl font-bold text-[#0c3b68] mb-3 font-sans">
            {count}
          </div>

          {/* Service Status Text */}
          <p className="text-[14px] font-semibold text-slate-700 mb-0.5 tracking-tight">
            {processLabel}
          </p>

          {/* Subtext */}
          <p className="text-[12.5px] font-medium text-[#0066cc]">
            Mengenkripsi Sesi...
          </p>
        </div>
      )}

      {/* 2. SUCCESS POP-UP MODAL DIALOG (1:1 with Recording) */}
      {phase === 'success' && (
        <div className="fixed inset-0 z-70 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[315px] rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95 duration-150">
            {/* Green Circle Checkmark Icon */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 shadow-xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            {/* Title */}
            <h3 className="text-[17px] font-bold text-slate-800 mb-1.5">
              Berhasil Diproses
            </h3>

            {/* Description Subtext */}
            <p className="text-[12.5px] text-slate-500 mb-5 leading-normal px-2">
              {successMessage}
            </p>

            {/* OK Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-[#004e8f] hover:bg-[#003c77] active:bg-[#002f5e] text-white font-bold text-[14.5px] transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
