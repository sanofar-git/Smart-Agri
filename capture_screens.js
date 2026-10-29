const express = require('./backend/node_modules/express');
const cors = require('./backend/node_modules/cors');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const edge = edgePaths.find(p => fs.existsSync(p));

const baseDir = __dirname;
const DB_PATH = path.join(baseDir, 'backend', 'data', 'db.json');
const FRONTEND_PATH = path.join(baseDir, 'frontend');

const app = express();
const PORT = 3088;

app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_PATH));

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// REST Endpoints
app.get('/api/system-info', (req, res) => res.json(loadDB().systemInfo || {}));
app.get('/api/land-reports', (req, res) => res.json({ reports: loadDB().landReports || [] }));
app.get('/api/revenue', (req, res) => res.json({ revenue: loadDB().revenue || {} }));
app.get('/api/customers', (req, res) => res.json({ customers: loadDB().customers || [] }));
app.get('/api/reviews', (req, res) => res.json({ reviews: loadDB().reviews || [] }));
app.get('/api/social-about', (req, res) => res.json(loadDB().socialAbout || {}));

const server = app.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  // Create temporary wrapper HTMLs for the distinct screenshots:
  const indexHtml = fs.readFileSync(path.join(FRONTEND_PATH, 'index.html'), 'utf8');

  // 1. Login Screen
  const loginHtml = path.join(FRONTEND_PATH, 'temp_view_login.html');
  fs.writeFileSync(loginHtml, indexHtml);

  // 2. Dashboard Screen (Revathi logged in)
  const dashHtml = path.join(FRONTEND_PATH, 'temp_view_dash.html');
  const dashInject = `
  <script>
  localStorage.setItem('agri_user', JSON.stringify({
    id: 'usr-farmer-01', name: 'R. Revathi', role: 'customer', email: 'revathi.farm@gmail.com', district: 'Thanjavur', farmSize: '14.5 Acres', primaryCrop: 'Cauvery Samba Paddy'
  }));
  </script>
  `;
  fs.writeFileSync(dashHtml, indexHtml.replace('<head>', `<head>${dashInject}`));

  // 3. Irrigation & Dam Radar Screen (scrolled to farmlands/irrigation)
  const irrHtml = path.join(FRONTEND_PATH, 'temp_view_irr.html');
  const irrInject = `
  <script>
  localStorage.setItem('agri_user', JSON.stringify({
    id: 'usr-farmer-01', name: 'R. Revathi', role: 'customer', email: 'revathi.farm@gmail.com', district: 'Thanjavur'
  }));
  </script>
  <style>
  #hero-section, #live-land-section { display: none !important; }
  </style>
  `;
  fs.writeFileSync(irrHtml, indexHtml.replace('<head>', `<head>${irrInject}`));

  // 4. Creator Admin Nexus Screen (Sanofar Fathima I logged in)
  const adminHtml = path.join(FRONTEND_PATH, 'temp_view_admin.html');
  const adminInject = `
  <script>
  localStorage.setItem('agri_user', JSON.stringify({
    id: 'usr-admin-01', name: 'Sanofar Fathima I', role: 'admin', email: 'sanofar.fathima@smartagri.tn.gov.in', title: 'Lead Architect & Creator'
  }));
  </script>
  <style>
  #hero-section, #live-land-section, #farmlands-section, #guide-section, #revenue-section, #customers-section, #reviews-section { display: none !important; }
  </style>
  `;
  fs.writeFileSync(adminHtml, indexHtml.replace('<head>', `<head>${adminInject}`));

  // 5. Revenue & Business Analytics Screen
  const revHtml = path.join(FRONTEND_PATH, 'temp_view_rev.html');
  const revInject = `
  <script>
  localStorage.setItem('agri_user', JSON.stringify({
    id: 'usr-farmer-01', name: 'R. Revathi', role: 'customer'
  }));
  </script>
  <style>
  #hero-section, #live-land-section, #farmlands-section, #guide-section { display: none !important; }
  </style>
  `;
  fs.writeFileSync(revHtml, indexHtml.replace('<head>', `<head>${revInject}`));

  const views = [
    { file: 'temp_view_login.html', out: 'screen_login.png' },
    { file: 'temp_view_dash.html', out: 'screen_dashboard.png' },
    { file: 'temp_view_irr.html', out: 'screen_irrigation.png' },
    { file: 'temp_view_admin.html', out: 'screen_admin.png' },
    { file: 'temp_view_rev.html', out: 'screen_revenue.png' }
  ];

  for (const v of views) {
    const outPath = path.join(baseDir, v.out);
    const url = `http://localhost:${PORT}/${v.file}`;
    console.log(`Capturing ${v.out}...`);
    try {
      execSync(`"${edge}" --headless --disable-gpu --window-size=1260,760 --screenshot="${outPath}" "${url}"`, { stdio: 'ignore' });
      console.log(`Captured ${v.out}: ${fs.statSync(outPath).size} bytes`);
    } catch (e) {
      console.error(`Error on ${v.out}:`, e.message);
    }
  }

  // Cleanup temp HTMLs
  [loginHtml, dashHtml, irrHtml, adminHtml, revHtml].forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });

  server.close(() => {
    console.log('Capture finished, server closed.');
  });
});
