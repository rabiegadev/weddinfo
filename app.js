const http = require("node:http");
const next = require("next");

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const dev = false;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = http.createServer((req, res) => handle(req, res));
    server.listen(port, hostname, () => {
      console.log(`Weddinfo started on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Weddinfo app", error);
    process.exit(1);
  });
