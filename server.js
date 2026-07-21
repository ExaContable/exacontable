const path = require("path");
const Module = require("module");

// Standalone JavaScript dependencies are bundled under vendor so CloudLinux
// can keep ownership of the application-root node_modules symlink.
process.env.NODE_PATH = [
  path.join(__dirname, "vendor", "node_modules"),
  process.env.NODE_PATH,
].filter(Boolean).join(path.delimiter);
Module._initPaths();

require("./init-db").initializeProductionDatabase();

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
// Evitamos parseInt estricto por si Passenger inyecta un socket/pipe en PORT
const port = process.env.PORT || 3000;
const nextPort = typeof port === 'string' && isNaN(Number(port)) ? 3000 : Number(port);

const app = next({ dev, hostname, port: nextPort });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", req.url, err);
        res.statusCode = 500;
        res.end("Internal server error");
      }
    }).listen(port, () => {
      // En cPanel Passenger no se recomienda pasar el hostname a listen()
      console.log(`> Ready on port ${port}`);
      console.log(`> Environment: ${dev ? "development" : "production"}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
