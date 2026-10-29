# 🌾 Smart Agricultural Management System

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-brightgreen?logo=vercel&style=for-the-badge)](https://smart-agri-frontend-rho.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Render-Live-blue?logo=render&style=for-the-badge)](https://smart-agri-mc3f.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Smart--Agri-black?logo=github&style=for-the-badge)](https://github.com/sanofar-git/Smart-Agri)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?logo=node.js&style=for-the-badge)](https://nodejs.org/)

A next-generation **Smart Agricultural Management and Precision Farmland Telemetry System** designed for Tamil Nadu's agro-climatic zones. Built with real-time IoT soil sensors, automated irrigation control, AI diagnostic health indexing, and comprehensive land telemetry analytics.

---

## 🌐 Live Application Links

- 🚀 **Frontend Live (Vercel):** [https://smart-agri-frontend-rho.vercel.app/](https://smart-agri-frontend-rho.vercel.app/)
- ⚙️ **Backend & Telemetry API (Render):** [https://smart-agri-mc3f.onrender.com](https://smart-agri-mc3f.onrender.com)
- 📂 **GitHub Repository:** [https://github.com/sanofar-git/Smart-Agri](https://github.com/sanofar-git/Smart-Agri.git)

---

## 👨‍💻 Creator & Lead Architect

- **Architect & Lead Developer:** **Sanofar Fathima I**
- **Domain:** Precision Agro-Informatics, IoT Soil Telemetry & Smart Farmland Governance
- **Email:** `sanofarfathima2006@gmail.com`

> *"Empowering Tamil Nadu's farming heritage through real-time soil intelligence, water stewardship, and sustainable agro-tech."*

---

## 🌿 Key Features

1. **Live Land Telemetry & Sensor Monitoring:**
   - Real-time sensor metrics for Soil Moisture (%), pH level, Nitrogen (N), Phosphorus (P), Potassium (K), Soil Temperature (°C), and Humidity (%).
   - Dynamic simulation engine reflecting realistic diurnal field fluctuations.

2. **Automated Irrigation Control:**
   - Smart solenoid valve automation that triggers irrigation cycles based on critical soil moisture thresholds.
   - Solar pump grid monitoring and water table depth measurement.

3. **Geospatial Tamil Nadu Farmland Reports:**
   - Comprehensive regional telemetry covering Cauvery Delta Paddy (Thanjavur), Coconut Orchards (Pollachi), Ooty/Kotagiri Tea Estates (Nilgiris), Panruti Cashew Groves (Cuddalore), and Madurai Jasmine Belts.

4. **AI Diagnostic Advisory:**
   - Automated crop health scoring (0-100) and risk level indexing.
   - Tailored nutrient deficiency advisory and seasonal weather forecast alerts.

5. **Multi-Role Gate & Administration:**
   - Dedicated views for Registered Farmers and Agricultural Administrators.
   - Master telemetry calibration and live system audit logging.

6. **Full-Stack Cloud Hybrid Architecture:**
   - Ultra-fast Edge delivery for UI on **Vercel**.
   - Persistent Node.js REST API service with JSON-based schema persistence on **Render**.

7. **Academic OOASE Engineering Report:**
   - Includes a complete **25-page Object Oriented Analysis and Software Engineering (OOASE)** project report (`OOASE_Project_Report_Smart_Agriculture.pdf`) featuring 7 UML diagrams, requirements, test suites, and system architecture.

---

## 📁 Project Directory Structure

```text
agriculture/
|-- backend/                          # Node.js & Express REST API Server
|   |-- data/
|   |   `-- db.json                   # JSON Persistence Store (Users, Farmland Telemetry)
|   |-- server.js                     # Express API Server & Telemetry Sensor Simulator
|   |-- package.json                  # Backend dependencies
|   `-- package-lock.json
|-- frontend/                         # Responsive Web Client (Single Page App)
|   |-- assets/
|   |   `-- images/                   # High-res agro-climatic terrain imagery
|   |-- css/
|   |   `-- style.css                 # Obsidian Black, Stark White & Cobalt Blue Design System
|   |-- js/
|   |   |-- api.js                    # Resilient API Client with offline seed failover
|   |   `-- app.js                    # UI Event Controllers, Dashboard Visualizations
|   |-- index.html                    # Main Single Page Application entry point
|   `-- vercel.json                   # Frontend rewrite configuration for Vercel
|-- .gitignore                        # Git ignore rules for node_modules and system files
|-- package.json                      # Root configuration and multi-environment dev scripts
|-- package-lock.json
|-- vercel.json                       # Root Vercel deployment routes & Render API proxy
|-- OOASE_Project_Report_Smart_Agriculture.pdf  # 25-Page Academic Project Report
`-- README.md                         # Comprehensive Project Documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, Modern CSS3, Vanilla ES6+ JavaScript, Responsive Grid/Flexbox |
| **Design System** | Obsidian Black (`#0a0a0a`), Stark White (`#f8fafc`), Cobalt Blue (`#1e40af`) |
| **Typography** | *Plus Jakarta Sans* (Interface) & *JetBrains Mono* (Telemetry Data) |
| **Backend** | Node.js (v20+), Express.js 5 REST Framework |
| **Data Engine** | File-based JSON Persistence Engine with thread-safe atomic file I/O |
| **Hosting & CDN**| **Vercel** (Global Edge CDN) & **Render** (Containerized Node.js Web Service) |
| **Documentation**| StarUML, ArgoUML, MS Word, KaTeX, Markdown |

---

## 🚀 Local Setup & Installation

To run this project locally on your machine:

### 1. Clone the repository:
```bash
git clone https://github.com/sanofar-git/Smart-Agri.git
cd Smart-Agri
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start the local server:
```bash
npm start
```

### 4. Access the web app:
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 📄 Academic Project Report

The repository includes the full **25-Page OOASE Project Report** in PDF format:
- **File:** [`OOASE_Project_Report_Smart_Agriculture.pdf`](./OOASE_Project_Report_Smart_Agriculture.pdf)
- **Contents:**
  - 1. Introduction (Overview, Problem Statement, Objectives)
  - 2. Requirement Analysis (Roles, Functional/Non-functional, Hardware/Software, Data, Business Rules)
  - 3. 7 Standard UML Diagrams (Use Case, Class, Sequence, Activity, State Charts, Component, Deployment)
  - 4. Implementation Details & Code Highlights
  - 5. Application User Interface Screenshots
  - 6. Conclusion, Future Scope & Academic References

---

## 📜 License & Acknowledgments

Developed by **Sanofar Fathima I** for academic, agricultural, and open-source innovation. Free to use and distribute under the MIT License.
