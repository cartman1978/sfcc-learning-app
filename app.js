'use strict';

// ── Auth ──────────────────────────────────────────────────────────────────────
const USERS_KEY = 'sfcc_users_v1';
const SESSION_KEY = 'sfcc_session_v1';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
}

function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
}

function setSession(username) { localStorage.setItem(SESSION_KEY, JSON.stringify(username)); }

function clearSession() { localStorage.removeItem(SESSION_KEY); }

function register(username, password) {
  username = username.trim();
  if (!username || !password) return { error: 'Username and password are required.' };
  if (username.length < 3) return { error: 'Username must be at least 3 characters.' };
  if (password.length < 4) return { error: 'Password must be at least 4 characters.' };
  const users = getUsers();
  if (users[username]) return { error: 'Username already taken.' };
  users[username] = { password, progress: {} };
  saveUsers(users);
  setSession(username);
  return { ok: true };
}

function login(username, password) {
  username = username.trim();
  const users = getUsers();
  if (!users[username] || users[username].password !== password) {
    return { error: 'Invalid username or password.' };
  }
  setSession(username);
  return { ok: true };
}

function logout() {
  clearSession();
  progress = {};
  renderUserArea();
  updateTopbarProgress();
  navigate('dashboard');
}

// ── Progress (per-user) ───────────────────────────────────────────────────────
let progress = {};

function loadProgress() {
  const user = getCurrentUser();
  if (!user) return {};
  const users = getUsers();
  return (users[user] && users[user].progress) || {};
}

function saveProgress(p) {
  const user = getCurrentUser();
  if (!user) return;
  const users = getUsers();
  if (users[user]) {
    users[user].progress = p;
    saveUsers(users);
  }
}

function reloadProgress() {
  progress = loadProgress();
}

function isLessonComplete(lessonId) {
  return !!(progress[lessonId] && progress[lessonId].completed);
}

function markComplete(lessonId, score) {
  if (!getCurrentUser()) return;
  progress[lessonId] = { completed: true, score, date: Date.now() };
  saveProgress(progress);
  refreshSidebar();
  updateTopbarProgress();
}

function getOverallPercent() {
  const all = getAllLessons();
  if (!all.length) return 0;
  const done = all.filter(l => isLessonComplete(l.id)).length;
  return Math.round((done / all.length) * 100);
}

function getAllLessons() {
  return CURRICULUM.flatMap(m => m.lessons);
}

// ── Routing ───────────────────────────────────────────────────────────────────
let currentView = { type: 'dashboard', moduleId: null, lessonId: null };

function navigate(type, moduleId, lessonId) {
  currentView = { type, moduleId, lessonId };
  if (type === 'dashboard') renderDashboard();
  else if (type === 'lesson') renderLesson(moduleId, lessonId);
}

// ── Lookup helpers ─────────────────────────────────────────────────────────────
function getModule(id) { return CURRICULUM.find(m => m.id === id); }
function getLesson(moduleId, lessonId) {
  const mod = getModule(moduleId);
  return mod ? mod.lessons.find(l => l.id === lessonId) : null;
}
function getAdjacentLessons(moduleId, lessonId) {
  const allPairs = CURRICULUM.flatMap(m => m.lessons.map(l => ({ moduleId: m.id, lessonId: l.id })));
  const idx = allPairs.findIndex(p => p.moduleId === moduleId && p.lessonId === lessonId);
  return { prev: allPairs[idx - 1] || null, next: allPairs[idx + 1] || null };
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
// Keep filter state outside buildSidebar so rebuilds preserve the selection
let sidebarFilter = 'both';

function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  // Home link
  const homeLink = document.createElement('div');
  homeLink.className = `sidebar-home${currentView.type === 'dashboard' ? ' active' : ''}`;
  homeLink.innerHTML = '🏠 <span>Home</span>';
  homeLink.addEventListener('click', () => navigate('dashboard'));
  sidebar.appendChild(homeLink);

  // Filter pills
  const pillWrap = document.createElement('div');
  pillWrap.style.cssText = 'display:flex;gap:4px;padding:8px 16px 4px;';

  ['Both', 'B2C', 'B2B'].forEach(label => {
    const pill = document.createElement('button');
    pill.textContent = label;
    const key = label.toLowerCase();
    const isActive = key === sidebarFilter;
    pill.style.cssText = `flex:1;padding:4px 0;border-radius:12px;border:1px solid var(--gray-300);
      background:${isActive ? 'var(--blue)' : 'var(--gray-100)'};
      color:${isActive ? '#fff' : 'var(--gray-700)'};
      border-color:${isActive ? 'var(--blue)' : 'var(--gray-300)'};
      font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;`;
    pill.addEventListener('click', () => {
      sidebarFilter = key;
      buildSidebar();
    });
    pillWrap.appendChild(pill);
  });
  sidebar.appendChild(pillWrap);

  const sectionLabel = document.createElement('div');
  sectionLabel.className = 'sidebar-section-label';
  sectionLabel.textContent = 'Modules';
  sidebar.appendChild(sectionLabel);

  CURRICULUM.forEach(mod => {
    if (sidebarFilter !== 'both' && mod.type !== 'both' && mod.type !== sidebarFilter) return;

    const modEl = document.createElement('div');
    modEl.className = 'sidebar-module';
    if (currentView.moduleId === mod.id) modEl.classList.add('open');

    const modHeader = document.createElement('div');
    modHeader.className = 'sidebar-module-header';
    modHeader.innerHTML = `
      <span class="mod-icon">${mod.icon}</span>
      <span class="mod-title">${mod.title}</span>
      <span class="chevron">▶</span>`;
    modHeader.addEventListener('click', () => modEl.classList.toggle('open'));

    const lessonsEl = document.createElement('div');
    lessonsEl.className = 'sidebar-lessons';

    mod.lessons.forEach(lesson => {
      const lessonEl = document.createElement('div');
      lessonEl.className = 'sidebar-lesson';
      if (currentView.lessonId === lesson.id) lessonEl.classList.add('active');

      const dot = document.createElement('span');
      dot.className = `lesson-dot${isLessonComplete(lesson.id) ? ' done' : (currentView.lessonId === lesson.id ? ' active' : '')}`;

      const typeTag = lesson.type !== 'both'
        ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;
            background:${lesson.type === 'b2c' ? 'var(--blue-light)' : 'var(--orange-light)'};
            color:${lesson.type === 'b2c' ? 'var(--blue)' : 'var(--orange)'};margin-left:4px;">
            ${lesson.type.toUpperCase()}</span>`
        : '';

      lessonEl.appendChild(dot);
      const span = document.createElement('span');
      span.innerHTML = lesson.title + typeTag;
      span.style.flex = '1';
      lessonEl.appendChild(span);

      lessonEl.addEventListener('click', () => navigate('lesson', mod.id, lesson.id));
      lessonsEl.appendChild(lessonEl);
    });

    modEl.appendChild(modHeader);
    modEl.appendChild(lessonsEl);
    sidebar.appendChild(modEl);
  });
}

function refreshSidebar() { buildSidebar(); }

// ── Topbar ────────────────────────────────────────────────────────────────────
function updateTopbarProgress() {
  const pct = getOverallPercent();
  document.querySelector('.progress-bar-fill').style.width = pct + '%';
  document.querySelector('.overall-progress span').textContent = `${pct}% complete`;
}

// ── User Area (topbar) ────────────────────────────────────────────────────────
function renderUserArea() {
  const area = document.getElementById('user-area');
  const user = getCurrentUser();

  if (user) {
    area.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
        <span style="opacity:.85;">👤 ${escapeHtml(user)}</span>
        <button id="logout-btn" style="background:rgba(255,255,255,.2);border:none;color:#fff;
          padding:4px 10px;border-radius:12px;cursor:pointer;font-size:12px;font-weight:600;">
          Log out
        </button>
      </div>`;
    document.getElementById('logout-btn').addEventListener('click', logout);
  } else {
    area.innerHTML = `
      <button id="auth-btn" style="background:rgba(255,255,255,.2);border:none;color:#fff;
        padding:6px 14px;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600;
        display:flex;align-items:center;gap:6px;">
        👤 Log in / Register
      </button>`;
    document.getElementById('auth-btn').addEventListener('click', showAuthModal);
  }
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function showAuthModal() {
  // Remove any existing modal
  document.getElementById('auth-modal-backdrop')?.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'auth-modal-backdrop';
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });

  let mode = 'login'; // 'login' | 'register'

  function renderModal() {
    backdrop.innerHTML = '';
    const modal = document.createElement('div');
    modal.className = 'auth-modal';

    modal.innerHTML = `
      <button class="auth-modal-close" id="auth-close">✕</button>
      <div class="auth-modal-logo">☁️</div>
      <h2 class="auth-modal-title">${mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
      <p class="auth-modal-sub">
        ${mode === 'login'
          ? 'Log in to save your quiz results and track progress.'
          : 'Register to save your progress across sessions.'}
      </p>

      <div class="auth-tabs">
        <button class="auth-tab-btn ${mode === 'login' ? 'active' : ''}" id="tab-login">Log in</button>
        <button class="auth-tab-btn ${mode === 'register' ? 'active' : ''}" id="tab-register">Register</button>
      </div>

      <div id="auth-error" class="auth-error" style="display:none"></div>

      <div class="auth-form">
        <label class="auth-label">Username</label>
        <input id="auth-username" class="auth-input" type="text" placeholder="e.g. john_doe" autocomplete="username"/>

        <label class="auth-label">Password</label>
        <input id="auth-password" class="auth-input" type="password" placeholder="••••••••" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}"/>

        <button class="btn btn-primary auth-submit" id="auth-submit">
          ${mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </div>

      <p class="auth-switch">
        ${mode === 'login'
          ? "Don't have an account? <a id='switch-mode'>Register</a>"
          : "Already have an account? <a id='switch-mode'>Log in</a>"}
      </p>`;

    backdrop.appendChild(modal);

    modal.querySelector('#auth-close').addEventListener('click', () => backdrop.remove());
    modal.querySelector('#tab-login').addEventListener('click', () => { mode = 'login'; renderModal(); });
    modal.querySelector('#tab-register').addEventListener('click', () => { mode = 'register'; renderModal(); });
    modal.querySelector('#switch-mode').addEventListener('click', () => {
      mode = mode === 'login' ? 'register' : 'login';
      renderModal();
    });

    const usernameInput = modal.querySelector('#auth-username');
    const passwordInput = modal.querySelector('#auth-password');
    const errorBox = modal.querySelector('#auth-error');

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
    }

    function submit() {
      const username = usernameInput.value;
      const password = passwordInput.value;
      errorBox.style.display = 'none';

      const result = mode === 'login' ? login(username, password) : register(username, password);
      if (result.error) {
        showError(result.error);
        return;
      }
      // Success
      reloadProgress();
      backdrop.remove();
      renderUserArea();
      updateTopbarProgress();
      refreshSidebar();
    }

    modal.querySelector('#auth-submit').addEventListener('click', submit);
    // Submit on Enter key
    [usernameInput, passwordInput].forEach(input => {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    });

    setTimeout(() => usernameInput.focus(), 50);
  }

  renderModal();
  document.body.appendChild(backdrop);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function renderDashboard() {
  buildSidebar();
  const main = document.getElementById('main');
  main.innerHTML = '';

  const dash = document.createElement('div');
  dash.id = 'dashboard';

  const user = getCurrentUser();
  const hero = document.createElement('div');
  hero.className = 'dash-hero';
  hero.innerHTML = `
    <h1>Salesforce Commerce Cloud Learning Path</h1>
    <p>${user ? `Welcome back, <strong>${escapeHtml(user)}</strong>! ` : ''}Master both B2C and B2B Commerce with hands-on lessons, real code examples, and quizzes. ${getAllLessons().length} lessons across ${CURRICULUM.length} modules.</p>`;

  // Show login prompt if not logged in
  if (!user) {
    const loginBanner = document.createElement('div');
    loginBanner.className = 'login-banner';
    loginBanner.innerHTML = `
      <span>👤 Log in or register to save your quiz results and track progress across sessions.</span>
      <button class="btn btn-primary" id="banner-login-btn" style="flex-shrink:0;padding:6px 16px;font-size:13px;">Log in / Register</button>`;
    loginBanner.querySelector('#banner-login-btn').addEventListener('click', showAuthModal);
    dash.appendChild(hero);
    dash.appendChild(loginBanner);
  } else {
    dash.appendChild(hero);
  }

  // Tab filter
  let activeDashFilter = 'all';
  const tabRow = document.createElement('div');
  tabRow.className = 'dash-tabs';
  [['All', 'all'], ['B2C Commerce', 'b2c'], ['B2B Commerce', 'b2b']].forEach(([label, key]) => {
    const btn = document.createElement('button');
    btn.className = 'dash-tab-btn' + (key === activeDashFilter ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      activeDashFilter = key;
      tabRow.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(activeDashFilter);
    });
    tabRow.appendChild(btn);
  });
  dash.appendChild(tabRow);

  const grid = document.createElement('div');
  grid.className = 'dash-grid';
  grid.id = 'dash-grid';
  dash.appendChild(grid);
  main.appendChild(dash);

  function renderCards(filter) {
    grid.innerHTML = '';
    CURRICULUM.forEach(mod => {
      if (filter !== 'all' && mod.type !== 'both' && mod.type !== filter) return;

      const doneLessons = mod.lessons.filter(l => isLessonComplete(l.id)).length;
      const pct = Math.round((doneLessons / mod.lessons.length) * 100);

      const card = document.createElement('div');
      card.className = 'module-card';
      card.style.borderTop = `3px solid ${mod.color}`;

      const typeLabel = mod.type === 'both' ? 'B2C + B2B' : mod.type.toUpperCase();
      const typeBadge = `<span class="badge badge-${mod.type === 'b2b' ? 'b2b' : mod.type === 'b2c' ? 'b2c' : ''}"
        style="${mod.type === 'both' ? 'background:var(--gray-200);color:var(--gray-700)' : ''}">${typeLabel}</span>`;

      card.innerHTML = `
        <div class="module-card-icon">${mod.icon}</div>
        <div class="module-card-title">${mod.title}</div>
        <div class="module-card-desc">${mod.description}</div>
        <div style="margin-bottom:8px">${typeBadge}</div>
        <div class="module-card-progress">
          <div class="module-card-progress-fill" style="width:${pct}%;background:${mod.color}"></div>
        </div>
        <div class="module-card-meta">${doneLessons} / ${mod.lessons.length} lessons complete</div>`;

      card.addEventListener('click', () => {
        const firstIncomplete = mod.lessons.find(l => !isLessonComplete(l.id)) || mod.lessons[0];
        navigate('lesson', mod.id, firstIncomplete.id);
      });

      grid.appendChild(card);
    });
  }

  renderCards(activeDashFilter);
}

// ── Lesson View ───────────────────────────────────────────────────────────────
function renderLesson(moduleId, lessonId) {
  buildSidebar();
  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!mod || !lesson) { renderDashboard(); return; }

  const main = document.getElementById('main');
  main.innerHTML = '';

  const view = document.createElement('div');
  view.id = 'lesson-view';

  // Breadcrumb
  const crumb = document.createElement('div');
  crumb.className = 'lesson-breadcrumb';
  crumb.innerHTML = `
    <a id="crumb-home">🏠 Home</a> ›
    <span>${mod.icon} ${mod.title}</span> ›
    <span>${lesson.title}</span>`;
  crumb.querySelector('#crumb-home').addEventListener('click', () => navigate('dashboard'));
  view.appendChild(crumb);

  // Header
  const header = document.createElement('div');
  header.className = 'lesson-header';
  const typeLabel = lesson.type === 'both' ? 'B2C + B2B'
    : lesson.type === 'b2c' ? 'B2C Commerce' : 'B2B Commerce';
  const typeBadgeClass = lesson.type === 'b2b' ? 'badge-b2b' : 'badge-b2c';
  const typeBadgeStyle = lesson.type === 'both' ? 'style="background:var(--gray-200);color:var(--gray-700)"' : '';

  header.innerHTML = `
    <div class="lesson-header-info" style="flex:1">
      <h2>${lesson.title}</h2>
      <div class="lesson-meta">
        <span>⏱ ${lesson.duration}</span>
        <span class="badge ${typeBadgeClass}" ${typeBadgeStyle}>${typeLabel}</span>
        ${isLessonComplete(lessonId) ? '<span class="badge badge-done">✓ Completed</span>' : ''}
      </div>
    </div>`;
  view.appendChild(header);

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'tabs';
  const panels = document.createElement('div');

  ['Concept', 'Code Examples', 'Quiz'].forEach((tabLabel, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = tabLabel;
    const panel = document.createElement('div');
    panel.className = 'tab-panel' + (i === 0 ? ' active' : '');

    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      panels.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      panel.classList.add('active');
    });

    if (i === 0) buildConceptPanel(panel, lesson);
    else if (i === 1) buildCodePanel(panel, lesson);
    else buildQuizPanel(panel, lesson, moduleId);

    tabs.appendChild(btn);
    panels.appendChild(panel);
  });

  view.appendChild(tabs);
  view.appendChild(panels);

  // Prev / Next
  const { prev, next } = getAdjacentLessons(moduleId, lessonId);
  const navRow = document.createElement('div');
  navRow.className = 'lesson-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'lesson-nav-btn';
  prevBtn.disabled = !prev;
  if (prev) {
    const prevLesson = getLesson(prev.moduleId, prev.lessonId);
    prevBtn.innerHTML = `← ${prevLesson ? prevLesson.title : ''}`;
    prevBtn.addEventListener('click', () => navigate('lesson', prev.moduleId, prev.lessonId));
  } else {
    prevBtn.textContent = '← Previous';
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'lesson-nav-btn';
  nextBtn.disabled = !next;
  if (next) {
    const nextLesson = getLesson(next.moduleId, next.lessonId);
    nextBtn.innerHTML = `${nextLesson ? nextLesson.title : ''} →`;
    nextBtn.addEventListener('click', () => navigate('lesson', next.moduleId, next.lessonId));
  } else {
    nextBtn.textContent = 'Next →';
  }

  navRow.appendChild(prevBtn);
  navRow.appendChild(nextBtn);
  view.appendChild(navRow);

  main.appendChild(view);
  main.scrollTop = 0;
}

// ── Concept Panel ─────────────────────────────────────────────────────────────
function buildConceptPanel(panel, lesson) {
  panel.className += ' concept-panel';
  lesson.concept.forEach(item => {
    if (item.type === 'p') {
      const p = document.createElement('p');
      p.innerHTML = item.text;
      panel.appendChild(p);
    } else if (item.type === 'heading') {
      const h = document.createElement('div');
      h.className = 'concept-heading';
      h.textContent = item.text;
      panel.appendChild(h);
    } else if (item.type === 'callout') {
      const c = document.createElement('div');
      c.className = `callout ${item.callout}`;
      c.innerHTML = `<strong>${item.title}</strong>${item.text}`;
      panel.appendChild(c);
    }
  });
}

// ── Code Panel ────────────────────────────────────────────────────────────────
function buildCodePanel(panel, lesson) {
  if (!lesson.code || !lesson.code.length) {
    panel.innerHTML = '<p style="color:var(--gray-500);padding:20px 0">No code examples for this lesson.</p>';
    return;
  }
  lesson.code.forEach(ex => {
    const wrap = document.createElement('div');
    wrap.className = 'code-example';

    const title = document.createElement('div');
    title.className = 'code-example-title';
    title.textContent = ex.title;
    wrap.appendChild(title);

    const blockWrap = document.createElement('div');
    blockWrap.className = 'code-block-wrap';

    const langTag = document.createElement('span');
    langTag.className = 'code-lang-tag';
    langTag.textContent = ex.lang;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.title = 'Copy code';
    copyBtn.innerHTML = '⎘';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(ex.code).then(() => {
        copyBtn.innerHTML = '✓';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.innerHTML = '⎘'; copyBtn.classList.remove('copied'); }, 1500);
      });
    });

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.innerHTML = syntaxHighlight(ex.code, ex.lang);
    pre.appendChild(code);

    blockWrap.appendChild(langTag);
    blockWrap.appendChild(copyBtn);
    blockWrap.appendChild(pre);
    wrap.appendChild(blockWrap);

    if (ex.explanation) {
      const exp = document.createElement('div');
      exp.className = 'code-explanation';
      exp.innerHTML = '💡 ' + ex.explanation;
      wrap.appendChild(exp);
    }

    panel.appendChild(wrap);
  });
}

// Basic syntax highlighter
function syntaxHighlight(code, lang) {
  let s = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (lang === 'javascript' || lang === 'js') {
    s = s.replace(/\b(var|let|const|function|return|if|else|new|this|module|exports|require|class|extends|async|await|try|catch|throw|typeof|instanceof|for|while|do|break|continue|null|undefined|true|false)\b/g,
      '<span class="kw">$1</span>');
    s = s.replace(/(&#39;|'|`)((?:\\.|(?!\1).)*)\1/g, '<span class="st">$1$2$1</span>');
    s = s.replace(/(")((?:\\.|[^"])*)"/, '<span class="st">"$2"</span>');
    s = s.replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>');
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');
    s = s.replace(/\b(\d+\.?\d*)\b/g, '<span class="nm">$1</span>');
    s = s.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="fn">$1</span>');
  } else if (lang === 'xml' || lang === 'isml' || lang === 'html') {
    s = s.replace(/(&lt;\/?)([\w:-]+)/g, '<span class="tg">$1$2</span>');
    s = s.replace(/\b([\w:-]+)=/g, '<span class="at">$1</span>=');
    s = s.replace(/("([^"]*)")/g, '<span class="st">$1</span>');
    s = s.replace(/(&lt;!---[\s\S]*?---&gt;)/g, '<span class="cm">$1</span>');
  } else if (lang === 'json') {
    s = s.replace(/("[\w\s-]+")\s*:/g, '<span class="at">$1</span>:');
    s = s.replace(/:\s*("([^"]*)")/g, ': <span class="st">$1</span>');
    s = s.replace(/\b(true|false|null)\b/g, '<span class="kw">$1</span>');
    s = s.replace(/\b(\d+\.?\d*)\b/g, '<span class="nm">$1</span>');
  } else if (lang === 'bash') {
    s = s.replace(/(#[^\n]*)/g, '<span class="cm">$1</span>');
    s = s.replace(/\b(npm|npx|sfcc-ci|git|cd|mkdir|export|echo|curl)\b/g, '<span class="kw">$1</span>');
    s = s.replace(/("([^"]*)")/g, '<span class="st">$1</span>');
    s = s.replace(/(--[\w-]+)/g, '<span class="at">$1</span>');
  }
  return s;
}

// ── Quiz Panel ────────────────────────────────────────────────────────────────
function buildQuizPanel(panel, lesson, moduleId) {
  const quizState = {
    step: 'start',
    current: 0,
    answers: [],
    results: []
  };

  function render() {
    panel.innerHTML = '';

    if (quizState.step === 'start') {
      const start = document.createElement('div');
      start.className = 'quiz-start';

      const user = getCurrentUser();
      if (!user) {
        start.innerHTML = `
          <div style="font-size:36px;margin-bottom:12px">🔒</div>
          <h3>Sign in to take the quiz</h3>
          <p>Create a free account to take quizzes, track your scores, and mark lessons complete.</p>`;
        const loginBtn = document.createElement('button');
        loginBtn.className = 'btn btn-primary';
        loginBtn.textContent = 'Log in / Register';
        loginBtn.addEventListener('click', () => {
          showAuthModal();
          // After modal closes and user is logged in, refresh quiz panel
          const observer = new MutationObserver(() => {
            if (!document.getElementById('auth-modal-backdrop') && getCurrentUser()) {
              observer.disconnect();
              render();
            }
          });
          observer.observe(document.body, { childList: true });
        });
        start.appendChild(loginBtn);
      } else {
        start.innerHTML = `
          <h3>Ready to test your knowledge?</h3>
          <p>${lesson.quiz.length} questions · Pass with 70% or higher</p>`;
        const startBtn = document.createElement('button');
        startBtn.className = 'btn btn-primary';
        startBtn.textContent = 'Start Quiz';
        startBtn.addEventListener('click', () => {
          quizState.step = 'question';
          quizState.current = 0;
          quizState.answers = new Array(lesson.quiz.length).fill(null);
          quizState.results = new Array(lesson.quiz.length).fill(null);
          render();
        });
        start.appendChild(startBtn);

        // Show previous score if exists
        if (progress[lesson.id] && progress[lesson.id].score !== undefined) {
          const prev = document.createElement('p');
          prev.style.cssText = 'margin-top:12px;font-size:12px;color:var(--gray-500)';
          prev.textContent = `Previous best: ${progress[lesson.id].score}%`;
          start.appendChild(prev);
        }
      }

      panel.appendChild(start);
      return;
    }

    if (quizState.step === 'done') {
      const correct = quizState.results.filter(Boolean).length;
      const pct = Math.round((correct / lesson.quiz.length) * 100);
      const pass = pct >= 70;

      const result = document.createElement('div');
      result.className = 'quiz-result';
      result.innerHTML = `
        <div class="score-circle ${pass ? 'pass' : 'fail'}">
          <span class="score-num">${pct}%</span>
          <span class="score-label">${pass ? 'PASS' : 'FAIL'}</span>
        </div>
        <h3>${pass ? '🎉 Well done!' : 'Keep practising'}</h3>
        <p>${correct} of ${lesson.quiz.length} correct${pass ? ' — lesson marked complete!' : ' — you need 70% to pass.'}</p>`;

      const btnRow = document.createElement('div');
      btnRow.className = 'quiz-result-btns';

      const retryBtn = document.createElement('button');
      retryBtn.className = 'btn btn-secondary';
      retryBtn.textContent = 'Retry Quiz';
      retryBtn.addEventListener('click', () => { quizState.step = 'start'; render(); });
      btnRow.appendChild(retryBtn);

      if (pass) {
        markComplete(lesson.id, pct);
        const { next } = getAdjacentLessons(moduleId, lesson.id);
        if (next) {
          const nextBtn = document.createElement('button');
          nextBtn.className = 'btn btn-success';
          nextBtn.textContent = 'Next Lesson →';
          nextBtn.addEventListener('click', () => navigate('lesson', next.moduleId, next.lessonId));
          btnRow.appendChild(nextBtn);
        }
      }

      result.appendChild(btnRow);
      panel.appendChild(result);
      return;
    }

    // Question
    const q = lesson.quiz[quizState.current];
    const isAnswered = quizState.step === 'answered';

    const qWrap = document.createElement('div');
    qWrap.className = 'quiz-question';

    const prog = document.createElement('div');
    prog.className = 'quiz-progress';
    prog.innerHTML = `Question ${quizState.current + 1} of ${lesson.quiz.length} &nbsp;`;
    const dots = document.createElement('div');
    dots.className = 'quiz-progress-dots';
    quizState.results.forEach((r, i) => {
      const dot = document.createElement('span');
      dot.className = `quiz-dot${i === quizState.current ? ' current' : r === true ? ' correct' : r === false ? ' wrong' : ''}`;
      dots.appendChild(dot);
    });
    prog.appendChild(dots);
    qWrap.appendChild(prog);

    const qText = document.createElement('div');
    qText.className = 'quiz-q-text';
    qText.textContent = q.q;
    qWrap.appendChild(qText);

    const opts = document.createElement('div');
    opts.className = 'quiz-options';

    q.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      const letter = String.fromCharCode(65 + i);
      btn.innerHTML = `<span class="option-letter">${letter}</span><span>${optText}</span>`;

      if (isAnswered) {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add('correct');
        else if (i === quizState.answers[quizState.current] && i !== q.correct) btn.classList.add('wrong');
      } else {
        btn.addEventListener('click', () => {
          quizState.answers[quizState.current] = i;
          quizState.results[quizState.current] = (i === q.correct);
          quizState.step = 'answered';
          render();
        });
      }
      opts.appendChild(btn);
    });
    qWrap.appendChild(opts);

    if (isAnswered) {
      const correct = quizState.results[quizState.current];
      const exp = document.createElement('div');
      exp.className = `quiz-explanation ${correct ? 'correct-exp' : 'wrong-exp'}`;
      exp.innerHTML = `<strong>${correct ? '✓ Correct!' : '✗ Incorrect.'}</strong> ${q.explanation}`;
      qWrap.appendChild(exp);

      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary';
      const isLast = quizState.current >= lesson.quiz.length - 1;
      nextBtn.textContent = isLast ? 'See Results' : 'Next Question →';
      nextBtn.addEventListener('click', () => {
        quizState.step = isLast ? 'done' : 'question';
        if (!isLast) quizState.current++;
        render();
      });
      qWrap.appendChild(nextBtn);
    }

    panel.appendChild(qWrap);
  }

  render();
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const themeBtn = document.getElementById('theme-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark || localStorage.getItem('sfcc_theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️';
  }
  themeBtn.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    themeBtn.textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('sfcc_theme', dark ? 'light' : 'dark');
  });

  // Home button (logo)
  document.getElementById('logo-home').addEventListener('click', () => navigate('dashboard'));

  // Load user session + progress
  reloadProgress();
  renderUserArea();
  updateTopbarProgress();
  navigate('dashboard');
});
