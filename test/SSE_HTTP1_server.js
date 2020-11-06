const express = require('express');
const SSE = require('express-sse');

const app = express();
const PORT = 3000;

const sse = new SSE(['first message']);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const timeInterval = 3000;

const sendStream = () => {
  // if listeners are gone, connection is closed
  if (sse.listenerCount('data') < 1) {
    console.log('connection closed by client');
    return; 
  }

  // console.log(`the time is: ${Date.now()}`);
  sse.send(`the time is: ${Date.now()}`);
  setTimeout(sendStream, timeInterval);
}

const dispatchStreamOrHeaders = (req, res, next) => {
  if (req.headers.accept === 'text/event-stream') {
    setTimeout(sendStream, timeInterval);
    return next();
  }

  res.set({
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  res.status(201);
  return res.send();
}

app.get('/', dispatchStreamOrHeaders, sse.init);

app.listen(PORT, () => {
  console.log(`HTTP Server listening on port: ${PORT}`);
});