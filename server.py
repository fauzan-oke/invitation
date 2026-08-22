import http.server
import socketserver
import json
import os
import datetime

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
WISHES_FILE = os.path.join(DATA_DIR, 'wishes.json')
GUESTS_FILE = os.path.join(DATA_DIR, 'guests.json')

class WeddingHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/wishes'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            if os.path.exists(WISHES_FILE):
                with open(WISHES_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'[]')
            return

        if self.path.startswith('/api/guests'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            if os.path.exists(GUESTS_FILE):
                with open(GUESTS_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'[]')
            return

        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/rsvp') or self.path.startswith('/api/wishes'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Read current wishes
                wishes = []
                if os.path.exists(WISHES_FILE):
                    try:
                        with open(WISHES_FILE, 'r', encoding='utf-8') as f:
                            wishes = json.load(f)
                    except Exception:
                        wishes = []

                new_entry = {
                    "id": int(datetime.datetime.now().timestamp() * 1000),
                    "name": data.get("name", "Tamu"),
                    "status": data.get("status", "hadir"),
                    "guests": str(data.get("guests", "1")),
                    "message": data.get("message", ""),
                    "createdAt": datetime.datetime.utcnow().isoformat() + "Z",
                    "timeFormatted": "Baru saja"
                }

                wishes.insert(0, new_entry)

                # Save back to wishes.json
                with open(WISHES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(wishes, f, ensure_ascii=False, indent=2)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                response = {
                    "success": True,
                    "message": "Doa & RSVP berhasil disimpan ke file wishes.json",
                    "data": new_entry,
                    "allWishes": wishes
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), WeddingHandler) as httpd:
        print(f"🎉 Web Undangan Hani & Fauzan aktif via Python!")
        print(f"🌐 Buka di browser: http://localhost:{PORT}")
        httpd.serve_forever()
