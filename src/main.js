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

  // Update jam realtime
  function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    elements.timeDisplay.textContent = `${hours}:${minutes} ${ampm} - GMT+7`;
  }
  updateClock();
  setInterval(updateClock, 60000);

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
        gsap.fromTo(
          elements.zoomSection,
          { scale: 0.96, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            // delay: 0.1,
          }
        );
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
document.querySelectorAll('.img-click').forEach((img) => {
  img.addEventListener('click', () => {
    const targetId = img.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const offset = 99;
      const elementPosition =
        targetSection.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  });
});
