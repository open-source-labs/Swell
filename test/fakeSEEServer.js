const http = require('http');

http.createServer((request, response) => {
  // these headers tell our 'browser' to keep the connection open
  response.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });
  
  sendSSEs(response); 
  

}).listen(5001, () => console.log('SSE Server listening on port 5001'));

// this function sends messages every 3 seconds 
const sendSSEs = (response, id = 0, timeout) => {
  response.write(
    `id: ${id}\ndata: This is event ${id}\n\n`
  );
  id++; 
  console.log('just sent something else! ')

  if (id < 6) {
    timeout = setTimeout(() => {
      sendSSEs(response, id, timeout);
    }, 3000)
  };
} 