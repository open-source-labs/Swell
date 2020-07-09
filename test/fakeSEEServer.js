const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });
  let id = 1;
  // Send event every 3 seconds or so forever...
  setInterval(() => {
    console.log('sending')
    response.write(
      `id: ${id}\ndata: This is event ${id}\n\n`
    );
    response.write('\n\n');
    id++;
  }, 6000);
}).listen(5001, () => console.log('server listening on port 5001'));