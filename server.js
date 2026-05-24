/**
 * VEXTONY CORE INFRASTRUCTURE: PRODUCTION CUSTOM NODE.JS WEB SERVER
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: LOCAL PROXY NETWORK GATEWAY]
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize the supreme Next.js application framework core engine natively
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Direct instructions enforcing Master Asif's dynamic unbounded constraints during local execution
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('[VEXTONY_SERVER_ERROR]: Ingress pipeline routing exception detected.', err);
      res.statusCode = 500;
      res.end('Internal Server Invariant Violation Shard Crashed.');
    }
  })
  .once('error', (err) => {
    console.error('[VEXTONY_CORE_SERVER_FATAL]: Port binding allocation blocked.', err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`[VEXTONY_SERVER_ONLINE]: Sovereign multi-tenant grid operational on http://${hostname}:${port}`);
  });
});
