const MODEL = 'llama-3.3-70b-versatile';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const messages = req.body && req.body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 10) {
    return res.status(400).json({ error: 'Invalid messages.' });
  }
  for (const m of messages) {
    if (typeof m.content !== 'string' || m.content.length > 4000) {
      return res.status(400).json({ error: 'Invalid message content.' });
    }
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: 'json_object' },
        stream: false
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
