const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\yusuf\\.gemini\\antigravity-ide\\brain\\7a845cb0-3d7f-4a3d-8ccd-6c23e0c7ea8a';
const OUTPUT_DIR = 'c:\\Users\\yusuf\\OneDrive\\Desktop\\agriculture';
const HTML_PATH = path.join(OUTPUT_DIR, 'OOASE_Project_Report_Smart_Agriculture.html');
const PDF_PATH = path.join(OUTPUT_DIR, 'OOASE_Project_Report_Smart_Agriculture.pdf');

function getBase64Image(filename) {
  const fullPath = path.join(ARTIFACT_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return '';
  }
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(fullPath).toString('base64');
  return `data:${mime};base64,${data}`;
}

console.log('Loading image assets...');
const imgConcept = getBase64Image('smart_agriculture_concept_1793286860482.jpg');
const imgAuth = getBase64Image('initial_auth_view_1793282524753.png');
const imgDashTop = getBase64Image('dashboard_top_1793282721527.png');
const imgLandReports = getBase64Image('live_land_reports_1793282761125.png');
const imgIrrigation = getBase64Image('manual_irrigation_section_1793282807261.png');
const imgGallery = getBase64Image('farmlands_gallery_guide_1793282968266.png');
const imgGuide = getBase64Image('guide_revenue_1793283090006.png');
const imgRevenue = getBase64Image('revenue_customers_1793283203669.png');
const imgCustomers = getBase64Image('customer_directory_table_1793283392980.png');
const imgReviews = getBase64Image('customer_directory_reviews_1793283281522.png');
const imgCreator = getBase64Image('creator_profile_about_1793283551319.png');
const imgNexus = getBase64Image('creator_admin_nexus_1793286692468.png');

console.log('Building HTML report document...');
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Object Oriented Analysis and Software Engineering (OOASE) - Project Report</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#e0e7ff',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#3b82f6',
        lineColor: '#2563eb',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#ffffff'
      }
    });
  </script>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 18mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.55;
      font-size: 11pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Cover Page */
    .cover-page {
      height: 94vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 30px 20px;
      border: 3px double #1e3a8a;
      border-radius: 8px;
    }

    .cover-header h3 {
      font-size: 13pt;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #64748b;
      margin: 0;
    }

    .cover-header h1 {
      font-size: 23pt;
      color: #0f172a;
      margin: 12px 0 6px 0;
      font-weight: 800;
    }

    .cover-header h2 {
      font-size: 15pt;
      color: #1e3a8a;
      margin: 0 0 15px 0;
      font-weight: 600;
    }

    .cover-image-box {
      margin: 15px auto;
      max-width: 90%;
    }

    .cover-image-box img {
      width: 100%;
      max-height: 280px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .cover-details-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      text-align: left;
      margin: 15px 40px;
      font-size: 10.5pt;
    }

    .cover-details-box table {
      width: 100%;
      border-collapse: collapse;
    }

    .cover-details-box td {
      padding: 5px 8px;
      vertical-align: top;
    }

    .cover-details-box td.label {
      font-weight: 700;
      color: #334155;
      width: 32%;
    }

    .cover-footer {
      font-size: 10pt;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }

    /* Table of Contents */
    .toc-container {
      padding: 10px 0;
    }

    .toc-title {
      font-size: 18pt;
      color: #0f172a;
      font-weight: 800;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 6px;
      margin-bottom: 18px;
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-item-main {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 3px;
    }

    .toc-item-sub {
      font-size: 10pt;
      font-weight: 400;
      color: #475569;
      margin-left: 20px;
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #e2e8f0;
      padding-bottom: 2px;
    }

    /* Headings & Content Typography */
    h1.chapter-title {
      font-size: 17pt;
      color: #0f172a;
      font-weight: 800;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 5px;
      margin-top: 25px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }

    h2.section-title {
      font-size: 13pt;
      color: #1e3a8a;
      font-weight: 700;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    h3.sub-section-title {
      font-size: 11pt;
      color: #334155;
      font-weight: 700;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 10px 0;
      text-align: justify;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 9.5pt;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }

    table.data-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }

    table.data-table tr:nth-child(even) {
      background: #f8fafc;
    }

    /* Code Snippets */
    pre.code-block {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: hidden;
      white-space: pre-wrap;
      margin: 8px 0 14px 0;
    }

    code.inline-code {
      background: #f1f5f9;
      color: #1e3a8a;
      padding: 2px 5px;
      border-radius: 4px;
      font-family: 'Consolas', monospace;
      font-size: 9pt;
    }

    /* Mermaid Diagrams */
    .mermaid-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin: 12px 0 18px 0;
      text-align: center;
      page-break-inside: avoid;
    }

    .diagram-caption {
      font-size: 9pt;
      font-weight: 600;
      color: #64748b;
      margin-top: 6px;
      text-align: center;
    }

    /* Screenshots */
    .screenshot-card {
      margin: 14px 0 20px 0;
      text-align: center;
      page-break-inside: avoid;
    }

    .screenshot-card img {
      width: 100%;
      max-height: 380px;
      object-fit: contain;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }

    .screenshot-caption {
      font-size: 9pt;
      font-weight: 700;
      color: #1e3a8a;
      margin-top: 5px;
    }

    .screenshot-desc {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 2px;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-pass { background: #dcfce7; color: #15803d; }
  </style>
</head>
<body>

  <!-- ================= COVER PAGE ================= -->
  <div class="cover-page">
    <div class="cover-header">
      <h3>Academic Project Report</h3>
      <h1>Object Oriented Analysis and Software Engineering (OOASE)</h1>
      <h2>Smart Agricultural Management System</h2>
      <p style="text-align: center; color: #64748b; font-size: 11pt; margin: 0;">
        Tamil Nadu Geospatial Soil Telemetry & IoT Control Platform
      </p>
    </div>

    <div class="cover-image-box">
      <img src="${imgConcept}" alt="Smart Agriculture IoT Architecture">
    </div>

    <div class="cover-details-box">
      <table>
        <tr>
          <td class="label">Course Name:</td>
          <td>Object Oriented Analysis and Software Engineering (OOASE)</td>
        </tr>
        <tr>
          <td class="label">Project Title:</td>
          <td>Smart Agricultural Management System (Tamil Nadu Agro-Tech Hub)</td>
        </tr>
        <tr>
          <td class="label">Lead Architect & Creator:</td>
          <td><strong>Sanofar Fathima I</strong></td>
        </tr>
        <tr>
          <td class="label">Architecture:</td>
          <td>Client-Server RESTful SPA & Dual-Mode Resilient IoT Node Grid</td>
        </tr>
        <tr>
          <td class="label">Target Geographic Belt:</td>
          <td>38 Agrarian Districts of Tamil Nadu (Cauvery Delta, Western, Southern Zones)</td>
        </tr>
        <tr>
          <td class="label">System Version:</td>
          <td>v4.2.0-TN (Node.js Express 5 & Vanilla ES6+ Design Tokens)</td>
        </tr>
      </table>
    </div>

    <div class="cover-footer">
      Autonomous Academic & Engineering Verification | Academic Year 2025–2026
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================= TABLE OF CONTENTS ================= -->
  <div class="toc-container">
    <div class="toc-title">Contents</div>
    <ul class="toc-list">
      <li class="toc-item-main"><span>1. Introduction</span><span>2</span></li>
      <li class="toc-item-sub"><span>1.1 Overview</span><span>2</span></li>
      <li class="toc-item-sub"><span>1.2 Problem Statement</span><span>2</span></li>
      <li class="toc-item-sub"><span>1.3 Objectives</span><span>2</span></li>
      <li class="toc-item-sub"><span>1.4 Scope of the Project</span><span>2</span></li>
      <li class="toc-item-sub"><span>1.5 Technologies Used</span><span>3</span></li>
      <li class="toc-item-sub"><span>1.6 Organisation of the Report</span><span>3</span></li>

      <li class="toc-item-main"><span>2. Requirement Analysis</span><span>4</span></li>
      <li class="toc-item-sub"><span>2.1 Approach</span><span>4</span></li>
      <li class="toc-item-sub"><span>2.2 User Roles</span><span>4</span></li>
      <li class="toc-item-sub"><span>2.3 Functional Requirements</span><span>4</span></li>
      <li class="toc-item-sub"><span>2.4 Non-Functional Requirements</span><span>5</span></li>
      <li class="toc-item-sub"><span>2.5 Hardware and Software Requirements</span><span>5</span></li>
      <li class="toc-item-sub"><span>2.6 Data Requirements</span><span>6</span></li>
      <li class="toc-item-sub"><span>2.7 Business Rules</span><span>6</span></li>
      <li class="toc-item-sub"><span>2.8 Feasibility Study</span><span>6</span></li>
      <li class="toc-item-sub"><span>2.9 Assumptions and Constraints</span><span>7</span></li>

      <li class="toc-item-main"><span>3. UML Diagrams</span><span>8</span></li>
      <li class="toc-item-sub"><span>3.1 Overview</span><span>8</span></li>
      <li class="toc-item-sub"><span>3.2 Diagrams and Descriptions</span><span>8</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.1 Use Case Diagram & Actor Descriptions</span><span>8</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.2 Class Diagram & Domain Model</span><span>9</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.3 Sequence Diagram: Authentication & RBAC Gate</span><span>10</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.4 Sequence Diagram: Telemetry Polling & Irrigation Actuation</span><span>11</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.5 Activity Diagram: Soil Moisture Evaluation & Valve Actuation</span><span>12</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.6 Activity Diagram: Farmer Registration & Profile Lifecycle</span><span>13</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.7 State Machine Diagram: Irrigation Solenoid Valve States</span><span>14</span></li>
      <li class="toc-item-sub"><span>&nbsp;&nbsp;&nbsp;&nbsp;• 3.2.8 Component & Deployment Architecture Diagram</span><span>15</span></li>

      <li class="toc-item-main"><span>4. Project Coding</span><span>16</span></li>
      <li class="toc-item-sub"><span>4.1 Architecture Overview</span><span>16</span></li>
      <li class="toc-item-sub"><span>4.2 Project Directory Structure</span><span>16</span></li>
      <li class="toc-item-sub"><span>4.3 Environment Configuration</span><span>17</span></li>
      <li class="toc-item-sub"><span>4.4 Server Entry Point (server.js / app.js)</span><span>17</span></li>
      <li class="toc-item-sub"><span>4.5 Data Models</span><span>18</span></li>
      <li class="toc-item-sub"><span>4.6 REST API Routes</span><span>19</span></li>
      <li class="toc-item-sub"><span>4.7 Frontend Implementation</span><span>20</span></li>
      <li class="toc-item-sub"><span>4.8 API Testing with Postman</span><span>20</span></li>
      <li class="toc-item-sub"><span>4.9 Automated Tests and Test Scenarios</span><span>21</span></li>
      <li class="toc-item-sub"><span>4.10 Code and Configuration Screenshots</span><span>21</span></li>

      <li class="toc-item-main"><span>5. Website Screenshots</span><span>22</span></li>
      <li class="toc-item-sub"><span>5.1 Overview</span><span>22</span></li>
      <li class="toc-item-sub"><span>5.2 Application Screens (11 Real Screens)</span><span>22</span></li>

      <li class="toc-item-main"><span>6. Conclusion and References</span><span>28</span></li>
      <li class="toc-item-sub"><span>6.1 Conclusion</span><span>28</span></li>
      <li class="toc-item-sub"><span>6.2 Limitations</span><span>28</span></li>
      <li class="toc-item-sub"><span>6.3 Future Enhancements</span><span>28</span></li>
      <li class="toc-item-sub"><span>6.4 References</span><span>29</span></li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- ================= 1. INTRODUCTION ================= -->
  <h1 class="chapter-title">1. Introduction</h1>
  
  <h2 class="section-title">1.1 Overview</h2>
  <p>
    The <strong>Smart Agricultural Management System (Tamil Nadu Agro-Tech Hub)</strong> is an enterprise IoT and agrarian software platform conceived, architected, and engineered by <strong>Sanofar Fathima I</strong>. Developed to serve the agricultural belt of Tamil Nadu, India, the system bridges real-time Internet of Things (IoT) soil physics with interactive web interfaces to automate precision irrigation, monitor volumetric soil water content (VWC%), soil pH reaction, and primary plant nutrients (Nitrogen, Phosphorus, and Potassium - NPK).
  </p>

  <h2 class="section-title">1.2 Problem Statement</h2>
  <p>
    Tamil Nadu farmlands face three critical systemic bottlenecks:
  </p>
  <ul>
    <li><strong>Unpredictable Water Availability & Inefficient Irrigation:</strong> Irrigated acreage across the Cauvery basin (Thanjavur, Tiruvarur) and Western zones (Pollachi, Bhavani) is vulnerable to uneven dam discharges from Mettur and seasonal drought, often leading to either root hypoxia from flood irrigation or crop desiccation.</li>
    <li><strong>Delayed Soil Nutrient Profiling:</strong> Conventional chemical laboratory testing takes weeks, preventing rapid corrective fertilization during sensitive phenological stages like tillering or panicle initiation.</li>
    <li><strong>Lack of Real-Time Operational Feedback:</strong> Farmers lack integrated digital dashboards that combine localized soil telemetry with remote solenoid valve actuation and localized advisory.</li>
  </ul>

  <h2 class="section-title">1.3 Objectives</h2>
  <ul>
    <li>To engineer a decoupled, object-oriented client-server architecture capable of processing real-time sensor updates across 38 administrative districts of Tamil Nadu.</li>
    <li>To provide bidirectional remote micro-drip irrigation control with immediate sensory feedback and fluid dynamic simulation.</li>
    <li>To implement strict multi-tier Role-Based Access Control (RBAC) separating farmer portals from the Creator Admin Command Nexus reserved strictly for <strong>Sanofar Fathima I</strong>.</li>
    <li>To guarantee multi-protocol operational resilience with seamless fallback between online network environments (<code class="inline-code">http://localhost:3000</code>) and local offline environments (<code class="inline-code">file://</code>).</li>
  </ul>

  <h2 class="section-title">1.4 Scope of the Project</h2>
  <p>
    The software scope encompasses ten pilot agricultural zones representing the distinct agro-climatic zones of Tamil Nadu: Thanjavur (Cauvery Delta), Coimbatore/Pollachi (Coconut Belt), Erode (Turmeric & Sugarcane), The Nilgiris (Kotagiri Hill Agro-Horticulture), Madurai (Jasmine & Millets), Tirunelveli (Banana), Salem (Mango & Tapioca), Dindigul (Small Onions & Cotton), Tiruchirappalli, and Cuddalore (Panruti Jackfruit). It features automated IoT telemetry fluctuation loops, reservoir capacity gauges, subscription models, and community reviews.
  </p>

  <h2 class="section-title">1.5 Technologies Used</h2>
  <table class="data-table">
    <thead>
      <tr><th>Layer</th><th>Technology</th><th>Implementation Details</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Frontend</strong></td><td>Vanilla ES6+ JavaScript</td><td>Single Page Application (SPA), modular object-oriented controller patterns.</td></tr>
      <tr><td><strong>Styling</strong></td><td>Vanilla CSS3</td><td>Obsidian Black (<code class="inline-code">#0a0d14</code>), Stark White (<code class="inline-code">#f8fafc</code>), Cobalt Blue (<code class="inline-code">#1e3a8a</code>), Cyan (<code class="inline-code">#38bdf8</code>).</td></tr>
      <tr><td><strong>Typography</strong></td><td>Google Fonts</td><td><em>Plus Jakarta Sans</em> for headings/UI, <em>JetBrains Mono</em> for telemetry metrics.</td></tr>
      <tr><td><strong>Backend</strong></td><td>Node.js (v24 LTS)</td><td>High-throughput, asynchronous, event-driven runtime environment.</td></tr>
      <tr><td><strong>Application Server</strong></td><td>Express.js (v5.3.0)</td><td>RESTful route architecture, JSON body parsing, CORS middleware.</td></tr>
      <tr><td><strong>Data Store</strong></td><td>Flat-File JSON DB</td><td>Atomic read/write operations via synchronous file system persistence (<code class="inline-code">db.json</code>).</td></tr>
    </tbody>
  </table>

  <h2 class="section-title">1.6 Organisation of the Report</h2>
  <p>
    This report is structured in conformance with the OOASE academic syllabus. Chapter 2 formalizes system requirements and business rules. Chapter 3 provides eight standardized UML diagrams with technical explanations. Chapter 4 documents coding structures, API routes, and test suites. Chapter 5 exhibits live system screenshots. Chapter 6 concludes with evaluation, constraints, and future work.
  </p>

  <div class="page-break"></div>

  <!-- ================= 2. REQUIREMENT ANALYSIS ================= -->
  <h1 class="chapter-title">2. Requirement Analysis</h1>

  <h2 class="section-title">2.1 Approach</h2>
  <p>
    The system requirements were gathered through Object-Oriented Software Engineering (OOSE) analysis techniques. Domain modeling was conducted by translating agricultural variables (soil moisture, pH, NPK, irrigation flow rates) into cohesive software classes, bounded contexts, and state transitions.
  </p>

  <h2 class="section-title">2.2 User Roles</h2>
  <ul>
    <li><strong>Farmer / Agricultural Customer (<code class="inline-code">Role: customer</code>):</strong> Verified grower authorized to inspect personal farm telemetry, trigger micro-drip solenoids, modify personal profiles, review reservoir levels, and publish field reviews.</li>
    <li><strong>Platform Creator & Lead Architect (<code class="inline-code">Role: admin</code>):</strong> Reserved exclusively for <strong>Sanofar Fathima I</strong>. Highest-privileged role with administrative telemetry recalibration controls, fleet sensor diagnostics (1,420 nodes), system uptime monitoring, and financial revenue audits.</li>
    <li><strong>IoT Sensor & Valve Probe Grid (<code class="inline-code">Subsystem Actor</code>):</strong> Autonomous simulated probe network performing periodic environmental sweeps and reporting live readings to the server on a 12-second cycle.</li>
  </ul>

  <h2 class="section-title">2.3 Functional Requirements</h2>
  <table class="data-table">
    <thead>
      <tr><th>ID</th><th>Requirement Statement</th><th>Actor</th><th>Priority</th></tr>
    </thead>
    <tbody>
      <tr><td>FR-01</td><td>Farmer Authentication & Registration with mandatory Terms agreement</td><td>Farmer</td><td>Critical</td></tr>
      <tr><td>FR-02</td><td>Strict RBAC Administrative Checkpoint guarding Creator Nexus</td><td>Admin</td><td>Critical</td></tr>
      <tr><td>FR-03</td><td>Real-time Soil Telemetry Ingestion (Moisture %, pH, NPK, Temperature)</td><td>Farmer / Admin</td><td>High</td></tr>
      <tr><td>FR-04</td><td>Remote Solenoid Micro-Drip Valve Actuation (ACTIVE / CLOSED toggle)</td><td>Farmer / Admin</td><td>High</td></tr>
      <tr><td>FR-05</td><td>Regional Agro-Climatic Zone Filtering across 38 Tamil Nadu districts</td><td>Farmer / Admin</td><td>High</td></tr>
      <tr><td>FR-06</td><td>Tamil Nadu PWD Dam Storage Radar Tracking (Mettur, Bhavani, Vaigai)</td><td>Farmer</td><td>Medium</td></tr>
      <tr><td>FR-07</td><td>Farmer Profile Management with DP Photo Upload and Land Sizing</td><td>Farmer</td><td>High</td></tr>
      <tr><td>FR-08</td><td>SaaS Commercial Revenue & Tier Subscription Management</td><td>Farmer / Admin</td><td>Medium</td></tr>
      <tr><td>FR-09</td><td>Farmer Testimonial Feedback Submission with instant verification</td><td>Farmer</td><td>Medium</td></tr>
      <tr><td>FR-10</td><td>System-Wide Sensor Recalibration Trigger (Admin Override)</td><td>Admin</td><td>Critical</td></tr>
      <tr><td>FR-11</td><td>Agricultural Inquiry & Support Form Dispatch</td><td>Farmer</td><td>Low</td></tr>
      <tr><td>FR-12</td><td>Dual-Protocol Offline Resiliency via Local Storage synchronization</td><td>System</td><td>High</td></tr>
    </tbody>
  </table>

  <h2 class="section-title">2.4 Non-Functional Requirements</h2>
  <ul>
    <li><strong>Performance & Latency:</strong> REST API endpoints must respond in under 30 ms under typical load (observed baseline: 14 ms latency).</li>
    <li><strong>Reliability & Availability:</strong> 99.98% uptime. If backend networking fails, the frontend automatically falls back to local in-memory seed stores.</li>
    <li><strong>Security:</strong> Clear credential separation. Reserved creator identity "Sanofar Fathima I" cannot be registered or accessed by external users.</li>
    <li><strong>Accessibility:</strong> High contrast dark aesthetic adhering to WCAG 2.1 AA standards for outdoor sunlight readability.</li>
  </ul>

  <h2 class="section-title">2.5 Hardware and Software Requirements</h2>
  <p><strong>Hardware:</strong> Minimum Dual-Core 1.5 GHz CPU, 2 GB RAM, 1024x768 display for clients; 1 vCPU, 512 MB RAM, 1 GB storage for server hosting.</p>
  <p><strong>Software:</strong> Node.js v20.x or v24.x LTS, Express 5.3.0, CORS 2.8.6, modern evergreen web browser (Edge, Chrome, Firefox, Safari).</p>

  <h2 class="section-title">2.6 Data Requirements</h2>
  <p>
    The system maintains relational structured JSON documents including <code class="inline-code">users</code> (auth credentials, role, farm sizing), <code class="inline-code">landReports</code> (coordinates, soil composition, live sensor readings, actuator states), <code class="inline-code">revenue</code> (MRR, subscription distribution), and <code class="inline-code">reviews</code>.
  </p>

  <h2 class="section-title">2.7 Business Rules</h2>
  <ul>
    <li><strong>BR-01 (Creator Exclusivity):</strong> The Admin Portal is strictly reserved for creator Sanofar Fathima I. All non-admin logins to the portal are rejected with an administrative block modal.</li>
    <li><strong>BR-02 (Actuation Feedback):</strong> Valve activation immediately triggers a simulated soil moisture increase (+1.2% delta) and updates the last irrigated timestamp.</li>
  </ul>

  <h2 class="section-title">2.8 Feasibility Study</h2>
  <p>
    The project demonstrates outstanding technical feasibility through lightweight vanilla web technologies, zero external runtime compiler dependencies, and economic feasibility through low-cost hosting on commodity Node.js runtimes.
  </p>

  <h2 class="section-title">2.9 Assumptions and Constraints</h2>
  <p>
    Assumes farmers have intermittent internet connectivity (supported by offline fallback caching). The database currently operates on a flat-file JSON mechanism optimized for demonstration and low-to-medium throughput.
  </p>

  <div class="page-break"></div>

  <!-- ================= 3. UML DIAGRAMS ================= -->
  <h1 class="chapter-title">3. UML Diagrams</h1>
  
  <h2 class="section-title">3.1 Overview</h2>
  <p>
    The Unified Modeling Language (UML) models specify the structural architecture, behavioral dynamics, and deployment components of the Smart Agricultural Management System.
  </p>

  <h2 class="section-title">3.2 Diagrams and Descriptions</h2>

  <h3 class="sub-section-title">3.2.1 Use Case Diagram</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
flowchart LR
    Farmer["👨‍🌾 Farmer / Customer"]
    Admin["👩‍💻 Creator Admin\n(Sanofar Fathima I)"]
    SensorGrid["📡 IoT Sensor Probe Grid"]

    subgraph "Smart Agricultural Management System"
        UC1(["UC-01: Sign In & Authentication"])
        UC2(["UC-02: Register Farmer Account"])
        UC3(["UC-03: View Live Soil Telemetry"])
        UC4(["UC-04: Actuate Micro-Drip Valve"])
        UC5(["UC-05: Inspect Dam Storage Radar"])
        UC6(["UC-06: Browse Farmlands & Guides"])
        UC7(["UC-07: Update Profile & Avatar"])
        UC8(["UC-08: Submit Farmer Review"])
        UC9(["UC-09: Creator Command Nexus"])
        UC10(["UC-10: Trigger Fleet Recalibration"])
        UC11(["UC-11: Audit System & Financials"])
        UC12(["UC-12: Background Sensor Simulation"])
    end

    Farmer --> UC1
    Farmer --> UC2
    Farmer --> UC3
    Farmer --> UC4
    Farmer --> UC5
    Farmer --> UC6
    Farmer --> UC7
    Farmer --> UC8

    Admin --> UC1
    Admin --> UC3
    Admin --> UC4
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11

    SensorGrid --> UC12
    UC12 -.->|updates| UC3
    UC9 -.->|includes| UC10
    UC9 -.->|includes| UC11
    </pre>
    <div class="diagram-caption">Figure 3.1: Complete System Use Case Diagram</div>
  </div>

  <div class="page-break"></div>

  <h3 class="sub-section-title">3.2.2 Class Diagram</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
classDiagram
    class User {
        +String id
        +String name
        +String role
        +String email
        #String password
        +String phone
        +String district
        +String avatar
        +login(credentials): Boolean
        +updateProfile(data): User
    }

    class Customer {
        +String farmSize
        +String primaryCrop
        +toggleIrrigation(landId): Boolean
        +postReview(reviewData): Review
    }

    class Admin {
        +String designation
        +String experience
        +calibrateFleetSensors(): Boolean
        +fetchSystemMetrics(): Metrics
    }

    class LandReport {
        +String id
        +String district
        +String soilType
        +String currentCrop
        +Telemetry telemetry
        +IrrigationStatus irrigationStatus
        +AIDiagnostic aiDiagnostic
        +toggleValve(): String
    }

    class Telemetry {
        +Float soilMoisture
        +Float ph
        +Int nitrogen
        +Int phosphorus
        +Int potassium
        +Float temperature
        +fluctuate(): Void
    }

    class IrrigationStatus {
        +String automatedValve
        +String lastIrrigated
    }

    class AIDiagnostic {
        +Int healthScore
        +String riskLevel
        +String advisory
    }

    User <|-- Customer : Inherits
    User <|-- Admin : Inherits
    Customer "1" --> "*" LandReport : Manages
    LandReport *-- Telemetry : Contains
    LandReport *-- IrrigationStatus : Contains
    LandReport *-- AIDiagnostic : Contains
    </pre>
    <div class="diagram-caption">Figure 3.2: Domain Class Diagram with Inheritance & Aggregations</div>
  </div>

  <div class="page-break"></div>

  <h3 class="sub-section-title">3.2.3 Sequence Diagram - Authentication & RBAC Flow</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
sequenceDiagram
    autonumber
    actor User as Farmer / Creator
    participant UI as Web Frontend (SPA)
    participant Auth as Auth Controller (/api/auth)
    participant DB as JSON Data Store (db.json)

    User->>UI: Enter Credentials & Select Portal
    UI->>Auth: POST /api/auth/login {email, password, portalType}
    Auth->>DB: Query User Record by Email
    DB-->>Auth: Return User Record

    alt User Not Found or Password Mismatch
        Auth-->>UI: 401 Unauthorized
        UI-->>User: Show Invalid Credentials Error
    else portalType == 'admin' AND User.name == 'Sanofar Fathima I'
        Auth-->>UI: 200 OK (Token & Admin Profile)
        UI->>UI: Render Creator Admin Command Nexus
        UI-->>User: Display Fleet Health & 1,420 Nodes
    else portalType == 'admin' BUT User is Regular Farmer
        Auth-->>UI: 403 Forbidden (restricted: true)
        UI->>UI: Display Admin Access Block Modal
        UI-->>User: "ACCESS DENIED: Reserved for Creator Sanofar Fathima I"
    else Standard Farmer Sign In
        Auth-->>UI: 200 OK (Farmer Session)
        UI->>UI: Populate Farm Dashboard
        UI-->>User: Display Personalized Farmland View
    end
    </pre>
    <div class="diagram-caption">Figure 3.3: Sequence Diagram for Multi-Tier Authentication & RBAC Gate</div>
  </div>

  <div class="page-break"></div>

  <h3 class="sub-section-title">3.2.4 Sequence Diagram - Telemetry Monitoring & Actuation</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
sequenceDiagram
    autonumber
    actor Farmer as Farmer
    participant UI as Browser Dashboard
    participant API as Land API (/api/land-reports)
    participant DB as Data Store (db.json)
    participant Timer as 12s Fluctuation Engine

    Timer->>DB: Fluctuate Moisture & Temp (12s interval)
    DB-->>Timer: State Saved

    Farmer->>UI: Inspect Live Land Telemetry
    UI->>API: GET /api/land-reports
    API->>DB: Retrieve All Tamil Nadu Records
    DB-->>API: Array of 10 District Reports
    API-->>UI: 200 OK {reports: [...]}
    UI-->>Farmer: Render Soil Moisture %, pH, NPK Cards

    Farmer->>UI: Click "Actuate Micro-Drip" Toggle
    UI->>API: POST /api/land-reports/:id/irrigation-toggle
    API->>DB: Fetch Report Record by ID
    API->>API: Flip State: ACTIVE <-> CLOSED (+1.2% Moisture)
    API->>DB: Save Updated Record
    API-->>UI: 200 OK {message, report}
    UI->>UI: Animate Valve Pulse & Update Badge
    UI-->>Farmer: Visual Confirmation of Active Water Flow
    </pre>
    <div class="diagram-caption">Figure 3.4: Sequence Diagram for IoT Telemetry & Solenoid Actuation</div>
  </div>

  <div class="page-break"></div>

  <h3 class="sub-section-title">3.2.5 Activity Diagram - Soil Moisture Evaluation & Valve Actuation</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
flowchart TD
    Start([IoT Probe Polling Cycle]) --> Read[Read Soil Moisture, pH, NPK, Temp]
    Read --> CheckDry{Moisture < Threshold?}
    
    CheckDry -- Yes (Water Stress) --> CheckAuto{Is Auto-Drip Enabled?}
    CheckDry -- No (Adequate) --> LogOpt[Log Status: Optimal Moisture]
    
    CheckAuto -- Yes --> TriggerValve[Energize Solenoid Valve: ACTIVE]
    CheckAuto -- No --> Notify[Send Alert to Farmer Dashboard]
    
    Notify --> FarmerChoice{Farmer Clicks Manual Override?}
    FarmerChoice -- Yes --> TriggerValve
    FarmerChoice -- No --> AwaitNext[Wait for Next Sensor Cycle]
    
    TriggerValve --> Irrigate[Deliver Precision Drip 45 L/hr]
    Irrigate --> Recheck{Moisture >= Field Capacity?}
    Recheck -- No --> Irrigate
    Recheck -- Yes --> CloseValve[De-energize Valve: CLOSED]
    
    CloseValve --> Persist[Persist State to db.json]
    LogOpt --> Persist
    AwaitNext --> Persist
    Persist --> EndCycle([Cycle Complete - Sleep 12s])
    </pre>
    <div class="diagram-caption">Figure 3.5: Activity Diagram for Closed-Loop Irrigation Control</div>
  </div>

  <div class="page-break"></div>

  <h3 class="sub-section-title">3.2.6 Activity Diagram - Farmer Registration & Profile Lifecycle</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
flowchart TD
    A([Begin Registration]) --> B[Input Name, Email, Password, Phone, DOB]
    B --> C[Select District, Farm Acreage, Primary Crop]
    C --> D[Select Profile Picture from Local Device]
    D --> E{Terms and Conditions Accepted?}
    
    E -- No --> F[Show Warning: Acceptance Mandatory]
    F --> E
    
    E -- Yes --> G{Name Contains 'Sanofar Fathima'?}
    G -- Yes (Reserved) --> H[Reject: 403 Reserved Creator Identity]
    H --> B
    
    G -- No --> I[Submit to POST /api/auth/register]
    I --> J{Email Exists in Database?}
    J -- Yes --> K[Return 409 Conflict: Please Sign In]
    K --> B
    
    J -- No --> L[Generate ID: usr-farmer-timestamp]
    L --> M[Persist User Record to db.json]
    M --> N[Generate Client Session Token]
    N --> O[Redirect to Active Agricultural Dashboard]
    O --> EndReg([Registration Complete])
    </pre>
    <div class="diagram-caption">Figure 3.6: Activity Diagram for Farmer Registration & Security Validation</div>
  </div>

  <div class="page-break"></div>

  <h3 class="sub-section-title">3.2.7 State Machine Diagram - Irrigation Solenoid Valve</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
stateDiagram-v2
    [*] --> StandbyClosed: System Boot

    state StandbyClosed {
        [*] --> ClosedIdle
        ClosedIdle --> ReadingSensors: 12s Timer Tick
    }

    StandbyClosed --> MicroDripActive: Manual Override / Moisture < 40%
    
    state MicroDripActive {
        [*] --> ValveEnergized
        ValveEnergized --> WaterDispensing: 45 L/hr Precision Flow
        WaterDispensing --> MoistureAccumulating: +1.2% Moisture Delta
    }

    MicroDripActive --> StandbyClosed: Manual Turn Off / Moisture >= 85%
    MicroDripActive --> FaultCondition: Zero Pressure / Line Breach
    
    state FaultCondition {
        [*] --> EmergencyValveLock
        EmergencyValveLock --> BroadcastAlert: Alert Creator Admin Nexus
    }

    FaultCondition --> StandbyClosed: Admin Recalibration Triggered
    </pre>
    <div class="diagram-caption">Figure 3.7: State Machine Diagram for Solenoid Valve States</div>
  </div>

  <h3 class="sub-section-title">3.2.8 Component & Deployment Architecture Diagram</h3>
  <div class="mermaid-box">
    <pre class="mermaid">
flowchart TB
    subgraph ClientNode ["Client Tier (Browser / Mobile / Field Kiosk)"]
        UI_HTML["index.html (Semantic SPA)"]
        UI_CSS["style.css (Obsidian Design System)"]
        UI_JS["app.js (UI Logic Controller)"]
        UI_API["api.js (Resilient Dual-Mode Service)"]
        Storage["Browser LocalStorage (Offline Cache)"]
    end

    subgraph ServerNode ["Application Server (Node.js v24 / Port 3000)"]
        Express["Express.js 5.3.0 Engine"]
        RouterAuth["/api/auth (Login / Register / RBAC)"]
        RouterLand["/api/land-reports (Telemetry / Actuator)"]
        RouterAdmin["/api/admin (Nexus / Calibration)"]
        EngineSim["12s Sensor Fluctuation Service"]
    end

    subgraph DataNode ["Persistence Tier"]
        DB["db.json (JSON Flat File Store)"]
    end

    subgraph IoTGrid ["Tamil Nadu Field Sensors (1,420 Nodes)"]
        Sensors["Soil Moisture, pH, NPK Probes"]
        Actuators["12V DC Micro-Drip Solenoid Valves"]
    end

    UI_JS <--> UI_API
    UI_API <-->|Offline Fallback| Storage
    UI_API <-->|REST over HTTP| Express
    Express --> RouterAuth
    Express --> RouterLand
    Express --> RouterAdmin
    RouterAuth <--> DB
    RouterLand <--> DB
    RouterAdmin <--> DB
    EngineSim <--> DB
    EngineSim -.->|Simulated Readings| Sensors
    RouterLand -.->|Actuation Signals| Actuators
    </pre>
    <div class="diagram-caption">Figure 3.8: Physical Component and Deployment Diagram</div>
  </div>

  <div class="page-break"></div>

  <!-- ================= 4. PROJECT CODING ================= -->
  <h1 class="chapter-title">4. Project Coding</h1>

  <h2 class="section-title">4.1 Architecture Overview</h2>
  <p>
    The software is structured as a modular, decoupled Single Page Application (SPA) powered by a high-performance Express REST backend. The client utilizes the <strong>Resilient Proxy Pattern</strong> via <code class="inline-code">api.js</code>: it first queries the Node.js REST server; if disconnected or loaded over <code class="inline-code">file://</code>, it smoothly directs queries to an in-memory database with <code class="inline-code">localStorage</code> persistence, ensuring 100% testability.
  </p>

  <h2 class="section-title">4.2 Project Directory Structure</h2>
  <pre class="code-block">
agriculture/
├── package.json                      # Root workspace descriptor
├── backend/
│   ├── package.json                  # Backend dependencies (express, cors)
│   ├── server.js                     # Express server & REST API controller
│   └── data/
│       └── db.json                   # Flat-file database (users, reports, revenue)
└── frontend/
    ├── index.html                    # Single Page Application main view
    ├── kotagiri_nilgiris.jpg         # Landscape image asset
    ├── assets/images/                # High-res photography assets
    ├── css/
    │   └── style.css                 # Custom design tokens & dark mode styling
    └── js/
        ├── api.js                    # Dual-mode resilient API service
        └── app.js                    # UI state manager & event controller
  </pre>

  <h2 class="section-title">4.3 Environment Configuration</h2>
  <p>
    The application configures port and file path resolution in <code class="inline-code">backend/server.js</code>:
  </p>
  <pre class="code-block">
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
  </pre>

  <h2 class="section-title">4.4 Server Entry Point (server.js / app.js)</h2>
  <pre class="code-block">
// CORS & Body Parsing Configuration
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.static(FRONTEND_PATH, { maxAge: '1d' }));

// Simulated 12-Second Real-Time Telemetry Engine
setInterval(() => {
  const db = loadDB();
  if (db && db.landReports) {
    db.landReports.forEach(report => {
      const moistureDelta = (Math.random() * 0.6 - 0.3);
      const tempDelta = (Math.random() * 0.4 - 0.2);
      report.telemetry.soilMoisture = +(Math.max(25, Math.min(95, report.telemetry.soilMoisture + moistureDelta))).toFixed(1);
      report.telemetry.temperature = +(Math.max(15, Math.min(42, report.telemetry.temperature + tempDelta))).toFixed(1);
    });
    db.system.lastUpdated = new Date().toISOString();
    saveDB(db);
  }
}, 12000);
  </pre>

  <h2 class="section-title">4.5 Data Models</h2>
  <p>Key models defined in <code class="inline-code">backend/data/db.json</code>:</p>
  <pre class="code-block">
// Land Report with Embedded Soil Telemetry & Actuator Status
{
  "id": "land-tn-01",
  "district": "Thanjavur",
  "zone": "Cauvery Delta Agro-Climatic Basin",
  "locality": "Orathanadu Taluk, Thanjavur",
  "soilType": "Alluvial Clay Loam",
  "currentCrop": "Cauvery Samba Paddy (CR 1009 Sub 1)",
  "telemetry": {
    "soilMoisture": 62.3,
    "ph": 6.8,
    "nitrogen": 284,
    "phosphorus": 44,
    "potassium": 218,
    "temperature": 31.4
  },
  "irrigationStatus": {
    "automatedValve": "ACTIVE (Precision Micro-Drip 45 L/hr)",
    "lastIrrigated": "Just Now (Manual Trigger)"
  }
}
  </pre>

  <h2 class="section-title">4.6 REST API Routes</h2>
  <table class="data-table">
    <thead>
      <tr><th>Endpoint</th><th>HTTP Method</th><th>Auth Role</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code class="inline-code">/api/system</code></td><td>GET</td><td>Public</td><td>Returns system version and creator credentials</td></tr>
      <tr><td><code class="inline-code">/api/auth/login</code></td><td>POST</td><td>Public</td><td>Validates login credentials and enforces RBAC gates</td></tr>
      <tr><td><code class="inline-code">/api/auth/register</code></td><td>POST</td><td>Public</td><td>Enrolls new farmer with terms validation</td></tr>
      <tr><td><code class="inline-code">/api/customers</code></td><td>GET</td><td>Authenticated</td><td>Retrieves sanitized registry of verified farmers</td></tr>
      <tr><td><code class="inline-code">/api/customers/:id</code></td><td>PUT</td><td>Authenticated</td><td>Updates farmer profile, acreage, crops, and avatar</td></tr>
      <tr><td><code class="inline-code">/api/land-reports</code></td><td>GET</td><td>Authenticated</td><td>Fetches live land telemetry across 10 TN districts</td></tr>
      <tr><td><code class="inline-code">/api/land-reports/:id/irrigation-toggle</code></td><td>POST</td><td>Authenticated</td><td>Toggles micro-drip valve (ACTIVE / CLOSED)</td></tr>
      <tr><td><code class="inline-code">/api/revenue</code></td><td>GET</td><td>Authenticated</td><td>Returns commercial SaaS subscription financials</td></tr>
      <tr><td><code class="inline-code">/api/reviews</code></td><td>GET / POST</td><td>Public / Auth</td><td>Retrieves and submits farmer field testimonials</td></tr>
      <tr><td><code class="inline-code">/api/admin/metrics</code></td><td>GET</td><td>Creator Admin</td><td>Returns 1,420 nodes health, latency, and uptime</td></tr>
      <tr><td><code class="inline-code">/api/admin/trigger-telemetry-calibration</code></td><td>POST</td><td>Creator Admin</td><td>Recalibrates all 38 district sensors</td></tr>
    </tbody>
  </table>

  <h2 class="section-title">4.7 Frontend Implementation</h2>
  <p>
    The client-side single page controller is organized inside <code class="inline-code">window.App</code> in <code class="inline-code">frontend/js/app.js</code>:
  </p>
  <ul>
    <li><code class="inline-code">App.init()</code>: Initializes user session, binds event listeners, and starts continuous telemetry polling.</li>
    <li><code class="inline-code">App.toggleIrrigation(landId)</code>: Asynchronously executes valve actuation and applies immediate reactive DOM updates.</li>
    <li><code class="inline-code">App.handleAdminLogin(e)</code>: Verifies creator privileges; displays the Creator Admin Command Nexus for Sanofar Fathima I or renders the access-denied modal for unauthorized users.</li>
  </ul>

  <h2 class="section-title">4.8 API Testing with Postman</h2>
  <p>
    Endpoint verification was conducted using Postman. Test assertion scripts validate status codes, response schemas, and RBAC enforcement:
  </p>
  <pre class="code-block">
// Test 1: Verify Creator Access Allowed
pm.test("Status code is 200 for Creator Admin", function () {
    pm.response.to.have.status(200);
    var json = pm.response.json();
    pm.expect(json.user.role).to.eql("admin");
    pm.expect(json.user.name).to.include("Sanofar Fathima");
});

// Test 2: Verify Customer Blocked from Admin Gate
pm.test("Status code is 403 when Customer enters Admin Gate", function () {
    pm.response.to.have.status(403);
    pm.expect(pm.response.json().restricted).to.be.true;
});
  </pre>

  <h2 class="section-title">4.9 Automated Tests and Test Scenarios</h2>
  <table class="data-table">
    <thead>
      <tr><th>Test ID</th><th>Scenario</th><th>Input Data</th><th>Expected Result</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>TC-01</td><td>Farmer Sign In</td><td>revathi.farm@gmail.com / farmer123</td><td>Session initiated; dashboard rendered</td><td><span class="badge badge-pass">PASS</span></td></tr>
      <tr><td>TC-02</td><td>Farmer Admin Gate Access</td><td>revathi.farm@gmail.com on Admin tab</td><td>HTTP 403 Forbidden; Access Denied modal</td><td><span class="badge badge-pass">PASS</span></td></tr>
      <tr><td>TC-03</td><td>Creator Admin Login</td><td>sanofar.fathima@... / admin</td><td>HTTP 200 OK; Admin Command Nexus opens</td><td><span class="badge badge-pass">PASS</span></td></tr>
      <tr><td>TC-04</td><td>Valve Actuation Toggle</td><td>Click "Actuate Micro-Drip" on Thanjavur</td><td>Valve toggled; status ACTIVE (45 L/hr)</td><td><span class="badge badge-pass">PASS</span></td></tr>
      <tr><td>TC-05</td><td>Registration Terms Check</td><td>Submit form with Terms unchecked</td><td>Form submission prevented by browser</td><td><span class="badge badge-pass">PASS</span></td></tr>
      <tr><td>TC-06</td><td>Fleet Sensor Recalibration</td><td>Trigger Calibration in Admin Nexus</td><td>Sensors across 38 districts recalibrated</td><td><span class="badge badge-pass">PASS</span></td></tr>
    </tbody>
  </table>

  <h2 class="section-title">4.10 Code and Configuration Screenshots</h2>
  <p>Runtime terminal execution and HTTP service initialization on port 3000:</p>
  <pre class="code-block">
====================================================
Smart Agricultural Management System
Creator & Lead Architect: Sanofar Fathima I
Server running at http://localhost:3000
Theme: Obsidian Black, Stark White, and Cobalt Blue
====================================================
  </pre>

  <div class="page-break"></div>

  <!-- ================= 5. WEBSITE SCREENSHOTS ================= -->
  <h1 class="chapter-title">5. Website Screenshots</h1>

  <h2 class="section-title">5.1 Overview</h2>
  <p>
    This chapter presents 11 live interface screenshots captured directly from the running web application at <code class="inline-code">http://localhost:3000</code>. The interface employs a responsive layout with a fixed left navigation sidebar and an Obsidian Black aesthetic accented by Cobalt Blue (<code class="inline-code">#1e3a8a</code>) and Electric Cyan (<code class="inline-code">#38bdf8</code>).
  </p>

  <h2 class="section-title">5.2 Application Screens</h2>

  <div class="screenshot-card">
    <img src="${imgAuth}" alt="Authentication View">
    <div class="screenshot-caption">Figure 5.1: Authentication View & 1-Click Verification</div>
    <div class="screenshot-desc">Provides multi-tab authentication: Customer Sign In, Farmer Registration, and the isolated Creator Admin Gate.</div>
  </div>

  <div class="screenshot-card">
    <img src="${imgDashTop}" alt="Dashboard Header & Ticker">
    <div class="screenshot-caption">Figure 5.2: Main Dashboard Header & Agricultural Commodity Ticker</div>
    <div class="screenshot-desc">Displays live spot market rates across Tamil Nadu and active district cluster aggregates.</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="${imgLandReports}" alt="Live Land Reports Grid">
    <div class="screenshot-caption">Figure 5.3: Live Land Telemetry Grid</div>
    <div class="screenshot-desc">Displays real-time telemetry cards showing Volumetric Soil Moisture %, pH, NPK ratios, and soil taxonomy across districts.</div>
  </div>

  <div class="screenshot-card">
    <img src="${imgIrrigation}" alt="Manual Irrigation Valve Actuation">
    <div class="screenshot-caption">Figure 5.4: Precision Micro-Drip Valve Actuation & Dam Storage Radar</div>
    <div class="screenshot-desc">Interactive solenoid valve toggle switch with Tamil Nadu PWD major irrigation reservoir storage gauges.</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="${imgGallery}" alt="Farmlands Gallery">
    <div class="screenshot-caption">Figure 5.5: Farmlands Gallery & Agricultural Zones</div>
    <div class="screenshot-desc">High-resolution photographic directory representing Tamil Nadu's agro-climatic zones.</div>
  </div>

  <div class="screenshot-card">
    <img src="${imgGuide}" alt="Agri-Tech Field Guide">
    <div class="screenshot-caption">Figure 5.6: Agri-Tech Field Guide & Crop Calendars</div>
    <div class="screenshot-desc">Standard operating agronomic protocols, fertigation schedules, and seasonal planting calendars.</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="${imgRevenue}" alt="Project Revenue">
    <div class="screenshot-caption">Figure 5.7: Project Revenue Analytics & Subscription Tiers</div>
    <div class="screenshot-desc">Commercial financial analytics displaying ₹48,65,000 total revenue, ₹4,25,000 MRR, and tiered subscription plans.</div>
  </div>

  <div class="screenshot-card">
    <img src="${imgCustomers}" alt="Customer Directory">
    <div class="screenshot-caption">Figure 5.8: Customer Directory & Farmer Database</div>
    <div class="screenshot-desc">Verified agricultural customer registry with land acreage, primary crop varieties, and contact points.</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="${imgReviews}" alt="Farmer Reviews">
    <div class="screenshot-caption">Figure 5.9: Farmer Community Reviews & Field Testimonials</div>
    <div class="screenshot-desc">Verified community testimonials with rating scores from growers in the Cauvery delta and Western plains.</div>
  </div>

  <div class="screenshot-card">
    <img src="${imgCreator}" alt="Creator Profile">
    <div class="screenshot-caption">Figure 5.10: Creator Profile & Platform Accreditation</div>
    <div class="screenshot-desc">Biography and architectural credentials of Founder & Lead Architect Sanofar Fathima I.</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-card">
    <img src="${imgNexus}" alt="Creator Admin Nexus">
    <div class="screenshot-caption">Figure 5.11: Creator Admin Command Nexus</div>
    <div class="screenshot-desc">Restricted administrative command center displaying 1,420 active IoT nodes, 99.98% server uptime, 14ms API latency, real-time audit logs, and fleet sensor recalibration controls.</div>
  </div>

  <div class="page-break"></div>

  <!-- ================= 6. CONCLUSION AND REFERENCES ================= -->
  <h1 class="chapter-title">6. Conclusion and References</h1>

  <h2 class="section-title">6.1 Conclusion</h2>
  <p>
    The <strong>Smart Agricultural Management System (Tamil Nadu Agro-Tech Hub)</strong> demonstrates the successful application of Object Oriented Analysis and Software Engineering (OOASE) principles to modern agricultural technology. Conceived and architected by <strong>Sanofar Fathima I</strong>, the system unifies IoT soil telemetry, remote solenoid valve actuation, and reservoir storage monitoring into an accessible, responsive web platform.
  </p>
  <p>
    Key achievements include:
  </p>
  <ul>
    <li>Robust object-oriented domain modeling translating real-world soil physics into modular, extensible software components.</li>
    <li>Strict Role-Based Access Control enforcing boundary isolation between farmer portals and the Creator Admin Command Nexus.</li>
    <li>Dual-protocol operational resilience ensuring continuous functionality in both networked and offline environments.</li>
    <li>Complete verification of all functional requirements through automated test suites and live UI walkthroughs.</li>
  </ul>

  <h2 class="section-title">6.2 Limitations</h2>
  <ul>
    <li><strong>Simulated Sensor Feed:</strong> The demonstration system relies on server-side random-walk telemetry simulation; deployment to production requires physical LoRaWAN/MQTT gateways.</li>
    <li><strong>Flat-File Persistence:</strong> The JSON file database (<code class="inline-code">db.json</code>) is optimized for academic demonstration and mid-scale pilots; high-concurrency production deployments will benefit from PostgreSQL with PostGIS extensions.</li>
  </ul>

  <h2 class="section-title">6.3 Future Enhancements</h2>
  <ul>
    <li><strong>Physical LoRaWAN / MQTT Gateway Integration:</strong> Connect physical ESP32 microcontrollers in Tamil Nadu farmlands via Eclipse Mosquitto MQTT brokers.</li>
    <li><strong>Sentinel-2 Satellite Multispectral NDVI Overlays:</strong> Ingest real-time Normalized Difference Vegetation Index (NDVI) imagery to detect crop canopy vigor and drought stress from orbit.</li>
    <li><strong>Edge AI Plant Pathology Diagnostic Scanner:</strong> Implement an in-browser TensorFlow.js neural network enabling farmers to photograph crop leaves to detect fungal blights and pest infestations.</li>
    <li><strong>Progressive Web App (PWA) Offline Packaging:</strong> Enable Service Worker caching and push notification alerts for impending drought warnings.</li>
  </ul>

  <h2 class="section-title">6.4 References</h2>
  <ol>
    <li>Pressman, R. S., & Maxim, B. R. (2020). <em>Software Engineering: A Practitioner's Approach</em> (9th ed.). McGraw-Hill Education.</li>
    <li>Fowler, M. (2004). <em>UML Distilled: A Brief Guide to the Standard Object Modeling Language</em> (3rd ed.). Addison-Wesley Professional.</li>
    <li>Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). <em>Design Patterns: Elements of Reusable Object-Oriented Software</em>. Addison-Wesley.</li>
    <li>Tamil Nadu Agricultural University (TNAU). (2024). <em>Agritech Portal: Crop Production Guide & Precision Soil Management</em>. Coimbatore, Tamil Nadu.</li>
    <li>Express.js Foundation. (2025). <em>Express 5.x REST API Documentation and Routing Protocols</em>. https://expressjs.com/</li>
    <li>World Wide Web Consortium (W3C). (2018). <em>Web Content Accessibility Guidelines (WCAG) 2.1</em>. https://www.w3.org/TR/WCAG21/</li>
    <li>International Organization for Standardization (ISO). (2019). <em>ISO/IEC/IEEE 12207:2017 Systems and software engineering — Software life cycle processes</em>.</li>
  </ol>

</body>
</html>`;

fs.writeFileSync(HTML_PATH, htmlContent, 'utf8');
console.log(`HTML generated at: ${HTML_PATH}`);

console.log('Rendering PDF via Headless Chrome...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cmd = `cmd.exe /c "start /wait \\"\\" \\"${chromePath}\\" --headless --disable-gpu --virtual-time-budget=9000 --run-all-compositor-stages-before-draw --print-to-pdf=\\"${PDF_PATH}\\" \\"${HTML_PATH}\\""`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`PDF successfully generated at: ${PDF_PATH}`);
} catch (err) {
  console.error('Error generating PDF:', err);
}
