const WebSocketServer = require('websocket').server;
const http = require('http');
const PORT = 5001;

const server = http.createServer(function (request, response) {
  console.log(
    `Websocket Test Server: received request for ${
      request.url
    } on ${new Date()}`
  );

  response.writeHead(404);
  response.end();
});
server.listen(PORT, function () {
  console.log(
    `Websocket Test Server: listening on PORT ${PORT} on ${new Date()}`
  );
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      `Websocket Test Server: connection from origin ${
        request.url
      } rejected on ${new Date()}`
    );
    return;
  }
  const connection = request.accept(null, request.origin);
  
  console.log(
    `Websocket Test Server: connection accepted on ${new Date()}`
  );
  connection.on('message', (message) => {
    if (message.type === 'utf8') {

      console.log(
        `Websocket Test Server: received message "${message.utf8Data}"`
      );

      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      console.log(
        `Websocket Test Server: received binary message of ${message.binaryData.length} bytes`
      );
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', (reasonCode, description) => {
    console.log(
      `Websocket Test Server: peer ${connection.remoteAddress} disconnected`
    );
  });
});
