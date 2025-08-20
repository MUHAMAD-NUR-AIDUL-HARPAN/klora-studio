setInterval(() => {
  const now = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });

  document.querySelectorAll('.clock').forEach((el) => {
    el.textContent = `${now} WIB`;
  });
}, 1000);

// lennis
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

// Jalankan raf
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Export lenis dan fungsi untuk enable/disable lenis scroll
function toggleLenisScroll(enable) {
  if (enable) {
    lenis.start();
  } else {
    lenis.stop();
  }
}

export { lenis, toggleLenisScroll };

// swiper.js
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

const bgAtas = document.getElementById('bgAtas');
const bgBawah = document.getElementById('bgBawah');

let isInSection = false;

const section = document.querySelector('#zoomSection');
const observer = new IntersectionObserver(
  ([entry]) => {
    isInSection = entry.isIntersecting;
    // Aktifkan scroll vertikal saat tidak di dalam section
    if (!isInSection) toggleLenisScroll(true);
  },
  { threshold: 0.1 }
);
observer.observe(section);

const swiper = new Swiper('#horizontalScroll', {
  slidesPerView: 3,
  spaceBetween: 4,
  // grabCursor: true,
  mousewheel: {
    sensitivity: 0.4, // default 1, lebih kecil = scroll lebih berat
  },
  freeMode: {
    momentum: true, // aktifkan momentum untuk smooth
    momentumRatio: 0.4, // default 1, lebih kecil = lebih berat
    momentumVelocityRatio: 0.4, // kontrol kecepatan momentum
  },
  on: {
    touchStart() {
      // Saat mulai menggeser swiper, nonaktifkan scroll vertikal
      if (isInSection) toggleLenisScroll(false);
    },
    setTranslate(swiperInstance) {
      // Tampilkan efek background
      bgAtas.classList.remove('-top-96');
      bgAtas.classList.add('-top-5');
      bgBawah.classList.remove('-bottom-96');
      bgBawah.classList.add('-bottom-11');

      // Sembunyikan kembali setelah delay
      clearTimeout(window._scrollTimeout);
      window._scrollTimeout = setTimeout(() => {
        bgAtas.classList.add('-top-96');
        bgAtas.classList.remove('-top-11');
        bgBawah.classList.add('-bottom-96');
        bgBawah.classList.remove('-bottom-11');
      }, 300);

      // Cek Swiper sudah mentok kanan atau kiri
      const isBeginning = swiperInstance.isBeginning;
      const isEnd = swiperInstance.isEnd;

      if ((isBeginning || isEnd) && isInSection) {
        toggleLenisScroll(true);
      } else if (isInSection) {
        toggleLenisScroll(false);
      } else {
        toggleLenisScroll(true);
      }
    },
    touchEnd() {
      if (!isInSection) toggleLenisScroll(true);
    },
  },
});

// setelah observer.observe(section);
section.addEventListener('pointerleave', () => {
  toggleLenisScroll(true);
});

// jika user scroll (wheel) dan posisi pointer tidak berada di dalam section,
// pastikan Lenis diaktifkan (cover trackpad / wheel yang dimulai di luar)
window.addEventListener(
  'wheel',
  (e) => {
    const el =
      typeof e.clientX === 'number' && typeof e.clientY === 'number'
        ? document.elementFromPoint(e.clientX, e.clientY) || e.target
        : e.target;

    if (!section.contains(el)) {
      toggleLenisScroll(true);
    }
  },
  { passive: true, capture: true }
);

// untuk perangkat sentuh: jika touchstart terjadi di luar section -> aktifkan Lenis
window.addEventListener(
  'touchstart',
  (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    const el = document.elementFromPoint(t.clientX, t.clientY) || e.target;
    if (!section.contains(el)) {
      toggleLenisScroll(true);
    }
  },
  { passive: true, capture: true }
);

// humburger + animasi img
const hamburgerIcon = document.getElementById('hamburgerIcon');
const menuToggleText = document.getElementById('menuToggle');

const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');

let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;

  // Toggle animasi dropdown menu
  menuDropdown.classList.toggle('opacity-100');
  menuDropdown.classList.toggle('opacity-0');
  menuDropdown.classList.toggle('pointer-events-auto');
  menuDropdown.classList.toggle('pointer-events-none');
  menuDropdown.classList.toggle('scale-100');

  // Tombol "Menu" hilang/muncul smooth
  if (menuOpen) {
    menuToggleText.classList.remove('opacity-100');
    menuToggleText.classList.add('opacity-0');

    setTimeout(() => {
      menuToggleText.classList.add('pointer-events-none');
    }, 500); // waktu sama dengan duration opacity
  } else {
    menuToggleText.classList.remove('pointer-events-none');
    menuToggleText.classList.remove('opacity-0');
    menuToggleText.classList.add('opacity-100');
  }

  // Hamburger ke ikon X dan sebaliknya
  if (menuOpen) {
    line1.classList.add('rotate-45', 'translate-y-1.5');
    line2.classList.add('opacity-0');
    line3.classList.add('-rotate-45', '-translate-y-1.5');
  } else {
    line1.classList.remove('rotate-45', 'translate-y-1.5');
    line2.classList.remove('opacity-0');
    line3.classList.remove('-rotate-45', '-translate-y-1.5');
  }

  // Gambar muncul dari bawah ke atas setelah 1 detik
  if (menuOpen) {
    imgFigure.classList.add('translate-x-full', 'opacity-0');
    imgFigure.classList.remove('hidden');

    setTimeout(() => {
      imgFigure.classList.remove('translate-x-full', 'opacity-0');
      imgFigure.classList.add('translate-y-0', 'opacity-100');
    }, 1000);
  } else {
    imgFigure.classList.remove('translate-x-0', 'opacity-100');
    imgFigure.classList.add('translate-x-full', 'opacity-0');

    setTimeout(() => {
      imgFigure.classList.add('hidden');
    }, 700); // biar transisi selesai baru di-hide
  }
}

hamburgerIcon.addEventListener('click', toggleMenu);
menuToggleText.addEventListener('click', toggleMenu);

// animasi img menu
const menuButtons = document.querySelectorAll('.menu-btn');
const imgFigure = document.querySelector('#imgFigure');
const menuImage = document.querySelector('#menuImage');

menuButtons.forEach((button) => {
  button.addEventListener('mouseover', () => {
    const paragraphs = button.querySelectorAll('p');
    const label = paragraphs[1]?.textContent?.trim();

    // reset warna menu
    menuButtons.forEach((btn) => {
      btn.classList.remove('text-black');
      btn.classList.add('text-gray-500');

      btn.querySelectorAll('p').forEach((p) => {
        p.classList.remove('text-black');
        p.classList.add('text-gray-500');
      });
    });

    // aktifkan tombol sekarang
    button.classList.remove('text-gray-500');
    button.classList.add('text-black');

    button.querySelectorAll('p').forEach((p) => {
      p.classList.remove('text-gray-500');
      p.classList.add('text-black');
    });

    // --- fade out gambar ---
    imgFigure.classList.remove('opacity-100', 'scale-100');
    imgFigure.classList.add('opacity-0', 'scale-105');

    // setelah fade out selesai (500ms) → baru ganti gambar
    setTimeout(() => {
      switch (label) {
        case 'Work':
          menuImage.src = '/img/imgMenu.png';
          break;
        case 'Studio':
          menuImage.src = '/img/imgMenu2.png';
          break;
        case 'Archive':
          menuImage.src = '/img/imgMenu3.png';
          break;
        case 'Say hi':
          menuImage.src = '/img/imgMenu05.png';
          break;
      }

      // --- fade in lagi ---
      imgFigure.classList.remove('opacity-0', 'scale-105');
      imgFigure.classList.add('opacity-100', 'scale-100');

      // --- rotate delay 0.2s ---
      setTimeout(() => {
        switch (label) {
          case 'Work':
            menuImage.style.transform = 'rotate(0deg)';
            break;
          case 'Studio':
            menuImage.style.transform = 'rotate(-25deg)';
            break;
          case 'Archive':
            menuImage.style.transform = 'rotate(-15deg)';
            break;
          case 'Say hi':
            menuImage.style.transform = 'rotate(-30deg)';
            break;
        }
      }, 200);
    }, 500);
  });
});
