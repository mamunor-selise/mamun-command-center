export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-Api-Key, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  const serverKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
  const clientKey = req.headers['x-client-api-key'] || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
  const apiKey = clientKey || serverKey;

  if (!apiKey) {
    return res.status(401).json({
      error: {
        message: 'OpenRouter API Key missing. Please set OPEN_ROUTER_API_KEY in Vercel Environment Variables.'
      }
    });
  }

  const { model, messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: { message: 'Invalid or missing messages array.' } });
  }

  try {
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mamun-command-center.vercel.app',
        'X-Title': 'SecureOps Center'
      },
      body: JSON.stringify({
        model: model || 'deepseek/deepseek-chat',
        messages
      })
    });

    const data = await openRouterResponse.json();
    return res.status(openRouterResponse.status).json(data);
  } catch (error) {
    console.error('Vercel API OpenRouter Error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Internal Server Error forwarding request to OpenRouter.' }
    });
  }
}
