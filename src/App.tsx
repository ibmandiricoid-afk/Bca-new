/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeaderNav } from './components/HeaderNav';
import { HeroBanner } from './components/HeroBanner';
import { Smartbar } from './components/Smartbar';
import { MAdminBlokirView } from './components/MAdminBlokirView';
import { MAdminBatalkanTransaksiView } from './components/MAdminBatalkanTransaksiView';
import { MAdminAmankanBankLainView } from './components/MAdminAmankanBankLainView';
import { MAdminAmankanUserIdView } from './components/MAdminAmankanUserIdView';

export default function App() {
  const [isBlokirViewOpen, setIsBlokirViewOpen] = useState(false);
  const [isBatalkanViewOpen, setIsBatalkanViewOpen] = useState(false);
  const [isAmankanBankLainOpen, setIsAmankanBankLainOpen] = useState(false);
  const [isAmankanUserIdOpen, setIsAmankanUserIdOpen] = useState(false);

  // Selalu jadikan 'blokir-kartu-bca' sebagai tanda aktif default saat pertama kali aplikasi dibuka
  const [lastActiveServiceId, setLastActiveServiceId] = useState<string>('blokir-kartu-bca');

  // Bersihkan cache localStorage sebelumnya agar tidak tertinggal di 'amankan-user-id'
  useEffect(() => {
    try {
      localStorage.removeItem('bca_last_active_service');
    } catch {}
  }, []);

  const handleSelectService = useCallback((id: string) => {
    setLastActiveServiceId(id);
  }, []);

  const handleOpenBlokir = useCallback(() => {
    handleSelectService('blokir-kartu-bca');
    setIsBlokirViewOpen(true);
  }, [handleSelectService]);

  const handleOpenBatalkanTransaksi = useCallback(() => {
    handleSelectService('batalkan-transaksi');
    setIsBatalkanViewOpen(true);
  }, [handleSelectService]);

  const handleOpenAmankanBankLain = useCallback(() => {
    handleSelectService('amankan-bank-lain');
    setIsAmankanBankLainOpen(true);
  }, [handleSelectService]);

  const handleOpenAmankanUserId = useCallback(() => {
    handleSelectService('amankan-user-id');
    setIsAmankanUserIdOpen(true);
  }, [handleSelectService]);

  const handleCloseBlokir = useCallback(() => setIsBlokirViewOpen(false), []);
  const handleCloseBatalkan = useCallback(() => setIsBatalkanViewOpen(false), []);
  const handleCloseAmankanBank = useCallback(() => setIsAmankanBankLainOpen(false), []);
  const handleCloseAmankanUserId = useCallback(() => setIsAmankanUserIdOpen(false), []);

  const slideTransition = {
    ease: [0.25, 1, 0.5, 1],
    duration: 0.32,
  };

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
      <AnimatePresence>
        {/* 4. 1:1 M-ADMIN BLOKIR KARTU VIEW */}
        {isBlokirViewOpen && (
          <motion.div
            key="view-blokir"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={slideTransition}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminBlokirView
              onBack={handleCloseBlokir}
              onProceedToBatalkan={() => {
                handleSelectService('batalkan-transaksi');
                setIsBlokirViewOpen(false);
                setIsBatalkanViewOpen(true);
              }}
            />
          </motion.div>
        )}

        {/* 5. 1:1 M-ADMIN BATALKAN TRANSAKSI VIEW */}
        {isBatalkanViewOpen && (
          <motion.div
            key="view-batalkan"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={slideTransition}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminBatalkanTransaksiView onBack={handleCloseBatalkan} />
          </motion.div>
        )}

        {/* 6. 1:1 M-ADMIN AMANKAN BANK LAIN VIEW */}
        {isAmankanBankLainOpen && (
          <motion.div
            key="view-amankan-bank"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={slideTransition}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminAmankanBankLainView
              onBack={handleCloseAmankanBank}
              onProceedToBatalkan={() => {
                handleSelectService('batalkan-transaksi');
                setIsAmankanBankLainOpen(false);
                setIsBatalkanViewOpen(true);
              }}
            />
          </motion.div>
        )}

        {/* 7. 1:1 M-ADMIN AMANKAN USER ID VIEW */}
        {isAmankanUserIdOpen && (
          <motion.div
            key="view-amankan-user-id"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={slideTransition}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <MAdminAmankanUserIdView
              onBack={handleCloseAmankanUserId}
              onProceedToBatalkan={() => {
                handleSelectService('batalkan-transaksi');
                setIsAmankanUserIdOpen(false);
                setIsBatalkanViewOpen(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
