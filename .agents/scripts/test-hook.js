const fs = require('fs');
const path = require('path');

let inputData = '';

process.stdin.on('data', chunk => {
  inputData += chunk;
  try {
    const payload = JSON.parse(inputData.trim());
    processPayload(payload);
  } catch (e) {
    // Wait for more data
  }
});

process.stdin.on('end', () => {
  if (inputData.trim()) {
    try {
      const payload = JSON.parse(inputData.trim());
      processPayload(payload);
    } catch (e) {}
  }
});

function processPayload(payload) {
  try {
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logMessage = `[${new Date().toISOString()}] PreToolUse Hook Triggered!\n` +
      `Tool Name: ${payload.toolCall?.name || 'N/A'}\n` +
      `CommandLine / Args: ${JSON.stringify(payload.toolCall?.args || {})}\n` +
      `Conversation ID: ${payload.conversationId || 'N/A'}\n` +
      `--------------------------------------------------\n`;

    fs.appendFileSync(path.join(logDir, 'hook-events.log'), logMessage);
  } catch (err) {}

  const response = {
    decision: "allow",
    reason: "Antigravity Test Hook validated and allowed execution."
  };
  console.log(JSON.stringify(response));
  process.exit(0);
}
