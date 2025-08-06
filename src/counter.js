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


