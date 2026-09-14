/* =========================================================
   TBone portfolio, behavior
   ========================================================= */

// ---------- Typing effect ----------
// Reads phrases from qualities.txt (one per line). Edit that file
// to change what types out under the name on the homepage.
async function initTyping() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  let phrases = ['a developer'];
  try {
    const res = await fetch('qualities.txt', { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length) phrases = lines;
    }
  } catch (err) {
    // qualities.txt only loads over http(s), not file://.
    // Falls back to the default phrase above during local file testing.
  }

  const label = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.textContent = '';
  el.append(label, cursor);

  const TYPE_MS = 55;
  const DELETE_MS = 30;
  const HOLD_MS = 1400;

  let phraseIndex = 0;

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function typeOut(text) {
    for (let i = 1; i <= text.length; i++) {
      label.textContent = text.slice(0, i);
      await sleep(TYPE_MS);
    }
  }

  async function deleteBack(text) {
    for (let i = text.length; i >= 0; i--) {
      label.textContent = text.slice(0, i);
      await sleep(DELETE_MS);
    }
  }

  async function loop() {
    while (true) {
      const phrase = phrases[phraseIndex % phrases.length];
      await typeOut(phrase);
      await sleep(HOLD_MS);
      await deleteBack(phrase);
      phraseIndex++;
    }
  }

  loop();
}

// ---------- Mobile nav toggle ----------
function initNavToggle() {
  const btn = document.querySelector('[data-nav-toggle]');
  const list = document.querySelector('[data-nav-links]');
  if (!btn || !list) return;
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ---------- Active nav link ----------
function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-links] a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ---------- Scrapbook grid (projects.html, journal.html, homepage preview) ----------
// The same card grid powers Projects and Journal. Point a container at a
// different JSON file and link folder with data-source / data-base, e.g.
// <div class="project-board" data-projects data-source="/journal.json" data-base="journal"></div>
async function renderProjects() {
  const targets = document.querySelectorAll('[data-projects]');
  if (!targets.length) return;

  const cache = {};

  await Promise.all(
    [...targets].map(async (target) => {
      const source = target.dataset.source || '/projects.json';
      const base = target.dataset.base || 'projects';

      if (!cache[source]) {
        try {
          const res = await fetch(source, { cache: 'no-store' });
          cache[source] = res.ok ? await res.json() : [];
        } catch (err) {
          cache[source] = []; // requires http(s), see note in initTyping
          return;
        }
      }

      const entries = cache[source];
      const limit = Number(target.dataset.limit) || entries.length;
      const list = entries.slice(0, limit);
      target.innerHTML = list
        .map(
          (p) => `
        <div class="project-card">
          <a href="/${base}/${p.slug}.html">
            <div class="polaroid">
              <div class="shot">
                <img src="/${p.image}" alt="${p.title}" loading="lazy"
                     onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'placeholder',textContent:'Add image: ${p.image}'}))">
              </div>
            </div>
            <h3>${p.title}</h3>
          </a>
          <p class="role">${p.role}</p>
          <p class="meta">${p.stats}</p>
        </div>`
        )
        .join('');
    })
  );
}

// ---------- Reveal on scroll (homepage summary sections only) ----------
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => io.observe(t));
}

// ---------- Copy-to-clipboard buttons (contact page) ----------
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        return; // clipboard blocked (e.g. file://, older browser)
      }
      const original = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1400);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTyping();
  initNavToggle();
  markActiveNav();
  renderProjects();
  initReveal();
  initCopyButtons();
});
