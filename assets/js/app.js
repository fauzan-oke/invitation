// Interactive Logic for Hani & Fauzan Wedding Invitation - White & Blue Theme
document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initCountdown();
  initMusicPlayer();
  initRSVP();
  initClipboard();
  initLightbox();
  initScrollReveal();
});

// 1. Dynamic Guest Name from URL Parameter (?to=Nama+Tamu)
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('n') || urlParams.get('nama');
  const guestDisplay = document.getElementById('guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');
  
  if (guestDisplay) {
    if (guestName) {
      // Decode and sanitize name
      const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
      guestDisplay.textContent = formattedName;
      if (rsvpNameInput) {
        rsvpNameInput.value = formattedName;
      }
    } else {
      guestDisplay.textContent = 'Tamu Undangan';
    }
  }
}

// 2. Open Invitation & Audio Setup
function initMusicPlayer() {
  const openBtn = document.getElementById('btn-open-invitation');
  const coverOverlay = document.getElementById('cover-overlay');
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const musicDisc = document.getElementById('music-disc');

  let isPlaying = false;

  // Sound URL: Romantic royalty-free acoustic wedding piano
  if (bgAudio) {
    bgAudio.src = 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-127.mp3';
    bgAudio.volume = 0.6;
  }

  function playAudio() {
    if (bgAudio) {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (musicDisc) musicDisc.classList.remove('paused');
        if (musicIcon) musicIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M9 9H5a1 1 0 00-1 1v4a1 1 0 001 1h4l5 5V4L9 9z" />`;
      }).catch(err => {
        console.log("Audio playback restricted:", err);
      });
    }
  }

  function pauseAudio() {
    if (bgAudio) {
      bgAudio.pause();
      isPlaying = false;
      if (musicDisc) musicDisc.classList.add('paused');
      if (musicIcon) musicIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`;
    }
  }

  // Open Invitation Click
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      // Play music
      playAudio();

      // Fade out cover
      if (coverOverlay) {
        coverOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-full');
        document.body.classList.remove('overflow-hidden');
        
        setTimeout(() => {
          coverOverlay.style.display = 'none';
        }, 800);
      }

      // Show floating music widget
      if (musicToggle) {
        musicToggle.classList.remove('hidden');
      }

      // Trigger reveal animations
      triggerScrollReveal();
    });
  }

  // Music toggle button
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
}

// 3. Countdown Timer (Target: 31 Agustus 2026 08:00:00 WIB)
function initCountdown() {
  const weddingDate = new Date("2026-08-31T08:00:00+07:00").getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// 4. RSVP and Guestbook (LocalStorage Persistence)
const DEFAULT_WISHES = [
  {
    name: "Farhan & Dinda",
    status: "hadir",
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru Hani & Fauzan! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    time: "10 menit yang lalu"
  },
  {
    name: "Rizky Ramadhan",
    status: "hadir",
    message: "Selamat brader Fauzan & Hani! Lancar sampai hari H yaa. See you di Bekasi Utara!",
    time: "25 menit yang lalu"
  },
  {
    name: "Keluarga Besar Bpk. Ahmad",
    status: "hadir",
    message: "Selamat berbahagia untuk kedua mempelai. Semoga dilancarkan semua rangkaian acaranya dan senantiasa dalam lindungan Allah SWT.",
    time: "1 jam yang lalu"
  }
];

function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const wishesCount = document.getElementById('wishes-count');

  // Load existing wishes from LocalStorage or use defaults
  let storedWishes = JSON.parse(localStorage.getItem('hani_fauzan_wishes')) || DEFAULT_WISHES;

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';

    if (wishesCount) {
      wishesCount.textContent = `(${storedWishes.length} Ucapan)`;
    }

    storedWishes.forEach(item => {
      const isHadir = item.status === 'hadir';
      const statusBadge = isHadir
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
             <svg class="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
             Hadir
           </span>`
        : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
             <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
             Berhalangan
           </span>`;

      const card = document.createElement('div');
      card.className = "p-4 rounded-xl bg-white border border-blue-100 shadow-sm transition hover:shadow-md";
      card.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
              ${escapeHtml(item.name.charAt(0).toUpperCase())}
            </div>
            <h4 class="font-semibold text-slate-800 text-sm md:text-base">${escapeHtml(item.name)}</h4>
          </div>
          ${statusBadge}
        </div>
        <p class="text-slate-600 text-sm leading-relaxed mt-2 pl-10">${escapeHtml(item.message)}</p>
        <div class="text-right mt-1.5">
          <span class="text-[11px] text-slate-400 font-light">${escapeHtml(item.time || 'Baru saja')}</span>
        </div>
      `;
      wishesList.appendChild(card);
    });
  }

  renderWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const guests = document.getElementById('rsvp-guests').value;
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name || !message) {
        showToast("Mohon lengkapi nama dan ucapan Anda.", "error");
        return;
      }

      const newWish = {
        name,
        status,
        guests,
        message,
        time: "Baru saja"
      };

      storedWishes.unshift(newWish);
      localStorage.setItem('hani_fauzan_wishes', JSON.stringify(storedWishes));

      renderWishes();
      form.reset();
      showToast("Terima kasih! Doa & konfirmasi kehadiran Anda telah tersimpan.", "success");
    });
  }
}

// 5. Copy Bank Account to Clipboard + Toast Notification
function initClipboard() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (targetText) {
        navigator.clipboard.writeText(targetText).then(() => {
          showToast(`Nomor rekening ${targetText} berhasil disalin!`, "success");
          
          // Visual feedback on button
          const originalText = btn.innerHTML;
          btn.innerHTML = `
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-blue-700 font-medium">Tersalin!</span>
          `;
          btn.classList.add('bg-blue-50', 'border-blue-300');

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('bg-blue-50', 'border-blue-300');
          }, 2000);
        }).catch(err => {
          showToast("Gagal menyalin rekening. Silakan salin secara manual.", "error");
        });
      }
    });
  });
}

// 6. Photo Lightbox Gallery
function initLightbox() {
  const galleryImages = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightboxModal || !lightboxImg) return;

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('data-full') || img.getAttribute('src');
      lightboxImg.setAttribute('src', src);
      lightboxModal.classList.remove('hidden');
      lightboxModal.classList.add('flex');
    });
  });

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightboxModal.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}

// 7. Scroll Reveal Animation Trigger
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(el => observer.observe(el));
}

function triggerScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('active');
    }
  });
}

// 8. Custom Toast Notification
function showToast(message, type = "success") {
  const existingToast = document.getElementById('app-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'app-toast';
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 ${
    type === 'success' 
      ? 'bg-slate-900 text-blue-200 border border-blue-500/40' 
      : 'bg-red-900 text-white border border-red-400/40'
  }`;

  const icon = type === 'success'
    ? `<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
    : `<svg class="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

  toast.innerHTML = `${icon} <span>${escapeHtml(message)}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Helper: Escape HTML to avoid XSS
function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
