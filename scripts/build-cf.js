// Inject deploy-time placeholders into index.js for Cloudflare Worker deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf-8');

const deployTime = new Date().toISOString();
const buildVersion = 'cf-' + deployTime.slice(0, 10).replace(/-/g, '');

const out = src
  .replace(/__CF_DEPLOY_TIME__/g, deployTime)
  .replace(/__CF_BUILD_VERSION__/g, buildVersion);

const outDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'worker.js'), out);

console.log(`Built dist/worker.js — version: ${buildVersion}, deploy: ${deployTime}`);
