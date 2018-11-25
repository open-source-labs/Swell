const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const WebSocket = require ('ws');


const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

app.listen(80, "0.0.0.0", () => {
    console.log('Express server on 80, 0.0.0.0');
});

app.get('/events', (req, res) => {
    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');

    let id=0;

    setInterval(function() {
        res.write('event: my-custom-event\n');
        res.write('id: ' + id++ + '\n');
        res.write(`data: Your headers: ${JSON.stringify(req.headers)}\n`);
        res.write('\n\n')
    }, 2000);
});

app.post('/events', (req, res) => {
    console.log('headers', req.headers);
    console.log("body", req.body);
    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');

    let id=0;

    setInterval(function() {
        res.write('event: my-custom-event\n');
        res.write('id: ' + id++ + '\n');
        res.write(`data: Your headers: ${JSON.stringify(req.headers)}\n`);
        res.write(`data: Your body: ${JSON.stringify(req.body)}\n`);
        res.write('\n\n')
    }, 2500);
});


/*
WEB SOCKET
*/

const wss = new WebSocket.Server({ 
    port: 5000,
});

function heartbeat () {
    this.isAlive = true;
}

wss.on('connection',  (wsClient) => {
    wsClient.send('You are connected to WS.');
    wsClient.isAlive = true;
    wsClient.on('pong', heartbeat);

    wsClient.on('message', (message) => {
        console.log ('received message');
        
        wss.clients.forEach(client => {
            client.send('Echo: ' + message);
        })
    })
});

//broadcast constantly
// setInterval(() => {
//     wss.clients.forEach(client => {
//         client.send("Hi from server.");
//     })
// }, 2000)

//ping
setInterval(() => {
    wss.clients.forEach(client => {
        if(client.isAlive === false) {
            return client.terminate();
        }

        client.isAlive = false;
        client.ping(() => {});
    })
}, 10000)



/* HTTP 2 */

const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(__dirname, './', './localhost-privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, './', './localhost-cert.pem'))
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }

  let id=0;

  let receivedData = "";

  stream.respond({
    'content-type': 'text/event-stream',
    'cache-control' : 'no-cache',
    ':status': 200
  });

  setInterval(() => {
    stream.write('event: my-custom-event\n');
    stream.write('id: ' + id++ + '\n');
    stream.write('data : Your headers... ' + JSON.stringify(headers) + '\n');
    stream.write('data : Your body... ' + receivedData + '\n');
  }, 2000)


  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    console.log('chunk', chunk);
    receivedData += chunk;
  })
});

server.listen(8443, () => {
  console.log('listening on 8443');
});




module.exports = app;
