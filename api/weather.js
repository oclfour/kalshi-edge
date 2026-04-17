export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const cities = {
    NY:  { lat: 40.71, lon: -74.01, tz: 'America/New_York' },
    LA:  { lat: 34.05, lon: -118.24, tz: 'America/Los_Angeles' },
    CHI: { lat: 41.88, lon: -87.63,  tz: 'America/Chicago' },
    DAL: { lat: 32.78, lon: -96.80,  tz: 'America/Chicago' },
    DEN: { lat: 39.74, lon: -104.98, tz: 'America/Denver' },
  };
  const c = cities[req.query.city] || cities['NY'];
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&daily=temperature_2m_max&temperature_unit=fahrenheit&forecast_days=3&timezone=${encodeURIComponent(c.tz)}`;
    const r = await fetch(url);
    const d = await r.json();
    return res.status(200).json({
      today:    Math.round(d.daily?.temperature_2m_max?.[0] || 0),
      tomorrow: Math.round(d.daily?.temperature_2m_max?.[1] || 0),
      dayAfter: Math.round(d.daily?.temperature_2m_max?.[2] || 0),
      dates:    d.daily?.time || [],
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
