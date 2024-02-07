const express = require('express');
const cors = require('cors');
const { runPupWithUrl, cleanUp } = require('./src/gander.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', async (req, res) => {
  const body = req.body;

  if (!req.body) {
    return res.json({
      body: JSON.stringify({message: "Sorry, you have given us nothing ... no access for you."}),
      statusCode: 405,
    });
  }

  const {url, content} = body;
  if (!url && !content) {
    if (!req.body) {
      return res.json({
        body: JSON.stringify({message: "Sorry, you have given us nothing ... no access for you."}),
        statusCode: 405,
      });
    }
  }

  const tUrl = url.trim();
  const pdf = await runPupWithUrl(tUrl);

  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);

  await cleanUp();
});

app.listen(8080, () => {
  console.log('-> Server is running on port 8080');
});