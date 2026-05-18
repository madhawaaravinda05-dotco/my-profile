// script.js — Main portfolio JS

document.addEventListener('DOMContentLoaded', () => {
  initData();
  loadPersonalData();
  loadSkills();
  loadProjects();
  initNavbar();
  initTyped();
  initScrollAnimations();
  initContactForm();
  initMobileNav();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      document.querySelector('.nav-links').classList.remove('open');
      document.querySelector('.hamburger').classList.remove('open');
      document.querySelector('.nav-overlay').classList.remove('show');
    });
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ===== MOBILE NAV =====
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    overlay.classList.toggle('show');
  });

  overlay.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
  });
}

// ===== TYPED EFFECT =====
function initTyped() {
  const personal = getPersonal();
  const roles = personal.roles || ["Full-Stack Developer", "CS Undergraduate", "Problem Solver"];
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(type, speed);
  }

  type();
}

// ===== LOAD PERSONAL DATA =====
function loadPersonalData() {
  const p = getPersonal();

  const heroName = document.getElementById('hero-name');
  if (heroName) heroName.textContent = p.displayName || 'Madhawa Aravinda';

  const aboutUni      = document.getElementById('about-university');
  const aboutDeg      = document.getElementById('about-degree');
  const aboutYear     = document.getElementById('about-year');
  const aboutText     = document.getElementById('about-text');
  const aboutCardName = document.getElementById('about-card-name');

  if (aboutUni)      aboutUni.textContent      = p.university || '';
  if (aboutDeg)      aboutDeg.textContent      = p.degree     || '';
  if (aboutYear)     aboutYear.textContent     = p.year       || '';
  if (aboutText)     aboutText.textContent     = p.about      || '';
  if (aboutCardName) aboutCardName.textContent = p.displayName|| '';

  const contactGithub   = document.getElementById('contact-github');
  const contactLinkedin = document.getElementById('contact-linkedin');
  const contactEmail    = document.getElementById('contact-email');

  if (contactGithub) {
    contactGithub.href = p.github || '#';
    const val = contactGithub.querySelector('.contact-link-value');
    if (val) val.textContent = (p.github || '').replace('https://', '');
  }
  if (contactLinkedin) {
    contactLinkedin.href = p.linkedin || '#';
    const val = contactLinkedin.querySelector('.contact-link-value');
    if (val) val.textContent = (p.linkedin || '').replace('https://www.linkedin.com/in/', '').replace('/', '');
  }
  if (contactEmail) {
    contactEmail.href = 'mailto:' + (p.email || '');
    const val = contactEmail.querySelector('.contact-link-value');
    if (val) val.textContent = p.email || '';
  }

  const footerName = document.getElementById('footer-name');
  if (footerName) footerName.textContent = p.fullName || 'P.M. Madhawa Aravinda Bandara Molagoda';
}

// ===== LOAD SKILLS =====
function loadSkills() {
  const skills = getSkills();
  renderPills('skills-languages',  skills.languages);
  renderPills('skills-frameworks', skills.frameworks);
  renderPills('skills-tools',      skills.tools);
  renderPills('skills-learning',   skills.learning);
}

function renderPills(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  (items || []).forEach(item => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.textContent = item;
    container.appendChild(pill);
  });
}

// ===== LOAD PROJECTS =====
function loadProjects() {
  const projects = getProjects();
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!projects || projects.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">No projects yet.</p>';
    return;
  }

  projects.forEach(project => {
    const card = createProjectCard(project);
    grid.appendChild(card);
  });

  setTimeout(() => {
    grid.querySelectorAll('.fade-in').forEach(el => {
      if (isInViewport(el)) el.classList.add('visible');
    });
  }, 100);
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card fade-in';

  let imgHtml = '';
  if (project.image && project.image.startsWith('data:')) {
    imgHtml = `<img src="${project.image}" alt="${escHtml(project.name)}" class="project-img" style="height:180px;object-fit:cover;width:100%;">`;
  } else {
    imgHtml = `
      <div class="project-img-placeholder">
        <span>${escHtml(project.name)}</span>
        <span class="project-img-tag">${escHtml(project.type || 'Project')}</span>
      </div>`;
  }

  const techBadges = (project.techStack || []).map(t =>
    `<span class="project-tech-badge">${escHtml(t)}</span>`
  ).join('');

  const liveBtn = project.liveLink
    ? `<a href="${escHtml(project.liveLink)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live Demo
      </a>` : '';

  const ghBtn = project.githubLink
    ? `<a href="${escHtml(project.githubLink)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>` : '';

  card.innerHTML = `
    ${imgHtml}
    <div class="project-body">
      <h3 class="project-name">${escHtml(project.name)}</h3>
      <p class="project-desc">${escHtml(project.description)}</p>
      <div class="project-tech">${techBadges}</div>
      <div class="project-role">${escHtml(project.role || '')}</div>
      <div class="project-links">${liveBtn}${ghBtn}</div>
    </div>
  `;

  return card;
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email-input').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Open WhatsApp with pre-filled message
    const whatsappNumber = '94771796516';
    const text = `Hello Madhawa,%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

    const success = document.getElementById('form-success');
    if (success) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
}

// ===== HELPERS =====
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
