// Extract HTML from Worker index.js and inject deploy-time placeholders
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf-8');

// Find the template literal: const HTML = `...`
const start = src.indexOf('const HTML = `');
if (start === -1) { console.error('Template literal not found'); process.exit(1); }

const contentStart = start + 'const HTML = `'.length;
// The closing backtick is the last backtick before the file ends
const end = src.lastIndexOf('`;');
if (end === -1) { console.error('Closing template not found'); process.exit(1); }

let html = src.slice(contentStart, end);

// Replace placeholders — git commit info for GitHub Pages, Cloudflare uses runtime headers
function getVersion() {
  try { return 'gp-' + execSync('git log -1 --format=%cd --date=format:%Y%m%d').toString().trim(); }
  catch { return 'dev'; }
}
function getTime() {
  try { return execSync('git log -1 --format=%cI').toString().trim(); }
  catch { return new Date().toISOString(); }
}

const buildVersion = getVersion();
const deployTime = getTime();

html = html.replace(/__BUILD_VERSION__/g, buildVersion);
html = html.replace(/__DEPLOY_TIME__/g, deployTime);

const outDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);

console.log(`Built dist/index.html — version: ${buildVersion}, deploy: ${deployTime}`);
