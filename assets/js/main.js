/**
 * BRIGHTPATH AFTER-SCHOOL LEARNING CENTER — PUBLIC MAIN JAVASCRIPT
 * Consolidates: Theme switcher, RTL switcher, Mobile drawer, Global modal system,
 * Page interactive filters (Home, Programs, Tutors, Pricing, Contact, Auth).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initThemeSystem();
  initRtlSystem();
  initNavigation();
  initGlobalModal();
  initPageInteractiveElements();
  initRoutineSimulator();
  initAuthForms();
  initBackToTop();
});

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('login.html') || path.includes('register.html') || path.includes('dashboard.html')) {
    return;
  }

  let btn = document.getElementById('backToTop');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to Top');
    btn.setAttribute('title', 'Scroll to Top');
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
    document.body.appendChild(btn);
  }

  const toggleVisibility = () => {
    if (window.scrollY > 250) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility();
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   01. THEME ENGINE (Light / Dark)
   ========================================================================== */
function initThemeSystem() {
  const savedTheme = localStorage.getItem('brightpath_theme') || 'light';
  setTheme(savedTheme);

  document.querySelectorAll('.js-theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  });
}

function initRtlSystem() {
  const savedDir = localStorage.getItem('brightpath_dir') || 'ltr';
  setDirection(savedDir);

  document.querySelectorAll('.js-rtl-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      setDirection(nextDir);
    });
  });
}

const sunSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const moonSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const rtlSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`;

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('brightpath_theme', theme);
  
  document.querySelectorAll('.js-theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

function setDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
  localStorage.setItem('brightpath_dir', dir);

  document.querySelectorAll('.js-rtl-toggle').forEach(btn => {
    btn.innerHTML = rtlSvg;
    btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  });
}

/* ==========================================================================
   03. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initNavigation() {
  const drawer = document.getElementById('mobileDrawer');
  const openBtn = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('drawerClose');
  const backdrop = document.getElementById('drawerBackdrop');

  if (!drawer || !openBtn) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    openBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    openBtn.classList.remove('active');
    document.body.style.overflow = '';
  };

  const toggleDrawer = () => {
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  openBtn.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Highlight active link in navbar and mobile drawer
  let currentFile = window.location.pathname.split('/').pop().split('#')[0].split('?')[0];
  if (!currentFile) currentFile = 'index.html';

  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkFile = href.split('/').pop().split('#')[0].split('?')[0];
      if (linkFile === currentFile || (currentFile === 'index.html' && (linkFile === 'index.html' || linkFile === ''))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/* ==========================================================================
   04. REUSABLE GLOBAL MODAL SYSTEM
   ========================================================================== */
function initGlobalModal() {
  const overlay = document.getElementById('globalModal');
  if (!overlay) return;

  const closeBtns = overlay.querySelectorAll('.js-modal-close');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalBody');

  window.openModal = function(title, contentHtml) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = contentHtml;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(btn => btn.addEventListener('click', window.closeModal));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      window.closeModal();
    }
  });

  // Attach session trigger buttons
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('.js-book-trigger');
    if (trigger) {
      e.preventDefault();
      const sessionType = trigger.dataset.session || 'Homework Support & Enrichment';
      const ctaFormHtml = `
        <form id="modalSessionForm" class="modal-form">
          <p style="margin-bottom:20px; color:var(--text-muted);">Fill out your information below to schedule your trial after-school session.</p>
          <div class="form-group">
            <label class="form-label">Parent Name</label>
            <input type="text" class="form-input" required placeholder="e.g. Sarah Morgan" />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" required placeholder="parent@example.com" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Child Grade</label>
              <select class="form-input" required>
                <option value="">Select Grade</option>
                <option value="Elementary">Elementary (K-5)</option>
                <option value="Middle">Middle School (6-8)</option>
                <option value="High">High School (9-12)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Subject Goal</label>
              <select class="form-input">
                <option value="Math">Math Support</option>
                <option value="Science">Science & STEM</option>
                <option value="Reading">Reading & Writing</option>
                <option value="Study">Study Skills</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Message / Specific Learning Needs</label>
            <textarea class="form-input" rows="3" placeholder="Tell us about your child's goals..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">Submit Request →</button>
        </form>
      `;
      window.openModal(`Book a Session — ${sessionType}`, ctaFormHtml);

      setTimeout(() => {
        const form = document.getElementById('modalSessionForm');
        if (form) {
          form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            form.innerHTML = `
              <div style="text-align:center; padding: 20px 0;">
                <div style="width:60px; height:60px; background:#10B981; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:1.8rem;">✓</div>
                <h3 style="font-family:var(--font-heading); font-size:1.6rem; margin-bottom:8px;">Request Received!</h3>
                <p style="color:var(--text-muted); margin-bottom:20px;">Thank you for reaching out. An academic advisor will contact you within 24 hours.</p>
                <button type="button" class="btn btn-navy" onclick="window.closeModal()">Done</button>
              </div>
            `;
          });
        }
      }, 50);
    }
  });
}

/* ==========================================================================
   05. PAGE INTERACTIVE FILTERS & TOOLS
   ========================================================================== */
function initPageInteractiveElements() {
  // Grade Pathways Filter (Home & Programs)
  const filterTabs = document.querySelectorAll('.js-pathway-tab');
  const pathwayCards = document.querySelectorAll('.js-pathway-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      pathwayCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Tutor Matcher Interactive Tool (Tutors Page)
  const matchForm = document.getElementById('tutorMatchForm');
  if (matchForm) {
    matchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const grade = document.getElementById('matchGrade').value;
      const subject = document.getElementById('matchSubject').value;

      const resultBox = document.getElementById('matchResult');
      let matchedName = "Maya Chen";
      let matchedSub = "Math & STEM Specialist";
      let matchedImg = "assets/images/tutor-maya.png";

      if (subject === 'English' || subject === 'Writing') {
        matchedName = "Daniel Brooks";
        matchedSub = "English & Writing Specialist";
        matchedImg = "assets/images/tutor-daniel.png";
      } else if (subject === 'Science') {
        matchedName = "Priya Shah";
        matchedSub = "Science & Chemistry Specialist";
        matchedImg = "assets/images/tutor-priya.png";
      } else if (subject === 'Study') {
        matchedName = "Ethan Lewis";
        matchedSub = "Study Skills & Habits Coach";
        matchedImg = "assets/images/tutor-ethan.png";
      }

      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <div class="card" style="border: 2px solid var(--coral-500); background: var(--bg-card);">
            <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
              <img src="${matchedImg}" alt="${matchedName}" style="width:80px; height:80px; border-radius:50%; object-fit:cover;" />
              <div>
                <span style="font-size:0.75rem; font-weight:700; color:var(--coral-500); text-transform:uppercase;">Recommended Match</span>
                <h4 style="font-family:var(--font-heading); font-size:1.4rem; margin:2px 0;">${matchedName}</h4>
                <p style="font-size:0.9rem; color:var(--text-muted);">${matchedSub} • Ideal for ${grade}</p>
              </div>
              <button class="btn btn-primary js-book-trigger" data-session="Tutor ${matchedName}" style="margin-inline-start:auto;">Book Session with ${matchedName.split(' ')[0]} →</button>
            </div>
          </div>
        `;
      }
    });
  }

  // Accordion FAQ Toggles (Pricing & Contact)
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });
}

/* ==========================================================================
   06. AUTH FORM HANDLING & DEMO REDIRECTS (LOGIN & REGISTER)
   ========================================================================== */
function initAuthForms() {
  const eyeOpenSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOffSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  // Initialize eye icons
  document.querySelectorAll('.js-password-toggle').forEach(btn => {
    btn.innerHTML = eyeOpenSvg;
  });

  // Password Visibility Toggle via Event Delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-password-toggle');
    if (btn) {
      e.preventDefault();
      const wrapper = btn.closest('.input-wrapper');
      const input = wrapper ? wrapper.querySelector('input') : btn.previousElementSibling;
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = eyeOffSvg;
          btn.setAttribute('aria-label', 'Hide Password');
        } else {
          input.type = 'password';
          btn.innerHTML = eyeOpenSvg;
          btn.setAttribute('aria-label', 'Show Password');
        }
      }
    }
  });

  // Login Form Demo Submit
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const errorBox = document.getElementById('loginError');

      if (!email || !password) {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Please enter both email and password.';
        }
        return;
      }

      // Demo validation (parent@example.com / demo123 or any valid credentials)
      if (email === 'parent@example.com' && password !== 'demo123') {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Invalid password. Try demo password: demo123';
        }
        return;
      }

      // Success
      if (errorBox) errorBox.style.display = 'none';
      const btn = loginForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Signing in...';

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    });
  }

  // Register Form Demo Submit
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('regPassword').value;
      const confirm = document.getElementById('regConfirmPassword').value;
      const errorBox = document.getElementById('registerError');

      if (pass !== confirm) {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Passwords do not match. Please check again.';
        }
        return;
      }

      if (errorBox) errorBox.style.display = 'none';
      const btn = registerForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Creating Account...';

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    });
  }
}

/* ==========================================================================
   ROUTINE SIMULATOR INTERACTIVE TABS (HOME)
   ========================================================================== */
function initRoutineSimulator() {
  const tabs = document.querySelectorAll('#routineTabs .sim-tab-btn');
  if (!tabs.length) return;

  const data = {
    elementary: {
      badge: "Elementary Focus (K–5)",
      title: "Daily 3-Hour After-School Flow",
      steps: [
        { time: "3:30 PM", title: "Arrival & Healthy Snack Break", desc: "Students unwind, grab a nutritious snack, and reset after the school bell." },
        { time: "4:00 PM", title: "Focused Homework Completion", desc: "Guided assistance on daily school assignments with 1:4 tutor guidance." },
        { time: "5:00 PM", title: "Foundational Math & Reading Lab", desc: "Fun, interactive skill-building exercises reinforcing core grade concepts." },
        { time: "5:45 PM", title: "Pack Up & Parent Portal Sync", desc: "Tutor logs completed work; student leaves with 100% finished homework." }
      ],
      time: "5.5 Hours",
      score: "+34%",
      ratio: "1 : 4",
      check: "100%",
      highlight: '"Elementary students build independent study habits early, eliminating night-time homework tears and giving families peaceful evenings."'
    },
    middle: {
      badge: "Middle School Support (6–8)",
      title: "Subject Mastery & Exam Prep Routine",
      steps: [
        { time: "3:30 PM", title: "Check-in & Study Plan Setting", desc: "Student reviews upcoming quizzes, project rubrics, and daily assignments with tutor." },
        { time: "4:00 PM", title: "Algebra & Science Workblock", desc: "Targeted problem solving, lab report guidance, and conceptual practice." },
        { time: "5:15 PM", title: "Study Skills & Organizational Lab", desc: "Learning flashcard strategies, time management, and note-taking methods." },
        { time: "5:45 PM", title: "Daily Review & Tutor Sign-Off", desc: "Verification of completed assignments and progress update logged to portal." }
      ],
      time: "6.0 Hours",
      score: "+42%",
      ratio: "1 : 4",
      check: "98%",
      highlight: '"Middle schoolers master difficult STEM and language concepts while learning vital organizational habits for high school readiness."'
    },
    high: {
      badge: "High School & AP Prep (9–12)",
      title: "Advanced Subject & Test Prep Coaching",
      steps: [
        { time: "3:45 PM", title: "Academic Consult & Priority Queue", desc: "High schoolers tackle complex coursework with specialized subject experts." },
        { time: "4:15 PM", title: "Advanced Math, Physics & Essay Clinic", desc: "In-depth problem breakdown, college-prep writing edits, and AP prep." },
        { time: "5:30 PM", title: "SAT/ACT Skill Drills & Timed Practice", desc: "Targeted standardized testing strategies and practice section reviews." },
        { time: "6:15 PM", title: "Weekly Goal Assessment", desc: "Tracking GPA trends, upcoming project deadlines, and college readiness." }
      ],
      time: "7.5 Hours",
      score: "+48%",
      ratio: "1 : 3",
      check: "96%",
      highlight: '"High school students gain targeted AP/SAT subject mastery and college prep guidance with dedicated 1-on-1 subject mentors."'
    }
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      const grade = btn.getAttribute('data-grade');
      const item = data[grade];
      if (!item) return;

      const badgeEl = document.getElementById('simGradeBadge');
      const titleEl = document.getElementById('simTitle');
      const timeEl = document.getElementById('metricTime');
      const scoreEl = document.getElementById('metricScore');
      const ratioEl = document.getElementById('metricRatio');
      const checkEl = document.getElementById('metricCheck');
      const highlightEl = document.getElementById('simHighlightText');
      const stepsList = document.getElementById('simStepsList');

      if (badgeEl) badgeEl.textContent = item.badge;
      if (titleEl) titleEl.textContent = item.title;
      if (timeEl) timeEl.textContent = item.time;
      if (scoreEl) scoreEl.textContent = item.score;
      if (ratioEl) ratioEl.textContent = item.ratio;
      if (checkEl) checkEl.textContent = item.check;
      if (highlightEl) highlightEl.textContent = item.highlight;

      if (stepsList) {
        stepsList.innerHTML = item.steps.map((s, idx) => `
          <div class="sim-step-item ${idx === 1 ? 'active-step' : ''}">
            <div class="sim-step-time">${s.time}</div>
            <div class="sim-step-dot"></div>
            <div class="sim-step-info">
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
            </div>
          </div>
        `).join('');
      }
    });
  });
}
