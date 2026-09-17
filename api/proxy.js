const ALLOW = new Set([
  'api.geckoterminal.com',
  'api.gopluslabs.io',
  'frontend-api.pump.fun',
  'frontend-api-v3.pump.fun'
]);

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'missing url param' });
  }

  let parsed;
  try { parsed = new URL(url); } catch {
    return res.status(400).json({ error: 'invalid url' });
  }

  if (parsed.protocol !== 'https:' || !ALLOW.has(parsed.hostname)) {
    return res.status(403).json({ error: 'host not allowed: ' + parsed.hostname });
  }

  try {
    const upstream = await fetch(parsed.href, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'TRENCHH/1.0' },
      signal: AbortSignal.timeout(12000)
    });
    const body = await upstream.text();
    res.status(upstream.status)
       .setHeader('Content-Type', 'application/json')
       .setHeader('Cache-Control', 'no-store')
       .send(body);
  } catch (e) {
    res.status(502).json({ error: e.message || 'upstream failed' });
  }
}
