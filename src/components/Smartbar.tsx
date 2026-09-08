import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Clock,
  Send,
  ChevronRight,
  FileText,
} from 'lucide-react';
import {
  SMARTBAR_PRODUCTS,
  SMARTBAR_SERVICES,
  SMARTBAR_PROMOS,
} from '../data/smartbarData';

const SmartbarComponent: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'bot' | 'user'; text: string; time: string }>
  >([
    {
      sender: 'bot',
      text: 'Halo! Saya VIRA, asisten virtual BCA. Ada yang bisa VIRA bantu mengenai BCA Kartu Kredit Indonesia atau layanan lainnya?',
      time: '09:00',
    },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsg = userInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: newMsg, time: now }]);
    setUserInput('');

    setTimeout(() => {
      let botReply =
        'Terima kasih atas pertanyaannya. BCA Kartu Kredit Indonesia (BCA KKI) adalah kartu virtual untuk pembayaran QRIS di myBCA tanpa iuran tahunan. Anda juga dapat menghubungi Halo BCA 1500888 atau WhatsApp 08111500998.';
      if (newMsg.toLowerCase().includes('limit')) {
        botReply =
          'Limit transaksi BCA KKI untuk QRIS MPM/CPM adalah Rp10.000.000 per transaksi, dengan limit harian hingga Rp25.000.000 atau limit gabungan kartu Anda.';
      } else if (newMsg.toLowerCase().includes('syarat') || newMsg.toLowerCase().includes('daftar')) {
        botReply =
          'Persyaratan BCA KKI: WNI/WNA usia 21-65 tahun, pendapatan min. Rp3 juta/bulan. Diterbitkan otomatis sebagai pendamping Kartu Kredit BCA Card utama.';
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <>
      {/* FIXED 6-COLUMN SMARTBAR (1:1 with Screenshot across all screens) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0060af] border-t border-white/20 shadow-2xl select-none">
        <div className="max-w-md mx-auto grid grid-cols-6 h-[64px]">
          
          {/* 1. Login */}
          <button
            onClick={() => setActivePanel(activePanel === 'login' ? null : 'login')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 text-white transition-all border-r border-white/10 ${
              activePanel === 'login' ? 'bg-[#004884]' : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            <div className="mb-1 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <span className="text-[11px] font-medium leading-none text-white tracking-tight">
              Login
            </span>
          </button>

          {/* 2. Produk */}
          <button
            onClick={() => setActivePanel(activePanel === 'produk' ? null : 'produk')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 text-white transition-all border-r border-white/10 ${
              activePanel === 'produk' ? 'bg-[#004884]' : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            <div className="mb-1 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="text-[11px] font-medium leading-none text-white tracking-tight">
              Produk
            </span>
          </button>

          {/* 3. Layanan */}
          <button
            onClick={() => setActivePanel(activePanel === 'layanan' ? null : 'layanan')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 text-white transition-all border-r border-white/10 ${
              activePanel === 'layanan' ? 'bg-[#004884]' : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            <div className="mb-1 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium leading-none text-white tracking-tight">
              Layanan
            </span>
          </button>

          {/* 4. Promo */}
          <button
            onClick={() => setActivePanel(activePanel === 'promo' ? null : 'promo')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 text-white transition-all border-r border-white/10 ${
              activePanel === 'promo' ? 'bg-[#004884]' : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            <div className="mb-1 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="text-[11px] font-medium leading-none text-white tracking-tight">
              Promo
            </span>
          </button>

          {/* 5. Webform BCA (2 lines) */}
          <button
            onClick={() => setActivePanel(activePanel === 'webform' ? null : 'webform')}
            className={`relative flex flex-col items-center justify-center py-1 px-0.5 text-white transition-all border-r border-white/10 ${
              activePanel === 'webform' ? 'bg-[#004884]' : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            <div className="mb-0.5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="flex flex-col items-center leading-none text-[10px] font-medium text-white tracking-tight">
              <span>Webform</span>
              <span>BCA</span>
            </div>
          </button>

          {/* 6. Chat with circular white avatar badge */}
          <button
            onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 text-white transition-all ${
              activePanel === 'chat' ? 'bg-[#004884]' : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            <div className="relative mb-1 flex items-center justify-center">
              {/* Solid white avatar circle head */}
              <span className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full z-10" />
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium leading-none text-white tracking-tight">
              Chat
            </span>
          </button>

        </div>
      </nav>

      {/* Backdrop overlay */}
      {activePanel && (
        <div
          onClick={() => setActivePanel(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          activePanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#003874] text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-sky-200">
              Smartbar BCA
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-base font-bold capitalize">
              {activePanel === 'webform' ? 'Webform BCA' : activePanel}
            </span>
          </div>

          <button
            onClick={() => setActivePanel(null)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          {/* 1. LOGIN PANEL */}
          {activePanel === 'login' && (
            <div className="space-y-6 text-center py-4">
              <div>
                <p className="text-base font-bold text-gray-800 mb-3">
                  Mempermudah akses perbankan Anda
                </p>
                <a
                  href="https://www.klikbca.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg bg-[#0060AF] hover:bg-[#004f90] text-white font-semibold shadow-sm transition gap-2"
                >
                  <span>Login via KlikBCA Individu</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <hr className="border-gray-200" />

              <div>
                <p className="text-base font-bold text-gray-800 mb-3">
                  Solusi perbankan untuk Bisnis Anda
                </p>
                <a
                  href="https://klikbca.com/smelogin.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold shadow-sm transition gap-2"
                >
                  <span>Login via KlikBCA Bisnis</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <hr className="border-gray-200" />

              <div>
                <p className="text-base font-bold text-gray-800 mb-3">
                  Langkah awal untuk pengalaman perbankan yang baru
                </p>
                <a
                  href="https://mybca.bca.co.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg border-2 border-[#0060AF] text-[#0060AF] hover:bg-blue-50 font-bold shadow-sm transition gap-2"
                >
                  <span>myBCA</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* 2. PRODUK PANEL */}
          {activePanel === 'produk' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#003874]">Produk Individu</h3>
              <div className="grid grid-cols-2 gap-3">
                {SMARTBAR_PRODUCTS.map((p) => (
                  <div
                    key={p.name}
                    className={`${p.bg} rounded-xl p-4 text-white shadow-xs hover:shadow-md hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between h-28`}
                  >
                    <div>
                      <h4 className="font-bold text-sm leading-snug">{p.name}</h4>
                      <p className="text-[11px] text-white/80 mt-1">{p.desc}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-200">
                      Selengkapnya →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. LAYANAN PANEL */}
          {activePanel === 'layanan' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#003874]">Layanan Individu</h3>
              <div className="grid grid-cols-2 gap-3">
                {SMARTBAR_SERVICES.map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition cursor-pointer"
                  >
                    <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PROMO PANEL */}
          {activePanel === 'promo' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#003874]">Promo BCA Terkini</h3>
              <div className="space-y-3">
                {SMARTBAR_PROMOS.map((promo, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 bg-white hover:border-[#0060AF] shadow-xs hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-sky-100 text-[#0060AF]">
                        {promo.tag}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{promo.date}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 leading-snug">
                      {promo.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">{promo.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <a
                  href="https://promo.bca.co.id/id/all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#0060AF] hover:bg-[#004f90] text-white font-semibold rounded-lg shadow transition gap-2"
                >
                  <span>Lihat Semua Promo</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* 5. WEBFORM BCA */}
          {activePanel === 'webform' && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0060AF] flex items-center justify-center mx-auto border border-blue-200">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Webform BCA</h4>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Apply online hingga tracking pengajuan mudah dan cepat via Webform BCA.
                </p>
              </div>
              <a
                href="https://www.bca.co.id/id/forms/webform-bca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0060AF] hover:bg-[#004f90] text-white font-semibold rounded-lg shadow transition gap-2"
              >
                <span>Buka Webform BCA</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* 6. CHAT / VIRA */}
          {activePanel === 'chat' && (
            <div className="flex flex-col h-full min-h-[420px]">
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-xs text-sky-900 mb-4">
                <strong>VIRA (Virtual Assistant BCA):</strong> Layanan informasi 24/7.
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#0060AF] text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 py-3 border-t border-gray-100 mt-2">
                {[
                  'Berapa limit KKI?',
                  'Syarat pendaftaran?',
                  'Cara aktivasi di myBCA',
                  'Nomor Halo BCA',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setUserInput(prompt)}
                    className="text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-[#0060AF] text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0060AF]"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-[#0060AF] hover:bg-[#004f90] text-white rounded-lg transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const Smartbar = React.memo(SmartbarComponent);
