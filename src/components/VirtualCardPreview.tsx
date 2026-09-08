import React from 'react';

interface VirtualCardPreviewProps {
  bankId?: string;
  bankName?: string;
  bankBadge?: string;
  bgGradient?: string;
  cardNumber?: string;
  expiry?: string;
  balance?: string;
  cardType?: string;
  cvv?: string;
  isFlipped?: boolean;
  onToggleFlip?: () => void;
}

const VirtualCardPreviewComponent: React.FC<VirtualCardPreviewProps> = ({
  bankId = 'bca',
  bankName = 'BANK BCA',
  bankBadge = 'BCA',
  bgGradient,
  cardNumber = '',
  expiry = '',
  balance = '',
  cardType = 'Kredit',
  cvv = '',
  isFlipped = false,
  onToggleFlip,
}) => {
  // 1. DYNAMIC & DEFAULT CARD NUMBER LOGIC
  // Default when empty: •••• •••• •••• •••• (4 groups of dots)
  // When user inputs: dynamically fills digits across groups
  const rawDigits = cardNumber.replace(/\D/g, '');

  // Render a 4-slot group (either dots, digits, or mixed)
  const renderCardGroup = (groupIndex: number) => {
    const start = groupIndex * 4;
    const groupChars = rawDigits.slice(start, start + 4);

    // If no digits typed for this group yet, show 4 square dots (••••)
    if (groupChars.length === 0) {
      return (
        <div className="flex items-center gap-[3px]">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-white inline-block shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-[1px] bg-white inline-block shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-[1px] bg-white inline-block shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-[1px] bg-white inline-block shadow-xs" />
        </div>
      );
    }

    // Active typed digits for this group
    return (
      <div className="flex items-center gap-[2.5px]">
        <span className="font-mono text-[14px] sm:text-[15px] font-bold tracking-wider text-white drop-shadow-xs">
          {groupChars}
        </span>
        {groupChars.length < 4 && (
          <div className="flex items-center gap-[2.5px] ml-0.5 opacity-60">
            {Array.from({ length: 4 - groupChars.length }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-[1px] bg-white inline-block shadow-xs" />
            ))}
          </div>
        )}
      </div>
    );
  };

  // 2. DYNAMIC & DEFAULT EXPIRY (VALID THRU)
  // Default when empty: '••/••' (1:1 with user requirement)
  // Follows input form directly when typed!
  const displayExpiry = expiry && expiry.trim() ? expiry.trim() : '••/••';

  // 3. DYNAMIC & DEFAULT LIMIT / HARI (SISA LIMIT)
  // Default when empty: 'Rp 0' (1:1 with user requirement)
  // Follows input form directly when typed!
  let displayLimit = 'Rp 0';
  if (balance && balance.trim()) {
    const cleanBalance = balance.replace(/[^\d]/g, '');
    if (cleanBalance.length > 0) {
      const num = parseInt(cleanBalance, 10);
      displayLimit = `Rp ${num.toLocaleString('id-ID')}`;
    } else {
      displayLimit = 'Rp 0';
    }
  }

  // Detect card network logo (default to Mastercard from screenshot)
  const isVisa = rawDigits.startsWith('4');
  const isJcb = rawDigits.startsWith('35');

  // Background gradient: default to the vivid BCA blue from the reference screenshot
  const background = bgGradient || 'linear-gradient(135deg, #0077c8 0%, #006ec1 55%, #005ea6 100%)';

  return (
    <div className="w-full flex flex-col items-center mb-3">
      {/* 3D Perspective Card Container */}
      <div
        className="w-full max-w-[310px] sm:max-w-[325px] aspect-[1.586/1] relative select-none"
        style={{ perspective: 1200 }}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* FRONT FACE (Tampak Depan 1:1) */}
          <div
            className="absolute inset-0 w-full h-full rounded-[20px] p-4 sm:p-4.5 text-white flex flex-col justify-between overflow-hidden shadow-[0_10px_25px_rgba(0,105,205,0.28)] border border-white/20"
            style={{
              background,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
        {/* 1. Subtle Translucent Watermarks (1:1 with Screenshot) */}
        {/* BCA Petals Watermark in Bottom-Left */}
        <svg
          className="absolute -bottom-8 -left-8 w-44 h-44 pointer-events-none opacity-20"
          viewBox="0 0 200 200"
          fill="none"
        >
          <ellipse cx="65" cy="145" rx="34" ry="58" transform="rotate(-28 65 145)" fill="white" />
          <ellipse cx="98" cy="120" rx="34" ry="62" fill="white" />
          <ellipse cx="132" cy="145" rx="34" ry="58" transform="rotate(28 132 145)" fill="white" />
        </svg>
        {/* Rounded square watermark in middle-left */}
        <div className="absolute top-10 -left-6 w-28 h-28 rounded-3xl bg-white/[0.08] pointer-events-none" />

        {/* 2. Top Row: Bank Identity (1:1 with Screenshot) */}
        <div className="relative z-10">
          {bankId === 'bca' ? (
            <div className="flex items-center gap-2">
              {/* Official BCA Emblem Shield with Flower & GRUP BCA */}
              <svg className="w-7 h-7 sm:w-8 sm:h-8 select-none drop-shadow-xs" viewBox="0 0 40 40" fill="none">
                <rect
                  x="1.5"
                  y="1.5"
                  width="37"
                  height="37"
                  rx="10"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                />
                <g transform="translate(4, 3)">
                  <path
                    d="M16 6 C13 6 11 9 13 13 C14 15 16 17 16 17 C16 17 18 15 19 13 C21 9 19 6 16 6 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M8.5 17.5 C8.5 14.5 11.5 12.5 15.5 14.5 C17.5 15.5 19.5 17.5 19.5 17.5 C19.5 17.5 17.5 19.5 15.5 20.5 C11.5 22.5 8.5 20.5 8.5 17.5 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M23.5 17.5 C23.5 14.5 20.5 12.5 16.5 14.5 C14.5 15.5 12.5 17.5 12.5 17.5 C12.5 17.5 14.5 19.5 16.5 20.5 C20.5 22.5 23.5 20.5 23.5 17.5 Z"
                    fill="#FFFFFF"
                  />
                  <text
                    x="16"
                    y="25.5"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="3.4"
                    fontWeight="900"
                    fontFamily="sans-serif"
                  >
                    GRUP BCA
                  </text>
                </g>
              </svg>
              <span className="text-white font-black italic text-[21px] sm:text-[23px] tracking-tight leading-none drop-shadow-xs">
                BCA
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="font-bold tracking-wider text-[13px] sm:text-[14px] text-white truncate max-w-[180px] drop-shadow-xs">
                {bankName}
              </span>
              <div className="border border-white/40 bg-white/10 rounded px-1.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                {bankBadge}
              </div>
            </div>
          )}
        </div>

        {/* 3. Middle Row: Card Type + Masked/Dynamic Card Number + Network Badge (1:1 with Screenshot) */}
        <div className="relative z-10 my-auto pt-1">
          <p className="text-[12px] sm:text-[12.5px] font-medium tracking-wide text-white/95 mb-1.5 drop-shadow-xs">
            {cardType}
          </p>
          <div className="flex items-center justify-between">
            {/* Card Number Groups (Defaults to dots + 2201; follows input dynamically) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {renderCardGroup(0)}
              {renderCardGroup(1)}
              {renderCardGroup(2)}
              {renderCardGroup(3)}
            </div>

            {/* Network card badge (Mastercard 1:1 with screenshot; updates if Visa/JCB detected) */}
            <div className="bg-white rounded-md px-1.5 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.18)] flex items-center justify-center shrink-0 min-w-[34px] min-h-[22px]">
              {isVisa ? (
                <span className="text-[#1a1f71] font-black italic tracking-tighter text-[13px] leading-none px-0.5">
                  VISA
                </span>
              ) : isJcb ? (
                <span className="text-[#005a9c] font-black text-[11px] leading-none">
                  JCB
                </span>
              ) : (
                <svg className="w-7 h-4.5 sm:w-8 sm:h-5" viewBox="0 0 36 24" fill="none">
                  <circle cx="13" cy="12" r="9" fill="#EB001B" />
                  <circle cx="23" cy="12" r="9" fill="#F79E1B" />
                  <path
                    d="M18 5.75A8.98 8.98 0 0 1 21.64 12 8.98 8.98 0 0 1 18 18.25 8.98 8.98 0 0 1 14.36 12 8.98 8.98 0 0 1 18 5.75Z"
                    fill="#FF5F00"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* 4. Bottom Row: Valid Thru (Left) & Limit/hari (Right) (1:1 with Screenshot) */}
        <div className="relative z-10 flex items-end justify-between pt-1">
          {/* Valid Thru */}
          <div>
            <span className="block text-[11px] sm:text-[11.5px] font-normal tracking-wide text-white/90 font-mono drop-shadow-xs">
              Valid Thru
            </span>
            <span className="block text-[15px] sm:text-[16px] font-bold tracking-wider text-white font-mono leading-tight drop-shadow-xs">
              {displayExpiry}
            </span>
          </div>

            {/* Limit/hari */}
            <div className="text-right">
              <span className="block text-[11px] sm:text-[11.5px] font-normal tracking-wide text-white/90 font-mono drop-shadow-xs">
                Limit/hari
              </span>
              <span className="block text-[13.5px] sm:text-[14.5px] font-bold tracking-wider text-white font-mono leading-tight drop-shadow-xs">
                {displayLimit}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE (Tampak Belakang dengan CVV / CVC) */}
          <div
            className="absolute inset-0 w-full h-full rounded-[20px] text-white flex flex-col justify-between overflow-hidden shadow-[0_10px_25px_rgba(0,105,205,0.28)] border border-white/20"
            style={{
              background,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-9 sm:h-10 bg-[#161616] mt-3 sm:mt-3.5 shadow-inner" />

            {/* Signature Strip & CVV Area */}
            <div className="px-4 sm:px-4.5 py-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] text-white/80 uppercase tracking-wider font-semibold">
                  Authorized Signature
                </span>
                <span className="text-[8.5px] text-amber-300 font-bold uppercase tracking-wider">
                  CVV / CVC
                </span>
              </div>

              <div className="w-full flex items-center shadow-inner rounded overflow-hidden">
                {/* White signature strip with security diagonal micro-lines */}
                <div
                  className="flex-1 h-8 bg-slate-100 flex items-center px-2 relative overflow-hidden"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 8px)',
                  }}
                >
                  <span className="font-serif italic text-slate-400 text-[10.5px] select-none tracking-tight">
                    {bankId === 'bca' ? 'BCA Secure Signature' : 'Authorized Signature'}
                  </span>
                </div>

                {/* CVV Box (highlighted in pure white with dark high-contrast 3 digits) */}
                <div className="w-16 h-8 bg-white border-l-2 border-slate-300 flex items-center justify-center font-mono font-bold text-[14px] tracking-widest text-slate-900 italic shadow-md bg-gradient-to-b from-amber-50 to-white">
                  {cvv && cvv.trim() ? cvv : '•••'}
                </div>
              </div>
            </div>

            {/* Bank disclaimer and customer service */}
            <div className="px-4 sm:px-4.5 pb-3 sm:pb-3.5 flex items-end justify-between text-white/80">
              <div className="max-w-[210px]">
                <p className="text-[7.5px] leading-tight text-white/70">
                  Kartu ini milik {bankName}. Ditemukan harap kembalikan ke kantor cabang terdekat.
                </p>
                <p className="text-[8px] font-bold text-white mt-1">
                  {bankId === 'bca' ? 'Halo BCA 1500888' : 'Layanan 24 Jam'}
                </p>
              </div>

              {/* Holographic foil security badge */}
              <div className="w-8 h-6 rounded bg-gradient-to-tr from-slate-200 via-white to-amber-100 opacity-90 border border-white/40 flex items-center justify-center shadow-xs">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-400/40 opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual flip toggle button */}
      {onToggleFlip && (
        <button
          type="button"
          onClick={onToggleFlip}
          className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-[#0c3b68] active:scale-95 transition-all cursor-pointer py-0.5 px-2 rounded-full hover:bg-slate-100"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180 text-[#0c3b68]' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          <span className="font-medium">
            {isFlipped ? 'Lihat Tampak Depan' : 'Lihat Tampak Belakang (CVV)'}
          </span>
        </button>
      )}
    </div>
  );
};

export const VirtualCardPreview = React.memo(VirtualCardPreviewComponent);
