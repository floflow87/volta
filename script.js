/* ============================================================
   Volta Studio — interactions & motion design
   ------------------------------------------------------------
   1. Préchargeur (maillage 3D + progression)
   2. Navigation (fond sombre au scroll)
   3. Révélations au scroll + compteurs animés
   4. Maillage 3D du hero (canvas)
   5. Texte de mission qui s'écrit au scroll
   6. Terminal qui tape le code
   7. Carrousel de logos clients
   8. Barres de progression de la méthode
   ============================================================ */
(function () {
  'use strict';

  var state = {};

  /* --- 1. Préchargeur : maillage violet animé + barre de progression --- */
  function initPreloader() {
    const pre = document.getElementById('preloader');
        const fill = document.getElementById('prefill');
        const pct = document.getElementById('prepct');
        if (!pre) return;
        const canvas = document.getElementById('premesh');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          let w = 0, h = 0, dpr = 1;
          const size = () => {
            dpr = Math.min(2, window.devicePixelRatio || 1);
            const r = canvas.getBoundingClientRect();
            w = r.width; h = r.height;
            canvas.width = Math.max(1, w * dpr);
            canvas.height = Math.max(1, h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          };
          size();
          state._onPreResize = size;
          window.addEventListener('resize', size);
          const cols = 46, rows = 34;
          const draw = (now) => {
            if (pre.classList.contains('done')) { cancelAnimationFrame(state._preRaf); return; }
            ctx.clearRect(0, 0, w, h);
            const cx = w / 2, cy = h * 0.52;
            const focal = Math.min(w, h) * 0.62;
            const spacingX = (w / cols) * 1.8, spacingZ = 28, camY = 60;
            const t = now * 0.001;
            const pts = [];
            for (let j = 0; j < rows; j++) {
              const att = 1 - (j / rows) * 0.45;
              const Z = 70 + j * spacingZ;
              const row = [];
              for (let i = 0; i < cols; i++) {
                const X = (i - cols / 2) * spacingX;
                const wave = Math.sin(X * 0.006 + t * 1.05) * 30 + Math.sin(Z * 0.02 - t * 1.3) * 20 + Math.sin((X * 0.011 + Z * 0.014) + t * 0.8) * 14;
                const Y = wave * att;
                row.push([cx + (X * focal) / Z, cy + ((camY - Y) * focal) / Z]);
              }
              pts.push(row);
            }
            for (let i = 0; i < cols; i++) {
              ctx.beginPath();
              for (let j = 0; j < rows; j++) { const p = pts[j][i]; if (j === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
              ctx.strokeStyle = 'rgba(130,90,240,0.2)';
              ctx.lineWidth = 1; ctx.shadowBlur = 0; ctx.stroke();
            }
            ctx.shadowColor = 'rgba(140,90,255,0.55)';
            for (let j = 0; j < rows; j++) {
              const a = Math.max(0, 1 - (j / rows) * 0.9) * 0.75;
              ctx.beginPath();
              for (let i = 0; i < cols; i++) { const p = pts[j][i]; if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
              ctx.strokeStyle = 'rgba(165,120,255,' + a + ')';
              ctx.lineWidth = 1.1; ctx.shadowBlur = 7; ctx.stroke();
            }
            ctx.shadowBlur = 0;
            state._preRaf = requestAnimationFrame(draw);
          };
          state._preRaf = requestAnimationFrame(draw);
        }
        let p = 0;
        const tick = () => {
          p += p < 70 ? 4 + Math.random() * 9 : 2 + Math.random() * 4;
          if (p > 100) p = 100;
          if (fill) fill.style.width = p + '%';
          if (pct) pct.textContent = Math.round(p) + '%';
          if (p < 100) state._preTimer = setTimeout(tick, 90 + Math.random() * 110);
          else state._preTimer = setTimeout(() => pre.classList.add('done'), 420);
        };
        state._preTimer = setTimeout(tick, 260);
  }

  /* --- 8. Barres de progression : rechargement toutes les 5 s --- */
  function initProgress() {
    const bars = document.querySelectorAll('.stepbar span');
        if (!bars.length) return;
        const recharge = () => {
          bars.forEach((b) => {
            const card = b.closest('.stepcard');
            const w = (card && card.style.getPropertyValue('--w')) || '70%';
            b.style.transition = 'none';
            b.style.width = '0%';
            void b.offsetWidth;
            b.style.transition = 'width 1.2s cubic-bezier(.2,.7,.2,1)';
            b.style.width = w;
          });
        };
        state._progTimer = setInterval(recharge, 5000);
  }

  /* --- 2. Navigation : passe en fond sombre au scroll --- */
  function initNav() {
    const nav = document.getElementById('nav');
        if (!nav) return;
        state._onScroll = () => {
          if (window.scrollY > 40) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', state._onScroll, { passive: true });
        state._onScroll();
  }

  /* --- 3a. Compteur animé (easing cubique) --- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
        const pre = el.getAttribute('data-prefix') || '';
        const suf = el.getAttribute('data-suffix') || '';
        const dur = parseInt(el.getAttribute('data-dur'), 10) || 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(target * e) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
  }

  /* --- 3b. Révélations au scroll (IntersectionObserver) --- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
          els.forEach(e => e.classList.add('in'));
          document.querySelectorAll('.ctr').forEach(c => animateCounter(c));
          return;
        }
        const io = new IntersectionObserver((entries) => {
          entries.forEach(en => {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              en.target.querySelectorAll('.ctr').forEach(c => {
                if (!c._done) { c._done = true; animateCounter(c); }
              });
              io.unobserve(en.target);
            }
          });
        }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
        els.forEach(e => io.observe(e));
        document.querySelectorAll('.hero .ctr').forEach(c => {
          if (!c._done) { c._done = true; animateCounter(c); }
        });
  }

  /* --- 4. Maillage 3D du hero, réactif à la souris --- */
  function initMesh() {
    const canvas = document.getElementById('mesh');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = 0, h = 0, dpr = 1;
        const size = () => {
          dpr = Math.min(2, window.devicePixelRatio || 1);
          const r = canvas.getBoundingClientRect();
          w = r.width; h = r.height;
          canvas.width = Math.max(1, w * dpr);
          canvas.height = Math.max(1, h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        size();
        state._onResize = size;
        window.addEventListener('resize', size);
        let targetMx = 0, mx = 0;
        state._onMove = (e) => {
          const r = canvas.getBoundingClientRect();
          targetMx = (e.clientX - r.left) / r.width - 0.5;
        };
        window.addEventListener('pointermove', state._onMove, { passive: true });
        const cols = 60, rows = 44;
        const draw = (now) => {
          mx += (targetMx - mx) * 0.05;
          ctx.clearRect(0, 0, w, h);
          const cx = w / 2 + mx * w * 0.08;
          const cy = h * 0.5;
          const focal = Math.min(w, h) * 0.6;
          const spacingX = (w / cols) * 1.7;
          const spacingZ = 26;
          const camY = 62;
          const t = now * 0.001;
          const pts = [];
          for (let j = 0; j < rows; j++) {
            const depth = j / rows;
            const att = 1 - depth * 0.45;
            const Z = 68 + j * spacingZ;
            const rowArr = [];
            for (let i = 0; i < cols; i++) {
              const X = (i - cols / 2) * spacingX;
              const wave = Math.sin(X * 0.006 + t * 1.05) * 30
                         + Math.sin(Z * 0.02 - t * 1.3) * 20
                         + Math.sin((X * 0.011 + Z * 0.014) + t * 0.8) * 14;
              const Y = wave * att;
              const sx = cx + (X * focal) / Z;
              const sy = cy + ((camY - Y) * focal) / Z;
              rowArr.push([sx, sy]);
            }
            pts.push(rowArr);
          }
          ctx.shadowColor = 'rgba(140,90,255,0.55)';
          for (let i = 0; i < cols; i++) {
            ctx.beginPath();
            for (let j = 0; j < rows; j++) {
              const p = pts[j][i];
              if (j === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
            }
            ctx.strokeStyle = 'rgba(130,90,240,0.22)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
          for (let j = 0; j < rows; j++) {
            const depth = j / rows;
            const a = Math.max(0, (1 - depth * 0.9)) * 0.8;
            ctx.beginPath();
            for (let i = 0; i < cols; i++) {
              const p = pts[j][i];
              if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
            }
            ctx.strokeStyle = 'rgba(165,120,255,' + a + ')';
            ctx.lineWidth = 1.15;
            ctx.shadowBlur = 7;
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
          state._raf = requestAnimationFrame(draw);
        };
        state._raf = requestAnimationFrame(draw);
  }

  /* --- 5. Texte de mission : les mots s'allument au scroll --- */
  function initTextReveal() {
    const el = document.querySelector('.mstatement');
        if (!el) return;
        const words = [];
        const process = (container, cls) => {
          const kids = Array.prototype.slice.call(container.childNodes);
          kids.forEach((node) => {
            if (node.nodeType === 3) {
              const parts = node.textContent.split(/(\s+)/);
              const frag = document.createDocumentFragment();
              parts.forEach((part) => {
                if (part === '') return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                const s = document.createElement('span');
                s.className = 'w' + (cls ? ' w-' + cls : '');
                s.textContent = part;
                s.style.opacity = '0.14';
                frag.appendChild(s);
                words.push(s);
              });
              container.replaceChild(frag, node);
            } else if (node.nodeType === 1) {
              const tag = node.tagName.toLowerCase();
              const nextCls = tag === 'b' ? 'strong' : (node.classList && node.classList.contains('grey') ? 'grey' : cls);
              process(node, nextCls);
            }
          });
        };
        process(el, null);
        const update = () => {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight || 800;
          const start = vh * 0.86, end = vh * 0.34;
          let p = (start - rect.top) / (start - end);
          p = Math.max(0, Math.min(1, p));
          const lit = p * words.length;
          for (let i = 0; i < words.length; i++) {
            const f = Math.max(0, Math.min(1, lit - i));
            words[i].style.opacity = (0.14 + 0.86 * f).toFixed(3);
          }
        };
        let ticking = false;
        state._onScroll2 = () => {
          if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
        };
        window.addEventListener('scroll', state._onScroll2, { passive: true });
        window.addEventListener('resize', state._onScroll2);
        update();
  }

  /* --- 6. Terminal : frappe du code en boucle --- */
  function initTerminal() {
    const code = document.getElementById('term-code');
        const gutter = document.getElementById('term-gutter');
        if (!code) return;
        const S = (t, c) => ({ t: t, c: c || '' });
        const segs = [
          S('// Volta — déclaration de mission', 'c'), S('\n'),
          S('<', 'p'), S('section', 'k'), S(' '), S('class', 'a'), S('=', 'p'), S('"mission"', 's'), S('>', 'p'), S('\n'),
          S('  '), S('<', 'p'), S('h2', 'k'), S('>', 'p'), S('Notre mission ?', 't'), S('</', 'p'), S('h2', 'k'), S('>', 'p'), S('\n'),
          S('  '), S('<', 'p'), S('p', 'k'), S('>', 'p'), S('Identifier les', 't'), S('\n'),
          S('    '), S('<', 'p'), S('b', 'k'), S('>', 'p'), S('points de blocage', 'b'), S('</', 'p'), S('b', 'k'), S('>', 'p'), S(' pour scaler,', 't'), S('\n'),
          S('    '), S('structurer votre', 't'), S('\n'),
          S('    '), S('<', 'p'), S('span', 'k'), S('>', 'p'), S('pôle produit', 't'), S('</', 'p'), S('span', 'k'), S('>', 'p'), S(' et vous', 't'), S('\n'),
          S('    '), S('aider à', 't'), S('\n'),
          S('    '), S('<', 'p'), S('b', 'k'), S('>', 'p'), S('maximiser la rentabilité', 'b'), S('</', 'p'), S('b', 'k'), S('>', 'p'), S('\n'),
          S('    '), S('de votre solution.', 't'), S('</', 'p'), S('p', 'k'), S('>', 'p'), S('\n'),
          S('</', 'p'), S('section', 'k'), S('>', 'p')
        ];
        const full = segs.reduce((a, s) => a + s.t, '');
        const lineCount = full.split('\n').length;
        if (gutter) {
          let g = '';
          for (let i = 1; i <= lineCount; i++) g += (i < 10 ? '0' + i : i) + (i < lineCount ? '\n' : '');
          gutter.textContent = g;
        }
        const clsMap = { k: 'tk', a: 'ta', s: 'ts', p: 'tp', t: 'tt', c: 'tc', b: 'tb' };
        const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const render = (n) => {
          let out = '', shown = 0;
          for (const sg of segs) {
            const rem = n - shown;
            if (rem <= 0) break;
            const take = Math.min(sg.t.length, rem);
            const part = esc(sg.t.slice(0, take));
            out += sg.c ? '<span class="' + clsMap[sg.c] + '">' + part + '</span>' : part;
            shown += take;
            if (take < sg.t.length) break;
          }
          code.innerHTML = out + '<span class="tcur"></span>';
        };
        let idx = 0;
        const tick = () => {
          idx++;
          render(idx);
          if (idx >= full.length) {
            state._termTimer = setTimeout(() => { idx = 0; render(0); state._termTimer = setTimeout(tick, 500); }, 3200);
            return;
          }
          const justTyped = full.charAt(idx - 1);
          const delay = justTyped === '\n' ? 240 : (justTyped === ' ' ? 24 : 20 + Math.random() * 26);
          state._termTimer = setTimeout(tick, delay);
        };
        render(0);
        state._termTimer = setTimeout(tick, 600);
  }

  /* --- 7. Carrousel de logos, défilement toutes les 3 s --- */
  function initLogos() {
    const track = document.getElementById('logostrack');
        if (!track || track.children.length < 2) return;
        const gap = 16;
        const step = () => {
          const first = track.children[0];
          if (!first) return;
          const w = first.getBoundingClientRect().width + gap;
          track.style.transition = 'transform .7s cubic-bezier(.5,.05,.2,1)';
          track.style.transform = 'translateX(-' + w + 'px)';
          const done = () => {
            track.removeEventListener('transitionend', done);
            track.style.transition = 'none';
            track.style.transform = 'none';
            track.appendChild(first);
          };
          track.addEventListener('transitionend', done);
        };
        state._logoTimer = setInterval(step, 3000);
  }

  /* --- Démarrage --- */
  function init() {
    initNav();
    initReveal();
    initMesh();
    initTextReveal();
    initLogos();
    initTerminal();
    initProgress();
    initPreloader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
