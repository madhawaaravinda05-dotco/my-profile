// admin.js — Admin panel logic

const ADMIN_USER = 'madhawa';
const ADMIN_PASS = '50239191';

document.addEventListener('DOMContentLoaded', () => {
  initData();
  checkSession();
  initLogin();
  initSidebar();
  initProjectsPanel();
  initPersonalPanel();
  initSkillsPanel();
  initLogout();
});

// ===== SESSION =====
function checkSession() {
  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    showDashboard();
  }
}

function showDashboard() {
  document.getElementById('login-page').style.display = 'none';
  const dash = document.getElementById('dashboard-page');
  dash.style.display = 'flex';
  dash.classList.add('active');
  loadDashboardData();
  switchPanel('projects');
}

function showLogin() {
  document.getElementById('login-page').style.display = 'flex';
  const dash = document.getElementById('dashboard-page');
  dash.style.display = 'none';
  dash.classList.remove('active');
}

// ===== LOGIN =====
function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value;
    const err  = document.getElementById('login-error');

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_logged_in', 'true');
      err.classList.remove('show');
      showDashboard();
    } else {
      err.textContent = 'Invalid username or password. Please try again.';
      err.classList.add('show');
      document.getElementById('login-password').value = '';
    }
  });
}

// ===== LOGOUT =====
function initLogout() {
  const btn = document.getElementById('logout-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_logged_in');
      showLogin();
      showToast('Logged out successfully.', 'info');
    });
  }
}

// ===== SIDEBAR =====
function initSidebar() {
  document.querySelectorAll('.sidebar-link[data-panel]').forEach(link => {
    link.addEventListener('click', () => switchPanel(link.getAttribute('data-panel')));
  });

  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    });
  }
}

function switchPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link[data-panel]').forEach(l => l.classList.remove('active'));

  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');

  const link = document.querySelector(`.sidebar-link[data-panel="${name}"]`);
  if (link) link.classList.add('active');

  const titles = {
    projects: { title: 'Projects Manager',  sub: 'Add, edit, or remove portfolio projects' },
    personal: { title: 'Personal Details',  sub: 'Update your personal information' },
    skills:   { title: 'Skills Editor',     sub: 'Manage your tech stack and skills' }
  };
  const t = titles[name];
  if (t) {
    const el  = document.getElementById('topbar-title');
    const sub = document.getElementById('topbar-subtitle');
    if (el)  el.textContent  = t.title;
    if (sub) sub.textContent = t.sub;
  }

  if (name === 'projects') renderProjectList();
  if (name === 'personal') loadPersonalForm();
  if (name === 'skills')   loadSkillsForm();
}

function loadDashboardData() {
  const el = document.getElementById('stat-projects');
  if (el) el.textContent = getProjects().length;
}

// ===== PROJECTS PANEL =====
let editingProjectId = null;

function initProjectsPanel() {
  const addBtn = document.getElementById('add-project-btn');
  if (addBtn) addBtn.addEventListener('click', () => openProjectModal(null));

  const form = document.getElementById('project-form');
  if (form) form.addEventListener('submit', saveProject);

  const closeBtn = document.getElementById('project-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);

  const overlay = document.getElementById('project-modal-overlay');
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeProjectModal(); });

  const imgInput = document.getElementById('proj-image');
  if (imgInput) {
    imgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.getElementById('img-preview');
        if (preview) { preview.src = ev.target.result; preview.classList.add('show'); }
      };
      reader.readAsDataURL(file);
    });
  }
}

function renderProjectList() {
  const projects = getProjects();
  const list = document.getElementById('project-list');
  if (!list) return;

  if (!projects || projects.length === 0) {
    list.innerHTML = '<p style="color:var(--text3);text-align:center;padding:24px;">No projects yet. Click "Add New Project" to get started.</p>';
    return;
  }

  list.innerHTML = '';
  projects.forEach(project => {
    const item = document.createElement('div');
    item.className = 'project-list-item';

    const thumbHtml = (project.image && project.image.startsWith('data:'))
      ? `<img src="${project.image}" alt="">`
      : escHtml(project.name.substring(0, 20));

    const techBadges = (project.techStack || []).slice(0, 4).map(t =>
      `<span class="project-list-badge">${escHtml(t)}</span>`
    ).join('');

    item.innerHTML = `
      <div class="project-list-thumb">${thumbHtml}</div>
      <div class="project-list-info">
        <div class="project-list-name" title="${escHtml(project.name)}">${escHtml(project.name)}</div>
        <div class="project-list-type">${escHtml(project.type || 'Project')}</div>
        <div class="project-list-tech">${techBadges}</div>
      </div>
      <div class="project-list-actions">
        <button class="btn btn-ghost btn-sm" onclick="openProjectModal(${project.id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteProject(${project.id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Delete
        </button>
      </div>
    `;
    list.appendChild(item);
  });

  const stat = document.getElementById('stat-projects');
  if (stat) stat.textContent = projects.length;
}

function openProjectModal(id) {
  editingProjectId = id;
  const modal   = document.getElementById('project-modal-overlay');
  const title   = document.getElementById('project-modal-title');
  const form    = document.getElementById('project-form');
  const preview = document.getElementById('img-preview');

  form.reset();
  if (preview) { preview.src = ''; preview.classList.remove('show'); }

  if (id !== null) {
    const project = getProjects().find(p => p.id === id);
    if (!project) return;
    title.textContent = 'Edit Project';
    document.getElementById('proj-name').value   = project.name        || '';
    document.getElementById('proj-desc').value   = project.description || '';
    document.getElementById('proj-tech').value   = (project.techStack || []).join(', ');
    document.getElementById('proj-type').value   = project.type        || 'Solo Project';
    document.getElementById('proj-role').value   = project.role        || '';
    document.getElementById('proj-live').value   = project.liveLink    || '';
    document.getElementById('proj-github').value = project.githubLink  || '';
    if (project.image && project.image.startsWith('data:') && preview) {
      preview.src = project.image; preview.classList.add('show');
    }
  } else {
    title.textContent = 'Add New Project';
  }

  modal.classList.add('open');
}

function closeProjectModal() {
  document.getElementById('project-modal-overlay').classList.remove('open');
  editingProjectId = null;
}

function saveProject(e) {
  e.preventDefault();

  const name       = document.getElementById('proj-name').value.trim();
  const desc       = document.getElementById('proj-desc').value.trim();
  const techRaw    = document.getElementById('proj-tech').value.trim();
  const type       = document.getElementById('proj-type').value;
  const role       = document.getElementById('proj-role').value.trim();
  const liveLink   = document.getElementById('proj-live').value.trim();
  const githubLink = document.getElementById('proj-github').value.trim();
  const imgInput   = document.getElementById('proj-image');

  if (!name) { showToast('Project name is required.', 'error'); return; }

  const techStack = techRaw ? techRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const projects  = getProjects();

  const doSave = (imageData) => {
    if (editingProjectId !== null) {
      const idx = projects.findIndex(p => p.id === editingProjectId);
      if (idx !== -1) {
        projects[idx] = {
          ...projects[idx],
          name, description: desc, techStack, type, role, liveLink, githubLink,
          image: imageData !== null ? imageData : projects[idx].image
        };
      }
    } else {
      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
      projects.push({ id: newId, name, description: desc, techStack, type, role, liveLink, githubLink, image: imageData || '' });
    }
    saveProjects(projects);
    renderProjectList();
    closeProjectModal();
    showToast(editingProjectId !== null ? 'Project updated!' : 'Project added!', 'success');
  };

  const file = imgInput && imgInput.files && imgInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => doSave(ev.target.result);
    reader.readAsDataURL(file);
  } else {
    doSave(null);
  }
}

function confirmDeleteProject(id) {
  const project = getProjects().find(p => p.id === id);
  if (!project) return;

  const overlay = document.getElementById('confirm-overlay');
  const text    = document.getElementById('confirm-text');
  if (text) text.textContent = `Are you sure you want to delete "${project.name}"? This cannot be undone.`;
  overlay.classList.add('open');

  const cleanup = () => {
    overlay.classList.remove('open');
    document.getElementById('confirm-yes').replaceWith(document.getElementById('confirm-yes').cloneNode(true));
    document.getElementById('confirm-no').replaceWith(document.getElementById('confirm-no').cloneNode(true));
  };

  document.getElementById('confirm-yes').addEventListener('click', () => {
    saveProjects(getProjects().filter(p => p.id !== id));
    renderProjectList();
    showToast('Project deleted.', 'info');
    cleanup();
  }, { once: true });

  document.getElementById('confirm-no').addEventListener('click', cleanup, { once: true });
}

// ===== PERSONAL PANEL =====
function loadPersonalForm() {
  const p = getPersonal();
  setVal('p-fullname',    p.fullName);
  setVal('p-displayname', p.displayName);
  setVal('p-roles',       (p.roles || []).join(', '));
  setVal('p-about',       p.about);
  setVal('p-university',  p.university);
  setVal('p-degree',      p.degree);
  setVal('p-year',        p.year);
  setVal('p-email',       p.email);
  setVal('p-phone',       p.phone);
  setVal('p-github',      p.github);
  setVal('p-linkedin',    p.linkedin);
}

function initPersonalPanel() {
  const form = document.getElementById('personal-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    savePersonal({
      fullName:    getVal('p-fullname'),
      displayName: getVal('p-displayname'),
      roles:       getVal('p-roles').split(',').map(r => r.trim()).filter(Boolean),
      about:       getVal('p-about'),
      university:  getVal('p-university'),
      degree:      getVal('p-degree'),
      year:        getVal('p-year'),
      email:       getVal('p-email'),
      phone:       getVal('p-phone'),
      github:      getVal('p-github'),
      linkedin:    getVal('p-linkedin')
    });
    showToast('Personal details saved!', 'success');
  });
}

// ===== SKILLS PANEL =====
function loadSkillsForm() {
  const s = getSkills();
  setVal('s-languages',  (s.languages  || []).join(', '));
  setVal('s-frameworks', (s.frameworks || []).join(', '));
  setVal('s-tools',      (s.tools      || []).join(', '));
  setVal('s-learning',   (s.learning   || []).join(', '));
}

function initSkillsPanel() {
  const form = document.getElementById('skills-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSkills({
      languages:  getVal('s-languages').split(',').map(x => x.trim()).filter(Boolean),
      frameworks: getVal('s-frameworks').split(',').map(x => x.trim()).filter(Boolean),
      tools:      getVal('s-tools').split(',').map(x => x.trim()).filter(Boolean),
      learning:   getVal('s-learning').split(',').map(x => x.trim()).filter(Boolean)
    });
    showToast('Skills updated!', 'success');
  });
}

// ===== TOAST =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== HELPERS =====
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
