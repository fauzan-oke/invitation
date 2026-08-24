const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const WISHES_FILE = path.join(__dirname, 'data', 'wishes.json');
const GUESTS_FILE = path.join(__dirname, 'data', 'guests.json');
const N8N_WEBHOOK_URL = 'https://prod.n8n-roku.my.id/webhook/0914cda3-733d-45a7-a134-ca7e39b39c01';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

function forwardToN8n(payload) {
  try {
    const dataString = JSON.stringify(payload);
    const url = new URL(N8N_WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      console.log(`[n8n Webhook] Forwarded successfully, response status: ${res.statusCode}`);
    });

    req.on('error', (err) => {
      console.warn(`[n8n Webhook Warning] Forward failed: ${err.message}`);
    });

    req.write(dataString);
    req.end();
  } catch (err) {
    console.warn(`[n8n Webhook Error]: ${err.message}`);
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // API: Get Wishes
  if (req.method === 'GET' && pathname === '/api/wishes') {
    fs.readFile(WISHES_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gagal membaca data ucapan' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data || '[]');
    });
    return;
  }

  // API: Get Guests
  if (req.method === 'GET' && pathname === '/api/guests') {
    fs.readFile(GUESTS_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gagal membaca data tamu' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data || '[]');
    });
    return;
  }

  // API: Submit RSVP & Save to wishes.json & forward to n8n
  if (req.method === 'POST' && (pathname === '/api/rsvp' || pathname === '/api/wishes')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const newEntry = JSON.parse(body);
        if (!newEntry.name || !newEntry.message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Nama dan ucapan wajib diisi' }));
          return;
        }

        // Read current wishes
        let currentWishes = [];
        if (fs.existsSync(WISHES_FILE)) {
          const content = fs.readFileSync(WISHES_FILE, 'utf8');
          currentWishes = JSON.parse(content || '[]');
        }

        const preparedEntry = {
          id: Date.now(),
          name: newEntry.name,
          status: newEntry.status || 'hadir',
          guests: parseInt(newEntry.guests, 10) || 1,
          message: newEntry.message,
          createdAt: new Date().toISOString(),
          timeFormatted: 'Baru saja',
          source: 'wedding_invitation_hani_fauzan'
        };

        currentWishes.unshift(preparedEntry);

        // Write to local file data/wishes.json
        fs.writeFileSync(WISHES_FILE, JSON.stringify(currentWishes, null, 2), 'utf8');

        // Forward to n8n webhook asynchronously
        forwardToN8n(preparedEntry);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Doa & RSVP berhasil disimpan dan terkirim ke n8n webhook!', 
          data: preparedEntry, 
          allWishes: currentWishes 
        }));
      } catch (error) {
        console.error('RSVP Save Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gagal memproses data JSON' }));
      }
    });
    return;
  }

  // Serve static files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  
  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎉 Web Undangan Hani & Fauzan aktif!`);
  console.log(`🌐 Buka di browser: http://localhost:${PORT}`);
  console.log(`🔗 n8n Webhook: ${N8N_WEBHOOK_URL}`);
  console.log(`📁 File wishes disimpan di: ${WISHES_FILE}`);
  console.log(`====================================================`);
});
