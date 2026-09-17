const ALLOW = new Set([
  'api.geckoterminal.com',
  'api.gopluslabs.io',
  'frontend-api.pump.fun',
  'frontend-api-v3.pump.fun'
]);

export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !ALLOW.has(parsed.hostname)) {
      return res.status(403).json({ error: 'Host not allowed', host: parsed.hostname });
    }

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'TRENCHH/1.0' }
    });

    const body = await response.text();
    res.status(response.status)
       .setHeader('Content-Type', 'application/json')
       .send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
