const ALLOW = ['api.geckoterminal.com', 'api.gopluslabs.io'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'missing url param' });
    let u;
    try { u = new URL(url); } catch (e) { return res.status(400).json({ error: 'bad url' }); }
    if (u.protocol !== 'https:' || !ALLOW.includes(u.hostname)) {
      return res.status(400).json({ error: 'host not allowed: ' + u.hostname });
    }
    const r = await fetch(u.href, { headers: { accept: 'application/json' } });
    const body = await r.text();
    res.status(r.status).setHeader('Content-Type', 'application/json').send(body);
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
}
