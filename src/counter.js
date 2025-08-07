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

import Lenis from '@studio-freight/lenis';

const horiz = document.getElementById('horizontalScroll');
const bgAtas = document.getElementById('bgAtas');
const bgBawah = document.getElementById('bgBawah');

const RESET_DELAY = 500;
let resetTimer = null;

// Inisialisasi Lenis
const lenis = new Lenis({
  duration: 2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Fungsi bantu
function isAtEnd(element) {
  return element.scrollLeft + element.offsetWidth >= element.scrollWidth - 1;
}

function isAtStart(element) {
  return element.scrollLeft <= 0;
}

function activateBackgrounds() {
  bgAtas.classList.remove('-top-96');
  bgAtas.classList.add('-top-11');

  bgBawah.classList.remove('-bottom-96');
  bgBawah.classList.add('-bottom-11');
}

function resetBackgrounds() {
  bgAtas.classList.add('-top-96');
  bgAtas.classList.remove('-top-11');

  bgBawah.classList.add('-bottom-96');
  bgBawah.classList.remove('-bottom-11');
}

// Deteksi scroll vertikal saja → baru munculkan bg
function handleAnyScroll(e) {
  const isMostlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);

  if (isMostlyVertical) {
    activateBackgrounds();

    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      resetBackgrounds();
    }, RESET_DELAY);
  }
}

// Event scroll horizontal → intercept scroll vertikal
horiz.addEventListener(
  'wheel',
  (e) => {
    const deltaX = e.deltaY * 0.4;
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;

    const atEnd = isAtEnd(horiz);
    const atStart = isAtStart(horiz);

    if (!(atEnd && isScrollingDown) && !(atStart && isScrollingUp)) {
      e.preventDefault();
      horiz.scrollBy({ left: deltaX });
      lenis.stop();
    } else {
      lenis.start();
    }

    handleAnyScroll(e); // hanya munculkan bg saat scroll vertikal
  },
  { passive: false }
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

  // Gambar muncul dari kanan ke kiri setelah 1 detik
  if (menuOpen) {
    imgFigure.classList.add('translate-x-full', 'opacity-0');
    imgFigure.classList.remove('hidden');

    setTimeout(() => {
      imgFigure.classList.remove('translate-x-full', 'opacity-0');
      imgFigure.classList.add('translate-x-0', 'opacity-100');
    }, 1000);
  } else {
    imgFigure.classList.remove('translate-x-0', 'opacity-100');
    imgFigure.classList.add('translate-x-full', 'opacity-0');

    setTimeout(() => {
      imgFigure.classList.add('hidden');
    }, 500); // biar transisi selesai baru di-hide
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
    const label = button.querySelector('p')?.textContent?.trim();

    // Reset warna semua teks
    menuButtons.forEach((btn) => {
      btn.classList.remove('text-black');
      btn.classList.add('text-gray-500');

      const p = btn.querySelector('p');
      if (p) {
        p.classList.remove('text-black');
        p.classList.add('text-gray-500');
      }
    });

    // Warna teks aktif jadi hitam
    button.classList.remove('text-gray-500');
    button.classList.add('text-black');
    const activeText = button.querySelector('p');
    if (activeText) {
      activeText.classList.remove('text-gray-500');
      activeText.classList.add('text-black');
    }

    // Step 1: Gambar lama zoom out + fade out
    imgFigure.classList.remove('scale-100', 'opacity-100', 'translate-x-0');
    imgFigure.classList.add('scale-110', 'opacity-0');

    // Step 2: Setelah animasi zoom out, ganti gambar dan reset posisi awal dari kanan
    setTimeout(() => {
      switch (label) {
        case 'Work':
          menuImage.src = 'public/img/imgMenu.png';
          menuImage.style.transform = 'rotate(0deg)';
          break;

        case 'Studio':
          menuImage.src = 'public/img/imgMenu2.png';
          menuImage.style.transform = 'rotate(-25deg)';
          break;

        case 'Archive':
          menuImage.src = 'public/img/imgMenu3.png';
          menuImage.style.transition = 'transform 0.5s ease';
          menuImage.style.transform = 'rotate(-15deg)';
          break;

        case 'Say hi':
          menuImage.src = 'public/img/imgMenu05.png';
          menuImage.style.transform = 'rotate(-20deg)';
          break;
      }

      // Reset posisi ke kanan
      imgFigure.classList.remove('scale-110');
      imgFigure.classList.add('translate-x-0');

      // Step 3: Masukkan gambar baru dari kanan ke tengah + fade in
      setTimeout(() => {
        imgFigure.classList.remove('translate-x-full', 'opacity-0');
        imgFigure.classList.add('translate-x-0', 'scale-100', 'opacity-100');
      }, 50);
    }, 500);
  });
});
