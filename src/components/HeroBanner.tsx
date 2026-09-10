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
        background: 'linear-gradient(175deg, #005699 0%, #00427c 45%, #002d59 100%)',
      }}
    >
      {/* 1. Subtle Ambient Spotlight & Depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 85% 12%, rgba(56, 189, 248, 0.16) 0%, transparent 55%),
            radial-gradient(circle at 15% 85%, rgba(14, 165, 233, 0.10) 0%, transparent 50%)
          `,
        }}
      />

      {/* 2. Clean Minimalist Security Watermark Fine Lines Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bca-fintech-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32 L32 0 M0 0 L32 32" stroke="#ffffff" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bca-fintech-grid)" />
        </svg>
      </div>

      {/* 3. Smooth & Minimalist Corporate Swoop Ribbon (Single Clean Arc) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute -right-12 -top-12 w-[120%] h-[70%] opacity-25"
          viewBox="0 0 700 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 80 C 260 40 440 240 750 140"
            stroke="url(#corp-swoop-1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 120 130 C 310 90 480 300 780 190"
            stroke="url(#corp-swoop-2)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="corp-swoop-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="corp-swoop-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
          </defs>
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
