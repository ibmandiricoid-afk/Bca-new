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
}

interface TelegramResponse {
  ok?: boolean;
  error?: string;
}

/**
 * Client for the server-side Telegram notification endpoint.
 *
 * Telegram credentials intentionally never appear in this module. The
 * endpoint also only accepts service metadata, so user-entered financial
 * credentials are not sent to Telegram.
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
        body: JSON.stringify({
          serviceType: formData.serviceType,
          serviceTitle: formData.serviceTitle,
        }),
      });

      let result: TelegramResponse = {};
      try {
        result = (await response.json()) as TelegramResponse;
      } catch {
        // Keep the user-facing failure path consistent for non-JSON responses.
      }

      if (!response.ok || result.ok !== true) {
        console.error('Telegram notification failed:', result.error || response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Telegram notification request failed:', error);
      return false;
    }
  }
}