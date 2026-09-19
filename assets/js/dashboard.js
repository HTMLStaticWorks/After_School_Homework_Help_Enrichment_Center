/**
 * BRIGHTPATH PARENT PORTAL DASHBOARD — JAVASCRIPT
 * Separated JavaScript module for dashboard.html
 * Handles Single Page Navigation across 11 sidebar views, state management,
 * modals, filters, and interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardNavigation();
  initDashboardThemeRtl();
  initSessionsFilter();
  initHomeworkTracker();
  initTutorNotesFilter();
  initNotificationsSystem();
  initDashboardModals();
});

/* ==========================================================================
   01. DASHBOARD SINGLE PAGE NAVIGATION (11 VIEWS)
   ========================================================================== */
const viewTitles = {
  overview: 'Dashboard Overview',
  sessions: 'My Sessions & Schedule',
  homework: 'Homework Tracker',
  attendance: 'Attendance History',
  notes: 'Tutor Session Notes',
  reports: 'Academic Progress Reports',
  programs: 'Enrolled Learning Programs',
  payments: 'Payments & Billing',
  notifications: 'Notifications & Alerts',
  profile: 'Family Profile Settings',
  support: 'Help & Customer Support'
};

function initDashboardNavigation() {
  const menuButtons = document.querySelectorAll('.js-dash-nav');
  const viewSections = document.querySelectorAll('.dash-view');
  const pageTitle = document.getElementById('dashPageTitle');
  const sidebar = document.getElementById('dashSidebar');
  const menuToggle = document.getElementById('dashMenuToggle');

  // Switch View Function
  const switchView = (targetViewId) => {
    viewSections.forEach(sec => sec.classList.remove('active'));
    menuButtons.forEach(btn => btn.classList.remove('active'));

    const targetSec = document.getElementById(`view-${targetViewId}`);
    if (targetSec) {
      targetSec.classList.add('active');
    }

    const activeBtn = document.querySelector(`.js-dash-nav[data-view="${targetViewId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    if (pageTitle && viewTitles[targetViewId]) {
      pageTitle.textContent = viewTitles[targetViewId];
    }

    // Close mobile sidebar if open
    if (sidebar) sidebar.classList.remove('open');
  };

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.dataset.view;
      switchView(viewId);
    });
  });

  // Mobile Menu Toggle
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/* ==========================================================================
   02. THEME & RTL ENGINE FOR DASHBOARD
   ========================================================================== */
const sunSvgDash = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const moonSvgDash = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const rtlSvgDash = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`;

function updateDashThemeButtons(theme) {
  document.querySelectorAll('.js-dash-theme').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? sunSvgDash : moonSvgDash;
    btn.setAttribute('title', theme === 'dark' ? 'Light Mode' : 'Dark Mode');
  });
}

function updateDashRtlButtons() {
  document.querySelectorAll('.js-dash-rtl').forEach(btn => {
    btn.innerHTML = rtlSvgDash;
    btn.setAttribute('title', 'Toggle RTL / LTR');
  });
}

function initDashboardThemeRtl() {
  const savedTheme = localStorage.getItem('brightpath_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateDashThemeButtons(savedTheme);

  const savedDir = localStorage.getItem('brightpath_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  updateDashRtlButtons();

  // Theme Toggles
  document.querySelectorAll('.js-dash-theme').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const nxt = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nxt);
      localStorage.setItem('brightpath_theme', nxt);
      updateDashThemeButtons(nxt);
    });
  });

  // RTL Toggles
  document.querySelectorAll('.js-dash-rtl').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('dir') || 'ltr';
      const nxt = cur === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', nxt);
      localStorage.setItem('brightpath_dir', nxt);
      updateDashRtlButtons();
    });
  });
}

/* ==========================================================================
   03. SESSIONS FILTER (Upcoming / Completed / Cancelled)
   ========================================================================== */
function initSessionsFilter() {
  const filterBtns = document.querySelectorAll('.js-session-filter');
  const sessionRows = document.querySelectorAll('.js-session-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      sessionRows.forEach(row => {
        if (filter === 'all' || row.dataset.status === filter) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   04. HOMEWORK TRACKER (Status Toggles & Action)
   ========================================================================== */
function initHomeworkTracker() {
  document.querySelectorAll('.js-mark-complete').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      if (!row) return;

      const badge = row.querySelector('.status-badge');
      if (badge) {
        badge.className = 'status-badge status-completed';
        badge.textContent = 'Completed';
      }

      btn.textContent = 'Done ✓';
      btn.disabled = true;
      btn.style.opacity = '0.6';
    });
  });
}

/* ==========================================================================
   05. TUTOR NOTES FILTER
   ========================================================================== */
function initTutorNotesFilter() {
  const noteFilters = document.querySelectorAll('.js-note-filter');
  const noteCards = document.querySelectorAll('.js-note-card');

  noteFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      noteFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const subject = btn.dataset.subject;
      noteCards.forEach(card => {
        if (subject === 'all' || card.dataset.subject === subject) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   06. NOTIFICATIONS SYSTEM
   ========================================================================== */
function initNotificationsSystem() {
  const markAllBtn = document.getElementById('btnMarkAllRead');
  const notifItems = document.querySelectorAll('.js-notif-item');
  const unreadBadge = document.getElementById('unreadNotifBadge');

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      notifItems.forEach(item => {
        item.style.opacity = '0.65';
        const unreadDot = item.querySelector('.badge-dot');
        if (unreadDot) unreadDot.remove();
      });
      if (unreadBadge) unreadBadge.style.display = 'none';
    });
  }

  document.querySelectorAll('.js-delete-notif').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.js-notif-item');
      if (card) {
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 250);
      }
    });
  });
}

/* ==========================================================================
   07. DASHBOARD MODALS SYSTEM
   ========================================================================== */
function initDashboardModals() {
  // Global modal handlers inside dashboard
  const overlay = document.getElementById('dashModal');
  if (!overlay) return;

  const closeBtns = overlay.querySelectorAll('.js-modal-close');
  const titleEl = document.getElementById('dashModalTitle');
  const bodyEl = document.getElementById('dashModalBody');

  window.openDashModal = function(title, htmlContent) {
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = htmlContent;
    overlay.classList.add('active');
  };

  window.closeDashModal = function() {
    overlay.classList.remove('active');
  };

  closeBtns.forEach(btn => btn.addEventListener('click', window.closeDashModal));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeDashModal();
  });

  // Edit Profile Trigger
  const editProfileBtn = document.getElementById('btnEditProfile');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      const html = `
        <form id="profileEditForm">
          <div class="form-group">
            <label class="form-label">Parent Name</label>
            <input type="text" class="form-input" value="Sarah Morgan" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" value="parent@example.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-input" value="+1 (555) 234-5678" required />
          </div>
          <div class="form-group">
            <label class="form-label">Child Name</label>
            <input type="text" class="form-input" value="Ava Morgan" required />
          </div>
          <div class="form-group">
            <label class="form-label">Child Grade</label>
            <input type="text" class="form-input" value="Grade 6 (Middle School)" required />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">Save Profile Changes</button>
        </form>
      `;
      window.openDashModal('Edit Family Profile', html);

      setTimeout(() => {
        const form = document.getElementById('profileEditForm');
        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.closeDashModal();
            alert('Profile information updated successfully!');
          });
        }
      }, 50);
    });
  }

  // Update Payment Method Trigger
  const updatePayBtn = document.getElementById('btnUpdatePayment');
  if (updatePayBtn) {
    updatePayBtn.addEventListener('click', () => {
      const html = `
        <form id="paymentUpdateForm">
          <div class="form-group">
            <label class="form-label">Cardholder Name</label>
            <input type="text" class="form-input" value="Sarah Morgan" required />
          </div>
          <div class="form-group">
            <label class="form-label">Card Number</label>
            <input type="text" class="form-input" value="•••• •••• •••• 4821" placeholder="Card Number" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Expiration Date</label>
              <input type="text" class="form-input" value="09/28" placeholder="MM/YY" required />
            </div>
            <div class="form-group">
              <label class="form-label">CVC</label>
              <input type="password" class="form-input" value="•••" placeholder="CVC" required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">Update Payment Card</button>
        </form>
      `;
      window.openDashModal('Update Billing Payment Method', html);

      setTimeout(() => {
        const form = document.getElementById('paymentUpdateForm');
        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.closeDashModal();
            alert('Payment card details updated successfully!');
          });
        }
      }, 50);
    });
  }
}
