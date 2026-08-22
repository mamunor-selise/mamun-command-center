import http from 'http';
import url from 'url';
import signupHandler from './api/auth/signup.js';
import signinHandler from './api/auth/signin.js';
import meHandler from './api/auth/me.js';
import logoutHandler from './api/auth/logout.js';
import chatHandler from './api/chat.js';
import cvHandler from './api/cv.js';
import vaultHandler from './api/vault.js';

import aiTrendsHandler from './api/ai-trends.js';
import queryBuilderHandler from './api/query-builder.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Parse Body JSON
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    if (body) {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
    } else {
      req.body = {};
    }

    const pathname = url.parse(req.url, true).pathname;
    console.log(`[API Server] ${req.method} ${pathname}`);

    // Mock Express/Vercel res.status().json()
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };

    try {
      if (pathname === '/api/auth/signup') {
        await signupHandler(req, res);
      } else if (pathname === '/api/auth/signin') {
        await signinHandler(req, res);
      } else if (pathname === '/api/auth/me') {
        await meHandler(req, res);
      } else if (pathname === '/api/auth/logout') {
        await logoutHandler(req, res);
      } else if (pathname === '/api/chat') {
        await chatHandler(req, res);
      } else if (pathname === '/api/cv') {
        await cvHandler(req, res);
      } else if (pathname === '/api/vault') {
        await vaultHandler(req, res);
      } else if (pathname === '/api/ai-trends') {
        await aiTrendsHandler(req, res);
      } else if (pathname === '/api/query-builder') {
        await queryBuilderHandler(req, res);
      } else {
        res.status(404).json({ error: { message: `Route ${pathname} not found on API server.` } });
      }
    } catch (err) {
      console.error(`Error handling ${pathname}:`, err);
      if (!res.writableEnded) {
        res.status(500).json({ error: { message: err.message || 'Internal Server Error' } });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Next.js API Server listening on http://localhost:${PORT}`);
  console.log(`🍃 Connected to MongoDB Atlas cluster0.e6whmmx.mongodb.net`);
});
