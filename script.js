/* =====================================================
   ANA CAKES — JavaScript
   Scroll reveal, header, nav mobile, parallax, footer
   ===================================================== */

'use strict';

/* ---- Ano dinâmico no footer ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===================================================
   HEADER — scroll + blur
   =================================================== */
const header = document.getElementById('header');

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ===================================================
   MOBILE MENU
   =================================================== */
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Fechar ao clicar em link
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
  if (!header.contains(e.target) && nav.classList.contains('open')) {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ===================================================
   SCROLL REVEAL — Intersection Observer
   =================================================== */
const revealSelectors = [
  '.reveal-fade',
  '.reveal-up',
  '.reveal-left',
  '.reveal-right',
  '.reveal-scale',
].join(', ');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px',
  }
);

document.querySelectorAll(revealSelectors).forEach(el => {
  revealObserver.observe(el);
});

/* ===================================================
   PARALLAX SUAVE — hero decorative blobs
   =================================================== */
const heroDecos = document.querySelectorAll('.hero__deco');
const heroImg   = document.querySelector('.hero__img-wrapper');

function onScrollParallax() {
  const scrollY = window.scrollY;

  heroDecos.forEach((el, i) => {
    const speed = (i + 1) * 0.08;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });

  if (heroImg) {
    heroImg.style.transform = `translateY(${scrollY * 0.05}px)`;
  }
}

// Só ativa parallax em desktop (evita degradação em mobile)
const mq = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');

function toggleParallax(e) {
  if (e.matches) {
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  } else {
    window.removeEventListener('scroll', onScrollParallax);
    if (heroImg) heroImg.style.transform = '';
    heroDecos.forEach(el => { el.style.transform = ''; });
  }
}

mq.addEventListener('change', toggleParallax);
toggleParallax(mq);

/* ===================================================
   SMOOTH ACTIVE NAV LINK
   =================================================== */
const sections = document.querySelectorAll('main section[id], header ~ main section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--color-choco)';
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ===================================================
   PRODUCT CARD — tilt leve on hover (desktop)
   =================================================== */
if (window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.prod-card, .cat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -4;
      const tiltY = dx *  4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-out)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ===================================================
   FLOATING ELEMENTS — mouse drift (hero, desktop)
   =================================================== */
const floatingEls = document.querySelectorAll('.hero__floating');

if (
  floatingEls.length &&
  window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches
) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    floatingEls.forEach((el, i) => {
      const factor = (i + 1) * 10;
      el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
}

/* ===================================================
   BACK-TO-TOP behaviour on logo click
   =================================================== */
document.querySelectorAll('a[href="#inicio"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ===================================================
   GALLERY — lightbox simples (teclado acessível)
   =================================================== */
const galItems = document.querySelectorAll('.gal-item');

galItems.forEach(item => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');

  const img   = item.querySelector('img');
  const label = item.querySelector('.gal-item__overlay span');

  item.setAttribute('aria-label', label ? `Ver foto: ${label.textContent}` : 'Ver foto');

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img?.src, label?.textContent || '');
    }
  });

  item.addEventListener('click', () => {
    openLightbox(img?.src, label?.textContent || '');
  });
});

function openLightbox(src, caption) {
  if (!src) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Foto: ${caption}`);

  overlay.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Fechar foto">✕</button>
      <img src="${src}" alt="${caption}" />
      ${caption ? `<p class="lightbox__caption">${caption}</p>` : ''}
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('lightbox--open'));

  const close = () => {
    overlay.classList.remove('lightbox--open');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
      document.body.style.overflow = '';
    }, { once: true });
  };

  overlay.querySelector('.lightbox__close').addEventListener('click', close);
  overlay.querySelector('.lightbox__backdrop').addEventListener('click', close);
  overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Focus trap
  overlay.querySelector('.lightbox__close').focus();
}

// Lightbox styles injetados via JS para manter HTML/CSS separados
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lightbox--open { opacity: 1; }
  .lightbox__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(20, 8, 4, 0.88);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  .lightbox__content {
    position: relative;
    z-index: 1;
    max-width: min(90vw, 900px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    transform: scale(0.92);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lightbox--open .lightbox__content { transform: scale(1); }
  .lightbox__content img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
  }
  .lightbox__caption {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
  }
  .lightbox__close {
    position: absolute;
    top: -16px;
    right: -16px;
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.25s;
  }
  .lightbox__close:hover { background: rgba(255,255,255,0.22); }
`;
document.head.appendChild(lightboxStyle);

/* ===================================================
   COUNTER ANIMATION — para métricas se adicionadas
   Utilitário reutilizável
   =================================================== */
function animateCount(el, target, duration = 1600) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ===================================================
   INIT LOG
   =================================================== */
console.log('%cAna Cakes ✦', 'font-family:serif;font-size:18px;color:#c9a96e;font-style:italic;');
console.log('%cSite carregado com sucesso.', 'color:#6b3a2a;font-size:11px;');
