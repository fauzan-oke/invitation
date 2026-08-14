# Web Undangan Pernikahan Simpel & Elegan: Hani & Fauzan

Website undangan pernikahan digital modern, minimalis, dan elegan yang dibangun menggunakan **Tailwind CSS**, **Google Fonts**, dan **Lucide Icons**.

## 🌟 Fitur Utama

1. **Cover Gate Interaktif & Personalisasi Tamu**:
   - Tampilan pembuka eksklusif dengan nama tamu otomatis dari query URL.
   - Contoh link tamu: `index.html?to=Bapak+Budi+Santoso` atau `index.html?to=Keluarga+Besar+Haji+Ahmad`
2. **Audio Player Romantis (Floating Music Disc)**:
   - Pemutar musik otomatis dimulai saat tombol *"Buka Undangan"* diklik (mematuhi aturan autoplay browser).
   - Dilengkapi tombol melayang kontrol Play/Pause dengan efek animasi piringan hitam (*vinyl spin*).
3. **Hitung Mundur Realtime (Live Countdown)**:
   - Menghitung waktu mundur ke tanggal **31 Agustus 2026, 08:00 WIB**.
4. **Profil Mempelai**:
   - Foto & informasi kedua mempelai (Hani & Fauzan) beserta orang tua dan akun Instagram.
5. **Rangkaian Acara (Akad Nikah & Resepsi)**:
   - Detail waktu dan lokasi (**KUA Bekasi Utara** & Gedung Resepsi).
   - Tombol integrasi langsung ke **Google Maps** dan **Google Calendar**.
6. **Kisah Cinta (Our Journey)**:
   - Linimasa singkat perjalanan cinta dari awal bertemu, lamaran, hingga pernikahan.
7. **Galeri Prewedding dengan Lightbox Modal**:
   - Galeri foto grid interaktif yang dapat diperbesar resolusi penuh saat diklik.
8. **RSVP & Buku Tamu Realtime**:
   - Formulir konfirmasi kehadiran dan kirim doa restu.
   - Tersimpan otomatis di browser (*LocalStorage*) dan langsung tampil secara instan.
9. **Amplop Digital (Wedding Gift)**:
   - Kartu transfer bank (BCA & Mandiri) dengan tombol **Salin Nomor Rekening 1-Klik** dan notifikasi *Toast feedback*.
   - Alamat pengiriman kado fisik.

---

## 🚀 Cara Menjalankan

### Cara 1: Buka Langsung di Browser
Cukup buka file `index.html` langsung menggunakan browser favorit Anda (Google Chrome, Edge, Firefox, Safari).

### Cara 2: Menggunakan Live Server / Local Web Server
Jika menggunakan VS Code atau terminal:
```bash
# Menggunakan npx serve
npx serve .

# Atau menggunakan Python built-in server
python -m http.server 3000
```
Buka browser di `http://localhost:3000` (atau port yang tertera).

---

## 🎨 Kustomisasi
- **Nama Tamu**: Tambahkan `?to=Nama+Tamu` di akhir URL browser.
- **Warna & Font**: Dikonfigurasi secara terpusat di `index.html` (Tailwind Config) dan `assets/css/custom.css`.
- **Musik**: Anda dapat mengganti file/link musik di file `assets/js/app.js` pada bagian `bgAudio.src`.
