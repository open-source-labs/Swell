const express = require('express');
const SSE = require('express-sse');

const app = express();
const PORT = 3000;
const sse = new SSE(["array", "containing", "initial", "content"], { isSerialized: false, initialEvent: 'Swell Test' });

let numReqs = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const go = () => {
  sse.send('one');
  sse.send('two', 'twoName');
  sse.send('three', 'threeName', 'threeID');
  sse.updateInit(["array", "containing", "new", "content", ++numReqs]);
  sse.serialize(["array", "to", "be", "sent", "as", "serialized", "events"]);
}

const executeGo = (req, res, next) => {
  console.log('RECEIVED GET REQUEST');
  setTimeout(go, 5000);
  return next();
}

app.get('/', executeGo, sse.init);


app.listen(PORT, () => {
  console.log(`HTTP Server listening on port: ${PORT}`);
});