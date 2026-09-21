import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = Number(process.env.PORT ?? 8080);

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2",
};

function resolvePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  } catch {
    return null;
  }
  if (decoded === "/") return join(ROOT, "index.html");
  const relative = normalize(decoded).replace(/^[/\\]+/, "");
  if (relative.startsWith("..") || relative.includes(`..${sep}`)) return null;
  return join(ROOT, relative);
}

const server = http.createServer(async (req, res) => {
  if ((req.method ?? "GET").toUpperCase() !== "GET") {
    res.writeHead(405, { allow: "GET" });
    res.end("Method Not Allowed");
    return;
  }

  const file = resolvePath(req.url ?? "/");
  if (!file) {
    res.writeHead(400);
    res.end("Bad Request");
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`ElectronHub → http://${HOST}:${PORT}`);
});
