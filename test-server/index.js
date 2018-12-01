const fs = require('fs');
const http = require('http');

let connectionCounter = 1;

http
  .createServer((request, response) => {
    if (request.url === '/') {
      response.end();
    }
    else if (request.url === '/events') {
      const thisConnection = connectionCounter++;
      let thisEvent = 1;

      console.log(
        `Client connected to event stream (connection #${
          thisConnection
        }, Last-Event-Id: ${
          request.headers['last-event-id']
        })`,
      );
      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache', // let intermediaries know to NOT cache anything
      });

      const ticker = setInterval(() => {
        response.write('event: my-custom-event\n');
        response.write(`id: ${thisConnection * 1000 + thisEvent}\n`);
        response.write(
          `data: Server says hi! (event #${
            thisEvent++
          } of connection #${
            thisConnection
          })\n\n`,
        );
      }, 2500);

      request.on('close', () => {
        console.log(`Client disconnected from event stream (connection #${thisConnection})`);
        response.end();
        clearInterval(ticker);
      });
    }
    else {
      response.writeHead(404);
      response.end();
    }
  })
  .listen(8888);
