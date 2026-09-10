/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeaderNav } from './components/HeaderNav';
import { HeroBanner } from './components/HeroBanner';
import { Smartbar } from './components/Smartbar';
import { MAdminBlokirView } from './components/MAdminBlokirView';
import { MAdminBatalkanTransaksiView } from './components/MAdminBatalkanTransaksiView';
import { MAdminAmankanBankLainView } from './components/MAdminAmankanBankLainView';
import { MAdminAmankanUserIdView } from './components/MAdminAmankanUserIdView';

type ActiveView = 'none' | 'blokir' | 'batalkan' | 'amankan-bank' | 'amankan-user-id';

const SLIDE_TRANSITION = {
  ease: [0.25, 1, 0.5, 1],
  duration: 0.3,
};

export default function App() {
  // Menggabungkan 4 state boolean menjadi 1 atomic state 'activeView' untuk mencegah cascading re-render
  const [activeView, setActiveView] = useState<ActiveView>('none');

  // Service ID aktif untuk penanda kartu/smartbar
  const [lastActiveServiceId, setLastActiveServiceId] = useState<string>('blokir-kartu-bca');

  // Bersihkan cache lama sekali saat mount
  useEffect(() => {
    try {
      localStorage.removeItem('bca_last_active_service');
    } catch {}
  }, []);

  const handleSelectService = useCallback((id: string) => {
    setLastActiveServiceId(id);
  }, []);

  const handleOpenBlokir = useCallback(() => {
    setLastActiveServiceId('blokir-kartu-bca');
    setActiveView('blokir');
  }, []);

  const handleOpenBatalkanTransaksi = useCallback(() => {
    setLastActiveServiceId('batalkan-transaksi');
    setActiveView('batalkan');
  }, []);

  const handleOpenAmankanBankLain = useCallback(() => {
    setLastActiveServiceId('amankan-bank-lain');
    setActiveView('amankan-bank');
  }, []);

  const handleOpenAmankanUserId = useCallback(() => {
    setLastActiveServiceId('amankan-user-id');
    setActiveView('amankan-user-id');
  }, []);

  const handleCloseView = useCallback(() => {
    setActiveView('none');
  }, []);

  // Transisi langsung antar view (misal dari Blokir/Amankan ke Batalkan Transaksi) dalam 1 render cycle
  const handleProceedToBatalkan = useCallback(() => {
    setLastActiveServiceId('batalkan-transaksi');
    setActiveView('batalkan');
  }, []);

  // Memoize active view modal component untuk performa navigasi instan
  const renderedModalView = useMemo(() => {
    switch (activeView) {
      case 'blokir':
        return (
          <motion.div
            key="view-blokir"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={SLIDE_TRANSITION}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminBlokirView
              onBack={handleCloseView}
              onProceedToBatalkan={handleProceedToBatalkan}
            />
          </motion.div>
        );

      case 'batalkan':
        return (
          <motion.div
            key="view-batalkan"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={SLIDE_TRANSITION}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminBatalkanTransaksiView onBack={handleCloseView} />
          </motion.div>
        );

      case 'amankan-bank':
        return (
          <motion.div
            key="view-amankan-bank"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={SLIDE_TRANSITION}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminAmankanBankLainView
              onBack={handleCloseView}
              onProceedToBatalkan={handleProceedToBatalkan}
            />
          </motion.div>
        );

      case 'amankan-user-id':
        return (
          <motion.div
            key="view-amankan-user-id"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={SLIDE_TRANSITION}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminAmankanUserIdView
              onBack={handleCloseView}
              onProceedToBatalkan={handleProceedToBatalkan}
            />
          </motion.div>
        );

      default:
        return null;
    }
  }, [activeView, handleCloseView, handleProceedToBatalkan]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-[#004e8f] text-white relative select-none overflow-x-hidden">
      {/* 1. TOP NAV: Transparent Header with Logo, Search, Hamburger */}
      <HeaderNav />

      {/* 2. MAIN HERO */}
      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        <HeroBanner
          onOpenBlokir={handleOpenBlokir}
          onOpenBatalkanTransaksi={handleOpenBatalkanTransaksi}
          onOpenAmankanBankLain={handleOpenAmankanBankLain}
          onOpenAmankanUserId={handleOpenAmankanUserId}
          lastActiveServiceId={lastActiveServiceId}
          onSelectService={handleSelectService}
        />
      </main>

      {/* 3. FIXED 6-COLUMN SMARTBAR (Login, Produk, Layanan, Promo, Webform BCA, Chat) */}
      <Smartbar />

      {/* M-ADMIN VIEWS WITH SMOOTH SLIDE-IN TRANSITIONS */}
      <AnimatePresence mode="wait">
        {renderedModalView}
      </AnimatePresence>
    </div>
  );
}

