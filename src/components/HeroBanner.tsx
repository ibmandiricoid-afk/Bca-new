import React, { useState, useEffect } from 'react';
import { ServiceAssistanceCards } from './ServiceAssistanceCards';
import { CardRotator } from './CardRotator';

const RepeatingTypewriterTitle: React.FC = () => {
  const fullText = 'BCA Kartu Kredit\nIndonesia';
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let current = 0;

    const typeNextChar = () => {
      if (current < fullText.length) {
        current += 1;
        setCharCount(current);
        timer = setTimeout(typeNextChar, 75);
      } else {
        // Teks sudah lengkap, diamkan selama 3.2 detik agar terbaca jelas
        timer = setTimeout(() => {
          // Reset langsung ke 0 tanpa efek menghapus mundur
          current = 0;
          setCharCount(0);
          // Jeda sebentar 400ms sebelum mulai mengetik lagi dari awal
          timer = setTimeout(typeNextChar, 400);
        }, 3200);
      }
    };

    timer = setTimeout(typeNextChar, 300);

    return () => clearTimeout(timer);
  }, []);

  const text = fullText.slice(0, charCount);
  const parts = text.split('\n');
  const line1 = parts[0] || '';
  const line2 = parts[1] || '';

  return (
    <h1
      className="text-[32px] sm:text-[36px] font-light text-white leading-[1.2] tracking-normal min-h-[78px] sm:min-h-[86px]"
      style={{ fontFamily: "'BCA Sans', 'Open Sans', sans-serif", fontWeight: 300 }}
    >
      <span className="block">{line1 || '\u00A0'}</span>
      <span className="block">{line2 || '\u00A0'}</span>
    </h1>
  );
};

interface HeroBannerProps {
  onOpenBlokir?: () => void;
  onOpenBatalkanTransaksi?: () => void;
  onOpenAmankanBankLain?: () => void;
  onOpenAmankanUserId?: () => void;
  lastActiveServiceId?: string;
  onSelectService?: (id: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenBlokir,
  onOpenBatalkanTransaksi,
  onOpenAmankanBankLain,
  onOpenAmankanUserId,
  lastActiveServiceId,
  onSelectService,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between px-6 pt-16 pb-16 text-white overflow-hidden"
      style={{
        background: 'linear-gradient(175deg, #00569e 0%, #004587 30%, #00346c 65%, #00214a 100%)',
      }}
    >
      {/* 1. Ambient Lighting & Glow Orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 85% 15%, rgba(0, 180, 255, 0.38) 0%, transparent 48%),
            radial-gradient(circle at 15% 70%, rgba(0, 102, 230, 0.32) 0%, transparent 52%),
            radial-gradient(circle at 50% 45%, rgba(0, 225, 255, 0.12) 0%, transparent 55%)
          `,
        }}
      />

      {/* 2. Micro Dot Grid / Security Watermark Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.14]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bca-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bca-dot-grid)" />
        </svg>
      </div>

      {/* 3. Dynamic Curved Wave Ribbons (BCA Signature Banking Waves) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute -right-20 -top-10 w-[140%] h-[80%] opacity-40 sm:opacity-50"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50,180 C200,80 350,320 650,160 C780,100 880,190 920,240"
            stroke="url(#wave-grad-1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-80,240 C160,140 380,380 690,210 C800,150 900,260 950,300"
            stroke="url(#wave-grad-2)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M-20,120 C240,40 320,260 620,120 C740,60 840,140 880,180"
            stroke="url(#wave-grad-1)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d="M-100,320 C120,220 340,460 660,290 C780,220 890,320 940,360"
            stroke="url(#wave-grad-2)"
            strokeWidth="1.2"
          />
          {/* Subtle glowing curved band fill */}
          <path
            d="M-50,180 C200,80 350,320 650,160 C780,100 880,190 920,240 L920,290 C880,240 780,150 650,210 C350,370 200,130 -50,230 Z"
            fill="url(#ribbon-fill)"
            opacity="0.35"
          />

          <defs>
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2997ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#00b4d8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0077b6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ribbon-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#0077b6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#003c77" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Lower Wave Flow (behind cards section) */}
        <svg
          className="absolute -left-20 bottom-10 w-[140%] h-[50%] opacity-30"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-40,280 C200,180 420,340 700,220 C820,170 900,240 960,270"
            stroke="url(#wave-grad-1)"
            strokeWidth="2"
          />
          <path
            d="M-20,330 C220,240 400,390 680,270 C800,220 880,290 940,320"
            stroke="url(#wave-grad-2)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="max-w-md mx-auto w-full relative z-10 flex-1 flex flex-col justify-between pt-2 sm:pt-3 pb-3 sm:pb-4">
        {/* Main Headline */}
        <div className="text-left pt-1 sm:pt-2">
          <RepeatingTypewriterTitle />
        </div>

        {/* Kotak Layanan Diturunkan & Didekatkan dengan Kartu Virtual */}
        <div className="w-full flex flex-col items-center mt-auto gap-2.5 sm:gap-3 pb-1 sm:pb-2">
          {/* Kotak Layanan Utama / Bantuan */}
          <div className="w-full">
            <ServiceAssistanceCards
              onOpenBlokir={onOpenBlokir}
              onOpenBatalkanTransaksi={onOpenBatalkanTransaksi}
              onOpenAmankanBankLain={onOpenAmankanBankLain}
              onOpenAmankanUserId={onOpenAmankanUserId}
              lastActiveServiceId={lastActiveServiceId}
              onSelectService={onSelectService}
            />
          </div>

          {/* Kartu Virtual BCA (Rotating Carousel) */}
          <div className="w-full flex justify-center items-center">
            <CardRotator />
          </div>
        </div>
      </div>
    </section>
  );
};
