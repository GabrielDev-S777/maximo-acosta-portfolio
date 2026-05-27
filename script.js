/* ════════════════════════════════════════════
   Maximo Acosta — Portfolio
   script.js — Animaciones y lógica
   ════════════════════════════════════════════ */


/* ────────────────────────────────────────────
   LOADER
──────────────────────────────────────────── */
// Dismiss loader when DOM is ready, rather than waiting for all heavy assets (like videos) to load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('done');
    }
  }, 1000); // 1 second is enough for the intro animation to play nicely
});


/* ────────────────────────────────────────────
   CUSTOM CURSOR & BACKGROUND EFFECTS
──────────────────────────────────────────── */
const curDot  = document.querySelector('.cur-dot');
const curRing = document.querySelector('.cur-ring');
const bgGlow  = document.getElementById('bg-glow');
let mx = 0, my = 0, rx = 0, ry = 0;
let gx = 0, gy = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  curDot.style.left = mx + 'px';
  curDot.style.top  = my + 'px';
  
  if (bgGlow && !bgGlow.classList.contains('active')) {
    bgGlow.classList.add('active');
  }
});

function animateRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';

  // Desplazamiento ultra suave para el glow de fondo (inercia lenta)
  gx += (mx - gx) * 0.05;
  gy += (my - gy) * 0.05;
  if (bgGlow) {
    bgGlow.style.left = gx + 'px';
    bgGlow.style.top  = gy + 'px';
  }

  requestAnimationFrame(animateRing);
}
animateRing();

/* Expandir el ring al hacer hover en elementos interactivos */
document.querySelectorAll('a, button, .pc-inner, .tab, .fcard, .faq-summary').forEach(el => {
  el.addEventListener('mouseenter', () => {
    curRing.style.width  = '60px';
    curRing.style.height = '60px';
    curRing.style.opacity = '.3';
  });
  el.addEventListener('mouseleave', () => {
    curRing.style.width  = '40px';
    curRing.style.height = '40px';
    curRing.style.opacity = '.5';
  });
});


/* ────────────────────────────────────────────
   TIMECODE (Hero)
──────────────────────────────────────────── */
const tcEl = document.getElementById('tc');
let frame = 0;

function updateTimecode() {
  frame++;
  const f  = frame % 30;
  const s  = Math.floor(frame / 30) % 60;
  const m  = Math.floor(frame / 1800) % 60;
  const h  = Math.floor(frame / 108000) % 24;
  tcEl.textContent =
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0') + ':' +
    String(f).padStart(2, '0');
  requestAnimationFrame(updateTimecode);
}
updateTimecode();


/* ────────────────────────────────────────────
   MARQUEE
──────────────────────────────────────────── */
(function initMarquee() {
  const items = [
    'PREMIERE PRO', 'AFTER EFFECTS', 'DAVINCI RESOLVE', 'COLOR GRADING',
    'MOTION GRAPHICS', 'SOUND DESIGN', 'SUBTÍTULOS',
    'REELS', 'TIKTOK', 'SHORTS', 'MARCA PERSONAL'
  ];
  const mq = document.getElementById('mq');
  const markup = items.map(i =>
    `<span class="marquee-item">${i} <span class="marquee-sep">◆</span></span>`
  ).join('');
  // Duplicar para efecto de loop continuo
  mq.innerHTML = markup + markup;
})();


/* ────────────────────────────────────────────
   NAV — scroll behavior
──────────────────────────────────────────── */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nm a');
const sections = document.querySelectorAll('section[id], div[id="numeros"]');

window.addEventListener('scroll', () => {
  /* Nav background */
  if (window.scrollY > 60) {
    nav.classList.add('s');
  } else {
    nav.classList.remove('s');
  }

  /* Active link highlight */
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 200;
    if (window.scrollY >= top) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.classList.remove('on');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('on');
    }
  });
});


/* ────────────────────────────────────────────
   SCROLL HELPER
──────────────────────────────────────────── */
function scroll2(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}


/* ────────────────────────────────────────────
   TABS (Trabajos / Portfolio) — desactivado temporalmente
──────────────────────────────────────────── */
/* 
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
    btn.classList.add('on');
    const target = btn.getAttribute('data-t');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('on'));
    const panel = document.getElementById('tp-' + target);
    if (panel) panel.classList.add('on');
  });
});
*/


/* ────────────────────────────────────────────
   VIDEO PREVIEW (Hover to preview)
──────────────────────────────────────────── */
document.querySelectorAll('.pc-inner[data-video]').forEach(card => {
  const preview = card.querySelector('.pc-preview');
  if (!preview) return;

  card.addEventListener('mouseenter', () => {
    // If the video source is not set yet (e.g. hovered before IntersectionObserver triggered), set it now
    if (!preview.src && preview.dataset.src) {
      preview.preload = 'metadata';
      preview.src = preview.dataset.src;
    }

    if (preview.readyState >= 1) {
      preview.currentTime = 0;
    }
    preview.play().catch(() => {});
  });

  card.addEventListener('mouseleave', () => {
    preview.pause();
  });
});


/* ────────────────────────────────────────────
   VIDEO LAZY LOADING (Carga bajo demanda)
──────────────────────────────────────────── */
const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const previewVideo = card.querySelector('.pc-preview');
      if (previewVideo && previewVideo.dataset.src && !previewVideo.src) {
        // Set preload to metadata and inject src to start loading thumbnail frame
        previewVideo.preload = 'metadata';
        previewVideo.src = previewVideo.dataset.src;
      }
      observer.unobserve(card);
    }
  });
}, {
  // Preload videos that are 300px offscreen to the right/left
  rootMargin: '0px 300px 0px 300px'
});

document.querySelectorAll('.pc-inner[data-video]').forEach(card => {
  lazyVideoObserver.observe(card);
});


/* ────────────────────────────────────────────
   VIDEO LIGHTBOX (Click to play fullscreen)
──────────────────────────────────────────── */
const lightbox   = document.getElementById('video-lightbox');
const lbVideo    = document.getElementById('vl-video');
const lbTitle    = document.getElementById('vl-title');
const lbClose    = document.getElementById('vl-close');
const lbBackdrop = lightbox ? lightbox.querySelector('.vl-backdrop') : null;

function openLightbox(videoSrc, title) {
  if (!lightbox || !lbVideo) return;
  lbVideo.src = videoSrc;
  lbTitle.textContent = title;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('lightbox-open');
  lbVideo.play().catch(() => {});
}

function closeLightbox() {
  if (!lightbox || !lbVideo) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('lightbox-open');
  lbVideo.pause();
  lbVideo.src = '';
}

/* Open lightbox on card click */
document.querySelectorAll('.pc-inner[data-video]').forEach(card => {
  card.addEventListener('click', (e) => {
    /* Don't open if user was dragging the scroll */
    const wrap = card.closest('.hscroll-wrap');
    if (wrap) {
      const startScroll = parseFloat(wrap.dataset.startScroll || 0);
      if (Math.abs(wrap.scrollLeft - startScroll) > 8) return;
    }
    const videoSrc = card.getAttribute('data-video');
    const label = card.closest('.pc')?.querySelector('.pc-label')?.textContent || '';
    openLightbox(videoSrc, label);
  });
});

/* Close lightbox */
if (lbClose)    lbClose.addEventListener('click', closeLightbox);
if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


/* ────────────────────────────────────────────
   DRAG SCROLL (Horizontal scroll en Portfolio)
──────────────────────────────────────────── */
document.querySelectorAll('.hscroll-wrap').forEach(wrap => {
  let isDown = false, startX, scrollLeft;

  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
    wrap.dataset.startScroll = scrollLeft;
  });
  wrap.addEventListener('mouseleave', () => { isDown = false });
  wrap.addEventListener('mouseup',    () => { isDown = false });
  wrap.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 2;
    wrap.scrollLeft = scrollLeft - walk;
  });
});


/* ────────────────────────────────────────────
   COUNTER ANIMATION (Números)
──────────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-c]').forEach(el => {
    const target = +el.getAttribute('data-c');
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* easeOutQuart */
      const ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}


/* ────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

/* Observer específico para los contadores */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const numerosSection = document.getElementById('numeros');
if (numerosSection) counterObserver.observe(numerosSection);


/* ────────────────────────────────────────────
   FORMULARIO DE CONTACTO (Formspree AJAX)
──────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('ct-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Recoger los datos del formulario */
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    /* Estado: enviando */
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const response = await fetch('https://formspree.io/f/mbdbybao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        /* Estado: éxito */
        submitBtn.textContent = '¡Mensaje enviado! ✓';
        submitBtn.style.background = '#00c853';
        submitBtn.style.color = '#fff';
        submitBtn.style.opacity = '1';
        contactForm.reset();

        /* Volver al estado original después de 4 segundos */
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      /* Estado: error */
      submitBtn.textContent = 'Error al enviar ✗';
      submitBtn.style.background = '#ff1744';
      submitBtn.style.color = '#fff';
      submitBtn.style.opacity = '1';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  });
}
