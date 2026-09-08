export interface ProductItem {
  name: string;
  desc: string;
  bg: string;
}

export interface ServiceItemLink {
  name: string;
  sub: string;
}

export interface PromoItem {
  title: string;
  desc: string;
  date: string;
  tag: string;
}

export const SMARTBAR_PRODUCTS: ProductItem[] = [
  {
    name: 'Simpanan Individu',
    desc: 'Tahapan BCA',
    bg: 'bg-gradient-to-br from-blue-700 to-blue-900',
  },
  {
    name: 'Pinjaman Individual',
    desc: 'KPR & KKB BCA',
    bg: 'bg-gradient-to-br from-indigo-700 to-indigo-900',
  },
  {
    name: 'Wealth Management',
    desc: 'Investasi & Asuransi',
    bg: 'bg-gradient-to-br from-sky-700 to-sky-900',
  },
  {
    name: 'Uang Elektronik',
    desc: 'Flazz BCA',
    bg: 'bg-gradient-to-br from-teal-700 to-teal-900',
  },
  {
    name: 'Kartu Kredit BCA',
    desc: 'Kartu Kredit Indonesia',
    bg: 'bg-gradient-to-br from-blue-600 to-cyan-800',
  },
  {
    name: 'Reward BCA',
    desc: 'Poin & Loyalitas',
    bg: 'bg-gradient-to-br from-amber-700 to-orange-800',
  },
];

export const SMARTBAR_SERVICES: ServiceItemLink[] = [
  { name: 'Rencanakan Masa Depan', sub: 'GoodPlan BCA' },
  { name: 'e-Banking', sub: 'BCA mobile & KlikBCA' },
  { name: 'BCA Prioritas', sub: 'Layanan Eksklusif' },
  { name: 'Jaringan Cabang', sub: 'ATM & Kantor Cabang' },
  { name: 'Customer Service', sub: 'Halo BCA 1500888' },
  { name: 'Pengiriman Uang', sub: 'Remittance Valas' },
];

export const SMARTBAR_PROMOS: PromoItem[] = [
  {
    title: 'Butteria - Diskon Rp50 Ribu',
    desc: 'Dapatkan potongan langsung untuk menu favorit',
    date: 'Periode 31 Des 2026',
    tag: 'Kuliner',
  },
  {
    title: 'DR SPECS - Diskon Frame 50%',
    desc: 'Spesial pemegang Kartu Kredit & Debit BCA',
    date: 'Periode 31 Des 2026',
    tag: 'Lifestyle',
  },
  {
    title: 'Google Play - Top Up Koin via Virtual Account myBCA',
    desc: 'Cashback dan reward menarik transaksi game',
    date: 'Periode 01 Sep 2026 - 30 Sep 2026',
    tag: 'Digital',
  },
  {
    title: 'Apong Rumah Makan - Diskon 25%',
    desc: 'Santap lezat seafood bersama keluarga',
    date: 'Periode 31 Des 2026',
    tag: 'Dining',
  },
];
