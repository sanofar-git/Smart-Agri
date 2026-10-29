/**
 * Smart Agricultural Management System - Core Application Logic
 * Creator & Lead Architect: Sanofar Fathima I
 * UI Themes: High-Contrast Obsidian Black, Stark White, and Cobalt Blue
 */

const App = {
  state: {
    currentUser: null,
    systemInfo: null,
    landReports: [],
    selectedDistrictId: 'land-tn-01',
    revenue: null,
    customers: [],
    reviews: [],
    socialAbout: null,
    adminMetrics: null,
    theme: localStorage.getItem('agri_theme') || 'dark',
    pollingInterval: null
  },

  // Preload critical images in background so they render instantaneously upon sign-in
  preloadCriticalImages() {
    const urls = new Set([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=75',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=75',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=75',
      'assets/images/kotagiri_nilgiris.jpg',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=75',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=75'
    ]);

    if (this.state.landReports && this.state.landReports.length) {
      this.state.landReports.forEach(r => {
        if (r.image) urls.add(r.image);
      });
    }

    urls.forEach(src => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  },

  // Initialize Application
  async init() {
    this.applyTheme(this.state.theme);
    this.bindGlobalEvents();

    if (window.location.protocol === 'file:') {
      const banner = document.getElementById('file-protocol-banner');
      if (banner) banner.style.display = 'block';
    }

    // Immediately start preloading critical landscape images in background
    this.preloadCriticalImages();

    // Load common system info
    await this.loadInitialData();

    // Trigger preloading again with the fetched landReports
    this.preloadCriticalImages();

    // Check existing session
    const savedUser = localStorage.getItem('agri_user');
    if (savedUser) {
      try {
        this.state.currentUser = JSON.parse(savedUser);
        this.showMainApp();
      } catch (e) {
        localStorage.removeItem('agri_user');
        this.showAuthView();
      }
    } else {
      this.showAuthView();
    }
  },

  // --- THEME SWITCHER (Obsidian Dark / Crisp Light) ---
  applyTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem('agri_theme', theme);
    const icon = document.getElementById('theme-icon');
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (icon) icon.textContent = '🌙';
    } else {
      document.body.classList.remove('light-theme');
      if (icon) icon.textContent = '☀️';
    }
  },

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    this.showToast(`Theme switched to ${nextTheme === 'dark' ? 'Obsidian Dark' : 'Crisp White'} mode`);
  },

  // --- VIEW TOGGLING ---
  showAuthView() {
    document.getElementById('auth-view').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    if (this.state.pollingInterval) {
      clearInterval(this.state.pollingInterval);
    }
  },

  showMainApp() {
    document.getElementById('auth-view').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    this.renderUserBadge();
    this.renderAllSections();

    // Start live telemetry polling for real-time sensor updates
    if (this.state.pollingInterval) clearInterval(this.state.pollingInterval);
    this.state.pollingInterval = setInterval(() => {
      this.refreshLiveTelemetrySilently();
    }, 10000);
  },

  // --- LOAD INITIAL DATA ---
  async loadInitialData() {
    const [sysRes, repRes, revRes, custRes, rvwRes, socRes] = await Promise.all([
      API.getSystemInfo(),
      API.getLandReports(),
      API.getRevenue(),
      API.getCustomers(),
      API.getReviews(),
      API.getSocialAbout()
    ]);

    if (sysRes.ok) this.state.systemInfo = sysRes.data;
    if (repRes.ok) this.state.landReports = repRes.data.reports || [];
    if (revRes.ok) this.state.revenue = revRes.data.revenue || null;
    if (custRes.ok) this.state.customers = custRes.data.customers || [];
    if (rvwRes.ok) this.state.reviews = rvwRes.data.reviews || [];
    if (socRes.ok) this.state.socialAbout = socRes.data || null;
  },

  // --- SILENT TELEMETRY REFRESH ---
  async refreshLiveTelemetrySilently() {
    const res = await API.getLandReports();
    if (res.ok && res.data.reports) {
      this.state.landReports = res.data.reports;
      this.renderSelectedDistrictReport(false);
    }
  },

  // --- EVENT BINDINGS ---
  bindGlobalEvents() {
    // Auth Tabs
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchAuthTab(tab);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Admin Portal Button in Sidebar
    const adminNavBtn = document.getElementById('nav-admin-btn');
    if (adminNavBtn) {
      adminNavBtn.addEventListener('click', () => this.handleAdminPortalClick());
    }

    // Terms modal triggers
    const termsLink = document.getElementById('view-terms-link');
    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openTermsModal();
      });
    }

    // Sidebar navigation active link highlights
    document.querySelectorAll('.sidebar-nav-item a').forEach(link => {
      link.addEventListener('click', (e) => {
        document.querySelectorAll('.sidebar-nav-item a').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  },

  // Switch Auth Tab
  switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.auth-tab-btn[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.auth-form-pane').forEach(p => p.style.display = 'none');
    const activePane = document.getElementById(`pane-${tabName}`);
    if (activePane) activePane.style.display = 'block';
  },

  // Demo auto-fill helper (Female farmer R. Revathi)
  fillDemoCredentials(type) {
    if (type === 'revathi' || type === 'murugesan') {
      this.switchAuthTab('signin');
      document.getElementById('signin-email').value = 'revathi.farm@gmail.com';
      document.getElementById('signin-password').value = 'farmer123';
      this.showToast('Autofilled Farmer R. Revathi (Thanjavur) credentials.');
    } else if (type === 'selvi') {
      this.switchAuthTab('signin');
      document.getElementById('signin-email').value = 'selvi.pollachi@outlook.com';
      document.getElementById('signin-password').value = 'farmer123';
      this.showToast('Autofilled Farmer K. Selvi (Pollachi) credentials.');
    } else if (type === 'admin') {
      this.switchAuthTab('admin');
      document.getElementById('admin-email').value = 'sanofar.fathima@smartagri.tn.gov.in';
      document.getElementById('admin-password').value = 'admin';
      this.showToast('Autofilled Creator & Admin: Sanofar Fathima I [AD] credentials.');
    }
  },

  // --- AUTHENTICATION HANDLERS ---
  async handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    const res = await API.login({ email, password, portalType: 'customer' });
    if (res.ok && res.data.success) {
      this.state.currentUser = res.data.user;
      localStorage.setItem('agri_user', JSON.stringify(res.data.user));
      localStorage.setItem('agri_auth_token', res.data.token);
      this.showToast(`Welcome back, ${res.data.user.name}!`);
      if (!this.state.landReports || !this.state.landReports.length) {
        await this.loadInitialData();
      }
      this.showMainApp();
    } else {
      this.showToast(res.data.message || 'Login failed', 'error');
    }
  },

  async handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    const res = await API.login({ email, password, portalType: 'admin' });
    if (res.ok && res.data.success) {
      this.state.currentUser = res.data.user;
      localStorage.setItem('agri_user', JSON.stringify(res.data.user));
      localStorage.setItem('agri_auth_token', res.data.token);
      this.showToast(`Admin Access Granted: Welcome, Creator Sanofar Fathima I.`);
      if (!this.state.landReports || !this.state.landReports.length) {
        await this.loadInitialData();
      }
      this.showMainApp();
      setTimeout(() => this.openAdminNexusModal(), 600);
    } else {
      if (res.data.restricted) {
        this.openAccessDeniedModal(res.data.message);
      } else {
        this.showToast(res.data.message || 'Admin authentication failed', 'error');
      }
    }
  },

  async handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const district = document.getElementById('reg-district').value;
    const farmSize = document.getElementById('reg-farmsize').value.trim();
    const primaryCrop = document.getElementById('reg-crop').value.trim();
    const avatar = document.getElementById('reg-avatar').value.trim();
    const termsAccepted = document.getElementById('reg-terms').checked;

    if (!termsAccepted) {
      this.showToast('You must accept the Terms and Conditions to register.', 'error');
      return;
    }

    const payload = {
      name, email, password, phone, dob, district, farmSize, primaryCrop, avatar, termsAccepted
    };

    const res = await API.register(payload);
    if (res.ok && res.data.success) {
      this.state.currentUser = res.data.user;
      localStorage.setItem('agri_user', JSON.stringify(res.data.user));
      localStorage.setItem('agri_auth_token', res.data.token);
      this.showToast('Registration successful! Welcome to Smart Agri TN.');
      await this.loadInitialData();
      this.showMainApp();
    } else {
      this.showToast(res.data.message || 'Registration failed', 'error');
    }
  },

  logout() {
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_auth_token');
    this.state.currentUser = null;
    this.showToast('Logged out securely.');
    this.showAuthView();
  },

  // --- ADMIN PORTAL ACCESS CHECK ---
  handleAdminPortalClick() {
    if (!this.state.currentUser) {
      this.showAuthView();
      this.switchAuthTab('admin');
      return;
    }

    // Strict validation: Only Sanofar Fathima I can enter
    if (this.state.currentUser.role === 'admin' && this.state.currentUser.name.includes('Sanofar Fathima')) {
      this.openAdminNexusModal();
    } else {
      this.openAccessDeniedModal(
        `ACCESS DENIED: The Admin Command Portal is restricted solely to the creator Sanofar Fathima I.\n\nYour account (${this.state.currentUser.name}) is registered as a Farmer / Customer. Customers cannot access administrative management and sensor actuation overrides.`
      );
    }
  },

  openAccessDeniedModal(customMsg) {
    const modal = document.getElementById('access-denied-modal');
    if (modal) {
      document.getElementById('access-denied-message').innerText = customMsg || 
        "ACCESS DENIED: The admin block is exclusively accessible by the creator Sanofar Fathima I. Customers are restricted from administrative controls.";
      modal.classList.add('active');
    } else {
      alert(customMsg || "ACCESS DENIED: Admin block restricted to Sanofar Fathima I.");
    }
  },

  closeAccessDeniedModal() {
    const modal = document.getElementById('access-denied-modal');
    if (modal) modal.classList.remove('active');
  },

  // --- RENDER ALL SECTIONS ---
  async renderAllSections() {
    this.renderHeaderBar();
    this.renderDistrictTabs();
    this.renderSelectedDistrictReport(true);
    this.renderFarmlandsGallery();
    this.renderRevenueSection();
    this.renderCustomersDirectory();
    this.renderReviewsSection();
    this.renderSocialAbout();
  },

  renderHeaderBar() {
    const user = this.state.currentUser;
    const badgeWrap = document.getElementById('sidebar-user-badge');
    if (!badgeWrap || !user) return;

    const isAdmin = user.role === 'admin' && user.name.includes('Sanofar Fathima');

    // Display custom uploaded photo if available, otherwise display AD monogram or default
    const isSvgBadge = user.avatar && user.avatar.includes('<svg') && user.avatar.includes('text-anchor');
    const hasCustomAvatar = user.avatar && !isSvgBadge;

    const avatarHtml = hasCustomAvatar
      ? `<img src="${user.avatar}" alt="${user.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--accent-blue);">`
      : (isAdmin
          ? `<div class="ad-avatar-badge" style="width: 32px; height: 32px; font-size: 0.8rem;">AD</div>`
          : `<img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=70" alt="${user.name}">`
        );

    badgeWrap.innerHTML = `
      <div class="sidebar-user-info" onclick="App.openProfileModal('${user.id}')" title="Click to view/edit profile">
        ${avatarHtml}
        <div class="sidebar-user-text">
          <div class="u-name">${user.name}</div>
          <div class="u-role">${isAdmin ? '★ Creator Admin' : 'Farmer'}</div>
        </div>
      </div>
      <button class="btn-logout-icon" onclick="App.logout()" title="Logout">
        🚪
      </button>
    `;
  },

  renderUserBadge() {
    const notice = document.getElementById('auth-notice-status');
    if (notice && this.state.currentUser) {
      const u = this.state.currentUser;
      const isAdmin = u.role === 'admin';
      notice.innerHTML = `
        <span>Session: <strong>${u.name}</strong> (${isAdmin ? 'Creator Admin [AD]' : u.district})</span>
      `;
    }
  },

  // --- LIVE LAND REPORTS (COMPACT SENSORS) ---
  renderDistrictTabs() {
    const container = document.getElementById('district-tabs-container');
    if (!container || !this.state.landReports.length) return;

    container.innerHTML = this.state.landReports.map(report => `
      <button class="district-tab-btn ${report.id === this.state.selectedDistrictId ? 'active' : ''}" 
              onclick="App.selectDistrict('${report.id}')">
        🌾 ${report.district} (${report.currentCrop.split(' ')[0]})
      </button>
    `).join('');
  },

  selectDistrict(id) {
    this.state.selectedDistrictId = id;
    this.renderDistrictTabs();
    this.renderSelectedDistrictReport(true);
  },

  renderSelectedDistrictReport(animate = true) {
    const report = this.state.landReports.find(r => r.id === this.state.selectedDistrictId) || this.state.landReports[0];
    const container = document.getElementById('live-report-display');
    if (!container || !report) return;

    const isValveActive = report.irrigationStatus.automatedValve.includes('ACTIVE');

    container.innerHTML = `
      <div class="report-compact-grid">
        <!-- Compact Media Box (Zero human photos, pure verified farm landscape) -->
        <div class="report-media-compact">
          <img src="${report.image}" alt="${report.district} Farmland" loading="eager" fetchpriority="high" decoding="async">
          <div class="overlay">
            <span class="badge badge-blue"><span class="pulse-dot"></span> Live Field Probe</span>
            <div style="font-weight: 700; color: #fff; margin-top: 0.2rem;">${report.imageCaption}</div>
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-cyan);">📍 ${report.coordinates}</div>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
            <div>
              <span class="badge badge-blue" style="margin-bottom: 0.35rem;">${report.zone}</span>
              <h3 style="font-size: 1.35rem; font-weight: 800;">${report.district} — ${report.locality}</h3>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">
                Primary Crop: <strong>${report.currentCrop}</strong> | Stage: <em>${report.cropStage}</em>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="App.refreshSelectedReport('${report.id}')" title="Refresh Live IoT Sensors">
              🔄 Sync IoT
            </button>
          </div>

          <!-- Compact 4-Card Telemetry Grid -->
          <div class="telemetry-compact-grid">
            <div class="telemetry-card">
              <div class="t-label">Soil Moisture</div>
              <div class="t-val">${report.telemetry.soilMoisture}%</div>
              <div class="t-status">${report.telemetry.soilMoistureStatus.split(' ')[0]}</div>
            </div>

            <div class="telemetry-card">
              <div class="t-label">Soil pH</div>
              <div class="t-val">${report.telemetry.ph}</div>
              <div class="t-status">${report.telemetry.phStatus.split(' ')[0]}</div>
            </div>

            <div class="telemetry-card">
              <div class="t-label">NPK (N-P-K)</div>
              <div class="t-val" style="font-size: 1.05rem;">${report.telemetry.nitrogen}-${report.telemetry.phosphorus}-${report.telemetry.potassium}</div>
              <div class="t-status">kg/ha</div>
            </div>

            <div class="telemetry-card">
              <div class="t-label">Soil Temp</div>
              <div class="t-val">${report.telemetry.temperature}°C</div>
              <div class="t-status">RH: ${report.telemetry.humidity}%</div>
            </div>
          </div>

          <!-- Valve Actuation -->
          <div style="background: #090c12; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Smart Solenoid Valve</div>
              <div style="font-weight: 800; font-family: var(--font-mono); color: ${isValveActive ? 'var(--accent-cyan)' : '#fff'}; font-size: 0.95rem;">
                ${report.irrigationStatus.automatedValve}
              </div>
            </div>
            <button class="btn ${isValveActive ? 'btn-danger' : 'btn-blue'} btn-sm" onclick="App.toggleIrrigation('${report.id}')">
              ${isValveActive ? '⏹ Close Valve' : '▶ Actuate Micro-Drip'}
            </button>
          </div>

          <!-- AI Advisory -->
          <div class="advisory-box">
            <h4>🌿 Sanofar Fathima AI Advisory (Health Score: ${report.aiDiagnostic.healthScore}/100)</h4>
            <p>${report.aiDiagnostic.advisory}</p>
          </div>
        </div>
      </div>
    `;
  },

  async refreshSelectedReport(id) {
    const res = await API.getLandReport(id);
    if (res.ok && res.data.report) {
      const idx = this.state.landReports.findIndex(r => r.id === id);
      if (idx !== -1) this.state.landReports[idx] = res.data.report;
      this.renderSelectedDistrictReport(false);
      this.showToast(`IoT telemetry synced for ${res.data.report.district}.`);
    }
  },

  async toggleIrrigation(id) {
    const res = await API.toggleIrrigation(id);
    if (res.ok && res.data.success) {
      const idx = this.state.landReports.findIndex(r => r.id === id);
      if (idx !== -1) this.state.landReports[idx] = res.data.report;
      this.renderSelectedDistrictReport(false);
      this.showToast(res.data.message);
    } else {
      this.showToast('Unable to actuate valve.', 'error');
    }
  },

  // --- TAMIL NADU FARMLANDS GALLERY (COMPACT NATURAL IMAGES) ---
  renderFarmlandsGallery() {
    const container = document.getElementById('farmlands-gallery-container');
    if (!container || !this.state.landReports.length) return;

    container.innerHTML = this.state.landReports.map(report => `
      <div class="place-card">
        <div class="place-img-wrap">
          <img src="${report.image}" alt="${report.district} Farmland" loading="eager" decoding="async">
          <span class="badge badge-blue" style="position: absolute; top: 8px; left: 8px;">${report.district}</span>
        </div>
        <div class="place-body">
          <h4>${report.locality}</h4>
          <div class="loc-sub">📍 ${report.coordinates}</div>
          <table class="place-meta-table">
            <tr>
              <td>Primary Crop:</td>
              <td>${report.currentCrop}</td>
            </tr>
            <tr>
              <td>Soil Type:</td>
              <td>${report.soilType.split('(')[0]}</td>
            </tr>
            <tr>
              <td>Moisture:</td>
              <td><span style="color: var(--accent-cyan); font-weight: 700;">${report.telemetry.soilMoisture}%</span></td>
            </tr>
          </table>
          <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="App.selectDistrict('${report.id}'); document.getElementById('live-land-section').scrollIntoView({behavior: 'smooth'})">
            Inspect Telemetry →
          </button>
        </div>
      </div>
    `).join('');
  },

  // --- REVENUE & FINANCIALS ---
  renderRevenueSection() {
    const rev = this.state.revenue;
    const container = document.getElementById('revenue-container');
    if (!container || !rev) return;

    container.innerHTML = `
      <div class="revenue-banner">
        <div class="rev-headline-grid">
          <div class="rev-headline-item">
            <div class="lbl">Total Project Revenue</div>
            <div class="figure cyan">${rev.totalRevenueINR}</div>
            <div class="trend">↑ ${rev.growthRate} (Tamil Nadu Farms)</div>
          </div>

          <div class="rev-headline-item">
            <div class="lbl">Monthly Recurring Revenue (MRR)</div>
            <div class="figure">${rev.mrr}</div>
            <div class="trend">Annual Projected: ${rev.annualProjected}</div>
          </div>

          <div class="rev-headline-item">
            <div class="lbl">Farmland Monitored</div>
            <div class="figure">${rev.hectaresMonitored}</div>
            <div class="trend">${rev.totalFarmersImpacted}</div>
          </div>

          <div class="rev-headline-item">
            <div class="lbl">Water Conserved</div>
            <div class="figure cyan">${rev.waterSavedLiters}</div>
            <div class="trend">Precision Sensor Control</div>
          </div>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">
          📊 Revenue Distribution by Agri-Tech Stream
        </h4>
        <div>
          ${rev.breakdown.map(b => `
            <div class="rev-bar-item">
              <div class="rev-bar-header">
                <span>${b.category} (${b.percentage}%)</span>
                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">${b.amountINR}</span>
              </div>
              <div class="rev-progress-bg">
                <div class="rev-progress-fill" style="width: ${b.percentage}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="plans-grid">
        ${rev.plans.map(p => `
          <div class="plan-card ${p.popular ? 'popular' : ''}">
            ${p.popular ? '<span class="badge badge-blue" style="position: absolute; top: -10px; right: 15px;">Most Popular</span>' : ''}
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 800;">${p.name}</h4>
              <div class="plan-price">${p.price}</div>
              <ul class="plan-features-list">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
            <button class="btn ${p.popular ? 'btn-blue' : 'btn-outline'}" onclick="App.showToast('Selected ${p.name}.')">
              Activate ${p.name}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  // --- CUSTOMER DIRECTORY (10 TAMIL NADU FARMERS + REVIEWS) ---
  renderCustomersDirectory() {
    const container = document.getElementById('customers-container');
    if (!container) return;

    const customers = this.state.customers.filter(c => c.role !== 'admin');
    if (!customers.length) {
      container.innerHTML = `<p style="color: var(--text-secondary);">No registered customer records found.</p>`;
      return;
    }

    container.innerHTML = customers.map(cust => {
      // Find matching review snippet
      const rev = this.state.reviews.find(r => r.author.toLowerCase().includes(cust.name.split(' ')[1] || cust.name.toLowerCase()));
      const reviewSnippet = rev 
        ? `<div style="font-size: 0.72rem; color: var(--accent-cyan); margin-bottom: 0.75rem; font-style: italic; background: rgba(6, 182, 212, 0.08); padding: 0.35rem 0.5rem; border-radius: var(--radius-sm);">
             ⭐ "${rev.title}"
           </div>`
        : '';

      return `
        <div class="customer-card">
          <div>
            <div class="customer-card-header">
              <img src="${cust.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}" alt="${cust.name}">
              <div>
                <div class="cust-name">${cust.name}</div>
                <div class="cust-district">📍 ${cust.district}</div>
              </div>
            </div>

            ${reviewSnippet}

            <div class="cust-details-list">
              <div class="cust-detail-row">
                <span>DOB:</span>
                <span>${cust.dob || '1988-04-12'}</span>
              </div>
              <div class="cust-detail-row">
                <span>Email:</span>
                <span>${cust.email}</span>
              </div>
              <div class="cust-detail-row">
                <span>Phone:</span>
                <span>${cust.phone || '+91 94440 00000'}</span>
              </div>
              <div class="cust-detail-row">
                <span>Land Area:</span>
                <span>${cust.farmSize || '8 Acres'}</span>
              </div>
              <div class="cust-detail-row">
                <span>Primary Crop:</span>
                <span>${cust.primaryCrop || 'Paddy'}</span>
              </div>
              <div class="cust-detail-row">
                <span>Terms:</span>
                <span><strong style="color: var(--accent-cyan);">✓ Verified (${cust.termsAcceptedDate || 'Active'})</strong></span>
              </div>
            </div>
          </div>

          <button class="btn btn-outline btn-sm" onclick="App.openProfileModal('${cust.id}')">
            View & Edit Full Profile →
          </button>
        </div>
      `;
    }).join('');
  },

  // Handle DP File Upload & Client-Side Canvas Optimization
  handleDpFileSelect(event, target = 'prof') {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // High quality client-side canvas resize to 280x280 max for instant, lightweight storage
        const maxDim = 280;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        if (target === 'prof') {
          const previewImg = document.getElementById('prof-dp-preview');
          if (previewImg) previewImg.src = optimizedDataUrl;
          const urlInput = document.getElementById('prof-avatar-url');
          if (urlInput) urlInput.value = optimizedDataUrl;
          const fileNameSpan = document.getElementById('prof-file-name');
          if (fileNameSpan) fileNameSpan.textContent = `✓ ${file.name} (${Math.round(file.size / 1024)} KB)`;
        } else if (target === 'reg') {
          const previewImg = document.getElementById('reg-dp-preview');
          if (previewImg) previewImg.src = optimizedDataUrl;
          const urlInput = document.getElementById('reg-avatar');
          if (urlInput) urlInput.value = optimizedDataUrl;
          const fileNameSpan = document.getElementById('reg-file-name');
          if (fileNameSpan) fileNameSpan.textContent = `✓ ${file.name}`;
        } else if (target === 'rev') {
          const previewImg = document.getElementById('rev-dp-preview');
          if (previewImg) previewImg.src = optimizedDataUrl;
          const urlInput = document.getElementById('rev-avatar');
          if (urlInput) urlInput.value = optimizedDataUrl;
          const fileNameSpan = document.getElementById('rev-file-name');
          if (fileNameSpan) fileNameSpan.textContent = `✓ ${file.name}`;
        }

        this.showToast('Photo uploaded & optimized successfully!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  // --- CUSTOMER PROFILE MODAL ---
  openProfileModal(userId) {
    const user = this.state.customers.find(c => c.id === userId) || 
                 (this.state.currentUser && this.state.currentUser.id === userId ? this.state.currentUser : null);
    if (!user) return;

    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    document.getElementById('modal-profile-title').textContent = `Customer Profile: ${user.name}`;
    document.getElementById('prof-user-id').value = user.id;

    // Handle Admin and Customer Avatar Preview
    const dpContainer = document.getElementById('prof-dp-container');
    const isSvgBadge = user.avatar && user.avatar.includes('<svg') && user.avatar.includes('text-anchor');
    const hasCustomAvatar = user.avatar && !isSvgBadge;

    if (dpContainer) {
      dpContainer.innerHTML = `
        <img id="prof-dp-preview" src="${hasCustomAvatar ? user.avatar : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=70'}" alt="${user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
        <div class="dp-upload-overlay"><span>📷 Change</span></div>
      `;
    }

    document.getElementById('prof-avatar-url').value = user.avatar || '';
    const fileNameSpan = document.getElementById('prof-file-name');
    if (fileNameSpan) {
      fileNameSpan.textContent = hasCustomAvatar ? 'Current photo loaded' : 'JPG, PNG or WEBP';
    }

    document.getElementById('prof-name').value = user.name || '';
    document.getElementById('prof-email').value = user.email || '';
    document.getElementById('prof-phone').value = user.phone || '';
    document.getElementById('prof-dob').value = user.dob || '';
    document.getElementById('prof-district').value = user.district || 'Thanjavur';
    document.getElementById('prof-farmsize').value = user.farmSize || '';
    document.getElementById('prof-crop').value = user.primaryCrop || '';
    document.getElementById('prof-terms-status').textContent = user.termsAccepted ? `Accepted & Verified on ${user.termsAcceptedDate || '2026'}` : 'Pending Verification';

    modal.classList.add('active');
  },

  closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.remove('active');
  },

  updateDpPreview(url) {
    const img = document.getElementById('prof-dp-preview');
    if (img && url) img.src = url;
  },

  async handleSaveProfile(e) {
    e.preventDefault();
    const id = document.getElementById('prof-user-id').value;
    const name = document.getElementById('prof-name').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const dob = document.getElementById('prof-dob').value;
    const district = document.getElementById('prof-district').value;
    const farmSize = document.getElementById('prof-farmsize').value.trim();
    const primaryCrop = document.getElementById('prof-crop').value.trim();
    const avatar = document.getElementById('prof-avatar-url').value.trim();

    const payload = { name, phone, dob, district, farmSize, primaryCrop, avatar };

    const res = await API.updateCustomer(id, payload);
    const updatedUser = (res && res.data && res.data.user) ? res.data.user : { ...this.state.currentUser, ...payload };

    this.showToast('Profile updated & saved successfully!');

    const idx = this.state.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.state.customers[idx] = updatedUser;
    }

    if (this.state.currentUser && (this.state.currentUser.id === id || (this.state.currentUser.role === 'admin' && (id === 'usr-admin-01' || id === 'admin')))) {
      this.state.currentUser = updatedUser;
      localStorage.setItem('agri_user', JSON.stringify(updatedUser));
      this.renderUserBadge();
      this.renderHeaderBar();
    }

    if (updatedUser.role === 'admin' || id === 'usr-admin-01') {
      if (this.state.adminMetrics && this.state.adminMetrics.creator) {
        this.state.adminMetrics.creator.avatar = updatedUser.avatar;
        this.state.adminMetrics.creator.name = updatedUser.name;
      }
      this.renderAdminNexusDetails();
    }

    this.renderCustomersDirectory();
    this.closeProfileModal();
  },

  // --- REVIEWS & FEEDBACK ---
  renderReviewsSection() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    container.innerHTML = this.state.reviews.map(rev => `
      <div class="review-card">
        <div>
          <div class="review-stars">${'★'.repeat(Math.floor(rev.rating))} <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${rev.rating} / 5.0</span></div>
          <h4>"${rev.title}"</h4>
          <p>${rev.comment}</p>
        </div>
        <div class="review-author-flex">
          <img src="${rev.avatar}" alt="${rev.author}">
          <div>
            <div style="font-size: 0.82rem; font-weight: 700;">${rev.author} <span style="color: var(--accent-cyan); font-size: 0.72rem;">✓ Verified</span></div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">📍 ${rev.location} | Crop: ${rev.crop}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  async handleReviewSubmit(e) {
    e.preventDefault();
    const author = document.getElementById('rev-author').value.trim();
    const location = document.getElementById('rev-location').value.trim();
    const crop = document.getElementById('rev-crop').value.trim();
    const rating = document.getElementById('rev-rating').value;
    const title = document.getElementById('rev-title').value.trim();
    const comment = document.getElementById('rev-comment').value.trim();
    const avatar = document.getElementById('rev-avatar').value.trim();

    const payload = { author, location, crop, rating, title, comment, avatar };

    const res = await API.submitReview(payload);
    if (res.ok && res.data.success) {
      this.showToast('Thank you! Your feedback has been verified and added.');
      this.state.reviews.unshift(res.data.review);
      this.renderReviewsSection();
      this.renderCustomersDirectory();
      e.target.reset();
    } else {
      this.showToast(res.data.message || 'Submission failed', 'error');
    }
  },

  // --- ABOUT & SOCIAL MEDIA ---
  renderSocialAbout() {
    const soc = this.state.socialAbout ? this.state.socialAbout.socialMedia : null;
    const channelsContainer = document.getElementById('social-channels-container');
    if (channelsContainer && soc) {
      channelsContainer.innerHTML = soc.channels.map(ch => `
        <a href="${ch.url}" target="_blank" rel="noopener noreferrer" style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 0.65rem 0.85rem; border-radius: var(--radius-md); text-decoration: none; color: #fff; display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
          <span style="color: var(--accent-cyan);">🔗</span>
          <div>
            <div style="font-weight: 700;">${ch.platform}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">${ch.handle}</div>
          </div>
        </a>
      `).join('');
    }
  },

  async handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const district = document.getElementById('contact-district').value;
    const message = document.getElementById('contact-message').value.trim();

    const res = await API.sendContact({ name, email, phone, district, message });
    if (res.ok && res.data.success) {
      this.showToast(res.data.message);
      e.target.reset();
    } else {
      this.showToast(res.data.message || 'Contact submission failed', 'error');
    }
  },

  // --- CREATOR ADMIN NEXUS MODAL (SANOFAR FATHIMA I ONLY) ---
  async openAdminNexusModal() {
    const modal = document.getElementById('admin-nexus-modal');
    if (!modal) return;

    modal.classList.add('active');
    const res = await API.getAdminMetrics();
    if (res.ok && res.data.success) {
      this.state.adminMetrics = res.data;
      this.renderAdminNexusDetails();
    }
  },

  closeAdminNexusModal() {
    const modal = document.getElementById('admin-nexus-modal');
    if (modal) modal.classList.remove('active');
  },

  renderAdminNexusDetails() {
    const m = this.state.adminMetrics;
    const container = document.getElementById('admin-nexus-content');
    if (!container || !m) return;

    const adminUser = (this.state.currentUser && this.state.currentUser.role === 'admin') 
      ? this.state.currentUser 
      : m.creator;
    const isSvgBadge = adminUser.avatar && adminUser.avatar.includes('<svg') && adminUser.avatar.includes('text-anchor');
    const hasAdminPhoto = adminUser.avatar && !isSvgBadge;

    container.innerHTML = `
      <div style="background: #000; border: 1px solid var(--accent-blue-dark); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="dp-preview-box" onclick="document.getElementById('admin-nexus-avatar-file').click()" title="Click to upload/change Admin DP" style="width: 58px; height: 58px;">
            <img id="admin-nexus-dp-preview" src="${hasAdminPhoto ? adminUser.avatar : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=70'}" alt="${adminUser.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
            <div class="dp-upload-overlay"><span>📷</span></div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #fff;">${adminUser.name}</div>
            <div style="font-size: 0.78rem; color: var(--accent-cyan);">★ Creator & Chief Agricultural AI Architect</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${adminUser.email}</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
          <input type="file" id="admin-nexus-avatar-file" accept="image/*" style="display: none;" onchange="App.handleAdminDpUpload(event)">
          <button class="btn-upload-file" onclick="document.getElementById('admin-nexus-avatar-file').click()">
            📷 Upload Admin DP
          </button>
          <button class="btn btn-blue btn-sm" onclick="App.calibrateAllSensors()">
            ⚡ Calibrate All 38 Tamil Nadu Probes
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="background: #090c12; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Active IoT Fleet</div>
          <div style="font-size: 1.7rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-cyan);">
            ${m.activeNodes} Nodes
          </div>
          <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Server Uptime: <strong>${m.serverUptime}</strong> | Latency: <strong>${m.apiLatencyMs}ms</strong>
          </div>
        </div>

        <div style="background: #090c12; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Platform Financials</div>
          <div style="font-size: 1.7rem; font-weight: 800; font-family: var(--font-mono); color: #fff;">
            ${m.revenue}
          </div>
          <div style="font-size: 0.78rem; color: var(--accent-blue); margin-top: 0.25rem;">
            MRR: ${m.mrr} | Registered Farmers: <strong>${m.totalUsers - 1}</strong>
          </div>
        </div>
      </div>

      <div style="background: #090c12; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">📋 Real-Time Agro Telemetry Event Logs</h4>
        <div style="max-height: 150px; overflow-y: auto;">
          ${m.recentLogs.map(log => `
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; gap: 0.65rem;">
              <span style="color: var(--accent-cyan); white-space: nowrap;">[${log.timestamp}]</span>
              <span>${log.action}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  async calibrateAllSensors() {
    const res = await API.calibrateSensors();
    if (res.ok && res.data.success) {
      this.showToast(res.data.message);
      await this.refreshLiveTelemetrySilently();
      const metricsRes = await API.getAdminMetrics();
      if (metricsRes.ok) {
        this.state.adminMetrics = metricsRes.data;
        this.renderAdminNexusDetails();
      }
    } else {
      this.showToast('Calibration failed', 'error');
    }
  },

  handleAdminDpUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const maxDim = 280;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        // Immediate visual update in Admin Portal
        const adminImg = document.getElementById('admin-nexus-dp-preview');
        if (adminImg) {
          adminImg.src = optimizedDataUrl;
        }

        const adminId = (this.state.currentUser && this.state.currentUser.id) || 'usr-admin-01';

        // Persist via API
        const res = await API.updateCustomer(adminId, { avatar: optimizedDataUrl });
        
        if (this.state.currentUser) {
          this.state.currentUser.avatar = optimizedDataUrl;
          localStorage.setItem('agri_user', JSON.stringify(this.state.currentUser));
        }

        if (this.state.adminMetrics && this.state.adminMetrics.creator) {
          this.state.adminMetrics.creator.avatar = optimizedDataUrl;
        }

        this.renderHeaderBar();
        this.renderAdminNexusDetails();
        this.showToast('Admin Profile Picture (DP) updated & saved!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  // --- AGRI-TECH GUIDE TABS & FERTIGATION CALCULATOR ---
  switchGuideTab(tabId) {
    document.querySelectorAll('.guide-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.guide-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  },

  calculateFertigation(event) {
    if (event) event.preventDefault();
    const crop = document.getElementById('calc-crop')?.value || 'paddy';
    const acres = parseFloat(document.getElementById('calc-acres')?.value) || 1;
    const stage = document.getElementById('calc-stage')?.value || 'vegetative';
    const soil = document.getElementById('calc-soil')?.value || 'alluvial';

    const prescriptions = {
      paddy: {
        cropName: 'Samba / Kuruvai Paddy',
        ureaPerAcre: 55,
        dapPerAcre: 40,
        mopPerAcre: 25,
        bioPackets: 4,
        micronutrient: 'Zinc Sulphate (ZnSO₄) 10 kg/acre',
        waterLitersPerDay: 11500,
        runtimeMinutes: 90,
        tips: 'Maintain 3-5 cm thin water layer. Apply bio-potash spray on Day 45 for grain density.'
      },
      coconut: {
        cropName: 'Pollachi Coconut Palm (70 palms/acre)',
        ureaPerAcre: 84,
        dapPerAcre: 45,
        mopPerAcre: 140,
        bioPackets: 6,
        micronutrient: 'Borax 50g per palm + Magnesium Sulphate',
        waterLitersPerDay: 3500,
        runtimeMinutes: 45,
        tips: 'Apply in 1.8m radius circular drip ring. High potassium prevents button shedding.'
      },
      turmeric: {
        cropName: 'GI Certified Erode Turmeric',
        ureaPerAcre: 65,
        dapPerAcre: 60,
        mopPerAcre: 45,
        bioPackets: 5,
        micronutrient: 'Ferrous Sulphate 1% + Zinc 0.5% foliar spray',
        waterLitersPerDay: 6200,
        runtimeMinutes: 60,
        tips: 'Split nitrogen in 4 split doses (30, 60, 90, 120 DAP) for >4% curcumin accumulation.'
      },
      tea: {
        cropName: 'Nilgiris Kotagiri Tea Bushes',
        ureaPerAcre: 40,
        dapPerAcre: 25,
        mopPerAcre: 35,
        bioPackets: 3,
        micronutrient: 'Zinc-Manganese foliar spray (acidity buffering)',
        waterLitersPerDay: 2800,
        runtimeMinutes: 30,
        tips: 'Laterite soils require organic mulch to retain nitrogen during mountain rains.'
      },
      jasmine: {
        cropName: 'Madurai Gundu Malli (GI Jasmine)',
        ureaPerAcre: 35,
        dapPerAcre: 50,
        mopPerAcre: 40,
        bioPackets: 4,
        micronutrient: 'FeSO₄ 0.5% + Boric Acid 0.2%',
        waterLitersPerDay: 4200,
        runtimeMinutes: 40,
        tips: 'Prune annually during last week of November. Drip fertigation doubles flower yield.'
      },
      sugarcane: {
        cropName: 'High-Recovery Sugarcane (Co 86032)',
        ureaPerAcre: 120,
        dapPerAcre: 75,
        mopPerAcre: 60,
        bioPackets: 8,
        micronutrient: 'Ferrous Sulphate + Azophos slurry',
        waterLitersPerDay: 14000,
        runtimeMinutes: 110,
        tips: 'Earthing up at 90 days with subsurface drip fertigation saves 45% water.'
      }
    };

    const data = prescriptions[crop] || prescriptions.paddy;
    const stageMultiplier = stage === 'flowering' ? 1.25 : (stage === 'basal' ? 0.8 : 1.0);

    const totalUrea = Math.round(data.ureaPerAcre * acres * stageMultiplier);
    const totalDap = Math.round(data.dapPerAcre * acres * stageMultiplier);
    const totalMop = Math.round(data.mopPerAcre * acres * stageMultiplier);
    const totalBio = Math.round(data.bioPackets * acres);
    const totalWater = Math.round(data.waterLitersPerDay * acres);
    const totalRuntime = Math.round(data.runtimeMinutes);

    const resultBox = document.getElementById('calc-results-output');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 0.65rem;">
          Prescription for ${acres} Acre(s) — ${data.cropName} (${stage.toUpperCase()} STAGE):
        </div>
        <div class="calc-metric-badge">
          <span class="m-name">Urea (Nitrogen 46%):</span>
          <span class="m-val">${totalUrea} kg</span>
        </div>
        <div class="calc-metric-badge">
          <span class="m-name">DAP (Di-Ammonium Phosphate):</span>
          <span class="m-val">${totalDap} kg</span>
        </div>
        <div class="calc-metric-badge">
          <span class="m-name">MOP (Muriate of Potash):</span>
          <span class="m-val">${totalMop} kg</span>
        </div>
        <div class="calc-metric-badge">
          <span class="m-name">Bio-Fertilizer (Azospirillum + Phospho):</span>
          <span class="m-val">${totalBio} Packets (200g)</span>
        </div>
        <div class="calc-metric-badge">
          <span class="m-name">Essential Micronutrient Additive:</span>
          <span class="m-val" style="font-size: 0.8rem; color: #fff;">${data.micronutrient}</span>
        </div>
        <div class="calc-metric-badge" style="border-left-color: var(--accent-cyan);">
          <span class="m-name">Daily Drip Water Requirement:</span>
          <span class="m-val" style="color: var(--accent-cyan);">${totalWater.toLocaleString()} Liters / Day</span>
        </div>
        <div class="calc-metric-badge" style="border-left-color: #10b981;">
          <span class="m-name">Automated Solenoid Drip Runtime:</span>
          <span class="m-val" style="color: #10b981;">${totalRuntime} Minutes / Cycle</span>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.85rem; line-height: 1.5; background: #0c101a; padding: 0.65rem; border-radius: var(--radius-sm); border-left: 2px solid var(--accent-cyan);">
          💡 <strong>TNAU Agronomist Note:</strong> ${data.tips}
        </p>
      `;
    }
  },

  // --- TERMS AND CONDITIONS MODAL ---
  openTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) modal.classList.add('active');
  },

  closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) modal.classList.remove('active');
  },

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <span style="color: ${type === 'error' ? 'var(--danger)' : 'var(--accent-cyan)'}; font-size: 1rem;">
        ${type === 'error' ? '⚠️' : '✓'}
      </span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Auto initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
