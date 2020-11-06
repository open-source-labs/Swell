const express = require('express');
const SSE = require('express-sse');

const app = express();
const PORT = 3000;

const sse = new SSE(['first message']);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const timeInterval = 3000;

const go = () => {
  if (sse.listenerCount('data') < 1) {
    console.log('connection closed by client');
    return; 
  }

  console.log(`the time is: ${Date.now()}`);
  sse.send(`the time is: ${Date.now()}`);
  setTimeout(go, timeInterval);
}

const executeGo = (req, res, next) => {
  
  if (req.headers.accept === 'text/event-stream') {
    setTimeout(go, timeInterval);
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

app.get('/', executeGo, sse.init);


app.listen(PORT, () => {
  console.log(`HTTP Server listening on port: ${PORT}`);
});


// const sse = new SSE(["array", "containing", "initial", "content"], { isSerialized: false, initialEvent: 'Swell Test' });
// sse.updateInit(["array", "containing", "new", "content", ++numReqs]);