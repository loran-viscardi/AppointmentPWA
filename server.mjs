import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png'};
const port = Number(process.env.PORT || 4173);
http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    let name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (name.endsWith('/')) name += 'index.html';
    const file = path.resolve(root,'.'+name);
    if (!file.startsWith(root+path.sep)) throw new Error();
    const bytes = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404); res.end('Não encontrado'); }
}).listen(port,'127.0.0.1',()=>console.log(`ApontamentoPWA: http://localhost:${port}`));
