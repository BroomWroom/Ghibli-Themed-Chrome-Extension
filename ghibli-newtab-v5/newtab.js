'use strict';

const SCENES = [
  {
    name: "Totoro's Forest",
    bg: 'assets/totoro-bg.jpg',
    thumb: 'assets/totoro-thumb.jpg',
    music: 'assets/totoro.mp3',
    trackName: 'Forest Whispers'
  },
  {
    name: 'Spirited Away',
    bg: 'assets/spirited-bg.jpg',
    thumb: 'assets/spirited-thumb.jpg',
    music: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3',
    trackName: 'Distant Rain'
  },
  {
    name: "Howl's Castle",
    bg: 'assets/howl-bg.jpg',
    thumb: 'assets/howl-thumb.jpg',
    music: 'assets/howl.mp3',
    trackName: 'Moving Castle'
  },
  {
    name: 'Nausicaä Valley',
    bg: 'assets/nausicaa-bg.jpg',
    thumb: 'assets/nausicaa-thumb.jpg',
    music: 'assets/nausicaa.mp3',
    trackName: 'Wind Valley'
  },
  {
    name: "Kiki's Town",
    bg: 'assets/kiki-bg.jpg',
    thumb: 'assets/kiki-thumb.jpg',
    music: 'assets/kiki.mp3',
    trackName: 'Sea Breeze'
  },
  {
    name: 'Princess Mononoke',
    bg: 'assets/mononoke-bg.jpg',
    thumb: 'assets/mononoke-thumb.jpg',
    music: 'assets/mononoke.mp3',
    trackName: 'Ancient Spirits'
  }
];

// ── FALLBACK URLs 
const FALLBACK_URLS = [
  {
    bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=60'
  },
  {
    bg: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=400&q=60'
  },
  {
    bg: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=400&q=60'
  },
  {
    bg: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=60'
  },
  {
    bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60'
  },
  {
    bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=400&q=60'
  }
];

// ── ASSET RESOLUTION ──────────────────────────────────
// Returns a Promise<string> — resolves to the local path if it loads,otherwise falls back to the remote URL.

function resolveImage(localPath, fallbackUrl) {
  if (/^https?:\/\//i.test(localPath)) return Promise.resolve(localPath);

  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(localPath);
    img.onerror = () => resolve(fallbackUrl);
    img.src = localPath;
  });
}

// ── GREETINGS by hour
const GREETINGS = [
  { from: 0, jp: 'おやすみ', en: 'Good night' },
  { from: 5, jp: 'おはよう', en: 'Good morning' },
  { from: 12, jp: 'こんにちは', en: 'Good afternoon' },
  { from: 17, jp: 'こんばんは', en: 'Good evening' },
  { from: 21, jp: 'おやすみ', en: 'Good night' }
];

// ── DEFAULT SHORTCUTS 
const DEFAULT_SHORTCUTS = [
  { icon: '⌂', label: 'Home', url: 'https://google.com' },
  { icon: '▶', label: 'YouTube', url: 'https://youtube.com' },
  { icon: '✉', label: 'Gmail', url: 'https://mail.google.com' },
  { icon: '◉', label: 'Reddit', url: 'https://reddit.com' },
  { icon: '♫', label: 'Spotify', url: 'https://open.spotify.com' }
];

// ── STATE 
let sceneIndex = 0;
let isPlaying = false;
let shortcuts = [];
let showEn = false;

// ── DOM 
const bg = document.getElementById('bg');
const clockEl = document.getElementById('clock');
const greetJp = document.getElementById('greetJp');
const greetEn = document.getElementById('greetEn');
const dateEl = document.getElementById('date');
const searchEl = document.getElementById('search');
const sceneEl = document.getElementById('sceneName');
const trackEl = document.getElementById('trackName');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevScene');
const nextBtn = document.getElementById('nextScene');
const volEl = document.getElementById('vol');
const audio = document.getElementById('audio');
const shortcutsEl = document.getElementById('shortcuts');
const canvasEl = document.getElementById('canvas');
const ctx2d = canvasEl.getContext('2d');
const pickerOverlay = document.getElementById('pickerOverlay');
const pickerGrid = document.getElementById('pickerGrid');
const pickerClose = document.getElementById('pickerClose');


// CLOCK + GREETING

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

let currentGreetPeriod = -1;

function setGreetText(g) {
  greetJp.textContent = g.jp;
  greetEn.textContent = g.en;
}

function showGreeting(useEn) {
  if (useEn) {
    greetJp.classList.add('hidden');
    greetJp.classList.remove('visible');
    greetEn.classList.remove('hidden');
    greetEn.classList.add('visible');
  } else {
    greetEn.classList.add('hidden');
    greetEn.classList.remove('visible');
    greetJp.classList.remove('hidden');
    greetJp.classList.add('visible');
  }
}

function tick() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'am' : 'pm';
  clockEl.textContent = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  dateEl.textContent = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;

  const g = [...GREETINGS].reverse().find(g => h >= g.from) || GREETINGS[0];
  if (g.from !== currentGreetPeriod) {
    currentGreetPeriod = g.from;
    showEn = false;
    setGreetText(g);
    showGreeting(false);
  }
}

function toggleGreeting() {
  showEn = !showEn;
  showGreeting(showEn);
}

greetJp.classList.add('visible');
greetEn.classList.add('hidden');

setInterval(tick, 1000);
setInterval(toggleGreeting, 6000);
tick();

// SCENE LOADING — resolves local assets, falls back to URL

async function applyScene(index, resumePlay) {
  sceneIndex = ((index % SCENES.length) + SCENES.length) % SCENES.length;
  const scene = SCENES[sceneIndex];
  const fallback = FALLBACK_URLS[sceneIndex] || {};

  const bgSrc = await resolveImage(scene.bg, fallback.bg || scene.bg);

  bg.classList.add('out');
  setTimeout(() => {
    bg.style.backgroundImage = `url("${bgSrc}")`;
    bg.classList.remove('out');
  }, 700);

  sceneEl.textContent = scene.name;
  trackEl.textContent = scene.trackName;

  audio.src = scene.music;
  audio.volume = parseFloat(volEl.value);
  if (resumePlay || isPlaying) {
    audio.play().catch(() => { });
    isPlaying = true;
    playBtn.innerHTML = '&#9646;&#9646;';
  }

  document.querySelectorAll('.picker-card').forEach((card, i) => {
    card.classList.toggle('active', i === sceneIndex);
  });

  localStorage.setItem('gb_scene', sceneIndex);
}

prevBtn.addEventListener('click', () => applyScene(sceneIndex - 1, false));
nextBtn.addEventListener('click', () => applyScene(sceneIndex + 1, false));


// MUSIC

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    playBtn.innerHTML = '&#9654;';
    isPlaying = false;
  } else {
    audio.play().catch(() => { });
    playBtn.innerHTML = '&#9646;&#9646;';
    isPlaying = true;
  }
});

volEl.addEventListener('input', () => { audio.volume = parseFloat(volEl.value); });


// SEARCH

searchEl.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const raw = searchEl.value.trim();
  if (!raw) return;
  let dest;
  if (/^https?:\/\//i.test(raw)) dest = raw;
  else if (/^[\w-]+(\.[a-z]{2,})(\/|$)/i.test(raw)) dest = 'https://' + raw;
  else dest = 'https://www.google.com/search?q=' + encodeURIComponent(raw);
  window.location.href = dest;
});


// PARTICLES

let W, H, particles;

function resize() { W = canvasEl.width = window.innerWidth; H = canvasEl.height = window.innerHeight; }

function makeParticle() {
  return {
    x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.3, vy: -(Math.random() * 0.4 + 0.08),
    a: Math.random() * 0.45 + 0.05, phase: Math.random() * Math.PI * 2
  };
}

function initParticles() { particles = Array.from({ length: 70 }, makeParticle); }

let frame = 0;
function drawParticles() {
  ctx2d.clearRect(0, 0, W, H);
  frame++;
  for (const p of particles) {
    p.x += p.vx + Math.sin(frame * 0.008 + p.phase) * 0.25;
    p.y += p.vy;
    if (p.y < -8) { p.y = H + 4; p.x = Math.random() * W; }
    if (p.x < -8) p.x = W + 4;
    if (p.x > W + 8) p.x = -4;
    ctx2d.beginPath();
    ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx2d.fillStyle = `rgba(255,248,200,${p.a})`;
    ctx2d.fill();
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize(); initParticles(); drawParticles();


// BG PICKER 

async function buildPicker() {
  pickerGrid.innerHTML = '';

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    const fallback = FALLBACK_URLS[i] || {};

    // Resolve thumb (local first, remote fallback)
    const thumbSrc = await resolveImage(scene.thumb, fallback.thumb || scene.thumb);

    const card = document.createElement('div');
    card.className = 'picker-card' + (i === sceneIndex ? ' active' : '');

    card.innerHTML = `
      <img class="picker-card-img" src="${thumbSrc}" alt="${scene.name}" loading="lazy"/>
      <div class="picker-card-label">
        <span class="picker-card-name">${scene.name}</span>
        <span class="picker-card-track">${scene.trackName}</span>
      </div>
    `;
    card.addEventListener('click', () => applyScene(i, false));
    pickerGrid.appendChild(card);
  }


}

function openPicker() {
  buildPicker();
  pickerOverlay.classList.add('open');
}

function closePicker() { pickerOverlay.classList.remove('open'); }

sceneEl.addEventListener('click', openPicker);
pickerClose.addEventListener('click', closePicker);
pickerOverlay.addEventListener('click', e => { if (e.target === pickerOverlay) closePicker(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePicker(); closeModal(); }
});


// SHORTCUTS

function loadShortcuts() {
  try {
    const saved = localStorage.getItem('gb_shortcuts');
    shortcuts = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
  } catch {
    shortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
  }
  renderShortcuts();
}

function saveShortcuts() { localStorage.setItem('gb_shortcuts', JSON.stringify(shortcuts)); }

function renderShortcuts() {
  shortcutsEl.innerHTML = '';
  shortcuts.forEach((s, i) => {
    const a = document.createElement('a');
    a.className = 'shortcut';
    a.href = s.url;
    a.textContent = s.icon;
    a.dataset.label = s.label;
    a.title = s.label;
    a.addEventListener('contextmenu', e => { e.preventDefault(); showCtxMenu(e.clientX, e.clientY, i); });
    shortcutsEl.appendChild(a);
  });
  const addBtn = document.createElement('button');
  addBtn.className = 'add-btn';
  addBtn.title = 'Add shortcut';
  addBtn.textContent = '+';
  addBtn.addEventListener('click', openModal);
  shortcutsEl.appendChild(addBtn);
}


// ADD SHORTCUT MODAL

const overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.innerHTML = `
  <div class="modal" role="dialog" aria-modal="true" aria-label="Add shortcut">
    <h2>Add shortcut</h2>
    <div class="modal-field">
      <label for="m-url">URL</label>
      <input id="m-url" type="url" placeholder="https://example.com" autocomplete="off"/>
    </div>
    <div class="modal-field">
      <label for="m-label">Label</label>
      <input id="m-label" type="text" placeholder="Example" maxlength="16"/>
    </div>
    <div class="modal-field">
      <label for="m-icon">Icon (emoji or character)</label>
      <input id="m-icon" type="text" placeholder="★" maxlength="2"/>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" id="m-cancel">Cancel</button>
      <button class="btn-save"   id="m-save">Add</button>
    </div>
  </div>
`;
document.body.appendChild(overlay);

const mUrl = document.getElementById('m-url');
const mLabel = document.getElementById('m-label');
const mIcon = document.getElementById('m-icon');
const mCancel = document.getElementById('m-cancel');
const mSave = document.getElementById('m-save');

function openModal() { mUrl.value = mLabel.value = mIcon.value = ''; overlay.classList.add('open'); setTimeout(() => mUrl.focus(), 50); }
function closeModal() { overlay.classList.remove('open'); }

mCancel.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

mSave.addEventListener('click', () => {
  const url = mUrl.value.trim();
  const label = mLabel.value.trim() || 'Link';
  const icon = mIcon.value.trim() || '◈';
  if (!url) { mUrl.focus(); return; }
  const finalUrl = /^https?:\/\//i.test(url) ? url : 'https://' + url;
  shortcuts.push({ icon, label, url: finalUrl });
  saveShortcuts(); renderShortcuts(); closeModal();
});

[mUrl, mLabel, mIcon].forEach(input => {
  input.addEventListener('keydown', e => { if (e.key === 'Enter') mSave.click(); });
});


// CONTEXT MENU

const ctxMenu = document.createElement('div');
ctxMenu.className = 'ctx-menu';
ctxMenu.innerHTML = `
  <button class="ctx-item"        id="ctx-open">Open</button>
  <button class="ctx-item danger" id="ctx-remove">Remove</button>
`;
document.body.appendChild(ctxMenu);

let ctxIndex = -1;
function showCtxMenu(x, y, index) {
  ctxIndex = index;
  const menuW = 130, menuH = 68;
  ctxMenu.style.left = Math.min(x, window.innerWidth - menuW) + 'px';
  ctxMenu.style.top = Math.min(y, window.innerHeight - menuH) + 'px';
  ctxMenu.classList.add('open');
}
function hideCtxMenu() { ctxMenu.classList.remove('open'); }

document.getElementById('ctx-open').addEventListener('click', () => {
  if (ctxIndex >= 0) window.open(shortcuts[ctxIndex].url, '_blank');
  hideCtxMenu();
});
document.getElementById('ctx-remove').addEventListener('click', () => {
  if (ctxIndex >= 0) { shortcuts.splice(ctxIndex, 1); saveShortcuts(); renderShortcuts(); }
  hideCtxMenu();
});
document.addEventListener('click', hideCtxMenu);
document.addEventListener('contextmenu', hideCtxMenu, true);


// INIT

function init() {
  const saved = parseInt(localStorage.getItem('gb_scene') || '0', 10);
  applyScene(Number.isFinite(saved) ? saved : 0, false);
  loadShortcuts();
}

init();
