/**
 * VEXTONY ENGINE: GLOBAL SERVER INFRASTRUCTURE CONTEXT
 * MODULE_ID: SYSTEM_SERVER_CORE
 * SECURITY_PRIVILEGE: ROOT_MAIN_FRAME
 * INTEGRITY_STATUS: ARMED
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      
      // Security headers for global multitenant traffic
      res.setHeader("X-Powered-By", "VextonyOmnipotentEngine");
      res.setHeader("X-Server-Instance-Armed", "True");

      handle(req, res, parsedUrl);
    }).listen(PORT, (err) => {
      if (err) {
        process.exit(1);
      }
      console.log(`[VEXTONY_SYSTEM_LIVE] ROOT OPERATIONAL ON PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    process.exit(1);
  });
