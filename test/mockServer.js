const express = require('express');
const bookController = require('./mockController');

const app = express();

const PORT = 3000;

app.get('/', bookController.getAll, (req, res) => 
	res.status(200).json(res.locals.books)
);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
