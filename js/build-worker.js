// Inject deploy-time placeholders into index.js for Cloudflare Worker deployment
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf-8');

const now = new Date();
const sh = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
const pad = n => String(n).padStart(2, '0');
const deployTime = `${sh.getFullYear()}-${pad(sh.getMonth() + 1)}-${pad(sh.getDate())}T${pad(sh.getHours())}:${pad(sh.getMinutes())}:${pad(sh.getSeconds())}+08:00`;
const buildVersion = `cf-${sh.getFullYear()}${pad(sh.getMonth() + 1)}${pad(sh.getDate())}`;

const out = src
  .replace(/__CF_DEPLOY_TIME__/g, deployTime)
  .replace(/__CF_BUILD_VERSION__/g, buildVersion);

const outDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'worker.js'), out);

console.log(`Built dist/worker.js — version: ${buildVersion}, deploy: ${deployTime}`);
