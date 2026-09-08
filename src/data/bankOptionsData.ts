export interface BankOption {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  bg: string;
}

export const BANK_OPTIONS: BankOption[] = [
  { id: 'bca', name: 'Bank Central Asia (BCA)', shortName: 'BANK BCA', badge: 'BCA', bg: 'linear-gradient(135deg, #0077c8 0%, #006ec1 55%, #005ea6 100%)' },
  { id: 'mandiri', name: 'Bank Mandiri', shortName: 'BANK MANDIRI', badge: 'MANDIRI', bg: 'linear-gradient(135deg, #00305f 0%, #001f3f 55%, #00152b 100%)' },
  { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)', shortName: 'BANK BRI', badge: 'BRI', bg: 'linear-gradient(135deg, #00529b 0%, #003a6e 55%, #002342 100%)' },
  { id: 'bni', name: 'Bank Negara Indonesia (BNI)', shortName: 'BANK BNI', badge: 'BNI', bg: 'linear-gradient(135deg, #f05a22 0%, #d44714 55%, #005e6a 100%)' },
  { id: 'cimb', name: 'Bank CIMB Niaga', shortName: 'CIMB NIAGA', badge: 'CIMB', bg: 'linear-gradient(135deg, #8b0000 0%, #680000 55%, #420000 100%)' },
  { id: 'permata', name: 'Bank Permata', shortName: 'PERMATA BANK', badge: 'PERMATA', bg: 'linear-gradient(135deg, #007a3d 0%, #00582c 55%, #00381c 100%)' },
  { id: 'danamon', name: 'Bank Danamon', shortName: 'BANK DANAMON', badge: 'DANAMON', bg: 'linear-gradient(135deg, #e67817 0%, #b85a08 55%, #003057 100%)' },
  { id: 'bsi', name: 'Bank Syariah Indonesia (BSI)', shortName: 'BANK BSI', badge: 'BSI', bg: 'linear-gradient(135deg, #00a39d 0%, #007d79 55%, #00524f 100%)' },
  { id: 'btn', name: 'Bank Tabungan Negara (BTN)', shortName: 'BANK BTN', badge: 'BTN', bg: 'linear-gradient(135deg, #003b7a 0%, #002954 55%, #ffd100 100%)' },
  { id: 'mega', name: 'Bank Mega', shortName: 'BANK MEGA', badge: 'MEGA', bg: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 55%, #5f0000 100%)' },
  { id: 'sinarmas', name: 'Bank Sinarmas', shortName: 'BANK SINARMAS', badge: 'SINARMAS', bg: 'linear-gradient(135deg, #b71c1c 0%, #7f0000 55%, #3e0000 100%)' },
  { id: 'maybank', name: 'Maybank Indonesia', shortName: 'MAYBANK', badge: 'MAYBANK', bg: 'linear-gradient(135deg, #ffc107 0%, #d39e00 55%, #333333 100%)' },
  { id: 'ocbc', name: 'Bank OCBC NISP', shortName: 'OCBC NISP', badge: 'OCBC', bg: 'linear-gradient(135deg, #e53935 0%, #b71c1c 55%, #1a1a1a 100%)' },
  { id: 'panin', name: 'Bank Panin', shortName: 'PANIN BANK', badge: 'PANIN', bg: 'linear-gradient(135deg, #0277bd 0%, #01579b 55%, #002f6c 100%)' },
  { id: 'jenius', name: 'Bank BTPN / Jenius', shortName: 'BTPN JENIUS', badge: 'JENIUS', bg: 'linear-gradient(135deg, #0097a7 0%, #006064 55%, #ff6f00 100%)' },
  { id: 'jago', name: 'Bank Jago', shortName: 'BANK JAGO', badge: 'JAGO', bg: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 55%, #ffab00 100%)' },
  { id: 'seabank', name: 'SeaBank Indonesia', shortName: 'SEABANK', badge: 'SEABANK', bg: 'linear-gradient(135deg, #e65100 0%, #bf360c 55%, #3e2723 100%)' },
  { id: 'other', name: 'Bank Lainnya (Lainnya / Manual)', shortName: 'BANK LAINNYA', badge: 'BANK', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 55%, #020617 100%)' },
];
