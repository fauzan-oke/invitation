// Interactive Logic for Hani Nur Azizah & Fauzan Fakhri Wedding Invitation
document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initCountdown();
  initMusicPlayer();
  initRSVP();
  initClipboard();
  initLightbox();
  initScrollReveal();
  initExportJSON();
});

let registeredGuests = [];
let allWishes = [];

// 1. Dynamic Guest Name from URL Parameter & JSON lookup
async function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('n') || urlParams.get('nama');
  
  const guestGreetingEl = document.getElementById('guest-greeting');
  const guestDisplay = document.getElementById('guest-name');
  const guestBadgeEl = document.getElementById('guest-badge');
  const rsvpNameInput = document.getElementById('rsvp-name');

  // Try fetching guests list from JSON file or API
  try {
    const res = await fetch('data/guests.json');
    if (res.ok) {
      registeredGuests = await res.json();
    }
  } catch (err) {
    console.warn("Could not load guests.json directly, fallback to URL parameter only.", err);
  }

  if (!rawParam) {
    if (guestDisplay) guestDisplay.textContent = 'Tamu Undangan';
    return;
  }

  const cleanSlug = rawParam.toLowerCase().trim().replace(/[\s_]+/g, '-');
  const cleanNameText = decodeURIComponent(rawParam.replace(/\+/g, ' ')).trim();

  // Search in loaded guests.json
  const matchedGuest = registeredGuests.find(g => 
    (g.slug && g.slug.toLowerCase() === cleanSlug) ||
    (g.id && g.id.toLowerCase() === cleanSlug) ||
    (g.name && g.name.toLowerCase() === cleanNameText.toLowerCase())
  );

  let finalName = cleanNameText;
  let greetingText = "Kepada Yth. Bapak/Ibu/Saudara/i:";
  let noteText = "";

  if (matchedGuest) {
    finalName = matchedGuest.name;
    if (matchedGuest.greeting) greetingText = matchedGuest.greeting;
    if (matchedGuest.category || matchedGuest.note) {
      noteText = [matchedGuest.category, matchedGuest.note].filter(Boolean).join(' • ');
    }
  }

  if (guestGreetingEl) guestGreetingEl.textContent = greetingText;
  if (guestDisplay) guestDisplay.textContent = finalName;
  if (rsvpNameInput) rsvpNameInput.value = finalName;

  if (guestBadgeEl && noteText) {
    guestBadgeEl.textContent = noteText;
    guestBadgeEl.classList.remove('hidden');
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
        console.log("Audio playback waiting for interaction:", err);
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

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      playAudio();

      if (coverOverlay) {
        coverOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-full');
        document.body.classList.remove('overflow-hidden');
        
        setTimeout(() => {
          coverOverlay.style.display = 'none';
        }, 800);
      }

      if (musicToggle) {
        musicToggle.classList.remove('hidden');
      }

      triggerScrollReveal();
    });
  }

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

// 3. Countdown Timer (Target: 31 Agustus 2026 14:00:00 WIB)
function initCountdown() {
  const weddingDate = new Date("2026-08-31T14:00:00+07:00").getTime();

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

// 4. RSVP and Guestbook (Insert & Save to JSON / API & LocalStorage)
const DEFAULT_WISHES = [
  {
    id: 1,
    name: "Farhan & Dinda",
    status: "hadir",
    guests: "2",
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru Hani & Fauzan! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    timeFormatted: "10 menit yang lalu"
  },
  {
    id: 2,
    name: "Rizky Ramadhan",
    status: "hadir",
    guests: "1",
    message: "Selamat brader Fauzan & Hani! Lancar sampai hari H yaa. Sampai bertemu di Hotel Horison Bekasi!",
    timeFormatted: "25 menit yang lalu"
  },
  {
    id: 3,
    name: "Keluarga Besar Bpk. Ahmad",
    status: "hadir",
    guests: "3",
    message: "Selamat berbahagia untuk kedua mempelai. Semoga dilancarkan semua rangkaian acaranya dari akad di KUA Bekasi Utara hingga resepsi di Horison. Aamiin.",
    timeFormatted: "1 jam yang lalu"
  }
];

async function loadWishes() {
  // First try from server / JSON file
  try {
    const res = await fetch('/api/wishes');
    if (res.ok) {
      allWishes = await res.json();
      localStorage.setItem('hani_fauzan_wishes', JSON.stringify(allWishes));
      renderWishes();
      return;
    }
  } catch (e) {
    // try direct data/wishes.json static
    try {
      const resStatic = await fetch('data/wishes.json');
      if (resStatic.ok) {
        allWishes = await resStatic.json();
        // merge with local storage new entries
        const localWishes = JSON.parse(localStorage.getItem('hani_fauzan_wishes')) || [];
        if (localWishes.length > allWishes.length) {
          allWishes = localWishes;
        }
        renderWishes();
        return;
      }
    } catch (err) {}
  }

  // Fallback to LocalStorage or Defaults
  allWishes = JSON.parse(localStorage.getItem('hani_fauzan_wishes')) || DEFAULT_WISHES;
  renderWishes();
}

function renderWishes() {
  const wishesList = document.getElementById('wishes-list');
  const wishesCount = document.getElementById('wishes-count');

  if (!wishesList) return;
  wishesList.innerHTML = '';

  if (wishesCount) {
    wishesCount.textContent = `(${allWishes.length} Ucapan)`;
  }

  allWishes.forEach(item => {
    const isHadir = item.status === 'hadir';
    const statusBadge = isHadir
      ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
           <svg class="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
           Hadir (${item.guests || 1} orang)
         </span>`
      : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
           <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
           Berhalangan
         </span>`;

    const card = document.createElement('div');
    card.className = "p-4 rounded-2xl bg-white border-2 border-blue-100/80 shadow-sm transition hover:shadow-md hover:border-blue-300";
    card.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-1.5">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            ${escapeHtml(item.name.charAt(0).toUpperCase())}
          </div>
          <h4 class="font-bold text-slate-800 text-base font-marker">${escapeHtml(item.name)}</h4>
        </div>
        ${statusBadge}
      </div>
      <p class="text-slate-600 text-sm leading-relaxed mt-2 pl-10 font-doodle text-base">${escapeHtml(item.message)}</p>
      <div class="text-right mt-1.5">
        <span class="text-[11px] text-slate-400 font-sans-clean">${escapeHtml(item.timeFormatted || 'Baru saja')}</span>
      </div>
    `;
    wishesList.appendChild(card);
  });
}

function initRSVP() {
  const form = document.getElementById('rsvp-form');
  loadWishes();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const guests = document.getElementById('rsvp-guests').value;
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name || !message) {
        showToast("Mohon lengkapi nama dan ucapan Anda.", "error");
        return;
      }

      const newWish = {
        id: Date.now(),
        name,
        status,
        guests,
        message,
        createdAt: new Date().toISOString(),
        timeFormatted: "Baru saja"
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Menyimpan ke data JSON...</span>`;
      }

      // Try sending to backend API to write to data/wishes.json
      let savedViaServer = false;
      try {
        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWish)
        });
        if (response.ok) {
          const result = await response.json();
          savedViaServer = true;
          if (result.allWishes) {
            allWishes = result.allWishes;
          } else {
            allWishes.unshift(newWish);
          }
        }
      } catch (err) {
        console.log("Server API not reachable, saving to local state & storage:", err);
      }

      if (!savedViaServer) {
        allWishes.unshift(newWish);
      }

      localStorage.setItem('hani_fauzan_wishes', JSON.stringify(allWishes));
      renderWishes();
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          <span>Kirim Konfirmasi &amp; Ucapan</span>
        `;
      }

      showToast("🎉 Terima kasih! Doa & RSVP berhasil tersimpan ke file JSON!", "success");
    });
  }
}

// 5. Export / Download wishes.json feature
function initExportJSON() {
  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allWishes, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "wishes.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("File wishes.json berhasil diunduh!", "success");
    });
  }
}

// 6. Copy Bank Account to Clipboard + Toast Notification
function initClipboard() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (targetText) {
        navigator.clipboard.writeText(targetText).then(() => {
          showToast(`Nomor rekening ${targetText} berhasil disalin!`, "success");
          
          const originalText = btn.innerHTML;
          btn.innerHTML = `
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-blue-700 font-bold">Tersalin!</span>
          `;
          btn.classList.add('bg-blue-100', 'border-blue-400');

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('bg-blue-100', 'border-blue-400');
          }, 2000);
        }).catch(err => {
          showToast("Gagal menyalin rekening. Silakan salin secara manual.", "error");
        });
      }
    });
  });
}

// 7. Photo Lightbox Gallery
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

// 8. Scroll Reveal Animation Trigger
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
    rootMargin: "0px 0px -40px 0px"
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

// 9. Custom Toast Notification
function showToast(message, type = "success") {
  const existingToast = document.getElementById('app-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'app-toast';
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
    type === 'success' 
      ? 'bg-blue-600 text-white border-2 border-blue-300 shadow-blue-500/30' 
      : 'bg-red-600 text-white border-2 border-red-300 shadow-red-500/30'
  }`;

  const icon = type === 'success'
    ? `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
    : `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

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
