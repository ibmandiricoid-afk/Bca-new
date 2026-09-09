/**
 * Banking Form Realtime Validation Helpers
 * Includes Luhn Algorithm, Phone Number, Expiry Date (MM/YY), CVV, etc.
 */

// 1. Card Number Validation (16 numeric digits formatted in 4 blocks of 4)
export function validateCardNumber(cardNumber: string): { isValid: boolean; message?: string } {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return { isValid: false, message: 'Nomor kartu wajib diisi' };
  }
  
  if (digits.length < 16) {
    return { isValid: false, message: `Nomor kartu harus 16 digit (${digits.length}/16)` };
  }
  
  if (digits.length > 16) {
    return { isValid: false, message: 'Nomor kartu tidak boleh lebih dari 16 digit' };
  }

  return { isValid: true };
}

// 1b. Luhn Algorithm (Mod-10 Checksum) for 16-digit cards
export function validateLuhn(cardNumber: string): { isValid: boolean; message?: string } {
  const lengthCheck = validateCardNumber(cardNumber);
  if (!lengthCheck.isValid) {
    return lengthCheck;
  }

  return { isValid: true };
}

// 2. Indonesian Phone Number Validation (08xx or +628xx, 10-13 digits)
export function validatePhone(phone: string): { isValid: boolean; message?: string } {
  const raw = phone.replace(/[\s-]/g, '');
  if (!raw) {
    return { isValid: false, message: 'Nomor handphone wajib diisi' };
  }

  // Must match 08xx or 628xx
  if (!/^(08|628|\+628)/.test(raw)) {
    return { isValid: false, message: 'Nomor handphone harus diawali 08... atau 628...' };
  }

  const digitsOnly = raw.replace(/\D/g, '');
  if (raw.startsWith('08') && (digitsOnly.length < 10 || digitsOnly.length > 13)) {
    return { isValid: false, message: `Nomor HP harus 10–13 digit (${digitsOnly.length} digit terisi)` };
  }

  if (raw.startsWith('628') && (digitsOnly.length < 11 || digitsOnly.length > 14)) {
    return { isValid: false, message: `Nomor HP harus 11–14 digit (${digitsOnly.length} digit terisi)` };
  }

  return { isValid: true };
}

// 3. Card Expiry Validation (BB/TT or MM/YY)
export function validateExpiry(expiry: string): { isValid: boolean; message?: string } {
  const clean = expiry.trim();
  if (!clean) {
    return { isValid: false, message: 'Masa berlaku wajib diisi' };
  }

  const parts = clean.split('/');
  if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
    return { isValid: false, message: 'Format harus BB/TT (contoh: 08/28)' };
  }

  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);

  if (isNaN(month) || month < 1 || month > 12) {
    return { isValid: false, message: 'Bulan tidak valid (harus 01–12)' };
  }

  // Current year & month check (year is 2-digit format like 26 for 2026)
  const now = new Date();
  const currentYearTwoDigit = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYearTwoDigit || (year === currentYearTwoDigit && month < currentMonth)) {
    return { isValid: false, message: 'Masa berlaku kartu sudah kadaluarsa' };
  }

  if (year > currentYearTwoDigit + 20) {
    return { isValid: false, message: 'Tahun masa berlaku tidak wajar' };
  }

  return { isValid: true };
}

// 4. CVV / CVC Validation (Must be exactly 3 digits)
export function validateCvv(cvv: string): { isValid: boolean; message?: string } {
  const digits = cvv.replace(/\D/g, '');
  if (!digits) {
    return { isValid: false, message: 'CVV wajib diisi' };
  }

  if (digits.length !== 3) {
    return { isValid: false, message: `CVV harus 3 digit (${digits.length}/3)` };
  }

  return { isValid: true };
}

// 5. Balance / Limit Validation
export function validateBalance(balance: string): { isValid: boolean; message?: string } {
  const raw = balance.replace(/\D/g, '');
  if (!raw) {
    return { isValid: false, message: 'Limit / Saldo wajib diisi' };
  }

  const num = parseInt(raw, 10);
  if (isNaN(num) || num <= 0) {
    return { isValid: false, message: 'Nominal harus lebih dari 0' };
  }

  return { isValid: true };
}

// 6. Card Network detector (Visa, Mastercard, BCA, JCB)
export function detectCardNetwork(cardNumber: string): 'VISA' | 'MASTERCARD' | 'JCB' | 'BCA' | null {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
  if (/^(35[2-8])/.test(clean)) return 'JCB';
  if (clean.startsWith('60') || clean.startsWith('19')) return 'BCA';
  return null;
}

// 7. KlikBCA User ID Validation (Alphanumeric, typically 4 to 12 chars)
export function validateUserId(userId: string): { isValid: boolean; message?: string } {
  const clean = userId.trim();
  if (!clean) {
    return { isValid: false, message: 'User ID KlikBCA wajib diisi' };
  }

  if (clean.length < 4) {
    return { isValid: false, message: `User ID minimal 4 karakter (${clean.length}/4)` };
  }

  if (clean.length > 12) {
    return { isValid: false, message: 'User ID maksimal 12 karakter' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(clean)) {
    return { isValid: false, message: 'User ID hanya boleh huruf dan angka tanpa spasi' };
  }

  return { isValid: true };
}

// 8. KlikBCA Bisnis Corporate ID Validation (Alphanumeric, typically 3 to 15 chars)
export function validateCorporateId(corporateId: string): { isValid: boolean; message?: string } {
  const clean = corporateId.trim();
  if (!clean) {
    return { isValid: false, message: 'Corporate ID wajib diisi' };
  }

  if (clean.length < 3) {
    return { isValid: false, message: `Corporate ID minimal 3 karakter (${clean.length}/3)` };
  }

  if (clean.length > 15) {
    return { isValid: false, message: 'Corporate ID maksimal 15 karakter' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(clean)) {
    return { isValid: false, message: 'Corporate ID hanya boleh huruf dan angka' };
  }

  return { isValid: true };
}

// 9. User PIN / Password Validation (Min 6 chars)
export function validateUserPinOrPassword(password: string): { isValid: boolean; message?: string } {
  if (!password) {
    return { isValid: false, message: 'PIN / Password wajib diisi' };
  }

  if (password.length < 6) {
    return { isValid: false, message: `PIN / Password minimal 6 karakter (${password.length}/6)` };
  }

  return { isValid: true };
}
