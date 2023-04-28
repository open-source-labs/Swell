const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = 3004;

let mockDB = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/clear', (req, res) => {
  mockDB = [];
  res.sendStatus(200);
});

// selectively enable cors to facilitate E2E testing
app.get('/book', cors(), (req, res) => res.status(200).json(mockDB));

app.post('/book', (req, res) => {
  const { title, author, pages } = req.body;
  const book = { title, author, pages };
  mockDB.push(book);
  res.status(200).json(book);
});

app.put('/book/:title', (req, res) => {
  const { title } = req.params;
  const { author, pages } = req.body;
  let index;
  mockDB.forEach((book, i) => {
    if ((book.title = title)) {
      book.title = title;
      book.author = author;
      book.pages = pages;
      index = i;
    }
  });
  res.status(200).json(mockDB[index]);
});

app.patch('/book/:title', (req, res) => {
  const { title } = req.params;
  const { author } = req.body;
  let index;
  mockDB.forEach((book, i) => {
    if ((book.title = title)) {
      book.title = title;
      book.author = author;
      index = i;
    }
  });
  res.status(200).json(mockDB[index]);
});

app.delete('/book/:title', (req, res) => {
  let targetBook;
  const { title } = req.params;
  mockDB.forEach((book, i) => {
    if ((book.title = title)) {
      targetBook = book;
      mockDB = mockDB.slice(0, i).concat(mockDB.slice(i + 1));
      index = i;
    }
  });
  res.status(200).json(targetBook);
});


const httpApp = app.listen(PORT, () => {
  console.log(`HTTP Server listening on port: ${PORT}`);
});

module.exports = httpApp;
