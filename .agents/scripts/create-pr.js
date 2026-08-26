import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envPath = path.resolve(__dirname, '../../.env.local');
let token = process.env.GITHUB_TOKEN;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GITHUB_TOKEN=["']?([^"'\s]+)["']?/);
  if (match) {
    token = match[1];
  }
}

if (!token) {
  console.error('Error: GITHUB_TOKEN not found in environment or .env.local.');
  console.error('Please configure GITHUB_TOKEN="ghp_xxx" in .env.local to automate PR creation.');
  process.exit(1);
}

// Get repo origin URL
let originUrl = '';
try {
  originUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
} catch (e) {
  console.error('Error: Failed to get remote origin URL.');
  process.exit(1);
}

// Parse owner and repo from URL
const repoRegex = /github\.com[:\/]([^\/]+)\/([^\.]+)(?:\.git)?/;
const repoMatch = originUrl.match(repoRegex);
if (!repoMatch) {
  console.error(`Error: Could not parse repository owner and name from ${originUrl}`);
  process.exit(1);
}
const [, owner, repoName] = repoMatch;

// Get current branch
let branch = '';
try {
  branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
} catch (e) {
  console.error('Error: Failed to get current branch.');
  process.exit(1);
}

// Parse ticket key from branch
const ticketRegex = /(?:sprint-\d+\/)?([A-Z]+-\d+)/i;
const ticketMatch = branch.match(ticketRegex);
if (!ticketMatch) {
  console.error(`Error: Could not parse ticket key from branch name ${branch}`);
  process.exit(1);
}
const ticketKey = ticketMatch[1].toUpperCase();

// Read handoff file
const handoffPath = path.resolve(__dirname, `../plan/${ticketKey}.handoff.md`);
if (!fs.existsSync(handoffPath)) {
  console.error(`Error: Handoff file not found at ${handoffPath}. Please run /handoff first.`);
  process.exit(1);
}
const handoffContent = fs.readFileSync(handoffPath, 'utf8');

// Title of the PR
const titleMatch = handoffContent.match(/^##\s*(.+)$/m);
const title = titleMatch ? titleMatch[1].trim() : `${ticketKey}: Pull Request`;

// Body of the PR
const prBody = {
  title: title,
  head: branch,
  base: 'main',
  body: handoffContent
};

// Check if PR already exists
async function checkPR() {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls?head=${owner}:${branch}&state=open`, {
      headers: {

        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Antigravity-IDE-Agent'
      }
    });
    const pulls = await res.json();
    if (res.ok && Array.isArray(pulls) && pulls.length > 0) {
      return pulls[0].html_url;
    }
  } catch (err) {
    console.warn('Warning: Failed to check for existing PR:', err.message);
  }
  return null;
}

async function createPR() {
  const existingPrUrl = await checkPR();
  if (existingPrUrl) {
    console.log(`EXISTS:${existingPrUrl}`);
    process.exit(0);
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'Antigravity-IDE-Agent'
      },
      body: JSON.stringify(prBody)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('GitHub API Error:', data.message || data);
      process.exit(1);
    }

    console.log(`SUCCESS:${data.html_url}`);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
}

createPR();
