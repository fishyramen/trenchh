const ALLOW = ['api.geckoterminal.com', 'api.gopluslabs.io', 'frontend-api.pump.fun', 'frontend-api-v3.pump.fun'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'missing url' });
    const u = new URL(url);
    if (u.protocol !== 'https:' || !ALLOW.includes(u.hostname)) return res.status(400).json({ error: 'host not allowed' });
    const r = await fetch(u.href, { headers: { accept: 'application/json' } });
    const body = await r.text();
    res.status(r.status).setHeader('Content-Type', 'application/json').send(body);
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
}
