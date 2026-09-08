import React from 'react';

interface BcaLogoProps {
  className?: string;
  variant?: 'white' | 'blue';
  withTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BcaLogo: React.FC<BcaLogoProps> = ({
  className = '',
  variant = 'white',
}) => {
  const isWhite = variant === 'white';

  if (isWhite) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/logo-bca-white.svg"
          alt="BCA - Senantiasa di Sisi Anda"
          className="h-10 sm:h-11 w-auto object-contain"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2">
        <svg
          className="w-8 h-8"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1.5"
            y="1.5"
            width="37"
            height="37"
            rx="10"
            fill="#0060AF"
            stroke="#0060AF"
            strokeWidth="2.5"
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
              fontSize="3.2"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              GRUP BCA
            </text>
          </g>
        </svg>

        <span
          className="font-black text-2xl tracking-tight text-[#0060AF]"
          style={{ fontFamily: "'Open Sans', Arial, sans-serif" }}
        >
          BCA
        </span>
      </div>
      <span className="text-[9.5px] font-medium tracking-tight mt-0.5 leading-none text-[#0060AF]">
        Senantiasa di Sisi Anda
      </span>
    </div>
  );
};
