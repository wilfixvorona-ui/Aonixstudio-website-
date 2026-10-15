// Local dev server that behaves like Vercel for this site.
//
// VS Code Live Server doesn't read vercel.json, so the /ua/... and
// /en/... URLs (rewritten to index.html / privacy.html on Vercel)
// 404 there — e.g. Privacy Policy, or F5 on /en/. This applies the
// same "rewrites" from vercel.json, so local == production.
//
// Run:   node dev-server.js        → http://localhost:3000
// (no npm install needed — plain Node)

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

// "/(ua|en)/(.*)" → RegExp; first matching rule wins, like on Vercel.
function loadRewrites() {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    return (config.rewrites || []).map((rule) => ({
      re: new RegExp('^' + rule.source + '$'),
      destination: rule.destination,
    }));
  } catch (err) {
    console.warn('vercel.json not readable, serving files only:', err.message);
    return [];
  }
}

function fileFor(urlPath) {
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) return null; // no ../ escapes
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  if (fs.existsSync(path.join(file, 'index.html'))) return path.join(file, 'index.html');
  return null;
}

http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (err) {
    urlPath = '/';
  }

  // Real files first (Vercel does the same), then the rewrites.
  let file = fileFor(urlPath);
  if (!file) {
    const rule = loadRewrites().find((r) => r.re.test(urlPath));
    if (rule) file = fileFor(rule.destination);
  }

  const status = file ? 200 : 404;
  if (!file) file = path.join(ROOT, '404.html');

  res.writeHead(status, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`Aonix dev server → http://localhost:${PORT}`);
});
