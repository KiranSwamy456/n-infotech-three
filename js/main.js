  /* ======================================
     LIVE BLOOMBERG TICKER
  ====================================== */
  const TICKER_DATA = [
    { label:'ACCURACY',        value:99.4,  suffix:'%',   dec:1, color:'#10b981', arrow:'▲' },
    { label:'PROJECTS',        value:500,   suffix:'+',   dec:0, color:'#0a84ff', arrow:'▲' },
    { label:'CLIENT NPS',      value:72,    suffix:'',    dec:0, color:'#06b6d4', arrow:'▲' },
    { label:'AVG ROI',         value:340,   suffix:'%',   dec:0, color:'#10b981', arrow:'▲' },
    { label:'FRAUD REDUCTION', value:76,    suffix:'%',   dec:0, color:'#0a84ff', arrow:'▲' },
    { label:'UPTIME SLA',      value:99.9,  suffix:'%',   dec:1, color:'#10b981', arrow:'▲' },
    { label:'COMPANIES',       value:150,   suffix:'+',   dec:0, color:'#06b6d4', arrow:'▲' },
    { label:'SATISFACTION',    value:99,    suffix:'%',   dec:0, color:'#10b981', arrow:'▲' },
    { label:'DATA PTS/DAY',    value:10,    suffix:'M+',  dec:0, color:'#7c3aed', arrow:'▲' },
    { label:'INFERENCE',       value:40,    suffix:'ms',  dec:0, color:'#f59e0b', arrow:'▼' },
    { label:'DEFECT DROP',     value:89,    suffix:'%',   dec:0, color:'#10b981', arrow:'▲' },
    { label:'COST SAVED',      value:12,    suffix:'M$+', dec:0, color:'#06b6d4', arrow:'▲' },
  ];

  let tickerValues = TICKER_DATA.map(t => t.value);

  function buildTickerHTML() {
    const all = [...TICKER_DATA, ...TICKER_DATA]; // duplicate for seamless loop
    return all.map((t, i) => {
      const val = tickerValues[i % TICKER_DATA.length];
      const base = TICKER_DATA[i % TICKER_DATA.length].value;
      const isUp = val >= base;
      const displayColor = t.arrow === '▼'
        ? (val <= base ? '#10b981' : '#ef4444')
        : (isUp ? t.color : '#ef4444');
      const displayed = t.dec > 0 ? val.toFixed(t.dec) : Math.floor(val);
      return `<span class="ticker-item">
        <span class="ticker-item-label">${t.label}</span>
        <span class="ticker-item-arrow" style="color:${displayColor}">${t.arrow}</span>
        <span class="ticker-item-value" style="color:${displayColor}">${displayed}${t.suffix}</span>
        <span class="ticker-sep">·</span>
      </span>`;
    }).join('');
  }

  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    tickerTrack.innerHTML = buildTickerHTML();

    setInterval(() => {
      tickerValues = tickerValues.map((v, i) => {
        const base = TICKER_DATA[i].value;
        const dec  = TICKER_DATA[i].dec;
        const jitter = (Math.random() - 0.5) * (dec === 0 ? 2 : 0.2);
        return parseFloat(Math.max(base * 0.97, v + jitter).toFixed(dec));
      });
      tickerTrack.innerHTML = buildTickerHTML();
    }, 1800);
  }

  /* ======================================  AOS  */
  AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 60 });

  /* ======================================  NAVBAR  */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    const btn = document.getElementById('backTop');
    if (window.scrollY > 60) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    updateProcessLine();
  });

  /* ======================================  MOBILE MENU  */
  document.getElementById('navToggle').addEventListener('click', () => {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('navIcon');
    menu.classList.toggle('open');
    icon.className = menu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
  });
  document.querySelectorAll('.nav-link-c').forEach(l => {
    l.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('navIcon').className = 'fas fa-bars';
    });
  });

  /* ======================================  COUNTER  */
  let counted = false;
  const animateCounter = (el, target, suffix) => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
  };
  const checkCounters = () => {
    if (counted) return;
    const el = document.getElementById('stats');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      counted = true;
      document.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
      });
    }
  };
  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters();

  /* ======================================  TYPING EFFECT  */
  const words = ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP Solutions', 'Predictive Analytics'];
  let wi = 0, ci = 0, del = false;
  const typed = document.getElementById('typedWord');
  setInterval(() => {
    const w = words[wi];
    if (!del) {
      typed.textContent = w.slice(0, ++ci);
      if (ci >= w.length) { del = true; setTimeout(() => {}, 1500); }
    } else {
      typed.textContent = w.slice(0, --ci);
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
    }
  }, del ? 60 : 90);

  /* ======================================  PARTICLES  */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.8 + 0.3, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, opacity: Math.random() * 0.5 + 0.1 });
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,132,255,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();

  /* ======================================  PORTFOLIO FILTER  */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.port-item').forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.cat !== filter);
      });
    });
  });

  /* ======================================  CONTACT FORM  */
  function selectBudget(el) {
    document.querySelectorAll('.budget-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  }
  function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const txt = document.getElementById('submitTxt');
    btn.style.opacity = '0.7';
    txt.textContent = 'Sending...';
    setTimeout(() => {
      document.getElementById('contactFormBody').classList.add('hidden');
      document.getElementById('successMsg').classList.add('show');
    }, 1500);
  }
  function resetForm() {
    document.getElementById('contactFormBody').classList.remove('hidden');
    document.getElementById('successMsg').classList.remove('show');
    const btn = document.getElementById('submitBtn');
    document.getElementById('submitTxt').textContent = 'Send Project Brief';
    btn.style.opacity = '1';
  }

  /* ======================================
     PROCESS TIMELINE ANIMATIONS
  ====================================== */
  const processSection = document.getElementById('process');
  const ptlFill = document.getElementById('ptlFill');
  const ptlRows = document.querySelectorAll('.ptl-row');
  const pmItems = document.querySelectorAll('.pm-item');
  const revealedSteps = new Set();

  /* Scroll-driven fill line */
  function updateProcessLine() {
    if (!processSection || !ptlFill) return;
    const rect = processSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    const progress = Math.min(Math.max((-rect.top / (rect.height - windowH)) * 100, 0), 100);
    ptlFill.style.height = progress + '%';
  }

  /* IntersectionObserver for step rows (desktop) */
  if (ptlRows.length) {
    const rowObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const row = entry.target;
        const stepIdx = parseInt(row.dataset.step);
        if (revealedSteps.has(stepIdx)) return;
        revealedSteps.add(stepIdx);

        setTimeout(() => {
          /* Animate card */
          const anim = row.querySelector('.ptl-anim');
          if (anim) anim.classList.add('revealed');

          /* Animate node */
          const node = row.querySelector('.ptl-node');
          const pulse = row.querySelector('.ptl-pulse');
          const badge = row.querySelector('.ptl-badge');
          const bar = row.querySelector('.ptl-bar');
          const color = node ? node.dataset.color : null;

          if (node && color) {
            node.style.borderColor = color;
            node.style.background = color + '22';
            node.style.transition = 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
            node.style.filter = 'drop-shadow(0 0 12px ' + color + '80)';
            node.style.transform = 'scale(1)';
          }
          if (pulse) { pulse.style.display = 'block'; }
          if (badge) {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0) scale(1)';
          }
          if (bar) { bar.style.width = '100%'; }

          /* Card border highlight */
          const card = row.querySelector('.ptl-card');
          if (card) {
            card.style.borderColor = card.dataset.border || 'rgba(10,132,255,0.35)';
            card.onmouseenter = () => {
              card.style.borderColor = card.dataset.color;
              card.style.transform = 'translateY(-6px)';
              card.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4), 0 0 30px ' + card.dataset.color + '25';
            };
            card.onmouseleave = () => {
              card.style.borderColor = card.dataset.border;
              card.style.transform = 'translateY(0)';
              card.style.boxShadow = 'none';
            };
          }
        }, stepIdx * 80);
      });
    }, { threshold: 0.2 });

    ptlRows.forEach(row => {
      const node = row.querySelector('.ptl-node');
      if (node) node.style.transform = 'scale(0.5)';
      rowObs.observe(row);
    });
  }

  /* IntersectionObserver for mobile items */
  if (pmItems.length) {
    const mobileObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        const stepIdx = parseInt(item.dataset.step);
        setTimeout(() => { item.classList.add('revealed'); }, stepIdx * 80);
      });
    }, { threshold: 0.2 });
    pmItems.forEach(item => mobileObs.observe(item));
  }

  /* Initial call */
  updateProcessLine();

  /* ======================================  SMOOTH SCROLL  */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
