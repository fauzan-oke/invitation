# Web Undangan Pernikahan Simpel & Elegan: Hani & Fauzan

Website undangan pernikahan digital modern, minimalis, dan elegan yang dibangun menggunakan **Tailwind CSS**, **Google Fonts (Mali & Patrick Hand)**, dan **Lucide Icons**.

---

## 🎵 Panduan Menambahkan / Mengganti Lagu Musik Undangan

Website ini sudah mendukung pemutar musik otomatis yang langsung aktif saat tamu mengklik tombol *"Buka Undangan"*.

### Cara 1: Menggunakan File Lagu MP3 Sendiri (Paling Mudah & Rekomendasi)
1. Siapkan file lagu pilihan Anda dalam format `.mp3`.
2. Beri nama file tersebut: `song.mp3`
3. Masukkan file tersebut ke dalam folder:
   `assets/audio/song.mp3`
4. Selesai! Website otomatis memutar lagu tersebut saat dibuka.

### Cara 2: Menggunakan Link URL Audio Online
Jika Anda memiliki link direct streaming file audio MP3 (dari Google Drive direct, Cloudinary, Github, dll):
1. Buka file `assets/js/app.js`.
2. Di baris ke-8 paling atas, ubah nilai `AUDIO_SOURCE`:
   ```javascript
   const AUDIO_SOURCE = 'https://link-lagu-anda.com/audio.mp3';
   ```
3. Simpan file `app.js`.

---

## 👥 Cara Menambahkan Nama Tamu Undangan
1. Buka file `data/guests.json`.
2. Tambahkan daftar nama tamu:
   ```json
   {
     "id": "nama-tamu",
     "slug": "nama-tamu",
     "name": "Bapak Nama Tamu & Keluarga",
     "greeting": "Kepada Yth.",
     "category": "Keluarga"
   }
   ```
3. Bagikan link: `http://localhost:3000/?to=nama-tamu`

---

## 🚀 Cara Menjalankan Website
```bash
# Menggunakan Node.js
node server.js

# Atau menggunakan Python
python server.py
```
Buka browser di: `http://localhost:3000`
