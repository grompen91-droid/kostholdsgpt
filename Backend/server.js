import { Ollama } from 'ollama';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const ollama = new Ollama({ host: 'http://localhost:11434' });

app.post('/api/chat', async (req, res) => {
  try {
    const response = await ollama.chat({
      model: req.body.model || 'llama2',
      messages: req.body.messages,
      stream: false
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});