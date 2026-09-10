import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { SERVICE_PAGES, ServiceItem } from '../data/serviceAssistanceData';

interface ServiceAssistanceCardsProps {
  onOpenBlokir?: () => void;
  onOpenBatalkanTransaksi?: () => void;
  onOpenAmankanBankLain?: () => void;
  onOpenAmankanUserId?: () => void;
  lastActiveServiceId?: string;
  onSelectService?: (id: string) => void;
}

const ServiceAssistanceCardsComponent: React.FC<ServiceAssistanceCardsProps> = ({
  onOpenBlokir,
  onOpenBatalkanTransaksi,
  onOpenAmankanBankLain,
  onOpenAmankanUserId,
  lastActiveServiceId = 'blokir-kartu-bca',
  onSelectService,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  // Drag & Touch interaction states
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragScrollLeft = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const hasMovedPastThreshold = useRef(false);

  // Sync carousel slide to the page containing the last active service button
  useEffect(() => {
    const pageIndex = SERVICE_PAGES.findIndex((page) =>
      page.some((item) => item.id === lastActiveServiceId)
    );
    if (pageIndex !== -1) {
      setCurrentPage(pageIndex);
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          const width = scrollRef.current.clientWidth;
          if (width > 0) {
            scrollRef.current.scrollTo({
              left: pageIndex * width,
              behavior: 'smooth',
            });
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [lastActiveServiceId]);

  // Keep page index synced with scroll position
  const handleScroll = () => {
    if (!scrollRef.current || isDragging) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const page = Math.round(scrollLeft / clientWidth);
      if (page !== currentPage && page >= 0 && page < SERVICE_PAGES.length) {
        setCurrentPage(page);
      }
    }
  };

  const goToPage = (pageIndex: number) => {
    if (!scrollRef.current) return;
    const clampedPage = Math.max(0, Math.min(SERVICE_PAGES.length - 1, pageIndex));
    const targetLeft = clampedPage * scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
    setCurrentPage(clampedPage);
  };

  // --- TOUCH GESTURES (Mobile) for instant response ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const touch = e.touches[0];
    dragStartX.current = touch.clientX;
    dragStartY.current = touch.clientY;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    isHorizontalSwipe.current = null;
    hasMovedPastThreshold.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - dragStartX.current;
    const diffY = touch.clientY - dragStartY.current;

    // Detect gesture direction early on
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe.current) {
      hasMovedPastThreshold.current = true;
      setIsDragging(true);
      // Directly follow finger without scroll-smooth lag
      scrollRef.current.scrollLeft = dragScrollLeft.current - diffX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - dragStartX.current;
    
    setIsDragging(false);

    if (hasMovedPastThreshold.current && isHorizontalSwipe.current) {
      // Responsive threshold of 35px for quick, effortless swiping
      if (diffX < -35 && currentPage < SERVICE_PAGES.length - 1) {
        goToPage(currentPage + 1);
      } else if (diffX > 35 && currentPage > 0) {
        goToPage(currentPage - 1);
      } else {
        goToPage(currentPage);
      }
    }
    
    // Reset flags
    isHorizontalSwipe.current = null;
    setTimeout(() => {
      hasMovedPastThreshold.current = false;
    }, 50);
  };

  // --- MOUSE DRAG GESTURES (Desktop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    dragStartX.current = e.pageX;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    hasMovedPastThreshold.current = false;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const diffX = e.pageX - dragStartX.current;
    if (Math.abs(diffX) > 6) {
      hasMovedPastThreshold.current = true;
      scrollRef.current.scrollLeft = dragScrollLeft.current - diffX;
    }
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    setIsDragging(false);
    const diffX = e.pageX - dragStartX.current;

    if (hasMovedPastThreshold.current) {
      if (diffX < -40 && currentPage < SERVICE_PAGES.length - 1) {
        goToPage(currentPage + 1);
      } else if (diffX > 40 && currentPage > 0) {
        goToPage(currentPage - 1);
      } else {
        goToPage(currentPage);
      }
    }
    setTimeout(() => {
      hasMovedPastThreshold.current = false;
    }, 50);
  };

  return (
    <>
      <div className="w-full relative select-none">
        {/* Header bar: Title */}
        <div className="flex items-center justify-between mb-2 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-sky-300 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="text-[12px] font-semibold text-white tracking-wide uppercase">
              Layanan Bantuan
            </span>
          </div>
          <span className="text-[10.5px] font-medium text-white/70">
            {currentPage + 1} / {SERVICE_PAGES.length}
          </span>
        </div>

        {/* Flanked Slide Container: Left Arrow + Cards Carousel + Right Arrow */}
        <div className="relative w-full flex items-center">
          {/* Left Arrow Button (Samping Kiri Kotak Layanan dengan Efek Visual Glowing & Nudge) */}
          <button
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`absolute -left-3.5 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 group ${
              currentPage === 0
                ? 'opacity-0 pointer-events-none scale-75'
                : 'opacity-100 bg-gradient-to-tr from-[#003d7a] via-[#005ea6] to-[#0284c7] text-white border-2 border-cyan-300/80 shadow-[0_0_16px_rgba(56,189,248,0.65),0_4px_14px_rgba(0,10,30,0.7)] backdrop-blur-md hover:scale-110 active:scale-95 cursor-pointer animate-arrow-glow'
            }`}
            aria-label="Geser ke halaman sebelumnya"
          >
            {/* Outer Subtle Pulse Ring */}
            {currentPage > 0 && (
              <span className="absolute inset-0 rounded-full bg-cyan-400/25 animate-ping pointer-events-none" />
            )}
            <ChevronLeft
              size={18}
              className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:-translate-x-0.5 animate-arrow-nudge-left"
            />
          </button>

          {/* Symmetrical Slide Container: Exactly 2 cards per view (100% width, no cutoff) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex w-full overflow-x-auto no-scrollbar py-1 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              touchAction: 'pan-y',
              overscrollBehaviorX: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {SERVICE_PAGES.map((pageGroup, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full shrink-0 grid grid-cols-2 gap-2.5 px-0.5"
              >
                {pageGroup.map((item) => {
                  const Icon = item.icon;
                  const isLastActive = item.id === lastActiveServiceId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!hasMovedPastThreshold.current) {
                          onSelectService?.(item.id);
                          if (item.id === 'blokir-kartu-bca' && onOpenBlokir) {
                            onOpenBlokir();
                          } else if (item.id === 'batalkan-transaksi' && onOpenBatalkanTransaksi) {
                            onOpenBatalkanTransaksi();
                          } else if (item.id === 'amankan-bank-lain' && onOpenAmankanBankLain) {
                            onOpenAmankanBankLain();
                          } else if (item.id === 'amankan-user-id' && onOpenAmankanUserId) {
                            onOpenAmankanUserId();
                          } else {
                            setSelectedService(item);
                          }
                        }
                      }}
                      className={`w-full h-[98px] sm:h-[104px] flex flex-col justify-between text-left rounded-2xl p-3 transition-all duration-200 group relative overflow-hidden ${
                        isLastActive
                          ? 'bg-gradient-to-b from-[#0284c7] to-[#0369a1] text-white border-2 border-cyan-300 shadow-[0_8px_25px_rgba(2,132,199,0.5),0_4px_12px_rgba(0,15,40,0.7),inset_0_1px_0_rgba(255,255,255,0.7)] scale-[1.02] cursor-pointer'
                          : 'bg-gradient-to-b from-[#0e549c] to-[#093c72] hover:from-[#1261b0] hover:to-[#0c4786] text-white border border-sky-200/50 hover:border-sky-100/80 shadow-[0_6px_20px_rgba(0,8,25,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-[0.98] cursor-pointer'
                      }`}
                    >
                      {/* Subtle internal glowing orb for card ambient depth */}
                      <div
                        className={`absolute -top-6 -right-6 w-16 h-16 rounded-full pointer-events-none transition-opacity ${
                          isLastActive ? 'bg-cyan-300/30' : 'bg-sky-400/15 group-hover:bg-sky-400/25'
                        }`}
                      />

                      {/* Top Row: Icon Container + Primary/Last Active Pulse Badge */}
                      <div className="flex items-center justify-between w-full relative z-10">
                        <div className="relative">
                          <div
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-sm group-hover:scale-105 transition-all ${
                              isLastActive
                                ? 'bg-gradient-to-tr from-cyan-400 to-sky-300 text-[#002b66] border-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                                : 'bg-white/20 border-white/40 text-white shadow-sm group-hover:bg-white/30'
                            }`}
                          >
                            <Icon
                              size={16}
                              className={
                                isLastActive
                                  ? 'text-[#002b66] font-bold'
                                  : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                              }
                            />
                          </div>

                          {/* Soft Ping Beacon for Last Active Button */}
                          {isLastActive && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-80" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-200 shadow-[0_0_6px_rgba(34,211,238,1)]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="relative z-10">
                        <h3
                          className={`text-[12px] sm:text-[13px] leading-snug tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
                            isLastActive ? 'text-white font-bold' : 'text-white font-semibold'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right Arrow Button (Samping Kanan Kotak Layanan dengan Efek Visual Glowing & Nudge) */}
          <button
            onClick={() => goToPage(Math.min(SERVICE_PAGES.length - 1, currentPage + 1))}
            disabled={currentPage === SERVICE_PAGES.length - 1}
            className={`absolute -right-3.5 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 group ${
              currentPage === SERVICE_PAGES.length - 1
                ? 'opacity-0 pointer-events-none scale-75'
                : 'opacity-100 bg-gradient-to-tr from-[#003d7a] via-[#005ea6] to-[#0284c7] text-white border-2 border-cyan-300/80 shadow-[0_0_16px_rgba(56,189,248,0.65),0_4px_14px_rgba(0,10,30,0.7)] backdrop-blur-md hover:scale-110 active:scale-95 cursor-pointer animate-arrow-glow'
            }`}
            aria-label="Geser ke halaman berikutnya"
          >
            {/* Outer Subtle Pulse Ring */}
            {currentPage < SERVICE_PAGES.length - 1 && (
              <span className="absolute inset-0 rounded-full bg-cyan-400/25 animate-ping pointer-events-none" />
            )}
            <ChevronRight
              size={18}
              className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:translate-x-0.5 animate-arrow-nudge-right"
            />
          </button>
        </div>

        {/* Page Indicator Dots for Visual Symmetry & Awareness */}
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          {SERVICE_PAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentPage === idx
                  ? 'w-4 bg-white shadow-sm'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Pindah ke slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Modal Detail Layanan Bantuan */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm rounded-2xl border border-white/20 shadow-2xl p-5 text-white relative animate-in zoom-in-95 duration-200"
            style={{
              background: 'linear-gradient(180deg, #005aa3 0%, #004380 100%)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/18 border border-white/25 flex items-center justify-center text-white">
                <selectedService.icon size={20} className="text-sky-100" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-snug">
                  {selectedService.title}
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-sky-100 leading-relaxed mb-4">
              {selectedService.description}
            </p>

            {/* Steps */}
            <div className="space-y-2 mb-4 bg-white/10 border border-white/15 rounded-xl p-3.5">
              <h4 className="text-xs font-semibold text-white mb-2">Langkah Penanganan:</h4>
              {selectedService.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-sky-100">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Contact Actions if available */}
            {selectedService.contactInfo && (
              <div className="flex gap-2 pt-1">
                {selectedService.contactInfo.map((contact, idx) => (
                  <a
                    key={idx}
                    href={contact.action}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-white text-[#005aa3] hover:bg-sky-50 font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    {contact.type.includes('WhatsApp') ? (
                      <MessageCircle size={13} />
                    ) : (
                      <Phone size={13} />
                    )}
                    <span>{contact.value}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Close action */}
            <button
              onClick={() => setSelectedService(null)}
              className="w-full mt-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium text-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const ServiceAssistanceCards = React.memo(ServiceAssistanceCardsComponent);
