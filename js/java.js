/**
 * ==========================================================================
 * MAIN.JS - CORE PORTFOLIO ENGINE
 * Includes: Theme Engine, Web Audio Synthesizer, Canvas Ambient Stars,
 * Typewriter Effect, Custom Cursor, Hanoi Live Clock, and Navigation Dock.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initThemeEngine();
  initLiveClock();
  initTypewriter();
  initCustomCursor();
  initAmbientCanvas();
  initNavigation();
  initScrollTopProgress();
  initCommandPalette();
});

/* 1. WEB AUDIO SYNTHESIZER (Tự tạo âm thanh, không cần tải file ngoài) */
let audioCtx = null;
let soundEnabled = true;

function initAudioEngine() {
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playSfx = function(type = 'click') {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {}
  };

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundIcon) soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.title = soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt';
      if (soundEnabled) window.playSfx('click');
    });
  }

  document.querySelectorAll('button, .btn, .nav-link, .filter-btn, .tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => window.playSfx('hover'));
    el.addEventListener('click', () => window.playSfx('click'));
  });
}

/* 2. THEME ENGINE */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themes = ['cyber', 'aurora', 'light'];
  
  let currentTheme = localStorage.getItem('portfolio-theme') || 'cyber';
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let idx = themes.indexOf(currentTheme);
      idx = (idx + 1) % themes.length;
      currentTheme = themes[idx];
      applyTheme(currentTheme);
      localStorage.setItem('portfolio-theme', currentTheme);
      if (window.playSfx) window.playSfx('click');
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (!themeIcon) return;
    if (theme === 'cyber') themeIcon.textContent = '🌙';
    else if (theme === 'aurora') themeIcon.textContent = '🌌';
    else themeIcon.textContent = '☀️';
  }
}

/* 3. LIVE CLOCK GMT+7 */
function initLiveClock() {
  const clockEl = document.getElementById('liveHanoiClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockEl.textContent = new Intl.DateTimeFormat('vi-VN', options).format(now);
  }

  update();
  setInterval(update, 1000);
}

/* 4. TYPEWRITER EFFECT */
function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const roles = [
    'Frontend Developer',
    'Creative UI/UX Engineer',
    'Fullstack Web Enthusiast',
    'Computer Science Student'
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false, delay = 120;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 50;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* 5. CUSTOM CURSOR */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  renderFollower();

  document.querySelectorAll('a, button, input, select, textarea, .bento-card, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

/* 6. AMBIENT PARTICLES CANVAS */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 45 : 20, 50);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* 7. NAVIGATION DOCK & DRAWER */
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.drawer-links a');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.playSfx) window.playSfx('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
          else link.classList.remove('active');
        });
      }
    });
  }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* 8. SCROLL-TO-TOP VỚI TIẾN TRÌNH */
function initScrollTopProgress() {
  const btn = document.getElementById('scrollTopBtn');
  const circle = document.querySelector('.scroll-top-btn circle.progress');
  if (!btn || !circle) return;

  const circumference = 2 * Math.PI * 20;
  circle.style.strokeDasharray = `${circumference}`;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / (docHeight || 1), 0), 1);

    circle.style.strokeDashoffset = circumference - progress * circumference;

    if (scrollTop > 350) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.playSfx) window.playSfx('click');
  });
}

/* 9. COMMAND PALETTE (CTRL + K) */
function initCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  const openBtns = document.querySelectorAll('.cmd-k-btn, #openCmdPaletteBtn');
  const closeBtn = document.getElementById('closeCmdModalBtn');
  const searchInput = document.getElementById('cmdSearchInput');
  const resultList = document.getElementById('cmdResultList');

  if (!modal) return;

  const commands = [
    { name: 'Giới thiệu bản thân & Mục tiêu', href: '#intro', tag: 'Section' },
    { name: 'Kỹ năng chuyên môn (Skills Matrix)', href: '#skills', tag: 'Section' },
    { name: 'Hành trình học vấn & Kinh nghiệm', href: '#journey', tag: 'Section' },
    { name: 'Dự án cá nhân tiêu biểu', href: '#projects', tag: 'Section' },
    { name: 'Chứng chỉ, Giải thưởng & Sở thích', href: '#extras', tag: 'Section' },
    { name: 'Liên hệ & Gửi tin nhắn trực tiếp', href: '#contact', tag: 'Section' },
    { name: 'Dự án: DevPulse Analytics Platform', href: '#projects', tag: 'Project' },
    { name: 'Dự án: Nexus AI Agent Platform', href: '#projects', tag: 'Project' },
    { name: 'Dự án: EcoSmart IoT Telemetry', href: '#projects', tag: 'Project' }
  ];

  function openModal() {
    modal.classList.add('active');
    if (searchInput) {
      searchInput.value = '';
      renderList(commands);
      setTimeout(() => searchInput.focus(), 80);
    }
    if (window.playSfx) window.playSfx('open');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closeModal() : openModal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  function renderList(items) {
    if (!resultList) return;
    if (items.length === 0) {
      resultList.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-dim);">Không tìm thấy kết quả phù hợp</div>`;
      return;
    }

    resultList.innerHTML = items.map(item => `
      <a href="${item.href}" class="cmd-item" style="
        display:flex; justify-content:space-between; align-items:center;
        padding:0.75rem 1rem; border-radius:8px; text-decoration:none;
        color:var(--text-main); background:rgba(255,255,255,0.03); margin-bottom:0.4rem;
        transition:all 0.15s ease; border:1px solid rgba(255,255,255,0.05);
      ">
        <span style="font-weight:600; font-size:0.92rem;">${item.name}</span>
        <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--accent-cyan); background:rgba(6,182,212,0.1); padding:0.2rem 0.5rem; border-radius:4px;">${item.tag}</span>
      </a>
    `).join('');

    resultList.querySelectorAll('.cmd-item').forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.background = 'rgba(6, 182, 212, 0.15)';
        link.style.borderColor = 'var(--accent-cyan)';
      });
      link.addEventListener('mouseleave', () => {
        link.style.background = 'rgba(255,255,255,0.03)';
        link.style.borderColor = 'rgba(255,255,255,0.05)';
      });
      link.addEventListener('click', closeModal);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = commands.filter(c => c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q));
      renderList(filtered);
    });
  }
}