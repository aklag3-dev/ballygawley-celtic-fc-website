document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initCarousel();
  initMobileNav();
  initSmoothScroll();
});

function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  const icon = toggle.querySelector('i');
  const stored = localStorage.getItem('bcfc-dark-mode');

  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('bcfc-dark-mode', isDark ? 'dark' : 'light');
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
  });
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = track.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const container = document.querySelector('.carousel-container');
  const liveRegion = document.getElementById('carouselLive');

  let current = 0;
  let autoPlayTimer;
  const total = slides.length;
  const autoPlayDelay = 5000;

  function getSlideOffset(index) {
    const slide = slides[index];
    const slideWidth = slide.offsetWidth;
    const containerWidth = container.offsetWidth;
    const slideLeft = slide.offsetLeft;
    
    const containerCenter = containerWidth / 2;
    const slideCenter = slideLeft + slideWidth / 2;
    
    return slideCenter - containerCenter;
  }

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    const offset = getSlideOffset(current);
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });
    liveRegion.textContent = `Slide ${current + 1} of ${total}: ${slides[current].dataset.title}`;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(next, autoPlayDelay);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  nextBtn.addEventListener('click', () => { next(); startAutoPlay(); });
  prevBtn.addEventListener('click', () => { prev(); startAutoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoPlay(); });
  });

  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);
  container.addEventListener('focusin', stopAutoPlay);
  container.addEventListener('focusout', startAutoPlay);

  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    startAutoPlay();
  }, { passive: true });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); startAutoPlay(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { next(); startAutoPlay(); e.preventDefault(); }
  });

  window.addEventListener('resize', () => { goTo(current); });

  goTo(0);
  startAutoPlay();
}

function initMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const nav = document.getElementById('mobileNav');
  const icon = toggle.querySelector('i');
  const links = nav.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    icon.classList.toggle('fa-bars', !isOpen);
    icon.classList.toggle('fa-times', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
