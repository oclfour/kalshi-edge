const KALSHI_BASE = 'https://api.elections.kalshi.com/trade-api/v2';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.KALSHI_API_KEY;
  const { path, ...queryParams } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const qs = new URLSearchParams(queryParams).toString();
  const url = `${KALSHI_BASE}/${path}${qs ? '?' + qs : ''}`;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    const response = await fetch(url, { method: req.method, headers });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
