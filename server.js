const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/convert', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const formData = new URLSearchParams();
    formData.append('userInput', text);
    formData.append('output', 'gt5DkfnL');

    // Fixed domain name - removed the extra 'a' in "shrestha"
    const response = await fetch('http://unicode.shresthasushil.com.np/', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });

    const html = await response.text();
    const dom = new JSDOM(html);
    const textarea = dom.window.document.querySelector('textarea.out.preeti');

    if (textarea) {
      res.json({ preeti: textarea.textContent });
    } else {
      res.status(500).json({ error: 'Conversion failed' });
    }
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Unicode → Preeti Proxy is running.');
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
