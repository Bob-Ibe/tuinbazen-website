/* =============================================
   TUINBAZEN – main.js
   ============================================= */

const nav        = document.getElementById('nav');
const navMenu    = document.getElementById('nav-menu');
const navToggle  = document.getElementById('nav-toggle');
const heroBg     = document.getElementById('hero-bg');

/* --- Navigatie: transparant → wit bij scrollen --- */
function updateNav() {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
    nav.classList.remove('transparent');
  } else {
    nav.classList.remove('scrolled');
    nav.classList.add('transparent');
  }
}

/* --- Hamburger menu --- */
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
  if (!isOpen) document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
});

/* --- Dropdown: mobiel uitklappen --- */
document.querySelectorAll('.has-dropdown').forEach(item => {
  const link = item.querySelector(':scope > .nav-link');
  if (!link) return;
  link.addEventListener('click', e => {
    if (window.innerWidth > 768) return;
    e.preventDefault();
    item.classList.toggle('open');
    document.querySelectorAll('.has-dropdown').forEach(other => {
      if (other !== item) other.classList.remove('open');
    });
  });
});

/* Sluit menu bij klik op een link.
   Uitzondering: de "Diensten"-toggle op mobiel — die klapt alleen het
   submenu uit en mag het menu NIET sluiten (anders schuiven de links
   onder je vinger weg en tik je op de verkeerde pagina). */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768 && link.parentElement.classList.contains('has-dropdown')) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* --- Parallax hero --- */
function updateParallax() {
  if (!heroBg) return;
  heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}

/* --- Scroll-animaties (reveal) --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- Gecombineerde scroll-handler (één listener) --- */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateNav();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
});

/* --- Review slider --- */
const track    = document.getElementById('reviews-track');
const dotsWrap = document.getElementById('reviews-dots');
const btnPrev  = document.getElementById('reviews-prev');
const btnNext  = document.getElementById('reviews-next');
const bar      = document.getElementById('reviews-bar');

if (track) {
  const slides = track.querySelectorAll('.review-slide');
  let current = 0;
  let autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetProgress(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function resetProgress() {
    clearTimeout(autoTimer);
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth;
      bar.style.transition = 'width 5s linear';
      bar.style.width = '100%';
    }
    autoTimer = setTimeout(() => { goTo(current + 1); resetProgress(); }, 5000);
  }

  btnPrev.addEventListener('click', () => { goTo(current - 1); resetProgress(); });
  btnNext.addEventListener('click', () => { goTo(current + 1); resetProgress(); });

  /* Pauzeer bij hover */
  track.addEventListener('mouseenter', () => {
    clearTimeout(autoTimer);
    if (bar) { bar.style.transition = 'none'; }
  });
  track.addEventListener('mouseleave', resetProgress);

  /* Swipe op mobiel */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetProgress(); }
  });

  resetProgress();
}

/* --- Waarom Tuinbazen: scroll-gebaseerde slide-animaties per element --- */
const wmEls = document.querySelectorAll('.wm-slide-left, .wm-slide-right');
if (wmEls.length) {
  const wmObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('wm-visible');
      wmObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });

  wmEls.forEach(el => wmObserver.observe(el));
}

/* --- Flip cards: tik op mobiel --- */
const isTouch = window.matchMedia('(hover: none)').matches;
if (isTouch) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* --- Lightbox --- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxCap   = document.getElementById('lightbox-caption');
const lightboxCount = document.getElementById('lightbox-counter');
const lightboxThumbs= document.getElementById('lightbox-thumbs');
const lbClose       = document.getElementById('lightbox-close');
const lbPrev        = document.getElementById('lightbox-prev');
const lbNext        = document.getElementById('lightbox-next');

if (lightbox && document.querySelector('.eerder-item[data-lightbox]')) {
  const items = Array.from(document.querySelectorAll('.eerder-item[data-lightbox]'));
  let lbCurrent = 0;

  /* Thumbnails aanmaken */
  if (lightboxThumbs) {
    items.forEach((item, i) => {
      const src = item.querySelector('img').src;
      const alt = item.querySelector('img').alt;
      const th  = document.createElement('div');
      th.className = 'lightbox-thumb';
      th.innerHTML = `<img src="${src}" alt="${alt}">`;
      th.addEventListener('click', () => lbGo(i));
      lightboxThumbs.appendChild(th);
    });
  }

  function updateThumbs() {
    if (!lightboxThumbs) return;
    lightboxThumbs.querySelectorAll('.lightbox-thumb').forEach((t, i) =>
      t.classList.toggle('active', i === lbCurrent)
    );
  }

  function lbGo(index) {
    lbCurrent = (index + items.length) % items.length;
    const item = items[lbCurrent];
    const img  = item.querySelector('img');
    lightboxImg.classList.add('lb-loading');
    lightboxImg.onload = () => lightboxImg.classList.remove('lb-loading');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCap)   lightboxCap.textContent   = item.dataset.lightbox || '';
    if (lightboxCount) lightboxCount.textContent = `${lbCurrent + 1} / ${items.length}`;
    updateThumbs();
  }

  function openLightbox(index) {
    lbGo(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => lbGo(lbCurrent - 1));
  lbNext.addEventListener('click', () => lbGo(lbCurrent + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGo(lbCurrent - 1);
    if (e.key === 'ArrowRight') lbGo(lbCurrent + 1);
  });

  /* Swipe */
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) lbGo(diff > 0 ? lbCurrent + 1 : lbCurrent - 1);
  });
}

/* --- Count-up animatie --- */
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCount(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = target >= 100 ? 1800 : target >= 10 ? 1200 : 800;
  const start    = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutQuart(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count').forEach(animateCount);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-grid').forEach(el => countObserver.observe(el));

/* --- Hero-video autoplay forceren (robuust tegen autoplay-policy) --- */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.muted = true;            // property zetten, niet alleen attribuut
  heroVideo.setAttribute('muted', ''); // extra zekerheid voor iOS Safari
  const tryPlay = () => {
    const p = heroVideo.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };
  tryPlay();
  // Nogmaals proberen zodra de video geladen is
  heroVideo.addEventListener('loadeddata', tryPlay);
  heroVideo.addEventListener('canplay', tryPlay);
  // Fallback: start bij de eerste interactie als de browser autoplay blokkeert
  const kick = () => { tryPlay(); document.removeEventListener('touchstart', kick); document.removeEventListener('click', kick); document.removeEventListener('scroll', kick); };
  document.addEventListener('touchstart', kick, { once: true, passive: true });
  document.addEventListener('click', kick, { once: true });
  document.addEventListener('scroll', kick, { once: true, passive: true });
  // Hervat autoplay wanneer de tab weer zichtbaar wordt
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
}

/* Init */
updateNav();
