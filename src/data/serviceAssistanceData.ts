import React from 'react';
import {
  CreditCard,
  RotateCcw,
  Landmark,
  Fingerprint,
} from 'lucide-react';

export interface ContactInfo {
  type: string;
  value: string;
  action?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  steps: string[];
  contactInfo?: ContactInfo[];
}

export const SERVICE_PAGES: ServiceItem[][] = [
  // Halaman 1 (2 Kotak Simetris: #1 Blokir Kartu BCA, #2 Batalkan Transaksi)
  [
    {
      id: 'blokir-kartu-bca',
      title: 'Blokir Kartu BCA',
      icon: CreditCard,
      description: 'Blokir kartu kredit atau debit BCA seketika untuk mencegah transaksi yang tidak diinginkan.',
      steps: [
        'Buka aplikasi BCA mobile > pilih menu m-Admin',
        'Pilih menu Blokir Kartu Kredit atau Blokir Kartu ATM',
        'Pilih nomor kartu yang ingin diblokir, lalu konfirmasi dengan PIN m-BCA',
        'Kartu akan langsung dinonaktifkan secara instan',
        'Dapat juga menghubungi Halo BCA di 1500888',
      ],
      contactInfo: [
        { type: 'Halo BCA 24 Jam', value: '1500888', action: 'tel:1500888' },
        { type: 'WhatsApp Resmi', value: '0811 1500 998', action: 'https://wa.me/628111500998' },
      ],
    },
    {
      id: 'batalkan-transaksi',
      title: 'Batalkan Transaksi',
      icon: RotateCcw,
      description: 'Ajukan sanggahan atau pembatalan transaksi tidak dikenal (dispute) pada kartu kredit Anda.',
      steps: [
        'Catat rincian transaksi: tanggal, nominal, dan nama merchant',
        'Hubungi Halo BCA 1500888 atau kirim email ke halobca@bca.co.id',
        'Sampaikan pengajuan sanggahan transaksi tidak dikenal',
        'Petugas BCA akan memproses investigasi dan penahanan dana transaksi',
      ],
      contactInfo: [
        { type: 'Hubungi Halo BCA', value: '1500888', action: 'tel:1500888' },
      ],
    },
  ],
  // Halaman 2 (2 Kotak Simetris: #3 Amankan Bank lain, #4 Amankan user id)
  [
    {
      id: 'amankan-bank-lain',
      title: 'Amankan Bank lain',
      icon: Landmark,
      description: 'Panduan tanggap darurat untuk mengamankan rekening bank lain jika ponsel atau dompet Anda hilang.',
      steps: [
        'Segera hubungi call center resmi bank terkait untuk blokir rekening',
        'Nonaktifkan akses mobile banking dan internet banking yang terhubung',
        'Ganti PIN ATM dan kata sandi email yang tertaut pada akun perbankan',
        'Simpan nomor laporan pengaduan dari pihak bank sebagai bukti',
      ],
      contactInfo: [
        { type: 'Halo BCA', value: '1500888', action: 'tel:1500888' },
      ],
    },
    {
      id: 'amankan-user-id',
      title: 'Amankan user id',
      icon: Fingerprint,
      description: 'Kunci akses User ID dan ganti kredensial myBCA / BCA mobile Anda demi keamanan data pribadi.',
      steps: [
        'Segera ubah Password & PIN aplikasi perbankan Anda',
        'Jika ponsel hilang, minta pemblokiran akses User ID via Halo BCA 1500888',
        'Jangan pernah membagikan OTP, PIN, atau data kartu kepada siapa pun',
        'Aktifkan verifikasi biometrik (sidik jari / Face ID) pada perangkat pribadi',
      ],
      contactInfo: [
        { type: 'Halo BCA Darurat', value: '1500888', action: 'tel:1500888' },
      ],
    },
  ],
];
