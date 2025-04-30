// server.js
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

    const response = await fetch('http://unicode.shresthaashusil.com.np/', {
      method: 'POST',
      body: formData,
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Unicode → Preeti Proxy is running.');
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
