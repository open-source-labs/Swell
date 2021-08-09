const express = require('express');
const WebSocketServer = require('ws').Server;

const PORT_NUMBER = 9000;

// WebSocket server timeout: 5 minutes
const CONNECTION_TIMEOUT = 5 * 60 * 1000000;

// Used for managing the text chat user list.

let connectionArray = [];
let nextID = Date.now();

// Output logging information to console

function log(text) {
  const time = new Date();
  console.log('[' + time.toLocaleTimeString() + '] ' + text);
}

// Create the HTTP server.

const app = express();
const router = express.Router();

app.use('/', router);
app.use(express.static('views'));
app.use(express.static('public'));

log('HTTP server configured');

const httpServer = app.listen(PORT_NUMBER, () => {
  log(`Static web server now listening on PORT ${PORT_NUMBER}`);
});

// Create the WebSocket server.

const wssOptions = {
  server: httpServer,
  timeout: CONNECTION_TIMEOUT,
};

const wss = new WebSocketServer(wssOptions);

wss.on('connection', (ws) => {
  log('Incoming connection...');

  connectionArray.push(ws);
  ws.clientID = nextID;
  nextID++;

  ws.on('close', (reason, description) => {
    // First, remove the connection from the list of connections.
    connectionArray = connectionArray.filter((el, idx, ar) => {
      return el.connected;
    });

    // Build and output log output for close information.
    let logMessage = 'Connection closed: ' + ws.remoteAddress + ' (' + reason;
    if (description !== null && description.length !== 0) {
      logMessage += ': ' + description;
    }
    logMessage += ')';
    log(logMessage);
  });
});
