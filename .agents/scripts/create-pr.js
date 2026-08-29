const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env.local if present
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

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const title = process.argv[2] || 'Automated PR';
const body = process.argv[3] || '';
const base = process.argv[4] || 'main';
const head = process.argv[5] || execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// Infer owner and repo from git remote
function getRepoInfo() {
  try {
    const remoteUrl = execSync('git remote get-url origin').toString().trim();
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?/) || remoteUrl.match(/github-[^:]+:([^/]+)\/([^/.]+)(?:\.git)?/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  } catch (e) {}
  return { owner: 'mamunor-selise', repo: 'mamun-command-center' };
}

async function main() {
  const { owner, repo } = getRepoInfo();

  if (token) {
    console.log(`Creating PR via GitHub REST API (${owner}/${repo})...`);
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Antigravity-Agent'
        },
        body: JSON.stringify({ title, head, base, body })
      });

      const resData = await response.json();
      if (response.ok && resData.html_url) {
        console.log(`PR Created Successfully: ${resData.html_url}`);
        return;
      } else {
        console.error('GitHub API PR Error:', resData.message || JSON.stringify(resData));
        if (resData.errors) {
          console.error('Details:', resData.errors);
        }
      }
    } catch (err) {
      console.error('Fetch Error:', err.message);
    }
  }

  // Fallback to gh CLI if REST API was not successful or no token
  console.log('Falling back to gh CLI...');
  const ghPath = fs.existsSync('C:\\Program Files\\GitHub CLI\\gh.exe')
    ? '"C:\\Program Files\\GitHub CLI\\gh.exe"'
    : 'gh';

  try {
    const env = { ...process.env };
    if (token) env.GH_TOKEN = token;
    const cmd = `${ghPath} pr create --title "${title}" --body "${body.replace(/"/g, '\\"')}" --base "${base}" --head "${head}"`;
    const output = execSync(cmd, { env }).toString();
    console.log(output);
  } catch (err) {
    const errorMsg = err.stdout ? err.stdout.toString() : err.stderr ? err.stderr.toString() : err.message;
    console.error('PR Creation Result:', errorMsg);
    process.exit(1);
  }
}

main();
