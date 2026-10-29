const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const edge = edgePaths.find(p => fs.existsSync(p));

const baseDir = 'c:\\Users\\yusuf\\OneDrive\\Desktop\\agriculture';
const html = fs.readFileSync(path.join(baseDir, 'report_exact25.html'), 'utf8');

const pages = html.split(/<div class="page" id="page-(\d+)">/);

const umlList = [
  { page: 8, out: 'fig_3_1_use_case.png', title: 'Use Case Diagram' },
  { page: 9, out: 'fig_3_2_class.png', title: 'Class Diagram' },
  { page: 10, out: 'fig_3_3_sequence.png', title: 'Sequence Diagram' },
  { page: 11, out: 'fig_3_4_activity.png', title: 'Activity Diagram' },
  { page: 12, out: 'fig_3_5_state_chart.png', title: 'State Chart Diagram' },
  { page: 13, out: 'fig_3_6_component.png', title: 'Component Diagram' },
  { page: 14, out: 'fig_3_7_deployment.png', title: 'Deployment Diagram' }
];

umlList.forEach(item => {
  for (let i = 1; i < pages.length; i += 2) {
    if (parseInt(pages[i]) === item.page) {
      const pageHtml = pages[i+1];
      const svgMatch = pageHtml.match(/<svg[\s\S]*?<\/svg>/);
      if (svgMatch) {
        const svg = svgMatch[0];
        const wrapper = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0;
    padding: 20px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
  }
  svg {
    max-width: 900px;
    height: auto;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 10px;
  }
  text {
    font-family: Arial, sans-serif;
  }
</style>
</head>
<body>
  ${svg}
</body>
</html>`;
        const tempPath = path.join(baseDir, `temp_uml_${item.page}.html`);
        fs.writeFileSync(tempPath, wrapper);
        const outPath = path.join(baseDir, item.out);
        const cmd = `"${edge}" --headless --disable-gpu --window-size=1000,700 --screenshot="${outPath}" "file:///${tempPath.replace(/\\/g, '/')}"`;
        console.log(`Rendering ${item.out}...`);
        try {
          execSync(cmd, { stdio: 'ignore' });
          console.log(`Rendered ${item.out}: ${fs.statSync(outPath).size} bytes`);
        } catch (e) {
          console.error(`Error rendering ${item.out}:`, e.message);
        }
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
});

console.log('All 7 UML diagrams rendered to PNG!');

