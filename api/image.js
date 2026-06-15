export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const q = (req.query && req.query.q) || '';
  if (typeof q !== 'string' || !q.trim() || q.length > 100) {
    return res.status(400).json({ error: 'Invalid query.' });
  }
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Image service not configured.' });
  }
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q + ' food dish')}&per_page=1&orientation=landscape`;
    const response = await fetch(url, { headers: { Authorization: key } });
    const data = await response.json();
    const photo = data.photos && data.photos[0];
    const image = photo ? photo.src.medium : null;
    // cache at the edge — recipe images rarely change
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).json({ image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
