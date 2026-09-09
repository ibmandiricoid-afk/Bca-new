/**
 * Formats a Date object to Indonesian Western Standard Time (WIB, UTC+7)
 * Output example: "30/08/2026, 19.29.31 WIB"
 */
export function getFormattedWibDateTime(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.format(date).replace(/:/g, '.');
    return `${parts} WIB`;
  } catch {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${d}/${m}/${y}, ${hh}.${mm}.${ss} WIB`;
  }
}
