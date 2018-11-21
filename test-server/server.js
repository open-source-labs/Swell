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

module.exports = app;
