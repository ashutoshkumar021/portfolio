/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Ashutosh Kumar Portfolio – script.js v2
   Fixes: counter uses data-target/data-suffix,
   smooth scroll with navbar offset, all buttons wired
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

'use strict';

/* ─── Theme Toggle ─── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ─── Navbar Scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
}, { passive: true });

/* ─── Active Nav Link ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  const navH = navbar.offsetHeight + 30;
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - navH) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ─── Hamburger / Mobile Menu ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }
});

/* ─── Smooth Scroll – all anchor links, with navbar offset ─── */
function smoothScrollTo(targetEl) {
  const navH = navbar.offsetHeight;
  const top = targetEl.getBoundingClientRect().top + window.scrollY - navH - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    const target = id === '#' ? null : document.querySelector(id);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
    }
  });
});

/* ─── Typing Effect ─── */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Full-Stack Software Engineer',
  'Fintech Backend Developer',
  'Node.js & TypeScript Expert',
  'Loan Management Systems Builder',
  'API Integration Specialist',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const current = phrases[phraseIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);
  charIndex += isDeleting ? -1 : 1;

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && charIndex === current.length + 1) {
    delay = 2200; isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 350;
  }
  setTimeout(typeEffect, delay);
}
typeEffect();

/* ─── Scroll Reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 75);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Skill Bar Animations ─── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ─── Particle Canvas ─── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const N = 65;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => { resize(); initP(); }, { passive: true });
  resize();

  function Particle() {
    this.reset = function () {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.32;
      this.vy = (Math.random() - 0.5) * 0.32;
      this.alpha = Math.random() * 0.38 + 0.08;
      const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#a855f7'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    };
    this.reset();
  }

  function initP() { particles = Array.from({ length: N }, () => new Particle()); }
  initP();

  let mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const f = (110 - dist) / 110 * 0.012;
        p.vx += dx * f; p.vy += dy * f;
      }
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 0.8) { p.vx = (p.vx / spd) * 0.8; p.vy = (p.vy / spd) * 0.8; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5;
      if (p.y > h + 5) p.y = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 125) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#6366f1';
          ctx.globalAlpha = 0.07 * (1 - d / 125);
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Parallax on Hero BG ─── */
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg-gradient');
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
}, { passive: true });

/* ─── Stat Counter Animation ─── */
// Reads data-target (number) and data-suffix (e.g. "+") from element attributes
function animateCounter(el, duration = 1400) {
  const target = parseFloat(el.getAttribute('data-target') || '0');
  const suffix = el.getAttribute('data-suffix') || '';

  // Store original text to restore if target not set
  if (!el.getAttribute('data-target')) return;

  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = isDecimal
      ? current.toFixed(1) + (progress < 1 ? '' : suffix)
      : Math.floor(current) + (progress < 1 ? '' : suffix);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const heroStats = document.querySelector('#hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ─── Project Card 3D Tilt ─── */
document.querySelectorAll('.project-card').forEach(card => {
  card.style.perspective = '1000px';

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -7;
    const rotateY = ((x - rect.width / 2) / rect.width) * 7;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.12s ease';
    card.style.willChange = 'transform';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.willChange = 'auto';
  });
});

/* ─── Timeline Stagger ─── */
document.querySelectorAll('.timeline-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

/* ─── Cursor Glow (desktop only) ─── */
if (window.innerWidth > 768) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 20px; height: 20px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
    mix-blend-mode: screen;
    will-change: left, top;
  `;
  document.body.appendChild(cursor);

  let cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  }, { passive: true });

  document.querySelectorAll('a, button, .project-card, .contact-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '50px'; cursor.style.height = '50px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; });
  });
}

/* ─── Scroll Progress Bar ─── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; z-index: 9998;
  height: 3px; width: 0%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
  transition: width 0.1s linear;
  pointer-events: none;
  border-radius: 0 2px 2px 0;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((window.scrollY / total) * 100) + '%';
}, { passive: true });

/* ─── Badge Float Animation ─── */
const badge = document.querySelector('.hero-badge');
if (badge) {
  let t = 0;
  (function floatBadge() {
    t += 0.02;
    badge.style.transform = `translateY(${Math.sin(t) * 5}px)`;
    requestAnimationFrame(floatBadge);
  })();
}

/* ─── Skill category entrance stagger ─── */
document.querySelectorAll('.skill-category').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

/* ─── Badge pill hover ripple ─── */
document.querySelectorAll('.badge-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    pill.style.transform = 'scale(0.95)';
    setTimeout(() => { pill.style.transform = ''; }, 150);
  });
});
