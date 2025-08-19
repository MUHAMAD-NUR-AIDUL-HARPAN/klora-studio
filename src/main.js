document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    preloader: document.getElementById('preloader'),
    preloaderTop: document.getElementById('preloader-top'),
    preloaderBottom: document.getElementById('preloader-bottom'),
    percentage: document.getElementById('percentage'),
    mainContent: document.getElementById('main-content'),
    lines: document.querySelectorAll('.line'),
    timeDisplay: document.querySelector('#preloader-top p'),
    zoomSection: document.getElementById('zoomSection'),
  };

  // Setup awal garis vertikal
  gsap.set(elements.lines, {
    scaleY: 0,
    opacity: 1,
    transformOrigin: 'top',
  });

  // Setup awal teks persentase
  gsap.set(elements.percentage, {
    y: 100,
    opacity: 0,
  });

  const masterTL = gsap.timeline();

  // Animasi garis muncul
  masterTL.to(elements.lines, {
    scaleY: 1,
    duration: 0.6,
    ease: 'back.out(1.4)',
    stagger: {
      each: 0.07,
      from: 'start',
    },
  });

  // Animasi teks persentase
  masterTL.to(elements.percentage, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  });

  // Counter angka dari 0 ke 100
  masterTL.add(() => {
    let progress = 0;
    const counter = setInterval(() => {
      progress++;
      if (elements && elements.percentage) {
        elements.percentage.textContent = `${progress}%`;

        if (progress >= 100) {
          clearInterval(counter);
          animatePreloaderExit();
        }
      }
    }, 25);
  });

  function animatePreloaderExit() {
    const exitTL = gsap.timeline({
      onComplete: () => {
        elements.preloader.style.display = 'none';
        elements.mainContent.style.display = 'block';
        document.body.classList.remove('no-scroll');

        // Munculkan konten utama
        // gsap.from(elements.mainContent, {
        //   opacity: 0,
        //   duration: 1.1,
        //   ease: 'power4.out',
        //   delay: 0.1,
        // });

        // Zoom + fade in section
        // gsap.fromTo(
        //   elements.zoomSection,
        //   { scale: 0.96, opacity: 0 },
        //   {
        //     scale: 1,
        //     opacity: 1,
        //     duration: 2,
        //     ease: 'power4.out',
        //     // delay: 0.1,
        //   }
        // );
      },
    });

    // Hilangkan persentase ke atas
    exitTL.to(elements.percentage, {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    // Animasi curtain buka ke atas dan bawah
    exitTL.to(
      [elements.preloaderTop, elements.preloaderBottom],
      {
        y: (i) => (i === 0 ? '-100%' : '100%'),
        duration: 1.2,
        ease: 'power3.inOut',
      },
      '<'
    );

    // Hilangkan garis vertikal
    exitTL.to(
      elements.lines,
      {
        opacity: 0,
        duration: 0.8,
      },
      '<'
    );
  }
});


const popup = document.getElementById('popup');
const sectionsWrapper = document.getElementById('sections-wrapper');

// ====== Helper: render semua section ke popup & scroll ke target ======
function renderAllSectionsAndScroll(targetId) {
  // Buat container agar rapi
  const container = document.createElement('div');
  container.id = 'popup-content';
  container.className = 'w-full';

  // Clone SEMUA section dari sections-wrapper
  const allSections = sectionsWrapper
    ? sectionsWrapper.querySelectorAll(':scope > section')
    : [];
  allSections.forEach((sec) => {
    const cloned = sec.cloneNode(true);
    // pastikan tiap section “satu layar” dan bisa scroll internal jika perlu
    cloned.classList.add('min-h-screen', 'w-full');
    container.appendChild(cloned);
  });

  // Masukkan ke popup
  popup.innerHTML = '';
  popup.appendChild(container);

  // Aktifkan tombol close di semua section yg di-clone
  popup
    .querySelectorAll('[data-popup-close], .close, .btn-close')
    .forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        closePopup();
      });
    });

  // Scroll ke section yang diklik
  requestAnimationFrame(() => {
    const targetEl = popup.querySelector(`#${targetId}`);
    if (targetEl) {
      // scrollIntoView di container popup
      targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      // fallback manual jika perlu
      popup.scrollTop = targetEl.offsetTop;
    }
  });
}

// ====== Buka / Tutup Popup ======
function openPopup() {
  // Matikan Lenis kalau ada (AMAN: cek dulu)
  try {
    window.toggleLenisScroll && window.toggleLenisScroll(false);
  } catch (_) {}

  popup.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Paksa popup jadi scroll container
  popup.classList.add('overflow-y-auto');
  popup.style.height = '100vh';
  popup.style.webkitOverflowScrolling = 'touch';
  popup.style.overscrollBehavior = 'contain';
  popup.style.touchAction = 'auto';

  // Cegah event scroll “bocor” ke body/Lenis
  ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'pointermove'].forEach(
    (evt) => {
      popup.addEventListener(evt, stopBubble, { passive: false });
    }
  );

  requestAnimationFrame(() => {
    popup.classList.add('show');
  });
}

function closePopup() {
  popup.classList.remove('show');
  setTimeout(() => {
    popup.classList.add('hidden');
    popup.classList.remove('overflow-y-auto');
    popup.innerHTML = '';
    document.body.style.overflow = '';

    // Nyalakan lagi Lenis kalau ada
    try {
      window.toggleLenisScroll && window.toggleLenisScroll(true);
    } catch (_) {}

    // Lepas blok event (biar bersih)
    ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'pointermove'].forEach(
      (evt) => {
        popup.removeEventListener(evt, stopBubble, { passive: false });
      }
    );
  }, 400);
}

// Hanya tutup kalau klik backdrop kosong
popup.addEventListener('click', (e) => {
  if (e.target === popup) closePopup();
});

// ====== Cegah event bubble ke body (biar Lenis nggak “ambil”) ======
function stopBubble(e) {
  // Jangan preventDefault biar popup tetap scroll; cukup hentikan propagasi
  e.stopPropagation();
}

// ====== Klik thumbnail di Swiper ======
document.querySelectorAll('#horizontalScroll .img-click').forEach((img) => {
  img.addEventListener('click', () => {
    const targetId = img.dataset.target;
    // Render SEMUA section lalu scroll ke target yang diklik
    renderAllSectionsAndScroll(targetId);
    openPopup();
  });
});

// ====== LENIS KHUSUS POPUP ======
import Lenis from '@studio-freight/lenis';

let lenisPopup = null;
let rafId = null;

function initPopupLenis() {
  if (lenisPopup) return; // jangan init 2x

  lenisPopup = new Lenis({
    wrapper: popup, // elemen yg jadi container scroll
    content: popup, // konten scroll
    smoothWheel: true,
    smoothTouch: true,
    lerp: 0.08, // kecil = lebih berat/pelan
  });

  function raf(time) {
    lenisPopup.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);
}

function destroyPopupLenis() {
  if (lenisPopup) {
    cancelAnimationFrame(rafId);
    lenisPopup.destroy();
    lenisPopup = null;
  }
}

// ==== INTEGRASI KE OPEN / CLOSE POPUP ====
const oldOpenPopup = openPopup;
openPopup = function () {
  oldOpenPopup(); // jalankan aslinya
  initPopupLenis(); // aktifkan lenis popup
};

const oldClosePopup = closePopup;
closePopup = function () {
  oldClosePopup(); // jalankan aslinya
  destroyPopupLenis(); // matikan lenis popup
};
