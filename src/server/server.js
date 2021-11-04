const path = require('path');
const express = require('express');

const app = express();
// const app = express(),
//   DIST_DIR = __dirname,
//   HTML_FILE = path.join(DIST_DIR, 'index.html');
const port = 3000;
// const port = process.env.PORT || 8080;
app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get('/styles.css', (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, '../src/styles.css'));
// });

app.get('/test', (req, res) => {
  console.log('i too am a test')
  return res.status(200).json("Hi! I am a test!");
});

app.get('*', (req, res) => {
  console.log('helooooo');
  // res.status(200).sendFile(path.join(__dirname, '../index.js'));
  // res.status(200).sendFile(path.join(__dirname,'../../index-csp.html'))
});

// //inital error handler, needs work
app.use('*', (req,res) => {
  res.status(404).send('Not Found');
});

//Global Handler, needs work
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errObj = {...defaultErr, ...err}
  // const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// need to make this work somehow
module.exports = app.listen(port, () => console.log(`Listening on port ${port}`));

