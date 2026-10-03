const fs = require('fs');
const path = require('path');

const resultsPath = path.join(process.cwd(), 'playwright-report', 'results.json');
const summaryOutputPath = process.env.GITHUB_STEP_SUMMARY;

if (!fs.existsSync(resultsPath)) {
  console.log('No results.json found.');
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;
  let totalDuration = 0;

  const testDetails = [];

  function processSuite(suite) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          totalTests++;
          const lastResult = test.results[test.results.length - 1];
          const durationSec = (lastResult?.duration ? lastResult.duration / 1000 : 0).toFixed(1);
          totalDuration += lastResult?.duration || 0;

          let statusSymbol = '🟢';
          let statusText = 'PASS';

          if (test.status === 'expected') {
            passed++;
          } else if (test.status === 'flaky') {
            flaky++;
            statusSymbol = '🟡';
            statusText = 'FLAKY';
          } else if (test.status === 'skipped') {
            skipped++;
            statusSymbol = '⚪';
            statusText = 'SKIPPED';
          } else {
            failed++;
            statusSymbol = '🔴';
            statusText = 'FAIL';
          }

          testDetails.push({
            file: spec.file ? path.relative(process.cwd(), spec.file) : 'E2E',
            title: spec.title,
            statusSymbol,
            statusText,
            durationSec,
            error: lastResult?.error?.message ? lastResult.error.message.split('\n')[0] : ''
          });
        }
      }
    }
    if (suite.suites) {
      suite.suites.forEach(processSuite);
    }
  }

  if (data.suites) {
    data.suites.forEach(processSuite);
  }

  const overallStatus = failed > 0 ? '❌ FAILED' : '✅ PASSED';
  const totalDurationSec = (totalDuration / 1000).toFixed(1);

  const markdown = `## 🎭 Playwright Smart Automation Test Report

| Overall Status | Total Tests | Passed 🟢 | Failed 🔴 | Flaky 🟡 | Skipped ⚪ | Total Duration ⏱️ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **${overallStatus}** | **${totalTests}** | **${passed}** | **${failed}** | **${flaky}** | **${skipped}** | **${totalDurationSec}s** |

### 📋 Test Case Execution Details

| Status | Test Spec | Suite / Description | Duration | Error Summary |
|:---:|:---|:---|:---:|:---|
${testDetails.map(t => `| ${t.statusSymbol} ${t.statusText} | \`${t.file}\` | ${t.title} | ${t.durationSec}s | ${t.error ? `\`${t.error.replace(/\|/g, '\\|')}\`` : '-'} |`).join('\n')}

> *Smart E2E Report generated automatically by Playwright CI*
`;

  console.log(markdown);

  if (summaryOutputPath) {
    fs.appendFileSync(summaryOutputPath, markdown);
    console.log('Successfully appended smart report to GITHUB_STEP_SUMMARY');
  }
} catch (err) {
  console.error('Error generating Playwright summary:', err);
}
