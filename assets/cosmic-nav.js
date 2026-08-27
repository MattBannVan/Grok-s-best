/**
 * Cosmic Orb Navigation — Session 8 Unified Navigation System
 * Floating, accessible, keyboard-first app switcher for Grok's Best.
 * Injects itself on any page that includes this script.
 */
(function () {
  'use strict';
  if (window.__cosmicNavLoaded) return;
  window.__cosmicNavLoaded = true;

  const APPS = [
    { id: 'hub', title: "Grok's Best Hub", href: '../index.html', short: 'Hub', desc: 'Campaign home' },
    { id: 'lsystem', title: 'Living L-System Garden', href: 'living-lsystem.html', short: 'L-System', desc: 'Fractal evolution' },
    { id: 'mind', title: 'Mind Canvas', href: 'mind-canvas.html', short: 'Mind', desc: 'Spatial notes' },
    { id: 'physics', title: 'Cosmic Physics Sandbox', href: 'physics-sandbox.html', short: 'Physics', desc: 'Verlet playground' },
    { id: 'type', title: 'Cosmic Type Pulse', href: 'type-pulse.html', short: 'Type Pulse', desc: 'Kinetic type + sound' },
    { id: 'matrix', title: 'Cosmic Clarity Matrix', href: 'decision-matrix.html', short: 'Clarity', desc: 'Decision helper' },
    { id: 'story', title: 'Cosmic Story Seeds', href: 'story-seeds.html', short: 'Story Seeds', desc: 'Micro-worlds' },
    { id: 'reliquary', title: 'Cosmic Reliquary', href: 'reliquary.html', short: 'Reliquary', desc: 'Time-locked thoughts' }
  ];

  const path = window.location.pathname || '';
  const isHub = path.endsWith('index.html') || path.endsWith('/') || path.endsWith('Grok-s-best');
  const base = isHub ? 'apps/' : '';
  const hubHref = isHub ? 'index.html' : '../index.html';
  APPS[0].href = hubHref;
  for (let i = 1; i < APPS.length; i++) {
    APPS[i].href = base + APPS[i].href.replace(/^apps\//, '');
  }

  const style = document.createElement('style');
  style.textContent = `
    #cosmic-orb-root { position: fixed; bottom: 1.4rem; right: 1.4rem; z-index: 9999; font-family: var(--font, system-ui, sans-serif); }
    #cosmic-orb-btn { width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(0, 229, 255, 0.5); background: radial-gradient(circle at 35% 30%, #00e5ff, #7c5cff 55%, #1a0a3a); box-shadow: 0 0 24px rgba(124, 92, 255, 0.55), 0 0 48px rgba(0, 229, 255, 0.25), inset 0 0 12px rgba(255,255,255,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s; color: #fff; font-size: 1.4rem; line-height: 1; position: relative; overflow: hidden; }
    #cosmic-orb-btn::before { content: ''; position: absolute; inset: -20%; background: conic-gradient(from 0deg, transparent, rgba(0,229,255,0.35), transparent 40%); animation: cosmic-spin 6s linear infinite; opacity: 0.7; }
    @keyframes cosmic-spin { to { transform: rotate(360deg); } }
    #cosmic-orb-btn:hover, #cosmic-orb-btn:focus-visible { transform: scale(1.12); box-shadow: 0 0 32px rgba(124, 92, 255, 0.75), 0 0 64px rgba(0, 229, 255, 0.4); }
    #cosmic-orb-btn[aria-expanded="true"] { transform: scale(1.08) rotate(45deg); background: radial-gradient(circle at 35% 30%, #7c5cff, #00e5ff 70%); }
    #cosmic-orb-panel { position: absolute; bottom: 70px; right: 0; width: min(280px, calc(100vw - 2rem)); background: rgba(13, 17, 23, 0.95); border: 1px solid rgba(124, 92, 255, 0.35); border-radius: 16px; padding: 0.75rem; box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 30px rgba(124, 92, 255, 0.2); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); opacity: 0; visibility: hidden; transform: translateY(12px) scale(0.94); transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s; max-height: 70vh; overflow-y: auto; }
    #cosmic-orb-panel.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
    #cosmic-orb-panel h2 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent2, #00e5ff); margin: 0 0 0.55rem 0.3rem; font-weight: 700; }
    .cosmic-nav-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.7rem; border-radius: 10px; text-decoration: none; color: var(--text, #e6edf3); transition: background 0.15s; border: 1px solid transparent; }
    .cosmic-nav-item:hover, .cosmic-nav-item:focus-visible { background: rgba(124, 92, 255, 0.18); border-color: rgba(124, 92, 255, 0.3); outline: none; }
    .cosmic-nav-item.current { background: rgba(0, 229, 255, 0.12); border-color: rgba(0, 229, 255, 0.35); }
    .cosmic-nav-item .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent, #7c5cff); flex-shrink: 0; }
    .cosmic-nav-item.current .dot { background: var(--accent2, #00e5ff); box-shadow: 0 0 8px var(--accent2, #00e5ff); }
    .cosmic-nav-item .meta { flex: 1; min-width: 0; }
    .cosmic-nav-item .title { font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cosmic-nav-item .desc { font-size: 0.72rem; color: var(--muted, #8b949e); }
    .cosmic-nav-progress { margin-top: 0.6rem; padding: 0.5rem 0.6rem; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.72rem; color: var(--muted, #8b949e); }
    .cosmic-nav-progress strong { color: var(--accent2, #00e5ff); }
    @media (max-width: 480px) { #cosmic-orb-root { bottom: 1rem; right: 1rem; } #cosmic-orb-btn { width: 52px; height: 52px; } }
    @media (prefers-reduced-motion: reduce) { #cosmic-orb-btn::before { animation: none; } #cosmic-orb-btn, #cosmic-orb-panel { transition: none; } }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'cosmic-orb-root';
  root.setAttribute('role', 'navigation');
  root.setAttribute('aria-label', 'Cosmic app switcher');

  const btn = document.createElement('button');
  btn.id = 'cosmic-orb-btn'; btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'cosmic-orb-panel');
  btn.setAttribute('aria-label', 'Open cosmic navigation menu');
  btn.innerHTML = '<span aria-hidden="true">\u2726</span>';
  btn.title = 'Cosmic Orb \u2014 switch apps';

  const panel = document.createElement('div');
  panel.id = 'cosmic-orb-panel';
  panel.setAttribute('role', 'menu');
  panel.setAttribute('aria-label', 'Available mini-apps');
  const heading = document.createElement('h2');
  heading.textContent = 'Constellation of Apps';
  panel.appendChild(heading);

  const currentPath = path.toLowerCase();
  APPS.forEach((app) => {
    const a = document.createElement('a');
    a.className = 'cosmic-nav-item'; a.href = app.href;
    a.setAttribute('role', 'menuitem'); a.tabIndex = -1;
    const file = app.href.split('/').pop().replace('.html','');
    const isCurrent = (app.id === 'hub' && isHub) || (app.id !== 'hub' && currentPath.includes(file));
    if (isCurrent) { a.classList.add('current'); a.setAttribute('aria-current', 'page'); }
    a.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="meta"><span class="title">' + app.short + '</span><span class="desc">' + app.desc + '</span></span>';
    panel.appendChild(a);
  });

  const progress = document.createElement('div');
  progress.className = 'cosmic-nav-progress';
  progress.innerHTML = 'Session campaign: <strong>9 / 10</strong> complete \u00b7 Reliquary surprise live';
  panel.appendChild(progress);
  root.appendChild(btn); root.appendChild(panel); document.body.appendChild(root);

  function openMenu() { panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); const items = panel.querySelectorAll('[role="menuitem"]'); if (items[0]) items[0].focus(); }
  function closeMenu() { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
  function toggle() { if (panel.classList.contains('open')) closeMenu(); else openMenu(); }
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); openMenu(); } });
  panel.addEventListener('keydown', (e) => {
    const items = Array.from(panel.querySelectorAll('[role="menuitem"]'));
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
  });
  document.addEventListener('click', (e) => { if (!root.contains(e.target) && panel.classList.contains('open')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu(); });
})();
