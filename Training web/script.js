/* =========================================================
   script.js — Portofolio Muhammad Faadhil Muharram
   Semua efek tambahan disuntikkan lewat JavaScript, jadi
   index.html dan style.css tidak perlu diubah.
   ========================================================= */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------------------------------------------------------
       0. CSS tambahan (disuntikkan agar semua kode ada di satu file)
       --------------------------------------------------------- */
    const style = document.createElement('style');
    style.textContent = `
        /* Progress scroll */
        .scroll-progress {
            position: fixed; top: 0; left: 0; height: 3px; width: 100%;
            background: linear-gradient(90deg, var(--accent), #7c5cff);
            transform-origin: left; transform: scaleX(0);
            z-index: 2000; pointer-events: none;
            box-shadow: 0 0 12px var(--accent-glow);
        }

        /* Kursor kustom */
        .cursor-dot, .cursor-ring {
            position: fixed; top: 0; left: 0; pointer-events: none;
            z-index: 3000; border-radius: 50%; opacity: 0;
            transition: opacity .3s, width .25s, height .25s, background .25s, border-color .25s;
        }
        .cursor-dot  { width: 6px;  height: 6px;  background: var(--accent); margin: -3px 0 0 -3px; }
        .cursor-ring { width: 36px; height: 36px; border: 1.5px solid var(--accent); margin: -18px 0 0 -18px; }
        .cursor-ring.is-hover { width: 64px; height: 64px; margin: -32px 0 0 -32px; background: rgba(0,210,255,.08); }
        .cursor-ready .cursor-dot, .cursor-ready .cursor-ring { opacity: 1; }

        /* Canvas partikel di hero */
        .hero { position: relative; overflow: hidden; }
        .hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .hero-content, .hero-image-container { position: relative; z-index: 1; }

        /* Efek mengetik */
        .typing-cursor {
            display: inline-block; width: 2px; height: 1em; background: var(--accent);
            margin-left: 4px; vertical-align: -2px; animation: blink 1s steps(2) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .badge { min-height: 40px; }

        /* Reveal saat scroll (hanya untuk kartu & timeline) */
        .reveal { opacity: 0; }
        .reveal.visible { animation: revealUp .7s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes revealUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* Spotlight yang mengikuti mouse pada kartu */
        .skill-card, .contact-box, .timeline-content { position: relative; overflow: hidden; }
        .skill-card::before, .contact-box::before, .timeline-content::before {
            content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
            background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(0,210,255,.16), transparent 70%);
            opacity: 0; transition: opacity .3s;
        }
        .skill-card:hover::before, .contact-box:hover::before, .timeline-content:hover::before { opacity: 1; }
        .skill-card > *, .contact-box > *, .timeline-content > * { position: relative; z-index: 1; }

        /* Ripple tombol */
        .btn-primary, .btn-secondary { position: relative; overflow: hidden; }
        .ripple {
            position: absolute; border-radius: 50%; pointer-events: none;
            background: rgba(255,255,255,.45); transform: scale(0);
            animation: ripple .6s ease-out forwards;
        }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }

        /* Link navigasi aktif */
        .nav-links a { position: relative; }
        .nav-links a::after {
            content: ''; position: absolute; left: 0; bottom: -6px; height: 2px; width: 100%;
            background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .3s;
        }
        .nav-links a.active { color: var(--accent); }
        .nav-links a.active::after, .nav-links a:hover::after { transform: scaleX(1); }

        /* Menu hamburger (mobile) */
        .menu-toggle {
            display: none; background: none; border: 0; cursor: pointer;
            width: 32px; height: 24px; position: relative;
        }
        .menu-toggle span {
            position: absolute; left: 0; width: 100%; height: 2px; background: var(--text-main);
            transition: transform .3s, opacity .3s, top .3s;
        }
        .menu-toggle span:nth-child(1) { top: 2px; }
        .menu-toggle span:nth-child(2) { top: 11px; }
        .menu-toggle span:nth-child(3) { top: 20px; }
        .menu-toggle.open span:nth-child(1) { top: 11px; transform: rotate(45deg); }
        .menu-toggle.open span:nth-child(2) { opacity: 0; }
        .menu-toggle.open span:nth-child(3) { top: 11px; transform: rotate(-45deg); }
        header nav { display: contents; }
        @media (max-width: 990px) {
            .menu-toggle { display: block; }
            .nav-links.open {
                display: flex; flex-direction: column; gap: 1.2rem;
                position: absolute; top: 100%; left: 0; right: 0;
                padding: 1.5rem 8% 2rem;
                background: rgba(7, 9, 15, 0.97);
                border-bottom: 1px solid rgba(0, 210, 255, 0.15);
            }
        }

        /* Tombol kembali ke atas */
        .back-to-top {
            position: fixed; right: 28px; bottom: 28px; width: 46px; height: 46px;
            border-radius: 50%; border: 1px solid var(--accent); background: rgba(7,9,15,.85);
            color: var(--accent); font-size: 1.2rem; cursor: pointer; z-index: 1500;
            opacity: 0; transform: translateY(20px); pointer-events: none;
            transition: opacity .3s, transform .3s, background .3s, color .3s;
            box-shadow: 0 0 15px var(--accent-glow);
        }
        .back-to-top.show { opacity: 1; transform: none; pointer-events: auto; }
        .back-to-top:hover { background: var(--accent); color: var(--bg-dark); }

        /* Fokus keyboard yang terlihat */
        a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
    `;
    document.head.appendChild(style);

    /* ---------------------------------------------------------
       1. Navbar berubah saat di-scroll (kode asli, dipertahankan)
       --------------------------------------------------------- */
    const header = document.querySelector('header');
    header.style.transition = 'all 0.3s ease-in-out';

    /* ---------------------------------------------------------
       2. Progress bar scroll + tombol kembali ke atas
       --------------------------------------------------------- */
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    const toTop = document.createElement('button');
    toTop.className = 'back-to-top';
    toTop.setAttribute('aria-label', 'Kembali ke atas');
    toTop.textContent = '↑';
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(toTop);

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        toTop.classList.toggle('show', y > 600);

        if (y > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
            header.style.background = 'rgba(7, 9, 15, 0.95)';
            header.style.padding = '1rem 8%';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(7, 9, 15, 0.85)';
            header.style.padding = '1.5rem 8%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------------------------------------------------------
       3. Menu hamburger untuk layar kecil
       --------------------------------------------------------- */
    const nav = document.querySelector('header nav');
    const navLinks = document.querySelector('.nav-links');
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-label', 'Buka menu navigasi');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    function setMenu(open) {
        toggle.classList.toggle('open', open);
        navLinks.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

    /* ---------------------------------------------------------
       4. Scrollspy: tandai menu sesuai section yang sedang dilihat
       --------------------------------------------------------- */
    const linkMap = new Map();
    navLinks.querySelectorAll('a[href^="#"]').forEach(a => linkMap.set(a.getAttribute('href').slice(1), a));

    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                linkMap.forEach(a => a.classList.remove('active'));
                const link = linkMap.get(entry.target.id);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

    /* ---------------------------------------------------------
       5. Efek mengetik pada badge hero
       --------------------------------------------------------- */
    const badge = document.querySelector('.badge');
    if (badge) {
        const roles = ['Inovator Teknologi', 'IoT Developer', 'Machine Learning Enthusiast', 'Web Developer'];
        badge.textContent = '';
        const text = document.createElement('span');
        const caret = document.createElement('span');
        caret.className = 'typing-cursor';
        badge.append(text, caret);

        if (reduceMotion) {
            text.textContent = roles[0];
        } else {
            let r = 0, i = 0, deleting = false;
            (function tick() {
                const word = roles[r];
                text.textContent = word.slice(0, i);
                let delay = deleting ? 40 : 85;

                if (!deleting && i === word.length) { deleting = true; delay = 1600; }
                else if (deleting && i === 0)       { deleting = false; r = (r + 1) % roles.length; delay = 350; }
                else                                 { i += deleting ? -1 : 1; }

                setTimeout(tick, delay);
            })();
        }
    }

    /* ---------------------------------------------------------
       6. Jaringan partikel interaktif di hero (mengikuti mouse)
       --------------------------------------------------------- */
    const hero = document.querySelector('.hero');
    if (hero && !reduceMotion) {
        const canvas = document.createElement('canvas');
        canvas.className = 'hero-canvas';
        hero.prepend(canvas);
        const ctx = canvas.getContext('2d');

        let w, h, dpr, particles = [];
        const mouse = { x: -9999, y: -9999 };
        const LINK_DIST = 130;
        const MOUSE_DIST = 170;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = hero.clientWidth;
            h = hero.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(90, Math.floor((w * h) / 14000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 1.6 + 0.8
            }));
        }

        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

        let running = true;
        new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) draw(); }).observe(hero);

        function draw() {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Dorongan lembut menjauh dari kursor
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 110) {
                    p.x += (dx / dist) * 1.4;
                    p.y += (dy / dist) * 1.4;
                }

                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 210, 255, 0.7)';
                ctx.fill();

                // Garis antar partikel
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < LINK_DIST) {
                        ctx.strokeStyle = `rgba(0, 210, 255, ${0.18 * (1 - d / LINK_DIST)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }

                // Garis ke kursor
                const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (md < MOUSE_DIST) {
                    ctx.strokeStyle = `rgba(124, 92, 255, ${0.5 * (1 - md / MOUSE_DIST)})`;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
            }
            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    /* ---------------------------------------------------------
       7. Reveal bertahap untuk kartu & timeline
       --------------------------------------------------------- */
    if (!reduceMotion) {
        const targets = document.querySelectorAll('.skill-card, .card, .timeline-item, .contact-box');
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('visible');
                // Setelah animasi selesai, lepas class agar efek hover/tilt bebas bekerja
                el.addEventListener('animationend', () => el.classList.remove('reveal', 'visible'), { once: true });
                io.unobserve(el);
            });
        }, { threshold: 0.15 });

        targets.forEach(el => {
            // Jeda bertingkat untuk elemen bersaudara dalam satu grid
            const siblings = [...el.parentElement.children];
            el.style.animationDelay = `${siblings.indexOf(el) * 90}ms`;
            el.classList.add('reveal');
            io.observe(el);
        });
    }

    /* ---------------------------------------------------------
       8. Efek 3D tilt pada kartu proyek
       --------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width  - 0.5;
                const y = (e.clientY - rect.top)  / rect.height - 0.5;
                card.style.transition = 'transform 0.1s linear, border-color 0.4s';
                card.style.transform =
                    `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = '';
                card.style.transform = '';
            });
        });
    }

    /* ---------------------------------------------------------
       9. Spotlight mengikuti mouse (kartu keahlian, kontak, prestasi)
       --------------------------------------------------------- */
    document.querySelectorAll('.skill-card, .contact-box, .timeline-content').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            el.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });

    /* ---------------------------------------------------------
       10. Efek ripple pada tombol
       --------------------------------------------------------- */
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', e => {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const dot = document.createElement('span');
            dot.className = 'ripple';
            dot.style.width = dot.style.height = `${size}px`;
            dot.style.left = `${e.clientX - rect.left - size / 2}px`;
            dot.style.top  = `${e.clientY - rect.top  - size / 2}px`;
            btn.appendChild(dot);
            dot.addEventListener('animationend', () => dot.remove());
        });
    });

    /* ---------------------------------------------------------
       11. Parallax foto profil mengikuti mouse
       --------------------------------------------------------- */
    const imgBox = document.querySelector('.hero-image-container');
    if (hero && imgBox && finePointer && !reduceMotion) {
        hero.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 24;
            const y = (e.clientY / window.innerHeight - 0.5) * 24;
            imgBox.style.transition = 'transform 0.15s ease-out';
            imgBox.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        });
        hero.addEventListener('mouseleave', () => {
            imgBox.style.transition = 'transform 0.6s ease';
            imgBox.style.transform = 'translate(0, 0)';
        });
    }

    /* ---------------------------------------------------------
       12. Kursor kustom (titik + cincin yang mengikuti dengan halus)
       --------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
        const dot = document.createElement('div');
        const ring = document.createElement('div');
        dot.className = 'cursor-dot';
        ring.className = 'cursor-ring';
        document.body.append(dot, ring);

        let mx = 0, my = 0, rx = 0, ry = 0;
        window.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px)`;
            document.body.classList.add('cursor-ready');
        });
        document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready'));

        (function follow() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(follow);
        })();

        document.querySelectorAll('a, button, .card, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
        });
    }
})();