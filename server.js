const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const WISHES_FILE = path.join(__dirname, 'data', 'wishes.json');
const GUESTS_FILE = path.join(__dirname, 'data', 'guests.json');

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

  // API: Submit RSVP & Save to wishes.json
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
          guests: newEntry.guests || '1',
          message: newEntry.message,
          createdAt: new Date().toISOString(),
          timeFormatted: 'Baru saja'
        };

        currentWishes.unshift(preparedEntry);

        // Write back to file data/wishes.json
        fs.writeFileSync(WISHES_FILE, JSON.stringify(currentWishes, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Doa & RSVP berhasil disimpan ke file wishes.json', data: preparedEntry, allWishes: currentWishes }));
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
  console.log(`📁 File wishes disimpan di: ${WISHES_FILE}`);
  console.log(`📁 File guests disimpan di: ${GUESTS_FILE}`);
  console.log(`====================================================`);
});
