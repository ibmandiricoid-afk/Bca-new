import React, { useState, useEffect } from 'react';

export interface BcaCard {
  id: string;
  name: string;
  localSrc: string;
  fallbackPng: string;
  remoteSrc: string;
}

export const BCA_CARDS: BcaCard[] = [
  {
    id: 'kki',
    name: 'BCA Kartu Kredit Indonesia',
    localSrc: '/cards/bca-kki.webp',
    fallbackPng: '/cards/bca-kki.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Feature/Banner/Content-Banner/individu/produk/kartu-kredit/20260814-kartu-kredit-indonesia.png',
  },
  {
    id: 'blibli',
    name: 'BCA Blibli Mastercard',
    localSrc: '/cards/bca-blibli.webp',
    fallbackPng: '/cards/bca-blibli.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/blibli-card',
  },
  {
    id: 'tiket',
    name: 'BCA tiket.com Mastercard',
    localSrc: '/cards/bca-tiket.webp',
    fallbackPng: '/cards/bca-tiket.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/tiket-card',
  },
  {
    id: 'smartcash',
    name: 'BCA Smartcash',
    localSrc: '/cards/bca-smartcash.webp',
    fallbackPng: '/cards/bca-smartcash.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Feature/Banner/Content-Banner/Bisnis/BCA-Smartcash.png?v=1',
  },
  {
    id: 'unionpay',
    name: 'BCA UnionPay',
    localSrc: '/cards/bca-unionpay.webp',
    fallbackPng: '/cards/bca-unionpay.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/card-union.png',
  },
  {
    id: 'jcb-black',
    name: 'BCA JCB Black',
    localSrc: '/cards/bca-jcb-black.webp',
    fallbackPng: '/cards/bca-jcb-black.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/20220722-JCB-Black.png',
  },
  {
    id: 'platinum',
    name: 'BCA Visa Platinum',
    localSrc: '/cards/bca-platinum.webp',
    fallbackPng: '/cards/bca-platinum.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/card-platinum.png',
  },
  {
    id: 'everyday',
    name: 'BCA Everyday Card',
    localSrc: '/cards/bca-everyday.webp',
    fallbackPng: '/cards/bca-everyday.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/card-everyday.png',
  },
  {
    id: 'mastercard-platinum',
    name: 'BCA Mastercard Platinum',
    localSrc: '/cards/bca-mastercard-platinum.webp',
    fallbackPng: '/cards/bca-mastercard-platinum.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/20220725-BCA-Mastercard-Platinum-Front.png',
  },
  {
    id: 'mastercard-world',
    name: 'BCA Mastercard World',
    localSrc: '/cards/bca-mastercard-world.webp',
    fallbackPng: '/cards/bca-mastercard-world.png',
    remoteSrc: 'https://www.bca.co.id/-/media/Images/individu/produk/kartu-kredit/welcome-pack/all-in-one/card-world',
  },
];

const CardRotatorComponent: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [fallbackSrcs, setFallbackSrcs] = useState<Record<string, string>>({});

  // Preload only next card image for smooth transition without network congestion
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % BCA_CARDS.length;
    const nextCard = BCA_CARDS[nextIndex];
    if (nextCard) {
      const img = new Image();
      img.src = nextCard.localSrc;
    }
  }, [currentIndex]);

  // Auto-rotation timer: switches card every 3.5s unless hovered or interacted
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BCA_CARDS.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + BCA_CARDS.length) % BCA_CARDS.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % BCA_CARDS.length);
  };

  // Touch swipe handling
  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setIsPaused(false);
  };

  const handleImageError = (cardId: string, fallbackPng: string, remoteSrc: string) => {
    setFallbackSrcs((prev) => {
      const current = prev[cardId];
      if (!current || current === fallbackPng) {
        return { ...prev, [cardId]: remoteSrc };
      }
      return { ...prev, [cardId]: fallbackPng };
    });
  };

  return (
    <div
      className="w-full flex flex-col items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Card Display Container with clean aesthetic & constant aspect ratio */}
      <div className="relative w-full max-w-[260px] sm:max-w-[290px] aspect-[1.58/1] flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,10,35,0.5)]">
        {BCA_CARDS.map((card, index) => {
          const isActive = index === currentIndex;
          const isNear =
            isActive ||
            Math.abs(index - currentIndex) <= 1 ||
            (currentIndex === 0 && index === BCA_CARDS.length - 1) ||
            (currentIndex === BCA_CARDS.length - 1 && index === 0);

          if (!isNear) return null;

          const imgSrc = fallbackSrcs[card.id] || card.localSrc;

          return (
            <div
              key={card.id}
              style={{ transform: 'translate3d(0,0,0)' }}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out will-change-[transform,opacity] ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-95 pointer-events-none z-0'
              }`}
            >
              <picture className="w-full h-full flex items-center justify-center pointer-events-none">
                <source srcSet={card.localSrc} type="image/webp" />
                <source srcSet={card.fallbackPng} type="image/png" />
                <img
                  src={imgSrc}
                  alt={card.name}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(card.id, card.fallbackPng, card.remoteSrc)}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </picture>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CardRotator = React.memo(CardRotatorComponent);
