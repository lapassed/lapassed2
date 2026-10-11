/* =========================================================
   La Passe D — interactions & animations
   ========================================================= */

/* --- Prochain tournoi ---------------------------------------
   date: null → état « Bientôt... ».
   Sinon une date ISO avec fuseau, ex. '2026-11-21T10:00:00+01:00'. */
const NEXT_EVENT = {
  date: null
};

/* --- Alerte email -------------------------------------------
   URL d'un service compatible site statique (Formspree, Brevo, …)
   qui accepte un POST avec le champ « email ».
   null → le formulaire affiche seulement la confirmation (aucun envoi). */
const ALERT_ENDPOINT = null;

(() => {
  const doc = document.documentElement;
  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const cl = v => Math.min(1, Math.max(0, v));

  /* ---------- Thème ---------- */
  const themeBtn = q('[data-theme-toggle]');
  const syncThemeLabel = () => themeBtn && themeBtn.setAttribute('aria-label', doc.dataset.theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
  syncThemeLabel();
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const t = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    doc.dataset.theme = t;
    try { localStorage.setItem('lpd-theme', t); } catch (e) {}
    syncThemeLabel();
  });

  /* ---------- Menu mobile ---------- */
  const menu = q('[data-menu]'), burger = q('[data-menu-open]');
  const setMenu = open => {
    if (!menu) return;
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
    (open ? q('[data-menu-close]') : burger)?.focus();
  };
  if (burger) burger.addEventListener('click', () => setMenu(true));
  q('[data-menu-close]')?.addEventListener('click', () => setMenu(false));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });
  addEventListener('resize', () => { if (innerWidth >= 900 && menu && !menu.hidden) setMenu(false); });

  /* ---------- Prochain tournoi / compte à rebours ---------- */
  const target = NEXT_EVENT.date ? new Date(NEXT_EVENT.date).getTime() : NaN;
  const cdBox = q('[data-countdown]');
  const units = [['Jours', 86400], ['Heures', 3600], ['Min', 60], ['Sec', 1]];
  let cdTiles = null;

  const showNext = has => {
    qa('[data-next-soon]').forEach(el => { el.hidden = has; });
    qa('[data-next-dated]').forEach(el => { el.hidden = !has; });
  };

  const renderCountdown = () => {
    const d = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const vals = [Math.floor(d / 86400), Math.floor(d % 86400 / 3600), Math.floor(d % 3600 / 60), d % 60].map(v => String(v).padStart(2, '0'));
    if (!cdTiles || cdTiles[0].length !== vals[0].length) {
      cdBox.textContent = '';
      cdTiles = units.map(([label], i) => {
        const u = document.createElement('div'); u.className = 'cd-unit';
        const g = document.createElement('div'); g.className = 'cd-digits';
        const tiles = vals[i].split('').map(() => { const t = document.createElement('div'); t.className = 'cd-tile'; g.appendChild(t); return t; });
        const l = document.createElement('div'); l.className = 'cd-label'; l.textContent = label;
        u.append(g, l); cdBox.appendChild(u);
        return tiles;
      });
    }
    vals.forEach((v, i) => v.split('').forEach((c, j) => {
      const t = cdTiles[i][j];
      if (t.textContent === c) return;
      t.textContent = c;
      t.classList.remove('flip-in'); void t.offsetWidth; t.classList.add('flip-in');
    }));
    cdBox.setAttribute('aria-label', `${+vals[0]} jours, ${+vals[1]} heures, ${+vals[2]} minutes`);
    return d > 0;
  };

  if (!isNaN(target) && target > Date.now()) {
    showNext(true);
    renderCountdown();
    const timer = setInterval(() => { if (!renderCountdown()) { clearInterval(timer); showNext(false); } }, 1000);
  }

  /* ---------- Cartes retournées (tactile) ---------- */
  qa('[data-flip]').forEach(card => card.addEventListener('click', e => {
    if (fine || e.target.closest('a')) return;
    card.classList.toggle('is-flipped');
  }));

  /* ---------- FAQ ---------- */
  const faqItems = qa('[data-faq] .faq-item');
  faqItems.forEach(item => item.querySelector('button').addEventListener('click', () => {
    const open = !item.classList.contains('is-open');
    faqItems.forEach(other => {
      const on = other === item && open;
      other.classList.toggle('is-open', on);
      other.querySelector('button').setAttribute('aria-expanded', String(on));
    });
  }));

  /* ---------- Alerte email ---------- */
  const form = q('[data-alert-form]'), ok = q('[data-alert-ok]'), err = q('[data-alert-error]');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const input = form.querySelector('input[type=email]');
    err.hidden = true;
    if (!input.checkValidity() || !/\S+@\S+\.\S+/.test(input.value)) {
      err.textContent = 'Entre une adresse email valide.'; err.hidden = false; input.focus(); return;
    }
    const btn = form.querySelector('button'); btn.disabled = true;
    try {
      if (ALERT_ENDPOINT) {
        const res = await fetch(ALERT_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error(res.status);
      }
      form.hidden = true; ok.hidden = false;
    } catch (_) {
      err.textContent = 'Oups, l\'inscription n\'a pas fonctionné. Réessaie dans un instant.'; err.hidden = false;
    } finally { btn.disabled = false; }
  });

  /* ---------- Titre lettre par lettre ---------- */
  const split = () => {
    if (reduced || !Element.prototype.animate) return;
    let n = 0;
    qa('[data-split]').forEach(el => {
      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      const walk = node => Array.from(node.childNodes).forEach(c => {
        if (c.nodeType === 1) return walk(c);
        if (c.nodeType !== 3 || !c.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
          const ws = document.createElement('span');
          ws.style.cssText = 'display:inline-block;white-space:nowrap';
          ws.setAttribute('aria-hidden', 'true');
          for (const ch of w) {
            const l = document.createElement('span'); l.textContent = ch; l.style.display = 'inline-block'; ws.appendChild(l);
            l.animate([
              { opacity: 0, transform: 'translateY(.55em) rotate(6deg)', filter: 'blur(6px)' },
              { opacity: 1, transform: 'none', filter: 'blur(0)' }
            ], { duration: 760, delay: 250 + n++ * 26, easing: EASE, fill: 'backwards' });
          }
          frag.appendChild(ws);
        });
        c.replaceWith(frag);
      });
      walk(el);
    });
  };

  /* ---------- Intro : chute du ballon + fondus ---------- */
  const intro = () => {
    if (reduced || !Element.prototype.animate) return;
    q('[data-ball-intro]')?.animate([
      { transform: 'translateY(-120vh) rotate(-90deg)' },
      { transform: 'translateY(0) scale(1.1,.88)', offset: .5 },
      { transform: 'translateY(-16%) scale(.97,1.03)', offset: .66 },
      { transform: 'translateY(0) scale(1.05,.94)', offset: .8 },
      { transform: 'translateY(-5%)', offset: .9 },
      { transform: 'none' }
    ], { duration: 1600, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'backwards' });
    qa('[data-intro]').forEach((el, i) => el.animate(
      [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, delay: 900 + i * 140, easing: EASE, fill: 'backwards' }));
  };

  /* ---------- Apparitions au scroll ---------- */
  const reveals = () => {
    if (reduced || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const from = { up: { opacity: '0', transform: 'translateY(56px)' }, mask: { clipPath: 'inset(100% 0 0 0)' } };
    // Un élément entièrement rogné par clip-path n'est jamais « visible » pour l'observer :
    // pour les masques, on observe le parent.
    const targets = new Map();
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = targets.get(e.target);
      const k = el.dataset.reveal === 'mask' ? 'mask' : 'up', f = from[k];
      const to = k === 'mask' ? { clipPath: 'inset(0% 0 0 0)' } : { opacity: 1, transform: 'none' };
      el.animate([f, to], { duration: k === 'mask' ? 1200 : 900, delay: +(el.dataset.delay || 0), easing: EASE, fill: 'backwards' });
      Object.keys(f).forEach(p => { el.style[p] = ''; });
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    qa('[data-reveal]').forEach(el => {
      if (el.hidden || el.getBoundingClientRect().top < innerHeight * 0.92) return;
      const mask = el.dataset.reveal === 'mask', obs = mask ? el.parentElement : el;
      Object.assign(el.style, from[mask ? 'mask' : 'up']);
      targets.set(obs, el);
      io.observe(obs);
    });
  };

  /* ---------- Compteurs ---------- */
  const counters = () => {
    if (reduced || !('IntersectionObserver' in window)) return;
    qa('[data-count]').forEach(el => {
      const to = +el.dataset.count, fr = +(el.dataset.from || 0);
      el.textContent = String(fr);
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const t0 = performance.now(), d = 1700;
        const step = now => {
          const p = Math.min(1, (now - t0) / d);
          el.textContent = String(Math.round(fr + (to - fr) * (1 - Math.pow(1 - p, 4))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.5 });
      io.observe(el);
    });
  };

  /* ---------- Demi-terrain du 3x3 qui se trace ---------- */
  const draws = () => {
    if (reduced || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    qa('[data-draw-on]').forEach(svg => {
      const paths = Array.from(svg.querySelectorAll('path')), dots = Array.from(svg.querySelectorAll('[data-pop]'));
      paths.forEach(p => { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
      dots.forEach(d => { d.style.transformBox = 'fill-box'; d.style.transformOrigin = 'center'; d.style.opacity = '0'; });
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        paths.forEach((p, i) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
          { duration: 1300, delay: i * 140, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' }));
        dots.forEach((d, i) => d.animate([
          { opacity: 0, transform: 'scale(0)' },
          { opacity: 1, transform: 'scale(1.25)', offset: .7 },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 600, delay: 1100 + i * 110, easing: 'ease-out', fill: 'forwards' }));
      }, { threshold: 0.35 });
      io.observe(svg);
    });
  };

  /* ---------- Boutons magnétiques, ripple, curseur ---------- */
  const pointer = () => {
    document.addEventListener('pointerdown', e => {
      const el = e.target.closest('[data-magnetic]');
      if (!el || reduced || !el.animate) return;
      const r = el.getBoundingClientRect(), sz = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = `left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px;width:${sz}px;height:${sz}px`;
      el.appendChild(s);
      s.animate([{ transform: 'scale(0)', opacity: .3 }, { transform: 'scale(1)', opacity: 0 }], { duration: 650, easing: 'ease-out' }).onfinish = () => s.remove();
    });
    if (!fine || reduced) return;

    let mag = null;
    document.addEventListener('pointermove', e => {
      const el = e.target.closest ? e.target.closest('[data-magnetic]') : null;
      if (mag && mag !== el) mag.style.transform = '';
      mag = el; if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { if (mag) mag.style.transform = ''; mag = null; });

    const cur = q('[data-cursor]'), inner = q('[data-cursor-in]');
    if (!cur) return;
    cur.style.display = 'block'; doc.classList.add('lpd-cursor');
    let mx = -100, my = -100, x = -100, y = -100, rot = 0, running = false, hot = null;
    const loop = () => {
      const dx = mx - x, dy = my - y; x += dx * 0.22; y += dy * 0.22; rot += dx * 0.6;
      cur.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg)`;
      running = Math.abs(dx) + Math.abs(dy) > 0.3;
      if (running) requestAnimationFrame(loop);
    };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY; kick();
      const h = !!(e.target.closest && e.target.closest('a,button,input,[data-flip],[data-magnetic]'));
      if (h !== hot) { hot = h; inner.style.transform = h ? 'scale(1.9)' : 'scale(1)'; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { mx = my = -100; kick(); });
  };

  /* ---------- Bandeau partenaires ---------- */
  const marquee = () => {
    const m = q('[data-marquee]');
    if (!m || reduced || !m.animate) return;
    const a = m.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 32000, iterations: Infinity });
    m.addEventListener('mouseenter', () => { a.playbackRate = 0.3; });
    m.addEventListener('mouseleave', () => { a.playbackRate = 1; });
  };

  /* ---------- Boucle scroll : ballon, terrain, nav, hero, galerie ---------- */
  const ball = q('[data-ball]'), spin = q('[data-ball-spin]'), nav = q('[data-nav]');
  const gal = q('[data-gallery]'), track = q('[data-track]'), zooms = qa('[data-zoom]');
  const court = qa('[data-bgcourt] path'), heroInner = q('[data-hero-inner]');
  const mission = q('[data-sec="mission"]'), events = q('[data-sec="events"]'), rim = q('[data-rim]');
  let K = null, k7 = null, galTop = 0, galLen = 0, lastY = null, navSolid = null;
  let maxScroll = 1, cards = [], zIdx = null, last = {};

  /* Hauteur d'écran « stable » : sur mobile, la barre d'adresse qui apparaît/disparaît
     change innerHeight au scroll. On l'ignore (sinon tout se recalcule et la page saute). */
  let vw = innerWidth, vh = innerHeight;
  const viewportChanged = () => {
    const w = innerWidth, h = innerHeight;
    if (w === vw && Math.abs(h - vh) < 160) return false;
    vw = w; vh = h; return true;
  };

  const measure = () => {
    const W = vw, H = vh, sy = scrollY, mob = W < 900;
    const top = el => el.getBoundingClientRect().top + sy;
    if (gal && track) {
      if (reduced) galLen = 0;
      else {
        galLen = Math.max(0, track.offsetWidth - W);
        const h = Math.round(H + galLen) + 'px';
        if (gal.style.height !== h) gal.style.height = h;
      }
      galTop = top(gal);
      // centre de chaque photo dans la piste, pour calculer la parallaxe sans relire le DOM
      cards = zooms.map(z => ({ z, img: z.querySelector('img'), c: z.offsetLeft + z.offsetWidth / 2 }));
    }
    const maxY = document.documentElement.scrollHeight - H;
    maxScroll = Math.max(1, maxY);
    const s0 = mob ? Math.min(W * 0.52, 260) : Math.min(W * 0.32, 470);
    const k0 = { y: 0, x: mob ? W * 0.78 : W * 0.75, cy: mob ? H * 0.27 : H * 0.42, s: s0, o: 1 };
    if (reduced || !mission || !rim || !events) { K = [k0, { ...k0, y: H * 0.8, o: 0 }]; k7 = null; return; }
    // sur mobile, ballon géant plus raisonnable : une texture de plusieurs milliers de px fait saccader les téléphones
    const big = mob ? Math.max(W, H) * 1.05 : Math.hypot(W, H) * 1.35, g = mob ? 28 : 56, gs = mob ? 34 : 54;
    const mt = top(mission), mb = mt + mission.offsetHeight;
    const r = rim.getBoundingClientRect(), rx = r.left + r.width / 2, ry = r.top + sy + r.height / 2, bs = r.width * 0.74;
    const k = Math.min(ry - H * 0.55, maxY - 200);
    K = [k0,
      { y: mt - H * 0.45, x: W * 0.5, cy: H * 0.5, s: big, o: 0.08 },
      { y: mb - H * 1.05, x: W * 0.5, cy: H * 0.5, s: big, o: 0.08 },
      { y: galTop, x: g, cy: H - g - 12, s: gs, o: 1 },
      { y: galTop + galLen, x: W - g, cy: H - g - 12, s: gs, o: 1, ex: 'lin' },
      { y: top(events), x: W - g * 0.8, cy: H * 0.62, s: gs, o: 1, drib: 1 },
      { y: k - 320, x: rx - (mob ? 120 : 240), doc: ry - 280, s: bs, o: 1 },
      { y: k, x: rx, doc: ry - bs * 0.2, s: bs, o: 1, ex: 'out', ey: 'in' },
      { y: k + 180, x: rx, doc: ry + bs * 1.05, s: bs * 0.96, o: 1, ey: 'in' }];
    for (let i = 1; i < K.length; i++) if (K[i].y <= K[i - 1].y) K[i].y = K[i - 1].y + 1;
    k7 = K[7].y;
  };

  const E = { io: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, in: t => t * t, out: t => 1 - (1 - t) * (1 - t), lin: t => t };

  const swish = () => {
    const net = q('[data-net]'), sw = q('[data-swish]');
    if (net && net.animate) net.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(.86,1.28)' }, { transform: 'scale(1.04,.94)' }, { transform: 'scale(1,1)' }], { duration: 650, easing: EASE });
    if (sw && sw.animate) sw.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none', offset: .25 }, { opacity: 1, offset: .75 }, { opacity: 0, transform: 'translateY(-12px)' }], { duration: 1600, easing: 'ease-out' });
  };

  // n'écrit un style que s'il a changé
  const set = (el, k, prop, v) => { if (last[k] !== v) { last[k] = v; el.style[prop] = v; } };

  const update = () => {
    const y = scrollY, W = vw, H = vh;

    if (K && ball) {
      let i = 0; while (i < K.length - 2 && y > K[i + 1].y) i++;
      const a = K[i], b = K[i + 1] || a, t = b.y === a.y ? 1 : cl((y - a.y) / (b.y - a.y));
      const ex = E[b.ex || 'io'](t), ey = E[b.ey || 'io'](t), eg = E.io(t);
      const ca = a.doc != null ? a.doc - y : a.cy, cb = b.doc != null ? b.doc - y : b.cy;
      const x = a.x + (b.x - a.x) * ex;
      let cy = ca + (cb - ca) * ey;
      const s = a.s + (b.s - a.s) * eg, o = a.o + (b.o - a.o) * eg;
      if (a.drib) cy -= Math.abs(Math.sin((y - a.y) / 85)) * (W < 900 ? 46 : 84) * Math.sin(Math.PI * t);
      ball.style.transform = `translate3d(${(x - 300).toFixed(1)}px,${(cy - 300).toFixed(1)}px,0) scale(${(s / 600).toFixed(4)})`;
      set(ball, 'bo', 'opacity', o.toFixed(3));
      const z = (s > 320 || y < H * 0.85) ? -1 : 30;
      if (z !== zIdx) { zIdx = z; ball.style.zIndex = z; }
      if (spin) spin.style.transform = `rotate(${(y * 0.32).toFixed(1)}deg)`;
      if (k7 != null && lastY != null && lastY < k7 && y >= k7) swish();
      lastY = y;
    }

    if (!reduced && court.length) {
      const p = y / maxScroll, n = court.length;
      // sur écran tactile, précision réduite : le grand SVG fixe n'est repeint que tous les ~1 % de page
      court.forEach((el, j) => set(el, 'c' + j, 'strokeDashoffset', (1 - cl((p * 1.15 - j / n * 0.55) / 0.3)).toFixed(fine ? 3 : 2)));
    }

    if (nav) {
      const solid = y > 30;
      if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('is-solid', solid); }
    }

    if (!reduced && heroInner && (y < H * 1.2 || last.hy !== 'done')) {
      const hp = cl(y / (H * 0.9));
      heroInner.style.transform = `translate3d(0,${(Math.min(y, H * 1.2) * 0.18).toFixed(1)}px,0)`;
      set(heroInner, 'ho', 'opacity', (1 - hp * 0.9).toFixed(3));
      last.hy = y < H * 1.2 ? '' : 'done';
    }

    // galerie : seulement quand elle est à l'écran
    if (!reduced && track && galLen > 0 && y > galTop - H && y < galTop + galLen + H) {
      const tx = cl((y - galTop) / galLen) * galLen;
      track.style.transform = `translate3d(${(-tx).toFixed(1)}px,0,0)`;
      cards.forEach(({ z, img, c }) => {
        const off = (c - tx - W / 2) / W;
        if (Math.abs(off) > 1.4) return;
        z.style.transform = `scale(${(1 - Math.min(Math.abs(off), 1) * 0.08).toFixed(4)})`;
        if (img) img.style.transform = `translate3d(${(-off * 9).toFixed(2)}%,0,0) scale(1.18)`;
      });
    }
  };

  /* ---------- Démarrage ---------- */
  split(); reveals(); counters(); draws(); pointer(); marquee(); intro();

  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  const re = () => { measure(); update(); };
  addEventListener('resize', () => { if (viewportChanged()) re(); });
  requestAnimationFrame(re);
  if (document.fonts) document.fonts.ready.then(re);
  addEventListener('load', re);
  if ('ResizeObserver' in window) {
    let roT;
    // la hauteur de la page change (polices, images) : on remesure, sans boucler sur nos propres changements
    let lastH = 0;
    new ResizeObserver(([e]) => {
      const h = Math.round(e.contentRect.height);
      if (Math.abs(h - lastH) < 2) return;
      lastH = h; clearTimeout(roT); roT = setTimeout(re, 120);
    }).observe(document.body);
  }
})();
