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

//  ========================================

// ======== SETUP ELEMEN DASAR ========
const popup = document.getElementById('popup');
const sectionsWrapper = document.getElementById('sections-wrapper');

// ======== UTIL: AKTIFKAN TOMBOL CLOSE ========
function wireCloseButtons(root = popup) {
  root
    .querySelectorAll('[data-popup-close], .close, .btn-close')
    .forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        closePopup();
      });
    });
}

// ======== RENDER: CLONE HEADER + SEMUA SECTION ========
function renderAllSectionsAndScroll(targetId) {
  popup.innerHTML = '';

  const container = document.createElement('div');
  container.id = 'popup-content';
  container.className = 'w-full';

  const allContent = sectionsWrapper
    ? sectionsWrapper.querySelectorAll(':scope > header, :scope > section')
    : [];

  allContent.forEach((el) => {
    const cloned = el.cloneNode(true);
    if (cloned.tagName === 'SECTION') {
      cloned.classList.add('min-h-screen', 'w-full');
    }
    container.appendChild(cloned);
  });

  popup.appendChild(container);

  wireCloseButtons(popup);
  setupHeaderColorSwap();

  requestAnimationFrame(() => {
    if (!targetId) return;
    const targetEl = popup.querySelector(`#${targetId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      evaluateHeaderStateImmediate();
    }
  });
}

// ======== POPUP OPEN/CLOSE ========
function openPopup(targetId) {
  try {
    window.toggleLenisScroll && window.toggleLenisScroll(false);
  } catch (_) {}

  popup.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  popup.classList.add('overflow-y-auto');
  popup.style.height = '100vh';
  popup.style.webkitOverflowScrolling = 'touch';
  popup.style.overscrollBehavior = 'contain';
  popup.style.touchAction = 'auto';

  renderAllSectionsAndScroll(targetId);

  ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'pointermove'].forEach(
    (evt) => {
      popup.addEventListener(evt, stopBubble, { passive: false });
    }
  );

  requestAnimationFrame(() => popup.classList.add('show'));

  initPopupLenis();
}

function closePopup() {
  popup.classList.remove('show');

  setTimeout(() => {
    ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'pointermove'].forEach(
      (evt) => {
        popup.removeEventListener(evt, stopBubble, { passive: false });
      }
    );

    popup.classList.add('hidden');
    popup.classList.remove('overflow-y-auto');
    popup.innerHTML = '';
    document.body.style.overflow = '';

    destroyPopupLenis();

    try {
      window.toggleLenisScroll && window.toggleLenisScroll(true);
    } catch (_) {}

    if (headerObserver) {
      headerObserver.disconnect();
      headerObserver = null;
    }
    popup.removeEventListener('scroll', evaluateHeaderStateImmediate);
    window.removeEventListener('resize', rebuildHeaderObserver);
  }, 300);
}

popup.addEventListener('click', (e) => {
  if (e.target === popup) closePopup();
});

function stopBubble(e) {
  e.stopPropagation();
}

// ======== TRIGGER BUKA POPUP DARI THUMBNAIL ========
document.querySelectorAll('#horizontalScroll .img-click').forEach((img) => {
  img.addEventListener('click', () => {
    const targetId = img.dataset.target;
    openPopup(targetId);
  });
});

// ======== LENIS OPSIONAL (TANPA IMPORT) ========
let lenisPopup = null;
let rafId = null;
const hasLenis =
  typeof window !== 'undefined' && typeof window.Lenis !== 'undefined';

function initPopupLenis() {
  if (!hasLenis || lenisPopup) return;
  lenisPopup = new window.Lenis({
    wrapper: popup,
    content: popup,
    smoothWheel: true,
    smoothTouch: true,
    lerp: 0.08,
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

// ======== GANTI WARNA HEADER SAAT #target3 TERLIHAT ========
let headerObserver = null;

function setupHeaderColorSwap() {
  const header = popup.querySelector('header');
  const target3 = popup.querySelector('#target3');
  if (!header || !target3) return;

  header.classList.add('transition-colors', 'duration-300');
  setHeaderDark(header);

  buildHeaderObserver(header, target3);

  evaluateHeaderStateImmediate();
  popup.addEventListener('scroll', evaluateHeaderStateImmediate, {
    passive: true,
  });

  window.addEventListener('resize', rebuildHeaderObserver);
}

function buildHeaderObserver(header, target3) {
  if (headerObserver) headerObserver.disconnect();

  const topOffset = header.offsetHeight || 0;

  headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setHeaderLight(header);
        } else {
          setHeaderDark(header);
        }
      });
    },
    {
      root: popup,
      threshold: 0,
      rootMargin: `-${topOffset}px 0px 0px 0px`,
    }
  );

  headerObserver.observe(target3);
}

function rebuildHeaderObserver() {
  const header = popup.querySelector('header');
  const target3 = popup.querySelector('#target3');
  if (!header || !target3) return;
  buildHeaderObserver(header, target3);
}

function evaluateHeaderStateImmediate() {
  const header = popup.querySelector('header');
  const target3 = popup.querySelector('#target3');
  if (!header || !target3) return;

  const rootRect = popup.getBoundingClientRect();
  const rect = target3.getBoundingClientRect();

  const visiblePx = Math.max(
    0,
    Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top)
  );
  const ratio = rect.height ? visiblePx / rect.height : 0;

  if (rect.top <= rootRect.top + (header.offsetHeight || 0)) {
    setHeaderLight(header);
  } else {
    setHeaderDark(header);
  }
}

// ======== THEME HELPERS ========
function setHeaderLight(header) {
  header.classList.remove('bg-black', 'text-white');
  header.classList.add('bg-white', 'text-black');

  const btn = header.querySelector('.btn-close');
  if (btn) {
    btn.classList.remove('border-white');
    btn.classList.add('border-black');
  }
  header.querySelectorAll('.btn-close span').forEach((s) => {
    s.classList.remove('bg-white');
    s.classList.add('bg-black');
  });
}

function setHeaderDark(header) {
  header.classList.remove('bg-white', 'text-black');
  header.classList.add('bg-black', 'text-white');

  const btn = header.querySelector('.btn-close');
  if (btn) {
    btn.classList.remove('border-black');
    btn.classList.add('border-white');
  }
  header.querySelectorAll('.btn-close span').forEach((s) => {
    s.classList.remove('bg-black');
    s.classList.add('bg-white');
  });
}
