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
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
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
  if (!canvas) return;
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   THREE.JS 3D INTERACTIVE WEBGL ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initThreeJS3DEngine() {
  const canvas = document.getElementById('webgl-canvas-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 32; // Pushed back so 3D core does not overlap center text

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 100);
  pointLight1.position.set(15, 15, 15);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 100);
  pointLight2.position.set(-15, -15, -10);
  scene.add(pointLight2);

  // Group container for rotation
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Cyber Core Object (Icosahedron + Wireframe Ring + Particles)
  const coreGroup = new THREE.Group();
  coreGroup.position.z = -5; // Spatial depth offset
  mainGroup.add(coreGroup);

  const geom = new THREE.IcosahedronGeometry(6, 2);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x6366f1,
    emissive: 0x111122,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    shininess: 100
  });
  const cyberMesh = new THREE.Mesh(geom, mat);
  coreGroup.add(cyberMesh);

  // Inner Core Sphere
  const innerGeom = new THREE.IcosahedronGeometry(3.5, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: false
  });
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  coreGroup.add(innerMesh);

  // Outer Torus Ring 1
  const torusGeom = new THREE.TorusGeometry(8.5, 0.08, 16, 100);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 });
  const torusRing1 = new THREE.Mesh(torusGeom, torusMat);
  torusRing1.rotation.x = Math.PI / 3;
  coreGroup.add(torusRing1);

  // Outer Torus Ring 2
  const torusRing2 = new THREE.Mesh(torusGeom, new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 }));
  torusRing2.rotation.y = Math.PI / 4;
  coreGroup.add(torusRing2);

  // Floating Particle Cloud
  const particleCount = 400;
  const pGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const pColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 60;
    positions[i + 1] = (Math.random() - 0.5) * 60;
    positions[i + 2] = (Math.random() - 0.5) * 60;

    pColors[i] = 0.38 + Math.random() * 0.2;     // R
    pColors[i + 1] = 0.4 + Math.random() * 0.4;  // G
    pColors[i + 2] = 0.95;                       // B
  }
  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeom.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const pointCloud = new THREE.Points(pGeom, pMat);
  mainGroup.add(pointCloud);

  // 2. Starfield Mode Object
  const starfieldGroup = new THREE.Group();
  starfieldGroup.visible = false;
  mainGroup.add(starfieldGroup);

  const starCount = 1200;
  const starGeom = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 120;
    starPos[i + 1] = (Math.random() - 0.5) * 120;
    starPos[i + 2] = (Math.random() - 0.5) * 120;
  }
  starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.4, color: 0x38bdf8, transparent: true, opacity: 0.8 });
  const starPoints = new THREE.Points(starGeom, starMat);
  starfieldGroup.add(starPoints);

  // 3. Grid Mode Object
  const gridGroup = new THREE.Group();
  gridGroup.visible = false;
  mainGroup.add(gridGroup);

  const gridHelper = new THREE.GridHelper(80, 40, 0x6366f1, 0x1e1e2d);
  gridHelper.position.y = -10;
  gridGroup.add(gridHelper);

  // Sync 3D Lights & Starfield Colors with Theme
  function update3DLights(theme) {
    if (theme === 'light') {
      ambientLight.intensity = 1.1;
      pointLight1.color.setHex(0x4f46e5);
      pointLight1.intensity = 3.0;
      pointLight2.color.setHex(0x0284c7);
      if (starMat) {
        starMat.color.setHex(0x4338ca); // Deep indigo stars in Light Mode
        starMat.size = 0.45;
      }
      mat.opacity = 0.2; // Soft translucent wireframe
    } else {
      ambientLight.intensity = 0.6;
      pointLight1.color.setHex(0x6366f1);
      pointLight1.intensity = 2.5;
      pointLight2.color.setHex(0x06b6d4);
      if (starMat) {
        starMat.color.setHex(0x38bdf8); // Bright cyan stars in Dark Mode
        starMat.size = 0.4;
      }
      mat.opacity = 0.35;
    }
  }
  update3DLights(document.documentElement.getAttribute('data-theme') || 'dark');
  window.addEventListener('themeChanged', e => update3DLights(e.detail.theme));

  // Mouse Interaction Smoothing
  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', e => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Scroll Interaction
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate3D() {
    requestAnimationFrame(animate3D);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Core rotations
    cyberMesh.rotation.x += 0.003;
    cyberMesh.rotation.y += 0.005;
    innerMesh.rotation.x -= 0.004;
    innerMesh.rotation.y -= 0.006;
    torusRing1.rotation.z += 0.008;
    torusRing2.rotation.z -= 0.008;

    pointCloud.rotation.y += 0.001;
    starPoints.rotation.y += 0.0005;

    // Parallax movement based on mouse & scroll
    mainGroup.rotation.y = mouseX * 0.35 + (scrollY * 0.0003);
    mainGroup.rotation.x = mouseY * 0.35;
    mainGroup.position.y = -(scrollY * 0.005);

    // Dynamic light movement
    pointLight1.position.x = Math.sin(Date.now() * 0.001) * 20;
    pointLight1.position.y = Math.cos(Date.now() * 0.0015) * 20;

    renderer.render(scene, camera);
  }
  animate3D();

  // Mode Switcher Controls Logic
  const toggleBtn = document.getElementById('btn-3d-toggle');
  const optionsMenu = document.getElementById('mode-options-3d');
  const currentLabel = document.getElementById('current-3d-mode');

  if (toggleBtn && optionsMenu) {
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      optionsMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      optionsMenu.classList.remove('active');
    });

    optionsMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        optionsMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (mode === 'cyber') {
          coreGroup.visible = true;
          starfieldGroup.visible = false;
          gridGroup.visible = false;
          currentLabel.textContent = 'Cyber Core';
        } else if (mode === 'starfield') {
          coreGroup.visible = false;
          starfieldGroup.visible = true;
          gridGroup.visible = false;
          currentLabel.textContent = 'Starfield Galaxy';
        } else if (mode === 'grid') {
          coreGroup.visible = false;
          starfieldGroup.visible = false;
          gridGroup.visible = true;
          currentLabel.textContent = 'Matrix Grid';
        }
      });
    });
  }
})();

/* ─── 3D Card Tilt & Glare Spotlight Interaction ─── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // Pass mouse coordinates to CSS glare spotlight
    card.style.setProperty('--glare-x', `${x}px`);
    card.style.setProperty('--glare-y', `${y}px`);

    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INTERACTIVE AI VOICE ASSISTANT ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initAIVoiceAssistant() {
  const fab = document.getElementById('btn-fab-voice');
  const overlay = document.getElementById('voice-modal-overlay');
  const closeBtn = document.getElementById('voice-modal-close');
  const micBtn = document.getElementById('btn-voice-mic');
  const micLabel = document.getElementById('mic-btn-label');
  const micIcon = document.getElementById('mic-icon');
  const chatBox = document.getElementById('voice-chat-box');
  const textInput = document.getElementById('voice-text-input');
  const sendBtn = document.getElementById('btn-voice-send');
  const waveform = document.getElementById('voice-waveform');

  // Pipeline flow step elements
  const pipeStt = document.getElementById('pipe-stt');
  const pipeGpt = document.getElementById('pipe-gpt');
  const pipeTools = document.getElementById('pipe-tools');
  const pipeTts = document.getElementById('pipe-tts');

  if (!fab || !overlay || !closeBtn) return;

  // Reset & Clear Chat Box
  function clearChatBox() {
    if (!chatBox) return;
    chatBox.innerHTML = `
      <div class="chat-message assistant">
        <i class="fas fa-robot msg-icon"></i>
        <div class="msg-content">
          <p>Hello! I am Ashutosh's AI Voice Assistant. Tap the microphone or select a topic below to speak with me!</p>
        </div>
      </div>
    `;
    setPipelineStep('gpt');
  }

  // Toggle Modal & Clear Chat on Close
  fab.addEventListener('click', () => overlay.classList.add('active'));
  
  function closeModal() {
    overlay.classList.remove('active');
    stopSpeechSynthesis();
    stopMic();
    clearChatBox();
  }

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Speech Recognition (STT) Setup
  let recognition = null;
  let isListening = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('listening');
      micLabel.textContent = 'Listening...';
      micIcon.className = 'fas fa-spinner fa-spin';
      setPipelineStep('stt');
    };

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      stopMic();
      handleUserQuery(transcript);
    };

    recognition.onerror = () => {
      stopMic();
      appendChatMessage('assistant', 'I could not hear that clearly. Please try again or type your question below.');
    };

    recognition.onend = () => {
      stopMic();
    };
  }

  function startMic() {
    if (recognition) {
      try { recognition.start(); } catch (err) {}
    } else {
      appendChatMessage('assistant', 'Speech Recognition is not supported in this browser. Please type your question below!');
    }
  }

  function stopMic() {
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (micLabel) micLabel.textContent = 'Tap to Speak';
    if (micIcon) micIcon.className = 'fas fa-microphone';
    if (recognition) { try { recognition.stop(); } catch (err) {} }
  }

  micBtn.addEventListener('click', () => {
    if (isListening) stopMic();
    else startMic();
  });

  // Text Input Submission
  sendBtn.addEventListener('click', () => submitTextInput());
  textInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitTextInput();
  });

  function submitTextInput() {
    const q = textInput.value.trim();
    if (!q) return;
    textInput.value = '';
    handleUserQuery(q);
  }

  // Quick Prompt Pills
  document.querySelectorAll('.voice-prompt-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const prompt = pill.getAttribute('data-prompt');
      handleUserQuery(prompt);
    });
  });

  // Pipeline Stage Highlighting
  function setPipelineStep(step) {
    [pipeStt, pipeGpt, pipeTools, pipeTts].forEach(el => el && el.classList.remove('active'));
    if (step === 'stt' && pipeStt) pipeStt.classList.add('active');
    if (step === 'gpt' && pipeGpt) pipeGpt.classList.add('active');
    if (step === 'tools' && pipeTools) pipeTools.classList.add('active');
    if (step === 'tts' && pipeTts) pipeTts.classList.add('active');
  }

  // Knowledge Base Response Engine
  function handleUserQuery(query) {
    appendChatMessage('user', query);
    setPipelineStep('gpt');

    setTimeout(() => {
      setPipelineStep('tools');

      setTimeout(() => {
        const response = generateAIResponse(query);
        appendChatMessage('assistant', response);
        setPipelineStep('tts');
        speakResponse(response);
      }, 450);
    }, 400);
  }

  function generateAIResponse(q) {
    const text = q.toLowerCase();

    if (text.includes('exp') || text.includes('techfino') || text.includes('work') || text.includes('role')) {
      return "Ashutosh is a Software Engineer at TechFino Capital in Bengaluru, building production Loan Management Systems in Node.js, Express, and React. He reduced manual HR effort by 85% via automated bulk ingestion pipelines!";
    }
    if (text.includes('bank') || text.includes('api') || text.includes('au bank') || text.includes('godrej') || text.includes('razorpay')) {
      return "Ashutosh has integrated key financial APIs including Godrej Finance, Credit Saison, AU Small Finance Bank for virtual accounts, and Razorpay for real-time bank verification & NACH mandate registrations.";
    }
    if (text.includes('stack') || text.includes('skill') || text.includes('technolog') || text.includes('language')) {
      return "Ashutosh's technical arsenal includes Node.js, Express.js, TypeScript, React.js, Angular, Python FastAPI, MySQL, MongoDB, AWS EC2/S3, Docker, and Swagger/OpenAPI.";
    }
    if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('reach') || text.includes('hire')) {
      return "You can contact Ashutosh directly via email at ashutoshkumar8701@gmail.com, call +91-8797994427, or connect on LinkedIn at linkedin.com/in/ashutosh-kumar21!";
    }
    if (text.includes('project') || text.includes('watchhub') || text.includes('mailblast') || text.includes('spendwise')) {
      return "Ashutosh has built 5 major production projects including WatchHub (React streaming app), MailBlast (bulk email engine), SpendWise (Angular expense tracker), and LoanFlow Engine (FastAPI underwriting pipeline).";
    }

    return `Thank you for asking! Ashutosh is a Full-Stack Software Engineer specializing in fintech backend architectures, Node.js, TypeScript, React, and Python FastAPI. Feel free to explore his projects or download his resume!`;
  }

  function appendChatMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    const icon = document.createElement('i');
    icon.className = sender === 'assistant' ? 'fas fa-robot msg-icon' : 'fas fa-user msg-icon';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'msg-content';
    contentDiv.innerHTML = `<p>${text}</p>`;

    msgDiv.appendChild(icon);
    msgDiv.appendChild(contentDiv);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Realistic Male Neural Voice Selector
  let cachedVoices = [];
  function loadVoices() {
    if ('speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  }
  loadVoices();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function getBestMaleVoice() {
    if (!cachedVoices.length) loadVoices();
    if (!cachedVoices.length) return null;

    const femaleKeywords = ['jenny', 'aria', 'samantha', 'zira', 'victoria', 'susan', 'karen', 'veena', 'hazel', 'heera', 'female', 'woman'];

    // 1. Top Tier Natural Male Neural Voices
    const maleNeuralVoice = cachedVoices.find(v => {
      const name = v.name.toLowerCase();
      const isFemale = femaleKeywords.some(kw => name.includes(kw));
      if (isFemale) return false;
      return (
        name.includes('guy') ||
        name.includes('christopher') ||
        name.includes('eric') ||
        name.includes('ryan') ||
        name.includes('mark') ||
        name.includes('daniel') ||
        name.includes('alex') ||
        name.includes('george') ||
        name.includes('david') ||
        (name.includes('google') && name.includes('male'))
      );
    });

    if (maleNeuralVoice) return maleNeuralVoice;

    // 2. Fallback: Any English Voice that is NOT Female
    const anyMaleEnVoice = cachedVoices.find(v => {
      const name = v.name.toLowerCase();
      const isFemale = femaleKeywords.some(kw => name.includes(kw));
      return v.lang.startsWith('en') && !isFemale;
    });

    return anyMaleEnVoice || cachedVoices.find(v => v.lang.startsWith('en')) || cachedVoices[0];
  }

  // Realistic Human Speech Synthesis with Emotional Pacing & Pauses
  let currentUtterances = [];

  function speakResponse(text) {
    if (!('speechSynthesis' in window)) return;
    stopSpeechSynthesis();

    // Clean text formatting
    const cleanText = text
      .replace(/[*_#`]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/\s+/g, ' ')
      .trim();

    // Break text into natural human speech clauses for expressive pacing & pauses
    const clauses = cleanText.match(/[^.!?;,]+[.!?;,]?/g) || [cleanText];
    const maleVoice = getBestMaleVoice();

    if (waveform) waveform.classList.add('speaking');

    let index = 0;

    function speakNextClause() {
      if (index >= clauses.length) {
        if (waveform) waveform.classList.remove('speaking');
        setPipelineStep('gpt');
        return;
      }

      const clauseText = clauses[index].trim();
      if (!clauseText) {
        index++;
        speakNextClause();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clauseText);
      if (maleVoice) utterance.voice = maleVoice;

      // Conversational Male Pitch & Pacing
      utterance.rate = 0.94;  // Thoughtful, natural human speed
      utterance.pitch = 0.97; // Deep male voice pitch

      utterance.onend = () => {
        index++;
        // Micro-pause between thoughts (220ms pause for natural human breathing)
        setTimeout(speakNextClause, 220);
      };

      utterance.onerror = () => {
        index++;
        speakNextClause();
      };

      window.speechSynthesis.speak(utterance);
    }

    speakNextClause();
  }

  function stopSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (waveform) waveform.classList.remove('speaking');
  }
})();



