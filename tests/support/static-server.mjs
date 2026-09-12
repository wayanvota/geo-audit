import http from "node:http";
import fsp from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:5174");
  const relative = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    return response.end("Forbidden");
  }
  try {
    const body = await fsp.readFile(file);
    response.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    return response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    return response.end("Not found");
  }
});

server.listen(5174, "127.0.0.1", () => {
  console.log("GEO Audit test server listening on 127.0.0.1:5174");
});
