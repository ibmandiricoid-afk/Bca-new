import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { BcaLogo } from './BcaLogo';

const HeaderNavComponent: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const popularSearches = [
    { label: 'myBCA' },
    { label: 'Paylater' },
    { label: 'Awas Modus' },
    { label: 'Buka Rekening Tahapan' },
    { label: 'Edukatips' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-transparent py-3 px-5 sm:px-6 transition-all select-none">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Brand Logo with Tagline (Exact 1:1) */}
          <div className="flex items-center">
            <a href="#hero" className="flex items-center" aria-label="BCA Home">
              <BcaLogo variant="white" withTagline={true} size="md" />
            </a>
          </div>

          {/* Right Action Icons: Search + Hamburger (Exact 1:1) */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 text-white hover:opacity-80 transition cursor-pointer"
              aria-label="Cari"
            >
              <Search className="w-6 h-6 stroke-[2.2]" />
            </button>

            {/* Hamburger Icon: 3 rounded horizontal white bars with relaxed spacing */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-white hover:opacity-80 transition flex flex-col justify-between w-7 h-5 cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2.2] -mt-0.5" />
              ) : (
                <>
                  <span className="block w-6 h-[2px] bg-white rounded-full" />
                  <span className="block w-6 h-[2px] bg-white rounded-full" />
                  <span className="block w-6 h-[2px] bg-white rounded-full" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#004f98] border-b border-sky-400/20 shadow-2xl text-white py-5 px-4 animate-in fade-in duration-200">
            <div className="max-w-md mx-auto">
              <div className="relative flex items-center">
                <input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Disini..."
                  className="w-full bg-white text-gray-800 text-sm md:text-base pl-4 pr-12 py-2.5 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00A3E0]"
                  autoFocus
                />
                <button
                  className="absolute right-1.5 p-2 bg-[#0060AF] text-white rounded hover:bg-[#004f90] transition"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Searches */}
              <div className="mt-4 pt-3 border-t border-white/15">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-200 mb-2">
                  Paling Banyak Dicari:
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setSearchQuery(item.label)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full border border-white/15 transition flex items-center gap-1"
                    >
                      {item.label}
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#003874] border-b border-sky-400/30 px-6 py-5 space-y-3 text-white shadow-2xl animate-in fade-in duration-200">
            <div className="max-w-md mx-auto flex flex-col space-y-2">
              {['Individu', 'Bisnis', 'Tentang BCA', 'Karir'].map((item) => (
                <button
                  key={item}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
                >
                  {item}
                </button>
              ))}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <span className="text-xs font-medium text-sky-200">Pusat Layanan: 1500888</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/10 rounded-full">ID / EN</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export const HeaderNav = React.memo(HeaderNavComponent);
