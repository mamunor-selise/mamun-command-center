const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env.local if present to get GH_TOKEN if configured
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*["']?(.*?)["']?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

const title = process.argv[2] || 'Automated PR';
const body = process.argv[3] || '';
const base = process.argv[4] || 'main';
const head = process.argv[5] || execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const ghPath = fs.existsSync('C:\\Program Files\\GitHub CLI\\gh.exe')
  ? '"C:\\Program Files\\GitHub CLI\\gh.exe"'
  : 'gh';

try {
  const env = { ...process.env };
  const output = execSync(`${ghPath} pr create --title "${title}" --body "${body.replace(/"/g, '\\"')}" --base "${base}" --head "${head}"`, { env }).toString();
  console.log(output);
} catch (err) {
  const errorMsg = err.stdout ? err.stdout.toString() : err.stderr ? err.stderr.toString() : err.message;
  console.error('PR Creation Result:', errorMsg);
  process.exit(1);
}
