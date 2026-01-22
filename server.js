const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3001;
const hostname = "0.0.0.0";

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`> Next.js app running on http://${hostname}:${port}`);
  });
});
