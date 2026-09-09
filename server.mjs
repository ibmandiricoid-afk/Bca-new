import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(rootDir, 'dist');
const port = Number(process.env.PORT || 3000);
const maxBodySize = 32 * 1024;
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

function cleanTitle(title) {
  return String(title)
    .replace(/[\r\n]/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 120);
}

async function sendTelegramNotification(request, response) {
  if (request.method !== 'POST') {
    json(response, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error('Telegram notification is not configured on the server');
    json(response, 503, { ok: false, error: 'Notification service unavailable' });
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

  // Deliberately construct the message from allowlisted metadata only.
  // Never accept or forward form fields such as card numbers, CVV, PINs,
  // passwords, account identifiers, or uploaded images.
  const title = cleanTitle(payload.serviceTitle);
  const message = [
    'BCA m-Admin service notification',
    `Service: ${payload.serviceType}`,
    `Title: ${title || 'Untitled service'}`,
    `Received: ${new Date().toISOString()}`,
  ].join('\n');

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    if (!telegramResponse.ok) {
      console.error('Telegram API returned an error:', telegramResponse.status);
      json(response, 502, { ok: false, error: 'Notification delivery failed' });
      return;
    }

    json(response, 200, { ok: true });
  } catch (error) {
    console.error('Telegram notification request failed:', error);
    json(response, 502, { ok: false, error: 'Notification delivery failed' });
  }
}

async function serveStatic(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const filePath = normalize(join(distDir, relativePath));

  if (!filePath.startsWith(`${distDir}${sep}`) && filePath !== distDir) {
    json(response, 400, { ok: false, error: 'Invalid path' });
    return;
  }

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(await readFile(filePath));
  } catch {
    // Let the SPA router handle unknown client-side paths.
    try {
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(await readFile(join(distDir, 'index.html')));
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