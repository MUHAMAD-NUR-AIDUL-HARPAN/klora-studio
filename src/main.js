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
      elements.percentage.textContent = `${progress}%`;
      if (progress >= 100) {
        clearInterval(counter);
        animatePreloaderExit();
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

// scroll img to section
function smoothScrollTo(targetY, duration = 1200, offset = 0) {
  const startY = window.pageYOffset;
  const distanceY = targetY - startY - offset;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutQuad(progress);
    window.scrollTo(0, startY + distanceY * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Event listener untuk semua gambar
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.img-click').forEach((img) => {
    img.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = img.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const elementY =
          targetSection.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(elementY, 1200, 99); // durasi 1.2 detik, offset 99px
      }
    });
  });
});
